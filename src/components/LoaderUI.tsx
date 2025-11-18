"use client";
import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";

function LoaderUI() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem-1px)] flex flex-col items-center justify-center p-6 rounded-lg  shadow-lg">
      <div className="relative w-16 h-16 mb-4">
        {/* Rotating blue rings */}
        <div
          className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"
          style={{ animationDuration: "1.2s" }}
        ></div>
        <div
          className="absolute inset-0 border-r-4 border-blue-400 rounded-full animate-spin"
          style={{ animationDuration: "1.6s" }}
        ></div>
        <div
          className="absolute inset-0 border-b-4 border-blue-300 rounded-full animate-spin"
          style={{ animationDuration: "2s" }}
        ></div>

        {/* Inner color gradient */}
        <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-80"></div>
      </div>

      {/* Subtle dot animation for the loading text */}
      <div className="ml-8 flex items-center text-white font-medium">
        <span className="text-blue-400">Loading</span>
        <span className="w-10 ml-1 text-left text-white">
          {".".repeat(dots)}
        </span>
      </div>
    </div>
  );
}
export default LoaderUI;
