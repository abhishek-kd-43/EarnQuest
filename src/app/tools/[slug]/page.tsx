import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Zap,
  Star,
  Clock,
  Wrench,
} from "lucide-react";

export const revalidate = 300;

export async function generateStaticParams() {
  const tools = await db.aITool.findMany({ select: { slug: true } });
  return tools.map((t) => ({ slug: t.slug }));
}

const WORK_MAPPING: Record<string, { category: string; examples: string[] }[]> = {
  Coding: [
    { category: "Web Development", examples: ["Build landing pages", "Create browser extensions", "Build internal tools"] },
    { category: "Automation", examples: ["Write scripts to automate repetitive tasks", "Create data processing pipelines"] },
    { category: "Bug Fixing", examples: ["Debug existing code for clients", "Review and fix code errors"] },
  ],
  Audio: [
    { category: "Transcription", examples: ["Convert podcast/interview audio to text", "Subtitle YouTube videos"] },
    { category: "Voiceover", examples: ["Create AI voiceovers for explainer videos", "Narrate e-learning courses"] },
    { category: "Audio Cleanup", examples: ["Remove background noise", "Master podcast audio"] },
  ],
  Video: [
    { category: "Video Editing", examples: ["Edit short-form content for social media", "Add captions to videos"] },
    { category: "Content Creation", examples: ["Create YouTube Shorts/TikToks", "Produce product demo videos"] },
  ],
  Image: [
    { category: "Graphic Design", examples: ["Create social media visuals", "Design thumbnails", "Brand graphics"] },
    { category: "E-Commerce", examples: ["Remove product image backgrounds", "Upscale product photos"] },
    { category: "Illustration", examples: ["Generate custom illustrations", "Create icon sets"] },
  ],
  Design: [
    { category: "Templates", examples: ["Create Canva templates to sell", "Build presentation templates"] },
    { category: "Branding", examples: ["Design logos", "Create brand identity kits"] },
  ],
  Automation: [
    { category: "Workflow Automation", examples: ["Build n8n/Zapier-style flows", "Connect apps via APIs"] },
    { category: "AI Agents", examples: ["Build simple AI chatbots", "Create customer support bots"] },
  ],
  Web: [
    { category: "Website Building", examples: ["Build client websites", "Create landing pages", "Portfolios"] },
    { category: "Low-Code Tools", examples: ["Internal dashboards", "Admin panels", "Data portals"] },
  ],
  Marketing: [
    { category: "Content Marketing", examples: ["Write SEO blog posts", "Create email campaigns"] },
    { category: "Social Media", examples: ["Manage social media content calendars", "Write ad copy"] },
  ],
};

function getWorkMapping(category: string) {
  // Try exact match first, then partial match
  if (WORK_MAPPING[category]) return WORK_MAPPING[category];
  const key = Object.keys(WORK_MAPPING).find((k) =>
    category.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(category.toLowerCase())
  );
  return key ? WORK_MAPPING[key] : null;
}

function FreeBadge({ type }: { type: string }) {
  const configs: Record<string, { label: string; color: string; bg: string; desc: string }> = {
    FREE: { label: "FREE", color: "text-emerald-400", bg: "bg-emerald-950 border-emerald-700/40", desc: "Completely free — no payment ever required" },
    OPEN_SOURCE: { label: "OPEN SOURCE", color: "text-emerald-400", bg: "bg-emerald-950 border-emerald-700/40", desc: "Open source — free forever, self-hosted" },
    FREE_SELF_HOSTED: { label: "FREE (SELF-HOSTED)", color: "text-cyan-400", bg: "bg-cyan-950 border-cyan-700/40", desc: "Free if you host it yourself" },
    FREEMIUM: { label: "FREE TIER", color: "text-amber-400", bg: "bg-amber-950 border-amber-700/40", desc: "Has a free tier — paid plans available" },
    FREE_WITH_LIMITS: { label: "FREE WITH LIMITS", color: "text-amber-400", bg: "bg-amber-950 border-amber-700/40", desc: "Free up to a usage limit per day/month" },
    FREE_TRIAL: { label: "FREE TRIAL ONLY", color: "text-red-400", bg: "bg-red-950 border-red-700/40", desc: "Trial only — payment required after trial period" },
  };
  const cfg = configs[type] || configs["FREEMIUM"];
  return (
    <div className={`inline-flex flex-col gap-0.5 px-3 py-2 rounded-xl border ${cfg.bg}`}>
      <span className={`text-xs font-black ${cfg.color}`}>{cfg.label}</span>
      <span className="text-[10px] text-slate-400">{cfg.desc}</span>
    </div>
  );
}

export default async function ToolDetailPage({ params }: { params: { slug: string } }) {
  const tool = await db.aITool.findUnique({
    where: { slug: params.slug },
    include: {
      sources: true,
      missionTools: {
        include: {
          mission: {
            include: { steps: { select: { id: true } } },
          },
        },
        take: 5,
      },
    },
  });

  if (!tool) notFound();

  const workMapping = getWorkMapping(tool.category);
  const linkedMissions = tool.missionTools
    .filter((mt) => mt.mission && mt.mission.isPublished)
    .map((mt) => mt.mission);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back */}
      <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>

      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400 uppercase tracking-wide">
                {tool.category}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> {tool.confidenceScore}% verified
              </span>
              {tool.isLocal && (
                <span className="px-2 py-0.5 rounded bg-violet-950 border border-violet-700/40 text-[10px] font-bold text-violet-400">
                  Runs Locally
                </span>
              )}
              {tool.apiAvailable && (
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/40 text-[10px] font-bold text-cyan-400">
                  API Available
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">{tool.name}</h1>
            <p className="text-slate-300 leading-relaxed max-w-2xl">{tool.description}</p>
          </div>
          <FreeBadge type={tool.freePlanType} />
        </div>

        {/* Quick details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-800">
          {[
            { label: "Signup Required", value: tool.requiresSignup ? "Yes" : "No", color: tool.requiresSignup ? "text-amber-400" : "text-emerald-400" },
            { label: "Credit Card", value: tool.requiresCreditCard ? "Required" : "Not Required", color: tool.requiresCreditCard ? "text-red-400" : "text-emerald-400" },
            { label: "Commercial Use", value: tool.commercialUse || "Check terms", color: "text-slate-200" },
            { label: "OS Support", value: tool.osSupport || "Web", color: "text-slate-200" },
          ].map((d) => (
            <div key={d.label} className="space-y-0.5">
              <div className="text-slate-500 uppercase font-bold tracking-wide text-[10px]">{d.label}</div>
              <div className={`font-semibold ${d.color}`}>{d.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={tool.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            Open {tool.name} <ExternalLink className="h-4 w-4" />
          </a>
          {tool.limitations && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-700/30 text-xs text-amber-300">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span><strong>Limit:</strong> {tool.limitations}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">

          {/* What can I do with this? */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-400" /> What Can I Actually Do With This?
            </h2>

            {workMapping ? (
              <div className="space-y-5">
                {workMapping.map((group) => (
                  <div key={group.category} className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-200">{group.category}</h3>
                    <ul className="space-y-1.5">
                      {group.examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                This tool can assist with a variety of work in the <strong className="text-white">{tool.category}</strong> category.
                Browse our missions to see it in action.
              </p>
            )}

            {tool.bestFor && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-sm">
                <span className="font-bold text-slate-300">Best for: </span>
                <span className="text-slate-400">{tool.bestFor}</span>
              </div>
            )}
          </div>

          {/* Linked Missions */}
          {linkedMissions.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-cyan-400" /> Missions Using {tool.name}
              </h2>
              <div className="space-y-3">
                {linkedMissions.map((mission) => (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.slug}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{mission.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <Clock className="h-3 w-3" /> {mission.estimatedTime}
                        <span>• {mission.steps.length} steps</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </Link>
                ))}
              </div>
              <Link href={`/opportunities?tool=${tool.slug}`} className="text-sm text-emerald-400 hover:underline font-semibold">
                Find all opportunities using {tool.name} →
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Free status card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Free Status</h3>
            <FreeBadge type={tool.freePlanType} />
            {tool.limitations && (
              <div className="text-xs text-slate-400 flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                {tool.limitations}
              </div>
            )}
            <div className="text-[10px] text-slate-500">
              Last verified: {tool.lastVerifiedAt.toLocaleDateString()}
            </div>
          </div>

          {/* Verification */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-400">
            <h3 className="text-sm font-bold text-white">Verification</h3>
            <div className="flex items-center justify-between">
              <span>Confidence Score:</span>
              <span className="font-bold text-emerald-400">{tool.confidenceScore}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${tool.confidenceScore}%` }} />
            </div>
            {tool.sources.length > 0 && (
              <div className="pt-2 space-y-1">
                <div className="font-semibold text-slate-300">Sources:</div>
                {tool.sources.slice(0, 2).map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:underline">
                    <ExternalLink className="h-3 w-3" /> {s.sourceName}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <a
            href={tool.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            Access {tool.name} Free <ExternalLink className="h-4 w-4" />
          </a>

          <Link
            href="/opportunities"
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all"
          >
            Find Work Using This Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
