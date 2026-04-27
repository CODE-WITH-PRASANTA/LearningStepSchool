import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./Layout/AdminLayout";
import DashBoard from "./Pages/DashBoard/DashBoard";
import ProFilePicture from "./Pages/ProFilePicture/ProFilePicture";

import ProtectedRoute from "./Auth/ProtectedRoute";
import PermissionRoute from "./Auth/PermissionRoute"; // ✅ NEW
import TeacherLogin from "./Pages/TeacherLogin/TeacherLogin";
import Unauthorized from "./Pages/Unauthorized/Unauthorized"; // ✅ NEW

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