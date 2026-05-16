"use client";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";
import { Zap, Flame, Trophy, Star, TrendingUp } from "lucide-react";

function SkillBar({ name, value, color, delay }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-white/55">{name}</span>
        <span style={{ color }} className="font-semibold">{value}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { state, xpProgress, xpInCurrentLevel, XP_PER_LEVEL } = useGame();
  const skillColors = ["#a78bfa", "#60a5fa", "#34d399", "#fb923c"];
  const unlockedBadges = state.badges.filter(b => b.unlocked);
  const lockedBadges = state.badges.filter(b => !b.unlocked);

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-white/40 mt-1">Your hero stats and achievements.</p>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl mb-6 relative overflow-hidden"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
          <div className="relative flex items-center gap-6 flex-wrap">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)", boxShadow: "0 0 30px rgba(124,58,237,0.4)" }}
            >
              {state.user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{state.user.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.3)" }}>
                  Level {state.level} Adventurer
                </span>
              </div>
              <div className="flex items-center gap-5 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm"><Zap size={14} className="text-violet-400" /><span className="text-white/60">{state.xp.toLocaleString()} XP</span></div>
                <div className="flex items-center gap-1.5 text-sm"><Flame size={14} className="text-orange-400" /><span className="text-white/60">{state.streak}-day streak</span></div>
                <div className="flex items-center gap-1.5 text-sm"><Trophy size={14} className="text-yellow-400" /><span className="text-white/60">{state.totalQuestsCompleted} quests</span></div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-white/35 mb-1.5">
                  <span>Level {state.level}</span>
                  <span>{xpInCurrentLevel().toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP</span>
                  <span>Level {state.level + 1}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/5">
                  <motion.div
                    animate={{ width: `${xpProgress()}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #60a5fa)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-5"><TrendingUp size={16} className="text-cyan-400" /><h2 className="font-semibold text-white">Skill Stats</h2></div>
            <div className="flex flex-col gap-4">
              {state.skills.map((s, i) => (
                <SkillBar key={s.name} name={s.name} value={s.value} color={skillColors[i]} delay={0.3 + i * 0.08} />
              ))}
            </div>
          </motion.div>

          {/* Progress summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2 mb-5"><Star size={16} className="text-yellow-400" /><h2 className="font-semibold text-white">Progress Summary</h2></div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total XP",      value: state.xp.toLocaleString(),                                          color: "#a78bfa" },
                { label: "Current Level", value: state.level,                                                         color: "#60a5fa" },
                { label: "Day Streak",    value: state.streak,                                                        color: "#fb923c" },
                { label: "Quests Done",   value: state.totalQuestsCompleted,                                          color: "#34d399" },
                { label: "Badges",        value: `${unlockedBadges.length}/${state.badges.length}`,                   color: "#fbbf24" },
                { label: "XP to Next",    value: (XP_PER_LEVEL - (state.xp % XP_PER_LEVEL)).toLocaleString(),        color: "#22d3ee" },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xs text-white/35 mb-1">{item.label}</div>
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Unlocked badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={16} className="text-yellow-400" />
              <h2 className="font-semibold text-white">Unlocked Badges</h2>
              <span className="ml-auto text-xs text-white/35">{unlockedBadges.length} earned</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {unlockedBadges.map(b => (
                <motion.div key={b.id} whileHover={{ scale: 1.1, y: -3 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl cursor-default"
                  style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="text-xs text-yellow-300 font-medium text-center">{b.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Locked badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-base">🔒</span>
              <h2 className="font-semibold text-white">Locked Badges</h2>
              <span className="ml-auto text-xs text-white/35">{lockedBadges.length} remaining</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {lockedBadges.map(b => (
                <motion.div key={b.id} whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl cursor-default"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", filter: "grayscale(1)", opacity: 0.5 }}>
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="text-xs text-white/40 font-medium text-center">{b.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
