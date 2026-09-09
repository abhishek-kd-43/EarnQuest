"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  AlertTriangle,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  Wrench,
  Clock,
  Cpu,
  Trophy,
  ExternalLink,
} from "lucide-react";

export default function MissionStepperPage() {
  const params = useParams();
  const router = useRouter();
  const missionSlug = params.id as string;

  const [mission, setMission] = useState<any>(null);
  const [userMission, setUserMission] = useState<any>(null);
  const [currentStepNum, setCurrentStepNum] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [aiBoxContent, setAiBoxContent] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [xpToast, setXpToast] = useState<string | null>(null);

  // Chat Guide state
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content:
        "Hello! I am your EarnQuest Personal Guide. I am following your progress on this mission step-by-step. Let me know if you need simpler explanations, prompt ideas, or help troubleshooting!",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchMissionData();
  }, [missionSlug]);

  const fetchMissionData = async () => {
    setLoading(true);
    try {
      // 1. Fetch mission details
      const res = await fetch(`/api/missions`);
      const data = await res.json();
      const matched = data.missions.find(
        (m: any) => m.slug === missionSlug || m.id === missionSlug
      );

      if (matched) {
        setMission(matched);

        // 2. Auto-start or fetch active user progress
        const startRes = await fetch("/api/missions/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ missionId: matched.id }),
        });

        if (startRes.ok) {
          const startData = await startRes.json();
          setUserMission(startData.userMission);
          setCurrentStepNum(startData.userMission.currentStep || 1);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "NEXT_STEP" | "BACK" | "EXPLAIN" | "I_AM_STUCK" | "SHOW_EXAMPLE") => {
    if (!mission) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/missions/step-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: mission.id,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (action === "NEXT_STEP") {
        setCurrentStepNum(data.currentStep);
        setAiBoxContent(null);
        setXpToast(`+${data.xpAwarded} XP Earned!`);
        setTimeout(() => setXpToast(null), 3500);

        if (data.isMissionComplete) {
          setAiBoxContent(
            "🎉 CONGRATULATIONS! You completed all steps of this mission! Your deliverable is ready. Make sure to log your links in the Workspace and record your earnings!"
          );
        }
      } else if (action === "BACK") {
        setCurrentStepNum(data.currentStep);
        setAiBoxContent(null);
      } else if (data.aiMessage) {
        setAiBoxContent(data.aiMessage);
      }
    } catch (e: any) {
      alert(e.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/guide/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg,
          missionId: mission?.id,
          stepNumber: currentStepNum,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I had trouble connecting. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-24 text-slate-400">Loading mission blueprint...</div>;
  }

  if (!mission) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-white">Mission Not Found</h2>
        <Link href="/missions" className="text-emerald-400 hover:underline">
          Return to Missions
        </Link>
      </div>
    );
  }

  const steps = mission.steps || [];
  const currentStep = steps.find((s: any) => s.stepNumber === currentStepNum) || steps[0];
  const progressPercent = Math.round((currentStepNum / steps.length) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* XP Toast Notification */}
      {xpToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 animate-bounce">
          <Trophy className="h-4 w-4" />
          {xpToast}
        </div>
      )}

      {/* Mission Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 uppercase">
                {mission.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5" /> {mission.estimatedTime}
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" /> {mission.hardwareTier}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">{mission.title}</h1>
            <p className="text-xs text-slate-300 max-w-2xl">{mission.tagLine}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workspace"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Open Workspace
            </Link>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">
              Step {currentStepNum} of {steps.length}:{" "}
              <strong className="text-emerald-400">{currentStep?.title}</strong>
            </span>
            <span className="font-mono text-slate-400">{progressPercent}% complete</span>
          </div>

          <div className="grid grid-cols-10 gap-1.5 h-2 w-full">
            {steps.map((s: any) => (
              <div
                key={s.id}
                onClick={() => setCurrentStepNum(s.stepNumber)}
                className={`h-full rounded-full cursor-pointer transition-all ${
                  s.stepNumber < currentStepNum
                    ? "bg-emerald-500"
                    : s.stepNumber === currentStepNum
                    ? "bg-cyan-400 ring-2 ring-cyan-400/40"
                    : "bg-slate-800"
                }`}
                title={`Step ${s.stepNumber}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Execution Workspace: 2-Column (Step Card + AI Guide) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Step Execution Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800">
            {/* Step Objective */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Step {currentStepNum} Objective
              </span>
              <h2 className="text-2xl font-black text-white">{currentStep?.title}</h2>
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200">
                <strong>Goal:</strong> {currentStep?.objective}
              </div>
            </div>

            {/* Instruction */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-bold text-slate-400">Instructions</h3>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {currentStep?.instruction}
              </p>
            </div>

            {/* Prompt Template (if any) */}
            {currentStep?.promptTemplate && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Copyable AI Prompt Template
                  </h3>
                  <button
                    onClick={() => copyPrompt(currentStep.promptTemplate)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy Prompt
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                  {currentStep.promptTemplate}
                </pre>
              </div>
            )}

            {/* Expected Output & Troubleshooting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {currentStep?.expectedOutput && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Expected Result:
                  </span>
                  <p className="text-slate-300">{currentStep.expectedOutput}</p>
                </div>
              )}

              {currentStep?.troubleshooting && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Troubleshooting Tip:
                  </span>
                  <p className="text-slate-300">{currentStep.troubleshooting}</p>
                </div>
              )}
            </div>

            {/* AI Action Box (if user clicked Explain, Stuck, etc.) */}
            {aiBoxContent && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-200 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" /> AI Guide Guidance:
                </div>
                <div className="whitespace-pre-line leading-relaxed">{aiBoxContent}</div>
              </div>
            )}

            {/* Beginner Mode Action Toolbar */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-[11px] font-semibold text-slate-400">Beginner Mode Actions:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAction("EXPLAIN")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-cyan-400" /> Explain Simply
                </button>

                <button
                  type="button"
                  onClick={() => handleAction("I_AM_STUCK")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> I'm Stuck
                </button>

                <button
                  type="button"
                  onClick={() => handleAction("SHOW_EXAMPLE")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Show Example
                </button>
              </div>

              {/* Next / Prev Step Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleAction("BACK")}
                  disabled={currentStepNum <= 1 || actionLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous Step
                </button>

                <button
                  type="button"
                  onClick={() => handleAction("NEXT_STEP")}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  {currentStepNum >= steps.length ? "Finish Mission 🎉" : "Complete & Next Step"}
                  <ArrowRight className="h-4 w-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Personal AI Guide Chat Panel */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col h-[650px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Personal AI Guide</h3>
                <div className="text-[10px] text-emerald-400">Context: Step {currentStepNum}</div>
              </div>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-slate-800 text-slate-100 ml-6 rounded-tr-none"
                    : "bg-slate-900 text-slate-200 mr-4 rounded-tl-none border border-slate-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {chatLoading && (
              <div className="text-slate-400 italic text-[11px]">AI Guide is thinking...</div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask about this step..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
