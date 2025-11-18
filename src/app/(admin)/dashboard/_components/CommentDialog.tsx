import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquareIcon, StarIcon, SendIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { format } from "date-fns";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Textarea } from "../../../../components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

function CommentDialog({ interviewId }: { interviewId: Id<"interviews"> }) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("3");

  const addComment = useMutation(api.comments.addComment);
  const users = useQuery(api.users.getUsers);
  const existingComments = useQuery(api.comments.getComments, { interviewId });

  const handleSubmit = async () => {
    if (!comment.trim())
      return toast.error("Please enter a comment", {
        style: {
          background: theme === "dark" ? "#1e1e2e" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1e1e2e",
          border: "1px solid #6b21a8",
        },
      });

    try {
      await addComment({
        interviewId,
        content: comment.trim(),
        rating: parseInt(rating),
      });

      toast.success("Comment submitted successfully", {
        style: {
          background: theme === "dark" ? "#1e1e2e" : "#ffffff",
          color: theme === "dark" ? "#ffffff" : "#1e1e2e",
          border: "1px solid #6b21a8",
        },
      });
      setComment("");
      setRating("3");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit comment");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <StarIcon
          key={starValue}
          className={`h-4 w-4 ${
            starValue <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );

  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  const commentItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: { opacity: 0, y: -10 },
  };

  if (existingComments === undefined || users === undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* TRIGGER BUTTON */}
      <DialogTrigger asChild>
        <motion.div
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          className="w-full"
        >
          <Button
            variant="secondary"
            className="w-full bg-gradient-to-r from-blue-500/80 to-blue-500/80 hover:from-blue-600/80 hover:to-blue-600/80 text-white border-none"
          >
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Comments & Feedback
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <MessageSquareIcon className="h-5 w-5" />
              Interview Feedback
            </motion.div>
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {existingComments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Previous Feedback</h4>
                <Badge
                  variant="outline"
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                >
                  {existingComments.length} Comment
                  {existingComments.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {/* DISPLAY EXISTING COMMENTS */}
              <ScrollArea className="h-[240px] pr-4">
                <AnimatePresence>
                  <div className="space-y-4">
                    {existingComments.map((comment, index) => {
                      const interviewer = getInterviewerInfo(
                        users,
                        comment.interviewerId,
                      );
                      return (
                        <motion.div
                          key={index}
                          variants={commentItemVariants as any}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ delay: index * 0.05 }}
                          className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 space-y-3 hover:shadow-md transition-shadow duration-200 bg-white/50 dark:bg-gray-900/50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Avatar className="h-8 w-8 ring-1 ring-blue-200 dark:ring-blue-900">
                                  <AvatarImage src={interviewer.image} />
                                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                    {interviewer.initials}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div>
                                <p className="text-sm font-medium">
                                  {interviewer.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {format(
                                    comment._creationTime,
                                    "MMM d, yyyy • h:mm a",
                                  )}
                                </p>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {renderStars(comment.rating)}
                            </motion.div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {comment.content}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </AnimatePresence>
              </ScrollArea>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* RATING */}
            <div className="space-y-2">
              <Label className="text-blue-700 dark:text-blue-300 font-medium">
                Rating
              </Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      <div className="flex items-center gap-2">
                        {renderStars(value)}
                        <span className="ml-2 text-sm">
                          {value === 1 && "Poor"}
                          {value === 2 && "Fair"}
                          {value === 3 && "Good"}
                          {value === 4 && "Very Good"}
                          {value === 5 && "Excellent"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* COMMENT */}
            <div className="space-y-2">
              <Label className="text-blue-700 dark:text-blue-300 font-medium">
                Your Feedback
              </Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed feedback about the candidate's performance..."
                className="h-32 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* BUTTONS */}
        <DialogFooter>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-300 dark:border-gray-700"
            >
              Cancel
            </Button>
          </motion.div>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
