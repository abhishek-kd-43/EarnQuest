import { NextResponse } from "next/server";
import { dailyTasksService } from "@/services/daily-tasks.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const category = searchParams.get("category") || undefined;
    const difficulty = searchParams.get("difficulty") || undefined;
    const sourcePlatform = searchParams.get("sourcePlatform") || undefined;
    const maxMinutes = searchParams.get("maxMinutes") ? parseInt(searchParams.get("maxMinutes")!, 10) : undefined;
    const minPayCents = searchParams.get("minPayCents") ? parseInt(searchParams.get("minPayCents")!, 10) : undefined;
    const maxPayCents = searchParams.get("maxPayCents") ? parseInt(searchParams.get("maxPayCents")!, 10) : undefined;
    const search = searchParams.get("search") || undefined;

    const result = await dailyTasksService.getDailyTasks({
      page,
      limit,
      category,
      difficulty,
      sourcePlatform,
      maxMinutes,
      minPayCents,
      maxPayCents,
      search,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[Tasks API Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
