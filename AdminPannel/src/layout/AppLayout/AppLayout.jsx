import { useState } from "react";
import { Outlet } from "react-router-dom";

import AppHeader from "../AppHeader/AppHeader";
import AppSidebar from "../AppSidebar/AppSidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-100">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <AppSidebar
        sidebarOpen={sidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}
      <div
        className={`
          flex
          h-full
          min-w-0
          flex-1
          flex-col

          transition-[margin-left]
          duration-[400ms]
          ease-[cubic-bezier(0.4,0,0.2,1)]

          ${
            sidebarOpen
              ? "lg:ml-[290px]"
              : "lg:ml-[95px]"
          }
        `}
      >

        {/* =================================================
            HEADER
        ================================================== */}
        <AppHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* =================================================
            MAIN CONTENT
        ================================================== */}
        <main
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            bg-slate-100

            p-3
            sm:p-4
            lg:p-6
          "
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
}