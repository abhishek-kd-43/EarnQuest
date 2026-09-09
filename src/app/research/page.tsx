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
} from "lucide-react";

export default function ResearchPage() {
  const [items, setItems] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
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
      const res = await fetch("/api/research/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: "Latest free AI models, free coding tools, and remote freelance earnings",
        }),
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
              Real-Time Ingestion Engine
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Autonomous Daily Research Scanner
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              EarnQuest continuously monitors public web registries, developer forums, and open-source model releases
              to discover <strong>new free AI tools, free APIs, and verified monetization strategies</strong> you can operate from your PC.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <button
              onClick={handleRunScan}
              disabled={scanning}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning Public Web..." : "Run Live Web Scan"}
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry: Updated today at {lastScanAt || "live"}</span>
            </div>
          </div>
        </div>

        {scanMessage && (
          <div className="mt-6 p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{scanMessage}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "ALL", label: "All Discoveries" },
            { id: "TOOL", label: "Free AI Tools" },
            { id: "API", label: "Free APIs" },
            { id: "IDE", label: "Cloud & AI IDEs" },
            { id: "OPPORTUNITY", label: "Market Gigs & B2B" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Showing {filteredItems.length} verified findings
        </div>
      </div>

      {/* Feed Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading daily research findings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.freePlanType && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                        {item.freePlanType}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {item.confidence}% Verified
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                {item.potentialValue && (
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2 text-xs">
                    <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-400">Monetization Earning Potential:</span>
                    <strong className="text-emerald-400 font-mono font-semibold">{item.potentialValue}</strong>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {item.sourceDomain} <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex gap-2">
                  <Link
                    href="/keys-setup"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-200"
                  >
                    Setup Tool
                  </Link>
                  <Link
                    href="/missions"
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-[11px] font-bold text-cyan-400 flex items-center gap-1"
                  >
                    Missions <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Log / Scan Run History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Autonomous Scan Job History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Job ID</th>
                <th className="pb-2 font-medium">Query Scanned</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Items Discovered</th>
                <th className="pb-2 font-medium">Scanned At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 text-slate-500">{j.id.slice(0, 8)}...</td>
                  <td className="py-2.5 font-sans">{j.query}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-sans font-bold text-[10px]">
                      {j.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-cyan-400 font-bold">{j.itemsFound} items</td>
                  <td className="py-2.5 font-sans text-slate-400">{new Date(j.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
