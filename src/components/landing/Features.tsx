import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const InterviewlyFeatures = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      title: "AI-Powered Assessment",
      description:
        "Advanced AI evaluates coding skills, problem-solving approach, and technical communication in real-time with machine learning algorithms that adapt to each candidate's unique style.",
      gradient: "from-blue-600 via-blue-500 to-cyan-600",
      number: "01",
    },
    {
      title: "Live Code Editor",
      description:
        "Collaborative coding environment with syntax highlighting, auto-completion, and multiple language support. Features real-time collaboration and advanced debugging tools.",
      gradient: "from-blue-600 via-blue-500 to-indigo-600",
      number: "02",
    },
    {
      title: "Smart Interview Chat",
      description:
        "AI-driven conversation flow that adapts questions based on candidate responses and skill level. Natural language processing ensures contextual understanding.",
      gradient: "from-blue-600 via-blue-500 to-cyan-600",
      number: "03",
    },
    {
      title: "Detailed Analytics",
      description:
        "Comprehensive performance metrics, skill quizzes, and comparative analysis for data-driven decisions. Advanced reporting with customizable dashboards and insights.",
      gradient: "from-blue-600 via-blue-500 to-indigo-600",
      number: "04",
    },
    {
      title: "Instant Results",
      description:
        "Get immediate feedback and scoring as soon as the quiz concludes with detailed breakdowns. Real-time performance tracking and automated report generation.",
      gradient: "from-blue-600 via-blue-500 to-cyan-600",
      number: "05",
    },
    {
      title: "Time Efficient",
      description:
        "Reduce interview time by 60% while maintaining quality through automated screening and evaluation. Streamlined workflows and intelligent candidate matching.",
      gradient: "from-blue-600 via-blue-500 to-indigo-600",
      number: "06",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
        duration: 0.6,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 25,
        delay: 0.1,
      },
    },
  };

  return (
    <section
      ref={ref}
      id="features"
      className="relative pt-20 pb-20 md:pt-32 md:pb-28 bg-black overflow-hidden"
    >
      {/* Simplified Background */}
      <div className="absolute inset-0">
        {/* Static Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37, 99, 235, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        
        {/* Static gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent" />

        {/* Single floating orb with simpler animation */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-8 py-4 mb-8 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm text-blue-300 font-semibold tracking-wider">
              NEXT-GEN FEATURES
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            Revolutionary{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600">
              Interview Experience
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Transform your hiring process with cutting-edge technology that
            delivers{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 font-semibold">
              exceptional results
            </span>
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative h-80"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 25 },
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Main Card */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer">
                {/* Background with gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-80`}
                  animate={{
                    scale: hoveredIndex === index ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                />

                {/* Overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                {/* Content Container */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  {/* Top Section - Always visible */}
                  <div>
                    <motion.div
                      className="text-6xl font-black text-white/30 mb-4"
                      animate={{
                        scale: hoveredIndex === index ? 0.9 : 1,
                        opacity: hoveredIndex === index ? 0.4 : 0.3,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {feature.number}
                    </motion.div>

                    <motion.h3
                      className="text-2xl font-bold text-white mb-4 leading-tight"
                      animate={{
                        y: hoveredIndex === index ? -5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {feature.title}
                    </motion.h3>
                  </div>

                  {/* Description - Simplified hover effect */}
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: hoveredIndex === index ? "auto" : 0,
                      opacity: hoveredIndex === index ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.p
                      className="text-white/90 leading-relaxed text-sm font-medium"
                      animate={{
                        y: hoveredIndex === index ? 0 : 10,
                      }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>

                  {/* Bottom indicator */}
                  <motion.div
                    className="w-full h-1 bg-white/20 rounded-full mt-6"
                    animate={{
                      scaleX: hoveredIndex === index ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ transformStyle: "preserve-3d" }}
                  />
                </div>

                {/* Simplified glow effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-0 -z-10`}
                  animate={{
                    opacity: hoveredIndex === index ? 0.4 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: "preserve-3d" }}
                />

                {/* Border glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-blue-600/20"
                  animate={{
                    borderColor:
                      hoveredIndex === index
                        ? "rgba(59, 130, 246, 0.4)"
                        : "rgba(59, 130, 246, 0.2)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InterviewlyFeatures;
