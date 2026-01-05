import React from "react";
import { HiAcademicCap } from "react-icons/hi2";
import about2 from "../../assets/about-2.webp";
import about3 from "../../assets/about-3.webp";
import "./Studentlifeaboutus.css";

const Studentlifeaboutus = () => {
  return (
    <section className="Studentlifeaboutus-section">
      <div className="Studentlifeaboutus-wrapper">

        {/* LEFT CONTENT */}
        <div className="Studentlifeaboutus-left">
          <span className="Studentlifeaboutus-tag">About Us</span>

          <h2 className="Studentlifeaboutus-title">
            Invest in education <br /> invest in the future
          </h2>

          <p className="Studentlifeaboutus-description">
            Lorem ipsum dolor sit amet consectetur. Amet lectus mi ultricies
            dictum facilisis sem. Imperdiet massa turpis sit proin metus
            volutpat lorem ipsum dolor sit amet consectetur.
          </p>

          <p className="Studentlifeaboutus-description">
            Lorem ipsum dolor sit amet consectetur. Amet lectus mi ultricies
            dictum facilisis sem. Imperdiet massa turpis sit proin metus
            volutpat lorem ipsum dolor sit amet consectetur.
          </p>

          <div className="Studentlifeaboutus-actions">
            <button className="Studentlifeaboutus-btn-primary">
              Read More
            </button>
            <button className="Studentlifeaboutus-btn-outline">
              Contact Us
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="Studentlifeaboutus-right">

          <div className="Studentlifeaboutus-right-left">
            <div className="Studentlifeaboutus-stats-box">
              <HiAcademicCap className="Studentlifeaboutus-stats-icon" />
              <h3>20K+</h3>
              <span>Students</span>
            </div>

            <div className="Studentlifeaboutus-image-small">
              <img src={about2} alt="Child learning" />
            </div>
          </div>

          <div className="Studentlifeaboutus-right-right">
            <div className="Studentlifeaboutus-image-large">
              <img src={about3} alt="Teacher and student" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Studentlifeaboutus;
