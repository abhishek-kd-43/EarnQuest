"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Users,
  Layers,
  Wrench,
  DollarSign,
} from "lucide-react";

export default function AdminPortalPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verifications");
      const data = await res.json();
      setVerifications(data.verifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (verificationId: string, status: "VERIFIED" | "REJECTED") => {
    setReviewLoading(verificationId);
    try {
      const res = await fetch("/api/admin/verifications/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationId,
          status,
          notes: status === "VERIFIED" ? "Verified authentic client proof." : "Insufficient evidence.",
        }),
      });

      if (!res.ok) throw new Error("Review action failed");
      await fetchVerifications();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setReviewLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-slate-400">Loading admin console...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <span className="px-3 py-1 rounded-full bg-violet-950 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
          Operations & Moderation
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Admin Control Center</h1>
        <p className="text-xs text-slate-400">
          Review submitted external earnings proofs, audit source reliability, and monitor system integrity.
        </p>
      </div>

      {/* Verification Moderation Queue */}
      <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">External Earnings Verification Queue</h3>
            <p className="text-xs text-slate-400">Inspect proofs before granting public verified score & XP</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400">
            {verifications.length} total records
          </span>
        </div>

        {verifications.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No submissions in the verification queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Evidence Link</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">
                        {v.user?.profile?.displayName || v.user?.email}
                      </div>
                      <div className="text-[10px] text-slate-400">{v.user?.email}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{v.platformName}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(v.amountInCents, v.currency)}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {v.sourceUrl ? (
                        <a
                          href={v.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          View Link <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500">No link provided</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === "VERIFIED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                            : v.status === "REJECTED"
                            ? "bg-red-950 text-red-400 border border-red-800/60"
                            : "bg-amber-950 text-amber-400 border border-amber-800/60"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {v.status === "SUBMITTED" || v.status === "UNDER_REVIEW" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleReview(v.id, "VERIFIED")}
                            disabled={reviewLoading === v.id}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReview(v.id, "REJECTED")}
                            disabled={reviewLoading === v.id}
                            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 font-semibold text-xs flex items-center gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
