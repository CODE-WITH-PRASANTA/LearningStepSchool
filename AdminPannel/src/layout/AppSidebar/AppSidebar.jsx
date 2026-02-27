// Sidebar.jsx

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
  FiLayers,
  FiMonitor,
  FiStar,
  FiUserPlus,

  // NEW ADDED ICONS
  FiFileText,
  FiDatabase,
  FiMessageCircle,
  FiCheckSquare,
  FiActivity,
  FiCreditCard,
  FiTrendingUp,
  FiMessageSquare
} from "react-icons/fi";

/* ================= UPDATED MENU CONFIG ================= */

const menu = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },

  { type: "section", label: "Enquiry Section" },
  {
    label: "Cold Leads",
    icon: FiUserPlus,
    path: "/admin/coldleads",
  },

  { type: "section", label: "Contact Enquiry" },

  {
  label: "Contact Enquiries",
  icon: FiMessageSquare,   
  path: "/admin/contact-enq",
},

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
  { label: "Latest News Management", icon: FiFileText, path: "/latest-news" },
  { label: "Class Data Registry", icon: FiDatabase, path: "/class-data" },

  {
    label: "Media Management",
    icon: FiMonitor,
    children: [
      { label: "Photo Gallery Managements", path: "/media-photo" },
      { label: "Video Gallery Managements", path: "/media-video" },
    ],
  },

  {
    label: "Learning Management",
    icon: FiLayers,
    children: [
      { label: "Pre-Primary", path: "/learning/pre" },
      { label: "Primary", path: "/learning/primary" },
      { label: "Secondary", path: "/learning/secondary" },
    ],
  },

  { label: "Testimonials", icon: FiStar, path: "/testimonials" },

  {
    label: "Admission Management",
    icon: FiUsers,
    children: [
      { label: "Admission Survey", path: "/survey" },
      { label: "Admission Data View", path: "/survey/data" },
    ],
  },

  { label: "Event Management", icon: FiCalendar, path: "/events" },
  { label: "Faq Posting", icon: FiMessageCircle, path: "/faq" },

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
    icon: FiCheckSquare,
    children: [
      { label: "Student Attendance", path: "/attendance/student-attendance" },
      { label: "Student Leave", path: "/attendance/student-leave" },
      { label: "Attendance Report", path: "/attendance/attendance-report" },
    ],
  },

  {
    label: "Primary Evaluation",
    icon: FiActivity,
    children: [
      { label: "Activity", path: "/primary-evaluation/activity" },
      { label: "Assessment", path: "/primary-evaluation/assessment" },
      {
        label: "Evaluation Remark",
        path: "/primary-evaluation/evaluation-remark",
      },
      {
        label: "Primary Class Report",
        path: "/primary-evaluation/class-report",
      },
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

  { type: "divider" },

  {
    label: "Online Exam",
    icon: FiMonitor,
    children: [
      { label: "Online Exam", path: "/online-exam" },
      { label: "Question Bank", path: "/online-exam/question-bank" },
      { label: "Exam Report", path: "/online-exam/exam-report" },
      {
        label: "Students Exam Report",
        path: "/online-exam/students-exam-report",
      },
    ],
  },

  { type: "divider" },

  {
    label: "Student Info",
    icon: FiUsers,
    children: [
      { label: "Student Admission", path: "/student/admission" },
      { label: "Online Admission", path: "/online/admission" },
      { label: "Student Details", path: "/student/details" },
      { label: "Student Catagory", path: "/student/catagory"},
      { label: "House", path: "/house"},
      { label: "Student Referral", path: "/student/referral"},
      { label: "Inactive Students", path: "/inactive/student"},
      { label: "Link Siblings", path: "/link/siblings"},
      { label: "Student Update", path: "/student/update"},
      { label: "Student Report", path: "/student/report"},


    ],
  },

  { type: "divider" },

  {
    label: "Expense",
    icon: FiCreditCard,
    children: [
      { label: "Add Expense", path: "/expense/details" },
      { label: "Expense Search", path: "/expense-search" },
      { label: "Expense Head", path: "/expense-head" },
    ],
  },

  { type: "divider" },

  {
    label: "Income",
    icon: FiTrendingUp,
    children: [
      { label: "Add Income", path: "/income/details" },
      { label: "Search Income", path: "/income-search" },
      { label: "Income Head", path: "/income-head" },
    ],
  },
];

/* ================= COMPONENT ================= */
export default function Sidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  /* AUTO OPEN ACTIVE GROUP (ONLY ON FIRST LOAD) */
  useEffect(() => {
    const activeGroup = menu.find(
      (item) =>
        item.children &&
        item.children.some((c) =>
          location.pathname.startsWith(c.path)
        )
    );

    if (activeGroup) {
      setOpenGroup(activeGroup.label);
    }
  }, [location.pathname]);

  return (
    <>
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
          <span className="text-xl font-bold text-indigo-600 transition-all duration-300">
            {sidebarOpen ? "School Admin" : "SA"}
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-2">
          {menu.map((item, i) => {
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

            if (item.type === "divider") {
              return <div key={i} className="my-4 border-t border-gray-200" />;
            }

            const Icon = item.icon || null;

            const isChildActive =
              item.children &&
              item.children.some((c) =>
                location.pathname.startsWith(c.path)
              );

            // 👇 ONLY manual open controls dropdown
            const isOpen = openGroup === item.label;

            /* ================= GROUP MENU ================= */
            if (item.children) {
              return (
                <div key={i}>
                  <button
                    onClick={() =>
                      sidebarOpen &&
                      setOpenGroup(isOpen ? null : item.label)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300
                    ${
                      isChildActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : isOpen
                        ? "bg-indigo-100 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {Icon && (
                      <span
                        className={`icon-bubble transition-all duration-300
                        ${
                          isChildActive
                            ? "text-indigo-600 bg-white shadow-sm"
                            : "text-indigo-600"
                        }`}
                      >
                        <Icon />
                      </span>
                    )}

                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>

                        <FiChevronDown
                          className={`transition-all duration-300 ${
                            isOpen
                              ? isChildActive
                                ? "rotate-180 text-white"
                                : "rotate-180 text-indigo-600"
                              : "text-gray-400"
                          }`}
                        />
                      </>
                    )}
                  </button>

                  <div
                    className={`grid transition-all duration-500 ${
                      isOpen && sidebarOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-10 mt-2 space-y-1 pb-2">
                        {item.children.map((sub, j) => (
                          <NavLink
                            key={j}
                            to={sub.path}
                            className={({ isActive }) =>
                              `block px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                                isActive
                                  ? "bg-indigo-500 text-white shadow-md"
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
                </div>
              );
            }

            /* ================= SINGLE LINK ================= */
            return (
              <NavLink key={i} to={item.path}>
                {({ isActive }) => (
                  <div
                    className={`nav-item flex items-center gap-3 px-3 py-3 rounded-2xl 
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                        : "hover:bg-indigo-50"
                    }`}
                  >
                    {Icon && (
                      <span
                        className={`icon-bubble ${
                          isActive
                            ? "text-indigo-600 bg-white/20"
                            : "text-indigo-600"
                        }`}
                      >
                        <Icon />
                      </span>
                    )}

                    {sidebarOpen && (
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
