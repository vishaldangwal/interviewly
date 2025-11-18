import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Calendar,
  Camera,
  MessageSquare,
  Users,
  Mic,
  Coffee,
  Terminal,
} from "react-feather"; // Added Terminal icon
import { ChevronDown } from "lucide-react";

const AnimatedBackground = () => {
  const numberOfDots = 20;
  const commonIconSize = 24;
  const numberOfParticles = 30;
  const primaryblue = "#8b5cf6"; // Example primary blue

  const taglineVariants = {
    initial: { x: -50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  const appNameVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.5,
        type: "spring",
        stiffness: 150,
        damping: 15,
      },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const tagline = "Ace Your Interviews";
  const appName = "Interviewly";

  const orbitingIcons = [Calendar, Camera, MessageSquare, Users, Mic, Coffee];
  const orbitRadius = 60; // Adjust the radius of the orbit
  const orbitCenter = { x: "50%", y: "50%" }; // Center of the orbit
  const orbitSpeed = 12; // Adjust the speed of the orbit

  return (
    <div className="absolute top-[100px] left-0 right-0 h-screen pointer-events-none overflow-hidden">
      <div className="text-center">
        <motion.h2
          className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
          initial="initial"
          animate="animate"
          variants={taglineVariants}
        >
          {tagline}
        </motion.h2>
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold"
        //   style={{ color: primaryblue }}
          initial="initial"
          animate="animate"
          variants={appNameVariants}
          whileHover="hover"
          style={{ cursor: "default", color: primaryblue }}
        >
          {appName}
        </motion.h1>
      </div>
      {/* Circular Orbiting Icons */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Central Coding Icon */}
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-blue-200 dark:bg-blue-700 shadow-md">
          <Terminal
            size={32}
            className="text-blue-500 dark:text-blue-300"
          />
        </div>
        {/* Orbiting Icons */}
        {orbitingIcons.map((Icon, index) => {
          const angle = (index / orbitingIcons.length) * 2 * Math.PI;
          const x = orbitRadius * Math.cos(angle);
          const y = orbitRadius * Math.sin(angle);
          const animationDelay = index * (orbitSpeed / orbitingIcons.length);

          return (
            <motion.div
              key={`orbiting-icon-${index}`}
              className="absolute rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm"
              style={{
                top: `calc(50% - ${commonIconSize / 2}px)`,
                left: `calc(50% - ${commonIconSize / 2}px)`,
              }}
              animate={{
                x:
                  orbitRadius *
                  Math.cos(
                    2 *
                      Math.PI *
                      (performance.now() / (orbitSpeed * 1000) -
                        animationDelay / orbitSpeed),
                  ),
                y:
                  orbitRadius *
                  Math.sin(
                    2 *
                      Math.PI *
                      (performance.now() / (orbitSpeed * 1000) -
                        animationDelay / orbitSpeed),
                  ),
              }}
              transition={{
                repeat: Infinity,
                duration: orbitSpeed,
                ease: "linear",
                delay: animationDelay,
              }}
            >
              <Icon
                size={commonIconSize - 4}
                className={`text-blue-${((index % 5) + 3) * 100}`}
              />{" "}
              {/* Varying blue shades */}
            </motion.div>
          );
        })}
      </div>

      {/* Top section animated icons (remaining) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
        <motion.div
          className="absolute top-16 right-16"
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
            <Code size={commonIconSize} className="text-primary-500" />
          </div>
        </motion.div>

        {/* ... (rest of your existing top section icons) ... */}
        <motion.div
          className="absolute top-36 right-48"
          animate={{ y: [-5, 5, -5], rotate: [5, -5, 5] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-md">
            <Calendar size={commonIconSize} className="text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-1/3"
          animate={{ y: [-8, 8, -8], rotate: [-7, 7, -7] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
            <Camera size={commonIconSize} className="text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-48 left-16"
          animate={{ y: [4, -4, 4], rotate: [2, -2, 2] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.5,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
            <MessageSquare size={commonIconSize} className="text-green-400" />
          </div>
        </motion.div>

        {/* Additional animated icons */}
        <motion.div
          className="absolute top-60 left-1/2 -translate-x-1/2"
          animate={{ y: [-3, 10, -3], x: [5, -5, 5], rotate: [-2, 2, -2] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-md">
            <Users size={commonIconSize} className="text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-32 right-1/3"
          animate={{ y: [6, -10, 6], rotate: [3, -3, 3] }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.7,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
            <Mic size={commonIconSize} className="text-red-400" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-72 left-40"
          animate={{ y: [-5, 8, -5], rotate: [-4, 4, -4] }}
          transition={{
            duration: 7.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1.2,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-md">
            <Coffee size={commonIconSize} className="text-amber-400" />
          </div>
        </motion.div>

        {/* Floating dots */}
        {[...Array(numberOfDots)].map((_, i) => {
          const startTop = 10 + Math.random() * 70;
          const startLeft = Math.random() * 100;
          const size = 3 + Math.random() * 5;
          const hue = Math.random() * 360;
          const opacity = 0.4 + Math.random() * 0.3;
          const duration = 15 + Math.random() * 15;
          const yOffset =
            Math.random() > 0.5 ? -Math.random() * 80 : Math.random() * 80;
          const xOffset =
            Math.random() > 0.5 ? -Math.random() * 30 : Math.random() * 30;

          return (
            <motion.div
              key={`dot-${i}`}
              className="absolute rounded-full"
              style={{
                top: `${startTop}%`,
                left: `${startLeft}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `hsl(${hue}, 60%, 70%)`,
                opacity: opacity,
              }}
              animate={{
                y: [yOffset * 0.5, yOffset, yOffset * 0.5],
                x: [xOffset * 0.5, xOffset, xOffset * 0.5],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          );
        })}

        {/* Background gradient circles remain for subtle background texture */}
        <div className="absolute top-1/4 left-1/8 w-48 h-48 rounded-full bg-primary-400/10 blur-2xl" />
        <div className="absolute top-1/3 right-1/8 w-64 h-64 rounded-full bg-blue-400/10 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 rounded-full bg-blue-400/10 blur-2xl" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.01] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Animated particles (which are also dots) floating throughout the page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(numberOfParticles)].map((_, i) => {
          const startTop = Math.random() * 100;
          const startLeft = Math.random() * 100;
          const size = 1 + Math.random() * 3;
          const opacity = 0.15 + Math.random() * 0.25;
          const duration = 20 + Math.random() * 25;
          const yOffset =
            Math.random() > 0.5 ? -Math.random() * 200 : Math.random() * 200;
          const xOffset =
            Math.random() > 0.5 ? -Math.random() * 80 : Math.random() * 80;
          let backgroundColor;
          if (i % 3 === 0)
            backgroundColor = "#6366f1"; // blue-500
          else if (i % 3 === 1)
            backgroundColor = "#a855f7"; // blue-500
          else backgroundColor = "#3b82f6"; // blue-500

          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                top: `${startTop}%`,
                left: `${startLeft}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: backgroundColor,
                opacity: opacity,
              }}
              animate={{
                y: [yOffset * 0.5, yOffset, yOffset * 0.5],
                x: [xOffset * 0.5, xOffset, xOffset * 0.5],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </div>

      <motion.div
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [0, 10, 10, 20],
        }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          times: [0, 0.3, 0.7, 1],
        }}
        // style={{ display: isScrolled ? "none" : "block" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-foreground/70 text-sm mb-2 font-medium">
            Scroll Down
          </span>
          <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-full">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown size={24} className="text-primary" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedBackground;
