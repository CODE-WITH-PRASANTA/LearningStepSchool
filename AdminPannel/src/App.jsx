import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout/AppLayout";

// Pages
import Dashboard from "./Pages/Dashbord";
import Fees from "./Pages/FeeManagement";
import Notices from "./Pages/NoticeManagement";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";
import AdmissionSurvey from "./Pages/AdmissionSurvey";
import EventManagement from "./Pages/EventManagement";

// Components
import BlogView from "./Component/BlogView/BlogView";
import BlogManagerPage from "./Component/BlogManager/BlogManagerPage";
import TestimonialPage from "./Component/Testimonial/TestimonialPage";

// Auth
import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/AuthContext";
import AdmissionSurveyView from "./Component/AdmissionSurveyView/AdmissionSurveyView";

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

          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/notices" element={<Notices />} />

          <Route path="/blogs" element={<BlogManagerPage />} />
          <Route path="/blogs/view" element={<BlogView />} />

          <Route path="/testimonials" element={<TestimonialPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/survey" element={<AdmissionSurvey />} />
          <Route path="/events" element={<EventManagement />} />
          <Route path="/survey/view" element={<AdmissionSurvey />} />
          <Route path="/survey/data" element={<AdmissionSurveyView />} />

        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  );
}