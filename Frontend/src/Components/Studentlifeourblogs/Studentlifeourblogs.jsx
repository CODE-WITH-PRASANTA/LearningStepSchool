import React, { useState, useEffect } from "react";
import "./Studentlifeourblogs.css";
import { motion } from "framer-motion";

// Icons
import { FaGraduationCap, FaLanguage, FaBrain, FaArrowRight } from "react-icons/fa";

// Images
import img1 from "../../assets/blog2.png";
import img2 from "../../assets/blog3.png";
import img3 from "../../assets/blog1.png";

const data = [
  {
    img: img1,
    title: "Tutoring Services",
    desc: "At Learning Step School, our Tutoring Services focus on personalized academic guidance that strengthens understanding and builds lasting confidence. Each child receives focused support designed to improve conceptual clarity and overall academic performance.",
    icon: <FaGraduationCap />,
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    features: [
      "Personalized One-on-One Learning",
      "Homework and Concept Support",
      "Regular Progress Assessments",
    ],
    stats: "98% Success Rate",
  },
  {
    img: img2,
    title: "Language Lessons",
    desc: "Our Language Lessons program encourages communication and global awareness. Students learn through immersive activities, improving vocabulary, fluency, and cultural understanding in a fun, interactive way that enhances confidence in real-world communication.",
    icon: <FaLanguage />,
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    features: [
      "Interactive Conversational Practice",
      "Cultural and Global Language Exposure",
      "Certified Language Enrichment Program",
    ],
    stats: "15+ Languages",
  },
  {
    img: img3,
    title: "Study Skills Coaching",
    desc: "The Study Skills Coaching program at Learning Step School helps students master effective learning techniques. We focus on time management, focus enhancement, and exam strategies that empower students to learn independently and succeed with confidence.",
    icon: <FaBrain />,
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    features: [
      "Smart Time Management Techniques",
      "Effective Note-taking and Recall Strategies",
      "Exam and Stress Management Support",
    ],
    stats: "87% Improvement",
  },
];

const Studentlifeourblogs = () => {
  const [active, setActive] = useState(0);

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
              className={`Studentlifeourblogs-card ${active === index ? "active" : ""}`}
              onClick={() => setActive(index)}
              style={{
                "--accent": item.color,
                "--gradient": item.gradient,
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="Studentlifeourblogs-badge">{item.stats}</div>

              <div className="Studentlifeourblogs-card-icon">{item.icon}</div>

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
