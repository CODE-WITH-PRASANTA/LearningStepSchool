import React, { useState } from "react";
import "./SecondaryCard.css";

import bgImage1 from "../../assets/home-program-4.webp";
import bgImage2 from "../../assets/home-program-5.webp";
import bgImage3 from "../../assets/home-program-3.webp";
import auther1 from "../../assets/author-1.webp";

const images = [bgImage1, bgImage2, bgImage3];

export default function SecondaryCard() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="secondary-card">
      {/* IMAGE CAROUSEL */}
      <div className="secondary-card__image-wrapper">
        <div
          className="secondary-card__slider"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <img key={index} src={img} alt={`slide-${index}`} />
          ))}
        </div>

        <button
          className="secondary-card__arrow secondary-card__arrow--left"
          onClick={prevSlide}
        >
          ‹
        </button>

        <button
          className="secondary-card__arrow secondary-card__arrow--right"
          onClick={nextSlide}
        >
          ›
        </button>
      </div>

      {/* CONTENT */}
      <div className="secondary-card__content">
        <h2>Secondary</h2>

        <p>
         The Secondary program at Learning Step International School focuses on building strong academic depth, critical thinking, and subject understanding through a structured and disciplined learning approach.
        </p>

        <p>
          Students are encouraged to think independently, collaborate effectively, and take responsibility for their learning. With experienced educators, focused instruction, and continuous guidance, we prepare learners with the confidence, skills, and academic readiness required for higher education and future success.
        </p>

        <div className="secondary-card__footer">
          <div className="secondary-card__teacher">
            <img src={auther1} alt="Daniel Roberts" />
            <div>
              <span>Head of department (HOD)</span>
              <strong>Ms. Nikku Sharma</strong>
            </div>
          </div>

          <div className="secondary-card__details">
            <div>
              <span>Category</span>
              <strong>Secondary</strong>
            </div>
            <div>
              <span>Per / Month</span>
              <strong>15000</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
