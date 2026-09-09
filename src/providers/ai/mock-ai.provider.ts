import { AIProvider, PromptContext, GuideMessage } from "./ai.provider";

export class MockAIProvider implements AIProvider {
  name = "MockAIProvider";

  async generateGuidance(
    userMessage: string,
    context: PromptContext,
    _conversationHistory?: GuideMessage[]
  ): Promise<string> {
    const msg = userMessage.toLowerCase().trim();
    const tier = context.hardwareTier || "TIER_1_LITE";
    const stepNum = context.stepNumber || 1;
    const stepTitle = context.stepTitle || "Current Step";
    const tools = context.toolNames?.join(", ") || "the recommended free tool";

    // 1. "I'm stuck" / troubleshooting
    if (msg.includes("stuck") || msg.includes("error") || msg.includes("doesn't work") || msg.includes("fail") || msg.includes("not working")) {
      let tierAdvice = "";
      if (tier === "TIER_1_LITE") {
        tierAdvice = " Since your computer is running in Lite Mode, make sure to close other browser tabs to free up memory.";
      } else if (tier === "TIER_3_POWER") {
        tierAdvice = " On your Power-tier machine, you have plenty of memory—check that your background runner or GPU drivers are active if applicable.";
      }

      return (
        `Don't worry—getting stuck is a normal part of mastering new tools! You are currently on Step ${stepNum}: **${stepTitle}** using ${tools}.\n\n` +
        `**Quick Troubleshooting:**\n` +
        `1. Refresh the web page or restart the application.${tierAdvice}\n` +
        `2. Double-check that you haven't selected a paid 'Pro' feature or filter.\n` +
        `3. Try exporting or saving your file in a standard format (MP4, PNG, or TXT).\n\n` +
        `*Would you like me to walk you through this step with an exact example?*`
      );
    }

    // 2. "Explain simply" / beginner clarification
    if (msg.includes("explain") || msg.includes("don't understand") || msg.includes("confused") || msg.includes("simpler") || msg.includes("what is")) {
      return (
        `Here is Step ${stepNum} (**${stepTitle}**) explained simply:\n\n` +
        `Think of this step as laying down the foundation. With ${tools}, your goal isn't perfection on the first try—it's getting a working draft onto your screen.\n\n` +
        `**What to do right now:**\n` +
        `• ${context.stepInstruction || "Follow the prompt in your checklist."}\n` +
        `• Take 2 minutes to try it, and check the box when you see your first result.\n\n` +
        `*Ask me any specific question about the buttons or menus if anything looks different on your screen!*`
      );
    }

    // 3. "Show example" / prompt request
    if (msg.includes("example") || msg.includes("sample") || msg.includes("template") || msg.includes("prompt")) {
      return (
        `Here is a realistic example for Step ${stepNum} (**${stepTitle}**):\n\n` +
        `> **Target Goal:** Create a clear, high-contrast visual or deliverable.\n` +
        `> **Sample Action:** Set primary headline font to bold (Montserrat/Anton), keep subtitle under 10 words, and test on your mobile phone screen.\n\n` +
        `You can copy this into your project workspace notes or use it directly in ${tools}.`
      );
    }

    // 4. "Finished" / next step
    if (msg.includes("finished") || msg.includes("done") || msg.includes("complete") || msg.includes("next")) {
      return (
        `Great job finishing Step ${stepNum}! 🎉\n\n` +
        `Click the **'Next Step'** button in your mission card above to advance. Your XP is automatically being calculated, and you're one step closer to launching your project!`
      );
    }

    // General context-aware fallback
    return (
      `Hello! I'm your EarnQuest Guide. I see you're working on **${context.missionTitle || "your mission"}**, currently on Step ${stepNum}: **${stepTitle}** using ${tools}.\n\n` +
      `Your current computer environment is calibrated to **${tier}**. How can I help you move forward on this step? You can ask me to explain simply, give an example, or help troubleshoot any issue.`
    );
  }

  async suggestPromptTemplate(stepTitle: string, toolName: string): Promise<string> {
    return `Generate a beginner-friendly prompt template for ${stepTitle} using ${toolName}.`;
  }
}
