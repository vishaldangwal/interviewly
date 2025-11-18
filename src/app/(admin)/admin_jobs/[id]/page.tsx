"use client";

import ProfessionalLoader from "@/components/Loader2";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import theme2 from "@/constants/theme";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../../convex/_generated/api";
export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { theme } = useTheme();

  const job = useQuery(api.jobs.getJobById, { jobId: jobId as any });
  const { isInterviewer } = useUserRoles();

  const jobApplications = useQuery(api.jobs.getJobApplications, {
    jobId: jobId as any,
  });
  const applyForJob = useMutation(api.jobs.applyForJob);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  // theme2 configuration

  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;
  console.log(isInterviewer);
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
      <div className="flex items-center justify-center h-screen">
        <ProfessionalLoader />
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
          <Link
            href="/manage-jobs"
            className={`inline-flex items-center gap-2 ${currenttheme2.text.secondary} hover:text-blue-400 mb-6 transition-colors`}
          >
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
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    <Badge className={getTypeColor(job.type)}>{job.type}</Badge>
                  </div>
                  <CardTitle
                    className={`text-3xl md:text-4xl font-bold ${currenttheme2.text.primary} mb-4`}
                  >
                    {job.title}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-400" />
                      <span
                        className={`font-medium ${currenttheme2.text.primary}`}
                      >
                        {job.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span className={currenttheme2.text.secondary}>
                        {job.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-400" />
                      <span className={currenttheme2.text.secondary}>
                        {job.applicationsCount} applications
                      </span>
                    </div>
                  </div>
                </div>
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
                  <CardTitle className={currenttheme2.text.primary}>
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className={`${currenttheme2.text.secondary} leading-relaxed whitespace-pre-wrap`}
                  >
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
                  <CardTitle className={currenttheme2.text.primary}>
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className={currenttheme2.text.secondary}>
                          {requirement}
                        </span>
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
                  <CardTitle className={currenttheme2.text.primary}>
                    Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className={currenttheme2.text.secondary}>
                          {responsibility}
                        </span>
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
                  <CardTitle className={currenttheme2.text.primary}>
                    Job Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${currenttheme2.text.secondary}`}>
                        Job Type
                      </p>
                      <p
                        className={`font-medium ${currenttheme2.text.primary}`}
                      >
                        {job.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${currenttheme2.text.secondary}`}>
                        Experience Level
                      </p>
                      <p
                        className={`font-medium ${currenttheme2.text.primary}`}
                      >
                        {job.experienceLevel}
                      </p>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                      <div>
                        <p
                          className={`text-sm ${currenttheme2.text.secondary}`}
                        >
                          Salary
                        </p>
                        <p
                          className={`font-medium ${currenttheme2.text.primary}`}
                        >
                          {job.salary}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className={`text-sm ${currenttheme2.text.secondary}`}>
                        Posted
                      </p>
                      <p
                        className={`font-medium ${currenttheme2.text.primary}`}
                      >
                        {formatDate(job.postedAt)}
                      </p>
                    </div>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <div>
                        <p
                          className={`text-sm ${currenttheme2.text.secondary}`}
                        >
                          Application Deadline
                        </p>
                        <p
                          className={`font-medium ${currenttheme2.text.primary}`}
                        >
                          {formatDate(job.deadline)}
                        </p>
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
                  <CardTitle className={currenttheme2.text.primary}>
                    Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Admin/Interviewer Applications Section */}
        {isInterviewer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto mt-16"
          >
            <Card className={`${currenttheme2.card.back} shadow-2xl`}>
              <CardHeader>
                <CardTitle
                  className={`text-2xl md:text-3xl font-bold ${currenttheme2.text.primary} mb-2 flex items-center gap-3`}
                >
                  <Users className="h-7 w-7 text-blue-400" />
                  Applications for this Job
                </CardTitle>
                <CardDescription className={currenttheme2.text.secondary}>
                  Review all applications submitted for this position.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobApplications === undefined ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : jobApplications.length === 0 ? (
                  <div className="flex flex-col items-center py-16">
                    <Users className="h-16 w-16 text-blue-300 mb-4" />
                    <div
                      className={`text-lg font-semibold ${currenttheme2.text.primary} mb-2`}
                    >
                      No applications yet
                    </div>
                    <div className={currenttheme2.text.secondary}>
                      Applications will appear here once candidates start
                      applying.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {jobApplications.map((application) => (
                      <motion.div
                        key={application._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card
                          className={`${currenttheme2.card.front} border-0 shadow-lg`}
                        >
                          <CardHeader className="flex flex-row justify-between items-center gap-4 pb-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-semibold text-lg ${currenttheme2.card.textFront}`}
                                >
                                  {application.applicant?.name ||
                                    "Unknown Applicant"}
                                </span>
                                <Badge
                                  className={getApplicationStatusColor(
                                    application.status,
                                  )}
                                >
                                  {application.status}
                                </Badge>
                              </div>
                              <span
                                className={`text-xs ${currenttheme2.card.accent}`}
                              >
                                {application.applicant?.email}
                              </span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`text-xs ${currenttheme2.card.accent}`}
                              >
                                Applied on {formatDate(application.appliedAt)}
                              </span>
                              {application.reviewedAt && (
                                <span className="text-xs text-green-400">
                                  Reviewed
                                </span>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 pb-4">
                            <div className="mb-2">
                              <span
                                className={`font-medium ${currenttheme2.card.textFront}`}
                              >
                                Cover Letter:
                              </span>
                              <p
                                className={`mt-1 whitespace-pre-wrap ${currenttheme2.card.textBack} text-sm bg-blue-900/10 dark:bg-blue-900/30 rounded-xl p-3`}
                              >
                                {application.coverLetter}
                              </p>
                            </div>
                            {application.resume && (
                              <div className="mb-2">
                                <span
                                  className={`font-medium ${currenttheme2.card.textFront}`}
                                >
                                  Resume:
                                </span>{" "}
                                <a
                                  href={application.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-300 underline ml-1"
                                >
                                  View Resume
                                </a>
                              </div>
                            )}
                            {application.notes && (
                              <div className="mt-2">
                                <span
                                  className={`font-medium ${currenttheme2.card.textFront}`}
                                >
                                  Notes:
                                </span>
                                <p
                                  className={`mt-1 text-xs ${currenttheme2.card.textBack} bg-yellow-900/10 dark:bg-yellow-900/30 rounded-xl p-2`}
                                >
                                  {application.notes}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
