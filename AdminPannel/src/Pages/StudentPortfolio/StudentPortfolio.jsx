import React from "react";
import "./StudentPortfolio.css";

const StudentPortfolio = () => {
  return (
    <div className="student-portfolio-container">

      {/* ================= HEADER ================= */}

      <div className="student-portfolio-header-section">

        <div className="student-portfolio-title-wrapper">
          <h2 className="student-portfolio-main-title">
            Student Portfolio
          </h2>
        </div>

        <div className="student-portfolio-search-wrapper">
          <input
            type="text"
            className="student-portfolio-search-input"
            placeholder="Search Student..."
          />
        </div>

      </div>

      {/* ================= TOP CARDS ================= */}

      <div className="student-portfolio-top-grid-section">

        {/* ================= STUDENT INFO CARD ================= */}

        <div className="student-portfolio-card student-portfolio-student-card">

          <div className="student-portfolio-card-header student-portfolio-card-header-blue">
            Student Information
          </div>

          <div className="student-portfolio-student-info-section">

            <div className="student-portfolio-student-image-wrapper">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Student"
                className="student-portfolio-student-image"
              />
            </div>

            <div className="student-portfolio-student-details">

              <h3 className="student-portfolio-student-name">
                N/A
              </h3>

              <p className="student-portfolio-student-class">
                Class : N/A
              </p>

              <div className="student-portfolio-student-badge-wrapper">

                <span className="student-portfolio-student-badge">
                  🚌 Transport
                </span>

                <span className="student-portfolio-student-badge">
                  🏫 Hostel
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= RESULT CARD ================= */}

        <div className="student-portfolio-card student-portfolio-result-card">

          <div className="student-portfolio-card-header student-portfolio-card-header-orange">
            Student Result
          </div>

          <div className="student-portfolio-result-section">

            <button className="student-portfolio-result-button">
              Show Result
            </button>

          </div>

        </div>

        {/* ================= TRANSPORT + HOSTEL WRAPPER ================= */}

        <div className="student-portfolio-transport-hostel-wrapper">

          {/* ================= TRANSPORT CARD ================= */}

          <div className="student-portfolio-card student-portfolio-transport-card">

            <div className="student-portfolio-card-header student-portfolio-card-header-yellow">
              Transport Information
            </div>

            <div className="student-portfolio-transport-info-section">

              <div className="student-portfolio-transport-item">

                <span className="student-portfolio-transport-label">
                  Vehicle
                </span>

                <span className="student-portfolio-transport-value">
                  N/A
                </span>

              </div>

              <div className="student-portfolio-transport-item">

                <span className="student-portfolio-transport-label">
                  Vehicle No
                </span>

                <span className="student-portfolio-transport-value">
                  N/A
                </span>

              </div>

              <div className="student-portfolio-transport-item">

                <span className="student-portfolio-transport-label">
                  Route
                </span>

                <span className="student-portfolio-transport-value">
                  N/A
                </span>

              </div>

              <div className="student-portfolio-transport-item">

                <span className="student-portfolio-transport-label">
                  Destination
                </span>

                <span className="student-portfolio-transport-value">
                  N/A
                </span>

              </div>

            </div>

          </div>

          {/* ================= HOSTEL CARD SIDE ================= */}

          <div className="student-portfolio-card student-portfolio-hostel-card-main">

            <div className="student-portfolio-card-header student-portfolio-card-header-pink">
              Hostel Information
            </div>

            <div className="student-portfolio-hostel-info-section">

              <div className="student-portfolio-hostel-info-item">

                <span className="student-portfolio-hostel-label">
                  Hostel
                </span>

                <span className="student-portfolio-hostel-value">
                  N/A
                </span>

              </div>

              <div className="student-portfolio-hostel-info-item">

                <span className="student-portfolio-hostel-label">
                  Block
                </span>

                <span className="student-portfolio-hostel-value">
                  N/A
                </span>

              </div>

              <div className="student-portfolio-hostel-info-item">

                <span className="student-portfolio-hostel-label">
                  Floor
                </span>

                <span className="student-portfolio-hostel-value">
                  N/A
                </span>

              </div>

              <div className="student-portfolio-hostel-info-item">

                <span className="student-portfolio-hostel-label">
                  Room
                </span>

                <span className="student-portfolio-hostel-value">
                  N/A
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= PARENT SECTION ================= */}

      <div className="student-portfolio-section-container">

        <div className="student-portfolio-section-header">

          <h2 className="student-portfolio-section-title">
            Parents & Guardian Details
          </h2>

        </div>

        {/* ================= HORIZONTAL SCROLL CARDS ================= */}

        <div className="student-portfolio-horizontal-scroll-wrapper">

          {[1, 2, 3, 4].map((item) => (
            <div
              className="student-portfolio-profile-card"
              key={item}
            >

              <div className="student-portfolio-profile-image-wrapper">

                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Guardian"
                  className="student-portfolio-profile-image"
                />

              </div>

              <div className="student-portfolio-profile-details">

                <h4 className="student-portfolio-profile-name">
                  N/A
                </h4>

                <p className="student-portfolio-profile-role">
                  N/A
                </p>

                <span className="student-portfolio-profile-contact">
                  N/A
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* ================= PROGRESS SECTION ================= */}

      <div className="student-portfolio-progress-grid-section">

        <div className="student-portfolio-progress-card">

          <div className="student-portfolio-progress-top-section">

            <span className="student-portfolio-progress-title">
              Attendance
            </span>

            <strong className="student-portfolio-progress-value">
              0%
            </strong>

          </div>

          <div className="student-portfolio-progress-bar-wrapper">

            <div
              className="student-portfolio-progress-bar-fill"
              style={{ width: "0%" }}
            ></div>

          </div>

        </div>

        <div className="student-portfolio-progress-card">

          <div className="student-portfolio-progress-top-section">

            <span className="student-portfolio-progress-title">
              Fees
            </span>

            <strong className="student-portfolio-progress-value">
              0%
            </strong>

          </div>

          <div className="student-portfolio-progress-bar-wrapper">

            <div
              className="student-portfolio-progress-bar-fill"
              style={{ width: "0%" }}
            ></div>

          </div>

        </div>

      </div>

      {/* ================= FEES SECTION ================= */}

      <div className="student-portfolio-fees-layout-section">

        <div className="student-portfolio-fees-card">

          <div className="student-portfolio-fees-card-header">

            <h3 className="student-portfolio-fees-title">
              Fees
            </h3>

            <div className="student-portfolio-fees-status">

              Paid

              <span className="student-portfolio-fees-paid">
                0%
              </span>

              •

              Due

              <span className="student-portfolio-fees-due">
                0%
              </span>

            </div>

          </div>

          <div className="student-portfolio-fees-chart-area">
            Chart Area
          </div>

        </div>

        <div className="student-portfolio-fees-reminder-card">

          <h3 className="student-portfolio-fees-reminder-title">
            Fee Reminder
          </h3>

        </div>

      </div>

      {/* ================= HOMEWORK SECTION ================= */}

      <div className="student-portfolio-table-section">

        <div className="student-portfolio-table-header">

          <h3 className="student-portfolio-table-title">
            Homework
          </h3>

          <button className="student-portfolio-view-all-button">
            View All
          </button>

        </div>

      </div>

      {/* ================= GATE PASS SECTION ================= */}

      <div className="student-portfolio-table-section">

        <div className="student-portfolio-table-main-header">

          <h3 className="student-portfolio-table-title">
            Gate Pass
          </h3>

        </div>

        <div className="student-portfolio-table-responsive">

          <table className="student-portfolio-main-table">

            <thead className="student-portfolio-main-table-head">

              <tr className="student-portfolio-main-table-row">

                <th className="student-portfolio-main-table-heading">
                  Photo
                </th>

                <th className="student-portfolio-main-table-heading">
                  Visitor Name
                </th>

                <th className="student-portfolio-main-table-heading">
                  Relation
                </th>

                <th className="student-portfolio-main-table-heading">
                  Contact
                </th>

                <th className="student-portfolio-main-table-heading">
                  Date
                </th>

                <th className="student-portfolio-main-table-heading">
                  Time
                </th>

                <th className="student-portfolio-main-table-heading">
                  Purpose
                </th>

                <th className="student-portfolio-main-table-heading">
                  Issuer
                </th>

              </tr>

            </thead>

          </table>

        </div>

      </div>

      {/* ================= COMPLAINT SECTION ================= */}

      <div className="student-portfolio-table-section">

        <div className="student-portfolio-table-main-header">

          <h3 className="student-portfolio-table-title">
            Student Complaint
          </h3>

        </div>

        <div className="student-portfolio-table-responsive">

          <table className="student-portfolio-main-table">

            <thead className="student-portfolio-main-table-head">

              <tr className="student-portfolio-main-table-row">

                <th className="student-portfolio-main-table-heading">
                  Person Name
                </th>

                <th className="student-portfolio-main-table-heading">
                  By
                </th>

                <th className="student-portfolio-main-table-heading">
                  Complaint
                </th>

                <th className="student-portfolio-main-table-heading">
                  Feedback
                </th>

                <th className="student-portfolio-main-table-heading">
                  Date
                </th>

                <th className="student-portfolio-main-table-heading">
                  Status
                </th>

              </tr>

            </thead>

          </table>

        </div>

      </div>

    </div>
  );
};

export default StudentPortfolio;