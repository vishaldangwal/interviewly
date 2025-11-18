import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Code,
  User,
  Briefcase,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Clock,
  Target,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export const Timeline = ({
  currentStep,
  prevStep,
  nextStep,
  isLoading,
  getButtonText,
  jobTitle,
  setJobTitle,
  companyName,
  setCompanyName,
  jobLevel,
  setJobLevel,
  userSkills,
  setUserSkills,
  newSkill,
  setNewSkill,
  addUserSkill,
  steps,
  pageVariants,
  loaderVariants,
  getSkillIcon,
  newRequiredSkill,
  setNewRequiredSkill,
  addRequiredSkill,
  requiredSkills,
  skillsToImprove,
  hoursPerDay,
  prepDays,
  setPrepDays,
  setHoursPerDay,
  setRequiredSkills,
}: any) => {
  return (
    <div className="min-h-screen max-w-screen-lg mx-auto">
      {" "}
      <motion.div
        key="prep-form"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="space-y-8"
      >
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-8">
                {steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                        currentStep > step.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : currentStep === step.id
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                            : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle size={20} />
                      ) : (
                        <step.icon size={20} />
                      )}
                    </motion.div>
                    <span className="text-xs mt-2 text-gray-600 dark:text-gray-400 font-medium text-center">
                      {step.title}
                    </span>

                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div className="absolute top-6 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
                        <motion.div
                          className="h-full bg-blue-600"
                          initial={{ width: "0%" }}
                          animate={{
                            width: currentStep > step.id ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Job Information
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Essential details about the position
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Label
                        htmlFor="title"
                        className="text-gray-700 dark:text-gray-300 font-medium mb-2 block"
                      >
                        Job Title *
                      </Label>
                      <Input
                        id="title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Label
                        htmlFor="company"
                        className="text-gray-700 dark:text-gray-300 font-medium mb-2 block"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g., Google, Microsoft"
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <Label
                        htmlFor="level"
                        className="text-gray-700 dark:text-gray-300 font-medium mb-2 block"
                      >
                        Job Level *
                      </Label>
                      <Select value={jobLevel} onValueChange={setJobLevel}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select job level" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                          <SelectItem value="Junior">Junior</SelectItem>
                          <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  {/* Quick Select */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-6"
                  >
                    <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3 block">
                      Quick Select
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        "Frontend Developer",
                        "React Developer",
                        "Full Stack Engineer",
                        "UX Designer",
                        "Product Manager",
                        "Data Scientist",
                      ].map((job, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setJobTitle(job)}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                            jobTitle === job
                              ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300"
                              : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {job}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Skills
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        What technologies and skills do you already know?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3 block">
                      Add Your Skills
                    </Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="e.g. React, TypeScript, Node.js"
                          className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addUserSkill();
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={addUserSkill}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        Add
                      </Button>
                    </div>
                  </motion.div>

                  {/* Skills list */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-4 flex items-center gap-2">
                      Your Skills ({userSkills.length})
                      {userSkills.length > 0 && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                          {userSkills.length}
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {userSkills.length === 0 ? (
                        <div className="w-full text-center py-8">
                          <div className="text-gray-400 mb-2">
                            <Code size={48} className="mx-auto" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            No skills added yet. Start by adding your technical
                            skills above.
                          </p>
                        </div>
                      ) : (
                        userSkills.map((skill, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                          >
                            {getSkillIcon(skill)}
                            {skill}
                            <button
                              onClick={() => {
                                setUserSkills(
                                  userSkills.filter((s) => s !== skill),
                                );
                              }}
                              className="ml-1 text-blue-500 hover:text-blue-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>

                  {/* Common skills suggestions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                      Popular Skills for {jobTitle || "this position"}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "JavaScript",
                        "React",
                        "TypeScript",
                        "CSS",
                        "HTML",
                        "Redux",
                        "Node.js",
                        "API Integration",
                        "Git",
                        "AWS",
                        "Docker",
                        "Python",
                      ].map(
                        (skill, idx) =>
                          !userSkills.includes(skill) && (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() =>
                                setUserSkills([...userSkills, skill])
                              }
                              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-300 dark:border-gray-700 transition-all duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                              {skill}
                            </motion.button>
                          ),
                      )}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Required Skills
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        What skills does the job require?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Label className="text-gray-700 dark:text-gray-300 font-medium mb-3 block">
                      Add Required Skills
                    </Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          value={newRequiredSkill}
                          onChange={(e) => setNewRequiredSkill(e.target.value)}
                          placeholder="e.g. Redux, GraphQL, Testing"
                          className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              addRequiredSkill();
                            }
                          }}
                        />
                      </div>
                      <Button
                        onClick={addRequiredSkill}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      >
                        Add
                      </Button>
                    </div>
                  </motion.div>

                  {/* Required Skills list */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-4 flex items-center gap-2">
                      Required Skills ({requiredSkills.length})
                      {requiredSkills.length > 0 && (
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                          {requiredSkills.length}
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {requiredSkills.length === 0 ? (
                        <div className="w-full text-center py-8">
                          <div className="text-gray-400 mb-2">
                            <AlertCircle size={48} className="mx-auto" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            No required skills added yet. Add the skills the job
                            requires.
                          </p>
                        </div>
                      ) : (
                        requiredSkills.map((skill, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                          >
                            {getSkillIcon(skill)}
                            {skill}
                            <button
                              onClick={() =>
                                setRequiredSkills(
                                  requiredSkills.filter((s) => s !== skill),
                                )
                              }
                              className="ml-1 text-purple-500 hover:text-purple-700 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>

                  {/* Skill gap visualization */}
                  {requiredSkills.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                    >
                      <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-4 flex items-center gap-2">
                        <AlertCircle size={18} className="text-orange-500" />
                        Skills Gap Analysis
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Required:
                          </div>
                          <div className="flex-1 flex flex-wrap gap-2">
                            {requiredSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                  userSkills.includes(skill)
                                    ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
                                    : "bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 text-xs font-semibold text-gray-600 dark:text-gray-400">
                            Missing:
                          </div>
                          <div className="flex-1">
                            {skillsToImprove.length === 0 ? (
                              <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-2">
                                <CheckCircle size={14} />
                                Perfect! You have all required skills
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {skillsToImprove.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-lg text-xs font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        Time Planning
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        How much time can you dedicate to preparation?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Label
                        htmlFor="days"
                        className="text-gray-700 dark:text-gray-300 font-medium mb-2 block"
                      >
                        Days until interview
                      </Label>
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        max="30"
                        value={prepDays}
                        onChange={(e) => setPrepDays(parseInt(e.target.value))}
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <Label
                        htmlFor="hours"
                        className="text-gray-700 dark:text-gray-300 font-medium mb-2 block"
                      >
                        Hours per day
                      </Label>
                      <Input
                        id="hours"
                        type="number"
                        min="1"
                        max="10"
                        value={hoursPerDay}
                        onChange={(e) =>
                          setHoursPerDay(parseInt(e.target.value))
                        }
                        className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 flex items-start gap-4">
                      <AlertCircle
                        className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                          Your study plan will include{" "}
                          <span className="font-semibold text-blue-800 dark:text-blue-200">
                            {prepDays} days
                          </span>{" "}
                          with{" "}
                          <span className="font-semibold text-blue-800 dark:text-blue-200">
                            {hoursPerDay} hours
                          </span>{" "}
                          of focused preparation each day.
                          {skillsToImprove.length > 0 && (
                            <>
                              <br />
                              <span className="font-semibold mt-2 inline-block text-orange-600 dark:text-orange-400">
                                Skills to focus on: {skillsToImprove.join(", ")}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-between"
        >
          {currentStep > 1 ? (
            <Button onClick={prevStep} variant="outline" className="px-6 py-3">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          <Button
            onClick={nextStep}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <motion.div
                variants={loaderVariants as any}
                animate="animate"
                className="mr-2"
              >
                <Loader2 size={20} />
              </motion.div>
            ) : null}
            {getButtonText()}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
