import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiBookOpen,
  FiBook,
  FiUsers,
  FiAward,
  FiDollarSign,
  FiClipboard,
  FiLayers,
  FiStar,
  FiUserPlus,
  FiCalendar,
  FiChevronDown,
  FiMonitor,
  FiBriefcase,
  FiBell,
} from "react-icons/fi";

/* ================= MENU CONFIG ================= */

const menu = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },

  /* ===== MAIN SECTION ===== */
  { type: "section", label: "Main Section" },

  {
    label: "Blog Management",
    icon: FiBookOpen,
    children: [
      { label: "Blog Posts", path: "/blogs" },
      { label: "Blog View", path: "/blogs/view" },
    ],
  },

  { label: "Teacher Posting", icon: FiUsers, path: "/teachers" },
  { label: "Award Management", icon: FiAward, path: "/awards" },
  { label: "School Fee & Info", icon: FiDollarSign, path: "/fees" },
  { label: "Notice Management", icon: FiClipboard, path: "/notices" },
  { label: "Notification Management", icon: FiBell, path: "/notification" },
  { label: "Latest News Management", icon: FiBell, path: "/latest-news" },
  { label: "Class Data Registry", icon: FiClipboard, path: "/class-data" },
  { label: "Faq Posting", icon: FiCalendar, path: "/faq" },

  /* ===== ERP SOLUTION ===== */
  { type: "section", label: "ERP Solution" },

  {
    label: "Front Office",
    icon: FiBriefcase,
    children: [
      { label: "Admission Enquiry", path: "/front-office/enquiry" },
      { label: "Visitors Book", path: "/front-office/visitors" },
      { label: "Postal Dispatch", path: "/front-office/postal-dispatch" },
      { label: "Postal Receive", path: "/front-office/postal-receive" },
      { label: "Complain", path: "/front-office/complain" },
      { label: "Setup Front Office", path: "/front-office/setup" },
      { label: "Gate Pass", path: "/front-office/gate-pass" },
      { label: "Entrance Examination Form", path: "/front-office/exam-form" },
    ],
  },

  {
    label: "Attendance",
    icon: FiCalendar,
    children: [
      { label: "Student Attendance", path: "/attendance/student-attendance" },
      { label: "Student Leave", path: "/attendance/student-leave" },
      { label: "Attendance Report", path: "/attendance/attendance-report" },
    ],
  },

  {
    label: "Primary Evaluation",
    icon: FiClipboard,
    children: [
      { label: "Activity", path: "/primary-evaluation/activity" },
      { label: "Assessment", path: "/primary-evaluation/assessment" },
      { label: "Evaluation Remark", path: "/primary-evaluation/evaluation-remark" },
      { label: "Primary Class Report", path: "/primary-evaluation/class-report" },
    ],
  },

  {
    label: "Library",
    icon: FiBook,
    children: [
      { label: "Book List", path: "/library/book-list" },
      { label: "Issue Book", path: "/library/issue-book" },
      { label: "Return Book", path: "/library/return-book" },
      { label: "Add Student", path: "/library/student" },
      { label: "Add Staff", path: "/library/staff" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Sidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  useEffect(() => {
    menu.forEach((item) => {
      if (
        item.children &&
        item.children.some((c) => location.pathname.startsWith(c.path))
      ) {
        setOpenGroup(item.label);
      }
    });
  }, [location.pathname]);

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen
        bg-white/70 backdrop-blur-xl
        border-r border-white/40
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
        transition-all duration-500 ease-in-out
        ${sidebarOpen ? "w-72" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 bg-white/50">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {sidebarOpen ? "School Admin" : "SA"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2">
          {menu.map((item, i) => {
            /* ===== SECTION HEADING ===== */
            if (item.type === "section") {
              return (
                sidebarOpen && (
                  <div
                    key={i}
                    className="px-3 mt-6 mb-2 text-xs font-semibold tracking-wider uppercase text-gray-400"
                  >
                    {item.label}
                  </div>
                )
              );
            }

            const Icon = item.icon;
            const isOpen = openGroup === item.label;

            /* ===== GROUP MENU ===== */
            if (item.children) {
              return (
                <div key={i}>
                  <button
                    onClick={() =>
                      sidebarOpen && setOpenGroup(isOpen ? null : item.label)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300
                    ${
                      isOpen
                        ? "bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 shadow-lg"
                        : "hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <span className="icon-bubble">
                      <Icon />
                    </span>

                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                        <FiChevronDown
                          className={`transition-all duration-500 ${
                            isOpen ? "rotate-180 text-indigo-600" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  {/* Smooth Dropdown */}
                  <div
                    className={`overflow-hidden transition-all duration-500
                    ${
                      isOpen && sidebarOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="ml-4 mt-2 space-y-1">
                      {item.children.map((sub, j) => (
                        <NavLink
                          key={j}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm rounded-xl transition-all duration-300
                            ${
                              isActive
                                ? "bg-indigo-500 text-white shadow-md"
                                : "bg-[#fff1f4] text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            /* ===== SINGLE LINK ===== */
            return (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-800 shadow-sm"
                      : "hover:bg-white hover:shadow-md"
                  }`
                }
              >
                <span className="icon-bubble">
                  <Icon />
                </span>

                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Icon Styling */}
      <style>{`
        .icon-bubble {
          width: 38px;
          height: 38px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          color: #4f46e5;
          transition: all 0.3s ease;
        }

        .icon-bubble:hover {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }

        aside::-webkit-scrollbar {
          width: 6px;
        }

        aside::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}