import React from "react";
import "./Features.css";
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaMoneyBillWave } from "react-icons/fa";

const features = [
  {
    id: "01",
    title: "Scholarship Program",
    icon: <FaGraduationCap />,
    text: "Learning Step School offers merit and need-based scholarships to support deserving students.We believe financial limits should never restrict a child’s access to quality education.",
  },
  {
    id: "02",
    title: "Expert & Caring Educators",
    icon: <FaChalkboardTeacher />,
    text: "Our experienced faculty combines academic excellence with child-focused teaching. Every teacher nurtures curiosity, confidence, and lifelong learning in each student.",
  },
  {
    id: "03",
    title: "Modern Library & Learning Hub",
    icon: <FaBook />,
    text: "Our well-equipped digital library encourages reading, research, and creative exploration.It’s a space where students discover knowledge beyond textbooks.",
  },
  {
    id: "04",
    title: "Affordable & Transparent Fees",
    icon: <FaMoneyBillWave />,
    text: "We maintain an affordable and transparent fee structure to make education accessible.\nNo hidden charges — just quality learning for every child.",
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
         At Learning Step School, we combine modern teaching practices with strong moral foundations.Every feature of our institution is designed to nurture excellence, creativity, and confidence in every learner.
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
