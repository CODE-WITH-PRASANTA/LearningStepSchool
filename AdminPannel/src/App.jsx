import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout/AppLayout";

/* ===================== PAGES ===================== */

// Dashboard & Core
import Dashboard from "./Pages/Dashboard/Dashboard";
import Fees from "./Pages/FeeManagement";
import Notices from "./Pages/NoticeManagement";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import LoginPage from "./Pages/LoginPage";
import AdmissionSurvey from "./Pages/AdmissionSurvey";
import EventManagement from "./Pages/EventManagement";

// Blog & CMS
import BlogView from "./Pages/BlogView/BlogView";
import BlogManagerPage from "./Pages/BlogManagerPage/BlogManagerPage";
import TestimonialPage from "./Pages/TestimonialPage/TestimonialPage";
import AdmissionSurveyView from "./Component/AdmissionSurveyView/AdmissionSurveyView";

// Auth
import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/AuthContext";

// School / Admin
import ClsWiseDataManagements from "./Pages/ClsWiseDataManagements/ClsWiseDataManagements";
import AwardAdminPage from "./Pages/AwardAdminPage/AwardAdminPage";

// Learning
import PrePrimery from "./Pages/PrePrimery/PrePrimery";
import Primery from "./Pages/Primery/Primery";
import Secondary from "./Pages/Secondary/Secondary";

// Front Office
import VisitorBook from "./Pages/VisitorBook/VisitorBook";
import Visitorsbooksedit from "./Pages/Visitorsbooksedit/Visitorsbooksedit";
import PostalDispatch from "./Pages/PostalDispatch/PostalDispatch";
import PostalReceive from "./Pages/PostalReceive/PostalReceive";

// Attendance
import StudentAttendance from "./Pages/Studentattendance/Studentattendance";
import Studentleave from "./Pages/Studentleave/Studentleave";
import AttendanceReport from "./Pages/AttendanceReport/AttendanceReport";

// Other
import FaqPosting from "./Pages/FaqPosting/FaqPosting";
import Editleave from "./Pages/Editleave/Editleave";

/* ===================== APP ===================== */

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ===== PUBLIC ===== */}
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

          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Finance */}
          <Route path="fees" element={<Fees />} />

          {/* Notices */}
          <Route path="notices" element={<Notices />} />

          {/* Class Data */}
          <Route path="class-data" element={<ClsWiseDataManagements />} />

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

          {/* Awards */}
          <Route path="awards" element={<AwardAdminPage />} />

          {/* Learning */}
          <Route path="learning/pre" element={<PrePrimery />} />
          <Route path="learning/primary" element={<Primery />} />
          <Route path="learning/secondary" element={<Secondary />} />

          {/* Front Office */}
          <Route path="front-office/visitors" element={<VisitorBook />} />
          <Route
            path="front-office/visitors/edit"
            element={<Visitorsbooksedit />}
          />
          <Route
            path="front-office/postal-dispatch"
            element={<PostalDispatch />}
          />
          <Route
            path="front-office/postal-receive"
            element={<PostalReceive />}
          />

          {/* Attendance */}
          <Route
            path="attendance/student-attendance"
            element={<StudentAttendance />}
          />
          <Route
            path="attendance/student-leave"
            element={<Studentleave />}
          />
          <Route
            path="attendance/student-leave/add"
            element={<Editleave />}
          />
          <Route
            path="attendance/attendance-report"
            element={<AttendanceReport />}
          />

          {/* FAQ */}
          <Route path="faq" element={<FaqPosting />} />

        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </AuthProvider>
  );
}
