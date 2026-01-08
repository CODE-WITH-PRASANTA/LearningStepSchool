import React, { useEffect, useRef, useState } from "react";
import "./ExamChild.css";
import bgImg from "../../assets/bc-1.png";

import child1 from "../../assets/grade-h2-1.webp";
import child2 from "../../assets/grade-h2-2.webp";
import child3 from "../../assets/grade-h2-3.webp";
import child4 from "../../assets/grade-h2-4.webp";
import child5 from "../../assets/grade-h2-5.webp";
import child6 from "../../assets/grade-h2-6.webp";

const cards = [
  { img: child1, title: "Nursery Kg 3", price: "$150 / Month" },
  { img: child2, title: "Nursery Kg 3", price: "$150 / Month" },
  { img: child3, title: "Nursery Kg 3", price: "$150 / Month" },
  { img: child4, title: "Nursery Kg 3", price: "$150 / Month" },
  { img: child5, title: "Nursery Kg 3", price: "$150 / Month" },
  { img: child6, title: "Nursery Kg 3", price: "$150 / Month" },
];

// CLONES: last + real + first
const slides = [cards[cards.length - 1], ...cards, cards[0]];

export default function PreschoolClasses() {
  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const trackRef = useRef(null);
  const cardRef = useRef(null);

  /* AUTO SLIDE – 5 SECONDS */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* INFINITE LOOP FIX */
  useEffect(() => {
    if (index === slides.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 600);
    }

    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(slides.length - 2);
      }, 600);
    }
  }, [index]);

  /* RE-ENABLE TRANSITION */
  useEffect(() => {
    if (!transition) {
      requestAnimationFrame(() => setTransition(true));
    }
  }, [transition]);

  const cardWidth =
    cardRef.current?.offsetWidth || 0;

  return (
    <section
      className="preschool-wrapper"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      {/* HEADING */}
      <div className="preschool-heading animate">
        <span>SCHOOL GRADE</span>
        <h2>Our Preschool Classes</h2>
      </div>

      {/* SLIDER */}
      <div className="preschool-slider">
        <div
          ref={trackRef}
          className="preschool-track"
          style={{
            transform: `translateX(-${index * cardWidth}px)`,
            transition: transition ? "transform 0.6s ease" : "none",
          }}
        >
          {slides.map((item, i) => (
            <div
              className="preschool-card"
              key={i}
              ref={i === 1 ? cardRef : null}
            >
              <img src={item.img} alt="" />
              <div className="card-content">
                <div className="card-tags">
                  <span className="orange">18–24<br />Class Size</span>
                  <span className="green">9:30<br />Class Time</span>
                  <span className="purple">05–06<br />Year Old</span>
                </div>
                <h3>{item.title}</h3>
                <h4>{item.price}</h4>
                <p>
                  Pre-School Has Open Doors Also Offer Free Trial Session Child.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS – 6 DOTS – ONE BY ONE */}
      <div className="preschool-dots">
        {cards.map((_, i) => (
          <span
            key={i}
            className={
              (index - 1 + cards.length) % cards.length === i
                ? "active"
                : ""
            }
            onClick={() => setIndex(i + 1)}
          />
        ))}
      </div>
    </section>
  );
}
