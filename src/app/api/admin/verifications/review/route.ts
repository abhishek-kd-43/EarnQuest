import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { ledgerService } from "@/services/ledger.service";

const reviewSchema = z.object({
  verificationId: z.string().min(1),
  status: z.enum(["VERIFIED", "REJECTED"]),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const updated = await ledgerService.reviewExternalEarning({
      verificationId: result.data.verificationId,
      reviewerId: user.id,
      status: result.data.status,
      notes: result.data.notes,
    });

    return NextResponse.json({ success: true, verification: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
