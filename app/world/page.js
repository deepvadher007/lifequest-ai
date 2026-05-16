"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";

// Floating particle
function Particle({ x, y, size, color, duration, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, filter: "blur(1px)" }}
      animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.3, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Hologram panel
function HoloPanel({ x, y, width, label, value, color, delay, unlocked }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: unlocked ? 1 : 0.3, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="absolute flex flex-col gap-1 px-4 py-3 rounded-xl pointer-events-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        width,
        background: `rgba(${color},0.08)`,
        border: `1px solid rgba(${color},0.3)`,
        boxShadow: unlocked ? `0 0 20px rgba(${color},0.15)` : "none",
        backdropFilter: "blur(8px)",
        filter: unlocked ? "none" : "grayscale(1)",
      }}
    >
      <div className="text-xs uppercase tracking-widest" style={{ color: `rgba(${color},0.7)` }}>{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay }}
        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
        style={{ background: `rgb(${color})` }}
      />
    </motion.div>
  );
}

// Scan line effect
function ScanLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="w-full h-px bg-white" style={{ marginTop: `${i * 2.5}%` }} />
      ))}
    </div>
  );
}

// Grid floor
function GridFloor({ mouseX, mouseY }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        transform: "perspective(400px) rotateX(60deg)",
        transformOrigin: "bottom center",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 4,
  color: ["rgba(139,92,246,0.8)", "rgba(96,165,250,0.8)", "rgba(52,211,153,0.8)", "rgba(251,191,36,0.6)"][i % 4],
  duration: 3 + Math.random() * 4,
  delay: Math.random() * 3,
}));

// World tiers based on level
function getWorldTier(level) {
  if (level >= 20) return { name: "Cosmic Realm", color: "139,92,246", bg: "from-violet-950 via-indigo-950 to-black", desc: "You have transcended. The cosmos bends to your will." };
  if (level >= 15) return { name: "Neon Citadel", color: "96,165,250", bg: "from-blue-950 via-slate-950 to-black", desc: "The city of champions. Your legend echoes here." };
  if (level >= 10) return { name: "Crystal Spire", color: "52,211,153", bg: "from-emerald-950 via-teal-950 to-black", desc: "Clarity and focus crystallized into form." };
  if (level >= 5)  return { name: "Iron Forge",   color: "251,191,36",  bg: "from-amber-950 via-orange-950 to-black", desc: "Where discipline is forged in fire." };
  return              { name: "The Awakening",  color: "249,115,22",  bg: "from-orange-950 via-red-950 to-black", desc: "Your journey begins. The world awaits." };
}

export default function WorldPage() {
  const { state } = useGame();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const containerRef = useRef(null);
  const tier = getWorldTier(state.level);
  const xpPct = Math.round((state.xp % 10000) / 100);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 30);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 20);
  }, [mouseX, mouseY]);

  const panels = [
    { x: 3,  y: 15, width: 160, label: "Level",    value: state.level,                    color: "139,92,246", delay: 0.2, unlocked: true },
    { x: 3,  y: 38, width: 160, label: "XP",        value: `${state.xp.toLocaleString()}`, color: "96,165,250", delay: 0.3, unlocked: true },
    { x: 3,  y: 61, width: 160, label: "Streak",    value: `${state.streak} days`,         color: "251,191,36", delay: 0.4, unlocked: true },
    { x: 78, y: 15, width: 160, label: "Quests",    value: state.totalQuestsCompleted,     color: "52,211,153", delay: 0.2, unlocked: true },
    { x: 78, y: 38, width: 160, label: "Boss HP",   value: `${state.bossHP} / 126`,        color: "249,115,22", delay: 0.3, unlocked: true },
    { x: 78, y: 61, width: 160, label: "World",     value: tier.name,                      color: tier.color,   delay: 0.4, unlocked: true },
  ];

  return (
    <AppShell>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen overflow-hidden cursor-crosshair"
        style={{ background: `linear-gradient(135deg, #030308, #080818, #030308)` }}
      >
        <ScanLines />

        {/* Deep space background */}
        <div className="absolute inset-0">
          {/* Stars */}
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() > 0.9 ? 2 : 1,
                height: Math.random() > 0.9 ? 2 : 1,
              }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        {/* Parallax layers */}
        <motion.div
          className="absolute inset-0"
          style={{ x: springX, y: springY }}
        >
          {/* Outer glow rings */}
          {[300, 500, 700].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size, height: size,
                left: "50%", top: "50%",
                marginLeft: -size / 2, marginTop: -size / 2,
                borderColor: `rgba(${tier.color},${0.15 - i * 0.04})`,
                boxShadow: `0 0 ${30 + i * 20}px rgba(${tier.color},0.05)`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
            />
          ))}

          {/* Central orb */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 180, height: 180,
              left: "50%", top: "50%",
              marginLeft: -90, marginTop: -90,
              background: `radial-gradient(circle, rgba(${tier.color},0.4) 0%, rgba(${tier.color},0.1) 50%, transparent 80%)`,
              boxShadow: `0 0 60px rgba(${tier.color},0.4), 0 0 120px rgba(${tier.color},0.15)`,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Inner core */}
            <div className="absolute inset-8 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, rgba(${tier.color},0.8), rgba(${tier.color},0.2))` }}>
              <div className="text-center">
                <div className="text-3xl font-black text-white" style={{ textShadow: `0 0 20px rgba(${tier.color},1)` }}>
                  {state.level}
                </div>
                <div className="text-xs text-white/60 uppercase tracking-widest">Level</div>
              </div>
            </div>
          </motion.div>

          {/* Orbiting nodes */}
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const r = 160;
            const nx = 50 + (r / 10) * Math.cos(rad);
            const ny = 50 + (r / 10) * Math.sin(rad);
            const nodeColors = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f472b6"];
            const nodeLabels = ["Mind", "Body", "Discipline", "Social", "Creative"];
            const unlocked = state.level >= (i + 1) * 2;
            return (
              <motion.div
                key={i}
                className="absolute flex flex-col items-center gap-1"
                style={{ left: `${nx}%`, top: `${ny}%`, transform: "translate(-50%,-50%)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30 + i * 5, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
                  style={{
                    background: unlocked ? `rgba(${nodeColors[i].replace("#","")},0.2)` : "rgba(255,255,255,0.05)",
                    border: `2px solid ${unlocked ? nodeColors[i] : "rgba(255,255,255,0.1)"}`,
                    boxShadow: unlocked ? `0 0 15px ${nodeColors[i]}60` : "none",
                    color: unlocked ? nodeColors[i] : "rgba(255,255,255,0.2)",
                    filter: unlocked ? "none" : "grayscale(1)",
                  }}
                  animate={unlocked ? { boxShadow: [`0 0 10px ${nodeColors[i]}40`, `0 0 25px ${nodeColors[i]}80`, `0 0 10px ${nodeColors[i]}40`] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                >
                  {unlocked ? "✓" : "🔒"}
                </motion.div>
                <div className="text-xs font-medium" style={{ color: unlocked ? nodeColors[i] : "rgba(255,255,255,0.2)" }}>
                  {nodeLabels[i]}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Particles layer */}
        <div className="absolute inset-0 pointer-events-none">
          {PARTICLES.map(p => <Particle key={p.id} {...p} />)}
        </div>

        {/* Grid floor */}
        <GridFloor />

        {/* Hologram panels */}
        {panels.map((p, i) => <HoloPanel key={i} {...p} />)}

        {/* World name overlay */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        >
          <div className="text-xs uppercase tracking-[0.4em] text-white/30">Current World</div>
          <div
            className="text-2xl font-black tracking-tight"
            style={{
              background: `linear-gradient(135deg, rgb(${tier.color}), white)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              textShadow: "none",
              filter: `drop-shadow(0 0 12px rgba(${tier.color},0.6))`,
            }}
          >
            {tier.name}
          </div>
          <div className="text-xs text-white/35 max-w-xs text-center">{tier.desc}</div>
        </motion.div>

        {/* XP progress at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 flex flex-col gap-2 pointer-events-none">
          <div className="flex justify-between text-xs text-white/40">
            <span>Level {state.level}</span>
            <span>{xpPct}% to Level {state.level + 1}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5">
            <motion.div
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, rgb(${tier.color}), white)`, boxShadow: `0 0 8px rgba(${tier.color},0.6)` }}
            />
          </div>
        </div>

        {/* Tier unlock message */}
        <AnimatePresence>
          {state.level < 5 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 text-xs text-white/30 pointer-events-none"
            >
              Reach Level 5 to unlock the Iron Forge world →
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
