"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-[#080810] flex items-center justify-center z-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-6xl"
        >
          ⚠️
        </motion.div>

        <div>
          <h2 className="text-2xl font-black text-white mb-2">System Error</h2>
          <p className="text-white/45 text-sm leading-relaxed">
            The system encountered an anomaly. Your progress is safe.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={reset}
          className="px-8 py-3 rounded-full text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 0 20px rgba(124,58,237,0.4)",
          }}
        >
          Restart System
        </motion.button>
      </motion.div>
    </div>
  );
}
