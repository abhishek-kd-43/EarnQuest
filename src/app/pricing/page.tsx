import Link from "next/link";
import { Check, Shield, DollarSign, ArrowRight, HelpCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          Fair Revenue Economics
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          How EarnQuest Economics Work
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Zero monthly subscription fees. You never pay to access our missions or tool directories. We only earn when you earn on platform-processed checkouts.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Direct Platform Checkouts */}
        <div className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/40 relative space-y-6 glow-emerald">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider">
            EarnQuest Direct Checkout
          </div>
          <div>
            <div className="text-4xl font-black text-white">80% Creator Share</div>
            <div className="text-xs text-slate-400 mt-1">20% Platform Fee retained for compute & operations</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When you sell digital assets, templates, or client packages through an official EarnQuest checkout link:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              Automated 80/20 integer minor unit split (no rounding loss)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              Credit directly to your available balance
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              Stripe Connect / PayPal marketplace payout support
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
              Instant verification and high XP milestone rewards
            </li>
          </ul>
        </div>

        {/* Card 2: External Platform Earnings */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
            External Marketplaces
          </div>
          <div>
            <div className="text-4xl font-black text-cyan-400">0% Platform Fee</div>
            <div className="text-xs text-slate-400 mt-1">100% of your external revenue stays with you</div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            When you execute a mission and earn on Upwork, Fiverr, Gumroad, or via direct client bank transfer:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400 shrink-0" />
              EarnQuest takes absolutely 0% of your earnings
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400 shrink-0" />
              Submit proof (invoice, screenshot, receipt link) for verification
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400 shrink-0" />
              Builds your public verified revenue score & level rank
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400 shrink-0" />
              Full transparency with zero hidden deductions
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6 pt-6">
        <h2 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-sm">Do I need to pay for any software?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No. Every mission is engineered to use 100% free plans, open-source software, or perpetual free tiers.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-sm">Can EarnQuest deduct money from my PayPal/bank?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never. We only take a 20% platform fee on transactions that pass through EarnQuest's checkout system. We have zero access to your external bank accounts.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-sm">How do I verify external earnings?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Go to your Earnings tab, click "Submit Proof", upload an invoice screenshot or transaction link. Our verification team reviews it within 24 hours.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-xl space-y-2">
            <h4 className="font-bold text-white text-sm">Is income guaranteed?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No. Income depends entirely on your effort, market demand, and quality of work. We give you the research, tools, and instructions to succeed legitimately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
