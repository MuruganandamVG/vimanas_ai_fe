import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { PiPhoneSlashBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import VoiceOver from "./voice";

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
  const [candidateAnswer, setCandidateAnswer] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obtain user audio & video stream
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

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Send the transcript (i.e. candidate answer) to the AI and play its audio response
  const sendAnswerToAI = async (answer: string) => {
    setIsLoading(true);
    setSpeaking("Candidate");
    setAiTranscript((prev) => [...prev, `You: ${answer}`]);
    try {
      const res = await fetch(
        `${API_BASE}/answer?answer=${answer}&candidate_id=${
          candidateId || defaultCandidateId
        }`
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

  // Toggle microphone enabled/disabled on local stream
  const handleMicToggle = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !micOn;
      });
      setMicOn(!micOn);
    }
  };

  // Toggle camera enabled/disabled on local stream
  const handleVideoToggle = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoOn;
      });
      // Force video element refresh if turning video back on
      if (!videoOn && localVideoRef.current) {
        localVideoRef.current.srcObject = null;
        localVideoRef.current.srcObject = localStream;
      }
      setVideoOn(!videoOn);
    }
  };

  // Start the interview by fetching the first AI question (audio)
  const startInterview = async () => {
    setIsLoading(true);
    try {
      const context =
        "experience 4 years on react, nodejs, javascript, typescript";
      const res = await fetch(
        `${API_BASE}/question?context=${context}&candidate_id=${
          candidateId || defaultCandidateId
        }`
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

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI Interview Room</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          onClick={() => navigate("/editor")}
        >
          Open Editor
        </button>
      </div>

      {/* Video Tiles */}
      <div className="flex gap-8 mb-6 justify-center">
        {/* Candidate Tile */}
        <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl border-4 border-blue-300 shadow-lg w-[500px] h-[400px]">
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
          {speaking === "Candidate" && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-base font-semibold">
              🗣️ Speaking
            </div>
          )}
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
        <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl border-4 border-cyan-300 shadow-lg w-[500px] h-[400px]">
          <div className="flex flex-col items-center justify-center w-full h-full rounded-2xl bg-gray-900 text-white text-5xl font-bold">
            <span className="text-6xl">🤖</span>
            <span className="text-lg font-semibold mt-4">AI Interviewer</span>
          </div>
          {speaking === "Agent" && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-base font-semibold">
              🗣️ Speaking
            </div>
          )}
        </div>
      </div>

      {/* Live Transcript */}

      {/* Controls: Mic/Video Buttons */}
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
          {micOn ? <PiPhoneSlashBold /> : <PiPhoneSlashBold />}
        </button>
      </div>

      {/* Start Interview & Answer Button */}
      <div className="mb-4">
        {!isInterviewStarted ? (
          <button
            onClick={startInterview}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Start Interview"}
          </button>
        ) : null}

        {/* The VoiceOver component handles capturing candidate answer */}
        {
          <VoiceOver
            onTranscriptFinal={(text: string) => {
              setCandidateAnswer(text);
              sendAnswerToAI(text);
            }}
            isDisabled={isLoading}
            speaking={speaking}
            setSpeaking={setSpeaking}
          />
        }
      </div>

      {/* Optional: Display candidate answer */}
      {candidateAnswer && (
        <div className="mt-4">
          <p className="text-gray-700 text-base">
            Your answer: <strong>{candidateAnswer}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewRoom;
