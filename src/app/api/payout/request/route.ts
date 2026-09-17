import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { ledgerService } from "@/services/ledger.service";
import { getPaymentProvider } from "@/providers/payment/payment.provider";
import { db } from "@/lib/db";

const payoutSchema = z.object({
  amountInCents: z.number().int().positive("Amount must be a positive integer in cents"),
  method: z.enum(["STRIPE_CONNECT", "BANK_TRANSFER", "PAYPAL", "MANUAL"]).default("STRIPE_CONNECT"),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = payoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    // Check user profile for Stripe Connect account if method is STRIPE_CONNECT
    const userProfile = await db.userProfile.findUnique({
      where: { userId: user.id },
    });

    const destinationId = userProfile?.stripeAccountId || undefined;

    // Record the payout debit in the financial ledger
    const payoutResult = await ledgerService.requestPayout({
      userId: user.id,
      amountInCents: result.data.amountInCents,
      method: result.data.method,
      destinationId,
      notes: result.data.notes,
    });

    // If Stripe account is connected and provider supports transfers, trigger transfer
    const provider = getPaymentProvider();
    if (
      result.data.method === "STRIPE_CONNECT" &&
      destinationId &&
      provider.createPayoutTransfer
    ) {
      try {
        const transfer = await provider.createPayoutTransfer({
          destinationAccountId: destinationId,
          amountInCents: result.data.amountInCents,
          description: `EarnQuest Payout for ${user.email}`,
        });

        // Update payout status to COMPLETED
        await db.payoutRequest.update({
          where: { id: payoutResult.payout.id },
          data: {
            status: "COMPLETED",
            referenceId: transfer.transferId,
            processedAt: new Date(),
          },
        });
      } catch (transferErr: any) {
        console.error("[Stripe Transfer Error]", transferErr);
        // Leave as PENDING for admin manual review if automated transfer encounters issue
      }
    }

    return NextResponse.json({
      success: true,
      payout: payoutResult.payout,
      remainingBalanceInCents: payoutResult.remainingBalanceInCents,
    });
  } catch (err: any) {
    console.error("[Payout Request Error]", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
