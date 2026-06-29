import React, { useEffect, useState } from "react";
import "./TeacherAttenanced.css";

import {
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaCoffee,
  FaBusinessTime,
  FaHistory,
  FaCalendarAlt,
  FaUserCheck,
  FaPlayCircle,
  FaStopCircle,
} from "react-icons/fa";

const TeacherAttenanced = () => {
  /* =====================================================
      SHIFT CONFIGURATION
  ====================================================== */

  const SHIFT_START = "09:00";
  const SHIFT_END = "18:00";

  const SHIFT_WORK_SECONDS = 8 * 60 * 60;
  const SHIFT_BREAK_SECONDS = 45 * 60;

  /* =====================================================
      LIVE CLOCK
  ====================================================== */

  const [currentTime, setCurrentTime] = useState(new Date());

  /* =====================================================
      ATTENDANCE STATUS
  ====================================================== */

  const [isPunchedIn, setIsPunchedIn] = useState(false);

  const [isBreak, setIsBreak] = useState(false);

  const [punchInTime, setPunchInTime] = useState(null);

  const [punchOutTime, setPunchOutTime] = useState(null);

  /* =====================================================
      TIMERS
  ====================================================== */

  const [workingSeconds, setWorkingSeconds] = useState(0);

  const [breakSeconds, setBreakSeconds] = useState(0);

  const [overtimeSeconds, setOvertimeSeconds] = useState(0);

  /* =====================================================
      ACTIVITY TIMELINE
  ====================================================== */

  const [activities, setActivities] = useState([]);

  /* =====================================================
      LOAD LOCAL STORAGE
  ====================================================== */

  useEffect(() => {
    const saved = localStorage.getItem("teacherAttendance");

    if (!saved) return;

    const data = JSON.parse(saved);

    setIsPunchedIn(data.isPunchedIn);
    setIsBreak(data.isBreak);
    setPunchInTime(data.punchInTime);
    setPunchOutTime(data.punchOutTime);
    setWorkingSeconds(data.workingSeconds);
    setBreakSeconds(data.breakSeconds);
    setOvertimeSeconds(data.overtimeSeconds);
    setActivities(data.activities || []);
  }, []);

  /* =====================================================
      SAVE LOCAL STORAGE
  ====================================================== */

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
      LIVE CLOCK
  ====================================================== */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* =====================================================
      WORKING TIMER
  ====================================================== */

  useEffect(() => {
    let timer;

    if (isPunchedIn && !isBreak) {
      timer = setInterval(() => {
        setWorkingSeconds((prev) => {
          const updated = prev + 1;

          if (updated > SHIFT_WORK_SECONDS) {
            setOvertimeSeconds(updated - SHIFT_WORK_SECONDS);
          }

          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isPunchedIn, isBreak]);

  /* =====================================================
      BREAK TIMER
  ====================================================== */

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
      FORMAT HH:MM:SS
  ====================================================== */

  const formatSeconds = (seconds) => {
    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  /* =====================================================
      LIVE DATE
  ====================================================== */

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  /* =====================================================
      LIVE TIME
  ====================================================== */

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  /* =====================================================
      ADD TIMELINE EVENT
  ====================================================== */

  const addActivity = (title) => {
    const item = {
      id: Date.now(),
      title,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActivities((prev) => [item, ...prev]);
  };

  /* =====================================================
      PUNCH IN
  ====================================================== */

  const handlePunchIn = () => {
    if (isPunchedIn) return;

    const now = new Date();

    setIsPunchedIn(true);

    setPunchInTime(now.toLocaleTimeString());

    addActivity("Punched In");
  };

  /* =====================================================
      PUNCH OUT
  ====================================================== */

  const handlePunchOut = () => {
    if (!isPunchedIn) return;

    const now = new Date();

    setIsPunchedIn(false);

    setIsBreak(false);

    setPunchOutTime(now.toLocaleTimeString());

    addActivity("Punched Out");
  };

  /* =====================================================
      START BREAK
  ====================================================== */

  const startBreak = () => {
    if (!isPunchedIn) return;

    if (isBreak) return;

    setIsBreak(true);

    addActivity("Break Started");
  };

  /* =====================================================
      END BREAK
  ====================================================== */

  const endBreak = () => {
    if (!isBreak) return;

    setIsBreak(false);

    addActivity("Break Ended");
  };

  /* =====================================================
      STATUS
  ====================================================== */

  const attendanceStatus = isPunchedIn
    ? isBreak
      ? "On Break"
      : "Working"
    : "Not Punched In";

  /* =====================================================
      CARD DATA
  ====================================================== */

  const statistics = [
    {
      title: "Shift",
      value: `${SHIFT_START} - ${SHIFT_END}`,
      icon: <FaBusinessTime />,
    },
    {
      title: "Working Time",
      value: formatSeconds(workingSeconds),
      icon: <FaClock />,
    },
    {
      title: "Break Time",
      value: formatSeconds(breakSeconds),
      icon: <FaCoffee />,
    },
    {
      title: "Overtime",
      value: formatSeconds(overtimeSeconds),
      icon: <FaHistory />,
    },
  ];

  // ============================
  // JSX STARTS IN PART 1B
  // ============================
  };

export default TeacherAttenanced;