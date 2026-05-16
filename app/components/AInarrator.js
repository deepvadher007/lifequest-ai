"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../lib/store";

export default function AINarrator() {
  const { narrator, comboMsg, bossVoice, streakWarning } = useGame();

  return (
    <>
      {/* ── Narrator — top center ── */}
      <AnimatePresence>
        {narrator && (
          <motion.div
            key={narrator.id}
            className="fixed top-6 left-1/2 z-[99990] pointer-events-none"
            style={{ translateX:"-50%" }}
            initial={{ opacity:0, y:-20, scale:0.85 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-16 }}
            transition={{ duration:0.35 }}
          >
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full"
              style={{
                background:"rgba(6,6,14,0.92)",
                border:`1px solid ${narrator.color}50`,
                boxShadow:`0 0 20px ${narrator.color}30`,
                backdropFilter:"blur(16px)",
              }}>
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background:narrator.color, boxShadow:`0 0 8px ${narrator.color}` }}
                animate={{ scale:[1,1.5,1], opacity:[0.7,1,0.7] }}
                transition={{ duration:0.8, repeat:Infinity }}
              />
              <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color:narrator.color }}>
                {narrator.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Boss Voice — bottom center ── */}
      <AnimatePresence>
        {bossVoice && (
          <motion.div
            key={bossVoice.id}
            className="fixed bottom-10 left-1/2 z-[99990] pointer-events-none"
            style={{ translateX:"-50%" }}
            initial={{ opacity:0, y:20, scale:0.9 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:16 }}
            transition={{ duration:0.4 }}
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl max-w-lg text-center"
              style={{
                background: bossVoice.defeated ? "rgba(0,0,0,0.9)" : "rgba(20,0,0,0.92)",
                border:`1px solid ${bossVoice.defeated ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.4)"}`,
                boxShadow:`0 0 30px ${bossVoice.defeated ? "rgba(251,191,36,0.25)" : "rgba(239,68,68,0.2)"}`,
                backdropFilter:"blur(16px)",
              }}>
              <span className="text-xl flex-shrink-0">{bossVoice.defeated ? "💀" : "👾"}</span>
              <span
                className="text-sm font-black uppercase tracking-wider"
                style={{ color: bossVoice.defeated ? "#fbbf24" : "#ef4444" }}
              >
                {bossVoice.text}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Streak Warning — center screen ── */}
      <AnimatePresence>
        {streakWarning && (
          <motion.div
            key={streakWarning.id}
            className="fixed inset-0 flex items-center justify-center z-[99985] pointer-events-none"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          >
            {/* Glitch overlay */}
            <motion.div
              className="absolute inset-0"
              animate={{ opacity:[0,0.06,0,0.04,0] }}
              transition={{ duration:0.3, repeat:4 }}
              style={{ background:"repeating-linear-gradient(0deg,rgba(239,68,68,0.1) 0px,transparent 2px,transparent 4px)" }}
            />
            <motion.div
              initial={{ scale:0.8, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              exit={{ scale:1.1, opacity:0 }}
              transition={{ type:"spring", stiffness:300, damping:20 }}
              className="flex flex-col items-center gap-3 px-10 py-8 rounded-2xl text-center"
              style={{
                background:"rgba(10,0,0,0.95)",
                border:"1px solid rgba(239,68,68,0.5)",
                boxShadow:"0 0 60px rgba(239,68,68,0.3)",
              }}
            >
              <motion.div
                animate={{ rotate:[0,5,-5,0], scale:[1,1.1,1] }}
                transition={{ duration:0.5, repeat:3 }}
                className="text-4xl"
              >⚠️</motion.div>
              <div className="text-xl font-black uppercase tracking-widest text-red-400">
                {streakWarning.text}
              </div>
              <div className="text-xs text-white/35 uppercase tracking-widest">
                Complete quests to restore balance
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Combo — center screen ── */}
      <AnimatePresence>
        {comboMsg && (
          <motion.div
            key={comboMsg.id}
            className="fixed inset-0 flex items-center justify-center z-[99985] pointer-events-none"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          >
            <motion.div
              initial={{ scale:0.4, opacity:0 }}
              animate={{ scale:1, opacity:1 }}
              exit={{ scale:1.3, opacity:0 }}
              transition={{ type:"spring", stiffness:400, damping:18 }}
              className="flex flex-col items-center gap-1"
            >
              <motion.div
                className="absolute rounded-full border-2 border-yellow-400/60"
                initial={{ width:60, height:60, opacity:0.8 }}
                animate={{ width:320, height:320, opacity:0 }}
                transition={{ duration:0.7, ease:"easeOut" }}
              />
              <div
                className="text-4xl font-black uppercase tracking-widest"
                style={{
                  background:"linear-gradient(135deg,#fbbf24,#f59e0b,#fcd34d)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  filter:"drop-shadow(0 0 20px rgba(251,191,36,0.8))",
                }}
              >
                {comboMsg.text}
              </div>
              {comboMsg.multiplier >= 3 && (
                <motion.div
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
                  className="text-sm font-bold text-yellow-300/70 uppercase tracking-widest"
                >
                  +{comboMsg.multiplier * 10} Bonus XP
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
