import React, { useState } from "react";
import "./AppSidebar.css";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiBook,
  FiLayers,
  FiFileText,
  FiCalendar,
  FiMessageSquare,
  FiDollarSign,
  FiShield,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import logo from "../../Assets/Learning Step Logo.png";

const AppSidebar = ({ isOpen, onClose }) => {
  const [openMenu, setOpenMenu] = useState("dashboard"); // 🔥 Dashboard open by default
  const [activeSub, setActiveSub] = useState("school");
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
      {/* ===== MOBILE HEADER ===== */}
      <div className="sidebar-mobile-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <button className="sidebar-close" onClick={onClose}>
          <FiX />
        </button>
      </div>

      {/* ===== STICKY PROFILE ===== */}
      <div className="sidebar-sticky">
        <div className="profile-card">
          <div
            className="profile-main"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-text">
              <h4>Jone Copper</h4>
              <p>Admin</p>
            </div>
            <FiChevronDown
              className={`profile-arrow ${profileOpen ? "rotate" : ""}`}
            />
          </div>

          {profileOpen && (
            <div className="profile-actions">
              <a href="#"><FiUser /> My Profile</a>
              <a href="#"><FiSettings /> Settings</a>
              <a href="/logout" className="logout"><FiLogOut /> Log Out</a>
            </div>
          )}
        </div>
      </div>

      {/* ===== SCROLLABLE MENU ===== */}
      <div className="sidebar-scroll">
        <ul className="sidebar-menu">

          {/* ================= DASHBOARD ================= */}
          <li>
            <div
              className={`menu-item ${openMenu === "dashboard" ? "active" : ""}`}
              onClick={() => toggleMenu("dashboard")}
            >
              <FiHome />
              <span>Dashboard</span>
              {openMenu === "dashboard" ? <FiChevronDown /> : <FiChevronRight />}
            </div>

            {openMenu === "dashboard" && (
              <ul className="submenu">
                <li>
                  <a
                    className={activeSub === "school" ? "active" : ""}
                    onClick={() => setActiveSub("school")}
                  >
                    School
                  </a>
                </li>
                <li>
                  <a
                    className={activeSub === "student" ? "active" : ""}
                    onClick={() => setActiveSub("student")}
                  >
                    Student
                  </a>
                </li>
                <li>
                  <a
                    className={activeSub === "teacher" ? "active" : ""}
                    onClick={() => setActiveSub("teacher")}
                  >
                    Teacher
                  </a>
                </li>
                <li>
                  <a
                    className={activeSub === "parent" ? "active" : ""}
                    onClick={() => setActiveSub("parent")}
                  >
                    Parent
                  </a>
                </li>
                <li>
                  <a
                    className={activeSub === "lms" ? "active" : ""}
                    onClick={() => setActiveSub("lms")}
                  >
                    LMS
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* ================= STUDENTS ================= */}
          <li>
            <div
              className={`menu-item ${openMenu === "students" ? "active" : ""}`}
              onClick={() => toggleMenu("students")}
            >
              <FiUsers />
              <span>Students</span>
              {openMenu === "students" ? <FiChevronDown /> : <FiChevronRight />}
            </div>

            {openMenu === "students" && (
              <ul className="submenu">
                <li><a className={activeSub === "add" ? "active" : ""} onClick={() => setActiveSub("add")}>Add New Student</a></li>
                <li><a className={activeSub === "list" ? "active" : ""} onClick={() => setActiveSub("list")}>Student List</a></li>
                <li><a className={activeSub === "suspend" ? "active" : ""} onClick={() => setActiveSub("suspend")}>Suspend Student</a></li>
                <li><a className={activeSub === "category" ? "active" : ""} onClick={() => setActiveSub("category")}>Student Categories</a></li>
                <li><a className={activeSub === "edit" ? "active" : ""} onClick={() => setActiveSub("edit")}>Edit Student</a></li>
                <li><a className={activeSub === "details" ? "active" : ""} onClick={() => setActiveSub("details")}>Student Details</a></li>
              </ul>
            )}
          </li>

          {/* ================= OTHERS (UNCHANGED) ================= */}
          <li><a className="menu-item" href="#"><FiUser /><span>Teachers</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiLayers /><span>Classes</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiFileText /><span>Examinations</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiDollarSign /><span>Fees Collection</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiCalendar /><span>Attendance</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiBook /><span>Library</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiMessageSquare /><span>Notice Board</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiShield /><span>Authentication</span><FiChevronRight /></a></li>
          <li><a className="menu-item" href="#"><FiSettings /><span>Settings</span><FiChevronRight /></a></li>

        </ul>
      </div>
    </aside>
  );
};

export default AppSidebar;
