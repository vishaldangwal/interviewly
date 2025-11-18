import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Star,
  Briefcase,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const CTA = () => {
  const { user } = useUser();
  const navigate = useRouter();

  return (
    <section
      className="relative py-24 md:py-32 bg-black overflow-hidden"
      id="cta"
    >
      {/* Simple Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-600/10 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Main Card */}
        <motion.div
          className="relative bg-black/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-blue-600/30 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10 text-center">
            {/* Candidate Badge */}
            <motion.div
              className="inline-flex items-center gap-3 bg-black/60 border border-blue-600/40 rounded-full px-6 py-3 mb-8 backdrop-blur-xl shadow-lg shadow-blue-600/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Target size={18} className="text-blue-600" />
              <span className="text-sm text-blue-600 font-semibold tracking-wide">
                Land Your Dream Job
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-400 to-blue-600">
                Ace Your Interviews
              </span>
              <br />
              <span className="text-white">
                with AI-Powered Practice
                <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  and Real-time Feedback
                </span>
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
            >
              Join thousands of candidates using{" "}
              <span className="text-blue-600 font-semibold">Interviewly</span>{" "}
              to practice coding interviews, get instant feedback, and land your dream tech job. 
              Practice with real problems, improve your skills, and build confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true }}
            >
              {user == null ? (
                <SignInButton>
                  <Button
                    size="lg"
                    className="relative overflow-hidden rounded-2xl px-12 py-6 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white border-0 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 group text-lg font-semibold min-w-[200px]"
                  >
                    <span className="relative z-10 flex items-center">
                      Start Practicing
                      <Rocket size={24} className="ml-3" />
                    </span>
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  size="lg"
                  className="relative overflow-hidden rounded-2xl px-12 py-6 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 text-white border-0 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 group text-lg font-semibold min-w-[200px]"
                  onClick={() => navigate.push("/home")}
                >
                  <span className="relative z-10 flex items-center">
                    Continue Practice
                    <ArrowRight size={24} className="ml-3" />
                  </span>
                </Button>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 text-gray-400">
                <Users size={20} className="text-blue-600" />
                <span className="text-sm font-medium">
                  10K+ Candidates Hired
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Briefcase size={20} className="text-blue-600" />
                <span className="text-sm font-medium">500+ Companies</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Star size={20} className="text-blue-600" />
                <span className="text-sm font-medium">95% Success Rate</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
