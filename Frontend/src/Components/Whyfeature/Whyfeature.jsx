import React from "react";
import "./Whyfeature.css";

// IMAGES
import bgImg from "../../assets/why-choose-us-bg.webp";
import planeImg from "../../assets/plane1.webp";

import icon1 from "../../assets/why-choose-us-1.webp";
import icon2 from "../../assets/why-choose-us-2.webp";
import icon3 from "../../assets/why-choose-us-3.webp";

const features = [
  {
    icon: icon1,
    title: "Learning For Kids",
    desc: "Pre-School Is Open Door & Also Free Trial Session.",
  },
  {
    icon: icon2,
    title: "Cute Environment",
    desc: "Pre-School Is Open Door & Also Free Trial Session.",
  },
  {
    icon: icon3,
    title: "Children Safety",
    desc: "Pre-School Is Open Door & Also Free Trial Session.",
  },
];

const CoreKidsFeature = () => {
  return (
    <section
      className="ckf-section"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="ckf-container">
        {/* TOP ROW */}
        <div className="ckf-top">
          {/* LEFT HEADING */}
          <div className="ckf-heading">
            <img src={planeImg} alt="plane" className="ckf-plane" />
            <span className="ckf-subtitle">WHY CHOOSE TODDLY</span>
            <h2 className="ckf-title">
              Our Core <span>Kids</span> Feature
            </h2>
          </div>

          {/* RIGHT PARAGRAPH */}
          <div className="ckf-info">
            <span></span>
            <p>
              Pre-School Has Open Door And Also Offer Free Trial
              Child Creative For Kids Hised
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div className="ckf-card-wrapper">
          {features.map((item, index) => (
            <div className="ckf-card" key={index}>
              <div className="ckf-icon">
                <img src={item.icon} alt={item.title} />
              </div>

              <h3>{item.title}</h3>
              <p>{item.desc}</p>

              <button className="ckf-btn">
                READ MORE <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreKidsFeature;
