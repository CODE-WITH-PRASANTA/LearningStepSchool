import React, { useState } from "react";
import AppHeader from "../AppHeader/AppHeader";
import AppSidebar from "../AppSidebar/AppSidebar";
import "./AppLayout.css";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Header */}
      <AppHeader onMenuClick={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />

      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
