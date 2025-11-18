// pages/index.tsx
"use client";
import axios from "axios";
import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Code,
  LightbulbIcon,
  Search,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
import LoaderUI from "@/components/LoaderUI";
import ProfessionalLoader from "@/components/Loader2";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface CodeSnippet {
  lang: string;
  code: string;
}

interface LeetCodeProblem {
  id: string;
  number: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  examples: Example[];
  constraints: string[];
  starterCode: CodeSnippet[];
}
const LANGUAGES = [
  { id: "cpp", name: "C++" },
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
];

// Animation variants
const staggerChildrenVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function LeetCodeProblemFetcher() {
  const [problemNumber, setProblemNumber] = useState("");
  const [problemName, setProblemName] = useState("");
  const [fetching, setFetching] = useState(false);
  const [problem, setProblem] = useState<LeetCodeProblem | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(
    "description",
  );
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isEditing, setIsEditing] = useState(false);
  const createQuestion = useMutation(api.questions.createQuestion);
  const [editableProblem, setEditableProblem] = useState<
    Partial<LeetCodeProblem>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const saveProblemToDataBase = async () => {
    setIsLoading(true);
    try {
      if (!problem) return;

      const problemData = {
        ...problem,
        q_id: problem.id,
      };

      await createQuestion({
        q_id: problem.id,
        number: problem.number,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        examples: problem.examples,
        constraints: problem.constraints,
        starterCode: problem.starterCode,
      });
      //console.log(problemData);
      toast.success("Question created successfully!");
    } catch (error) {
      if (error.message.includes("Unauthorized")) {
        toast.error(
          "You are not authorized to create questions. Please login to create a question.",
        );
        return;
      }
      if (error.message.includes("Question already exists")) {
        toast.error("Question already exists.");
        return;
      }
      toast.error("Failed to create question. Please try again.");
      return;
    } finally {
      setProblem(null);
      setIsLoading(false);
    }
  };
  // Function to toggle sections (examples, constraints, etc.)
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Function to simulate fetching problem
  const fetchProblem = async () => {
    if (!problemName.trim()) return;

    setFetching(true);
    setProblem(null);

    try {
      const res = await axios.post("/api/generate-questions", {
        problem_number: problemNumber,
        problem_description: problemName,
      });
      const data = await res.data;
      //console.log(data);
      setFetching(false);
      setProblem(data);
    } catch (e) {
      setFetching(false);
      toast.error("Failed to fetch problem. Please try again.");
      return;
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditableProblem({ ...problem });
  };

  const saveEdits = () => {
    setProblem({ ...problem, ...editableProblem } as LeetCodeProblem);
    setIsEditing(false);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditableProblem({ ...editableProblem, [field]: value });
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 mt-0">
      <div className="container mx-auto  mt-6 px-4 max-w-4xl py-8">
        {/* Header styled like post-job page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex flex-col items-center justify-center mb-16"
        >
          {/* Blue badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Create & Explore Coding Problems
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
            Create a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              New Problem
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Enter a problem number and name to fetch and explore LeetCode
            problems, or create your own!
          </motion.p>
        </motion.div>

        {/* Form Input Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildrenVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="problem-number"
              >
                Problem Number (Optional)
              </label>
              <input
                id="problem-number"
                type="number"
                value={problemNumber}
                onChange={(e) => setProblemNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. 1"
              />
            </div>
            <div className="md:col-span-7">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                htmlFor="problem-name"
              >
                Problem Name
              </label>
              <input
                id="problem-name"
                type="text"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g. Two Sum"
              />
            </div>
            <div className="md:col-span-2 flex items-end">
              <button
                onClick={fetchProblem}
                disabled={fetching || !problemName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {fetching ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Fetch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
        {fetching && <ProfessionalLoader />}
        {/* Problem Display Section */}
        <AnimatePresence>
          {problem && (
            <motion.div
              key="problem-display"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                {/* Problem Header */}
                <motion.div
                  variants={fadeInUpVariants}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editableProblem.title || ""}
                            onChange={(e) =>
                              handleEditChange("title", e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        ) : (
                          <>
                            {problemNumber}. {problem.title}
                          </>
                        )}
                      </h2>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          delay: 0.2,
                        }}
                      >
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : problem.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Solve this problem using your preferred programming
                      language
                    </p>
                  </div>
                  <motion.div
                    className="flex items-center gap-3"
                    variants={fadeInUpVariants}
                  >
                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none bg-no-repeat bg-right bg-contain cursor-pointer pr-8"
                      style={{
                        backgroundImage:
                          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iY3VycmVudENvbG9yIiBjbGFzcz0iYmkgYmktY2hldnJvbi1kb3duIiB2aWV3Qm94PSIwIDAgMTYgMTYiPgogIDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEuNjQ2IDQuNjQ2YS41LjUgMCAwIDEgLjcwOCAwTDggMTAuMjkzbDUuNjQ2LTUuNjQ3YS41LjUgMCAwIDEgLjcwOC43MDhsLTYgNmEuNS41IDAgMCAxLS43MDggMGwtNi02YS41LjUgMCAwIDEgMC0uNzA4eiIvPgo8L3N2Zz4=')",
                        backgroundSize: "1rem",
                        backgroundPosition: "right 0.5rem center",
                      }}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>

                    {isEditing ? (
                      <button
                        onClick={saveEdits}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button
                        onClick={startEditing}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                      >
                        Edit Problem
                      </button>
                    )}
                  </motion.div>
                </motion.div>

                {/* Problem Description */}
                <motion.div variants={fadeInUpVariants}>
                  <div
                    className={` ${activeSection === "description" ? "" : "bg-white dark:bg-gray-800 "} rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div
                      className="flex flex-row items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-850 dark:bg-gray-850 cursor-pointer"
                      onClick={() => toggleSection("description")}
                    >
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </motion.div>
                      <h3 className="font-medium">Problem Description</h3>
                      <motion.div
                        className="ml-auto"
                        animate={{
                          rotate: activeSection === "description" ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-blue-500" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {activeSection === "description" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="p-4">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {isEditing ? (
                                <textarea
                                  value={editableProblem.description || ""}
                                  onChange={(e) =>
                                    handleEditChange(
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                ></textarea>
                              ) : (
                                <p className="whitespace-pre-line text-base leading-7">
                                  {problem.description}
                                </p>
                              )}
                              <div className="mt-4 font-medium text-blue-700 dark:text-blue-400">
                                Try to solve it optimally in terms of both time
                                and space complexity.
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Problem Examples */}
                <motion.div variants={fadeInUpVariants}>
                  <div
                    className={` ${activeSection === "examples" ? "" : "bg-white dark:bg-gray-800 "} rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div
                      className="flex flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-850 dark:bg-gray-850 cursor-pointer"
                      onClick={() => toggleSection("examples")}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                        </motion.div>
                        <h3 className="font-medium">Examples</h3>
                      </div>
                      <motion.div
                        animate={{
                          rotate: activeSection === "examples" ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-blue-500" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {activeSection === "examples" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="p-4">
                            <div className="space-y-4">
                              {isEditing ? (
                                <div className="space-y-4">
                                  {(editableProblem.examples || []).map(
                                    (example, index) => (
                                      <div
                                        key={index}
                                        className="border border-gray-300 dark:border-gray-600 rounded-md p-4"
                                      >
                                        <div className="mb-2">
                                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Input:
                                          </label>
                                          <input
                                            type="text"
                                            value={example.input}
                                            onChange={(e) => {
                                              const updatedExamples = [
                                                ...(editableProblem.examples ||
                                                  []),
                                              ];
                                              updatedExamples[index] = {
                                                ...example,
                                                input: e.target.value,
                                              };
                                              handleEditChange(
                                                "examples",
                                                updatedExamples,
                                              );
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                          />
                                        </div>
                                        <div className="mb-2">
                                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Output:
                                          </label>
                                          <input
                                            type="text"
                                            value={example.output}
                                            onChange={(e) => {
                                              const updatedExamples = [
                                                ...(editableProblem.examples ||
                                                  []),
                                              ];
                                              updatedExamples[index] = {
                                                ...example,
                                                output: e.target.value,
                                              };
                                              handleEditChange(
                                                "examples",
                                                updatedExamples,
                                              );
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Explanation (optional):
                                          </label>
                                          <textarea
                                            value={example.explanation || ""}
                                            onChange={(e) => {
                                              const updatedExamples = [
                                                ...(editableProblem.examples ||
                                                  []),
                                              ];
                                              updatedExamples[index] = {
                                                ...example,
                                                explanation: e.target.value,
                                              };
                                              handleEditChange(
                                                "examples",
                                                updatedExamples,
                                              );
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white h-20"
                                          />
                                        </div>
                                      </div>
                                    ),
                                  )}
                                  <button
                                    onClick={() => {
                                      const updatedExamples = [
                                        ...(editableProblem.examples || []),
                                        { input: "", output: "" },
                                      ];
                                      handleEditChange(
                                        "examples",
                                        updatedExamples,
                                      );
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                                  >
                                    Add Example
                                  </button>
                                </div>
                              ) : (
                                problem.examples.map((example, index) => (
                                  <motion.div
                                    key={index}
                                    className="space-y-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <p className="font-medium text-sm text-blue-700 dark:text-blue-400">
                                      Example {index + 1}:
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm font-mono">
                                      <div className="font-bold">
                                        Input:{" "}
                                        <span className="font-normal">
                                          {example.input}
                                        </span>
                                      </div>
                                      <div className="font-bold">
                                        Output:{" "}
                                        <span className="font-normal">
                                          {example.output}
                                        </span>
                                      </div>
                                      {example.explanation && (
                                        <div className="pt-2 text-gray-600 dark:text-gray-400 border-t border-blue-100 dark:border-blue-600/30 mt-2">
                                          <span className="font-bold">
                                            Explanation:
                                          </span>{" "}
                                          {example.explanation}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Constraints */}
                <motion.div variants={fadeInUpVariants}>
                  <div
                    className={` ${activeSection === "constraints" ? "" : "bg-white dark:bg-gray-800 "} rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div
                      className="flex flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-850 dark:bg-gray-850 cursor-pointer"
                      onClick={() => toggleSection("constraints")}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <AlertCircle className="h-5 w-5 text-blue-500" />
                        </motion.div>
                        <h3 className="font-medium">Constraints</h3>
                      </div>
                      <motion.div
                        animate={{
                          rotate: activeSection === "constraints" ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-blue-500" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {activeSection === "constraints" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="p-4">
                            {isEditing ? (
                              <div className="space-y-2">
                                {(editableProblem.constraints || []).map(
                                  (constraint, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="text"
                                        value={constraint}
                                        onChange={(e) => {
                                          const updatedConstraints = [
                                            ...(editableProblem.constraints ||
                                              []),
                                          ];
                                          updatedConstraints[index] =
                                            e.target.value;
                                          handleEditChange(
                                            "constraints",
                                            updatedConstraints,
                                          );
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      />
                                      <button
                                        onClick={() => {
                                          const updatedConstraints = [
                                            ...(editableProblem.constraints ||
                                              []),
                                          ];
                                          updatedConstraints.splice(index, 1);
                                          handleEditChange(
                                            "constraints",
                                            updatedConstraints,
                                          );
                                        }}
                                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ),
                                )}
                                <button
                                  onClick={() => {
                                    const updatedConstraints = [
                                      ...(editableProblem.constraints || []),
                                      "",
                                    ];
                                    handleEditChange(
                                      "constraints",
                                      updatedConstraints,
                                    );
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                                >
                                  Add Constraint
                                </button>
                              </div>
                            ) : (
                              <ul className="list-disc pl-5 space-y-2 text-sm">
                                {problem.constraints.map(
                                  (constraint, index) => (
                                    <motion.li
                                      key={index}
                                      className="text-gray-600 dark:text-gray-400"
                                      variants={fadeInUpVariants}
                                    >
                                      <span className="font-mono bg-blue-50 dark:bg-blue-900/20 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300">
                                        {constraint}
                                      </span>
                                    </motion.li>
                                  ),
                                )}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Code Editor */}
                <motion.div variants={fadeInUpVariants}>
                  <div
                    className={` ${activeSection === "code" ? "" : "bg-white dark:bg-gray-800 "} rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div
                      className="flex flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-850 dark:bg-gray-850 cursor-pointer"
                      onClick={() => toggleSection("code")}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Code className="h-5 w-5 text-blue-500" />
                        </motion.div>
                        <h3 className="font-medium">Starter Code</h3>
                      </div>
                      <motion.div
                        animate={{
                          rotate: activeSection === "code" ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-5 w-5 text-blue-500" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {activeSection === "code" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="p-4">
                            {problem.starterCode && (
                              <div className="space-y-4">
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={
                                        problem.starterCode.find(
                                          (snippet) =>
                                            snippet.lang === selectedLanguage,
                                        )?.code ||
                                        "No code snippet available for this language"
                                      }
                                      onChange={(e) => {
                                        const updatedSnippets = [
                                          ...(problem.starterCode || []),
                                        ];
                                        const snippetIndex =
                                          updatedSnippets.findIndex(
                                            (snippet) =>
                                              snippet.lang === selectedLanguage,
                                          );
                                        if (snippetIndex !== -1) {
                                          updatedSnippets[snippetIndex] = {
                                            ...updatedSnippets[snippetIndex],
                                            code: e.target.value,
                                          };
                                          handleEditChange(
                                            "codeSnippets",
                                            updatedSnippets,
                                          );
                                        }
                                      }}
                                      className="w-full h-64 p-4 font-mono text-sm dark:bg-gray-850 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <pre className="dark:bg-gray-850 dark:bg-gray-900 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                      <code className="language-javascript">
                                        {problem.starterCode.find(
                                          (snippet) =>
                                            snippet.lang === selectedLanguage,
                                        )?.code ||
                                          "No code snippet available for this language"}
                                      </code>
                                    </pre>
                                    <button
                                      className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 rounded-md"
                                      onClick={() => {
                                        const code = problem.starterCode.find(
                                          (snippet) =>
                                            snippet.lang === selectedLanguage,
                                        )?.code;
                                        if (code) {
                                          navigator.clipboard
                                            .writeText(code)
                                            .then(() =>
                                              toast.success(
                                                "Code copied to clipboard!",
                                              ),
                                            )
                                            .catch(() =>
                                              alert("Failed to copy code"),
                                            );
                                        }
                                      }}
                                    >
                                      Copy
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Submit Section */}
                <motion.div
                  variants={fadeInUpVariants}
                  className="flex justify-end gap-4 mt-8"
                >
                  <button
                    onClick={() => {
                      saveProblemToDataBase();
                    }}
                    className={`bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 flex items-center gap-2 `}
                    disabled={isLoading}
                  >
                    <span>{isLoading ? "Saving..." : "Add Problem"}</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Problem State */}
        {!fetching && !problem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6"
            >
              <Search className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">
              No Problem Loaded
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enter a problem number above and click "Fetch" to load a LeetCode
              problem
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
