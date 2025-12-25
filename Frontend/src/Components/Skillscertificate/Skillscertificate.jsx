import React from "react";
import "./SkillsCertificate.css";
import globe from "../../assets/parasuit-2.webp";
import pencil from "../../assets/pencil-3.webp";
import globe2 from "../../assets/parasuit-1.png";
import cloudBg from "../../assets/cta-shape-3.png"; // SHAPE IMAGE
import girl from '../../assets/cta-3.webp'

const SkillsCertificate = () => {
  return (
    <section className="skills-wrapper">
      {/* WAVE */}
      <svg
        className="wave"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C80,90 160,10 240,40 320,70 400,10 480,40 560,70 640,10 720,40 800,70 880,10 960,40 1040,70 1120,10 1200,40 1280,70 1360,20 1440,40 L1440,0 L0,0 Z"
          fill="#ffffff"
        />
      </svg>

      <div className="skills-hero">
        {/* LEFT */}
        <div className="skills-text">
          <div className="quality">
            <span className="bulb">💡</span>
            <span>Get Your Quality</span>
          </div>

          <h1>
            Skills Certificate From The <br />
            <span>Kidsa</span>
          </h1>

          <button className="apply-btn">
            Apply Now <span>→</span>
          </button>

          <span className="icon pencil">
            <img src={pencil} alt="pencil" />
          </span>

          <span className="icon cloud">
            <img src={globe2} alt="cloud" />
          </span>
        </div>

        {/* RIGHT */}
        <div className="skills-image">
          <div
            className="cloud-shape"
            style={{ backgroundImage: `url(${cloudBg})` }}
          >
            <img
              src={girl}
              alt="Kid learning"
            />
          </div>

          <span className="icon balloon">
            <img src={globe} alt="balloon" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default SkillsCertificate;
