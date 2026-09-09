import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const freePlanType = searchParams.get("freePlanType");
    const search = searchParams.get("search");

    const where: any = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (freePlanType && freePlanType !== "All") {
      where.freePlanType = freePlanType;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const tools = await db.aITool.findMany({
      where,
      include: { sources: true },
      orderBy: { confidenceScore: "desc" },
    });

    return NextResponse.json({ tools });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
