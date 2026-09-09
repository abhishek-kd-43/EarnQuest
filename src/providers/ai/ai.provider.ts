export interface PromptContext {
  userId?: string;
  hardwareTier?: string; // TIER_1_LITE, TIER_2_STANDARD, TIER_3_POWER
  missionTitle?: string;
  stepNumber?: number;
  stepTitle?: string;
  stepInstruction?: string;
  toolNames?: string[];
  userGoal?: string;
}

export interface GuideMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProvider {
  name: string;
  generateGuidance(
    userMessage: string,
    context: PromptContext,
    conversationHistory?: GuideMessage[]
  ): Promise<string>;
  suggestPromptTemplate(stepTitle: string, toolName: string): Promise<string>;
}
