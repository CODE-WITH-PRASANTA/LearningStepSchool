import React, { useEffect, useState } from "react";
import "./HowToApplySection.css";
import { FaCheckCircle, FaBookOpen } from "react-icons/fa";
import applyImage from "../../assets/how-to-apply.jpg"; // ⚠️ Replace with your image path

export default function HowToApplySection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = document.querySelector(".how-apply-section");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`how-apply-section ${isVisible ? "animate" : ""}`}
      id="how-to-apply"
    >
      <div className="how-apply-container">
        {/* LEFT SIDE CONTENT */}
        <div className="how-apply-left">
          <h6 className="apply-subtitle">
            <FaBookOpen className="apply-icon" /> HOW TO APPLY
          </h6>
          <h2 className="apply-title">
            Details About <span>How To Apply</span> Learning Step school.
          </h2>

          <p className="apply-desc">
           Choosing the right school is one of the most important decisions for your child’s future.
At Learning Step School, we believe that education begins with understanding — that’s why our application process is designed to give parents and students time, clarity, and personal support.</p>
          <p className="apply-desc">
            You can start your admission journey online, submit all documents digitally, and track every update through our admissions portal.
We encourage parents to visit our campus, meet our counselors, and experience how Learning Step School nurtures curiosity, creativity, and confidence in every learner.
          </p>

          <div className="apply-checklist">
            <ul>
              <li>
                <FaCheckCircle /> Start Online Submission
              </li>
              <li>
                <FaCheckCircle /> Submit the Application Form
              </li>
              <li>
                <FaCheckCircle /> Review and Verification
              </li>
            </ul>
            <ul>
              <li>
                <FaCheckCircle /> Document Submission
              </li>
              <li>
                <FaCheckCircle /> Interaction & Evaluation
              </li>
              <li>
                <FaCheckCircle /> Final Submission Decision
              </li>
            </ul>
          </div>

          <button className="apply-btn">Apply Now →</button>
        </div>

        {/* RIGHT SIDE IMAGE WITH BACKGROUND SHAPE */}
        <div className="how-apply-right">
          <div className="image-wrapper">
            <div className="image-bg-shape"></div>
            <div className="content-img">
              <img src={applyImage} alt="How to Apply" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
