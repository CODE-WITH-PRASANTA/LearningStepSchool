import React from "react";
import schoolLogo from "../../Assets/Learning-Step-Logo-1.png";

const GatePassPrintModal = ({ item, onClose }) => {
  return (
    <div className="print-overlay">
      <div className="print-card">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        <div className="print-header">
          <img src={schoolLogo} className="school-logo" alt="" />
          <h3>Gate Pass</h3>
        </div>

        <div className="print-body">
          <p><b>Student:</b> {item.student}</p>
          <p><b>Person:</b> {item.person}</p>
          <p><b>In Time:</b> {item.inTime}</p>
          <p><b>Out Time:</b> {item.outTime}</p>
          <p><b>Reason:</b> {item.note}</p>

          {item.image && (
            <img src={item.image} className="print-img" alt="" />
          )}
        </div>

        <button onClick={() => window.print()} className="btn-primary">
          Print Now
        </button>
      </div>
    </div>
  );
};

export default GatePassPrintModal;
