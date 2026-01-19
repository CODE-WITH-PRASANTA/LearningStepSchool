import React, { useEffect } from "react";
import "./KnowAndAid.css";
import { FaCheckCircle, FaFileAlt } from "react-icons/fa";

const KnowAndAid = () => {
  useEffect(() => {
    // Animation for the "FEATURES" label
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-visible");
          }
        });
      },
      { threshold: 0.5 }
    );

    const label = document.querySelector(".features-label span");
    if (label) observer.observe(label);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="know-section">
      <div className="know-container">
        {/* LEFT COLUMN */}
        <div className="know-left">
          <h2>Things To Know First</h2>
          <p>
           Our school follows a student-centered approach that combines the latest CBSE curriculum standards with creative teaching methods. We focus on concept-based learning, digital classrooms, and activity-driven sessions to ensure holistic growth for every child.
          </p>
          <p>
          We also maintain a limited student–teacher ratio, giving every learner personalized attention, emotional support, and space to grow.
          Parents are encouraged to be active partners in their child’s progress through regular interactions, workshops, and open-house sessionsChoosing Learning Step School means choosing a place where your child feels seen, heard, and inspired every day.</p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="know-right">
          <div className="know-right-header">
          
            <h2>Documents And Financial Aid</h2>
          </div>

          {/* Paragraph under heading */}
          <p className="right-desc">
           To ensure a smooth admission process at Learning Step School, we request all parents to submit valid and updated documentation at the time of application.
           Our admission office is available to assist families with every step — including form completion, fee structure guidance, and financial aid queries.
          </p>

          {/* Checklist points */}
          <ul className="know-checklist">
            <li>
              <FaCheckCircle className="check-icon" />
             Birth Certificate (Original & Photocopy)
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              Recent Passport-Size Photographs (Student & Parents)
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
             Transfer Certificate (for Grades II & above)
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
             Previous Academic Record / Report Card
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
            Address & ID Proof of Parents / Guardians
            </li>
             <li>
              <FaCheckCircle className="check-icon" />
            Medical Fitness Certificate
            </li>
          </ul>
        </div>
      </div>

    </section>
  );
};

export default KnowAndAid;
