"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ChevronLeft,
  Clock,
  Award,
  PieChart,
  Brain,
  CheckCircle,
  XCircle,
  HelpCircle,
  Share2,
  BookOpen,
  BarChart3,
  CalendarDays,
  Loader,
  GraduationCap,
  Play,
  Book,
  Globe,
  CircleHelp,
  Check,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import ProgressChart from "./_components/ProgressChart";
import toast from "react-hot-toast";

export default function QuizDetail({ params }) {
  const { quizId } = params;
  const router = useRouter();
  const { user } = useUser();
  const { theme } = useTheme();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentAttempt, setCurrentAttempt] = useState(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Fetch quiz data
  const quizData = useQuery(api.quizzes.getQuizByQuizId, {
    quizId,
  });

  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(prefersDark);

    // Set loading state based on whether quizData is available
    if (quizData) {
      setIsLoading(false);

      // Get the most recent attempt (assuming the last one in the array is the most recent)
      if (quizData.attemptsHistory && quizData.attemptsHistory.length > 0) {
        setCurrentAttempt(
          quizData.attemptsHistory[quizData.attemptsHistory.length - 1],
        );
      }
    }
  }, [quizData]);

  const theme2 = {
    dark: {
      bg: "",
      card: {
        bg: "bg-slate-800 border border-blue-900/30 shadow-xl shadow-blue-500/5",
        highlight:
          "bg-gradient-to-br from-blue-700 to-indigo-800 shadow-lg shadow-blue-500/20",
        badge: "bg-indigo-900/50 text-indigo-300 border border-indigo-700/50",
        badgeSuccess:
          "bg-green-900/50 text-green-300 border border-green-700/50",
        badgeWarning:
          "bg-amber-900/50 text-amber-300 border border-amber-700/50",
        badgeDanger: "bg-red-900/50 text-red-300 border border-red-700/50",
      },
      button: {
        primary:
          "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
        secondary:
          "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
      },
      text: {
        primary: "text-white",
        secondary: "text-blue-200",
        muted: "text-slate-400",
      },
      input:
        "bg-slate-900 border-slate-700 text-blue-200 focus:border-blue-500 focus:ring-blue-500",
      modal: "bg-slate-900 border border-blue-800",
      tab: {
        active: "bg-blue-900/30 text-blue-300 border-b-2 border-blue-500",
        inactive:
          "text-slate-400 hover:text-blue-300 border-b-2 border-transparent hover:border-blue-500/50",
      },
    },
    light: {
      bg: "",
      card: {
        bg: "bg-white border border-blue-100 shadow-xl shadow-blue-100/30",
        highlight:
          "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-200/50",
        badge: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        badgeSuccess: "bg-green-100 text-green-700 border border-green-200",
        badgeWarning: "bg-amber-100 text-amber-700 border border-amber-200",
        badgeDanger: "bg-red-100 text-red-700 border border-red-200",
      },
      button: {
        primary:
          "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
        secondary:
          "bg-white hover:bg-gray-50 text-blue-800 border border-blue-200 shadow-sm",
      },
      text: {
        primary: "text-gray-900",
        secondary: "text-blue-600",
        muted: "text-gray-500",
      },
      input:
        "bg-white border-blue-300 text-blue-800 focus:border-blue-500 focus:ring-blue-500",
      modal: "bg-white border border-blue-200",
      tab: {
        active: "bg-blue-100 text-blue-700 border-b-2 border-blue-500",
        inactive:
          "text-gray-500 hover:text-blue-700 border-b-2 border-transparent hover:border-blue-500/50",
      },
    },
  };

  const currentTheme = theme === "dark" ? theme2.dark : theme2.light;

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };
  const highestScore = quizData?.attemptsHistory.reduce((acc, curr) => {
    if (curr.score > acc.score) return curr;
    return acc;
  });
  console.log(highestScore);

  const averageTimeSpent =
    quizData?.attemptsHistory.reduce((acc, curr) => {
      const [minutes, seconds] = curr.timeSpent.split(":").map(Number);
      const totalSeconds = minutes * 60 + seconds;
      return acc + totalSeconds;
    }, 0) / quizData?.attemptsHistory.length;

  const renderTabContent = () => {
    if (!quizData || !currentAttempt) return null;

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Score Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${currentTheme.card.highlight} rounded-xl p-6 text-white`}
            >
              <div className="flex flex-wrap md:flex-nowrap justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-1">Your Score</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {currentAttempt.score}%
                    </span>
                    {/* Improvement logic could be added here if necessary */}
                  </div>
                  <p className="text-sm opacity-80 mt-1">
                    Completed {formatDate(currentAttempt.completedOn)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {currentAttempt.correctAnswers}
                    </div>
                    <div className="text-xs opacity-80">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {currentAttempt.incorrectAnswers}
                    </div>
                    <div className="text-xs opacity-80">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {currentAttempt.timeSpent}
                    </div>
                    <div className="text-xs opacity-80">Time</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Strengths and Weaknesses */}
              <div className={`${currentTheme.card.bg} rounded-xl p-6`}>
                <h3
                  className={`text-lg font-bold mb-4 ${currentTheme.text.primary}`}
                >
                  Performance Areas
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4
                      className={`flex items-center text-sm font-medium ${currentTheme.text.secondary} mb-2`}
                    >
                      <CheckCircle size={16} className="mr-1 text-green-500" />
                      Strong Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {quizData.strongAreas.map((area, index) => (
                        <span
                          key={index}
                          className={`${currentTheme.card.badgeSuccess} text-xs py-1 px-2 rounded-full`}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4
                      className={`flex items-center text-sm font-medium ${currentTheme.text.secondary} mb-2`}
                    >
                      <XCircle size={16} className="mr-1 text-red-500" />
                      Needs Improvement
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {quizData.weakAreas.map((area, index) => (
                        <span
                          key={index}
                          className={`${currentTheme.card.badgeDanger} text-xs py-1 px-2 rounded-full`}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={`${currentTheme.card.bg} rounded-xl p-6`}>
                <h3
                  className={`text-lg font-bold mb-4 ${currentTheme.text.primary}`}
                >
                  Quiz Statistics
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${currentTheme.text.muted}`}>
                      Attempts
                    </span>
                    <span
                      className={`font-medium ${currentTheme.text.primary}`}
                    >
                      {quizData.attempts}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${currentTheme.text.muted}`}>
                      Highest Score
                    </span>
                    <span
                      className={`font-medium ${currentTheme.text.primary}`}
                    >
                      {highestScore.score}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${currentTheme.text.muted}`}>
                      Average Time
                    </span>
                    <span
                      className={`font-medium ${currentTheme.text.primary}`}
                    >
                      {Math.floor(averageTimeSpent)} secs
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${currentTheme.text.muted}`}>
                      Accuracy
                    </span>
                    <span
                      className={`font-medium ${currentTheme.text.primary}`}
                    >
                      {Math.round(
                        (currentAttempt.correctAnswers /
                          quizData.totalQuestions) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recommended Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${currentTheme.card.bg} rounded-xl p-6`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${currentTheme.text.primary}`}
              >
                Recommended Resources
              </h3>

              <div className="space-y-4">
                {quizData.recommendedResources.map((resource, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`${currentTheme.card.badge} p-2 rounded-lg mr-3`}
                    >
                      {resource.type.toLowerCase() === "article" && (
                        <BookOpen size={18} />
                      )}
                      {resource.type.toLowerCase() === "video" && (
                        <Play size={18} />
                      )}
                      {resource.type.toLowerCase() === "course" && (
                        <GraduationCap size={18} />
                      )}
                      {resource.type.toLowerCase() === "book" && (
                        <Book size={18} />
                      )}
                      {resource.type.toLowerCase() === "website" && (
                        <Globe size={18} />
                      )}
                      {![
                        "article",
                        "video",
                        "course",
                        "book",
                        "website",
                      ].includes(resource.type.toLowerCase()) && (
                        <CircleHelp size={18} />
                      )}
                    </div>
                    <div>
                      <a
                        href={resource.url}
                        className={`font-medium ${currentTheme.text.secondary} hover:underline`}
                      >
                        {resource.title}
                      </a>
                      <p className={`text-xs ${currentTheme.text.muted}`}>
                        {resource.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case "questions":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${currentTheme.text.primary}`}>
              Question Review
            </h3>

            {currentAttempt.questions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`${currentTheme.card.bg} rounded-xl p-6`}
              >
                <div className="flex justify-between">
                  <span className={`${currentTheme.text.muted} text-sm`}>
                    Question {index + 1}
                  </span>
                  <span
                    className={`${currentTheme.text.muted} text-sm flex items-center`}
                  >
                    <Clock size={14} className="mr-1" /> {question.timeSpent}
                  </span>
                </div>

                <h4
                  className={`text-md font-medium mt-2 mb-4 ${currentTheme.text.primary}`}
                >
                  {question.question}
                </h4>

                <div className="space-y-3">
                  <div>
                    <div className={`text-sm ${currentTheme.text.muted}`}>
                      Your Answer:
                    </div>
                    <div
                      className={`${question.isCorrect ? "text-green-500" : "text-red-500"} font-medium mt-1 flex items-start`}
                    >
                      {question.isCorrect ? (
                        <CheckCircle
                          size={18}
                          className="mr-2 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <XCircle
                          size={18}
                          className="mr-2 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <span>{question.yourAnswer}</span>
                    </div>
                  </div>

                  {!question.isCorrect && (
                    <div>
                      <div className={`text-sm ${currentTheme.text.muted}`}>
                        Correct Answer:
                      </div>
                      <div
                        className={`text-green-500 font-medium mt-1 flex items-start`}
                      >
                        <CheckCircle
                          size={18}
                          className="mr-2 flex-shrink-0 mt-0.5"
                        />
                        <span>{question.correctAnswer}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "insights":
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${currentTheme.text.primary}`}>
              Performance Insights
            </h3>

            {/* Progress Over Time */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${currentTheme.card.bg} rounded-xl p-6`}
            >
              <h4
                className={`text-lg font-medium mb-4 ${currentTheme.text.primary}`}
              >
                Progress Chart
              </h4>
              <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className={`${currentTheme.text.muted} text-sm`}>
                  Progress chart visualization would go here
                </p>
              </div>
            </motion.div> */}
            <ProgressChart quizData={quizData} />

            {/* Learning Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`${currentTheme.card.bg} rounded-xl p-6`}
            >
              <h4
                className={`text-lg font-medium mb-4 ${currentTheme.text.primary}`}
              >
                Earned Badges
              </h4>
              <div className="flex flex-wrap gap-3">
                {quizData.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`${currentTheme.card.badge} py-2 px-3 rounded-lg flex items-center`}
                  >
                    <Award size={16} className="mr-2" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`${currentTheme.card.bg} rounded-xl p-6`}
            >
              <h4
                className={`text-lg font-medium mb-4 ${currentTheme.text.primary}`}
              >
                Learning Recommendations
              </h4>
              <ul className="space-y-3">
                {quizData.weakAreas.length === 0 && (
                  <div>
                    <p className={`${currentTheme.text.muted} text-sm`}>
                      No weak areas found
                    </p>
                  </div>
                )}
                {quizData.weakAreas.slice(0, 3).map((area, index) => (
                  <li key={index} className="flex items-start">
                    <Brain
                      size={18}
                      className={`mr-2 mt-0.5 ${currentTheme.text.secondary}`}
                    />
                    <span className={currentTheme.text.primary}>
                      Focus on understanding {area} and practice with real
                      examples.
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  // If still loading
  if (isLoading || !quizData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto text-blue-500" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Loading quiz results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[70px] pb-16">
      {/* Header */}
      <div
        className={`${currentTheme.card.highlight} text-white py-8 px-6 md:px-10`}
      >
        <div className="container mx-auto max-w-6xl">
          <button
            onClick={() => router.push("/quiz/view")}
            className="flex items-center mb-6 text-blue-100 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" /> Back to Quizzes
          </button>

          <div className="flex flex-wrap justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {quizData.title}
              </h1>
              <p className="text-blue-100 max-w-2xl">{quizData.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="bg-blue-800/50 text-blue-100 text-xs px-3 py-1 rounded-full border border-blue-700/50">
                  {quizData.category}
                </span>
                {currentAttempt && (
                  <>
                    <span className="flex items-center text-sm text-blue-100">
                      <Clock size={16} className="mr-1" />
                      {currentAttempt.timeSpent}
                    </span>
                    <span className="flex items-center text-sm text-blue-100">
                      <CalendarDays size={16} className="mr-1" />
                      {formatDate(currentAttempt.completedOn)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-0 flex gap-2">
              <button
                className={`${currentTheme.button.secondary} py-2 px-4 rounded-lg flex items-center text-sm transition-all duration-200`}
                onClick={() => handleCopy(window.location.href)}
              >
                {copied ? (
                  <>
                    <CheckCheck size={16} className="mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 size={16} className="mr-2" />
                    Share
                  </>
                )}
              </button>
              <button
                className={`${currentTheme.button.primary} py-2 px-4 rounded-lg flex items-center text-sm transition 
    ${
      quizData.attempts > 8
        ? "opacity-50 cursor-not-allowed grayscale"
        : "hover:brightness-110 hover:scale-[1.02]"
    }`}
                onClick={() => {
                  if (quizData.attempts <= 8) {
                    router.push("/quiz/re-take/" + quizData.quizId);
                  } else {
                    toast.error("Maximum attempts reached. ");
                  }
                }}
                disabled={quizData.attempts > 8}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-6 md:px-10 mt-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "overview"
                ? currentTheme.tab.active
                : currentTheme.tab.inactive
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "questions"
                ? currentTheme.tab.active
                : currentTheme.tab.inactive
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === "insights"
                ? currentTheme.tab.active
                : currentTheme.tab.inactive
            }`}
          >
            Insights
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
