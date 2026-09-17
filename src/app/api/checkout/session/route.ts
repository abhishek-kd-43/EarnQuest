import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/providers/payment/payment.provider";

const sessionSchema = z.object({
  projectId: z.string().optional(),
  itemTitle: z.string().min(1, "Item title is required").optional(),
  amountInCents: z.number().int().positive("Amount must be a positive integer").optional(),
  currency: z.string().default("USD"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = sessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    let userId = "";
    let itemTitle = result.data.itemTitle || "EarnQuest Deliverable";
    let amountInCents = result.data.amountInCents || 0;

    // If projectId is provided, look up the creator and product details
    if (result.data.projectId) {
      const project = await db.project.findUnique({
        where: { id: result.data.projectId },
        include: { user: true },
      });

      if (!project) {
        return NextResponse.json({ error: "Project deliverable not found" }, { status: 404 });
      }

      userId = project.userId;
      itemTitle = project.title;
      amountInCents = project.priceInCents > 0 ? project.priceInCents : amountInCents;
    }

    if (amountInCents <= 0) {
      return NextResponse.json(
        { error: "Product price must be greater than $0.00" },
        { status: 400 }
      );
    }

    // Default to admin/platform recipient if no specific creator ID found
    if (!userId) {
      const admin = await db.user.findFirst({ where: { role: "ADMIN" } });
      userId = admin ? admin.id : "platform-creator";
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&title=${encodeURIComponent(
      itemTitle
    )}&amount=${amountInCents}`;
    const cancelUrl = `${baseUrl}/checkout/pay?canceled=true`;

    const provider = getPaymentProvider();
    const sessionResult = await provider.createCheckout({
      userId,
      itemTitle,
      amountInCents,
      currency: result.data.currency,
      successUrl,
      cancelUrl,
      metadata: {
        projectId: result.data.projectId || "",
      },
    });

    return NextResponse.json({
      success: true,
      provider: provider.name,
      isMock: provider.isMock,
      session: sessionResult,
    });
  } catch (err: any) {
    console.error("[Checkout Session Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
