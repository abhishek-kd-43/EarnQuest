import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { guideService } from "@/services/guide.service";

const chatSchema = z.object({
  userMessage: z.string().min(1, "Message cannot be empty"),
  missionId: z.string().optional(),
  stepNumber: z.number().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = chatSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const res = await guideService.chatWithGuide({
      userId: user.id,
      missionId: result.data.missionId,
      stepNumber: result.data.stepNumber,
      userMessage: result.data.userMessage,
    });

    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
