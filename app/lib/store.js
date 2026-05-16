"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "lifequest_state_v3";

const defaultQuests = [
  { id: 1, title: "Morning Meditation", desc: "10 minutes of mindfulness",          xp: 50, category: "Mind",       done: false, bossDmg: 15, skill: "Focus"      },
  { id: 2, title: "Read 20 Pages",       desc: "Any book of your choice",            xp: 40, category: "Knowledge",  done: false, bossDmg: 12, skill: "Creativity" },
  { id: 3, title: "30-Min Workout",      desc: "Any physical exercise",              xp: 80, category: "Body",       done: false, bossDmg: 25, skill: "Energy"     },
  { id: 4, title: "Journal Entry",       desc: "Write your thoughts for the day",   xp: 30, category: "Mind",       done: false, bossDmg: 10, skill: "Focus"      },
  { id: 5, title: "No Social Media",     desc: "Start the day focused",             xp: 60, category: "Discipline", done: false, bossDmg: 20, skill: "Discipline" },
  { id: 6, title: "Drink 2L of Water",   desc: "Stay hydrated all day",             xp: 25, category: "Body",       done: false, bossDmg: 8,  skill: "Energy"     },
  { id: 7, title: "Learn Something New", desc: "Watch a tutorial or read an article",xp: 45, category: "Knowledge", done: false, bossDmg: 14, skill: "Creativity" },
  { id: 8, title: "Cold Shower",         desc: "Build mental toughness",            xp: 70, category: "Discipline", done: false, bossDmg: 22, skill: "Discipline" },
];

const defaultWeeklyXP = [120, 200, 160, 310, 280, 390, 340];

export const SKILL_TREE = {
  Mind:       [
    { id:"m1", label:"Clarity",    x:50, y:20, requires:[],         questId:1, unlocked:false },
    { id:"m2", label:"Focus+",     x:25, y:45, requires:["m1"],     questId:4, unlocked:false },
    { id:"m3", label:"Deep Work",  x:75, y:45, requires:["m1"],     questId:1, unlocked:false },
    { id:"m4", label:"Flow State", x:50, y:70, requires:["m2","m3"],questId:4, unlocked:false },
  ],
  Body:       [
    { id:"b1", label:"Vitality",   x:50, y:20, requires:[],         questId:3, unlocked:false },
    { id:"b2", label:"Endurance",  x:25, y:45, requires:["b1"],     questId:6, unlocked:false },
    { id:"b3", label:"Strength",   x:75, y:45, requires:["b1"],     questId:3, unlocked:false },
    { id:"b4", label:"Peak Form",  x:50, y:70, requires:["b2","b3"],questId:6, unlocked:false },
  ],
  Discipline: [
    { id:"d1", label:"Willpower",  x:50, y:20, requires:[],         questId:5, unlocked:false },
    { id:"d2", label:"Consistency",x:25, y:45, requires:["d1"],     questId:8, unlocked:false },
    { id:"d3", label:"Resilience", x:75, y:45, requires:["d1"],     questId:5, unlocked:false },
    { id:"d4", label:"Iron Mind",  x:50, y:70, requires:["d2","d3"],questId:8, unlocked:false },
  ],
  Social:     [
    { id:"s1", label:"Presence",   x:50, y:20, requires:[],         questId:2, unlocked:false },
    { id:"s2", label:"Empathy",    x:25, y:45, requires:["s1"],     questId:2, unlocked:false },
    { id:"s3", label:"Influence",  x:75, y:45, requires:["s1"],     questId:7, unlocked:false },
    { id:"s4", label:"Leadership", x:50, y:70, requires:["s2","s3"],questId:7, unlocked:false },
  ],
  Creative:   [
    { id:"c1", label:"Spark",      x:50, y:20, requires:[],         questId:7, unlocked:false },
    { id:"c2", label:"Expression", x:25, y:45, requires:["c1"],     questId:4, unlocked:false },
    { id:"c3", label:"Innovation", x:75, y:45, requires:["c1"],     questId:2, unlocked:false },
    { id:"c4", label:"Mastery",    x:50, y:70, requires:["c2","c3"],questId:4, unlocked:false },
  ],
};

const BOSS_MAX_HP = 126;

// Narrator messages keyed by skill
const NARRATOR_MSGS = {
  Focus:      ["FOCUS SHARPENED", "CLARITY UNLOCKED", "MIND BARRIER BROKEN", "DEEP WORK ACTIVATED"],
  Discipline: ["DISCIPLINE INCREASED", "WILLPOWER FORGED", "PROCRASTINATION WEAKENED", "IRON MIND ENGAGED"],
  Energy:     ["BODY POWER SURGING", "VITALITY RESTORED", "PHYSICAL FORM ENHANCED", "ENERGY CORE CHARGED"],
  Creativity: ["CREATIVE SPARK IGNITED", "INNOVATION PATH UNLOCKED", "EXPRESSION AMPLIFIED", "GENIUS MODE ACTIVE"],
  default:    ["QUEST COMPLETED", "XP ABSORBED", "POWER GROWING", "FOCUS PATH UNLOCKED"],
};

function buildDefault() {
  return {
    user: { name: "Alex", avatar: "A" },
    xp: 6840, level: 12, streak: 21,
    lastActiveDate: new Date().toDateString(),
    quests: defaultQuests,
    weeklyXP: defaultWeeklyXP,
    totalQuestsCompleted: 47,
    badges: [
      { id:1, emoji:"🔥", label:"21-Day Streak",  unlocked:true  },
      { id:2, emoji:"⚡", label:"XP Master",      unlocked:true  },
      { id:3, emoji:"🏆", label:"Quest King",     unlocked:true  },
      { id:4, emoji:"🧠", label:"Deep Focus",     unlocked:true  },
      { id:5, emoji:"🌟", label:"Level 12",       unlocked:true  },
      { id:6, emoji:"💎", label:"Elite",          unlocked:false },
      { id:7, emoji:"🚀", label:"Rocket Start",   unlocked:false },
      { id:8, emoji:"👑", label:"Champion",       unlocked:false },
    ],
    skills: [
      { name:"Focus",      value:78 },
      { name:"Discipline", value:65 },
      { name:"Creativity", value:82 },
      { name:"Energy",     value:55 },
    ],
    bossHP: BOSS_MAX_HP, bossDefeated: false,
    skillTree: SKILL_TREE,
    combo: 0,
    comboTimer: null,
  };
}

function getInitialState() {
  if (typeof window === "undefined") return null;
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
  return null;
}

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState]           = useState(() => getInitialState() || buildDefault());
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const [lastDmg, setLastDmg]       = useState(null);
  const [combo, setCombo]           = useState(0);
  const [comboMsg, setComboMsg]     = useState(null);   // { text, id }
  const [narrator, setNarrator]     = useState(null);   // { text, id, color }
  const [comboTimerRef, setComboTimerRef] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const diff = Math.floor((new Date(today) - new Date(state.lastActiveDate)) / 86400000);
      setState(s => ({ ...s, streak: diff === 1 ? s.streak : 0, lastActiveDate: today }));
    }
  }, []); // eslint-disable-line

  const XP_PER_LEVEL = 10000;

  // Fire narrator message
  const fireNarrator = useCallback((skill) => {
    const msgs = NARRATOR_MSGS[skill] || NARRATOR_MSGS.default;
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    const colorMap = { Focus:"#60a5fa", Discipline:"#a78bfa", Energy:"#fb923c", Creativity:"#f472b6" };
    setNarrator({ text, id: Date.now(), color: colorMap[skill] || "#a78bfa" });
    setTimeout(() => setNarrator(null), 2800);
  }, []);

  const completeQuest = useCallback((id) => {
    setState(s => {
      const quest = s.quests.find(q => q.id === id);
      if (!quest || quest.done) return s;

      const newXP    = s.xp + quest.xp;
      const oldLevel = s.level;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const leveled  = newLevel > oldLevel;
      const dmg      = quest.bossDmg;
      const newBossHP = Math.max(0, s.bossHP - dmg);

      // Skill tree
      const newSkillTree = {};
      Object.entries(s.skillTree).forEach(([branch, nodes]) => {
        newSkillTree[branch] = nodes.map(node => {
          if (node.questId === id && !node.unlocked) {
            const reqsMet = node.requires.every(rid => nodes.find(n => n.id === rid)?.unlocked);
            if (reqsMet || node.requires.length === 0) return { ...node, unlocked: true };
          }
          return node;
        });
      });

      const newWeekly = [...s.weeklyXP];
      newWeekly[6] = (newWeekly[6] || 0) + quest.xp;
      const newSkills = s.skills.map(sk => ({ ...sk, value: Math.min(100, sk.value + Math.floor(Math.random() * 3)) }));

      if (leveled) setTimeout(() => { setLevelUpAnim(true); setTimeout(() => setLevelUpAnim(false), 4200); }, 100);
      setTimeout(() => { setLastDmg({ dmg, id: Date.now() }); setTimeout(() => setLastDmg(null), 1400); }, 50);

      // Narrator
      setTimeout(() => fireNarrator(quest.skill || "default"), 300);

      return {
        ...s, xp: newXP, level: newLevel,
        streak: s.lastActiveDate === new Date().toDateString() ? s.streak : s.streak + 1,
        lastActiveDate: new Date().toDateString(),
        totalQuestsCompleted: s.totalQuestsCompleted + 1,
        quests: s.quests.map(q => q.id === id ? { ...q, done: true } : q),
        weeklyXP: newWeekly, skills: newSkills,
        bossHP: newBossHP, bossDefeated: newBossHP === 0,
        skillTree: newSkillTree,
      };
    });

    // Combo system
    setCombo(prev => {
      const next = prev + 1;
      if (comboTimerRef) clearTimeout(comboTimerRef);
      const t = setTimeout(() => setCombo(0), 6000);
      setComboTimerRef(t);
      if (next >= 2) {
        const msgs = ["COMBO x" + next + "!", next >= 3 ? "MIND BODY SYNC!" : "CHAIN ACTIVATED!", next >= 4 ? "UNSTOPPABLE!" : "MOMENTUM!"];
        setComboMsg({ text: msgs[Math.min(next - 2, msgs.length - 1)], id: Date.now(), multiplier: next });
        setTimeout(() => setComboMsg(null), 2000);
      }
      return next;
    });
  }, [fireNarrator, comboTimerRef]);

  const resetQuests = useCallback(() => {
    setState(s => ({ ...s, quests: s.quests.map(q => ({ ...q, done: false })), bossHP: BOSS_MAX_HP, bossDefeated: false }));
    setCombo(0);
  }, []);

  const xpInCurrentLevel = useCallback(() => state.xp % XP_PER_LEVEL, [state.xp]);
  const xpProgress       = useCallback(() => (state.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100, [state.xp]);
  const bossHPPercent    = () => (state.bossHP / BOSS_MAX_HP) * 100;

  // Aura color derived from dominant skill
  const getAuraColor = useCallback(() => {
    const dominant = [...state.skills].sort((a, b) => b.value - a.value)[0];
    const map = { Focus:"#60a5fa", Discipline:"#a78bfa", Creativity:"#f472b6", Energy:"#fb923c" };
    return map[dominant?.name] || "#a78bfa";
  }, [state.skills]);

  return (
    <GameContext.Provider value={{
      state, completeQuest, resetQuests,
      xpProgress, xpInCurrentLevel, XP_PER_LEVEL,
      bossHPPercent, BOSS_MAX_HP,
      levelUpAnim, lastDmg,
      combo, comboMsg,
      narrator,
      getAuraColor,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
