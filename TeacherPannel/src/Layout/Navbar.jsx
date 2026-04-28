import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";
import API from "../api/axios";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("teacher"));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout error:", err);
    }

    localStorage.clear();
    navigate("/login");
  };

  const handleGoToProfile = () => {
    navigate("/admin/profile");
    setOpenProfile(false);
  };

  const handleGoToSettings = () => {
    navigate("/admin/settings");
    setOpenProfile(false);
  };

  return (
    <header className="admin-navbar">
      
      {/* LEFT */}
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="navbar-heading">
          <h2>
            Welcome, <span>{user?.name || "User"}</span> 👋
          </h2>
          <p>{user?.role || "Teacher"}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        <img
          src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
          alt="profile"
          className="profile-img"
          onClick={() => setOpenProfile(!openProfile)}
        />

        {openProfile && (
          <div className="profile-dropdown">
            <button className="dropdown-item" onClick={handleGoToProfile}>
              <FaUser />
              <span>Profile</span>
            </button>

            <button className="dropdown-item" onClick={handleGoToSettings}>
              <FaCog />
              <span>Settings</span>
            </button>

            <button className="dropdown-item logout-item" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}