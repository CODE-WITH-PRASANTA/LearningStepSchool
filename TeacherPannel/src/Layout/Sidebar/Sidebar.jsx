import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaChalkboardTeacher,
  FaNewspaper,
  FaUserGraduate,
  FaClipboardList,
  FaCommentDots,
  FaMoneyBillWave,
  FaChevronDown,
  FaUserTie,
  FaBook,
  FaLayerGroup,
  FaQuoteLeft,
  FaImage,
  FaVideo,
  FaCalendarAlt
} from "react-icons/fa";

import "./Sidebar.css";
import API from "../../api/axios";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [permissions, setPermissions] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/teacher/me");
        setPermissions(res.data.permissions || []);
      } catch (err) {
        console.log(err);
      }
    };
    loadUser();
  }, []);

  const hasPermission = (perm) => {
    if (!perm) return true;
    if (permissions.includes("ALL")) return true;
    return permissions.includes(perm);
  };

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

const menu = [
  { name: "Dashboard", path: "/", icon: <FaHome /> },
  { name: "Profile", path: "/admin/profile", icon: <FaUser /> },
  { name: "Leave", path: "/admin/leave", icon: <FaUser /> },

  { type: "section", label: "ERP Solution" },

  // ================= STUDENT =================
  {
    name: "Student Hub",
    icon: <FaUserGraduate />,
    submenu: [
      { name: "Student Admission", path: "/student/admission", icon: <FaClipboardList /> },
      { name: "Student Details", path: "/student/admission/details", icon: <FaUserTie /> },
    ],
  },

  {
    name: "Student Paytrack",
    icon: <FaMoneyBillWave />,
    submenu: [
      { name: "Fee Collect", path: "/fee-collect", icon: <FaMoneyBillWave /> },
      { name: "Fee Type", path: "/fee-type", icon: <FaLayerGroup /> },
      { name: "Payment Receipt", path: "/paymentrecipt", icon: <FaClipboardList /> },
    ],
  },

  { name: "Subject Post", path: "/subject-post", icon: <FaBook /> },
  { name: "Classwise Subject", path: "/classwise-subject-post", icon: <FaLayerGroup /> },

  // ================= BLOG =================
  {
    name: "Blog Management",
    icon: <FaCommentDots />,
    submenu: [
      { name: "Blog Post", path: "/blog-post", icon: <FaClipboardList /> },
      { name: "Blog View", path: "/blog-view", icon: <FaBook /> },
    ],
  },

  // ================= NEW MENUS =================

  { name: "Teacher Posting", path: "/teacher-posting", icon: <FaUserTie /> },
  { name: "Award Management", path: "/award-management", icon: <FaLayerGroup /> },
  { name: "School Fee & Info", path: "/schoolfee-info", icon: <FaMoneyBillWave /> },
  { name: "Notice Management", path: "/notice-management", icon: <FaClipboardList /> },
  { name: "Notification Management", path: "/notification-management", icon: <FaCommentDots /> },
  { name: "Latest News Management", path: "/latest-news", icon: <FaNewspaper /> },
  { name: "Class Data Registry", path: "/class-data", icon: <FaLayerGroup /> },

  // ================= MEDIA (DROPDOWN) =================
  {
    name: "Media Management",
    icon: <FaLayerGroup />,
    submenu: [
      {
        name: "Photo Gallery Managements",
        path: "/media/photo-gallery",
        icon: <FaImage />   // 👈 import FaImage
      },
      {
        name: "Video Gallery Managements",
        path: "/media/video-gallery",
        icon: <FaVideo />   // 👈 import FaVideo
      },
    ],
  },

  // ================= LEARNING (DROPDOWN) =================
  {
    name: "Learning Management",
    icon: <FaBook />,
    submenu: [
      { name: "Pre-Primary", path: "/learning/pre-primary", icon: <FaBook /> },
      { name: "Primary", path: "/learning/primary", icon: <FaBook /> },
      { name: "Secondary", path: "/learning/secondary", icon: <FaBook /> },
    ],
  },

  { name: "Testimonials", path: "/testimonials", icon: <FaQuoteLeft /> },
  { name: "Admission Management", path: "/admission-management", icon: <FaUserGraduate /> },
  { name: "Event Management", path: "/event-management", icon: <FaCalendarAlt /> },
  { name: "FAQ Posting", path: "/faq", icon: <FaCommentDots /> },
];

  return (
    <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>

      {/* TOP */}
      <div className="sidebar-top">
        <div className="logo-box">A</div>
        <div className="logo-text">
          <h2>Teacher Panel</h2>
          <p>Management System</p>
        </div>
      </div>

      {/* MENU */}
      <div className="sidebar-menu">

        {menu.map((item, index) => {
          if (item.type === "section") {
            return <div key={index} className="sidebar-section">{item.label}</div>;
          }

          return item.submenu ? (
            <div key={item.name}>

              <button
                className="menu-item"
                onClick={() => toggleMenu(item.name)}
              >
                <div className="menu-left">
                  {item.icon}
                  <span>{item.name}</span>
                </div>

                <FaChevronDown className={`arrow ${openMenu === item.name ? "open" : ""}`} />
              </button>

              <div className={`submenu ${openMenu === item.name ? "show" : ""}`}>
                {item.submenu.map((sub) => (
                  <NavLink key={sub.path} to={sub.path} className="menu-item submenu-item">
                    <div className="menu-left">
                      {sub.icon}
                      <span>{sub.name}</span>
                    </div>
                  </NavLink>
                ))}
              </div>

            </div>
          ) : (
            <NavLink key={item.name} to={item.path} className="menu-item">
              <div className="menu-left">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}

      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="logout-btn">Logout</button>
      </div>

    </aside>
  );
}