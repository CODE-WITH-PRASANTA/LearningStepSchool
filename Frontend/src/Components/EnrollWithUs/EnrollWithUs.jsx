import React from "react";
import "./EnrollWithUs.css";
import { FaAppleAlt, FaPenAlt, FaDraftingCompass, FaFlask } from "react-icons/fa";

const EnrollWithUs = () => {
  const steps = [
    {
      icon: <FaAppleAlt />,
      title: "Create User",
      desc: "Cum sociis natoque penatibus et magnis dis parturient montes.",
      color: "#e3f2fd",
      iconColor: "#29b6f6",
    },
    {
      icon: <FaPenAlt />,
      title: "Select Course",
      desc: "Cum sociis natoque penatibus et magnis dis parturient montes.",
      color: "#fff8e1",
      iconColor: "#ffca28",
    },
    {
      icon: <FaDraftingCompass />,
      title: "Registration",
      desc: "Cum sociis natoque penatibus et magnis dis parturient montes.",
      color: "#f3e5f5",
      iconColor: "#ba68c8",
    },
    {
      icon: <FaFlask />,
      title: "Track Status",
      desc: "Cum sociis natoque penatibus et magnis dis parturient montes.",
      color: "#ffebee",
      iconColor: "#ef5350",
    },
  ];

  return (
    <div className="enroll-wrapper">
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
      <svg className="enroll-arrows" viewBox="0 0 1600 500" preserveAspectRatio="none">
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
