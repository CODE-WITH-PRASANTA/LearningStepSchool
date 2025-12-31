import React, { useState } from "react";
import "./Studentlifecraft.css";
import { FaCheckCircle, FaGraduationCap } from "react-icons/fa";
import studentImg from "../../assets/magnifying-glass-student.webp";
import mascot from "../../assets/man.webp";

const AGE_DATA = {
  "1-4": {
    title: "Play. Explore. Learn.",
    desc: "Building curiosity and motor skills through playful learning."
  },
  "5-7": {
    title: "Think. Ask. Discover.",
    desc: "Encouraging questions, creativity, and early problem-solving."
  },
  "8-12": {
    title: "Create. Analyze. Grow.",
    desc: "Strengthening logic, confidence, and independent thinking."
  },
  "13-15": {
    title: "Lead. Innovate. Succeed.",
    desc: "Preparing young minds for real-world challenges."
  }
};

const Studentlifecraft = () => {
  const [active, setActive] = useState("1-4");

  return (
    <section className="Studentlifecraft">
      <div className="Studentlifecraft-wrapper">

        {/* LEFT VISUAL */}
        <div className="Studentlifecraft-visual">
          <div className="Studentlifecraft-ring">
            <div className="Studentlifecraft-ringInner">
              <img src={studentImg} alt="Student learning" />
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="Studentlifecraft-info">
          <span className="Studentlifecraft-label">
            <FaGraduationCap /> Student Life Craft
          </span>

          <h1 className="Studentlifecraft-heading">
            Education is the <span>Foundation</span> <br />
            Knowledge is the <span>Future</span>
          </h1>

          {/* AGE SELECTOR */}
          <div className="Studentlifecraft-tabs">
            {Object.keys(AGE_DATA).map((age) => (
              <button
                key={age}
                className={`Studentlifecraft-tab ${
                  active === age ? "active" : ""
                }`}
                onClick={() => setActive(age)}
              >
                {age} yrs
              </button>
            ))}
          </div>

          {/* DYNAMIC CARD */}
          <div className="Studentlifecraft-card">
            <h3>{AGE_DATA[active].title}</h3>
            <p>{AGE_DATA[active].desc}</p>

            <ul>
              <li>
                <FaCheckCircle /> Personalized Learning Paths
              </li>
              <li>
                <FaCheckCircle /> Expert Guided Programs
              </li>
              <li>
                <FaCheckCircle /> Confidence & Skill Building
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FLOATING MASCOT */}
      <img src={mascot} className="Studentlifecraft-mascot" alt="Mascot" />
    </section>
  );
};

export default Studentlifecraft;
