import { describe, it, expect } from "vitest";
import { HardwareService } from "@/services/hardware.service";

describe("Hardware Environment Profiling & Tier Assignment", () => {
  const service = new HardwareService();

  it("classifies low-memory machines (<8GB RAM, integrated GPU) as TIER_1_LITE", () => {
    const tier = service.classifyTier({
      os: "Windows",
      browser: "Chrome",
      ramGb: 4,
      cpuCores: 2,
      hasGpu: false,
      gpuRenderer: "Intel HD Graphics 620",
    });

    expect(tier).toBe("TIER_1_LITE");
  });

  it("classifies mid-range machines (8GB-16GB RAM) as TIER_2_STANDARD", () => {
    const tier = service.classifyTier({
      os: "macOS",
      browser: "Safari",
      ramGb: 8,
      cpuCores: 8,
      hasGpu: false,
      gpuRenderer: "Apple M1",
    });

    expect(tier).toBe("TIER_2_STANDARD");
  });

  it("classifies high-spec machines (16GB+ RAM, discrete GPU) as TIER_3_POWER", () => {
    const tier = service.classifyTier({
      os: "Windows",
      browser: "Chrome",
      ramGb: 32,
      cpuCores: 16,
      hasGpu: true,
      gpuRenderer: "NVIDIA GeForce RTX 4080",
    });

    expect(tier).toBe("TIER_3_POWER");
  });
});
