import React from "react";
import "./Whyguide.css";

// IMAGES
import bgImg from "../../assets/bg5.webp";
import kidsImg from "../../assets/kids.webp";

import icon1 from "../../assets/home.webp";
import icon2 from "../../assets/tea.webp";
import icon3 from "../../assets/mic.webp";
import icon4 from "../../assets/bag.webp";

const GuideSection = () => {
  return (
    <section
      className="guide-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="guide-container">

        {/* HEADING */}
        <div className="guide-heading">
          <span className="guide-subtitle">WHAT WE PROVIDE</span>
          <h2 className="guide-title">We Are Here To Guide</h2>
        </div>

        <div className="guide-content">

          {/* LEFT FEATURES */}
          <div className="guide-features">
            <Feature
              icon={icon1}
              title="Kids Club & Gaming"
              text="Pre-School Has Open Door & Also Offer Free Trial Sessions."
            />
            <Feature
              icon={icon2}
              title="Kids Club & Gaming"
              text="Pre-School Has Open Door & Also Offer Free Trial Sessions."
            />
          </div>

          {/* CENTER IMAGE */}
          <div className="guide-center">
            <div className="guide-circle">
              <span>A+ RESULTS</span>
              <h3>100%</h3>
            </div>
            <img src={kidsImg} alt="kids" />
          </div>

          {/* RIGHT FEATURES */}
          <div className="guide-features">
            <Feature
              icon={icon3}
              title="Kids Club & Gaming"
              text="Pre-School Has Open Door & Also Offer Free Trial Sessions."
            />
            <Feature
              icon={icon4}
              title="Kids Club & Gaming"
              text="Pre-School Has Open Door & Also Offer Free Trial Sessions."
            />
          </div>

        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, text }) => (
  <div className="guide-feature">
    <div className="guide-icon">
      <img src={icon} alt={title} />
    </div>
    <div>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  </div>
);

export default GuideSection;
