import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader/AppHeader";
import AppSidebar from "../AppSidebar/AppSidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
<div className="bg-slate-100 flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar
        sidebarOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* RIGHT CONTENT */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
        ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}
      >
        {/* HEADER */}
        <AppHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* MAIN CONTENT */}
<main className="flex-1 overflow-y-auto overflow-x-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
