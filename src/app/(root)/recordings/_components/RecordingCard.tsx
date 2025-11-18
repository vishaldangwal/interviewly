import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "../../../../components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  CopyIcon,
  PlayIcon,
  VideoIcon,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";

function RecordingCard({ recording }: { recording: CallRecording }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recording.url);
      toast.success("Recording link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown duration";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-black border border-zinc-800 text-white hover:border-blue-500 transition-all duration-300">
        <CardHeader className="p-4 space-y-2">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {formattedStartTime}
          </div>
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            {duration}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <motion.div
            className="aspect-video w-full bg-zinc-900 flex items-center justify-center cursor-pointer relative"
            onClick={() => window.open(recording.url, "_blank")}
            // whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-zinc-800/20 hover:bg-zinc-700/20 transition-colors"></div>
            <div className="relative z-10">
              <PlayIcon className="w-10 h-10 text-blue-500 hover:text-blue-400 transition-colors" />
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="p-4 flex gap-2">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all"
            onClick={() => window.open(recording.url, "_blank")}
          >
            <PlayIcon className="w-4 h-4 mr-2" />
            Play
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopyLink}
            className="border border-blue-600 text-blue-400 hover:text-blue-200 hover:bg-zinc-800"
          >
            <CopyIcon className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default RecordingCard;
