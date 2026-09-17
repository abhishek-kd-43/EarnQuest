import { calculateRevenueSplit, RevenueSplit } from "@/lib/currency";
import { MockPaymentProvider } from "./mock-payment.provider";
import { StripePaymentProvider } from "./stripe-payment.provider";

export interface CreateCheckoutParams {
  userId: string;
  itemTitle: string;
  amountInCents: number;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  amountInCents: number;
  currency: string;
  split: RevenueSplit;
}

export interface ConnectAccountResult {
  accountId: string;
  onboardingUrl: string;
}

export interface PayoutTransferResult {
  transferId: string;
  amountInCents: number;
  currency: string;
  destinationAccountId: string;
  status: string;
}

export interface PaymentProvider {
  name: string;
  isMock: boolean;
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutSessionResult>;
  capturePayment(transactionId: string): Promise<{ success: boolean; transactionId: string }>;
  calculateFee(grossAmountInCents: number): RevenueSplit;
  createConnectAccount?(
    userId: string,
    email: string,
    returnUrl: string
  ): Promise<ConnectAccountResult>;
  createPayoutTransfer?(params: {
    destinationAccountId: string;
    amountInCents: number;
    currency?: string;
    description?: string;
  }): Promise<PayoutTransferResult>;
}

/**
 * Factory to retrieve the active PaymentProvider.
 * If STRIPE_SECRET_KEY is configured in environment, returns production StripePaymentProvider.
 * Otherwise falls back to MockPaymentProvider.
 */
export function getPaymentProvider(): PaymentProvider {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (stripeSecretKey && stripeSecretKey.trim().length > 0) {
    return new StripePaymentProvider(stripeSecretKey.trim());
  }
  return new MockPaymentProvider();
}
