"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "../components/AppShell";
import { Send, Bot, Sparkles } from "lucide-react";

const aiResponses = {
  default: [
    "Great question! The key to building lasting habits is starting smaller than you think you need to. What's one tiny action you can take right now?",
    "Remember: you don't rise to the level of your goals, you fall to the level of your systems. Let's build better systems together. 🏗️",
    "Every expert was once a beginner. Every pro was once an amateur. Keep showing up — consistency beats intensity every time.",
    "Your brain is wired to seek comfort. Growth happens at the edge of discomfort. Lean into it — that's where the magic is. ✨",
    "Progress isn't always visible day to day, but zoom out and you'll see how far you've come. Trust the process.",
  ],
  procrastination: [
    "Procrastination is just fear wearing a disguise. Ask yourself: what's the smallest possible first step? Do that. Just that. 🎯",
    "The 2-minute rule: if it takes less than 2 minutes, do it now. For bigger tasks, just commit to starting for 2 minutes. You'll keep going.",
    "You don't need motivation to start — you need to start to find motivation. Action creates momentum, not the other way around. ⚡",
  ],
  motivation: [
    "You've already shown up today — that puts you ahead of most people. Seriously. The fact that you're here means you care. 💪",
    "On days when motivation is low, rely on discipline. Discipline is just doing what needs to be done even when you don't feel like it.",
    "Think about your future self. What would they thank you for doing today? Do that thing. 🌟",
  ],
  habits: [
    "Stack new habits onto existing ones. After [current habit], I will [new habit]. This is called habit stacking and it's incredibly effective.",
    "The habit loop: cue → routine → reward. Identify your cues, design your routines, and make the rewards immediate and satisfying.",
    "Missing once is an accident. Missing twice is the start of a new habit. Never miss twice — that's the golden rule. 🔑",
  ],
  focus: [
    "Try the Pomodoro technique: 25 minutes of deep focus, 5-minute break. Your brain loves this rhythm. 🍅",
    "Single-tasking is a superpower in a world of distractions. Close the tabs, silence the phone, and go deep on one thing.",
    "Your environment shapes your behavior more than willpower does. Design your space for focus — remove friction, add cues.",
  ],
  sleep: [
    "Sleep is the ultimate performance enhancer. 7-9 hours isn't a luxury — it's the foundation everything else is built on. 😴",
    "A consistent sleep schedule (same time every day) is more important than total hours. Your circadian rhythm is powerful.",
  ],
};

const suggestions = [
  { label: "Beat procrastination", key: "procrastination" },
  { label: "Stay motivated", key: "motivation" },
  { label: "Build habits", key: "habits" },
  { label: "Improve focus", key: "focus" },
  { label: "Sleep better", key: "sleep" },
];

function getAIResponse(input) {
  const lower = input.toLowerCase();
  if (lower.includes("procrastinat") || lower.includes("lazy") || lower.includes("putting off")) {
    return aiResponses.procrastination[Math.floor(Math.random() * aiResponses.procrastination.length)];
  }
  if (lower.includes("motivat") || lower.includes("inspired") || lower.includes("give up")) {
    return aiResponses.motivation[Math.floor(Math.random() * aiResponses.motivation.length)];
  }
  if (lower.includes("habit") || lower.includes("routine") || lower.includes("consistent")) {
    return aiResponses.habits[Math.floor(Math.random() * aiResponses.habits.length)];
  }
  if (lower.includes("focus") || lower.includes("distract") || lower.includes("concentrat")) {
    return aiResponses.focus[Math.floor(Math.random() * aiResponses.focus.length)];
  }
  if (lower.includes("sleep") || lower.includes("tired") || lower.includes("rest")) {
    return aiResponses.sleep[Math.floor(Math.random() * aiResponses.sleep.length)];
  }
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export default function CoachPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey! I'm Quest AI, your personal life coach. I'm here to help you build better habits, stay motivated, and level up every area of your life. What's on your mind today? 🚀",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setTyping(true);
    const delay = 900 + Math.random() * 600;
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "ai", text: getAIResponse(msg) }]);
    }, delay);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <AppShell>
      <div className="flex flex-col h-screen max-h-screen">
        {/* Header */}
        <div
          className="flex items-center gap-4 px-8 py-5 border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(8,8,16,0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="relative">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0891b2, #7c3aed)",
                boxShadow: "0 0 20px rgba(6,182,212,0.4)",
              }}
            >
              <Bot size={20} color="white" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080810]" />
          </div>
          <div>
            <div className="font-semibold text-white">Quest AI</div>
            <div className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online — always here for you
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-white/30">
            <Sparkles size={12} className="text-violet-400" />
            AI-powered responses
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
              >
                {msg.role === "ai" && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ background: "linear-gradient(135deg, #0891b2, #7c3aed)" }}
                  >
                    <Bot size={14} color="white" strokeWidth={1.5} />
                  </div>
                )}
                <div
                  className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                          color: "white",
                          borderBottomRightRadius: "6px",
                        }
                      : {
                          background: "rgba(6,182,212,0.1)",
                          border: "1px solid rgba(6,182,212,0.2)",
                          color: "rgba(255,255,255,0.88)",
                          borderBottomLeftRadius: "6px",
                        }
                  }
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-3"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0891b2, #7c3aed)" }}
              >
                <Bot size={14} color="white" strokeWidth={1.5} />
              </div>
              <div
                className="rounded-2xl"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.2)",
                  borderBottomLeftRadius: "6px",
                }}
              >
                <TypingDots />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div
          className="px-8 py-3 flex gap-2 flex-wrap border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {suggestions.map(s => (
            <motion.button
              key={s.key}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => sendMessage(s.label)}
              className="px-3 py-1.5 rounded-full text-xs text-cyan-300 transition-colors"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              {s.label}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-3 px-6 py-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your coach anything..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity"
            style={{
              background: "linear-gradient(135deg, #0891b2, #7c3aed)",
              opacity: !input.trim() || typing ? 0.4 : 1,
            }}
          >
            <Send size={15} color="white" />
          </motion.button>
        </div>
      </div>
    </AppShell>
  );
}
