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
  FaHistory,
  FaThumbtack,
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
    if (!saved) return; // start clean — no fabricated sample entries

    try {
      const data = JSON.parse(saved);
      setIsPunchedIn(data.isPunchedIn ?? false);
      setIsBreak(data.isBreak ?? false);
      setPunchInTime(data.punchInTime ?? null);
      setPunchOutTime(data.punchOutTime ?? null);
      setWorkingSeconds(data.workingSeconds ?? 0);
      setBreakSeconds(data.breakSeconds ?? 0);
      setOvertimeSeconds(data.overtimeSeconds ?? 0);
      if (data.activities) setActivities(data.activities);
    } catch {
      /* ignore corrupt storage */
    }
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
  }, [
    isPunchedIn,
    isBreak,
    punchInTime,
    punchOutTime,
    workingSeconds,
    breakSeconds,
    overtimeSeconds,
    activities,
  ]);

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
    setPunchInTime(
      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    );
    addActivity("Punched In");
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    setIsBreak(false);
    setPunchOutTime(
      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    );
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
        <div>
          <span className="eyebrow">Register</span>
          <h2>Today&rsquo;s Attendance</h2>
        </div>
        <div className="breadcrumbs">
          <FaHome className="home-icon" />
          <FaChevronRight className="arrow-divider" />
          <span>Attendance</span>
          <FaChevronRight className="arrow-divider" />
          <span className="active-crumb">Today</span>
        </div>
      </div>

      {/* Top Row: Plaque Clock + Action Controller */}
      <div className="dashboard-grid">
        {/* Card 1: Chalkboard Plaque Clock */}
        <div className="dashboard-card live-clock-card">
          <span className="pin pin-tl" aria-hidden="true"><FaThumbtack /></span>
          <span className="pin pin-tr" aria-hidden="true"><FaThumbtack /></span>
          <div className="clock-glass-overlay">
            <div className="clock-digits">
              {rawTime}
              <span className="clock-ampm">{amPm}</span>
            </div>
            <div className="clock-date">{formattedDate}</div>
          </div>
          <div className="shift-plan-strip">
            <FaClock />
            <span>Shift {SHIFT_START} &ndash; {SHIFT_END}</span>
          </div>
        </div>

        {/* Card 2: Interactive Circle Action Button Controller */}
        <div className="dashboard-card action-controller-card">
          <div className={`status-badge-pill ${attendanceStatus.toLowerCase().replace(/\s+/g, "-")}`}>
            <span className="status-indicator-dot"></span>
            <span>{attendanceStatus}</span>
          </div>

          <div className="circle-button-container">
            {!isPunchedIn ? (
              <button className="action-circle btn-punch-in" onClick={handlePunchIn}>
                <FaSignInAlt className="circle-icon" />
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
        </div>
      </div>

      {/* Stats Strip */}
      <div className="dashboard-card statistics-card">
        <div className="card-header-block">
          <h3>Daily Statistics</h3>
          <span className="live-pulse-badge">
            <span className="live-dot" /> Live
          </span>
        </div>

        <div className="sub-stats-grid">
          <div className="stat-card-premium">
            <div className="stat-icon-wrapper shift-icon">
              <FaClock />
            </div>
            <div className="stat-content-text">
              <span className="stat-lbl">Shift Plan</span>
              <span className="stat-val">{SHIFT_START} &ndash; {SHIFT_END}</span>
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

      {/* Bottom Block: Attendance Register (Ledger) */}
      <div className="bottom-activity-panel">
        <h3>Today&rsquo;s Activity Register</h3>
        <div className="timeline-container">
          {activities.length === 0 ? (
            <div className="empty-timeline-state">
              Nothing logged yet &mdash; punch in to start today&rsquo;s register.
            </div>
          ) : (
            activities.map((activity) => (
              <div className="timeline-row" key={activity.id}>
                <span className="log-timestamp">{activity.time}</span>
                <span className="log-leader" aria-hidden="true"></span>
                <span className={`log-title tag-${activity.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {activity.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttenanced;