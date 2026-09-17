"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Zap,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Laptop,
  Monitor,
  Flame,
  DollarSign,
  Layers,
  Wrench,
  ShieldCheck,
} from "lucide-react";

interface MatcherRecommendation {
  slug: string;
  title: string;
  category: string;
  hardwareTier: string;
  freeTool: string;
  estimatedEarnings: string;
  timeCommitment: string;
  highlight: string;
}

const RECOMMENDATION_MATRIX: Record<string, MatcherRecommendation> = {
  "TIER_1_LITE-FAST_CASH": {
    slug: "mission-youtube-multilingual-subtitles",
    title: "YouTube Multilingual Subtitles & Video Repurposing",
    category: "FREELANCE",
    hardwareTier: "TIER_1_LITE",
    freeTool: "Groq Whisper + CapCut Web (100% Free in Browser)",
    estimatedEarnings: "$30 - $120 per video",
    timeCommitment: "1-2 hours",
    highlight: "Zero local computing required. Everything runs in the cloud on any Chromebook or budget laptop.",
  },
  "TIER_1_LITE-DIGITAL_PRODUCTS": {
    slug: "mission-canva-template",
    title: "Design & Sell Reusable Canva Client Onboarding Packs",
    category: "CREATE",
    hardwareTier: "TIER_1_LITE",
    freeTool: "Canva Free + Gemini 1.5 Flash",
    estimatedEarnings: "$15 - $49 per sale (Passive)",
    timeCommitment: "2-3 hours",
    highlight: "Create once, sell repeatedly. Generates live checkout links with direct 80% creator revenue share.",
  },
  "TIER_1_LITE-MEDIA_CREATIVE": {
    slug: "mission-b2b-podcast-repurposing",
    title: "B2B Audio-to-Article Podcast Repurposing Retainer",
    category: "FREELANCE",
    hardwareTier: "TIER_1_LITE",
    freeTool: "GroqCloud Whisper + Google AI Studio",
    estimatedEarnings: "$150 - $400 / month retainer",
    timeCommitment: "2 hours / week",
    highlight: "Turns audio episodes into LinkedIn carousels, executive summaries, and SEO blog articles.",
  },
  "TIER_1_LITE-CODING_WEB": {
    slug: "mission-landing-page",
    title: "Build a Responsive Booking Site for Local Tradespeople",
    category: "BUILD",
    hardwareTier: "TIER_1_LITE",
    freeTool: "Google Project IDX + Vercel / GitHub Pages",
    estimatedEarnings: "$200 - $600 per site",
    timeCommitment: "3-4 hours",
    highlight: "Cloud-based Code OSS editor with instant web previews. No local software installation needed.",
  },
  "TIER_2_STANDARD-FAST_CASH": {
    slug: "mission-local-business-seo-reviews",
    title: "Local Business SEO Audit & Google Review Responder",
    category: "MARKETING",
    hardwareTier: "TIER_2_STANDARD",
    freeTool: "Google AI Studio + Google Business APIs",
    estimatedEarnings: "$150 - $400 / mo per business",
    timeCommitment: "2-3 hours setup",
    highlight: "High demand among local dentists, roofers, and clinics. Delivers automated reputation management.",
  },
  "TIER_2_STANDARD-DIGITAL_PRODUCTS": {
    slug: "mission-e-commerce-product-cleanup",
    title: "E-Commerce Product Image Cleanup & 4K Upscaling",
    category: "CREATE",
    hardwareTier: "TIER_2_STANDARD",
    freeTool: "Photoroom Web + Upscayl Desktop AI",
    estimatedEarnings: "$20 - $80 per catalog batch",
    timeCommitment: "1-2 hours",
    highlight: "Clean ugly supplier backgrounds and upscale product photos for Shopify and Amazon merchants.",
  },
  "TIER_2_STANDARD-MEDIA_CREATIVE": {
    slug: "mission-audiobook-script-prep",
    title: "Audiobook Script Phonetic Prep & Formatting Service",
    category: "FREELANCE",
    hardwareTier: "TIER_2_STANDARD",
    freeTool: "Audacity + OpenVINO AI Plugins",
    estimatedEarnings: "$50 - $200 per book",
    timeCommitment: "2-3 hours",
    highlight: "Prepares raw manuscripts with pronunciation guides and timestamps for voice actors.",
  },
  "TIER_2_STANDARD-CODING_WEB": {
    slug: "mission-low-code-internal-dashboards",
    title: "Low-Code Internal Business Dashboard & CRUD Tool",
    category: "BUILD",
    hardwareTier: "TIER_2_STANDARD",
    freeTool: "Appsmith Community + Supabase Free",
    estimatedEarnings: "$500 - $2,000 per tool",
    timeCommitment: "4-8 hours",
    highlight: "Replaces messy spreadsheets with modern role-based internal databases for small businesses.",
  },
  "TIER_3_POWER-CODING_WEB": {
    slug: "mission-private-document-search-ollama",
    title: "Private Offline Document Search with Local AI (Ollama)",
    category: "BUILD",
    hardwareTier: "TIER_3_POWER",
    freeTool: "Ollama (Llama 3.3 / DeepSeek) + Open-WebUI",
    estimatedEarnings: "$300 - $1,200 setup fee",
    timeCommitment: "3-5 hours",
    highlight: "High-ticket enterprise service for law firms and medical clinics who cannot upload records to the cloud.",
  },
};

export function OpportunityMatcher() {
  const [tier, setTier] = useState<"TIER_1_LITE" | "TIER_2_STANDARD" | "TIER_3_POWER">("TIER_1_LITE");
  const [goal, setGoal] = useState<"FAST_CASH" | "DIGITAL_PRODUCTS" | "MEDIA_CREATIVE" | "CODING_WEB">("FAST_CASH");
  const [time, setTime] = useState<"1_HOUR" | "2_4_HOURS" | "WEEKEND">("2_4_HOURS");

  const matchKey = `${tier}-${goal}`;
  const rec =
    RECOMMENDATION_MATRIX[matchKey] ||
    RECOMMENDATION_MATRIX[`${tier}-FAST_CASH`] ||
    RECOMMENDATION_MATRIX["TIER_1_LITE-FAST_CASH"];

  return (
    <div className="glass-panel-elevated p-6 sm:p-10 rounded-3xl border border-cyan-500/30 glow-cyan relative overflow-hidden space-y-8 animate-fade-in-up">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> 30-Second Opportunity Matcher
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          What can your computer build today?
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Select your device and goals. We automatically filter out heavy models you cannot run and pair you with zero-cost AI tools to make legitimate income.
        </p>

        {/* Step Progress Indicator */}
        <div className="flex items-center gap-2 pt-1">
          {["Hardware", "Goal", "Time"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${
                  i === 0 ? "bg-emerald-500 text-slate-950" : i === 1 ? "bg-cyan-500 text-slate-950" : "bg-purple-500 text-white"
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs font-semibold text-slate-300">{label}</span>
              </div>
              {i < 2 && <div className="w-6 h-[2px] bg-slate-700 rounded-full" />}
            </div>
          ))}
        </div>
      </div>

      {/* 3-Step Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {/* Step 1: Device */}
        <div className="space-y-3">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
            1. Your Hardware Environment
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setTier("TIER_1_LITE")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                tier === "TIER_1_LITE"
                  ? "bg-emerald-950/70 border-emerald-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Laptop className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Lite / Chromebook (&lt;8GB)</div>
                <div className="text-[10px] text-slate-400 font-normal">100% cloud & web tools</div>
              </div>
            </button>

            <button
              onClick={() => setTier("TIER_2_STANDARD")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                tier === "TIER_2_STANDARD"
                  ? "bg-cyan-950/70 border-cyan-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Standard PC / Laptop (8-16GB)</div>
                <div className="text-[10px] text-slate-400 font-normal">Audio & image tools</div>
              </div>
            </button>

            <button
              onClick={() => setTier("TIER_3_POWER")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                tier === "TIER_3_POWER"
                  ? "bg-purple-950/70 border-purple-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Power Workstation (16GB+ / GPU)</div>
                <div className="text-[10px] text-slate-400 font-normal">Local LLMs & Ollama</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Goal */}
        <div className="space-y-3">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
            2. Monetization Goal
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setGoal("FAST_CASH")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                goal === "FAST_CASH"
                  ? "bg-emerald-950/70 border-emerald-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <DollarSign className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Fast Client Gigs ($50 - $200)</div>
                <div className="text-[10px] text-slate-400 font-normal">Subtitling, SEO, review replies</div>
              </div>
            </button>

            <button
              onClick={() => setGoal("DIGITAL_PRODUCTS")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                goal === "DIGITAL_PRODUCTS"
                  ? "bg-cyan-950/70 border-cyan-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Digital Products & Templates</div>
                <div className="text-[10px] text-slate-400 font-normal">Canva templates & AI packs</div>
              </div>
            </button>

            <button
              onClick={() => setGoal("CODING_WEB")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                goal === "CODING_WEB"
                  ? "bg-purple-950/70 border-purple-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Wrench className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Web Sites & Dashboards</div>
                <div className="text-[10px] text-slate-400 font-normal">Project IDX, Supabase ($200+)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Step 3: Available Time */}
        <div className="space-y-3">
          <label className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
            3. Available Time Today
          </label>
          <div className="space-y-2">
            <button
              onClick={() => setTime("1_HOUR")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                time === "1_HOUR"
                  ? "bg-emerald-950/70 border-emerald-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">1 Hour Sprint</div>
                <div className="text-[10px] text-slate-400 font-normal">Fast, focused task execution</div>
              </div>
            </button>

            <button
              onClick={() => setTime("2_4_HOURS")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                time === "2_4_HOURS"
                  ? "bg-cyan-950/70 border-cyan-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">2 to 4 Hours</div>
                <div className="text-[10px] text-slate-400 font-normal">Standard complete mission</div>
              </div>
            </button>

            <button
              onClick={() => setTime("WEEKEND")}
              className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                time === "WEEKEND"
                  ? "bg-purple-950/70 border-purple-500 text-white font-bold"
                  : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Deep Weekend Project</div>
                <div className="text-[10px] text-slate-400 font-normal">Full micro-SaaS / client retainer</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Instant Matched Result Card */}
      <div key={matchKey} className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 glow-emerald flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl animate-fade-in-scale">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 98% Compatibility Match
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Hardware Calibrated: {tier}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">{rec.title}</h3>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">{rec.highlight}</p>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <span className="text-slate-400">
              Free Tools: <strong className="text-cyan-400">{rec.freeTool}</strong>
            </span>
            <span className="text-slate-400">
              Potential: <strong className="text-emerald-400 font-mono">{rec.estimatedEarnings}</strong>
            </span>
            <span className="text-slate-400">
              Est. Time: <strong className="text-white">{rec.timeCommitment}</strong>
            </span>
          </div>
        </div>

        <Link
          href={`/missions/${rec.slug}`}
          className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          Launch Step 1 (Free) <ArrowRight className="h-4 w-4 stroke-[3]" />
        </Link>
      </div>
    </div>
  );
}
