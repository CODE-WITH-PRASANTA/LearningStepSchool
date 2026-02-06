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
import TestimonialPage from "./Pages/TestimonialPage/TestimonialPage";
import AdmissionSurveyView from "./Component/AdmissionSurveyView/AdmissionSurveyView";

// Auth

import ProtectedRoute from "./Auth/ProtectedRoute";
import { AuthProvider } from "./Auth/AuthContext";
import ClsWiseDataManagements from "./Pages/ClsWiseDataManagements/ClsWiseDataManagements";
import AwardAdminPage from "./Pages/AwardAdminPage/AwardAdminPage";
import TeacherAdminPage from "./Pages/TeacherAdminPage/TeacherAdminPage";
import PrePrimery from "./Pages/PrePrimery/PrePrimery";
import Primery from "./Pages/Primery/Primery";
import Secondary from "./Pages/Secondary/Secondary";
import FaqPosting from "./Pages/FaqPosting/FaqPosting";
import VisitorBook from "./Pages/VisitorBook/VisitorBook";
import PostalDispatch from "./Pages/PostalDispatch/PostalDispatch";
import PostalReceive from "./Pages/PostalReceive/PostalReceive";
import AddIncome from "./Pages/AddIncome/AddIncome";
import SearchIncome from "./Pages/SearchIncome/SearchIncome";
import IncomeHead from "./Pages/IncomeHead/IncomeHead";



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

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/class-data" element={<ClsWiseDataManagements />} />

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
          <Route path="/learning/pre" element={<PrePrimery />} />   
          <Route path="/learning/primary" element={<Primery />} />   
          <Route path="/learning/secondary" element={<Secondary />} />   
          <Route path="/front-office/visitors" element={<VisitorBook />} />   
          <Route path="/front-office/postal-dispatch" element={<PostalDispatch />} />   
          <Route path="/front-office/postal-receive" element={<PostalReceive />} />   
          <Route path="/faq" element={<FaqPosting />} />   
          <Route path="/teachers" element={<TeacherAdminPage />} />
          <Route path="/income/add" element={<AddIncome />} />
          <Route path="/income/search" element={<SearchIncome />} />
          <Route path="/income/head" element={<IncomeHead />} />



          

          <Route
            path="/front-office/postal-dispatch"
            element={<PostalDispatch />}
          />
          <Route
            path="/front-office/postal-receive"
            element={<PostalReceive />}
          />
          <Route
            path="/front-office/postal-receive"
            element={<PostalReceive />}
          />

          <Route path="/faq" element={<FaqPosting />} />
        </Route>

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
