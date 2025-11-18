import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const LOGO_LIGHT = "/applogo.png";
const LOGO_DARK = "/applogo-dark.png";

export default function Loading() {
  const { theme } = useTheme();
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Animated floating dots background
  const floatingDots = Array.from({ length: 18 }).map((_, i) => {
    const size = Math.random() * 12 + 8;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 6 + 6;
    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-blue-500/20 dark:bg-blue-400/20"
        style={{ width: size, height: size, left: `${left}%`, top: `${top}%` }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration,
          repeat: Infinity,
          delay: Math.random() * 4,
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">{floatingDots}</div>
      <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl bg-background/80 backdrop-blur-xl border border-blue-500/10">
        {/* App Logo */}
        <motion.img
          src={theme === "dark" ? LOGO_DARK : LOGO_LIGHT}
          alt="Interviewly Logo"
          className="w-20 h-20 mb-6 drop-shadow-xl select-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        />
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-4">
          <motion.div
            className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"
            style={{ animationDuration: "1.2s" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 border-r-4 border-blue-400 rounded-full animate-spin"
            style={{ animationDuration: "1.6s" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 border-b-4 border-blue-300 rounded-full animate-spin"
            style={{ animationDuration: "2s" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          {/* Inner color gradient */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-80"
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
        </div>
        {/* Loading text */}
        <div className="flex items-center text-lg font-semibold">
          <span className="text-blue-500 dark:text-blue-400">Loading</span>
          <span className="w-10 ml-1 text-left text-foreground">{".".repeat(dots)}</span>
        </div>
      </div>
    </div>
  );
}
