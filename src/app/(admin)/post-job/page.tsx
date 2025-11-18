"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Briefcase, Calendar, DollarSign, MapPin, Plus, Sparkles, Target, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";

export default function PostJobPage() {
  const router = useRouter();
  const createJob = useMutation(api.jobs.createJob);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    salary: "",
    experienceLevel: "",
    skills: [""],
    deadline: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""]
    }));
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.location || !formData.type || 
        !formData.description || !formData.experienceLevel) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Filter out empty requirements, responsibilities, and skills
    const requirements = formData.requirements.filter(req => req.trim() !== "");
    const responsibilities = formData.responsibilities.filter(resp => resp.trim() !== "");
    const skills = formData.skills.filter(skill => skill.trim() !== "");

    if (requirements.length === 0 || responsibilities.length === 0 || skills.length === 0) {
      toast.error("Please add at least one requirement, responsibility, and skill");
      return;
    }

    setIsSubmitting(true);
    try {
      await createJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type as any,
        description: formData.description,
        requirements,
        responsibilities,
        salary: formData.salary || undefined,
        experienceLevel: formData.experienceLevel as any,
        skills,
        deadline: formData.deadline ? new Date(formData.deadline).getTime() : undefined,
      });

      toast.success("Job posted successfully!");
      router.push("/manage-jobs");
      toast.success("Redirecting to manage jobs...");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/jobs" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </motion.div>

     
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex flex-col items-center justify-center mb-16"
        >
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              <Sparkles size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Find your perfect candidate
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
            Post a{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              New Job
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Create a compelling job posting to attract the best candidates for your team.
          </motion.p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Basic Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl shadow-blue-600/10">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Basic Information</CardTitle>
                    <CardDescription className="text-blue-300">Essential details about the position</CardDescription>
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
                    <Label htmlFor="title" className="text-blue-300 font-medium mb-2 block">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <Label htmlFor="company" className="text-blue-300 font-medium mb-2 block">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="e.g., TechCorp Inc."
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Label htmlFor="location" className="text-blue-300 font-medium mb-2 block">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., San Francisco, CA or Remote"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 pl-10"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <Label htmlFor="type" className="text-blue-300 font-medium mb-2 block">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Label htmlFor="experienceLevel" className="text-blue-300 font-medium mb-2 block">Experience Level *</Label>
                    <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Entry">Entry Level</SelectItem>
                        <SelectItem value="Mid">Mid Level</SelectItem>
                        <SelectItem value="Senior">Senior Level</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <Label htmlFor="salary" className="text-blue-300 font-medium mb-2 block">Salary (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="salary"
                        value={formData.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        placeholder="e.g., $80,000 - $120,000"
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 pl-10"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <Label htmlFor="deadline" className="text-blue-300 font-medium mb-2 block">Application Deadline (Optional)</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange("deadline", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 pl-10"
                      />
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Job Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl shadow-blue-600/10">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Target className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-white">Job Details</CardTitle>
                    <CardDescription className="text-blue-300">Detailed information about the role</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Label htmlFor="description" className="text-blue-300 font-medium mb-2 block">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide a comprehensive description of the role, including what the candidate will be doing..."
                    rows={6}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </motion.div>

                {/* Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Label className="text-blue-300 font-medium mb-3 block">Requirements *</Label>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {formData.requirements.map((req, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-3"
                        >
                          <Input
                            value={req}
                            onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                            placeholder={`Requirement ${index + 1}`}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          />
                          {formData.requirements.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem("requirements", index)}
                              className="border-red-500 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <motion.button
                      type="button"
                      onClick={() => addArrayItem("requirements")}
                      className="w-full py-3 border-2 border-dashed border-blue-500/30 text-blue-400 hover:border-blue-500/50 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Requirement
                    </motion.button>
                  </div>
                </motion.div>

                {/* Responsibilities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Label className="text-blue-300 font-medium mb-3 block">Responsibilities *</Label>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {formData.responsibilities.map((resp, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-3"
                        >
                          <Input
                            value={resp}
                            onChange={(e) => handleArrayChange("responsibilities", index, e.target.value)}
                            placeholder={`Responsibility ${index + 1}`}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          />
                          {formData.responsibilities.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem("responsibilities", index)}
                              className="border-red-500 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <motion.button
                      type="button"
                      onClick={() => addArrayItem("responsibilities")}
                      className="w-full py-3 border-2 border-dashed border-blue-500/30 text-blue-400 hover:border-blue-500/50 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Responsibility
                    </motion.button>
                  </div>
                </motion.div>

                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Label className="text-blue-300 font-medium mb-3 block">Required Skills *</Label>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {formData.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex gap-3"
                        >
                          <Input
                            value={skill}
                            onChange={(e) => handleArrayChange("skills", index, e.target.value)}
                            placeholder={`Skill ${index + 1}`}
                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                          />
                          {formData.skills.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeArrayItem("skills", index)}
                              className="border-red-500 text-red-400 hover:bg-red-500/20 hover:border-red-400"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <motion.button
                      type="button"
                      onClick={() => addArrayItem("skills")}
                      className="w-full py-3 border-2 border-dashed border-blue-500/30 text-blue-400 hover:border-blue-500/50 hover:text-blue-300 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="h-4 w-4" />
                      Add Skill
                    </motion.button>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center gap-3"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Posting Job...
                </>
              ) : (
                <>
                  <Briefcase className="h-5 w-5" />
                  Post Job
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
} 