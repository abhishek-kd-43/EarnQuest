import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseToCents } from "@/lib/currency";

const monetizeSchema = z.object({
  price: z.string().min(1, "Price is required"),
  isForSale: z.boolean().default(true),
  liveUrl: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await db.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = monetizeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const priceInCents = parseToCents(result.data.price);
    if (priceInCents <= 0) {
      return NextResponse.json({ error: "Price must be greater than $0.00" }, { status: 400 });
    }

    const updated = await db.project.update({
      where: { id: params.id },
      data: {
        priceInCents,
        isForSale: result.data.isForSale,
        liveUrl: result.data.liveUrl || project.liveUrl,
        status: "MONETIZED",
      },
    });

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const checkoutPayUrl = `${protocol}://${host}/checkout/pay?projectId=${project.id}`;

    return NextResponse.json({
      success: true,
      project: updated,
      checkoutUrl: checkoutPayUrl,
    });
  } catch (err: any) {
    console.error("[Project Monetize Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
