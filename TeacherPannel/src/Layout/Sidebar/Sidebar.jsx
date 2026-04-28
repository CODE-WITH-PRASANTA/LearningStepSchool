import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaNewspaper,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardList,
  FaQuoteLeft,
  FaUser,
  FaCommentDots,       // ✅ ADD THIS
  FaMoneyBillWave,     // ✅ ALSO NEEDED (you are using it below)
  FaChevronDown  
} from "react-icons/fa";
import "./Sidebar.css";
import API from "../../api/axios";
import { FaUserTie } from "react-icons/fa";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [permissions, setPermissions] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/teacher/me");
        const data = res.data;

        setPermissions(data.permissions || []);
        localStorage.setItem("teacher", JSON.stringify(data));
      } catch (err) {
        console.log("Auth error:", err);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hasPermission = (perm) => {
    if (!perm) return true;
    if (permissions.includes("ALL")) return true;
    return permissions.includes(perm);
  };

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  const handleMenuClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Profile", path: "/admin/profile", icon: <FaUser /> },
    {name: "Leave" , path:"/admin/leave", icon: <FaUser/>},

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

        {
          name: "Payment Recipt",
          path: "/paymentrecipt",
          icon: <FaMoneyBillWave />,
          permission: "FEE_MANAGEMENT",
        },
      ],
    },

    {
      name: "Class Post",
      path: "/class-post",
      icon: <FaClipboardList />,
      permission: "CLASS_POST",
    },

    {
      name: "Subject Post",
      path: "/subject-post",
      icon: <FaClipboardList />,
      permission: "SUBJECT_POST",
    },

    {
      name: "Classwise Subject",
      path: "/classwise-subject-post",
      icon: <FaClipboardList />,
      permission: "CLASSWISE_SUBJECT",
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

      <aside className={sidebarOpen ? "sidebar" : "sidebar collapsed"}>
        
        {/* TOP */}
        <div className="sidebar-top">
          <div className="logo-box">A</div>

          {sidebarOpen && (
            <div className="logo-text">
              <h2>Teacher Panel</h2>
              <p>Management System</p>
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="sidebar-menu">
          {menu
            .filter((item) => {
              if (item.type === "section") return true;

              if (!item.submenu) return hasPermission(item.permission);

              const allowed = item.submenu.filter((sub) =>
                hasPermission(sub.permission)
              );

              return allowed.length > 0;
            })
            .map((item, index) => {
              if (item.type === "section") {
                return sidebarOpen ? (
                  <div className="sidebar-section" key={index}>
                    {item.label}
                  </div>
                ) : null;
              }

              return item.submenu ? (
                <div key={item.name}>
                  <button
                    className="menu-btn"
                    onClick={() => toggleMenu(item.name)}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.name}</span>}
                    {sidebarOpen && (
                      <FaChevronDown
                        className={
                          openMenu === item.name ? "rotate" : ""
                        }
                      />
                    )}
                  </button>

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
                              isActive
                                ? "submenu-link active"
                                : "submenu-link"
                            }
                          >
                            {sub.icon}
                            <span>{sub.name}</span>
                          </NavLink>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={handleMenuClick}
                  className={({ isActive }) =>
                    isActive ? "menu-link active" : "menu-link"
                  }
                >
                  {item.icon}
                  {sidebarOpen && <span>{item.name}</span>}
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
}