import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Wrench, Cpu, DollarSign, RefreshCw, Layers } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    { num: "01", title: "Autonomous Research", desc: "Our engine discovers emerging free AI tools and software, verifying source citations, pricing tables, and commercial licenses." },
    { num: "02", title: "Market Need Analysis", desc: "We cross-reference tool capabilities with active customer demand on freelance boards, service marketplaces, and digital stores." },
    { num: "03", title: "Hardware Calibration", desc: "Your browser checks your computer specs (Lite, Standard, or Power tier) so you only receive missions your machine can handle smoothly." },
    { num: "04", title: "Select an Opportunity", desc: "Choose an opportunity matching your interests (Video, Coding, Design, Audio, Writing, Automation) with transparent risk and difficulty scores." },
    { num: "05", title: "Access Free Tools", desc: "Follow official links to download or open free tools. We never ask you to pay for software." },
    { num: "06", title: "Beginner Mode Steps", desc: "The mission delivers 10–15 bite-sized instructions with exact prompts and expected outputs—never overwhelming you with 30 steps at once." },
    { num: "07", title: "Embedded AI Guidance", desc: "Get stuck? Your personal AI Guide explains steps in simpler terms, troubleshoots errors, and suggests prompt variations." },
    { num: "08", title: "Real-World Execution", desc: "Build actual deliverables: client short clips, responsive landing pages, digital template bundles, or audio masters." },
    { num: "09", title: "Publish & Deliver", desc: "Host on free platforms (GitHub Pages, Vercel, Google Drive, Gumroad) and package portfolio previews for clients." },
    { num: "10", title: "Monetize & Keep 80%", desc: "On platform checkouts, you keep 80% and EarnQuest retains 20%. For external platform earnings, you keep 100%!" },
    { num: "11", title: "Verify Proof & Earn XP", desc: "Upload receipts, public links, or screenshots to build your verified score and unlock higher creator levels." },
    { num: "12", title: "Continuous Self-Improvement", desc: "Telemetry on drop-off rates continuously refines difficult steps, ensuring each generation of missions is better than the last." },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          The Full Execution Loop
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          How EarnQuest Works
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          From public web discovery to real-world verified income. Here is the entire system architecture explained step by step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((s) => (
          <div key={s.num} className="glass-panel p-6 rounded-2xl flex gap-4">
            <span className="text-2xl font-black font-mono text-emerald-400/80 shrink-0">
              {s.num}
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Start With Your First Guided Mission</h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Explore realistic missions designed for beginners with zero upfront capital.
        </p>
        <Link
          href="/missions"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
        >
          Browse Mission Catalog <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
