"use client";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-3">
      {/* Sign In Button - Glowing Hover */}
      <button
        onClick={() => router.push("/sign-in")}
        className="relative group px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold overflow-hidden shadow-lg transition duration-300 focus:outline-none"
      >
        <span className="relative z-10">Sign In</span>
        {/* Glowing border on hover */}
        <span className="absolute inset-0 rounded-xl border-2 border-blue-600 opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none"></span>
        {/* Inner blue glow on hover */}
        <span className="absolute inset-0 blur-lg bg-blue-600 opacity-0 group-hover:opacity-30 transition duration-300 pointer-events-none"></span>
      </button>

      {/* Sign Up Button - Text Slide Animation */}
      <button
        onClick={() => router.push("/sign-up")}
        className="relative overflow-hidden px-6 py-2 rounded-xl border border-blue-600 text-blue-600 font-semibold group bg-transparent focus:outline-none"
      >
        {/* Default text */}
        <span className="relative z-10 block transition-transform duration-500 group-hover:-translate-y-full">
          Sign Up
        </span>
        {/* Animated text slides in on hover */}
        <span className="absolute inset-0 flex items-center justify-center text-white bg-blue-600 z-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-xl">
          Get Started
        </span>
      </button>
    </div>
  );
} 