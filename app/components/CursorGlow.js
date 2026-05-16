"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 80, damping: 22 });
  const sy = useSpring(y, { stiffness: 80, damping: 22 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <>
      {/* Large ambient glow */}
      <motion.div
        className="fixed pointer-events-none z-[9990]"
        style={{
          width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.055) 0%, transparent 70%)",
          translateX: useSpring(useMotionValue(0), { stiffness: 40, damping: 20 }),
          x: sx,
          y: sy,
          marginLeft: -300,
          marginTop: -300,
        }}
      />
      {/* Sharp cursor dot */}
      <motion.div
        className="fixed pointer-events-none z-[9991] rounded-full"
        style={{
          width: 8, height: 8,
          background: "rgba(167,139,250,0.9)",
          boxShadow: "0 0 12px rgba(167,139,250,0.8), 0 0 24px rgba(167,139,250,0.4)",
          x: sx,
          y: sy,
          marginLeft: -4,
          marginTop: -4,
        }}
      />
    </>
  );
}
