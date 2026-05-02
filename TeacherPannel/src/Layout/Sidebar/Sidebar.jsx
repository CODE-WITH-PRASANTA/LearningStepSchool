import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
  FaCalendarAlt,
} from "react-icons/fa";

import "./Sidebar.css";
import API from "../../api/axios";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [permissions, setPermissions] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // 🔹 Load Permissions
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

  // 🔹 Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔐 Permission Check
  const hasPermission = (perm) => {
    if (!perm) return true;
    if (permissions.includes("ALL")) return true;
    return permissions.includes(perm);
  };

  // 🔽 Toggle submenu
  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  // 📱 Auto close on mobile
  const handleClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  // 📊 MENU
  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
<<<<<<< HEAD
    { name: "Profile", path: "/admin/profile", icon: <FaUser />,  },
    { name: "Leave", path: "/admin/leave", icon: <FaUser /> },
    { name: "Attendance", path: "/teacher-attendance", icon:""},
=======
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUser />,
      permission: "VIEW_PROFILE",
    },
    { name: "Leave", path: "/admin/leave", icon: <FaUser />, permission: "TEACHER_LEAVE" },
>>>>>>> 793ca73556590ca0386f32d42e06ac71baab798b

    { type: "section", label: "ERP Solution" },

    {
      name: "Student Hub",
      icon: <FaUserGraduate />,
      permission: "VIEW_STUDENT_DETAILS",
      submenu: [
        {
          name: "Student Admission",
          path: "/student/admission",
          icon: <FaClipboardList />,
          permission: "VIEW_STUDENT_DETAILS",
        },
        {
          name: "Student Details",
          path: "/student/admission/details",
          icon: <FaUserTie />,
          permission: "VIEW_STUDENT_DETAILS",
        },
      ],
    },

    {
      name: "Student Paytrack",
      icon: <FaMoneyBillWave />,
      permission: "FEE_MANAGEMENT",
      submenu: [
        {
          name: "Fee Collect",
          path: "/fee-collect",
          icon: <FaMoneyBillWave />,
          permission: "FEE_MANAGEMENT",
        },
        {
          name: "Fee Type",
          path: "/fee-type",
          icon: <FaLayerGroup />,
          permission: "FEE_MANAGEMENT",
        },
        {
          name: "Payment Receipt",
          path: "/paymentrecipt",
          icon: <FaClipboardList />,
          permission: "FEE_MANAGEMENT",
        },
      ],
    },

    {
      name: "Subject Post",
      path: "/subject-post",
      icon: <FaBook />,
      permission: "SUBJECT_POST",
    },
    {
      name: "Classwise Subject",
      path: "/classwise-subject-post",
      icon: <FaLayerGroup />,
      permission: "CLASSWISE_SUBJECT",
    },

    { type: "section", label: "Content Management" },

    {
      name: "Blog Management",
      icon: <FaCommentDots />,
      permission: "BLOG_MANAGEMENT",
      submenu: [
        {
          name: "Blog Post",
          path: "/blog-post",
          icon: <FaClipboardList />,
          permission: "BLOG_MANAGEMENT",
        },
        {
          name: "Blog View",
          path: "/blog-view",
          icon: <FaBook />,
          permission: "BLOG_MANAGEMENT",
        },
      ],
    },

    {
      name: "Teacher Posting",
      path: "/teacher-posting",
      icon: <FaUserTie />,
      permission: "TEACHER_POSTING",
    },
    {
      name: "Award Management",
      path: "/award-management",
      icon: <FaLayerGroup />,
      permission: "AWARD_MANAGEMENT",
    },
    {
      name: "School Fee & Info",
      path: "/schoolfee-info",
      icon: <FaMoneyBillWave />,
      permission: "SCHOOLFEE_INFO",
    },
    {
      name: "Notice Management",
      path: "/notice-management",
      icon: <FaClipboardList />,
      permission: "NOTICE_MANAGEMENT",
    },

    {
      name: "Notification Management",
      path: "/notification-management",
      icon: <FaCommentDots />,
      permission: "NOTIFICATION_MANAGEMENT",
    },
    {
      name: "Latest News Management",
      path: "/latest-news",
      icon: <FaNewspaper />,
      permission: "LATEST_NEWS_MANAGEMENT",
    },
    {
      name: "Class Data Registry",
      path: "/class-data",
      icon: <FaLayerGroup />,
      permission: "CLASS_DATA_REGISTRY",
    },

    {
      name: "Media Management",
      icon: <FaLayerGroup />,
      permission: "MEDIA_MANAGEMENT",
      submenu: [
        {
          name: "Photo Gallery",
          path: "/media/photo-gallery",
          icon: <FaImage />,
          permission: "MEDIA_MANAGEMENT",
        },
        {
          name: "Video Gallery",
          path: "/media/video-gallery",
          icon: <FaVideo />,
          permission: "MEDIA_MANAGEMENT",
        },
      ],
    },

    {
      name: "Learning Management",
      icon: <FaBook />,
      permission: "LEARNING_MANAGEMENT",
      submenu: [
        {
          name: "Pre-Primary",
          path: "/learning/pre-primary",
          icon: <FaBook />,
          permission: "LEARNING_MANAGEMENT",
        },
        {
          name: "Primary",
          path: "/learning/primary",
          icon: <FaBook />,
          permission: "LEARNING_MANAGEMENT",
        },
        {
          name: "Secondary",
          path: "/learning/secondary",
          icon: <FaBook />,
          permission: "LEARNING_MANAGEMENT",
        },
      ],
    },

    {
      name: "Testimonials",
      path: "/testimonials",
      icon: <FaQuoteLeft />,
      permission: "TESTIMONIALS_MANAGEMENT",
    },
    {
      name: "Admission Management",
      path: "/admission-management",
      icon: <FaUserGraduate />,
      permission: "ADMISSION_MANAGEMENT",

      submenu: [
        {
          name: "Admission Survey",
          path: "/survey",
          icon: <FaUserGraduate />,
          permission: "ADMISSION_MANAGEMENT",
        },
        {
          name: "Admission Data View",
          path: "/survey/data",
          icon: <FaUserGraduate />,
          permission: "ADMISSION_MANAGEMENT",
        },
      ],
    },
    {
      name: "Event Management",
      path: "/event-management",
      icon: <FaCalendarAlt />,
      permission: "EVENT_MANAGEMENT",
    },
    {
      name: "FAQ Posting",
      path: "/faq",
      icon: <FaCommentDots />,
      permission: "FAQ_POSTING",
    },
  ];

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
          {menu
            .filter((item) => {
              if (item.type === "section") return true;

              if (!item.submenu) return hasPermission(item.permission);

              const allowedSub = item.submenu.filter((sub) =>
                hasPermission(sub.permission),
              );

              return allowedSub.length > 0;
            })
            .map((item, index) => {
              if (item.type === "section") {
                return (
                  <div key={index} className="sidebar-section">
                    {item.label}
                  </div>
                );
              }

              return item.submenu ? (
                <div key={item.name}>
                  <button
                    className="menu-item"
                    onClick={() => toggleMenu(item.name)}
                  >
                    <div className="menu-left">
                      <span className="menu-icon">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>

                    <FaChevronDown
                      className={`arrow ${openMenu === item.name ? "open" : ""}`}
                    />
                  </button>

                  <div
                    className={`submenu ${openMenu === item.name ? "show" : ""}`}
                  >
                    {item.submenu
                      .filter((sub) => hasPermission(sub.permission))
                      .map((sub) => (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={handleClick}
                          className={({ isActive }) =>
                            isActive
                              ? "menu-item submenu-item active"
                              : "menu-item submenu-item"
                          }
                        >
                          <div className="menu-left">
                            <span className="menu-icon">{sub.icon}</span>
                            <span>{sub.name}</span>
                          </div>
                        </NavLink>
                      ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleClick}
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
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
    </>
  );
};

export default Sidebar;
