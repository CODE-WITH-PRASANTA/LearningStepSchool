import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import "./Herosection.css";

import heroImg1 from "../../assets/slider-1.png";
import heroImg2 from "../../assets/slider-2.png";
import heroImg3 from "../../assets/slider-3.png";

const slides = [heroImg1, heroImg2, heroImg3];

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
      style={{ backgroundImage: `url(${slides[active]})` }}
    >
      <div className="hero-overlay" />

      {/* LEFT DOT COUNTER */}
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
            <HiSparkles /> Welcome To Kidsa
          </span>

          <h1 className="hero-title">
            Trial Nanny Free <br />
            On <span>First Day.</span>
          </h1>

          <p className="hero-text">
            Suspendisse eget lectus vitae elit malesuada lacinia.
            Vestibulum scelerisque, ligula sit amet consequat.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">
              Explore More <FiArrowRight />
            </button>
            <button className="btn-outline">
              Get In Touch <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Herosection;
