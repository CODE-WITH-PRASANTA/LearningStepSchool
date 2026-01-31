import { NavLink, useLocation } from "react-router-dom";
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
      { label: "Pre-Primary", path: "/learning/pre" },
      { label: "Primary", path: "/learning/primary" },
      { label: "Secondary", path: "/learning/secondary" },
    ],
  },

  { label: "Testimonials", icon: FiStar, path: "/testimonials" },
  { label: "Admission Data", icon: FiUserPlus, path: "/admissions" },
  { label: "Upcoming Events", icon: FiCalendar, path: "/events" },
];

export default function AppSidebar({
  sidebarOpen,
  mobileOpen,
  setMobileOpen,
}) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "w-72" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="h-16 flex items-center justify-center border-b font-bold">
          {sidebarOpen ? "School Admin" : "SA"}
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map((item, i) => {
            const Icon = item.icon;
            const isActive =
              item.path && location.pathname === item.path;

            if (item.children) {
              const isOpen = openGroup === item.label;

              return (
                <div key={i}>
                  <button
                    onClick={() =>
                      setOpenGroup(isOpen ? null : item.label)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg
                    hover:bg-slate-100 transition
                    ${isOpen ? "bg-slate-100" : ""}`}
                  >
                    <Icon className="text-lg shrink-0" />

                    {sidebarOpen && (
                      <>
                        <span className="text-sm flex-1 text-left">
                          {item.label}
                        </span>
                        <FiChevronDown
                          className={`transition-transform duration-300
                          ${isOpen ? "rotate-180" : ""}`}
                        />
                      </>
                    )}
                  </button>

                  {/* DROPDOWN */}
                  <div
                    className={`overflow-hidden transition-all duration-300
                    ${isOpen && sidebarOpen ? "max-h-40" : "max-h-0"}`}
                  >
                    {item.children.map((sub, j) => (
                      <NavLink
                        key={j}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block pl-11 pr-3 py-2 text-sm rounded-lg transition
                          ${
                            isActive
                              ? "bg-indigo-50 text-indigo-600 font-medium"
                              : "text-slate-600 hover:bg-slate-100"
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
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                <Icon className="text-lg shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
