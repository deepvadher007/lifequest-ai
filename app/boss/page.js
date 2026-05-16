"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";
import { Sword, Zap, Shield, RotateCcw } from "lucide-react";

// ─── Floating damage number ───────────────────────────────────────────────────
function DamageNumber({ dmg, id }) {
  const x = (Math.random() - 0.5) * 120;
  return (
    <motion.div
      key={id}
      className="absolute font-black text-2xl pointer-events-none z-20 select-none"
      style={{
        left: "50%", top: "30%",
        color: dmg >= 20 ? "#fbbf24" : "#f87171",
        textShadow: dmg >= 20 ? "0 0 20px rgba(251,191,36,0.8)" : "0 0 15px rgba(248,113,113,0.8)",
      }}
      initial={{ opacity: 1, y: 0, x, scale: 1.4 }}
      animate={{ opacity: 0, y: -90, scale: 0.8 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
    >
      -{dmg}
    </motion.div>
  );
}

// ─── Attack flash ─────────────────────────────────────────────────────────────
function AttackFlash({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="flash"
          className="absolute inset-0 rounded-3xl pointer-events-none z-10"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)" }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Boss sprite ──────────────────────────────────────────────────────────────
function BossSprite({ hp, maxHP, isAttacked, defeated }) {
  const pct = hp / maxHP;
  const emoji = defeated ? "💀" : pct > 0.6 ? "👾" : pct > 0.3 ? "😤" : "😡";
  const size = defeated ? "text-[80px]" : pct > 0.6 ? "text-[100px]" : pct > 0.3 ? "text-[110px]" : "text-[120px]";

  return (
    <motion.div
      className="relative flex flex-col items-center"
      animate={isAttacked && !defeated ? {
        x: [0, -15, 15, -10, 10, 0],
        filter: ["brightness(1)", "brightness(3)", "brightness(1)"],
      } : defeated ? {
        scale: [1, 1.2, 0],
        opacity: [1, 1, 0],
        rotate: [0, 15, -15, 0],
      } : {
        y: [0, -8, 0],
      }}
      transition={isAttacked ? { duration: 0.4 } : defeated ? { duration: 0.8 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Aura */}
      {!defeated && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 200, height: 200,
            background: `radial-gradient(circle, ${pct > 0.6 ? "rgba(139,92,246,0.2)" : pct > 0.3 ? "rgba(249,115,22,0.25)" : "rgba(239,68,68,0.3)"} 0%, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <span className={`${size} relative z-10 select-none`}>{emoji}</span>
      {!defeated && (
        <motion.div
          className="text-xs font-bold uppercase tracking-widest mt-2"
          style={{ color: pct > 0.6 ? "#a78bfa" : pct > 0.3 ? "#fb923c" : "#ef4444" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {pct > 0.6 ? "Procrastination" : pct > 0.3 ? "Distraction" : "Inconsistency"}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────
function BossHPBar({ hp, maxHP }) {
  const pct = (hp / maxHP) * 100;
  const color = pct > 60 ? "#a78bfa" : pct > 30 ? "#fb923c" : "#ef4444";
  const glow = pct > 60 ? "rgba(139,92,246,0.5)" : pct > 30 ? "rgba(249,115,22,0.5)" : "rgba(239,68,68,0.5)";

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Shield size={14} style={{ color }} />
          <span className="font-bold text-white">Daily Boss</span>
        </div>
        <span className="font-mono font-bold" style={{ color }}>
          {hp} / {maxHP} HP
        </span>
      </div>
      <div className="w-full h-5 rounded-full bg-white/5 overflow-hidden relative"
        style={{ border: `1px solid ${color}40` }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 12px ${glow}` }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ["0%", "100%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-1/3"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)" }}
          />
        </motion.div>
        {/* Segment marks */}
        {[25, 50, 75].map(mark => (
          <div key={mark} className="absolute top-0 bottom-0 w-px bg-black/40" style={{ left: `${mark}%` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Quest attack button ──────────────────────────────────────────────────────
function AttackButton({ quest, onAttack, disabled }) {
  const [flashing, setFlashing] = useState(false);

  function handle() {
    if (disabled || quest.done) return;
    setFlashing(true);
    setTimeout(() => setFlashing(false), 400);
    onAttack(quest.id);
  }

  return (
    <motion.button
      onClick={handle}
      disabled={disabled || quest.done}
      whileHover={!quest.done ? { scale: 1.03, y: -2 } : {}}
      whileTap={!quest.done ? { scale: 0.96 } : {}}
      className="relative flex items-center gap-3 p-4 rounded-xl text-left transition-all overflow-hidden"
      style={{
        background: quest.done ? "rgba(255,255,255,0.02)" : "rgba(239,68,68,0.08)",
        border: `1px solid ${quest.done ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.25)"}`,
        opacity: quest.done ? 0.5 : 1,
        cursor: quest.done ? "default" : "pointer",
      }}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {flashing && (
          <motion.div
            key="btn-flash"
            className="absolute inset-0 rounded-xl"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ background: "rgba(239,68,68,0.4)" }}
          />
        )}
      </AnimatePresence>

      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: quest.done ? "rgba(255,255,255,0.04)" : "rgba(239,68,68,0.15)" }}>
        {quest.done
          ? <span className="text-emerald-400 text-sm">✓</span>
          : <Sword size={16} className="text-red-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${quest.done ? "line-through text-white/30" : "text-white"}`}>
          {quest.title}
        </div>
        <div className="text-xs text-white/35 mt-0.5">{quest.desc}</div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="text-xs font-bold text-red-400">-{quest.bossDmg} HP</div>
        <div className="text-xs text-violet-300">+{quest.xp} XP</div>
      </div>
    </motion.button>
  );
}

// ─── Defeat screen ────────────────────────────────────────────────────────────
function DefeatScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="flex flex-col items-center gap-4 py-12 text-center"
    >
      {/* Victory particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            left: "50%", top: "50%",
            background: ["#a78bfa","#60a5fa","#34d399","#fbbf24"][i % 4],
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 300,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
        />
      ))}
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-7xl"
      >🏆</motion.div>
      <div>
        <div className="text-3xl font-black text-white mb-2"
          style={{ textShadow: "0 0 30px rgba(251,191,36,0.6)" }}>
          BOSS DEFEATED!
        </div>
        <div className="text-white/50 text-sm max-w-xs">
          You conquered Procrastination today. Your discipline is unmatched.
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        {["🔥 +50 Bonus XP", "⚡ Streak Extended", "🌟 Badge Unlocked"].map(r => (
          <motion.div
            key={r}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}
          >
            {r}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BossPage() {
  const { state, completeQuest, resetQuests, bossHPPercent, BOSS_MAX_HP } = useGame();
  const [dmgNumbers, setDmgNumbers] = useState([]);
  const [attackFlash, setAttackFlash] = useState(false);
  const [bossShake, setBossShake] = useState(false);

  // Listen for lastDmg from store
  const { lastDmg } = useGame();
  const prevDmg = useRef(null);

  useEffect(() => {
    if (lastDmg && lastDmg !== prevDmg.current) {
      prevDmg.current = lastDmg;
      setDmgNumbers(prev => [...prev, { dmg: lastDmg.dmg, id: lastDmg.id }]);
      setAttackFlash(true);
      setBossShake(true);
      setTimeout(() => setAttackFlash(false), 400);
      setTimeout(() => setBossShake(false), 500);
      setTimeout(() => setDmgNumbers(prev => prev.filter(d => d.id !== lastDmg.id)), 1200);
    }
  }, [lastDmg]);

  const pct = bossHPPercent();
  const bossColor = pct > 60 ? "#a78bfa" : pct > 30 ? "#fb923c" : "#ef4444";

  return (
    <AppShell>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Boss Battle</h1>
              <p className="text-white/40 mt-1 text-sm">Complete quests to attack the Daily Boss.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={resetQuests}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm text-white/50 hover:text-white/80 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <RotateCcw size={13} /> New Day
            </motion.button>
          </div>
        </motion.div>

        {/* Vertical on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left — Boss arena */}
          <div className="flex flex-col gap-6">
            {/* Arena */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden flex flex-col items-center justify-center py-12 px-6"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: `1px solid ${bossColor}30`,
                boxShadow: `0 0 60px ${bossColor}15, inset 0 0 60px rgba(0,0,0,0.5)`,
                minHeight: 320,
              }}
            >
              {/* Arena background glow */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ background: `radial-gradient(ellipse at 50% 80%, ${bossColor}15, transparent 70%)` }}
              />

              {/* Grid floor */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(${bossColor}40 1px, transparent 1px), linear-gradient(90deg, ${bossColor}40 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                  transform: "perspective(200px) rotateX(50deg)",
                  transformOrigin: "bottom",
                  maskImage: "linear-gradient(to top, black, transparent)",
                }}
              />

              <AttackFlash show={attackFlash} />

              {/* Damage numbers */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <AnimatePresence>
                  {dmgNumbers.map(d => <DamageNumber key={d.id} dmg={d.dmg} id={d.id} />)}
                </AnimatePresence>
              </div>

              {/* Boss */}
              {state.bossDefeated ? (
                <DefeatScreen />
              ) : (
                <BossSprite
                  hp={state.bossHP}
                  maxHP={BOSS_MAX_HP}
                  isAttacked={bossShake}
                  defeated={state.bossDefeated}
                />
              )}
            </motion.div>

            {/* HP Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <BossHPBar hp={state.bossHP} maxHP={BOSS_MAX_HP} />

              {/* Phase indicator */}
              <div className="flex gap-2 mt-4">
                {[
                  { label: "Phase 1", range: "100-60%", active: pct > 60, color: "#a78bfa" },
                  { label: "Phase 2", range: "60-30%",  active: pct <= 60 && pct > 30, color: "#fb923c" },
                  { label: "Phase 3", range: "30-0%",   active: pct <= 30, color: "#ef4444" },
                ].map(phase => (
                  <div
                    key={phase.label}
                    className="flex-1 px-2 py-1.5 rounded-lg text-center text-xs transition-all"
                    style={{
                      background: phase.active ? `${phase.color}20` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${phase.active ? phase.color + "50" : "rgba(255,255,255,0.06)"}`,
                      color: phase.active ? phase.color : "rgba(255,255,255,0.25)",
                    }}
                  >
                    <div className="font-semibold">{phase.label}</div>
                    <div className="opacity-60">{phase.range}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Player stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: "Your Level", value: state.level, color: "#a78bfa", icon: "⚡" },
                { label: "Streak",     value: `${state.streak}d`, color: "#fb923c", icon: "🔥" },
                { label: "Quests Done", value: `${state.quests.filter(q=>q.done).length}/${state.quests.length}`, color: "#34d399", icon: "⚔️" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl text-center"
                  style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs" style={{ color: s.color }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Quest attacks */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Sword size={16} className="text-red-400" />
              <h2 className="font-semibold text-white">Attack Moves</h2>
              <span className="ml-auto text-xs text-white/35">Complete to deal damage</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {state.quests.map((quest, i) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <AttackButton
                    quest={quest}
                    onAttack={completeQuest}
                    disabled={state.bossDefeated}
                  />
                </motion.div>
              ))}
            </div>

            {/* Total damage dealt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-2 p-4 rounded-xl"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Total damage dealt</span>
                <span className="font-bold text-red-400">
                  {BOSS_MAX_HP - state.bossHP} / {BOSS_MAX_HP}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5 mt-2">
                <motion.div
                  animate={{ width: `${((BOSS_MAX_HP - state.bossHP) / BOSS_MAX_HP) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-red-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
