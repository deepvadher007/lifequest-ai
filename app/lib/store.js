"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const STORAGE_KEY = "lifequest_state_v4";

const defaultQuests = [
  { id:1, title:"Morning Meditation", desc:"10 minutes of mindfulness",           xp:50, category:"Mind",       done:false, bossDmg:15, skill:"Focus"      },
  { id:2, title:"Read 20 Pages",      desc:"Any book of your choice",             xp:40, category:"Knowledge",  done:false, bossDmg:12, skill:"Creativity" },
  { id:3, title:"30-Min Workout",     desc:"Any physical exercise",               xp:80, category:"Body",       done:false, bossDmg:25, skill:"Energy"     },
  { id:4, title:"Journal Entry",      desc:"Write your thoughts for the day",    xp:30, category:"Mind",       done:false, bossDmg:10, skill:"Focus"      },
  { id:5, title:"No Social Media",    desc:"Start the day focused",              xp:60, category:"Discipline", done:false, bossDmg:20, skill:"Discipline" },
  { id:6, title:"Drink 2L of Water",  desc:"Stay hydrated all day",              xp:25, category:"Body",       done:false, bossDmg:8,  skill:"Energy"     },
  { id:7, title:"Learn Something New",desc:"Watch a tutorial or read an article",xp:45, category:"Knowledge",  done:false, bossDmg:14, skill:"Creativity" },
  { id:8, title:"Cold Shower",        desc:"Build mental toughness",             xp:70, category:"Discipline", done:false, bossDmg:22, skill:"Discipline" },
];

const defaultWeeklyXP = [120, 200, 160, 310, 280, 390, 340];

export const SKILL_TREE = {
  Mind:       [
    { id:"m1", label:"Clarity",    x:50, y:20, requires:[],          questId:1, unlocked:false },
    { id:"m2", label:"Focus+",     x:25, y:45, requires:["m1"],      questId:4, unlocked:false },
    { id:"m3", label:"Deep Work",  x:75, y:45, requires:["m1"],      questId:1, unlocked:false },
    { id:"m4", label:"Flow State", x:50, y:70, requires:["m2","m3"], questId:4, unlocked:false },
  ],
  Body:       [
    { id:"b1", label:"Vitality",   x:50, y:20, requires:[],          questId:3, unlocked:false },
    { id:"b2", label:"Endurance",  x:25, y:45, requires:["b1"],      questId:6, unlocked:false },
    { id:"b3", label:"Strength",   x:75, y:45, requires:["b1"],      questId:3, unlocked:false },
    { id:"b4", label:"Peak Form",  x:50, y:70, requires:["b2","b3"], questId:6, unlocked:false },
  ],
  Discipline: [
    { id:"d1", label:"Willpower",  x:50, y:20, requires:[],          questId:5, unlocked:false },
    { id:"d2", label:"Consistency",x:25, y:45, requires:["d1"],      questId:8, unlocked:false },
    { id:"d3", label:"Resilience", x:75, y:45, requires:["d1"],      questId:5, unlocked:false },
    { id:"d4", label:"Iron Mind",  x:50, y:70, requires:["d2","d3"], questId:8, unlocked:false },
  ],
  Social:     [
    { id:"s1", label:"Presence",   x:50, y:20, requires:[],          questId:2, unlocked:false },
    { id:"s2", label:"Empathy",    x:25, y:45, requires:["s1"],      questId:2, unlocked:false },
    { id:"s3", label:"Influence",  x:75, y:45, requires:["s1"],      questId:7, unlocked:false },
    { id:"s4", label:"Leadership", x:50, y:70, requires:["s2","s3"], questId:7, unlocked:false },
  ],
  Creative:   [
    { id:"c1", label:"Spark",      x:50, y:20, requires:[],          questId:7, unlocked:false },
    { id:"c2", label:"Expression", x:25, y:45, requires:["c1"],      questId:4, unlocked:false },
    { id:"c3", label:"Innovation", x:75, y:45, requires:["c1"],      questId:2, unlocked:false },
    { id:"c4", label:"Mastery",    x:50, y:70, requires:["c2","c3"], questId:4, unlocked:false },
  ],
};

const BOSS_MAX_HP = 126;

// Domain tiers
export const DOMAINS = [
  { id:"neon",      name:"Neon Slums",       minLevel:1,  color:"249,115,22",  accent:"#fb923c", bg:"#0a0500", desc:"Where every story begins. Raw. Unfiltered. Hungry." },
  { id:"crystal",   name:"Crystal Spire",    minLevel:5,  color:"52,211,153",  accent:"#34d399", bg:"#000a06", desc:"Clarity crystallized. Focus becomes your superpower." },
  { id:"void",      name:"Void Temple",      minLevel:10, color:"139,92,246",  accent:"#a78bfa", bg:"#04020e", desc:"Beyond the physical. Pure will. Pure power." },
  { id:"celestial", name:"Celestial Throne", minLevel:20, color:"251,191,36",  accent:"#fbbf24", bg:"#080600", desc:"The apex. Few ever reach this realm. You are chosen." },
];

const NARRATOR_MSGS = {
  Focus:      ["FOCUS SHARPENED","CLARITY UNLOCKED","MIND BARRIER BROKEN","DEEP WORK ACTIVATED"],
  Discipline: ["DISCIPLINE INCREASED","WILLPOWER FORGED","PROCRASTINATION WEAKENED","IRON MIND ENGAGED"],
  Energy:     ["BODY POWER SURGING","VITALITY RESTORED","PHYSICAL FORM ENHANCED","ENERGY CORE CHARGED"],
  Creativity: ["CREATIVE SPARK IGNITED","INNOVATION PATH UNLOCKED","EXPRESSION AMPLIFIED","GENIUS MODE ACTIVE"],
  default:    ["QUEST COMPLETED","XP ABSORBED","POWER GROWING","FOCUS PATH UNLOCKED"],
};

const BOSS_TAUNTS = [
  "DISCIPLINE CANNOT SAVE YOU.",
  "YOU WILL RETURN TO DISTRACTION.",
  "YOUR STREAK MEANS NOTHING.",
  "PROCRASTINATION ALWAYS WINS.",
  "YOU ARE WEAK. GIVE UP.",
  "THE VOID CLAIMS ALL WARRIORS.",
];

const BOSS_DEFEAT_LINE = "THE SHADOW MONARCH RISES. YOU HAVE EARNED YOUR POWER.";

const STREAK_DECAY_MSGS = [
  "STREAK DESTABILIZING.",
  "PROCRASTINATION GAINING CONTROL.",
  "AURA WEAKENING. RETURN TO THE PATH.",
  "THE VOID IS CONSUMING YOUR PROGRESS.",
];

function buildDefault() {
  return {
    user: { name:"Alex", avatar:"A" },
    xp:6840, level:12, streak:21,
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
    bossHP: BOSS_MAX_HP, bossDefeated:false,
    skillTree: SKILL_TREE,
    introSeen: false,
    streakDecaying: false,
  };
}

function getInitialState() {
  if (typeof window === "undefined") return null;
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
  return null;
}

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState]             = useState(() => getInitialState() || buildDefault());
  const [levelUpAnim, setLevelUpAnim] = useState(false);
  const [lastDmg, setLastDmg]         = useState(null);
  const [combo, setCombo]             = useState(0);
  const [comboMsg, setComboMsg]       = useState(null);
  const [narrator, setNarrator]       = useState(null);
  const [shadowMode, setShadowMode]   = useState(false);
  const [bossVoice, setBossVoice]     = useState(null);
  const [streakWarning, setStreakWarning] = useState(null);
  const comboTimerRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Streak decay check on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const diff = Math.floor((new Date(today) - new Date(state.lastActiveDate)) / 86400000);
      if (diff > 1) {
        // Streak broken — fire decay warning
        const msg = STREAK_DECAY_MSGS[Math.floor(Math.random() * STREAK_DECAY_MSGS.length)];
        setTimeout(() => {
          setStreakWarning({ text: msg, id: Date.now() });
          setTimeout(() => setStreakWarning(null), 4000);
        }, 2000);
        setState(s => ({ ...s, streak: 0, lastActiveDate: today, streakDecaying: true }));
      } else {
        setState(s => ({ ...s, lastActiveDate: today, streakDecaying: false }));
      }
    }
  }, []); // eslint-disable-line

  const XP_PER_LEVEL = 10000;

  const fireNarrator = useCallback((skill) => {
    const msgs = NARRATOR_MSGS[skill] || NARRATOR_MSGS.default;
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    const colorMap = { Focus:"#60a5fa", Discipline:"#a78bfa", Energy:"#fb923c", Creativity:"#f472b6" };
    setNarrator({ text, id: Date.now(), color: colorMap[skill] || "#a78bfa" });
    setTimeout(() => setNarrator(null), 2800);
  }, []);

  const fireBossVoice = useCallback((defeated = false) => {
    const text = defeated ? BOSS_DEFEAT_LINE : BOSS_TAUNTS[Math.floor(Math.random() * BOSS_TAUNTS.length)];
    setBossVoice({ text, id: Date.now(), defeated });
    setTimeout(() => setBossVoice(null), defeated ? 4000 : 3000);
  }, []);

  const completeQuest = useCallback((id) => {
    setState(s => {
      const quest = s.quests.find(q => q.id === id);
      if (!quest || quest.done) return s;
      const newXP     = s.xp + quest.xp;
      const newLevel  = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const leveled   = newLevel > s.level;
      const newBossHP = Math.max(0, s.bossHP - quest.bossDmg);
      const bossJustDefeated = newBossHP === 0 && !s.bossDefeated;

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

      if (leveled) setTimeout(() => { setLevelUpAnim(true); setTimeout(() => setLevelUpAnim(false), 4500); }, 100);
      setTimeout(() => { setLastDmg({ dmg: quest.bossDmg, id: Date.now() }); setTimeout(() => setLastDmg(null), 1400); }, 50);
      setTimeout(() => fireNarrator(quest.skill || "default"), 300);
      // Boss voice — taunt or defeat
      setTimeout(() => fireBossVoice(bossJustDefeated), 800);
      // Balance restored when streak was decaying
      if (s.streakDecaying) {
        setTimeout(() => {
          setNarrator({ text: "BALANCE RESTORED. THE PATH IS CLEAR.", id: Date.now(), color: "#34d399" });
          setTimeout(() => setNarrator(null), 3000);
        }, 1200);
      }

      return {
        ...s, xp: newXP, level: newLevel,
        streak: s.lastActiveDate === new Date().toDateString() ? s.streak : s.streak + 1,
        lastActiveDate: new Date().toDateString(),
        totalQuestsCompleted: s.totalQuestsCompleted + 1,
        quests: s.quests.map(q => q.id === id ? { ...q, done: true } : q),
        weeklyXP: newWeekly, skills: newSkills,
        bossHP: newBossHP, bossDefeated: newBossHP === 0,
        skillTree: newSkillTree,
        streakDecaying: false,
      };
    });

    // Combo
    setCombo(prev => {
      const next = prev + 1;
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => setCombo(0), 6000);
      if (next >= 2) {
        const msgs = next >= 4 ? "UNSTOPPABLE!" : next >= 3 ? "MIND BODY SYNC!" : "CHAIN ACTIVATED!";
        setComboMsg({ text: `COMBO x${next}! ${msgs}`, id: Date.now(), multiplier: next });
        setTimeout(() => setComboMsg(null), 2200);
      }
      return next;
    });
  }, [fireNarrator, fireBossVoice]);

  const resetQuests = useCallback(() => {
    setState(s => ({ ...s, quests: s.quests.map(q => ({ ...q, done: false })), bossHP: BOSS_MAX_HP, bossDefeated: false }));
    setCombo(0);
  }, []);

  const markIntroSeen = useCallback(() => {
    setState(s => ({ ...s, introSeen: true }));
  }, []);

  const toggleShadowMode = useCallback(() => {
    setShadowMode(v => {
      const next = !v;
      const msg = next ? "FOCUS MODE ACTIVATED. DISTRACTIONS ELIMINATED." : "SHADOW MODE DISENGAGED.";
      setNarrator({ text: msg, id: Date.now(), color: next ? "#ef4444" : "#a78bfa" });
      setTimeout(() => setNarrator(null), 3000);
      return next;
    });
  }, []);

  const xpInCurrentLevel = useCallback(() => state.xp % XP_PER_LEVEL, [state.xp]);
  const xpProgress       = useCallback(() => (state.xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100, [state.xp]);
  const bossHPPercent    = () => (state.bossHP / BOSS_MAX_HP) * 100;

  const getAuraColor = useCallback(() => {
    if (shadowMode) return "#ef4444";
    const dominant = [...state.skills].sort((a, b) => b.value - a.value)[0];
    const map = { Focus:"#60a5fa", Discipline:"#a78bfa", Creativity:"#f472b6", Energy:"#fb923c" };
    return map[dominant?.name] || "#a78bfa";
  }, [state.skills, shadowMode]);

  const getCurrentDomain = useCallback(() => {
    const eligible = DOMAINS.filter(d => state.level >= d.minLevel);
    return eligible[eligible.length - 1] || DOMAINS[0];
  }, [state.level]);

  return (
    <GameContext.Provider value={{
      state, completeQuest, resetQuests, markIntroSeen,
      xpProgress, xpInCurrentLevel, XP_PER_LEVEL,
      bossHPPercent, BOSS_MAX_HP,
      levelUpAnim, lastDmg,
      combo, comboMsg,
      narrator, bossVoice, streakWarning,
      shadowMode, toggleShadowMode,
      getAuraColor, getCurrentDomain, DOMAINS,
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
