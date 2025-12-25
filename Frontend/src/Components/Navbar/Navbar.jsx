import React, { useState } from "react";
import "./Navbar.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [academicOpen, setAcademicOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ===== Top Info Bar ===== */}
      <div className="top-bar">
        <div className="top-left">
          <span><FaMapMarkerAlt /> Bhubaneswar, Odisha</span>
          <span><FaEnvelope /> info@schoolname.edu.in</span>
        </div>

        <div className="top-right">
          <span>Follow:</span>
          <FaFacebookF />
          <FaTwitter />
          <FaLinkedinIn />
          <FaYoutube />
        </div>
      </div>

      {/* ===== Main Navbar ===== */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <img
            src="https://kidsa.vercel.app/_next/static/media/logo.5f815319.svg"
            alt="School Logo"
          />
        </div>

        {/* ===== Desktop Menu ===== */}
        <ul className="nav-links">

          <li>Home</li>

          {/* About */}
          <li
            className="dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            About Us <FaChevronDown />
            <div className={`dropdown-menu ${aboutOpen ? "open" : ""}`}>
              <span className="dropdown-item">About School</span>
              <span className="dropdown-item">Principal’s Message</span>
              <span className="dropdown-item">Vision & Mission</span>
              <span className="dropdown-item">Infrastructure</span>
            </div>
          </li>

          {/* Academics */}
          <li
            className="dropdown"
            onMouseEnter={() => setAcademicOpen(true)}
            onMouseLeave={() => setAcademicOpen(false)}
          >
            Academics <FaChevronDown />
            <div className={`dropdown-menu ${academicOpen ? "open" : ""}`}>
              <span className="dropdown-item">Pre-Primary</span>
              <span className="dropdown-item">Primary</span>
              <span className="dropdown-item">Secondary</span>
              <span className="dropdown-item">Academic Calendar</span>
              <span className="dropdown-item">Examination System</span>
            </div>
          </li>

          <li>Admissions</li>
          <li>Student Life</li>
          <li>Notices</li>
          <li>News</li>
          <li>Contact</li>
        </ul>

        {/* ===== Right Actions ===== */}
        <div className="nav-actions">
          <div className="call-box">
            <div className="call-icon">
              <FaPhoneAlt />
            </div>
            <div>
              <p>Call Us</p>
              <strong>8117048317</strong>
            </div>
          </div>

          <button className="visit-btn">Apply Admission</button>

          {/* Mobile Hamburger */}
          <div className="hamburger" onClick={() => setDrawerOpen(true)}>
            <FaBars />
          </div>
        </div>
      </nav>

      {/* ===== Mobile Drawer ===== */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <img
            src="https://kidsa.vercel.app/_next/static/media/logo.5f815319.svg"
            alt="School Logo"
          />
          <FaTimes onClick={() => setDrawerOpen(false)} />
        </div>

        <ul className="drawer-menu">
          <li>Home</li>
          <li>About Us</li>
          <li>Academics</li>
          <li>Admissions</li>
          <li>Student Life</li>
          <li>Notices</li>
          <li>News</li>
          <li>Contact</li>
          <li className="drawer-login">Login</li>
        </ul>

        <div className="drawer-contact">
          <p><FaMapMarkerAlt /> Bhubaneswar, Odisha</p>
          <p><FaEnvelope /> info@schoolname.edu.in</p>
          <p><FaPhoneAlt /> 8117048317</p>

          <div className="drawer-socials">
            <FaFacebookF />
            <FaTwitter />
            <FaYoutube />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="overlay" onClick={() => setDrawerOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
