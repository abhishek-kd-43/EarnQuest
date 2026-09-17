import { describe, it, expect, vi } from "vitest";
import { GeminiAIProvider } from "@/providers/ai/gemini-ai.provider";

describe("GeminiAIProvider Integration & Fallback", () => {
  it("falls back cleanly to MockAIProvider when no API key is provided", async () => {
    const provider = new GeminiAIProvider("");

    const response = await provider.generateGuidance("I am stuck on this step", {
      missionTitle: "Micro-SaaS with Gemini",
      stepNumber: 1,
      stepTitle: "Get Your Free Google AI Studio API Key",
      toolNames: ["Google AI Studio"],
      hardwareTier: "TIER_1_LITE",
    });

    expect(response).toBeDefined();
    expect(response).toContain("Step 1");
    expect(response).toContain("Google AI Studio");
    expect(response).toContain("Troubleshooting");
  });

  it("validates key length and rejects empty/short keys immediately without network call", async () => {
    const emptyResult = await GeminiAIProvider.testApiKey("");
    expect(emptyResult.success).toBe(false);
    expect(emptyResult.message).toContain("too short");

    const shortResult = await GeminiAIProvider.testApiKey("AIzaSy");
    expect(shortResult.success).toBe(false);
    expect(shortResult.message).toContain("too short");
  });

  it(
    "handles network failure gracefully and falls back to offline guidance",
    async () => {
      // Provide an invalid key that triggers fallback
      const provider = new GeminiAIProvider("AIzaSyFakeKeyForTestingPurposes12345");

    const response = await provider.generateGuidance("Explain this simply", {
      missionTitle: "Groq Whisper Pipeline",
      stepNumber: 2,
      stepTitle: "Download a Sample Audio File",
      toolNames: ["GroqCloud"],
      hardwareTier: "TIER_1_LITE",
    });

    expect(response).toBeDefined();
    // It should have either executed or gracefully fallen back with offline notice
    expect(typeof response).toBe("string");
    expect(response.length).toBeGreaterThan(20);
  }, 10000);
});
