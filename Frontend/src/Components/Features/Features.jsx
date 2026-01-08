import React from "react";
import "./Features.css";
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaMoneyBillWave } from "react-icons/fa";

const features = [
  {
    id: "01",
    title: "Scholarship Facility",
    icon: <FaGraduationCap />,
    text: "It is a long established fact that a reader will be distracted.",
  },
  {
    id: "02",
    title: "Skilled Lecturers",
    icon: <FaChalkboardTeacher />,
    text: "It is a long established fact that a reader will be distracted.",
  },
  {
    id: "03",
    title: "Book Library Facility",
    icon: <FaBook />,
    text: "It is a long established fact that a reader will be distracted.",
  },
  {
    id: "04",
    title: "Affordable Price",
    icon: <FaMoneyBillWave />,
    text: "It is a long established fact that a reader will be distracted.",
  },
];

export default function Features() {
  return (
    <section className="features-section">
      <div className="features-header">
        <h5 className="features-subtitle">
          <span className="features-icon"><svg
  xmlns="http://www.w3.org/2000/svg"
  width="42"
  height="42"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#FDA31B"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="4" r="2" />
  <path d="M5 8h14l2 12H3z" />
  <path d="M8 8v12M16 8v12" />
</svg>
</span> FEATURES
        </h5>
        <h2 className="features-title">
          Our Awesome <span>Features</span>
        </h2>
        <p className="features-desc">
          It is a long established fact that a reader will be 
          distracted by the readable content of a page when looking at its layout.
        </p>
      </div>

      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.id}>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">{f.icon}</div>
            </div>
            <div className="feature-number">{f.id}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-text">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
