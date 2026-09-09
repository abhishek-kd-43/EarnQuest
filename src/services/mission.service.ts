import { db } from "@/lib/db";
import { MockAIProvider } from "@/providers/ai/mock-ai.provider";

const aiProvider = new MockAIProvider();

export type StepActionType = "NEXT_STEP" | "BACK" | "EXPLAIN" | "I_AM_STUCK" | "SHOW_EXAMPLE";

export class MissionService {
  /**
   * Starts a mission for a user, or returns the existing active run.
   */
  async startMission(userId: string, missionId: string) {
    const existing = await db.userMission.findUnique({
      where: {
        userId_missionId: { userId, missionId },
      },
      include: {
        mission: {
          include: {
            steps: { orderBy: { stepNumber: "asc" } },
            tools: { include: { tool: true } },
          },
        },
        progress: true,
      },
    });

    if (existing) {
      return existing;
    }

    // Create UserMission with progress on Step 1
    const userMission = await db.userMission.create({
      data: {
        userId,
        missionId,
        status: "IN_PROGRESS",
        currentStep: 1,
        progress: {
          create: {
            stepNumber: 1,
            isCompleted: false,
          },
        },
      },
      include: {
        mission: {
          include: {
            steps: { orderBy: { stepNumber: "asc" } },
            tools: { include: { tool: true } },
          },
        },
        progress: true,
      },
    });

    // Also auto-create a corresponding Project workspace entry if none exists
    const existingProject = await db.project.findFirst({
      where: { userId, userMissionId: userMission.id },
    });

    if (!existingProject) {
      await db.project.create({
        data: {
          userId,
          userMissionId: userMission.id,
          title: `${userMission.mission.title} Workspace`,
          description: `Deliverables and notes for ${userMission.mission.title}`,
          status: "IN_PROGRESS",
        },
      });
    }

    return userMission;
  }

  /**
   * Handles interactive Beginner Mode actions on an active mission step.
   */
  async handleStepAction(params: {
    userId: string;
    missionId: string;
    action: StepActionType;
    userNotes?: string;
  }) {
    const userMission = await db.userMission.findUnique({
      where: {
        userId_missionId: { userId: params.userId, missionId: params.missionId },
      },
      include: {
        mission: {
          include: {
            steps: { orderBy: { stepNumber: "asc" } },
            tools: { include: { tool: true } },
          },
        },
        progress: true,
        user: {
          include: {
            profile: true,
            hardwareProfile: true,
          },
        },
      },
    });

    if (!userMission) throw new Error("Mission not found or not started");

    const totalSteps = userMission.mission.steps.length;
    const currentStepObj = userMission.mission.steps.find(
      (s) => s.stepNumber === userMission.currentStep
    );

    const context = {
      userId: params.userId,
      hardwareTier: userMission.user.hardwareProfile?.tier || "TIER_1_LITE",
      missionTitle: userMission.mission.title,
      stepNumber: userMission.currentStep,
      stepTitle: currentStepObj?.title,
      stepInstruction: currentStepObj?.instruction,
      toolNames: userMission.mission.tools.map((t) => t.tool.name),
    };

    switch (params.action) {
      case "NEXT_STEP": {
        // Mark current step as completed in progress
        await db.userMissionProgress.upsert({
          where: {
            userMissionId_stepNumber: {
              userMissionId: userMission.id,
              stepNumber: userMission.currentStep,
            },
          },
          update: {
            isCompleted: true,
            completedAt: new Date(),
            userNotes: params.userNotes,
          },
          create: {
            userMissionId: userMission.id,
            stepNumber: userMission.currentStep,
            isCompleted: true,
            completedAt: new Date(),
            userNotes: params.userNotes,
          },
        });

        // Award 50 XP for step completion
        let earnedXp = 50;
        let isMissionComplete = false;
        let nextStepNum = userMission.currentStep + 1;

        if (userMission.currentStep >= totalSteps) {
          // Mission fully completed!
          isMissionComplete = true;
          earnedXp += 250; // Bonus 250 XP for finishing mission
          nextStepNum = totalSteps;

          await db.userMission.update({
            where: { id: userMission.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
              lastInteractedAt: new Date(),
            },
          });
        } else {
          await db.userMission.update({
            where: { id: userMission.id },
            data: {
              currentStep: nextStepNum,
              lastInteractedAt: new Date(),
            },
          });

          // Ensure progress row exists for new step
          await db.userMissionProgress.upsert({
            where: {
              userMissionId_stepNumber: {
                userMissionId: userMission.id,
                stepNumber: nextStepNum,
              },
            },
            update: {},
            create: {
              userMissionId: userMission.id,
              stepNumber: nextStepNum,
              isCompleted: false,
            },
          });
        }

        // Update User Profile XP and Level
        const newTotalXp = (userMission.user.profile?.xp || 0) + earnedXp;
        const newLevel = Math.floor(newTotalXp / 500) + 1;

        await db.userProfile.update({
          where: { userId: params.userId },
          data: {
            xp: newTotalXp,
            level: newLevel,
            lastActiveAt: new Date(),
          },
        });

        return {
          action: params.action,
          success: true,
          currentStep: nextStepNum,
          isMissionComplete,
          xpAwarded: earnedXp,
          newLevel,
        };
      }

      case "BACK": {
        const prevStepNum = Math.max(1, userMission.currentStep - 1);
        await db.userMission.update({
          where: { id: userMission.id },
          data: { currentStep: prevStepNum, lastInteractedAt: new Date() },
        });
        return { action: params.action, success: true, currentStep: prevStepNum };
      }

      case "EXPLAIN": {
        const message = await aiProvider.generateGuidance(
          "Please explain this step in simple beginner terms.",
          context
        );
        return { action: params.action, success: true, aiMessage: message };
      }

      case "I_AM_STUCK": {
        const message = await aiProvider.generateGuidance(
          "I am stuck on this step. How do I troubleshoot?",
          context
        );
        return { action: params.action, success: true, aiMessage: message };
      }

      case "SHOW_EXAMPLE": {
        const message = await aiProvider.generateGuidance(
          "Can you show me a concrete example or prompt template for this step?",
          context
        );
        return { action: params.action, success: true, aiMessage: message };
      }
    }
  }

  /**
   * Retrieves full details of a mission including all steps, tools, and user progress.
   */
  async getMissionDetails(missionIdOrSlug: string, userId?: string) {
    const mission = await db.mission.findFirst({
      where: {
        OR: [{ id: missionIdOrSlug }, { slug: missionIdOrSlug }],
      },
      include: {
        steps: { orderBy: { stepNumber: "asc" } },
        tools: { include: { tool: true } },
        opportunity: true,
      },
    });

    if (!mission) return null;

    let userMission = null;
    if (userId) {
      userMission = await db.userMission.findUnique({
        where: {
          userId_missionId: { userId, missionId: mission.id },
        },
        include: {
          progress: true,
          projects: true,
        },
      });
    }

    return { mission, userMission };
  }
}

export const missionService = new MissionService();
