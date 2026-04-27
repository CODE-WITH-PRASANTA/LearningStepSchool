import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
// import "./Navbar.css";
import API from "../api/axios";
import { IMAGE_URL } from "../api/axios";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://i.pravatar.cc/40");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("teacher"));

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath !== "string") return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/")) return `${IMAGE_URL}${imagePath}`;
    return `${IMAGE_URL}/${imagePath}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/teacher/me");
        const me = res?.data;
        if (me?.image) setAvatarSrc(getImageSrc(me.image));
      } catch (err) {
        // fallback to localStorage (if it ever contains image)
        if (user?.image) setAvatarSrc(getImageSrc(user.image));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="navbar-user">
          <div className="navbar-text">
            <h2 className="navbar-title">Welcome, {user?.name || "User"} 👋</h2>
            <span className="navbar-role">{user?.role || "Teacher"}</span>
          </div>

          {/* <img
            src={user?.avatar || "https://i.pravatar.cc/40"}
            alt="user"
            className="profile-img"
            onClick={() => setOpenProfile(!openProfile)}
          /> */}
        </div>
      </div>

      <div className="navbar-profile">
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
