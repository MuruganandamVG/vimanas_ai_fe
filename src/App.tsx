import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import UploadResume from "./components/UploadResume";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InterviewRoom from "./components/interview";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<UploadResume />} />
            <Route path="create" element={<InterviewRoom />} />
            {/* <Route path="create" element={<InterviewRoom />} /> */}
            {/* <Route path="interview/:room_name" element={<InterviewRoom />} /> */}
          </Route>
          <Route path="interview" element={<InterviewRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
