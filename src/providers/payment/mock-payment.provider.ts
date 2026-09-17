import {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutSessionResult,
  ConnectAccountResult,
  PayoutTransferResult,
} from "./payment.provider";
import { calculateRevenueSplit, RevenueSplit } from "@/lib/currency";

export class MockPaymentProvider implements PaymentProvider {
  name = "MockPaymentProvider";
  isMock = true;

  calculateFee(grossAmountInCents: number): RevenueSplit {
    return calculateRevenueSplit(grossAmountInCents, 2000); // 20% platform fee
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
    const split = this.calculateFee(params.amountInCents);
    const sessionId = `mock_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const currency = params.currency || "USD";

    // Encode parameters into simulation URL so the simulation page can settle accurately
    const query = new URLSearchParams({
      session: sessionId,
      amount: params.amountInCents.toString(),
      fee: split.platformFeeInCents.toString(),
      userShare: split.userShareInCents.toString(),
      userId: params.userId,
      itemTitle: params.itemTitle,
      currency,
      successUrl: params.successUrl,
    });

    return {
      sessionId,
      checkoutUrl: `/checkout/simulate?${query.toString()}`,
      amountInCents: params.amountInCents,
      currency,
      split,
    };
  }

  async capturePayment(transactionId: string): Promise<{ success: boolean; transactionId: string }> {
    return {
      success: true,
      transactionId: transactionId.startsWith("tx_") ? transactionId : `tx_${transactionId}`,
    };
  }

  async createConnectAccount(
    userId: string,
    email: string,
    returnUrl: string
  ): Promise<ConnectAccountResult> {
    const accountId = `acct_mock_${Math.random().toString(36).substring(2, 10)}`;
    return {
      accountId,
      onboardingUrl: `${returnUrl}?mockConnectSuccess=true&accountId=${accountId}`,
    };
  }

  async createPayoutTransfer(params: {
    destinationAccountId: string;
    amountInCents: number;
    currency?: string;
    description?: string;
  }): Promise<PayoutTransferResult> {
    const transferId = `tr_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      transferId,
      amountInCents: params.amountInCents,
      currency: params.currency || "USD",
      destinationAccountId: params.destinationAccountId,
      status: "COMPLETED",
    };
  }
}
