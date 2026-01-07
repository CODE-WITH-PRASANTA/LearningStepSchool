import React, { useState, useEffect } from "react";
import "./VMOppertunity.css";

import learningIcon from "../../assets/vmfeature-icon.webp";
import onlineIcon from "../../assets/vmfeature-icon-2.webp";
import playgroundIcon from "../../assets/vmfeature-icon-3.webp";

import sideBg from "../../assets/vm-side-bg.webp";
import img1 from "../../assets/vm-about-1.webp";

const tabsData = {
  history:
    "Our pre-school has a strong history of nurturing young minds with creativity and care.",
  school:
    "We provide modern infrastructure, safe environment, and experienced teachers.",
  kids:
    "Kids enjoy interactive learning, creative play, and joyful activities every day.",
};

const VMOppertunity = () => {
  const [activeTab, setActiveTab] = useState("history");

  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach(el => observer.observe(el));
  }, []);

  return (
    <section className="school-section">
      <img src={sideBg} alt="" className="side-bg" />

      {/* TOP FEATURE BOXES */}
      <div className="info-boxes reveal">
        <div className="box green">
          <img src={learningIcon} alt="Learning & Fun" />
          <div>
            <h4>Learning & Fun</h4>
            <p>Pre-school has open doors free session child.</p>
          </div>
        </div>

        <div className="box purple">
          <img src={onlineIcon} alt="Online Class" />
          <div>
            <h4>Online Class</h4>
            <p>Pre-school has open doors free session child.</p>
          </div>
        </div>

        <div className="box orange">
          <img src={playgroundIcon} alt="Own Playground" />
          <div>
            <h4>Own Playground</h4>
            <p>Pre-school has open doors free session child.</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="content-wrapper reveal">
        {/* IMAGE */}
        <div className="image-grid">
          <img src={img1} alt="Kids" />

          
        </div>

        {/* TEXT */}
        <div className="text-content">
          <span className="small-title animate">School Facilities</span>

          <h2 className="main-heading animate">
            Learning <span>Opportunity</span> For Kids
          </h2>

          {/* TABS */}
          <div className="tabs">
            {["history", "school", "kids"].map(tab => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "history"
                  ? "Our History"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <p className="tab-content">{tabsData[activeTab]}</p>

          <ul>
            <li>✔ Training Opportunity For Kids</li>
            <li>✔ Your Child Will Take Confidence</li>
          </ul>

          <button className="contact-btn">CONTACT US</button>
        </div>
      </div>
    </section>
  );
};

export default VMOppertunity;
