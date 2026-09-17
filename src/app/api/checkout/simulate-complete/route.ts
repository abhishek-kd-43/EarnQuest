import { NextResponse } from "next/server";
import { z } from "zod";
import { ledgerService } from "@/services/ledger.service";

const simulateSchema = z.object({
  sessionId: z.string().min(1),
  userId: z.string().min(1),
  itemTitle: z.string().min(1),
  amountInCents: z.number().int().positive(),
  currency: z.string().default("USD"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = simulateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const transactionId = `tx_sim_${result.data.sessionId.substring(0, 16)}`;

    // Record the platform-processed sale with automated 80/20 revenue split
    const saleResult = await ledgerService.recordPlatformSale({
      userId: result.data.userId,
      transactionId,
      grossAmountInCents: result.data.amountInCents,
      currency: result.data.currency,
      itemTitle: result.data.itemTitle,
    });

    return NextResponse.json({
      success: true,
      transactionId,
      split: saleResult.split,
    });
  } catch (err: any) {
    console.error("[Simulate Complete Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
