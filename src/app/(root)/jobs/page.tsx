"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Building, Clock, DollarSign, Users, Sparkles, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [offset, setOffset] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const { theme } = useTheme();
  const limit = 10;

  const jobs = useQuery(api.jobs.getAllActiveJobs, {
    limit,
    offset,
    type: selectedType === "all" ? undefined : selectedType as any,
    experienceLevel: selectedExperience === "all" ? undefined : selectedExperience as any,
  });

  const searchResults = useQuery(api.jobs.searchJobs, {
    query: searchQuery,
    limit,
    offset: 0,
  });

  const displayJobs = searchQuery ? searchResults?.jobs : jobs?.jobs;
  const hasMore = searchQuery ? searchResults?.hasMore : jobs?.hasMore;

  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
  }, []);

  // theme2 configuration
  const theme2 = {
    dark: {
      bg: "",
      card: {
        front: "bg-gradient-to-br from-blue-700 to-indigo-800 shadow-lg shadow-blue-500/30",
        back: "bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/40 shadow-lg shadow-blue-500/10",
        textFront: "text-white",
        textBack: "text-blue-100",
        accent: "text-blue-300",
      },
      button: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
        secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
      },
      text: {
        primary: "text-white",
        secondary: "text-blue-200",
      },
      input: "bg-slate-900 border-slate-700 text-blue-200 focus:border-blue-500 focus:ring-blue-500",
      modal: "bg-slate-900 border border-blue-800",
    },
    light: {
      bg: "",
      card: {
        front: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-200",
        back: "bg-white border border-blue-200 shadow-xl shadow-blue-100/50",
        textFront: "text-white",
        textBack: "text-gray-900",
        accent: "text-blue-600",
      },
      button: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
        secondary: "bg-white hover:bg-gray-50 text-blue-800 border border-blue-200 shadow-sm",
      },
      text: {
        primary: "text-gray-900",
        secondary: "text-blue-600",
      },
      input: "bg-white border-blue-300 text-blue-800 focus:border-blue-500 focus:ring-blue-500",
      modal: "bg-white border border-blue-200",
    },
  };
  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800";
      case "Part-time":
        return "bg-purple-100 text-purple-800";
      case "Contract":
        return "bg-orange-100 text-orange-800";
      case "Internship":
        return "bg-green-100 text-green-800";
      case "Remote":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const jobTypes = ["all", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const experienceLevels = ["all", "Entry", "Mid", "Senior", "Lead", "Executive"];

  return (
    <div className={`mt-16 ${currenttheme2.bg} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
     
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <Briefcase size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <Briefcase size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Find your dream job
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
            Job{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Opportunities
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover opportunities that match your skills and aspirations
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg px-6 py-6 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-3 w-full rounded-xl ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedExperience("all");
                  setOffset(0);
                }}
                className={`${currenttheme2.button.secondary} px-4 py-3 rounded-xl font-medium flex items-center shadow-lg w-full md:w-auto justify-center`}
              >
                Clear Filters
              </motion.button>
            </div>
            {/* Filter Chips Row */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {jobTypes.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedType === type
                      ? "bg-blue-600 text-white shadow-md shadow-indigo-500/20"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type === "all" ? "All Types" : type}
                </motion.button>
              ))}
              {/* Experience filter chips */}
              {experienceLevels.map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setSelectedExperience(level)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedExperience === level
                      ? "bg-blue-600 text-white shadow-md shadow-indigo-500/20"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level === "all" ? "All Levels" : level}
                </motion.button>
              ))}
            </div>
            {/* Results counter */}
            <p className={`${currenttheme2.text.secondary} text-sm pt-2 border-t border-blue-100 dark:border-blue-900`}>Showing {displayJobs?.length || 0} jobs{selectedType !== "all" ? ` of type ${selectedType}` : null}{selectedExperience !== "all" ? ` at ${selectedExperience} level` : null}{searchQuery ? ` matching "${searchQuery}"` : null}</p>
          </div>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <AnimatePresence mode="popLayout">
            {displayJobs?.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className={`h-full hover:shadow-lg transition-all duration-300 ${currenttheme2.card.back} flex flex-col`}> 
                  <CardHeader className="flex-shrink-0">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                      <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                    </div>
                    <CardTitle className={`text-lg font-semibold ${currenttheme2.text.primary} line-clamp-2`}>{job.title}</CardTitle>
                    <CardDescription className={`flex items-center gap-2 ${currenttheme2.text.secondary}`}>
                      <Building className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{job.company}</span>
                    </CardDescription>
                    <CardDescription className={`flex items-center gap-2 ${currenttheme2.text.secondary}`}>
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-grow">
                    <p className={`${currenttheme2.text.secondary} text-sm mb-4 line-clamp-3 flex-grow`}>{job.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-shrink-0">
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{job.applicationsCount} applications</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{job.skills.length - 3} more</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-auto flex-shrink-0">
                      <span className="text-xs text-gray-500">Posted {formatDate(job.postedAt)}</span>
                      <Link href={`/jobs/${job._id}`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className={currenttheme2.button.primary}>View Details</Button>
                        </motion.div>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {hasMore && (
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => setOffset(offset + limit)}
                className={`${currenttheme2.button.primary} px-8 py-3 rounded-xl font-medium`}
              >
                Load More Jobs
              </Button>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {displayJobs?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-20 ${currenttheme2.text.secondary}`}
          >
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className={`text-xl font-semibold ${currenttheme2.text.primary} mb-2`}>No jobs found</h3>
            <p className={currenttheme2.text.secondary}>
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 