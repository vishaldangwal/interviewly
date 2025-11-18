import { motion } from "framer-motion";
import {
    BarChart,
    Brain,
    CheckCircle,
    ChevronLeft,
    Clock,
    Play, Timer, XCircle, Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

const ResultsScreen = ({
  quizResults,
  demoQuestions,
  resetQuiz,
  saveSuccess,
  isSaving,
  saveQuizToDB,
}: {
  quizResults: any;
  demoQuestions: any;
  resetQuiz: () => void;
  saveSuccess: boolean;
  isSaving: boolean;
  saveQuizToDB: () => void;
}) => {
  const correctAnswers = quizResults.answers.filter(
    (ans) => ans && ans.isCorrect,
  ).length;
  const totalQuestions = demoQuestions.length;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - correctAnswers;
  const averageTimePerQuestion = Math.round(
    quizResults.totalTime / totalQuestions,
  );
  const fastestQuestion = Math.min(...quizResults.questionTimes);
  const slowestQuestion = Math.max(...quizResults.questionTimes);

  // Calculate performance metrics
  const accuracyRate = Math.round((correctAnswers / totalQuestions) * 100);
  const speedScore = Math.round((averageTimePerQuestion / 45) * 100); // Assuming 45s is baseline
  const consistencyScore = Math.round(
    (1 - (slowestQuestion - fastestQuestion) / slowestQuestion) * 100,
  );
  const router = useRouter();
  // Performance badges
  const getPerformanceBadge = () => {
    if (scorePercentage >= 90)
      return {
        name: "Master",
        color: "from-yellow-400 to-orange-500",
        icon: "🏆",
      };
    if (scorePercentage >= 75)
      return { name: "Expert", color: "from-blue-400 to-blue-600", icon: "⭐" };
    if (scorePercentage >= 50)
      return {
        name: "Intermediate",
        color: "from-green-400 to-green-600",
        icon: "📈",
      };
    return { name: "Beginner", color: "from-gray-400 to-gray-600", icon: "🌱" };
  };

  const performanceBadge = getPerformanceBadge();
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
             {/* Header styled like flashcards */}
        <div className="relative flex flex-col items-center justify-center mb-12">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <BarChart size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <BarChart size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Quiz Results
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
            Quiz{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Complete!
            </span>
          </motion.h1>

          {/* Performance Badge */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="text-4xl">{performanceBadge.icon}</span>
            <span
              className={`text-2xl font-bold bg-gradient-to-r ${performanceBadge.color} bg-clip-text text-transparent`}
            >
              {performanceBadge.name}
            </span>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            You scored{" "}
            <span className="text-blue-400 font-bold">{correctAnswers}</span>{" "}
            out of{" "}
            <span className="text-blue-400 font-bold">{totalQuestions}</span>{" "}
            questions
          </motion.p>
        </div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-6">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(55, 65, 81, 0.5)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#blueGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-black text-blue-400">
                      {scorePercentage}%
                    </div>
                    <div className="text-sm text-gray-400">Accuracy</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-gray-400">Correct Answers</div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-6">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mr-3">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-gray-300 font-medium">
                        Total Time
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatTime(quizResults.totalTime)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Complete duration
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mr-3">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="text-gray-300 font-medium">
                        Avg. Time
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatTime(averageTimePerQuestion)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Per question</div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Fastest</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatTime(fastestQuestion)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Quickest answer
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center mr-3">
                        <Timer className="w-5 h-5 text-red-400" />
                      </div>
                      <span className="text-gray-300 font-medium">Slowest</span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatTime(slowestQuestion)}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Longest answer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Question-by-Question Performance */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-blue-400" />
              Question Performance
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {quizResults.answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    answer && answer.isCorrect
                      ? "bg-green-900/20 border-green-700/50"
                      : "bg-red-900/20 border-red-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {answer && answer.isCorrect ? (
                        <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 mr-3 text-red-400" />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          Question {index + 1}
                        </div>
                        <div className="text-sm text-gray-400">
                          {answer ? answer.timeTaken : 0}s
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          answer && answer.isCorrect
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {answer && answer.isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatTime(answer ? answer.timeTaken : 0)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-400" />
              Performance Insights
            </h3>
            <div className="space-y-6">
              {/* Accuracy Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Accuracy</span>
                  <span className="text-blue-400 font-bold">
                    {accuracyRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${accuracyRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Speed Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Speed</span>
                  <span className="text-blue-400 font-bold">
                    {Math.min(speedScore, 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(speedScore, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Consistency Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Consistency</span>
                  <span className="text-blue-400 font-bold">
                    {Math.max(consistencyScore, 0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(consistencyScore, 0)}%` }}
                  ></div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Correct Answers:</span>
                    <span className="text-green-400 font-medium">
                      {correctAnswers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Incorrect Answers:</span>
                    <span className="text-red-400 font-medium">
                      {incorrectAnswers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Range:</span>
                    <span className="text-blue-400 font-medium">
                      {formatTime(fastestQuestion)} -{" "}
                      {formatTime(slowestQuestion)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Try Another Quiz
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/quiz/view")}
            className="px-8 py-4 rounded-2xl font-bold bg-gray-800 text-white border border-gray-700 shadow-2xl hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Quizzes
          </motion.button>

          {!saveSuccess && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => saveQuizToDB()}
              disabled={isSaving}
              className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-2xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              )}
              Save Results
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsScreen;
