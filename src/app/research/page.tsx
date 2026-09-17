"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radar,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Globe,
  DollarSign,
  Code2,
  Terminal,
  Compass,
} from "lucide-react";

export default function ResearchPage() {
  const [items, setItems] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalTools: 0,
    totalOpportunities: 0,
    totalMissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [lastScanAt, setLastScanAt] = useState<string>("");
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchResearchFeed();
  }, []);

  const fetchResearchFeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/research/scan");
      const data = await res.json();
      setItems(data.items || []);
      setJobs(data.recentJobs || []);
      setStats({
        totalTools: data.totalTools || 0,
        totalOpportunities: data.totalOpportunities || 0,
        totalMissions: data.totalMissions || 0,
      });
      if (data.lastScanAt) {
        setLastScanAt(new Date(data.lastScanAt).toLocaleTimeString());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      const res = await fetch("/api/research/daily-sync", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setScanMessage(data.message);
        await fetchResearchFeed();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setScanning(false);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedFilter === "ALL") return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Radar className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              Autonomous Ingestion & Opportunity Engine
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Autonomous Daily Self-Research
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              EarnQuest autonomously scans developer registries, open-source model releases, and remote gig marketplaces
              to continuously discover <strong>new free AI tools, free APIs, and worldwide client opportunities</strong>.
              Every opportunity is automatically converted into a step-by-step guided mission.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <button
              onClick={handleRunScan}
              disabled={scanning}
              className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`h-4 w-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning Live Web & Registries..." : "Run Autonomous Scan Now"}
            </button>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Daily Auto-Sync: Active • Last scan: {lastScanAt || "Just now"}</span>
            </div>
          </div>
        </div>

        {scanMessage && (
          <div className="mt-6 p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2.5 shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* Catalog Live Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.totalTools || items.length}</div>
            <div className="text-xs text-slate-400">Verified Free AI Tools & APIs</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">
              {stats.totalOpportunities || "20+"}
            </div>
            <div className="text-xs text-slate-400">Active Client Opportunities</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-950 text-purple-400 border border-purple-500/30">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-300">
              {stats.totalMissions || "15+"}
            </div>
            <div className="text-xs text-slate-400">Guided Step-by-Step Missions</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap gap-2">
          {["ALL", "API", "IDE", "TOOL", "OPPORTUNITY"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === cat
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat === "ALL"
                ? "All Discoveries"
                : cat === "API"
                ? "Free AI APIs"
                : cat === "IDE"
                ? "Cloud AI IDEs"
                : cat === "TOOL"
                ? "Free AI Tools"
                : "Client Opportunities"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link href="/tools" className="text-cyan-400 hover:underline flex items-center gap-1">
            Browse Tools Directory <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/opportunities"
            className="text-emerald-400 hover:underline flex items-center gap-1"
          >
            Browse Opportunities <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Discovered Items Grid */}
      {loading ? (
        <div className="text-center py-24 text-slate-400 text-sm">
          Loading autonomous research feed...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-800">
          <p className="text-slate-400 text-sm">No items found for this category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.category === "API"
                        ? "bg-purple-950 text-purple-400 border border-purple-800/50"
                        : item.category === "IDE"
                        ? "bg-blue-950 text-blue-400 border border-blue-800/50"
                        : item.category === "OPPORTUNITY"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                        : "bg-cyan-950 text-cyan-400 border border-cyan-800/50"
                    }`}
                  >
                    {item.category}
                  </span>

                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {item.confidence}% Confidence
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">{item.snippet}</p>

                {item.potentialValue && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                      Earning Potential:
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {item.potentialValue}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">{item.sourceDomain}</span>

                {item.category === "OPPORTUNITY" ? (
                  <Link
                    href="/missions"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-all"
                  >
                    Step-by-Step Mission <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold flex items-center gap-1 transition-all"
                  >
                    Access Free <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
