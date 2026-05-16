"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../lib/store";

const LINES = [
  { text: "In a world ruled by distraction…",   delay: 0.3,  duration: 1.8 },
  { text: "Few choose discipline.",              delay: 2.4,  duration: 1.6 },
  { text: "Fewer still, transformation.",        delay: 4.3,  duration: 1.6 },
  { text: "You are Level 12.",                   delay: 6.2,  duration: 1.8, accent: true },
  { text: "But the system has chosen you.",      delay: 8.3,  duration: 2.0, accent: true },
];

const PARTICLE_COUNT = 60;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 3,
  dur: 3 + Math.random() * 4,
  delay: Math.random() * 5,
  color: ["rgba(139,92,246,0.8)","rgba(96,165,250,0.8)","rgba(52,211,153,0.6)","rgba(255,255,255,0.5)"][i % 4],
}));

export default function CinematicIntro({ onComplete }) {
  const { state } = useGame();
  const [phase, setPhase] = useState("lines"); // lines | explosion | avatar | done
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    // Show lines one by one
    LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay * 1000);
    });
    // Trigger explosion after last line
    setTimeout(() => setPhase("explosion"), 10800);
    setTimeout(() => setPhase("avatar"),    11600);
    setTimeout(() => setPhase("done"),      13200);
    setTimeout(() => onComplete?.(),        13800);
  }, []); // eslint-disable-line

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden"
      style={{ background: "#000000" }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size, background:p.color }}
          animate={{ opacity:[0,0.8,0], y:[0,-40,0], scale:[0.5,1.2,0.5] }}
          transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.4),transparent)" }}
        animate={{ top:["0%","100%"] }}
        transition={{ duration:4, repeat:Infinity, ease:"linear" }}
      />

      {/* Lines phase */}
      <AnimatePresence>
        {phase === "lines" && (
          <motion.div
            key="lines"
            exit={{ opacity:0, scale:0.95, filter:"blur(8px)" }}
            transition={{ duration:0.5 }}
            className="flex flex-col items-center gap-6 text-center px-8 max-w-2xl"
          >
            {LINES.map((line, i) => (
              <AnimatePresence key={i}>
                {visibleLines.includes(i) && (
                  <motion.div
                    initial={{ opacity:0, y:20, filter:"blur(8px)" }}
                    animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                    transition={{ duration:0.8, ease:"easeOut" }}
                    className={`font-bold tracking-wide ${line.accent ? "text-2xl" : "text-lg text-white/60"}`}
                    style={line.accent ? {
                      background:"linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)",
                      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                      filter:"drop-shadow(0 0 20px rgba(139,92,246,0.6))",
                    } : { color:"rgba(255,255,255,0.55)" }}
                  >
                    {line.text.replace("Level 12", `Level ${state.level}`)}
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion phase */}
      <AnimatePresence>
        {phase === "explosion" && (
          <motion.div key="explosion" className="absolute inset-0 flex items-center justify-center">
            {/* White flash */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity:0 }}
              animate={{ opacity:[0,1,0] }}
              transition={{ duration:0.6 }}
              style={{ background:"radial-gradient(circle,rgba(139,92,246,0.9),rgba(96,165,250,0.5),transparent 70%)" }}
            />
            {/* Shockwave rings */}
            {[1,2,3,4,5].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{ borderColor:`rgba(139,92,246,${0.8-i*0.12})` }}
                initial={{ width:40, height:40, opacity:0.9 }}
                animate={{ width:40+i*280, height:40+i*280, opacity:0 }}
                transition={{ duration:0.9, delay:i*0.08, ease:"easeOut" }}
              />
            ))}
            {/* Burst particles */}
            {Array.from({length:80}).map((_,i) => {
              const angle = (i/80)*Math.PI*2;
              const speed = 100+Math.random()*250;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width:3+Math.random()*4, height:3+Math.random()*4,
                    background:["#a78bfa","#60a5fa","#34d399","#fbbf24","#fff"][i%5],
                    left:"50%", top:"50%",
                  }}
                  initial={{ opacity:1, x:0, y:0 }}
                  animate={{ opacity:0, x:Math.cos(angle)*speed, y:Math.sin(angle)*speed, scale:0 }}
                  transition={{ duration:0.9, ease:"easeOut" }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar reveal phase */}
      <AnimatePresence>
        {phase === "avatar" && (
          <motion.div
            key="avatar"
            initial={{ opacity:0, scale:0.3, filter:"blur(20px)" }}
            animate={{ opacity:1, scale:1, filter:"blur(0px)" }}
            exit={{ opacity:0, scale:1.2, filter:"blur(10px)" }}
            transition={{ type:"spring", stiffness:200, damping:18 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Avatar orb */}
            <motion.div
              className="w-32 h-32 rounded-full flex items-center justify-center relative"
              style={{
                background:"radial-gradient(circle at 35% 35%,rgba(139,92,246,0.6),rgba(8,8,16,0.95))",
                border:"2px solid rgba(139,92,246,0.8)",
                boxShadow:"0 0 80px rgba(139,92,246,0.7),0 0 160px rgba(139,92,246,0.3)",
              }}
              animate={{ scale:[1,1.06,1], boxShadow:[
                "0 0 60px rgba(139,92,246,0.6)",
                "0 0 100px rgba(139,92,246,0.9)",
                "0 0 60px rgba(139,92,246,0.6)",
              ]}}
              transition={{ duration:2, repeat:Infinity }}
            >
              <span className="text-5xl">⚡</span>
              {/* Scan line */}
              <motion.div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
                <motion.div
                  className="absolute left-0 right-0 h-0.5"
                  style={{ background:"linear-gradient(90deg,transparent,#a78bfa,transparent)" }}
                  animate={{ top:["0%","100%","0%"] }}
                  transition={{ duration:2, repeat:Infinity, ease:"linear" }}
                />
              </motion.div>
              {/* Orbiting ring */}
              <motion.div
                className="absolute rounded-full border border-violet-400/40"
                style={{ width:160, height:160, top:"50%", left:"50%", marginTop:-80, marginLeft:-80 }}
                animate={{ rotate:360 }}
                transition={{ duration:6, repeat:Infinity, ease:"linear" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay:0.4 }}
              className="text-center"
            >
              <div
                className="text-4xl font-black mb-2"
                style={{
                  background:"linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                  filter:"drop-shadow(0 0 20px rgba(139,92,246,0.6))",
                }}
              >
                {state.user.name}
              </div>
              <div className="text-white/40 text-sm uppercase tracking-[0.3em]">
                Level {state.level} · The System Awaits
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip hint */}
      <motion.button
        initial={{ opacity:0 }}
        animate={{ opacity:0.3 }}
        transition={{ delay:2 }}
        onClick={() => onComplete?.()}
        className="absolute bottom-8 right-8 text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest"
      >
        Skip →
      </motion.button>
    </motion.div>
  );
}
