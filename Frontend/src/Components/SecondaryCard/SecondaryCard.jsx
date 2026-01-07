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
          The Secondary program builds academic strength, critical thinking, and
          subject mastery through structured learning.
        </p>

        <p>
          Students develop independence, collaboration skills, and confidence
          to prepare for higher education.
        </p>

        <div className="secondary-card__footer">
          <div className="secondary-card__teacher">
            <img src={auther1} alt="Daniel Roberts" />
            <div>
              <span>Secondary Teacher</span>
              <strong>Daniel Roberts</strong>
            </div>
          </div>

          <div className="secondary-card__details">
            <div>
              <span>Category</span>
              <strong>Secondary</strong>
            </div>
            <div>
              <span>Per / Month</span>
              <strong>$220</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
