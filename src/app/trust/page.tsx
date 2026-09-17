import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  XCircle,
  AlertCircle,
  Globe,
  Eye,
  Lock,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "Trust & Safety — EarnQuest",
  description:
    "How EarnQuest verifies opportunities, which platforms are legitimate, how we protect you from scams, and what to watch out for.",
};

const SCAM_REDFLAGS = [
  "\"Earn $500 a day guaranteed\" — No legitimate opportunity guarantees specific daily earnings",
  "Upfront payment required — Legitimate platforms (Fiverr, Upwork) never charge you to receive work",
  "You're hired instantly without an interview or sample work submission",
  "They contact you out of nowhere and offer unusually high pay for simple tasks",
  "They ask for your bank account to \"set up payroll\" before any work is done",
  "They want you to reshare USDT/crypto payments as part of the \"job\"",
  "The company has no verifiable web presence, LinkedIn, or reviews",
  "They ask for your national ID or passport before any work has been completed",
];

const VERIFICATION_LEVELS = [
  {
    label: "VERIFIED",
    color: "emerald",
    icon: ShieldCheck,
    desc: "We have directly checked this opportunity against a live, legitimate source (Upwork search, Gumroad data, Fiverr category stats). The platform exists, the work category is actively purchased, and the price range reflects real market data.",
  },
  {
    label: "RECENTLY CHECKED",
    color: "cyan",
    icon: CheckCircle2,
    desc: "Verified within the last 30 days. Platform exists and was accessible at the time of check. Price ranges and demand levels may have shifted.",
  },
  {
    label: "NEEDS REVIEW",
    color: "amber",
    icon: AlertTriangle,
    desc: "Something about this opportunity requires additional human review before we can fully verify it. May have a compliance concern, unusual pricing, or changed platform terms.",
  },
  {
    label: "UNVERIFIED",
    color: "slate",
    icon: AlertCircle,
    desc: "This opportunity is newly discovered and has not yet been fully verified. Treat as a research lead — not a confirmed source. Verify the platform yourself before committing significant time.",
  },
  {
    label: "EXPIRED",
    color: "red",
    icon: XCircle,
    desc: "This opportunity has been checked and is no longer available, or the platform has changed its terms in a way that makes this category no longer viable.",
  },
];

const PLATFORM_SAFETY = [
  {
    name: "Fiverr",
    url: "https://fiverr.com",
    status: "Legitimate",
    color: "emerald",
    notes: "Established platform since 2010. Escrow payment model protects both parties. Start with $5 gigs to build reviews.",
  },
  {
    name: "Upwork",
    url: "https://upwork.com",
    status: "Legitimate",
    color: "emerald",
    notes: "Established platform with verified client identity. Milestone-based escrow. Watch out for off-platform payment requests.",
  },
  {
    name: "Gumroad",
    url: "https://gumroad.com",
    status: "Legitimate",
    color: "emerald",
    notes: "Sell digital products, templates, guides. Direct Stripe/PayPal payout. Your store, your price, your rules.",
  },
  {
    name: "Ko-fi",
    url: "https://ko-fi.com",
    status: "Legitimate",
    color: "emerald",
    notes: "0% platform fee option. Good for tips, donations, and simple digital product sales.",
  },
  {
    name: "Toptal",
    url: "https://toptal.com",
    status: "Legitimate (Advanced Only)",
    color: "amber",
    notes: "Top 3% talent screening. Excellent rates but requires portfolio and multi-step vetting. Not for beginners.",
  },
];

const AI_TOOL_RULES = [
  "Never upload client private data into a free AI tool without client written permission",
  "Always disclose AI use to clients if they specifically ask — deception violates platform terms",
  "Treat AI output as a first draft — edit, verify, and fact-check before delivery",
  "AI-generated images may have copyright complexity — always check the tool's terms for commercial use",
  "Never use AI to create fake reviews, spam messages, or automated engagement — this violates platform terms",
  "AI code output can contain errors and security vulnerabilities — never deploy without review",
];

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5" /> Trust & Safety Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          How We Keep You Safe From Scams
        </h1>
        <p className="text-slate-300 max-w-3xl leading-relaxed">
          The online income space is full of fraudulent schemes, fake platforms, and misleading promises. This page explains exactly how EarnQuest sources opportunities, what we verify, and how to protect yourself when working online.
        </p>
      </div>

      {/* Our commitment */}
      <section className="glass-panel p-8 rounded-3xl border border-emerald-500/20 space-y-5 glow-emerald">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-400" /> Our Core Safety Commitments
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Every opportunity has a traceable, legitimate source",
            "We never fabricate user earnings or success stories",
            "No guaranteed income claims — ever",
            "Every AI tool is independently verified for genuine free access",
            "We reject blacklisted domains, scam farms, and deceptive affiliate traps",
            "Safety notes are included in every mission guide",
            "We flag risks even when they reduce an opportunity's score",
            "No financial data is processed by EarnQuest — we link to legitimate platforms",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Verification levels */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white">What Our Verification Badges Mean</h2>
        <div className="space-y-4">
          {VERIFICATION_LEVELS.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.label} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-${v.color}-950/60 border border-${v.color}-700/40`}>
                  <Icon className={`h-5 w-5 text-${v.color}-400`} />
                </div>
                <div className="space-y-1">
                  <div className={`text-sm font-black text-${v.color}-400`}>{v.label}</div>
                  <p className="text-sm text-slate-300 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scam red flags */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" /> Scam Red Flags — Know These
          </h2>
          <p className="text-sm text-slate-400">
            None of these are in EarnQuest, but you will encounter them in the wild. Memorize these.
          </p>
        </div>
        <div className="space-y-2">
          {SCAM_REDFLAGS.map((flag) => (
            <div key={flag} className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-sm text-slate-300">
              <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              {flag}
            </div>
          ))}
        </div>
      </section>

      {/* Legitimate platforms */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Globe className="h-6 w-6 text-cyan-400" /> Legitimate Platforms We Reference
          </h2>
          <p className="text-sm text-slate-400">
            EarnQuest only references established platforms with real escrow/payment protections.
          </p>
        </div>
        <div className="space-y-3">
          {PLATFORM_SAFETY.map((p) => (
            <div key={p.name} className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start gap-4">
              <div className={`px-2 py-0.5 rounded font-bold text-[11px] text-${p.color}-400 bg-${p.color}-950/60 border border-${p.color}-700/40 shrink-0`}>
                {p.status}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{p.name}</span>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-xs flex items-center gap-0.5">
                    {p.url} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-sm text-slate-400">{p.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Tool Safety */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Zap className="h-6 w-6 text-violet-400" /> AI Tool Safety Rules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AI_TOOL_RULES.map((rule) => (
            <div key={rule} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300">
              <Lock className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
              {rule}
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Reporting */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-700 space-y-4">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-amber-400" /> Report a Problem
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          If you find an opportunity in EarnQuest that appears fraudulent, a tool with an expired free tier, or anything else that violates our safety policies, please report it so we can investigate immediately.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-700/40 text-amber-400 font-bold text-sm hover:bg-amber-500/20 transition-colors">
            Report an Issue
          </Link>
          <Link href="/opportunities" className="px-5 py-2.5 rounded-xl glass-panel text-slate-200 font-bold text-sm hover:border-slate-600 transition-colors">
            Browse Verified Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}
