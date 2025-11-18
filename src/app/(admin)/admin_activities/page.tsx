"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import theme2 from "@/constants/theme";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  ArrowLeft,
  CheckCheck,
  Briefcase,
  UserCheck,
  UserX,
  Calendar,
  Building,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useRouter } from "next/navigation";

export default function ActivitiesPage() {
  const [offset, setOffset] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const limit = 10;
  const { theme } = useTheme();

  const userRole: "user" | "admin" = "admin";
  const router = useRouter();

  const activitiesQuery = useQuery(api.activities.getUserActivities, {
    limit,
    offset,
  });
  const unreadCountQuery = useQuery(
    api.activities.getUnreadActivitiesCount,
    {},
  );
  const markAsRead = useMutation(api.activities.markActivityAsRead);
  const markAllAsRead = useMutation(api.activities.markAllActivitiesAsRead);
  const deleteActivity = useMutation(api.activities.deleteActivity);

  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application_submitted":
        return <FileText className="h-5 w-5 text-blue-400" />;
      case "application_reviewed":
        return <Eye className="h-5 w-5 text-yellow-400" />;
      case "application_shortlisted":
        return <UserCheck className="h-5 w-5 text-green-400" />;
      case "application_rejected":
        return <UserX className="h-5 w-5 text-red-400" />;
      case "application_hired":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "application_withdrawn":
        return <XCircle className="h-5 w-5 text-orange-400" />;
      case "job_posted":
        return <Briefcase className="h-5 w-5 text-purple-400" />;
      case "job_closed":
        return <Clock className="h-5 w-5 text-gray-400" />;
      default:
        return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "application_submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "application_reviewed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "application_shortlisted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "application_rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "application_hired":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "application_withdrawn":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "job_posted":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "job_closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case "application_submitted":
        return "Application Submitted";
      case "application_reviewed":
        return "Application Reviewed";
      case "application_shortlisted":
        return "Application Shortlisted";
      case "application_rejected":
        return "Application Rejected";
      case "application_hired":
        return "Application Hired";
      case "application_withdrawn":
        return "Application Withdrawn";
      case "job_posted":
        return "Job Posted";
      case "job_closed":
        return "Job Closed";
      default:
        return "Activity";
    }
  };

  const handleMarkAsRead = async (activityId: string) => {
    try {
      await markAsRead({ activityId: activityId as any });
      toast.success("Activity marked as read");
    } catch (error) {
      toast.error("Failed to mark activity as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({});
      toast.success("All activities marked as read");
    } catch (error) {
      toast.error("Failed to mark all activities as read");
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await deleteActivity({ activityId: activityId as any });
      toast.success("Activity deleted");
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  const filteredActivities = activitiesQuery?.activities?.filter((activity) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !activity.isRead;
    return activity.type === selectedFilter;
  });

  // Helper to build the target URL for an activity
  const getActivityTargetUrl = (activity: any) => {
    if (activity.jobId) {
      let url = `/admin_jobs/${activity.jobId}`;
      const params = [];
      if (activity.applicationId)
        params.push(`applicationId=${activity.applicationId}`);
      if (activity.relatedUserId)
        params.push(`userId=${activity.relatedUserId}`);
      if (params.length > 0) url += `?${params.join("&")}`;
      return url;
    }
    // fallback: stay on page
    return null;
  };

  return (
    <div className={`mt-16 ${currenttheme2.bg} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <Bell size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <Bell size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Stay updated with admin activities
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Admin Activities{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              & Notifications
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Track all admin job management activities and stay informed about
            updates.
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
            href="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </motion.div>

        {/* Stats Card */}
        {activitiesQuery?.activities &&
          activitiesQuery.activities.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card
                className={`${theme === "dark" ? "bg-slate-900/50 border-blue-500/20" : "bg-white border-blue-200"}`}
              >
                <CardHeader>
                  <CardTitle className={currenttheme2.text.primary}>
                    Admin Activity Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {activitiesQuery.total}
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Total Admin Activities
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {unreadCountQuery || 0}
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Unread
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          activitiesQuery.activities.filter(
                            (activity) => activity.type === "job_posted",
                          ).length
                        }
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Jobs Posted
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {
                          activitiesQuery.activities.filter(
                            (activity) =>
                              activity.type === "application_reviewed",
                          ).length
                        }
                      </div>
                      <div
                        className={`text-sm ${currenttheme2.text.secondary}`}
                      >
                        Applications Reviewed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        {/* Filters and Actions */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
              className={
                selectedFilter === "all"
                  ? currenttheme2.button.primary
                  : currenttheme2.button.secondary
              }
            >
              All Activities
            </Button>
            <Button
              variant={selectedFilter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("unread")}
              className={
                selectedFilter === "unread"
                  ? currenttheme2.button.primary
                  : currenttheme2.button.secondary
              }
            >
              Unread ({unreadCountQuery || 0})
            </Button>
            <Button
              variant={selectedFilter === "job_posted" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("job_posted")}
              className={
                selectedFilter === "job_posted"
                  ? currenttheme2.button.primary
                  : currenttheme2.button.secondary
              }
            >
              Jobs Posted
            </Button>
            <Button
              variant={
                selectedFilter === "application_reviewed"
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setSelectedFilter("application_reviewed")}
              className={
                selectedFilter === "application_reviewed"
                  ? currenttheme2.button.primary
                  : currenttheme2.button.secondary
              }
            >
              Applications Reviewed
            </Button>
            <Button
              variant={selectedFilter === "job_closed" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("job_closed")}
              className={
                selectedFilter === "job_closed"
                  ? currenttheme2.button.primary
                  : currenttheme2.button.secondary
              }
            >
              Jobs Closed
            </Button>
          </div>

          {unreadCountQuery && unreadCountQuery > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className={`${currenttheme2.button.secondary} flex items-center gap-2`}
            >
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </motion.div>

        {/* Activities List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredActivities?.map((activity, index) => {
              const targetUrl = getActivityTargetUrl(activity);
              return (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`hover:shadow-lg transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-slate-900/50 border-blue-500/20"
                        : "bg-white border-blue-200"
                    } ${!activity.isRead ? "ring-2 ring-blue-500/50" : ""} ${targetUrl ? "cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20" : ""}`}
                    onClick={(e) => {
                      // Prevent navigation if clicking on action buttons
                      if (
                        (e.target as HTMLElement).closest("button") ||
                        (e.target as HTMLElement).closest("a")
                      )
                        return;
                      if (targetUrl) router.push(targetUrl);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`p-2 rounded-lg ${!activity.isRead ? "bg-blue-500/20" : "bg-gray-100 dark:bg-gray-800"}`}
                          >
                            {getActivityIcon(activity.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className={`font-semibold ${currenttheme2.text.primary}`}
                              >
                                {activity.title}
                              </h3>
                              <Badge
                                className={getActivityColor(activity.type)}
                              >
                                {getActivityTypeLabel(activity.type)}
                              </Badge>
                              {!activity.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                              )}
                            </div>

                            <p
                              className={`text-sm mb-3 ${currenttheme2.text.secondary}`}
                            >
                              {activity.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(activity.createdAt)}
                              </div>
                              {activity.metadata?.companyName && (
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {activity.metadata.companyName}
                                </div>
                              )}
                            </div>

                            {/* Metadata Display */}
                            {activity.metadata && (
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  {activity.metadata.jobTitle && (
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Job:
                                      </span>{" "}
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {activity.metadata.jobTitle}
                                      </span>
                                    </div>
                                  )}
                                  {activity.metadata.oldStatus &&
                                    activity.metadata.newStatus && (
                                      <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                          Status:
                                        </span>{" "}
                                        <span className="text-gray-600 dark:text-gray-400">
                                          {activity.metadata.oldStatus} →{" "}
                                          {activity.metadata.newStatus}
                                        </span>
                                      </div>
                                    )}
                                  {activity.metadata.notes && (
                                    <div className="md:col-span-2">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Notes:
                                      </span>{" "}
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {activity.metadata.notes}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {!activity.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(activity._id)}
                              className={`${currenttheme2.button.secondary} h-8 px-3`}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteActivity(activity._id)}
                            className="h-8 px-3 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {activitiesQuery?.hasMore && (
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
              Load More Activities
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {(!filteredActivities || filteredActivities.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-20 ${currenttheme2.text.secondary}`}
          >
            <div className="text-gray-400 mb-4">
              <Bell className="h-16 w-16 mx-auto" />
            </div>
            <h3
              className={`text-lg font-medium mb-2 ${currenttheme2.text.primary}`}
            >
              No admin activities yet
            </h3>
            <p className={`mb-6 ${currenttheme2.text.secondary}`}>
              {selectedFilter === "all"
                ? "There are no admin activities yet. Post a job or review applications to see admin activity feed!"
                : `No ${selectedFilter === "unread" ? "unread" : selectedFilter.replace("_", " ")} admin activities found.`}
            </p>
            {selectedFilter === "all" && (
              <Link href="/jobs">
                <Button className={`${currenttheme2.button.primary}`}>
                  Go to Job Management
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
