import { db } from "@/lib/db";
import { calculateRevenueSplit } from "@/lib/currency";

export class LedgerService {
  /**
   * Records a platform-processed sale with an automated 80/20 revenue split.
   */
  async recordPlatformSale(params: {
    userId: string;
    transactionId: string;
    grossAmountInCents: number;
    currency?: string;
    itemTitle: string;
  }) {
    const currency = params.currency || "USD";
    const split = calculateRevenueSplit(params.grossAmountInCents, 2000); // 20% platform fee

    return db.$transaction(async (tx) => {
      // 1. Gross sale entry
      await tx.ledgerEntry.create({
        data: {
          userId: params.userId,
          transactionId: params.transactionId,
          type: "CREDIT_SALE_GROSS",
          amountInCents: split.grossAmountInCents,
          currency,
          status: "SETTLED",
          notes: `Customer purchase: ${params.itemTitle}`,
        },
      });

      // 2. 20% Platform fee deduction
      await tx.ledgerEntry.create({
        data: {
          userId: params.userId,
          transactionId: params.transactionId,
          type: "DEBIT_PLATFORM_FEE",
          amountInCents: split.platformFeeInCents,
          currency,
          status: "SETTLED",
          notes: `EarnQuest 20% platform fee on ${params.itemTitle}`,
        },
      });

      // 3. 80% Net creator earnings credited
      const userEntry = await tx.ledgerEntry.create({
        data: {
          userId: params.userId,
          transactionId: params.transactionId,
          type: "CREDIT_USER_EARNING",
          amountInCents: split.userShareInCents,
          currency,
          status: "AVAILABLE",
          notes: `80% net creator allocation for ${params.itemTitle}`,
        },
      });

      // 4. Award XP for generating revenue (1 XP per $1 earned)
      const earnedDollars = Math.floor(split.userShareInCents / 100);
      if (earnedDollars > 0) {
        await tx.userProfile.update({
          where: { userId: params.userId },
          data: {
            xp: { increment: earnedDollars * 5 },
          },
        });
      }

      return { split, userEntry };
    });
  }

  /**
   * Retrieves aggregated ledger metrics for a user.
   */
  async getUserBalance(userId: string) {
    const entries = await db.ledgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let availableInCents = 0;
    let pendingInCents = 0;
    let totalEarnedInCents = 0;

    for (const entry of entries) {
      if (entry.type === "CREDIT_USER_EARNING") {
        totalEarnedInCents += entry.amountInCents;
        if (entry.status === "AVAILABLE" || entry.status === "SETTLED") {
          availableInCents += entry.amountInCents;
        } else if (entry.status === "PENDING") {
          pendingInCents += entry.amountInCents;
        }
      } else if (entry.type === "DEBIT_PAYOUT") {
        availableInCents -= entry.amountInCents;
      }
    }

    // Also fetch verified external earnings
    const verifiedExternal = await db.earningVerification.findMany({
      where: { userId, status: "VERIFIED" },
    });

    const externalTotalInCents = verifiedExternal.reduce(
      (sum, item) => sum + item.amountInCents,
      0
    );

    return {
      availableInCents,
      pendingInCents,
      platformTotalInCents: totalEarnedInCents,
      externalVerifiedInCents: externalTotalInCents,
      combinedLifetimeInCents: totalEarnedInCents + externalTotalInCents,
      entries,
    };
  }

  /**
   * Submits an external earnings claim with proof for review.
   */
  async submitExternalEarning(params: {
    userId: string;
    projectId?: string;
    amountInCents: number;
    platformName: string;
    sourceUrl?: string;
    evidenceFileUrl?: string;
  }) {
    if (params.amountInCents <= 0) {
      throw new Error("Earning amount must be greater than zero");
    }

    return db.earningVerification.create({
      data: {
        userId: params.userId,
        projectId: params.projectId,
        amountInCents: params.amountInCents,
        platformName: params.platformName,
        sourceUrl: params.sourceUrl,
        evidenceFileUrl: params.evidenceFileUrl,
        status: "SUBMITTED",
      },
    });
  }

  /**
   * Reviews and verifies/rejects an external earning submission.
   */
  async reviewExternalEarning(params: {
    verificationId: string;
    reviewerId: string;
    status: "VERIFIED" | "REJECTED";
    notes?: string;
  }) {
    const record = await db.earningVerification.findUnique({
      where: { id: params.verificationId },
    });

    if (!record) throw new Error("Earning verification not found");

    const updated = await db.earningVerification.update({
      where: { id: params.verificationId },
      data: {
        status: params.status,
        reviewerNotes: params.notes,
        reviewedAt: new Date(),
      },
    });

    // If verified, award XP to the user
    if (params.status === "VERIFIED") {
      const xpReward = Math.min(Math.floor(record.amountInCents / 100) * 10, 1000);
      await db.userProfile.update({
        where: { userId: record.userId },
        data: {
          xp: { increment: Math.max(xpReward, 100) },
        },
      });
    }

    return updated;
  }

  /**
   * Requests a payout from available balance with integer minor math verification.
   */
  async requestPayout(params: {
    userId: string;
    amountInCents: number;
    method?: string;
    destinationId?: string;
    notes?: string;
  }) {
    if (params.amountInCents <= 0) {
      throw new Error("Payout amount must be greater than zero");
    }

    return db.$transaction(async (tx) => {
      // 1. Check current available balance
      const entries = await tx.ledgerEntry.findMany({
        where: { userId: params.userId },
      });

      let availableInCents = 0;
      for (const entry of entries) {
        if (
          entry.type === "CREDIT_USER_EARNING" &&
          (entry.status === "AVAILABLE" || entry.status === "SETTLED")
        ) {
          availableInCents += entry.amountInCents;
        } else if (entry.type === "DEBIT_PAYOUT") {
          availableInCents -= entry.amountInCents;
        }
      }

      if (params.amountInCents > availableInCents) {
        throw new Error(
          `Insufficient available balance. Requested: ${params.amountInCents} cents, Available: ${availableInCents} cents`
        );
      }

      // 2. Create PayoutRequest record
      const payout = await tx.payoutRequest.create({
        data: {
          userId: params.userId,
          amountInCents: params.amountInCents,
          method: params.method || "STRIPE_CONNECT",
          destinationId: params.destinationId,
          status: "PENDING",
          notes: params.notes,
        },
      });

      // 3. Create DEBIT_PAYOUT ledger entry
      const ledgerEntry = await tx.ledgerEntry.create({
        data: {
          userId: params.userId,
          transactionId: payout.id,
          type: "DEBIT_PAYOUT",
          amountInCents: params.amountInCents,
          currency: "USD",
          status: "SETTLED",
          notes: `Payout request #${payout.id.substring(0, 8)} (${params.method || "Stripe Connect"})`,
        },
      });

      return {
        payout,
        ledgerEntry,
        remainingBalanceInCents: availableInCents - params.amountInCents,
      };
    });
  }

  /**
   * Retrieves payout requests for a user.
   */
  async getPayoutHistory(userId: string) {
    return db.payoutRequest.findMany({
      where: { userId },
      orderBy: { requestedAt: "desc" },
    });
  }
}

export const ledgerService = new LedgerService();
