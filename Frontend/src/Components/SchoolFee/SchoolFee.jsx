import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import "./SchoolFee.css";

const SchoolFee = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleRegisterClick = () => {
    navigate("/register"); // ✅ Navigate to Register page
  };

  return (
    <section className="school-fee">
      <h2 className="fee-title">School Fee Information</h2>
      <span className="fee-line"></span>

      <div className="fee-cards">
        <div className="fee-card blue animate">
          <div className="fee-header">Kinder School</div>
          <div className="fee-price">
            <span className="currency">$</span>750 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Travel Bus Fees</li>
            <li className="yes">Tuition Fees All Subject</li>
            <li className="yes">Food & Snacks</li>
            <li className="yes">Dress & Books Notes</li>
            <li className="yes">Other Activities</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        <div className="fee-card yellow animate delay-1">
          <div className="fee-header">Small School</div>
          <div className="fee-price">
            <span className="currency">$</span>950 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Travel Bus Fees</li>
            <li className="yes">Tuition Fees All Subject</li>
            <li className="yes">Food & Snacks</li>
            <li className="yes">Dress & Books Notes</li>
            <li className="no">Other Activities</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        <div className="fee-card purple animate delay-2">
          <div className="fee-header">Middle School</div>
          <div className="fee-price">
            <span className="currency">$</span>850 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Travel Bus Fees</li>
            <li className="yes">Tuition Fees All Subject</li>
            <li className="yes">Food & Snacks</li>
            <li className="yes">Dress & Books Notes</li>
            <li className="yes">Other Activities</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        <div className="fee-card red animate delay-3">
          <div className="fee-header">High School</div>
          <div className="fee-price">
            <span className="currency">$</span>650 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Travel Bus Fees</li>
            <li className="no">Tuition Fees All Subject</li>
            <li className="yes">Food & Snacks</li>
            <li className="yes">Dress & Books Notes</li>
            <li className="no">Other Activities</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>
      </div>
    </section>
  );
};

export default SchoolFee;
