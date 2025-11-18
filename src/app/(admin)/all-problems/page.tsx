"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Code, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PlusCircle } from "react-feather";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface CodeSnippet {
  lang: string;
  code: string;
}

const sampleProblems = [
  {
    q_id: "two-sum",
    number: 1,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: [
      {
        lang: "javascript",
        code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
      },
    ],
  },
  // Other sample problems...
];

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  hover: {
    y: -10,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
};

// New animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export default function ProblemViewer() {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Fetch problems from Convex
  const fetchedProblems = useQuery(api.questions.getAllQuestions);
  const [activeTab, setActiveTab] = useState(0);
  // Use sample problems if fetched problems are not available yet
  const allProblems = fetchedProblems || sampleProblems;

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedProblem) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedProblem]);

  // Filter problems based on search query and difficulty
  const filteredProblems = allProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.q_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "All" || problem.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return theme === "light" ? "text-green-600" : "text-green-400";
      case "Medium":
        return theme === "light" ? "text-yellow-600" : "text-yellow-400";
      case "Hard":
        return theme === "light" ? "text-red-600" : "text-red-400";
      default:
        return theme === "light" ? "text-gray-600" : "text-gray-400";
    }
  };

  const handleCardClick = (problem) => {
    setSelectedProblem(problem);
  };

  const closeModal = () => {
    setSelectedProblem(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 mt-16`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with theme toggle */}
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <Code size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <Code size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Create your own problems
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Coding Problems
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              {" "}
              for interview
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Craft problem to test the interviewer's skills.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4"
          >
            <Button
              variant="ghost"
              className="hover:opacity-90 transition-all duration-300"
              style={{ backgroundColor: "#2563eb", color: "white" }}
              onClick={() => router.push("/create-problem")}
            >
              <PlusCircle className="mr-2" />
              Add Problem
            </Button>
          </motion.div>
        </div>

        {/* Search and filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div
            className={`bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg px-6 py-6 flex flex-col gap-4`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-3 w-full rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === "light" ? "bg-white border-blue-300 text-blue-800" : "bg-slate-900 border-slate-700 text-blue-200"}`}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter("All");
                }}
                className={`px-4 py-3 rounded-xl font-medium flex items-center shadow-lg w-full md:w-auto justify-center ${theme === "light" ? "bg-white hover:bg-gray-50 text-blue-800 border border-blue-200 shadow-sm" : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"}`}
              >
                Clear Filters
              </motion.button>
            </div>
            {/* Difficulty filter chips */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {["All", "Easy", "Medium", "Hard"].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    difficultyFilter === level
                      ? "bg-blue-600 text-white shadow-md shadow-indigo-500/20"
                      : theme === "light"
                        ? "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level === "All" ? "All Difficulties" : level}
                </motion.button>
              ))}
            </div>
            {/* Results counter */}
            <p
              className={`${theme === "light" ? "text-blue-600" : "text-blue-200"} text-sm pt-2 border-t border-blue-100 dark:border-blue-900`}
            >
              Showing {filteredProblems.length} problems
              {difficultyFilter !== "All"
                ? ` of ${difficultyFilter} difficulty`
                : null}
              {searchQuery ? ` matching "${searchQuery}"` : null}
            </p>
          </div>
        </motion.div>

        {/* Problem cards with animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.q_id}
                custom={index}
                variants={cardVariants as any}
                whileHover="hover"
                onClick={() => handleCardClick(problem)}
                className={`rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform ${
                  theme === "light"
                    ? "bg-white border border-gray-200 hover:border-blue-300"
                    : "bg-gray-800 border border-gray-700 hover:border-blue-500"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        theme === "light"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-blue-900 text-blue-200"
                      }`}
                    >
                      #{problem.number}
                    </span>
                    <span
                      className={`font-medium ${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-gray-800" : "text-white"}`}
                  >
                    {problem.title}
                  </h3>
                  <p
                    className={`line-clamp-3 mb-4 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
                  >
                    {problem.description}
                  </p>
                  <div className="flex justify-end mt-4">
                    <motion.span
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      View Details <ChevronDown className="ml-1 h-4 w-4" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p
                className={`text-lg ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
              >
                No problems found matching your criteria.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Problem detail modal with animation */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeModal}
            >
              <motion.div
                className={`rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col ${
                  theme === "light" ? "bg-white" : "bg-gray-900"
                }`}
                variants={modalVariants as any}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`flex justify-between items-center p-6 border-b ${
                    theme === "light" ? "border-gray-200" : "border-gray-700"
                  }`}
                >
                  <div>
                    <div className="flex gap-2 items-center mb-2">
                      <motion.span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          theme === "light"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-blue-900 text-blue-200"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        #{selectedProblem.number}
                      </motion.span>
                      <motion.span
                        className={`font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {selectedProblem.difficulty}
                      </motion.span>
                    </div>
                    <motion.h2
                      className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {selectedProblem.title}
                    </motion.h2>
                  </div>
                  <motion.button
                    onClick={closeModal}
                    className={`p-2 rounded-full transition-colors ${
                      theme === "light"
                        ? "text-gray-500 hover:bg-gray-100"
                        : "text-gray-400 hover:bg-gray-800"
                    }`}
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose max-w-none">
                    <motion.h3
                      className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-gray-800" : "text-blue-400"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Problem Description
                    </motion.h3>
                    <motion.p
                      className={`mb-6 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {selectedProblem.description}
                    </motion.p>

                    <motion.h3
                      className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-gray-800" : "text-blue-400"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Examples
                    </motion.h3>
                    {selectedProblem.examples.map((example, index) => (
                      <motion.div
                        key={index}
                        className={`mb-4 p-4 rounded-lg ${
                          theme === "light" ? "bg-blue-50" : "bg-gray-800"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="mb-2">
                          <span
                            className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            Input:
                          </span>
                          <span
                            className={
                              theme === "light"
                                ? "text-gray-800"
                                : "text-gray-300"
                            }
                          >
                            {" "}
                            {example.input}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span
                            className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            Output:
                          </span>
                          <span
                            className={
                              theme === "light"
                                ? "text-gray-800"
                                : "text-gray-300"
                            }
                          >
                            {" "}
                            {example.output}
                          </span>
                        </div>
                        {example.explanation && (
                          <div>
                            <span
                              className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                            >
                              Explanation:
                            </span>
                            <span
                              className={
                                theme === "light"
                                  ? "text-gray-800"
                                  : "text-gray-300"
                              }
                            >
                              {" "}
                              {example.explanation}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    <motion.h3
                      className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-gray-800" : "text-blue-400"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Constraints
                    </motion.h3>
                    <motion.ul
                      className={`list-disc pl-6 mb-6 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {selectedProblem.constraints.map((constraint, index) => (
                        <motion.li
                          key={index}
                          className="mb-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                        >
                          {constraint}
                        </motion.li>
                      ))}
                    </motion.ul>

                    <motion.h3
                      className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-gray-800" : "text-blue-400"}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      Starter Code
                    </motion.h3>

                    <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                      {/* Tab Navigation */}
                      <div className="flex overflow-x-auto bg-gray-100 dark:bg-gray-900">
                        {selectedProblem.starterCode.map((starter, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                              activeTab === index
                                ? "bg-white dark:bg-gray-800 border-b-2 border-blue-500 font-medium"
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            <Code
                              size={18}
                              className={
                                theme === "light"
                                  ? "text-blue-600"
                                  : "text-blue-400"
                              }
                            />
                            <span
                              className={
                                theme === "light"
                                  ? "text-gray-900"
                                  : "text-white"
                              }
                            >
                              {starter.lang}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="w-full overflow-hidden">
                        {selectedProblem.starterCode.map((starter, index) => (
                          <div
                            key={index}
                            className={`${activeTab === index ? "block" : "hidden"}`}
                          >
                            <pre
                              className={`p-4 rounded-b-lg overflow-x-auto font-mono text-sm ${
                                theme === "light"
                                  ? "bg-gray-900 text-gray-100"
                                  : "bg-gray-950 text-gray-100"
                              }`}
                            >
                              {starter.code}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`px-6 py-4 flex justify-end border-t ${
                    theme === "light" ? "border-gray-200" : "border-gray-700"
                  }`}
                >
                  <motion.button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200"
                    onClick={closeModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
