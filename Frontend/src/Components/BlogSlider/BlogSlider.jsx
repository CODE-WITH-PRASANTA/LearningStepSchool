import React, { useEffect, useRef, useState } from "react";
import "./BlogSlider.css";

import img1 from "../../assets/04.webp";
import img2 from "../../assets/05.webp";
import img3 from "../../assets/06.webp";
import img4 from "../../assets/08.webp";
import img5 from "../../assets/09.webp";
import img6 from "../../assets/10.webp";
import img7 from "../../assets/06.webp";
import img8 from "../../assets/08.webp";
import img9 from "../../assets/06.webp";

const blogs = [
  { id: 1, title: "From Without Content Style Without", img: img1 },
  { id: 2, title: "That Jerk Form Finance Really Threw Me", img: img2 },
  { id: 3, title: "All Inclusive Ultimate Circle Island Day With Lunch", img: img3 },
  { id: 4, title: "Students Intelligence In Education Building Resilient", img: img4 },
  { id: 5, title: "From Without Content Style Without", img: img5 },
  { id: 6, title: "That Jerk Form Finance Really Threw Me", img: img6 },
  { id: 7, title: "How To Keep Children Safe Online In Simple Steps", img: img7 },
  { id: 8, title: "Creative Learning Activities For Growing Minds", img: img8 },
  { id: 9, title: "Modern Education With Smart Learning Tools", img: img9 }
];

const VISIBLE = 3;

export default function BlogSlider() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const intervalRef = useRef(null);

  // clone first slides for seamless looping
  const extendedSlides = [...blogs, ...blogs.slice(0, VISIBLE)];
  const total = blogs.length;

  /* autoplay */
  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, []);

  const startAutoPlay = () => {
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3500);
  };

  const stopAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // reset after reaching cloned slides
  useEffect(() => {
    if (index === total) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(0);
      }, 700);
    } else {
      setIsAnimating(true);
    }
  }, [index, total]);

  return (
    <section className="blog-slider-section">
      <div className="blog-slider-wrapper">

        <div
          className="slider-window"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
        >
          <div
            className={`slider-track ${!isAnimating ? "no-transition" : ""}`}
            style={{
              transform: `translateX(-${(index * 100) / VISIBLE}%)`,
            }}
          >
            {extendedSlides.map((item, i) => (
              <div className="slide" key={i}>
                <div className="blog-card">
                  <div className="blog-img-wrap">
                    <span className="tag">Activities</span>
                    <img src={item.img} alt={item.title} />
                  </div>

                  <div className="blog-meta">
                    <span>📅 Feb 10, 2024</span>
                    <span>👤 By admin</span>
                  </div>

                  <h3>{item.title}</h3>

                  <a href="#" className="read-more">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="pagination-wrap">
          <span className="line" />
          <div className="dots">
            {blogs.map((_, i) => (
              <button
                key={i}
                className={`dot ${index % total === i ? "active" : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <span className="line" />
        </div>
      </div>
    </section>
  );
}
