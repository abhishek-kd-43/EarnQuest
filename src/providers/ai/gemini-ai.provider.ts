import { AIProvider, PromptContext, GuideMessage } from "./ai.provider";
import { MockAIProvider } from "./mock-ai.provider";

export class GeminiAIProvider implements AIProvider {
  name = "Google Gemini 1.5 Flash (Live)";
  private apiKey: string;
  private fallbackProvider: MockAIProvider;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.fallbackProvider = new MockAIProvider();
  }

  async generateGuidance(
    userMessage: string,
    context: PromptContext,
    conversationHistory?: GuideMessage[]
  ): Promise<string> {
    if (!this.apiKey) {
      // Clean fallback if no key provided
      return this.fallbackProvider.generateGuidance(userMessage, context, conversationHistory);
    }

    const systemPrompt = `You are the EarnQuest Autonomous Opportunity Guide.
Your purpose is to guide ordinary users to earn real money legitimately using their PC, free AI tools, free APIs, and guided mission steps.
Always follow these rules:
1. Be encouraging, highly practical, and step-by-step.
2. Hardware awareness: User hardware tier is "${context.hardwareTier || "TIER_1_LITE"}". If Lite, suggest lightweight web tools and remind them to keep tabs low. If Power, suggest local setups if appropriate.
3. Zero tolerance for scams, fraud, fake reviews, or copyright infringement. Keep all earning advice 100% legitimate (micro-SaaS, freelance, client services, digital assets).
4. Current mission: "${context.missionTitle || "General Exploration"}". Current Step ${context.stepNumber || 1}: "${context.stepTitle || "Action Step"}".
5. Step instructions: "${context.stepInstruction || "Follow guided checklist"}".
6. Recommended tools: ${context.toolNames?.join(", ") || "Free AI tools"}.
7. Keep responses concise (2-4 clear paragraphs or bullet points), formatted in clean markdown.`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${userMessage}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        this.apiKey
      )}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(3000),
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: fullPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn("[GeminiAIProvider] Live API call returned error status:", res.status, errText);
        // Seamless fallback to MockAIProvider with notice
        const fallback = await this.fallbackProvider.generateGuidance(userMessage, context, conversationHistory);
        return `${fallback}\n\n*(Note: Live Gemini API encountered status ${res.status}. Falling back to EarnQuest built-in intelligence engine.)*`;
      }

      const data = await res.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!answer) {
        return this.fallbackProvider.generateGuidance(userMessage, context, conversationHistory);
      }

      return answer.trim();
    } catch (err: any) {
      console.error("[GeminiAIProvider] Network error connecting to Gemini:", err.message);
      const fallback = await this.fallbackProvider.generateGuidance(userMessage, context, conversationHistory);
      return `${fallback}\n\n*(Note: Network offline or Gemini endpoint unreachable. Switched to offline guide.)*`;
    }
  }

  async suggestPromptTemplate(stepTitle: string, toolName: string): Promise<string> {
    return `Generate a beginner-friendly prompt template for ${stepTitle} using ${toolName}.`;
  }

  static async testApiKey(apiKey: string): Promise<{ success: boolean; message: string }> {
    if (!apiKey || apiKey.trim().length < 10) {
      return { success: false, message: "API key is too short or missing." };
    }

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Hello! Respond with: 'OK'" }] }],
        }),
      });

      if (res.ok) {
        return { success: true, message: "Connected successfully to Google Gemini 1.5 Flash!" };
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ${res.status} error from Google AI Studio.`;
        return { success: false, message: errMsg };
      }
    } catch (err: any) {
      return { success: false, message: `Connection failed: ${err.message}` };
    }
  }
}
