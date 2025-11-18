import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Custom Toast component for saving state - Dark Mode Optimized
const SavingToast = ({ isLoading, success }) => {
  return (
    <div className="flex items-center bg-gray-800 px-4 py-3 rounded shadow-lg border-l-4 border-blue-500 min-w-[250px] text-gray-100">
      <div className="mr-3">
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
        )}
        {!isLoading && success && (
          <svg
            className="h-5 w-5 text-green-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {!isLoading && !success && (
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <div>
        <p className="font-medium">
          {isLoading && "Saving quiz results to database..."}
          {!isLoading && success && "Quiz results saved successfully!"}
          {!isLoading && !success && "Failed to save quiz results."}
        </p>
      </div>
    </div>
  );
};

// Helper function to show the persistent saving toast
export const useSavingToast = () => {
  const [toastId, setToastId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // Show toast when saving starts
  useEffect(() => {
    if (saving && !toastId) {
      const id = toast.custom(
        (t) => <SavingToast isLoading={true} success={false} />,
        { duration: Infinity },
      );
      setToastId(id);
    }
  }, [saving, toastId]);

  // Update toast when saving is complete
  useEffect(() => {
    if (!saving && toastId !== null && saveSuccess !== null) {
      toast.custom(
        (t) => <SavingToast isLoading={false} success={saveSuccess} />,
        { id: toastId, duration: 3000 },
      );

      // Reset state after toast is shown
      setTimeout(() => {
        setToastId(null);
        setSaveSuccess(null);
      }, 3000);
    }
  }, [saving, toastId, saveSuccess]);

  return {
    startSaving: () => {
      setSaving(true);
      setSaveSuccess(null);
    },
    endSaving: (success) => {
      setSaving(false);
      setSaveSuccess(success);
    },
  };
};

// Usage example with dark mode styled button
const SavingToastExample = () => {
  const { startSaving, endSaving } = useSavingToast();

  const saveQuizToDB = async () => {
    try {
      startSaving();

      // Your database saving logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating API call

      // On success
      endSaving(true);
      return true;
    } catch (error) {
      // On error
      console.error("Error saving quiz results:", error);
      endSaving(false);
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-900 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-100">Quiz Results</h3>
      <button
        onClick={saveQuizToDB}
        className="px-4 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
      >
        Save Quiz Results
      </button>
      <p className="text-sm text-gray-400">Click to save your quiz progress</p>
    </div>
  );
};

export default SavingToastExample;
