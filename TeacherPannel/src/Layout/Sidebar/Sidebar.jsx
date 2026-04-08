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

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const menu = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },

      { name: "Cold Lead", path: "/admin/cold-lead", icon: <FaChalkboardTeacher /> },   
      { name: "Cold Lead Table", path: "/admin/cold-lead-table", icon: <FaChalkboardTeacher /> },   

        { name: "News Posting", path: "/admin/newsposting", icon: <FaNewspaper /> },
        { name: "Teacher Posting", path: "/admin/teacherposting", icon: <FaChalkboardTeacher /> },
        { name: "Testimonial", path: "/admin/testimonial", icon: <FaQuoteLeft /> },

        { name: "Gallery posting", path: "/admin/gallery", icon: <FaMoneyBillWave /> },
         { name: "Admission Table", path: "/admin/Admission-Table", icon: <FaImages /> },
     

    // {
    //   name: "Gallery",
    //   icon: <FaImages />,
    //   submenu: [
    //     { name: "Gallery Post", path: "/admin/gallery-post", icon: <FaImages /> },
    //     { name: "Gallery View", path: "/admin/gallery-view", icon: <FaImages /> },
    //   ],
    // },

    // { name: "Event", path: "/admin/event", icon: <FaCalendarAlt /> },
    // { name: "Classes", path: "/admin/classes", icon: <FaChalkboardTeacher /> },
    // { name: "Contact", path: "/admin/contact", icon: <FaAddressBook /> },
    // { name: "Admission", path: "/admin/admission", icon: <FaClipboardList /> },
    // { name: "Fees", path: "/admin/fees", icon: <FaMoneyBillWave /> },

    {
      type: "section",
      label: "ERP Solution",
    },

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
      icon: <FaCommentDots />,
      submenu: [
        { name: "Fee Collect", path: "/fee-collect", icon: <FaMoneyBillWave /> },
        { name: "Fee Type", path: "/fee-type", icon: <FaMoneyBillWave /> },
      ],
    },
  ];

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
          {menu.map((item, index) => {
            if (item.type === "section") {
              return sidebarOpen ? (
                <div className="sidebar-section" key={`${item.label}-${index}`}>
                  {item.label}
                </div>
              ) : null;
            }

            return (
              <div className="sidebar-menu-item" key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                      type="button"
                      className={`menu-btn ${openMenu === item.name ? "expanded" : ""}`}
                      onClick={() => toggleMenu(item.name)}
                    >
                      <div className="menu-main">
                        <span className="menu-icon">{item.icon}</span>
                        {sidebarOpen && <span className="menu-text">{item.name}</span>}
                      </div>

                      {sidebarOpen && (
                        <span className={`menu-arrow ${openMenu === item.name ? "rotate" : ""}`}>
                          <FaChevronDown />
                        </span>
                      )}
                    </button>

                    {openMenu === item.name && sidebarOpen && (
                      <div className="submenu">
                        {item.submenu.map((sub) => (
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
                      {sidebarOpen && <span className="menu-text">{item.name}</span>}
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