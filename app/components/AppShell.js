"use client";
import Sidebar from "./Sidebar";
import LevelUpCinematic from "./LevelUpCinematic";
import CursorGlow from "./CursorGlow";
import AmbientBackground from "./AmbientBackground";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-[#080810] text-white relative">
      <AmbientBackground />
      <CursorGlow />
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen overflow-y-auto relative z-10">
        {children}
      </main>
      <LevelUpCinematic />
    </div>
  );
}
