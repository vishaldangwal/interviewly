// components/QuizLoader.js
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function QuizLoader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Preparing your quiz...");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadingPhrases = [
      "Preparing your quiz...",
      "Gathering questions...",
      "Analyzing difficulty levels...",
      "Organizing content...",
      "Almost ready...",
    ];

    let progressInterval;
    let textInterval;

    // Simulate progress
    progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 120);

    // Change loading text periodically
    textInterval = setInterval(() => {
      setLoadingText((prevText) => {
        const currentIndex = loadingPhrases.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % loadingPhrases.length;
        return loadingPhrases[nextIndex];
      });
    }, 3000);

    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("quizTheme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setTheme("dark");
      }
    }

    // Clean up intervals
    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("quizTheme", newTheme);
  };

  return (
    <div className={`flex h-screen w-full items-center justify-center `}>
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="text-center">
          <h1
            className={`text-2xl font-semibold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            AI Quiz Generator
          </h1>

          {/* Brain animation icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div
              className={`absolute inset-0 rounded-full border-4 ${theme === "dark" ? "border-blue-900" : "border-blue-100"} opacity-50`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
              <div
                className={`absolute w-full h-full animate-pulse ${theme === "dark" ? "bg-blue-900" : "bg-blue-100"} rounded-full opacity-30`}
              ></div>
            </div>
          </div>

          <p
            className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            {loadingText}
          </p>

          {/* Progress bar */}
          <div
            className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2.5 mb-6`}
          >
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Please wait while our AI crafts the perfect quiz for you
          </p>

          {/* Dots loading animation */}
          <div className="flex justify-center gap-1 mt-4">
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "200ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "400ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
