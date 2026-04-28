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