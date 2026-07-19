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
    String(currentDate.getFullYear())
  );

  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[currentDate.getMonth()]
  );

  const [searchFilter, setSearchFilter] = useState({
    year: String(currentDate.getFullYear()),
    month: MONTHS[currentDate.getMonth()],
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ATTENDANCE ================= */

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const monthNumber =
        MONTHS.indexOf(searchFilter.month) + 1;

      const response = await API.get(
        "/teacher-attendance",
        {
          params: {
            year: searchFilter.year,
            month: monthNumber,
          },
        }
      );

      console.log(
        "Attendance Response:",
        response.data.data
      );

      setAttendanceData(response.data.data || []);
    } catch (error) {
      console.error(
        "Attendance Fetch Error:",
        error.response?.data || error.message
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

  const monthIndex = MONTHS.indexOf(
    searchFilter.month
  );

  const totalDays = new Date(
    Number(searchFilter.year),
    monthIndex + 1,
    0
  ).getDate();

  const daysArray = Array.from(
    {
      length: totalDays,
    },
    (_, i) => i + 1
  );

  /* ================= GROUP ATTENDANCE ================= */

  const employees = useMemo(() => {
    const teacherMap = {};

    attendanceData.forEach((attendance) => {
      const teacher = attendance.teacherId;

      if (!teacher) {
        return;
      }

      const teacherId =
        typeof teacher === "object"
          ? teacher._id
          : teacher;

      if (!teacherMap[teacherId]) {
        teacherMap[teacherId] = {
          id: teacherId,

          name:
            typeof teacher === "object"
              ? teacher.name || "Unknown Teacher"
              : "Unknown Teacher",

          avatar:
            typeof teacher === "object"
              ? teacher.image || ""
              : "",

          attendance: {},
        };
      }

      const attendanceDate = new Date(
        attendance.date
      );

      const day = attendanceDate.getUTCDate();

      teacherMap[teacherId].attendance[day] =
        attendance.status?.toLowerCase() || "";
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
    if (!image) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "Teacher"
      )}`;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${IMAGE_URL}/${image.replace(/\\/g, "/")}`;
  };

  return (
    <div className="attendance-page-container">
      {/* Page Header Breadcrumbs */}

      <div className="page-header-row">
        <h1 className="main-title">
          Attendance Sheet
        </h1>

        <div className="breadcrumbs">
          <span className="home-icon">🏠</span>

          <span className="separator">&gt;</span>

          Attendance

          <span className="separator">&gt;</span>

          Sheet
        </div>
      </div>

      {/* Control Card Section */}

      <div className="attendance-card">
        <h2 className="card-inner-title">
          Attendance Sheet
        </h2>

        {/* Input Select Controls matching standard Fieldset design */}

        <div className="controls-row">
          <div className="fieldset-input-group">
            <label className="fieldset-label">
              Select Year*
            </label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value)
              }
              className="custom-select"
            >
              <option value="2024">2024</option>

              <option value="2025">2025</option>

              <option value="2026">2026</option>
            </select>
          </div>

          <div className="fieldset-input-group">
            <label className="fieldset-label">
              Select Month*
            </label>

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(e.target.value)
              }
              className="custom-select"
            >
              {MONTHS.map((month) => (
                <option
                  key={month}
                  value={month}
                >
                  {month}
                </option>
              ))}
            </select>
          </div>

          <button
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <hr className="divider-line" />

        {/* Dynamic Metadata Filter String & Legends Top Indicator Section */}

        <div className="meta-legend-row">
          <div className="filter-badge-text">
            Filtered by: Year: {searchFilter.year} |
            Month: {searchFilter.month}
          </div>

          <div className="legends-wrapper">
            <div className="legend-item">
              <span className="legend-icon status-weekend">
                ⊖
              </span>

              Weekend
            </div>

            <div className="legend-item">
              <span className="legend-icon status-present">
                ✓
              </span>

              Present
            </div>

            <div className="legend-item">
              <span className="legend-icon status-leave">
                ✕
              </span>

              Leave
            </div>

            <div className="legend-item">
              <span className="legend-icon status-holiday">
                ★
              </span>

              Holiday
            </div>
          </div>
        </div>

        {/* Responsive Grid Containers Supporting Both Perfect Horizontal and Vertical Custom Scrollbars */}

        <div className="table-scroll-axis-container">
          <div className="table-vertical-wrapper">
            <table className="attendance-grid-table">
              <thead>
                <tr>
                  <th className="sticky-employee-col header-cell">
                    Employee Name
                  </th>

                  {daysArray.map((day) => (
                    <th
                      key={day}
                      className="day-header-cell"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={totalDays + 1}
                      className="body-cell"
                    >
                      Loading attendance...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={totalDays + 1}
                      className="body-cell"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="sticky-employee-col body-cell">
                        <div className="employee-info-box">
                          <img
                            src={getTeacherImage(
                              employee.avatar,
                              employee.name
                            )}
                            alt={employee.name}
                            className="employee-avatar"
                          />

                          <span className="employee-name-txt">
                            {employee.name}
                          </span>
                        </div>
                      </td>

                      {daysArray.map((day) => {
                        const status =
                          employee.attendance[day];

                        const iconConfig =
                          STATUS_ICONS[status] || {
                            char: "",
                            className: "",
                          };

                        return (
                          <td
                            key={day}
                            className="status-data-cell"
                          >
                            <span
                              className={`status-indicator-icon ${iconConfig.className}`}
                              title={
                                status
                                  ? status
                                  : "No attendance"
                              }
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
    </div>
  );
};

export default AttendanceSheet;