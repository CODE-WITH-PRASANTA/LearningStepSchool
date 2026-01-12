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
          <h2 className="guide-title">We Are Here To Guide Every Child at Learning Step International School</h2>
        </div>

        <div className="guide-content">

          {/* LEFT FEATURES */}
          <div className="guide-features">
            <Feature
              icon={icon1}
              title="Creative Play & Activity Learning"
              text="Activity-based learning that supports early childhood development and curiosity."
            />
            <Feature
              icon={icon2}
              title="Healthy Meals & Daily Care"
              text="Balanced daily care and hygienic food practices for healthy child growth."
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
              title="Music, Art & Expression"
              text="Creative activities that build confidence, communication, and self-expression."
            />
            <Feature
              icon={icon4}
              title="Safe & Supportive Environment"
              text="A secure, child-friendly school environment focused on learning and well-being."
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
