import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

interface VoiceOverProps {
  onTranscriptFinal: (text: string) => void;
  isDisabled?: boolean;
  speaking: "Candidate" | "Agent" | null;
  setSpeaking: React.Dispatch<
    React.SetStateAction<"Candidate" | "Agent" | null>
  >;
}

const VoiceOver: React.FC<VoiceOverProps> = ({
  onTranscriptFinal,
  isDisabled,
  speaking,
  setSpeaking,
}) => {
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscripts, setFinalTranscripts] = useState<string[]>([]); // ✅ array of final transcripts

  const accumulatedTranscriptRef = useRef<string[]>([]); // also stored in ref for consistency

  useEffect(() => {
    if (finalTranscript) {
      // ✅ push finalTranscript into array
      accumulatedTranscriptRef.current.push(finalTranscript);
      setFinalTranscripts([...accumulatedTranscriptRef.current]); // trigger re-render
      resetTranscript();
    }
  }, [finalTranscript, resetTranscript]);

  const handleStart = () => {
    if (!browserSupportsSpeechRecognition) return;

    resetTranscript();
    accumulatedTranscriptRef.current = [];
    setFinalTranscripts([]);
    setSpeaking("Candidate");
    setIsRecording(true);

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setSpeaking(null);
    setIsRecording(false);

    const combined = accumulatedTranscriptRef.current.join(" ").trim();
    onTranscriptFinal(combined);
    resetTranscript();
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser doesn't support speech recognition.</p>;
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        disabled={isDisabled}
        onClick={isRecording ? handleStop : handleStart}
        className={`px-4 py-2 rounded text-white transition-all ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isRecording ? "🛑 Stop & Submit" : "🎙️ Start Speaking"}
      </button>

      <p className="mt-2 text-sm text-gray-700">
        Live Transcript: {interimTranscript}
      </p>

      {finalTranscripts.length > 0 && (
        <div className="mt-2 w-full max-w-md text-xs text-green-700 text-left">
          <p className="font-semibold">Final Segments:</p>
          <ul className="list-disc list-inside">
            {finalTranscripts.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoiceOver;
