import React, { useState } from "react";
import "./PrimeryCard.css";

import bgImage1 from "../../assets/home-program-1.webp";
import bgImage2 from "../../assets/home-program-2.webp";
import bgImage3 from "../../assets/home-program-3.webp";
import auther1 from "../../assets/author-1.webp";

const images = [bgImage1, bgImage2, bgImage3];

export default function PrimeryCard() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="primery-card">
      {/* IMAGE CAROUSEL */}
      <div className="primery-card__image-wrapper">
        <div
          className="primery-card__slider"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, index) => (
            <img key={index} src={img} alt={`slide-${index}`} />
          ))}
        </div>

        <button
          className="primery-card__arrow primery-card__arrow--left"
          onClick={prevSlide}
        >
          ‹
        </button>

        <button
          className="primery-card__arrow primery-card__arrow--right"
          onClick={nextSlide}
        >
          ›
        </button>
      </div>

      {/* CONTENT */}
      <div className="primery-card__content">
        <h2>Primary</h2>

        <p>
         At Learning Step International School, our Primary program builds strong academic foundations while nurturing confidence, curiosity, and independent thinking through structured, engaging, and child-centered learning.
        </p>

        <p>
          Through guided instruction, interactive activities, and continuous support, students develop strong literacy, numeracy, problem-solving, and communication skills in a positive and nurturing environment. 
        </p>

        <div className="primery-card__footer">
          <div className="primery-card__teacher">
            <img src={auther1} alt="Alexia Honix" />
            <div>
              <span>Head of department (HOD)</span>
              <strong>Ms. Nikku Sharma</strong>
            </div>
          </div>

          <div className="primery-card__details">
            <div>
              <span>Category</span>
              <strong>Primary</strong>
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
