import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout/AppLayout";

import Dashboard from "./Pages/Dashbord";
// import BlogPosts from "./pages/BlogPosts";
// import BlogView from "./pages/BlogView";
// import Teachers from "./pages/Teachers";
// import Awards from "./pages/Awards";
import Fees from "./Pages/FeeManagement";
import Notices from "./Pages/NoticeManagement";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import EventManagement from "./Pages/EventManagement";
// import Testimonials from "./pages/Testimonials";
// import Admissions from "./pages/Admissions";
// import Events from "./pages/Events";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/blogs" element={<div />} /> */}
        {/* <Route path="/blogs/view" element={<BlogView />} /> */}
        {/* <Route path="/teachers" element={<Teachers />} /> */}
        {/* <Route path="/awards" element={<Awards />} /> */}
        <Route path="/fees" element={<Fees />} />
        <Route path="/notices" element={<Notices />} />
        {/* <Route path="/testimonials" element={<Testimonials />} /> */}
        {/* <Route path="/admissions" element={<Admissions />} /> */}
        {/* <Route path="/events" element={<Events />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/events" element={<EventManagement/>} />
      </Route>
    </Routes>
  );
}
