import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Dummy data representing progress over time
function parseTimeToSeconds(timeStr: string): number {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

function generateProgressData(quizResult: any) {
  if (!quizResult?.attemptsHistory) return [];

  return quizResult.attemptsHistory.map((attempt: any, index: number) => ({
    attempt: index + 1,
    timeTaken: parseTimeToSeconds(attempt.timeSpent),
    errors: attempt.incorrectAnswers || 0,
  }));
}

export default function ProgressChart( {quizData}) {
  const progressData = generateProgressData(quizData);

  const [currentTheme, setCurrentTheme] = useState({
    card: { bg: "bg-white dark:bg-gray-800" },
    text: {
      primary: "text-gray-900 dark:text-gray-100",
      muted: "text-gray-500 dark:text-gray-400",
    },
  });

  const [activeMetric, setActiveMetric] = useState("both");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${currentTheme.card.bg} rounded-xl p-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className={`text-lg font-medium ${currentTheme.text.primary}`}>
          Progress Chart
        </h4>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveMetric("both")}
            className={`px-3 py-1 rounded text-sm ${activeMetric === "both" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            Both
          </button>
          <button
            onClick={() => setActiveMetric("time")}
            className={`px-3 py-1 rounded text-sm ${activeMetric === "time" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            Time
          </button>
          <button
            onClick={() => setActiveMetric("errors")}
            className={`px-3 py-1 rounded text-sm ${activeMetric === "errors" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          >
            Errors
          </button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={progressData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.2}
            />
            <XAxis
              dataKey="attempt"
              label={{
                value: "Attempt Number",
                position: "insideBottomRight",
                offset: -5,
              }}
              stroke={currentTheme.text.muted}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Time (seconds)",
                angle: -90,
                position: "insideLeft",
              }}
              stroke="#3B82F6"
              domain={[0, "dataMax + 20"]}
              hide={activeMetric === "errors"}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Errors", angle: 90, position: "insideRight" }}
              stroke="#EF4444"
              domain={[0, "dataMax + 2"]}
              hide={activeMetric === "time"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor:
                  currentTheme.card.bg === "bg-white dark:bg-gray-800"
                    ? "#1F2937"
                    : "white",
                borderColor: "#374151",
                borderRadius: "8px",
                color:
                  currentTheme.text.primary ===
                  "text-gray-900 dark:text-gray-100"
                    ? "#F9FAFB"
                    : "#1F2937",
              }}
            />
            <Legend />
            {(activeMetric === "both" || activeMetric === "time") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="timeTaken"
                name="Time Taken (s)"
                stroke="#3B82F6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            )}
            {(activeMetric === "both" || activeMetric === "errors") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="errors"
                name="Errors"
                stroke="#EF4444"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className={`${currentTheme.text.muted} text-sm`}>
          {activeMetric === "both" && "Showing time and error metrics"}
          {activeMetric === "time" && "Showing time metrics only"}
          {activeMetric === "errors" && "Showing error metrics only"}
        </p>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
          <span className={`${currentTheme.text.muted} text-xs`}>Time</span>
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-2"></span>
          <span className={`${currentTheme.text.muted} text-xs`}>Errors</span>
        </div>
      </div>
    </motion.div>
  );
}
