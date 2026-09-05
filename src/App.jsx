import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentLayout from "./components/StudentLayout";
import StudentProfile from "./pages/StudentProfile";
import StudentJobs from "./pages/StudentJobs";
import StudentApplications from "./pages/StudentApplications";
import StudentRecommendations from "./pages/StudentRecommendations";
import StudentSkillGap from "./pages/StudentSkillGap";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerLayout from "./components/OfficerLayout";
import OfficerStudents from "./pages/OfficerStudents";
import OfficerCompanies from "./pages/OfficerCompanies";
import OfficerJobs from "./pages/OfficerJobs";
import OfficerApplications from "./pages/OfficerApplications";
import OfficerAnalytics from "./pages/OfficerAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="ROLE_STUDENT">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />

          <Route path="profile" element={<StudentProfile />} />

          <Route path="jobs" element={<StudentJobs />} />

          <Route path="applications" element={<StudentApplications />} />

          <Route path="recommendations" element={<StudentRecommendations />} />

          <Route path="skill-gap" element={<StudentSkillGap />} />
        </Route>
        {/* Officer routes */}
        <Route
          path="/officer"
          element={
            <ProtectedRoute role="ROLE_OFFICER">
              <OfficerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OfficerDashboard />} />

          <Route path="students" element={<OfficerStudents />} />

          <Route path="companies" element={<OfficerCompanies />} />

          <Route path="jobs" element={<OfficerJobs />} />

          <Route path="applications" element={<OfficerApplications />} />

          <Route path="analytics" element={<OfficerAnalytics />} />
        </Route>

        {/* Home */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
