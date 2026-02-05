import React, { useState, useEffect } from "react";
import "./EmploymentSection.css";

const stepsData = [
  {
    title: "Contact",
    description:
      "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  },
  {
    title: "Application",
    description:
      "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  },
  {
    title: "Counseling",
    description:
      "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  },
  {
    title: "Admission",
    description:
      "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  },
  {
    title: "Registration",
    description:
      "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.",
  },
];

const EmploymentSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let interval;
    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % stepsData.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [autoPlay]);

  const goPrev = () => {
    setCurrentStep((prev) => (prev - 1 + stepsData.length) % stepsData.length);
  };

  const goNext = () => {
    setCurrentStep((prev) => (prev + 1) % stepsData.length);
  };

  return (
    <section
      className="employment-section"
      onMouseEnter={() => setAutoPlay(true)}
      onMouseLeave={() => setAutoPlay(false)}
    >
      {/* ===== HEADER ===== */}
      <div className="employment-header">
        <h2>ENROLLMENT</h2>
        <p>Steps done with heart, soul, mind & strength</p>
        <div className="divider">
          <span></span>
        </div>
      </div>

      {/* ===== STEPS ===== */}
      <div className="steps-wrapper">
        {/* Animated line */}
        <div
          className="steps-line"
          style={{
            width: `${(currentStep / (stepsData.length - 1)) * 100}%`,
          }}
        ></div>

        {stepsData.map((step, index) => {
          const isActive = index === currentStep;
          const isPassed = index < currentStep;
          const colorClass =
            index % 2 === 0 ? "blue-step" : "orange-step"; // 1,3,5 blue / 2,4 orange

          return (
            <div
              key={index}
              className={`step ${isActive ? "active-step" : ""} ${
                isPassed ? "passed-step" : ""
              }`}
            >
              <div
                className={`step-circle ${colorClass} ${
                  isActive ? "active" : isPassed ? "passed" : ""
                }`}
              >
                {index + 1}
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="step-controls">
        <button onClick={goPrev}>PREV</button>
        <button onClick={goNext}>NEXT</button>
      </div>
    </section>
  );
};

export default EmploymentSection;
