import React from "react";
import "./SkillsCertificate.css";
import globe from "../../assets/parasuit-2.webp";
import pencil from "../../assets/pencil-3.webp";
import globe2 from "../../assets/parasuit-1.png";
import cloudBg from "../../assets/cta-shape-3.png";
import girl from "../../assets/cta-3.webp";

const SkillsCertificate = () => {
  return (
    <section className="SkillsCertificate-wrapper">
      {/* WAVE */}
      <svg
        className="SkillsCertificate-wave"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C80,90 160,10 240,40 320,70 400,10 480,40 560,70 640,10 720,40 800,70 880,10 960,40 1040,70 1120,10 1200,40 1280,70 1360,20 1440,40 L1440,0 L0,0 Z"
          fill="#ffffff"
        />
      </svg>

      <div className="SkillsCertificate-hero">
        {/* LEFT */}
        <div className="SkillsCertificate-text">
          <div className="SkillsCertificate-quality">
            <span className="SkillsCertificate-bulb">💡</span>
            <span>Get Your Quality</span>
          </div>

          <h1>
            Skills Certificate From The <br />
            <span>Kidsa</span>
          </h1>

          <button className="SkillsCertificate-apply-btn">
            Apply Now <span>→</span>
          </button>

          <span className="SkillsCertificate-icon SkillsCertificate-pencil">
            <img src={pencil} alt="pencil" />
          </span>

          <span className="SkillsCertificate-icon SkillsCertificate-cloud">
            <img src={globe2} alt="cloud" />
          </span>
        </div>

        {/* RIGHT */}
        <div className="SkillsCertificate-image">
          <div
            className="SkillsCertificate-cloud-shape"
            style={{ backgroundImage: `url(${cloudBg})` }}
          >
            <img src={girl} alt="Kid learning" />
          </div>

          <span className="SkillsCertificate-icon SkillsCertificate-balloon">
            <img src={globe} alt="balloon" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default SkillsCertificate;
