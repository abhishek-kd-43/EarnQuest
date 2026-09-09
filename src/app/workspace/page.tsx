import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FolderGit2, ExternalLink, FileText, CheckCircle2, Clock, Plus } from "lucide-react";
import Link from "next/link";

export default async function WorkspacePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const projects = await db.project.findMany({
    where: { userId: user.id },
    include: {
      userMission: { include: { mission: true } },
      files: true,
      verifications: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          Deliverable Vault
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Project Workspace</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Store your live deliverables, public links, client proposal drafts, and proof files for every active opportunity.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-800">
          <FolderGit2 className="h-10 w-10 text-slate-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">No projects created yet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Projects are automatically created when you start a mission. Browse our catalog to launch your first opportunity.
          </p>
          <Link
            href="/missions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Explore Missions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="glass-panel p-6 rounded-2xl space-y-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-emerald-400 uppercase">
                  {p.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                {p.userMission?.mission && (
                  <Link
                    href={`/missions/${p.userMission.mission.slug}`}
                    className="text-xs text-cyan-400 hover:underline inline-block mt-0.5"
                  >
                    Mission: {p.userMission.mission.title} →
                  </Link>
                )}
              </div>

              {p.notes && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {p.notes}
                </div>
              )}

              {p.liveUrl && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                  <span className="text-slate-400">Public Deliverable URL:</span>
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[200px]"
                  >
                    {p.liveUrl} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                <span className="text-slate-400">
                  {p.verifications.length} verified earning proof(s)
                </span>
                <Link
                  href="/earnings"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
                >
                  Submit Earning Proof
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
