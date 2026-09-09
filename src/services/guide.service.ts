import { db } from "@/lib/db";
import { MockAIProvider } from "@/providers/ai/mock-ai.provider";
import { GeminiAIProvider } from "@/providers/ai/gemini-ai.provider";
import { PromptContext } from "@/providers/ai/ai.provider";

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
    let userApiKey: string | null = null;

    // 1. Fetch user hardware profile and API keys
    const user = await db.user.findUnique({
      where: { id: params.userId },
      include: { hardwareProfile: true, profile: true },
    });
    if (user?.hardwareProfile) {
      hardwareTier = user.hardwareProfile.tier;
    }
    if (user?.profile?.apiKeyGemini) {
      userApiKey = user.profile.apiKeyGemini;
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

    // Determine provider: use Live Gemini if user key or server env key exists
    const effectiveKey = userApiKey || process.env.GEMINI_API_KEY;
    const provider = effectiveKey
      ? new GeminiAIProvider(effectiveKey)
      : new MockAIProvider();

    const reply = await provider.generateGuidance(params.userMessage, context);

    return {
      reply,
      isLiveAI: !!effectiveKey,
      engineName: provider.name,
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

