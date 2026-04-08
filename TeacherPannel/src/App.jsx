import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout"; // ✅ FIXED
import DashBoard from "./Pages/DashBoard/DashBoard";
import ProFilePicture from "./Pages/ProFilePicture/ProFilePicture";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashBoard/>}/>
          <Route path="/admin/profile" element={<ProFilePicture/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;