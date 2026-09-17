"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Layers, Wrench, TrendingUp, Sparkles, ArrowRight, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

type ResultType = { type: "mission" | "tool" | "opportunity"; data: any };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const [missionsRes, toolsRes, oppsRes] = await Promise.all([
        fetch(`/api/missions?search=${encodeURIComponent(q)}&limit=5`),
        fetch(`/api/tools?search=${encodeURIComponent(q)}&limit=5`),
        fetch(`/api/opportunities?search=${encodeURIComponent(q)}&limit=5`),
      ]);
      const [missionsData, toolsData, oppsData] = await Promise.all([
        missionsRes.json(),
        toolsRes.json(),
        oppsRes.json(),
      ]);
      const combined: ResultType[] = [
        ...(missionsData.missions || []).map((d: any) => ({ type: "mission" as const, data: d })),
        ...(toolsData.tools || []).map((d: any) => ({ type: "tool" as const, data: d })),
        ...(oppsData.opportunities || []).map((d: any) => ({ type: "opportunity" as const, data: d })),
      ];
      setResults(combined);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => runSearch(query), 350);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  const missions = results.filter((r) => r.type === "mission");
  const tools = results.filter((r) => r.type === "tool");
  const opps = results.filter((r) => r.type === "opportunity");

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Search EarnQuest</h1>
        <p className="text-sm text-slate-400">Search across missions, free AI tools, and opportunities.</p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="e.g. video editing, canva, SEO writing, transcription..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-base shadow-lg"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-slate-400 animate-pulse">Searching...</div>
      )}

      {/* Results */}
      {!loading && searched && results.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-3xl space-y-4">
          <Sparkles className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-white font-bold text-lg">No results for "{query}"</p>
          <p className="text-sm text-slate-400">Try broader keywords or explore by category below.</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {["writing", "design", "coding", "research", "video", "automation"].map((tag) => (
              <button key={tag} onClick={() => setQuery(tag)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 font-semibold transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-10">
          {/* Missions */}
          {missions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-emerald-400" /> Missions
                <span className="text-sm font-normal text-slate-400 ml-1">({missions.length})</span>
              </h2>
              <div className="space-y-3">
                {missions.map(({ data: m }) => (
                  <Link key={m.id} href={`/missions/${m.slug}`}
                    className="glass-panel-hover p-5 rounded-2xl flex items-center justify-between group">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{m.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {m.estimatedTime}
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-emerald-400 uppercase">{m.category}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tools */}
          {tools.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-cyan-400" /> Free AI Tools
                <span className="text-sm font-normal text-slate-400 ml-1">({tools.length})</span>
              </h2>
              <div className="space-y-3">
                {tools.map(({ data: t }) => (
                  <Link key={t.id} href={`/tools/${t.slug}`}
                    className="glass-panel-hover p-5 rounded-2xl flex items-center justify-between group">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{t.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-cyan-400 uppercase">{t.category}</span>
                        <span className={`text-[10px] font-mono font-bold ${
                          t.freePlanType === "FREE" || t.freePlanType === "OPEN_SOURCE"
                            ? "text-emerald-400" : "text-amber-400"
                        }`}>{t.freePlanType?.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Opportunities */}
          {opps.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-400" /> Opportunities
                <span className="text-sm font-normal text-slate-400 ml-1">({opps.length})</span>
              </h2>
              <div className="space-y-3">
                {opps.map(({ data: o }) => (
                  <Link key={o.id} href={`/opportunities/${o.slug}`}
                    className="glass-panel-hover p-5 rounded-2xl flex items-center justify-between group">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{o.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-amber-400 uppercase">{o.category}</span>
                        <span className="text-emerald-400 font-mono font-bold text-[10px]">
                          Potential {formatCurrency(o.potentialRevenueMinCents)}–{formatCurrency(o.potentialRevenueMaxCents)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Browse CTA when not searching */}
      {!searched && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {[
            { label: "Browse Missions", href: "/missions", icon: Layers, color: "emerald" },
            { label: "Browse Tools", href: "/tools", icon: Wrench, color: "cyan" },
            { label: "Browse Opportunities", href: "/opportunities", icon: TrendingUp, color: "amber" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className={`glass-panel-hover p-5 rounded-2xl flex items-center gap-3 border border-slate-800 hover:border-${item.color}-500/30 group transition-all`}>
                <Icon className={`h-6 w-6 text-${item.color}-400`} />
                <span className={`font-bold text-slate-200 group-hover:text-${item.color}-400 transition-colors`}>{item.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white ml-auto transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
