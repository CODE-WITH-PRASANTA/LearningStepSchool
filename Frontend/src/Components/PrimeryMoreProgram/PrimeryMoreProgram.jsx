import React, { useState, useEffect } from "react";
import "./PrimeryMoreProgram.css";

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
    bg: "bg-mint",
    metaColor: "mint",
    meta: ["6–7 Yrs", "5 Days", "3.30 Hrs"],
  },
  {
    title: "Play Group",
    desc: "We will magical transform the School Sports Centre into a game field.",
    img: img2,
    bg: "bg-cream",
    metaColor: "orange",
    meta: ["3–4 Yrs", "5 Days", "3.30 Hrs"],
  },
  {
    title: "Junior Nursery",
    desc: "Kindedo not only for all our dedicated 2023 reunion year groups program.",
    img: img3,
    bg: "bg-pink",
    metaColor: "pink",
    meta: ["3–4 Yrs", "5 Days", "3.30 Hrs"],
  },
  {
    title: "Nursery",
    desc: "In collaboration with licensed providers and local partners.",
    img: img4,
    bg: "bg-cream",
    metaColor: "orange",
    meta: ["3–4 Yrs", "5 Days", "4.30 Hrs"],
  },
  {
    title: "Junior KG",
    desc: "The kindergarten program was developed in the nineteenth century.",
    img: img5,
    bg: "bg-mint",
    metaColor: "mint",
    meta: ["4–5 Yrs", "5 Days", "4.30 Hrs"],
  },
];

export default function PrimeryMoreProgram() {
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

  const maxIndex = programs.length - visible;
  const pages = maxIndex + 1;

  const visiblePrograms = programs.slice(index, index + visible);

  return (
    <section className="primery-more-program">
      {/* HEADER */}
      <div className="primery-more-program__header">
        <h2>More Programs</h2>
        <p>
          Kindedo opened its doors in 1984 with a unique vision to provide its
          students with a globally focused study of arts.
        </p>
      </div>

      {/* CARDS */}
      <div className="program-row">
        {visiblePrograms.map((item, i) => (
          <div key={i} className={`program-card ${item.bg}`}>
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>

            <div className={`program-meta ${item.metaColor}`}>
              <span>{item.meta[0]}<br />age</span>
              <span>{item.meta[1]}<br />weekly</span>
              <span>{item.meta[2]}<br />period</span>
            </div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="program-pagination">
        {Array.from({ length: pages }).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
