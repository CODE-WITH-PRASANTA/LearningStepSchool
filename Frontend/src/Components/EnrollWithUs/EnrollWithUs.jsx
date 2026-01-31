import React from "react";
import { Helmet } from "react-helmet"; // ✅ Added Helmet for SEO
import "./EnrollWithUs.css";
import { FaAppleAlt, FaPenAlt, FaDraftingCompass, FaFlask } from "react-icons/fa";

const EnrollWithUs = () => {
  const steps = [
    {
      icon: <FaAppleAlt />,
      title: "Enroll With Ease",
      desc: "Create your learner profile in just a few steps. Gain instant access to our secure student dashboard and begin your personalized learning journey.",
      color: "#e3f2fd",
      iconColor: "#29b6f6",
    },
    {
      icon: <FaPenAlt />,
      title: "Choose Your Learning Path",
      desc: "Explore a wide range of expert-led programs tailored to your interests. Select the perfect course designed to match your goals and learning style.",
      color: "#fff8e1",
      iconColor: "#ffca28",
    },
    {
      icon: <FaDraftingCompass />,
      title: "Register & Start Learning",
      desc: "Complete your registration and dive into interactive lessons, live sessions, and progress-tracking tools designed for real-world learning success.",
      color: "#f3e5f5",
      iconColor: "#ba68c8",
    },
    {
      icon: <FaFlask />,
      title: "Track Progress & Achieve Success",
      desc: "Monitor your learning milestones in real-time through analytics dashboards. Earn certifications, stay motivated, and achieve your educational goals.",
      color: "#ffebee",
      iconColor: "#ef5350",
    },
  ];
return (
    <div className="enroll-wrapper">
      {/* ✅ SEO Metadata */}
      <Helmet>
        <title>Our Learning Process – Empowering Students Every Step of the Way</title>
        <meta
          name="description"
          content="Discover our structured 4-step learning process designed to help students enroll, learn, and achieve success through personalized, flexible, and measurable education."
        />
        <meta
          name="keywords"
          content="learning process, online education, student success, personalized learning, flexible courses"
        />
      </Helmet>

      {/* ✅ Visible Section Heading */}
      <h2 className="enroll-heading">
        Our Learning Process – Empowering Students Every Step of the Way
      </h2>

      {/* Existing 4-step cards */}
      <div className="enroll-container">
        {steps.map((step, index) => (
          <div
            key={index}
            className="enroll-card"
            style={{ backgroundColor: step.color }}
          >
            <div
              className="enroll-icon"
              style={{ color: step.iconColor, backgroundColor: "white" }}
            >
              {step.icon}
            </div>
            <h2>{step.title}</h2>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>


      {/* Zig-Zag Dotted Arrows */}
      <svg
        className="enroll-arrows"
        viewBox="0 0 1600 500"
        preserveAspectRatio="none"
      >
        {/* 1 -> 2 (Upward Curve) */}
        <path
          d="M 250 280 C 400 150, 500 150, 650 280"
          stroke="#29b6f6"
          strokeWidth="3"
          strokeDasharray="6 6"
          fill="transparent"
          markerEnd="url(#arrowhead)"
        />
        {/* 2 -> 3 (Downward Curve) */}
        <path
          d="M 650 280 C 800 400, 900 400, 1050 280"
          stroke="#ffca28"
          strokeWidth="3"
          strokeDasharray="6 6"
          fill="transparent"
          markerEnd="url(#arrowhead)"
        />
        {/* 3 -> 4 (Upward Curve) */}
        <path
          d="M 1050 280 C 1200 150, 1300 150, 1450 280"
          stroke="#ba68c8"
          strokeWidth="3"
          strokeDasharray="6 6"
          fill="transparent"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrowhead Definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default EnrollWithUs;
