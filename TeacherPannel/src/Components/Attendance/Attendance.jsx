import React, { useState, useEffect, useRef } from 'react';
import './Attendance.css'; // Make sure the CSS file is in the same directory

const Attendance = () => {
  const [activeFilter, setActiveFilter] = useState('this-month');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Map system identifiers to clean display text
  const filterLabels = {
    'this-week': 'This Week',
    'this-month': 'This Month',
    'three-months': '3 Months'
  };

  // Close dropdown if clicked outside the element
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock data based directly on your images
  const attendanceData = [
    {
      date: "Tuesday, January 20, 2026",
      status: "Present",
      statusType: "present",
      checkIn: "09:05 AM",
      checkOut: "-",
      duration: "-",
      shift: "General",
      note: ""
    },
    {
      date: "Monday, January 19, 2026",
      status: "Late",
      statusType: "late",
      checkIn: "09:15 AM",
      checkOut: "06:10 PM",
      duration: "8h 55m",
      shift: "General",
      note: "Heavy traffic."
    },
    {
      date: "Sunday, January 18, 2026",
      status: "Present",
      statusType: "present",
      checkIn: "08:55 AM",
      checkOut: "06:05 PM",
      duration: "9h 10m",
      shift: "General",
      note: ""
    },
    {
      date: "Saturday, January 17, 2026",
      status: "Absent",
      statusType: "absent",
      checkIn: "-",
      checkOut: "-",
      duration: "0h 0m",
      shift: "General",
      note: "Sick leave."
    }
  ];

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
            placeholder="Search Date or Status" 
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
              <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            
            {isDropdownOpen && (
              <div className="dropdown-menu-list">
                <button 
                  className={`dropdown-item ${activeFilter === 'this-week' ? 'selected' : ''}`}
                  onClick={() => { setActiveFilter('this-week'); setIsDropdownOpen(false); }}
                >
                  This Week
                </button>
                <button 
                  className={`dropdown-item ${activeFilter === 'this-month' ? 'selected' : ''}`}
                  onClick={() => { setActiveFilter('this-month'); setIsDropdownOpen(false); }}
                >
                  This Month
                </button>
                <button 
                  className={`dropdown-item ${activeFilter === 'three-months' ? 'selected' : ''}`}
                  onClick={() => { setActiveFilter('three-months'); setIsDropdownOpen(false); }}
                >
                  3 Months
                </button>
              </div>
            )}
          </div>
          <span className="records-count">Showing {attendanceData.length} records</span>
        </div>
      </div>

      {/* Timeline List Section */}
      <div className="attendance-timeline">
        {attendanceData.map((record, index) => (
          <div key={index} className="timeline-item">
            {/* Left timeline indicator node */}
            <div className="timeline-node">
              <div className="node-circle"></div>
              {index !== attendanceData.length - 1 && <div className="node-line"></div>}
            </div>

            {/* Right card content details */}
            <div className="attendance-card">
              <div className="card-header">
                <h3 className="card-date">{record.date}</h3>
                <span className={`status-badge badge-${record.statusType}`}>
                  {record.status}
                </span>
              </div>

              <div className="card-grid">
                <div className="grid-col">
                  <span className="col-label">Check In</span>
                  <span className="col-value">{record.checkIn}</span>
                </div>
                <div className="grid-col">
                  <span className="col-label">Check Out</span>
                  <span className="col-value">{record.checkOut}</span>
                </div>
                <div className="grid-col">
                  <span className="col-label">Duration</span>
                  <span className="col-value">{record.duration}</span>
                </div>
                <div className="grid-col">
                  <span className="col-label">Shift</span>
                  <span className="col-value">{record.shift}</span>
                </div>
              </div>

              {record.note && (
                <div className="card-footer-note">
                  Note: {record.note}
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