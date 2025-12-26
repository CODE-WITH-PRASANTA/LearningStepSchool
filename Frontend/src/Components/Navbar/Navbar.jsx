import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from '../../assets/Learning Step Logo.png'
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
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false);


  return (
    <>
      {/* ===== Top Bar ===== */}
      <div className="Navbar-top-bar">
      <div className="Navbar-top-left">
          <span><FaMapMarkerAlt /> Tehla Bypass, Alwar Road, Rajgarh – 301408</span>
          <span><FaEnvelope /> learningstep19@gmail.com</span>
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
          <li><Link to="/">Home</Link></li>

          <li
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            About Us <FaChevronDown />
            <div className={`Navbar-dropdown-menu ${aboutOpen ? "open" : ""}`}>
              <Link to="/about" className="Navbar-dropdown-item">About School</Link>
              <Link to="/ourteacher" className="Navbar-dropdown-item">Our Teachers</Link>
              <Link to="/principal" className="Navbar-dropdown-item">Principal’s Message</Link>
              <Link to="/vision-mission" className="Navbar-dropdown-item">Vision & Mission</Link>
              <Link to="/infrastructure" className="Navbar-dropdown-item">Infrastructure</Link>
            </div>
          </li>

          <li
            onMouseEnter={() => setAcademicOpen(true)}
            onMouseLeave={() => setAcademicOpen(false)}
          >
            Academics <FaChevronDown />
            <div className={`Navbar-dropdown-menu ${academicOpen ? "open" : ""}`}>
              <Link to="/academics/pre-primary" className="Navbar-dropdown-item">Pre-Primary</Link>
              <Link to="/academics/primary" className="Navbar-dropdown-item">Primary</Link>
              <Link to="/academics/secondary" className="Navbar-dropdown-item">Secondary</Link>
              <Link to="/academics/calendar" className="Navbar-dropdown-item">Academic Calendar</Link>
              <Link to="/academics/exams" className="Navbar-dropdown-item">Examination System</Link>
            </div>
          </li>

          <li><Link to="/admissions">Admissions</Link></li>
          <li><Link to="/student-life">Student Life</Link></li>

          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/faq">FAQ</Link></li>

          <li><Link to="/notice">Notice</Link></li>
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
                <a href="tel:7014627894">+91 7014627894</a>
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
        <img src={logo} alt="School Logo" />
        <FaTimes onClick={() => setDrawerOpen(false)} />
      </div>

     <ul className="Navbar-drawer-menu">
        <li><Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link></li>

        {/* ABOUT */}
        <li
          className="Navbar-mobile-item"
          onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
        >
          About Us <FaChevronDown className={mobileAboutOpen ? "rotate" : ""} />
        </li>

      {mobileAboutOpen && (
          <div className="navbar-mobile-submenu">
            <Link
              to="/about"
              className="navbar-mobile-submenu__item"
              onClick={() => setDrawerOpen(false)}
            >
              About School
            </Link>
            <Link
              to="/ourteacher"
              className="navbar-mobile-submenu__item"
              onClick={() => setDrawerOpen(false)}
            >
              Our Teachers
            </Link>

            <Link
              to="/principal"
              className="navbar-mobile-submenu__item"
              onClick={() => setDrawerOpen(false)}
            >
              Principal’s Message
            </Link>

            <Link
              to="/vision-mission"
              className="navbar-mobile-submenu__item"
              onClick={() => setDrawerOpen(false)}
            >
              Vision & Mission
            </Link>

            <Link
              to="/infrastructure"
              className="navbar-mobile-submenu__item"
              onClick={() => setDrawerOpen(false)}
            >
              Infrastructure
            </Link>
          </div>
        )}

        {/* ACADEMICS */}
        <li
          className="Navbar-mobile-item"
          onClick={() => setMobileAcademicOpen(!mobileAcademicOpen)}
        >
          Academics <FaChevronDown className={mobileAcademicOpen ? "rotate" : ""} />
        </li>
          {mobileAcademicOpen && (
            <div className="navbar-mobile-submenu navbar-mobile-submenu--academic">
              <Link
                to="/academics/pre-primary"
                className="navbar-mobile-submenu__item"
                onClick={() => setDrawerOpen(false)}
              >
                Pre-Primary
              </Link>

              <Link
                to="/academics/primary"
                className="navbar-mobile-submenu__item"
                onClick={() => setDrawerOpen(false)}
              >
                Primary
              </Link>

              <Link
                to="/academics/secondary"
                className="navbar-mobile-submenu__item"
                onClick={() => setDrawerOpen(false)}
              >
                Secondary
              </Link>

              <Link
                to="/academics/calendar"
                className="navbar-mobile-submenu__item"
                onClick={() => setDrawerOpen(false)}
              >
                Academic Calendar
              </Link>

              <Link
                to="/academics/exams"
                className="navbar-mobile-submenu__item"
                onClick={() => setDrawerOpen(false)}
              >
                Examination System
              </Link>
            </div>
          )}


        <li><Link to="/admissions" onClick={() => setDrawerOpen(false)}>Admissions</Link></li>
        <li><Link to="/student-life" onClick={() => setDrawerOpen(false)}>Student Life</Link></li>

        <li><Link to="/blog" onClick={() => setDrawerOpen(false)}>Blog</Link></li>
        <li><Link to="/faq" onClick={() => setDrawerOpen(false)}>FAQ</Link></li>

        <li><Link to="/notice" onClick={() => setDrawerOpen(false)}>Notice</Link></li>
        <li><Link to="/contact" onClick={() => setDrawerOpen(false)}>Contact</Link></li>
      </ul>


        <div className="Navbar-drawer-contact">
         <p><FaMapMarkerAlt /> Tehla Bypass, Alwar Road, Rajgarh – 301408</p>
          <p><FaEnvelope /> learningstep19@gmail.com</p>
          <p><FaPhoneAlt /> +91 7014627894</p>


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
