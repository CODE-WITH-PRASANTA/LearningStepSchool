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
        <span className="Aboutourvalues-subtitle">Our Core Values</span>
        <h2 className="Aboutourvalues-title">
         Shaping Strong Foundations   <br />for Lifelong Learning
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
                <h4>Qualified Teachers & Continuous Child Development</h4>
                <p>
                  At Learning Step International School, we understand that a child’s growth depends on the quality of guidance they receive. Our teachers are professionally trained, experienced, and regularly upskilled through workshops and modern teaching programs. Each child’s academic, emotional, and social progress is carefully observed and supported, ensuring individual attention and steady development in a positive learning environment.
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
                <h4>Safe Environment with Trusted Caregivers</h4>
                <p>
                  Your child’s safety and comfort are our highest priorities. We follow a thorough nanny and caregiver selection process that includes background verification, training, and regular evaluations. With round-the-clock supervision, secure premises, and caring staff, we ensure every child feels protected, supported, and at home throughout their time with us.
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
                <h4>Smart Learning for Early Skill Development</h4>
                <p>
                  Our curriculum is designed to build strong academic and life skills from an early age. Through a balanced approach of structured learning and play-based activities, children develop communication skills, problem-solving abilities, creativity, and confidence. We prepare young learners to adapt easily to future academic challenges while enjoying the learning process.
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
                <h4>Encouraging Creativity and Individual Talents</h4>
                <p>
                  Every child has unique abilities, and we focus on nurturing them through creative and gifted programs. Activities such as music, art, storytelling, movement, and hands-on learning help children express themselves freely. These programs strengthen emotional intelligence, social interaction, and independent thinking, laying the foundation for confident and well-rounded personalities.
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
