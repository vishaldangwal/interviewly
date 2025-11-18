import React, { useState } from "react";
import { motion } from "framer-motion";

const TrustedCompanies = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Company data with mock SVG icons
  const companies = [
    {
      name: "Google",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg",
    },
    {
      name: "Microsoft",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg",
    },
    {
      name: "Apple",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg",
    },
    {
      name: "Meta",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/meta.svg",
    },
    {
      name: "Netflix",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg",
    },
    {
      name: "Spotify",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg",
    },
    {
      name: "Uber",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/uber.svg",
    },
    {
      name: "Airbnb",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/airbnb.svg",
    },
    {
      name: "Tesla",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tesla.svg",
    },
    {
      name: "Stripe",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stripe.svg",
    },
    {
      name: "GitHub",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    },
    {
      name: "Slack",
      icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/slack.svg",
    },
  ];

  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="relative  bg-black overflow-hidden py-20">
      {/* Animated Grid Background - matching LandingPart.tsx */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
          linear-gradient(rgba(37, 99, 235, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(37, 99, 235, 0.3) 1px, transparent 1px)
        `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient overlay for depth - INVERTED */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-blue-600/5" />

        {/* Animated grid glow effects - INVERTED */}
        <motion.div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.05, 0.15],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Updated Headline with Blue and White Theme */}
          <h2 className="text-5xl md:text-7xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent animate-pulse">
              Trusted by the Best in Tech
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent blur-lg opacity-50 animate-pulse">
              Trusted by the Best in Tech
            </div>
          </h2>

          {/* Updated Subtitle with Blue and White Theme */}
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            From startups to global giants — Interviewly empowers engineers
            everywhere with cutting-edge technology.
          </p>
        </div>

        {/* Marquee Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Enhanced Gradient Overlays with Smooth Fade */}
          <div className="absolute left-0 top-0 w-48 h-full bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-black via-black/80 to-transparent z-10"></div>

          {/* Animated Company Cards */}
          <div
            className={`flex gap-8 ${isPaused ? "animation-paused" : "animate-marquee"}`}
            style={{
              width: "max-content",
              animation: isPaused ? "none" : "marquee 25s linear infinite",
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="group flex-shrink-0 w-64 h-32 relative"
              >
                {/* Card */}
                <div className="relative h-full bg-gray-900/20 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 transition-all duration-500 group-hover:scale-105 group-hover:bg-gray-800/30 group-hover:border-blue-500/50 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-3">
                    {/* Company Icon */}
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img
                        src={company.icon}
                        alt={`${company.name} logo`}
                        className="w-10 h-10 filter invert brightness-0 group-hover:brightness-100 transition-all duration-500"
                        style={{ filter: "invert(1) brightness(2)" }}
                      />
                    </div>

                    {/* Company Name - Updated to Blue and White Theme */}
                    <h3 className="text-xl font-semibold text-white group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      {company.name}
                    </h3>
                  </div>

                  {/* Neon Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>
      </div>

      {/* Custom CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }

        .animation-paused {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};

export default TrustedCompanies;
