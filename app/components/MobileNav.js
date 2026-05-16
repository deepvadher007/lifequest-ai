"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, Sword, Skull, Globe, GitBranch,
  Sparkles, Bot, BarChart2, User, Play, Layers,
  Menu, X, Zap, LogOut
} from "lucide-react";
import { useGame } from "../lib/store";
import { useRouter } from "next/navigation";

// Primary nav shown in bottom bar (most important 5)
const primaryNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home"   },
  { href: "/quests",    icon: Sword,           label: "Quests" },
  { href: "/boss",      icon: Skull,           label: "Boss",  glow: "#ef4444" },
  { href: "/coach",     icon: Bot,             label: "Coach"  },
  { href: "/profile",   icon: User,            label: "Profile"},
];

// All nav for the drawer
const allNav = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"              },
  { href: "/quests",     icon: Sword,           label: "Quests"                 },
  { href: "/boss",       icon: Skull,           label: "Boss Battle", glow:"#ef4444" },
  { href: "/domain",     icon: Layers,          label: "Domain",      glow:"#22d3ee" },
  { href: "/world",      icon: Globe,           label: "World",       glow:"#60a5fa" },
  { href: "/skilltree",  icon: GitBranch,       label: "Skill Tree",  glow:"#34d399" },
  { href: "/futureself", icon: Sparkles,        label: "Future Self", glow:"#f472b6" },
  { href: "/coach",      icon: Bot,             label: "AI Coach"               },
  { href: "/stats",      icon: BarChart2,       label: "Stats"                  },
  { href: "/profile",    icon: User,            label: "Profile"                },
  { href: "/demo",       icon: Play,            label: "Demo Mode",   glow:"#fbbf24" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, xpProgress, getCurrentDomain } = useGame();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const domain = getCurrentDomain ? getCurrentDomain() : { accent: "#a78bfa" };

  return (
    <>
      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t"
        style={{
          background: "rgba(6,6,14,0.97)",
          borderColor: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
        }}
      >
        {primaryNav.map(({ href, icon: Icon, label, glow }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <div className="flex flex-col items-center gap-0.5 py-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: active ? `${glow || "#a78bfa"}20` : "transparent",
                    boxShadow: active ? `0 0 12px ${glow || "#a78bfa"}40` : "none",
                  }}
                >
                  <Icon
                    size={20}
                    style={{ color: active ? (glow || "#a78bfa") : "rgba(255,255,255,0.4)" }}
                  />
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? (glow || "#a78bfa") : "rgba(255,255,255,0.3)" }}
                >
                  {label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Menu button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex-1 flex flex-col items-center gap-0.5 py-1"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <Menu size={20} className="text-white/40" />
          </div>
          <span className="text-[10px] font-medium text-white/30">More</span>
        </button>
      </div>

      {/* Full-screen drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[61] rounded-t-3xl overflow-hidden"
              style={{
                background: "rgba(8,6,20,0.98)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                maxHeight: "85vh",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold">LQ</div>
                  <div>
                    <div className="text-sm font-semibold text-white">{state.user.name}</div>
                    <div className="text-xs" style={{ color: domain.accent }}>Level {state.level}</div>
                  </div>
                </div>
                {/* XP bar */}
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-violet-400" />
                  <div className="w-20 h-1.5 rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: `${xpProgress()}%` }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${domain.accent}, #60a5fa)` }}
                    />
                  </div>
                  <button onClick={() => setDrawerOpen(false)}>
                    <X size={18} className="text-white/40" />
                  </button>
                </div>
              </div>

              {/* Nav grid */}
              <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(85vh - 100px)" }}>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {allNav.map(({ href, icon: Icon, label, glow }) => {
                    const active = pathname === href;
                    return (
                      <Link key={href} href={href} onClick={() => setDrawerOpen(false)}>
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center"
                          style={{
                            background: active ? `${glow || "#a78bfa"}18` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${active ? (glow || "#a78bfa") + "40" : "rgba(255,255,255,0.07)"}`,
                          }}
                        >
                          <Icon size={20} style={{ color: active ? (glow || "#a78bfa") : "rgba(255,255,255,0.5)" }} />
                          <span className="text-xs font-medium" style={{ color: active ? (glow || "#a78bfa") : "rgba(255,255,255,0.45)" }}>
                            {label}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Logout */}
                <button
                  onClick={() => { setDrawerOpen(false); router.push("/login"); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <LogOut size={15} /> Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
