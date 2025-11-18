import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import CustomModal from "./CustomModal";
const ExpandableContent = ({
  content,
  maxLines = 4,
  title = "Content",
}: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate if content should be truncated (similar to flashcard logic)
  const shouldTruncate = content.length > 120; // Show first 120 characters
  const displayContent = shouldTruncate
    ? `${content.substring(0, 120)}...`
    : content;

  return (
    <>
      <div className="relative">
        <p className="text-sm text-blue-200/80 leading-relaxed">
          {displayContent}
        </p>

        {shouldTruncate && (
          <div className="mt-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-blue-600 hover:text-blue-300 flex items-center gap-1 text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              See More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Full Content Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <div className="bg-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-600/20">
          <p className="text-sm text-blue-200/80 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </CustomModal>
    </>
  );
};

export default ExpandableContent;
