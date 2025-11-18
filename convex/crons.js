import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// An alternative way to create the same schedule as above with cron syntax
crons.interval(
  "set_interviews_completed",
  { minutes: 60 },
  internal.interviews.updateExpiredMeetings,
);
export default crons;
