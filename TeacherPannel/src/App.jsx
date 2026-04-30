import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./Layout/AdminLayout";
import DashBoard from "./Pages/DashBoard/DashBoard";
import ProFilePicture from "./Pages/ProFilePicture/ProFilePicture";

import ProtectedRoute from "./Auth/ProtectedRoute";
import PermissionRoute from "./Auth/PermissionRoute"; // ✅ NEW
import TeacherLogin from "./Pages/TeacherLogin/TeacherLogin";
import Unauthorized from "./Pages/Unauthorized/Unauthorized"; // ✅ NEW
import StudentAdmsn from "./Pages/StudentAdmsn/StudentAdmsn";
import StudentAdmsnDetails from "./Components/StudentAdmsnDetails/StudentAdmsnDetails";
import FeeCollection from "./Pages/FeeCollection/FeeCollection";
import FeeType from "./Pages/FeeType/FeeType";
import PaymentRecipt from "./Components/PaymentRecipt/PaymentRecipt";
import ClassesAdmin from "./Pages/ClassesAdmin/ClassesAdmin";
import SubjectAdmin from "./Pages/SubjectAdmin/SubjectAdmin";
import ClassWiseSubjectAdmin from "./Pages/ClassWiseSubjectAdmin/ClassWiseSubjectAdmin";
import LeaveSection from "./Pages/LeaveSection/LeaveSection";
import FaqPosting from "./Pages/FaqPosting/FaqPosting";
import EventManagement from "./Pages/EventManagement/EventManagement";
import TestimonialPage from "./Pages/TestimonialPage/TestimonialPage"
import ClsWiseDataManagements from "./Pages/ClsWiseDataManagements/ClsWiseDataManagements";
import LatestNewsAdmin from "./Pages/LatestNewsAdmin/LatestNewsAdmin";
import NotificationPublish from "./Pages/NotificationPublish/NotificationPublish";
import NoticeManagement from "./Pages/NoticeManagement/NoticeManagement";
import FeeManagement from "./Pages/FeeManagement/FeeManagement";
import AwardAdminPage from "./Pages/AwardAdminPage/AwardAdminPage";
import BlogManagerPage from "./Pages/BlogManagerPage/BlogManagerPage";
import BlogView from "./Pages/BlogView/BlogView";
// import TeacherAdminPage from "./Pages/TeacherAdminPage/TeacherAdminPage";

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
            <Route path="/admin/leave" element={<LeaveSection/>}/>
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
            {/* <Route path="/teacher-posting" element={<TeacherAdminPage/>}/> */}
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