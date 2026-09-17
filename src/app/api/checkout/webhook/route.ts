import { NextResponse } from "next/server";
import Stripe from "stripe";
import { ledgerService } from "@/services/ledger.service";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured in this environment" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-11-20.acacia" as any,
  });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // If no webhook secret configured in dev, parse event directly
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`[Webhook Signature Verification Failed] ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const itemTitle = session.metadata?.itemTitle || "Platform Deliverable";
    const amountInCents = session.amount_total || parseInt(session.metadata?.amountInCents || "0", 10);
    const currency = (session.currency || "USD").toUpperCase();

    if (userId && amountInCents > 0) {
      try {
        await ledgerService.recordPlatformSale({
          userId,
          transactionId: session.id,
          grossAmountInCents: amountInCents,
          currency,
          itemTitle,
        });
        console.log(`[Ledger] Recorded platform sale: ${session.id} for user ${userId}`);
      } catch (err: any) {
        console.error(`[Ledger Error] Failed to record platform sale: ${err.message}`);
        return NextResponse.json({ error: "Failed to record sale" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
