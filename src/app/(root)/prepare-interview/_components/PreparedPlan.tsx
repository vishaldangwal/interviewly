import React from "react";
import { motion } from "framer-motion";
import { Calendar, BookOpen, AlertCircle } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const PreparedPlan = ({
  prepDays,
  jobTitle,

  studyPlan,
  clearSavedPlan,
}: any) => {
  return (
    <div>
      {" "}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=""
      >
      

        <div className="flex flex-col items-center rounded-xl min-h-screen bg-gray-50 dark:bg-gray-950  px-4 transition-colors duration-200">
          <div className="w-full  ">
            <motion.div
              className="relative"
              variants={container}
              initial="hidden"
              animate="show"
              viewport={{ once: true }}
            >
              {/* Main horizontal timeline container */}
              <div className="w-full py-12 overflow-x-auto mt-40">
                <div className="relative min-w-max px-4 mt-40">
                  {/* Animated timeline line with gradient glow effect */}
                  <motion.div
                    className="absolute top-24 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 dark:from-blue-600 dark:via-blue-400 dark:to-blue-600"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut",
                    }}
                  >
                    {/* Animated glowing dot that moves across the timeline */}
                    <motion.div
                      className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50 top-1/2 transform -translate-y-1/2"
                      animate={{
                        left: ["0%", "100%"],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  {/* Timeline items container with flexbox */}
                  <div className="flex">
                    {studyPlan.map((day, index) => {
                      const isEven = index % 2 === 0;
                      const cardWidth = 280; // Fixed width for all cards

                      return (
                        <motion.div
                          key={day.day}
                          className="relative mx-6 first:ml-0 last:mr-0"
                          style={{ width: cardWidth }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                          }}
                        >
                          {/* Timeline node/dot with ripple effect */}
                          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                            <motion.div
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500 flex items-center justify-center shadow-lg cursor-pointer"
                              whileHover={{
                                scale: 1.2,
                                boxShadow: "0 0 15px rgba(59, 130, 246, 0.7)",
                              }}
                              whileTap={{ scale: 0.9 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 10,
                              }}
                            >
                              {/* Multiple ripple animations */}
                              <motion.div
                                className="absolute w-full h-full rounded-full bg-blue-400 opacity-60"
                                animate={{
                                  scale: [1, 1.8, 1],
                                  opacity: [0.6, 0, 0.6],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  delay: index * 0.2,
                                }}
                              />
                              <motion.div
                                className="absolute w-full h-full rounded-full bg-blue-300 opacity-40"
                                animate={{
                                  scale: [1, 2.2, 1],
                                  opacity: [0.4, 0, 0.4],
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  delay: index * 0.2 + 0.3,
                                }}
                              />
                              <span className="text-white font-bold text-sm">
                                {day.day}
                              </span>
                            </motion.div>
                          </div>

                          {/* Animated connecting lines */}
                          <motion.div
                            className={`absolute left-1/2 transform -translate-x-1/2 w-px ${
                              isEven
                                ? "top-24 h-20 bg-gradient-to-b from-blue-500 to-blue-300"
                                : "bottom-[calc(100%-24px)] h-20 bg-gradient-to-b from-blue-300 to-blue-500"
                            } dark:from-blue-500 dark:to-blue-400`}
                            initial={{ height: 0 }}
                            animate={{ height: "80px" }}
                            transition={{
                              delay: index * 0.15,
                              duration: 0.5,
                            }}
                          />

                          {/* Content card with enhanced interactions */}
                          <motion.div
                            className={`w-full p-4 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-blue-200 dark:border-blue-800/30 overflow-hidden ${
                              isEven
                                ? "mt-36"
                                : "mb-36 transform translate-y-[-180px]"
                            }`}
                            initial={{
                              y: isEven ? -20 : 20,
                              opacity: 0,
                              scale: 0.9,
                            }}
                            animate={{
                              y: isEven ? 0 : -180,
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              delay: index * 0.15,
                              duration: 0.6,
                            }}
                            whileHover={{
                              scale: 1.05,
                              boxShadow:
                                "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                              borderTopColor: "#3b82f6",
                              borderTopWidth: "4px",
                            }}
                          >
                            {/* Animated gradient border on hover */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 opacity-0"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.1 }}
                              style={{
                                borderRadius: "inherit",
                              }}
                            />

                            <div className="flex items-center mb-3 pb-2 border-b border-blue-100 dark:border-blue-800/50">
                              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 mr-2">
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Calendar
                                    size={16}
                                    className="text-blue-600 dark:text-blue-400"
                                  />
                                </motion.div>
                              </div>
                              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                                Day {day.day}
                              </h3>
                            </div>

                            <div className="mb-3">
                              <div className="flex items-start mb-2">
                                <motion.div
                                  whileHover={{ rotate: 15 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                  }}
                                >
                                  <BookOpen
                                    size={16}
                                    className="text-blue-500 dark:text-blue-400 mt-1 mr-2 flex-shrink-0"
                                  />
                                </motion.div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">
                                    Topics:
                                  </h4>
                                  <motion.ul
                                    className="space-y-1 pl-1 text-gray-700 dark:text-gray-300 text-xs"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                      visible: {
                                        transition: {
                                          staggerChildren: 0.1,
                                        },
                                      },
                                    }}
                                  >
                                    {day.topics && day.topics.length > 0 ? (
                                      day.topics.map((topic, i) => (
                                        <motion.li
                                          key={i}
                                          className="flex items-center"
                                          variants={{
                                            hidden: {
                                              opacity: 0,
                                              x: -10,
                                            },
                                            visible: {
                                              opacity: 1,
                                              x: 0,
                                            },
                                          }}
                                          whileHover={{
                                            x: 5,
                                            color: "#3b82f6",
                                          }}
                                        >
                                          <motion.div
                                            className="w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400 mr-1.5"
                                            whileHover={{
                                              scale: 2,
                                            }}
                                          ></motion.div>
                                          {topic.topic || "Unnamed Topic"}
                                        </motion.li>
                                      ))
                                    ) : (
                                      <li className="flex items-center text-yellow-600 dark:text-yellow-400">
                                        <div className="w-1 h-1 rounded-full bg-yellow-500 mr-1.5"></div>
                                        No topics assigned
                                      </li>
                                    )}
                                  </motion.ul>
                                </div>
                              </div>
                            </div>

                            {/* @ts-ignore */}
                            {day.notes && (
                              <motion.div
                                className="flex items-start p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 text-xs overflow-hidden relative"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: index * 0.25,
                                }}
                              >
                                <motion.div
                                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                                  initial={{
                                    opacity: 0,
                                    x: "-100%",
                                  }}
                                  whileHover={{
                                    opacity: 0.3,
                                    x: "100%",
                                  }}
                                  transition={{ duration: 0.8 }}
                                />
                                <AlertCircle
                                  size={14}
                                  className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0"
                                />
                                <p className="line-clamp-2">{day.notes}</p>
                              </motion.div>
                            )}

                            <div className="mt-3 pt-2 border-t border-blue-100 dark:border-blue-800/50">
                              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>Progress</span>
                                <span>
                                  {Math.floor(
                                    ((index + 1) / studyPlan.length) * 100,
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="mt-1 h-1.5 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-300 rounded-full relative"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.floor(((index + 1) / studyPlan.length) * 100)}%`,
                                  }}
                                  transition={{
                                    delay: index * 0.3,
                                    duration: 0.8,
                                  }}
                                >
                                  <motion.div
                                    className="absolute right-0 top-0 bottom-0 w-4 bg-white/50"
                                    animate={{
                                      x: [10, -5, 10],
                                      opacity: [0, 0.5, 0],
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: Infinity,
                                      repeatType: "loop",
                                    }}
                                  />
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced navigation controls */}
              </div>
              {/* <HorizontalScrollButtons /> */}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PreparedPlan;
