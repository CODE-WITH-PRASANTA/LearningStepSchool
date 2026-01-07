import React from "react";
import "./VMMeetTeacher.css";

import bgImage from "../../assets/meet-our-teacher.webp";

import t1 from "../../assets/team-teacher-1.webp";
import t2 from "../../assets/team-teacher-2.webp";
import t3 from "../../assets/team-teacher-3.webp";
import t4 from "../../assets/team-teacher-4.webp";

import { FaShareAlt } from "react-icons/fa";

const teachers = [
  {
    name: "John Harris",
    role: "Principal",
    img: t1,
  },
  {
    name: "Arika Max",
    role: "Drawing Teacher",
    img: t2,
  },
  {
    name: "Frank Lee",
    role: "Teacher",
    img: t3,
  },
  {
    name: "Emely Jon",
    role: "Teacher",
    img: t4,
  },
];

const MeetTeacher = () => {
  return (
    <section
      className="teacher-section"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container">
        <p className="subtitle">EXPERT TEAM</p>
        <h2 className="title">Meet Our Teacher</h2>

        <div className="teacher-grid">
          {teachers.map((t, i) => (
            <div className="teacher-card" key={i}>
              <div className="img-box">
                <img src={t.img} alt={t.name} />

                {/* Wave SVG */}
                <svg
                  className="wave"
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 C150,150 350,0 500,80 L500,150 L0,150 Z"
                    fill="#fff"
                  />
                </svg>
              </div>

              <div className="card-content">
                <h4>{t.name}</h4>
                <span>{t.role}</span>

                <button className="share-btn">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTeacher;
