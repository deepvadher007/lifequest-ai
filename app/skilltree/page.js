"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";

const BRANCH_COLORS = {
  Mind:       { primary: "#a78bfa", glow: "rgba(167,139,250,0.4)", bg: "rgba(139,92,246,0.1)",  border: "rgba(139,92,246,0.3)"  },
  Body:       { primary: "#34d399", glow: "rgba(52,211,153,0.4)",  bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)"  },
  Discipline: { primary: "#fb923c", glow: "rgba(251,146,60,0.4)",  bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.3)"  },
  Social:     { primary: "#60a5fa", glow: "rgba(96,165,250,0.4)",  bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)"  },
  Creative:   { primary: "#f472b6", glow: "rgba(244,114,182,0.4)", bg: "rgba(236,72,153,0.1)",  border: "rgba(236,72,153,0.3)"  },
};

function NodeConnection({ x1, y1, x2, y2, unlocked, color }) {
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x1}%`, top: `${y1}%`,
        width: `${len}%`,
        height: 2,
        transformOrigin: "left center",
        transform: `rotate(${angle}deg)`,
        background: unlocked
          ? `linear-gradient(90deg, ${color}, ${color}80)`
          : "rgba(255,255,255,0.08)",
        boxShadow: unlocked ? `0 0 8px ${color}` : "none",
        transition: "all 0.5s ease",
      }}
    >
      {unlocked && (
        <motion.div
          className="absolute inset-0"
          animate={{ x: ["0%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)", width: "30%" }}
        />
      )}
    </div>
  );
}

function SkillNode({ node, color, onHover, isHovered }) {
  const c = BRANCH_COLORS[color] || BRANCH_COLORS.Mind;
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5 cursor-pointer"
      style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.15, zIndex: 10 }}
    >
      {/* Node circle */}
      <motion.div
        className="w-12 h-12 rounded-full flex items-center justify-center relative"
        style={{
          background: node.unlocked ? c.bg : "rgba(255,255,255,0.04)",
          border: `2px solid ${node.unlocked ? c.primary : "rgba(255,255,255,0.12)"}`,
          boxShadow: node.unlocked ? `0 0 20px ${c.glow}, 0 0 40px ${c.glow}` : "none",
        }}
        animate={node.unlocked ? {
          boxShadow: [`0 0 15px ${c.glow}`, `0 0 30px ${c.glow}`, `0 0 15px ${c.glow}`],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {node.unlocked ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="text-lg"
          >✦</motion.div>
        ) : (
          <div className="text-white/20 text-sm">🔒</div>
        )}

        {/* Pulse ring for unlocked */}
        {node.unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: c.primary }}
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Label */}
      <div
        className="text-xs font-semibold text-center whitespace-nowrap px-2 py-0.5 rounded-full"
        style={{
          color: node.unlocked ? c.primary : "rgba(255,255,255,0.25)",
          background: node.unlocked ? c.bg : "transparent",
          border: node.unlocked ? `1px solid ${c.border}` : "none",
        }}
      >
        {node.label}
      </div>
    </motion.div>
  );
}

function BranchPanel({ branch, nodes, active, onClick }) {
  const c = BRANCH_COLORS[branch];
  const unlockedCount = nodes.filter(n => n.unlocked).length;
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(branch)}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
      style={{
        background: active ? c.bg : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? c.border : "rgba(255,255,255,0.08)"}`,
        color: active ? c.primary : "rgba(255,255,255,0.5)",
        boxShadow: active ? `0 0 15px ${c.glow}` : "none",
      }}
    >
      <div className="w-2 h-2 rounded-full" style={{ background: c.primary }} />
      {branch}
      <span className="ml-auto text-xs opacity-60">{unlockedCount}/{nodes.length}</span>
    </motion.button>
  );
}

export default function SkillTreePage() {
  const { state } = useGame();
  const [activeBranch, setActiveBranch] = useState("Mind");
  const [hoveredNode, setHoveredNode] = useState(null);
  const nodes = state.skillTree[activeBranch] || [];
  const c = BRANCH_COLORS[activeBranch];

  // Build connections
  const connections = [];
  nodes.forEach(node => {
    node.requires.forEach(reqId => {
      const parent = nodes.find(n => n.id === reqId);
      if (parent) {
        connections.push({
          x1: parent.x, y1: parent.y,
          x2: node.x,   y2: node.y,
          unlocked: parent.unlocked && node.unlocked,
          color: c.primary,
        });
      }
    });
  });

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Skill Tree</h1>
          <p className="text-white/40 mt-1">Complete quests to unlock nodes and evolve your character.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Branch selector */}
          <div className="flex flex-col gap-2">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-2">Branches</div>
            {Object.entries(state.skillTree).map(([branch, branchNodes]) => (
              <BranchPanel
                key={branch}
                branch={branch}
                nodes={branchNodes}
                active={activeBranch === branch}
                onClick={setActiveBranch}
              />
            ))}

            {/* Node tooltip */}
            <AnimatePresence>
              {hoveredNode && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  <div className="font-semibold text-sm mb-1" style={{ color: c.primary }}>{hoveredNode.label}</div>
                  <div className="text-xs text-white/45">
                    {hoveredNode.unlocked ? "✓ Unlocked" : `Complete quest #${hoveredNode.questId} to unlock`}
                  </div>
                  {hoveredNode.requires.length > 0 && (
                    <div className="text-xs text-white/30 mt-1">
                      Requires: {hoveredNode.requires.join(", ")}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tree canvas */}
          <motion.div
            key={activeBranch}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 relative rounded-2xl overflow-hidden"
            style={{
              height: 420,
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${c.border}`,
              boxShadow: `0 0 40px ${c.glow}20`,
            }}
          >
            {/* Background grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(${c.primary}15 1px, transparent 1px), linear-gradient(90deg, ${c.primary}15 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            {/* Branch title */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: c.primary, boxShadow: `0 0 8px ${c.primary}` }} />
              <span className="text-sm font-semibold" style={{ color: c.primary }}>{activeBranch} Branch</span>
            </div>

            {/* Connections */}
            {connections.map((conn, i) => (
              <NodeConnection key={i} {...conn} />
            ))}

            {/* Nodes */}
            {nodes.map(node => (
              <SkillNode
                key={node.id}
                node={node}
                color={activeBranch}
                onHover={setHoveredNode}
                isHovered={hoveredNode?.id === node.id}
              />
            ))}

            {/* Unlock hint */}
            <div className="absolute bottom-4 right-4 text-xs text-white/20">
              Complete quests to unlock nodes
            </div>
          </motion.div>
        </div>

        {/* All branches summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          {Object.entries(state.skillTree).map(([branch, branchNodes]) => {
            const unlocked = branchNodes.filter(n => n.unlocked).length;
            const total = branchNodes.length;
            const pct = (unlocked / total) * 100;
            const bc = BRANCH_COLORS[branch];
            return (
              <div key={branch} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-xs font-medium mb-2" style={{ color: bc.primary }}>{branch}</div>
                <div className="text-lg font-bold text-white">{unlocked}/{total}</div>
                <div className="w-full h-1 rounded-full bg-white/5 mt-2">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ background: bc.primary }}
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </AppShell>
  );
}
