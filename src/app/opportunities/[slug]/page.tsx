import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Users,
  Zap,
  Wrench,
  BookOpen,
  AlertCircle,
  Star,
  Bot,
} from "lucide-react";

export const revalidate = 300;

export async function generateStaticParams() {
  const opps = await db.opportunity.findMany({ select: { slug: true } });
  return opps.map((o) => ({ slug: o.slug }));
}

function VerificationBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    VERIFIED: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-700/40", icon: ShieldCheck },
    RECENTLY_CHECKED: { label: "Recently Checked", color: "text-cyan-400", bg: "bg-cyan-950/60 border-cyan-700/40", icon: CheckCircle2 },
    NEEDS_REVIEW: { label: "Needs Review", color: "text-amber-400", bg: "bg-amber-950/60 border-amber-700/40", icon: AlertTriangle },
    UNVERIFIED: { label: "Unverified", color: "text-slate-400", bg: "bg-slate-900 border-slate-700", icon: AlertCircle },
    EXPIRED: { label: "Expired", color: "text-red-400", bg: "bg-red-950/60 border-red-700/40", icon: AlertCircle },
  };
  const cfg = configs[status] || configs["UNVERIFIED"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.color} ${cfg.bg}`}>
      <Icon className="h-3.5 w-3.5" /> {cfg.label}
    </span>
  );
}

export default async function OpportunityDetailPage({ params }: { params: { slug: string } }) {
  const opportunity = await db.opportunity.findUnique({
    where: { slug: params.slug },
    include: {
      sources: true,
      scores: true,
      missions: {
        where: { isPublished: true },
        include: {
          steps: { select: { id: true } },
          tools: { include: { tool: true } },
        },
        take: 3,
      },
    },
  });

  if (!opportunity) notFound();

  const primaryMission = opportunity.missions[0] ?? null;
  const aiLevelColors: Record<string, string> = {
    FULL: "text-violet-400 bg-violet-950/60 border-violet-700/40",
    PARTIAL: "text-cyan-400 bg-cyan-950/60 border-cyan-700/40",
    MINIMAL: "text-slate-400 bg-slate-900 border-slate-700",
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back link */}
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Opportunities
      </Link>

      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-300 uppercase tracking-wide">
            {opportunity.category}
          </span>
          <VerificationBadge status={opportunity.verificationStatus} />
          {opportunity.beginnerFriendly && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/40 text-[10px] font-bold text-emerald-400">
              Beginner Friendly
            </span>
          )}
          {opportunity.remote && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700/40 text-[10px] font-bold text-slate-300">
              <Globe className="inline h-2.5 w-2.5 mr-0.5" /> Remote
            </span>
          )}
          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${aiLevelColors[opportunity.aiAssistanceLevel]}`}>
            <Bot className="inline h-2.5 w-2.5 mr-0.5" /> AI Assistance: {opportunity.aiAssistanceLevel}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">{opportunity.title}</h1>
        <p className="text-slate-300 leading-relaxed">{opportunity.description}</p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-lg font-black text-emerald-400">
              {formatCurrency(opportunity.potentialRevenueMinCents)}–{formatCurrency(opportunity.potentialRevenueMaxCents)}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Potential Earning</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-lg font-black text-white flex items-center justify-center gap-1">
              <Clock className="h-4 w-4 text-slate-400" />
              {opportunity.estimatedHoursMin}–{opportunity.estimatedHoursMax}h
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Estimated Time</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-lg font-black text-cyan-400">{opportunity.confidenceScore}%</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Confidence</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className={`text-lg font-black ${
              opportunity.difficulty === "BEGINNER" ? "text-emerald-400" :
              opportunity.difficulty === "INTERMEDIATE" ? "text-amber-400" : "text-red-400"
            }`}>{opportunity.difficulty}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Difficulty</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* What is this work */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" /> What Is This Work?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{opportunity.description}</p>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-sm">
              <div>
                <span className="font-semibold text-slate-300">Target Clients: </span>
                <span className="text-slate-400">{opportunity.targetMarket}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Problem They Have: </span>
                <span className="text-slate-400">{opportunity.customerProblem}</span>
              </div>
            </div>
          </div>

          {/* Can AI Help */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-violet-400" /> Can AI Help With This?
            </h2>
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${aiLevelColors[opportunity.aiAssistanceLevel]}`}>
              <Bot className="h-6 w-6 shrink-0" />
              <div>
                <div className="font-bold text-sm">AI Assistance Level: {opportunity.aiAssistanceLevel}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {opportunity.aiAssistanceLevel === "FULL"
                    ? "Free AI tools can handle most of the production work. You review, refine, and submit."
                    : opportunity.aiAssistanceLevel === "PARTIAL"
                    ? "Free AI tools can assist significantly, but human judgment, editing, and quality control are essential."
                    : "AI can assist with some aspects, but most of the work requires human skill and direct effort."}
                </div>
              </div>
            </div>

            {/* Tools */}
            {primaryMission && primaryMission.tools.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300">Free AI Tools For This Work:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {primaryMission.tools.map((mt) => (
                    <Link
                      key={mt.tool.id}
                      href={`/tools/${mt.tool.slug}`}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group"
                    >
                      <Wrench className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{mt.tool.name}</div>
                        <div className="text-[11px] text-slate-400">{mt.roleInMission}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{mt.tool.freePlanType.replace(/_/g, " ")}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Guided Mission */}
          {primaryMission && (
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-4 glow-emerald">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Step-by-Step Guide Available
              </h2>
              <p className="text-sm text-slate-300">
                A complete guided mission exists for this opportunity — {primaryMission.steps.length} interactive steps with copy-paste prompts and an AI guide you can ask questions.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={`/missions/${primaryMission.slug}`}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                >
                  Start Guide ({primaryMission.steps.length} steps) <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {primaryMission.estimatedTime}
                </span>
              </div>
            </div>
          )}

          {/* Safety */}
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" /> Safety & Verification Notes
            </h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {[
                "Always verify the platform or client before investing significant time",
                "Never pay upfront fees to access work unless you independently verify the legitimate business model",
                "Never upload confidential client data into free AI tools without their explicit permission",
                "Verify that AI-generated content is accurate before submitting to any client",
                "Check copyright and licensing requirements for any AI-generated images or content",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/trust" className="text-sm text-emerald-400 hover:underline font-semibold">
              Read our full Trust & Safety guide →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Source */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Source & Verification</h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <VerificationBadge status={opportunity.verificationStatus} />
              </div>
              {opportunity.providerName && (
                <div className="flex items-center justify-between">
                  <span>Provider:</span>
                  <span className="text-slate-200 font-semibold">{opportunity.providerName}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Last Checked:</span>
                <span className="text-slate-200 font-mono">{opportunity.lastVerifiedAt.toLocaleDateString()}</span>
              </div>
              {opportunity.sourceUrl && (
                <a
                  href={opportunity.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-cyan-400 hover:underline font-semibold pt-1"
                >
                  View Original Source <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Scores */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Opportunity Scores</h3>
            <div className="space-y-3">
              {[
                { label: "Opportunity Score", value: opportunity.opportunityScore, color: "emerald" },
                { label: "Risk Score", value: opportunity.riskScore, color: "amber", inverse: true },
                { label: "Confidence", value: opportunity.confidenceScore, color: "cyan" },
              ].map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{s.label}</span>
                    <span className={`font-bold text-${s.color}-400`}>{s.value}/100</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-${s.color}-500`}
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
              Scores reflect source reliability, market demand, free tool availability, and beginner accessibility. Not a prediction of personal earnings.
            </p>
          </div>

          {/* CTA */}
          {primaryMission ? (
            <Link
              href={`/missions/${primaryMission.slug}`}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              Start the Guide <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/missions"
              className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              Browse All Missions <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            Potential earnings shown are market-rate estimates from public sources. Individual results vary based on skill, effort, and client availability.
          </div>
        </div>
      </div>
    </div>
  );
}
