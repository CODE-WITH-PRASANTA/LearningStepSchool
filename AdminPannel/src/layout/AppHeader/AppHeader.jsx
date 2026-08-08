import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Swal from "sweetalert2";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import "./AppHeader.css";

export default function AppHeader({
  sidebarOpen,
  setSidebarOpen,
  setMobileOpen,
}) {
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  /* CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, logout",
      background: "#081B45",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    }

    // CLEAR LOCAL STORAGE
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin");

    setOpen(false);

    // SUCCESS ALERT
    Swal.fire({
      title: "Logged out 👋",
      text: "You have been logged out successfully",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#081B45",
      color: "#ffffff",
    });

    navigate("/login");
  };

  return (
    <header className="app-header">
      {/* LEFT SECTION */}
      <div className="header-left">
        <button
          onClick={() =>
            window.innerWidth >= 1024
              ? setSidebarOpen(!sidebarOpen)
              : setMobileOpen(true)
          }
          className="header-icon-bubble"
          aria-label="Toggle Navigation Sidebar"
        >
          <FiMenu />
        </button>

        <span className="system-title">
          Bright Future School ERP
        </span>
      </div>

      {/* CENTER SEARCH BAR */}
      <div className="header-search-wrap">
        <FiSearch className="search-icon" />
        <input
          placeholder="Search menu, students, fees..."
          className="search-input"
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="header-right">
        {/* NOTIFICATION BUTTON */}
        <button className="header-icon-bubble" aria-label="Notifications">
          <FiBell />
          <span className="notification-badge" />
        </button>

        {/* ADMIN PROFILE */}
        <div className="profile-dropdown-wrapper" ref={profileRef}>
          <button
            onClick={() => setOpen(!open)}
            className="profile-trigger-btn"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              className="header-avatar"
              alt="Admin Profile"
            />
            <span className="admin-name-text">
              Admin
            </span>
          </button>

          {/* DROPDOWN CARD */}
          {open && (
            <div className="header-dropdown-card">
              <div className="dropdown-user-header">
                <p className="user-title">
                  Admin User
                </p>
                <p className="user-email">admin@brightfuture.com</p>
              </div>

              <div className="dropdown-menu-list">
                <button
                  className="header-dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                >
                  <FiUser /> Profile
                </button>

                <button
                  className="header-dropdown-item"
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                >
                  <FiSettings /> Settings
                </button>

                <button
                  className="header-dropdown-item logout-danger"
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}