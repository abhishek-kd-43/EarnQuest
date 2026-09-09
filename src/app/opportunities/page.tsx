"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "FREELANCE", "CREATE", "BUILD", "AUTOMATE", "CONTENT", "MARKETING"];

  useEffect(() => {
    fetchOpps();
  }, [selectedCategory]);

  const fetchOpps = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const data = await res.json();
      setOpportunities(data.opportunities || []);
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
        <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Market Intelligence
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Opportunity Explorer
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Algorithmic evaluations matching free tool capabilities with active customer demand. Every opportunity includes transparent Opportunity, Risk, and Confidence scores.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === c
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading opportunities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((o) => (
            <div
              key={o.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-[11px] font-semibold text-cyan-300 uppercase tracking-wide">
                    {o.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Est. {o.estimatedHoursMin}-{o.estimatedHoursMax} hrs
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{o.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{o.description}</p>

                {/* Problem & Market */}
                <div className="rounded-xl bg-slate-900/60 p-3.5 space-y-2 text-xs border border-slate-800/80">
                  <div>
                    <span className="font-semibold text-slate-300">Target Customers: </span>
                    <span className="text-slate-400">{o.targetMarket}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">Customer Problem: </span>
                    <span className="text-slate-400">{o.customerProblem}</span>
                  </div>
                </div>

                {/* Score Pills */}
                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <div className="text-lg font-black text-emerald-400">{o.opportunityScore}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Opp Score</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <div className="text-lg font-black text-amber-400">{o.riskScore}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Risk Score</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2.5 border border-slate-800">
                    <div className="text-lg font-black text-cyan-400">{o.confidenceScore}%</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Confidence</div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Potential Earning Range
                  </div>
                  <div className="text-sm font-black text-emerald-400">
                    {formatCurrency(o.potentialRevenueMinCents)} - {formatCurrency(o.potentialRevenueMaxCents)}
                  </div>
                </div>

                {o.missions && o.missions.length > 0 ? (
                  <Link
                    href={`/missions/${o.missions[0].slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    Start Mission <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href="/missions"
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Explore Missions
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
