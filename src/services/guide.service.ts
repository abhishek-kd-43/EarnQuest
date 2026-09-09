import { db } from "@/lib/db";
import { MockAIProvider } from "@/providers/ai/mock-ai.provider";
import { PromptContext } from "@/providers/ai/ai.provider";

const aiProvider = new MockAIProvider();

export class GuideService {
  async chatWithGuide(params: {
    userId: string;
    missionId?: string;
    stepNumber?: number;
    userMessage: string;
  }) {
    let hardwareTier = "TIER_1_LITE";
    let missionTitle = "General Opportunity Discovery";
    let stepTitle = "Exploring";
    let stepInstruction = "";
    let toolNames: string[] = [];

    // 1. Fetch user hardware profile
    const user = await db.user.findUnique({
      where: { id: params.userId },
      include: { hardwareProfile: true },
    });
    if (user?.hardwareProfile) {
      hardwareTier = user.hardwareProfile.tier;
    }

    // 2. If mission provided, enrich context with active step and tool specs
    if (params.missionId) {
      const mission = await db.mission.findUnique({
        where: { id: params.missionId },
        include: {
          steps: { orderBy: { stepNumber: "asc" } },
          tools: { include: { tool: true } },
        },
      });

      if (mission) {
        missionTitle = mission.title;
        toolNames = mission.tools.map((t) => t.tool.name);

        const targetStepNum = params.stepNumber || 1;
        const step = mission.steps.find((s) => s.stepNumber === targetStepNum);
        if (step) {
          stepTitle = step.title;
          stepInstruction = step.instruction;
        }
      }
    }

    const context: PromptContext = {
      userId: params.userId,
      hardwareTier,
      missionTitle,
      stepNumber: params.stepNumber || 1,
      stepTitle,
      stepInstruction,
      toolNames,
    };

    const reply = await aiProvider.generateGuidance(params.userMessage, context);

    return {
      reply,
      contextUsed: {
        hardwareTier,
        missionTitle,
        stepNumber: params.stepNumber || 1,
        stepTitle,
      },
    };
  }
}

export const guideService = new GuideService();
