import { describe, it, expect } from "vitest";
import { MockAIProvider } from "@/providers/ai/mock-ai.provider";

describe("AI Guide Contextual Assistance", () => {
  const provider = new MockAIProvider();

  it("provides empathetic troubleshooting when user is stuck", async () => {
    const response = await provider.generateGuidance("I am stuck and seeing an error", {
      missionTitle: "Video Repurposing",
      stepNumber: 3,
      stepTitle: "Identify the 30-Second Hook",
      toolNames: ["CapCut Web"],
      hardwareTier: "TIER_1_LITE",
    });

    expect(response).toContain("Step 3");
    expect(response).toContain("Identify the 30-Second Hook");
    expect(response).toContain("Lite Mode");
    expect(response).toContain("Troubleshooting");
  });

  it("delivers simplified beginner explanations on demand", async () => {
    const response = await provider.generateGuidance("Please explain this step simply", {
      missionTitle: "Canva Templates",
      stepNumber: 2,
      stepTitle: "Set Canvas Dimensions",
      stepInstruction: "Create a blank A4 or US Letter page in Canva.",
      toolNames: ["Canva Free"],
      hardwareTier: "TIER_2_STANDARD",
    });

    expect(response).toContain("Step 2");
    expect(response).toContain("explained simply");
    expect(response).toContain("Canva Free");
  });

  it("suggests concrete examples when requested", async () => {
    const response = await provider.generateGuidance("Can you show me a sample prompt or example?", {
      missionTitle: "Audio Cleanup",
      stepNumber: 4,
      stepTitle: "Noise Reduction",
      toolNames: ["Audacity"],
      hardwareTier: "TIER_1_LITE",
    });

    expect(response).toContain("example for Step 4");
    expect(response).toContain("Target Goal");
  });
});
