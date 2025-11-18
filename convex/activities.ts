import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to determine target based on type
export function getTargetForType(type: string): "user" | "admin" {
  switch (type) {
    case "application_submitted":
    case "application_reviewed":
    case "application_shortlisted":
    case "application_rejected":
    case "application_hired":
    case "meeting_scheduled":
      return "user";
    case "application_withdrawn":
    case "job_posted":
    case "job_closed":
      return "admin";
    default:
      return "user";
  }
}

// Create a new activity
export const createActivity = mutation({
  args: {
    type: v.union(
      v.literal("application_submitted"),
      v.literal("application_reviewed"),
      v.literal("application_shortlisted"),
      v.literal("application_rejected"),
      v.literal("application_hired"),
      v.literal("application_withdrawn"),
      v.literal("job_posted"),
      v.literal("job_closed"),
      v.literal("meeting_scheduled"),
    ),
    target: v.union(v.literal("user"), v.literal("admin")),
    title: v.string(),
    description: v.string(),
    userId: v.string(),
    relatedUserId: v.optional(v.string()),
    jobId: v.optional(v.id("jobs")),
    applicationId: v.optional(v.id("jobApplications")),
    metadata: v.optional(
      v.object({
        jobTitle: v.optional(v.string()),
        companyName: v.optional(v.string()),
        applicantName: v.optional(v.string()),
        oldStatus: v.optional(v.string()),
        newStatus: v.optional(v.string()),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    return await ctx.db.insert("activities", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
      emailSent: false,
    });
  },
});

// Get activities for a user
export const getUserActivities = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    target: v.optional(v.union(v.literal("user"), v.literal("admin"))), // <-- add target
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    let queryBuilder = ctx.db
      .query("activities")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .order("desc");

    if (args.target) {
      queryBuilder = queryBuilder.filter((q) =>
        q.eq(q.field("target"), args.target),
      );
    }

    const activities = await queryBuilder.collect();

    const offset = args.offset || 0;
    const limit = args.limit || 10;
    const paginatedActivities = activities.slice(offset, offset + limit);
    console.log(paginatedActivities);
    return {
      activities: paginatedActivities,
      total: activities.length,
      hasMore: offset + limit < activities.length,
    };
  },
});

// Mark activity as read
export const markActivityAsRead = mutation({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const activity = await ctx.db.get(args.activityId);
    if (!activity || activity.userId !== identity.subject) {
      throw new Error("Activity not found or access denied");
    }

    return await ctx.db.patch(args.activityId, {
      isRead: true,
    });
  },
});

// Mark all activities as read for a user
export const markAllActivitiesAsRead = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const activity of activities) {
      await ctx.db.patch(activity._id, {
        isRead: true,
      });
    }

    return { success: true, updatedCount: activities.length };
  },
});

// Get unread activities count
export const getUnreadActivitiesCount = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const unreadActivities = await ctx.db
      .query("activities")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    return unreadActivities.length;
  },
});

// Create activity and send email notification
export const createActivityAndNotify = mutation({
  args: {
    type: v.union(
      v.literal("application_submitted"),
      v.literal("application_reviewed"),
      v.literal("application_shortlisted"),
      v.literal("application_rejected"),
      v.literal("application_hired"),
      v.literal("application_withdrawn"),
      v.literal("job_posted"),
      v.literal("job_closed"),
      v.literal("meeting_scheduled"),
    ),
    target: v.union(v.literal("user"), v.literal("admin")),
    title: v.string(),
    description: v.string(),
    userId: v.string(),
    relatedUserId: v.optional(v.string()),
    jobId: v.optional(v.id("jobs")),
    applicationId: v.optional(v.id("jobApplications")),
    metadata: v.optional(
      v.object({
        jobTitle: v.optional(v.string()),
        companyName: v.optional(v.string()),
        applicantName: v.optional(v.string()),
        oldStatus: v.optional(v.string()),
        newStatus: v.optional(v.string()),
        notes: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    // Create the activity
    const activityId = await ctx.db.insert("activities", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
      emailSent: false,
    });

    // Get user details for email
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first();

    return {
      activityId,
      user: user ? { name: user.name, email: user.email } : null,
      metadata: args.metadata,
      type: args.type,
    };
  },
});

// Delete activity
export const deleteActivity = mutation({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const activity = await ctx.db.get(args.activityId);
    if (!activity || activity.userId !== identity.subject) {
      throw new Error("Activity not found or access denied");
    }

    await ctx.db.delete(args.activityId);
    return { success: true };
  },
});

// Get activities by type
export const getActivitiesByType = query({
  args: {
    type: v.union(
      v.literal("application_submitted"),
      v.literal("application_reviewed"),
      v.literal("application_shortlisted"),
      v.literal("application_rejected"),
      v.literal("application_hired"),
      v.literal("application_withdrawn"),
      v.literal("job_posted"),
      v.literal("job_closed"),
    ),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("type"), args.type))
      .order("desc")
      .collect();

    const offset = args.offset || 0;
    const limit = args.limit || 10;
    const paginatedActivities = activities.slice(offset, offset + limit);

    return {
      activities: paginatedActivities,
      total: activities.length,
      hasMore: offset + limit < activities.length,
    };
  },
});
