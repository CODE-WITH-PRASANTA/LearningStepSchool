import React, { useState } from "react";
import "./PrePrimeryCard.css";

import bgImage1 from "../../assets/home-program-1.webp";
import bgImage2 from "../../assets/home-program-2.webp";
import bgImage3 from "../../assets/home-program-3.webp";
import auther1 from "../../assets/author-1.webp";

const images = [bgImage1, bgImage2, bgImage3];

export default function PrePrimeryCard() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="preprimery-card">
      {/* IMAGE CAROUSEL */}
      <div className="preprimery-card__image-wrapper">
        <div
          className="preprimery-card__slider"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <img key={index} src={img} alt={`slide-${index}`} />
          ))}
        </div>

        <button
          className="preprimery-card__arrow preprimery-card__arrow--left"
          onClick={prevSlide}
        >
          ‹
        </button>

        <button
          className="preprimery-card__arrow preprimery-card__arrow--right"
          onClick={nextSlide}
        >
          ›
        </button>
      </div>

      {/* CONTENT */}
      <div className="preprimery-card__content">
        <h2>Pre-Primary</h2>

        <p>
          Our Pre-Primary program at Learning Step International School is designed to support early childhood development through structured play, exploration, and personalized guidance—laying a strong foundation for lifelong learning.
        </p>

        <p>
          Our goal is to help every child enjoy learning while building the skills needed for lifelong success.
        </p>

        <div className="preprimery-card__footer">
          <div className="preprimery-card__teacher">
            <img src={auther1} alt="Alexia Honix" />
            <div>
              <span>Head of department (HOD)</span>
              <strong>Ms. Nikku Sharma</strong>
            </div>
          </div>

          <div className="preprimery-card__details">
            <div>
              <span>Category</span>
              <strong>Pre-Primary</strong>
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
