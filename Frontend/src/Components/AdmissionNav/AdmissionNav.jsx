import React from "react";
import "./AdmissionNav.css";

const years = [
  "Admissions Open 2024–25",
  "Admissions Open 2025–26",
  "Admissions Open 2026–27",
  "Admissions Open 2027–28",
];

const AdmissionTicker = () => {
  return (
    <div className="admission-ticker">
      <div className="ticker-track">
        {[...years, ...years].map((item, index) => (
          <button key={index} className="ticker-btn">
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdmissionTicker;
