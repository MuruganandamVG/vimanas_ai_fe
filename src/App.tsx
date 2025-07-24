import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import UploadResume from "./components/UploadResume";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InterviewRoom from "./components/interview";
import CreateInterview from "./components/CreateInterview";
import ScheduledInterviews from "./components/ScheduledInterviews";
import InterviewHistory from "./components/InterviewHistory";
import FullPageEditorWrapper from "./components/Editor";
import VideoInterview from "./components/ui/videoConfrence";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<UploadResume />} />
            <Route path="create" element={<CreateInterview />} />
            <Route path="scheduled" element={<ScheduledInterviews />} />
            <Route path="history" element={<InterviewHistory />} />
            <Route path="videoconference" element={<VideoInterview/>}/>
            {/* <Route path="create" element={<InterviewRoom />} /> */}
            {/* <Route path="interview/:room_name" element={<InterviewRoom />} /> */}
          </Route>
          <Route path="interview" element={<InterviewRoom />} />
          <Route path="editor" element={<FullPageEditorWrapper />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
