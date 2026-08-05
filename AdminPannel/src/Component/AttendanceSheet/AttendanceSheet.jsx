import React, { useEffect, useMemo, useState } from "react";
import "./AttendanceSheet.css";

import API, { IMAGE_URL } from "../../api/axios";

const STATUS_ICONS = {
  present: {
    char: "✓",
    className: "status-present",
  },
  leave: {
    char: "✕",
    className: "status-leave",
  },
  absent: {
    char: "✕",
    className: "status-leave",
  },
  late: {
    char: "✓",
    className: "status-present",
  },
  "half day": {
    char: "½",
    className: "status-holiday",
  },
  weekend: {
    char: "⊖",
    className: "status-weekend",
  },
  holiday: {
    char: "★",
    className: "status-holiday",
  },
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AttendanceSheet = () => {
  const currentDate = new Date();

  const [selectedYear, setSelectedYear] = useState(
    String(currentDate.getFullYear()),
  );

  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[currentDate.getMonth()],
  );

  const [searchFilter, setSearchFilter] = useState({
    year: String(currentDate.getFullYear()),
    month: MONTHS[currentDate.getMonth()],
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [adjustmentForm, setAdjustmentForm] = useState({
    status: "Present",
    punchIn: "",
    punchOut: "",
  });

  const [savingAdjustment, setSavingAdjustment] = useState(false);

  /* ================= FETCH ATTENDANCE ================= */

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const monthNumber = MONTHS.indexOf(searchFilter.month) + 1;

      const response = await API.get("/teacher-attendance", {
        params: {
          year: searchFilter.year,
          month: monthNumber,
        },
      });

      console.log("Attendance Response:", response.data.data);

      setAttendanceData(response.data.data || []);
    } catch (error) {
      console.error(
        "Attendance Fetch Error:",
        error.response?.data || error.message,
      );

      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [searchFilter]);

  /* ================= TOTAL DAYS ================= */

  const monthIndex = MONTHS.indexOf(searchFilter.month);

  const totalDays = new Date(
    Number(searchFilter.year),
    monthIndex + 1,
    0,
  ).getDate();

  const daysArray = Array.from(
    {
      length: totalDays,
    },
    (_, i) => i + 1,
  );

  /* ================= GROUP ATTENDANCE ================= */

  const employees = useMemo(() => {
    const teacherMap = {};

    attendanceData.forEach((attendance) => {
      const teacher = attendance.teacherId;

      if (!teacher) {
        return;
      }

      const teacherId = typeof teacher === "object" ? teacher._id : teacher;

      if (!teacherMap[teacherId]) {
        teacherMap[teacherId] = {
          id: teacherId,

          name:
            typeof teacher === "object"
              ? teacher.name || "Unknown Teacher"
              : "Unknown Teacher",

          avatar: typeof teacher === "object" ? teacher.image || "" : "",

          attendance: {},
        };
      }

      const attendanceDate = new Date(attendance.date);

      const day = attendanceDate.getUTCDate();
      teacherMap[teacherId].attendance[day] = {
        ...attendance,
        status: attendance.status?.toLowerCase() || "",
      };
    });

    return Object.values(teacherMap);
  }, [attendanceData]);

  /* ================= HANDLE SEARCH ================= */

  const handleSearch = () => {
    setSearchFilter({
      year: selectedYear,
      month: selectedMonth,
    });
  };

  /* ================= TEACHER IMAGE ================= */

  const getTeacherImage = (image, name) => {
    // No image -> fallback avatar
    if (!image) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "Teacher",
      )}&background=random`;
    }

    // Fix Windows path
    let cleanImage = image.replace(/\\/g, "/");

    // Already full URL
    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://") ||
      cleanImage.startsWith("blob:")
    ) {
      return cleanImage;
    }

    // Remove starting slash
    cleanImage = cleanImage.replace(/^\/+/, "");

    // Remove ending slash from IMAGE_URL
    const baseUrl = IMAGE_URL.replace(/\/+$/, "");

    return `${baseUrl}/${cleanImage}`;
  };

  /* ================= MANUAL ADJUSTMENT ================= */

  const formatDateForDisplay = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const year = d.getUTCFullYear();

    const month = String(d.getUTCMonth() + 1).padStart(2, "0");

    const day = String(d.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* ================= TIME INPUT ================= */

  const getIndiaTimeInput = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  /* ================= OPEN POPUP ================= */

  const handleAttendanceClick = (employee, day) => {
    const record = employee.attendance[day];

    const monthNumber = MONTHS.indexOf(searchFilter.month) + 1;

    const date = `${searchFilter.year}-${String(monthNumber).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;

    setSelectedAttendance({
      employeeId: employee.id,
      employeeName: employee.name,
      day,
      date,
      record: record || null,
    });

    setAdjustmentForm({
      status: record?.status
        ? record.status
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Present",

      punchIn: getIndiaTimeInput(record?.punchIn),

      punchOut: getIndiaTimeInput(record?.punchOut),
    });

    setIsAdjustmentOpen(true);
  };

  /* ================= CLOSE ================= */

  const closeAdjustmentModal = () => {
    if (savingAdjustment) return;

    setIsAdjustmentOpen(false);

    setSelectedAttendance(null);

    setAdjustmentForm({
      status: "Present",
      punchIn: "",
      punchOut: "",
    });
  };

  /* ================= STATUS SELECT ================= */

  const handleStatusSelect = (status) => {
    setAdjustmentForm((prev) => ({
      ...prev,
      status,
    }));
  };

  /* ================= BUILD INDIA DATE TIME ================= */

  const buildIndiaDateTime = (date, time) => {
    if (!date || !time) return null;

    return new Date(`${date}T${time}:00+05:30`).toISOString();
  };

  /* ================= SAVE ================= */

  const handleSaveAdjustment = async () => {
    if (!selectedAttendance) return;

    try {
      setSavingAdjustment(true);

      const record = selectedAttendance.record;

      /*
      Existing attendance
    */
      if (record?._id) {
        const payload = {
          status: adjustmentForm.status,

          punchIn: adjustmentForm.punchIn
            ? buildIndiaDateTime(
                selectedAttendance.date,
                adjustmentForm.punchIn,
              )
            : null,

          punchOut: adjustmentForm.punchOut
            ? buildIndiaDateTime(
                selectedAttendance.date,
                adjustmentForm.punchOut,
              )
            : null,
        };

        await API.put(`/teacher-attendance/admin/${record._id}`, payload);
      } else {
        /*
      No attendance exists for that date.
      Admin creates it.
    */
        await API.post("/teacher-attendance/admin", {
          teacherId: selectedAttendance.employeeId,

          date: selectedAttendance.date,

          status: adjustmentForm.status,
        });
      }

      closeAdjustmentModal();

      await fetchAttendance();
    } catch (error) {
      console.error("MANUAL ATTENDANCE ERROR:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to update attendance");
    } finally {
      setSavingAdjustment(false);
    }
  };

  return (
    <div className="attendance-page-container">
      {/* ================= PAGE HEADER ================= */}

      <div className="page-header-row">
        <h1 className="main-title">Attendance Sheet</h1>

        <div className="breadcrumbs">
          <span className="home-icon">🏠</span>
          <span className="separator">&gt;</span>
          Attendance
          <span className="separator">&gt;</span>
          Sheet
        </div>
      </div>

      {/* ================= ATTENDANCE CARD ================= */}

      <div className="attendance-card">
        <h2 className="card-inner-title">Attendance Sheet</h2>

        {/* ================= FILTER ================= */}

        <div className="controls-row">
          <div className="fieldset-input-group">
            <label className="fieldset-label">Select Year*</label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="custom-select"
            >
              <option value="2024">2024</option>

              <option value="2025">2025</option>

              <option value="2026">2026</option>
            </select>
          </div>

          <div className="fieldset-input-group">
            <label className="fieldset-label">Select Month*</label>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="custom-select"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <hr className="divider-line" />

        {/* ================= FILTER INFO + LEGENDS ================= */}

        <div className="meta-legend-row">
          <div className="filter-badge-text">
            Filtered by: Year: {searchFilter.year} | Month: {searchFilter.month}
          </div>

          <div className="legends-wrapper">
            <div className="legend-item">
              <span className="legend-icon status-weekend">⊖</span>
              Weekend
            </div>

            <div className="legend-item">
              <span className="legend-icon status-present">✓</span>
              Present
            </div>

            <div className="legend-item">
              <span className="legend-icon status-leave">✕</span>
              Leave
            </div>

            <div className="legend-item">
              <span className="legend-icon status-holiday">★</span>
              Holiday
            </div>
          </div>
        </div>

        {/* ================= ATTENDANCE TABLE ================= */}

        <div className="table-scroll-axis-container">
          <div className="table-vertical-wrapper">
            <table className="attendance-grid-table">
              <thead>
                <tr>
                  <th className="sticky-employee-col header-cell">
                    Employee Name
                  </th>

                  {daysArray.map((day) => (
                    <th key={day} className="day-header-cell">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={totalDays + 1} className="body-cell">
                      Loading attendance...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={totalDays + 1} className="body-cell">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      {/* ================= EMPLOYEE ================= */}

                      <td className="sticky-employee-col body-cell">
                        <div className="employee-info-box">
                          <img
                            src={getTeacherImage(
                              employee.avatar,
                              employee.name,
                            )}
                            alt={employee.name}
                            className="employee-avatar"
                          />

                          <span className="employee-name-txt">
                            {employee.name}
                          </span>
                        </div>
                      </td>

                      {/* ================= DAYS ================= */}

                      {daysArray.map((day) => {
                        const record = employee.attendance[day];

                        const status = record?.status || "";

                        const iconConfig = STATUS_ICONS[status] || {
                          char: "",
                          className: "",
                        };

                        return (
                          <td
                            key={day}
                            className="status-data-cell"
                            /* ===============================
                                 CLICK ATTENDANCE
                              =============================== */

                            onClick={() => handleAttendanceClick(employee, day)}
                            title={
                              status
                                ? `Click to modify ${status}`
                                : "Click to add attendance"
                            }
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <span
                              className={`status-indicator-icon ${iconConfig.className}`}
                            >
                              {iconConfig.char}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================
        MANUAL ADJUSTMENT POPUP
    ========================================================= */}

      {isAdjustmentOpen && selectedAttendance && (
        <div
          className="manual-adjustment-overlay"
          onMouseDown={closeAdjustmentModal}
        >
          <div
            className="manual-adjustment-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* ================= HEADER ================= */}

            <div className="manual-adjustment-header">
              <h2>Manual Adjustment</h2>

              <button
                type="button"
                className="manual-close-btn"
                onClick={closeAdjustmentModal}
              >
                ×
              </button>
            </div>

            {/* ================= EMPLOYEE INFO ================= */}

            <div className="manual-employee-info">
              <div>
                <strong>Employee:</strong> {selectedAttendance.employeeName}
              </div>

              <div>
                <strong>Date:</strong> {selectedAttendance.date}
              </div>
            </div>

            {/* ================= STATUS ================= */}

            <div className="manual-status-grid">
              {/* PRESENT */}

              <button
                type="button"
                className={`manual-status-option status-present-option ${
                  adjustmentForm.status === "Present" ? "selected" : ""
                }`}
                onClick={() => handleStatusSelect("Present")}
              >
                <span>✓</span>
                Present
              </button>

              {/* ABSENT */}

              <button
                type="button"
                className={`manual-status-option status-absent-option ${
                  adjustmentForm.status === "Absent" ? "selected" : ""
                }`}
                onClick={() => handleStatusSelect("Absent")}
              >
                <span>×</span>
                Absent
              </button>

              {/* HALF DAY */}

              <button
                type="button"
                className={`manual-status-option status-half-option ${
                  adjustmentForm.status === "Half Day" ? "selected" : ""
                }`}
                onClick={() => handleStatusSelect("Half Day")}
              >
                <span>⊖</span>
                Half Day
              </button>

              {/* LATE */}

              <button
                type="button"
                className={`manual-status-option status-late-option ${
                  adjustmentForm.status === "Late" ? "selected" : ""
                }`}
                onClick={() => handleStatusSelect("Late")}
              >
                <span>!</span>
                Late
              </button>

              {/* LEAVE */}

              <button
                type="button"
                className={`manual-status-option status-leave-option ${
                  adjustmentForm.status === "Leave" ? "selected" : ""
                }`}
                onClick={() => handleStatusSelect("Leave")}
              >
                <span>L</span>
                Leave
              </button>
            </div>

            {/* ================= PUNCH TIMES ================= */}

            <div className="manual-time-row">
              {/* PUNCH IN */}

              <div className="manual-time-group">
                <label>Punch In</label>

                <input
                  type="time"
                  value={adjustmentForm.punchIn}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,

                      punchIn: e.target.value,
                    }))
                  }
                />
              </div>

              {/* PUNCH OUT */}

              <div className="manual-time-group">
                <label>Punch Out</label>

                <input
                  type="time"
                  value={adjustmentForm.punchOut}
                  onChange={(e) =>
                    setAdjustmentForm((prev) => ({
                      ...prev,

                      punchOut: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* ================= SAVE ================= */}

            <div className="manual-save-wrapper">
              <button
                type="button"
                className="manual-save-btn"
                disabled={savingAdjustment}
                onClick={handleSaveAdjustment}
              >
                {savingAdjustment ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceSheet;
