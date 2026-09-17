"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ChevronRight,
  HelpCircle,
  Zap,
  ArrowRight,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "guide";
  text: string;
}

const STARTER_QUESTIONS = [
  "I'm a complete beginner, where do I start?",
  "What can I do on an old PC or Chromebook?",
  "Which free AI tools don't require credit cards?",
  "How do I sell my work and withdraw earnings?",
];

export function GlobalAIGuideWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "guide",
      text: "👋 Hi! I'm your **EarnQuest AI Guide**.\n\nI'm here to help you find the right opportunity, navigate free AI tools without paying a dime, and guide you step-by-step to your first dollar. What would you like to build or explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/guide/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Guide service error");

      setMessages((prev) => [
        ...prev,
        { role: "guide", text: data.reply || "Here is your guided action plan." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "guide",
          text: `⚠️ Guide note: ${err.message || "Failed to reach AI guide"}. As a quick tip: check out our **Missions** catalog for 100% free, beginner-friendly paths!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/20">
              <Bot className="h-4 w-4 text-slate-950" />
            </div>
            <span>Need Help? Ask AI Guide</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-950"></span>
            </span>
          </button>
        </div>
      )}

      {/* Floating Interactive Guide Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col glass-panel-elevated rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl animate-slide-up">
          {/* Guide Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-md shadow-emerald-500/20">
                <Bot className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">EarnQuest Guide</h3>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold border border-emerald-800/50">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Autonomous Step-by-Step Mentor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 animate-message-appear ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "guide" && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-emerald-500 text-slate-950 font-semibold rounded-br-none"
                      : "bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">AI Guide is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Quick Starter Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-cyan-400 transition-colors truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything (e.g. 'How do I start with zero budget?')"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
