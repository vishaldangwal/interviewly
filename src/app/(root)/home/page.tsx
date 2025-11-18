"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRoles } from "@/hooks/useUserRoles";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueries, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MeetingModal from "@/app/(root)/meeting/_components/MeetingModal";
import StudentMeetingCard from "@/app/(root)/home/_components/StudentMeetingCard";
import {
  getCandidateInfo,
  getInterviewerInfo,
  getInterviewStatus,
  groupInterviewsByStatus,
} from "@/lib/utils";
import MeetingCard from "@/components/MeetingCard";
import { Sparkles, Search, Calendar, Users, TrendingUp } from "lucide-react";

const Home = () => {
  const router = useRouter();
  const { isInterviewer, isCandidate, isLoading } = useUserRoles();
  const interviews = useQuery(api.interviews.getMyInterviews);
  const users = useQuery(api.users.getUsers) || [];

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("live");

  // Group interviews by status
  const groupedInterviews = useMemo(() => {
    if (!interviews) return {};
    return groupInterviewsByStatus(interviews);
  }, [interviews]);

  // Filter interviews based on search query and selected status
  const filteredInterviews = useMemo(() => {
    if (!interviews) return [];

    let filtered = interviews;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = interviews.filter(
        (interview) => getInterviewStatus(interview) === selectedStatus,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((interview) => {
        const candidateInfo = getCandidateInfo(users, interview.candidateId);
        const interviewerInfos = interview.interviewerIds?.map((id) =>
          getInterviewerInfo(users, id),
        );

        return (
          candidateInfo.name.toLowerCase().includes(query) ||
          interviewerInfos?.some((info) =>
            info.name.toLowerCase().includes(query),
          ) ||
          interview.description?.toLowerCase().includes(query) ||
          interview.title?.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [interviews, searchQuery, selectedStatus, users]);

  // Status tabs configuration
  const statusTabs = [
    {
      key: "live",
      label: "Live",
      count: groupedInterviews.live?.length || 0,
      color: "bg-orange-500",
    },
    {
      key: "upcoming",
      label: "Upcoming",
      count: groupedInterviews.upcoming?.length || 0,
      color: "bg-blue-500",
    },
    {
      key: "completed",
      label: "Completed",
      count: groupedInterviews.completed?.length || 0,
      color: "bg-gray-500",
    },
    {
      key: "passed",
      label: "Passed",
      count: groupedInterviews.passed?.length || 0,
      color: "bg-green-500",
    },
    {
      key: "failed",
      label: "Failed",
      count: groupedInterviews.failed?.length || 0,
      color: "bg-red-600",
    },
  ];

  // Animation variants with proper TypeScript types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto mt-24 flex items-center my-20 justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-t-blue-600 border-b-blue-500 border-l-blue-400 border-r-blue-300 rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/60 pb-12">
      <div className="container max-w-7xl mx-auto pt-16 px-4 sm:px-6">
        {/* Beautiful Header Section */}
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
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
              {isInterviewer ? "Manage your interviews" : "Track your progress"}
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Interview{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Dashboard
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {isInterviewer
              ? "Manage your interviews and review candidates effectively"
              : "Access your upcoming interviews and track your progress"}
          </motion.p>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                onClick={() => {
                  if (isInterviewer) {
                    router.push("/dashboard");
                  } else {
                    router.push("/prepare-interview");
                  }
                }}
              >
                {isInterviewer ? "Review Candidates" : "Prepare for Interview"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Button>
            </motion.div>

            {isCandidate && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300 gap-2"
                  onClick={() => router.push("/make-resume")}
                >
                  Create Resume
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Button>
              </motion.div>
            )}

            {!isCandidate && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                  onClick={() => router.push("/all-problems")}
                >
                  View All Problems
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-3 w-full rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Search interviews by name, description, or participants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {statusTabs.map((tab, index) => (
                <motion.button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedStatus === tab.key
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                >
                  {selectedStatus === tab.key && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                  {tab.label}
                  {tab.count > 0 && <span
                    className={`px-2 py-1 rounded-full text-xs ${tab.color} text-white`}
                  >
                    {tab.count}
                  </span>}
                </motion.button>
              ))}
            </div>

            {/* <div className="flex gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setModalType("start");
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center shadow-lg w-full md:w-auto justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Interview
              </motion.button>
            </div> */}
          </div>

          {/* Results counter */}
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Showing {filteredInterviews.length} interview
            {filteredInterviews.length !== 1 ? "s" : ""}
            {selectedStatus !== "all"
              ? ` in ${statusTabs.find((tab) => tab.key === selectedStatus)?.label}`
              : null}
            {searchQuery ? ` matching "${searchQuery}"` : null}
          </p>
        </motion.div>

        {/* Content Section */}
        <div className="mt-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {filteredInterviews && filteredInterviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredInterviews.map((interview, index) => (
                    <motion.div
                      key={interview._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover={{
                        scale: 1.03,
                        boxShadow:
                          "0 10px 25px -5px rgba(124, 58, 237, 0.1), 0 8px 10px -6px rgba(124, 58, 237, 0.1)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <MeetingCard
                        interview={interview}
                        interviewerInfos={interview.interviewerIds?.map((id) =>
                          getInterviewerInfo(users, id),
                        )}
                        candidateInfo={getCandidateInfo(
                          users,
                          interview.candidateId,
                        )}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="mt-8 p-8 rounded-xl bg-card border border-border/40 shadow-md text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-foreground">
                  No interviews found
                </h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery
                    ? `No interviews match "${searchQuery}"`
                    : selectedStatus !== "all"
                      ? `No ${selectedStatus} interviews available`
                      : "When interviews are scheduled, they will appear here"}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
