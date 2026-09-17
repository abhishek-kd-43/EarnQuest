"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Bot,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase
} from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchTask() {
      try {
        const res = await fetch(`/api/tasks/${params.id}`);
        if (!res.ok) {
          throw new Error("Task not found");
        }
        const data = await res.json();
        setTask(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTask();
  }, [params.id]);

  const handleClaim = async () => {
    setClaiming(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/tasks/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user" }), // Using demo user for now
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim task");
      
      setSuccess("Task successfully claimed! Check your dashboard for active missions.");
      setTask(data.task);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Task Not Found</h1>
        <p className="text-slate-400">The task you are looking for does not exist or has expired.</p>
        <Link href="/tasks" className="inline-block mt-4 px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">
          Browse All Tasks
        </Link>
      </div>
    );
  }

  const isClaimed = task.status !== "AVAILABLE";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link href="/tasks" className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Daily Tasks
      </Link>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/20 text-red-400 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
              {task.category}
            </span>
            <span className="px-3 py-1 rounded bg-emerald-950/50 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              ~{task.estimatedMinutes} Mins
            </span>
            <span className="px-3 py-1 rounded bg-blue-950/50 border border-blue-500/20 text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              {formatCurrency(task.netPayoutCents || task.budgetInCents)}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {task.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-500" />
                The Deliverable
              </h2>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {task.deliverable}
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                Step-by-Step Guide
              </h2>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-sm text-slate-300">
                {(task.stepByStepGuide || "").split('\n').map((step: string, i: number) => (
                  <p key={i} className={step.trim().match(/^[0-9]+./) ? 'pl-4 relative before:content-[""] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-slate-500 before:rounded-full' : ''}>
                    {step}
                  </p>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white">Recommended Tool</h3>
              <a 
                href={task.recommendedToolUrl}
                target="_blank"
                rel="noreferrer"
                className="group block p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Bot className="h-5 w-5 text-purple-400" />
                  <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-emerald-400" />
                </div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {task.recommendedToolName}
                </div>
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-4">
              <h3 className="font-bold text-white">Ready to work?</h3>
              <p className="text-xs text-slate-400">
                Claim this task to add it to your active missions. You'll have 24 hours to complete the work and submit the deliverable.
              </p>
              <button
                onClick={handleClaim}
                disabled={isClaimed || claiming}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {claiming ? "Claiming..." : isClaimed ? "Already Claimed" : "Claim Task Now"}
              </button>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm">Proposal Template</h3>
              <div className="p-3 bg-slate-950 rounded-lg text-xs text-slate-400 italic font-mono whitespace-pre-wrap">
                "{task.clientProposalTemplate}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
