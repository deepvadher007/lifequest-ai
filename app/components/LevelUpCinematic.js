"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../lib/store";
import { useEffect, useRef } from "react";

function Particle({ x, y, color, angle, speed }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ left: x, top: y, background: color }}
      initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      animate={{
        opacity: 0,
        scale: 0,
        x: Math.cos(angle) * speed * 200,
        y: Math.sin(angle) * speed * 200,
      }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

const COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f472b6", "#ffffff"];
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: "50%",
  y: "50%",
  color: COLORS[i % COLORS.length],
  angle: (i / 60) * Math.PI * 2,
  speed: 0.4 + Math.random() * 0.6,
}));

export default function LevelUpCinematic() {
  const { levelUpAnim, state } = useGame();

  return (
    <AnimatePresence>
      {levelUpAnim && (
        <motion.div
          key="levelup"
          className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Screen flash */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, rgba(96,165,250,0.3) 50%, transparent 80%)" }}
          />

          {/* Screen shake wrapper */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, 4, -4, 3, -3, 0] }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Aura rings */}
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{ borderColor: `rgba(139,92,246,${0.6 - i * 0.15})` }}
                initial={{ width: 80, height: 80, opacity: 0.8 }}
                animate={{ width: 80 + i * 180, height: 80 + i * 180, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
              />
            ))}

            {/* Main card */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="relative flex flex-col items-center gap-3 px-16 py-10 rounded-3xl text-center"
              style={{
                background: "rgba(10,8,30,0.92)",
                border: "2px solid rgba(139,92,246,0.6)",
                boxShadow: "0 0 80px rgba(139,92,246,0.5), 0 0 160px rgba(96,165,250,0.2), inset 0 0 40px rgba(139,92,246,0.1)",
              }}
            >
              {/* Glow behind text */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.2), transparent 70%)" }}
                />
              </div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-5xl relative z-10"
              >⚡</motion.div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-bold uppercase tracking-[0.3em] mb-1"
                  style={{ color: "#a78bfa" }}
                >
                  Level Up!
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                  className="text-7xl font-black text-white"
                  style={{ textShadow: "0 0 30px rgba(139,92,246,0.8), 0 0 60px rgba(96,165,250,0.4)" }}
                >
                  {state.level}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/50 text-sm mt-1"
                >
                  You are now Level {state.level} Adventurer
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Particles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {PARTICLES.map(p => <Particle key={p.id} {...p} />)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
