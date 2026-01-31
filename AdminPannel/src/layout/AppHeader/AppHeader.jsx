import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

export default function AppHeader({
  sidebarOpen,
  setSidebarOpen,
  setMobileOpen,
}) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() =>
            window.innerWidth >= 1024
              ? setSidebarOpen(!sidebarOpen)
              : setMobileOpen(true)
          }
          className="text-xl text-slate-700"
        >
          <FiMenu />
        </button>

        <span className="hidden sm:block text-sm text-slate-500">
          School Management System
        </span>
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96">
        <FiSearch className="text-slate-400" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none ml-2 text-sm w-full"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <button className="relative">
          <FiBell className="text-xl text-slate-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            className="w-9 h-9 rounded-full"
          />
          <span className="hidden sm:block text-sm font-medium">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
