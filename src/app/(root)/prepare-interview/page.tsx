"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  AlertCircle,
  ArrowDownIcon,
  BookOpen,
  Calendar,
  Loader,
  CheckCircle,
  Code,
  Database,
  Layers,
  Lightbulb,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Target,
  Clock,
  User,
  ArrowLeft,
  Cloud,
  HardDrive,
} from "lucide-react";
import { set } from "date-fns";
import toast from "react-hot-toast";
import PreparedPlan from "./_components/PreparedPlan";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Timeline } from "./_components/Timeline";

interface StudyPlanDay {
  day: number;
  topics?: Array<{
    topic: string;
    hours_allocated: number;
    focus_area: string;
    notes?: string;
  }>;
  notes?: string;
}

interface SavedStudyPlan {
  jobTitle: string;
  companyName: string;
  jobLevel: string;
  userSkills: string[];
  requiredSkills: string[];
  prepDays: number;
  hoursPerDay: number;
  studyPlan: StudyPlanDay[];
  planGenerated: boolean;
  currentStep: number;
  timestamp: number;
}

const STORAGE_KEY = "interviewly_study_plan";

export default function InterviewPrepApp() {
  const { user, isLoaded: userLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [jobTitle, setJobTitle] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [prepDays, setPrepDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [newSkill, setNewSkill] = useState("");
  const [newRequiredSkill, setNewRequiredSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [storageSource, setStorageSource] = useState<
    "local" | "database" | null
  >(null);

  // Convex mutations and queries
  const saveStudyPlanMutation = useMutation(api.studyPlans.saveStudyPlan);
  const mostRecentStudyPlan = useQuery(
    api.studyPlans.getMostRecentStudyPlan,
    userLoaded && user ? {} : "skip",
  );
  const recentStudyPlans = useQuery(
    api.studyPlans.getRecentStudyPlans,
    userLoaded && user ? { days: 7 } : "skip",
  );

  // Helper function to format timestamp
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  // Load saved study plan from localStorage and database on component mount
  useEffect(() => {
    if (!userLoaded) return;

    const loadSavedPlan = async () => {
      try {
        // First, try to load from database if user is authenticated
        if (user && mostRecentStudyPlan) {
          const isRecent =
            Date.now() - mostRecentStudyPlan.createdAt <
            7 * 24 * 60 * 60 * 1000; // 7 days

          if (isRecent) {
            setJobTitle(mostRecentStudyPlan.jobTitle || "");
            setCompanyName(mostRecentStudyPlan.companyName || "");
            setJobLevel(mostRecentStudyPlan.jobLevel || "");
            setUserSkills(mostRecentStudyPlan.userSkills || []);
            setRequiredSkills(mostRecentStudyPlan.requiredSkills || []);
            setPrepDays(mostRecentStudyPlan.prepDays || 7);
            setHoursPerDay(mostRecentStudyPlan.hoursPerDay || 2);
            setStudyPlan(mostRecentStudyPlan.studyPlan || []);
            setPlanGenerated(mostRecentStudyPlan.studyPlan.length > 0);
            setCurrentStep(mostRecentStudyPlan.studyPlan.length > 0 ? 4 : 1);
            setLastSavedTime(new Date(mostRecentStudyPlan.createdAt));
            setStorageSource("database");
            setHasLoadedFromStorage(true);

            if (mostRecentStudyPlan.studyPlan.length > 0) {
              toast.success(
                "Loaded your most recent study plan from cloud storage",
              );
            }
            return;
          }
        }

        // Fallback to localStorage if no recent database plan
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedData: SavedStudyPlan = JSON.parse(saved);

          // Check if the saved plan is less than 7 days old
          const isRecent =
            Date.now() - parsedData.timestamp < 7 * 24 * 60 * 60 * 1000;

          if (isRecent) {
            setJobTitle(parsedData.jobTitle || "");
            setCompanyName(parsedData.companyName || "");
            setJobLevel(parsedData.jobLevel || "");
            setUserSkills(parsedData.userSkills || []);
            setRequiredSkills(parsedData.requiredSkills || []);
            setPrepDays(parsedData.prepDays || 7);
            setHoursPerDay(parsedData.hoursPerDay || 2);
            setStudyPlan(parsedData.studyPlan || []);
            setPlanGenerated(parsedData.planGenerated || false);
            setCurrentStep(parsedData.currentStep || 1);
            setLastSavedTime(new Date(parsedData.timestamp));
            setStorageSource("local");
            setHasLoadedFromStorage(true);

            if (parsedData.planGenerated) {
              toast.success(
                "Loaded your previous study plan from local storage",
              );
            }
          } else {
            // Clear old data (older than 7 days)
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading saved study plan:", error);
        // Clear corrupted data
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadSavedPlan();
  }, [user, userLoaded, mostRecentStudyPlan]);

  // Save study plan to localStorage and database
  const saveToStorage = async (showToast = false) => {
    try {
      const dataToSave: SavedStudyPlan = {
        jobTitle,
        companyName,
        jobLevel,
        userSkills,
        requiredSkills,
        prepDays,
        hoursPerDay,
        studyPlan,
        planGenerated,
        currentStep,
        timestamp: Date.now(),
      };

      // Always save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      setLastSavedTime(new Date());

      // Save to database if user is authenticated and plan is generated
      if (user && planGenerated && studyPlan.length > 0) {
        try {
          await saveStudyPlanMutation({
            jobTitle,
            companyName,
            jobLevel,
            userSkills,
            requiredSkills,
            prepDays,
            hoursPerDay,
            studyPlan,
          });
          setStorageSource("database");
          if (showToast) {
            toast.success("Study plan saved to cloud storage");
          }
        } catch (error) {
          console.error("Error saving to database:", error);
          if (showToast) {
            toast.error("Failed to save to cloud storage, but saved locally");
          }
        }
      }
    } catch (error) {
      console.error("Error saving study plan:", error);
    }
  };

  // Save to storage whenever relevant state changes (silent saves)
  useEffect(() => {
    if (userLoaded && !hasLoadedFromStorage) {
      saveToStorage(false);
    }
  }, [
    jobTitle,
    companyName,
    jobLevel,
    userSkills,
    requiredSkills,
    prepDays,
    hoursPerDay,
    studyPlan,
    planGenerated,
    currentStep,
    userLoaded,
    hasLoadedFromStorage,
  ]);

  // Show toast when plan is generated and saved to database
  useEffect(() => {
    if (
      userLoaded &&
      planGenerated &&
      studyPlan.length > 0 &&
      user &&
      !hasLoadedFromStorage
    ) {
      // Small delay to ensure the plan is fully set
      const timer = setTimeout(() => {
        saveToStorage(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [planGenerated, studyPlan.length, user, userLoaded, hasLoadedFromStorage]);

  // Reset the loaded from storage flag when starting fresh
  useEffect(() => {
    if (!planGenerated && currentStep === 1) {
      setHasLoadedFromStorage(false);
      setStorageSource(null);
    }
  }, [planGenerated, currentStep]);

  // Clear saved plan when starting over
  const clearSavedPlan = () => {
    localStorage.removeItem(STORAGE_KEY);
    setJobTitle("");
    setCompanyName("");
    setJobLevel("");
    setUserSkills([]);
    setRequiredSkills([]);
    setPrepDays(7);
    setHoursPerDay(2);
    setStudyPlan([]);
    setPlanGenerated(false);
    setCurrentStep(1);
    setNewSkill("");
    setNewRequiredSkill("");
    setHasLoadedFromStorage(false);
    setLastSavedTime(null);
    setStorageSource(null);
  };

  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const pageVariants = {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (currentStep === totalSteps) return "Generate Plan";
    return "Next";
  };

  // Calculate skills gap
  const skillsToImprove = requiredSkills.filter(
    (skill) => !userSkills.includes(skill),
  );

  // Get skill icon
  const getSkillIcon = (skill) => {
    const icons = {
      react: <Code className="mr-1 text-blue-500" size={16} />,
      javascript: <Code className="mr-1 text-yellow-500" size={16} />,
      typescript: <Code className="mr-1 text-blue-600" size={16} />,
      database: <Database className="mr-1 text-green-500" size={16} />,
      design: <Layers className="mr-1 text-purple-500" size={16} />,
      default: <Sparkles className="mr-1 text-indigo-500" size={16} />,
    };

    const key = Object.keys(icons).find((key) =>
      skill.toLowerCase().includes(key),
    );

    return key ? icons[key] : icons.default;
  };

  // Generate the study plan
  const generatePlan = async () => {
    if (userSkills.length === 0) {
      toast.error("Please add your skills first");
    }
    if (requiredSkills.length === 0) {
      toast.error("Please add required skills first");
    }
    if (userSkills.length === 0 || requiredSkills.length === 0) {
      return;
    }

    setIsLoading(true);
    setPlanGenerated(false);
    if (skillsToImprove.length === 0) {
      setStudyPlan([
        {
          day: 0,
          topics: [
            {
              topic:
                "Great job! You already have all the required skills. Use this time to practice interview questions.",
              hours_allocated: 2,
              focus_area: "learning",
            },
          ],
        },
      ]);
      setPlanGenerated(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/generate-studyplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_title: jobTitle,
          number_of_days: prepDays,
          hours_per_day: hoursPerDay,
          my_current_skills: userSkills,
          required_job_skills: requiredSkills,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      setStudyPlan(data.study_plan);
      setPlanGenerated(true);
    } catch (error) {
      toast.error("Failed to generate study plan");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle skill addition
  const addUserSkill = () => {
    if (userSkills.includes(newSkill)) {
      toast.error("You already have this skill");
      return;
    }
    if (newSkill && !userSkills.includes(newSkill)) {
      setUserSkills([...userSkills, newSkill]);
      setNewSkill("");
    }
  };

  const addRequiredSkill = () => {
    if (requiredSkills.includes(newRequiredSkill)) {
      toast.error("You already have this skill");
      return;
    }
    if (newRequiredSkill && !requiredSkills.includes(newRequiredSkill)) {
      setRequiredSkills([...requiredSkills, newRequiredSkill]);
      setNewRequiredSkill("");
    }
  };

  const steps = [
    {
      id: 1,
      title: "Job Information",
      description: "Basic details about the position",
      icon: Briefcase,
    },
    {
      id: 2,
      title: "Your Skills",
      description: "What you already know",
      icon: User,
    },
    {
      id: 3,
      title: "Requirements",
      description: "What the job needs",
      icon: Target,
    },
    {
      id: 4,
      title: "Time Planning",
      description: "Your study schedule",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4  mt-16 py-8">
        {/* Back Button */}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex flex-col items-center justify-center mb-16"
        >
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-6 py-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              <Sparkles
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
              <div className="absolute inset-0 animate-ping">
                <Sparkles
                  size={18}
                  className="text-blue-600 dark:text-blue-400 opacity-20"
                />
              </div>
            </div>
            <span className="text-sm text-blue-700 dark:text-blue-300 font-semibold tracking-wide">
              Personalized study plans
            </span>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Interview Prep{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Planner
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Create a personalized study plan to ace your next interview with
            AI-powered recommendations.
          </motion.p>

          {/* Loaded from storage indicator */}
          {hasLoadedFromStorage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl px-6 py-3 mt-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Continuing from your previous session
                </span>
              </div>
              {storageSource && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                  {storageSource === "database" ? (
                    <Cloud size={14} className="text-blue-500" />
                  ) : (
                    <HardDrive size={14} className="text-orange-500" />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {formatTimeAgo(lastSavedTime!)}
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Last saved indicator */}
          {lastSavedTime && !hasLoadedFromStorage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-6 py-3 mt-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Last saved {formatTimeAgo(lastSavedTime)}
                </span>
              </div>
              {storageSource && (
                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  {storageSource === "database" ? (
                    <Cloud size={14} className="text-blue-500" />
                  ) : (
                    <HardDrive size={14} className="text-orange-500" />
                  )}
                </div>
              )}
            </motion.div>
          )}


          {/* Plan Summary - shown when plan is generated */}
          {planGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-8 py-6 mt-6 shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {jobTitle}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                  {companyName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {hoursPerDay} hours per day • {prepDays} days
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                <Button
                  onClick={() => {
                    setPlanGenerated(false);
                    setCurrentStep(1);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Go Back
                </Button>
                <Button
                  onClick={() => {
                    setPlanGenerated(false);
                    setCurrentStep(4);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Regenerate Plan
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content Section */}
        <div className="mt-8">  
          <div className="space-y-8">
            {/* Multi-step Form for Interview Preparation */}
            <AnimatePresence mode="wait">
              {!planGenerated ? (
                <Timeline
                  currentStep={currentStep}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  isLoading={isLoading}
                  getButtonText={getButtonText}
                  jobTitle={jobTitle}
                  setJobTitle={setJobTitle}
                  companyName={companyName}
                  setCompanyName={setCompanyName}
                  jobLevel={jobLevel}
                  setJobLevel={setJobLevel}
                  userSkills={userSkills}
                  setUserSkills={setUserSkills}
                  newSkill={newSkill}
                  setNewSkill={setNewSkill}
                  addUserSkill={addUserSkill}
                  steps={steps}
                  pageVariants={pageVariants}
                  loaderVariants={loaderVariants}
                  getSkillIcon={getSkillIcon}
                  newRequiredSkill={newRequiredSkill}
                  setNewRequiredSkill={setNewRequiredSkill}
                  addRequiredSkill={addRequiredSkill}
                  requiredSkills={requiredSkills}
                  skillsToImprove={skillsToImprove}
                  hoursPerDay={hoursPerDay}
                  prepDays={prepDays}
                  setPrepDays={setPrepDays}
                  setHoursPerDay={setHoursPerDay}
                  setRequiredSkills={setRequiredSkills}
                />
              ) : (
                <motion.div
                  key="study-plan"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  className="bg-white dark:bg-gray-900 -mx-20 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="">
                    {/* Loading indicator */}
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-10 h-10 border-4 border-blue-200 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-600 rounded-full mb-4"
                        />
                        <p className="text-gray-600 dark:text-gray-400">
                          Creating your personalized study plan...
                        </p>
                      </div>
                    ) : (
                      <PreparedPlan
                        prepDays={prepDays}
                        jobTitle={jobTitle}
                        setPlanGenerated={setPlanGenerated}
                        setCurrentStep={setCurrentStep}
                        studyPlan={studyPlan}
                        clearSavedPlan={clearSavedPlan}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
