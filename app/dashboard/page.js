"use client";
import { motion } from "framer-motion";
import { useGame } from "../lib/store";
import AppShell from "../components/AppShell";
import PlayerAvatar from "../components/PlayerAvatar";
import Link from "next/link";
import { Sword, Bot, BarChart2, Zap, TrendingUp, CheckCircle2, Circle, Skull, Sparkles, Moon } from "lucide-react";

function StatCard({ label, value, sub, color, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-3 p-5 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}30` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-white/35">{sub}</div>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { state, xpProgress, xpInCurrentLevel, XP_PER_LEVEL, getAuraColor, combo, toggleShadowMode, shadowMode, getCurrentDomain } = useGame();
  const todayQuests = state.quests.slice(0, 5);
  const doneToday = todayQuests.filter(q => q.done).length;
  const graphBars = state.weeklyXP;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxBar = Math.max(...graphBars);
  const auraColor = getAuraColor ? getAuraColor() : "#a78bfa";
  const domain = getCurrentDomain ? getCurrentDomain() : { name: "Neon Slums", color: "249,115,22", accent: "#fb923c" };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header with Avatar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8"
        >
          {/* Avatar — smaller on mobile */}
          <div className="hidden sm:block">
            <PlayerAvatar size="md" showTitle={true} />
          </div>
          <div className="flex sm:hidden items-center gap-3">
            <PlayerAvatar size="sm" showTitle={false} />
            <div>
              <h1 className="text-xl font-bold text-white">
                <span style={{
                  background: `linear-gradient(135deg, ${auraColor}, #60a5fa)`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                }}>{state.user.name}</span>
              </h1>
              <p className="text-white/40 text-xs">Level {state.level} · {state.streak}d streak</p>
            </div>
          </div>

          {/* Greeting — desktop */}
          <div className="flex-1 hidden sm:block">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              Good morning,{" "}
              <span style={{
                background: `linear-gradient(135deg, ${auraColor}, #60a5fa)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>{state.user.name}</span> 👋
            </h1>
            <p className="text-white/40 mt-1 text-sm">You&apos;re on a {state.streak}-day streak. Keep the momentum going.</p>

            {/* Domain badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full"
              style={{ background: `rgba(${domain.color},0.1)`, border: `1px solid rgba(${domain.color},0.25)` }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: domain.accent, boxShadow: `0 0 6px ${domain.accent}` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: domain.accent }}>
                {domain.name}
              </span>
            </motion.div>

            {/* Combo indicator */}
            {combo >= 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 mt-2 ml-2 px-4 py-1.5 rounded-full"
                style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
              >
                <motion.span animate={{ scale: [1,1.3,1] }} transition={{ duration: 0.5, repeat: Infinity }}>⚡</motion.span>
                <span className="text-sm font-bold text-yellow-300">COMBO x{combo} ACTIVE</span>
              </motion.div>
            )}

            {/* Aura status */}
            <div className="flex items-center gap-2 mt-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: auraColor }}
                animate={{ scale: [1,1.5,1], opacity: [0.6,1,0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs text-white/35 uppercase tracking-widest">
                Dominant Aura: {[...state.skills].sort((a,b)=>b.value-a.value)[0]?.name}
              </span>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
            {/* SHADOW MODE button */}
            <motion.button
              onClick={toggleShadowMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm overflow-hidden flex-1 sm:flex-none justify-center sm:justify-start"
              style={shadowMode ? {
                background: "rgba(239,68,68,0.2)",
                border: "1px solid rgba(239,68,68,0.5)",
                color: "#ef4444",
                boxShadow: "0 0 20px rgba(239,68,68,0.3)",
              } : {
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
              }}
            >
              {!shadowMode && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0, 0.15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: "radial-gradient(circle, rgba(239,68,68,0.4), transparent)" }}
                />
              )}
              <Moon size={14} className="relative z-10 flex-shrink-0" />
              <span className="relative z-10 uppercase tracking-wider text-xs sm:text-sm">
                {shadowMode ? "Exit Shadow" : "Shadow Mode"}
              </span>
            </motion.button>

            {/* Future Self link */}
            <Link href="/futureself" className="flex-1 sm:flex-none">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 rounded-xl cursor-pointer h-full"
                style={{ background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)" }}
              >
                <Sparkles size={14} className="text-pink-400 flex-shrink-0" />
                <div className="text-xs font-semibold text-pink-300">Future Self</div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total XP" value={state.xp.toLocaleString()} sub="All time" color="#a78bfa" icon={Zap} delay={0} />
          <StatCard label="Level" value={state.level} sub="Adventurer" color="#60a5fa" icon={TrendingUp} delay={0.05} />
          <StatCard label="Streak" value={`${state.streak}d`} sub="Current streak" color="#fb923c" icon={Zap} delay={0.1} />
          <StatCard label="Quests Done" value={state.totalQuestsCompleted} sub="All time" color="#34d399" icon={CheckCircle2} delay={0.15} />
        </div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-2xl mb-6"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Level Progress</div>
              <div className="text-lg font-bold text-white">Level {state.level} → Level {state.level + 1}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-300">{xpInCurrentLevel().toLocaleString()} XP</div>
              <div className="text-xs text-white/35">{(XP_PER_LEVEL - xpInCurrentLevel()).toLocaleString()} to next level</div>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-white/5">
            <motion.div
              animate={{ width: `${xpProgress()}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: "linear-gradient(90deg, #7c3aed, #60a5fa)" }}
            >
              <motion.div
                animate={{ x: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-1/3"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
              />
            </motion.div>
          </div>
          <div className="text-xs text-white/30 mt-1.5">{Math.round(xpProgress())}% complete</div>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's quests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Today&apos;s Quests</h2>
              <Link href="/quests" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">View all →</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {todayQuests.map(q => (
                <div key={q.id} className="flex items-center gap-3">
                  {q.done
                    ? <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    : <Circle size={16} className="text-white/20 flex-shrink-0" />
                  }
                  <span className={`text-sm ${q.done ? "text-white/35 line-through" : "text-white/75"}`}>{q.title}</span>
                  <span className="ml-auto text-xs font-medium" style={{ color: q.done ? "#34d399" : "#a78bfa" }}>+{q.xp} XP</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{doneToday}/{todayQuests.length} completed</span>
                <span>{Math.round((doneToday / todayQuests.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5">
                <motion.div
                  animate={{ width: `${(doneToday / todayQuests.length) * 100}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Weekly XP chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Weekly XP</h2>
              <Link href="/stats" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Full stats →</Link>
            </div>
            <div className="flex items-end gap-2 h-28">
              {graphBars.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(val / maxBar) * 100}%` }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: "easeOut" }}
                    className="w-full rounded-t-md min-h-[4px]"
                    style={{
                      background: i === 6
                        ? "linear-gradient(180deg, #a78bfa, #7c3aed)"
                        : "rgba(139,92,246,0.3)",
                    }}
                  />
                  <span className="text-xs text-white/30">{days[i]}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-white/35">
              Total this week: <span className="text-violet-300 font-medium">{graphBars.reduce((a, b) => a + b, 0).toLocaleString()} XP</span>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Achievements</h2>
              <Link href="/profile" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">View all →</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.badges.map(b => (
                <motion.div
                  key={b.id}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: b.unlocked ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)",
                    border: b.unlocked ? "1px solid rgba(251,191,36,0.25)" : "1px solid rgba(255,255,255,0.07)",
                    color: b.unlocked ? "#fbbf24" : "rgba(255,255,255,0.2)",
                    filter: b.unlocked ? "none" : "grayscale(1)",
                  }}
                >
                  <span>{b.emoji}</span>
                  {b.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-5 rounded-2xl flex flex-col gap-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="font-semibold text-white mb-1">Quick Actions</h2>
            {[
              { href: "/quests", icon: Sword, label: "Complete Quests", sub: "Earn XP and level up", color: "#a78bfa" },
              { href: "/boss",   icon: Skull, label: "Boss Battle",     sub: `${state.bossHP} HP remaining`, color: "#ef4444" },
              { href: "/coach",  icon: Bot,   label: "Talk to AI Coach", sub: "Get personalized guidance", color: "#22d3ee" },
              { href: "/stats",  icon: BarChart2, label: "View Stats", sub: "Track your progress", color: "#34d399" },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}20` }}>
                    <item.icon size={16} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-white/35">{item.sub}</div>
                  </div>
                  <span className="ml-auto text-white/20 text-sm">→</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
