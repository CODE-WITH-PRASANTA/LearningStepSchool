import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
// import "./Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    alert("Logout Clicked");
    setOpenProfile(false);
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
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <h2 className="navbar-title">Admin Dashboard</h2>
      </div>

      <div className="navbar-profile">
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="profile-img"
          onClick={() => setOpenProfile(!openProfile)}
        />

        {openProfile && (
          <div className="profile-dropdown">
            <button className="dropdown-item" onClick={handleGoToProfile}>
              <FaUser /> Profile
            </button>

            <button className="dropdown-item" onClick={handleGoToSettings}>
              <FaCog /> Settings
            </button>

            <button onClick={handleLogout} className="dropdown-item logout">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}