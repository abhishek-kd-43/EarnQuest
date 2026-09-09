import { PaymentProvider, CreateCheckoutParams, CheckoutSessionResult } from "./payment.provider";
import { calculateRevenueSplit, RevenueSplit } from "@/lib/currency";

export class MockPaymentProvider implements PaymentProvider {
  name = "MockPaymentProvider";

  calculateFee(grossAmountInCents: number): RevenueSplit {
    return calculateRevenueSplit(grossAmountInCents, 2000); // 20% platform fee
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const split = this.calculateFee(params.amountInCents);
    const sessionId = `mock_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      sessionId,
      checkoutUrl: `/checkout/simulate?session=${sessionId}&amount=${params.amountInCents}&fee=${split.platformFeeInCents}`,
      amountInCents: params.amountInCents,
      currency: params.currency || "USD",
      split,
    };
  }

  async capturePayment(transactionId: string): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: transactionId.startsWith("tx_") ? transactionId : `tx_${transactionId}`,
    };
  }
}
