import React, { useState } from "react";
import { Link } from "react-router-dom";
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
          <span>
            <FaMapMarkerAlt /> Bhubaneswar, Odisha
          </span>
          <span>
            <FaEnvelope />{" "}
            <a href="mailto:info@schoolname.edu.in">
              info@schoolname.edu.in
            </a>
          </span>
        </div>

        <div className="top-right">
          <span>Follow:</span>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaLinkedinIn /></a>
          <a href="#"><FaYoutube /></a>
        </div>
      </div>

      {/* ===== Main Navbar ===== */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img
              src="https://kidsa.vercel.app/_next/static/media/logo.5f815319.svg"
              alt="School Logo"
            />
          </Link>
        </div>

        {/* ===== Desktop Menu ===== */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          {/* About */}
          <li
            className="dropdown"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            About Us <FaChevronDown />
            <div className={`dropdown-menu ${aboutOpen ? "open" : ""}`}>
              <Link to="/about-school" className="dropdown-item">About School</Link>
              <Link to="/principal-message" className="dropdown-item">Principal’s Message</Link>
              <Link to="/vision-mission" className="dropdown-item">Vision & Mission</Link>
              <Link to="/infrastructure" className="dropdown-item">Infrastructure</Link>
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
              <Link to="/academics/pre-primary" className="dropdown-item">Pre-Primary</Link>
              <Link to="/academics/primary" className="dropdown-item">Primary</Link>
              <Link to="/academics/secondary" className="dropdown-item">Secondary</Link>
              <Link to="/academics/calendar" className="dropdown-item">Academic Calendar</Link>
              <Link to="/academics/examination" className="dropdown-item">Examination System</Link>
            </div>
          </li>

          <li><Link to="/admissions">Admissions</Link></li>
          <li><Link to="/student-life">Student Life</Link></li>
          <li><Link to="/notices">Notices</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        {/* ===== Right Actions ===== */}
        <div className="nav-actions">
          <div className="call-box">
            <div className="call-icon">
              <FaPhoneAlt />
            </div>
            <div>
              <p>Call Us</p>
              <strong>
                <a href="tel:8117048317">8117048317</a>
              </strong>
            </div>
          </div>

          <Link to="/admissions" className="visit-btn">
            Apply Admission
          </Link>

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
          <li><Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link></li>
          <li><Link to="/about-school" onClick={() => setDrawerOpen(false)}>About Us</Link></li>
          <li><Link to="/academics/pre-primary" onClick={() => setDrawerOpen(false)}>Academics</Link></li>
          <li><Link to="/admissions" onClick={() => setDrawerOpen(false)}>Admissions</Link></li>
          <li><Link to="/student-life" onClick={() => setDrawerOpen(false)}>Student Life</Link></li>
          <li><Link to="/notices" onClick={() => setDrawerOpen(false)}>Notices</Link></li>
          <li><Link to="/news" onClick={() => setDrawerOpen(false)}>News</Link></li>
          <li><Link to="/contact" onClick={() => setDrawerOpen(false)}>Contact</Link></li>
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
