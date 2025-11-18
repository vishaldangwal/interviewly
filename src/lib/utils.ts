import { clsx, type ClassValue } from "clsx";
import {
  addHours,
  intervalToDuration,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Interview = Doc<"interviews">;
type User = Doc<"users">;

export const groupInterviews = (interviews: Interview[]) => {
  if (!interviews) return {};
  const now = new Date();
  const grouped = interviews.reduce((acc: any, interview: Interview) => {
    const startTime = new Date(interview.startTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

    if (now >= startTime && now <= endTime) {
      acc.live = [...(acc.live || []), interview];
    } else if (interview.status === "completed") {
      acc.completed = [...(acc.completed || []), interview];
    } else if (startTime > now) {
      acc.upcoming = [...(acc.upcoming || []), interview];
    } else {
      acc.completed = [...(acc.completed || []), interview];
    }
    return acc;
  }, {});

  // Sort each group by latest first
  if (grouped.live) {
    grouped.live.sort((a: Interview, b: Interview) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }
  if (grouped.completed) {
    grouped.completed.sort((a: Interview, b: Interview) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }
  if (grouped.upcoming) {
    grouped.upcoming.sort((a: Interview, b: Interview) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  return grouped;
};

export const getCandidateInfo = (users: User[], candidateId: string) => {
  const candidate = users?.find((user) => user.clerkId === candidateId);
  return {
    name: candidate?.name || "Unknown Candidate",
    image: candidate?.image || "",
    initials:
      candidate?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UC",
  };
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
  const interviewer = users?.find((user) => user.clerkId === interviewerId);
  return {
    name: interviewer?.name || "Unknown Interviewer",
    image: interviewer?.image,
    initials:
      interviewer?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UI",
  };
};

export const calculateRecordingDuration = (
  startTime: string,
  endTime: string,
) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
      duration.seconds,
    ).padStart(2, "0")}`;
  }

  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
  }

  return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (interview: Interview) => {
  const now = new Date();
  const interviewStartTime = interview.startTime;
  const endTime = addHours(interviewStartTime, 1);

  if (isWithinInterval(now, { start: interviewStartTime, end: endTime }))
    return "live";
  if (
    interview.status === "completed" ||
    interview.status === "failed" ||
    interview.status === "succeeded"
  )
    return "completed";
  if (isBefore(now, interviewStartTime)) return "upcoming";
  return "completed";
};

export const getInterviewStatus = (interview: Interview) => {
  const now = new Date();
  const interviewStartTime = new Date(interview.startTime);
  const endTime = new Date(interviewStartTime.getTime() + 60 * 60 * 1000); // +1 hour

  // Check if interview is currently live
  if (now >= interviewStartTime && now <= endTime) {
    return "live";
  }

  // Check if interview is upcoming
  if (interviewStartTime > now) {
    return "upcoming";
  }

  // For past interviews, check the actual status
  if (interview.status === "failed") {
    return "failed";
  }
  if (interview.status === "succeeded") {
    return "passed";
  }
  if (interview.status === "completed") {
    return "completed";
  }

  // Default to completed for past interviews without specific status
  return "completed";
};

export const groupInterviewsByStatus = (interviews: Interview[]) => {
  if (!interviews) return {};
  
  const grouped = interviews.reduce((acc: any, interview: Interview) => {
    const status = getInterviewStatus(interview);
    
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(interview);
    return acc;
  }, {});

  // Sort each group by latest first
  Object.keys(grouped).forEach(status => {
    grouped[status].sort((a: Interview, b: Interview) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  });

  return grouped;
};
