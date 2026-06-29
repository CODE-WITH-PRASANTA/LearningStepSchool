import React, { useEffect, useState } from "react";
import "./TeacherAttenanced.css";

import {
  FaSignInAlt,
  FaSignOutAlt,
  FaCoffee,
  FaPlayCircle,
  FaHome,
  FaChevronRight,
  FaClock,
  FaBusinessTime,
  FaMugHot,
  FaHistory
} from "react-icons/fa";

const TeacherAttenanced = () => {
  /* =====================================================
      SHIFT CONFIGURATION
  ====================================================== */
  const SHIFT_START = "09:00 AM";
  const SHIFT_END = "06:00 PM";
  const SHIFT_WORK_SECONDS = 8 * 60 * 60; 

  /* =====================================================
      STATES
  ====================================================== */
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [punchOutTime, setPunchOutTime] = useState(null);

  const [workingSeconds, setWorkingSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0); 
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [activities, setActivities] = useState([]);

  /* =====================================================
      LOCAL STORAGE SYSTEM
  ====================================================== */
  useEffect(() => {
    const saved = localStorage.getItem("teacherAttendance");
    if (!saved) {
      setActivities([
        { id: 2, title: "Punched Out", time: "12:42 PM" },
        { id: 1, title: "Punched In", time: "12:41 PM" }
      ]);
      return;
    }

    const data = JSON.parse(saved);
    setIsPunchedIn(data.isPunchedIn ?? false);
    setIsBreak(data.isBreak ?? false);
    setPunchInTime(data.punchInTime ?? null);
    setPunchOutTime(data.punchOutTime ?? null);
    setWorkingSeconds(data.workingSeconds ?? 0);
    setBreakSeconds(data.breakSeconds ?? 0);
    setOvertimeSeconds(data.overtimeSeconds ?? 0);
    if (data.activities) setActivities(data.activities);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "teacherAttendance",
      JSON.stringify({
        isPunchedIn,
        isBreak,
        punchInTime,
        punchOutTime,
        workingSeconds,
        breakSeconds,
        overtimeSeconds,
        activities,
      })
    );
  }, [isPunchedIn, isBreak, punchInTime, punchOutTime, workingSeconds, breakSeconds, overtimeSeconds, activities]);

  /* =====================================================
      DYNAMIC ACTIVE TIMERS ENGINE
  ====================================================== */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (isPunchedIn && !isBreak) {
      timer = setInterval(() => {
        setWorkingSeconds((prev) => {
          const updatedWork = prev + 1;
          if (updatedWork > SHIFT_WORK_SECONDS) {
            setOvertimeSeconds(updatedWork - SHIFT_WORK_SECONDS);
          }
          return updatedWork;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPunchedIn, isBreak]);

  useEffect(() => {
    let timer;
    if (isBreak) {
      timer = setInterval(() => {
        setBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreak]);

  /* =====================================================
      STRING & MATH FORMATTERS
  ====================================================== */
  const formatSecondsToHoursMins = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return "0h 00m";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs}h ${String(mins).padStart(2, "0")}m`;
  };

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const [rawTime, amPm] = timeString.split(" ");

  const addActivity = (title) => {
    const item = {
      id: Date.now(),
      title,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
    setActivities((prev) => [item, ...prev]);
  };

  /* =====================================================
      EVENT HANDLERS
  ====================================================== */
  const handlePunchIn = () => {
    setIsPunchedIn(true);
    setIsBreak(false);
    setPunchInTime(new Date().toLocaleTimeString());
    addActivity("Punched In");
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    setIsBreak(false);
    setPunchOutTime(new Date().toLocaleTimeString());
    addActivity("Punched Out");
  };

  const toggleBreak = () => {
    if (!isBreak) {
      setIsBreak(true);
      addActivity("Break Started");
    } else {
      setIsBreak(false);
      addActivity("Break Ended");
    }
  };

  const attendanceStatus = isPunchedIn
    ? isBreak
      ? "On Break"
      : "Working"
    : "Not Punched In";

  return (
    <div className="attendance-page-wrapper">
      {/* Top Header Navigation */}
      <div className="top-navigation-bar">
        <h2>Today's Attendance</h2>
        <div className="breadcrumbs">
          <FaHome className="home-icon" />
          <FaChevronRight className="arrow-divider" />
          <span>Attendance</span>
          <FaChevronRight className="arrow-divider" />
          <span className="active-crumb">Today's Attendance</span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="dashboard-grid">
        
        {/* Card 1: Giant Premium Live Clock */}
        <div className="dashboard-card live-clock-card">
          <div className="clock-glass-overlay">
            <div className="clock-digits">{rawTime}</div>
            <div className="clock-ampm">{amPm}</div>
            <div className="clock-date">{formattedDate}</div>
          </div>
        </div>

        {/* Card 2: Interactive Circle Action Button Controller */}
        <div className="dashboard-card action-controller-card">
          <div className="circle-button-container">
            {!isPunchedIn ? (
              <button className="action-circle btn-punch-in" onClick={handlePunchIn}>
                <FaSignInAlt className="circle-icon animate-pulse" />
                <span>Punch In</span>
              </button>
            ) : isBreak ? (
              <button className="action-circle btn-end-break" onClick={toggleBreak}>
                <FaPlayCircle className="circle-icon" />
                <span>End Break</span>
              </button>
            ) : (
              <div className="dual-action-wrapper">
                <button className="action-circle btn-punch-out" onClick={handlePunchOut}>
                  <FaSignOutAlt className="circle-icon" />
                  <span>Punch Out</span>
                </button>
                <button className="secondary-break-btn" onClick={toggleBreak}>
                  <FaCoffee /> Go on Break
                </button>
              </div>
            )}
          </div>
          <div className={`status-badge-pill ${attendanceStatus.toLowerCase().replace(/\s+/g, '-')}`}>
            <span className="status-indicator-dot"></span>
            Status: <strong>{attendanceStatus}</strong>
          </div>
        </div>

        {/* Card 3: Redesigned Premium Daily Statistics Panel */}
        <div className="dashboard-card statistics-card">
          <div className="card-header-block">
            <h3>Daily Statistics</h3>
            <span className="live-pulse-badge">Live Updates</span>
          </div>
          
          <div className="sub-stats-grid">
            <div className="stat-card-premium">
              <div className="stat-icon-wrapper shift-icon">
                <FaClock />
              </div>
              <div className="stat-content-text">
                <span className="stat-lbl">Shift Plan</span>
                <span className="stat-val">{SHIFT_START} - {SHIFT_END}</span>
              </div>
            </div>

            <div className={`stat-card-premium ${isPunchedIn && !isBreak ? "active-glow-green" : ""}`}>
              <div className="stat-icon-wrapper work-icon">
                <FaBusinessTime />
              </div>
              <div className="stat-content-text">
                <span className="stat-lbl">Work Duration</span>
                <span className="stat-val font-numeric">{formatSecondsToHoursMins(workingSeconds)}</span>
              </div>
            </div>

            <div className={`stat-card-premium ${isBreak ? "active-glow-orange" : ""}`}>
              <div className="stat-icon-wrapper break-icon">
                <FaMugHot />
              </div>
              <div className="stat-content-text">
                <span className="stat-lbl">Break Taken</span>
                <span className="stat-val font-numeric">{formatSecondsToHoursMins(breakSeconds)}</span>
              </div>
            </div>

            <div className={`stat-card-premium ${overtimeSeconds > 0 ? "active-glow-blue" : ""}`}>
              <div className="stat-icon-wrapper overtime-icon">
                <FaHistory />
              </div>
              <div className="stat-content-text">
                <span className="stat-lbl">Overtime Accrued</span>
                <span className="stat-val font-numeric">{formatSecondsToHoursMins(overtimeSeconds)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Block: Timeline Activity Record */}
      <div className="bottom-activity-panel">
        <h3>Today's Activity Log</h3>
        <div className="timeline-container">
          {activities.length === 0 ? (
            <div className="empty-timeline-state">No activities recorded yet for today.</div>
          ) : (
            activities.map((activity) => (
              <div className="timeline-row" key={activity.id}>
                <div className="timeline-bullet-wrapper">
                  <div className="bullet-ring">
                    <div className="bullet-dot"></div>
                  </div>
                  <div className="vertical-connector-line"></div>
                </div>
                <div className="timeline-log-details">
                  <span className="log-timestamp">{activity.time}</span>
                  <span className="log-title">{activity.title}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttenanced;