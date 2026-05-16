"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../lib/store";
import AppShell from "../components/AppShell";
import { CheckCircle2, Circle, Zap, RotateCcw, Star } from "lucide-react";

const categoryColors = {
  Mind:       { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", text: "#a78bfa" },
  Knowledge:  { bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)",  text: "#60a5fa" },
  Body:       { bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)",  text: "#34d399" },
  Discipline: { bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.25)",  text: "#fb923c" },
};

function XPPopup({ xp }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -50, scale: 1.2 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-violet-300 pointer-events-none z-10 whitespace-nowrap"
    >
      +{xp} XP ⚡
    </motion.div>
  );
}

function QuestCard({ quest, onComplete }) {
  const [showPopup, setShowPopup] = useState(false);
  const colors = categoryColors[quest.category] || categoryColors.Mind;

  function handleClick() {
    if (quest.done) return;
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 900);
    onComplete(quest.id);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-5 rounded-2xl flex items-start gap-4 transition-all"
      style={{
        background: quest.done ? "rgba(255,255,255,0.02)" : colors.bg,
        border: `1px solid ${quest.done ? "rgba(255,255,255,0.06)" : colors.border}`,
        opacity: quest.done ? 0.6 : 1,
      }}
    >
      {showPopup && <XPPopup xp={quest.xp} />}

      {/* Checkbox */}
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.85 }}
        disabled={quest.done}
        className="mt-0.5 flex-shrink-0"
      >
        <AnimatePresence mode="wait">
          {quest.done ? (
            <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
              <CheckCircle2 size={22} className="text-emerald-400" />
            </motion.div>
          ) : (
            <motion.div key="undone" whileHover={{ scale: 1.1 }}>
              <Circle size={22} className="text-white/25 hover:text-white/50 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-semibold text-sm ${quest.done ? "line-through text-white/35" : "text-white"}`}>
            {quest.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}
            >
              ⚔ -{quest.bossDmg}
            </div>
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: `${colors.text}20`, color: colors.text }}
            >
              <Zap size={10} />
              {quest.xp} XP
            </div>
          </div>
        </div>
        <p className={`text-xs mt-1 ${quest.done ? "text-white/25" : "text-white/45"}`}>{quest.desc}</p>
        <div className="mt-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
          >
            {quest.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function QuestsPage() {
  const { state, completeQuest, resetQuests, xpProgress } = useGame();
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Mind", "Body", "Knowledge", "Discipline"];
  const done = state.quests.filter(q => q.done).length;
  const total = state.quests.length;
  const filtered = filter === "All" ? state.quests : state.quests.filter(q => q.category === filter);

  return (
    <AppShell>
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Daily Quests</h1>
              <p className="text-white/40 mt-1">Complete quests to earn XP and level up.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuests}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <RotateCcw size={14} />
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Progress summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl mb-6"
          style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Star size={18} className="text-violet-400" />
              <span className="font-semibold text-white">{done} of {total} quests completed</span>
            </div>
            <span className="text-violet-300 font-bold text-sm">
              +{state.quests.filter(q => q.done).reduce((a, q) => a + q.xp, 0)} XP earned today
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5">
            <motion.div
              animate={{ width: `${(done / total) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #7c3aed, #60a5fa)" }}
            />
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: filter === cat ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                border: filter === cat ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: filter === cat ? "#a78bfa" : "rgba(255,255,255,0.45)",
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Quest list */}
        <motion.div layout className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((quest, i) => (
              <motion.div key={quest.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <QuestCard quest={quest} onComplete={completeQuest} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {done === total && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 rounded-2xl text-center"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-lg font-bold text-emerald-300">All quests complete!</div>
            <div className="text-sm text-white/45 mt-1">You&apos;ve earned all XP for today. Come back tomorrow for new quests.</div>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
