"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#080810] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <motion.div
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xl font-black"
          animate={{
            boxShadow: [
              "0 0 20px rgba(139,92,246,0.4)",
              "0 0 40px rgba(139,92,246,0.7)",
              "0 0 20px rgba(139,92,246,0.4)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          LQ
        </motion.div>

        {/* Loading bar */}
        <div className="w-32 h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #7c3aed, #60a5fa)" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <p className="text-xs text-white/30 uppercase tracking-[0.3em]">Loading</p>
      </div>
    </div>
  );
}
