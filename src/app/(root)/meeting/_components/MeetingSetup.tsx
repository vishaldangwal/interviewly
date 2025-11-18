import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  CameraIcon,
  MicIcon,
  SettingsIcon,
  VideoIcon,
  Shield,
  Users,
  CheckCircle,
  Coffee,
  Smile,
  MessageCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await call.join();
      onSetupComplete();
    } catch (error) {
      setIsJoining(false);
      console.error("Failed to join call:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Interview tips
  const interviewTips = [
    {
      icon: <CheckCircle size={16} />,
      text: "Research the company thoroughly",
    },
    {
      icon: <Smile size={16} />,
      text: "Show enthusiasm and positive attitude",
    },
    { icon: <Coffee size={16} />, text: "Keep a glass of water nearby" },
    {
      icon: <MessageCircle size={16} />,
      text: "Prepare concise answers using the STAR method",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-background/95 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -right-64 -top-64 w-96 h-96 rounded-full bg-blue-600/5 dark:bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <div className="w-full max-w-[1200px] mx-auto z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* HEADER - Mobile only */}
          <motion.div
            variants={itemVariants}
            className="md:hidden col-span-1 mb-2"
          >
            <motion.h1
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent inline-block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Get Ready for Your Meeting
            </motion.h1>
            <motion.div
              className="flex items-center gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Shield size={14} className="text-blue-500" />
              <p className="text-xs text-muted-foreground">
                Secure connection established
              </p>
            </motion.div>
          </motion.div>

          {/* VIDEO PREVIEW CONTAINER - Now with a flex layout to match height */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="md:col-span-1 p-6 border-blue-100 dark:border-blue-900/50 shadow-lg relative overflow-hidden h-full flex flex-col">
              {/* Top accent bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />

              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl font-semibold mb-1 flex items-center gap-2"
                    >
                      <VideoIcon size={18} className="text-blue-600" />
                      Camera Preview
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-muted-foreground"
                    >
                      Make sure you look good!
                    </motion.p>
                  </div>

                  {/* Enhanced status indicator with brighter blue when camera is on */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full ${!isCameraDisabled ? "bg-blue-500/20 dark:bg-blue-400/30" : "bg-blue-100 dark:bg-blue-900/30"}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full animate-pulse ${isCameraDisabled ? "bg-red-500" : "bg-green-500"}`}
                    ></span>
                    <span
                      className={`text-xs font-medium ${!isCameraDisabled ? "text-blue-700 dark:text-blue-300" : ""}`}
                    >
                      {isCameraDisabled ? "Camera Off" : "Live Preview"}
                    </span>
                  </motion.div>
                </div>

                {/* VIDEO PREVIEW */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex-1 min-h-[320px] rounded-xl overflow-hidden bg-muted/30 border border-blue-100 dark:border-blue-900/50 relative shadow-inner"
                >
                  <div className="absolute inset-0">
                    <VideoPreview className="h-full w-full object-cover" />

                    {/* Overlay when camera is disabled */}
                    <AnimatePresence>
                      {isCameraDisabled && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                            }}
                            className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4"
                          >
                            <CameraIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.2 }}
                            className="text-center font-medium"
                          >
                            Camera is turned off
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm text-muted-foreground text-center max-w-[80%]"
                          >
                            Toggle the camera switch to enable your video
                            preview
                          </motion.p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* INTERVIEW TIPS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4"
                >
                  <h3 className="text-sm font-semibold mb-2 text-blue-700 dark:text-blue-400">
                    Tips to Ace Your Interview
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {interviewTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                      >
                        <span className="mt-0.5 text-blue-600 dark:text-blue-400">
                          {tip.icon}
                        </span>
                        <span className="text-xs">{tip.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* CARD CONTROLS */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="md:col-span-1 p-6 border-blue-100 dark:border-blue-900/50 shadow-lg relative h-full">
              {/* Top accent bar */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />

              <div className="h-full flex flex-col">
                {/* MEETING DETAILS */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        Meeting Details
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Ready to join your call
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-xs font-medium">Ready</span>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.5 }}
                    className="mt-2 bg-muted/30 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30"
                  >
                    <p className="text-xs font-medium text-muted-foreground">
                      Meeting ID
                    </p>
                    <p className="text-sm font-mono break-all mt-1">
                      {call.id}
                    </p>
                  </motion.div>
                </motion.div>

                <div className="flex-1 flex flex-col justify-between">
                  <motion.div
                    className="space-y-6 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 mb-6"
                    >
                      <span className="font-medium text-foreground">Tip:</span>{" "}
                      For the best experience, use a quiet room and good
                      lighting
                    </motion.div>

                    <motion.div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full ${!isCameraDisabled ? "bg-blue-500 dark:bg-blue-600" : "bg-muted"} flex items-center justify-center`}
                        >
                          <CameraIcon
                            className={`h-5 w-5 ${!isCameraDisabled ? "text-white dark:text-blue-100" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">Camera</p>
                          <p className="text-sm text-muted-foreground">
                            {isCameraDisabled ? "Off" : "On"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={!isCameraDisabled}
                        onCheckedChange={(checked) =>
                          setIsCameraDisabled(!checked)
                        }
                      />
                    </motion.div>

                    <motion.div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full ${!isMicDisabled ? "bg-blue-500 dark:bg-blue-600" : "bg-muted"} flex items-center justify-center`}
                        >
                          <MicIcon
                            className={`h-5 w-5 ${!isMicDisabled ? "text-white dark:text-blue-100" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">Microphone</p>
                          <p className="text-sm text-muted-foreground">
                            {isMicDisabled ? "Off" : "On"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={!isMicDisabled}
                        onCheckedChange={(checked) =>
                          setIsMicDisabled(!checked)
                        }
                      />
                    </motion.div>

                    <motion.div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-200 dark:bg-blue-600/50 flex items-center justify-center">
                          <SettingsIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">Settings</p>
                          <p className="text-sm text-muted-foreground">
                            Configure devices
                          </p>
                        </div>
                      </div>
                      <DeviceSettings />
                    </motion.div>
                  </motion.div>

                  {/* JOIN BTN */}
                  <motion.div
                    className="space-y-3 mt-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, type: "spring" }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                        onClick={handleJoin}
                        disabled={isJoining}
                      >
                        {isJoining ? (
                          <>
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
                                width="18"
                                height="18"
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
                            Joining...
                          </>
                        ) : (
                          <>
                            Join Meeting
                            <motion.span
                              initial={{ x: -5, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 1.2 }}
                              className="ml-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M15 10l5 5-5 5" />
                                <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                              </svg>
                            </motion.span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                      className="text-xs text-center text-muted-foreground"
                    >
                      Do not worry, our team is super friendly! We want you to
                      succeed. <span className="text-blue-500">🎉</span>
                    </motion.p>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
export default MeetingSetup;
