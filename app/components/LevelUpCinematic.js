"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../lib/store";

const BURST_COLORS = ["#a78bfa","#60a5fa","#34d399","#fbbf24","#f472b6","#ffffff","#fb923c"];
const PARTICLES = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  color: BURST_COLORS[i % BURST_COLORS.length],
  angle: (i / 80) * Math.PI * 2,
  speed: 120 + Math.random() * 220,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 0.3,
}));

function BurstParticle({ color, angle, speed, size, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, left: "50%", top: "50%",
        marginLeft: -size/2, marginTop: -size/2,
        boxShadow: `0 0 ${size*2}px ${color}` }}
      initial={{ opacity: 1, x: 0, y: 0, scale: 1.5 }}
      animate={{ opacity: 0, x: Math.cos(angle)*speed, y: Math.sin(angle)*speed, scale: 0 }}
      transition={{ duration: 1.4, delay, ease: "easeOut" }}
    />
  );
}

export default function LevelUpCinematic() {
  const { levelUpAnim, state, getAuraColor } = useGame();
  const auraColor = getAuraColor ? getAuraColor() : "#a78bfa";

  return (
    <AnimatePresence>
      {levelUpAnim && (
        <motion.div
          key="ascension"
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          {/* World darkens */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.92, 0.92, 0.6, 0] }}
            transition={{ duration: 4.2, times: [0, 0.1, 0.7, 0.85, 1] }}
            style={{ background: "#020208" }}
          />

          {/* Fullscreen flash */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{ background: `radial-gradient(circle, ${auraColor}90 0%, rgba(255,255,255,0.3) 40%, transparent 70%)` }}
          />

          {/* Camera zoom — scale the whole scene */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.85, 1.05, 1] }}
            transition={{ duration: 1.2, times: [0, 0.2, 0.7, 1], ease: "easeInOut" }}
          >
            {/* Screen shake */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ x: [0,-12,12,-8,8,-4,4,0], y: [0,6,-6,4,-4,0] }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* Shockwave rings */}
              {[1,2,3,4].map(i => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border-2 pointer-events-none"
                  style={{ borderColor: `${auraColor}${Math.round((0.8-i*0.15)*255).toString(16).padStart(2,"0")}` }}
                  initial={{ width: 60, height: 60, opacity: 0.9 }}
                  animate={{ width: 60+i*220, height: 60+i*220, opacity: 0 }}
                  transition={{ duration: 1.4, delay: i*0.12, ease: "easeOut" }}
                />
              ))}

              {/* Main cinematic card */}
              <motion.div
                initial={{ scale: 0.1, opacity: 0, rotateX: -60 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 1.4, opacity: 0, rotateX: 30 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
                className="relative flex flex-col items-center gap-4 px-20 py-14 rounded-3xl text-center"
                style={{
                  background: "rgba(4,3,16,0.97)",
                  border: `2px solid ${auraColor}80`,
                  boxShadow: `0 0 100px ${auraColor}60, 0 0 200px ${auraColor}25, inset 0 0 60px ${auraColor}15`,
                  perspective: "800px",
                }}
              >
                {/* Animated inner glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ background: `radial-gradient(ellipse at 50% 50%, ${auraColor}25, transparent 70%)` }}
                />

                {/* ASCENSION text */}
                <motion.div
                  initial={{ opacity: 0, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, letterSpacing: "0.5em" }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xs font-black uppercase relative z-10"
                  style={{ color: auraColor }}
                >
                  ✦ ASCENSION ✦
                </motion.div>

                {/* Avatar upgrade flash */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="text-6xl relative z-10"
                >
                  ⚡
                </motion.div>

                {/* Level number — huge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.3, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 350, damping: 20 }}
                  className="relative z-10"
                >
                  <div
                    className="text-[96px] font-black leading-none"
                    style={{
                      background: `linear-gradient(135deg, white, ${auraColor}, white)`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      filter: `drop-shadow(0 0 30px ${auraColor})`,
                    }}
                  >
                    {state.level}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="flex flex-col items-center gap-1 relative z-10"
                >
                  <div className="text-white/80 text-base font-semibold">Level {state.level} Achieved</div>
                  <div className="text-white/35 text-sm">Your power has grown. The world shifts.</div>
                </motion.div>

                {/* Corner accents */}
                {[["top-0 left-0","tl"],["top-0 right-0","tr"],["bottom-0 left-0","bl"],["bottom-0 right-0","br"]].map(([pos]) => (
                  <motion.div key={pos} className={`absolute ${pos} w-8 h-8 pointer-events-none`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, ${auraColor}, transparent)` }} />
                    <div className="absolute top-0 left-0 h-full w-0.5" style={{ background: `linear-gradient(180deg, ${auraColor}, transparent)` }} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* XP burst particles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {PARTICLES.map(p => <BurstParticle key={p.id} {...p} />)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
