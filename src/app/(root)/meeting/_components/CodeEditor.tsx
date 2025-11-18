import { CODING_QUESTIONS01, LANGUAGES } from "@/constants";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InterviewNotesApp from "@/app/(root)/meeting/_components/Notes";
import {
  AlertCircleIcon,
  BookIcon,
  LightbulbIcon,
  ChevronDownIcon,
  CheckIcon,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import convertQuestionFormat from "../utils";
import { useUserRoles } from "@/hooks/useUserRoles";

function CodeEditor({ questions }: { questions: any }) {
  let CODING_QUESTIONS = convertQuestionFormat(questions);
  if (questions.length === 0) {
    CODING_QUESTIONS = CODING_QUESTIONS01;
  }
  const { isInterviewer, isCandidate } = useUserRoles();
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<
    "javascript" | "python" | "java" | "cpp"
  >(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion?.starterCode[language]);
  const [activeSection, setActiveSection] = useState<
    "examples" | "constraints" | null
  >(null);
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
    setActiveSection(null);
  };

  const handleLanguageChange = (
    newLanguage: "javascript" | "python" | "java",
  ) => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const toggleSection = (section: "examples" | "constraints") => {
    setActiveSection(activeSection === section ? null : section);
  };

  const getCardHeaderStyle = () => {
    return isDarkMode
      ? "bg-zinc-900"
      : "bg-gradient-to-r from-blue-50 to-transparent";
  };

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[calc(100vh-4rem-1px)]"
    >
      {/* QUESTION SECTION */}
      <ResizablePanel>
        <ScrollArea className="h-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildrenVariants}
            className="p-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <motion.div
                variants={fadeInUpVariants}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
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
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                        Challenge
                      </Badge>
                    </motion.div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose your language and solve the problem
                  </p>
                </div>
                <motion.div
                  className="flex items-center gap-3"
                  variants={fadeInUpVariants}
                >
                  <Select
                    value={selectedQuestion.id}
                    onValueChange={handleQuestionChange}
                  >
                    <SelectTrigger className="w-[180px] border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem
                          key={q.id}
                          value={q.id}
                          className="focus:bg-blue-100 focus:text-blue-900"
                        >
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px] border-blue-200 focus:ring-blue-500">
                      {/* SELECT VALUE */}
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    {/* SELECT CONTENT */}
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem
                          key={lang.id}
                          value={lang.id}
                          className="focus:bg-blue-100 focus:text-blue-900"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </motion.div>

              {/* PROBLEM DESC. */}
              <motion.div variants={fadeInUpVariants}>
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-blue-100 dark:border-zinc-800">
                  <CardHeader
                    className={`flex flex-row items-center gap-2 ${getCardHeaderStyle()}`}
                  >
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookIcon className="h-5 w-5 text-blue-600" />
                    </motion.div>
                    <CardTitle>Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed py-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line text-base leading-7">
                        {selectedQuestion.description}
                      </p>
                      <div className="mt-4 font-medium text-blue-700 dark:text-blue-400">
                        Try to solve it optimally in terms of both time and
                        space complexity.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* PROBLEM EXAMPLES */}
              <motion.div variants={fadeInUpVariants}>
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-blue-100 dark:border-zinc-800">
                  <CardHeader
                    className={`flex flex-row items-center justify-between cursor-pointer ${getCardHeaderStyle()}`}
                    onClick={() => toggleSection("examples")}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                      </motion.div>
                      <CardTitle>Examples</CardTitle>
                    </div>
                    <motion.div
                      animate={{
                        rotate: activeSection === "examples" ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDownIcon className="h-5 w-5 text-blue-500" />
                    </motion.div>
                  </CardHeader>
                  <AnimatePresence>
                    {activeSection === "examples" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <CardContent className="pt-2 pb-4">
                          <ScrollArea className="h-full w-full rounded-md border border-blue-100 dark:border-zinc-700">
                            <div className="p-4 space-y-4">
                              {selectedQuestion.examples.map(
                                (example, index) => (
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
                                    <ScrollArea className="h-full w-full rounded-md">
                                      <pre className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm font-mono">
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
                                          <div className="pt-2 text-muted-foreground border-t border-blue-100 dark:border-blue-600/30 mt-2">
                                            <span className="font-bold">
                                              Explanation:
                                            </span>{" "}
                                            {example.explanation}
                                          </div>
                                        )}
                                      </pre>
                                      <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                  </motion.div>
                                ),
                              )}
                            </div>
                            <ScrollBar />
                          </ScrollArea>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && (
                <motion.div variants={fadeInUpVariants}>
                  <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-blue-100 dark:border-zinc-800">
                    <CardHeader
                      className={`flex flex-row items-center justify-between cursor-pointer ${getCardHeaderStyle()}`}
                      onClick={() => toggleSection("constraints")}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                        </motion.div>
                        <CardTitle>Constraints</CardTitle>
                      </div>
                      <motion.div
                        animate={{
                          rotate: activeSection === "constraints" ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDownIcon className="h-5 w-5 text-blue-500" />
                      </motion.div>
                    </CardHeader>
                    <AnimatePresence>
                      {activeSection === "constraints" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                        >
                          <CardContent className="pt-2 pb-4">
                            <motion.ul
                              className="list-disc pl-5 space-y-2 text-sm"
                              variants={staggerChildrenVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {selectedQuestion.constraints.map(
                                (constraint, index) => (
                                  <motion.li
                                    key={index}
                                    className="text-muted-foreground"
                                    variants={fadeInUpVariants}
                                  >
                                    <span className="font-mono bg-blue-50 dark:bg-blue-900/20 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300">
                                      {constraint}
                                    </span>
                                  </motion.li>
                                ),
                              )}
                            </motion.ul>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle>
        <div className="h-4 w-full flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="bg-blue-400 h-1 w-6 rounded-full"
          />
        </div>
      </ResizableHandle>

      {/* CODE EDITOR */}
      <ResizablePanel defaultSize={60} maxSize={100}>
        <motion.div
          className="h-full relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isCandidate ? (
            <motion.div
              className="h-full relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Editor
                height={"100%"}
                defaultLanguage={language}
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value: any) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 18,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  wordWrap: "on",
                  wrappingIndent: "indent",
                }}
              />
            </motion.div>
          ) : (
            <div className="h-full w-full">
              <InterviewNotesApp />
            </div>
          )}

          {/* <motion.div
            className="absolute bottom-4 right-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
              onClick={() =>
                toast.success("Interviewer Informed Succesfully", {
                  position: "top-center",
                  style: {
                    background: "#000000", // Green background
                    color: "#fff", // White text
                  },
                  iconTheme: {
                    primary: "#7c3aed", // blue icon
                    secondary: "#fff",
                  },
                })
              }
              disabled={!isInterviewer}
            >
              <CheckIcon className="h-4 w-4" />
              {isCandidate ? "Submit Solution" : "View Notes"}
            </motion.button>
          </motion.div> */}
        </motion.div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default CodeEditor;
