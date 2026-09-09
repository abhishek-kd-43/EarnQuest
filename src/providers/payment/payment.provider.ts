import { calculateRevenueSplit, RevenueSplit } from "@/lib/currency";

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

export interface PaymentProvider {
  name: string;
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutSessionResult>;
  capturePayment(transactionId: string): Promise<{ success: boolean; transactionId: string }>;
  calculateFee(grossAmountInCents: number): RevenueSplit;
}
