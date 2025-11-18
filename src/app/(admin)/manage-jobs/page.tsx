"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Building,
  Calendar,
  ChevronDown,
  Edit,
  Eye,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../../../convex/_generated/api";
import ExpandableContent from "./_components/ExpandableContent";
import CustomModal from "./_components/CustomModal";
import CustomCard from "./_components/CustomCard";
import CustomBadge from "./_components/CustomBadge";

export default function ManageJobsPage() {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isViewApplicationsOpen, setIsViewApplicationsOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  // Loading states
  const [isUpdatingJobStatus, setIsUpdatingJobStatus] = useState(false);
  const [isUpdatingApplicationStatus, setIsUpdatingApplicationStatus] =
    useState(false);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);

  const jobs = useQuery(api.jobs.getJobsByPoster, {});
  const applications = useQuery(
    api.jobs.getJobApplications,
    selectedJob ? { jobId: selectedJob._id } : "skip",
  );
  const updateJobStatus = useMutation(api.jobs.updateJobStatus);
  const updateApplicationStatus = useMutation(api.jobs.updateApplicationStatus);
  const deleteJob = useMutation(api.jobs.deleteJob);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Closed":
        return "danger";
      case "Draft":
        return "info";
      default:
        return "default";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "default";
      case "Part-time":
        return "info";
      case "Contract":
        return "warning";
      case "Internship":
        return "success";
      case "Remote":
        return "default";
      default:
        return "info";
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Under Review":
        return "default";
      case "Shortlisted":
        return "success";
      case "Rejected":
        return "danger";
      case "Hired":
        return "success";
      default:
        return "info";
    }
  };

  const handleUpdateJobStatus = async () => {
    if (!selectedJob || !newStatus) return;
    setIsUpdatingJobStatus(true);
    try {
      await updateJobStatus({
        jobId: selectedJob._id,
        status: newStatus as any,
      });
      setIsUpdateStatusOpen(false);
      setNewStatus("");
      toast.success("Job status updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update job status",
      );
    } finally {
      setIsUpdatingJobStatus(false);
    }
  };

  const handleUpdateApplicationStatus = async () => {
    if (!selectedApplication || !newStatus) return;
    setIsUpdatingApplicationStatus(true);
    try {
      const result = await updateApplicationStatus({
        applicationId: selectedApplication._id,
        status: newStatus as any,
        notes: notes || undefined,
      });
      // Send email notification if activity data is returned
      if (result && result.activityData) {
        try {
          const { sendActivityEmail } = await import("@/lib/sendActivityEmail");
          await sendActivityEmail(result.activityData);
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
        }
      }
      setIsUpdateStatusOpen(false);
      setNewStatus("");
      setNotes("");
      setSelectedApplication(null);
      toast.success("Application status updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update application status",
      );
    } finally {
      setIsUpdatingApplicationStatus(false);
    }
  };

  const handleDeleteJob = async (job: any) => {
    setDeletingJobId(job._id);
    try {
      await deleteJob({ jobId: job._id as any });
      toast.success("Job deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job",
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleScheduleInterview = (application: any, job: any) => {
    // Save candidate and job data to localStorage
    const interviewData = {
      candidateId: application.applicant?.clerkId,
      candidateName: application.applicant?.name,
      candidateEmail: application.applicant?.email,
      jobTitle: job.title,
      jobCompany: job.company,
      jobDescription: job.description,
      timestamp: Date.now(),
    };

    localStorage.setItem(
      "scheduledInterviewData",
      JSON.stringify(interviewData),
    );

    // Redirect to the meeting page
    router.push("/schedule");

    toast.success("Redirecting to schedule interview...");
  };

  return (
    <div className="min-h-screen pt-16 bg-black text-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
     
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/50 to-blue-600/50 border border-blue-600/30 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <Sparkles size={18} className="text-blue-600" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles size={18} className="text-blue-600 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Manage your opportunities
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          {/* Premium Title */}
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Manage{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
              Your Jobs
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300/80 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Review applications and manage your job postings efficiently.
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <Link href="/post-job">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-blue-600/30 hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Button>
          </Link>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {jobs?.jobs?.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <CustomCard>
                <div className="flex flex-col h-full">
                  {/* Top Section */}
                  <div className="space-y-4 flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <CustomBadge variant={getStatusColor(job.status)}>
                        {job.status}
                      </CustomBadge>
                      <CustomBadge variant={getTypeColor(job.type)}>
                        {job.type}
                      </CustomBadge>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                        {job.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-300/80 text-sm">
                          <Building className="h-4 w-4" />
                          {job.company}
                        </div>
                        <div className="flex items-center gap-2 text-blue-300/80 text-sm">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                      </div>
                    </div>

                    {/* Description with Show More */}
                    <div className="flex-1 min-h-0">
                      <ExpandableContent
                        content={job.description}
                        maxLines={4}
                        title={`Job Description - ${job.title}`}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-blue-200/70">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.applicationsCount} applications
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(job.postedAt)}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="h-16 flex items-center">
                      <div className="flex items-center gap-2">
                        {job.skills.length > 0 && (
                          <CustomBadge
                            variant="default"
                            className="text-xs cursor-pointer hover:bg-blue-600/30 transition-colors"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsSkillsModalOpen(true);
                            }}
                          >
                            {job.skills[0]}
                            {job.skills.length > 1 && (
                              <span className="ml-1 text-blue-300">
                                +{job.skills.length - 1}
                              </span>
                            )}
                          </CustomBadge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Actions */}
                  <div className="space-y-3 pt-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-600 text-white border-0 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-blue-600/20 rounded-xl"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsViewApplicationsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Applications
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-slate-600/80 to-slate-700/80 hover:from-slate-600 hover:to-slate-700 text-white border-0 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-slate-600/20 rounded-xl"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsUpdateStatusOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 text-white border-0 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-red-600/20 rounded-xl"
                      onClick={() => handleDeleteJob(job)}
                      disabled={deletingJobId === job._id}
                    >
                      {deletingJobId === job._id ? (
                        <>
                          <span className="animate-spin mr-2 inline-block align-middle">
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                              ></path>
                            </svg>
                          </span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Job
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CustomCard>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {jobs?.jobs?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <CustomCard className="p-12 h-auto">
              <div className="text-blue-600 mb-6">
                <Building className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                No jobs posted yet
              </h3>
              <p className="text-blue-300/80 mb-8 max-w-md mx-auto">
                Start posting jobs to attract talented candidates to your
                organization and build your team.
              </p>
              <Link href="/post-job">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/20 backdrop-blur-sm transition-all duration-300 hover:shadow-blue-600/30 hover:scale-105">
                  <Plus className="h-5 w-5 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </CustomCard>
          </motion.div>
        )}

        {/* View Applications Modal */}
        <CustomModal
          isOpen={isViewApplicationsOpen}
          onClose={() => setIsViewApplicationsOpen(false)}
          title={`Applications for ${selectedJob?.title}`}
        >
          <div className="space-y-6">
            <p className="text-blue-300/80 mb-6">
              Review and manage applications for this position
            </p>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {applications?.map((application) => (
                <div
                  key={application._id}
                  className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-blue-600/20 rounded-2xl p-6"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <CustomBadge
                            variant={getApplicationStatusColor(
                              application.status,
                            )}
                          >
                            {application.status}
                          </CustomBadge>
                          <div className="flex items-center gap-1 text-xs text-blue-300/60">
                            <Calendar className="h-3 w-3" />
                            {formatDate(application.appliedAt)}
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {application.applicant?.name || "Unknown Applicant"}
                        </h3>
                        <p className="text-blue-300/80 text-sm">
                          {application.applicant?.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-600 text-white border-0 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-blue-600/20 rounded-xl"
                          onClick={() => {
                            setSelectedApplication(application);
                            setNewStatus(application.status);
                            setNotes(application.notes || "");
                            setIsUpdateStatusOpen(true);
                            setIsViewApplicationsOpen(false);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update Status
                        </Button>

                        {/* Schedule Interview Button - Only show for Shortlisted candidates */}
                        {application.status === "Shortlisted" && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-600/80 to-green-700/80 hover:from-green-600 hover:to-green-700 text-white border-0 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-green-600/20 rounded-xl"
                            onClick={() =>
                              handleScheduleInterview(application, selectedJob)
                            }
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Schedule Interview
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Application Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                          Application Details
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-3 px-4 bg-blue-600/10 rounded-xl backdrop-blur-sm border border-blue-600/20">
                            <span className="text-blue-200/70 text-sm">
                              Applied
                            </span>
                            <span className="text-white text-sm">
                              {formatDate(application.appliedAt)}
                            </span>
                          </div>
                          {application.reviewedAt && (
                            <div className="flex items-center justify-between py-3 px-4 bg-blue-600/10 rounded-xl backdrop-blur-sm border border-blue-600/20">
                              <span className="text-blue-200/70 text-sm">
                                Reviewed
                              </span>
                              <span className="text-white text-sm">
                                {formatDate(application.reviewedAt)}
                              </span>
                            </div>
                          )}
                          {application.resume && (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between py-3 px-4 bg-blue-600/10 hover:bg-blue-600/20 rounded-xl backdrop-blur-sm border border-blue-600/20 hover:border-blue-600/30 transition-all group"
                            >
                              <span className="text-blue-600 text-sm">
                                View Resume
                              </span>
                              <svg
                                className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                ></path>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                          Cover Letter
                        </h4>
                        <div className="bg-blue-600/10 rounded-xl p-4 backdrop-blur-sm border border-blue-600/20">
                          <ExpandableContent
                            content={application.coverLetter}
                            maxLines={4}
                            title={`Cover Letter - ${application.applicant?.name || "Unknown Applicant"}`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {application.notes && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          <div className="w-1 h-4 bg-yellow-500 rounded-full"></div>
                          Your Notes
                        </h4>
                        <div className="bg-blue-600/10 rounded-xl p-4 backdrop-blur-sm border border-blue-600/20">
                          <p className="text-sm text-blue-200/80 leading-relaxed">
                            {application.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {applications?.length === 0 && (
                <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-blue-600/20 rounded-2xl p-12 text-center">
                  <div className="text-blue-400 mb-4">
                    <Users className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No applications yet
                  </h3>
                  <p className="text-blue-300/80">
                    Applications will appear here once candidates start
                    applying.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CustomModal>

        {/* Update Status Modal */}
        <CustomModal
          isOpen={isUpdateStatusOpen}
          onClose={() => {
            if (isUpdatingJobStatus || isUpdatingApplicationStatus) return; // Prevent closing while loading
            setIsUpdateStatusOpen(false);
            setNewStatus("");
            setNotes("");
            setSelectedApplication(null);
          }}
          title={
            selectedApplication
              ? "Update Application Status"
              : "Update Job Status"
          }
        >
          <div className="space-y-6">
            <p className="text-blue-300/80">
              {selectedApplication
                ? "Update the status of this application and add notes if needed."
                : "Change the status of this job posting."}
            </p>

            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="status"
                  className="text-white font-medium mb-3 block"
                >
                  Status
                </Label>
                <Select
                  value={newStatus}
                  onValueChange={setNewStatus}
                  disabled={isUpdatingJobStatus || isUpdatingApplicationStatus}
                >
                  <SelectTrigger className="bg-slate-800/80 border-blue-500/20 text-white backdrop-blur-sm hover:bg-slate-800 transition-all rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/90 backdrop-blur-md border-blue-500/20">
                    {selectedApplication ? (
                      <>
                        <SelectItem
                          value="Pending"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Pending
                        </SelectItem>
                        <SelectItem
                          value="Under Review"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Under Review
                        </SelectItem>
                        <SelectItem
                          value="Shortlisted"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Shortlisted
                        </SelectItem>
                        <SelectItem
                          value="Rejected"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Rejected
                        </SelectItem>
                        <SelectItem
                          value="Hired"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Hired
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem
                          value="Active"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="Closed"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Closed
                        </SelectItem>
                        <SelectItem
                          value="Draft"
                          className="text-white hover:bg-blue-500/20 focus:bg-blue-500/20"
                        >
                          Draft
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedApplication && (
                <div>
                  <Label
                    htmlFor="notes"
                    className="text-white font-medium mb-3 block"
                  >
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={3}
                    className="bg-slate-800/80 border-blue-500/20 text-white placeholder:text-blue-300/60 backdrop-blur-sm hover:bg-slate-800 transition-all rounded-xl"
                    disabled={isUpdatingApplicationStatus}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  className="border-blue-500/20 text-blue-300 hover:bg-blue-500/20 backdrop-blur-sm transition-all rounded-xl"
                  onClick={() => {
                    if (isUpdatingJobStatus || isUpdatingApplicationStatus)
                      return;
                    setIsUpdateStatusOpen(false);
                    setNewStatus("");
                    setNotes("");
                    setSelectedApplication(null);
                  }}
                  disabled={isUpdatingJobStatus || isUpdatingApplicationStatus}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700 text-white backdrop-blur-sm transition-all rounded-xl"
                  onClick={
                    selectedApplication
                      ? handleUpdateApplicationStatus
                      : handleUpdateJobStatus
                  }
                  disabled={
                    !newStatus ||
                    isUpdatingJobStatus ||
                    isUpdatingApplicationStatus
                  }
                >
                  {isUpdatingJobStatus || isUpdatingApplicationStatus ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 inline-block align-middle">
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                      </span>
                      Updating...
                    </span>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CustomModal>

        {/* Skills Modal */}
        <CustomModal
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          title={`Required Skills - ${selectedJob?.title}`}
        >
          <div className="space-y-6">
            <p className="text-blue-300/80 mb-6">
              All skills required for this position
            </p>

            <div className="bg-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-600/20">
              <div className="flex flex-wrap gap-3">
                {selectedJob?.skills?.map((skill, index) => (
                  <CustomBadge
                    key={index}
                    variant="default"
                    className="text-sm px-4 py-2"
                  >
                    {skill}
                  </CustomBadge>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-blue-300/60 text-sm">
                {selectedJob?.skills?.length} skill
                {selectedJob?.skills?.length !== 1 ? "s" : ""} required
              </p>
            </div>
          </div>
        </CustomModal>
      </div>
    </div>
  );
}
