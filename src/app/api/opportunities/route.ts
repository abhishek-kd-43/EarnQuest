import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (difficulty && difficulty !== "All") {
      where.difficulty = difficulty;
    }

    const opportunities = await db.opportunity.findMany({
      where,
      include: {
        scores: true,
        sources: true,
        missions: {
          select: { id: true, title: true, slug: true, difficulty: true },
        },
      },
      orderBy: { opportunityScore: "desc" },
    });

    return NextResponse.json({ opportunities });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
