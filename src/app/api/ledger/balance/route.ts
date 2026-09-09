import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { ledgerService } from "@/services/ledger.service";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const balances = await ledgerService.getUserBalance(user.id);
    return NextResponse.json(balances);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
