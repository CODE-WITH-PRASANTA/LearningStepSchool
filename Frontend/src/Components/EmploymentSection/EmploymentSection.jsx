import React, { useState, useEffect } from "react";
import "./EmploymentSection.css";

const stepsData = [
  {
    title: "Contact",
    description:
      "Parents can reach Learning Step International School through phone, email, or campus visit to get complete information about preschool programs, facilities, and admissions.",
  },
  {
    title: "Application",
    description:
      "Submit the admission application with basic child details to begin the preschool enrollment process smoothly and efficiently.",
  },
  {
    title: "Counseling",
    description:
      "Our experienced educators guide parents through curriculum options, child development goals, and the best learning approach for their child.",
  },
  {
    title: "Admission",
    description:
      "After review, admission is confirmed based on age eligibility and program availability, ensuring the right learning environment for every child.",
  },
  {
    title: "Registration",
    description:
      "Complete the final registration process to secure your child’s place in our nurturing and child-friendly international school.",
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
        <p>Simple Admission Process Focused on Your Child’s Growth</p>
        <span class="enroll-underline"></span>
        
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
