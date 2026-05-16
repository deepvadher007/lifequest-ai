import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LifeQuest AI — Level Up Your Real Life",
  description: "The AI-powered gamified self-improvement platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#080810] text-white">
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
