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
  const [pagesOpen, setPagesOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* ===== Top Info Bar (Desktop Only) ===== */}
      <div className="top-bar">
        <div className="top-left">
          <span><FaMapMarkerAlt /> Nexus Esplanade , Bhubaneswar</span>
          <span><FaEnvelope /> sarojkumarmallik94@gmail.com</span>
        </div>

        <div className="top-right">
          <span>Follow Us:</span>
          <FaFacebookF />
          <FaTwitter />
          <FaLinkedinIn />
          <FaYoutube />
        </div>
      </div>

      {/* ===== Navbar ===== */}
      <nav className="navbar">
        {/* Logo */}
        <div className="logo">
          <img
            src="https://kidsa.vercel.app/_next/static/media/logo.5f815319.svg"
            alt="Kidsa Logo"
          />
        </div>

        {/* ===== Desktop Menu (UNCHANGED) ===== */}
        <ul className="nav-links">
          <li>Home </li>
          <li>About Us</li>
          <li>Programs </li>

          {/* Pages */}
          <li
            className="dropdown"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => {
              setPagesOpen(false);
              setEventOpen(false);
            }}
          >
            Pages <FaChevronDown />

            <div className={`dropdown-menu ${pagesOpen ? "open" : ""}`}>
              <div
                className="dropdown-item has-sub"
                onMouseEnter={() => setEventOpen(true)}
                onMouseLeave={() => setEventOpen(false)}
              >
                Event <FaChevronDown />

                <div className={`sub-menu ${eventOpen ? "open" : ""}`}>
                  <span>Event Grid</span>
                  <span>Event Carousel</span>
                  <span>Event Details</span>
                </div>
              </div>

              <span className="dropdown-item">Teacher</span>
              <span className="dropdown-item">Pricing</span>
              <span className="dropdown-item">FAQ’s</span>
              <span className="dropdown-item">404 Page</span>
            </div>
          </li>

          {/* Blog */}
          <li
            className="dropdown"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
          >
            Blog <FaChevronDown />

            <div className={`dropdown-menu ${blogOpen ? "open" : ""}`}>
              <span className="dropdown-item">Blog Grid</span>
              <span className="dropdown-item">Blog List</span>
              <span className="dropdown-item">Blog Carousel</span>
              <span className="dropdown-item">Blog Details</span>
            </div>
          </li>

          <li>Contact Us</li>
        </ul>

        {/* ===== Right Actions ===== */}
        <div className="nav-actions">
          <div className="call-box">
            <div className="call-icon">
              <FaPhoneAlt />
            </div>
            <div>
              <p>Call Us Now</p>
              <strong>8117048317</strong>
            </div>
          </div>

          <button className="visit-btn">Book A Visit →</button>

          {/* ===== Mobile Hamburger ===== */}
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
            alt="Logo"
          />
          <FaTimes onClick={() => setDrawerOpen(false)} />
        </div>

        <ul className="drawer-menu">
          <li>Home</li>
          <li>About Us</li>
          <li>Programs</li>
          <li>Pages</li>
          <li>Blog</li>
          <li>Contact Us</li>
        </ul>

        <div className="drawer-contact">
          <h4>Contact Info</h4>
          <p><FaMapMarkerAlt /> Main Street, Melbourne, Australia</p>
          <p><FaEnvelope /> info@example.com</p>
          <p>Mon-Friday, 09am - 05pm</p>
          <p><FaPhoneAlt /> 8117048317</p>

          <button className="drawer-btn">Get A Quote →</button>

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
