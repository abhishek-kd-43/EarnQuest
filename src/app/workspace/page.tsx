import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FolderGit2, Plus } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";

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
          Deliverable Vault & Commerce
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">Project Workspace</h1>
        <p className="text-xs text-slate-400 max-w-xl">
          Store your deliverables, launch direct EarnQuest checkout links (80/20 split), and track verified proof for every opportunity.
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
          >
            Explore Missions
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
