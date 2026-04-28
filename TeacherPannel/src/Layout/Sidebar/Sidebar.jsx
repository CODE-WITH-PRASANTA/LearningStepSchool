import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaNewspaper,
  FaImages,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaUserTie,
  FaCommentDots,
  FaChevronDown,
  FaAddressBook,
  FaMoneyBillWave,
  FaUserGraduate,
  FaClipboardList,
  FaQuoteLeft,
} from "react-icons/fa";
import "./Sidebar.css";
import API from "../../api/axios"; // adjust path

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {

const [permissions, setPermissions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadUser = async () => {
    try {
      // ✅ use axios instance
      const res = await API.get("/teacher/me");

      const data = res.data;

      // ✅ update state
      setPermissions(data.permissions || []);

      // ✅ sync localStorage
      localStorage.setItem("teacher", JSON.stringify(data));

    } catch (err) {
      console.log("Auth error:", err);

      // 🔥 auto logout if token invalid
      // localStorage.clear();
      // window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);

  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },

    {
      name: "Cold Lead",
      path: "/admin/cold-lead",
      icon: <FaChalkboardTeacher />,
      permission: "VIEW_LEADS",
    },

    {
      name: "News Posting",
      path: "/admin/newsposting",
      icon: <FaNewspaper />,
      permission: "NEWS_POST",
    },

    {
      type: "section",
      label: "ERP Solution",
    },

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
      icon: <FaCommentDots />,
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
          icon: <FaMoneyBillWave />,
          permission: "FEE_MANAGEMENT",
        },
      ],
    },
  ];

  
  const hasPermission = (perm) => {
    if (!perm) return true;
    if (permissions.includes("ALL")) return true;
    return permissions.includes(perm);
  };

  const [openMenu, setOpenMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const handleMenuClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "close"}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">A</div>

            {sidebarOpen && (
              <div className="sidebar-brand-text">
                <h2>Teacher Panel</h2>
                <p>Management Teacher</p>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-menu">
          {menu
            .filter((item) => {
              // ✅ Always show section
              if (item.type === "section") return true;

              // ✅ No submenu → normal permission check
              if (!item.submenu) return hasPermission(item.permission);

              // ✅ With submenu → check if ANY child is allowed
              const allowedSubmenu = item.submenu.filter((sub) =>
                hasPermission(sub.permission),
              );

              return allowedSubmenu.length > 0;
            })
            .map((item, index) => {
              // 🔹 SECTION
              if (item.type === "section") {
                return sidebarOpen ? (
                  <div
                    className="sidebar-section"
                    key={`${item.label}-${index}`}
                  >
                    {item.label}
                  </div>
                ) : null;
              }

              // 🔹 NORMAL MENU
              return (
                <div className="sidebar-menu-item" key={item.name}>
                  {item.submenu ? (
                    <>
                      {/* MENU BUTTON */}
                      <button
                        type="button"
                        className={`menu-btn ${
                          openMenu === item.name ? "expanded" : ""
                        }`}
                        onClick={() => toggleMenu(item.name)}
                      >
                        <div className="menu-main">
                          <span className="menu-icon">{item.icon}</span>
                          {sidebarOpen && (
                            <span className="menu-text">{item.name}</span>
                          )}
                        </div>

                        {sidebarOpen && (
                          <span
                            className={`menu-arrow ${
                              openMenu === item.name ? "rotate" : ""
                            }`}
                          >
                            <FaChevronDown />
                          </span>
                        )}
                      </button>

                      {/* SUBMENU */}
                      {openMenu === item.name && sidebarOpen && (
                        <div className="submenu">
                          {item.submenu
                            .filter((sub) => hasPermission(sub.permission))
                            .map((sub) => (
                              <NavLink
                                key={sub.path}
                                to={sub.path}
                                onClick={handleMenuClick}
                                className={({ isActive }) =>
                                  `submenu-link ${isActive ? "active" : ""}`
                                }
                              >
                                <span className="submenu-icon">{sub.icon}</span>
                                <span className="submenu-text">{sub.name}</span>
                              </NavLink>
                            ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={handleMenuClick}
                      className={({ isActive }) =>
                        `menu-link ${isActive ? "active" : ""}`
                      }
                    >
                      <div className="menu-main">
                        <span className="menu-icon">{item.icon}</span>
                        {sidebarOpen && (
                          <span className="menu-text">{item.name}</span>
                        )}
                      </div>
                    </NavLink>
                  )}
                </div>
              );
            })}
        </nav>
      </aside>
    </>
  );
}
