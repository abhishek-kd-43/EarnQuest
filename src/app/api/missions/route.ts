import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const hardwareTier = searchParams.get("hardwareTier");

    const where: any = { isPublished: true };
    if (category && category !== "All") where.category = category;
    if (difficulty && difficulty !== "All") where.difficulty = difficulty;
    if (hardwareTier && hardwareTier !== "All") where.hardwareTier = hardwareTier;

    const user = await getCurrentUser();

    const missions = await db.mission.findMany({
      where,
      include: {
        tools: { include: { tool: true } },
        steps: { select: { id: true, stepNumber: true, title: true } },
        userMissions: user
          ? {
              where: { userId: user.id },
              select: { status: true, currentStep: true },
            }
          : false,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ missions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
