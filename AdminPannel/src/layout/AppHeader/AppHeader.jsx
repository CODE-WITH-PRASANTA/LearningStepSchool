import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

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

  return (
    <header
      className="h-16 flex items-center justify-between px-6
      bg-gradient-to-r from-indigo-50 via-white to-violet-50
      border-b border-indigo-100"
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={() =>
            window.innerWidth >= 1024
              ? setSidebarOpen(!sidebarOpen)
              : setMobileOpen(true)
          }
          className="icon-bubble bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
        >
          <FiMenu />
        </button>

        <span className="hidden sm:block text-sm font-medium text-indigo-700">
          School Management System
        </span>
      </div>

      {/* SEARCH */}
      <div
        className="hidden lg:flex items-center
        bg-gradient-to-r from-sky-100 to-indigo-100
        rounded-full px-4 py-2 w-96
        border border-indigo-200"
      >
        <FiSearch className="text-indigo-500" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 text-sm w-full
          placeholder:text-indigo-400"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <button className="relative icon-bubble bg-emerald-200 text-emerald-700">
          <FiBell />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5
            bg-rose-400 rounded-full animate-pulse"
          />
        </button>

        {/* ADMIN PROFILE */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-full
            px-2 py-1 hover:bg-indigo-100 transition"
          >
            <img
              src="https://i.pravatar.cc/40"
              className="w-9 h-9 rounded-full border-2 border-indigo-200"
              alt="Admin"
            />
            <span className="hidden sm:block text-sm font-medium text-slate-700">
              Admin
            </span>
          </button>

          {/* DROPDOWN */}
          {open && (
            <div
              className="absolute right-0 mt-3 w-52 rounded-xl
              bg-white shadow-xl border border-indigo-100
              overflow-hidden z-50"
            >
              <div className="px-4 py-3 bg-indigo-50">
                <p className="text-sm font-semibold text-indigo-700">
                  Admin User
                </p>
                <p className="text-xs text-slate-500">
                  admin@school.com
                </p>
              </div>

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
              >
                <FiUser /> Profile
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  navigate("/settings");
                  setOpen(false);
                }}
              >
                <FiSettings /> Settings
              </button>

              <button className="dropdown-item text-rose-600">
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style>
        {`
          .icon-bubble {
            width: 36px;
            height: 36px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: background-color 0.2s ease, transform 0.15s ease;
          }
          .icon-bubble:hover {
            transform: scale(1.05);
          }

          .dropdown-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 16px;
            font-size: 14px;
            color: #334155;
            transition: background-color 0.2s ease;
          }
          .dropdown-item:hover {
            background-color: #eef2ff;
          }
        `}
      </style>
    </header>
  );
}
