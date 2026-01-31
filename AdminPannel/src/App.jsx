import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout/AppLayout";

import Dashboard from "./Pages/Dashbord";
import Fees from "./Pages/FeeManagement";
import Notices from "./Pages/NoticeManagement";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";

import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/AuthContext";
import AdmissionSurvey from "./Pages/AdmissionSurvey";
import EventManagement from "./Pages/EventManagement";

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<LoginPage />} />

        {/* ================= PROTECTED APP ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fees" element={<Fees />} />
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="survey" element={<AdmissionSurvey />} />
          <Route path="events" element={<EventManagement />} />


        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  );
}
