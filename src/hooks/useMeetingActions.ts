import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";

const useMeetingActions = () => {
  const router = useRouter();
  const client = useStreamVideoClient();

  // Base toast options with blue accent elements
  const baseToastOptions = {
    duration: 800,
    style: {
      borderRadius: "8px",
      padding: "8px",
      boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)", // blue shadow
      borderLeft: "4px solid #7c3aed", // blue accent border
    },
  };

  // Success toast options (green background)
  const successToastOptions = {
    ...baseToastOptions,
    style: {
      ...baseToastOptions.style,
      background: "#000000", // Green background
      color: "#fff", // White text
    },
    iconTheme: {
      primary: "#7c3aed", // blue icon
      secondary: "#fff",
    },
  };

  // Error toast options (red background)
  const errorToastOptions = {
    ...baseToastOptions,
    style: {
      ...baseToastOptions.style,
      background: "#000000", // Red background
      color: "#fff", // White text
    },
    iconTheme: {
      primary: "#7c3aed", // blue icon
      secondary: "#fff",
    },
  };

  const createInstantMeeting = async () => {
    if (!client) return;

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Meeting",
          },
        },
      });

      router.push(`/meeting/${call.id}`);
      toast.success("Meeting Created", successToastOptions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create meeting", errorToastOptions);
    }
  };

  const joinMeeting = (callId: string) => {
    if (!client) {
      return toast.error(
        "Failed to join meeting. Please try again.",
        errorToastOptions,
      );
    }
    router.push(`/meeting/${callId}`);
    toast.success("Joining meeting...", successToastOptions);
  };

  return { createInstantMeeting, joinMeeting };
};

export default useMeetingActions;
