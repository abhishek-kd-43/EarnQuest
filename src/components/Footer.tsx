"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Shield, HelpCircle, FileText, Lock, ChevronDown, ChevronUp } from "lucide-react";

export function Footer() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black">
                <Zap className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                EARN<span className="text-emerald-400">QUEST</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-md font-medium">
              &ldquo;Turn your computer into an opportunity engine.&rdquo;
            </p>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              EarnQuest connects free AI tools, verified market demand, and guided step-by-step missions to help everyday people build legitimate digital products, freelance services, and workflows.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { label: "Twitter / X", href: "#" },
                { label: "Discord", href: "#" },
                { label: "GitHub", href: "#" },
                { label: "YouTube", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/missions" className="hover:text-emerald-400 transition-colors">
                  Missions Directory
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-emerald-400 transition-colors">
                  Free AI Tools
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-emerald-400 transition-colors">
                  Opportunity Explorer
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  80/20 Economics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Integrity
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                No Fraud or Spam Tolerance
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Lock className="h-4 w-4 text-cyan-400 shrink-0" />
                Zero Fake Autonomy
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <FileText className="h-4 w-4 text-violet-400 shrink-0" />
                Integer Ledger Verification
              </li>
            </ul>
          </div>
        </div>

        {/* Collapsible Transparency & Regulatory Disclaimer */}
        <div className="border-t border-slate-800/80 pt-6 space-y-4">
          <button
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            {disclaimerOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
            Legal & Earnings Transparency Statement
          </button>

          {disclaimerOpen && (
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 text-xs leading-relaxed text-slate-400 animate-fade-in-up">
              <span className="font-bold text-slate-200">Disclaimer: </span>
              EarnQuest does NOT guarantee income, financial returns, or employment. All displayed opportunities, revenue ranges, and difficulty ratings reflect algorithmic evaluations of public tool capabilities and current market data. Real-world earnings depend entirely on user execution, client demand, and third-party platform conditions. Where EarnQuest processes customer transactions directly, creators receive 80% and EarnQuest retains a 20% platform fee. External platform earnings are tracked at 0% platform fee upon evidence verification.
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2">
            <div>© {new Date().getFullYear()} EarnQuest Global Inc. All rights reserved.</div>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <Link href="/how-it-works" className="hover:text-slate-300">Architecture</Link>
              <Link href="/pricing" className="hover:text-slate-300">Fee Structure</Link>
              <Link href="/onboarding" className="hover:text-slate-300">Hardware Onboarding</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
