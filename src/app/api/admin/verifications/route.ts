import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const verifications = await db.earningVerification.findMany({
      include: {
        user: {
          select: { id: true, email: true, profile: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ verifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
