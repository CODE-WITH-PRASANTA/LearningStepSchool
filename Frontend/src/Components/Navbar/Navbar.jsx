import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from '../../assets/Logo.png'
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
      {/* ===== Top Bar ===== */}
      <div className="Navbar-top-bar">
        <div className="Navbar-top-left">
          <span><FaMapMarkerAlt /> Bhubaneswar, Odisha</span>
          <span><FaEnvelope /> info@schoolname.edu.in</span>
        </div>

        <div className="Navbar-top-right">
          <span>Follow:</span>
          <FaFacebookF className="Navbar-social-icon" />
          <FaTwitter className="Navbar-social-icon" />
          <FaLinkedinIn className="Navbar-social-icon" />
          <FaYoutube className="Navbar-social-icon" />
        </div>
      </div>

      {/* ===== Navbar ===== */}
      <nav className="Navbar-navbar">
        <div className="Navbar-logo">
          <img
            src={logo}
            alt="School Logo"
          />
        </div>

        <ul className="Navbar-nav-links">
          <li>Home</li>

          <li
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            About Us <FaChevronDown />
            <div className={`Navbar-dropdown-menu ${aboutOpen ? "open" : ""}`}>
              <span className="Navbar-dropdown-item">About School</span>
              <span className="Navbar-dropdown-item">Principal’s Message</span>
              <span className="Navbar-dropdown-item">Vision & Mission</span>
              <span className="Navbar-dropdown-item">Infrastructure</span>
            </div>
          </li>

          <li
            onMouseEnter={() => setAcademicOpen(true)}
            onMouseLeave={() => setAcademicOpen(false)}
          >
            Academics <FaChevronDown />
            <div className={`Navbar-dropdown-menu ${academicOpen ? "open" : ""}`}>
              <span className="Navbar-dropdown-item">Pre-Primary</span>
              <span className="Navbar-dropdown-item">Primary</span>
              <span className="Navbar-dropdown-item">Secondary</span>
              <span className="Navbar-dropdown-item">Academic Calendar</span>
              <span className="Navbar-dropdown-item">Examination System</span>
            </div>
          </li>

          <li><Link to="/admissions">Admissions</Link></li>
          <li><Link to="/student-life">Student Life</Link></li>
          <li><Link to="/notices">Notices</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="Navbar-nav-actions">
          <div className="Navbar-call-box">
            <div className="Navbar-call-icon">
              <FaPhoneAlt />
            </div>
            <div>
              <p>Call Us</p>
              <strong>
                <a href="tel:8117048317">8117048317</a>
              </strong>
            </div>
          </div>

          <button className="Navbar-visit-btn">Apply Admission</button>

          <div
            className="Navbar-hamburger"
            onClick={() => setDrawerOpen(true)}
          >
            <FaBars />
          </div>
        </div>
      </nav>

      {/* ===== Mobile Drawer ===== */}
      <div className={`Navbar-mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="Navbar-drawer-header">
          <img
            src={logo}
            alt="School Logo"
          />
          <FaTimes onClick={() => setDrawerOpen(false)} />
        </div>

        <ul className="Navbar-drawer-menu">
          <li>Home</li>
          <li>About Us</li>
          <li>Academics</li>
          <li>Admissions</li>
          <li>Student Life</li>
          <li>Notices</li>
          <li>News</li>
          <li>Contact</li>
        </ul>

        <div className="Navbar-drawer-contact">
          <p><FaMapMarkerAlt /> Bhubaneswar, Odisha</p>
          <p><FaEnvelope /> info@schoolname.edu.in</p>
          <p><FaPhoneAlt /> 8117048317</p>

          <div className="Navbar-drawer-socials">
            <FaFacebookF />
            <FaTwitter />
            <FaYoutube />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div
          className="Navbar-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
