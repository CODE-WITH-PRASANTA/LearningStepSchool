import React, { useState, useEffect, useRef } from "react";
import "./Attendance.css"; // Make sure the CSS file is in the same directory
import API from "../../api/axios";
const Attendance = () => {
  const [activeFilter, setActiveFilter] = useState("this-month");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [attendanceData, setAttendanceData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const loadAttendanceHistory = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/teacher-attendance/history?period=${activeFilter}&search=${search}`,
      );

      setAttendanceData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceHistory();
  }, [activeFilter, search]);

  // Map system identifiers to clean display text
  const filterLabels = {
    "this-week": "This Week",
    "this-month": "This Month",
    "three-months": "3 Months",
  };

  // Close dropdown if clicked outside the element
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDuration = (seconds = 0) => {
    if (!seconds) return "--";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = "";

    if (hrs > 0) result += `${hrs}h `;
    if (mins > 0) result += `${mins}m `;
    if (secs > 0) result += `${secs}s`;

    return result.trim();
  };

  if (loading) {
    return (
      <div className="attendance-container">
        <h2>Loading Attendance History...</h2>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      {/* Header Breadcrumb Section */}
      <header className="attendance-header">
        <h1 className="attendance-title">Attendance History</h1>
        <div className="attendance-breadcrumb">
          <span className="breadcrumb-icon">🏠</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span>Attendance</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-active">History</span>
        </div>
      </header>

      {/* Filter and Search Bar Section */}
      <div className="attendance-toolbar">
        <div className="search-box-wrapper">
          <input
            type="text"
            placeholder="Search Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="toolbar-right">
          {/* Replaced Filter Buttons with a Dropdown Menu */}
          <div className="filter-dropdown-container" ref={dropdownRef}>
            <button
              className="dropdown-trigger-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
            >
              <span>{filterLabels[activeFilter]}</span>
              <span
                className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
              >
                ▼
              </span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu-list">
                <button
                  className={`dropdown-item ${activeFilter === "this-week" ? "selected" : ""}`}
                  onClick={() => {
                    setActiveFilter("this-week");
                    setIsDropdownOpen(false);
                  }}
                >
                  This Week
                </button>
                <button
                  className={`dropdown-item ${activeFilter === "this-month" ? "selected" : ""}`}
                  onClick={() => {
                    setActiveFilter("this-month");
                    setIsDropdownOpen(false);
                  }}
                >
                  This Month
                </button>
                <button
                  className={`dropdown-item ${activeFilter === "three-months" ? "selected" : ""}`}
                  onClick={() => {
                    setActiveFilter("three-months");
                    setIsDropdownOpen(false);
                  }}
                >
                  3 Months
                </button>
              </div>
            )}
          </div>
          <span className="records-count">
            Showing {attendanceData.length} records
          </span>
        </div>
      </div>

      {/* Timeline List Section */}
      <div className="attendance-timeline">
        {attendanceData.map((record, index) => (
          <div key={record._id} className="timeline-item">
            {/* Left timeline indicator node */}
            <div className="timeline-node">
              <div className="node-circle"></div>
              {index !== attendanceData.length - 1 && (
                <div className="node-line"></div>
              )}
            </div>

            {/* Right card content details */}
            <div className="attendance-card">
              <div className="card-header">
                <h3 className="card-date">
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <span
                  className={`status-badge badge-${record.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {record.status}
                </span>
              </div>

              <div className="card-grid">
                <div className="grid-col">
                  <span className="col-label">Check In</span>
                  <span className="col-value">
                    {record.punchIn
                      ? new Date(record.punchIn).toLocaleTimeString()
                      : "--"}
                  </span>
                </div>
                <div className="grid-col">
                  <span className="col-label">Check Out</span>
                  <span className="col-value">
                    {record.punchOut
                      ? new Date(record.punchOut).toLocaleTimeString()
                      : "--"}
                  </span>
                </div>
                <div className="grid-col">
                  <span className="col-label">Duration</span>
                  <span className="col-value">
                    {formatDuration(record.workSeconds)}
                  </span>
                </div>
                <div className="grid-col">
                  <span className="col-label">Shift</span>
                  <span className="col-value">{record.shift || "General"}</span>
                </div>
              </div>

              {record.breaks?.length > 0 && (
                <div className="card-footer-note">
                  Total Breaks :<strong>{record.breaks.length}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attendance;
