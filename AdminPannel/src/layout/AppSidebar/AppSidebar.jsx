import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiHome,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiDollarSign,
  FiClipboard,
  FiLayers,
  FiStar,
  FiUserPlus,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

/* ================= MENU CONFIG ================= */

const menu = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },

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

  {
    label: "Learning Management",
    icon: FiLayers,
    children: [
      {
        label: "Pre-Primary",
        path: "/learning/pre",
        color:
          "from-rose-200 to-pink-200 text-rose-800 hover:from-rose-300 hover:to-pink-300",
      },
      {
        label: "Primary",
        path: "/learning/primary",
        color:
          "from-sky-200 to-blue-200 text-sky-800 hover:from-sky-300 hover:to-blue-300",
      },
      {
        label: "Secondary",
        path: "/learning/secondary",
        color:
          "from-emerald-200 to-green-200 text-emerald-800 hover:from-emerald-300 hover:to-green-300",
      },
    ],
  },

  { label: "Testimonials", icon: FiStar, path: "/testimonials" },
  { label: "Admission Data", icon: FiUserPlus, path: "/admissions" },

  /* ✅ ADMISSION SURVEY */
  { label: "Admission Survey", icon: FiClipboard, path: "/survey" },

  { label: "Event Management", icon: FiCalendar, path: "/events" },
];

/* ================= SIDEBAR ================= */

export default function AppSidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen
        bg-gradient-to-b from-indigo-50 via-white to-violet-50
        border-r border-indigo-100
        transition-all duration-300
        ${sidebarOpen ? "w-72" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="h-16 flex items-center justify-center border-b border-indigo-100 font-bold text-indigo-700">
          {sidebarOpen ? "School Admin" : "SA"}
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map((item, i) => {
            const Icon = item.icon;

            if (item.children) {
              const isOpen = openGroup === item.label;

              return (
                <div key={i}>
                  <button
                    onClick={() =>
                      setOpenGroup(isOpen ? null : item.label)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl
                    transition soft-card
                    ${
                      isOpen
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-700 hover:bg-sky-100"
                    }`}
                  >
                    <span className="icon-bubble bg-indigo-200 text-indigo-700">
                      <Icon />
                    </span>

                    {sidebarOpen && (
                      <>
                        <span className="text-sm flex-1 text-left font-medium">
                          {item.label}
                        </span>
                        <FiChevronDown
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>

                  {/* CHILD DROPDOWN */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen && sidebarOpen ? "max-h-48" : "max-h-0"
                    }`}
                  >
                    {item.children.map((sub, j) => (
                      <NavLink
                        key={j}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block pl-12 pr-3 py-2 text-sm rounded-xl transition
                          bg-gradient-to-r ${sub.color}
                          ${
                            isActive
                              ? "ring-2 ring-white"
                              : "opacity-90"
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition soft-card
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-200 to-violet-200 text-indigo-800 font-semibold"
                      : "text-slate-700 hover:bg-sky-100"
                  }`
                }
              >
                <span className="icon-bubble bg-indigo-200 text-indigo-700">
                  <Icon />
                </span>

                {sidebarOpen && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* LOCAL STYLES */}
      <style>
        {`
          .soft-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .soft-card:hover {
            transform: translateY(-1px);
          }
          .icon-bubble {
            width: 34px;
            height: 34px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }
        `}
      </style>
    </>
  );
}
