import React from "react";
import "./HomeAbout.css";

// Assets
import MissionIcon from "../../assets/Mission-icon.svg";
import VisionIcon from "../../assets/Vision-icon.svg";
import authorimg from "../../assets/author.jpeg";
import Bordershape from "../../assets/border-shape.png";
import lefthomeAboutimg from "../../assets/Home-About.webp";
import frame from "../../assets/frame.png";
import lineshape from "../../assets/line-shape.png";

const HomeAbout = () => {
  return (
    <section className="homeabout">
      {/* Decorative line */}
      <img src={lineshape} alt="" className="homeabout-line" />

      <div className="homeabout-container">
        {/* LEFT IMAGE */}
        <div className="homeabout-left">
          <img src={Bordershape} alt="" className="homeabout-border" />

          <div className="homeabout-image-wrap">
            <img src={lefthomeAboutimg} alt="Learning Environment" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="homeabout-right">
          <img src={frame} alt="" className="homeabout-frame" />

          <span className="homeabout-subtitle">About Us</span>

        <h2 className="homeabout-title homeabout-title--colorful">
            Welcome To Learning Step <br />
            <span>International School</span>
          </h2>


          <p className="homeabout-desc">
            Founded in 2019, Learning Step International School provides a
            nurturing and inclusive environment where students grow with
            confidence, creativity, and strong values. We focus on academic
            excellence along with moral, social, and personal development.
          </p>

          {/* FEATURES */}
          <div className="homeabout-features">
            <div className="homeabout-feature">
              <div className="feature-icon">
                <img src={MissionIcon} alt="Mission" />
              </div>
              <div>
                <h4>Our Mission</h4>
                <p>
                  To inspire lifelong learners through quality education,
                  creativity, and global awareness.
                </p>
              </div>
            </div>

            <div className="homeabout-feature">
              <div className="feature-icon">
                <img src={VisionIcon} alt="Vision" />
              </div>
              <div>
                <h4>Our Vision</h4>
                <p>
                  To empower students with knowledge, values, and skills for a
                  successful future.
                </p>
              </div>
            </div>
          </div>

          <hr className="homeabout-divider" />

          {/* AUTHOR */}
          <div className="homeabout-author">
            <div className="author-info">
              <img src={authorimg} alt="Founder" />
              <div>
                <h5>Mr. Vishnu Sharma</h5>
                <span>Founder & Managing Director</span>
              </div>
            </div>

            <a
            href="tel:+917014627894"
            className="author-call"
            aria-label="Call Learning Step International School"
          >
            <div className="call-icon">📞</div>
            <div>
              <span>Call Us Now</span> <br />
              <strong>+91 7014627894</strong>
            </div>
          </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
