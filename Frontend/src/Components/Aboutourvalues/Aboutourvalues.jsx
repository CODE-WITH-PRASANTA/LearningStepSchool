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
         The Best Playschool for  <br />Your School
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
                <h4>Teacher Training & Child Progress</h4>
                <p>
                 At Learning Step International School, we strongly believe that great learning begins with great teachers. Our educators undergo continuous professional training to stay updated with modern teaching methods and child psychology. Every child’s progress is closely monitored, ensuring personalized attention, emotional well-being, and steady academic growth in a safe and nurturing environment.
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
                <h4>Nanny Selection & Child Safety (24/7)</h4>
                <p>
                 Child safety is our top priority. We follow a strict and transparent nanny selection process, including background verification and regular performance evaluation. Our trained caregivers provide round-the-clock supervision, ensuring that children feel secure, cared for, and comfortable throughout the day—just like a second home.
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
                <h4>Advanced Learning & Skill Placement</h4>
                <p>
                 We focus on building strong foundations through age-appropriate learning activities. Our advanced placement programs encourage early development of cognitive, communication, and creative skills. By combining play-based learning with structured education, we help children develop confidence, curiosity, and readiness for future academic success.
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
                <h4>Self-Contained Gifted & Creative Programs</h4>
                <p>
                  Every child is unique, and we celebrate individuality through our self-contained gifted programs. These programs include music, art, storytelling, movement, and interactive play that support creativity and emotional expression. Our curriculum helps children discover their talents while developing social skills and independent thinking.
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
