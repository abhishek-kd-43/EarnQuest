import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { missionService, StepActionType } from "@/services/mission.service";

const actionSchema = z.object({
  missionId: z.string().min(1),
  action: z.enum(["NEXT_STEP", "BACK", "EXPLAIN", "I_AM_STUCK", "SHOW_EXAMPLE"]),
  userNotes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = actionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const response = await missionService.handleStepAction({
      userId: user.id,
      missionId: result.data.missionId,
      action: result.data.action as StepActionType,
      userNotes: result.data.userNotes,
    });

    return NextResponse.json(response);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
