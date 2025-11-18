"use client";

import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Code,
  BookOpen,
  Users,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900/50 to-black" />

        {/* Animated Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
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
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-16 pb-8 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto">
       
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
                Welcome back to your journey
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
              Sign In to{" "}
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
              Continue your interview preparation journey with personalized
              practice and AI-powered insights.
            </motion.p>
          </div>

          <div className="flex items-center justify-center">
            {/* Left Side - Content */}

            {/* Right Side - Sign In Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-8 shadow-2xl">
                <SignIn
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none p-0",
                      headerTitle: "text-white text-2xl font-bold mb-2",
                      headerSubtitle: "text-slate-400 text-base",
                      formButtonPrimary:
                        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105",
                      formFieldInput:
                        "bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl py-3 px-4 transition-all duration-200",
                      formFieldLabel: "text-slate-300 font-medium mb-2",
                      dividerLine: "bg-slate-700",
                      dividerText: "text-slate-400 bg-slate-900/50",
                      socialButtonsBlockButton:
                        "bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-700/50 transition-all duration-200 rounded-xl py-3",
                      socialButtonsBlockButtonText: "text-white font-medium",
                      formFieldAction:
                        "text-blue-400 hover:text-blue-300 font-medium transition-colors",
                      footerAction: "text-slate-400 text-center",
                      footerActionLink:
                        "text-blue-400 hover:text-blue-300 font-semibold transition-colors",
                      formFieldError: "text-red-400 text-sm",
                      footer: "hidden",
                      formFieldErrorText: "text-red-400",
                      identityPreviewText: "text-slate-300",
                      identityPreviewEditButton:
                        "text-blue-400 hover:text-blue-300",
                      verificationCodeFieldInput:
                        "bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-center text-lg font-mono py-3",
                    },
                  }}
                  signUpUrl="/sign-up"
                  redirectUrl="/"
                />
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
