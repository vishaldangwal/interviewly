"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "./_components/CommentDialog";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import ActionCard from "@/components/ActionCard";
import MeetingModal from "../../(root)/meeting/_components/MeetingModal";
import { QUICK_ACTIONS } from "@/constants";
import { useRouter } from "next/navigation";
type Interview = Doc<"interviews">; 

function customGroupInterviews(interviews: Interview[]) {
  if (!interviews) return {};
  return interviews.reduce((acc: any, interview: Interview) => {
    // const date = new Date(interview.startTime);
    // const now = new Date();
     if (interview.status === "succeeded") {
      acc.succeeded = [...(acc.succeeded || []), interview];
    } else if (interview.status === "failed") {
      acc.failed = [...(acc.failed || []), interview];
    } else if (interview.status === "completed") {
      acc.stillToReview = [...(acc.stillToReview || []), interview];
    } else {
      acc.upcoming = [...(acc.upcoming || []), interview];
    }
    return acc;
  }, {});
}

function DashboardPage() {
  const { theme } = useTheme();
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  // Theme2 config from flashcard page
  const theme2 = {
    dark: {
      bg: "",
      text: { primary: "text-white", secondary: "text-blue-200" },
    },
    light: {
      bg: "",
      text: { primary: "text-gray-900", secondary: "text-blue-600" },
    },
  };
  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();
  const [expandPassed, setExpandPassed] = useState(false);
  const [expandFailed, setExpandFailed] = useState(false);
  const router = useRouter();
  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);

    }
  };
  const handleStatusUpdate = async (
    interviewId: Id<"interviews">,
    status: string,
  ) => {
    try {
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`, {
        style: {
          background: theme === "dark" ? "#1e1e2e" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1e1e2e",
          border: "1px solid #9333ea",
        },
      });
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = customGroupInterviews(interviews);

  return (
    <div className={`mt-16 ${currenttheme2.bg} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Flashcard-style Header */}
        <div className="relative  flex flex-col items-center justify-center mb-12 mt-4">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-400"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              <div className="absolute inset-0 animate-ping">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-400 opacity-20"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Interview Management
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          {/* Title */}
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
            Manage and review all interviews in one place.
          </motion.p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 mb-12"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
              <span className="h-6 w-1.5 bg-blue-600 rounded-full mr-3"></span>
              Quick Actions
            </h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {QUICK_ACTIONS.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemVariants}
                custom={index}
              >
                <ActionCard
                  action={action}
                  onClick={() => handleQuickAction(action.title)}
                />
              </motion.div>
            ))}
          </motion.div>
          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </motion.div>

        {/* Status Update Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 p-6 mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 dark:from-blue-400/5 dark:to-indigo-400/5" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Automatic Status Updates
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Meeting statuses are automatically updated every 30 minutes to ensure real-time accuracy. 
                Our intelligent system monitors interview progress and updates completion status without manual intervention.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Old header replaced, rest of dashboard below */}
        <div className="space-y-12">
          {/* UPCOMING */}
          {groupedInterviews.upcoming?.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="border-l-4 pl-4 border-blue-500 dark:border-blue-400"
            >
              <motion.div className="flex items-center gap-2 mb-6" variants={itemVariants}>
                <h2 className="text-2xl font-semibold">Upcoming Interviews</h2>
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  {groupedInterviews.upcoming.length}
                </Badge>
              </motion.div>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                {groupedInterviews.upcoming.map((interview: Interview, idx: number) => {
                  const candidateInfo = getCandidateInfo(users, interview.candidateId);
                  const startTime = new Date(interview.startTime);
                  const now = new Date();
                  // Assume 1 hour duration for interview
                  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
                  const isMeetingAvailable = now >= startTime;
                  const isLive = now >= startTime && now <= endTime;
                  return (
                    <motion.div key={interview._id} variants={itemVariants} whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}>
                      <Card className={`overflow-hidden border shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl bg-white dark:bg-blue-950/40 
                        ${isLive ? 'border-green-400 dark:border-green-500 ring-2 ring-green-300/40' : 'border-blue-200 dark:border-blue-900'}`}
                      >
                        <div className={`h-2 ${isLive ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} />
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                              <Avatar className={`h-12 w-12 ring-2 ${isLive ? 'ring-green-300 dark:ring-green-500' : 'ring-blue-300 dark:ring-blue-600'}`}>
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback className={`${isLive ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200'}`}>
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                            <div>
                              <CardTitle className="text-lg font-bold flex items-center gap-2">
                                {candidateInfo.name}
                                {isLive && (
                                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white animate-pulse">Live</span>
                                )}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground font-medium">{interview.title}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className={`p-4 ${isLive ? 'bg-green-50 dark:bg-green-950/30' : 'bg-blue-50 dark:bg-blue-950/30'}`}>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className={`h-4 w-4 ${isLive ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                              <span>{format(startTime, "MMM dd")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className={`h-4 w-4 ${isLive ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                              <span>{format(startTime, "hh:mm a")}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-4 flex flex-col gap-3">
                          <div className="w-full mb-2">
                            <Link href={isMeetingAvailable ? `/meeting/${interview.streamCallId}` : "#"} passHref legacyBehavior>
                              <Button
                                className={`w-full ${isLive ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                disabled={!isMeetingAvailable}
                                title={isMeetingAvailable ? "Join Meeting" : `Available at ${format(startTime, "hh:mm a")}`}
                              >
                                {isLive ? 'Join Live' : (isMeetingAvailable ? "Go to Meeting" : `Available at ${format(startTime, "hh:mm a")}`)}
                              </Button>
                            </Link>
                          </div>
                          <CommentDialog interviewId={interview._id} />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.section>
          )}
          {/* STILL TO REVIEW */}
          {groupedInterviews.stillToReview?.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="border-l-4 pl-4 border-gray-400 dark:border-blue-400"
            >
              <motion.div className="flex items-center gap-2 mb-6" variants={itemVariants}>
                <h2 className="text-2xl font-semibold">Still to Review</h2>
                <Badge className="bg-gray-600 hover:bg-blue-700">
                  {groupedInterviews.stillToReview.length}
                </Badge>
              </motion.div>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                {groupedInterviews.stillToReview.map((interview: Interview, idx: number) => {
                  const candidateInfo = getCandidateInfo(users, interview.candidateId);
                  const startTime = new Date(interview.startTime);
                  return (
                    <motion.div key={interview._id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                      <Card className="overflow-hidden border border-gray-200 dark:border-blue-900 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl bg-white dark:bg-blue-950/40">
                        <div className="h-2 bg-gradient-to-r from-gray-400 to-blue-600" />
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-gray-300 dark:ring-blue-600">
                              <AvatarImage src={candidateInfo.image} />
                              <AvatarFallback className="bg-gray-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                                {candidateInfo.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg font-bold">{candidateInfo.name}</CardTitle>
                              <p className="text-sm text-muted-foreground font-medium">{interview.title}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 bg-gray-50 dark:bg-blue-950/30">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span>{format(startTime, "MMM dd")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <span>{format(startTime, "hh:mm a")}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-4 flex flex-col gap-3">
                          <motion.div className="flex gap-3 w-full">
                            <motion.div className="flex-1" whileHover="hover" whileTap="tap" variants={buttonVariants}>
                              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(interview._id, "succeeded")}> <CheckCircle2Icon className="h-4 w-4 mr-2" /> Pass </Button>
                            </motion.div>
                            <motion.div className="flex-1" whileHover="hover" whileTap="tap" variants={buttonVariants}>
                              <Button variant="destructive" className="w-full" onClick={() => handleStatusUpdate(interview._id, "failed")}> <XCircleIcon className="h-4 w-4 mr-2" /> Fail </Button>
                            </motion.div>
                          </motion.div>
                          <CommentDialog interviewId={interview._id} />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.section>
          )}
          {/* PASSED (COLLAPSIBLE) */}
          {groupedInterviews.succeeded?.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="border-l-4 pl-4 border-green-500 dark:border-green-400"
            >
              <motion.div className="flex items-center gap-2 mb-6" variants={itemVariants}>
                <h2 className="text-2xl font-semibold">Passed</h2>
                <Badge className="bg-green-600 hover:bg-green-700">{groupedInterviews.succeeded.length}</Badge>
                <Button size="sm" variant="outline" className="ml-2" onClick={() => setExpandPassed((v) => !v)}>
                  {expandPassed ? "Collapse" : "Expand"}
                </Button>
              </motion.div>
              {expandPassed && (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                  {groupedInterviews.succeeded.map((interview: Interview, idx: number) => {
                    const candidateInfo = getCandidateInfo(users, interview.candidateId);
                    const startTime = new Date(interview.startTime);
                    return (
                      <motion.div key={interview._id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <Card className="overflow-hidden border border-green-200 dark:border-green-900 shadow-md">
                          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" />
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 ring-2 ring-green-300 dark:ring-green-600">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200">
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg font-bold">{candidateInfo.name}</CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">{interview.title}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 bg-green-50 dark:bg-green-950/30">
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span>{format(startTime, "MMM dd")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span>{format(startTime, "hh:mm a")}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-4 flex flex-col gap-3">
                            <CommentDialog interviewId={interview._id} />
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.section>
          )}
          {/* FAILED (COLLAPSIBLE) */}
          {groupedInterviews.failed?.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="border-l-4 pl-4 border-red-500 dark:border-red-400"
            >
              <motion.div className="flex items-center gap-2 mb-6" variants={itemVariants}>
                <h2 className="text-2xl font-semibold">Failed</h2>
                <Badge className="bg-red-600 hover:bg-red-700">{groupedInterviews.failed.length}</Badge>
                <Button size="sm" variant="outline" className="ml-2" onClick={() => setExpandFailed((v) => !v)}>
                  {expandFailed ? "Collapse" : "Expand"}
                </Button>
              </motion.div>
              {expandFailed && (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants}>
                  {groupedInterviews.failed.map((interview: Interview, idx: number) => {
                    const candidateInfo = getCandidateInfo(users, interview.candidateId);
                    const startTime = new Date(interview.startTime);
                    return (
                      <motion.div key={interview._id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <Card className="overflow-hidden border border-red-200 dark:border-red-900 shadow-md">
                          <div className="h-2 bg-gradient-to-r from-red-400 to-red-600" />
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 ring-2 ring-red-300 dark:ring-red-600">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200">
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg font-bold">{candidateInfo.name}</CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">{interview.title}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 bg-red-50 dark:bg-red-950/30">
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span>{format(startTime, "MMM dd")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <span>{format(startTime, "hh:mm a")}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-4 flex flex-col gap-3">
                            <CommentDialog interviewId={interview._id} />
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
