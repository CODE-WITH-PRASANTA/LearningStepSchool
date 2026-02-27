import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaChevronRight,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

// Assets
import ZebraImg from "../../assets/zebra-01.webp";
import FooterTopImg from "../../assets/footer-top.webp";
import FrameImg from "../../assets/frame-01.webp";

const Footer = () => {
  return (
    <>
    {/* ================= Footer Top ================= */}
              
          <section className="Footer-sec-top">
            <img src={FooterTopImg} alt="" className="Footer-sec-top-bg" />

            <div className="Footer-sec-top-container">

              {/* Call */}
              <div className="Footer-sec-top-item">
                <span className="Footer-sec-top-icon">
                  <FaPhoneAlt />
                </span>
                <p>Call Us Anytime</p>
                <h4>
                  <a
                    href="tel:+917014627894"
                    className="Footer-sec-link"
                  >
                    +91 70146 27894
                  </a>
                </h4>
              </div>

              {/* Email */}
              <div className="Footer-sec-top-item">
                <span className="Footer-sec-top-icon">
                  <FaEnvelope />
                </span>
                <p>Email Us</p>
                <h4>
                  <a
                    href="mailto:learningstep19@gmail.com"
                    className="Footer-sec-link"
                  >
                    learningstep19@gmail.com
                  </a>
                </h4>
              </div>

              {/* Address */}
              <div className="Footer-sec-top-item">
                <span className="Footer-sec-top-icon">
                  <FaMapMarkerAlt />
                </span>
                <p>School Campus</p>
                <h4>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Tehla+Bypass+Alwar+Road+Rajgarh+301408+Rajasthan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="Footer-sec-link"
                  >
                    Tehla Bypass, Alwar Road, Rajgarh – 301408, Rajasthan
                  </a>
                </h4>
              </div>

            </div>
          </section>


      {/* ================= Footer Main ================= */}
      <footer className="Footer-sec-main">
        <img src={ZebraImg} alt="" className="Footer-sec-zebra" />
        <img src={FrameImg} alt="" className="Footer-sec-frame" />

        <div className="Footer-sec-container">
          {/* School Info */}
          <div className="Footer-sec-col Footer-sec-brand">
            <h2 className="Footer-sec-school-name">
              Learning Step International School
            </h2>

            <p className="Footer-sec-desc">
              Learning Step International School is committed to nurturing young
              minds through quality education, innovative teaching methods, and
              holistic student development in a safe and inspiring environment.
            </p>

            <div className="Footer-sec-socials">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="Footer-sec-col">
            <h4 className="Footer-sec-title">Quick Links</h4>
            <ul className="Footer-sec-list">
              <li><FaChevronRight /> About School</li>
              <li><FaChevronRight /> Admissions</li>
              <li><FaChevronRight /> Academics</li>
              <li><FaChevronRight /> Contact Us</li>
            </ul>
          </div>

          {/* Academics */}
          <div className="Footer-sec-col">
            <h4 className="Footer-sec-title">Academics</h4>
            <ul className="Footer-sec-list">
              <li><FaChevronRight /> Pre-Primary</li>
              <li><FaChevronRight /> Primary School</li>
              <li><FaChevronRight /> Middle School</li>
              <li><FaChevronRight /> Co-Curricular</li>
            </ul>
          </div>

          {/* Updates */}
          <div className="Footer-sec-col Footer-sec-posts">
            <h4 className="Footer-sec-title">Latest Updates</h4>

            <div className="Footer-sec-post">
              <div>
                <span>March 2025</span>
                <p>Admissions Open for Academic Year 2025–26</p>
              </div>
            </div>

            <div className="Footer-sec-post">
              <div>
                <span>February 2025</span>
                <p>Annual Sports Day & Cultural Program Highlights</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= Footer Bottom ================= */}
      <div className="Footer-sec-bottom">
      <p>
          © {new Date().getFullYear()}{" "}
          <span>Learning Step International School</span>. Made with{" "}
          <FaHeart className="Footer-sec-heart" /> for Education | Developed by{" "}
          <a
            href="https://prwebstock.com"
            target="_blank"
            rel="noopener noreferrer"
            className="Footer-sec-dev"
          >
            PR WEBSTOCK
          </a>
        </p>


       <div className="Footer-sec-bottom-links">
            <span>
              <a href="/privacy">Privacy Policy</a>
            </span>

            <span>
              <a href="/terms">Terms & Condition</a>
            </span>
          </div>
      </div>
    </>
  );
};

export default Footer;
