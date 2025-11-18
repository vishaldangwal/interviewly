import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Code,
  Camera,
  UserCircle,
  Mic,
  Shield,
  Play,
  Zap,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const LandingPart = () => {
  const { user } = useUser();
  const navigate = useRouter();
  return (
    <section
      className="relative pt-20 pb-20 md:pt-40 md:pb-28 bg-black overflow-hidden"
      id="hero"
    >
      {/* Animated Grid Background */}
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
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent" />

        {/* Animated grid glow effects */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
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
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col  md:flex-row items-center justify-between gap-20">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Enhanced Premium Badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="relative">
                <Sparkles size={18} className="text-blue-400" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles size={18} className="text-blue-400 opacity-20" />
                </div>
              </div>
              <span className="text-sm text-blue-300 font-semibold tracking-wide">
                AI-Powered Interview Platform
              </span>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600">
                Revolutionary
              </span>
              <br />
              <span className="text-white">
                Technical
                <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Interviews
                </span>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Experience next-generation technical interviews with{" "}
              <span className="text-blue-400 font-semibold">
                AI-powered insights
              </span>
              , crystal-clear video calls, and seamless code collaboration—all
              in one beautifully designed platform.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {user == null ? (
                <SignInButton>
                  <Button
                    size="lg"
                    className="relative overflow-hidden rounded-2xl px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 group text-lg font-semibold"
                    onClick={() => {}}
                  >
                    <span className="relative z-10 flex items-center">
                      Start Free Trial
                      <motion.div
                        className="ml-3"
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Zap size={20} />
                      </motion.div>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600 opcity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300"></div>
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  size="lg"
                  className="relative overflow-hidden rounded-2xl px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 group text-lg font-semibold"
                  onClick={() => {
                    navigate.push("/home");
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <motion.div
                      className="ml-3"
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl px-8 py-4 border-2 border-blue-600/40 text-blue-300 hover:bg-blue-600/10 hover:border-blue-600 hover:text-white transition-all duration-300 group backdrop-blur-sm text-lg font-semibold"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <Play
                  size={20}
                  className="mr-3 group-hover:text-blue-400 transition-colors duration-300"
                />
                See Features
              </Button>
            </motion.div>

            {/* Enhanced Premium Stats */}
            <motion.div
              className="flex gap-12 mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-center group">
                <div className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors duration-300">
                  50K+
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                  Interviews
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors duration-300">
                  500+
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                  Companies
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors duration-300">
                  99.9%
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide uppercase">
                  Uptime
                </div>
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center gap-4 mt-8 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <Shield size={16} className="text-blue-400" />
              <span className="text-xs text-gray-400 font-medium">
                SOC 2 Compliant • GDPR Ready • 256-bit Encryption
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="md:w-1/2 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="relative">
              {/* Enhanced Premium 3D Interview UI */}
              <motion.div
                className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-4 shadow-2xl border border-blue-600/30"
                initial={{ rotateY: 15, rotateX: -10 }}
                animate={{ rotateY: 0, rotateX: 0 }}
                transition={{
                  duration: 1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  rotateY: -5,
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.5 },
                }}
              >
                {/* Premium glowing border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-blue-400/20 to-blue-600/20 rounded-3xl blur-xl animate-pulse"></div>

                <div className="relative bg-black/90 rounded-2xl overflow-hidden shadow-lg border border-blue-600/40">
                  {/* Enhanced Premium Header */}
                  <div className="bg-gradient-to-r from-black to-gray-900 p-4 flex items-center justify-between border-b border-blue-600/20">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                    </div>
                    <div className="text-white text-sm font-bold flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-lg shadow-blue-600/50"></div>
                      Senior Developer Interview - Interviewly
                    </div>
                    <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-full">
                      <Shield size={14} className="text-blue-400" />
                      <span className="text-xs text-blue-400 font-semibold">
                        Secure
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 h-80">
                    {/* Enhanced Premium Code Editor */}
                    <div className="col-span-3 border-r border-blue-600/20 p-4 bg-black">
                      <div className="bg-gray-900/80 rounded-xl p-4 text-sm font-mono h-full overflow-hidden border border-blue-600/30 backdrop-blur-sm">
                        <div className="text-blue-400 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          // AI-Suggested: Optimized algorithm
                        </div>
                        <div className="text-blue-400 mb-2 font-bold">
                          function findDuplicates(array) {"{"}
                        </div>
                        <div className="ml-4 text-gray-300">
                          const seen = new Set();
                        </div>
                        <div className="ml-4 text-gray-300">
                          const duplicates = new Set();
                        </div>
                        <div className="ml-4 mt-3">
                          <span className="text-purple-400 font-bold">for</span>
                          <span className="text-gray-300"> (</span>
                          <span className="text-orange-400 font-bold">
                            const
                          </span>
                          <span className="text-gray-300"> item </span>
                          <span className="text-purple-400 font-bold">of</span>
                          <span className="text-gray-300"> array) {"{"}</span>
                        </div>
                        <div className="ml-8 text-gray-300">
                          <span className="text-purple-400 font-bold">if</span>
                          <span className="text-gray-300">
                            {" "}
                            (seen.has(item)) {"{"}
                          </span>
                        </div>
                        <div className="ml-12 text-gray-300">
                          duplicates.add(item);
                        </div>
                        <div className="ml-8 text-gray-300">
                          {"}"}{" "}
                          <span className="text-purple-400 font-bold">
                            else
                          </span>{" "}
                          {"{"}
                        </div>
                        <div className="ml-12 text-gray-300">
                          seen.add(item);
                        </div>
                        <div className="ml-8 text-gray-300">{"}"}</div>
                        <div className="ml-4 text-gray-300">{"}"}</div>
                        <div className="ml-4 mt-3 text-purple-400 font-bold">
                          return [...duplicates];
                        </div>
                        <div className="text-blue-400 font-bold">{"}"}</div>
                        {/* Enhanced AI Suggestion */}
                        <div className="mt-3 p-3 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-300 text-xs backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <Sparkles size={12} className="text-blue-400" />
                            <span className="font-semibold">
                              AI: Consider using Map for better performance
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Premium Video Section */}
                    <div className="col-span-2 grid grid-rows-2 bg-gray-900/50">
                      <div className="p-3 border-b border-blue-600/20 relative">
                        <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl h-full w-full flex items-center justify-center relative overflow-hidden border border-blue-600/30">
                          <Avatar className="w-16 h-16 border-2 border-blue-600 shadow-lg shadow-blue-600/30">
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                              <UserCircle size={28} className="text-white" />
                            </AvatarFallback>
                          </Avatar>
                          {/* Enhanced speaking indicator */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75 shadow-lg shadow-blue-400/50"></div>
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150 shadow-lg shadow-blue-400/50"></div>
                          </div>
                          <div className="absolute top-3 right-3 text-xs text-blue-400 font-semibold bg-blue-600/20 px-2 py-1 rounded-full">
                            Speaking
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl h-full w-full flex items-center justify-center relative overflow-hidden border border-blue-600/30">
                          <Avatar className="w-16 h-16 border-2 border-gray-600">
                            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold">
                              <UserCircle size={28} className="text-white" />
                            </AvatarFallback>
                          </Avatar>
                          {/* Enhanced mute indicator */}
                          <div className="absolute top-3 right-3 bg-gray-800/80 p-1 rounded-full">
                            <Mic size={12} className="text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Premium Floating Elements */}
              {/* <motion.div
                className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-2xl shadow-blue-600/30 backdrop-blur-sm border border-blue-500/50"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              >
                <Code size={28} className="text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-2xl shadow-2xl shadow-blue-600/30 backdrop-blur-sm border border-blue-500/50"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  delay: 1,
                }}
              >
                <Camera size={28} className="text-white" />
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-12 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-2xl shadow-blue-500/30 backdrop-blur-sm border border-blue-400/50"
                animate={{
                  x: [0, -15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  delay: 0.5,
                }}
              >
                <Sparkles size={24} className="text-white" />
              </motion.div> */}

              {/* Additional premium floating elements */}
              <motion.div
                className="absolute top-1/4 right-0 bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-xl shadow-blue-600/20 backdrop-blur-sm"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "linear",
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingPart;
