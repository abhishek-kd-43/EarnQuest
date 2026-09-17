import { describe, it, expect } from "vitest";
import { getSearchProvider } from "@/providers/search/search.provider";
import { LiveSearchProvider } from "@/providers/search/live-search.provider";
import { researchService } from "@/services/research.service";
import { synthesizerService } from "@/services/synthesizer.service";
import { db } from "@/lib/db";

describe("Autonomous Research Engine & Catalog Ingestion", () => {
  it("initializes LiveSearchProvider with active web discovery and fallback feeds", async () => {
    const provider = getSearchProvider();
    expect(provider).toBeDefined();
    expect(provider.name).toBe("LiveSearchProvider");

    const tools = await provider.searchTools("free AI API no credit card");
    expect(tools.length).toBeGreaterThan(0);
    expect(tools[0]).toHaveProperty("title");
    expect(tools[0]).toHaveProperty("url");
    expect(tools[0]).toHaveProperty("confidence");
    expect(tools[0].confidence).toBeGreaterThan(0.8);
  });

  it("synthesizes an 8-step guided mission with prompt templates for an opportunity", async () => {
    // 1. Create a sample test opportunity
    const testSlug = `test-opp-${Date.now()}`;
    const opp = await db.opportunity.create({
      data: {
        slug: testSlug,
        title: "Test Podcast Audio Repurposing Retainer",
        description: "Convert podcast audio into newsletters and social threads.",
        category: "FREELANCE",
        targetMarket: "Corporate business coaches",
        customerProblem: "Podcasters lack time to write articles from audio.",
        difficulty: "BEGINNER",
        potentialRevenueMinCents: 15000,
        potentialRevenueMaxCents: 40000,
        revenueModel: "SERVICE_FEE",
        opportunityScore: 92,
      },
    });

    const mission = await synthesizerService.synthesizeMissionForOpportunity({
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      category: opp.category,
      targetMarket: opp.targetMarket,
      potentialRevenue: "$150 - $400 per client",
      primaryToolName: "Groq Whisper & Gemini 1.5 Flash",
      primaryToolUrl: "https://console.groq.com",
    });

    expect(mission).toBeDefined();
    expect(mission.slug).toContain("test-podcast-audio");
    expect(mission.steps.length).toBe(8);

    // Verify step 1 covers environment and free tool
    expect(mission.steps[0].stepNumber).toBe(1);
    expect(mission.steps[0].instruction).toContain("free plan tier");

    // Verify step 3 contains copy-paste prompt template
    expect(mission.steps[2].promptTemplate).toBeDefined();
    expect(mission.steps[2].promptTemplate).toContain("expert FREELANCE specialist");

    // Verify step 7 has client outreach script
    expect(mission.steps[6].promptTemplate).toContain("Hi [Name]");
  });

  it("executes an autonomous research scan and directly upserts tools and opportunities into the database", async () => {
    const initialToolsCount = await db.aITool.count();
    const initialOppsCount = await db.opportunity.count();

    const job = await researchService.runDailyScan("Autonomous Scan Verification Sweep");

    expect(job).toBeDefined();
    expect(job.status).toBe("COMPLETED");
    expect(job.itemsFound).toBeGreaterThan(0);

    const afterToolsCount = await db.aITool.count();
    const afterOppsCount = await db.opportunity.count();

    expect(afterToolsCount).toBeGreaterThanOrEqual(initialToolsCount);
    expect(afterOppsCount).toBeGreaterThanOrEqual(initialOppsCount);

    const feed = await researchService.getLatestFeed(10);
    expect(feed.items.length).toBeGreaterThan(0);
    expect(feed.totalTools).toBeGreaterThanOrEqual(10);
    expect(feed.totalOpportunities).toBeGreaterThanOrEqual(5);
  }, 15000);
});
