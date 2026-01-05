import React, { useEffect, useRef } from "react";
import "./Aboutourvalues.css";

import bgLogo from "../../assets/cta-2.webp";
import bglogobackground from "../../assets/cta-shape-2.png";
import iconShape from "../../assets/frame.png";
import rocketShape from "../../assets/shape-2.webp";

import {
  FaChalkboardTeacher,
  FaBaby,
  FaPaintBrush,
  FaMusic,
} from "react-icons/fa";

const Aboutourvalues = () => {
  const AboutourvaluesCardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("Aboutourvalues-show");
          }
        });
      },
      { threshold: 0.3 }
    );

    AboutourvaluesCardsRef.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="Aboutourvalues-section">
      <div className="Aboutourvalues-decor-left">
        <img src={iconShape} alt="" />
      </div>

      <div className="Aboutourvalues-decor-right">
        <img src={rocketShape} alt="" />
      </div>

      <div className="Aboutourvalues-container">
        <span className="Aboutourvalues-subtitle">Our Values</span>
        <h2 className="Aboutourvalues-title">
          The Best Playschool <br /> For Your Kid
        </h2>

        <div className="Aboutourvalues-grid">
          {/* LEFT */}
          <div className="Aboutourvalues-column">
            <div
              ref={el => (AboutourvaluesCardsRef.current[0] = el)}
              className="Aboutourvalues-card"
            >
              <div className="Aboutourvalues-icon Aboutourvalues-orange">
                <FaChalkboardTeacher />
              </div>
              <div className="Aboutourvalues-content">
                <h4>Teacher Training And Progress</h4>
                <p>
                  Adipiscing elit Praesent luctus laoreet iaculis
                  Curabitur rutrum lectus augue.
                </p>
              </div>
            </div>

            <div
              ref={el => (AboutourvaluesCardsRef.current[1] = el)}
              className="Aboutourvalues-card"
            >
              <div className="Aboutourvalues-icon Aboutourvalues-blue">
                <FaBaby />
              </div>
              <div className="Aboutourvalues-content">
                <h4>Nanny Selection 24/7</h4>
                <p>
                  Adipiscing elit Praesent luctus laoreet iaculis
                  Curabitur rutrum lectus augue.
                </p>
              </div>
            </div>
          </div>

          {/* CENTER */}
          <div className="Aboutourvalues-center">

            <img src={bgLogo} alt="Happy Child" />
            <img src={bglogobackground} alt="" />
          </div>

          {/* RIGHT */}
          <div className="Aboutourvalues-column">
            <div
              ref={el => (AboutourvaluesCardsRef.current[2] = el)}
              className="Aboutourvalues-card Aboutourvalues-card-right"
            >
              <div className="Aboutourvalues-content">
                <h4>Advanced Placement Courses</h4>
                <p>
                  Adipiscing elit Praesent luctus laoreet iaculis
                  Curabitur rutrum lectus augue.
                </p>
              </div>
              <div className="Aboutourvalues-icon Aboutourvalues-cyan">
                <FaPaintBrush />
              </div>
            </div>

            <div
              ref={el => (AboutourvaluesCardsRef.current[3] = el)}
              className="Aboutourvalues-card Aboutourvalues-card-right"
            >
              <div className="Aboutourvalues-content">
                <h4>Self-Contained Gifted Programs</h4>
                <p>
                  Adipiscing elit Praesent luctus laoreet iaculis
                  Curabitur rutrum lectus augue.
                </p>
              </div>
              <div className="Aboutourvalues-icon Aboutourvalues-pink">
                <FaMusic />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboutourvalues;
