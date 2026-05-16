"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../lib/store";
import { X, Zap } from "lucide-react";

function ShadowParticle({ x, y, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left:`${x}%`, top:`${y}%`, width:2, height:2, background:"rgba(239,68,68,0.7)" }}
      animate={{ y:[0,-60,0], opacity:[0,0.8,0], scale:[0.5,1.5,0.5] }}
      transition={{ duration:3+Math.random()*2, delay, repeat:Infinity, ease:"easeInOut" }}
    />
  );
}

const SHADOW_PARTICLES = Array.from({length:30},(_,i)=>({
  id:i, x:Math.random()*100, y:Math.random()*100, delay:Math.random()*3,
}));

export default function ShadowMode() {
  const { shadowMode, toggleShadowMode } = useGame();
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (shadowMode) {
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setSeconds(0);
    }
    return () => clearInterval(timerRef.current);
  }, [shadowMode]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <AnimatePresence>
      {shadowMode && (
        <motion.div
          key="shadow"
          className="fixed inset-0 z-[9000] pointer-events-none overflow-hidden"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.6 }}
        >
          {/* Red vignette */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity:[0.4,0.6,0.4] }}
            transition={{ duration:3, repeat:Infinity }}
            style={{ background:"radial-gradient(ellipse at 50% 50%,transparent 40%,rgba(239,68,68,0.15) 100%)" }}
          />

          {/* Top border pulse */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5"
            animate={{ opacity:[0.4,1,0.4] }}
            transition={{ duration:1.5, repeat:Infinity }}
            style={{ background:"linear-gradient(90deg,transparent,#ef4444,transparent)" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            animate={{ opacity:[0.4,1,0.4] }}
            transition={{ duration:1.5, repeat:Infinity, delay:0.75 }}
            style={{ background:"linear-gradient(90deg,transparent,#ef4444,transparent)" }}
          />

          {/* Particles */}
          {SHADOW_PARTICLES.map(p => <ShadowParticle key={p.id} {...p} />)}

          {/* HUD — pointer-events-auto so it's clickable */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto">
            <motion.div
              initial={{ y:-30, opacity:0 }}
              animate={{ y:0, opacity:1 }}
              transition={{ delay:0.3 }}
              className="flex items-center gap-4 px-6 py-3 rounded-2xl"
              style={{
                background:"rgba(0,0,0,0.85)",
                border:"1px solid rgba(239,68,68,0.5)",
                boxShadow:"0 0 30px rgba(239,68,68,0.2)",
                backdropFilter:"blur(16px)",
              }}
            >
              {/* Pulsing red dot */}
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-red-500"
                animate={{ scale:[1,1.5,1], opacity:[0.6,1,0.6] }}
                transition={{ duration:1, repeat:Infinity }}
                style={{ boxShadow:"0 0 8px #ef4444" }}
              />

              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-red-400">Shadow Mode</span>
                <span className="text-xs text-white/30">Distractions eliminated</span>
              </div>

              {/* Timer */}
              <div
                className="text-2xl font-black font-mono"
                style={{ color:"#ef4444", textShadow:"0 0 15px rgba(239,68,68,0.8)" }}
              >
                {fmt(seconds)}
              </div>

              {/* XP multiplier */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)" }}>
                <Zap size={12} className="text-red-400" />
                <span className="text-xs font-bold text-red-300">2× XP</span>
              </div>

              {/* Exit */}
              <button
                onClick={toggleShadowMode}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          </div>

          {/* Ambient red glow corners */}
          <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
            style={{ background:"radial-gradient(circle at 0% 0%,rgba(239,68,68,0.08),transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
            style={{ background:"radial-gradient(circle at 100% 100%,rgba(239,68,68,0.08),transparent 70%)" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
