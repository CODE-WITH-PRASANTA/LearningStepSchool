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
            <span className="currency">₹</span>75,000 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Travel & Transportion Fee</li>
            <li className="yes">Tuition Fee(All Subject)</li>
            <li className="yes">MidDay Meals & Healthy Snacks</li>
            <li className="yes">Unidrom,Books & Stationery</li>
            <li className="yes">Creative & Physical Activities</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        <div className="fee-card yellow animate delay-1">
          <div className="fee-header">Primary School</div>
          <div className="fee-price">
            <span className="currency">₹</span>95,000 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Full Transportation & Safety monitoring</li>
            <li className="yes">Comprehensive Tuition Fee (All Subject)</li>
            <li className="yes">Nutritious & Snacks</li>
            <li className="yes">Textbooks,WorkBooks & School Supplies</li>
            <li className="yes">Creative & Physical Activities</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        <div className="fee-card purple animate delay-2">
          <div className="fee-header">Middle School</div>
          <div className="fee-price">
            <span className="currency">₹</span>85,000 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Travel Bus Facility</li>
            <li className="yes"> All Subject Tuition Fees(STEM,Languages & Arts)</li>
            <li className="yes">Balanced Meals & Nutrition Support</li>
            <li className="yes">Dress Code & Eduational Material Kits </li>
            <li className="yes">Extracurricular Activity</li>
          </ul>
          <button className="fee-btn" onClick={handleRegisterClick}>
            Register
          </button>
        </div>

        <div className="fee-card red animate delay-3">
          <div className="fee-header">High School</div>
          <div className="fee-price">
            <span className="currency">₹</span>65,000 <small>/per year</small>
          </div>
          <ul>
            <li className="yes">Bus & Transportation Services</li>
            <li className="no">Tuition Fees (Selective Elective Only)</li>
            <li className="yes">Meals & Refreshments</li>
            <li className="yes">Books Uniform & Study Resorces</li>
            <li className="no">Optimal Club Activities(Separate Fee)</li>
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
