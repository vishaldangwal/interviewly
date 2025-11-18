"use client";

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "../_components/MeetingRoom";
import MeetingSetup from "../_components/MeetingSetup";
import useGetCallById from "../../../../hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

function MeetingPage() {
  const { id } = useParams();
  const { isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(id);
  const codeId = useQuery(api.interviews.getCodesIdByStreamCallId, {
    streamCallId: id as string,
  });
  const questions = useQuery(api.questions.getQuestionsById, {
    ids: codeId,
  });
  useEffect(() => {
    //console.log(codeId);
    //console.log("questions", questions);
  }, [codeId]);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (!isLoaded || isCallLoading) return <LoaderUI />;

  if (!call) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Meeting not found</p>
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
        ) : (
          //   <div>Hel</div>
          <MeetingRoom questions={questions} />
        )}
      </StreamTheme>
    </StreamCall>
  );
}
export default MeetingPage;
