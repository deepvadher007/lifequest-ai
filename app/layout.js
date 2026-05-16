import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "LifeQuest AI — Level Up Your Real Life",
  description:
    "The AI-powered gamified self-improvement platform. Build habits, complete quests, earn XP, defeat the Daily Boss, and level up your real life.",
  keywords: ["self-improvement", "gamification", "habits", "productivity", "RPG", "AI coach"],
  authors: [{ name: "LifeQuest AI" }],
  creator: "LifeQuest AI",
  openGraph: {
    title: "LifeQuest AI — Level Up Your Real Life",
    description: "A cinematic life RPG that turns self-improvement into an epic adventure.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeQuest AI — Level Up Your Real Life",
    description: "A cinematic life RPG that turns self-improvement into an epic adventure.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#080810",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#080810" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-full bg-[#080810] text-white overflow-x-hidden">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
