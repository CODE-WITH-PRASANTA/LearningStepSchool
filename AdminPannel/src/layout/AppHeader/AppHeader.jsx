
import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import API, { IMAGE_URL } from "../../api/axios";

import Swal from "sweetalert2";

import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiShield,
} from "react-icons/fi";

import "./AppHeader.css";

export default function AppHeader({
  sidebarOpen,
  setSidebarOpen,
  setMobileOpen,
}) {
  const [open, setOpen] = useState(false);

  const [admin, setAdmin] = useState({
    name: "Admin",
    email: "",
    role: "Administrator",
    avatar: "",
  });

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();

  /* =====================================================
     LOAD LOGGED-IN ADMIN
  ===================================================== */

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        // First use localStorage for instant display
        const storedAdmin =
          localStorage.getItem("admin");

        if (storedAdmin) {
          const parsedAdmin =
            JSON.parse(storedAdmin);

          setAdmin({
            name:
              parsedAdmin?.name || "Admin",
            email:
              parsedAdmin?.email || "",
            role:
              parsedAdmin?.role ||
              "Administrator",
            avatar:
              parsedAdmin?.avatar || "",
          });
        }

        // Then get latest data from backend
        const res = await API.get(
          "/auth/profile"
        );

        const user = res.data.user;

        if (user) {
          const updatedAdmin = {
            id: user._id || user.id,
            name:
              user.name || "Admin",
            email:
              user.email || "",
            role:
              user.role ||
              "Administrator",
            avatar:
              user.avatar || "",
            phone:
              user.phone || "",
            bio:
              user.bio || "",
            notifications:
              user.notifications ?? true,
            theme:
              user.theme || "light",
          };

          setAdmin(updatedAdmin);

          localStorage.setItem(
            "admin",
            JSON.stringify(updatedAdmin)
          );
        }
      } catch (error) {
        console.log(
          "Unable to refresh admin profile:",
          error
        );

        // Keep localStorage data if API fails
      }
    };

    loadAdmin();
  }, []);

  /* =====================================================
     CLOSE DROPDOWNS ON OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handler = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          e.target
        )
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, []);

  /* =====================================================
     AVATAR URL
  ===================================================== */

  const getAvatarUrl = () => {
    if (!admin.avatar) {
      return "";
    }

    if (admin.avatar.startsWith("http")) {
      return admin.avatar;
    }

    if (admin.avatar.startsWith("blob:")) {
      return admin.avatar;
    }

    return `${IMAGE_URL}${admin.avatar}`;
  };

  /* =====================================================
     ADMIN INITIAL
  ===================================================== */

  const adminInitial =
    admin.name
      ?.charAt(0)
      ?.toUpperCase() || "A";

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      background: "#081B45",
      color: "#ffffff",
    });

    if (!result.isConfirmed) return;

    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(
        "Logout API error:",
        error
      );
    }

    /* ---------- CLEAR STORAGE ---------- */

    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin");

    setOpen(false);

    /* ---------- SUCCESS ---------- */

    await Swal.fire({
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

  /* =====================================================
     SIDEBAR TOGGLE
  ===================================================== */

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <header className="app-header">

      {/* =================================================
          LEFT
      ================================================= */}

      <div className="header-left">

        {/* MENU */}

        <button
          onClick={handleMenuClick}
          className="header-icon-bubble menu-button"
          aria-label="Toggle Navigation Sidebar"
        >
          <FiMenu />
        </button>

        {/* BRAND */}

        <div className="header-brand">

          <div className="brand-logo">
            LS
          </div>

          <div className="brand-content">
            <span className="system-title">
              LearningStep
            </span>

            <span className="system-subtitle">
              School ERP
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="header-search-wrap">

        <FiSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search menu, students, fees..."
          className="search-input"
        />

        <span className="search-shortcut">
          Ctrl K
        </span>
      </div>

      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="header-right">

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <div
          className="notification-wrapper"
          ref={notificationRef}
        >
          <button
            className="header-icon-bubble notification-button"
            aria-label="Notifications"
            onClick={() =>
              setNotificationOpen(
                !notificationOpen
              )
            }
          >
            <FiBell />

            <span className="notification-badge">
              3
            </span>
          </button>

          {notificationOpen && (
            <div className="notification-dropdown">

              <div className="notification-header">
                <div>
                  <h3>
                    Notifications
                  </h3>

                  <p>
                    You have 3 new alerts
                  </p>
                </div>

                <span className="notification-count">
                  3
                </span>
              </div>

              <div className="notification-list">

                <div className="notification-item">
                  <div className="notification-dot purple" />

                  <div>
                    <strong>
                      New admission
                    </strong>

                    <p>
                      A new student has been
                      registered.
                    </p>

                    <span>
                      Just now
                    </span>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-dot blue" />

                  <div>
                    <strong>
                      Fee payment received
                    </strong>

                    <p>
                      A fee payment was
                      successfully received.
                    </p>

                    <span>
                      15 min ago
                    </span>
                  </div>
                </div>

                <div className="notification-item">
                  <div className="notification-dot green" />

                  <div>
                    <strong>
                      System updated
                    </strong>

                    <p>
                      School ERP system is
                      running normally.
                    </p>

                    <span>
                      1 hour ago
                    </span>
                  </div>
                </div>

              </div>

              <button
                className="view-all-notifications"
                onClick={() => {
                  setNotificationOpen(false);
                }}
              >
                View all notifications
              </button>

            </div>
          )}
        </div>

        {/* =================================================
            PROFILE
        ================================================= */}

        <div
          className="profile-dropdown-wrapper"
          ref={profileRef}
        >

          <button
            onClick={() =>
              setOpen(!open)
            }
            className={`profile-trigger-btn ${
              open
                ? "profile-trigger-active"
                : ""
            }`}
          >

            {/* AVATAR */}

            <div className="header-avatar-wrap">

              {getAvatarUrl() ? (
                <img
                  src={getAvatarUrl()}
                  className="header-avatar"
                  alt="Admin Profile"
                />
              ) : (
                <div className="header-avatar header-avatar-placeholder">
                  {adminInitial}
                </div>
              )}

              <span className="online-status" />
            </div>

            {/* ADMIN DETAILS */}

            <div className="admin-header-details">

              <span className="admin-name-text">
                {admin.name}
              </span>

              <span className="admin-role-text">
                {admin.role}
              </span>

            </div>

            <FiChevronDown
              className={`profile-chevron ${
                open
                  ? "profile-chevron-open"
                  : ""
              }`}
            />

          </button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {open && (
            <div className="header-dropdown-card">

              {/* USER HEADER */}

              <div className="dropdown-user-header">

                <div className="dropdown-avatar-wrap">

                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()}
                      alt="Admin"
                      className="dropdown-avatar"
                    />
                  ) : (
                    <div className="dropdown-avatar dropdown-avatar-placeholder">
                      {adminInitial}
                    </div>
                  )}

                  <span className="dropdown-online" />
                </div>

                <div className="dropdown-user-info">

                  <p className="user-title">
                    {admin.name}
                  </p>

                  <p className="user-email">
                    {admin.email ||
                      "Admin account"}
                  </p>

                  <span className="user-role">
                    <FiShield />
                    {admin.role}
                  </span>

                </div>

              </div>

              {/* MENU */}

              <div className="dropdown-menu-list">

                {/* PROFILE */}

                <button
                  className="header-dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                >
                  <span className="dropdown-item-icon">
                    <FiUser />
                  </span>

                  <span className="dropdown-item-content">
                    <strong>
                      My Profile
                    </strong>

                    <small>
                      View and edit profile
                    </small>
                  </span>
                </button>

                {/* SETTINGS */}

                <button
                  className="header-dropdown-item"
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                >
                  <span className="dropdown-item-icon">
                    <FiSettings />
                  </span>

                  <span className="dropdown-item-content">
                    <strong>
                      Settings
                    </strong>

                    <small>
                      Account preferences
                    </small>
                  </span>
                </button>

              </div>

              {/* LOGOUT */}

              <div className="dropdown-logout-section">

                <button
                  className="header-dropdown-item logout-danger"
                  onClick={handleLogout}
                >
                  <span className="dropdown-item-icon logout-icon">
                    <FiLogOut />
                  </span>

                  <span className="dropdown-item-content">
                    <strong>
                      Logout
                    </strong>

                    <small>
                      Sign out of your account
                    </small>
                  </span>
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}

