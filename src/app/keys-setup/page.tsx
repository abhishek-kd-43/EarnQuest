"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Key,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  RefreshCw,
  Code2,
  Cpu,
  Globe,
  Terminal,
  AlertCircle,
} from "lucide-react";

export default function KeysSetupPage() {
  const [geminiKey, setGeminiKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [currentStatus, setCurrentStatus] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchKeysStatus();
  }, []);

  const fetchKeysStatus = async () => {
    try {
      const res = await fetch("/api/user/keys");
      const data = await res.json();
      setCurrentStatus(data);
      if (data.apiKeyGemini) {
        setGeminiKey(data.apiKeyGemini);
      }
    } catch (e) {
      console.error("Failed to load keys status", e);
    }
  };

  const handleTestKey = async () => {
    if (!geminiKey || geminiKey.includes("...")) {
      setTestResult({
        success: false,
        message: "Please paste your full Google AI Studio API key (starts with AIzaSy...)",
      });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/user/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKeyGemini: geminiKey,
          action: "test",
        }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || "Network test failed" });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveKeys = async () => {
    setSaving(true);
    setSaveSuccess(null);
    setTestResult(null);
    try {
      const res = await fetch("/api/user/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKeyGemini: geminiKey.includes("...") ? undefined : geminiKey,
          apiKeyGroq: groqKey.includes("...") ? undefined : groqKey,
          apiKeyOpenRouter: openRouterKey.includes("...") ? undefined : openRouterKey,
          action: "save",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(data.message || "API key successfully linked!");
        await fetchKeysStatus();
      } else {
        setTestResult({ success: false, message: data.error || "Failed to save key." });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free AI Workstation
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Free API Keys & Cloud AI IDE Hub
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            You don&apos;t need paid subscriptions or a credit card to access frontier AI models and professional cloud IDEs.
            Using your existing <strong>Google</strong> and <strong>GitHub</strong> accounts, you can unlock massive free quotas
            for Google Gemini 1.5, Groq Llama 3.3, Project IDX, and cloud developer machines.
          </p>
        </div>
      </div>

      {/* Live AI Status & Key Linker */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Activate Your Live Frontier AI Guide</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Link your free Google AI Studio key below to power EarnQuest missions with unrestricted live Gemini 1.5 Flash intelligence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Current Guide Mode:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                currentStatus?.isLiveActive
                  ? "bg-emerald-950 border border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800 border border-slate-700 text-slate-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  currentStatus?.isLiveActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"
                }`}
              />
              {currentStatus?.isLiveActive ? "Live Gemini 1.5 Active" : "Built-in Intelligence"}
            </span>
          </div>
        </div>

        {/* Input form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Google AI Studio API Key (Gemini 1.5 Flash Free Tier)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleTestKey}
                  disabled={testing || !geminiKey}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-400" />}
                  Test Connection
                </button>
                <button
                  onClick={handleSaveKeys}
                  disabled={saving || !geminiKey}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-black text-slate-950 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save & Enable
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Keys are stored securely in your private user profile and used exclusively for your direct mission guidance.
            </p>
          </div>

          {/* Test or Save feedback banners */}
          {testResult && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300"
                  : "bg-rose-950/60 border border-rose-500/30 text-rose-300"
              }`}
            >
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-4 rounded-xl text-xs bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Tool Setup Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">How to Get 100% Free Access (Step-by-Step)</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Direct official links to obtain free API keys, cloud IDEs, and coding tools with zero upfront payment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Google AI Studio */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-cyan-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
                  1M Tokens/Min Free
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Google AI Studio (Gemini 1.5)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Google provides 15 requests/min and 1,000,000 tokens/min 100% free with standard Google accounts. No credit card required.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3-Step Setup:</div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Visit <strong className="text-slate-200">aistudio.google.com</strong> and click &quot;Sign In&quot;.</li>
                  <li>Click the blue <strong className="text-slate-200">&quot;Get API key&quot;</strong> button in top left.</li>
                  <li>Click &quot;Create API key in new project&quot; &amp; copy your key!</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                Open Google AI Studio <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-medium">Google Account</span>
            </div>
          </div>

          {/* Card 2: GroqCloud */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-950 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-950 border border-orange-500/30 text-[10px] font-bold text-orange-400 uppercase">
                  Sub-Second Speed
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                  GroqCloud (Llama 3.3 &amp; Whisper)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ultra-fast hardware inference for Meta Llama 3.3 70B and OpenAI Whisper audio transcription at zero cost.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3-Step Setup:</div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Visit <strong className="text-slate-200">console.groq.com</strong>.</li>
                  <li>Click &quot;Continue with GitHub&quot; or &quot;Google&quot;.</li>
                  <li>Navigate to &quot;API Keys&quot; &rarr; &quot;Create API Key&quot; and copy.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300"
              >
                Open Groq Console <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-medium">GitHub / Google</span>
            </div>
          </div>

          {/* Card 3: Google Project IDX */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/30 text-[10px] font-bold text-blue-400 uppercase">
                  Cloud AI IDE
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  Google Project IDX
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fullstack browser-based IDE with integrated Gemini code generation, terminal, and live app preview. Works on any low-spec PC.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3-Step Setup:</div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Go to <strong className="text-slate-200">idx.google.com</strong>.</li>
                  <li>Sign in with your Google account.</li>
                  <li>Select a template (Next.js, Python, Flutter) &rarr; Launch instant cloud workspace.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href="https://idx.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
              >
                Launch Project IDX <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-medium">Runs in Browser</span>
            </div>
          </div>

          {/* Card 4: Trae AI & Cursor */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-[10px] font-bold text-purple-400 uppercase">
                  Desktop AI Agent
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                  Trae &amp; Cursor Free Tiers
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Next-generation AI IDEs that write code, debug errors, and refactor whole repositories through natural language chats.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3-Step Setup:</div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Download Trae from <strong className="text-slate-200">trae.ai</strong> or Cursor from <strong className="text-slate-200">cursor.com</strong>.</li>
                  <li>Install on Windows, Mac, or Linux.</li>
                  <li>Sign in for free and press <strong className="text-slate-200">Ctrl+K / Cmd+K</strong> to code with AI.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href="https://www.trae.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300"
              >
                Download Trae <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-medium">Local App</span>
            </div>
          </div>

          {/* Card 5: OpenRouter Free Models */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 uppercase">
                  20+ Free Models
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  OpenRouter (:free tier)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access DeepSeek R1/V3, Qwen 2.5 72B, and Meta Llama without paying a penny through a standardized OpenAI API format.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3-Step Setup:</div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Visit <strong className="text-slate-200">openrouter.ai</strong> and sign in with Google.</li>
                  <li>Go to &quot;Keys&quot; and create a free key.</li>
                  <li>Query any model ending with <strong className="text-slate-200">:free</strong> at $0.00 cost.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href="https://openrouter.ai/models?q=free"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Browse Free Models <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-medium">Open Gateway</span>
            </div>
          </div>

          {/* Card 6: GitHub Codespaces */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 uppercase">
                  60 Hours / Month
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  GitHub Codespaces
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cloud Linux developer computer in your browser. Allows you to build apps and run background tools even on an old budget PC.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">3-Step Setup:</div>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Log in to <strong className="text-slate-200">github.com</strong>.</li>
                  <li>Open any repository &rarr; Click green &quot;Code&quot; &rarr; &quot;Codespaces&quot;.</li>
                  <li>Click &quot;Create codespace on main&quot; &rarr; Launches full VS Code online.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between">
              <a
                href="https://github.com/features/codespaces"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white"
              >
                Explore Codespaces <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-slate-500 font-medium">GitHub Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real Earning Connection CTA */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Ready to Put These Free Tools to Work?</h3>
          <p className="text-sm text-slate-400 max-w-xl">
            Check out the Autonomous Daily Research Scanner to see what paying clients are ordering today, or start a guided 10-step mission.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/research"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all border border-slate-700"
          >
            Explore Daily Research &rarr;
          </Link>
          <Link
            href="/missions"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-black text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
          >
            Start a Mission
          </Link>
        </div>
      </div>
    </div>
  );
}
