"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import PlayerAvatar from "../components/PlayerAvatar";
import { useGame } from "../lib/store";

const MILESTONES = [
  { days: 7,   title: "Awakened Seeker",    desc: "You've broken the first barrier. Habits are forming.",                  level: 1,  color: "#fb923c", world: "The Awakening",  emoji: "🌱" },
  { days: 14,  title: "Focused Initiate",   desc: "Two weeks of consistency. Your mind is sharpening.",                   level: 2,  color: "#fbbf24", world: "Iron Forge",     emoji: "🗡️" },
  { days: 30,  title: "Discipline Warrior", desc: "30 days. You've built a foundation most people never reach.",           level: 4,  color: "#34d399", world: "Iron Forge",     emoji: "⚔️" },
  { days: 60,  title: "Mind Architect",     desc: "60 days of deliberate growth. Your systems are running.",              level: 7,  color: "#60a5fa", world: "Crystal Spire",  emoji: "🔮" },
  { days: 90,  title: "Discipline Monk",    desc: "90 days. You are no longer who you were. The transformation is real.", level: 10, color: "#a78bfa", world: "Crystal Spire",  emoji: "🧘" },
  { days: 180, title: "Ascended Champion",  desc: "Half a year of mastery. You operate at a level few ever reach.",       level: 15, color: "#f472b6", world: "Neon Citadel",   emoji: "👑" },
  { days: 365, title: "Legendary Architect",desc: "One year. You have built the life others only dream about.",           level: 20, color: "#ffffff", world: "Cosmic Realm",   emoji: "🌌" },
];

const WORLD_PREVIEWS = {
  "The Awakening":  { color: "249,115,22",  desc: "Where every journey begins. Raw potential, unformed." },
  "Iron Forge":     { color: "251,191,36",  desc: "Discipline hammered into steel. The forge never sleeps." },
  "Crystal Spire":  { color: "52,211,153",  desc: "Clarity crystallized. Focus becomes your superpower." },
  "Neon Citadel":   { color: "96,165,250",  desc: "The city of champions. Your legend is written here." },
  "Cosmic Realm":   { color: "139,92,246",  desc: "Beyond limits. You have transcended the ordinary." },
};

function MilestoneCard({ milestone, index, active, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(index)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ x: 4 }}
      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
      style={{
        background: active ? `${milestone.color}15` : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? milestone.color + "40" : "rgba(255,255,255,0.07)"}`,
        boxShadow: active ? `0 0 20px ${milestone.color}15` : "none",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${milestone.color}20`, border: `1px solid ${milestone.color}30` }}
      >
        {milestone.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white">{milestone.title}</div>
        <div className="text-xs text-white/35">{milestone.days} days · Level {milestone.level}</div>
      </div>
      {active && (
        <motion.div
          layoutId="activeMilestone"
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: milestone.color, boxShadow: `0 0 8px ${milestone.color}` }}
        />
      )}
    </motion.button>
  );
}

function FutureAvatarPreview({ milestone }) {
  const { state } = useGame();
  const world = WORLD_PREVIEWS[milestone.world];

  return (
    <motion.div
      key={milestone.days}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-8"
    >
      {/* Future avatar */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Projected glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 280, height: 280,
            background: `radial-gradient(circle, ${milestone.color}20 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Avatar shell */}
        <motion.div
          className="relative w-36 h-36 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${milestone.color}40, rgba(8,8,16,0.95))`,
            border: `2px solid ${milestone.color}60`,
            boxShadow: `0 0 50px ${milestone.color}50, 0 0 100px ${milestone.color}20`,
          }}
          animate={{
            boxShadow: [
              `0 0 40px ${milestone.color}40, 0 0 80px ${milestone.color}15`,
              `0 0 70px ${milestone.color}70, 0 0 140px ${milestone.color}30`,
              `0 0 40px ${milestone.color}40, 0 0 80px ${milestone.color}15`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-6xl">{milestone.emoji}</span>

          {/* Scan line */}
          <motion.div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
            <motion.div
              className="absolute left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, transparent, ${milestone.color}, transparent)` }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Orbiting rings */}
        {[60, 80, 100].map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border pointer-events-none"
            style={{
              width: r*2, height: r*2,
              top: "50%", left: "50%",
              marginTop: -r, marginLeft: -r,
              borderColor: `${milestone.color}${i === 0 ? "50" : i === 1 ? "30" : "20"}`,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 8 + i*4, repeat: Infinity, ease: "linear" }}
          />
        ))}

        {/* Level badge */}
        <div
          className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
          style={{
            background: `linear-gradient(135deg, ${milestone.color}, ${milestone.color}80)`,
            border: "2px solid rgba(8,8,16,0.9)",
            boxShadow: `0 0 15px ${milestone.color}80`,
            color: "white",
          }}
        >
          {milestone.level}
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <motion.div
          className="text-3xl font-black mb-2"
          style={{
            background: `linear-gradient(135deg, ${milestone.color}, white, ${milestone.color})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: `drop-shadow(0 0 15px ${milestone.color}60)`,
          }}
        >
          {milestone.title}
        </motion.div>
        <div className="text-white/50 text-sm max-w-xs leading-relaxed">{milestone.desc}</div>
      </div>

      {/* World preview */}
      <motion.div
        className="w-full p-5 rounded-2xl"
        style={{
          background: `rgba(${world.color},0.06)`,
          border: `1px solid rgba(${world.color},0.2)`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full" style={{ background: `rgb(${world.color})`, boxShadow: `0 0 8px rgb(${world.color})` }} />
          <div className="text-sm font-bold" style={{ color: `rgb(${world.color})` }}>World: {milestone.world}</div>
        </div>
        <div className="text-xs text-white/40 leading-relaxed">{world.desc}</div>
      </motion.div>

      {/* Days remaining */}
      <div className="text-center">
        <div className="text-xs text-white/25 uppercase tracking-widest mb-1">Days from now</div>
        <div className="text-4xl font-black" style={{ color: milestone.color }}>{milestone.days}</div>
      </div>
    </motion.div>
  );
}

export default function FutureSelfPage() {
  const { state } = useGame();
  const [selected, setSelected] = useState(2); // default: 30 days

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔮</span>
            <h1 className="text-3xl font-bold text-white">Future Self</h1>
          </div>
          <p className="text-white/40">See who you become if you stay on the path.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — current + milestones */}
          <div className="flex flex-col gap-6">
            {/* Current state */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-xs text-white/30 uppercase tracking-widest mb-4">You Today</div>
              <div className="flex items-center gap-4">
                <PlayerAvatar size="sm" showTitle={false} />
                <div>
                  <div className="text-lg font-bold text-white">{state.user.name}</div>
                  <div className="text-sm text-white/50">Level {state.level} · {state.streak}-day streak</div>
                  <div className="text-xs text-white/30 mt-1">{state.totalQuestsCompleted} quests completed</div>
                </div>
              </div>
            </motion.div>

            {/* Path arrow */}
            <div className="flex items-center gap-3 px-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="text-white/20 text-xs uppercase tracking-widest">Your Path</div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Milestones */}
            <div className="flex flex-col gap-2">
              {MILESTONES.map((m, i) => (
                <MilestoneCard key={m.days} milestone={m} index={i} active={selected === i} onClick={setSelected} />
              ))}
            </div>
          </div>

          {/* Right — future preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-start p-8 rounded-3xl relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${MILESTONES[selected].color}25`,
              boxShadow: `0 0 60px ${MILESTONES[selected].color}08`,
            }}
          >
            {/* Background glow */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ background: `radial-gradient(ellipse at 50% 30%, ${MILESTONES[selected].color}08, transparent 70%)` }}
              transition={{ duration: 0.6 }}
            />

            <div className="text-xs text-white/25 uppercase tracking-[0.3em] mb-8 relative z-10">
              Projected Future Self
            </div>

            <AnimatePresence mode="wait">
              <FutureAvatarPreview key={selected} milestone={MILESTONES[selected]} />
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
