"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

// Utility function to detect code patterns
const detectCodePatterns = (text) => {
  // Only check for backticks - single or triple
  const tripleBacktickPattern = /```[\s\S]*?```/g;
  const singleBacktickPattern = /`([^`]+)`/g;
  
  return tripleBacktickPattern.test(text) || singleBacktickPattern.test(text);
};

// Component to render text with code styling
const TextWithCode = ({ text, className = "", maxLength = null }) => {
  const displayText = maxLength && text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;

  // Check if the text contains code patterns
  const hasCode = detectCodePatterns(displayText);

  if (!hasCode) {
    return <p className={className}>{displayText}</p>;
  }

  // Split text into code and non-code segments
  const segments = [];
  let currentText = displayText;
  
  // Only handle backticks - prioritize triple backticks
  const codePatterns = [
    { pattern: /```[\s\S]*?```/g, type: 'codeblock' },
    { pattern: /`([^`]+)`/g, type: 'inline' },
  ];

  let lastIndex = 0;
  const matches = [];

  // Collect all matches
  codePatterns.forEach(({ pattern, type }) => {
    let match;
    while ((match = pattern.exec(displayText)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        type
      });
    }
  });

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start);

  // Build segments
  matches.forEach(match => {
    // Add text before match
    if (match.start > lastIndex) {
      segments.push({
        text: displayText.substring(lastIndex, match.start),
        type: 'text'
      });
    }
    
    // Add the match
    segments.push({
      text: match.text,
      type: match.type
    });
    
    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < displayText.length) {
    segments.push({
      text: displayText.substring(lastIndex),
      type: 'text'
    });
  }

  return (
    <p className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={index}>{segment.text}</span>;
        }
        
        return (
          <code
            key={index}
            className="font-mono text-sm text-blue-400 dark:text-cyan-300 font-semibold"
          >
            {segment.text}
          </code>
        );
      })}
    </p>
  );
};

function Flashcard({ card, index, theme2, onDelete, onEdit }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: card.title,
    question: card.question,
    answer: card.answer,
    category: card.category,
  });

  const { user } = useUser();
  const deleteFlashcard = useMutation(api.flashcards.deleteFlashcard);
  const editFlashcard = useMutation(api.flashcards.editFlashcard);

  // Card variant
  const frontCardStyle = `${theme2.card.front} ${theme2.card.textFront}`;
  const backCardStyle = `${theme2.card.back} ${theme2.card.textBack}`;

  // Dynamic height based on expanded state
  const cardHeight = isExpanded ? "h-80" : "h-64";

  // Handle expand toggle separately from flip
  const handleExpandClick = (e) => {
    e.stopPropagation(); // Prevent triggering the flip
    setIsExpanded(!isExpanded);
  };

  // Handler for modal open (for answer)
  const handleShowMoreAnswer = (e) => {
    e.stopPropagation();
    setShowAnswerModal(true);
  };

  // Handler for modal close
  const handleCloseModal = () => {
    setShowAnswerModal(false);
  };

  // Handle delete flashcard
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      const result = await deleteFlashcard({
        userId: user.id,
        title: card.title,
        question: card.question,
      });
      
      if (result.status.includes("successfully")) {
        onDelete && onDelete(card);
        setShowDeleteModal(false);
      } else {
        console.error("Delete failed:", result.status);
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle delete confirmation modal open
  const handleShowDeleteModal = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Handle edit flashcard
  const handleEdit = async (e) => {
    e.stopPropagation();
    if (!user?.id) return;

    setIsEditing(true);
    try {
      const result = await editFlashcard({
        userId: user.id,
        oldTitle: card.title,
        oldQuestion: card.question,
        newTitle: editForm.title,
        newQuestion: editForm.question,
        newAnswer: editForm.answer,
        newCategory: editForm.category,
      });
      
      if (result.status.includes("successfully")) {
        onEdit && onEdit(card, editForm);
        setShowEditModal(false);
      } else {
        console.error("Edit failed:", result.status);
      }
    } catch (error) {
      console.error("Error editing flashcard:", error);
    } finally {
      setIsEditing(false);
    }
  };

  // Handle edit form changes
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit modal open
  const handleShowEditModal = (e) => {
    e.stopPropagation();
    setEditForm({
      title: card.title,
      question: card.question,
      answer: card.answer,
      category: card.category,
    });
    setShowEditModal(true);
  };

  // Handle edit modal close
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={`perspective-3d ${isExpanded ? "min-h-64" : "h-64"}`}
        whileHover={{
          translateY: -8,
          transition: { type: "spring", stiffness: 300 },
        }}
      >
        <motion.div
          className="relative w-full h-full rounded-2xl cursor-pointer preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of Card */}
          <motion.div
            className={`absolute inset-0 p-6 rounded-2xl ${frontCardStyle} backface-hidden flex flex-col justify-between ${isExpanded ? "min-h-64" : "h-64"}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                  {card.category}
                </span>

                <div className="flex items-center space-x-1">
                  {/* Edit Button */}
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleShowEditModal}
                    title="Edit flashcard"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </motion.button>

                  {/* Delete Button */}
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-red-500/20"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleShowDeleteModal}
                    title="Delete flashcard"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </motion.button>

                  {/* Expand Button */}
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/80"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleExpandClick}
                  >
                    {isExpanded ? (
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
                          d="M5 15l7-7 7 7"
                        ></path>
                      </svg>
                    ) : (
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
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <div className="flex items-start mb-4 flex-grow overflow-hidden">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0 text-white/80 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <TextWithCode 
                  text={card.question}
                  className="text-lg"
                  maxLength={isExpanded ? null : 100}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              {!isExpanded && card.question.length > 100 && (
                <motion.button
                  className="flex items-center px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm text-sm"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleExpandClick}
                >
                  Show more
                  <svg
                    className="w-4 h-4 ml-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </motion.button>
              )}

              <motion.div
                className={`flex items-center px-3 py-1.5 bg-white/20 rounded-lg backdrop-blur-sm text-sm ml-auto`}
                whileHover={{ scale: 1.05 }}
              >
                Tap to reveal
                <svg
                  className="w-4 h-4 ml-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-20 bg-white"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -top-2 -left-2 w-16 h-16 rounded-full opacity-10 bg-white"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>

          {/* Back of Card */}
          <motion.div
            className={`absolute inset-0 p-6 rounded-2xl ${backCardStyle} backface-hidden flex flex-col justify-between ${isExpanded ? "min-h-64" : "h-64"} ${isFlipped ? "" : "hidden"}`}
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-xl font-bold ${theme2.card.accent}`}>
                  {card.title}
                </h3>
                <div className="flex space-x-2">
                  <span
                    className={`px-3 py-1 bg-indigo-500/10 ${theme2.card.accent} rounded-full text-xs font-medium`}
                  >
                    Answer
                  </span>
                  <motion.button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-300"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleExpandClick}
                  >
                    {isExpanded ? (
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
                          d="M5 15l7-7 7 7"
                        ></path>
                      </svg>
                    ) : (
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
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10 overflow-auto flex-grow h-12">
                <TextWithCode 
                  text={card.answer}
                  className="text-lg"
                  maxLength={isExpanded ? null : 80}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-indigo-300/80">#{card.id}</span>

              {/* Show more button opens modal now */}
              {!isExpanded && card.answer.length > 80 && (
                <motion.button
                  className={`flex items-center ${theme2.card.accent}  px-3 py-1.5 bg-indigo-500/5 rounded-lg text-sm mr-auto ml-2`}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleShowMoreAnswer}
                >
                  Show more
                  <svg
                    className="w-4 h-4 ml-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </motion.button>
              )}

              <motion.div
                className={`flex items-center ${theme2.card.accent} px-3 py-1.5 rounded-lg text-sm`}
                whileHover={{ scale: 1.05 }}
              >
                Tap to flip back
                <svg
                  className="w-4 h-4 ml-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path>
                </svg>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-5 bg-indigo-200"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modal for full answer */}
      <AnimatePresence>
        {showAnswerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`${backCardStyle} rounded-2xl p-8 w-full max-w-xl shadow-xl relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                className={`absolute top-4 right-4 p-2 rounded-full ${theme2.card.accent} bg-white/10 hover:bg-white/20`}
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
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-2xl font-bold ${theme2.card.accent}`}>
                    {card.title}
                  </h3>
                  <span
                    className={`px-3 py-1 bg-indigo-500/10 ${theme2.card.accent} rounded-full text-xs font-medium`}
                  >
                    Answer
                  </span>
                </div>
                <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10 overflow-auto flex-grow max-h-96">
                  <TextWithCode 
                    text={card.answer}
                    className="text-lg whitespace-pre-line"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <span className="text-xs text-indigo-300/80">#{card.id}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for editing flashcard */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-4xl shadow-xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseEditModal}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
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
              
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Flashcard
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                    {card.category}
                  </span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="flex-1 space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                      Card Details
                    </h4>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Card Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => handleEditFormChange('title', e.target.value)}
                        className="w-full rounded-xl p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter a title for your flashcard"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Category
                      </label>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => handleEditFormChange('category', e.target.value)}
                        className="w-full rounded-xl p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter category"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question
                      </label>
                      <textarea
                        value={editForm.question}
                        onChange={(e) => handleEditFormChange('question', e.target.value)}
                        rows={4}
                        className="w-full rounded-xl p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Enter your question"
                      />
                    </div>
                  </div>

                  {/* Right Column - Answer */}
                  <div className="flex-1 space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                      Answer
                    </h4>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Answer Text
                      </label>
                      <textarea
                        value={editForm.answer}
                        onChange={(e) => handleEditFormChange('answer', e.target.value)}
                        rows={8}
                        className="w-full rounded-xl p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Enter your answer"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 mt-4">
                      <div className="flex items-center mb-2">
                        <svg
                          className="w-5 h-5 mr-2 text-purple-500"
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Card Preview
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <p><strong>Title:</strong> {editForm.title || 'No title'}</p>
                        <p><strong>Category:</strong> {editForm.category || 'No category'}</p>
                        <p><strong>Question:</strong> <TextWithCode text={editForm.question ? (editForm.question.length > 50 ? editForm.question.substring(0, 50) + '...' : editForm.question) : 'No question'} className="inline" /></p>
                        <p><strong>Answer:</strong> <TextWithCode text={editForm.answer ? (editForm.answer.length > 50 ? editForm.answer.substring(0, 50) + '...' : editForm.answer) : 'No answer'} className="inline" /></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleEdit}
                    disabled={isEditing}
                    className={`px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center space-x-2 ${
                      isEditing ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for delete confirmation */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseDeleteModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseDeleteModal}
                className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
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
              
              <div className="flex flex-col items-center text-center">
                {/* Warning Icon */}
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    ></path>
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Flashcard
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "<span className="font-medium text-gray-900 dark:text-white">{card.title}</span>"? This action cannot be undone.
                </p>

                {/* Action buttons */}
                <div className="flex gap-3 w-full">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCloseDeleteModal}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 ${
                      isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                        <span>Delete</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


export default Flashcard;