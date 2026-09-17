"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/currency";
import {
  Search,
  Zap,
  Clock,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  Bot
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["All", "WRITING", "DESIGN", "CODING", "MARKETING", "AUDIO", "VIDEO", "DATA", "ASSISTANT"];

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTasks = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
    }
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "24");
      
      if (selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }
      if (search) {
        params.set("search", search);
      }

      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await res.json();
      
      if (isLoadMore) {
        setTasks((prev) => [...prev, ...(data.tasks || [])]);
      } else {
        setTasks(data.tasks || []);
      }
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchTasks(false);
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, selectedCategory]);

  useEffect(() => {
    if (page > 1) {
      fetchTasks(true);
    }
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center w-fit gap-2">
          <Zap className="h-3.5 w-3.5" /> 1,000+ New Tasks Daily
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Daily Rapid Tasks
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Fast, actionable freelance micro-jobs aggregated every 24 hours. Use free AI tools to complete these in under an hour and get paid today.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-900 border border-slate-700 text-slate-300 hover:border-emerald-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading && page === 1 ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map((task, idx) => (
              <Link href={`/tasks/${task.id}`} key={`${task.id}-${idx}`} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-emerald-500/5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-1 rounded">
                    {task.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~{task.estimatedMinutes}m
                  </span>
                </div>
                
                <h3 className="text-sm font-bold text-slate-200 leading-tight mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {task.title}
                </h3>
                
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow">
                  {task.deliverable}
                </p>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800/60">
                    <Bot className="h-4 w-4 text-purple-400" />
                    <span className="text-[11px] font-medium text-slate-300 truncate">
                      {task.recommendedToolName || "AI Tool"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1 text-slate-300">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="font-bold text-sm">
                        {formatCurrency(task.netPayoutCents || task.budgetInCents)}
                      </span>
                    </div>
                    
                    <span className="text-emerald-500 bg-emerald-500/10 h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {tasks.length < total && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-500/50 transition-colors font-bold text-sm disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More Tasks"}
              </button>
            </div>
          )}
          
          {tasks.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-slate-400">No tasks found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
