"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Compass,
  Layers,
  Wrench,
  TrendingUp,
  FolderGit2,
  DollarSign,
  Cpu,
  ShieldCheck,
  LogOut,
  Zap,
  Key,
  Radar,
  Menu,
  X,
  Search,
  BookOpen,
  Star,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [keyStatus, setKeyStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/user/keys")
      .then((res) => res.json())
      .then((data) => setKeyStatus(data))
      .catch(() => {});
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/tasks", label: "Daily Tasks", icon: Zap },
    { href: "/opportunities", label: "Find Work", icon: TrendingUp },
    { href: "/missions", label: "Missions", icon: Layers },
    { href: "/tools", label: "AI Tools", icon: Wrench },
    { href: "/research", label: "Research", icon: Radar },
    { href: "/start-from-zero", label: "Start From Zero", icon: BookOpen },
    { href: "/trust", label: "Trust & Safety", icon: ShieldCheck },
    { href: "/keys-setup", label: "Free APIs", icon: Key },
  ];

  const authLinks = currentUser
    ? [
        { href: "/dashboard", label: "Dashboard", icon: Compass },
        { href: "/workspace", label: "Workspace", icon: FolderGit2 },
        { href: "/portfolio", label: "Portfolio", icon: Star },
        { href: "/earnings", label: "Earnings", icon: DollarSign },
      ]
    : [];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Zap className="h-5 w-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  EARN<span className="text-emerald-400">QUEST</span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                  Opportunity Engine
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-emerald-400 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}

              {currentUser && (
                <div className="h-4 w-[1px] bg-slate-800 mx-2" />
              )}

              {authLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-cyan-400 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Area: Profile / Auth Actions + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <Link
              href="/search"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Search"
              title="Search missions, tools & opportunities"
            >
              <Search className="h-4 w-4" />
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* AI Engine Status Badge */}
                <Link
                  href="/keys-setup"
                  title={keyStatus?.engineSource || "Configure Free AI Keys"}
                  className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    keyStatus?.isLiveActive
                      ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60"
                      : "bg-slate-900 border border-slate-700/60 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      keyStatus?.isLiveActive ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                    }`}
                  />
                  {keyStatus?.isLiveActive ? "Gemini 1.5 Live" : "Free Keys"}
                </Link>

                {/* Hardware Tier Badge */}
                <Link
                  href="/onboarding"
                  title="Calibrate computer environment"
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-xs font-mono text-emerald-400 hover:border-emerald-500/50 transition-colors"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  {currentUser.hardwareTier || "TIER_1_LITE"}
                </Link>

                {/* XP & Level Badge */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
                  <span className="font-semibold text-amber-400">
                    Lv.{currentUser.level}
                  </span>
                  <span className="text-slate-400">
                    {currentUser.xp} XP
                  </span>
                </div>

                {/* Admin Portal Link */}
                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-950/60 border border-violet-700/50 text-xs font-semibold text-violet-300 hover:bg-violet-900/60"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}

                {/* User Avatar / Logout */}
                <div className="hidden sm:flex items-center gap-2 pl-2">
                  <Link
                    href="/dashboard"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm"
                    title={currentUser.displayName}
                  >
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                    title="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          MOBILE SLIDE-OVER DRAWER
          ═══════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-slate-950 border-l border-slate-800 animate-slide-in-right overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500">
                  <Zap className="h-4 w-4 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="text-lg font-black text-white">
                  EARN<span className="text-emerald-400">QUEST</span>
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="p-4 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-2">
                Platform
              </div>
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all animate-fade-in-up ${
                      isActive
                        ? "bg-emerald-950/60 text-emerald-400 font-semibold border border-emerald-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}

              {authLinks.length > 0 && (
                <>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-2 mt-4">
                    Your Account
                  </div>
                  {authLinks.map((link, i) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all animate-fade-in-up ${
                          isActive
                            ? "bg-cyan-950/60 text-cyan-400 font-semibold border border-cyan-500/30"
                            : "text-slate-300 hover:text-white hover:bg-slate-900"
                        }`}
                        style={{ animationDelay: `${(navLinks.length + i) * 50}ms` }}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>

            {/* Mobile Auth Section */}
            <div className="p-4 border-t border-slate-800 space-y-3 mt-2">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{currentUser.displayName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="text-amber-400 font-semibold">Lv.{currentUser.level}</span>
                        <span>{currentUser.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-red-400 hover:bg-red-950/40 hover:border-red-800/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/register"
                    className="block w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-black text-center shadow-md shadow-emerald-500/20 transition-all"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 text-center hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
