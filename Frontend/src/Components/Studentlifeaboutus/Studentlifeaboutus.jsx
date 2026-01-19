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
            At <strong>Learning Step School</strong>, we believe that education is the most powerful
            investment for a brighter future. Our mission is to create a nurturing environment
            where students develop curiosity, confidence, and a lifelong love for learning.
            Through innovative teaching methods and personalized attention, we aim to help every
            child discover their unique potential and grow into responsible, future-ready individuals.
          </p>

          <p className="Studentlifeaboutus-description">
            With a blend of academic excellence, creative exploration, and character development,
            we focus on the holistic growth of each learner. Our dedicated educators inspire students
            to think critically, act compassionately, and lead with integrity—preparing them not just
            for exams, but for life.
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
              <img src={about2} alt="Child learning at Learning Step School" />
            </div>
          </div>

          {/* LARGE IMAGE (HIDDEN ON SMALL DEVICES VIA CSS) */}
          <div className="Studentlifeaboutus-right-right">
            <div className="Studentlifeaboutus-image-large">
              <img src={about3} alt="Teacher guiding a student during class" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Studentlifeaboutus;
