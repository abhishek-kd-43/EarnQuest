"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import {
  Search,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Globe,
  Bot,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const CATEGORIES = ["All", "FREELANCE", "CREATE", "BUILD", "AUTOMATE", "CONTENT", "MARKETING", "ECOMMERCE"];

const FILTER_PRESETS = [
  { label: "Beginner", key: "beginnerFriendly", value: "true" },
  { label: "Remote Only", key: "remote", value: "true" },
  { label: "AI: Full Assist", key: "aiAssistanceLevel", value: "FULL" },
  { label: "AI: Partial", key: "aiAssistanceLevel", value: "PARTIAL" },
  { label: "Quick Tasks (<4h)", key: "maxHours", value: "4" },
  { label: "Verified Only", key: "verificationStatus", value: "VERIFIED" },
];

function VerificationBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string }> = {
    VERIFIED: { label: "Verified", color: "text-emerald-400" },
    RECENTLY_CHECKED: { label: "Checked", color: "text-cyan-400" },
    NEEDS_REVIEW: { label: "Needs Review", color: "text-amber-400" },
    UNVERIFIED: { label: "Unverified", color: "text-slate-500" },
    EXPIRED: { label: "Expired", color: "text-red-400" },
  };
  const cfg = configs[status] || configs["UNVERIFIED"];
  return (
    <span className={`flex items-center gap-1 text-[10px] font-semibold ${cfg.color}`}>
      <CheckCircle2 className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [total, setTotal] = useState(0);

  const fetchOpps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (search) params.set("search", search);
      Object.entries(activeFilters).forEach(([k, v]) => params.set(k, v));
      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await res.json();
      setOpportunities(data.opportunities || []);
      setTotal(data.total || data.opportunities?.length || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search, activeFilters]);

  useEffect(() => {
    const timer = setTimeout(fetchOpps, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchOpps, search]);

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (next[key] === value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Real Work. Real Sources.
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Find Work You Can Actually Do
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Every opportunity is sourced from real platforms and marketplaces. We show potential compensation ranges — not guarantees. Results depend on your effort and client availability.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="glass-panel p-6 rounded-2xl space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search opportunities (e.g. video editing, data entry, web design)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Quick filter presets */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Quick Filters:
          </span>
          {FILTER_PRESETS.map((f) => {
            const isActive = activeFilters[f.key] === f.value;
            return (
              <button
                key={`${f.key}-${f.value}`}
                onClick={() => toggleFilter(f.key, f.value)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="text-sm text-slate-400">
          Showing <strong className="text-white">{opportunities.length}</strong> opportunities
          {search && <> matching "<span className="text-emerald-400">{search}</span>"</>}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-shimmer h-72 rounded-3xl" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl space-y-4">
          <Sparkles className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-white font-bold text-lg">No opportunities found</p>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">Try clearing filters or adjusting your search. More opportunities are added regularly.</p>
          <button
            onClick={() => { setSearch(""); setSelectedCategory("All"); setActiveFilters({}); }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-300 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((o, idx) => (
            <div
              key={o.id}
              className="glass-panel glass-panel-hover p-6 rounded-3xl flex flex-col justify-between space-y-5 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="space-y-4">
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
                    {o.category}
                  </span>
                  <VerificationBadge status={o.verificationStatus || "UNVERIFIED"} />
                </div>

                <h3 className="text-xl font-bold text-white">{o.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{o.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {o.beginnerFriendly && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/40 text-[10px] font-bold text-emerald-400">
                      Beginner OK
                    </span>
                  )}
                  {o.remote && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/40 text-[10px] font-bold text-slate-300 flex items-center gap-0.5">
                      <Globe className="h-2.5 w-2.5" /> Remote
                    </span>
                  )}
                  {o.aiAssistanceLevel && (
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-0.5 ${
                      o.aiAssistanceLevel === "FULL"
                        ? "bg-violet-950 border-violet-700/40 text-violet-400"
                        : o.aiAssistanceLevel === "PARTIAL"
                        ? "bg-cyan-950 border-cyan-700/40 text-cyan-400"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}>
                      <Bot className="h-2.5 w-2.5" /> AI: {o.aiAssistanceLevel}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/40 text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> {o.estimatedHoursMin}–{o.estimatedHoursMax}h
                  </span>
                </div>

                {/* Client info */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div>
                    <span className="font-semibold text-slate-400">Clients: </span>
                    <span className="text-slate-300">{o.targetMarket}</span>
                  </div>
                </div>

                {/* Scores row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Opportunity", value: o.opportunityScore, color: "emerald" },
                    { label: "Risk", value: o.riskScore, color: "amber" },
                    { label: "Confidence", value: o.confidenceScore, color: "cyan" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-slate-900 p-2 border border-slate-800">
                      <div className={`text-base font-black text-${s.color}-400`}>{s.value}</div>
                      <div className="text-[9px] uppercase font-bold text-slate-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Potential Earning</div>
                  <div className="text-sm font-black text-emerald-400">
                    {formatCurrency(o.potentialRevenueMinCents)} – {formatCurrency(o.potentialRevenueMaxCents)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/opportunities/${o.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    Details
                  </Link>
                  {o.missions && o.missions.length > 0 ? (
                    <Link
                      href={`/missions/${o.missions[0].slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                    >
                      Start Guide <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/missions"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                    >
                      View Missions
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          Potential earnings shown are ranges observed from public market sources (Upwork, Fiverr, Gumroad, etc.). They are <strong className="text-slate-300">not guarantees</strong>.
          Individual results depend on skill level, effort, market conditions, and client decisions. EarnQuest does not process payments — we help you find and complete real work.
        </div>
      </div>
    </div>
  );
}
