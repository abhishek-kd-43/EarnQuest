import { db } from "@/lib/db";

export interface HardwareTelemetry {
  os?: string;
  browser?: string;
  cpuCores?: number;
  ramGb?: number;
  hasGpu?: boolean;
  gpuRenderer?: string;
  rawUserAgent?: string;
}

export type HardwareTier = "TIER_1_LITE" | "TIER_2_STANDARD" | "TIER_3_POWER";

export class HardwareService {
  /**
   * Deterministically evaluates client telemetry into an environment tier:
   * - TIER_1_LITE: Low RAM (<8GB), Chromebooks, mobile or basic integrated graphics.
   * - TIER_2_STANDARD: 8GB-16GB RAM, decent CPU (4+ cores), standard desktop workflow.
   * - TIER_3_POWER: 16GB+ RAM, dedicated GPU (NVIDIA, Apple Silicon M-series, AMD discrete).
   */
  classifyTier(telemetry: HardwareTelemetry): HardwareTier {
    const ram = telemetry.ramGb ?? 4;
    const hasGpu = telemetry.hasGpu ?? false;
    const renderer = (telemetry.gpuRenderer || "").toLowerCase();

    // Check for high-end dedicated GPU strings
    const isDiscreteGpu =
      hasGpu ||
      renderer.includes("nvidia") ||
      renderer.includes("geforce") ||
      renderer.includes("rtx") ||
      renderer.includes("radeon") ||
      renderer.includes("apple m");

    if (ram >= 16 && isDiscreteGpu) {
      return "TIER_3_POWER";
    }

    if (ram >= 8 || (telemetry.cpuCores ?? 2) >= 4) {
      return "TIER_2_STANDARD";
    }

    return "TIER_1_LITE";
  }

  async saveProfile(userId: string, telemetry: HardwareTelemetry) {
    const tier = this.classifyTier(telemetry);

    return db.hardwareProfile.upsert({
      where: { userId },
      update: {
        os: telemetry.os || "Unknown",
        browser: telemetry.browser || "Unknown",
        cpuCores: telemetry.cpuCores,
        ramGb: telemetry.ramGb,
        hasGpu: telemetry.hasGpu || false,
        gpuRenderer: telemetry.gpuRenderer,
        tier,
        rawUserAgent: telemetry.rawUserAgent,
        verifiedAt: new Date(),
      },
      create: {
        userId,
        os: telemetry.os || "Unknown",
        browser: telemetry.browser || "Unknown",
        cpuCores: telemetry.cpuCores,
        ramGb: telemetry.ramGb,
        hasGpu: telemetry.hasGpu || false,
        gpuRenderer: telemetry.gpuRenderer,
        tier,
        rawUserAgent: telemetry.rawUserAgent,
      },
    });
  }
}

export const hardwareService = new HardwareService();
