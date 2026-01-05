import React, { useState, useEffect } from "react";
import "./Studentlifeextracurricular.css";
import { motion } from "framer-motion";

// Icons
import {
  FaGraduationCap,
  FaLanguage,
  FaBrain,
  FaArrowRight
} from "react-icons/fa";

// Images
import img1 from "../../assets/blog2.png";
import img2 from "../../assets/blog3.png";
import img3 from "../../assets/blog1.png";


const data = [
  {
    img: img1,
    title: "Tutoring Services",
    desc: "Personalized academic support to strengthen concepts and build confidence.",
    icon: <FaGraduationCap />,
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    features: ["One-on-One Sessions", "Homework Help", "Exam Preparation"],
    stats: "98% Success Rate",
  },
  {
    img: img2,
    title: "Language Lessons",
    desc: "Interactive language programs designed for real-world communication.",
    icon: <FaLanguage />,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    features: ["Conversational Practice", "Cultural Immersion", "Certification"],
    stats: "15+ Languages",
  },
  {
    img: img3,
    title: "Study Skills Coaching",
    desc: "Proven techniques for time management, focus, and exam preparation.",
    icon: <FaBrain />,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    features: ["Time Management", "Note-taking Strategies", "Stress Management"],
    stats: "87% Improvement",
  },
];

const StudentLifeExtraPremium = () => {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="StudentLifeExtraPremium-section">
      <div className="StudentLifeExtraPremium-wrapper">

        {/* ✅ HEADING FROM IMAGE */}
        <div className="StudentLifeExtraPremium-heading">
          

          <div className="StudentLifeExtraPremium-headingText">
            <span className="StudentLifeExtraPremium-tag">Extra Curricular</span>
            <h2 className="StudentLifeExtraPremium-title">
              Building a strong foundation <br />
              through education
            </h2>
          </div>
        </div>

        {/* CARDS */}
        <motion.div className="StudentLifeExtraPremium-cards">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className={`StudentLifeExtraPremium-card ${
                active === index ? "active" : ""
              } ${hovered === index ? "hovered" : ""}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(index)}
              style={{
                "--accent": item.color,
                "--gradient": item.gradient,
              }}
            >
              <div className="card-badge">{item.stats}</div>

              <div className="StudentLifeExtraPremium-card-icon">
                <div className="icon-wrapper">{item.icon}</div>
              </div>

              <div className="StudentLifeExtraPremium-card-img">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <ul className="features-list">
                  {item.features.map((f, i) => (
                    <li key={i}>
                      <FaArrowRight className="feature-icon" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="/" className="StudentLifeExtraPremium-link">
                  <span>Explore Program</span>
                  <div className="link-arrow">
                    <FaArrowRight />
                  </div>
                </a>
              </div>

              <div className="card-indicator" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default StudentLifeExtraPremium;
