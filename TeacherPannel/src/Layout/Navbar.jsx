import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";
import "./Navbar.css";
import API, { IMAGE_URL } from "../api/axios";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://i.pravatar.cc/40");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("teacher"));

  // ✅ SINGLE toggle function
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // 🔹 Image Helper
  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `${IMAGE_URL}${imagePath}`;
    return `${IMAGE_URL}/${imagePath}`;
  };

  // 🔹 Load profile image
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/teacher/me");
        if (res?.data?.image) {
          setAvatarSrc(getImageSrc(res.data.image));
        }
      } catch (err) {
        if (user?.image) {
          setAvatarSrc(getImageSrc(user.image));
        }
      }
    })();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log(err);
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
          src={avatarSrc}
          alt="user"
          className="profile-img"
          onClick={() => setOpenProfile(!openProfile)}
          onError={() => setAvatarSrc("https://i.pravatar.cc/40")}
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
};

export default Navbar;