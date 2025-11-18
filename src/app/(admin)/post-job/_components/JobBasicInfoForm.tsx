import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Calendar, DollarSign, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

type JobBasicInfoFormProps = {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
};

export function JobBasicInfoForm({ formData, handleInputChange }: JobBasicInfoFormProps) {
  return (
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
            {/* Job Title */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
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
            {/* Company Name */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
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
            {/* Location */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
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
            {/* Job Type */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
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
            {/* Experience Level */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
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
            {/* Salary */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
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
            {/* Deadline */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
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
  );
} 