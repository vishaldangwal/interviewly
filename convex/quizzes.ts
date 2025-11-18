import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveQuizRecord = mutation({
  args: {
    userId: v.string(),
    quizId: v.string(),
    title: v.string(),
    category: v.string(),
    description: v.string(),
    totalTime: v.number(),
    totalQuestions: v.number(),
    questions: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correct: v.number(),
      }),
    ),

    badges: v.array(v.string()),
    strongAreas: v.array(v.string()),
    weakAreas: v.array(v.string()),
    attempts: v.number(),
    attemptsHistory: v.array(
      v.object({
        attemptId: v.number(),
        completedOn: v.string(),
        score: v.number(),
        correctAnswers: v.number(),
        incorrectAnswers: v.number(),
        skippedAnswers: v.number(),
        timeSpent: v.string(),
        questions: v.array(
          v.object({
            id: v.string(),
            question: v.string(),
            yourAnswer: v.string(),
            correctAnswer: v.string(),
            isCorrect: v.boolean(),
            timeSpent: v.string(),
          }),
        ),
      }),
    ),
    recommendedResources: v.array(
      v.object({
        title: v.string(),
        type: v.string(),
        url: v.string(),
      }),
    ),
  },

  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("quizId"), args.quizId))
      .unique();

    if (existing) {
      const updatedAttempts = existing.attempts + 1;

      await ctx.db.patch(existing._id, {
        attempts: updatedAttempts,
        attemptsHistory: [...existing.attemptsHistory, ...args.attemptsHistory],
        badges: args.badges,
        strongAreas: args.strongAreas,
        weakAreas: args.weakAreas,
        totalTime: args.totalTime,
        recommendedResources: args.recommendedResources,
        totalQuestions: args.totalQuestions,
        description: args.description,
        title: args.title,
        quizId: args.quizId,
      });

      return { status: "updated" };
    } else {
      await ctx.db.insert("quizzes", {
        userId: args.userId,
        quizId: args.quizId,
        title: args.title,
        category: args.category,
        description: args.description,
        totalTime: args.totalTime,
        totalQuestions: args.totalQuestions,
        questions: args.questions,
        badges: args.badges,
        strongAreas: args.strongAreas,
        weakAreas: args.weakAreas,
        attempts: 1,
        attemptsHistory: args.attemptsHistory,
        recommendedResources: args.recommendedResources,
      });

      return { status: "created" };
    }
  },
});

export const getQuizHistoryByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const quizzes = await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
    return quizzes;
  },
});

export const getQuizByQuizId = query({
  args: {
    quizId: v.string(),
  },
  handler: async (ctx, args) => {
    const quiz = await ctx.db
      .query("quizzes")
      .withIndex("by_quizId", (q) => q.eq("quizId", args.quizId))
      .unique();
    return quiz;
  },
});

export const getQuizSummaries = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    console.log("Here");
    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
    console.log("Quizzes:", quizzes);
    const summaries = quizzes
      .filter((quiz) => quiz.attemptsHistory.length > 0)
      .map((quiz) => {
        const lastAttempt = quiz.attemptsHistory.at(-1)!;
        const secondLastAttempt =
          quiz.attemptsHistory.length >= 2
            ? quiz.attemptsHistory[quiz.attemptsHistory.length - 2]
            : null;

        const improvement = secondLastAttempt
          ? lastAttempt.score - secondLastAttempt.score
          : 0;

        return {
          id: quiz.quizId,
          title: quiz.title,
          category: quiz.category,
          completedOn: lastAttempt.completedOn,
          score: lastAttempt.score,
          totalQuestions: quiz.totalQuestions,
          timeSpent: lastAttempt.timeSpent,
          badges: quiz.badges,
          improvement,
        };
      });

    // Return as a property of an object
    return { summaries };
  },
});

export const getQuizConfig = query({
  args: {
    quizId: v.string(),
  },
  handler: async (ctx, { quizId }) => {
    const quiz = await ctx.db
      .query("quizzes")
      .withIndex("by_quizId", (q) => q.eq("quizId", quizId))
      .unique();
    const difficulty = quiz?.description.split(" ")[1];
    return {
      topic: quiz?.title,
      difficulty: difficulty,
    };
  },
});
