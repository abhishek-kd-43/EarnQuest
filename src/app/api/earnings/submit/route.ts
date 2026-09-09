import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { ledgerService } from "@/services/ledger.service";
import { parseToCents } from "@/lib/currency";

const submitSchema = z.object({
  projectId: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  platformName: z.string().min(1, "Platform name is required"),
  sourceUrl: z.string().optional(),
  evidenceFileUrl: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = submitSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const amountInCents = parseToCents(result.data.amount);
    if (amountInCents <= 0) {
      return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
    }

    const submission = await ledgerService.submitExternalEarning({
      userId: user.id,
      projectId: result.data.projectId,
      amountInCents,
      platformName: result.data.platformName,
      sourceUrl: result.data.sourceUrl,
      evidenceFileUrl: result.data.evidenceFileUrl,
    });

    return NextResponse.json({ success: true, submission });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
