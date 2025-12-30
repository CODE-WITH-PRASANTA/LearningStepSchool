import React, { useState } from "react";
import "./Aboutteachercard.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaShareAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

// IMAGES
import img1 from "../../assets/ab.webp";
import img2 from "../../assets/aj.webp";
import img3 from "../../assets/ac.webp";
import img4 from "../../assets/ad.webp";
import img5 from "../../assets/ae.webp";
import img6 from "../../assets/af.webp";
import img7 from "../../assets/ag.webp";
import img8 from "../../assets/ai.webp";

const instructors = [
  { name: "Brooklyn Simmons", img: img1 },
  { name: "Leslie Alexander", img: img2 },
  { name: "Ronald Richards", img: img3 },
  { name: "Kristin Watson", img: img4 },
  { name: "Esther Howard", img: img5 },
  { name: "Savannah Nguyen", img: img6 },
  { name: "Dianne Russell", img: img7 },
  { name: "Kathryn Murphy", img: img8 },
];

const Aboutteachercard = () => {
  const [index, setIndex] = useState(0);
  const isMobile = window.innerWidth <= 768;

  const visibleCards = isMobile ? 1 : 4;
  const maxIndex = instructors.length - visibleCards;

  const nextSlide = () => {
    if (index < maxIndex) setIndex(index + 1);
  };

  const prevSlide = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <section className="Aboutteachercard-section">
      {/* HEADER */}
      <div className="Aboutteachercard-header">
        <div className="Aboutteachercard-header-text">
          <span className="Aboutteachercard-subtitle">Our Experts</span>
          <h2 className="Aboutteachercard-title">Our Expert Instructors</h2>
        </div>

        <div className="Aboutteachercard-header-right">
          <button
            className="Aboutteachercard-nav"
            onClick={prevSlide}
            disabled={index === 0}
          >
            <FaArrowLeft />
          </button>
          <button
            className="Aboutteachercard-nav Aboutteachercard-next"
            onClick={nextSlide}
            disabled={index === maxIndex}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div className="Aboutteachercard-slider">
        <div
          className="Aboutteachercard-track"
          style={{
            transform: `translateX(-${index * (isMobile ? 100 : 25)}%)`,
          }}
        >
          {instructors.map((item, i) => (
            <div className="Aboutteachercard-card" key={i}>
              <div className="Aboutteachercard-img-wrap">
                <img src={item.img} alt={item.name} />

                <svg
                  className="Aboutteachercard-wave"
                  viewBox="0 0 500 80"
                  preserveAspectRatio="none"
                >
                  <path d="M0,40 C80,80 160,0 250,30 340,60 420,40 500,20 L500,100 L0,100 Z" />
                </svg>

                <div className="Aboutteachercard-share">
                  <FaShareAlt className="Aboutteachercard-share-main" />
                  <div className="Aboutteachercard-share-icons">
                    <span><FaFacebookF /></span>
                    <span><FaInstagram /></span>
                    <span><FaLinkedinIn /></span>
                  </div>
                </div>
              </div>

              <h3 className="Aboutteachercard-name">{item.name}</h3>
              <p className="Aboutteachercard-role">Instructors</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutteachercard;
