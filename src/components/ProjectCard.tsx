"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import {
  ExternalLink,
  DollarSign,
  Share2,
  Copy,
  Check,
  Tag,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    notes: string | null;
    liveUrl: string | null;
    priceInCents: number;
    isForSale: boolean;
    updatedAt: string | Date;
    userMission?: {
      mission: {
        slug: string;
        title: string;
      };
    } | null;
    verifications: any[];
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState(
    project.priceInCents > 0 ? (project.priceInCents / 100).toFixed(2) : "25.00"
  );
  const [liveUrl, setLiveUrl] = useState(project.liveUrl || "");
  const [isForSale, setIsForSale] = useState(project.isForSale);
  const [currentPriceInCents, setCurrentPriceInCents] = useState(project.priceInCents);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const checkoutUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/checkout/pay?projectId=${project.id}`
      : `/checkout/pay?projectId=${project.id}`;

  const handleSaveMonetization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${project.id}/monetize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price,
          isForSale: true,
          liveUrl: liveUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update monetization");

      setIsForSale(true);
      setCurrentPriceInCents(data.project.priceInCents);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(checkoutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-emerald-400 uppercase">
            {project.status}
          </span>
          <div className="flex items-center gap-2">
            {isForSale && currentPriceInCents > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-[10px] font-bold text-emerald-400 border border-emerald-800/50 flex items-center gap-1 font-mono">
                <Tag className="h-3 w-3" /> For Sale: {formatCurrency(currentPriceInCents)}
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-400">
              {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">{project.title}</h3>
          {project.userMission?.mission && (
            <Link
              href={`/missions/${project.userMission.mission.slug}`}
              className="text-xs text-cyan-400 hover:underline inline-block mt-0.5"
            >
              Mission: {project.userMission.mission.title} →
            </Link>
          )}
        </div>

        {project.notes && (
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
            {project.notes}
          </div>
        )}

        {project.liveUrl && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-slate-400">Deliverable URL:</span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[200px]"
            >
              {project.liveUrl} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {project.verifications.length} verified earning proof(s)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-all"
            >
              <DollarSign className="h-3.5 w-3.5" />
              {isForSale ? "Manage Sale Link" : "Monetize Deliverable"}
            </button>
            <Link
              href="/earnings"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
            >
              Proof
            </Link>
          </div>
        </div>

        {isForSale && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-slate-300 truncate">
              <ShoppingBag className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{checkoutUrl}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCopy}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1"
                title="Copy Checkout Link"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-400"
              >
                Buy <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Monetize Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl space-y-5 border border-slate-800">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-[10px] font-bold text-emerald-400 border border-emerald-800/50 uppercase">
                Platform Checkout (80/20 Split)
              </span>
              <h3 className="text-xl font-black text-white">Monetize Your Deliverable</h3>
              <p className="text-xs text-slate-400">
                Generate a live checkout link. Buyers pay with card; you keep 80% credited directly into your Available Balance.
              </p>
            </div>

            <form onSubmit={handleSaveMonetization} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block font-semibold pb-1">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25.00"
                    required
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="text-[11px] text-slate-400 pt-1 flex justify-between">
                  <span>Creator receives (80%): ${(parseFloat(price || "0") * 0.8).toFixed(2)}</span>
                  <span>Platform fee (20%): ${(parseFloat(price || "0") * 0.2).toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block font-semibold pb-1">
                  Deliverable Access URL (Google Drive / GitHub / Notion / Canva)
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-emerald-500 outline-none"
                />
                <span className="text-[11px] text-slate-400 block pt-0.5">
                  Customers receive this link immediately upon payment confirmation.
                </span>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center gap-1"
                >
                  {submitting ? "Publishing..." : "Publish Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
