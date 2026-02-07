import React from "react";
import schoolLogo from "../../Assets/Learning-Step-Logo-1.png";

const GatePassPrintModal = ({ item, onClose }) => {
  return (
    <div className="print-overlay">

      <div className="print-wrapper">

        {/* ===== TOP BAR ===== */}
        <div className="print-top">

          <div
            className="print-icon"
            onClick={() => window.print()}
            title="Print"
          >
            🖨
          </div>

          <span>Gate Pass</span>

          <button className="print-close" onClick={onClose}>✖</button>
        </div>

        {/* ===== ID CARD ===== */}
        <div className="id-card">

          {/* HEADER */}
          <div className="id-header">

            <img src={schoolLogo} className="id-logo" alt="logo" />

            <div className="id-title">
              NLET - INSTITUTE MANAGEMENT SOFTWARE
              <div className="id-sub">
                ( GATE PASS #{item.id} )
              </div>
            </div>

          </div>

          {/* BODY */}
          <div className="id-body">

            <div className="id-info">

              <p>
                <b>Student Name :</b> {item.name}
              </p>

              <p>
                <b>Name of Person Carrying Student :</b> {item.person}
              </p>

              <p>
                <b>In / Out Time :</b> {item.inTime} / {item.outTime}
              </p>

              <p>
                <b>Reason :</b> {item.note}
              </p>

            </div>

            <div className="id-photo">

              {item.image ? (
                <img src={item.image} alt="student" />
              ) : (
                <div className="photo-placeholder">Student Photo</div>
              )}

              <span>Student Photo</span>

            </div>

          </div>

          {/* FOOTER */}
          <div className="id-footer">

            <span>
              19-K-4, Jyoti Nagar Jaipur Rajasthan - 302005
            </span>

            <span className="sign-text">
              Authorization Sign
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default GatePassPrintModal;
