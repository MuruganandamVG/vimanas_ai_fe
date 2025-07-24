import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { PiPhoneSlashBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api/v1";

const defaultCandidateId = "aee6527e-7d5a-4b16-a736-ed7ec7c9a280";

const InterviewRoom = () => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [aiTranscript, setAiTranscript] = useState<string[]>([]);
  const [speaking, setSpeaking] = useState<"Candidate" | "Agent" | null>(null);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const aiVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [candidateAnswer, setCandidateAnswer] = useState<string>("");
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get user media (audio + video)
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Could not access camera/microphone");
      }
    })();
  }, []);

  // Speech-to-text (Web Speech API)
  const startSpeechRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    setRecognitionActive(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCandidateAnswer(transcript);
      setRecognitionActive(false);
      sendAnswerToAI(transcript);
    };
    recognition.onerror = (event: any) => {
      setRecognitionActive(false);
      alert("Speech recognition error: " + event.error);
    };
    recognition.onend = () => {
      setRecognitionActive(false);
    };
    recognition.start();
  };

  // Send transcribed answer to AI and play response
  const sendAnswerToAI = async (answer: string) => {
    setIsLoading(true);
    setSpeaking("Candidate");
    setAiTranscript((prev) => [...prev, `You: ${answer}`]);
    try {
      const res = await fetch(
        `${API_BASE}/next_question?answer=${encodeURIComponent(
          answer
        )}&session_id=${candidateId || defaultCandidateId}`
      );
      if (res.ok) {
        const aiAudioBlob = await res.blob();
        const aiAudioUrl = URL.createObjectURL(aiAudioBlob);
        const audio = new Audio(aiAudioUrl);
        audio.play();
        setAiTranscript((prev) => [...prev, "AI: (audio played)"]);
        setSpeaking("Agent");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
      setMicOn(!micOn);
    }
  };
  const handleVideoToggle = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoOn;
      });
      if (!videoOn && localVideoRef.current) {
        localVideoRef.current.srcObject = null; // Force reset first
        localVideoRef.current.srcObject = localStream;
      }
      setVideoOn(!videoOn);
    }
  };

  // Recording is now handled by speech-to-text

  // Start interview: get first AI question (audio)
  const startInterview = async () => {
    setIsLoading(true);
    try {
      const context = "experience 11 and skills are java spring and hibernate";
      const res = await fetch(
        `${API_BASE}/start_interview?context=${encodeURIComponent(context)}`
      );
      if (res.ok) {
        setCandidateId(res.headers.get("Candidate-Id"));
        const aiAudioBlob = await res.blob();
        const aiAudioUrl = URL.createObjectURL(aiAudioBlob);
        const audio = new Audio(aiAudioUrl);
        audio.play();
        setAiTranscript((prev) => [...prev, "AI: (audio played)"]);
        setIsInterviewStarted(true);
        setSpeaking("Agent");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Remove text answer, use audio recording

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI Interview Room</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          onClick={() => {
            // TODO: add editor modal or redirect
            navigate("/editor");
          }}
        >
          Open Editor
        </button>
      </div>

      <div className="flex gap-8 mb-6 justify-center">
        {/* Candidate Tile */}
        <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl border-4 border-blue-300 shadow-lg w-[600px] h-[540px]">
          {videoOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted={!micOn}
              className="w-full h-full object-cover rounded-2xl bg-black"
              style={{ background: "#222" }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full rounded-2xl bg-blue-900 text-white text-5xl font-bold">
              <span className="text-6xl">M</span>
              <span className="text-lg font-semibold mt-4">Muruganandam</span>
            </div>
          )}
          {/* Speaking indicator overlay */}
          {speaking === "Candidate" && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-base font-semibold">
              🗣️ Speaking
            </div>
          )}
          {/* Muted indicator */}
          {!micOn && (
            <div className="absolute top-4 right-4 z-20 bg-gray-800 text-white rounded-full px-2 py-1 text-xs flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 48 48"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 19L5 5m7 7v6m0-6V7a3 3 0 00-6 0v6m6 0a3 3 0 006 0v-6a3 3 0 00-6 0v6z"
                />
              </svg>
              Muted
            </div>
          )}
        </div>
        {/* AI Agent Tile */}
        <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl border-4 border-cyan-300 shadow-lg w-[600px] h-[540px]">
          <div className="flex flex-col items-center justify-center w-full h-full rounded-2xl bg-gray-900 text-white text-5xl font-bold">
            <span className="text-6xl">🤖</span>
            <span className="text-lg font-semibold mt-4">AI Interviewer</span>
          </div>
          {/* Speaking indicator overlay for AI */}
          {speaking === "Agent" && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-base font-semibold">
              🗣️ Speaking
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white rounded shadow p-4 mb-4">
        <h2 className="font-bold mb-2">Live Transcript</h2>
        <div className="h-40 overflow-y-auto text-gray-200 text-sm whitespace-pre-line">
          {aiTranscript.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      </div>
      
      {/* Mic/Video icon buttons below tiles */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleMicToggle}
          className={`flex items-center justify-center w-12 h-12 rounded-full text-xl shadow ${
            micOn ? "bg-gray-800 text-white" : "bg-red-600 text-white"
          }`}
          title={micOn ? "Turn off mic" : "Turn on mic"}
        >
          {micOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
        </button>
        <button
          onClick={handleVideoToggle}
          className={`flex items-center justify-center w-12 h-12 rounded-full text-xl shadow ${
            videoOn ? "bg-gray-800 text-white" : "bg-red-600 text-white"
          }`}
          title={videoOn ? "Turn off video" : "Turn on video"}
        >
          {videoOn ? <FaVideo /> : <FaVideoSlash />}
        </button>
        <button
          onClick={handleMicToggle}
          className={`flex items-center justify-center w-12 h-12 rounded-full text-xl shadow ${
            micOn ? "bg-gray-800 text-white" : "bg-red-600 text-white"
          }`}
          title={micOn ? "Turn off mic" : "Turn on mic"}
        >
          {videoOn ? <PiPhoneSlashBold /> : <PiPhoneSlashBold />}
        </button>
      </div>
      <div className="mb-4">
        {!isInterviewStarted && (
          <button
            onClick={startInterview}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Interview"}
          </button>
        )}
        {isInterviewStarted && (
          <div className="flex gap-4 mt-2">
            <button
              onClick={startSpeechRecognition}
              className={`px-4 py-2 rounded text-white ${
                recognitionActive
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isLoading || recognitionActive}
            >
              {recognitionActive ? "Listening..." : "Answer (Speak)"}
            </button>
            {candidateAnswer && (
              <span className="text-gray-700 text-base">
                Your answer: {candidateAnswer}
              </span>
            )}
          </div>
        )}
      </div>
  {/* No text answer UI, only audio recording for answer */}
  </div>    
  );
  
};

export default InterviewRoom;
