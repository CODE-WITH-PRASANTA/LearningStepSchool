import React, { useState, useEffect } from "react";
import "./SecondaryMoreProgram.css";

import img1 from "../../assets/home-program-1.webp";
import img2 from "../../assets/home-program-2.webp";
import img3 from "../../assets/home-program-3.webp";
import img4 from "../../assets/home-program-4.webp";
import img5 from "../../assets/home-program-5.webp";

const programs = [
  {
    title: "Settling",
    desc: "To round out our weekend of celebrations, we are holding our reunion.",
    img: img1,
    bg: "secondary-bg-mint",
    metaColor: "mint",
    meta: ["11–14 Yrs", "5 Days", "6.00 Hrs"],
  },
  {
    title: "Play Group",
    desc: "Structured group activities encouraging teamwork and leadership.",
    img: img2,
    bg: "secondary-bg-cream",
    metaColor: "orange",
    meta: ["11–14 Yrs", "5 Days", "6.00 Hrs"],
  },
  {
    title: "Junior Nursery",
    desc: "Focused academic preparation with creative exploration.",
    img: img3,
    bg: "secondary-bg-pink",
    metaColor: "pink",
    meta: ["11–14 Yrs", "5 Days", "6.00 Hrs"],
  },
  {
    title: "Nursery",
    desc: "Advanced learning with subject specialization support.",
    img: img4,
    bg: "secondary-bg-cream",
    metaColor: "orange",
    meta: ["11–14 Yrs", "5 Days", "6.00 Hrs"],
  },
  {
    title: "Junior KG",
    desc: "Foundation for higher secondary and future academics.",
    img: img5,
    bg: "secondary-bg-mint",
    metaColor: "mint",
    meta: ["11–14 Yrs", "5 Days", "6.00 Hrs"],
  },
];

export default function SecondaryMoreProgram() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const resize = () => {
      setVisible(window.innerWidth < 768 ? 1 : 3);
      setIndex(0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const pages = programs.length - visible + 1;
  const visiblePrograms = programs.slice(index, index + visible);

  return (
    <section className="secondary-more-program">
      {/* HEADER */}
      <div className="secondary-more-program__header">
        <h2>More Programs</h2>
        <p>
          Secondary programs are designed to strengthen academic skills,
          independence, and critical thinking.
        </p>
      </div>

      {/* CARDS */}
      <div className="secondary-program-row">
        {visiblePrograms.map((item, i) => (
          <div key={i} className={`secondary-program-card ${item.bg}`}>
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>

            <div className={`secondary-program-meta ${item.metaColor}`}>
              <span>{item.meta[0]}<br />age</span>
              <span>{item.meta[1]}<br />weekly</span>
              <span>{item.meta[2]}<br />period</span>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="secondary-program-pagination">
        {Array.from({ length: pages }).map((_, i) => (
          <span
            key={i}
            className={`secondary-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
