


import React, { useEffect, useRef, useState } from "react";
import "./EXSection.css";

// IMPORT YOUR ASSETS
import mainChild from "../../assets/a-1.webp";
import smallChild from "../../assets/a-2.webp";
import checkIcon from "../../assets/a-3.webp";
import planeIcon from "../../assets/a-4.webp";
import bgPattern from "../../assets/bg-1.webp";

const SchoolFacilities = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`sf-section ${visible ? "sf-show" : ""}`}
      ref={sectionRef}
      style={{ backgroundImage: `url(${bgPattern})` }}
    >
      <div className="sf-container">
        {/* LEFT IMAGE AREA */}
        <div className="sf-images">
          <div className="sf-circle-bg" />

          <img src={mainChild} alt="Main Child" className="sf-main-img" />

          <div className="sf-small-wrapper">
            <img src={smallChild} alt="Small Child" className="sf-small-img" />
            <span className="sf-exp-badge">21+<br /></span>
            <h4 className="sf-exp-text">Years Of <br />Exprience</h4>
              
            
          </div>

          <img src={checkIcon} className="sf-float sf-check" alt="check" />
          <img src={planeIcon} className="sf-float sf-plane" alt="plane" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="sf-content">
          <p className="sf-subtitle">School Facilities</p>

          <h2 className="sf-title">
            <span className="sf-animate">Learning</span>{" "}
            <span className="sf-highlight sf-animate-delay">Opportunity</span> For Kids
          </h2>

          <div className="sf-tabs">
            <button className="sf-tab active">Our History</button>
            <button className="sf-tab">School</button>
            <button className="sf-tab">Kids</button>
          </div>

          <p className="sf-text">
            Pre-school has open door and also offer free trial sessions that child Creative Learning Opportunity For Kids.
          </p>

  <ul className="sf-list">
  <li>Learning Opportunity For Kids</li>
  <li>Your Child Will Take</li>
</ul>





          <button className="sf-btn">Contact Us</button>
        </div>
      </div>
    </section>
  );
};

export default SchoolFacilities;



