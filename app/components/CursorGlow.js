"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  // Softer spring — less CPU
  const sx = useSpring(x, { stiffness: 60, damping: 25 });
  const sy = useSpring(y, { stiffness: 60, damping: 25 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Ambient glow — large, very subtle */}
      <motion.div
        className="fixed pointer-events-none z-[9990] rounded-full"
        style={{
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          x: sx, y: sy,
          marginLeft: -250, marginTop: -250,
          willChange: "transform",
        }}
      />
      {/* Cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9991] rounded-full"
        style={{
          width: 7, height: 7,
          background: "rgba(167,139,250,0.85)",
          boxShadow: "0 0 10px rgba(167,139,250,0.7)",
          x: sx, y: sy,
          marginLeft: -3.5, marginTop: -3.5,
          willChange: "transform",
        }}
      />
    </>
  );
}
