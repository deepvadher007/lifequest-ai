"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Sword, Bot, BarChart2, User, LogOut, Zap,
} from "lucide-react";
import { useGame } from "../lib/store";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/quests",    icon: Sword,           label: "Quests"    },
  { href: "/coach",     icon: Bot,             label: "AI Coach"  },
  { href: "/stats",     icon: BarChart2,       label: "Stats"     },
  { href: "/profile",   icon: User,            label: "Profile"   },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, xpProgress } = useGame();

  function handleLogout() {
    router.push("/login");
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 flex flex-col z-40 border-r"
      style={{
        background: "rgba(8,8,16,0.95)",
        borderColor: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
          LQ
        </div>
        <span className="font-semibold text-white tracking-tight">LifeQuest AI</span>
      </div>

      {/* User mini card */}
      <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {state.user.avatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{state.user.name}</div>
            <div className="text-xs text-violet-300">Level {state.level}</div>
          </div>
        </div>
        {/* XP bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-white/40">
            <span className="flex items-center gap-1"><Zap size={10} className="text-violet-400" />{state.xp.toLocaleString()} XP</span>
            <span>{Math.round(xpProgress())}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5">
            <motion.div
              animate={{ width: `${xpProgress()}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #7c3aed, #60a5fa)" }}
            />
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                style={{
                  background: active ? "rgba(139,92,246,0.15)" : "transparent",
                  color: active ? "#a78bfa" : "rgba(255,255,255,0.5)",
                  border: active ? "1px solid rgba(139,92,246,0.25)" : "1px solid transparent",
                }}
              >
                <Icon size={16} />
                {label}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Streak badge */}
      <div className="px-4 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg"
          >🔥</motion.span>
          <div>
            <div className="text-sm font-bold text-orange-300">{state.streak} day streak</div>
            <div className="text-xs text-white/30">Keep it going!</div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5 border-t pt-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
