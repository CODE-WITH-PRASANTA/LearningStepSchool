import React from 'react';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import './MonthlyAttendance.css'; // Importing the updated CSS file

const MonthlyAttendance = () => {
  // Mock data representing the 31 calendar days
  const days = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    if (dayNum === 17) return { day: dayNum, status: 'absent' };
    if (dayNum === 18 || dayNum === 20) return { day: dayNum, status: 'present' };
    if (dayNum === 19) return { day: dayNum, status: 'late' };
    return { day: dayNum, status: 'default' };
  });

  // Determines the specific state class for each date box
  const getBoxStatusClass = (status) => {
    switch (status) {
      case 'present': return 'status-present';
      case 'absent': return 'status-absent';
      case 'late': return 'status-late';
      default: return 'status-default';
    }
  };

  return (
    <div className="attendance-container">
      
      {/* Header & Breadcrumbs Area */}
      <div className="attendance-header">
        <h1>Monthly Attendance</h1>
        <div className="breadcrumbs">
          <FiHome className="home-icon" size={14} />
          <FiChevronRight className="separator" />
          <span className="link">Attendance</span>
          <FiChevronRight className="separator" />
          <span className="current-page">Monthly Attendance</span>
        </div>
      </div>

      {/* Top Statistical Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card card-present">
          <p>Total Present</p>
          <p className="stat-number">15</p>
        </div>
        <div className="stat-card card-absent">
          <p>Total Absent</p>
          <p className="stat-number">2</p>
        </div>
        <div className="stat-card card-late">
          <p>Late Arrivals</p>
          <p className="stat-number">3</p>
        </div>
        <div className="stat-card card-halfday">
          <p>Half Days</p>
          <p className="stat-number">0</p>
        </div>
      </div>

      {/* Main Calendar Panel */}
      <div className="calendar-panel">
        <h2>January 2026</h2>
        
        {/* Date Box Grid */}
        <div className="calendar-grid">
          {days.map((item) => (
            <div 
              key={item.day} 
              className={`date-box ${getBoxStatusClass(item.status)}`}
            >
              {item.day}
            </div>
          ))}
        </div>

        {/* Legend / Status Indicators Footnote */}
        <div className="legend-container">
          <div className="legend-item">
            <span className="legend-dot dot-present" />
            <span>Present</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-absent" />
            <span>Absent</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-late" />
            <span>Late</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-halfday" />
            <span>Half Day</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlyAttendance;