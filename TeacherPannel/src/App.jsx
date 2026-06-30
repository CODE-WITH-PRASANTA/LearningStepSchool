import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./Layout/AdminLayout";
import DashBoard from "./Pages/DashBoard/DashBoard";
import ProFilePicture from "./Pages/ProFilePicture/ProFilePicture";

import ProtectedRoute from "./Auth/ProtectedRoute";
import PermissionRoute from "./Auth/PermissionRoute"; 
import TeacherLogin from "./Pages/TeacherLogin/TeacherLogin";
import Unauthorized from "./Pages/Unauthorized/Unauthorized"; 
import StudentAdmsn from "./Pages/StudentAdmsn/StudentAdmsn";
import StudentAdmsnDetails from "./Components/StudentAdmsnDetails/StudentAdmsnDetails";
import FeeCollection from "./Pages/FeeCollection/FeeCollection";
import FeeType from "./Pages/FeeType/FeeType";
import PaymentRecipt from "./Components/PaymentRecipt/PaymentRecipt";
import ClassesAdmin from "./Pages/ClassesAdmin/ClassesAdmin";
import SubjectAdmin from "./Pages/SubjectAdmin/SubjectAdmin";
import ClassWiseSubjectAdmin from "./Pages/ClassWiseSubjectAdmin/ClassWiseSubjectAdmin";

import FaqPosting from "./Pages/FaqPosting/FaqPosting";
import EventManagement from "./Pages/EventManagement/EventManagement";
import TestimonialPage from "./Pages/TestimonialPage/TestimonialPage"
import ClsWiseDataManagements from "./Pages/ClsWiseDataManagements/ClsWiseDataManagements";
import LatestNewsAdmin from "./Pages/LatestNewsAdmin/LatestNewsAdmin";
import NotificationPublish from "./Pages/NotificationPublish/NotificationPublish";
import NoticeManagement from "./Pages/NoticeManagement/NoticeManagement";
import FeeManagement from "./Pages/FeeManagement/FeeManagement";
import AwardAdminPage from "./Pages/AwardAdminPage/AwardAdminPage"

import BlogManagerPage from "./Pages/BlogManagerPage/BlogManagerPage";
import BlogView from "./Pages/BlogView/BlogView";
import TeacherAdminPage from "./Pages/TeacherAdminPage/TeacherAdminPage";
import Photogallery from "./Pages/Photogallery/Photogallery";
import Videogallery from "./Pages/Videogallery/Videogallery";
import PrePrimery from "./Pages/PrePrimery/PrePrimery";
import Primery from "./Pages/Primery/Primery";
import Secondary from "./Pages/Secondary/Secondary";
import AdmissionSurvey from "./Pages/AdmissionSurvey"
import AdmissionSurveyView from "./Components/AdmissionSurveyView/AdmissionSurveyView";

import TeacherAttenanced from "./Pages/TeacherAttenanced/TeacherAttenanced";
import Attendance from "./Components/Attendance/Attendance";

// 🛠️ FIX 1: Use Leave here or update to LeaveSection depending on your component name
import Leave from "./Components/Leave/Leave";

// 🛠️ FIX 2 & 3: Added missing imports (Adjust these paths if your folder structure is different)
import ShiftSchedule from "./Components/ShiftSchedule/ShiftSchedule"; 
import LeaveBalance from "./Components/LeaveBalance/LeaveBalance"; 
import SalaryDetails from "./Components/SalaryDetails/SalaryDetails";
import CompanyPolicies from "./Components/CompanyPolicies/CompanyPolicies";
import OverTime from "./Components/OverTime/OverTime";
import LeavesRequstes from "./Components/LeavesRequstes/LeavesRequstes";
import MonthlyAttendance from "./Components/MonthlyAttendance/MonthlyAttendance";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 Public */}
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔐 Login Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>

            {/* Dashboard (only login needed) */}
            <Route path="/" element={<DashBoard />} />
            <Route path="/student/admission" element={<StudentAdmsn/>} />
            <Route path="/student/admission/details" element={<StudentAdmsnDetails/>}/>
            <Route path="/fee-collect" element={<FeeCollection/>}/>
            <Route path="/fee-type" element={<FeeType/>}/>
            <Route path="/paymentrecipt" element={<PaymentRecipt/>}/>
            <Route path="/class-post" element={<ClassesAdmin/>}/>
            <Route path="/subject-post" element={<SubjectAdmin/>}/>
            <Route path="/classwise-subject-post" element={<ClassWiseSubjectAdmin/>}/>

            
            {/* 🛠️ FIX 1 applied here (changed LeaveSection to Leave) */}
            <Route path="/apply/leave" element={<Leave/>}/>
            
            <Route path="/faq" element={<FaqPosting/>}/>
            <Route path="/event-management" element={<EventManagement/>}/>
            <Route path="/testimonials" element={<TestimonialPage/>}/>
            <Route path="/class-data" element={<ClsWiseDataManagements/>}/>
            <Route path="/latest-news" element={<LatestNewsAdmin/>}/>
            <Route path="/notification-management" element={<NotificationPublish/>}/>
            <Route path="/notice-management" element={<NoticeManagement/>}/>
            <Route path="/schoolfee-info" element={<FeeManagement/>}/>
            <Route path="/award-management" element={<AwardAdminPage/>}/>
           
            <Route path="/blog-post" element={<BlogManagerPage/>}/>
            <Route path="/blog-view"  element={<BlogView/>}/>
            <Route path="/teacher-posting" element={<TeacherAdminPage/>}/>
            <Route path="/media/photo-gallery" element={<Photogallery/>}/>
            <Route path="/media/video-gallery" element={<Videogallery/>}/>
            <Route path="/learning/pre-primary" element={<PrePrimery/>}/>
            <Route path="/learning/primary" element={<Primery/>}/>
            <Route path="/learning/secondary" element={<Secondary/>}/>
            <Route path="/survey" element={<AdmissionSurvey/>}/>
            <Route path="/survey/data" element={<AdmissionSurveyView/>}/>
            <Route path="/attendance/today" element={<TeacherAttenanced/>}/>
            <Route path="/admin/teacher-attendance" element={<TeacherAttenanced/>}/>

            <Route path="/attendance/overtime" element={<OverTime />} />
            <Route path="/leave/request" element={<LeavesRequstes />} />
            <Route path="/monthly" element={<MonthlyAttendance />}/>
            <Route path="/attendance/monthly" element={<Attendance/>} />
            <Route path="/apply/leave" element={<Leave/>} />
            <Route path="/attendance/history" element={<Attendance/>} />

            
            {/* 🛠️ FIX 2 & 3 applied below */}
            <Route path="/attendance/shift-schedule" element={<ShiftSchedule />}/>
            <Route path="/leave/balance" element={<LeaveBalance />}/>

            <Route path="/salary/details" element={<SalaryDetails />} />
            <Route path="/pay/slips" element={<CompanyPolicies />} />
            
            
            {/* 🔐 Permission Protected */}
            <Route
              path="/admin/profile"
              element={
                <PermissionRoute permission="VIEW_PROFILE">
                  <ProFilePicture />
                </PermissionRoute>
              }
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;