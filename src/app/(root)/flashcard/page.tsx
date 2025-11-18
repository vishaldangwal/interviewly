"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { LoaderCircle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Flashcard from "./_components/FlashCard";
export default function FlashcardManagement() {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userCategories = useQuery(api.flashcards.getCategoriesByUser, {
    userId: user?.id,
  });
  const userFlashcards = useQuery(api.flashcards.getFlashcardsByUser, {
    userId: user?.id,
  });
  const [newCard, setNewCard] = useState({
    title: "",
    category: "",
    question: "",
    answer: "",
  });

  const [newCategory, setNewCategory] = useState("");
  const createFlashcard = useMutation(api.flashcards.createFlashcard);
  useEffect(() => {
    // Check system preference on initial load
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(prefersDark);
  }, []);
  const [selectedAIOption, setSelectedAIOption] = useState<string>("");

  const handleGenerateAIAnswer = async () => {
    if (
      selectedAIOption === "" ||
      newCard.question === "" ||
      newCard.title === "" ||
      newCard.category === ""
    ) {
      toast.error("Please select mandatory fields");
      return;
    }
    setIsLoading(true);
    toast.success("Generating AI Answer...");
    try {
      const response = await fetch("/api/generate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedAIOption,
          description: newCard.question,
          category: newCard.category,
          typetoAnswer: selectedAIOption,
        }),
      });
      const data = await response.json();
      console.log("data", data);
      setNewCard((prev) => ({ ...prev, answer: data.answer }));
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success("AI Answer Generated Successfully");
    } catch (error) {
      toast.error("Failed to generate AI Answer");
    } finally {
      setIsLoading(false);
    }
  };
  // Starting data with initial categories and flashcards
  const [categories, setCategories] = useState([
    "All",
    "Programming",
    "App Development",
    "Data Structures",
    "Core Subjects",
  ]);
  useEffect(() => {
    if (
      !Array.isArray(userCategories) ||
      userCategories.length === 0 ||
      !Array.isArray(userFlashcards) ||
      userFlashcards.length === 0
    ) {
      return;
    }

    console.log("userCategories", userCategories);
    console.log("userFlashcards", userFlashcards);

    setCategories(["All", ...userCategories]);

    setFlashcards(
      userFlashcards.map((f, idx) => ({
        ...f,
        id: idx + 1, // Ensure unique ID for each flashcard
      })),
    );
  }, [userCategories, userFlashcards]);

  const [flashcards, setFlashcards] = useState([]);

  const filteredCards = flashcards
    .filter(
      (card) =>
        selectedCategory === "All" || card.category === selectedCategory,
    )
    .filter((card) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(query) ||
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query)
      );
    });

  // theme2 configuration
  const theme2 = {
    dark: {
      bg: "",
      card: {
        front:
          "bg-gradient-to-br from-blue-700 to-indigo-800 shadow-lg shadow-blue-500/30",
        back: "bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/40 shadow-lg shadow-blue-500/10",
        textFront: "text-white",
        textBack: "text-blue-100",
        accent: "text-blue-300",
      },
      button: {
        primary:
          "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30",
        secondary:
          "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
      },
      text: {
        primary: "text-white",
        secondary: "text-blue-200",
      },
      input:
        "bg-slate-900 border-slate-700 text-blue-200 focus:border-blue-500 focus:ring-blue-500",
      modal: "bg-slate-900 border border-blue-800",
    },
    light: {
      bg: "",
      card: {
        front:
          "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-200",
        back: "bg-white border border-blue-200 shadow-xl shadow-blue-100/50",
        textFront: "text-white",
        textBack: "text-gray-900",
        accent: "text-blue-600",
      },
      button: {
        primary:
          "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200",
        secondary:
          "bg-white hover:bg-gray-50 text-blue-800 border border-blue-200 shadow-sm",
      },
      text: {
        primary: "text-gray-900",
        secondary: "text-blue-600",
      },
      input:
        "bg-white border-blue-300 text-blue-800 focus:border-blue-500 focus:ring-blue-500",
      modal: "bg-white border border-blue-200",
    },
  };
  const currenttheme2 = theme === "dark" ? theme2.dark : theme2.light;

  // Handler for adding a new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setShowNewCategoryModal(false);
    }
  };

  const handleAddFlashcard = async () => {
    if (
      newCard.title &&
      newCard.category &&
      newCard.question &&
      newCard.answer
    ) {
      toast.success("Adding flashcard...");
      const res = await createFlashcard({
        userId: user?.id,
        title: newCard.title,
        category: newCard.category,
        question: newCard.question,
        answer: newCard.answer,
      });
      if (res.status.includes("error")) {
        toast.error("Failed to add flashcard");
        return;
      }
      const newId =
        flashcards.length > 0
          ? Math.max(...flashcards.map((card) => card.id)) + 1
          : 1;
      setFlashcards([...flashcards, { ...newCard, id: newId }]);

      setNewCard({ title: "", category: "", question: "", answer: "" });
      setShowNewCardModal(false);
      toast.success("Flashcard added successfully");
    }
  };

  return (
    <div
      className={` mt-16 ${currenttheme2.bg} transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header styled like LandingPart.tsx */}
        <div className="relative flex flex-col items-center justify-center mb-12 mt-4">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-black/80 border border-blue-600/40 rounded-full px-6 py-3 mb-6 backdrop-blur-xl shadow-lg shadow-blue-600/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="relative">
              <Sparkles size={18} className="text-blue-400" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles size={18} className="text-blue-400 opacity-20" />
              </div>
            </div>
            <span className="text-sm text-blue-300 font-semibold tracking-wide">
              Keep your cards ready
            </span>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          </motion.div>

          {/* Premium Title */}
          <motion.h1
            className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight tracking-tight text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Flashcards{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              for your interview
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-blue-300 mb-2 leading-relaxed max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Use AI to generate flashcards for your interview.
          </motion.p>
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className={`pl-10 pr-4 py-3 w-full rounded-xl ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                placeholder="Search flashcards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNewCategoryModal(true)}
                className={`${currenttheme2.button.secondary} px-4 py-3 rounded-xl font-medium flex items-center shadow-lg w-full md:w-auto justify-center`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  ></path>
                </svg>
                New Category
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowNewCardModal(true)}
                className={`${currenttheme2.button.primary} px-6 py-3 rounded-xl font-medium flex items-center shadow-lg w-full md:w-auto justify-center`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                New Flashcard
              </motion.button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md shadow-indigo-500/20"
                    : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                {selectedCategory === category && (
                  <span className="mr-1">•</span>
                )}
                {category}
              </motion.button>
            ))}
          </div>

          {/* Results counter */}
          <p className={`${currenttheme2.text.secondary} text-sm`}>
            Showing {filteredCards.length}{" "}
            {filteredCards.length === 1 ? "card" : "cards"}
            {selectedCategory !== "All" ? ` in ${selectedCategory}` : null}
            {searchQuery ? ` matching "${searchQuery}"` : null}
          </p>
        </motion.div>

        {/* Flashcards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card, index) => (
              <Flashcard
                key={card.id}
                card={card}
                index={index}
                theme2={currenttheme2}
                onDelete={(deletedCard) => {
                  setFlashcards(prev => prev.filter(c => 
                    !(c.title === deletedCard.title && c.question === deletedCard.question)
                  ));
                  toast.success("Flashcard deleted successfully");
                }}
                onEdit={(oldCard, newData) => {
                  setFlashcards(prev => prev.map(c => 
                    c.title === oldCard.title && c.question === oldCard.question
                      ? { ...c, ...newData }
                      : c
                  ));
                  toast.success("Flashcard updated successfully");
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredCards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-20 ${currenttheme2.text.secondary}`}
          >
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold">No flashcards found</h3>
            <p className="mt-2">
              Try changing your search or selecting a different category
            </p>
          </motion.div>
        )}
      </div>

      {/* New Category Modal */}
      <AnimatePresence>
        {showNewCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`${currenttheme2.modal} rounded-2xl p-6 w-full max-w-md shadow-xl`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-xl font-bold ${currenttheme2.text.primary}`}
                >
                  Create New Category
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewCategoryModal(false)}
                  className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </motion.button>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="category-name"
                  className={`block mb-2 text-sm font-medium ${currenttheme2.text.secondary}`}
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="category-name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`w-full rounded-xl p-3 ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter category name"
                />
              </div>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowNewCategoryModal(false)}
                  className={`px-4 py-2 rounded-lg ${currenttheme2.button.secondary}`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddCategory}
                  className={`px-6 py-2 rounded-lg ${currenttheme2.button.primary}`}
                  disabled={!newCategory}
                >
                  Create Category
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Flashcard Modal */}
      <AnimatePresence>
        {showNewCardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`${currenttheme2.modal} rounded-2xl p-6 w-full max-w-5xl shadow-xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-xl font-bold ${currenttheme2.text.primary}`}
                >
                  Create New Flashcard
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewCardModal(false)}
                  className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </motion.button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - User Input */}
                <div className="flex-1 space-y-4">
                  <h4
                    className={`font-medium ${currenttheme2.text.primary} mb-2 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Card Details
                  </h4>

                  <div>
                    <label
                      htmlFor="card-title"
                      className={`block mb-2 text-sm font-medium ${currenttheme2.text.secondary}`}
                    >
                      Card Title
                    </label>
                    <input
                      type="text"
                      id="card-title"
                      value={newCard.title}
                      onChange={(e) =>
                        setNewCard({ ...newCard, title: e.target.value })
                      }
                      className={`w-full rounded-xl p-3 ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="Enter a title for your flashcard"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="card-category"
                      className={`block mb-2 text-sm font-medium ${currenttheme2.text.secondary}`}
                    >
                      Category
                    </label>
                    <select
                      id="card-category"
                      value={newCard.category}
                      onChange={(e) =>
                        setNewCard({ ...newCard, category: e.target.value })
                      }
                      className={`w-full rounded-xl p-3 ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500`}
                    >
                      <option value="">Select a category</option>
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="card-question"
                      className={`block mb-2 text-sm font-medium ${currenttheme2.text.secondary}`}
                    >
                      Question
                    </label>
                    <textarea
                      id="card-question"
                      value={newCard.question}
                      onChange={(e) =>
                        setNewCard({ ...newCard, question: e.target.value })
                      }
                      className={`w-full rounded-xl p-3 ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500 min-h-32`}
                      placeholder="Enter your question"
                    ></textarea>
                  </div>
                </div>

                {/* Right Column - AI Answer Generation */}
                <div className="flex-1 space-y-4">
                  <h4
                    className={`font-medium ${currenttheme2.text.primary} mb-2 pb-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Answer
                  </h4>

                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="card-answer"
                      className={`text-sm font-medium ${currenttheme2.text.secondary}`}
                    >
                      Answer Text
                    </label>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleGenerateAIAnswer()}
                      className={`px-4 py-2 rounded-lg flex items-center ${currenttheme2.button.secondary} border border-indigo-500 text-sm`}
                      disabled={!newCard.question || isLoading}
                    >
                      {!isLoading ? (
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                      ) : (
                        <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                      )}
                      Generate with AI
                    </motion.button>
                  </div>

                  <textarea
                    id="card-answer"
                    value={newCard.answer}
                    onChange={(e) =>
                      setNewCard({ ...newCard, answer: e.target.value })
                    }
                    className={`w-full rounded-xl p-3 ${currenttheme2.input} border outline-none focus:ring-2 focus:ring-indigo-500 min-h-44`}
                    placeholder={`${isLoading ? "Loading..." : "Enter the answer or generate with AI"}`}
                    disabled={isLoading}
                  ></textarea>

                  <div
                    className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"} mt-4`}
                  >
                    <div className="flex items-center mb-2">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span
                        className={`text-sm font-medium ${currenttheme2.text.secondary}`}
                      >
                        AI Answer Options
                      </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        className={`px-3 py-1 text-xs rounded-md ${
                          selectedAIOption === "concise"
                            ? `${darkMode ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-700"} border-indigo-500`
                            : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"} ${darkMode ? "border-gray-600" : "border-gray-300"}`
                        } border transition-colors`}
                        onClick={() => {
                          setSelectedAIOption("concise");
                        }}
                      >
                        {selectedAIOption === "concise" && (
                          <span className="mr-1">✓</span>
                        )}
                        Concise
                      </button>

                      <button
                        className={`px-3 py-1 text-xs rounded-md ${
                          selectedAIOption === "detailed"
                            ? `${darkMode ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-700"} border-indigo-500`
                            : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"} ${darkMode ? "border-gray-600" : "border-gray-300"}`
                        } border transition-colors`}
                        onClick={() => {
                          setSelectedAIOption("detailed");
                        }}
                      >
                        {selectedAIOption === "detailed" && (
                          <span className="mr-1">✓</span>
                        )}
                        Detailed
                      </button>

                      <button
                        className={`px-3 py-1 text-xs rounded-md ${
                          selectedAIOption === "examples"
                            ? `${darkMode ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-700"} border-indigo-500`
                            : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"} ${darkMode ? "border-gray-600" : "border-gray-300"}`
                        } border transition-colors`}
                        onClick={() => {
                          setSelectedAIOption("examples");
                        }}
                      >
                        {selectedAIOption === "examples" && (
                          <span className="mr-1">✓</span>
                        )}
                        With Examples
                      </button>

                      <button
                        className={`px-3 py-1 text-xs rounded-md ${
                          selectedAIOption === "quiz"
                            ? `${darkMode ? "bg-indigo-700 text-white" : "bg-indigo-100 text-indigo-700"} border-indigo-500`
                            : `${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"} ${darkMode ? "border-gray-600" : "border-gray-300"}`
                        } border transition-colors`}
                        onClick={() => {
                          setSelectedAIOption("quiz");
                          // handleAIOption("concise");
                        }}
                      >
                        {selectedAIOption === "quiz" && (
                          <span className="mr-1">✓</span>
                        )}
                        Quiz Format
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowNewCardModal(false)}
                  className={`px-4 py-2 rounded-lg ${currenttheme2.button.secondary}`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddFlashcard}
                  className={`px-6 py-2 rounded-lg ${currenttheme2.button.primary}`}
                  disabled={
                    !newCard.title ||
                    !newCard.category ||
                    !newCard.question ||
                    !newCard.answer
                  }
                >
                  Create Flashcard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
