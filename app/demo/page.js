"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";
import { Play, ChevronRight, SkipForward, RotateCcw } from "lucide-react";

const DEMO_STEPS = [
  {
    id: "intro",
    title: "Welcome to LifeQuest AI",
    subtitle: "A cinematic life RPG that turns self-improvement into an epic adventure.",
    action: "Begin Demo",
    route: null,
    highlight: null,
    emoji: "🚀",
    color: "#a78bfa",
  },
  {
    id: "dashboard",
    title: "Your Command Center",
    subtitle: "Track XP, level progression, streaks, and daily quests — all in real time.",
    action: "View Dashboard",
    route: "/dashboard",
    highlight: "dashboard",
    emoji: "📊",
    color: "#60a5fa",
  },
  {
    id: "quests",
    title: "Complete a Quest",
    subtitle: "Every habit you complete earns XP, damages the boss, and unlocks skill nodes.",
    action: "Go to Quests",
    route: "/quests",
    highlight: "quests",
    emoji: "⚔️",
    color: "#34d399",
  },
  {
    id: "boss",
    title: "Boss Battle",
    subtitle: "Your quests deal damage to the Daily Boss — Procrastination, Distraction, Inconsistency.",
    action: "Fight the Boss",
    route: "/boss",
    highlight: "boss",
    emoji: "👾",
    color: "#ef4444",
  },
  {
    id: "levelup",
    title: "Level Up Cinematic",
    subtitle: "When XP crosses a threshold, a fullscreen cinematic fires — particles, screen shake, aura rings.",
    action: "Trigger Level Up",
    route: null,
    highlight: "levelup",
    emoji: "⚡",
    color: "#fbbf24",
    special: "levelup",
  },
  {
    id: "skilltree",
    title: "Skill Tree Unlocks",
    subtitle: "Completing quests lights up nodes across Mind, Body, Discipline, Social, and Creative branches.",
    action: "View Skill Tree",
    route: "/skilltree",
    highlight: "skilltree",
    emoji: "🌿",
    color: "#34d399",
  },
  {
    id: "world",
    title: "Your World Evolves",
    subtitle: "As you level up, your world transforms — from The Awakening to the Cosmic Realm.",
    action: "Enter the World",
    route: "/world",
    highlight: "world",
    emoji: "🌍",
    color: "#22d3ee",
  },
  {
    id: "coach",
    title: "AI Coach",
    subtitle: "Your personal AI coach responds to your struggles with smart, motivational guidance.",
    action: "Talk to Coach",
    route: "/coach",
    highlight: "coach",
    emoji: "🤖",
    color: "#a78bfa",
  },
  {
    id: "end",
    title: "That's LifeQuest AI",
    subtitle: "A fully functional, cinematic life RPG prototype. Built to inspire, built to demo.",
    action: "Restart Demo",
    route: null,
    highlight: null,
    emoji: "🏆",
    color: "#fbbf24",
    special: "end",
  },
];

function StepDot({ step, current, done }) {
  return (
    <motion.div
      className="w-2.5 h-2.5 rounded-full transition-all"
      animate={{
        scale: current ? 1.4 : 1,
        background: done ? "#34d399" : current ? step.color : "rgba(255,255,255,0.15)",
        boxShadow: current ? `0 0 10px ${step.color}` : "none",
      }}
      transition={{ duration: 0.3 }}
    />
  );
}

export default function DemoPage() {
  const router = useRouter();
  const { levelUpAnim, state } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const autoRef = useRef(null);
  const step = DEMO_STEPS[currentStep];

  // Auto-advance
  useEffect(() => {
    if (!autoPlay) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(() => {
      setCurrentStep(s => {
        if (s >= DEMO_STEPS.length - 1) { setAutoPlay(false); return s; }
        return s + 1;
      });
    }, 4000);
    return () => clearInterval(autoRef.current);
  }, [autoPlay]);

  function handleAction() {
    if (step.special === "levelup") {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3500);
      setTimeout(() => setCurrentStep(s => Math.min(s + 1, DEMO_STEPS.length - 1)), 3600);
      return;
    }
    if (step.special === "end") {
      setCurrentStep(0);
      return;
    }
    if (step.route) {
      router.push(step.route);
      return;
    }
    setCurrentStep(s => Math.min(s + 1, DEMO_STEPS.length - 1));
  }

  function next() { setCurrentStep(s => Math.min(s + 1, DEMO_STEPS.length - 1)); }
  function prev() { setCurrentStep(s => Math.max(s - 1, 0)); }

  return (
    <AppShell>
      {/* Level up cinematic overlay for demo */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            key="demo-levelup"
            className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0"
              initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.7 }}
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, rgba(96,165,250,0.4) 50%, transparent 80%)" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ x: [0,-10,10,-8,8,-4,4,0], y: [0,5,-5,4,-4,0] }}
              transition={{ duration: 0.5 }}
            >
              {[1,2,3].map(i => (
                <motion.div key={i} className="absolute rounded-full border-2"
                  style={{ borderColor: `rgba(139,92,246,${0.7-i*0.15})` }}
                  initial={{ width: 80, height: 80, opacity: 0.9 }}
                  animate={{ width: 80+i*200, height: 80+i*200, opacity: 0 }}
                  transition={{ duration: 1.3, delay: i*0.15 }}
                />
              ))}
              <motion.div
                initial={{ scale: 0.2, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 1.3, opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                className="flex flex-col items-center gap-3 px-16 py-10 rounded-3xl text-center"
                style={{
                  background: "rgba(8,6,24,0.95)",
                  border: "2px solid rgba(139,92,246,0.7)",
                  boxShadow: "0 0 100px rgba(139,92,246,0.6), 0 0 200px rgba(96,165,250,0.2)",
                }}
              >
                <motion.div animate={{ rotate:[0,12,-12,0], scale:[1,1.3,1] }} transition={{ duration: 0.7, delay: 0.3 }} className="text-6xl">⚡</motion.div>
                <div className="text-sm font-bold uppercase tracking-[0.35em] text-violet-400">Level Up!</div>
                <div className="text-8xl font-black text-white" style={{ textShadow: "0 0 40px rgba(139,92,246,0.9)" }}>
                  {state.level + 1}
                </div>
                <div className="text-white/50 text-sm">You are now Level {state.level + 1} Adventurer</div>
              </motion.div>
            </motion.div>
            {/* Particles */}
            {Array.from({length:50}).map((_,i) => (
              <motion.div key={i} className="absolute w-2 h-2 rounded-full"
                style={{ left:"50%", top:"50%", background: ["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#fff"][i%6] }}
                initial={{ opacity:1, scale:1, x:0, y:0 }}
                animate={{ opacity:0, scale:0, x: Math.cos((i/50)*Math.PI*2)*(150+Math.random()*150), y: Math.sin((i/50)*Math.PI*2)*(150+Math.random()*150) }}
                transition={{ duration: 1.3, ease:"easeOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
        {/* Background glow matching step color */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ background: `radial-gradient(ellipse at 50% 40%, ${step.color}08, transparent 70%)` }}
          transition={{ duration: 0.8 }}
        />

        {/* Step dots */}
        <div className="flex items-center gap-2 mb-12">
          {DEMO_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setCurrentStep(i)}>
              <StepDot step={s} current={i === currentStep} done={i < currentStep} />
            </button>
          ))}
        </div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.02 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative max-w-2xl w-full flex flex-col items-center gap-8 p-12 rounded-3xl text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${step.color}30`,
              boxShadow: `0 0 80px ${step.color}12, 0 0 160px ${step.color}06`,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-20 h-20 rounded-tl-3xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }} />
              <div className="absolute top-0 left-0 h-full w-0.5" style={{ background: `linear-gradient(180deg, ${step.color}, transparent)` }} />
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 rounded-br-3xl overflow-hidden pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-0.5" style={{ background: `linear-gradient(270deg, ${step.color}, transparent)` }} />
              <div className="absolute bottom-0 right-0 h-full w-0.5" style={{ background: `linear-gradient(0deg, ${step.color}, transparent)` }} />
            </div>

            {/* Step counter */}
            <div className="text-xs uppercase tracking-[0.3em] text-white/25">
              Step {currentStep + 1} of {DEMO_STEPS.length}
            </div>

            {/* Emoji */}
            <motion.div
              animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-7xl"
            >
              {step.emoji}
            </motion.div>

            {/* Text */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-black text-white tracking-tight"
                style={{ textShadow: `0 0 30px ${step.color}50` }}>
                {step.title}
              </h2>
              <p className="text-white/55 text-base leading-relaxed max-w-md mx-auto">
                {step.subtitle}
              </p>
            </div>

            {/* Action button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${step.color}50` }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAction}
              className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${step.color}cc, ${step.color}88)`,
                boxShadow: `0 0 20px ${step.color}40`,
              }}
            >
              {step.action}
              <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={prev}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors disabled:opacity-20"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            ← Prev
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setAutoPlay(v => !v)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: autoPlay ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)",
              border: autoPlay ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: autoPlay ? "#fbbf24" : "rgba(255,255,255,0.5)",
            }}
          >
            {autoPlay ? <><SkipForward size={14} /> Auto-playing...</> : <><Play size={14} /> Auto-play</>}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={next}
            disabled={currentStep === DEMO_STEPS.length - 1}
            className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white/70 transition-colors disabled:opacity-20"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Next →
          </motion.button>
        </div>

        {/* Reset */}
        <button
          onClick={() => { setCurrentStep(0); setAutoPlay(false); }}
          className="mt-4 flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          <RotateCcw size={11} /> Reset demo
        </button>
      </div>
    </AppShell>
  );
}
