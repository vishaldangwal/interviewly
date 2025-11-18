"use client";
import { useState, useEffect, useRef } from "react";
import { motion , AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  BookOpen,
  Timer,
  Award,
  AlignLeft,
  CheckCircle,
  XCircle,
  Moon,
  Sun,
  Lightbulb,
  Play,
  ChevronLeft,
  Brain,
  Smile,
  LineChart,
  Zap,
  Clock,
  Lock,
  BarChart,
  AlertCircle,
  PlusCircle,
  User,
  Sparkles,
  Target,
  Settings,
  FileText,
} from "lucide-react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import QuizLoader from "./_components/QuizLoader";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { title } from "process";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useSavingToast } from "./_components/useSavingToast";
import { useRouter } from "next/navigation";

import ResultsScreen from "./_components/ResultsScreen";

export default function QuizUI() {
  const { user } = useUser();
  const [answerTrackingData, setAnswerTrackingData] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);
  const [quizConfig, setQuizConfig] = useState({
    topic: "",
    difficulty: "",
    questionType: "",
    numberOfQuestions: 5,
    timePerQuestion: 45,
    description: "",
    tags: [],
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45); // Default time per question
  const [isSaving, setIsSaving] = useState(false);
  const [savedQuizData, setSavedQuizData] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResults, setQuizResults] = useState({
    score: 0,
    totalTime: 0,
    questionTimes: [],
    answers: [],
  });
  const [questionData, setQuestionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, SetSaveSuccess] = useState(false);
  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [demoQuestions, setDemoQuestions] = useState([
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
    },
  ]);

  // Add this function to calculate time spent
  const calculateTimeSpent = () => {
    const endTime = Date.now();
    const timeSpentInSeconds = Math.round((endTime - questionStartTime) / 1000);
    const minutes = Math.floor(timeSpentInSeconds / 60);
    const seconds = timeSpentInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const addToDB = useMutation(api.quizzes.saveQuizRecord);
  const { startSaving, endSaving } = useSavingToast();
  const saveQuizToDB = async () => {
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
        (correctAnswers / demoQuestions.length) * 100,
      );
      const totalTimeFormatted = formatTime(quizResults.totalTime);

      let badges = [];

      if (scorePercentage >= 90) badges.push("Expert");
      else if (scorePercentage >= 75) badges.push("Proficient");
      else if (scorePercentage >= 50) badges.push("Intermediate");
      else badges.push("Beginner");

      if (quizResults.totalTime / demoQuestions.length < 15)
        badges.push("Speed Demon");
      if (correctAnswers === demoQuestions.length) badges.push("Perfect Score");
      if (quizConfig.difficulty === "hard") badges.push("Challenger");

      const questionsData = demoQuestions.map((q, idx) => {
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

      const req_body = {
        quizId: `quiz-${Date.now()}`,
        title: `${quizConfig.topic} Quiz`,
        category: quizConfig.topic,
        description: `A ${quizConfig.difficulty} level quiz on ${quizConfig.topic} with ${demoQuestions.length} questions`,
        totalQuestions: demoQuestions.length,
        attempts: 1,
        attemptsHistory: [
          {
            attemptId: 1,
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

      const res = await axios.post("/api/get-user-personal", req_body);
      console.log("Response from get-user-personal:", res.data);
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
        quizId: req_body.quizId,
        title: req_body.title,
        category: req_body.category,
        description: req_body.description,
        totalQuestions: req_body.totalQuestions,
        totalTime: quizResults.totalTime,
        badges,
        questions: demoQuestions,
        strongAreas,
        weakAreas,
        attempts: 1,
        attemptsHistory: req_body.attemptsHistory,
        recommendedResources,
      };

      const dbres = await addToDB(quizRecord);
      setSavedQuizData(quizRecord);
      setIsSaving(false);
      SetSaveSuccess(true);
      endSaving(true);
      return quizRecord;
    } catch (error) {
      console.error("Error saving quiz results:", error);
      toast.error("Failed to save quiz results");
      setIsSaving(false);
      SetSaveSuccess(false);
      endSaving(false);
      return null;
    }
  };
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(darkMode ? "light" : "dark");
    setDarkMode(!darkMode);
  };
  const router = useRouter();

  const difficulties = ["easy", "medium", "hard"];
  const questionTypes = ["multiple-choice", "true-false"];

  // Initialize timer when question changes
  useEffect(() => {
    if (quizStarted && !quizFinished) {
      // Set time per question based on difficulty
      let timeLimit = quizConfig.timePerQuestion;
      if (quizConfig.difficulty === "easy") timeLimit = 15;
      if (quizConfig.difficulty === "medium") timeLimit = 25;
      if (quizConfig.difficulty === "hard") timeLimit = 35;

      setTimeLeft(timeLimit);

      questionStartTimeRef.current = Date.now();

      // Clear any existing timer
      if (timerRef.current) clearInterval(timerRef.current);

      // Start new timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            // Time's up - auto-select no answer and move to next
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
  }, [currentQuestion, quizStarted, quizFinished, quizConfig.difficulty]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTimeUp = () => {
    const timeSpent = Math.floor(
      (Date.now() - questionStartTimeRef.current) / 1000,
    );
    const updatedResults = { ...quizResults };
    updatedResults.questionTimes[currentQuestion] = timeSpent;
    updatedResults.totalTime += timeSpent;

    updatedResults.answers[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedAnswer: null,
      isCorrect: false,
      timeTaken: timeSpent,
    };

    setQuizResults(updatedResults);

    setShowResult(true);
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };
  const generateQuiz = async () => {
    if (
      !quizConfig.topic.trim() ||
      !quizConfig.difficulty ||
      !quizConfig.questionType ||
      quizConfig.numberOfQuestions < 3
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    toast.success("Generating quiz...");

    try {
      const res = await axios.post("/api/generate-quiz", {
        topic: quizConfig.topic,
        difficulty: quizConfig.difficulty,
        question_type: quizConfig.questionType,
        number_of_questions: quizConfig.numberOfQuestions,
        time_per_question: quizConfig.timePerQuestion,
      });

      if (res.data.error) {
        toast.error(res.data.error);
        setIsLoading(false);
        return;
      }

      const data = await res.data;
      console.log("Quiz data:", data);

      if (Array.isArray(data) && data.length > 0) {
        setDemoQuestions(data);
        setQuizStarted(true);

        // Initialize quiz results
        setQuizResults({
          score: 0,
          totalTime: 0,
          questionTimes: Array(data.length).fill(0),
          answers: Array(data.length).fill(null),
        });
      } else {
        toast.error("Failed to generate valid quiz questions");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Validate all fields before generating quiz
      if (
        !quizConfig.topic.trim() ||
        !quizConfig.difficulty ||
        !quizConfig.questionType ||
        quizConfig.numberOfQuestions < 3
      ) {
        toast.error("Please fill in all fields to generate a quiz");
        return;
      }

      generateQuiz();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizConfig({
      ...quizConfig,
      [name]: value,
    });
  };

  const handleSelectAnswer = (index) => {
    if (showResult) return;
    clearInterval(timerRef.current);

    // Record time spent on this question
    const timeSpent = Math.floor(
      (Date.now() - questionStartTimeRef.current) / 1000,
    );

    // Update quiz results
    const updatedResults = { ...quizResults };
    updatedResults.questionTimes[currentQuestion] = timeSpent;
    updatedResults.totalTime += timeSpent;

    const isCorrect = index === demoQuestions[currentQuestion].correct;
    if (isCorrect) {
      updatedResults.score += 1;
    }

    updatedResults.answers[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedAnswer: index,
      isCorrect,
      timeTaken: timeSpent,
    };

    setQuizResults(updatedResults);
    setSelectedAnswer(index);
    const currentQ = demoQuestions[currentQuestion];
    const trackingData = {
      id: `q${currentQuestion + 1}`,
      question: currentQ.question,
      yourAnswer: currentQ.options[index],
      correctAnswer: currentQ.options[currentQ.correct],
      isCorrect: index === currentQ.correct,
      timeSpent: timeSpent,
    };

    setAnswerTrackingData((prevData) => [...prevData, trackingData]);

    // Optional: console log for debugging
    console.log("Answer recorded:", trackingData);

    setTimeout(() => {
      setShowResult(true);
    }, 500);
    setSelectedAnswer(index);
    setShowResult(true);

    // Add this code to track answer data
  };

  const handleNextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(quizConfig.timePerQuestion);
      setQuestionStartTime(Date.now()); // Add this line to reset timer
    } else {
      // Quiz is complete
      console.log("Quiz completed! Final data:", answerTrackingData);
      saveQuizToDB();
      setQuizFinished(true);
      // You could navigate to a results page here or show a summary
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const resetQuiz = () => {
    setQuizFinished(false);
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentStep(0);
    setQuizResults({
      score: 0,
      totalTime: 0,
      questionTimes: [],
      answers: [],
    });
    setQuizConfig({
      topic: "",
      difficulty: "medium",
      questionType: "multiple-choice",
      numberOfQuestions: 5,
      timePerQuestion: 45,
      description: "",
      tags: [],
    });
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  // Timeline step animation
  const timelineStepVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  // Card animation
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const setupSteps = [
    {
      title: "Quiz Details",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-white font-semibold mb-4 text-lg">
              Quiz Topic
            </label>
            <div className="relative group">
              <input
                type="text"
                name="topic"
                value={quizConfig.topic}
                onChange={handleChange}
                placeholder="e.g. JavaScript Promises, Python Data Structures, React Hooks"
                className="w-full p-5 pl-14 rounded-2xl bg-gray-900/50 border border-gray-800 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-gray-900/70"
              />
              <BookOpen className="absolute left-5 top-5 w-6 h-6 text-blue-600 group-focus-within:text-blue-400 transition-colors" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <p className="text-gray-400 mt-3 text-sm">
              Be specific for better questions (e.g. "JavaScript Promises"
              instead of just "JavaScript")
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-white font-semibold mb-4 text-lg">
              Description{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative group">
              <textarea
                name="description"
                value={quizConfig.description}
                onChange={handleChange}
                placeholder="Add a brief description of what this quiz will cover..."
                rows={4}
                className="w-full p-5 rounded-2xl bg-gray-900/50 border border-gray-800 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-gray-900/70"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-white font-semibold mb-4 text-lg">
              Tags <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {["Beginner", "Advanced", "Interview", "Practice", "Theory"].map(
                (tag) => (
                  <motion.button
                    key={tag}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newTags = quizConfig.tags.includes(tag)
                        ? quizConfig.tags.filter((t) => t !== tag)
                        : [...quizConfig.tags, tag];
                      setQuizConfig({ ...quizConfig, tags: newTags });
                    }}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                      quizConfig.tags.includes(tag)
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "bg-gray-900/50 text-gray-300 border border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                    }`}
                  >
                    {tag}
                  </motion.button>
                ),
              )}
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Difficulty & Type",
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-white font-semibold mb-6 text-lg">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-6">
              {difficulties.map((diff, index) => (
                <motion.button
                  key={diff}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`p-8 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
                    quizConfig.difficulty === diff
                      ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30"
                      : "bg-gray-900/50 text-gray-300 border border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                  }`}
                  onClick={() =>
                    setQuizConfig({ ...quizConfig, difficulty: diff })
                  }
                >
                  <div className="flex flex-col items-center relative z-10">
                    {diff === "easy" && <Smile className="w-8 h-8 mb-3" />}
                    {diff === "medium" && (
                      <LineChart className="w-8 h-8 mb-3" />
                    )}
                    {diff === "hard" && <Zap className="w-8 h-8 mb-3" />}
                    <span className="text-xl font-bold capitalize">{diff}</span>
                    <span className="text-sm opacity-80 mt-1">
                      {diff === "easy" && "15s per question"}
                      {diff === "medium" && "25s per question"}
                      {diff === "hard" && "35s per question"}
                    </span>
                  </div>
                  {quizConfig.difficulty === diff && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl -z-10"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-white font-semibold mb-6 text-lg">
              Question Format
            </label>
            <div className="space-y-4">
              {questionTypes.map((type, index) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02, x: 10 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`w-full p-6 rounded-2xl font-medium text-left flex items-center transition-all duration-300 relative overflow-hidden ${
                    quizConfig.questionType === type
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                      : "bg-gray-900/50 text-gray-300 border border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                  }`}
                  onClick={() =>
                    setQuizConfig({ ...quizConfig, questionType: type })
                  }
                >
                  <div
                    className={`w-6 h-6 mr-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      quizConfig.questionType === type
                        ? "border-white"
                        : "border-gray-600"
                    }`}
                  >
                    <AnimatePresence>
                      {quizConfig.questionType === type && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="w-3 h-3 rounded-full bg-white"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold mb-1">
                      {type
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(" ")}
                    </div>
                    <div
                      className={`text-sm ${
                        quizConfig.questionType === type
                          ? "text-blue-100"
                          : "text-gray-400"
                      }`}
                    >
                      {type === "multiple-choice" &&
                        "Select the correct answer from given options"}
                      {type === "true-false" &&
                        "Determine whether statements are true or false"}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: "Quiz Settings",
      icon: <Settings className="w-6 h-6" />,
      content: (
        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-white font-semibold mb-6 text-lg">
              Number of Questions
              <span className="text-blue-400 font-bold ml-2">
                ({quizConfig.numberOfQuestions})
              </span>
            </label>

            <div className="relative p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
              <input
                type="range"
                name="numberOfQuestions"
                min="3"
                max="20"
                value={quizConfig.numberOfQuestions}
                onChange={handleChange}
                className="w-full h-4 rounded-full appearance-none cursor-pointer focus:outline-none slider"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(quizConfig.numberOfQuestions - 3) * (100 / 17)}%, #374151 ${(quizConfig.numberOfQuestions - 3) * (100 / 17)}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-gray-400 text-sm font-medium mt-4">
                <span>3</span>
                <span>10</span>
                <span>20</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                {
                  label: "Quick",
                  range: "3-5",
                  active: quizConfig.numberOfQuestions <= 5,
                },
                {
                  label: "Standard",
                  range: "6-12",
                  active:
                    quizConfig.numberOfQuestions > 5 &&
                    quizConfig.numberOfQuestions <= 12,
                },
                {
                  label: "Extended",
                  range: "13-20",
                  active: quizConfig.numberOfQuestions > 12,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center ${
                    item.active
                      ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/25"
                      : "bg-gray-900/50 border-gray-800"
                  }`}
                >
                  <Clock
                    className={`w-8 h-8 mb-3 ${item.active ? "text-white" : "text-blue-400"}`}
                  />
                  <span
                    className={`text-sm font-medium ${item.active ? "text-blue-100" : "text-gray-400"}`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`font-bold text-lg ${item.active ? "text-white" : "text-gray-200"}`}
                  >
                    {item.range}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl bg-blue-600/10 border border-blue-600/20"
            >
              <p className="text-blue-200 text-sm text-center">
                <Clock className="w-4 h-4 inline mr-2" />
                Estimated time:{" "}
                {Math.round(
                  quizConfig.numberOfQuestions *
                    (quizConfig.difficulty === "easy"
                      ? 0.25
                      : quizConfig.difficulty === "medium"
                        ? 0.42
                        : 0.58),
                )}{" "}
                minutes
              </p>
            </motion.div>
          </motion.div>
        </div>
      ),
    },
  ];

  if (quizFinished) {
    return (
      <div
        className={`min-h-screen  px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${darkMode ? "" : ""} mt-16`}
      >
        <ResultsScreen
          quizResults={quizResults}
          demoQuestions={demoQuestions}
          resetQuiz={resetQuiz}
          saveSuccess={saveSuccess}
          isSaving={isSaving}
          saveQuizToDB={saveQuizToDB}
        />
      </div>
    );
  }

  if (!quizStarted && !isLoading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 mt-16`}>
        {/* Theme toggle */}
       
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header styled like flashcard page */}
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
                AI-Powered Quiz Creation
              </span>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            </motion.div>

            {/* Premium Title */}
            <motion.h1
              className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Create Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Perfect Quiz
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Generate customized quizzes with AI to test your knowledge and
              prepare for interviews.
            </motion.p>
          </div>

          {/* Setup timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <div className="relative flex items-center justify-between mb-8 px-2">
              {setupSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center relative z-10"
                  variants={timelineStepVariants}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md"
                        : darkMode
                          ? "bg-gray-700"
                          : "bg-white border border-gray-200"
                    }`}
                  >
                    <div
                      className={`${
                        index <= currentStep
                          ? "text-white"
                          : darkMode
                            ? "text-gray-400"
                            : "text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      index <= currentStep
                        ? darkMode
                          ? "text-blue-400"
                          : "text-blue-600"
                        : darkMode
                          ? "text-gray-500"
                          : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </motion.div>
              ))}

              {/* Progress line */}
              <div
                className={`absolute top-6 left-0 h-0.5 ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } w-full -z-10`}
              ></div>
              <div
                className={`absolute top-6 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 -z-10 transition-all duration-300`}
                style={{
                  width: `${(currentStep / (setupSteps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
          </motion.div>

          {/* Current step content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <motion.div
              variants={cardVariants}
              className={`rounded-2xl p-8 ${
                darkMode
                  ? "bg-black "
                  : "bg-white shadow-xl"
              }`}
            >
              {setupSteps[currentStep].content}
            </motion.div>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-xl flex items-center font-medium ${
                currentStep === 0
                  ? darkMode
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:shadow"
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNextStep}
              className={`px-8 py-3 rounded-xl flex items-center font-medium ${
                currentStep === setupSteps.length - 1
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
              }`}
            >
              {currentStep === setupSteps.length - 1 ? "Generate Quiz" : "Next"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) return <QuizLoader />;
  // Quiz in progress

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        darkMode ? "" : ""
      } mt-16`}
    >
      <div className="max-w-3xl mx-auto mb-6">
        <div
          className={`flex justify-between items-center p-4 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white shadow-md"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                darkMode ? "bg-gray-700" : "bg-blue-100"
              }`}
            >
              <Lightbulb
                className={`w-5 h-5 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <div
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Question {currentQuestion + 1}/{demoQuestions.length}
              </div>
              <div
                className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                {quizConfig.topic || "General Knowledge"} Quiz
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`mr-2 ${timeLeft <= 10 ? "animate-pulse" : ""}`}>
              <Timer
                className={`w-5 h-5 ${
                  timeLeft <= 10
                    ? "text-red-500"
                    : darkMode
                      ? "text-blue-400"
                      : "text-blue-500"
                }`}
              />
            </div>
            <div
              className={`font-mono font-medium ${
                timeLeft <= 10
                  ? "text-red-500"
                  : darkMode
                    ? "text-white"
                    : "text-gray-800"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-300 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full ${
              timeLeft <= 10 ? "bg-red-500" : "bg-blue-500"
            } transition-all duration-1000 ease-linear`}
            style={{
              width: `${(timeLeft / quizConfig.timePerQuestion) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`rounded-2xl p-6 mb-8 ${
            darkMode
              ? "bg-gray-800 shadow-md shadow-gray-900/60"
              : "bg-white shadow-xl"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {demoQuestions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {demoQuestions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={showResult}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full p-4 rounded-xl font-medium text-left transition-all duration-200 ${
                  showResult && index === demoQuestions[currentQuestion].correct
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : showResult && selectedAnswer === index
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                      : selectedAnswer === index
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : darkMode
                          ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                          : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:shadow"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 mr-3 rounded-full flex items-center justify-center border-2 ${
                      showResult &&
                      index === demoQuestions[currentQuestion].correct
                        ? "border-white"
                        : showResult && selectedAnswer === index
                          ? "border-white"
                          : selectedAnswer === index
                            ? "border-white"
                            : darkMode
                              ? "border-gray-500"
                              : "border-gray-400"
                    }`}
                  >
                    {showResult &&
                      index === demoQuestions[currentQuestion].correct && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    {showResult &&
                      selectedAnswer === index &&
                      index !== demoQuestions[currentQuestion].correct && (
                        <XCircle className="w-4 h-4 text-white" />
                      )}
                    {!showResult && selectedAnswer === index && (
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    )}
                  </div>
                  {option}
                </div>
              </motion.button>
            ))}
          </div>

          {showResult && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                selectedAnswer === demoQuestions[currentQuestion].correct
                  ? darkMode
                    ? "bg-green-900/30 border border-green-800"
                    : "bg-green-50 border border-green-200"
                  : darkMode
                    ? "bg-red-900/30 border border-red-800"
                    : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                {selectedAnswer === demoQuestions[currentQuestion].correct ? (
                  <CheckCircle
                    className={`w-5 h-5 mr-2 mt-0.5 ${
                      darkMode ? "text-green-400" : "text-green-500"
                    }`}
                  />
                ) : (
                  <AlertCircle
                    className={`w-5 h-5 mr-2 mt-0.5 ${
                      darkMode ? "text-red-400" : "text-red-500"
                    }`}
                  />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      selectedAnswer === demoQuestions[currentQuestion].correct
                        ? darkMode
                          ? "text-green-300"
                          : "text-green-700"
                        : darkMode
                          ? "text-red-300"
                          : "text-red-700"
                    }`}
                  >
                    {selectedAnswer === demoQuestions[currentQuestion].correct
                      ? "Correct!"
                      : "Incorrect"}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedAnswer === demoQuestions[currentQuestion].correct
                      ? "Great job! You've selected the right answer."
                      : `The correct answer is "${
                          demoQuestions[currentQuestion].options[
                            demoQuestions[currentQuestion].correct
                          ]
                        }".`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Next question button */}
        {showResult && (
          <div className="flex justify-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-xl flex items-center font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
            >
              {currentQuestion < demoQuestions.length - 1 ? (
                <>
                  Next Question
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              ) : (
                <>
                  Complete Quiz
                  <CheckCircle className="w-5 h-5 ml-1" />
                </>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
