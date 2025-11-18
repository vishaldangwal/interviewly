import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save a new study plan
export const saveStudyPlan = mutation({
  args: {
    jobTitle: v.string(),
    companyName: v.string(),
    jobLevel: v.string(),
    userSkills: v.array(v.string()),
    requiredSkills: v.array(v.string()),
    prepDays: v.number(),
    hoursPerDay: v.number(),
    studyPlan: v.array(
      v.object({
        day: v.number(),
        topics: v.optional(
          v.array(
            v.object({
              topic: v.string(),
              hours_allocated: v.number(),
              focus_area: v.string(),
              notes: v.optional(v.string()),
            })
          )
        ),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = Date.now();
    
    return await ctx.db.insert("studyPlans", {
      userId: identity.subject,
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get all study plans for a user
export const getUserStudyPlans = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const studyPlans = await ctx.db
      .query("studyPlans")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return studyPlans;
  },
});

// Get the most recent study plan for a user
export const getMostRecentStudyPlan = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const studyPlan = await ctx.db
      .query("studyPlans")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first();

    return studyPlan;
  },
});

// Get study plans created within the last N days
export const getRecentStudyPlans = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const studyPlans = await ctx.db
      .query("studyPlans")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.gte(q.field("createdAt"), cutoffTime))
      .order("desc")
      .collect();

    return studyPlans;
  },
});

// Update an existing study plan
export const updateStudyPlan = mutation({
  args: {
    studyPlanId: v.id("studyPlans"),
    jobTitle: v.string(),
    companyName: v.string(),
    jobLevel: v.string(),
    userSkills: v.array(v.string()),
    requiredSkills: v.array(v.string()),
    prepDays: v.number(),
    hoursPerDay: v.number(),
    studyPlan: v.array(
      v.object({
        day: v.number(),
        topics: v.optional(
          v.array(
            v.object({
              topic: v.string(),
              hours_allocated: v.number(),
              focus_area: v.string(),
              notes: v.optional(v.string()),
            })
          )
        ),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { studyPlanId, ...updateData } = args;
    
    // Verify the study plan belongs to the user
    const existingPlan = await ctx.db.get(studyPlanId);
    if (!existingPlan || existingPlan.userId !== identity.subject) {
      throw new Error("Unauthorized to update this study plan");
    }

    return await ctx.db.patch(studyPlanId, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete a study plan
export const deleteStudyPlan = mutation({
  args: { studyPlanId: v.id("studyPlans") },
  handler: async (ctx, { studyPlanId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verify the study plan belongs to the user
    const existingPlan = await ctx.db.get(studyPlanId);
    if (!existingPlan || existingPlan.userId !== identity.subject) {
      throw new Error("Unauthorized to delete this study plan");
    }

    await ctx.db.delete(studyPlanId);
    return { success: true };
  },
}); 