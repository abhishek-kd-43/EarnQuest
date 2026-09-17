import { NextResponse } from "next/server";
import { dailyTasksService } from "@/services/daily-tasks.service";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const target = parseInt(searchParams.get("target") || "1000", 10);
    const result = await dailyTasksService.syncDailyTasks(target);

    return NextResponse.json({
      success: true,
      message: `Daily tasks synchronized successfully.`,
      target,
      ...result,
      syncedAt: new Date(),
    });
  } catch (err: any) {
    console.error("[Daily Tasks Sync Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
