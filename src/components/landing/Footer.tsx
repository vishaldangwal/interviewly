import React from "react";
import { Button } from "../ui/button";
import { Star } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-slate-800/50 pt-20 pb-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/20 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl mr-4 shadow-lg shadow-blue-500/25"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-75 animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Interviewly
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Revolutionizing technical interviews with AI-powered insights and
              seamless collaboration. Experience the future of hiring.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 rounded-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 rounded-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 rounded-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg mb-4 relative">
              Product
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Integrations", "API", "Analytics"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg mb-4 relative">
              Company
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-blue-700"></div>
            </h3>
            <ul className="space-y-3">
              {["About", "Careers", "Blog", "Contact", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-lg mb-4 relative">
              Support
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-700 to-blue-800"></div>
            </h3>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Documentation",
                "Privacy Policy",
                "Terms of Service",
                "Status",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800/50 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <p className="text-slate-400 text-sm">
                © 2024 Interviewly. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-slate-500">•</span>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Privacy
                </a>
                <span className="text-slate-500">•</span>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white text-sm transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/50">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm font-medium">
                  SOC 2 Compliant
                </span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800/50">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-slate-400 text-sm font-medium">
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-blue-500 rounded-full opacity-60 animate-ping"></div>
      <div className="absolute bottom-20 left-20 w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-600 rounded-full opacity-50 animate-bounce"></div>
    </footer>
  );
};

export default Footer;
