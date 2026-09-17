import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPaymentProvider } from "@/providers/payment/payment.provider";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const returnUrl = `${protocol}://${host}/earnings`;

    const provider = getPaymentProvider();

    if (!provider.createConnectAccount) {
      return NextResponse.json(
        { error: "Active payment provider does not support automated Connect onboarding" },
        { status: 400 }
      );
    }

    const result = await provider.createConnectAccount(user.id, user.email, returnUrl);

    // Persist the Stripe account ID on the user profile
    await db.userProfile.update({
      where: { userId: user.id },
      data: {
        stripeAccountId: result.accountId,
        stripeAccountStatus: provider.isMock ? "ACTIVE" : "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      onboardingUrl: result.onboardingUrl,
      accountId: result.accountId,
      isMock: provider.isMock,
    });
  } catch (err: any) {
    console.error("[Connect Onboarding Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
