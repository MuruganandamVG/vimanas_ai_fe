import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useState, useEffect } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import NotFound from "./NotFound";

const serverUrl = "wss://mock-interview-2koatsft.livekit.cloud";

export default function InterviewRoom() {
  // const { room } = useParams();
  const [searchParams] = useSearchParams();
  // hard coding the access token for demonstration purposes
  const AccessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6ImludGVydmlldy1yb29tLTE3NTMwMTU0NTk1NTMifSwiaXNzIjoiQVBJUmpQbnBCbVNqZ3ByIiwiZXhwIjoxNzUzMTAxODYwLCJuYmYiOjAsInN1YiI6Im11cnVnYW4ifQ.KMwhTEF65CfgCz_vgmqVdkcnoXFOsZQ1gQfRNda24j8";
  const candidate_id = searchParams.get("candidate_id");
  const token = searchParams.get("token") || AccessToken;
  console.log(token, "token");
  if (!token) {
    return <NotFound />;
  }
  // If on /create, render as before (no params)

  return <InterviewRoomContent serverUrl={serverUrl} token={token} />;
}

function InterviewRoomContent({
  serverUrl,
  token,
}: {
  serverUrl: string;
  token: string;
}) {
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );

  useEffect(() => {
    let mounted = true;
    const connect = async () => {
      if (mounted) {
        await room.connect(serverUrl, token);
      }
    };
    connect();
    return () => {
      mounted = false;
      room.disconnect();
    };
  }, [room, serverUrl, token]);

  return (
    <RoomContext.Provider value={room}>
      <div data-lk-theme="default" style={{ height: "100vh" }}>
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
