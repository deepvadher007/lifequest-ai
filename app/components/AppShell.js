"use client";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-[#080810] text-white">
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
