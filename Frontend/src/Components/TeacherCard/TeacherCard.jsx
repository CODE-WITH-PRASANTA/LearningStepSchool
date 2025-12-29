import React, { useEffect, useRef } from "react";
import "./TeacherCard.css";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaShareAlt
} from "react-icons/fa";

// IMPORT IMAGES
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
  { name: "Kathryn Murphy", img: img8 }
];

const InstructorSection = () => {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(card => observer.observe(card));
  }, []);

  return (
    <section className="instructor-section">
      <div className="instructor-grid">
        {instructors.map((item, index) => (
          <div
            className="instructor-card"
            key={index}
            ref={el => (cardsRef.current[index] = el)}
          >
            <div className="img-wrap">
              <img src={item.img} alt={item.name} />

              {/* Wave */}
              <svg
                className="wave-shape"
                viewBox="0 0 500 80"
                preserveAspectRatio="none"
              >
                <path d="M0,40 C80,80 160,0 250,30 340,60 420,40 500,20 L500,100 L0,100 Z" />
              </svg>

              {/* Share */}
              <div className="share-box">
                <FaShareAlt className="share-main" />
                <div className="share-icons">
                  <span><FaFacebookF /></span>
                  <span><FaInstagram /></span>
                  <span><FaLinkedinIn /></span>
                </div>
              </div>
            </div>

            <h3>{item.name}</h3>
            <p>Instructors</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstructorSection;
