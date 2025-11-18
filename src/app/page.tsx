"use client";

import CTA from "@/components/landing/CTA";
import InterviewlyFeatures from "@/components/landing/Features";
import HeroSection from "@/components/landing/HeroSection";
import HowInterviewlyWorks from "@/components/landing/HowItWorks";
import LandingPart from "@/components/landing/LandingPart";
import TestimonialSection from "@/components/landing/Testimonials";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Shield, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TrustedCompanies from "../components/landing/TrustedCompanies";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden w-full">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 "></div>
      </div>

      <HeroSection />

      <div className="relative z-10 bg-transparent" />

      {/* Enhanced Scroll Indicator */}

      {/* Enhanced Hero Section */}
      <div className="relative z-10 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-sm min-h-screen  ">
        <LandingPart />

        <TrustedCompanies />

        <InterviewlyFeatures />

        <HowInterviewlyWorks />

        <TestimonialSection />

        <CTA />

        <Footer />
      </div>
    </div>
  );
}
