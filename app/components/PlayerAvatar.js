"use client";
import { motion } from "framer-motion";
import { useGame } from "../lib/store";
import { useMemo } from "react";

// Avatar evolves visually every few levels
function getAvatarTier(level) {
  if (level >= 30) return { emoji: "🌌", title: "Cosmic Being",   ring: 5, shards: 8 };
  if (level >= 20) return { emoji: "👑", title: "Legendary",      ring: 4, shards: 6 };
  if (level >= 15) return { emoji: "⚡", title: "Champion",       ring: 3, shards: 5 };
  if (level >= 10) return { emoji: "🔮", title: "Adept",          ring: 3, shards: 4 };
  if (level >= 5)  return { emoji: "🗡️", title: "Warrior",        ring: 2, shards: 3 };
  return               { emoji: "🌱", title: "Initiate",         ring: 1, shards: 2 };
}

// Floating energy shard
function Shard({ index, total, color, radius, size }) {
  const angle = (index / total) * 360;
  const delay = index * (2 / total);
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        top: "50%", left: "50%",
        marginTop: -size / 2, marginLeft: -size / 2,
      }}
      animate={{
        x: [
          Math.cos((angle * Math.PI) / 180) * radius,
          Math.cos(((angle + 30) * Math.PI) / 180) * (radius + 8),
          Math.cos((angle * Math.PI) / 180) * radius,
        ],
        y: [
          Math.sin((angle * Math.PI) / 180) * radius,
          Math.sin(((angle + 30) * Math.PI) / 180) * (radius + 8),
          Math.sin((angle * Math.PI) / 180) * radius,
        ],
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.4, 1],
      }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// Energy ring
function EnergyRing({ radius, color, duration, clockwise, opacity = 0.4 }) {
  return (
    <motion.div
      className="absolute rounded-full border pointer-events-none"
      style={{
        width: radius * 2, height: radius * 2,
        top: "50%", left: "50%",
        marginTop: -radius, marginLeft: -radius,
        borderColor: color,
        opacity,
        boxShadow: `0 0 12px ${color}40`,
      }}
      animate={{ rotate: clockwise ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function PlayerAvatar({ size = "md", showTitle = true }) {
  const { state, getAuraColor, xpProgress } = useGame();
  const tier = getAvatarTier(state.level);
  const auraColor = getAuraColor();
  const xpPct = xpProgress();

  const sizes = {
    sm: { outer: 80,  inner: 52, font: "text-2xl", rings: [44, 60],       shardR: 38, shardSz: 4 },
    md: { outer: 140, inner: 88, font: "text-4xl", rings: [72, 96, 116],  shardR: 62, shardSz: 5 },
    lg: { outer: 200, inner: 128,font: "text-6xl", rings: [100,130,160],  shardR: 90, shardSz: 7 },
  };
  const s = sizes[size] || sizes.md;

  // Aura intensity scales with XP progress
  const auraIntensity = 0.15 + (xpPct / 100) * 0.35;

  const shards = useMemo(() =>
    Array.from({ length: tier.shards }, (_, i) => ({
      index: i, total: tier.shards,
      color: i % 2 === 0 ? auraColor : "#ffffff",
      radius: s.shardR,
      size: s.shardSz,
    })),
  [tier.shards, auraColor, s.shardR, s.shardSz]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: s.outer, height: s.outer }}>

        {/* Outer ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [auraIntensity, auraIntensity * 1.8, auraIntensity] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ background: `radial-gradient(circle, ${auraColor}60 0%, transparent 70%)` }}
        />

        {/* Energy rings */}
        {s.rings.map((r, i) => (
          <EnergyRing
            key={i}
            radius={r}
            color={auraColor}
            duration={8 + i * 4}
            clockwise={i % 2 === 0}
            opacity={0.25 + i * 0.05}
          />
        ))}

        {/* Floating shards */}
        {shards.map(sh => <Shard key={sh.index} {...sh} />)}

        {/* Core avatar */}
        <motion.div
          className="relative rounded-full flex items-center justify-center z-10"
          style={{
            width: s.inner, height: s.inner,
            background: `radial-gradient(circle at 35% 35%, ${auraColor}50, rgba(8,8,16,0.9))`,
            border: `2px solid ${auraColor}80`,
            boxShadow: `0 0 30px ${auraColor}60, 0 0 60px ${auraColor}25, inset 0 0 20px ${auraColor}20`,
          }}
          animate={{
            scale: [1, 1.03, 1],
            boxShadow: [
              `0 0 25px ${auraColor}50, 0 0 50px ${auraColor}20`,
              `0 0 40px ${auraColor}80, 0 0 80px ${auraColor}35`,
              `0 0 25px ${auraColor}50, 0 0 50px ${auraColor}20`,
            ],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={s.font}>{tier.emoji}</span>

          {/* Holographic scan line */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
            style={{ opacity: 0.15 }}
          >
            <motion.div
              className="absolute left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, transparent, ${auraColor}, transparent)` }}
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Level badge */}
        <motion.div
          className="absolute -bottom-1 -right-1 z-20 flex items-center justify-center rounded-full text-xs font-black"
          style={{
            width: s.outer * 0.28, height: s.outer * 0.28,
            background: `linear-gradient(135deg, ${auraColor}, ${auraColor}80)`,
            border: "2px solid rgba(8,8,16,0.9)",
            boxShadow: `0 0 12px ${auraColor}80`,
            fontSize: s.outer * 0.1,
            color: "white",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {state.level}
        </motion.div>
      </div>

      {showTitle && (
        <motion.div
          className="flex flex-col items-center gap-0.5"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: auraColor }}>
            {tier.title}
          </div>
          <div className="text-xs text-white/35">{state.user.name}</div>
        </motion.div>
      )}
    </div>
  );
}
