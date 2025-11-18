"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  BookOpen,
  Timer,
  Award,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Lightbulb,
  ChevronLeft,
  Brain,
  Clock,
  AlertCircle,
  BarChart,
} from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { useSavingToast } from "../../create/_components/useSavingToast";

// Quiz Loader Component
const QuizLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
        Loading Quiz...
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Please wait while we prepare your questions
      </p>
    </div>
  );
};

export default function QuizPage() {
  const params = useParams();
  const quizId = params?.quizId;
  const router = useRouter();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  // State variables
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quiz, setQuiz] = useState({
    userId: "",
    quizId: "",
    title: "",
    category: "",
    description: "",
    totalQuestions: 0,
    badges: [],
    totalTime: 0,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correct: 0,
      },
    ],
    strongAreas: [],
    weakAreas: [],
    attempts: 0,
    attemptsHistory: [],
    recommendedResources: [],
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSaveSuccess] = useState(false);
  const [savedQuizData, setSavedQuizData] = useState(null);
  const [quizResults, setQuizResults] = useState({
    score: 0,
    totalTime: 0,
    questionTimes: [],
    answers: [],
  });
  const [quizConfig, setQuizConfig] = useState({
    topic: "",
    difficulty: "medium",
  });
  const { startSaving, endSaving } = useSavingToast();

  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(null);

  // Theme effect
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  const normalizedQuizId = Array.isArray(quizId) ? quizId[0] : quizId;

  // Fetch quiz data from Convex DB
  const quizData = useQuery(
    api.quizzes.getQuizByQuizId,
    normalizedQuizId ? { quizId: normalizedQuizId } : "skip",
  );

  const quizConfigData = useQuery(
    api.quizzes.getQuizConfig,
    normalizedQuizId ? { quizId: normalizedQuizId } : "skip",
  );
  const hasInitialized = useRef(false);
  // Fetch quiz data effect
  useEffect(() => {
    if (!normalizedQuizId) {
      toast.error("Quiz ID is missing");
      router.push("/quizzes");
      return;
    }

    if (quizData === undefined) {
      setIsLoading(true);
      return;
    }

    if (quizData === null) {
      toast.error("Quiz not found");
      router.push("/quiz/view");
      return;
    }

    if (quizData && !hasInitialized.current) {
      setQuiz(quizData);

      const questionCount = quizData.questions?.length || 0;
      setQuizResults({
        score: 0,
        totalTime: 0,
        questionTimes: Array(questionCount).fill(0),
        answers: Array(questionCount).fill(null),
      });

      if (quizConfigData) {
        setQuizConfig(quizConfigData);
      }

      setIsLoading(false);
      hasInitialized.current = true;
    }
  }, [normalizedQuizId, quizData, quizConfigData, router]);

  // Timer effect
  useEffect(() => {
    if (
      quizStarted &&
      !quizFinished &&
      quiz.questions &&
      quiz.questions.length > 0
    ) {
      // Set time per question based on quiz difficulty
      let timeLimit = 45; // Default
      if (quizConfig.difficulty === "easy") timeLimit = 15;
      if (quizConfig.difficulty === "medium") timeLimit = 25;
      if (quizConfig.difficulty === "hard") timeLimit = 35;

      setTimeLeft(timeLimit);
      questionStartTimeRef.current = Date.now();

      // Clear existing timer
      if (timerRef.current) clearInterval(timerRef.current);

      // Start new timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, quizStarted, quizFinished, quiz.questions]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(darkMode ? "light" : "dark");
    setDarkMode(!darkMode);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUp = () => {
    if (!questionStartTimeRef.current) return;

    const timeSpent = Math.floor(
      (Date.now() - questionStartTimeRef.current) / 1000,
    );

    const updatedResults = { ...quizResults };
    if (
      Array.isArray(updatedResults.questionTimes) &&
      currentQuestion < updatedResults.questionTimes.length
    ) {
      updatedResults.questionTimes[currentQuestion] = timeSpent;
      updatedResults.totalTime += timeSpent;

      if (
        Array.isArray(updatedResults.answers) &&
        currentQuestion < updatedResults.answers.length
      ) {
        updatedResults.answers[currentQuestion] = {
          questionIndex: currentQuestion,
          selectedAnswer: null,
          isCorrect: false,
          timeTaken: timeSpent,
        };
      }

      setQuizResults(updatedResults);
      setShowResult(true);

      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    }
  };

  const addToDB = useMutation(api.quizzes.saveQuizRecord);

  const startQuiz = () => {
    setQuizStarted(true);
    questionStartTimeRef.current = Date.now();
  };

  const handleSelectAnswer = (index) => {
    if (showResult || !quiz.questions || !quiz.questions[currentQuestion])
      return;

    clearInterval(timerRef.current);

    // Record time spent
    const timeSpent = Math.floor(
      (Date.now() - questionStartTimeRef.current) / 1000,
    );

    // Update quiz results
    const updatedResults = { ...quizResults };
    if (
      Array.isArray(updatedResults.questionTimes) &&
      currentQuestion < updatedResults.questionTimes.length
    ) {
      updatedResults.questionTimes[currentQuestion] = timeSpent;
      updatedResults.totalTime += timeSpent;

      const isCorrect = index === quiz.questions[currentQuestion].correct;
      if (isCorrect) {
        updatedResults.score += 1;
      }

      if (
        Array.isArray(updatedResults.answers) &&
        currentQuestion < updatedResults.answers.length
      ) {
        updatedResults.answers[currentQuestion] = {
          questionIndex: currentQuestion,
          selectedAnswer: index,
          isCorrect,
          timeTaken: timeSpent,
        };
      }

      setQuizResults(updatedResults);
      setSelectedAnswer(index);
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (!quiz.questions || quiz.questions.length === 0) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      questionStartTimeRef.current = Date.now();
    } else {
      // Quiz completed
      setQuizFinished(true);
      saveQuizToDB();
    }
  };

  function getQuizTitle(quizConfig) {
    if (!quizConfig || quizConfig.trim() === "") {
      return "Quiz";
    }

    const normalized = quizConfig.toLowerCase();

    if (normalized.includes("quiz")) {
      return quizConfig;
    }

    return `${quizConfig} Quiz`;
  }
  const saveQuizToDB = async () => {
    if (!user || !quiz.questions) return;

    try {
      setIsSaving(true);
      startSaving();

      const correctAnswers = quizResults.answers.filter(
        (ans) => ans && ans.isCorrect,
      ).length;

      const incorrectAnswers = quizResults.answers.filter(
        (ans) => ans && !ans.isCorrect,
      ).length;

      const skippedAnswers = quizResults.answers.filter(
        (ans) => ans === null,
      ).length;

      const scorePercentage = Math.round(
        (correctAnswers / quiz.questions.length) * 100,
      );

      const totalTimeFormatted = formatTime(quizResults.totalTime);

      let badges = [];

      if (scorePercentage >= 90) badges.push("Expert");
      else if (scorePercentage >= 75) badges.push("Proficient");
      else if (scorePercentage >= 50) badges.push("Intermediate");
      else badges.push("Beginner");

      if (quizResults.totalTime / quiz.questions.length < 15)
        badges.push("Speed Demon");
      if (correctAnswers === quiz.questions.length)
        badges.push("Perfect Score");
      if (quizConfig.difficulty === "hard") badges.push("Challenger");

      const questionsData = quiz.questions.map((q, idx) => {
        const answer = quizResults.answers[idx];
        return {
          id: `q-${idx + 1}`,
          question: q.question,
          yourAnswer: answer ? q.options[answer.selectedAnswer] : "Skipped",
          correctAnswer: q.options[q.correct],
          isCorrect: answer ? answer.isCorrect : false,
          timeSpent: formatTime(quizResults.questionTimes[idx] || 0),
        };
      });

      const uniqueQuizId = quiz.quizId;
      const req_body = {
        quizId: uniqueQuizId,
        title: `${getQuizTitle(quizConfig.topic)}`,
        category: quizConfig.topic || "General",
        description: `A ${quizConfig.difficulty} level quiz on ${quizConfig.topic || "various topics"} with ${quiz.questions.length} questions`,
        totalQuestions: quiz.questions.length,
        attempts: 1,
        attemptsHistory: [
          {
            attemptId: Math.floor(Math.random() * 1000),
            completedOn: new Date().toISOString(),
            score: scorePercentage,
            correctAnswers,
            incorrectAnswers,
            skippedAnswers,
            timeSpent: totalTimeFormatted,
            questions: questionsData,
          },
        ],
      };

      try {
        const res = await axios.post("/api/get-user-personal", req_body);

        if (res.data.error) {
          toast.error(res.data.error);
          return;
        }

        const strongAreas = res.data.strong_topics || [];
        const weakAreas = res.data.weak_topics || [];
        const recommendedResources = res.data.study_materials || [];

        badges = [...badges, ...(res.data.badges?.map((b) => b.title) || [])];

        const quizRecord = {
          userId: user.id,
          quizId: uniqueQuizId,
          title: req_body.title,
          category: req_body.category,
          description: req_body.description,
          totalQuestions: req_body.totalQuestions,
          totalTime: quizResults.totalTime,
          badges,
          questions: quiz.questions,
          strongAreas,
          weakAreas,
          attempts: 1,
          attemptsHistory: req_body.attemptsHistory,
          recommendedResources,
        };

        const dbres = await addToDB(quizRecord);
        setSavedQuizData(quizRecord);
        setSaveSuccess(true);
        endSaving(true);
      } catch (error) {
        console.error("API error:", error.message);
        // Continue saving locally even if API fails
        const quizRecord = {
          userId: user.id,
          quizId: uniqueQuizId,
          title: req_body.title,
          category: req_body.category,
          description: req_body.description,
          totalQuestions: req_body.totalQuestions,
          totalTime: quizResults.totalTime,
          badges,
          questions: quiz.questions,
          strongAreas: [],
          weakAreas: [],
          attempts: 1,
          attemptsHistory: req_body.attemptsHistory,
          recommendedResources: [],
        };

        const dbres = await addToDB(quizRecord);
        setSavedQuizData(quizRecord);
        setSaveSuccess(true);
        endSaving(true);
      }
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save quiz results");
      setIsSaving(false);
      setSaveSuccess(false);
      endSaving(false);
    } finally {
      setIsSaving(false);
    }
  };

  const resetQuiz = () => {
    setQuizFinished(false);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);

    // Reset results with correct array lengths
    const questionCount = quiz?.questions?.length || 0;
    setQuizResults({
      score: 0,
      totalTime: 0,
      questionTimes: Array(questionCount).fill(0),
      answers: Array(questionCount).fill(null),
    });
  };

  // Loading screen
  if (isLoading) {
    return <QuizLoader />;
  }

  // Safety check - make sure quiz has questions
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">
          <AlertCircle className="w-16 h-16" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Quiz Error
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          This quiz has no questions or is improperly formatted
        </p>
        <button
          onClick={() => router.push("/quiz/view")}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // Results screen
  if (quizFinished) {
    const correctAnswers = quizResults.answers.filter(
      (answer) => answer && answer.isCorrect,
    ).length;
    const totalQuestions = quiz.questions.length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Filter out zeros before sorting
    const nonZeroTimes = quizResults.questionTimes.filter((time) => time > 0);
    const fastestQuestion =
      nonZeroTimes.length > 0 ? [...nonZeroTimes].sort((a, b) => a - b)[0] : 0;
    const slowestQuestion =
      nonZeroTimes.length > 0 ? [...nonZeroTimes].sort((a, b) => b - a)[0] : 0;

    return (
      <div
        className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? "" : ""} mt-16`}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto mt-8"
        >
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mx-auto"
              >
                <BarChart className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-2">
              Quiz Complete!
            </h1>
            <p
              className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              You scored {correctAnswers} out of {totalQuestions} (
              {scorePercentage}%)
            </p>
          </div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              darkMode
                ? "bg-gray-800 shadow-md shadow-gray-900/60"
                : "bg-white shadow-xl"
            } rounded-xl p-6 mb-8`}
          >
            <h3
              className={`text-xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"} mb-6`}
            >
              Performance Summary
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-blue-50"} flex flex-col items-center`}
              >
                <Clock
                  className={`w-6 h-6 mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                />
                <span
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Total Time
                </span>
                <span
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {formatTime(quizResults.totalTime)}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-blue-50"} flex flex-col items-center`}
              >
                <Timer
                  className={`w-6 h-6 mb-2 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}
                />
                <span
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Avg. Time per Question
                </span>
                <span
                  className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {formatTime(
                    Math.round(quizResults.totalTime / quiz.questions.length) ||
                      0,
                  )}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4
                className={`font-medium mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Question Performance
              </h4>
              <div
                className={`rounded-lg ${darkMode ? "bg-gray-700" : ""} p-4`}
              >
                <div className="space-y-3">
                  {quizResults.answers.map((answer, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex justify-between items-center ${
                        answer && answer.isCorrect
                          ? darkMode
                            ? "bg-green-900/30 border border-green-800"
                            : "bg-green-50 border border-green-200"
                          : darkMode
                            ? "bg-red-900/30 border border-red-800"
                            : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center">
                        {answer && answer.isCorrect ? (
                          <CheckCircle
                            className={`w-4 h-4 mr-2 ${darkMode ? "text-green-400" : "text-green-500"}`}
                          />
                        ) : (
                          <XCircle
                            className={`w-4 h-4 mr-2 ${darkMode ? "text-red-400" : "text-red-500"}`}
                          />
                        )}
                        <span
                          className={
                            darkMode ? "text-gray-300" : "text-gray-700"
                          }
                        >
                          Question {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Timer
                          className={`w-4 h-4 mr-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        />
                        <span
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {formatTime(answer ? answer.timeTaken : 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : ""} flex flex-col`}
              >
                <div className="flex items-center mb-2">
                  <Timer
                    className={`w-5 h-5 mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  />
                  <span
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
                  >
                    Fastest Answer
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {formatTime(fastestQuestion || 0)}
                </span>
              </div>

              <div
                className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : ""} flex flex-col`}
              >
                <div className="flex items-center mb-2">
                  <Clock
                    className={`w-5 h-5 mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                  />
                  <span
                    className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-medium`}
                  >
                    Slowest Answer
                  </span>
                </div>
                <span
                  className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  {formatTime(slowestQuestion || 0)}
                </span>
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/quiz/view")}
                className="px-8 flex items-center py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Quizzes
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <div
        className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? "" : ""} mt-16`}
      >
        {/* Theme toggle */}
        <div className="fixed top-6 right-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-800 text-gray-400 hover:text-yellow-400"
                : "bg-white text-gray-600 hover:text-blue-500 shadow-md"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-block mb-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mx-auto`}
              >
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1
              className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-2`}
            >
              {quiz.title ||
                (quizConfig.topic ? `${quizConfig.topic} Quiz` : "Quiz")}
            </h1>
            <p
              className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {quiz.description ||
                `A ${quizConfig.difficulty} level quiz on ${quiz.category || quizConfig.topic || "various topics"}`}
            </p>
          </motion.div>

          {/* Quiz info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-6 mb-12 ${
              darkMode
                ? "bg-gray-800 shadow-md shadow-gray-900/60"
                : "bg-white shadow-xl"
            }`}
          >
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <BookOpen
                  className={`w-5 h-5 mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                />
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Quiz Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
                >
                  <div
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Category
                  </div>
                  <div
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {quiz.category || quizConfig.topic || "General Knowledge"}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
                >
                  <div
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Difficulty
                  </div>
                  <div
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {quizConfig.difficulty
                      ? quizConfig.difficulty.charAt(0).toUpperCase() +
                        quizConfig.difficulty.slice(1)
                      : "Medium"}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
                >
                  <div
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Questions
                  </div>
                  <div
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {quiz.questions ? quiz.questions.length : 0} Questions
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
                >
                  <div
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Time Limit
                  </div>
                  <div
                    className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                  >
                    {(() => {
                      // Calculate estimated time based on difficulty
                      let timePerQuestion = 45; // Default
                      if (quizConfig.difficulty === "easy")
                        timePerQuestion = 15;
                      if (quizConfig.difficulty === "medium")
                        timePerQuestion = 25;
                      if (quizConfig.difficulty === "hard")
                        timePerQuestion = 35;

                      const totalSeconds =
                        (quiz.questions?.length || 0) * timePerQuestion;
                      return formatTime(totalSeconds);
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Award
                  className={`w-5 h-5 mr-2 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`}
                />
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Earn Badges
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-yellow-50"} text-center`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-yellow-500 mb-1">
                      <Award className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Expert
                    </span>
                    <span
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Score 90%+
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"} text-center`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-blue-500 mb-1">
                      <Timer className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Speed Demon
                    </span>
                    <span
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Average
                    </span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-green-50"} text-center`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-green-500 mb-1">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Perfect Score
                    </span>
                    <span
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      100% Correct
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Lightbulb
                  className={`w-5 h-5 mr-2 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
                />
                <h3
                  className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  How It Works
                </h3>
              </div>

              <ul className="space-y-3">
                <li
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex items-center`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      darkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Answer each question within the time limit
                  </span>
                </li>
                <li
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex items-center`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      darkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    See your score and performance metrics at the end
                  </span>
                </li>
                <li
                  className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex items-center`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      darkMode
                        ? "bg-blue-900 text-blue-300"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    3
                  </div>
                  <span
                    className={darkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    Get personalized insights and improvement suggestions
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="px-8 py-3 flex items-center rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Start Quiz <ChevronRight className="ml-1 w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Actual quiz screen
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div
      className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? "" : ""} mt-16`}
    >
      {/* Theme toggle */}
      <div className="fixed top-6 right-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            darkMode
              ? "bg-gray-800 text-gray-400 hover:text-yellow-400"
              : "bg-white text-gray-600 hover:text-blue-500 shadow-md"
          }`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <div className="flex items-center">
              <Timer
                className={`w-4 h-4 mr-1 ${
                  timeLeft < 10
                    ? "text-red-500 animate-pulse"
                    : darkMode
                      ? "text-blue-400"
                      : "text-blue-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  timeLeft < 10
                    ? "text-red-500"
                    : darkMode
                      ? "text-gray-300"
                      : "text-gray-600"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <div
            className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
          >
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl p-6 mb-4 ${
            darkMode
              ? "bg-gray-800 shadow-md shadow-gray-900/60"
              : "bg-white shadow-xl"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-6 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
          >
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <div
                key={index}
                onClick={() => !showResult && handleSelectAnswer(index)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  showResult
                    ? index === currentQ.correct
                      ? darkMode
                        ? "bg-green-900/40 border border-green-700"
                        : "bg-green-50 border border-green-200"
                      : selectedAnswer === index
                        ? darkMode
                          ? "bg-red-900/40 border border-red-700"
                          : "bg-red-50 border border-red-200"
                        : darkMode
                          ? "bg-gray-700"
                          : "bg-gray-50"
                    : selectedAnswer === index
                      ? darkMode
                        ? "bg-blue-900/40 border border-blue-700"
                        : "bg-blue-50 border border-blue-200"
                      : darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                      showResult
                        ? index === currentQ.correct
                          ? darkMode
                            ? "bg-green-900 text-green-300"
                            : "bg-green-100 text-green-600"
                          : selectedAnswer === index
                            ? darkMode
                              ? "bg-red-900 text-red-300"
                              : "bg-red-100 text-red-600"
                            : darkMode
                              ? "bg-gray-600 text-gray-300"
                              : "bg-gray-200 text-gray-600"
                        : selectedAnswer === index
                          ? darkMode
                            ? "bg-blue-900 text-blue-300"
                            : "bg-blue-100 text-blue-600"
                          : darkMode
                            ? "bg-gray-600 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {["A", "B", "C", "D"][index]}
                  </div>
                  <span
                    className={`${
                      showResult
                        ? index === currentQ.correct
                          ? darkMode
                            ? "text-green-300"
                            : "text-green-800"
                          : selectedAnswer === index
                            ? darkMode
                              ? "text-red-300"
                              : "text-red-800"
                            : darkMode
                              ? "text-gray-300"
                              : "text-gray-700"
                        : darkMode
                          ? "text-gray-300"
                          : "text-gray-700"
                    }`}
                  >
                    {option}
                  </span>
                  {showResult && index === currentQ.correct && (
                    <CheckCircle
                      className={`ml-auto w-5 h-5 ${
                        darkMode ? "text-green-400" : "text-green-500"
                      }`}
                    />
                  )}
                  {showResult &&
                    selectedAnswer === index &&
                    index !== currentQ.correct && (
                      <XCircle
                        className={`ml-auto w-5 h-5 ${
                          darkMode ? "text-red-400" : "text-red-500"
                        }`}
                      />
                    )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Next button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextQuestion}
            disabled={!showResult}
            className={`px-6 py-2 flex items-center rounded-xl font-medium ${
              showResult
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                : darkMode
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentQuestion < quiz.questions.length - 1
              ? "Next Question"
              : "Finish Quiz"}
            <ChevronRight className="ml-1 w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
