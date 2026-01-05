import React, { useState, useRef, useEffect } from "react";
import "./HomeClasses.css";

import Child1 from "../../assets/child-01.webp";
import Child2 from "../../assets/child-02.png";
import Child3 from "../../assets/child-03.webp";

import Homeclsbg from "../../assets/clases-bg.webp";
import waveimg from "../../assets/clases-top-shape.webp";

const data = [
  {
    img: Child1,
    title: "English Language Development",
    desc: "Interactive English learning focused on reading, writing, speaking, and confidence building through engaging classroom activities.",
  },
  {
    img: Child2,
    title: "Personalized Individual Tutoring",
    desc: "One-on-one attention to support each child’s unique learning pace, strengthening core concepts and academic confidence.",
  },
  {
    img: Child3,
    title: "Online Learning Programs",
    desc: "Safe and engaging virtual classes designed to ensure continuous learning with expert guidance from experienced educators.",
  },
  {
    img: Child1,
    title: "Early Childhood Education",
    desc: "A nurturing environment that promotes creativity, social skills, and foundational learning through play-based methods.",
  },
  {
    img: Child2,
    title: "Skill Enhancement Classes",
    desc: "Focused programs to enhance communication, problem-solving, and critical thinking skills in young learners.",
  },
  {
    img: Child3,
    title: "Activity-Based Learning",
    desc: "Hands-on activities that encourage curiosity, exploration, and joyful learning experiences for children.",
  },
];


const getCardsPerView = () => {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
};

const HomeClasses = () => {
  const [page, setPage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView());
  const startX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
      setPage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const TOTAL_PAGES = Math.ceil(data.length / cardsPerView);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50 && page < TOTAL_PAGES - 1) setPage(page + 1);
    if (diff < -50 && page > 0) setPage(page - 1);
  };

  return (
    <>
      <div className="homeclasses-wave">
        <img src={waveimg} alt="wave" />
      </div>

      <section
        className="homeclasses"
        style={{ backgroundImage: `url(${Homeclsbg})` }}
      >
        <div className="homeclasses-container">
          <div className="homeclasses-header">
            <span className="homeclasses-subtitle">
              Learning Step International School
            </span>

            <h2 className="homeclasses-title">
              Building Strong Foundations <br />
              For Every Child’s Future
            </h2>

          </div>

          <div className="homeclasses-slider">
            <div
              className="homeclasses-track"
              style={{
                width: `${TOTAL_PAGES * 100}%`,
                transform: `translateX(-${page * (100 / TOTAL_PAGES)}%)`,
              }}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {Array.from({ length: TOTAL_PAGES }).map((_, pageIndex) => (
                <div className="homeclasses-page" key={pageIndex}>
                  {data
                    .slice(
                      pageIndex * cardsPerView,
                      pageIndex * cardsPerView + cardsPerView
                    )
                    .map((item, i) => (
                      <div className="homeclasses-card" key={i}>
                        <img src={item.img} alt={item.title} />
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>

                        <div className="homeclasses-meta">
                          <div>
                            <span>Age</span>
                            <strong>3–5 years</strong>
                          </div>
                          <div>
                            <span>Weekly</span>
                            <strong>5 Days</strong>
                          </div>
                          <div>
                            <span>Time</span>
                            <strong>4.30 Hours</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <div className="homeclasses-pagination">
            {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
              <span
                key={i}
                className={`pagination-dot ${i === page ? "active" : ""}`}
                onClick={() => setPage(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeClasses;
