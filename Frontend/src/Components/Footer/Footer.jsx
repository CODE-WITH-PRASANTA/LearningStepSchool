import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaPaperPlane,
  FaChevronRight,
  FaRegCopyright,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="footer-container">

          {/* Brand */}
          <div className="footer-col brand">
            <img
              src="https://kidsa.vercel.app/_next/static/media/logo.5f815319.svg"
              alt="Kidsa"
              className="footer-logo"
            />

            <p>
              Phasellus ultricies aliquam volutpat ullamcorper laoreet neque.
            </p>

            <div className="socials">
              <span><FaFacebookF /></span>
              <span><FaTwitter /></span>
              <span><FaLinkedinIn /></span>
              <span><FaYoutube /></span>
            </div>

            <button className="contact-btn">
              Contact Us <FaChevronRight />
            </button>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><FaChevronRight /> Our Services</li>
              <li><FaChevronRight /> Our Blogs</li>
              <li><FaChevronRight /> FAQ’s</li>
              <li><FaChevronRight /> Contact Us</li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><FaChevronRight /> Music Learning</li>
              <li><FaChevronRight /> Sports, Games</li>
              <li><FaChevronRight /> Science Class</li>
              <li><FaChevronRight /> Drawing</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col newsletter">
            <h4>Newsletter</h4>
            <p>
              Sign up to searing weekly newsletter to get the latest updates.
            </p>

            <div className="newsletter-box">
              <input type="email" placeholder="Enter Email Address" />
              <button>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Shapes */}
        <div className="footer-shape left"></div>
        <div className="footer-shape right"></div>
      </footer>

      {/* ===== Copyright ===== */}
      <div className="copyright">
        <p>
          <FaRegCopyright /> {new Date().getFullYear()}{" "}
          <span>Kidsa</span>. Made with <FaHeart className="heart" /> All Rights Reserved.
        </p>

        <div className="copyright-links">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
