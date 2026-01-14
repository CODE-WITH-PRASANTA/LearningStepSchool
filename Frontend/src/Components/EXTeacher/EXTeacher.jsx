import React from "react";
import "./EXTeacher.css";

// Background
import bgPattern from "../../assets/team-bg.webp";

// Teacher images
import t1 from "../../assets/team-1.webp";
import t2 from "../../assets/team-2.webp";
import t3 from "../../assets/team-3.webp";
import t4 from "../../assets/team-4.webp";

// Share icon (you can replace with your own svg/png)
import { FaShareAlt } from "react-icons/fa";

const teachers = [
  {
    img: t1,
    name: "John Harris",
    role: "Principal",
  },
  {
    img: t2,
    name: "Arika Max",
    role: "Drawing Teacher",
  },
  {
    img: t3,
    name: "Frank Lee",
    role: "Teacher",
  },
  {
    img: t4,
    name: "Emely Jon",
    role: "Teacher",
  },
];

const MeetOurTeacher = () => {
  return (
    <section
      className="mot-section"
      style={{ backgroundImage: `url(${bgPattern})` }}
    >
      <div className="mot-container">
        {/* Heading */}
        <div className="mot-heading">
          <span>EXPERT TEAM</span>
          <h2>Meet Our Teacher</h2>
        </div>

        {/* Cards */}
        <div className="mot-grid">
          {teachers.map((teacher, index) => (
            <div className="mot-card" key={index}>
              <div className="mot-img-box">
                <img src={teacher.img} alt={teacher.name} />
              </div>

              <div className="mot-info">
                <h3>{teacher.name}</h3>
                <p>{teacher.role}</p>
              </div>

              <button className="mot-share">
                <FaShareAlt />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeacher;
