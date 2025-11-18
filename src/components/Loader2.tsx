import { useState, useEffect } from "react";

export default function ProfessionalLoader() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg  shadow-lg">
      {/* Main loader animation */}
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
      <div className="ml-3 flex items-center text-blue-800 font-medium">
        <span>Loading</span>
        <span className="w-10 ml-1 text-left">{".".repeat(dots)}</span>
      </div>
    </div>
  );
}
