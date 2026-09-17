"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderGit2,
  Plus,
  ExternalLink,
  Calendar,
  Trophy,
  Sparkles,
  ArrowRight,
  Code,
  Pen,
  Image,
  Bot,
  Star,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Coding: Code,
  Writing: Pen,
  Design: Image,
  Automation: Bot,
  Default: Star,
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Writing",
    externalUrl: "",
    tags: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects?status=COMPLETED");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      // not authenticated yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          externalUrl: form.externalUrl || null,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
          status: "COMPLETED",
          isPortfolio: true,
        }),
      });
      if (res.ok) {
        setShowAddForm(false);
        setForm({ title: "", description: "", category: "Writing", externalUrl: "", tags: "" });
        fetchProjects();
      }
    } catch {}
    setSaving(false);
  };

  const portfolioItems = projects.filter((p) => p.isPortfolio);
  const recentWork = projects.filter((p) => !p.isPortfolio);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <FolderGit2 className="h-4 w-4" /> Your Work Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Portfolio Builder</h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
            Showcase your best completed work. Your portfolio builds your credibility with potential clients.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Portfolio Item
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel-elevated p-8 rounded-3xl border border-slate-700 w-full max-w-lg space-y-6">
            <h2 className="text-xl font-black text-white">Add Portfolio Item</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. SEO Blog Post for SaaS Client"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what you did, what tools you used, and what the result was..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
                  >
                    {["Writing", "Design", "Coding", "Automation", "Research", "Video", "Audio", "Data"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="SEO, Canva, ChatGPT"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Link to Work (optional)</label>
                <input
                  type="url"
                  value={form.externalUrl}
                  onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Add to Portfolio"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-shimmer h-40 rounded-3xl" />
          ))}
        </div>
      ) : portfolioItems.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl space-y-6">
          <FolderGit2 className="h-14 w-14 text-slate-600 mx-auto" />
          <div className="space-y-2">
            <p className="text-xl font-black text-white">No portfolio items yet</p>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Complete a mission and add your best work here to show potential clients what you can do.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center gap-2 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Your First Item
            </button>
            <Link
              href="/missions"
              className="px-6 py-3 rounded-xl glass-panel text-slate-200 font-bold text-sm flex items-center gap-2 hover:border-slate-600 transition-all"
            >
              Complete a Mission <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {portfolioItems.map((project) => {
            const Icon = CATEGORY_ICONS[project.category] || CATEGORY_ICONS.Default;
            return (
              <div key={project.id} className="glass-card-interactive p-6 rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    <Icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-cyan-400 uppercase">
                    {project.category}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-white">{project.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{project.description}</p>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  {project.externalUrl && (
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:underline font-semibold"
                    >
                      View Work <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick tip */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Portfolio Tip</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Even one high-quality sample is better than no portfolio. Complete a practice mission, produce your best work, and add it here. 
            Then link your portfolio page when pitching clients on Fiverr or Upwork.
          </p>
        </div>
      </div>
    </div>
  );
}
