import { NextResponse } from "next/server";
import { dailyTasksService } from "@/services/daily-tasks.service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await dailyTasksService.getTaskByIdOrSlug(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (err: any) {
    console.error("[Task Detail API Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const userId = body.userId || "anonymous-user";
    const updated = await dailyTasksService.claimTask(params.id, userId);
    return NextResponse.json({ success: true, task: updated });
  } catch (err: any) {
    console.error("[Task Claim API Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
