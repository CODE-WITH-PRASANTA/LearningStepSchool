import React, { useEffect, useRef } from "react";
import "./Aboutuscounter.css";
import lineshape from "../../assets/line-shape.webp";

import {
  FaUserTie,
  FaStar,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";

const Aboutuscounter = () => {
  const AboutuscounterItemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("Aboutuscounter-show");
          }
        });
      },
      { threshold: 0.4 }
    );

    AboutuscounterItemsRef.current.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="Aboutuscounter-section">
      {/* LEFT DECORATIVE LINE IMAGE */}
      <div className="Aboutuscounter-line">
        <img src={lineshape} alt="flight path" />
      </div>

      <div className="Aboutuscounter-container">
        <div
          ref={el => (AboutuscounterItemsRef.current[0] = el)}
          className="Aboutuscounter-item Aboutuscounter-delay-1"
        >
          <FaUserTie />
          <h3>25+</h3>
          <p>Year of Experience</p>
        </div>

        <span className="Aboutuscounter-divider" />

        <div
          ref={el => (AboutuscounterItemsRef.current[1] = el)}
          className="Aboutuscounter-item Aboutuscounter-delay-2"
        >
          <FaStar />
          <h3>6,500+</h3>
          <p>Class Completed</p>
        </div>

        <span className="Aboutuscounter-divider" />

        <div
          ref={el => (AboutuscounterItemsRef.current[2] = el)}
          className="Aboutuscounter-item Aboutuscounter-delay-3"
        >
          <FaChalkboardTeacher />
          <h3>100+</h3>
          <p>Experts Instructors</p>
        </div>

        <span className="Aboutuscounter-divider" />

        <div
          ref={el => (AboutuscounterItemsRef.current[3] = el)}
          className="Aboutuscounter-item Aboutuscounter-delay-4"
        >
          <FaUserGraduate />
          <h3>6,561+</h3>
          <p>Students Enroll</p>
        </div>
      </div>
    </section>
  );
};

export default Aboutuscounter;
