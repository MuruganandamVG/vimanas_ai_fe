import Dashboard from "./components/Dashboard";
import InterviewRoom from "./components/InterviewRoom";
import Layout from "./components/Layout";
import UploadResume from "./components/UploadResume";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
