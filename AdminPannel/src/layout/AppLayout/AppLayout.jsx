import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";
import AppSidebar from "../AppSidebar/AppSidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-100">
      {/* SIDEBAR */}
      <AppSidebar
        sidebarOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* CONTENT WRAPPER */}
      <div
        className={`flex h-full flex-col transition-all duration-300
        ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}
      >
        {/* HEADER */}
        <AppHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* MAIN CONTENT – ONLY SCROLL AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
