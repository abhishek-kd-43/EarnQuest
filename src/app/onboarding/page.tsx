"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, CheckCircle2, ShieldCheck, ArrowRight, Zap, Sparkles } from "lucide-react";

export default function OnboardingHardwarePage() {
  const router = useRouter();
  const [os, setOs] = useState("Detecting...");
  const [browser, setBrowser] = useState("Detecting...");
  const [cpuCores, setCpuCores] = useState<number>(4);
  const [ramGb, setRamGb] = useState<number>(8);
  const [hasGpu, setHasGpu] = useState(false);
  const [gpuRenderer, setGpuRenderer] = useState("Integrated Graphics");
  const [calculatedTier, setCalculatedTier] = useState("TIER_1_LITE");
  const [saving, setSaving] = useState(false);
  const [calibrated, setCalibrated] = useState(false);

  useEffect(() => {
    // 1. Detect OS & Browser from userAgent
    const ua = navigator.userAgent;
    let detectedOs = "Unknown OS";
    if (ua.includes("Win")) detectedOs = "Windows";
    else if (ua.includes("Mac")) detectedOs = "macOS";
    else if (ua.includes("Linux")) detectedOs = "Linux";
    else if (ua.includes("CrOS")) detectedOs = "ChromeOS";

    let detectedBrowser = "Browser";
    if (ua.includes("Chrome") && !ua.includes("Edg")) detectedBrowser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) detectedBrowser = "Safari";
    else if (ua.includes("Firefox")) detectedBrowser = "Firefox";
    else if (ua.includes("Edg")) detectedBrowser = "Edge";

    setOs(detectedOs);
    setBrowser(detectedBrowser);

    // 2. Hardware Concurrency
    const cores = navigator.hardwareConcurrency || 4;
    setCpuCores(cores);

    // 3. WebGL GPU detection
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) {
            setGpuRenderer(renderer);
            const lower = renderer.toLowerCase();
            if (
              lower.includes("nvidia") ||
              lower.includes("geforce") ||
              lower.includes("rtx") ||
              lower.includes("radeon") ||
              lower.includes("apple m")
            ) {
              setHasGpu(true);
            }
          }
        }
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  // Recalculate tier whenever ramGb, cores, or GPU changes
  useEffect(() => {
    if (ramGb >= 16 && hasGpu) {
      setCalculatedTier("TIER_3_POWER");
    } else if (ramGb >= 8 || cpuCores >= 4) {
      setCalculatedTier("TIER_2_STANDARD");
    } else {
      setCalculatedTier("TIER_1_LITE");
    }
  }, [ramGb, cpuCores, hasGpu]);

  const handleSaveAndContinue = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding/hardware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          os,
          browser,
          cpuCores,
          ramGb,
          hasGpu,
          gpuRenderer,
          rawUserAgent: navigator.userAgent,
        }),
      });

      if (!res.ok) throw new Error("Failed to save calibration");

      setCalibrated(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch (e) {
      console.error(e);
      // Fallback redirect
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 mb-1">
          <Cpu className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Calibrate Your Computer
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          EarnQuest detects your machine's hardware capabilities to tailor missions that run smoothly without crashing your system.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        {/* Detected Hardware Specs */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Detected Specifications
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Operating System</span>
              <strong className="text-white text-sm font-semibold">{os}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Browser</span>
              <strong className="text-white text-sm font-semibold">{browser}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">CPU Concurrency</span>
              <strong className="text-white text-sm font-semibold">{cpuCores} Threads</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block">Graphics Renderer</span>
              <strong className="text-white text-sm font-semibold truncate block" title={gpuRenderer}>
                {gpuRenderer}
              </strong>
            </div>
          </div>

          {/* User RAM Confirmation */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-300">
              Approximate System RAM (Memory)
            </label>
            <select
              value={ramGb}
              onChange={(e) => setRamGb(parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value={4}>4 GB RAM (Lightweight / Chromebook / Netbook)</option>
              <option value={8}>8 GB RAM (Standard Laptop / Office PC)</option>
              <option value={16}>16 GB RAM (Power Laptop / Desktop Workstation)</option>
              <option value={32}>32 GB+ RAM (High-Performance Creative Rig)</option>
            </select>
          </div>
        </div>

        {/* Assigned Tier Display */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Assigned Environment Tier</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {calculatedTier}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {calculatedTier === "TIER_1_LITE" &&
              "Optimized for 100% browser-based free AI tools (Canva, CapCut Web, Google Colab, Supabase). Zero local software strain."}
            {calculatedTier === "TIER_2_STANDARD" &&
              "Compatible with local desktop editors (VS Code, Audacity, Blender) and hybrid cloud workflows with great responsiveness."}
            {calculatedTier === "TIER_3_POWER" &&
              "Fully equipped for local AI model inference (Ollama, Llama 3, Mistral), offline document search, and 3D rendering."}
          </p>

          <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-1">
            <Sparkles className="h-3.5 w-3.5" />
            Awards: "Engine Calibrated" Badge + 100 XP
          </div>
        </div>

        <button
          onClick={handleSaveAndContinue}
          disabled={saving || calibrated}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {calibrated ? (
            <>
              <CheckCircle2 className="h-4 w-4 stroke-[3]" />
              Calibrated! Redirecting to Dashboard...
            </>
          ) : saving ? (
            "Calibrating Opportunity Engine..."
          ) : (
            <>
              Confirm Calibration & Go to Dashboard
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
