"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CallRecording } from "@stream-io/video-react-sdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoIcon } from "lucide-react";
import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "./_components/RecordingCard";
import useGetCalls from "../../../hooks/useGetCalls";

function RecordingsPage() {
  const { calls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;

      try {
        const callData = await Promise.all(
          calls.map((call) => call.queryRecordings()),
        );
        const allRecordings = callData.flatMap((call) => call.recordings);
        setRecordings(allRecordings);
      } catch (error) {}
    };

    fetchRecordings();
  }, [calls]);

  if (isLoading) return <LoaderUI />;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-7xl mx-auto p-6"
    >
      {/* HEADER SECTION */}
      <div className="relative mb-8 mt-20">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white mb-5">
            Recordings
          </h1>
        </motion.div>
        <motion.div
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <VideoIcon className="h-3.5 w-3.5 mr-1" />
              <span>
                {recordings.length}{" "}
                {recordings.length === 1 ? "recording" : "recordings"} available
              </span>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="absolute -z-10 top-0 left-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] mt-3 pr-4">
        <AnimatePresence>
          {recordings.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6"
            >
              {recordings.map((r, index) => (
                <motion.div
                  key={r.end_time || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <RecordingCard recording={r} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center h-[400px] gap-4"
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="bg-blue-100 dark:bg-blue-900/20 p-6 rounded-full"
              >
                <VideoIcon className="h-12 w-12 text-blue-500" />
              </motion.div>
              <p className="text-xl font-medium text-muted-foreground">
                No recordings available
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Once you record your calls, they will appear here for you to
                view and share
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}

export default RecordingsPage;
