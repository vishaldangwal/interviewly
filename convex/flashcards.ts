import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createFlashcard = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    question: v.string(),
    answer: v.string(),
    category: v.string(),
  },

  handler: async (ctx, args) => {
    const { userId, title, question, answer, category } = args;

    // Step 1: Check if user exists
    let userDoc = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .unique();

    // Step 2: Create new user if they don't exist
    if (!userDoc) {
      await ctx.db.insert("flashcards", {
        user: userId,
        categories: [category],
        flashcards: [
          {
            title,
            question,
            answer,
            category,
          },
        ],
      });
      return { status: "User created and flashcard added." };
    }

    const existingFlashcards = userDoc.flashcards ?? [];

    const duplicate = existingFlashcards.find(
      (fc) =>
        fc.title === title &&
        fc.question === question &&
        fc.category === category,
    );

    if (duplicate) {
      return { status: "Duplicate flashcard exists. Not added. error" };
    }

    const updatedFlashcards = [
      ...existingFlashcards,
      {
        title,
        question,
        answer,
        category,
      },
    ];

    const updatedCategories = userDoc.categories?.includes(category)
      ? userDoc.categories
      : [...(userDoc.categories ?? []), category];

    await ctx.db.patch(userDoc._id, {
      flashcards: updatedFlashcards,
      categories: updatedCategories,
    });

    return { status: "Flashcard added successfully." };
  },
});

export const getFlashcardsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    const userDoc = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();

    if (!userDoc) return [];

    return userDoc.flashcards;
  },
});

export const getCategoriesByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    const userDoc = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .first();

    if (!userDoc) return [];

    return userDoc.categories;
  },
});

export const deleteFlashcard = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    question: v.string(),
  },

  handler: async (ctx, args) => {
    const { userId, title, question } = args;

    // Step 1: Fetch user document
    const userDoc = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .unique();

    if (!userDoc) {
      return { status: "User not found erorr" };
    }
    console.log("userDoc", userDoc);
    const flashcards = userDoc.flashcards ?? [];

    // Step 2: Filter out the flashcard to delete
    const updatedFlashcards = flashcards.filter(
      (fc) => !(fc.title === title && fc.question === question),
    );

    if (flashcards.length === updatedFlashcards.length) {
      return { status: "Flashcard not found. Nothing deleted." };
    }

    // Step 3: Update categories if the deleted flashcard's category no longer exists
    const deletedFlashcard = flashcards.find(
      (fc) => fc.title === title && fc.question === question,
    );
    const categoryToRemove = deletedFlashcard?.category;

    const isCategoryStillUsed = updatedFlashcards.some(
      (fc) => fc.category === categoryToRemove,
    );

    const updatedCategories = isCategoryStillUsed
      ? userDoc.categories
      : userDoc.categories?.filter((cat) => cat !== categoryToRemove);

    // Step 4: Patch the user document
    await ctx.db.patch(userDoc._id, {
      flashcards: updatedFlashcards,
      categories: updatedCategories,
    });

    return { status: "Flashcard deleted successfully." };
  },
});

export const editFlashcard = mutation({
  args: {
    userId: v.string(),
    oldTitle: v.string(),
    oldQuestion: v.string(),
    newTitle: v.string(),
    newQuestion: v.string(),
    newAnswer: v.string(),
    newCategory: v.string(),
  },

  handler: async (ctx, args) => {
    const { userId, oldTitle, oldQuestion, newTitle, newQuestion, newAnswer, newCategory } = args;

    // Step 1: Fetch user document
    const userDoc = await ctx.db
      .query("flashcards")
      .withIndex("by_user", (q) => q.eq("user", userId))
      .unique();

    if (!userDoc) {
      return { status: "User not found error" };
    }

    const flashcards = userDoc.flashcards ?? [];

    // Step 2: Find and update the flashcard
    const flashcardIndex = flashcards.findIndex(
      (fc) => fc.title === oldTitle && fc.question === oldQuestion,
    );

    if (flashcardIndex === -1) {
      return { status: "Flashcard not found. Nothing updated." };
    }

    // Step 3: Check for duplicates with new title/question
    const duplicate = flashcards.find(
      (fc, index) =>
        index !== flashcardIndex &&
        fc.title === newTitle &&
        fc.question === newQuestion &&
        fc.category === newCategory,
    );

    if (duplicate) {
      return { status: "Duplicate flashcard exists. Not updated." };
    }

    // Step 4: Update the flashcard
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[flashcardIndex] = {
      title: newTitle,
      question: newQuestion,
      answer: newAnswer,
      category: newCategory,
    };

    // Step 5: Update categories if needed
    const oldCategory = flashcards[flashcardIndex].category;
    let updatedCategories = userDoc.categories ?? [];

    // Remove old category if it's no longer used
    const isOldCategoryStillUsed = updatedFlashcards.some(
      (fc) => fc.category === oldCategory,
    );
    if (!isOldCategoryStillUsed) {
      updatedCategories = updatedCategories.filter((cat) => cat !== oldCategory);
    }

    // Add new category if it doesn't exist
    if (!updatedCategories.includes(newCategory)) {
      updatedCategories = [...updatedCategories, newCategory];
    }

    // Step 6: Patch the user document
    await ctx.db.patch(userDoc._id, {
      flashcards: updatedFlashcards,
      categories: updatedCategories,
    });

    return { status: "Flashcard updated successfully." };
  },
});
