import React from "react";
import "./EmploymentSection.css";

const EmploymentSection = () => {
  return (
    <section className="employment-section">
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
        <div className="steps-line"></div>

        <div className="step">
          <div className="step-circle blue">1</div>
          <h3>Contact</h3>
          <p>
            Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>
        </div>

        <div className="step">
          <div className="step-circle orange">2</div>
          <h3>Application</h3>
          <p>
            Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>
        </div>

        <div className="step">
          <div className="step-circle blue">3</div>
          <h3>Counseling</h3>
          <p>
            Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>
        </div>

        <div className="step">
          <div className="step-circle orange">4</div>
          <h3>Admission</h3>
          <p>
            Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam.
          </p>
        </div>
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="step-controls">
        <button>PREV</button>
        <button>NEXT</button>
      </div>
    </section>
  );
};

export default EmploymentSection;
