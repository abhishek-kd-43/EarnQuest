import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import {
  ArrowRight,
  Cpu,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Check,
  Globe,
  Search,
  Pen,
  Code,
  Image,
  Film,
  BarChart3,
  Bot,
  Headphones,
  BookOpen,
  AlertCircle,
  Star,
} from "lucide-react";
import { OpportunityMatcher } from "@/components/OpportunityMatcher";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const revalidate = 60;

const WORK_CATEGORIES = [
  { icon: Pen, label: "Writing & Content", color: "emerald", desc: "Blog posts, product descriptions, email copy" },
  { icon: Image, label: "Design & Graphics", color: "cyan", desc: "Social media visuals, logos, presentations" },
  { icon: Code, label: "Coding & Web", color: "violet", desc: "Websites, tools, automation scripts" },
  { icon: Search, label: "Research & Data", color: "amber", desc: "Market research, data summaries, analysis" },
  { icon: Film, label: "Video & Audio", color: "rose", desc: "Subtitles, voiceovers, video editing" },
  { icon: BarChart3, label: "Spreadsheets & Reports", color: "blue", desc: "Data cleanup, dashboards, reports" },
  { icon: Bot, label: "AI Workflows", color: "purple", desc: "Automation, chatbots, AI pipelines" },
  { icon: Headphones, label: "Virtual Assistance", color: "orange", desc: "Admin tasks, customer support, scheduling" },
];

export default async function HomePage() {
  const featuredMissions = await db.mission.findMany({
    take: 6,
    where: { isPublished: true },
    include: {
      tools: { include: { tool: true } },
      opportunity: true,
      steps: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const featuredTools = await db.aITool.findMany({
    take: 8,
    orderBy: { confidenceScore: "desc" },
  });

  const featuredOpportunities = await db.opportunity.findMany({
    take: 3,
    where: { status: "ACTIVE", beginnerFriendly: true },
    include: { missions: { take: 1 } },
    orderBy: { opportunityScore: "desc" },
  });

  const totalMissions = await db.mission.count();
  const totalTools = await db.aITool.count();
  const totalOpportunities = await db.opportunity.count();

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. Live Ticker — labelled as "Potential" */}
      <div className="w-full bg-slate-900/90 border-b border-slate-800 py-2.5 px-4 overflow-hidden">
        <div className="ticker-wrapper">
          <div className="ticker-content text-[11px] text-slate-300">
            <span>🔥 <strong className="text-white">YouTube Subtitling:</strong> Potential $30–$120 / project</span>
            <span>⚡ <strong className="text-white">Local SEO Services:</strong> Potential $350 / client/mo</span>
            <span>💎 <strong className="text-white">Canva Template Packs:</strong> Potential $25 / sale</span>
            <span>🛡️ <strong className="text-cyan-400">{totalTools} Free Tools Cataloged</strong></span>
            <span>📊 <strong className="text-emerald-400">{totalOpportunities} Opportunities Indexed</strong></span>
            <span>🚀 <strong className="text-white">E-Commerce Image Cleanup:</strong> Potential $20–$80 / batch</span>
            {/* Duplicate for seamless loop */}
            <span>🔥 <strong className="text-white">YouTube Subtitling:</strong> Potential $30–$120 / project</span>
            <span>⚡ <strong className="text-white">Local SEO Services:</strong> Potential $350 / client/mo</span>
            <span>💎 <strong className="text-white">Canva Template Packs:</strong> Potential $25 / sale</span>
            <span>🛡️ <strong className="text-cyan-400">{totalTools} Free Tools Cataloged</strong></span>
            <span>📊 <strong className="text-emerald-400">{totalOpportunities} Opportunities Indexed</strong></span>
            <span>🚀 <strong className="text-white">E-Commerce Image Cleanup:</strong> Potential $20–$80 / batch</span>
          </div>
        </div>
      </div>

      {/* 2. HERO */}
      <section className="relative pt-8 pb-4">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center relative z-10 space-y-8">
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            AI Work Discovery + Guided Execution Platform
          </div>

          <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Turn Free AI Into{" "}
            <span className="shimmer-text">
              Useful Work.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Discover real opportunities, learn which free AI tools can help, and follow a step-by-step guide to complete the work. Start with just a PC and internet connection.
          </p>

          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="#opportunity-matcher"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 animate-pulse-glow"
            >
              <Zap className="h-5 w-5 fill-slate-950" />
              Find Work I Can Do
            </a>
            <Link
              href="/start-from-zero"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel text-slate-200 hover:text-white font-bold text-base flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
            >
              <BookOpen className="h-5 w-5 text-cyan-400" />
              I Have No Skills
            </Link>
          </div>

          {/* Metrics Bar */}
          <div className="animate-fade-in-up delay-400 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
              <AnimatedCounter value={totalMissions} className="text-2xl sm:text-3xl font-black text-white" />
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Guided Missions</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <AnimatedCounter value={totalTools} className="text-2xl sm:text-3xl font-black text-emerald-400" />
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Free Tools & APIs</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
              <AnimatedCounter value={totalOpportunities} className="text-2xl sm:text-3xl font-black text-cyan-400" />
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Opportunities Indexed</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/30 transition-colors">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
              <div className="text-xs text-slate-400 uppercase font-semibold mt-1">Free Tools Only</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            The Core Loop
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Find Work. Use Free AI. Follow the Guide. Get Paid.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            A complete system from discovering real work to producing a deliverable — using only free AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              num: "01",
              title: "Find Real Work",
              desc: "Browse verified opportunities: freelance gigs, micro-tasks, content work, coding projects, research tasks, and more.",
              tag: "Real opportunities with sources",
              color: "cyan",
              href: "/opportunities",
            },
            {
              num: "02",
              title: "Choose Free AI Tools",
              desc: "We match each opportunity with free AI tools that can help. Every tool has a genuine free tier — no credit card tricks.",
              tag: "Verified free tools only",
              color: "emerald",
              href: "/tools",
            },
            {
              num: "03",
              title: "Follow the Guide",
              desc: "Step-by-step interactive missions with copy-paste prompts, quality checklists, and an AI guide you can ask questions.",
              tag: "Beginner-friendly steps",
              color: "violet",
              href: "/missions",
            },
            {
              num: "04",
              title: "Submit & Track",
              desc: "Deliver to the actual client or platform. Record your result. Build a portfolio. Find your next opportunity.",
              tag: "You keep what you earn",
              color: "amber",
              href: "/dashboard",
            },
          ].map((step, i) => (
            <Link
              key={step.num}
              href={step.href}
              className={`animate-fade-in-up delay-${(i + 1) * 100} glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 relative group hover:border-${step.color}-500/40 transition-all hover:-translate-y-1`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${step.color}-500/10 text-${step.color}-400 font-black font-mono text-lg border border-${step.color}-500/30`}>
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {step.desc}
              </p>
              <div className={`pt-2 text-xs font-semibold text-${step.color}-400 flex items-center gap-1`}>
                <Check className="h-3.5 w-3.5" /> {step.tag}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Interactive Opportunity Matcher */}
      <section id="opportunity-matcher" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <OpportunityMatcher />
      </section>

      {/* 5. What can you do with free AI? */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-violet-950 border border-violet-500/30 text-violet-400 text-xs font-bold uppercase tracking-wider">
            Work Categories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What Can You Actually Do With Free AI?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            These are real categories of work where free AI tools can assist. Click any category to find relevant opportunities and guides.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {WORK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={`/opportunities?category=${encodeURIComponent(cat.label)}`}
                className="glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-3 group cursor-pointer"
              >
                <div className={`h-10 w-10 rounded-xl bg-${cat.color}-500/10 border border-${cat.color}-500/20 flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 text-${cat.color}-400`} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{cat.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{cat.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Today's Opportunities — sourced & verified */}
      {featuredOpportunities.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                Sourced & Indexed
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-2">
                Featured Opportunities
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Real work categories with guided AI workflows. Potential compensation shown — actual results vary.
              </p>
            </div>
            <Link
              href="/opportunities"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-1.5 transition-all"
            >
              View All {totalOpportunities} Opportunities <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOpportunities.map((o) => {
              const statusColor =
                o.verificationStatus === "VERIFIED" ? "emerald" :
                o.verificationStatus === "RECENTLY_CHECKED" ? "cyan" :
                "slate";
              const statusLabel =
                o.verificationStatus === "VERIFIED" ? "Verified" :
                o.verificationStatus === "RECENTLY_CHECKED" ? "Recently Checked" :
                "Unverified";

              return (
                <div key={o.id} className="glass-card-interactive p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
                        {o.category}
                      </span>
                      <span className={`flex items-center gap-1 text-[10px] font-semibold text-${statusColor}-400`}>
                        <CheckCircle2 className="h-3 w-3" /> {statusLabel}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white leading-snug">{o.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{o.description}</p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {o.beginnerFriendly && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700/40 text-[10px] text-emerald-400 font-semibold">Beginner OK</span>
                      )}
                      {o.remote && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/40 text-[10px] text-slate-300 font-semibold">Remote</span>
                      )}
                      <span className={`px-2 py-0.5 rounded bg-slate-800 border border-slate-700/40 text-[10px] font-semibold ${
                        o.aiAssistanceLevel === "FULL" ? "text-violet-400" :
                        o.aiAssistanceLevel === "PARTIAL" ? "text-cyan-400" : "text-slate-400"
                      }`}>
                        AI: {o.aiAssistanceLevel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Potential Earning</div>
                      <div className="text-sm font-black text-emerald-400">
                        {formatCurrency(o.potentialRevenueMinCents)} – {formatCurrency(o.potentialRevenueMaxCents)}
                      </div>
                    </div>
                    {o.missions && o.missions.length > 0 ? (
                      <Link
                        href={`/missions/${o.missions[0].slug}`}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        Start Guide <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href={`/opportunities/${o.slug}`}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        View Detail <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Featured Missions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Step-by-Step Blueprints
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-2">
              Guided Missions
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Structured workflows with copy-paste prompts, AI help, and quality checklists. Complete one step at a time.
            </p>
          </div>
          <Link
            href="/missions"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-1.5 transition-all"
          >
            View All {totalMissions} Missions <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMissions.map((m) => (
            <div
              key={m.id}
              className="glass-card-interactive p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {m.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                    {m.hardwareTier}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{m.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {m.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Potential Compensation:
                  </div>
                  <div className="text-emerald-400 font-mono font-bold text-sm">
                    {m.potentialMonetization}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {m.estimatedTime}
                  </span>
                  <span>{m.steps.length} guided steps</span>
                </div>

                <Link
                  href={`/missions/${m.slug}`}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                >
                  Start Mission <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Free Tools Highlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Verified Free Tiers
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight mt-2">
              Free AI Tools & APIs
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Every tool here has a genuine free tier. We distinguish: FREE vs FREE TIER vs FREEMIUM vs OPEN SOURCE.
            </p>
          </div>
          <Link
            href="/tools"
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-1.5 transition-all"
          >
            Browse All {totalTools} Tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((t) => (
            <Link
              key={t.id}
              href={`/tools/${t.slug}`}
              className="glass-panel-hover p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-400 uppercase">
                    {t.category}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    t.freePlanType === "FREE" || t.freePlanType === "OPEN_SOURCE"
                      ? "text-emerald-400 bg-emerald-950/50"
                      : t.freePlanType === "FREE_WITH_LIMITS" || t.freePlanType === "FREEMIUM"
                      ? "text-amber-400 bg-amber-950/50"
                      : "text-cyan-400 bg-cyan-950/50"
                  }`}>
                    {t.freePlanType.replace(/_/g, " ")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{t.name}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono">{t.confidenceScore}% verified</span>
                <span className="text-cyan-400 flex items-center gap-1 text-[11px] font-semibold">
                  View Details <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Zero Skill CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="h-4 w-4" /> Start From Absolute Zero
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                "I Don't Have Any Skills."
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                That's exactly who EarnQuest is built for. You don't need experience — you need a starting point. Our zero-skill path takes you from "I know nothing" to your first completed piece of work, step by step.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                {["Start with what you have", "Learn one skill at a time with AI", "Practice with a guided project", "Find beginner-appropriate work", "Build a portfolio as you go"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link
                href="/start-from-zero"
                className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Start From Zero <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/missions"
                className="px-8 py-4 rounded-2xl glass-panel text-slate-200 font-bold text-base flex items-center justify-center gap-2 hover:border-slate-600 transition-all"
              >
                Browse All Missions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Trust & Safety Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8 glow-emerald">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Trust & Safety Commitment
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Zero Tolerance for Scams, Spam, or Fraud
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              EarnQuest strictly rejects automated bot traffic, fake reviews, copyright piracy, or high-risk schemes. Every opportunity has a source. Every AI tool has been verified for genuine free access. Every workflow teaches you to review AI output — never blindly submit.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                "All opportunities have a verified source",
                "Free tier status independently checked",
                "Human review required in every guide",
                "No guaranteed income claims ever",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/trust"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-700"
            >
              Trust & Safety Center
            </Link>
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Important Disclaimer */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-300">Important:</strong> Potential compensation figures shown throughout EarnQuest represent market rates observed from public sources (Upwork, Fiverr, Gumroad, etc.) and are not guarantees of income. Finding work ≠ getting hired. Completing work ≠ guaranteed payment unless confirmed by the paying platform or client. AI assistance ≠ guaranteed income. Results depend on individual effort, skill, market conditions, and client availability. EarnQuest does not process payments between you and clients — we connect you with real opportunities and guide you through completing the work.
          </div>
        </div>
      </section>
    </div>
  );
}
