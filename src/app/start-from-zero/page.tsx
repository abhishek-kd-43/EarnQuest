import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Zap,
  Wrench,
  Globe,
  ShieldCheck,
  Star,
  ChevronRight,
  Monitor,
  Wifi,
  Target,
  Layers,
  TrendingUp,
  Trophy,
} from "lucide-react";

export const metadata = {
  title: "Start From Zero — EarnQuest",
  description:
    "No skills? No experience? No problem. EarnQuest's zero-skill path guides you from absolute beginner to completing your first piece of AI-assisted work, step by step.",
};

const JOURNEY_PHASES = [
  {
    num: "01",
    icon: Monitor,
    title: "Set Up Your Free Toolkit",
    time: "30 min",
    color: "cyan",
    tasks: [
      "Check your PC / browser capabilities",
      "Create free accounts on 2–3 AI tools",
      "Set up a free cloud workspace (Google Drive / Notion)",
    ],
    startLink: "/onboarding",
    startLabel: "Start Setup →",
  },
  {
    num: "02",
    icon: BookOpen,
    title: "Learn How Free AI Tools Actually Work",
    time: "1–2 hrs",
    color: "violet",
    tasks: [
      "Understand what prompts are and how to write one",
      "Test ChatGPT Free / Google Gemini with real examples",
      "Practice editing AI output — this is the real skill",
    ],
    startLink: "/missions?category=FUNDAMENTALS",
    startLabel: "Explore Learning Missions →",
  },
  {
    num: "03",
    icon: Target,
    title: "Pick ONE Category of Work",
    time: "30 min",
    color: "emerald",
    tasks: [
      "Choose from: Writing, Design, Research, Data, Coding, Video",
      "Read what real people pay for in that category",
      "Pick the one that feels most natural to YOU",
    ],
    startLink: "/opportunities",
    startLabel: "Browse Opportunities →",
  },
  {
    num: "04",
    icon: Layers,
    title: "Complete a Practice Project",
    time: "2–4 hrs",
    color: "amber",
    tasks: [
      "Follow a beginner mission end-to-end",
      "Use the step-by-step guide + AI guide chat",
      "Produce a real, finished work sample",
    ],
    startLink: "/missions",
    startLabel: "Find a Practice Mission →",
  },
  {
    num: "05",
    icon: Globe,
    title: "Find Your First Real Client or Buyer",
    time: "1–3 days",
    color: "blue",
    tasks: [
      "List your service on Fiverr Free / create a Gumroad listing",
      "Reach out to 3 local businesses with a free sample offer",
      "Post your work sample on your social media",
    ],
    startLink: "/opportunities",
    startLabel: "Find Entry-Level Opportunities →",
  },
  {
    num: "06",
    icon: Wrench,
    title: "Complete Real Work & Request Payment",
    time: "As needed",
    color: "rose",
    tasks: [
      "Follow the mission guide for the actual delivery",
      "Review AI output carefully before sending to the client",
      "Agree payment terms upfront using a platform (Fiverr, PayPal)",
    ],
    startLink: "/missions",
    startLabel: "Find a Paid Work Mission →",
  },
  {
    num: "07",
    icon: Trophy,
    title: "Build Your Portfolio",
    time: "Ongoing",
    color: "emerald",
    tasks: [
      "Save your best work samples in your workspace",
      "Create a basic portfolio page (Notion / Canva free templates)",
      "Add completed work to your EarnQuest profile",
    ],
    startLink: "/workspace",
    startLabel: "Open Your Workspace →",
  },
  {
    num: "08",
    icon: TrendingUp,
    title: "Grow & Level Up",
    time: "Ongoing",
    color: "cyan",
    tasks: [
      "Try a harder mission in your chosen category",
      "Add a second category of work",
      "Track your earnings and find higher-paying opportunities",
    ],
    startLink: "/dashboard",
    startLabel: "Open Your Dashboard →",
  },
];

const COMMON_FEARS = [
  {
    fear: "I don't have any skills",
    reality:
      "You don't need existing skills — you need a starting point. AI tools give you a massive headstart, and our guides are designed for absolute beginners. Every expert started at zero.",
  },
  {
    fear: "I'm not good with technology",
    reality:
      "If you can use a browser and type, you have everything you need. Every mission uses web-based tools — no installation required.",
  },
  {
    fear: "Everything online is a scam",
    reality:
      "Many online opportunities ARE scams — which is exactly why EarnQuest verifies every opportunity and teaches you to use legitimate platforms (Fiverr, Upwork, Gumroad, PayPal). We also teach you the red flags.",
  },
  {
    fear: "I don't have time",
    reality:
      "You can complete practice missions in 2–4 hours. Some beginner tasks (data labeling, transcription, basic image editing) can be done in under an hour.",
  },
  {
    fear: "I'm not confident in my English / writing",
    reality:
      "AI writing tools (ChatGPT, Gemini) work in 90+ languages. Many opportunities (design, data, coding, image editing) don't require writing at all.",
  },
];

export default function StartFromZeroPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5" /> Zero-Skill Starting Point
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
          "I Don't Have Any Skills."
          <br />
          <span className="shimmer-text">That's Exactly Why You're Here.</span>
        </h1>
        <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
          EarnQuest is built for people with no existing professional background. You have a PC, internet access, and the ability to follow instructions. That's enough to start.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="#journey"
            className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-base shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Zap className="h-5 w-5" /> Show Me the 8-Phase Journey
          </a>
          <Link
            href="/missions"
            className="px-8 py-4 rounded-2xl glass-panel text-slate-200 font-bold text-base flex items-center gap-2 hover:border-slate-600 transition-all"
          >
            Browse All Missions
          </Link>
        </div>

        {/* Requirements */}
        <div className="glass-panel p-6 rounded-2xl inline-block text-left space-y-3 mt-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">What You Actually Need:</div>
          <ul className="space-y-2 text-sm">
            {[
              { icon: Monitor, label: "A PC, laptop, or Chromebook (any condition)" },
              { icon: Wifi, label: "Internet connection (mobile hotspot works)" },
              { icon: Clock, label: "2–4 hours of free time to start" },
            ].map((req) => {
              const Icon = req.icon;
              return (
                <li key={req.label} className="flex items-center gap-2 text-slate-200">
                  <Icon className="h-4 w-4 text-cyan-400 shrink-0" />
                  {req.label}
                </li>
              );
            })}
          </ul>
          <div className="text-[10px] text-slate-500 pt-1">That's it. No money, no existing experience, no special software.</div>
        </div>
      </section>

      {/* 8-Phase Journey */}
      <section id="journey" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Your 8-Phase Path
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            From Zero to First Completed Work
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Follow these phases in order. Each one builds on the last. You can go at your own pace.
          </p>
        </div>

        <div className="space-y-4">
          {JOURNEY_PHASES.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.num}
                className={`glass-panel p-6 rounded-3xl border border-slate-800 hover:border-${phase.color}-500/30 transition-all group`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-${phase.color}-500/10 border border-${phase.color}-500/30`}>
                    <Icon className={`h-6 w-6 text-${phase.color}-400`} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-${phase.color}-400 font-mono font-black text-sm`}>Phase {phase.num}</span>
                      <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {phase.time}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {phase.tasks.map((task) => (
                        <li key={task} className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className={`h-3.5 w-3.5 text-${phase.color}-400 shrink-0`} />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={phase.startLink}
                    className={`shrink-0 px-4 py-2 rounded-xl bg-${phase.color}-500/10 border border-${phase.color}-500/30 text-${phase.color}-400 hover:bg-${phase.color}-500/20 text-xs font-bold transition-colors flex items-center gap-1`}
                  >
                    {phase.startLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Common Fears */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-white tracking-tight">
            "But What About..."
          </h2>
          <p className="text-sm text-slate-400">
            Common fears — and the honest reality.
          </p>
        </div>

        <div className="space-y-4">
          {COMMON_FEARS.map((item) => (
            <div
              key={item.fear}
              className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4"
            >
              <div className="shrink-0 text-amber-400 font-bold text-sm sm:w-48">
                "{ item.fear}"
              </div>
              <div className="text-sm text-slate-300 leading-relaxed">
                <CheckCircle2 className="inline h-3.5 w-3.5 text-emerald-400 mr-1.5 mb-0.5" />
                {item.reality}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 text-center space-y-6 glow-emerald">
          <h2 className="text-3xl font-black text-white">Ready to Start?</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Create a free account to track your progress through the 8-phase journey, save your work, and find beginner opportunities tailored to your hardware and interests.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
            >
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/missions"
              className="px-8 py-4 rounded-2xl glass-panel text-slate-200 font-bold text-base flex items-center gap-2 hover:border-slate-600 transition-all"
            >
              Browse Missions First
            </Link>
          </div>
          <p className="text-[11px] text-slate-500">
            No credit card required. No subscription. Free forever for the core platform.
          </p>
        </div>
      </section>
    </div>
  );
}
