import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import "./Herosection.css";

import heroImg1 from "../../assets/slider-1.png";
import heroImg2 from "../../assets/slider-2.png";
import heroImg3 from "../../assets/slider-3.png";

const slides = [
  {
    image: heroImg1,
    badge: "Best RBSE School in Rajgarh",
    title: "Learning Step International School",
    highlight: "Building Bright Futures",
    text: "Learning Step International School is one of the top-rated schools near Tehla Bypass, Alwar Road, Rajgarh, offering world-class education with modern infrastructure and experienced faculty.",
  },
  {
    image: heroImg2,
    badge: "Quality Education • Modern Campus",
    title: "Top School Near Tehla Bypass",
    highlight: "Alwar Road, Rajgarh",
    text: "We provide a student-focused learning environment with smart classrooms, activity-based education, and holistic development for every child.",
  },
  {
    image: heroImg3,
    badge: "Admissions Open 2025–26",
    title: "Trusted International School",
    highlight: "For Academic Excellence",
    text: "Enroll your child in a school that nurtures academic excellence, discipline, creativity, and confidence—recognized as a leading school in Rajgarh.",
  },
];

const Herosection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${slides[active].image})` }}
    >
      <div className="hero-overlay" />

      {/* DOT COUNTER */}
      <div className="dot-counter">
        <span className="line" />
        {slides.map((_, index) => (
          <div
            key={index}
            className={`dot-wrap ${active === index ? "active" : ""}`}
            onClick={() => setActive(index)}
          >
            <span className="dot" />
          </div>
        ))}
        <span className="line" />
      </div>

      {/* CONTENT */}
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">
            <HiSparkles /> {slides[active].badge}
          </span>

          <h1 className="hero-title">
            {slides[active].title} <br />
            <span>{slides[active].highlight}</span>
          </h1>

          <p className="hero-text">{slides[active].text}</p>

          <div className="hero-buttons">
            <button className="btn-primary">
              Explore School <FiArrowRight />
            </button>
            <button className="btn-outline">
              Contact Admission <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
