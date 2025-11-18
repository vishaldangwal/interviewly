import MeetingCard from "@/components/MeetingCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TIME_SLOTS } from "@/constants";
import {
  cn,
  getCandidateInfo,
  getInterviewerInfo,
  groupInterviews,
} from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import axios from "axios";
import { useMutation as useConvexMutation, useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  Clock,
  Loader2Icon,
  PlusCircleIcon,
  // CalendarIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, api as convexApi } from "../../../../../convex/_generated/api";
import { getTargetForType } from "../../../../../convex/activities";
import UserInfo from "../../../../components/UserInfo";

// Component to display problem info
const ProblemInfo = ({ problem }) => (
  <div className="flex items-center gap-1">
    <span className="font-medium">{problem.number}.</span>
    <span>{problem.title}</span>
    <span
      className={`text-xs px-1.5 py-0.5 rounded ${
        problem.difficulty === "Easy"
          ? "bg-green-100 text-green-800"
          : problem.difficulty === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800"
      }`}
    >
      {problem.difficulty}
    </span>
  </div>
);
function InterviewScheduleUI() {
  const client = useStreamVideoClient();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);
  const questions = useQuery(api.questions.getAllQuestions) ?? [];
  const candidates = users?.filter((u) => u.role === "candidate");
  const interviewers = users?.filter((u) => u.role === "interviewer");

  // Get current time and set default time to next available slot
  const getDefaultTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Find next available time slot
    for (const timeSlot of TIME_SLOTS) {
      const [hours, minutes] = timeSlot.split(":").map(Number);
      if (
        hours > currentHour ||
        (hours === currentHour && minutes > currentMinute)
      ) {
        return timeSlot;
      }
    }
    return TIME_SLOTS[0]; // Default to first slot if all are past
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: getDefaultTime(),
    endTime: "", // New field for end time
    candidateId: "",
    interviewerIds: user?.id ? [user.id] : [],
    questionId: [],
  });

  // Calculate end time options based on start time
  const getEndTimeOptions = (startTime: string) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date(formData.date);
    startDate.setHours(hours, minutes, 0, 0);

    return [
      {
        label: "1 hour",
        value: new Date(
          startDate.getTime() + 60 * 60 * 1000,
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
      {
        label: "1.5 hours",
        value: new Date(
          startDate.getTime() + 90 * 60 * 1000,
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
      {
        label: "2 hours",
        value: new Date(
          startDate.getTime() + 120 * 60 * 1000,
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
      {
        label: "3 hours",
        value: new Date(
          startDate.getTime() + 180 * 60 * 1000,
        ).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      },
    ];
  };

  // Update end time when start time changes
  useEffect(() => {
    if (formData.time && !formData.endTime) {
      const endOptions = getEndTimeOptions(formData.time);
      setFormData((prev) => ({ ...prev, endTime: endOptions[0].value }));
    }
  }, [formData.time, formData.date]);

  useEffect(() => {
    //console.log(formData);
  }, [formData]);

  // Check for localStorage data when component mounts
  useEffect(() => {
    const savedInterviewData = localStorage.getItem("scheduledInterviewData");
    if (savedInterviewData) {
      try {
        const data = JSON.parse(savedInterviewData);

        // Check if data is not too old (24 hours)
        const isDataValid = Date.now() - data.timestamp < 24 * 60 * 60 * 1000;

        if (isDataValid && data.candidateId) {
          // Auto-fill the form with saved data
          setFormData((prev) => ({
            ...prev,
            title: `Interview for ${data.jobTitle} at ${data.jobCompany}`,
            description: `Interview for the ${data.jobTitle} position at ${data.jobCompany}. ${data.jobDescription ? `\n\nJob Description: ${data.jobDescription.substring(0, 200)}...` : ""}`,
            candidateId: data.candidateId,
          }));

          // Auto-open the dialog
          setOpen(true);

          // Clear the localStorage data
          localStorage.removeItem("scheduledInterviewData");

          toast.success(`Auto-filled interview form for ${data.candidateName}`);
        } else {
          // Clear invalid or old data
          localStorage.removeItem("scheduledInterviewData");
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        localStorage.removeItem("scheduledInterviewData");
      }
    }

    // Cleanup function to clear localStorage when component unmounts
    return () => {
      localStorage.removeItem("scheduledInterviewData");
    };
  }, []);
  const router = useRouter();
  const createActivity = useConvexMutation(convexApi.activities.createActivity);
  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if (!formData.candidateId || formData.interviewerIds.length === 0) {
      toast.error("Please select both candidate and at least one interviewer");
      return;
    }
    if (!formData.endTime) {
      toast.error("Please select an end time");
      return;
    }

    setIsCreating(true);

    try {
      const {
        title,
        description,
        date,
        time,
        endTime,
        candidateId,
        interviewerIds,
      } = formData;
      //check if the time is in the past and give toast that it is not possible
      const currentTime = new Date();
      const meetingTime = new Date(date);
      meetingTime.setHours(
        parseInt(time.split(":")[0]),
        parseInt(time.split(":")[1]),
        0,
      );
      if (meetingTime < currentTime) {
        toast.error("Cannot schedule an interview in the past");

        return;
      }
      const [hours, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: meetingDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });
      const user2 = users.find((u) => u.clerkId === user?.id);
      await createInterview({
        title,
        description,
        startTime: meetingDate.getTime(),
        status: "upcoming",
        streamCallId: id,
        candidateId,
        interviewerIds,
        questions: formData.questionId,
      });
      const emailResponse = await axios.post("/api/send-email", {
        name: user2?.name,
        title,
        email: user2?.email,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime,
        type: "Video Interview",
      });
      if (emailResponse.data.success) {
        toast.success("Mail Sent Successfully");
      } else {
        toast.error("Failed to Send Mail!. Check your internet connection");
      }
      // Create activity for candidate
      await createActivity({
        type: "meeting_scheduled",
        target: getTargetForType("meeting_scheduled"),
        title: "Interview Scheduled",
        description: `Your interview for '${title}' has been scheduled on ${meetingDate.toLocaleString()}`,
        userId: candidateId,
        relatedUserId: user.id,
        metadata: {
          jobTitle: title,
          notes: description,
        },
      });
      setOpen(false);
      toast.success("Meeting scheduled successfully!");

      // Clear any remaining localStorage data
      localStorage.removeItem("scheduledInterviewData");

      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: getDefaultTime(),
        endTime: "",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
        questionId: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const availableProblems = questions.filter(
    (problem) => !formData.questionId.includes(problem.q_id),
  );

  const addProblem = (problemId) => {
    if (!formData.questionId.includes(problemId)) {
      setFormData((prev) => ({
        ...prev,
        questionId: [...prev.questionId, problemId],
      }));
    }
  };
  const selectedProblems = questions.filter((p) =>
    formData.questionId.includes(p.q_id),
  );
  const removeProblem = (problemId) => {
    setFormData((prev) => ({
      ...prev,
      questionId: prev.questionId.filter((q_id) => q_id !== problemId),
    }));
  };

  const addInterviewer = (interviewerId: string) => {
    if (!formData.interviewerIds.includes(interviewerId)) {
      setFormData((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, interviewerId],
      }));
    }
  };

  const removeInterviewer = (interviewerId: string) => {
    if (interviewerId === user?.id) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
    }));
  };

  const selectedInterviewers = interviewers.filter((i) =>
    formData.interviewerIds.includes(i.clerkId),
  );

  const availableInterviewers = interviewers.filter(
    (i) => !formData.interviewerIds.includes(i.clerkId),
  );

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
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  const { theme } = useTheme();

  // Group interviews by status
  const grouped = groupInterviews(interviews);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  // Tab state for interview groups
  const tabOptions = [
    { key: "live", label: "Live" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Past" },
  ];
  // Default to 'Live' if any, else 'Upcoming'
  const defaultTab =
    grouped.live && grouped.live.length > 0 ? "live" : "upcoming";
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  // Keep tab in sync if live interviews appear/disappear
  useEffect(() => {
    if (grouped.live && grouped.live.length > 0) setSelectedTab("live");
    else if (selectedTab === "live") setSelectedTab("upcoming");
  }, [grouped.live?.length]);

  // Wizard step state
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  
  // Validation function for step 1
  const isStep1Valid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.candidateId !== "" &&
      formData.date &&
      formData.time &&
      formData.endTime
    );
  };
  
  // Get validation errors for step 1
  const getStep1Errors = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push("Title");
    if (!formData.candidateId) errors.push("Candidate");
    if (!formData.date) errors.push("Date");
    if (!formData.time) errors.push("Start Time");
    if (!formData.endTime) errors.push("End Time");
    return errors;
  };
  
  const goNext = () => {
    if (step === 1 && !isStep1Valid()) {
      const errors = getStep1Errors();
      toast.error(`Please fill in: ${errors.join(", ")}`);
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const goBack = () => setStep((s) => Math.max(s - 1, 1));
  const resetWizard = () => setStep(1);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8 bg-background mt-20">
      {/* ENHANCED HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center justify-center mb-16"
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
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
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Manage & Schedule{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Interviews
          </span>
        </motion.h1>
        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Organize, schedule, and track interviews with ease. Empower your
          hiring process with a seamless experience.
        </motion.p>
        {/* Schedule Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => {
              setOpen(true);
              resetWizard();
            }}
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Schedule Interview
          </Button>
        </motion.div>
      </motion.div>
      {/* SCHEDULE DIALOG (WIZARD) */}
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) {
            // Clear localStorage when dialog is closed
            localStorage.removeItem("scheduledInterviewData");
            resetWizard();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] h-[calc(100vh-200px)] overflow-auto border-blue-200 dark:border-blue-600 p-6">
          <DialogHeader className="pb-4">
            {/* <DialogTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">
              Schedule Interview
            </DialogTitle> */}
          </DialogHeader>
          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-200 ${step === s ? "bg-blue-600 text-white border-blue-600 scale-110" : "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300"}`}
                >
                  {s}
                </div>
                {s !== 2 && (
                  <div className="w-10 h-1 bg-blue-200 dark:bg-blue-700 mx-2 rounded" />
                )}
              </div>
            ))}
          </div>
          {/* Wizard Steps */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div className="space-y-6 pb-4">
                {/* INTERVIEW TITLE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Interview title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`border-blue-200 focus:border-blue-400 focus:ring-blue-400 ${
                      step === 1 && !formData.title.trim() ? "border-red-300 focus:border-red-400 focus:ring-red-400" : ""
                    }`}
                  />
                </div>
                {/* INTERVIEW DESC */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Interview description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 "
                  />
                </div>
                {/* CANDIDATE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Candidate<span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.candidateId}
                    onValueChange={(candidateId) =>
                      setFormData({ ...formData, candidateId })
                    }
                  >
                    <SelectTrigger className={`border-blue-200 focus:ring-blue-400 ${
                      step === 1 && !formData.candidateId ? "border-red-300 focus:ring-red-400" : ""
                    }`}>
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((candidate) => (
                        <SelectItem
                          key={candidate.clerkId}
                          value={candidate.clerkId}
                        >
                          <UserInfo user={candidate} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* DATE AND TIME SECTION */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Date & Time<span className="text-red-500">*</span>
                  </label>

                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400">
                      Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30",
                            !formData.date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date ? (
                            format(formData.date, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date}
                          onSelect={(date) =>
                            date && setFormData({ ...formData, date })
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-gray-600 dark:text-gray-400">
                        Start Time
                      </label>
                      <Select
                        value={formData.time}
                        onValueChange={(time) =>
                          setFormData({ ...formData, time })
                        }
                      >
                        <SelectTrigger className={`border-blue-200 focus:ring-blue-400 ${
                          step === 1 && !formData.time ? "border-red-300 focus:ring-red-400" : ""
                        }`}>
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-600 dark:text-gray-400">
                        End Time
                      </label>
                      <Select
                        value={formData.endTime}
                        onValueChange={(endTime) =>
                          setFormData({ ...formData, endTime })
                        }
                      >
                        <SelectTrigger className={`border-blue-200 focus:ring-blue-400 ${
                          step === 1 && !formData.endTime ? "border-red-300 focus:ring-red-400" : ""
                        }`}>
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {getEndTimeOptions(formData.time).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.value} ({option.label})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Duration Display */}
                  {formData.time && formData.endTime && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                      Duration:{" "}
                      {(() => {
                        const [startHours, startMinutes] = formData.time
                          .split(":")
                          .map(Number);
                        const [endHours, endMinutes] = formData.endTime
                          .split(":")
                          .map(Number);
                        const startTotal = startHours * 60 + startMinutes;
                        const endTotal = endHours * 60 + endMinutes;
                        const durationMinutes = endTotal - startTotal;
                        const hours = Math.floor(durationMinutes / 60);
                        const minutes = durationMinutes % 60;
                        return `${hours}h ${minutes}m`;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6 pb-4">
                {/* PROBLEMS */}
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">
                    Problems<span className="text-red-500">*</span>
                  </label>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 transition-all font-medium text-white p-2"
                    onClick={() => router.push("/create-problem")}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    Create
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="border border-blue-200 rounded-md p-3 min-h-24 flex flex-wrap gap-2 mb-2">
                    {selectedProblems.length > 0 ? (
                      selectedProblems.map((problem) => (
                        <motion.div
                          key={problem.q_id}
                          className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-md text-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ProblemInfo problem={problem} />
                          <motion.button
                            onClick={() => removeProblem(problem.q_id)}
                            className="hover:text-destructive transition-colors"
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <XIcon className="h-4 w-4" />
                          </motion.button>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No Problems selected
                      </p>
                    )}
                  </div>
                  {/* Add Problems Dropdown */}
                  {availableProblems.length > 0 && (
                    <Select onValueChange={addProblem}>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-400">
                        <SelectValue placeholder="Add problem" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProblems.map((problem) => (
                          <SelectItem key={problem.q_id} value={problem.q_id}>
                            <ProblemInfo problem={problem} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {/* INTERVIEWERS */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Interviewer<span className="text-red-500">*</span>
                  </label>
                  {/* Selected Interviewers */}
                  <div className="border border-blue-200 rounded-md p-3 min-h-24 flex flex-wrap gap-2 mb-2">
                    {selectedInterviewers.length > 0 ? (
                      selectedInterviewers.map((interviewer) => (
                        <motion.div
                          key={interviewer.clerkId}
                          className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-md text-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <UserInfo user={interviewer} />
                          {interviewer.clerkId !== user?.id && (
                            <motion.button
                              onClick={() =>
                                removeInterviewer(interviewer.clerkId)
                              }
                              className="hover:text-destructive transition-colors"
                              whileHover={{ rotate: 90 }}
                              transition={{ duration: 0.2 }}
                            >
                              <XIcon className="h-4 w-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No interviewers selected
                      </p>
                    )}
                  </div>
                  {/* Add Interviewers Dropdown */}
                  {availableInterviewers.length > 0 && (
                    <Select onValueChange={addInterviewer}>
                      <SelectTrigger className="border-blue-200 focus:ring-blue-400 ">
                        <SelectValue placeholder="Add interviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInterviewers.map((interviewer) => (
                          <SelectItem
                            key={interviewer.clerkId}
                            value={interviewer.clerkId}
                          >
                            <UserInfo user={interviewer} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            )}
            {/* ACTION BUTTONS */}
            <div className="flex justify-between gap-3 pt-6 border-t border-blue-100 dark:border-blue-900/50">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    if (step === 1) setOpen(false);
                    else goBack();
                  }}
                  className="border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:hover:bg-blue-900/30"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </Button>
              </motion.div>
              {step < totalSteps && (
                <motion.div
                  whileHover={{ scale: step === 1 && !isStep1Valid() ? 1 : 1.05 }}
                  whileTap={{ scale: step === 1 && !isStep1Valid() ? 1 : 0.95 }}
                >
                  <Button
                    onClick={goNext}
                    disabled={step === 1 && !isStep1Valid()}
                    className={`${
                      step === 1 && !isStep1Valid()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                  >
                    Next
                  </Button>
                </motion.div>
              )}
              {step === totalSteps && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={scheduleMeeting}
                    disabled={isCreating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isCreating ? (
                      <>
                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      "Schedule Interview"
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
      {/* TABS FOR INTERVIEW GROUPS */}
      <div className="flex justify-center gap-4 mb-8">
        {tabOptions.map((tab) => {
          const isActive = selectedTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-all border-2 focus:outline-none
                ${
                  isActive
                    ? tab.key === "live"
                      ? "bg-green-600 text-white border-green-600 shadow-lg scale-105"
                      : tab.key === "upcoming"
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                        : "bg-gray-500 text-white border-gray-500 shadow-lg scale-105"
                    : "bg-background text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
              style={{ minWidth: 120 }}
            >
              {tab.label}
              {tab.key === "live" &&
                grouped.live &&
                grouped.live.length > 0 && (
                  <span className="ml-2 inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                )}
              {tab.key === "upcoming" &&
                grouped.upcoming &&
                grouped.upcoming.length > 0 && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {grouped.upcoming.length}
                  </span>
                )}
              {tab.key === "completed" &&
                grouped.completed &&
                grouped.completed.length > 0 && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {grouped.completed.length}
                  </span>
                )}
            </button>
          );
        })}
      </div>
      {/* INTERVIEW GROUPS (TABBED) */}
      <div className="space-y-12">
        {/* UPCOMING */}
        {selectedTab === "upcoming" &&
          grouped.upcoming &&
          grouped.upcoming.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="border-l-4 pl-4 border-blue-500 dark:border-blue-400"
            >
              <motion.div
                className="flex items-center gap-2 mb-6"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold">Upcoming Interviews</h2>
                <Badge className="bg-blue-600 hover:bg-blue-700">
                  {grouped.upcoming.length}
                </Badge>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {grouped.upcoming.map((interview, idx) => (
                  <MeetingCard
                    key={interview._id}
                    interview={interview}
                    candidateInfo={getCandidateInfo(
                      users,
                      interview.candidateId,
                    )}
                    interviewerInfos={interview.interviewerIds?.map((id) =>
                      getInterviewerInfo(users, id),
                    )}
                  />
                ))}
              </motion.div>
            </motion.section>
          )}
        {/* LIVE (if any) */}
        {selectedTab === "live" && grouped.live && grouped.live.length > 0 && (
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="border-l-4 pl-4 border-green-500 dark:border-green-400"
          >
            <motion.div
              className="flex items-center gap-2 mb-6"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold">Live Interviews</h2>
              <Badge className="bg-green-600 hover:bg-green-700">
                {grouped.live.length}
              </Badge>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {grouped.live.map((interview, idx) => (
                <MeetingCard
                  key={interview._id}
                  interview={interview}
                  candidateInfo={getCandidateInfo(users, interview.candidateId)}
                  interviewerInfos={interview.interviewerIds?.map((id) =>
                    getInterviewerInfo(users, id),
                  )}
                />
              ))}
            </motion.div>
          </motion.section>
        )}
        {/* COMPLETED/PAST */}
        {selectedTab === "completed" &&
          grouped.completed &&
          grouped.completed.length > 0 && (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="border-l-4 pl-4 border-gray-400 dark:border-gray-600"
            >
              <motion.div
                className="flex items-center gap-2 mb-6"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold">Past Interviews</h2>
                <Badge className="bg-gray-400 hover:bg-gray-600">
                  {grouped.completed.length}
                </Badge>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
              >
                {(showAllCompleted
                  ? grouped.completed
                  : grouped.completed.slice(0, 6)
                ).map((interview, idx) => (
                  <MeetingCard
                    key={interview._id}
                    interview={interview}
                    candidateInfo={getCandidateInfo(
                      users,
                      interview.candidateId,
                    )}
                    interviewerInfos={interview.interviewerIds?.map((id) =>
                      getInterviewerInfo(users, id),
                    )}
                  />
                ))}
              </motion.div>
              {grouped.completed.length > 6 && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllCompleted((v) => !v)}
                    className="border-blue-200 dark:border-blue-900"
                  >
                    {showAllCompleted
                      ? "Show Less"
                      : `Show All (${grouped.completed.length})`}
                  </Button>
                </div>
              )}
            </motion.section>
          )}
        {/* EMPTY STATE */}
        {((selectedTab === "upcoming" &&
          (!grouped.upcoming || grouped.upcoming.length === 0)) ||
          (selectedTab === "live" &&
            (!grouped.live || grouped.live.length === 0)) ||
          (selectedTab === "completed" &&
            (!grouped.completed || grouped.completed.length === 0))) && (
          <div className="text-center text-gray-400 py-16 text-lg font-semibold">
            No interviews found for this tab.
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewScheduleUI;
