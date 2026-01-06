import React from "react";
import "./EnrollWithUs.css";

const EnrollWithUs = () => {
  return (
    <section className="enroll">
      <h2 className="enroll-title">Enroll with Us</h2>
      <span className="enroll-line"></span>

      <div className="enroll-steps">
        {/* STEP 1 */}
        <div className="step-wrap">
          <div className="step step-blue">
            <div className="icon blue">
              <svg viewBox="0 0 24 24">
                <path d="M12 3C8 3 5 6 5 10c0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z" />
              </svg>
            </div>
            <h3>Create User</h3>
            <p>Cum sociis natoque penatibus et magnis dis parturient montes.</p>
          </div>
          <span className="arrow blue"></span>
        </div>

        {/* STEP 2 */}
        <div className="step-wrap">
          <div className="step step-yellow">
            <div className="icon yellow">
              <svg viewBox="0 0 24 24">
                <path d="M3 3h18v18H3z" />
              </svg>
            </div>
            <h3>Select Course</h3>
            <p>Cum sociis natoque penatibus et magnis dis parturient montes.</p>
          </div>
          <span className="arrow yellow"></span>
        </div>

        {/* STEP 3 */}
        <div className="step-wrap">
          <div className="step step-purple">
            <div className="icon purple">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" />
              </svg>
            </div>
            <h3>Registration</h3>
            <p>Cum sociis natoque penatibus et magnis dis parturient montes.</p>
          </div>
          <span className="arrow purple"></span>
        </div>

        {/* STEP 4 */}
        <div className="step step-red">
          <div className="icon red">
            <svg viewBox="0 0 24 24">
              <path d="M6 2h12l-2 20H8z" />
            </svg>
          </div>
          <h3>Track Status</h3>
          <p>Cum sociis natoque penatibus et magnis dis parturient montes.</p>
        </div>
      </div>
    </section>
  );
};

export default EnrollWithUs;
