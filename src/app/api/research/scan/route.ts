import { NextResponse } from "next/server";
import { researchService } from "@/services/research.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const feed = await researchService.getLatestFeed(limit);
    return NextResponse.json(feed);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let query: string | undefined;
    try {
      const body = await req.json();
      query = body?.query;
    } catch {
      // Body is optional
    }

    const job = await researchService.runDailyScan(query);
    return NextResponse.json({
      success: true,
      message: `Autonomous research scan completed. Found ${job.itemsFound} verified opportunities.`,
      job,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
