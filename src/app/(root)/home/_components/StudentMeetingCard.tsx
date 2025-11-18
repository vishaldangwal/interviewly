import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  ChevronRight,
  Building2,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";

type Interview = Doc<"interviews">;

interface StudentMeetingCardProps {
  interview: Interview;
  interviewerInfos?: Array<{
    name: string;
    image?: string;
    initials: string;
    role?: string;
    company?: string;
  }>;
}

function StudentMeetingCard({ interview, interviewerInfos = [] }: StudentMeetingCardProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Extract company name from title (assuming format: "Interview for [Position] at [Company]")
  const extractCompanyInfo = (title: string) => {
    const atIndex = title.lastIndexOf(" at ");
    if (atIndex !== -1) {
      const position = title.substring(0, atIndex).replace("Interview for ", "");
      const company = title.substring(atIndex + 4);
      return { position, company };
    }
    return { position: title, company: "Company" };
  };

  const { position, company } = extractCompanyInfo(interview.title);
  
  const formattedDate = interview?.startTime
    ? format(new Date(interview.startTime), "EEEE, MMMM d · h:mm a")
    : "Date not set";

  // Status mapping for student view
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          badge: "bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200",
          text: "Scheduled",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
      case "completed":
        return {
          badge: "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200",
          text: "Completed",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
        };
      case "cancelled":
        return {
          badge: "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200",
          text: "Cancelled",
          icon: <XCircle className="h-3 w-3 mr-1" />,
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200",
          text: "Pending",
          icon: <Clock className="h-3 w-3 mr-1" />,
        };
    }
  };

  const statusInfo = getStatusInfo(interview.status);

  // Helper for trimmed description
  const trimDescription = (desc: string, max: number = 120) => {
    if (!desc) return "";
    if (desc.length <= max) return desc;
    return desc.slice(0, max) + "...";
  };

  if (!interview || !interview.title) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="relative"
    >
      <Card className="h-[420px] w-full max-w-sm overflow-hidden border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-950">
        {/* Status indicator bar */}
        <div
          className={`h-1 ${
            interview.status === "completed"
              ? "bg-green-500"
              : interview.status === "cancelled"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        />

        <CardHeader className="pb-4">
          {/* Company & Position Header */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {company}
              </span>
            </div>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {position}
            </CardTitle>
          </div>

          {/* Date & Status Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              {formattedDate}
            </div>
            <Badge className={`flex items-center text-xs ${statusInfo.badge}`}>
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
          </div>

          {/* Interviewers Section */}
          {interviewerInfos && interviewerInfos.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Interviewers ({interviewerInfos.length})
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {interviewerInfos.slice(0, 3).map((info, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <Avatar className="h-6 w-6 ring-1 ring-gray-200 dark:ring-gray-700">
                      <AvatarImage src={info.image} />
                      <AvatarFallback className="bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs">
                        {info.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {info.name}
                      </span>
                      {info.role && (
                        <span className="text-[10px] text-muted-foreground">
                          {info.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {interviewerInfos.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{interviewerInfos.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {interview.description && (
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              {showFullDesc ? (
                <div>
                  {interview.description}
                  {interview.description.length > 120 && (
                    <button
                      className="text-blue-500 ml-1 underline text-xs hover:text-blue-600 transition-colors"
                      onClick={() => setShowFullDesc(false)}
                    >
                      Show less
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {trimDescription(interview.description)}
                  {interview.description.length > 120 && (
                    <button
                      className="text-blue-500 ml-1 underline text-xs hover:text-blue-600 transition-colors"
                      onClick={() => setShowFullDesc(true)}
                    >
                      Read more
                    </button>
                  )}
                </div>
              )}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Action Button */}
          <div className="mt-auto">
            {interview.status === "scheduled" && (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={() => {
                  // Handle join meeting logic
                  console.log("Join meeting:", interview.streamCallId);
                }}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                Join Interview
              </Button>
            )}

            {interview.status === "completed" && (
              <Button
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                onClick={() => {
                  // Handle view results logic
                  console.log("View results for:", interview._id);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                View Results
              </Button>
            )}

            {interview.status === "cancelled" && (
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                disabled
              >
                <XCircle className="h-4 w-4 mr-2" />
                Interview Cancelled
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default StudentMeetingCard;
