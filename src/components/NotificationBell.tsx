"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Building,
  CheckCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { CustomBell } from "@/components/icons/CustomBell";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const unreadCountQuery = useQuery(api.activities.getUnreadActivitiesCount, {});
  const recentActivitiesQuery = useQuery(api.activities.getUserActivities, {
    limit: 5,
    offset: 0,
  });
  const markAsRead = useMutation(api.activities.markActivityAsRead);
  const markAllAsRead = useMutation(api.activities.markAllActivitiesAsRead);

  const theme2 = {
    dark: {
      text: {
        primary: "text-white",
        secondary: "text-blue-200",
      },
      button: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
      },
    },
    light: {
      text: {
        primary: "text-gray-900",
        secondary: "text-blue-600",
      },
      button: {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        secondary: "bg-white hover:bg-gray-50 text-blue-800 border border-blue-200",
      },
    },
  };
  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;

  const formatDate = (timestamp: number) => {
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application_submitted":
        return <FileText className="h-4 w-4 text-blue-400" />;
      case "application_reviewed":
        return <Eye className="h-4 w-4 text-yellow-400" />;
      case "application_shortlisted":
        return <UserCheck className="h-4 w-4 text-green-400" />;
      case "application_rejected":
        return <UserX className="h-4 w-4 text-red-400" />;
      case "application_hired":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "application_withdrawn":
        return <XCircle className="h-4 w-4 text-orange-400" />;
      case "job_posted":
        return <Building className="h-4 w-4 text-purple-400" />;
      case "job_closed":
        return <Calendar className="h-4 w-4 text-gray-400" />;
      default:
        return <Bell className="h-4 w-4 text-blue-400" />;
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
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to mark all activities as read");
    }
  };

  const unreadActivities = recentActivitiesQuery?.activities?.filter(
    (activity) => !activity.isRead
  ) || [];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"

        >
          <CustomBell className="h-10 w-10 text-blue-500 dark:text-blue-300 transition-colors" />
          {typeof unreadCountQuery === "number" && unreadCountQuery > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium pulse-badge shadow-lg"
            >
              {unreadCountQuery > 99 ? "99+" : unreadCountQuery}
            </motion.div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            {unreadCountQuery && unreadCountQuery > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {unreadActivities.length > 0 ? (
              unreadActivities.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                          {activity.type.replace("application_", "").replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatDate(activity.createdAt)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(activity._id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Show metadata if available */}
                      {activity.metadata?.jobTitle && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Job:</span> {activity.metadata.jobTitle}
                          </div>
                          {activity.metadata.companyName && (
                            <div className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Company:</span> {activity.metadata.companyName}
                            </div>
                          )}
                          {activity.metadata.oldStatus && activity.metadata.newStatus && (
                            <div className="text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Status:</span> {activity.metadata.oldStatus} → {activity.metadata.newStatus}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No new notifications
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {unreadActivities.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link href="/activities">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => setIsOpen(false)}
              >
                View All Activities
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 