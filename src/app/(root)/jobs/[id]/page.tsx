"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Building, Clock, DollarSign, Users, Calendar, CheckCircle, ArrowLeft, Sparkles, Briefcase, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { theme } = useTheme();

  const job = useQuery(api.jobs.getJobById, { jobId: jobId as any });
  const userApplication = useQuery(api.jobs.getUserApplicationForJob, { jobId: jobId as any });
  const applyForJob = useMutation(api.jobs.applyForJob);
  const withdrawApplication = useMutation(api.jobs.withdrawApplication);

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

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }

    setIsApplying(true);
    try {
      await applyForJob({
        jobId: jobId as any,
        coverLetter: coverLetter.trim(),
        resume: resumeUrl || undefined,
      });
      
      setIsApplyDialogOpen(false);
      setCoverLetter("");
      setResumeUrl("");
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userApplication) return;
    
    setIsWithdrawing(true);
    try {
      await withdrawApplication({ applicationId: userApplication._id as any });
      toast.success("Application withdrawn successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to withdraw application");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Under Review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Shortlisted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "Hired":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  if (!job) {
    return (
      <div className={`mt-16 ${currenttheme2.bg} min-h-screen flex items-center justify-center transition-colors duration-500`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={currenttheme2.text.secondary}>Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-16 ${currenttheme2.bg} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/jobs" className={`inline-flex items-center gap-2 ${currenttheme2.text.secondary} hover:text-blue-400 mb-6 transition-colors`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </motion.div>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className={`${currenttheme2.card.back} shadow-xl`}>
            <CardHeader>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex gap-2 mb-4">
                    <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                  </div>
                  <CardTitle className={`text-3xl md:text-4xl font-bold ${currenttheme2.text.primary} mb-4`}>
                    {job.title}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-400" />
                      <span className={`font-medium ${currenttheme2.text.primary}`}>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span className={currenttheme2.text.secondary}>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <span className={currenttheme2.text.secondary}>{job.applicationsCount} applications</span>
                    </div>
                  </div>
                </div>
                {userApplication ? (
                  // User has already applied - show status and withdraw button
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Badge className={getApplicationStatusColor(userApplication.status)}>
                        {userApplication.status}
                      </Badge>
                      <span className={`text-sm ${currenttheme2.text.secondary}`}>
                        Applied on {formatDate(userApplication.appliedAt)}
                      </span>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="lg" 
                        variant="outline"
                        onClick={handleWithdraw}
                        disabled={isWithdrawing}
                        className={`${currenttheme2.button.secondary} px-8 py-3 rounded-xl font-medium shadow-lg border-red-500/50 hover:bg-red-500/10 hover:border-red-500`}
                      >
                        {isWithdrawing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                            Withdrawing...
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Withdraw Application
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  // User hasn't applied - show apply button
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="lg" className={`${currenttheme2.button.primary} px-8 py-3 rounded-xl font-medium shadow-lg`}>
                          Apply Now
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className={`max-w-2xl ${currenttheme2.modal} border-0 shadow-2xl`}>
                      <DialogHeader>
                        <DialogTitle className={currenttheme2.text.primary}>Apply for {job.title}</DialogTitle>
                        <DialogDescription className={currenttheme2.text.secondary}>
                          Please provide your cover letter and resume to apply for this position.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="coverLetter" className={currenttheme2.text.secondary}>Cover Letter *</Label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={6}
                            className={`mt-1 ${currenttheme2.input} rounded-xl border-0 focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                        <div>
                          <Label htmlFor="resume" className={currenttheme2.text.secondary}>Resume URL (Optional)</Label>
                          <Input
                            id="resume"
                            type="url"
                            placeholder="https://example.com/resume.pdf"
                            value={resumeUrl}
                            onChange={(e) => setResumeUrl(e.target.value)}
                            className={`mt-1 ${currenttheme2.input} rounded-xl border-0 focus:ring-2 focus:ring-blue-500`}
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsApplyDialogOpen(false)}
                            disabled={isApplying}
                            className={`${currenttheme2.button.secondary} rounded-xl`}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleApply}
                            disabled={isApplying || !coverLetter.trim()}
                            className={`${currenttheme2.button.primary} rounded-xl`}
                          >
                            {isApplying ? "Submitting..." : "Submit Application"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Description */}
              <Card className={`${currenttheme2.card.back} shadow-xl mb-6`}>
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`${currenttheme2.text.secondary} leading-relaxed whitespace-pre-wrap`}>
                    {job.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Requirements */}
              <Card className={`${currenttheme2.card.back} shadow-xl mb-6`}>
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className={currenttheme2.text.secondary}>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Responsibilities */}
              <Card className={`${currenttheme2.card.back} shadow-xl`}>
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className={currenttheme2.text.secondary}>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Job Overview */}
              <Card className={`${currenttheme2.card.back} shadow-xl mb-6`}>
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>Job Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${currenttheme2.text.secondary}`}>Job Type</p>
                      <p className={`font-medium ${currenttheme2.text.primary}`}>{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${currenttheme2.text.secondary}`}>Experience Level</p>
                      <p className={`font-medium ${currenttheme2.text.primary}`}>{job.experienceLevel}</p>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className={`text-sm ${currenttheme2.text.secondary}`}>Salary</p>
                        <p className={`font-medium ${currenttheme2.text.primary}`}>{job.salary}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${currenttheme2.text.secondary}`}>Posted</p>
                      <p className={`font-medium ${currenttheme2.text.primary}`}>{formatDate(job.postedAt)}</p>
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className={`text-sm ${currenttheme2.text.secondary}`}>Application Deadline</p>
                        <p className={`font-medium ${currenttheme2.text.primary}`}>{formatDate(job.deadline)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Required Skills */}
              <Card className={`${currenttheme2.card.back} shadow-xl`}>
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 