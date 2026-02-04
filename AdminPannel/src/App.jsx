import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout/AppLayout";

// Pages (✅ correct paths)

import Dashboard from "./Pages/Dashboard/Dashboard";
import Fees from "./Pages/FeeManagement";
import Notices from "./Pages/NoticeManagement";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";
import AdmissionSurvey from "./Pages/AdmissionSurvey";
import EventManagement from "./Pages/EventManagement";

// Components

import BlogView from "./Pages/BlogView/BlogView";
import BlogManagerPage from "./Pages/BlogManagerPage/BlogManagerPage";
import TestimonialPage from "./Component/Testimonial/TestimonialPage";
import AdmissionSurveyView from "./Component/AdmissionSurveyView/AdmissionSurveyView";

// Auth

import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/AuthContext";
import AwardAdminPage from "./Pages/AwardAdminPage/AwardAdminPage";
import TeacherAdminPage from "./Pages/Adminteachers/TeacherAdminPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ===== PUBLIC ROUTE ===== */}
        <Route path="/login" element={<LoginPage />} />

        {/* ===== PROTECTED APP ===== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >

          {/* Default redirect */}
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Main pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fees" element={<Fees />} />
          <Route path="notices" element={<Notices />} />

          {/* Blogs */}
          <Route path="blogs" element={<BlogManagerPage />} />
          <Route path="blogs/view" element={<BlogView />} />

          {/* Testimonials */}
          <Route path="testimonials" element={<TestimonialPage />} />

          {/* User */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Survey & Events */}
          <Route path="survey" element={<AdmissionSurvey />} />
          <Route path="survey/view" element={<AdmissionSurvey />} />
          <Route path="survey/data" element={<AdmissionSurveyView />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="/awards" element={<AwardAdminPage />} />
          <Route path="/teachers" element={<TeacherAdminPage />} />

        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  );
}
