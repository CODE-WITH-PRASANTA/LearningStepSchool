import React from "react";
import "./Studentlifeherosection.css";
import kite from "../../assets/kite.webp";
import rightImg from "../../assets/banner-v2-thumb.webp";

const Studentlifeherosection = () => {
  return (
    <section className="Studentlifeherosection">
      <div className="Studentlifeherosection-container">

        {/* LEFT CONTENT */}
        <div className="Studentlifeherosection-left">
          <img
            src={kite}
            alt="decorative kite"
            className="Studentlifeherosection-kite"
          />

          <h1 className="Studentlifeherosection-title">
            Building a <br />
            Better <span>Future</span> <br />
            Through Learning
          </h1>

          <p className="Studentlifeherosection-text">
            Empowering young minds with creativity, curiosity, and confidence.
            Our student life programs focus on holistic development and joyful learning.
          </p>

          <div className="Studentlifeherosection-actions">
            <button className="Studentlifeherosection-btn primary">
              Read More
            </button>
            <button className="Studentlifeherosection-btn secondary">
              Explore Programs
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="Studentlifeherosection-right">
          <img
            src={rightImg}
            alt="student life"
            className="Studentlifeherosection-image"
          />
        </div>

      </div>
    </section>
  );
};

export default Studentlifeherosection;
