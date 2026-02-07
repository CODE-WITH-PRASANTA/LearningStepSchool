import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  FiMonitor,
  FiBriefcase,
} from "react-icons/fi";

/* ================= MENU CONFIG ================= */

const menu = [
  { label: "Dashboard", icon: FiHome, path: "/dashboard" },

  {
    label: "Blog Management",
    icon: FiBookOpen,
    children: [
      {
        label: "Blog Posts",
        path: "/blogs",
        color: "from-indigo-200 to-violet-200 text-indigo-800",
      },
      {
        label: "Blog View",
        path: "/blogs/view",
        color: "from-sky-200 to-blue-200 text-sky-800",
      },
    ],
  },

  { label: "Teacher Posting", icon: FiUsers, path: "/teachers" },

  { label: "Award Management", icon: FiAward, path: "/awards" },

  { label: "School Fee & Info", icon: FiDollarSign, path: "/fees" },

  { label: "Notice Management", icon: FiClipboard, path: "/notices" },
  { label: "Class Data Registry", icon: FiClipboard, path: "/class-data" },

  /* ===== NEW ADVERTISEMENT SECTION ===== */

  {
    label: "Advertisement Management",
    icon: FiMonitor,
    path: "/advertisements",
  },

  /* ================================= */

  {
    label: "Learning Management",
    icon: FiLayers,
    children: [
      { label: "Pre-Primary", path: "/learning/pre", color: "from-rose-200 to-pink-200 text-rose-800" },
      { label: "Primary", path: "/learning/primary", color: "from-sky-200 to-blue-200 text-sky-800" },
      { label: "Secondary", path: "/learning/secondary", color: "from-emerald-200 to-green-200 text-emerald-800" },
    ],
  },

  { label: "Testimonials", icon: FiStar, path: "/testimonials" },

  {
    label: "Admission Management",
    icon: FiUserPlus,
    children: [
      { label: "Admission Survey", path: "/survey", color: "from-indigo-200 to-violet-200 text-indigo-800" },
      { label: "Admission Data View", path: "/survey/data", color: "from-emerald-200 to-green-200 text-emerald-800" },
    ],
  },

  { label: "Event Management", icon: FiCalendar, path: "/events" },
  { label: "Faq Posting", icon: FiCalendar, path: "/faq" },

  { type: "divider" },

  {
    label: "Front Office",
    icon: FiBriefcase,
    children: [
      { label: "Admission Enquiry", path: "/front-office/enquiry", color: "from-indigo-200 to-violet-200 text-indigo-800" },
      { label: "Visitors Book", path: "/front-office/visitors", color: "from-sky-200 to-blue-200 text-sky-800" },
      { label: "Postal Dispatch", path: "/front-office/postal-dispatch", color: "from-amber-200 to-yellow-200 text-amber-800" },
      { label: "Postal Receive", path: "/front-office/postal-receive", color: "from-emerald-200 to-green-200 text-emerald-800" },
      { label: "Complain", path: "/front-office/complain", color: "from-rose-200 to-pink-200 text-rose-800" },
      { label: "Setup Front Office", path: "/front-office/setup", color: "from-slate-200 to-gray-200 text-slate-800" },
      { label: "Gate Pass", path: "/front-office/gate-pass", color: "from-cyan-200 to-teal-200 text-cyan-800" },
      { label: "Entrance Examination Form", path: "/front-office/exam-form", color: "from-purple-200 to-fuchsia-200 text-purple-800" },
    ],
  },
  { type: "divider" },
 {
  label: "Attendance",
  icon: FiCalendar,
  children: [
    {
      label: "Student Attendance",
      path: "/attendance/student-attendance",
      color: "from-indigo-200 to-indigo-300 text-indigo-900",
    },
    {
      label: "Student Leave",
      path: "/attendance/student-leave",
      color: "from-amber-200 to-orange-300 text-amber-900",
    },
    {
      label: "Attendance Report",
      path: "/attendance/attendance-report",
      color: "from-emerald-200 to-green-300 text-emerald-900",
    },
  ],
},

    { type: "divider" },
  {
  label: "Income",
  icon: FiBriefcase,
  children: [
    {
      label: "Add Income",
      path: "/income/add-income",
      color: "from-emerald-200 to-green-200 text-emerald-800"
    },
    {
      label: "Search Income",
      path: "/income/search-income",
      color: "from-blue-200 to-sky-200 text-blue-800"
    },
    {
      label: "Income Head",
      path: "/income/income-head",
      color: "from-violet-200 to-purple-200 text-violet-800"
    }
  ]
  },
    { type: "divider" },
{
  label: "Academics",
  icon: FiBookOpen, // you can change icon if needed
  children: [
    {
      label: "Class Time Table",
      path: "/academics/class-time-table",
      color: "from-blue-200 to-indigo-200 text-blue-800"
    },
    {
      label: "Teacher Timetable",
      path: "/academics/teacher-timetable",
      color: "from-purple-200 to-violet-200 text-purple-800"
    },
    {
      label: "Daily Time Table",
      path: "/academics/daily-time-table",
      color: "from-cyan-200 to-sky-200 text-cyan-800"
    },
    {
      label: "Co-Curricular Subject",
      path: "/academics/co-curricular-subject",
      color: "from-pink-200 to-rose-200 text-pink-800"
    },
    {
      label: "Subject",
      path: "/academics/subject",
      color: "from-emerald-200 to-green-200 text-emerald-800"
    },
    {
      label: "Assign Subjects",
      path: "/academics/assign-subjects",
      color: "from-yellow-200 to-amber-200 text-yellow-800"
    },
    {
      label: "Student Subjects",
      path: "/academics/student-subjects",
      color: "from-orange-200 to-red-200 text-orange-800"
    },
    {
      label: "Assign Class Teacher",
      path: "/academics/assign-class-teacher",
      color: "from-teal-200 to-cyan-200 text-teal-800"
    },
    {
      label: "Class",
      path: "/academics/class",
      color: "from-slate-200 to-gray-200 text-slate-800"
    },
    {
      label: "Section",
      path: "/academics/section",
      color: "from-neutral-200 to-zinc-200 text-neutral-800"
    }
  ]
}


];

/* ================= SIDEBAR ================= */

export default function AppSidebar({ sidebarOpen, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);

  // ✅ Auto-open dropdown if child route is active
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
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen
        bg-gradient-to-b from-indigo-50 via-white to-violet-50
        border-r border-indigo-200
        transition-all duration-300
        ${sidebarOpen ? "w-72" : "w-20"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-indigo-200 font-bold text-indigo-700">
          {sidebarOpen ? "School Admin" : "SA"}
        </div>

        {/* MENU */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-3">
          {menu.map((item, i) => {
            if (item.type === "divider") {
              return (
                <div
                  key={i}
                  className="my-6 border-t-2 border-indigo-300"
                />
              );
            }

            const Icon = item.icon;
            const isOpen = openGroup === item.label;

            if (item.children) {
              return (
                <div key={i}>
                  <button
                    onClick={() => sidebarOpen && setOpenGroup(isOpen ? null : item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl
                    ${isOpen ? "bg-indigo-100 text-indigo-700" : "hover:bg-sky-100"}`}
                  >
                    <span className="icon-bubble bg-indigo-200 text-indigo-700">
                      <Icon />
                    </span>

                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left text-sm font-medium">
                          {item.label}
                        </span>
                        <FiChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>

                  {sidebarOpen && isOpen && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.children.map((sub, j) => (
                        <NavLink
                          key={j}
                          to={sub.path}
                          className="block px-4 py-2 text-sm rounded-xl bg-gradient-to-r opacity-90 hover:opacity-100"
                        >
                          {sub.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={i}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sky-100"
              >
                <span className="icon-bubble bg-indigo-200 text-indigo-700">
                  <Icon />
                </span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <style>{`
        .icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}