import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { hardwareService } from "@/services/hardware.service";
import { db } from "@/lib/db";

const hardwareSchema = z.object({
  os: z.string().optional(),
  browser: z.string().optional(),
  cpuCores: z.number().optional(),
  ramGb: z.number().optional(),
  hasGpu: z.boolean().optional(),
  gpuRenderer: z.string().optional(),
  rawUserAgent: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = hardwareSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid hardware payload" }, { status: 400 });
    }

    const profile = await hardwareService.saveProfile(user.id, result.data);

    // Check and unlock "hardware-verified" achievement
    const ach = await db.achievement.findUnique({ where: { slug: "hardware-verified" } });
    if (ach) {
      const existingAch = await db.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId: user.id,
            achievementId: ach.id,
          },
        },
      });

      if (!existingAch) {
        await db.userAchievement.create({
          data: {
            userId: user.id,
            achievementId: ach.id,
          },
        });

        await db.userProfile.update({
          where: { userId: user.id },
          data: {
            xp: { increment: ach.xpReward },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      profile,
      assignedTier: profile.tier,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save hardware profile" }, { status: 500 });
  }
}
