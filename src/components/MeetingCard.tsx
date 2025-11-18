import useGetCallById from "@/hooks/useGetCallById";
import useMeetingActions from "@/hooks/useMeetingActions";
import { useUserRoles } from "@/hooks/useUserRoles";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircle,
  ChevronRight,
  Clock,
  Users,
  XCircle,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Doc } from "../../convex/_generated/dataModel";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Interview = Doc<"interviews">;

// Add these fields to the Interview type for demonstration
interface EnhancedInterview extends Interview {
  reviewStatus?: "pending" | "pass" | "fail";
}

function MeetingCard({ interview, candidateInfo, interviewerInfos = [] }) {
  const { isCandidate } = useUserRoles();
  const { joinMeeting } = useMeetingActions();
  const { call } = useGetCallById(interview.streamCallId);
  const [isRecordingAvailable, setIsRecordingAvailable] = useState(false);
  const [callRecordingUrl, setCallRecordingUrl] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const getCallRecording = async () => {
      if (!call) {
        console.error("Call not found");
        return;
      }
      try {
        const recordings = await call.queryRecordings();
        if (!recordings.recordings) {
          setIsRecordingAvailable(false);
          return;
        }
        const final_ans = recordings.recordings[0];
        if (!final_ans.url) {
          setIsRecordingAvailable(false);
          return;
        }
        setIsRecordingAvailable(true);
        setCallRecordingUrl(final_ans.url);
        return final_ans.url;
      } catch (error) {
        return null;
      }
    };
    getCallRecording();
  }, [call]);
  const status = getMeetingStatus(interview);
  // Countdown timer for upcoming interviews
  useEffect(() => {
    if (status !== "upcoming" || !interview.startTime) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const interviewTime = new Date(interview.startTime).getTime();
      const difference = interviewTime - now;

      if (difference <= 0) {
        setTimeLeft("Starting now...");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m left`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m left`);
      } else {
        setTimeLeft("Starting now...");
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [interview.startTime, status]);

  console.log("Consoling from MeetingCard.tsx about the status", status);
  const formattedDate = interview?.startTime
    ? format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a")
    : "Date not set";

  const reviewStatus = interview.status || "pending";
  useEffect(() => {}, [interview]);

  const statusVariants = {
    live: {
      badge: "bg-blue-600 text-white hover:bg-blue-700",
      text: "Live Now",
      icon: <span className="animate-pulse mr-1">●</span>,
    },
    upcoming: {
      badge:
        "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200",
      text: timeLeft || "Upcoming",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    completed: {
      badge:
        "bg-green-200 text-gray-500 border border-gray-200 hover:bg-green-300",
      text: "Completed",
      icon: <ChevronRight className="h-3 w-3 mr-1" />,
    },
  };

  const currentStatus = statusVariants[status as keyof typeof statusVariants];

  if (!interview || !interview.title) return null;

  // Helper for trimmed description
  const trimDescription = (desc, max = 80) => {
    if (!desc) return "";
    if (desc.length <= max) return desc;
    return desc.slice(0, max) + "...";
  };

  // Helper for trimmed names
  const trimName = (name, max = 15) => {
    if (!name) return "";
    if (name.length <= max) return name;
    return name.slice(0, max) + "...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="relative"
    >
      {/* Review Status Banner or Sticker */}
      {isCandidate && reviewStatus === "completed" ? (
        <div className="absolute -top-3 left-0 right-0 z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Badge className="bg-amber-500 text-white px-3 py-1 text-sm font-medium shadow-md">
              Yet to Review
            </Badge>
          </motion.div>
        </div>
      ) : (
        isCandidate &&
        reviewStatus !== "completed" &&
        reviewStatus !== "upcoming" && (
          <div className="absolute -top-4 -right-4 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 10 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              className={`flex items-center justify-center p-2 rounded-full shadow-lg ${
                reviewStatus === "succeeded"
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-red-100 border-2 border-red-500"
              }`}
            >
              {reviewStatus === "succeeded" ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
            </motion.div>
          </div>
        )
      )}

      <Card className="overflow-hidden border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 w-[400px] min-h-[420px] bg-white dark:bg-gray-950">
        <div
          className={`h-1 ${status === "live" ? "bg-blue-600" : "bg-blue-200 dark:bg-blue-600"}`}
        />
        <CardHeader className="space-y-3 pb-3">
          {/* INTERVIEW TITLE */}
          <div className="min-h-[50px] flex items-start">
            <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400 line-clamp-2">
              {interview.title}
            </CardTitle>
          </div>

          {/* Participant Section */}
          <div className="min-h-[120px]">
            <div className="flex flex-col space-y-3">
              <div>
                <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Candidate
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 ring-1 ring-blue-200 dark:ring-blue-700">
                    <AvatarImage src={candidateInfo?.image} />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs">
                      {candidateInfo?.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {candidateInfo?.name || "Student"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Interviewers
                </span>
                <div className="space-y-1">
                  {interviewerInfos && interviewerInfos.length > 0 ? (
                    interviewerInfos.map((info, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 ring-1 ring-blue-200 dark:ring-blue-700 flex-shrink-0">
                          <AvatarImage src={info.image} />
                          <AvatarFallback className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs">
                            {info.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {info.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No interviewers assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Date & Status */}
          <div className="flex items-center justify-between min-h-[35px]">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="truncate max-w-[200px]" title={formattedDate}>
                {formattedDate}
              </span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                className={`flex items-center ${currentStatus.badge} ${status === "upcoming" ? "relative" : ""}`}
              >
                {currentStatus.icon}
                {currentStatus.text}
                {status === "upcoming" && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400 opacity-20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0, 0.2],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </Badge>
            </motion.div>
          </div>

          {/* Description */}
          {interview.description && (
            <div className="min-h-[45px]">
              <CardDescription className="text-sm">
                {trimDescription(interview.description)}
                {interview.description.length > 80 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 ml-1 underline text-xs p-0 h-auto"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View full
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{interview.title}</DialogTitle>
                        <DialogDescription>
                          {interview.description}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              </CardDescription>
            </div>
          )}
        </CardHeader>

        <CardContent className="pb-4 flex flex-col space-y-3">
          {/* Participant count */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-blue-500" />
            <span>
              {interview.interviewerIds?.length || 0} interviewer
              {(interview.interviewerIds?.length || 0) !== 1 ? "s" : ""} • 1
              candidate
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex-1 flex items-end">
            {status === "live" && (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-all font-medium text-white"
                  onClick={() => joinMeeting(interview.streamCallId)}
                >
                  Join Meeting
                </Button>
              </motion.div>
            )}

            {status === "upcoming" && (
              <div className="relative w-full">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  disabled
                >
                  Waiting to Start
                </Button>
                <motion.div
                  className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-md -z-10 opacity-0"
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              </div>
            )}

            {status === "completed" && (
              <Button
                variant="outline"
                className={`w-full border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 ${isRecordingAvailable ? "text-green-500" : "hover:text-red-500"}`}
                onClick={async () => {
                  if (!callRecordingUrl)
                    return toast.error("No recording found");

                  if (isRecordingAvailable) {
                    window.open(callRecordingUrl, "_blank");
                  }
                }}
              >
                {isRecordingAvailable ? (
                  <span className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Recording Available
                  </span>
                ) : (
                  <span className="flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    Recording Not Available
                  </span>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MeetingCard;
