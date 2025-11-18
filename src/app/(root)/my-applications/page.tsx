"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import theme2 from "@/constants/theme";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  Clock,
  Eye,
  FileText,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";

export default function MyApplicationsPage() {
  const [offset, setOffset] = useState(0);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<any>(null);
  const limit = 10;
  const { theme } = useTheme();

  const applicationsQuery = useQuery(api.jobs.getMyApplications, {
    limit,
    offset,
  });
  const withdrawApplication = useMutation(api.jobs.withdrawApplication);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  // theme2 configuration matching flashcard page

  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return "⏳";
      case "Under Review":
        return "👀";
      case "Shortlisted":
        return "✅";
      case "Rejected":
        return "❌";
      case "Hired":
        return "🎉";
      default:
        return "📋";
    }
  };

  const handleWithdrawClick = (application: any) => {
    setApplicationToWithdraw(application);
    setIsWithdrawModalOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!applicationToWithdraw) return;

    setWithdrawingId(applicationToWithdraw._id);
    try {
      await withdrawApplication({ applicationId: applicationToWithdraw._id });
      toast.success("Application withdrawn successfully");
      setIsWithdrawModalOpen(false);
      setApplicationToWithdraw(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to withdraw application",
      );
    } finally {
      setWithdrawingId(null);
    }
  };

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
              Track your applications
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
            My Applications{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              & Status
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Monitor and track the progress of your job applications.
          </motion.p>
        </div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </motion.div>
        {applicationsQuery?.applications &&
          applicationsQuery.applications.length > 0 && (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card
                className={`${theme === "dark" ? "bg-slate-900/50 border-blue-500/20" : "bg-white border-blue-200"}`}
              >
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>
                    Application Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {applicationsQuery.total}
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Total Applications
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          applicationsQuery.applications.filter(
                            (app) => app.status === "Pending",
                          ).length
                        }
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Pending
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {
                          applicationsQuery.applications.filter(
                            (app) => app.status === "Under Review",
                          ).length
                        }
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Under Review
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          applicationsQuery.applications.filter(
                            (app) => app.status === "Shortlisted",
                          ).length
                        }
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Shortlisted
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {
                          applicationsQuery.applications.filter(
                            (app) => app.status === "Hired",
                          ).length
                        }
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Hired
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {/* Applications List */}
        <div className="space-y-6 mt-6">
          <AnimatePresence mode="popLayout">
            {applicationsQuery?.applications?.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`hover:shadow-lg transition-all duration-300 ${theme === "dark" ? "bg-slate-900/50 border-blue-500/20" : "bg-white border-blue-200"}`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {getStatusIcon(application.status)}
                          </span>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                        <CardTitle
                          className={`text-xl font-semibold mb-2 ${currenttheme2.text.primary}`}
                        >
                          {application.job?.title}
                        </CardTitle>
                        <div
                          className={`flex items-center gap-6 mb-2 ${currenttheme2.text.secondary}`}
                        >
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">
                              {application.job?.company}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{application.job?.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Link href={`/jobs/${application.jobId}`}>
                          <Button
                            variant="outline"
                            size="default"
                            className={`${currenttheme2.button.secondary} border-blue-500/30 bg-blue-600 hover:bg-blue-700 text-white w-32`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Job
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="default"
                          disabled={withdrawingId === application._id}
                          onClick={() => handleWithdrawClick(application)}
                          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-32"
                        >
                          {withdrawingId === application._id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Withdrawing...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                              Withdraw
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Application Details */}
                      <div className="space-y-4">
                        <div>
                          <h4
                            className={`font-medium mb-2 ${currenttheme2.text.primary}`}
                          >
                            Application Details
                          </h4>
                          <div
                            className={`space-y-2 text-sm ${currenttheme2.text.secondary}`}
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Applied: {formatDate(application.appliedAt)}
                              </span>
                            </div>
                            {application.reviewedAt && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Reviewed: {formatDate(application.reviewedAt)}
                                </span>
                              </div>
                            )}
                            {application.resume && (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <a
                                  href={application.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                >
                                  View Resume
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remark for Shortlisted */}
                        {application.status === "Shortlisted" && (
                          <div
                            className={`p-3 rounded-md ${theme === "dark" ? "bg-blue-900/30 text-blue-200" : "bg-blue-50 text-blue-700"} flex items-center gap-2`}
                          >
                            <Sparkles className="h-4 w-4 text-blue-400" />
                            <span>
                              You might get to have an interview soon. Keep
                              checking your emails.
                            </span>
                          </div>
                        )}
                        {/* Cover Letter Preview */}
                        <div>
                          <h4
                            className={`font-medium mb-2 ${currenttheme2.text.primary}`}
                          >
                            Cover Letter
                          </h4>
                          <p
                            className={`text-sm line-clamp-3 ${currenttheme2.text.secondary}`}
                          >
                            {application.coverLetter}
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={() => {
                              setSelectedCoverLetter(application.coverLetter);
                              setIsCoverLetterModalOpen(true);
                            }}
                          >
                            Read full cover letter
                          </Button>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-4">
                        <div>
                          <h4
                            className={`font-medium mb-2 ${currenttheme2.text.primary}`}
                          >
                            Job Details
                          </h4>
                          <div
                            className={`space-y-2 text-sm ${currenttheme2.text.secondary}`}
                          >
                            <div>
                              <span className="font-medium">Type:</span>{" "}
                              {application.job?.type}
                            </div>
                            <div>
                              <span className="font-medium">
                                Experience Level:
                              </span>{" "}
                              {application.job?.experienceLevel}
                            </div>
                            {application.job?.salary && (
                              <div>
                                <span className="font-medium">Salary:</span>{" "}
                                {application.job.salary}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Applications:</span>{" "}
                              {application.job?.applicationsCount}
                            </div>
                          </div>
                        </div>

                        {/* Required Skills */}
                        <div>
                          <h4
                            className={`font-medium mb-2 ${currenttheme2.text.primary}`}
                          >
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {application.job?.skills
                              .slice(0, 5)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {application.job?.skills.length > 5 && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                              >
                                +{application.job.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Notes from Employer */}
                        {application.notes && (
                          <div>
                            <h4
                              className={`font-medium mb-2 ${currenttheme2.text.primary}`}
                            >
                              Notes from Employer
                            </h4>
                            <p
                              className={`text-sm p-3 rounded-md ${theme === "dark" ? "bg-slate-800/50 text-blue-200" : "bg-gray-50 text-gray-700"}`}
                            >
                              {application.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {applicationsQuery?.hasMore && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => setOffset(offset + limit)}
              variant="outline"
              className={`px-8 ${currenttheme2.button.secondary}`}
            >
              Load More Applications
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {applicationsQuery?.applications?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-20 ${currenttheme2.text.secondary}`}
          >
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3
              className={`text-lg font-medium mb-2 ${currenttheme2.text.primary}`}
            >
              No applications yet
            </h3>
            <p className={`mb-6 ${currenttheme2.text.secondary}`}>
              You haven't applied to any jobs yet. Start exploring
              opportunities!
            </p>
            <Link href="/jobs">
              <Button className={`${currenttheme2.button.primary}`}>
                Browse Jobs
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Statistics */}

        {/* Cover Letter Modal */}
        <Dialog
          open={isCoverLetterModalOpen}
          onOpenChange={setIsCoverLetterModalOpen}
        >
          <DialogContent
            className={`max-w-2xl ${theme === "dark" ? "bg-slate-900 border-blue-500/20" : "bg-white border-blue-200"}`}
          >
            <DialogHeader>
              <DialogTitle className={currenttheme2.text.primary}>
                Cover Letter
              </DialogTitle>
              <DialogDescription className={currenttheme2.text.secondary}>
                Full cover letter content
              </DialogDescription>
            </DialogHeader>
            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-800/50" : "bg-gray-50"}`}
            >
              <p
                className={`text-sm leading-relaxed whitespace-pre-wrap ${currenttheme2.text.secondary}`}
              >
                {selectedCoverLetter}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Withdraw Confirmation Modal */}
        <Dialog
          open={isWithdrawModalOpen}
          onOpenChange={setIsWithdrawModalOpen}
        >
          <DialogContent
            className={`max-w-md ${theme === "dark" ? "bg-slate-900 border-red-500/20" : "bg-white border-red-200"}`}
          >
            <DialogHeader>
              <DialogTitle
                className={`text-xl font-bold ${currenttheme2.text.primary} flex items-center gap-2`}
              >
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
                Confirm Withdrawal
              </DialogTitle>
              <DialogDescription
                className={`text-base ${currenttheme2.text.secondary}`}
              >
                Are you sure you want to withdraw your application for{" "}
                <span className="font-semibold text-red-500">
                  {applicationToWithdraw?.job?.title}
                </span>{" "}
                at {applicationToWithdraw?.job?.company}?
              </DialogDescription>
            </DialogHeader>
            <div
              className={`p-4 rounded-lg ${theme === "dark" ? "bg-red-500/10 border border-red-500/20" : "bg-red-50 border border-red-200"}`}
            >
              <p className={`text-sm ${currenttheme2.text.secondary}`}>
                <strong>This action cannot be undone.</strong> Once withdrawn,
                you will need to reapply if you change your mind.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsWithdrawModalOpen(false);
                  setApplicationToWithdraw(null);
                }}
                className={`${currenttheme2.button.secondary} rounded-xl`}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmWithdraw}
                disabled={withdrawingId === applicationToWithdraw?._id}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {withdrawingId === applicationToWithdraw?._id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Withdrawing...
                  </>
                ) : (
                  "Yes, Withdraw Application"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
