"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Code,
  PlusCircle,
  ListChecks,
  Settings,
  LucideHome,
  Bell,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import NotificationBell from "@/components/NotificationBell";
import { GlassNavLink, MobileNavLink } from "@/components/navbar/NavbarComponents";

export default function InterviewerNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    router.push(path);
  };

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
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
              <GlassNavLink
                text="Home"
                icon={<LucideHome className="w-4 h-4" />}
                onClick={() => handleNavigation("/")}
                active={isActive("/")}
              />

              <GlassNavLink
                text="Dashboard"
                icon={<ListChecks className="w-4 h-4" />}
                onClick={() => handleNavigation("/dashboard")}
                active={isActive("/dashboard")}
              />
              <GlassNavLink
                text="Create Interview"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={() => handleNavigation("/schedule")}
                active={isActive("/schedule")}
              />
              <GlassNavLink
                text="Problems"
                icon={<Code className="w-4 h-4" />}
                onClick={() => handleNavigation("/all-problems")}
                active={isActive("/all-problems")}
              />
              <GlassNavLink
                text="Post Job"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={() => handleNavigation("/post-job")}
                active={isActive("/post-job")}
              />
              <GlassNavLink
                text="Manage Jobs"
                icon={<Settings className="w-4 h-4" />}
                onClick={() => handleNavigation("/manage-jobs")}
                active={isActive("/manage-jobs")}
              />
              <GlassNavLink
                text="Activities"
                icon={<Bell className="w-4 h-4" />}
                onClick={() => handleNavigation("/admin_activities")}
                active={isActive("/admin_activities")}
              />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <NotificationBell />

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard:
                      "bg-black/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-blue-600/20",
                    userButtonPopoverActionButton:
                      "text-slate-300 hover:text-white hover:bg-blue-600/10 hover:border-blue-600/20",
                    userButtonPopoverActionButtonText:
                      "text-black-300 hover:text-white",
                    userButtonPopoverActionButtonIcon:
                      "text-slate-400 hover:text-blue-400",
                    userButtonPopoverFooter: "border-t border-slate-700/50",
                    userButtonPopoverModeButton:
                      "text-slate-300 hover:text-white hover:bg-blue-600/10",
                    userButtonPopoverAvatarBox: "border border-slate-700/50",
                    userButtonPopoverAvatarImage: "rounded-full",
                    userButtonPopoverText: "text-slate-300",
                  },
                }}
              />

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
                icon={<LucideHome className="w-4 h-4" />}
                onClick={() => handleNavigation("/")}
              />
              <MobileNavLink
                text="Dashboard"
                icon={<ListChecks className="w-4 h-4" />}
                onClick={() => handleNavigation("/dashboard")}
              />
              <MobileNavLink
                text="Create Interview"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={() => handleNavigation("/schedule")}
              />
              <MobileNavLink
                text="Problems"
                icon={<Code className="w-4 h-4" />}
                onClick={() => handleNavigation("/all-problems")}
              />
              <MobileNavLink
                text="Post Job"
                icon={<PlusCircle className="w-4 h-4" />}
                onClick={() => handleNavigation("/post-job")}
              />
              <MobileNavLink
                text="Manage Jobs"
                icon={<Settings className="w-4 h-4" />}
                onClick={() => handleNavigation("/manage-jobs")}
              />
              <MobileNavLink
                text="Activities"
                icon={<Bell className="w-4 h-4" />}
                onClick={() => handleNavigation("/admin_activities")}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 