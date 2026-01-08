import React, { useState } from "react";
import "./Whylearning.css";

import mainImg from "../../assets/why-2.webp";
import targetIcon from "../../assets/why-1.webp";

const SchoolFacilities = () => {
  const [activeTab, setActiveTab] = useState("");

  return (
    <section className="wl-section">
      <div className="wl-container">
        {/* LEFT IMAGE AREA */}
        <div className="wl-image-wrap">
          {/* blue curved bg */}
          <div className="wl-curve-bg"></div>

          {/* target icon */}
          <img
            src={targetIcon}
            alt="target"
            className="wl-target-icon"
          />

          {/* main image */}
          <div className="wl-main-image">
            <img src={mainImg} alt="kids" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="wl-content">
          <span className="wl-subtitle">SCHOOL FACILITIES</span>

          <h2 className="wl-title">
            Learning <span>Opportunity</span> For Kids
          </h2>

          {/* TABS */}
          <div className="wl-tabs">
            {/* Our History – default orange */}
            <button className="wl-history-btn active">
              Our History
            </button>

            <button
              className={activeTab === "school" ? "active" : ""}
              onClick={() => setActiveTab("school")}
            >
              School
            </button>

            <button
              className={activeTab === "kids" ? "active" : ""}
              onClick={() => setActiveTab("kids")}
            >
              Kids
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "school" && (
            <p className="wl-text">
              Pre-school has open doors and offers free trial sessions that help
              children explore creative learning opportunities in a joyful
              environment.
            </p>
          )}

          {activeTab === "kids" && (
            <p className="wl-text">
              Kids learn best when they feel safe, playful and encouraged to
              express creativity through guided activities.
            </p>
          )}

          {/* Default content */}
          {activeTab === "" && (
            <p className="wl-text">
              Our school has a strong foundation built on care, creativity, and
              child-centered learning to help kids grow with confidence.
            </p>
          )}

          {/* LIST */}
          <ul className="wl-list">
            <li>Learning Opportunity For Kids</li>
            <li>Your Child Will Take Confidence</li>
          </ul>

          <button className="wl-btn">CONTACT US</button>
        </div>
      </div>
    </section>
  );
};

export default SchoolFacilities;
