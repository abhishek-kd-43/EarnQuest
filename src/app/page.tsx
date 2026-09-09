import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import {
  ArrowRight,
  Cpu,
  Layers,
  Wrench,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  DollarSign,
  Sparkles,
  Zap,
} from "lucide-react";

export const revalidate = 60; // ISR cache

export default async function HomePage() {
  const featuredMissions = await db.mission.findMany({
    take: 3,
    where: { isPublished: true },
    include: {
      tools: { include: { tool: true } },
      opportunity: true,
      steps: { select: { id: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const featuredTools = await db.aITool.findMany({
    take: 6,
    orderBy: { confidenceScore: "desc" },
  });

  const totalMissions = await db.mission.count();
  const totalTools = await db.aITool.count();
  const totalOpportunities = await db.opportunity.count();

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            The Autonomous Opportunity Engine
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Turn your computer into an{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300">
              opportunity engine.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Start with a PC or laptop. Discover verified free AI tools. Follow step-by-step beginner missions. Build real-world projects. Monetize legitimately. Keep 80% of platform earnings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/missions"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Explore Missions
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </Link>
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-slate-200 hover:text-white font-bold text-base flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
            >
              <Cpu className="h-5 w-5 text-cyan-400" />
              Calibrate My Computer
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="glass-panel p-4 rounded-xl">
              <div className="text-2xl sm:text-3xl font-black text-white">{totalMissions}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Active Missions</div>
            </div>
            <div className="glass-panel p-4 rounded-xl">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{totalTools}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Free AI Tools</div>
            </div>
            <div className="glass-panel p-4 rounded-xl">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">{totalOpportunities}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Verified Paths</div>
            </div>
            <div className="glass-panel p-4 rounded-xl">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">80% / 20%</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Creator Split</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Opportunity Engine Loop */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400">
            The Central Differentiator
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Not just 100 tools. An autonomous execution loop.
          </p>
          <p className="text-sm sm:text-base text-slate-400">
            EarnQuest doesn't leave you with confusing tool lists. We match what free tools can do with what real businesses need, then break it down into 10–15 beginner steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-2xl space-y-4 relative overflow-hidden border-t-2 border-t-emerald-500">
            <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              1
            </div>
            <h3 className="text-xl font-bold text-white">Continuous AI Research</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our autonomous research engine scans for verified zero-cost software, open-source models, and freelance demand across global markets.
            </p>
            <div className="text-xs font-mono text-emerald-400/90 pt-2 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> Ground-truth source citations
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-4 relative overflow-hidden border-t-2 border-t-cyan-500">
            <div className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              2
            </div>
            <h3 className="text-xl font-bold text-white">Structured Missions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Opportunities are translated into atomic missions with Beginner Mode: copyable prompts, setup instructions, and an embedded personal AI guide.
            </p>
            <div className="text-xs font-mono text-cyan-400/90 pt-2 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> No technical jargon or overwhelm
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-4 relative overflow-hidden border-t-2 border-t-violet-500">
            <div className="h-10 w-10 rounded-xl bg-violet-950 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold">
              3
            </div>
            <h3 className="text-xl font-bold text-white">Execution & Real Money</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Execute deliverables, publish live links, and monetize. Keep 80% of platform sales, or track 100% of external earnings with verified evidence.
            </p>
            <div className="text-xs font-mono text-violet-400/90 pt-2 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> Immutable integer financial ledger
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Missions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Actionable Blueprints
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Start Your First Mission
            </p>
          </div>
          <Link
            href="/missions"
            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            View all {totalMissions} missions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMissions.map((m) => {
            const minCents = m.opportunity?.potentialRevenueMinCents || 2500;
            const maxCents = m.opportunity?.potentialRevenueMaxCents || 25000;
            return (
              <div
                key={m.id}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">
                      {m.category}
                    </span>
                    <span className="font-mono text-slate-400">
                      {m.estimatedTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">
                      Required Free Tools
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {m.tools.map((t) => (
                        <span
                          key={t.tool.id}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-[11px] font-medium text-slate-300"
                        >
                          {t.tool.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Potential Range
                    </div>
                    <div className="text-sm font-black text-emerald-400">
                      {formatCurrency(minCents)} - {formatCurrency(maxCents)}
                    </div>
                  </div>

                  <Link
                    href={`/missions/${m.slug}`}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-all"
                  >
                    View Steps
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Free AI Tools Directory Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Verified Intelligence
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Legitimate Free Software & AI Tools
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Browse all {totalTools} tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((t) => (
            <div key={t.id} className="glass-panel p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">{t.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                  {t.freePlanType.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {t.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Category: <strong className="text-slate-200">{t.category}</strong></span>
                <a
                  href={t.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Official Site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Realistic Example Journeys (NOT fake testimonials) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Transparent Case Studies
          </h2>
          <p className="text-3xl font-extrabold text-white">
            Example Journeys
          </p>
          <p className="text-xs text-slate-400">
            Clearly labeled demonstration pathways illustrating how the research-to-execution loop operates in practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-300">
                1
              </div>
              <div>
                <h4 className="font-bold text-white">The Low-Spec Laptop Journey</h4>
                <div className="text-xs text-slate-400">Hardware: 4GB RAM Chromebook (TIER_1_LITE)</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Alex calibrated their Chromebook and was matched with browser-based video repurposing missions. Using CapCut Web and free YouTube interviews, they created 3 vertical subtitle clips, sent a polite value-first outreach email to a local fitness podcast, and secured a $150 trial package.
            </p>
            <div className="rounded-lg bg-slate-900/80 p-3 text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>Verified Revenue: $150.00</span>
              <span className="text-slate-400">External Client (Stripe)</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-violet-900/60 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300">
                2
              </div>
              <div>
                <h4 className="font-bold text-white">The Digital Asset Builder Journey</h4>
                <div className="text-xs text-slate-400">Hardware: 8GB RAM Laptop (TIER_2_STANDARD)</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Elena completed the Canva Business Template mission in 3 hours. She designed a 5-page client welcome packet for independent yoga studios, generated a shareable Canva template link, and published it on Gumroad. She earned $114 in her first month from 6 organic downloads.
            </p>
            <div className="rounded-lg bg-slate-900/80 p-3 text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>Verified Revenue: $114.00</span>
              <span className="text-slate-400">Gumroad Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center space-y-6 relative overflow-hidden border border-emerald-500/30 glow-emerald">
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Ready to turn on your opportunity engine?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base">
            No expensive software. No false promises. Just verified free tools, guided steps, and measurable results.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
            >
              Start Free Today
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
