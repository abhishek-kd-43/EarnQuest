"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/currency";
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

function CheckoutPayContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const canceled = searchParams.get("canceled");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productData, setProductData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      if (!projectId) {
        setProductData({
          title: "AI Canva Client Onboarding Bundle & Video Templates",
          description: "Production-ready editable client onboarding templates and vertical short video scripts created with free AI tools.",
          priceInCents: 2500,
          creatorName: "EarnQuest Certified Creator",
          creatorLevel: 2,
        });
        setFetching(false);
        return;
      }

      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProductData({
            title: data.title,
            description: data.description || data.notes || "High-quality digital deliverable built on EarnQuest.",
            priceInCents: data.priceInCents || 2500,
            creatorName: data.user?.profile?.displayName || "EarnQuest Creator",
            creatorLevel: data.user?.profile?.level || 1,
          });
        } else {
          setProductData({
            title: "Verified Opportunity Deliverable",
            description: "High-value digital asset built using guided AI missions.",
            priceInCents: 2500,
            creatorName: "EarnQuest Creator",
            creatorLevel: 1,
          });
        }
      } catch {
        setProductData({
          title: "Verified Opportunity Deliverable",
          description: "High-value digital asset built using guided AI missions.",
          priceInCents: 2500,
          creatorName: "EarnQuest Creator",
          creatorLevel: 1,
        });
      } finally {
        setFetching(false);
      }
    }

    loadProduct();
  }, [projectId]);

  const handleInitiateCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: projectId || undefined,
          itemTitle: productData?.title,
          amountInCents: productData?.priceInCents,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.session?.checkoutUrl) {
        window.location.href = data.session.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned by provider");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Creator Checkout
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Complete Your Purchase</h1>
          <p className="text-xs text-slate-400">
            Secure checkout powered by EarnQuest Financial Rails. 80% goes directly to the creator.
          </p>
        </div>

        {canceled && (
          <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Payment was canceled. You can try again whenever you are ready.
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                Digital Deliverable
              </span>
              <h2 className="text-xl font-black text-white">{productData?.title}</h2>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-400">Created by</span>
                <span className="text-xs font-semibold text-slate-200">{productData?.creatorName}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-[10px] font-bold text-emerald-400 border border-emerald-800/50">
                  Level {productData?.creatorLevel}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {formatCurrency(productData?.priceInCents || 0)}
              </div>
              <span className="text-[10px] text-slate-400 uppercase">One-time payment</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
            {productData?.description}
          </p>

          <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instant download link provided immediately upon checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Full commercial usage rights included</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>80/20 transparent revenue share directly supports the creator</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleInitiateCheckout}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <span>Generating Secure Session...</span>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" /> Pay {formatCurrency(productData?.priceInCents || 0)} with Card <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="h-3 w-3 text-slate-400" />
              <span>256-bit encrypted checkout via Stripe / EarnQuest Ledger</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-300 underline">
            Back to EarnQuest Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading checkout...</div>}>
      <CheckoutPayContent />
    </Suspense>
  );
}
