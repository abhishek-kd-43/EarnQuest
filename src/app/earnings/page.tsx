"use client";

import { useState, useEffect } from "react";
import { formatCurrency, parseToCents } from "@/lib/currency";
import {
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Plus,
  AlertCircle,
  FileText,
  ExternalLink,
  ArrowDownLeft,
  Building2,
  Lock,
  Sparkles,
} from "lucide-react";

export default function EarningsPage() {
  const [balanceData, setBalanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Submit Proof Form State
  const [amount, setAmount] = useState("");
  const [platformName, setPlatformName] = useState("Upwork");
  const [sourceUrl, setSourceUrl] = useState("");
  const [evidenceFileUrl, setEvidenceFileUrl] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [proofSuccess, setProofSuccess] = useState(false);
  const [proofError, setProofError] = useState("");

  // Payout Form State
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("STRIPE_CONNECT");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [submittingPayout, setSubmittingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [payoutError, setPayoutError] = useState("");

  // Connect State
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ledger/balance");
      const data = await res.json();
      setBalanceData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setConnectingStripe(true);
    try {
      const res = await fetch("/api/payout/connect", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate Stripe Connect");

      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl;
      } else {
        setStripeConnected(true);
      }
    } catch (err: any) {
      alert(`Stripe Connect: ${err.message}`);
    } finally {
      setConnectingStripe(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProof(true);
    setProofError("");
    setProofSuccess(false);

    try {
      const res = await fetch("/api/earnings/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          platformName,
          sourceUrl: sourceUrl || undefined,
          evidenceFileUrl: evidenceFileUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProofSuccess(true);
      setAmount("");
      setSourceUrl("");
      setEvidenceFileUrl("");
      setTimeout(() => {
        setIsProofModalOpen(false);
        setProofSuccess(false);
        fetchBalances();
      }, 1500);
    } catch (err: any) {
      setProofError(err.message);
    } finally {
      setSubmittingProof(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPayout(true);
    setPayoutError("");
    setPayoutSuccess(false);

    try {
      const cents = parseToCents(payoutAmount);
      if (cents <= 0) throw new Error("Amount must be greater than $0.00");
      if (cents > (balanceData?.availableInCents || 0)) {
        throw new Error(
          `Amount exceeds available balance of ${formatCurrency(balanceData?.availableInCents || 0)}`
        );
      }

      const res = await fetch("/api/payout/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountInCents: cents,
          method: payoutMethod,
          notes: payoutNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPayoutSuccess(true);
      setPayoutAmount("");
      setPayoutNotes("");
      setTimeout(() => {
        setIsPayoutModalOpen(false);
        setPayoutSuccess(false);
        fetchBalances();
      }, 1500);
    } catch (err: any) {
      setPayoutError(err.message);
    } finally {
      setSubmittingPayout(false);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-slate-400">Loading financial ledger...</div>;
  }

  const entries = balanceData?.entries || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Deterministic Financial Ledger
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">Earnings & Balances</h1>
          <p className="text-xs text-slate-400">
            Immutable integer accounting. All calculations executed in minor currency units (cents).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            disabled={(balanceData?.availableInCents || 0) <= 0}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <ArrowDownLeft className="h-4 w-4" /> Request Payout
          </button>
          <button
            onClick={() => setIsProofModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Plus className="h-4 w-4" /> Submit Earning Proof
          </button>
        </div>
      </div>

      {/* Stripe Connect Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Bank Account & Payout Rails</h4>
            <p className="text-xs text-slate-400">
              Connect your bank account or debit card with Stripe Express to receive direct deposits.
            </p>
          </div>
        </div>
        <button
          onClick={handleConnectStripe}
          disabled={connectingStripe}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
        >
          {connectingStripe ? "Connecting..." : "Connect Stripe Express"} <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl space-y-1.5 border border-emerald-500/30 glow-emerald">
          <div className="text-xs text-slate-400 uppercase font-semibold">Available Balance</div>
          <div className="text-3xl font-black text-emerald-400">
            {formatCurrency(balanceData?.availableInCents || 0)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">Ready for withdrawal payout</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-1.5 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Pending Balance</div>
          <div className="text-3xl font-black text-amber-400">
            {formatCurrency(balanceData?.pendingInCents || 0)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">Held during clearance</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-1.5 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Platform Processed (80%)</div>
          <div className="text-3xl font-black text-white">
            {formatCurrency(balanceData?.platformTotalInCents || 0)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">Net after 20% platform fee</div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-1.5 border border-slate-800">
          <div className="text-xs text-slate-400 uppercase font-semibold">Verified External</div>
          <div className="text-3xl font-black text-cyan-400">
            {formatCurrency(balanceData?.externalVerifiedInCents || 0)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">0% platform fee retained</div>
        </div>
      </div>

      {/* Ledger Journal Entries Table */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Immutable Ledger Journal</h3>
          <span className="text-xs font-mono text-slate-400">Append-Only Audit Record</span>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No ledger transactions yet. Complete missions or sell digital deliverables to generate records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {entries.map((entry: any) => {
                  const isCredit = entry.type.startsWith("CREDIT");
                  return (
                    <tr key={entry.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            entry.type === "CREDIT_USER_EARNING"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                              : entry.type === "DEBIT_PAYOUT"
                              ? "bg-rose-950 text-rose-400 border border-rose-800/60"
                              : entry.type === "DEBIT_PLATFORM_FEE"
                              ? "bg-slate-900 text-slate-400"
                              : "bg-cyan-950 text-cyan-400"
                          }`}
                        >
                          {entry.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-200">{entry.notes}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold text-slate-400">
                          {entry.status}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold text-sm ${
                          isCredit ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatCurrency(entry.amountInCents, entry.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-[10px] font-bold text-emerald-400 border border-emerald-800/50 uppercase">
                  Balance Withdrawal
                </span>
                <h3 className="text-xl font-bold text-white">Request Cash Payout</h3>
              </div>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Available for Payout</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {formatCurrency(balanceData?.availableInCents || 0)}
              </div>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              {payoutError && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                  {payoutError}
                </div>
              )}
              {payoutSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                  Payout request approved and settled! Funds disbursed to your account.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 block font-semibold">Withdrawal Amount ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20.00"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm font-mono focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block font-semibold">Disbursement Method</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold focus:border-emerald-500 outline-none"
                >
                  <option value="STRIPE_CONNECT">Stripe Express (Direct Bank Transfer)</option>
                  <option value="BANK_TRANSFER">Manual Wire Transfer</option>
                  <option value="PAYPAL">PayPal Account</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block font-semibold">Transfer Memo / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly creator earnings payout"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayout}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                >
                  {submittingPayout ? "Processing Payout..." : "Confirm Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Proof Modal */}
      {isProofModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Submit External Earning Proof</h3>
              <button
                onClick={() => setIsProofModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              EarnQuest takes <strong className="text-cyan-400">0% fee</strong> on external earnings. Submitting verified proof builds your public reputation, increases your level rank, and unlocks higher-tier opportunities.
            </p>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              {proofError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                  {proofError}
                </div>
              )}
              {proofSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                  Proof submitted! Sent to verification queue.
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Amount Earned ($ USD)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Platform / Client</label>
                <select
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="Upwork">Upwork</option>
                  <option value="Fiverr">Fiverr</option>
                  <option value="Gumroad">Gumroad</option>
                  <option value="Direct Client (Stripe/PayPal)">Direct Client (Stripe/PayPal)</option>
                  <option value="Local Cash/Bank Transfer">Local Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Public Proof URL or Invoice Link</label>
                <input
                  type="url"
                  placeholder="https://invoice.stripe.com/... or Google Drive screenshot link"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProofModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProof}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                >
                  {submittingProof ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
