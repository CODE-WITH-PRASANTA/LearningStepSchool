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
          The Pre-Primary program focuses on early childhood development through
          play-based learning and structured activities.
        </p>

        <p>
          Children gain confidence, independence, and strong foundational skills
          in a nurturing environment.
        </p>

        <div className="preprimery-card__footer">
          <div className="preprimery-card__teacher">
            <img src={auther1} alt="Alexia Honix" />
            <div>
              <span>Pre-Primary Teacher</span>
              <strong>Alexia Honix</strong>
            </div>
          </div>

          <div className="preprimery-card__details">
            <div>
              <span>Category</span>
              <strong>Pre-Primary</strong>
            </div>
            <div>
              <span>Per / Month</span>
              <strong>$175</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
