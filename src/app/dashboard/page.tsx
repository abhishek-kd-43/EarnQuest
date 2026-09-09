import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/currency";
import {
  Compass,
  ArrowRight,
  Layers,
  Cpu,
  Trophy,
  Flame,
  CheckCircle,
  FolderGit2,
  DollarSign,
  Play,
  Zap,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fetch full user data including active missions, projects, achievements, and earnings
  const fullUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      hardwareProfile: true,
      userMissions: {
        where: { status: "IN_PROGRESS" },
        include: {
          mission: {
            include: { steps: true, tools: { include: { tool: true } } },
          },
        },
        take: 1,
      },
      projects: { take: 3, orderBy: { updatedAt: "desc" } },
      userAchievements: { include: { achievement: true } },
    },
  });

  const activeMission = fullUser?.userMissions[0];
  const currentStep = activeMission?.currentStep || 1;
  const totalSteps = activeMission?.mission.steps.length || 10;
  const progressPercent = Math.round(((currentStep - 1) / totalSteps) * 100);

  // Fetch recommended missions matching user hardware tier
  const tier = fullUser?.hardwareProfile?.tier || "TIER_1_LITE";
  const recommendedMissions = await db.mission.findMany({
    where: {
      isPublished: true,
      ...(activeMission ? { id: { not: activeMission.missionId } } : {}),
    },
    take: 3,
    include: {
      tools: { include: { tool: true } },
      opportunity: true,
    },
  });

  // Calculate XP progress to next level (each level requires 500 XP)
  const currentXp = fullUser?.profile?.xp || 0;
  const currentLevel = fullUser?.profile?.level || 1;
  const xpInCurrentLevel = currentXp % 500;
  const xpNeeded = 500 - xpInCurrentLevel;
  const levelProgressPercent = Math.round((xpInCurrentLevel / 500) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. Welcome & Gamification Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold flex items-center gap-1">
                <Cpu className="h-3 w-3" /> {tier}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Welcome back, {user.displayName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to execute your next opportunity?
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              "Turn your computer into an opportunity engine." Every step completed builds real-world capability.
            </p>
          </div>

          {/* Level & XP Box */}
          <div className="w-full lg:w-72 rounded-2xl bg-slate-900/90 p-4 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-black text-sm">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Rank</div>
                  <div className="text-sm font-black text-white">
                    Level {currentLevel}{" "}
                    <span className="text-xs font-semibold text-amber-400">
                      {currentLevel === 1 ? "Explorer" : currentLevel <= 3 ? "Creator" : "Builder"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-orange-400">
                <Flame className="h-4 w-4 fill-orange-400" />
                {fullUser?.profile?.streakDays || 1}d Streak
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>{currentXp} XP</span>
                <span>{xpNeeded} XP to Lv.{currentLevel + 1}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Mission Section */}
      {activeMission ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-6 glow-emerald">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Current Active Mission
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {activeMission.mission.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {activeMission.mission.tagLine}
              </p>
            </div>

            <Link
              href={`/missions/${activeMission.mission.slug}`}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all shrink-0"
            >
              Resume Step {currentStep} <ArrowRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">
                Step {currentStep} of {totalSteps}:{" "}
                <span className="text-emerald-400 font-bold">
                  {activeMission.mission.steps.find((s) => s.stepNumber === currentStep)?.title || "Executing"}
                </span>
              </span>
              <span className="font-mono text-slate-400">{progressPercent}% complete</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-slate-800">
          <h2 className="text-xl font-bold text-white">No active mission started</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Choose from our curated 10 beginner missions to start learning and executing today.
          </p>
          <Link
            href="/missions"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            Browse Missions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* 3. Recommended Next Missions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Recommended for Your Rig</h3>
          <Link href="/missions" className="text-xs font-bold text-emerald-400 hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedMissions.map((m) => (
            <div
              key={m.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300 uppercase">
                    {m.category}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">{m.estimatedTime}</span>
                </div>

                <h4 className="text-base font-bold text-white">{m.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{m.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs font-bold text-emerald-400">
                  {formatCurrency(m.opportunity?.potentialRevenueMinCents || 2500)} -{" "}
                  {formatCurrency(m.opportunity?.potentialRevenueMaxCents || 25000)}
                </div>
                <Link
                  href={`/missions/${m.slug}`}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold text-slate-200 transition-colors"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/workspace"
          className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Project Workspace</div>
            <div className="text-xs text-slate-400">Track deliverables & links</div>
          </div>
        </Link>

        <Link
          href="/earnings"
          className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Earnings Ledger</div>
            <div className="text-xs text-slate-400">Balances & proof verification</div>
          </div>
        </Link>

        <Link
          href="/onboarding"
          className="glass-panel glass-panel-hover p-5 rounded-2xl flex items-center gap-4"
        >
          <div className="h-10 w-10 rounded-xl bg-violet-950 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Hardware Profiling</div>
            <div className="text-xs text-slate-400">Re-calibrate your environment</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
