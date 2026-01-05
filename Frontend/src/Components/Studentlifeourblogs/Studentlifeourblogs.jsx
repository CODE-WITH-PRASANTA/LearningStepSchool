import React, { useState, useEffect } from "react";
import "./Studentlifeourblogs.css";
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

const Studentlifeourblogs = () => {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % data.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="Studentlifeourblogs-section">
      <div className="Studentlifeourblogs-wrapper">

        {/* HEADING */}
        <div className="Studentlifeourblogs-heading">
          <div className="Studentlifeourblogs-headingText">
            <span className="Studentlifeourblogs-tag">Our Blogs</span>
            <h2 className="Studentlifeourblogs-title">
              Building a strong foundation <br />
              through education
            </h2>
          </div>
        </div>

        {/* CARDS */}
        <motion.div className="Studentlifeourblogs-cards">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className={`Studentlifeourblogs-card ${
                active === index ? "active" : ""
              }`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(index)}
              style={{
                "--accent": item.color,
                "--gradient": item.gradient,
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="Studentlifeourblogs-badge">{item.stats}</div>

              <div className="Studentlifeourblogs-card-icon">
                {item.icon}
              </div>

              <div className="Studentlifeourblogs-card-img">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="Studentlifeourblogs-card-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>

                <ul className="Studentlifeourblogs-features">
                  {item.features.map((f, i) => (
                    <li key={i}>
                      <FaArrowRight />
                      {f}
                    </li>
                  ))}
                </ul>

                <a href="/" className="Studentlifeourblogs-link">
                  <span>Explore Program</span>
                  <div className="Studentlifeourblogs-linkArrow">
                    <FaArrowRight />
                  </div>
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Studentlifeourblogs;
