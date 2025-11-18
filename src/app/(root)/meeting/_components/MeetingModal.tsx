import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import useMeetingActions from "@/hooks/useMeetingActions";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

function MeetingModal({
  isOpen,
  onClose,
  title,
  isJoinMeeting,
}: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createInstantMeeting, joinMeeting } = useMeetingActions();

  const handleStart = () => {
    if (isJoinMeeting) {
      // if it's a full URL extract meeting ID
      const meetingId = meetingUrl.split("/").pop();
      if (meetingId) joinMeeting(meetingId);
    } else {
      createInstantMeeting();
    }

    setMeetingUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border-blue-200 dark:border-blue-900 shadow-lg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-200/50 dark:bg-blue-900/30 mix-blend-multiply dark:mix-blend-soft-light blur-3xl opacity-40"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1, 0.8],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-blue-300/50 dark:bg-blue-600/30 mix-blend-multiply dark:mix-blend-soft-light blur-3xl opacity-40"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          />
        </div>

        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <DialogHeader className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-md shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                {isJoinMeeting ? (
                  <>
                    <path d="M15 10l5 5-5 5" />
                    <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                  </>
                ) : (
                  <>
                    <path d="M23 19v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </>
                )}
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {title}
              </span>
            </DialogTitle>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="space-y-4 pt-4 relative z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {isJoinMeeting && (
              <motion.div
                key="join-input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <motion.label
                  className="text-sm text-muted-foreground block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Enter a meeting URL or ID to join
                </motion.label>
                <Input
                  placeholder="Paste meeting link here..."
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500"
                />
                {meetingUrl.trim() && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Your connection is secure
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="flex justify-end gap-3 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-blue-200 dark:border-blue-900"
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleStart}
                disabled={(isJoinMeeting && !meetingUrl.trim()) || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </motion.div>
                ) : isJoinMeeting ? (
                  <>
                    Join Meeting
                    <motion.span
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 5h4a2 2 0 0 1 2 2v4" />
                        <polyline points="7 10 12 15 17 10" />
                        <path d="M12 15v9" />
                      </svg>
                    </motion.span>
                  </>
                ) : (
                  <>
                    Start Meeting
                    <motion.span
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" />
                      </svg>
                    </motion.span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default MeetingModal;
