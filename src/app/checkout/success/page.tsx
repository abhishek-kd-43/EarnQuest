"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/currency";
import {
  CheckCircle2,
  Download,
  ArrowRight,
  Receipt,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "sess_completed";
  const itemTitle = searchParams.get("title") || "Verified Digital Deliverable";
  const amountInCents = parseInt(searchParams.get("amount") || "2500", 10);
  const transactionId = searchParams.get("transactionId") || `tx_${sessionId.substring(0, 16)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Payment Confirmed!</h1>
          <p className="text-xs text-slate-400">
            Your transaction has settled. The creator has received 80% directly into their EarnQuest ledger.
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
              <Receipt className="h-4 w-4 text-emerald-400" /> Transaction Receipt
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {transactionId.substring(0, 20)}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Item:</span>
              <span className="font-bold text-white max-w-[220px] text-right truncate">
                {itemTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Paid:</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {formatCurrency(amountInCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                SETTLED
              </span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="h-4 w-4" /> Ready for Immediate Access
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Click below to open your deliverable package, download files, and view implementation instructions.
              </p>
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="h-4 w-4" /> Access Deliverable Files <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
          <Link href="/workspace" className="hover:text-white flex items-center gap-1">
            Go to Workspace <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/earnings" className="hover:text-emerald-400 font-semibold">
            View Ledger Balances
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading receipt...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
