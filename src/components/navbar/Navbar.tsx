"use client";
import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useUserRoles } from "@/hooks/useUserRoles";
import PublicNavbar from "@/components/navbar/PublicNavbar";
import CandidateNavbar from "@/components/navbar/CandidateNavbar";
import InterviewerNavbar from "@/components/navbar/InterviewerNavbar";

// Main Navbar Component with conditional rendering
export default function InterviewlyNavbar() {
  const { isInterviewer, isCandidate, isLoading } = useUserRoles();

  // Show loading state while determining user role
  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl mr-4 animate-pulse"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent">
                Interviewly
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <PublicNavbar />
      </SignedOut>
      
      <SignedIn>
        {isCandidate && <CandidateNavbar />}
        {isInterviewer && <InterviewerNavbar />}
      </SignedIn>
    </>
  );
} 