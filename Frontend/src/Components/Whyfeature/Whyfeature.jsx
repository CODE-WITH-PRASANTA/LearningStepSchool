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
    title: "Quality Learning for Every Child",
    desc: "At Learning Step International School, we provide a strong academic foundation through interactive and age-appropriate learning. Our approach encourages curiosity, creativity, and confidence in young learners.",
  },
  {
    icon: icon2,
    title: "Safe & Child-Friendly Environment",
    desc: "We offer a warm, engaging, and nurturing environment where children feel comfortable and motivated to learn. Our classrooms are designed to support emotional, social, and creative development.",
  },
  {
    icon: icon3,
    title: "Safety Comes First",
    desc: "Child safety is our top priority. We maintain a secure campus, trained staff supervision, and clear safety protocols to ensure a protected and caring learning space for every child.",
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
            <span className="ckf-subtitle">Why Choose Learning Step International School</span>
            <h2 className="ckf-title">
              Our Core <span>Learning</span> Values
            </h2>
          </div>

          {/* RIGHT PARAGRAPH */}
          <div className="ckf-info">
            <span></span>
            <p>
              Nurturing Young Minds with Care, Learning, and Safety
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
