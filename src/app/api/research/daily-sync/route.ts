import { NextResponse } from "next/server";
import { researchService } from "@/services/research.service";

export async function POST(req: Request) {
  try {
    const job = await researchService.runDailyScan(
      "Daily Autonomous Sync: Newly launched free AI tools, free APIs, and remote client gigs"
    );

    const stats = await researchService.getLatestFeed(1);

    return NextResponse.json({
      success: true,
      message: `Daily autonomous research sweep executed successfully. Ingested ${job.itemsFound} fresh items.`,
      jobId: job.id,
      itemsIngested: job.itemsFound,
      totalToolsCataloged: stats.totalTools,
      totalOpportunitiesCataloged: stats.totalOpportunities,
      totalMissionsAvailable: stats.totalMissions,
      syncedAt: new Date(),
    });
  } catch (err: any) {
    console.error("[Daily Sync Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
