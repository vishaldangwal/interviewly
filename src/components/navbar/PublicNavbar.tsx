"use client";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AuthButtons from "@/components/AuthButtons";
import { GlassNavLink, MobileNavLink } from "@/components/navbar/NavbarComponents";

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    
    // Check if the path contains a hash for section navigation
    if (path.includes('#')) {
      const [basePath, sectionId] = path.split('#');
      
      // If we're not on the home page, first navigate to it
      if (window.location.pathname !== '/') {
        router.push('/').then(() => {
          // After navigation, try to scroll to the section
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 100); // Small delay to ensure the page has loaded
        });
      } else {
        // If we're already on the home page, just scroll
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    } else {
      router.push(path);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <div
        className={`fixed top-0  py-1.5  left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-xl shadow-2xl shadow-blue-500/10 border-b border-slate-800/50"
            : "bg-black/50 backdrop-blur-lg"
        }`}
      >
        {/* Subtle top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl mr-4 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl opacity-75 animate-pulse group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent">
                Interviewly
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <GlassNavLink text="Home" onClick={() => handleNavigation("/")} />
              <GlassNavLink
                text="Features"
                onClick={() => handleNavigation("/#features")}
              />
              <GlassNavLink
                text="How It Works"
                onClick={() => handleNavigation("/#how-it-works")}
              />
              <GlassNavLink
                text="Testimonials"
                onClick={() => handleNavigation("/#testimonials")}
              />

            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <AuthButtons />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 lg:hidden">
          <div className="bg-black/95 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-blue-500/10 m-4 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink
                text="Home"
                onClick={() => handleNavigation("/")}
              />
              <MobileNavLink
                text="Features"
                onClick={() => handleNavigation("/#features")}
              />
              <MobileNavLink
                text="How It Works"
                onClick={() => handleNavigation("/#how-it-works")}
              />
              <MobileNavLink
                text="Testimonials"
                onClick={() => handleNavigation("/#testimonials")}
              />

              <div className="pt-4 border-t border-slate-800/50 flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation("/sign-in")}
                  className="relative w-full px-4 py-3 text-left text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-lg shadow-lg border border-blue-500/30 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-pulse"></span>
                </button>
                <button
                  onClick={() => handleNavigation("/sign-up")}
                  className="relative w-full px-4 py-3 text-left text-sm font-semibold text-white bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 rounded-lg shadow-lg border border-blue-400/30 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm animate-pulse"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}