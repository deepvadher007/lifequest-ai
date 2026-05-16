"use client";
import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Slow drifting blobs */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 800, height: 800, top: "-20%", left: "-10%",
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 600, height: 600, bottom: "-10%", right: "-5%",
          background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 500, height: 500, top: "40%", right: "20%",
          background: "radial-gradient(circle, rgba(79,70,229,0.04) 0%, transparent 70%)" }}
        animate={{ x: [0, 20, -20, 0], y: [0, -25, 10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
