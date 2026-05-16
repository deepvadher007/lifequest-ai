"use client";
import { motion } from "framer-motion";
import { useGame } from "../lib/store";

export default function AmbientBackground() {
  const { getCurrentDomain, shadowMode, state } = useGame();
  const domain = getCurrentDomain ? getCurrentDomain() : { color: "139,92,246" };
  const decaying = state?.streakDecaying;
  const r = shadowMode ? "239,68,68" : decaying ? "239,68,68" : domain.color;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: shadowMode ? "#050000" : decaying ? "#060000" : "#080810",
        transition: "background 1s ease",
      }}
    >
      {/* Blob 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700, top: "-15%", left: "-8%",
          background: `radial-gradient(circle, rgba(${r},0.07) 0%, transparent 70%)`,
          willChange: "transform",
        }}
        animate={{ x: [0, 35, 0], y: [0, 25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Blob 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, bottom: "-8%", right: "-4%",
          background: `radial-gradient(circle, rgba(${r},0.05) 0%, transparent 70%)`,
          willChange: "transform",
        }}
        animate={{ x: [0, -25, 0], y: [0, -18, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      {/* Blob 3 — hidden on mobile for perf */}
      <motion.div
        className="absolute rounded-full hidden md:block"
        style={{
          width: 400, height: 400, top: "40%", right: "18%",
          background: `radial-gradient(circle, rgba(${r},0.04) 0%, transparent 70%)`,
          willChange: "transform",
        }}
        animate={{ x: [0, 18, -18, 0], y: [0, -20, 8, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />

      {/* Glitch lines — streak decay */}
      {decaying && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0, 0.04, 0, 0.03, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
          style={{ background: "repeating-linear-gradient(0deg, rgba(239,68,68,0.08) 0px, transparent 2px, transparent 6px)" }}
        />
      )}

      {/* Grid — lighter on mobile */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(${r},0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(${r},0.02) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
