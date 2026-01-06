import React, { useState } from "react";
import "./PrePrimeryMoreProgram.css";

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
    desc: "We will magically transform the school sports centre into a game field.",
    img: img2,
    bg: "bg-cream",
    metaColor: "orange",
    meta: ["3–4 Yrs", "5 Days", "3.30 Hrs"],
  },
  {
    title: "Junior Nursery",
    desc: "Kindedo offers dedicated programs for our 2023 reunion year groups.",
    img: img3,
    bg: "bg-pink",
    metaColor: "pink",
    meta: ["3–4 Yrs", "5 Days", "3.30 Hrs"],
  },
  {
    title: "Nursery",
    desc: "In collaboration with licensed child care providers and local partners.",
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


export default function PrePrimeryMoreProgram() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="preprimery-more-program">
      {/* HEADER */}
      <div className="preprimery-more-program__header">
        <h2>More Programs</h2>
        <p>
          Kindedo opened its doors in 1984 with a unique vision to provide its
          students with a globally focused study of arts.
        </p>
      </div>

      {/* CARD */}
      <div className="preprimery-more-program__slider">
        <div className={`program-card ${programs[current].bg}`}>
          <img src={programs[current].img} alt={programs[current].title} />
          <h3>{programs[current].title}</h3>
          <p>{programs[current].desc}</p>

          <div className={`program-meta ${programs[current].metaColor}`}>
            <span>{programs[current].meta[0]}<br />age</span>
            <span>{programs[current].meta[1]}<br />weekly</span>
            <span>{programs[current].meta[2]}<br />period</span>
          </div>
        </div>
      </div>

      {/* PAGINATION DOTS */}
      <div className="program-pagination">
        {programs.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}
