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
  FiGrid,
  FiCalendar,
  FiChevronDown,
  FiBriefcase,
  FiBell,
} from "react-icons/fi";

/* ================= MENU CONFIG ================= */

const menu = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },

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

  { type: "divider" },

  {
    label: "Question Paper",
    icon: FiGrid,
    children: [
      { label: "Type", path: "/type-question" },
      { label: "Question", path: "/question" },
      { label: "Generate", path: "/paper-generate" },
    ],
  },
];

/* ================= COMPONENT ================= */

export default function Sidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  /* AUTO OPEN ACTIVE GROUP */
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
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200
        transition-all duration-500 ease-in-out
        ${sidebarOpen ? "w-72" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="h-16 flex items-center justify-center border-b">
          <span className="text-xl font-bold text-indigo-600">
            {sidebarOpen ? "School Admin" : "SA"}
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2">
          {menu.map((item, i) => {
            /* SECTION TITLE */
            if (item.type === "section") {
              return (
                sidebarOpen && (
                  <div
                    key={i}
                    className="px-3 mt-6 mb-2 text-xs font-semibold uppercase text-gray-400"
                  >
                    {item.label}
                  </div>
                )
              );
            }

            /* DIVIDER */
            if (item.type === "divider") {
              return <div key={i} className="my-4 border-t border-gray-200" />;
            }

            const Icon = item.icon || null;
            const isOpen = openGroup === item.label;

            /* GROUP MENU */
            if (item.children) {
              return (
                <div key={i}>
                  <button
                    onClick={() =>
                      sidebarOpen && setOpenGroup(isOpen ? null : item.label)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition
                    ${
                      isOpen
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {Icon && (
                      <span className="icon-bubble">
                        <Icon />
                      </span>
                    )}

                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                        <FiChevronDown
                          className={`transition ${
                            isOpen ? "rotate-180 text-indigo-600" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  {/* SUBMENU */}
                  <div
                    className={`overflow-hidden transition-all duration-300
                    ${isOpen && sidebarOpen ? "max-h-96" : "max-h-0"}`}
                  >
                    <div className="ml-10 mt-2 space-y-1">
                      {item.children.map((sub, j) => (
                        <NavLink
                          key={j}
                          to={sub.path}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm rounded-lg transition
                            ${
                              isActive
                                ? "bg-indigo-500 text-white"
                                : "text-gray-600 hover:bg-indigo-50"
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

            /* SINGLE LINK */
            return (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition
                  ${
                    isActive
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100"
                  }`
                }
              >
                {Icon && (
                  <span className="icon-bubble">
                    <Icon />
                  </span>
                )}

                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* ICON STYLE */}
      <style>{`
        .icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          color: #4f46e5;
        }
      `}</style>
    </>
  );
}