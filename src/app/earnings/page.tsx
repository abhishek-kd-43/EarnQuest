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
} from "lucide-react";

export default function EarningsPage() {
  const [balanceData, setBalanceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [platformName, setPlatformName] = useState("Upwork");
  const [sourceUrl, setSourceUrl] = useState("");
  const [evidenceFileUrl, setEvidenceFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

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

      setSubmitSuccess(true);
      setAmount("");
      setSourceUrl("");
      setEvidenceFileUrl("");
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        fetchBalances();
      }, 1500);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="h-4 w-4" /> Submit Earning Proof
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
          <div className="text-[11px] text-slate-400 pt-1">Held during standard clearance</div>
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
                          isCredit ? "text-emerald-400" : "text-slate-400"
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

      {/* Submit Proof Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Submit External Earning Proof</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              EarnQuest takes <strong className="text-cyan-400">0% fee</strong> on external earnings. Submitting verified proof builds your public reputation, increases your level rank, and unlocks higher-tier opportunities.
            </p>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              {submitError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
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
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit for Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
