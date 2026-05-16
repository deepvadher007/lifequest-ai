"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Sword, Bot, BarChart2, User, LogOut, Zap, Globe, GitBranch, Shield, Skull, Play, Sparkles } from "lucide-react";
import { useGame } from "../lib/store";

const navItems = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"   },
  { href: "/quests",     icon: Sword,           label: "Quests"      },
  { href: "/boss",       icon: Skull,           label: "Boss Battle",  glow: "#ef4444" },
  { href: "/world",      icon: Globe,           label: "World",        glow: "#22d3ee" },
  { href: "/skilltree",  icon: GitBranch,       label: "Skill Tree",   glow: "#34d399" },
  { href: "/futureself", icon: Sparkles,        label: "Future Self",  glow: "#f472b6" },
  { href: "/coach",      icon: Bot,             label: "AI Coach"    },
  { href: "/stats",      icon: BarChart2,       label: "Stats"       },
  { href: "/profile",    icon: User,            label: "Profile"     },
  { href: "/demo",       icon: Play,            label: "Demo Mode",    glow: "#fbbf24" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, xpProgress, bossHPPercent } = useGame();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 flex flex-col z-40 border-r"
      style={{ background: "rgba(6,6,14,0.97)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <motion.div
          animate={{ boxShadow: ["0 0 10px rgba(139,92,246,0.4)", "0 0 20px rgba(139,92,246,0.7)", "0 0 10px rgba(139,92,246,0.4)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold flex-shrink-0"
        >LQ</motion.div>
        <span className="font-semibold text-white tracking-tight">LifeQuest AI</span>
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ boxShadow: "0 0 12px rgba(139,92,246,0.4)" }}>
            {state.user.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{state.user.name}</div>
            <div className="text-xs text-violet-300">Level {state.level}</div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-white/40">
            <span className="flex items-center gap-1"><Zap size={10} className="text-violet-400" />{state.xp.toLocaleString()} XP</span>
            <span>{Math.round(xpProgress())}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5">
            <motion.div animate={{ width: `${xpProgress()}%` }} transition={{ duration: 0.6 }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: "linear-gradient(90deg, #7c3aed, #60a5fa)" }}>
              <motion.div animate={{ x: ["0%","100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/2" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)" }} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Boss mini HP */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Shield size={11} className="text-red-400" />
          <span className="text-xs text-white/40">Daily Boss HP</span>
          <span className="ml-auto text-xs font-bold text-red-300">{state.bossHP}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5">
          <motion.div
            animate={{ width: `${bossHPPercent()}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full"
            style={{ background: state.bossDefeated ? "#34d399" : "linear-gradient(90deg, #ef4444, #f97316)" }}
          />
        </div>
        {state.bossDefeated && <div className="text-xs text-emerald-400 mt-1 font-medium">✓ Boss Defeated!</div>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label, glow }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div whileHover={{ x: 3 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                style={{
                  background: active ? "rgba(139,92,246,0.15)" : "transparent",
                  color: active ? (glow || "#a78bfa") : "rgba(255,255,255,0.5)",
                  border: active ? `1px solid ${glow ? glow + "40" : "rgba(139,92,246,0.25)"}` : "1px solid transparent",
                  boxShadow: active && glow ? `0 0 12px ${glow}30` : "none",
                }}
              >
                <Icon size={15} />
                {label}
                {active && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: glow || "#a78bfa" }} />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Streak */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
          <motion.span animate={{ scale: [1,1.2,1] }} transition={{ duration: 2, repeat: Infinity }} className="text-lg">🔥</motion.span>
          <div>
            <div className="text-sm font-bold text-orange-300">{state.streak} day streak</div>
            <div className="text-xs text-white/30">Keep it going!</div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <button onClick={() => router.push("/login")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors w-full">
          <LogOut size={16} />Log Out
        </button>
      </div>
    </aside>
  );
}
