import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const search = searchParams.get("search");
    const beginnerFriendly = searchParams.get("beginnerFriendly");
    const remote = searchParams.get("remote");
    const aiAssistanceLevel = searchParams.get("aiAssistanceLevel");
    const verificationStatus = searchParams.get("verificationStatus");
    const maxHours = searchParams.get("maxHours");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = { status: "ACTIVE" };

    if (category && category !== "All") {
      where.category = category;
    }
    if (difficulty && difficulty !== "All") {
      where.difficulty = difficulty;
    }
    if (beginnerFriendly === "true") {
      where.beginnerFriendly = true;
    }
    if (remote === "true") {
      where.remote = true;
    }
    if (aiAssistanceLevel) {
      where.aiAssistanceLevel = aiAssistanceLevel;
    }
    if (verificationStatus) {
      where.verificationStatus = verificationStatus;
    }
    if (maxHours) {
      where.estimatedHoursMax = { lte: parseInt(maxHours) };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { targetMarket: { contains: search } },
        { customerProblem: { contains: search } },
      ];
    }

    const [opportunities, total] = await Promise.all([
      db.opportunity.findMany({
        where,
        take: limit,
        include: {
          scores: true,
          sources: true,
          missions: {
            select: { id: true, title: true, slug: true, difficulty: true },
            take: 1,
          },
        },
        orderBy: { opportunityScore: "desc" },
      }),
      db.opportunity.count({ where }),
    ]);

    return NextResponse.json({ opportunities, total });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
