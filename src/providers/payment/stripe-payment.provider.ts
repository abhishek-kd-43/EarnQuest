import Stripe from "stripe";
import {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutSessionResult,
  ConnectAccountResult,
  PayoutTransferResult,
} from "./payment.provider";
import { calculateRevenueSplit, RevenueSplit } from "@/lib/currency";

export class StripePaymentProvider implements PaymentProvider {
  name = "StripePaymentProvider";
  isMock = false;
  private stripe: Stripe;

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey, {
      apiVersion: "2024-11-20.acacia" as any,
    });
  }

  calculateFee(grossAmountInCents: number): RevenueSplit {
    return calculateRevenueSplit(grossAmountInCents, 2000); // 20% platform fee
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const split = this.calculateFee(params.amountInCents);
    const currency = (params.currency || "usd").toLowerCase();

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: params.itemTitle,
              description: `EarnQuest Platform Deliverable (Creator ID: ${params.userId})`,
            },
            unit_amount: params.amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: params.userId,
        itemTitle: params.itemTitle,
        amountInCents: params.amountInCents.toString(),
        platformFeeInCents: split.platformFeeInCents.toString(),
        userShareInCents: split.userShareInCents.toString(),
        ...params.metadata,
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a valid checkout URL");
    }

    return {
      sessionId: session.id,
      checkoutUrl: session.url,
      amountInCents: params.amountInCents,
      currency: currency.toUpperCase(),
      split,
    };
  }

  async capturePayment(sessionId: string): Promise<{ success: boolean; transactionId: string }> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      success: session.payment_status === "paid",
      transactionId: session.id,
    };
  }

  async createConnectAccount(
    userId: string,
    email: string,
    returnUrl: string
  ): Promise<ConnectAccountResult> {
    const account = await this.stripe.accounts.create({
      type: "express",
      email,
      capabilities: {
        transfers: { requested: true },
      },
      metadata: { userId },
    });

    const accountLink = await this.stripe.accountLinks.create({
      account: account.id,
      refresh_url: returnUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  }

  async createPayoutTransfer(params: {
    destinationAccountId: string;
    amountInCents: number;
    currency?: string;
    description?: string;
  }): Promise<PayoutTransferResult> {
    const currency = (params.currency || "usd").toLowerCase();
    const transfer = await this.stripe.transfers.create({
      amount: params.amountInCents,
      currency,
      destination: params.destinationAccountId,
      description: params.description || "EarnQuest Creator Payout",
    });

    return {
      transferId: transfer.id,
      amountInCents: transfer.amount,
      currency: transfer.currency.toUpperCase(),
      destinationAccountId: params.destinationAccountId,
      status: "COMPLETED",
    };
  }
}
