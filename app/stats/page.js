"use client";
import { motion } from "framer-motion";
import AppShell from "../components/AppShell";
import { useGame } from "../lib/store";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs"
      style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(139,92,246,0.3)" }}
    >
      <div className="text-white/50 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }} className="font-semibold">{p.value} XP</div>
      ))}
    </div>
  );
};

const SkillTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs" style={{ background: "rgba(15,15,30,0.95)", border: "1px solid rgba(6,182,212,0.3)" }}>
      <div style={{ color: "#22d3ee" }} className="font-semibold">{payload[0]?.value}</div>
    </div>
  );
};

export default function StatsPage() {
  const { state } = useGame();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const weeklyData = state.weeklyXP.map((xp, i) => ({ day: days[i], xp }));

  const habitData = [
    { name: "Mind",       completed: 8,  total: 10 },
    { name: "Body",       completed: 6,  total: 10 },
    { name: "Knowledge",  completed: 9,  total: 10 },
    { name: "Discipline", completed: 5,  total: 10 },
  ];

  const trendData = [
    { week: "Wk 1", xp: 820  },
    { week: "Wk 2", xp: 1240 },
    { week: "Wk 3", xp: 980  },
    { week: "Wk 4", xp: 1580 },
    { week: "Wk 5", xp: 1390 },
    { week: "Wk 6", xp: 1800 },
    { week: "Wk 7", xp: state.weeklyXP.reduce((a, b) => a + b, 0) },
  ];

  const radarData = state.skills.map(s => ({ skill: s.name, value: s.value }));

  const totalWeekXP = state.weeklyXP.reduce((a, b) => a + b, 0);
  const avgDaily = Math.round(totalWeekXP / 7);
  const bestDay = Math.max(...state.weeklyXP);
  const questsDone = state.quests.filter(q => q.done).length;

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Stats & Analytics</h1>
          <p className="text-white/40 mt-1">Track your growth across every dimension.</p>
        </motion.div>

        {/* Summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "This Week", value: totalWeekXP.toLocaleString(), unit: "XP", color: "#a78bfa" },
            { label: "Daily Average", value: avgDaily.toLocaleString(), unit: "XP/day", color: "#60a5fa" },
            { label: "Best Day", value: bestDay.toLocaleString(), unit: "XP", color: "#34d399" },
            { label: "Quests Today", value: `${questsDone}/${state.quests.length}`, unit: "done", color: "#fb923c" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25` }}
            >
              <div className="text-xs text-white/40 uppercase tracking-wider mb-2">{s.label}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs mt-1" style={{ color: s.color }}>{s.unit}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Weekly XP bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="font-semibold text-white mb-4">Weekly XP Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.08)" }} />
                <Bar dataKey="xp" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* XP trend area chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="font-semibold text-white mb-4">XP Growth Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="xp" stroke="#60a5fa" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: "#60a5fa", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Habit completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="font-semibold text-white mb-4">Habit Completion Rate</h2>
            <div className="flex flex-col gap-4">
              {habitData.map(h => {
                const pct = Math.round((h.completed / h.total) * 100);
                const colors = { Mind: "#a78bfa", Body: "#34d399", Knowledge: "#60a5fa", Discipline: "#fb923c" };
                const c = colors[h.name];
                return (
                  <div key={h.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">{h.name}</span>
                      <span style={{ color: c }} className="font-medium">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: c }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Skill radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h2 className="font-semibold text-white mb-4">Skill Radar</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#22d3ee", r: 3 }} />
                <Tooltip content={<SkillTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
