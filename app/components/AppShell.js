"use client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import LevelUpCinematic from "./LevelUpCinematic";
import CursorGlow from "./CursorGlow";
import AmbientBackground from "./AmbientBackground";
import AINarrator from "./AInarrator";
import ShadowMode from "./ShadowMode";
import CinematicIntro from "./CinematicIntro";
import { useGame } from "../lib/store";

function AppShellInner({ children }) {
  const { state, markIntroSeen } = useGame();
  const [showIntro, setShowIntro] = useState(!state.introSeen);

  function handleIntroComplete() {
    setShowIntro(false);
    markIntroSeen();
  }

  return (
    <div className="flex min-h-screen bg-[#080810] text-white relative">
      <AmbientBackground />
      {/* Cursor glow — desktop only */}
      <div className="hidden md:block">
        <CursorGlow />
      </div>
      <ShadowMode />

      <AnimatePresence>
        {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content — offset on desktop, full-width on mobile */}
      <main className="flex-1 md:ml-56 min-h-screen overflow-y-auto relative z-10 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="block md:hidden">
        <MobileNav />
      </div>

      <LevelUpCinematic />
      <AINarrator />
    </div>
  );
}

export default function AppShell({ children }) {
  return <AppShellInner>{children}</AppShellInner>;
}
