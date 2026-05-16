"use client";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "lifequest_state";

const defaultQuests = [
  { id: 1, title: "Morning Meditation", desc: "10 minutes of mindfulness", xp: 50, category: "Mind", done: false },
  { id: 2, title: "Read 20 Pages", desc: "Any book of your choice", xp: 40, category: "Knowledge", done: false },
  { id: 3, title: "30-Min Workout", desc: "Any physical exercise", xp: 80, category: "Body", done: false },
  { id: 4, title: "Journal Entry", desc: "Write your thoughts for the day", xp: 30, category: "Mind", done: false },
  { id: 5, title: "No Social Media Before Noon", desc: "Start the day focused", xp: 60, category: "Discipline", done: false },
  { id: 6, title: "Drink 2L of Water", desc: "Stay hydrated all day", xp: 25, category: "Body", done: false },
  { id: 7, title: "Learn Something New", desc: "Watch a tutorial or read an article", xp: 45, category: "Knowledge", done: false },
  { id: 8, title: "Cold Shower", desc: "Build mental toughness", xp: 70, category: "Discipline", done: false },
];

const defaultWeeklyXP = [120, 200, 160, 310, 280, 390, 340];

function getInitialState() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function buildDefault() {
  return {
    user: { name: "Alex", avatar: "A" },
    xp: 6840,
    level: 12,
    streak: 21,
    lastActiveDate: new Date().toDateString(),
    quests: defaultQuests,
    weeklyXP: defaultWeeklyXP,
    totalQuestsCompleted: 47,
    badges: [
      { id: 1, emoji: "🔥", label: "21-Day Streak", unlocked: true },
      { id: 2, emoji: "⚡", label: "XP Master", unlocked: true },
      { id: 3, emoji: "🏆", label: "Quest King", unlocked: true },
      { id: 4, emoji: "🧠", label: "Deep Focus", unlocked: true },
      { id: 5, emoji: "🌟", label: "Level 12", unlocked: true },
      { id: 6, emoji: "💎", label: "Elite", unlocked: false },
      { id: 7, emoji: "🚀", label: "Rocket Start", unlocked: false },
      { id: 8, emoji: "👑", label: "Champion", unlocked: false },
    ],
    skills: [
      { name: "Focus", value: 78 },
      { name: "Discipline", value: 65 },
      { name: "Creativity", value: 82 },
      { name: "Energy", value: 55 },
    ],
  };
}

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, setState] = useState(() => getInitialState() || buildDefault());

  // Persist to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Check streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    if (state.lastActiveDate !== today) {
      const last = new Date(state.lastActiveDate);
      const now = new Date(today);
      const diff = Math.floor((now - last) / 86400000);
      setState(s => ({
        ...s,
        streak: diff === 1 ? s.streak : 0,
        lastActiveDate: today,
      }));
    }
  }, []); // eslint-disable-line

  const XP_PER_LEVEL = 10000;

  function completeQuest(id) {
    setState(s => {
      const quest = s.quests.find(q => q.id === id);
      if (!quest || quest.done) return s;
      const newXP = s.xp + quest.xp;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      const today = new Date().toDateString();
      const newWeekly = [...s.weeklyXP];
      newWeekly[6] = (newWeekly[6] || 0) + quest.xp;
      const newSkills = s.skills.map(sk => ({
        ...sk,
        value: Math.min(100, sk.value + Math.floor(Math.random() * 3)),
      }));
      return {
        ...s,
        xp: newXP,
        level: newLevel,
        streak: s.lastActiveDate === today ? s.streak : s.streak + 1,
        lastActiveDate: today,
        totalQuestsCompleted: s.totalQuestsCompleted + 1,
        quests: s.quests.map(q => q.id === id ? { ...q, done: true } : q),
        weeklyXP: newWeekly,
        skills: newSkills,
      };
    });
  }

  function resetQuests() {
    setState(s => ({ ...s, quests: s.quests.map(q => ({ ...q, done: false })) }));
  }

  function xpInCurrentLevel() { return state.xp % XP_PER_LEVEL; }
  function xpProgress() { return (xpInCurrentLevel() / XP_PER_LEVEL) * 100; }

  return (
    <GameContext.Provider value={{ state, completeQuest, resetQuests, xpProgress, xpInCurrentLevel, XP_PER_LEVEL }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
