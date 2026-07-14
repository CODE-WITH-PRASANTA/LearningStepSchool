import React, { useEffect, useState } from "react";
import "./TeacherAttenanced.css";
import API from "../../api/axios";

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

  const [workingSeconds, setWorkingSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [overtimeSeconds, setOvertimeSeconds] = useState(0);
  const [activities, setActivities] = useState([]);

  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const loadTodayAttendance = async () => {
    try {
      const res = await API.get("/teacher-attendance/today");

      const data = res.data;

      setAttendance(data.attendance);

      setIsPunchedIn(data.isPunchedIn);

      setIsBreak(data.isOnBreak);

      if (data.attendance) {
        setWorkingSeconds(data.attendance.workSeconds);

        setBreakSeconds(data.attendance.breakSeconds);

        setOvertimeSeconds(data.attendance.overtimeSeconds);

        setActivities(data.attendance.activities || []);
      } else {
        setActivities([]);

        setWorkingSeconds(0);

        setBreakSeconds(0);

        setOvertimeSeconds(0);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("CURRENT LOCATION:", location);

          setCurrentLocation(location);

          resolve(location);
        },

        (error) => {
          console.error("LOCATION ERROR:", error);

          let message = "Unable to get current location.";

          if (error.code === 1) {
            message =
              "Location permission denied. Please allow location access.";
          }

          if (error.code === 2) {
            message = "Current location is unavailable.";
          }

          if (error.code === 3) {
            message = "Location request timed out.";
          }

          reject(new Error(message));
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  };
  /* =====================================================
      DYNAMIC ACTIVE TIMERS ENGINE
  ====================================================== */
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isBreak || !attendance?.breaks?.length) return;

    const timer = setInterval(() => {
      const lastBreak = attendance?.breaks?.at(-1);

      if (!lastBreak?.start || lastBreak.end) return;

      const total = Math.floor((new Date() - new Date(lastBreak.start)) / 1000);

      setBreakSeconds(attendance.breakSeconds + total);
    }, 1000);

    return () => clearInterval(timer);
  }, [attendance, isBreak]);

  useEffect(() => {
    if (workingSeconds > SHIFT_WORK_SECONDS) {
      setOvertimeSeconds(workingSeconds - SHIFT_WORK_SECONDS);
    } else {
      setOvertimeSeconds(0);
    }
  }, [workingSeconds]);
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

  /* =====================================================
      EVENT HANDLERS
  ====================================================== */
  const handlePunchIn = async () => {
    try {
      setLocationLoading(true);

      const location = await getCurrentLocation();

      console.log("PUNCH IN LOCATION:", location);

      const response = await API.post("/teacher-attendance/punch-in", {
        latitude: location.latitude,
        longitude: location.longitude,
      });

      console.log("PUNCH IN RESPONSE:", response.data);

      alert(response.data?.message);

      await loadTodayAttendance();
    } catch (err) {
      console.error("PUNCH IN ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.message || err.message || "Unable to Punch In");
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (!attendance?.punchIn || !isPunchedIn) return;

    const timer = setInterval(() => {
      const worked = Math.max(
        Math.floor((new Date() - new Date(attendance.punchIn)) / 1000) -
          breakSeconds,
        0,
      );

      setWorkingSeconds(worked);
    }, 1000);

    return () => clearInterval(timer);
  }, [attendance, breakSeconds, isPunchedIn]);

  const handlePunchOut = async () => {
    try {
      setLocationLoading(true);

      const location = await getCurrentLocation();

      console.log("PUNCH OUT LOCATION:", location);

      const response = await API.post("/teacher-attendance/punch-out", {
        latitude: location.latitude,
        longitude: location.longitude,
      });

      console.log("PUNCH OUT RESPONSE:", response.data);

      alert(response.data?.message);

      await loadTodayAttendance();
    } catch (err) {
      console.error("PUNCH OUT ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.message || err.message || "Unable to Punch Out",
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const toggleBreak = async () => {
    try {
      if (!isBreak) {
        const reason = prompt("Enter Break Reason") || "General Break";

        await API.post("/teacher-attendance/break-start", {
          reason,
        });
      } else {
        await API.post("/teacher-attendance/break-end");
      }

      await loadTodayAttendance();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const attendanceStatus = isPunchedIn
    ? isBreak
      ? "On Break"
      : "Working"
    : "Not Punched In";

  if (loading) {
    return <div>Loading attendance...</div>;
  }

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
          <span className="pin pin-tl" aria-hidden="true">
            <FaThumbtack />
          </span>
          <span className="pin pin-tr" aria-hidden="true">
            <FaThumbtack />
          </span>
          <div className="clock-glass-overlay">
            <div className="clock-digits">
              {rawTime}
              <span className="clock-ampm">{amPm}</span>
            </div>
            <div className="clock-date">{formattedDate}</div>
          </div>
          <div className="shift-plan-strip">
            <FaClock />
            <span>
              Shift {SHIFT_START} &ndash; {SHIFT_END}
            </span>
          </div>
        </div>

        {/* Card 2: Interactive Circle Action Button Controller */}
        <div className="dashboard-card action-controller-card">
          <div
            className={`status-badge-pill ${attendanceStatus.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <span className="status-indicator-dot"></span>
            <span>{attendanceStatus}</span>
          </div>

          <div className="circle-button-container">
            {!isPunchedIn ? (
              <button
                className="action-circle btn-punch-in"
                onClick={handlePunchIn}
                disabled={locationLoading}
              >
                <FaSignInAlt className="circle-icon" />

                <span>
                  {locationLoading ? "Getting Location..." : "Punch In"}
                </span>
              </button>
            ) : isBreak ? (
              <button
                className="action-circle btn-end-break"
                onClick={toggleBreak}
              >
                <FaPlayCircle className="circle-icon" />
                <span>End Break</span>
              </button>
            ) : (
              <div className="dual-action-wrapper">
                <button
                  className="action-circle btn-punch-out"
                  onClick={handlePunchOut}
                  disabled={locationLoading}
                >
                  <FaSignOutAlt className="circle-icon" />

                  <span>
                    {locationLoading ? "Getting Location..." : "Punch Out"}
                  </span>
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
              <span className="stat-val">
                {SHIFT_START} &ndash; {SHIFT_END}
              </span>
            </div>
          </div>

          <div
            className={`stat-card-premium ${isPunchedIn && !isBreak ? "active-glow-green" : ""}`}
          >
            <div className="stat-icon-wrapper work-icon">
              <FaBusinessTime />
            </div>
            <div className="stat-content-text">
              <span className="stat-lbl">Work Duration</span>
              <span className="stat-val font-numeric">
                {formatSecondsToHoursMins(workingSeconds)}
              </span>
            </div>
          </div>

          <div
            className={`stat-card-premium ${isBreak ? "active-glow-orange" : ""}`}
          >
            <div className="stat-icon-wrapper break-icon">
              <FaMugHot />
            </div>
            <div className="stat-content-text">
              <span className="stat-lbl">Break Taken</span>
              <span className="stat-val font-numeric">
                {formatSecondsToHoursMins(breakSeconds)}
              </span>
            </div>
          </div>

          <div
            className={`stat-card-premium ${overtimeSeconds > 0 ? "active-glow-blue" : ""}`}
          >
            <div className="stat-icon-wrapper overtime-icon">
              <FaHistory />
            </div>
            <div className="stat-content-text">
              <span className="stat-lbl">Overtime Accrued</span>
              <span className="stat-val font-numeric">
                {formatSecondsToHoursMins(overtimeSeconds)}
              </span>
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
              Nothing logged yet &mdash; punch in to start today&rsquo;s
              register.
            </div>
          ) : (
            activities.map((activity, index) => (
              <div className="timeline-row" key={index}>
                <span className="log-timestamp">
                  {new Date(activity.time).toLocaleTimeString()}
                </span>

                <span className="log-leader"></span>

                <span
                  className={`log-title tag-${activity.type
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {activity.type}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ===== Break History ===== */}

        <div className="break-history">
          <h3>Today's Breaks</h3>

          {attendance?.breaks?.length ? (
            attendance.breaks.map((item, index) => (
              <div className="break-item" key={index}>
                <strong>{item.reason}</strong>

                <p>
                  {new Date(item.start).toLocaleTimeString()} -{" "}
                  {item.end
                    ? new Date(item.end).toLocaleTimeString()
                    : "Running"}
                </p>

                <span>{formatSecondsToHoursMins(item.durationSeconds)}</span>
              </div>
            ))
          ) : (
            <p>No breaks taken today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttenanced;
