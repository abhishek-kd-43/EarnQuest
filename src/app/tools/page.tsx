"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink, ShieldCheck, Filter, Wrench, CheckCircle } from "lucide-react";

export default function ToolsDirectoryPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");

  const categories = ["All", "Audio", "Design", "Coding", "Web", "Video", "Automation"];
  const tiers = ["All", "OPEN_SOURCE", "FREE", "FREEMIUM", "FREE_WITH_LIMITS"];

  useEffect(() => {
    fetchTools();
  }, [selectedCategory, selectedTier, search]);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (selectedTier !== "All") params.set("freePlanType", selectedTier);
      if (search) params.set("search", search);

      const res = await fetch(`/api/tools?${params.toString()}`);
      const data = await res.json();
      setTools(data.tools || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          Verified Repository
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Free AI Tools & Open-Source Directory
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Every tool cataloged here is verified for real free tiers, commercial use permissions, and platform requirements. Never pay upfront for software.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by tool name or capability (e.g., audio, Ollama, video editor)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === c
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Pricing Tiers */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Free Type:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {tiers.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading verified tools...</div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl space-y-2">
          <p className="text-white font-bold">No tools found matching your criteria</p>
          <p className="text-xs text-slate-400">Try clearing your filters or searching for another keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t) => (
            <div
              key={t.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-white">{t.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    {t.freePlanType.replace(/_/g, " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {t.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Category:</span>
                    <strong className="text-slate-200">{t.category}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Commercial Use:</span>
                    <span className="text-emerald-400 font-medium truncate max-w-[180px]">
                      {t.commercialUse || "Allowed"}
                    </span>
                  </div>
                  {t.limitations && (
                    <div className="text-slate-400 pt-1">
                      <span className="text-amber-400/90 font-semibold">Limits: </span>
                      {t.limitations}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Score: {t.confidenceScore}%
                </span>

                <a
                  href={t.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 transition-colors"
                >
                  Official Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
