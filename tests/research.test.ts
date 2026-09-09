import { describe, it, expect } from "vitest";
import { researchService } from "@/services/research.service";

describe("Autonomous Research Service", () => {
  it("retrieves the latest research feed with verified items and source domains", async () => {
    const feed = await researchService.getLatestFeed(10);

    expect(feed).toBeDefined();
    expect(feed.items.length).toBeGreaterThan(0);
    expect(feed.totalScanned).toBeGreaterThan(0);

    const sample = feed.items[0];
    expect(sample.title).toBeDefined();
    expect(sample.url).toBeDefined();
    expect(sample.sourceDomain).toBeDefined();
    expect(sample.confidence).toBeGreaterThanOrEqual(80);
    expect(["TOOL", "API", "IDE", "OPPORTUNITY"]).toContain(sample.category);
  });

  it("executes a live research scan, logs a ResearchJob, and creates verified items", async () => {
    const job = await researchService.runDailyScan("Test Query for Free AI Coding Agents");

    expect(job).toBeDefined();
    expect(job.status).toBe("COMPLETED");
    expect(job.itemsFound).toBeGreaterThan(0);
    expect(job.items.length).toBe(job.itemsFound);

    const firstItem = job.items[0];
    expect(firstItem.jobId).toBe(job.id);
    expect(firstItem.confidence).toBeGreaterThan(0);
  });
});
