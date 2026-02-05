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
      { label: "Blog Posts", path: "/blogs", color: "from-indigo-200 to-violet-200 text-indigo-800" },
      { label: "Blog View", path: "/blogs/view", color: "from-sky-200 to-blue-200 text-sky-800" },
    ],
  },

  { label: "Teacher Posting", icon: FiUsers, path: "/teachers" },
  { label: "Award Management", icon: FiAward, path: "/awards" },
  { label: "School Fee & Info", icon: FiDollarSign, path: "/fees" },
  { label: "Notice Management", icon: FiClipboard, path: "/notices" },
  { label: "Class Wise Data Management", icon: FiClipboard, path: "/class-data" },

  {
    label: "Learning Management",
    icon: FiLayers,
    children: [
      {
        label: "Pre-Primary",
        path: "/learning/pre",
        color: "from-rose-200 to-pink-200 text-rose-800",
      },
      {
        label: "Primary",
        path: "/learning/primary",
        color: "from-sky-200 to-blue-200 text-sky-800",
      },
      {
        label: "Secondary",
        path: "/learning/secondary",
        color: "from-emerald-200 to-green-200 text-emerald-800",
      },
    ],
  },

  { label: "Testimonials", icon: FiStar, path: "/testimonials" },

  {
    label: "Admission Management",
    icon: FiUserPlus,
    children: [
      {
        label: "Admission Survey",
        path: "/survey",
        color: "from-indigo-200 to-violet-200 text-indigo-800",
      },
      {
        label: "Admission Data View",
        path: "/survey/data",
        color: "from-emerald-200 to-green-200 text-emerald-800",
      },
    ],
  },

  { label: "Event Management", icon: FiCalendar, path: "/events" },
  { label: "Faq Posting", icon: FiCalendar, path: "/faq" },
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
        <div className="h-16 flex items-center justify-center border-b border-indigo-100 font-bold text-indigo-700 tracking-wide">
          {sidebarOpen ? "School Admin" : "SA"}
        </div>

        {/* MENU */}
         <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-3">
          {menu.map((item, i) => {
            const Icon = item.icon;
            const isOpen = openGroup === item.label;

            /* ---------- DROPDOWN ---------- */
            if (item.children) {
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl
                    transition-all duration-200 soft-card
                    ${
                      isOpen
                        ? "bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 shadow-sm"
                        : "text-slate-700 hover:bg-sky-100"
                    }`}
                  >
                    <span className="icon-bubble bg-indigo-200 text-indigo-700">
                      <Icon />
                    </span>

                    {sidebarOpen && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">
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

                  {/* SUB MENU */}
                  <div
                    className={`ml-4 mt-2 space-y-1 overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${
                      isOpen && sidebarOpen
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                    }`}
                  >
                    {item.children.map((sub, j) => (
                      <NavLink
                        key={j}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm rounded-xl transition-all duration-200
                          bg-gradient-to-r ${sub.color}
                          ${
                            isActive
                              ? "ring-2 ring-white shadow-md scale-[1.02]"
                              : "opacity-90 hover:opacity-100 hover:scale-[1.02]"
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

            /* ---------- NORMAL LINK ---------- */
            return (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 soft-card
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-200 to-violet-200 text-indigo-800 font-semibold shadow-sm"
                      : "text-slate-700 hover:bg-sky-100"
                  }`
                }
              >
                <span className="icon-bubble bg-indigo-200 text-indigo-700">
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

      {/* EXTRA POLISH */}
      <style>
        {`
          .soft-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }
          .soft-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 14px rgba(0,0,0,0.06);
          }

          .icon-bubble {
            width: 36px;
            height: 36px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: transform 0.3s ease;
          }

          nav a:hover .icon-bubble,
          nav button:hover .icon-bubble {
            transform: scale(1.08);
          }

          nav::-webkit-scrollbar {
            width: 6px;
          }
          nav::-webkit-scrollbar-thumb {
            background: #c7d2fe;
            border-radius: 10px;
          }
        `}
      </style>
    </>
  );
}
