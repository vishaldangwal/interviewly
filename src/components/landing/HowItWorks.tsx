import React, { useRef, useEffect, useState } from "react";
import {
  User,
  Brain,
  MessageSquare,
  CheckCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const HowInterviewlyWorks = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: "-100px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      description:
        "Set up your personalized interview profile with skills and experience.",
      gradient: "from-blue-600 to-blue-700",
      icon: User,
    },
    {
      id: 2,
      title: "AI-Powered Quizzes and Practice",
      description:
        "Practice with realistic AI-driven technical and behavioral questions.",
      gradient: "from-blue-600 to-blue-700",
      icon: Brain,
    },
    {
      id: 3,
      title: "Real-Time Feedback",
      description:
        "Get instant feedback on your responses and communication style.",
      gradient: "from-blue-600 to-blue-700",
      icon: MessageSquare,
    },
    {
      id: 4,
      title: "Land Your Dream Job",
      description:
        "Apply your refined skills and confidence to ace real interviews.",
      gradient: "from-blue-600 to-blue-700",
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Matrix Background */}
      <MatrixBackground />

      {/* Simple Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div
        ref={containerRef}
        className={`max-w-6xl mx-auto relative z-10 transition-opacity duration-1000 ${
          isInView ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Section Header */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 delay-200 ${
            isInView ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-black/80 border border-blue-500/60 rounded-full px-6 py-3 mb-6 backdrop-blur-xl scale-105 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-semibold tracking-wide">
              How It Works
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600">
              Master Interviews in
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              4 Simple Steps
            </span>
          </h2>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your interview skills with our AI-powered platform
            designed to give you the confidence and expertise needed to succeed.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-blue-600/30 via-blue-500/50 to-blue-600/30 hidden md:block">
            <div
              className={`w-full bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-2000 delay-500 ${
                isInView ? "h-full" : "h-0"
              }`}
            />
          </div>

          {/* Floating particles along timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 h-full hidden md:block pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                style={{
                  top: `${15 + i * 15}%`,
                  left: "-2px",
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Steps Container */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <EnhancedStepItem
                key={step.id}
                number={step.id}
                title={step.title}
                description={step.description}
                isLeft={index % 2 === 0}
                gradient={step.gradient}
                icon={step.icon}
                delay={index * 200}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Matrix Background Component
const MatrixBackground = () => {
  const [matrixChars, setMatrixChars] = useState([]);

  useEffect(() => {
    const chars = [];
    const columns = Math.floor(window.innerWidth / 25);
    const matrixChars = "01";

    for (let i = 0; i < columns; i++) {
      const columnChars = [];
      for (let j = 0; j < 40; j++) {
        columnChars.push(
          matrixChars[Math.floor(Math.random() * matrixChars.length)],
        );
      }

      chars.push({
        id: i,
        x: i * 25,
        chars: columnChars,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.08 + 0.02,
        delay: Math.random() * 5,
      });
    }

    setMatrixChars(chars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {matrixChars.map((column) => (
        <div
          key={column.id}
          className="absolute top-0 text-blue-500/20 text-xs font-mono whitespace-nowrap select-none"
          style={{
            left: column.x,
            opacity: column.opacity,
            animation: `matrixFall ${30 / column.speed}s linear infinite`,
            animationDelay: `${column.delay}s`,
          }}
        >
          {column.chars.map((char, index) => (
            <div key={index} className="block leading-tight h-4">
              {char}
            </div>
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes matrixFall {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Step Item Component
function EnhancedStepItem({
  number,
  title,
  description,
  isLeft,
  gradient,
  icon: Icon,
  delay,
  isInView,
}) {
  return (
    <div
      className={`relative flex items-center ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 transform transition-all duration-300 ${
        isInView
          ? "translate-x-0 opacity-100"
          : `${isLeft ? "-translate-x-20" : "translate-x-20"} opacity-0`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Content Card */}
      <div className="md:w-1/2">
        <div className="relative bg-gradient-to-br from-black/80 via-gray-900/60 to-black/80 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/30 shadow-2xl shadow-blue-500/20 scale-[1.03] -translate-y-2 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-blue-500/5" />

          {/* Moving gradient overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent transform -skew-x-12 animate-pulse" />
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-blue-500/50 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-blue-500/50 rounded-br-2xl" />

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-pulse"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/5 to-blue-600/0 rounded-2xl blur-xl" />

          <div className="relative z-10">
            {/* Header with enhanced styling */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative p-3 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl border border-blue-400/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-xl" />
                <Icon className="w-7 h-7 text-blue-200 relative z-10 scale-110" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
                  {title}
                </h3>
                <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 mt-1" />
              </div>
            </div>

            {/* Enhanced description */}
            <div className="relative">
              <p className="text-gray-100 leading-relaxed text-lg">
                {description}
              </p>

              {/* Subtle underline effect */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
            </div>

            {/* Action indicator */}
            <div className="mt-6 flex items-center gap-2 opacity-100 transform translate-y-0">
              <span className="text-blue-400 text-sm font-medium">
                Learn More
              </span>
              <ArrowRight className="w-4 h-4 text-blue-400 translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Central Timeline Node */}
      <div className="relative z-20 flex-shrink-0">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-blue-500/50 border-2 border-white/20 relative overflow-hidden scale-110 transform ${
            isInView ? "scale-110 rotate-0" : "scale-0 -rotate-180"
          }`}
          style={{ transitionDelay: `${delay + 300}ms` }}
        >
          {/* Rotating background */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 animate-spin"
            style={{ animationDuration: "8s" }}
          />

          {/* Inner glow */}
          <div className="absolute inset-2 bg-gradient-to-br from-blue-400/40 to-blue-600/40 rounded-full" />

          <span className="text-white font-bold text-lg relative z-10 scale-110">
            {number}
          </span>
        </div>

        {/* Pulsing rings */}
        <div className="absolute inset-0 w-16 h-16 rounded-full">
          <div
            className="absolute inset-0 border-2 border-blue-500/40 rounded-full animate-ping"
            style={{ animationDuration: "2s", animationDelay: `${delay}ms` }}
          />
          <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-pulse" />
        </div>

        {/* Orbital particles */}
        <div className="absolute inset-0 w-16 h-16">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-spin"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: `${20 + i * 5}px 0`,
                animationDuration: `${3 + i}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Spacer for layout */}
      <div className="md:w-1/2 hidden md:block"></div>
    </div>
  );
}

export default HowInterviewlyWorks;
