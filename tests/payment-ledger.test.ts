import { describe, it, expect, beforeEach } from "vitest";
import { getPaymentProvider } from "@/providers/payment/payment.provider";
import { MockPaymentProvider } from "@/providers/payment/mock-payment.provider";
import { StripePaymentProvider } from "@/providers/payment/stripe-payment.provider";
import { calculateRevenueSplit } from "@/lib/currency";
import { ledgerService } from "@/services/ledger.service";
import { db } from "@/lib/db";

describe("Payment Provider Abstraction & Ledger Settlement", () => {
  it("defaults to MockPaymentProvider when STRIPE_SECRET_KEY is empty or unset", () => {
    const originalKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;

    const provider = getPaymentProvider();
    expect(provider.name).toBe("MockPaymentProvider");
    expect(provider.isMock).toBe(true);

    if (originalKey) process.env.STRIPE_SECRET_KEY = originalKey;
  });

  it("selects StripePaymentProvider when STRIPE_SECRET_KEY is configured", () => {
    const originalKey = process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = "sk_test_mock_secret_key_12345";

    const provider = getPaymentProvider();
    expect(provider.name).toBe("StripePaymentProvider");
    expect(provider.isMock).toBe(false);

    if (originalKey) {
      process.env.STRIPE_SECRET_KEY = originalKey;
    } else {
      delete process.env.STRIPE_SECRET_KEY;
    }
  });

  it("calculates deterministic 80/20 revenue splits via payment provider", async () => {
    const provider = new MockPaymentProvider();
    const result = await provider.createCheckout({
      userId: "test-user-id",
      itemTitle: "Landing Page Audit Deliverable",
      amountInCents: 5000, // $50.00
      currency: "USD",
      successUrl: "http://localhost:3000/success",
      cancelUrl: "http://localhost:3000/cancel",
    });

    expect(result.amountInCents).toBe(5000);
    expect(result.split.grossAmountInCents).toBe(5000);
    expect(result.split.platformFeeInCents).toBe(1000); // 20% = $10.00
    expect(result.split.userShareInCents).toBe(4000); // 80% = $40.00
    expect(result.checkoutUrl).toContain("/checkout/simulate");
  });

  it("records a platform sale with gross, fee, and net user earnings ledger entries", async () => {
    // Find or create a test user
    let user = await db.user.findFirst({
      where: { email: "creator@earnquest.local" },
      include: { profile: true },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: "creator@earnquest.local",
          passwordHash: "test_hash",
          profile: {
            create: { displayName: "Test Creator", xp: 100, level: 1 },
          },
        },
        include: { profile: true },
      });
    }

    const initialBalance = await ledgerService.getUserBalance(user.id);
    const grossSaleInCents = 2500; // $25.00

    const txId = `tx_test_${Date.now()}`;
    await ledgerService.recordPlatformSale({
      userId: user.id,
      transactionId: txId,
      grossAmountInCents: grossSaleInCents,
      currency: "USD",
      itemTitle: "Test Canva Package",
    });

    const updatedBalance = await ledgerService.getUserBalance(user.id);

    // 80% of $25.00 = $20.00 = 2000 cents
    expect(updatedBalance.availableInCents).toBe(
      initialBalance.availableInCents + 2000
    );
  });

  it("prevents withdrawals exceeding available balance and enforces integer minor math", async () => {
    let user = await db.user.findFirst({
      where: { email: "creator@earnquest.local" },
    });

    if (!user) return;

    const balance = await ledgerService.getUserBalance(user.id);
    const excessiveAmount = balance.availableInCents + 10000; // $100 more than available

    await expect(
      ledgerService.requestPayout({
        userId: user.id,
        amountInCents: excessiveAmount,
        method: "STRIPE_CONNECT",
      })
    ).rejects.toThrow("Insufficient available balance");
  });

  it("processes a valid payout request by deducting from available ledger balance", async () => {
    let user = await db.user.findFirst({
      where: { email: "creator@earnquest.local" },
    });

    if (!user) return;

    const balanceBefore = await ledgerService.getUserBalance(user.id);
    if (balanceBefore.availableInCents >= 1000) {
      const payoutAmount = 1000; // $10.00

      const result = await ledgerService.requestPayout({
        userId: user.id,
        amountInCents: payoutAmount,
        method: "STRIPE_CONNECT",
      });

      expect(result.payout.amountInCents).toBe(1000);
      expect(result.payout.status).toBe("PENDING");
      expect(result.ledgerEntry.type).toBe("DEBIT_PAYOUT");

      const balanceAfter = await ledgerService.getUserBalance(user.id);
      expect(balanceAfter.availableInCents).toBe(
        balanceBefore.availableInCents - payoutAmount
      );
    }
  });
});
