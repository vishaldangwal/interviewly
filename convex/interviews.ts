import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";
export const getAllInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const interviews = await ctx.db.query("interviews").collect();

    return interviews;
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject),
      )
      .collect();

    return interviews!;
  },
});

export const getUpcomingInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const allForUser = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject),
      )
      .collect();

    return allForUser.filter((i) => i.status === "upcoming");
  },
});

export const getNumberofInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const allForUser = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject),
      )
      .collect();

    const upcomingInterviews = allForUser.filter(
      (i) => i.status === "upcoming",
    );

    return upcomingInterviews.length;
  },
});

export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_id", (q) => q.eq("streamCallId", args.streamCallId))
      .first();
  },
});

export const getCodesIdByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    const interview = await ctx.db
      .query("interviews")
      .withIndex("by_stream_id", (q) => q.eq("streamCallId", args.streamCallId))
      .first();

    return interview?.questions || [];
  },
});

// export const getQuestions = query({
//   args: { streamCallId: v.string() },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return [];

//     const interview = await ctx.db
//       .query("interviews")
//       .withIndex("by_stream_id", (q) => q.eq("streamCallId", args.streamCallId))
//       .first();
//     return interview?.questions || [];
//   },
// });

export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime : v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
    questions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("interviews", {
      ...args,
    });
  },
});

export const updateInterviewStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: args.status,
      ...(args.status === "completed" ? { endTime: Date.now() } : {}),
    });
  },
});

export const updateExpiredMeetings = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    const oneHourAgo = now - 3600000; // One hour in milliseconds

    // Find all meetings that started more than an hour ago and aren't completed
    const meetingsToUpdate = await ctx.db
      .query("interviews")
      .withIndex("by_status_and_time", (q) =>
        q.eq("status", "upcoming").lt("startTime", oneHourAgo),
      )
      .collect();

    // Update each meeting's status to "completed"
    const updates = [];
    for (const meeting of meetingsToUpdate) {
      updates.push(ctx.db.patch(meeting._id, { status: "completed" }));
    }

    await Promise.all(updates);
    return { updatedCount: updates.length };
  },
});