import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLogOut,
  FiHome,
  FiBookOpen,
  FiBook,
  FiUsers,
  FiAward,
  FiDollarSign,
  FiClipboard,
  FiGrid,
  FiCalendar,
  FiChevronDown,
  FiBriefcase,
  FiBell,
  FiLayers,
  FiMonitor,
  FiStar,
  FiEdit,
  FiFileText,
  FiDatabase,
  FiMessageCircle,
  FiCheckSquare,
  FiActivity,
  FiCreditCard,
  FiTrendingUp,
  FiMessageSquare,
  FiSettings,
  FiX,
  FiFolder,
  FiCpu,
} from "react-icons/fi";
import "./AppSidebar.css";

/* Helper component for FiImage icon */
function FiImage(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );
}

/* ================= UNTOUCHED ORIGINAL MENU CONFIG ================= */
const menu = [
  {
    label: "Executive Dashboard",
    icon: FiHome,
    path: "/dashboard",
  },
  { type: "section", label: "Lead & Marketing Center" },
  {
    label: "Lead Management",
    icon: FiTrendingUp,
    path: "/admin/coldleads",
  },
  {
    label: "Marketing Campaigns",
    icon: FiImage,
    path: "/admin/advertisement",
  },
  {
    label: "Contact Inquiry Center",
    icon: FiMessageSquare,
    path: "/admin/contact-enq",
  },
  { type: "section", label: "Website Content Management" },
  {
    label: "Content Hub",
    icon: FiBookOpen,
    children: [
      { label: "Blog Posts", path: "/blogs" },
      { label: "Published Blogs", path: "/blogs/view" },
    ],
  },
  {
    label: "Faculty Directory",
    icon: FiUsers,
    path: "/teachers",
  },
  {
    label: "Achievements & Awards",
    icon: FiAward,
    path: "/awards",
  },
  {
    label: "Fee Information Center",
    icon: FiDollarSign,
    path: "/fees",
  },
  {
    label: "Notice Board",
    icon: FiClipboard,
    path: "/notices",
  },
  {
    label: "Alerts & Notifications",
    icon: FiBell,
    path: "/notification",
  },
  {
    label: "News & Updates",
    icon: FiFileText,
    path: "/latest-news",
  },
  {
    label: "Academic Data Registry",
    icon: FiDatabase,
    path: "/class-data",
  },
  {
    label: "Digital Media Center",
    icon: FiMonitor,
    children: [
      {
        label: "Photo Gallery",
        path: "/media-photo",
      },
      {
        label: "Video Library",
        path: "/media-video",
      },
    ],
  },
  {
    label: "E-Learning Portal",
    icon: FiLayers,
    children: [
      {
        label: "Pre-Primary Curriculum",
        path: "/learning/pre",
      },
      {
        label: "Primary Curriculum",
        path: "/learning/primary",
      },
      {
        label: "Secondary Curriculum",
        path: "/learning/secondary",
      },
    ],
  },
  {
    label: "Testimonials & Reviews",
    icon: FiStar,
    path: "/testimonials",
  },
  {
    label: "Admission Control",
    icon: FiUsers,
    children: [
      {
        label: "Admission Applications",
        path: "/survey",
      },
      {
        label: "Application Records",
        path: "/survey/data",
      },
    ],
  },
  {
    label: "Events & Activities",
    icon: FiCalendar,
    path: "/events",
  },
  {
    label: "Knowledge Base & FAQs",
    icon: FiMessageCircle,
    path: "/faq",
  },
  { type: "section", label: "School ERP Suite" },
  {
    label: "Student Information System",
    icon: FiUsers,
    children: [
      {
        label: "Student Enrollment",
        path: "/student/admission",
      },
      {
        label: "Student Records",
        path: "/student/admission/details",
      },
      {
        label: "Class Promotion Manager",
        path: "/student/Promotion",
      },
      {
        label: "Student Portfolio",
        path: "/student/portfolio",
      },
      {
        label: "Student ID card",
        path: "/student/id-card",
      },
    ],
  },
  {
    label: "Finance & Fee Manager",
    icon: FiCreditCard,
    children: [
      {
        label: "Fee Collection",
        path: "/fee-collect",
      },
      {
        label: "Fee Structure",
        path: "/fee-type",
      },
      {
        label: "Payment Receipts",
        path: "/Paymentrecipt",
      },
      {
        label: "Additional Income",
        path: "/other-income",
      },
    ],
  },
  {
    label: "Class Management",
    icon: FiBookOpen,
    path: "/class-post",
  },
  {
    label: "Subject Management",
    icon: FiEdit,
    path: "/subject-post",
  },
  {
    label: "Class Subject Mapping",
    icon: FiLayers,
    path: "/classwise-subject",
  },
  { type: "divider" },
  {
    label: "Attendance",
    icon: FiCheckSquare,
    children: [
      {
        label: "Today Attendance",
        path: "/today",
      },
      {
        label: "Employee Attendance",
        path: "/employee",
      },
      {
        label: "Attendance Sheet",
        path: "/sheet",
      },
      {
        label: "Timesheets",
        path: "/timesheets",
      },
      {
        label: "Overtime Requests",
        path: "/overtime",
      },
      {
        label: "Shift Planning",
        path: "/shift-planning",
      },
      {
        label: "Remote/WFH Request",
        path: "/remote-wfh",
      },
    ],
  },
  {
    label: "Leave Management",
    icon: FiCalendar,
    children: [
      {
        label: "All Leave Request",
        path: "/leave/requests",
      },
      {
        label: "Leave Balance",
        path: "/leave/balance",
      },
      {
        label: "Leave Types",
        path: "/leave/types",
      },
      {
        label: "Leave Setting",
        path: "/leave/settings",
      },
    ],
  },
  {
    label: "HR & Access Control",
    icon: FiSettings,
    children: [
      {
        label: "Faculty Registration",
        path: "/admin/create-teacher",
      },
      {
        label: "Roles & Permissions",
        path: "/admin/create-permission",
      },
      {
        label: "Staff Attendance",
        path: "/admin/attendance-management",
      },
      {
        label: "Leave Administration",
        path: "/admin/leave-management",
      },
      {
        label: "Payroll Processing",
        path: "/admin/payroll-management",
      },
    ],
  },
  {
    label: "Examination Center",
    icon: FiBriefcase,
    children: [
      {
        label: "Published Results",
        path: "/exam-result",
      },
      {
        label: "Marks Management",
        path: "/exam-result-manager",
      },
      {
        label: "Exam Configuration",
        path: "/exam-type",
      },
      {
        label: "Academic Report Cards",
        path: "/exam-report",
      },
    ],
  },
  {
    label: "Attendance Center",
    icon: FiCheckSquare,
    children: [
      {
        label: "Daily Attendance",
        path: "/attendance/student-attendance",
      },
      {
        label: "Student Leave Requests",
        path: "/attendance/student-leave",
      },
      {
        label: "Attendance Analytics",
        path: "/attendance/attendance-report",
      },
    ],
  },
  {
    label: "Library Management System",
    icon: FiBook,
    children: [
      {
        label: "Library Configuration",
        path: "/library/master",
      },
      {
        label: "Book Catalog",
        path: "/library/issue-book",
      },
      {
        label: "Book Issue Desk",
        path: "/library/return-book",
      },
      {
        label: "Book Return Desk",
        path: "/library/student",
      },
      {
        label: "Damaged Books Register",
        path: "/library/staff",
      },
    ],
  },
  { type: "divider" },
  {
    label: "Fee Configuration",
    icon: FiCreditCard,
    children: [
      {
        label: "Fee Groups",
        path: "/fee-group",
      },
      {
        label: "Fee Heads",
        path: "/fee-head",
      },
      {
        label: "Fee Structure",
        path: "/fee-structure",
      },
      {
        label: "Fee Entries",
        path: "/fee-entry",
      },
    ],
  },
  {
    label: "Helpdesk & Support",
    icon: FiMessageCircle,
    children: [
      {
        label: "Support Tickets",
        path: "/ticket/generator",
      },
    ],
  },
  { type: "divider" },
  {
    label: "Front Office Operations",
    icon: FiGrid,
    children: [
      { label: "Calendar Planner", path: "/calender/planning" },
      { label: "Student POP Register", path: "/student/popform" },
      { label: "Staff Gate Pass", path: "/staff/gatepass" },
      { label: "Pre-Admission Portal", path: "/pre/admission" },
      { label: "Visitor Meetings", path: "/staff/meet" },
      { label: "Admin Complaints", path: "/admin/complaint" },
      { label: "Staff Complaints", path: "/staff/complaint" },
      { label: "Student Gate Pass", path: "/student/gatepass" },
      { label: "Visitor Management", path: "/visitor/enquiry" },
    ],
  },
  { type: "divider" },
  {
    label: "Inventory & Stationery",
    icon: FiClipboard,
    children: [
      {
        label: "School Store Information",
        path: "/school/information",
      },
      {
        label: "Supplier Management",
        path: "/school/supplymaster",
      },
      {
        label: "Product Categories",
        path: "/catagory/master",
      },
      {
        label: "Inventory Items",
        path: "/catagorry/items",
      },
    ],
  },
  {
    label: "Transport Management",
    icon: FiActivity,
    children: [
      {
        label: "Vehicle Registry",
        path: "/transport/vehicle",
      },
      {
        label: "Route Management",
        path: "/transport/route",
      },
      {
        label: "Transport Destinations",
        path: "/transport/destination",
      },
      {
        label: "Route Assignment",
        path: "/transport/routesAssigne",
      },
      {
        label: "Vehicle Route Mapping",
        path: "/transport/vehicleroute",
      },
      {
        label: "Transport Dashboard",
        path: "/transport-summary",
      },
      {
        label: "Student Transport",
        path: "/transport-student",
      },
      {
        label: "Vehicle Reports",
        path: "/transport-vechile",
      },
    ],
  },
  { type: "divider" },
  {
    label: "Vechile Controler",
    icon: FiClipboard,
    children: [
      {
        label: "Vehicle DashBoard",
        path: "/vehicle/dashboard",
      },
      {
        label: "Daily km log entry",
        path: "/vehicle/km",
      },
      {
        label: "System Setting",
        path: "/vehicle/setting",
      },
    ],
  },
  {
    label: "Accounts & Expenses",
    icon: FiCreditCard,
    children: [
      {
        label: "School Wallet",
        path: "/wallet",
      },
      {
        label: "Expense Entry",
        path: "/expense/details",
      },
      {
        label: "Expense Explorer",
        path: "/expense-search",
      },
      {
        label: "Expense Categories",
        path: "/expense-head",
      },
    ],
  },
];

/* SPLIT MENU AT "School ERP Suite" SECTION */
const erpSectionIndex = menu.findIndex(
  (item) => item.type === "section" && item.label === "School ERP Suite"
);

const schoolManagementItems = menu.slice(0, erpSectionIndex);
const schoolERPItems = menu.slice(erpSectionIndex + 1);

/* ================= COMPONENT ================= */
export default function Sidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [openGroup, setOpenGroup] = useState(null);
  const [profileExpanded, setProfileExpanded] = useState(false);
  
  /* Main Root Dropdown Accordion States */
  const [mgmtOpen, setMgmtOpen] = useState(true);
  const [erpOpen, setErpOpen] = useState(true);

  // Auto-close sidebar drawer when navigating on mobile devices
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const activeGroup = menu.find(
      (item) =>
        item.children &&
        item.children.some((c) => location.pathname.startsWith(c.path))
    );
    if (activeGroup) {
      setOpenGroup(activeGroup.label);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("admin");
      navigate("/login");
    }
  };

  /* Helper renderer for list items */
  const renderMenuItems = (itemsList) => {
    return itemsList.map((item, i) => {
      if (item.type === "section") {
        return (
          (sidebarOpen || mobileOpen) && (
            <div key={i} className="menu-section-header">
              {item.label}
            </div>
          )
        );
      }

      if (item.type === "divider") {
        return <div key={i} className="menu-divider" />;
      }

      const Icon = item.icon || null;
      const isChildActive =
        item.children &&
        item.children.some((c) => location.pathname.startsWith(c.path));
      const isOpen = openGroup === item.label;

      /* Grouped Submenu Items */
      if (item.children) {
        return (
          <div key={i}>
            <button
              onClick={() =>
                (sidebarOpen || mobileOpen) &&
                setOpenGroup(isOpen ? null : item.label)
              }
              className={`menu-item-button ${
                isChildActive ? "is-active" : ""
              }`}
            >
              {isChildActive && <span className="active-glow-pill" />}

              {Icon && (
                <span className="icon-bubble">
                  <Icon />
                </span>
              )}

              {(sidebarOpen || mobileOpen) && (
                <div className="menu-item-content">
                  <span className="menu-item-label">{item.label}</span>
                  <FiChevronDown
                    className={`chevron-icon ${isOpen ? "rotated" : ""}`}
                  />
                </div>
              )}
            </button>

            <AnimatePresence>
              {isOpen && (sidebarOpen || mobileOpen) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="submenu-container">
                    {item.children.map((sub, j) => (
                      <NavLink
                        key={j}
                        to={sub.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `submenu-link ${isActive ? "is-sub-active" : ""}`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      }

      /* Single Route Items */
      return (
        <NavLink
          key={i}
          to={item.path}
          onClick={handleNavClick}
          style={{ textDecoration: "none" }}
        >
          {({ isActive }) => (
            <div
              className={`menu-item-link ${isActive ? "is-active" : ""}`}
            >
              {isActive && <span className="active-glow-pill" />}

              {Icon && (
                <span className="icon-bubble">
                  <Icon />
                </span>
              )}

              {(sidebarOpen || mobileOpen) && (
                <div className="menu-item-content">
                  <span className="menu-item-label">{item.label}</span>
                </div>
              )}
            </div>
          )}
        </NavLink>
      );
    });
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="sidebar-backdrop"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "desktop-open" : "desktop-closed"
        } ${mobileOpen ? "mobile-open" : "mobile-closed"}`}
      >
        {/* Floating particles background */}
        <span className="bg-shape star-1">✨</span>
        <span className="bg-shape star-2">✦</span>
        <span className="bg-shape circle-1">●</span>
        <span className="bg-shape circle-2">◆</span>

        {/* 1. LOGO SECTION */}
        <div className="sidebar-logo-section">
          <button
            onClick={() => setMobileOpen(false)}
            className="mobile-close-btn"
            aria-label="Close Mobile Sidebar"
          >
            <FiX />
          </button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div className="logo-badge">
              <span className="logo-icon">🏫</span>
              <span className="logo-sparkle">✨</span>
            </div>

            {(sidebarOpen || mobileOpen) && (
              <div className="logo-title-wrap">
                <h1 className="logo-title">THE LEARNING STEP</h1>
                <p className="logo-subtitle">International School</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* 2. PROFILE CARD */}
        <div className="sidebar-profile-wrapper">
          <div className="glass-card">
            <div
              onClick={() =>
                (sidebarOpen || mobileOpen) && setProfileExpanded(!profileExpanded)
              }
              className="profile-main-row"
            >
              <div className="avatar-container">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Admin"
                  className="profile-avatar"
                />
                <span className="online-dot"></span>
              </div>

              {(sidebarOpen || mobileOpen) && (
                <div className="profile-info">
                  <div>
                    <h4 className="profile-name">Admin</h4>
                    <p className="profile-role">Super Admin</p>
                  </div>
                  <FiChevronDown
                    className={`chevron-icon ${profileExpanded ? "rotated" : ""}`}
                  />
                </div>
              )}
            </div>

            <AnimatePresence>
              {(sidebarOpen || mobileOpen) && profileExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="profile-dropdown-menu"
                >
                  <button className="profile-dropdown-item">👤 My Profile</button>
                  <button className="profile-dropdown-item">🔔 Notifications</button>
                  <button
                    onClick={handleLogout}
                    className="profile-dropdown-item logout-text"
                  >
                    🚪 Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. NAVIGATION MENU (SPLIT INTO 2 MAIN DROPDOWNS) */}
        <nav className="sidebar-navigation sidebar-scroll">
          {/* MAIN DROPDOWN 1: SCHOOL MANAGEMENT */}
          <div className="main-category-block">
            {(sidebarOpen || mobileOpen) ? (
              <button
                onClick={() => setMgmtOpen(!mgmtOpen)}
                className={`main-category-btn ${mgmtOpen ? "is-open" : ""}`}
              >
                <div className="main-category-title-wrap">
                  <div className="main-category-icon-box">
                    <FiFolder />
                  </div>
                  <span className="main-category-text">School Management</span>
                </div>
                <FiChevronDown
                  className={`chevron-icon ${mgmtOpen ? "rotated" : ""}`}
                />
              </button>
            ) : (
              <div className="menu-section-header">MGMT</div>
            )}

            <AnimatePresence>
              {(mgmtOpen || (!sidebarOpen && !mobileOpen)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="main-category-content-body"
                >
                  {renderMenuItems(schoolManagementItems)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="menu-divider" />

          {/* MAIN DROPDOWN 2: SCHOOL ERP */}
          <div className="main-category-block">
            {(sidebarOpen || mobileOpen) ? (
              <button
                onClick={() => setErpOpen(!erpOpen)}
                className={`main-category-btn ${erpOpen ? "is-open" : ""}`}
              >
                <div className="main-category-title-wrap">
                  <div className="main-category-icon-box">
                    <FiCpu />
                  </div>
                  <span className="main-category-text">School ERP</span>
                </div>
                <FiChevronDown
                  className={`chevron-icon ${erpOpen ? "rotated" : ""}`}
                />
              </button>
            ) : (
              <div className="menu-section-header">ERP</div>
            )}

            <AnimatePresence>
              {(erpOpen || (!sidebarOpen && !mobileOpen)) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="main-category-content-body"
                >
                  {renderMenuItems(schoolERPItems)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* 4. ACHIEVEMENT CARD */}
        {(sidebarOpen || mobileOpen) && (
          <div className="achievement-wrapper">
            <div className="achievement-card">
              <span className="trophy-icon">🏆</span>
              <div className="achievement-info">
                <h5 className="achievement-title">Great Progress! 🎉</h5>
                <p className="achievement-subtitle">Keep up the amazing work!</p>
              </div>
              <button className="achievement-btn">→</button>
            </div>
          </div>
        )}

        {/* 5. FOOTER & LOGOUT */}
        <div className="sidebar-footer">
          {(sidebarOpen || mobileOpen) && (
            <div className="footer-illustration">
              <span className="cloud-drift">☁️</span>
              <span className="bus-moving">🚌</span>
              <span>🌳</span>
              <span className="cloud-drift">☁️</span>
            </div>
          )}

          <div className="logout-wrapper">
            <button onClick={handleLogout} className="logout-button">
              <span className="icon-bubble">
                <FiLogOut />
              </span>
              {(sidebarOpen || mobileOpen) && (
                <span className="logout-label">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}