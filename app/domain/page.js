"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import AppShell from "../components/AppShell";
import PlayerAvatar from "../components/PlayerAvatar";
import { useGame } from "../lib/store";

const DOMAIN_DATA = [
  {
    id: "neon",
    name: "Neon Slums",
    minLevel: 1,
    color: "249,115,22",
    accent: "#fb923c",
    bg: "from-orange-950 via-red-950",
    emoji: "🏚️",
    tagline: "Where every story begins.",
    desc: "Raw. Unfiltered. Hungry. The neon slums are where warriors are born from nothing. Every quest here is survival.",
    particles: ["rgba(249,115,22,0.8)", "rgba(239,68,68,0.6)", "rgba(251,191,36,0.5)"],
    avatarAura: "#fb923c",
    atmosphere: "Gritty. Desperate. Electric.",
    unlockMsg: "You were born here. Rise above it.",
  },
  {
    id: "crystal",
    name: "Crystal Spire",
    minLevel: 5,
    color: "52,211,153",
    accent: "#34d399",
    bg: "from-emerald-950 via-teal-950",
    emoji: "💎",
    tagline: "Clarity crystallized into form.",
    desc: "Focus becomes your superpower here. The Crystal Spire rewards those who have mastered their mind and built real habits.",
    particles: ["rgba(52,211,153,0.8)", "rgba(6,182,212,0.6)", "rgba(96,165,250,0.5)"],
    avatarAura: "#34d399",
    atmosphere: "Clear. Focused. Precise.",
    unlockMsg: "Reach Level 5 to unlock.",
  },
  {
    id: "void",
    name: "Void Temple",
    minLevel: 10,
    color: "139,92,246",
    accent: "#a78bfa",
    bg: "from-violet-950 via-indigo-950",
    emoji: "🌀",
    tagline: "Beyond the physical. Pure will.",
    desc: "The Void Temple exists outside time. Only those who have transcended distraction can enter. Pure discipline. Pure power.",
    particles: ["rgba(139,92,246,0.8)", "rgba(167,139,250,0.6)", "rgba(244,114,182,0.5)"],
    avatarAura: "#a78bfa",
    atmosphere: "Transcendent. Timeless. Absolute.",
    unlockMsg: "Reach Level 10 to unlock.",
  },
  {
    id: "celestial",
    name: "Celestial Throne",
    minLevel: 20,
    color: "251,191,36",
    accent: "#fbbf24",
    bg: "from-yellow-950 via-amber-950",
    emoji: "👑",
    tagline: "The apex. Few ever reach this realm.",
    desc: "The Celestial Throne is reserved for those who have built the life others only dream about. You are chosen.",
    particles: ["rgba(251,191,36,0.8)", "rgba(245,158,11,0.6)", "rgba(255,255,255,0.4)"],
    avatarAura: "#fbbf24",
    atmosphere: "Divine. Legendary. Eternal.",
    unlockMsg: "Reach Level 20 to unlock.",
  },
];

function DomainParticle({ x, y, color, dur, delay, size }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, filter: "blur(0.5px)" }}
      animate={{ y: [0, -50, 0], opacity: [0, 0.9, 0], scale: [0.5, 1.3, 0.5] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function DomainCard({ domain, active, unlocked, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(domain.id)}
      whileHover={{ scale: unlocked ? 1.03 : 1.01, y: unlocked ? -4 : 0 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex flex-col gap-3 p-5 rounded-2xl text-left overflow-hidden transition-all"
      style={{
        background: active ? `rgba(${domain.color},0.12)` : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? `rgba(${domain.color},0.4)` : "rgba(255,255,255,0.07)"}`,
        boxShadow: active ? `0 0 30px rgba(${domain.color},0.15)` : "none",
        opacity: unlocked ? 1 : 0.5,
        filter: unlocked ? "none" : "grayscale(0.6)",
      }}
    >
      {/* Active glow */}
      {active && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `radial-gradient(ellipse at 30% 30%, rgba(${domain.color},0.15), transparent 70%)` }}
        />
      )}

      <div className="flex items-center gap-3 relative z-10">
        <span className="text-2xl">{domain.emoji}</span>
        <div>
          <div className="font-bold text-sm text-white">{domain.name}</div>
          <div className="text-xs" style={{ color: unlocked ? domain.accent : "rgba(255,255,255,0.3)" }}>
            {unlocked ? `Level ${domain.minLevel}+` : `🔒 ${domain.unlockMsg}`}
          </div>
        </div>
        {active && (
          <motion.div
            className="ml-auto w-2 h-2 rounded-full"
            style={{ background: domain.accent, boxShadow: `0 0 8px ${domain.accent}` }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <div className="text-xs text-white/40 relative z-10 italic">&ldquo;{domain.tagline}&rdquo;</div>
    </motion.button>
  );
}

const PARTICLES_PER_DOMAIN = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: 3 + Math.random() * 4,
  delay: Math.random() * 4,
  size: 2 + Math.random() * 4,
}));

export default function DomainPage() {
  const { state, getCurrentDomain } = useGame();
  const currentDomain = getCurrentDomain();
  const [selected, setSelected] = useState(currentDomain.id);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 25);
    mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 15);
  }, [mouseX, mouseY]);

  const domain = DOMAIN_DATA.find(d => d.id === selected) || DOMAIN_DATA[0];
  const unlocked = state.level >= domain.minLevel;

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Domain Expansion</h1>
          <p className="text-white/40 mt-1">Your world evolves as you level up. Each domain is a different reality.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — domain selector */}
          <div className="flex flex-col gap-3">
            <div className="text-xs text-white/30 uppercase tracking-widest mb-2">Choose Domain</div>
            {DOMAIN_DATA.map(d => (
              <DomainCard
                key={d.id}
                domain={d}
                active={selected === d.id}
                unlocked={state.level >= d.minLevel}
                onClick={setSelected}
              />
            ))}
          </div>

          {/* Right — domain showcase */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            key={selected}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 relative rounded-3xl overflow-hidden cursor-crosshair"
            style={{
              minHeight: 520,
              background: `linear-gradient(135deg, rgba(${domain.color},0.08), rgba(0,0,0,0.6))`,
              border: `1px solid rgba(${domain.color},0.25)`,
              boxShadow: `0 0 60px rgba(${domain.color},0.1)`,
            }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ background: `radial-gradient(ellipse at 50% 30%, rgba(${domain.color},0.15), transparent 70%)` }}
            />

            {/* Grid floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(${domain.color},0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(${domain.color},0.2) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                transform: "perspective(300px) rotateX(55deg)",
                transformOrigin: "bottom",
                maskImage: "linear-gradient(to top, black, transparent)",
                opacity: 0.4,
              }}
            />

            {/* Scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-full h-px bg-white" style={{ marginTop: `${i * 3.4}%` }} />
              ))}
            </div>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {PARTICLES_PER_DOMAIN.map(p => (
                <DomainParticle
                  key={p.id}
                  {...p}
                  color={domain.particles[p.id % domain.particles.length]}
                />
              ))}
            </div>

            {/* Parallax content */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8"
              style={{ x: springX, y: springY }}
            >
              {/* Orbiting rings */}
              {[120, 160, 200].map((r, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border pointer-events-none"
                  style={{
                    width: r * 2, height: r * 2,
                    borderColor: `rgba(${domain.color},${0.2 - i * 0.05})`,
                  }}
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 15 + i * 8, repeat: Infinity, ease: "linear" }}
                />
              ))}

              {/* Avatar in domain */}
              <div className="relative z-10">
                <PlayerAvatar size="lg" showTitle={false} />
              </div>

              {/* Domain name */}
              <motion.div
                className="relative z-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-5xl mb-3">{domain.emoji}</div>
                <div
                  className="text-4xl font-black mb-2"
                  style={{
                    background: `linear-gradient(135deg, rgb(${domain.color}), white, rgb(${domain.color}))`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    filter: `drop-shadow(0 0 20px rgba(${domain.color},0.6))`,
                  }}
                >
                  {domain.name}
                </div>
                <div className="text-white/50 text-sm max-w-sm leading-relaxed">{domain.desc}</div>
              </motion.div>
            </motion.div>

            {/* Bottom info bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", borderTop: `1px solid rgba(${domain.color},0.2)` }}
            >
              <div>
                <div className="text-xs text-white/30 uppercase tracking-widest">Atmosphere</div>
                <div className="text-sm font-bold" style={{ color: domain.accent }}>{domain.atmosphere}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/30 uppercase tracking-widest">Required Level</div>
                <div className="text-2xl font-black" style={{ color: domain.accent }}>{domain.minLevel}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/30 uppercase tracking-widest">Status</div>
                <div className="text-sm font-bold" style={{ color: unlocked ? "#34d399" : "#ef4444" }}>
                  {unlocked ? "✓ UNLOCKED" : `🔒 LOCKED`}
                </div>
              </div>
            </motion.div>

            {/* Locked overlay */}
            {!unlocked && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">🔒</div>
                  <div className="text-white/60 font-bold">Reach Level {domain.minLevel}</div>
                  <div className="text-white/30 text-sm mt-1">to unlock this domain</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
