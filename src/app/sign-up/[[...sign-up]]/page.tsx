"use client";

import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  Code,
  Users,
  Award,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  return (
    <div className="min-h-screen mt-6 bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-40">
        {" "}
        {/* Increased opacity from 10 to 40 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.2)_1px,transparent_1px)] bg-[size:50px_50px]" />{" "}
        {/* Increased grid line alpha from 0.1 to 0.2 */}
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.25, 0.1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.2, 0.05],
            rotate: [0, 180, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
     
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
          {/* <motion.div
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
              Join the community
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div> */}

          {/* Premium Title */}
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Interviewly
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Start your journey to ace technical interviews with AI-powered
            practice and real-time feedback.
          </motion.p>
        </div>

        <div className="flex items-center justify-center">
          {/* Right Side - Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
              {/* Form glow effect */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-blue-600/10 rounded-2xl" /> */}{" "}
              {/* Removed gradient overlay */}
              <div className="relative z-10">
                <SignUp
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none p-0",
                      headerTitle: "text-white text-xl font-semibold",
                      headerSubtitle: "text-gray-400",
                      formButtonPrimary:
                        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-600/25 border border-blue-600/50 hover:border-blue-500",
                      formFieldInput:
                        "bg-black/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 rounded-lg backdrop-blur-sm hover:border-gray-600 transition-all duration-300",
                      formFieldLabel: "text-gray-300 font-medium",
                      dividerLine: "bg-gray-700",
                      dividerText: "text-gray-400",
                      socialButtonsBlockButton:
                        "bg-black/50 border border-gray-700 text-white hover:bg-gray-800/50 hover:border-blue-600/50 transition-all duration-300 rounded-lg backdrop-blur-sm",
                      socialButtonsBlockButtonText: "text-white",
                      formFieldAction: "text-blue-400 hover:text-blue-300",
                      footerAction: "text-gray-400",
                      footerActionLink:
                        "text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300",
                      formFieldError: "text-red-400 text-sm",
                      formFieldErrorText: "text-red-400",
                      identityPreviewText: "text-gray-300",
                      footer: "hidden",
                      identityPreviewEditButton:
                        "text-blue-400 hover:text-blue-300",
                      verificationCodeFieldInput:
                        "bg-black/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600/20 rounded-lg text-center text-lg font-mono backdrop-blur-sm",
                    },
                  }}
                  signInUrl="/sign-in"
                  redirectUrl="/"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating particles effect */}
        {/* <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-600 rounded-full"
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i * 0.5,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${80 + (i % 2) * 10}%`,
              }}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
}
