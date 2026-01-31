import React, { useState, useEffect } from "react";
import "./VMOppertunity.css";

import learningIcon from "../../assets/vmfeature-icon.webp";
import onlineIcon from "../../assets/vmfeature-icon-2.webp";
import playgroundIcon from "../../assets/vmfeature-icon-3.webp";

import sideBg from "../../assets/vm-side-bg.webp";
import img1 from "../../assets/vm-about-1.webp";

const tabsData = {
  history:
    "With years of experience in early childhood education, Learning Step International School has helped young learners build strong academic and life foundations.",
  school:
    "Our school offers a safe campus, trained educators, and child-friendly classrooms designed for joyful learning.",
  kids:
    "We focus on each child’s growth, helping them develop independence, social skills, and self-confidence.",
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
            <p>Play-based learning that helps children grow, explore, and enjoy early education.</p>
          </div>
        </div>

        <div className="box purple">
          <img src={onlineIcon} alt="Online Class" />
          <div>
            <h4>Online Class</h4>
            <p>Interactive online classes designed to support continuous learning from home.</p>
          </div>
        </div>

        <div className="box orange">
          <img src={playgroundIcon} alt="Own Playground" />
          <div>
            <h4>Own Playground</h4>
            <p>A safe and engaging playground that promotes physical activity and social skills.</p>
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
            Learning <span>Opportunity</span> For Kids <span>at Learning Step International School</span>
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
            <li>✔ Learning Opportunities for Every Child</li>
            <li>✔ Building Confidence Through Early Education</li>
          </ul>

          <button className="contact-btn">CONTACT US</button>
        </div>
      </div>
    </section>
  );
};

export default VMOppertunity;
