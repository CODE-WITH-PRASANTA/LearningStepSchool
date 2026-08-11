import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FiHome, FiChevronRight } from "react-icons/fi";
import "./MonthlyAttendance.css";

const MonthlyAttendance = () => {
  const [days, setDays] = useState([]);

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    late: 0,
    halfDay: 0,
  });

  const today = new Date();

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const [loading, setLoading] = useState(true);

  const [selectedAttendance, setSelectedAttendance] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  /* =====================================================
     LOAD MONTHLY ATTENDANCE + HOLIDAYS
  ===================================================== */

  const loadMonthlyAttendance = async () => {
    try {
      setLoading(true);

      /* ===============================================
         ATTENDANCE
      =============================================== */

      const attendanceRes = await API.get(
        `/teacher-attendance/monthly?month=${month}&year=${year}`
      );

      const records =
        attendanceRes.data?.data || [];

      /* ===============================================
         HOLIDAYS
      =============================================== */

      let holidays = [];

      try {
        const holidayRes = await API.get(
          `/holidays?month=${month}&year=${year}`
        );

        holidays =
          holidayRes.data?.data || [];
      } catch (holidayError) {
        console.error(
          "HOLIDAY FETCH ERROR:",
          holidayError.response?.data ||
            holidayError.message
        );

        holidays = [];
      }

      console.log(
        "Monthly Attendance Data:",
        records
      );

      console.log(
        "Monthly Holiday Data:",
        holidays
      );

      /* ===============================================
         TOTAL DAYS
      =============================================== */

      const totalDays =
        new Date(
          year,
          month,
          0
        ).getDate();

      /* ===============================================
         FIRST DAY
      =============================================== */

      const firstDay =
        new Date(
          year,
          month - 1,
          1
        ).getDay();

      const calendar = [];

      /* ===============================================
         HOLIDAY MAP
      =============================================== */

      const holidayMap = {};

      holidays.forEach((holiday) => {
        if (!holiday?.date) {
          return;
        }

        const holidayDate =
          new Date(holiday.date);

        /*
          Use local date parts so the holiday
          does not move to the previous day
          because of timezone conversion.
        */

        const holidayDay =
          holidayDate.getUTCDate();

        const holidayMonth =
          holidayDate.getUTCMonth() + 1;

        const holidayYear =
          holidayDate.getUTCFullYear();

        if (
          holidayMonth === month &&
          holidayYear === year
        ) {
          holidayMap[holidayDay] =
            holiday;
        }
      });

      /* ===============================================
         EMPTY CELLS
      =============================================== */

      for (
        let i = 0;
        i < firstDay;
        i++
      ) {
        calendar.push({
          empty: true,
          id: `empty-${i}`,
        });
      }

      /* ===============================================
         BUILD CALENDAR
      =============================================== */

      for (
        let day = 1;
        day <= totalDays;
        day++
      ) {
        /* =============================================
           FIND ATTENDANCE
        ============================================= */

        const found =
          records.find((item) => {
            if (!item?.date) {
              return false;
            }

            const d =
              new Date(item.date);

            return (
              d.getUTCDate() === day &&
              d.getUTCMonth() + 1 ===
                month &&
              d.getUTCFullYear() ===
                year
            );
          });

        /* =============================================
           DATE
        ============================================= */

        const dateObject =
          new Date(
            year,
            month - 1,
            day
          );

        /* =============================================
           SUNDAY
        ============================================= */

        const isSunday =
          dateObject.getDay() === 0;

        /* =============================================
           HOLIDAY
        ============================================= */

        const holiday =
          holidayMap[day] || null;

        /* =============================================
           TODAY
        ============================================= */

        const isToday =
          today.getFullYear() === year &&
          today.getMonth() + 1 === month &&
          today.getDate() === day;

        /* =============================================
           STATUS PRIORITY

           Attendance
              ↓
           Holiday
              ↓
           Sunday
              ↓
           Absent
        ============================================= */

        let status = "Absent";

        if (found) {
          status =
            found.status || "Absent";
        } else if (holiday) {
          status = "Holiday";
        } else if (isSunday) {
          status = "Sunday";
        }

        /* =============================================
           PUSH DAY
        ============================================= */

        calendar.push({
          day,

          attendance:
            found || null,

          holiday:
            holiday || null,

          status,

          isSunday,

          isHoliday:
            !!holiday,

          holidayName:
            holiday?.name || "",

          holidayType:
            holiday?.type || "",

          holidayDescription:
            holiday?.description || "",

          holidayIsPaid:
            holiday?.isPaid !== false,

          isToday,
        });
      }

      setDays(calendar);

      /* ===============================================
         SUMMARY

         Sunday and Holiday are NOT counted as Absent.
      =============================================== */

      const newSummary = {
        present: 0,
        absent: 0,
        leave: 0,
        late: 0,
        halfDay: 0,
      };

      calendar.forEach((item) => {
        if (item.empty) {
          return;
        }

        /*
          Holiday is not absent
        */

        if (
          item.status === "Holiday"
        ) {
          return;
        }

        /*
          Sunday is not absent
        */

        if (
          item.status === "Sunday"
        ) {
          return;
        }

        switch (item.status) {
          case "Present":
            newSummary.present++;
            break;

          case "Absent":
            newSummary.absent++;
            break;

          case "Late":
            newSummary.late++;
            break;

          case "Leave":
            newSummary.leave++;
            break;

          case "Half Day":
            newSummary.halfDay++;
            break;

          default:
            break;
        }
      });

      setSummary(newSummary);

      console.log(
        "Calendar:",
        calendar
      );

      console.log(
        "Summary:",
        newSummary
      );
    } catch (err) {
      console.error(
        "MONTHLY ATTENDANCE ERROR:",
        err.response?.data ||
          err.message ||
          err
      );

      setDays([]);

      setSummary({
        present: 0,
        absent: 0,
        leave: 0,
        late: 0,
        halfDay: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD WHEN MONTH / YEAR CHANGES
  ===================================================== */

  useEffect(() => {
    loadMonthlyAttendance();
  }, [month, year]);

  /* =====================================================
     STATUS CLASS
     
     IMPORTANT:
     No new CSS class name is introduced.
     
     Holiday -> status-default
     Sunday  -> status-default
     
     Existing classes remain unchanged.
  ===================================================== */

  const getBoxStatusClass = (
    status
  ) => {
    switch (status) {
      case "Present":
        return "status-present";

      case "Absent":
        return "status-absent";

      case "Late":
        return "status-late";

      case "Half Day":
        return "status-halfday";

      case "Leave":
        return "status-leave";

      case "Future":
        return "status-future";

      case "No Record":
        return "status-default";

      /*
        Holiday uses existing class
      */

      case "Holiday":
        return "status-default";

      /*
        Sunday uses existing class
      */

      case "Sunday":
        return "status-default";

      default:
        return "status-default";
    }
  };

  /* =====================================================
     HANDLE DAY CLICK
  ===================================================== */

  const handleDayClick = (
    item
  ) => {
    /* ===============================================
       EMPTY
    =============================================== */

    if (item.empty) {
      return;
    }

    /* ===============================================
       HOLIDAY
    =============================================== */

    if (
      item.status === "Holiday" &&
      item.holiday
    ) {
      setSelectedAttendance({
        ...item.holiday,

        status: "Holiday",

        date:
          item.holiday.date,

        punchIn: null,

        punchOut: null,

        workSeconds: 0,

        breakSeconds: 0,

        breaks: [],

        activities: [],

        holidayName:
          item.holiday.name,

        holidayType:
          item.holiday.type,

        holidayDescription:
          item.holiday.description,

        holidayIsPaid:
          item.holiday.isPaid !== false,
      });

      setShowModal(true);

      return;
    }

    /* ===============================================
       SUNDAY
    =============================================== */

    if (
      item.status === "Sunday"
    ) {
      const sundayDate =
        new Date(
          year,
          month - 1,
          item.day
        );

      setSelectedAttendance({
        status: "Sunday",

        date:
          sundayDate,

        punchIn: null,

        punchOut: null,

        workSeconds: 0,

        breakSeconds: 0,

        breaks: [],

        activities: [],

        holidayName: "",

        holidayType: "",

        holidayDescription: "",

        holidayIsPaid: false,
      });

      setShowModal(true);

      return;
    }

    /* ===============================================
       NORMAL ATTENDANCE
    =============================================== */

    if (!item.attendance) {
      alert(
        "No attendance found for this day."
      );

      return;
    }

    setSelectedAttendance(
      item.attendance
    );

    setShowModal(true);
  };

  /* =====================================================
     PREVIOUS MONTH
  ===================================================== */

  const previousMonth = () => {
    if (month === 1) {
      setMonth(12);

      setYear(
        (prev) => prev - 1
      );
    } else {
      setMonth(
        (prev) => prev - 1
      );
    }
  };

  /* =====================================================
     NEXT MONTH
  ===================================================== */

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);

      setYear(
        (prev) => prev + 1
      );
    } else {
      setMonth(
        (prev) => prev + 1
      );
    }
  };

  /* =====================================================
     FORMAT DURATION
  ===================================================== */

  const formatDuration = (
    seconds
  ) => {
    const safeSeconds =
      Number(seconds) || 0;

    const hrs =
      Math.floor(
        safeSeconds / 3600
      );

    const mins =
      Math.floor(
        (safeSeconds % 3600) /
          60
      );

    const secs =
      safeSeconds % 60;

    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }

    return `${mins}m ${secs}s`;
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatSelectedDate =
    (date) => {
      if (!date) {
        return "--";
      }

      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    };

  /* =====================================================
     FORMAT STATUS CLASS

     Keeps existing class names.
  ===================================================== */

  const getModalStatusClass =
    (status) => {
      if (!status) {
        return "";
      }

      /*
        Holiday and Sunday use existing
        status-default class.
      */

      if (
        status === "Holiday" ||
        status === "Sunday"
      ) {
        return "status-default";
      }

      return status
        .toLowerCase()
        .replace(/\s+/g, "-");
    };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="attendance-container">
        <h2>
          Loading Attendance...
        </h2>
      </div>
    );
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="attendance-container">

      {/* ================================================
          HEADER & BREADCRUMBS
      ================================================ */}

      <div className="attendance-header">

        <h1>
          Monthly Attendance
        </h1>

        <div className="breadcrumbs">

          <FiHome
            className="home-icon"
            size={14}
          />

          <FiChevronRight
            className="separator"
          />

          <span className="link">
            Attendance
          </span>

          <FiChevronRight
            className="separator"
          />

          <span className="current-page">
            Monthly Attendance
          </span>

        </div>

      </div>

      {/* ================================================
          TOP STATISTICAL SUMMARY CARDS

          Existing UI unchanged.
      ================================================ */}

      <div className="stats-grid">

        <div className="stat-card card-present">

          <p>
            Total Present
          </p>

          <p className="stat-number">
            {summary.present}
          </p>

        </div>

        <div className="stat-card card-absent">

          <p>
            Total Absent
          </p>

          <p className="stat-number">
            {summary.absent}
          </p>

        </div>

        <div className="stat-card card-late">

          <p>
            Late Arrivals
          </p>

          <p className="stat-number">
            {summary.late}
          </p>

        </div>

        <div className="stat-card card-halfday">

          <p>
            Half Days
          </p>

          <p className="stat-number">
            {summary.halfDay}
          </p>

        </div>

      </div>

      {/* ================================================
          MAIN CALENDAR PANEL
      ================================================ */}

      <div className="calendar-panel">

        <div className="calendar-title">

          <button
            className="month-btn"
            onClick={
              previousMonth
            }
          >
            ◀
          </button>

          <h2>
            {new Date(
              year,
              month - 1
            ).toLocaleString(
              "default",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </h2>

          <button
            className="month-btn"
            onClick={
              nextMonth
            }
          >
            ▶
          </button>

        </div>

        {/* ==============================================
            WEEK HEADER
        ============================================== */}

        <div className="calendar-week-header">

          <div>
            Sun
          </div>

          <div>
            Mon
          </div>

          <div>
            Tue
          </div>

          <div>
            Wed
          </div>

          <div>
            Thu
          </div>

          <div>
            Fri
          </div>

          <div>
            Sat
          </div>

        </div>

        {/* ==============================================
            DATE GRID
        ============================================== */}

        <div className="calendar-grid">

          {days.map(
            (item, index) => {

              if (
                item.empty
              ) {
                return (
                  <div
                    key={
                      item.id ||
                      `empty-${index}`
                    }
                    className="empty-box"
                  />
                );
              }

              return (
                <div
                  key={
                    item.day
                  }
                  onClick={() =>
                    handleDayClick(
                      item
                    )
                  }
                  className={`
                    date-box
                    ${getBoxStatusClass(
                      item.status
                    )}
                    ${
                      item.isToday
                        ? "today-box"
                        : ""
                    }
                  `}
                  title={
                    item.status ===
                    "Holiday"
                      ? `Holiday: ${item.holidayName}`
                      : item.status ===
                          "Sunday"
                        ? "Sunday"
                        : item.status
                  }
                >

                  {/* DATE */}

                  <span>
                    {item.day}
                  </span>

                  {/* ==================================
                      PRESENT
                  ================================== */}

                  {item.status ===
                    "Present" && (
                    <small>
                      🟢
                    </small>
                  )}

                  {/* ==================================
                      LATE
                  ================================== */}

                  {item.status ===
                    "Late" && (
                    <small>
                      🟠
                    </small>
                  )}

                  {/* ==================================
                      HALF DAY
                  ================================== */}

                  {item.status ===
                    "Half Day" && (
                    <small>
                      🔵
                    </small>
                  )}

                  {/* ==================================
                      LEAVE
                  ================================== */}

                  {item.status ===
                    "Leave" && (
                    <small>
                      🟣
                    </small>
                  )}

                  {/* ==================================
                      HOLIDAY
                  ================================== */}

                  {item.status ===
                    "Holiday" && (
                    <>
                      <small>
                        ★
                      </small>

                      <small>
                        {
                          item.holidayName
                        }
                      </small>
                    </>
                  )}

                  {/* ==================================
                      SUNDAY
                  ================================== */}

                  {item.status ===
                    "Sunday" && (
                    <small>
                      Sunday
                    </small>
                  )}

                </div>
              );
            }
          )}

        </div>

        {/* ==============================================
            LEGEND
        ============================================== */}

        <div className="legend-container">

          <div className="legend-item">

            <span className="legend-dot dot-present" />

            <span>
              Present
            </span>

          </div>

          <div className="legend-item">

            <span className="legend-dot dot-absent" />

            <span>
              Absent
            </span>

          </div>

          <div className="legend-item">

            <span className="legend-dot dot-late" />

            <span>
              Late
            </span>

          </div>

          <div className="legend-item">

            <span className="legend-dot dot-halfday" />

            <span>
              Half Day
            </span>

          </div>

          {/* ============================================
              Holiday/Sunday information is shown
              without changing existing class names.
          ============================================ */}

          <div className="legend-item">

            <span>
              ★
            </span>

            <span>
              Holiday
            </span>

          </div>

          <div className="legend-item">

            <span>
              ☀️
            </span>

            <span>
              Sunday
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          ATTENDANCE DETAILS MODAL
      ================================================= */}

      {showModal &&
        selectedAttendance && (

          <div
            className="attendance-modal-overlay"
            onClick={() =>
              setShowModal(false)
            }
          >

            <div
              className="attendance-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* ========================================
                  MODAL HEADER
              ======================================== */}

              <div className="modal-header">

                <div>

                  <h2>
                    Attendance Details
                  </h2>

                  <p>
                    {formatSelectedDate(
                      selectedAttendance.date
                    )}
                  </p>

                </div>

                <button
                  className="close-btn"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                >
                  ✕
                </button>

              </div>

              {/* ========================================
                  HOLIDAY INFORMATION
              ======================================== */}

              {selectedAttendance.status ===
                "Holiday" && (

                <div className="section">

                  <h3>
                    Holiday
                  </h3>

                  <div className="break-card">

                    <div>

                      <strong>
                        {
                          selectedAttendance.holidayName ||
                          selectedAttendance.name ||
                          "Holiday"
                        }
                      </strong>

                      <p>
                        {
                          selectedAttendance.holidayType ||
                          selectedAttendance.type ||
                          "Holiday"
                        }
                      </p>

                      {(
                        selectedAttendance.holidayDescription ||
                        selectedAttendance.description
                      ) && (
                        <p>
                          {
                            selectedAttendance.holidayDescription ||
                            selectedAttendance.description
                          }
                        </p>
                      )}

                    </div>

                    <span>
                      {
                        selectedAttendance.holidayIsPaid !==
                        false
                          ? "Paid"
                          : "Unpaid"
                      }
                    </span>

                  </div>

                </div>
              )}

              {/* ========================================
                  STATUS
              ======================================== */}

              <div
                className={`status-pill ${getModalStatusClass(
                  selectedAttendance.status
                )}`}
              >
                {selectedAttendance.status}
              </div>

              {/* ========================================
                  SUNDAY
              ======================================== */}

              {selectedAttendance.status ===
                "Sunday" && (

                <div className="section">

                  <h3>
                    Weekly Off
                  </h3>

                  <p>
                    Sunday is a weekly
                    holiday.
                  </p>

                </div>
              )}

              {/* ========================================
                  ATTENDANCE SUMMARY

                  Don't show meaningless
                  0h / 0m cards for holiday
                  or Sunday.
              ======================================== */}

              {selectedAttendance.status !==
                "Holiday" &&
                selectedAttendance.status !==
                  "Sunday" && (

                  <div className="attendance-summary">

                    <div className="summary-card">

                      <h4>
                        Punch In
                      </h4>

                      <span>
                        {selectedAttendance.punchIn
                          ? new Date(
                              selectedAttendance.punchIn
                            ).toLocaleTimeString()
                          : "--"}
                      </span>

                    </div>

                    <div className="summary-card">

                      <h4>
                        Punch Out
                      </h4>

                      <span>
                        {selectedAttendance.punchOut
                          ? new Date(
                              selectedAttendance.punchOut
                            ).toLocaleTimeString()
                          : "--"}
                      </span>

                    </div>

                    <div className="summary-card">

                      <h4>
                        Working
                      </h4>

                      <span>
                        {formatDuration(
                          selectedAttendance.workSeconds
                        )}
                      </span>

                    </div>

                    <div className="summary-card">

                      <h4>
                        Break
                      </h4>

                      <span>
                        {formatDuration(
                          selectedAttendance.breakSeconds
                        )}
                      </span>

                    </div>

                  </div>
                )}

              {/* ========================================
                  BREAK HISTORY
              ======================================== */}

              {selectedAttendance.status !==
                "Holiday" &&
                selectedAttendance.status !==
                  "Sunday" && (

                  <div className="section">

                    <h3>
                      Break History
                    </h3>

                    {selectedAttendance.breaks?.length ? (

                      selectedAttendance.breaks.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={index}
                            className="break-card"
                          >

                            <div>

                              <strong>
                                {
                                  item.reason ||
                                  "Break"
                                }
                              </strong>

                              <p>
                                {item.start
                                  ? new Date(
                                      item.start
                                    ).toLocaleTimeString()
                                  : "--"}

                                {" → "}

                                {item.end
                                  ? new Date(
                                      item.end
                                    ).toLocaleTimeString()
                                  : "Running"}
                              </p>

                            </div>

                            <span>
                              {formatDuration(
                                item.durationSeconds
                              )}
                            </span>

                          </div>
                        )
                      )

                    ) : (

                      <p>
                        No Breaks
                      </p>

                    )}

                  </div>
                )}

              {/* ========================================
                  ACTIVITY TIMELINE
              ======================================== */}

              {selectedAttendance.status !==
                "Holiday" &&
                selectedAttendance.status !==
                  "Sunday" && (

                  <div className="section">

                    <h3>
                      Activity Timeline
                    </h3>

                    {selectedAttendance.activities?.length ? (

                      selectedAttendance.activities.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={index}
                            className="timeline-item"
                          >

                            <div className="timeline-dot" />

                            <div>

                              <strong>
                                {
                                  item.type
                                }
                              </strong>

                              <p>
                                {item.time
                                  ? new Date(
                                      item.time
                                    ).toLocaleTimeString()
                                  : "--"}
                              </p>

                            </div>

                          </div>
                        )
                      )

                    ) : (

                      <p>
                        No Activities
                      </p>

                    )}

                  </div>
                )}

            </div>

          </div>
        )}

    </div>
  );
};

export default MonthlyAttendance;