import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createQuestion = mutation({
  args: {
    q_id: v.string(),
    number: v.number(),
    title: v.string(),
    description: v.string(),
    difficulty: v.union(
      v.literal("Easy"),
      v.literal("Medium"),
      v.literal("Hard"),
    ),
    examples: v.array(
      v.object({
        input: v.string(),
        output: v.string(),
        explanation: v.optional(v.string()),
      }),
    ),
    constraints: v.array(v.string()),
    starterCode: v.array(
      v.object({
        lang: v.string(),
        code: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthorized");
      const alreadyExists = await ctx.db
        .query("questions")
        .withIndex("by_qid", (q) => q.eq("q_id", args.q_id))
        .first();
      if (alreadyExists) throw new Error("Question already exists");

      return await ctx.db.insert("questions", {
        ...args,
      });
    } catch (error) {
      //console.log(error);
      throw error;
    }
  },
});
export const getQuestionsById = query({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    //console.log("ids", args.ids);
    let questions = [];
    for (const id of args.ids) {
      const question = await ctx.db
        .query("questions")
        .withIndex("by_qid", (q) => q.eq("q_id", id))
        .first();
      if (question) {
        questions.push(question);
      }
    }
    //console.log("questions", questions);

    return questions;
  },
});
export const getAllQuestions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const questions = await ctx.db.query("questions").collect();

    //console.log("from here", questions);
    return questions;
  },
});
