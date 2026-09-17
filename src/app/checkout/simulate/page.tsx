"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Lock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

function CheckoutSimulateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session") || `sim_${Date.now()}`;
  const amountInCents = parseInt(searchParams.get("amount") || "2500", 10);
  const platformFeeInCents = parseInt(searchParams.get("fee") || "500", 10);
  const userShareInCents = parseInt(searchParams.get("userShare") || "2000", 10);
  const userId = searchParams.get("userId") || "mock-user";
  const itemTitle = searchParams.get("itemTitle") || "Verified Opportunity Deliverable";
  const currency = searchParams.get("currency") || "USD";

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleCompleteSimulation = async () => {
    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/simulate-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId,
          itemTitle,
          amountInCents,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Simulation settlement failed");

      // Redirect to success page
      router.push(
        `/checkout/success?session_id=${sessionId}&title=${encodeURIComponent(
          itemTitle
        )}&amount=${amountInCents}&transactionId=${data.transactionId}`
      );
    } catch (err: any) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="p-3.5 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertTriangle className="h-4 w-4 shrink-0 text-cyan-400" />
          <span>
            <strong>Simulation Sandbox:</strong> Live Stripe keys are not configured in .env. Running on deterministic mock payment rails.
          </span>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="text-center space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-[10px] font-bold text-emerald-400 border border-emerald-800/50 uppercase tracking-wider">
              Test Card Processing
            </span>
            <h2 className="text-2xl font-black text-white">{itemTitle}</h2>
            <div className="text-3xl font-black text-emerald-400 font-mono pt-1">
              {formatCurrency(amountInCents, currency)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Deterministic 80/20 Split Breakdown
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Gross Customer Charge:</span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(amountInCents, currency)}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>EarnQuest Platform Fee (20%):</span>
              <span className="font-mono text-slate-300">
                - {formatCurrency(platformFeeInCents, currency)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-400 border-t border-slate-800 pt-2 font-bold">
              <span>Net Creator Allocation (80%):</span>
              <span className="font-mono">
                + {formatCurrency(userShareInCents, currency)}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block pb-1">Card Number (Simulated)</label>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300 flex items-center justify-between">
                <span>•••• •••• •••• 4242</span>
                <CreditCard className="h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block pb-1">Expires</label>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300">
                  12 / 28
                </div>
              </div>
              <div>
                <label className="text-slate-400 block pb-1">CVC</label>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-300">
                  999
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleCompleteSimulation}
            disabled={processing}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {processing ? (
              <span>Settling Financial Ledger...</span>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" /> Authorize & Settle Mock Payment
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <Lock className="h-3 w-3" />
            <span>Updates database ledger with immutable journal entries</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSimulatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading payment simulator...</div>}>
      <CheckoutSimulateContent />
    </Suspense>
  );
}
