// Sidebar.jsx

import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
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
  FiImage,
  // FiBookOpen,
  FiEdit,
  // FiLayers,

  // NEW ADDED ICONS
  FiFileText,
  FiDatabase,
  FiMessageCircle,
  FiCheckSquare,
  FiActivity,
  FiCreditCard,
  FiTrendingUp,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";

/* ================= UPDATED MENU CONFIG ================= */

const menu = [
  {
    label: "Executive Dashboard",
    icon: FiHome,
    path: "/dashboard",
  },

  /* ================= LEAD MANAGEMENT ================= */
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

  /* ================= WEBSITE CMS ================= */
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

  /* ================= ERP ================= */
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

/* ================= COMPONENT ================= */
export default function Sidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("admin");

    navigate("/login");
  };

  /* AUTO OPEN ACTIVE GROUP (ONLY ON FIRST LOAD) */
  useEffect(() => {
    const activeGroup = menu.find(
      (item) =>
        item.children &&
        item.children.some((c) => location.pathname.startsWith(c.path)),
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
        transition-all duration-500 ease-in-out flex flex-col
        ${sidebarOpen ? "w-72" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="h-16 flex items-center justify-center border-b shrink-0">
          <span className="text-xl font-bold text-indigo-600 transition-all duration-300">
            {sidebarOpen ? "School Admin" : "SA"}
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
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
              item.children.some((c) => location.pathname.startsWith(c.path));

            const isOpen = openGroup === item.label;

            /* ================= GROUP MENU ================= */
            if (item.children) {
              return (
                <div key={i}>
                  <button
                    onClick={() =>
                      sidebarOpen && setOpenGroup(isOpen ? null : item.label)
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
                        className={`icon-bubble ${
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
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300
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
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-gray-200 shrink-0 bg-white/60 backdrop-blur">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("isAdmin");
                localStorage.removeItem("admin");
                navigate("/login");
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl 
      text-red-600 hover:bg-red-50 transition-all duration-300"
          >
            <span className=" cursor-pointer icon-bubble text-red-600">
              <FiLogOut />
            </span>

            {sidebarOpen && (
              <span className="cursor-pointer text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}