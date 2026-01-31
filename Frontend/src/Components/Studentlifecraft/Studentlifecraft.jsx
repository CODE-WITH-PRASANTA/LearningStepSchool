import React, { useState } from "react";
import "./Studentlifecraft.css";
import { FaCheckCircle, FaGraduationCap } from "react-icons/fa";
import studentImg from "../../assets/magnifying-glass-student.webp";
import mascot from "../../assets/man.webp";

const AGE_DATA = {
  "1-4": {
    title: "Play. Explore. Learn.",
    desc: "At Learning Step School, our Early Explorers program (1–4 years) focuses on joyful discovery. Through play-based learning, we nurture curiosity, creativity, and emotional confidence—helping children develop essential motor and social skills for lifelong learning."
  },
  "5-7": {
    title: "Think. Ask. Discover.",
    desc: "In the Creative Thinkers program (5–7 years), students are encouraged to question, imagine, and express themselves. We combine fun classroom activities with foundational literacy and numeracy to strengthen communication, reasoning, and teamwork skills."
  },
  "8-12": {
    title: "Create. Analyze. Grow.",
    desc: "Our Young Scholars program (8–12 years) helps students build strong academic and analytical foundations. With hands-on projects, digital learning, and skill-based workshops, children learn to think critically, solve problems, and grow with confidence."
  },
  "13-15": {
    title: "Lead. Innovate. Succeed.",
    desc: "In the Future Leaders program (13–15 years), students are guided to develop leadership, innovation, and resilience. We prepare them for real-world challenges through mentorship, academic excellence, and holistic development for lifelong success."
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
