"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";
import { Play, ChevronRight, SkipForward, RotateCcw, Zap } from "lucide-react";

// ─── Lock-In Presentation Steps ───────────────────────────────────────────────
const STEPS = [
  {
    id: "cold-open",
    title: "In a world ruled by distraction…",
    subtitle: "Few choose discipline. Fewer still, transformation.",
    emoji: "🌑",
    color: "#ffffff",
    bg: "rgba(0,0,0,0.95)",
    duration: 4000,
    special: null,
  },
  {
    id: "system-chosen",
    title: "The system has chosen you.",
    subtitle: "You are Level 12. Your ascension begins now.",
    emoji: "⚡",
    color: "#a78bfa",
    bg: "rgba(4,2,14,0.95)",
    duration: 3500,
    special: null,
  },
  {
    id: "dashboard",
    title: "Your Command Center",
    subtitle: "XP. Streaks. Quests. All tracked in real time. This is your life OS.",
    emoji: "📊",
    color: "#60a5fa",
    bg: null,
    duration: 4000,
    route: "/dashboard",
    special: null,
  },
  {
    id: "quest-attack",
    title: "Every Habit is an Attack",
    subtitle: "Complete quests → earn XP → damage the boss → unlock skill nodes. One action. Four effects.",
    emoji: "⚔️",
    color: "#34d399",
    bg: null,
    duration: 4000,
    route: "/quests",
    special: null,
  },
  {
    id: "boss-fight",
    title: "The Daily Boss Awaits",
    subtitle: "Procrastination. Distraction. Inconsistency. They have HP. You have quests. Fight.",
    emoji: "👾",
    color: "#ef4444",
    bg: null,
    duration: 4000,
    route: "/boss",
    special: null,
  },
  {
    id: "boss-voice",
    title: "\"DISCIPLINE CANNOT SAVE YOU.\"",
    subtitle: "The boss taunts. The boss bleeds. The boss falls.",
    emoji: "��",
    color: "#ef4444",
    bg: "rgba(10,0,0,0.95)",
    duration: 3500,
    special: "bossVoice",
  },
  {
    id: "shadow-mode",
    title: "Enter Shadow Mode",
    subtitle: "Monochrome. Red aura. 2× XP. Distraction-free. This is what lock-in looks like.",
    emoji: "🌑",
    color: "#ef4444",
    bg: "rgba(5,0,0,0.95)",
    duration: 4000,
    special: "shadowMode",
  },
  {
    id: "level-up",
    title: "ASCENSION",
    subtitle: "XP threshold crossed. The world darkens. The screen shakes. You level up.",
    emoji: "⚡",
    color: "#fbbf24",
    bg: null,
    duration: 5000,
    special: "levelup",
  },
  {
    id: "skill-tree",
    title: "Skill Tree Unlocks",
    subtitle: "Every quest lights up nodes. Mind. Body. Discipline. Social. Creative. Your character evolves.",
    emoji: "🌿",
    color: "#34d399",
    bg: null,
    duration: 4000,
    route: "/skilltree",
    special: null,
  },
  {
    id: "domain",
    title: "Domain Expansion",
    subtitle: "Neon Slums → Crystal Spire → Void Temple → Celestial Throne. Your world transforms as you grow.",
    emoji: "🌌",
    color: "#22d3ee",
    bg: null,
    duration: 4000,
    route: "/domain",
    special: null,
  },
  {
    id: "future-self",
    title: "See Your Future Self",
    subtitle: "30 days: Discipline Warrior. 90 days: Discipline Monk. 365 days: Legendary Architect.",
    emoji: "🔮",
    color: "#f472b6",
    bg: null,
    duration: 4000,
    route: "/futureself",
    special: null,
  },
  {
    id: "finale",
    title: "This is LifeQuest AI.",
    subtitle: "Not a productivity app. A playable self-evolution simulator. Built to inspire. Built to win.",
    emoji: "🏆",
    color: "#fbbf24",
    bg: "rgba(8,6,0,0.95)",
    duration: 5000,
    special: "finale",
  },
];

// ─── Cinematic step card ───────────────────────────────────────────────────────
function StepCard({ step, onNext }) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.04, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative max-w-2xl w-full flex flex-col items-center gap-8 p-14 rounded-3xl text-center"
      style={{
        background: step.bg || "rgba(255,255,255,0.03)",
        border: `1px solid ${step.color}30`,
        boxShadow: `0 0 100px ${step.color}12, 0 0 200px ${step.color}06`,
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Corner accents */}
      {[["top-0 left-0","tl"],["top-0 right-0","tr"],["bottom-0 left-0","bl"],["bottom-0 right-0","br"]].map(([pos, key]) => (
        <div key={key} className={`absolute ${pos} w-12 h-12 pointer-events-none overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${step.color}80, transparent)` }} />
          <div className="absolute top-0 left-0 h-full w-0.5" style={{ background: `linear-gradient(180deg, ${step.color}80, transparent)` }} />
        </div>
      ))}

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${step.color}12, transparent 70%)` }}
      />

      {/* Emoji */}
      <motion.div
        animate={{ y: [0, -10, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl relative z-10"
      >
        {step.emoji}
      </motion.div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-3">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-black text-white tracking-tight leading-tight"
          style={{ textShadow: `0 0 40px ${step.color}50` }}
        >
          {step.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-white/55 text-base leading-relaxed max-w-md mx-auto"
        >
          {step.subtitle}
        </motion.p>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 rounded-b-3xl"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: step.duration / 1000, ease: "linear" }}
        style={{ background: `linear-gradient(90deg, ${step.color}, ${step.color}60)` }}
      />
    </motion.div>
  );
}

// ─── XP burst overlay ─────────────────────────────────────────────────────────
function XPBurst({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="xpburst"
          className="fixed inset-0 z-[99998] flex items-center justify-center pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7), rgba(96,165,250,0.4), transparent 70%)" }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: [0,-10,10,-7,7,-3,3,0], y: [0,5,-5,4,-4,0] }}
            transition={{ duration: 0.5 }}
          >
            {[1,2,3,4].map(i => (
              <motion.div key={i} className="absolute rounded-full border-2"
                style={{ borderColor: `rgba(139,92,246,${0.8-i*0.15})` }}
                initial={{ width:60, height:60, opacity:0.9 }}
                animate={{ width:60+i*240, height:60+i*240, opacity:0 }}
                transition={{ duration:1.2, delay:i*0.1, ease:"easeOut" }}
              />
            ))}
            <motion.div
              initial={{ scale:0.2, opacity:0, rotateY:-90 }}
              animate={{ scale:1, opacity:1, rotateY:0 }}
              exit={{ scale:1.4, opacity:0 }}
              transition={{ type:"spring", stiffness:250, damping:18, delay:0.1 }}
              className="flex flex-col items-center gap-3 px-16 py-10 rounded-3xl text-center"
              style={{
                background:"rgba(4,2,16,0.97)",
                border:"2px solid rgba(139,92,246,0.7)",
                boxShadow:"0 0 100px rgba(139,92,246,0.6)",
              }}
            >
              <motion.div animate={{ rotate:[0,15,-15,0], scale:[1,1.4,1] }} transition={{ duration:0.7, delay:0.3 }} className="text-6xl">⚡</motion.div>
              <div className="text-sm font-black uppercase tracking-[0.4em] text-violet-400">✦ ASCENSION ✦</div>
              <div className="text-[88px] font-black leading-none text-white" style={{ textShadow:"0 0 40px rgba(139,92,246,0.9)" }}>13</div>
              <div className="text-white/50 text-sm">Level 13 Achieved. The world shifts.</div>
            </motion.div>
          </motion.div>
          {Array.from({length:80}).map((_,i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{ width:3+Math.random()*5, height:3+Math.random()*5,
                background:["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#fff"][i%6],
                left:"50%", top:"50%" }}
              initial={{ opacity:1, x:0, y:0, scale:1.5 }}
              animate={{ opacity:0, x:Math.cos((i/80)*Math.PI*2)*(120+Math.random()*200), y:Math.sin((i/80)*Math.PI*2)*(120+Math.random()*200), scale:0 }}
              transition={{ duration:1.4, ease:"easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const router = useRouter();
  const { toggleShadowMode, shadowMode } = useGame();
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [showBossVoice, setShowBossVoice] = useState(false);
  const autoRef = useRef(null);
  const step = STEPS[current];

  const advance = useCallback(() => {
    setCurrent(s => {
      if (s >= STEPS.length - 1) { setAutoPlay(false); return s; }
      return s + 1;
    });
  }, []);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) { clearTimeout(autoRef.current); return; }
    autoRef.current = setTimeout(advance, step.duration);
    return () => clearTimeout(autoRef.current);
  }, [autoPlay, current, advance, step.duration]);

  // Handle special steps
  useEffect(() => {
    if (step.special === "levelup") {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 4500);
    }
    if (step.special === "bossVoice") {
      setShowBossVoice(true);
      setTimeout(() => setShowBossVoice(false), 3000);
    }
    if (step.special === "shadowMode" && !shadowMode) {
      setTimeout(() => toggleShadowMode(), 600);
      setTimeout(() => toggleShadowMode(), 4000);
    }
  }, [current]); // eslint-disable-line

  function handleAction() {
    if (step.special === "finale") { setCurrent(0); setAutoPlay(false); return; }
    if (step.route) { router.push(step.route); return; }
    advance();
  }

  return (
    <AppShell>
      <XPBurst show={showXP} />

      {/* Boss voice overlay */}
      <AnimatePresence>
        {showBossVoice && (
          <motion.div
            key="bv"
            className="fixed bottom-16 left-1/2 z-[99990] pointer-events-none"
            style={{ translateX: "-50%" }}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
          >
            <div className="flex items-center gap-3 px-8 py-4 rounded-2xl"
              style={{ background:"rgba(10,0,0,0.95)", border:"1px solid rgba(239,68,68,0.5)", boxShadow:"0 0 40px rgba(239,68,68,0.3)" }}>
              <span className="text-2xl">👾</span>
              <span className="text-base font-black uppercase tracking-wider text-red-400">
                &ldquo;DISCIPLINE CANNOT SAVE YOU.&rdquo;
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Dynamic background glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ background: `radial-gradient(ellipse at 50% 40%, ${step.color}06, transparent 70%)` }}
          transition={{ duration: 0.8 }}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm font-bold"
            style={{ boxShadow: "0 0 15px rgba(139,92,246,0.5)" }}>LQ</div>
          <span className="font-bold text-white tracking-tight">LifeQuest AI</span>
          <span className="text-white/20 mx-2">·</span>
          <span className="text-xs text-white/30 uppercase tracking-widest">Lock-In Presentation Mode</span>
        </motion.div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 mb-10 flex-wrap justify-center max-w-sm">
          {STEPS.map((s, i) => (
            <motion.button
              key={s.id}
              onClick={() => { setCurrent(i); setAutoPlay(false); }}
              className="rounded-full transition-all"
              animate={{
                width: i === current ? 20 : 8,
                height: 8,
                background: i < current ? "#34d399" : i === current ? s.color : "rgba(255,255,255,0.15)",
                boxShadow: i === current ? `0 0 8px ${s.color}` : "none",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          <StepCard key={step.id} step={step} onNext={advance} />
        </AnimatePresence>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: `0 0 30px ${step.color}50` }}
            whileTap={{ scale: 0.96 }}
            onClick={handleAction}
            className="flex items-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${step.color}cc, ${step.color}77)`,
              boxShadow: `0 0 20px ${step.color}40`,
            }}
          >
            {step.special === "finale" ? "Restart" : step.route ? `Go to ${step.route.replace("/","").replace(/^\w/,c=>c.toUpperCase())}` : "Continue"}
            <ChevronRight size={18} />
          </motion.button>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => setCurrent(s => Math.max(s-1,0))}
            disabled={current === 0}
            className="px-4 py-2 rounded-xl text-sm text-white/35 hover:text-white/60 transition-colors disabled:opacity-20"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}
          >← Prev</button>

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setAutoPlay(v => !v)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: autoPlay ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
              border: autoPlay ? "1px solid rgba(251,191,36,0.35)" : "1px solid rgba(255,255,255,0.08)",
              color: autoPlay ? "#fbbf24" : "rgba(255,255,255,0.5)",
            }}
          >
            {autoPlay
              ? <><SkipForward size={14} /> Auto-playing</>
              : <><Play size={14} /> Auto-play</>
            }
          </motion.button>

          <button
            onClick={() => setCurrent(s => Math.min(s+1,STEPS.length-1))}
            disabled={current === STEPS.length-1}
            className="px-4 py-2 rounded-xl text-sm text-white/35 hover:text-white/60 transition-colors disabled:opacity-20"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}
          >Next →</button>
        </div>

        <button
          onClick={() => { setCurrent(0); setAutoPlay(false); }}
          className="mt-4 flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>
    </AppShell>
  );
}
