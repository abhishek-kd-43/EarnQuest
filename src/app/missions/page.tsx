import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import { ArrowRight, Layers, Cpu, CheckCircle2, Clock, Wrench } from "lucide-react";

export const revalidate = 60;

export default async function MissionsCatalogPage() {
  const missions = await db.mission.findMany({
    where: { isPublished: true },
    include: {
      tools: { include: { tool: true } },
      opportunity: true,
      steps: { select: { id: true, stepNumber: true, title: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          Action Blueprints
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          All Guided Missions
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Step-by-step missions taking you from tool setup to deliverable creation and client outreach. No upfront capital required.
        </p>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((m) => {
          const minCents = m.opportunity?.potentialRevenueMinCents || 2500;
          const maxCents = m.opportunity?.potentialRevenueMaxCents || 25000;

          return (
            <div
              key={m.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
                    {m.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                    <Clock className="h-3 w-3" /> {m.estimatedTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {m.description}
                </p>

                {/* Hardware Tier Tag */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Environment:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 font-mono text-emerald-400">
                    {m.hardwareTier}
                  </span>
                </div>

                {/* Free Tools */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    Free Tools Required
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.tools.map((t) => (
                      <span
                        key={t.tool.id}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[10px] font-medium text-slate-300"
                      >
                        {t.tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Potential Revenue
                  </div>
                  <div className="text-sm font-black text-emerald-400">
                    {formatCurrency(minCents)} - {formatCurrency(maxCents)}
                  </div>
                </div>

                <Link
                  href={`/missions/${m.slug}`}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                >
                  Start Mission <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
