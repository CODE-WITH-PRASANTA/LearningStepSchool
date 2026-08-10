import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./AttendanceSheet.css";

import API, { IMAGE_URL } from "../../api/axios";

/* =========================================================
   STATUS ICONS
========================================================= */

const STATUS_ICONS = {
  present: {
    char: "P",
    className: "status-present",
  },

  absent: {
    char: "A",
    className: "status-absent",
  },

  leave: {
    char: "L",
    className: "status-leave",
  },

  late: {
    char: "P",
    className: "status-present",
  },

  "half day": {
    char: "H",
    className: "status-halfday",
  },

  weekend: {
    char: "S",
    className: "status-weekend",
  },

  holiday: {
    char: "★",
    className: "status-holiday",
  },
};

/* =========================================================
   MONTHS
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

const AttendanceSheet = () => {
  const currentDate = new Date();

  /* =======================================================
     YEAR / MONTH
  ======================================================= */

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

  /* =======================================================
     ATTENDANCE
  ======================================================= */

  const [attendanceData, setAttendanceData] = useState([]);

  const [loading, setLoading] = useState(false);

  /* =======================================================
     HOLIDAYS
  ======================================================= */

  const [holidays, setHolidays] = useState([]);

  const [holidayLoading, setHolidayLoading] = useState(false);

  /* =======================================================
     MANUAL ADJUSTMENT
  ======================================================= */

  const [isAdjustmentOpen, setIsAdjustmentOpen] =
    useState(false);

  const [selectedAttendance, setSelectedAttendance] =
    useState(null);

  const [adjustmentForm, setAdjustmentForm] = useState({
    status: "Present",
    punchIn: "",
    punchOut: "",

    holidayName: "",
    holidayDescription: "",
    holidayType: "Public Holiday",
    holidayIsPaid: true,
  });

  const [savingAdjustment, setSavingAdjustment] =
    useState(false);

  /* =======================================================
     FETCH ATTENDANCE
  ======================================================= */

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
        response.data?.data
      );

      setAttendanceData(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Attendance Fetch Error:",
        error.response?.data ||
          error.message
      );

      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FETCH HOLIDAYS
  ======================================================= */

  const fetchHolidays = async () => {
    try {
      setHolidayLoading(true);

      const monthNumber =
        MONTHS.indexOf(searchFilter.month) + 1;

      const response = await API.get(
        "/holidays",
        {
          params: {
            year: searchFilter.year,
            month: monthNumber,
          },
        }
      );

      console.log(
        "Holiday Response:",
        response.data?.data
      );

      setHolidays(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Holiday Fetch Error:",
        error.response?.data ||
          error.message
      );

      setHolidays([]);
    } finally {
      setHolidayLoading(false);
    }
  };

  /* =======================================================
     FETCH ATTENDANCE + HOLIDAYS
  ======================================================= */

  useEffect(() => {
    fetchAttendance();
    fetchHolidays();
  }, [searchFilter]);

  /* =======================================================
     TOTAL DAYS
  ======================================================= */

  const monthIndex =
    MONTHS.indexOf(searchFilter.month);

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

  /* =======================================================
     SUNDAY CHECK
  ======================================================= */

  const isSunday = (day) => {
    const date = new Date(
      Number(searchFilter.year),
      monthIndex,
      day
    );

    return date.getDay() === 0;
  };

  /* =======================================================
     HOLIDAY MAP
  ======================================================= */

  const holidayMap = useMemo(() => {
    const map = {};

    holidays.forEach((holiday) => {
      if (!holiday?.date) {
        return;
      }

      const date = new Date(holiday.date);

      const day = date.getUTCDate();

      map[day] = holiday;
    });

    return map;
  }, [holidays]);

  /* =======================================================
     GROUP ATTENDANCE
  ======================================================= */

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

      const attendanceDate =
        new Date(attendance.date);

      const day =
        attendanceDate.getUTCDate();

      teacherMap[
        teacherId
      ].attendance[day] = {
        ...attendance,

        status:
          attendance.status?.toLowerCase() ||
          "",
      };
    });

    return Object.values(teacherMap);
  }, [attendanceData]);

  /* =======================================================
     HANDLE SEARCH
  ======================================================= */

  const handleSearch = () => {
    setSearchFilter({
      year: selectedYear,
      month: selectedMonth,
    });
  };

  /* =======================================================
     TEACHER IMAGE
  ======================================================= */

  const getTeacherImage = (
    image,
    name
  ) => {
    if (!image) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name || "Teacher"
      )}&background=random`;
    }

    let cleanImage = String(image).replace(
      /\\/g,
      "/"
    );

    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://") ||
      cleanImage.startsWith("blob:")
    ) {
      return cleanImage;
    }

    cleanImage = cleanImage.replace(
      /^\/+/,
      ""
    );

    const baseUrl = IMAGE_URL.replace(
      /\/+$/,
      ""
    );

    return `${baseUrl}/${cleanImage}`;
  };

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDateForDisplay = (date) => {
    if (!date) {
      return "";
    }

    const d = new Date(date);

    const year =
      d.getUTCFullYear();

    const month = String(
      d.getUTCMonth() + 1
    ).padStart(2, "0");

    const day = String(
      d.getUTCDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =======================================================
     TIME INPUT
  ======================================================= */

  const getIndiaTimeInput = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "en-GB",
      {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );
  };

  /* =======================================================
     OPEN MANUAL ADJUSTMENT
  ======================================================= */

  const handleAttendanceClick = (
    employee,
    day
  ) => {
    const record =
      employee.attendance[day];

    const holiday =
      holidayMap[day];

    const sunday =
      isSunday(day);

    const monthNumber =
      MONTHS.indexOf(
        searchFilter.month
      ) + 1;

    const date = `${searchFilter.year}-${String(
      monthNumber
    ).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

    /* =====================================================
       HOLIDAY
    ===================================================== */

    if (holiday && !record) {
      setSelectedAttendance({
        employeeId:
          employee.id,

        employeeName:
          employee.name,

        day,

        date,

        record: null,

        holiday,

        sunday,
      });

      setAdjustmentForm({
        status: "Holiday",

        punchIn: "",

        punchOut: "",

        holidayName:
          holiday.name || "",

        holidayDescription:
          holiday.description || "",

        holidayType:
          holiday.type ||
          "Public Holiday",

        holidayIsPaid:
          holiday.isPaid !== false,
      });

      setIsAdjustmentOpen(true);

      return;
    }

    /* =====================================================
       NORMAL ATTENDANCE
    ===================================================== */

    setSelectedAttendance({
      employeeId:
        employee.id,

      employeeName:
        employee.name,

      day,

      date,

      record:
        record || null,

      holiday:
        holiday || null,

      sunday,
    });

    setAdjustmentForm({
      status: record?.status
        ? record.status
            .split(" ")
            .map(
              (word) =>
                word
                  .charAt(0)
                  .toUpperCase() +
                word.slice(1)
            )
            .join(" ")
        : "Present",

      punchIn:
        getIndiaTimeInput(
          record?.punchIn
        ),

      punchOut:
        getIndiaTimeInput(
          record?.punchOut
        ),

      holidayName:
        holiday?.name || "",

      holidayDescription:
        holiday?.description || "",

      holidayType:
        holiday?.type ||
        "Public Holiday",

      holidayIsPaid:
        holiday?.isPaid !== false,
    });

    setIsAdjustmentOpen(true);
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const closeAdjustmentModal = () => {
    if (savingAdjustment) {
      return;
    }

    setIsAdjustmentOpen(false);

    setSelectedAttendance(null);

    setAdjustmentForm({
      status: "Present",
      punchIn: "",
      punchOut: "",
      holidayName: "",
      holidayDescription: "",
      holidayType: "Public Holiday",
      holidayIsPaid: true,
    });
  };

  /* =======================================================
     STATUS SELECT
  ======================================================= */

  const handleStatusSelect = (status) => {
    setAdjustmentForm((prev) => ({
      ...prev,
      status,
    }));
  };

  /* =======================================================
     BUILD INDIA DATE TIME
  ======================================================= */

  const buildIndiaDateTime = (
    date,
    time
  ) => {
    if (!date || !time) {
      return null;
    }

    return new Date(
      `${date}T${time}:00+05:30`
    ).toISOString();
  };

  /* =======================================================
     DELETE HOLIDAY
  ======================================================= */

  const deleteHoliday = async (
    holidayId
  ) => {
    if (!holidayId) {
      return;
    }

    await API.delete(
      `/holidays/${holidayId}`
    );
  };

  /* =======================================================
     SAVE HOLIDAY
  ======================================================= */

  const saveHoliday = async () => {
    const holiday =
      selectedAttendance?.holiday;

    if (
      !adjustmentForm.holidayName.trim()
    ) {
      alert(
        "Please enter holiday name"
      );

      return false;
    }

    const payload = {
      name:
        adjustmentForm.holidayName.trim(),

      date:
        selectedAttendance.date,

      description:
        adjustmentForm.holidayDescription ||
        "",

      type:
        adjustmentForm.holidayType ||
        "Public Holiday",

      isPaid:
        adjustmentForm.holidayIsPaid,
    };

    /* =====================================================
       UPDATE EXISTING HOLIDAY
    ===================================================== */

    if (holiday?._id) {
      await API.put(
        `/holidays/${holiday._id}`,
        payload
      );
    }

    /* =====================================================
       CREATE NEW HOLIDAY
    ===================================================== */

    else {
      await API.post(
        "/holidays",
        payload
      );
    }

    return true;
  };

  /* =======================================================
     SAVE ATTENDANCE
  ======================================================= */

  const saveAttendance = async () => {
    const record =
      selectedAttendance.record;

    /* =====================================================
       EXISTING ATTENDANCE
    ===================================================== */

    if (record?._id) {
      const payload = {
        status:
          adjustmentForm.status,

        punchIn:
          adjustmentForm.punchIn
            ? buildIndiaDateTime(
                selectedAttendance.date,
                adjustmentForm.punchIn
              )
            : null,

        punchOut:
          adjustmentForm.punchOut
            ? buildIndiaDateTime(
                selectedAttendance.date,
                adjustmentForm.punchOut
              )
            : null,
      };

      await API.put(
        `/teacher-attendance/admin/${record._id}`,
        payload
      );

      return;
    }

    /* =====================================================
       NEW ATTENDANCE
    ===================================================== */

    await API.post(
      "/teacher-attendance/admin",
      {
        teacherId:
          selectedAttendance.employeeId,

        date:
          selectedAttendance.date,

        status:
          adjustmentForm.status,

        punchIn:
          adjustmentForm.punchIn
            ? buildIndiaDateTime(
                selectedAttendance.date,
                adjustmentForm.punchIn
              )
            : null,

        punchOut:
          adjustmentForm.punchOut
            ? buildIndiaDateTime(
                selectedAttendance.date,
                adjustmentForm.punchOut
              )
            : null,
      }
    );
  };

  /* =======================================================
     SAVE MANUAL ADJUSTMENT
  ======================================================= */

  const handleSaveAdjustment =
    async () => {
      if (!selectedAttendance) {
        return;
      }

      try {
        setSavingAdjustment(true);

        const selectedStatus =
          adjustmentForm.status;

        const holiday =
          selectedAttendance.holiday;

        /* =================================================
           CASE 1
           ADMIN SELECTED HOLIDAY
        ================================================= */

        if (
          selectedStatus === "Holiday"
        ) {
          await saveHoliday();

          /*
            If there was an attendance
            record on this date and admin
            changes it to Holiday,
            delete attendance first.
          */

          if (
            selectedAttendance.record?._id
          ) {
            await API.delete(
              `/teacher-attendance/${selectedAttendance.record._id}`
            );
          }

          alert(
            "Holiday saved successfully"
          );
        }

        /* =================================================
           CASE 2
           ADMIN SELECTED ATTENDANCE
        ================================================= */

        else {
          /*
            If this date was previously
            a holiday, remove holiday
            because it is now attendance.
          */

          if (holiday?._id) {
            await deleteHoliday(
              holiday._id
            );
          }

          await saveAttendance();

          alert(
            "Attendance updated successfully"
          );
        }

        /* =================================================
           CLOSE
        ================================================= */

        setIsAdjustmentOpen(false);

        setSelectedAttendance(null);

        setAdjustmentForm({
          status: "Present",
          punchIn: "",
          punchOut: "",
          holidayName: "",
          holidayDescription: "",
          holidayType:
            "Public Holiday",
          holidayIsPaid: true,
        });

        /* =================================================
           REFRESH
        ================================================= */

        await fetchAttendance();

        await fetchHolidays();
      } catch (error) {
        console.error(
          "MANUAL ADJUSTMENT ERROR:",
          error.response?.data ||
            error
        );

        alert(
          error.response?.data
            ?.message ||
            "Failed to save manual adjustment"
        );
      } finally {
        setSavingAdjustment(false);
      }
    };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="attendance-page-container">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header-row">

        <h1 className="main-title">
          Attendance Sheet
        </h1>

        <div className="breadcrumbs">

          <span className="home-icon">
            🏠
          </span>

          <span className="separator">
            &gt;
          </span>

          Attendance

          <span className="separator">
            &gt;
          </span>

          Sheet

        </div>

      </div>

      {/* ================= ATTENDANCE CARD ================= */}

      <div className="attendance-card">

        <h2 className="card-inner-title">
          Attendance Sheet
        </h2>

        {/* ================= FILTER ================= */}

        <div className="controls-row">

          <div className="fieldset-input-group">

            <label className="fieldset-label">
              Select Year*
            </label>

            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value
                )
              }
              className="custom-select"
            >

              <option value="2024">
                2024
              </option>

              <option value="2025">
                2025
              </option>

              <option value="2026">
                2026
              </option>

            </select>

          </div>

          <div className="fieldset-input-group">

            <label className="fieldset-label">
              Select Month*
            </label>

            <select
              value={selectedMonth}
              onChange={(e) =>
                setSelectedMonth(
                  e.target.value
                )
              }
              className="custom-select"
            >

              {MONTHS.map(
                (month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                )
              )}

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

        {/* ================= FILTER INFO + LEGENDS ================= */}

        <div className="meta-legend-row">

          <div className="filter-badge-text">
            Filtered by: Year:{" "}
            {searchFilter.year} |
            Month:{" "}
            {searchFilter.month}
          </div>

          <div className="legends-wrapper">

            <div className="legend-item">

              <span className="legend-icon status-weekend">
                S
              </span>

              Sunday

            </div>

            <div className="legend-item">

              <span className="legend-icon status-present">
                P
              </span>

              Present

            </div>

            <div className="legend-item">

              <span className="legend-icon status-absent">
                A
              </span>

              Absent

            </div>

            <div className="legend-item">

              <span className="legend-icon status-halfday">
                H
              </span>

              Half-day

            </div>

            <div className="legend-item">

              <span className="legend-icon status-leave">
                L
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

        {/* ================= ATTENDANCE TABLE ================= */}

        <div className="table-scroll-axis-container">

          <div className="table-vertical-wrapper">

            <table className="attendance-grid-table">

              <thead>

                <tr>

                  <th className="sticky-employee-col header-cell">
                    Employee Name
                  </th>

                  {daysArray.map(
                    (day) => (
                      <th
                        key={day}
                        className="day-header-cell"
                        title={
                          isSunday(day)
                            ? "Sunday"
                            : holidayMap[day]
                            ? `Holiday: ${
                                holidayMap[day]
                                  .name || "Holiday"
                              }`
                            : ""
                        }
                      >
                        {day}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody>

                {loading ||
                holidayLoading ? (

                  <tr>

                    <td
                      colSpan={
                        totalDays + 1
                      }
                      className="body-cell"
                    >
                      Loading attendance...
                    </td>

                  </tr>

                ) : employees.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={
                        totalDays + 1
                      }
                      className="body-cell"
                    >
                      No attendance records found
                    </td>

                  </tr>

                ) : (

                  employees.map(
                    (employee) => (

                      <tr
                        key={
                          employee.id
                        }
                      >

                        {/* ================= EMPLOYEE ================= */}

                        <td className="sticky-employee-col body-cell">

                          <div className="employee-info-box">

                            <img
                              src={getTeacherImage(
                                employee.avatar,
                                employee.name
                              )}
                              alt={
                                employee.name
                              }
                              className="employee-avatar"
                              onError={(
                                e
                              ) => {
                                e.currentTarget.onerror =
                                  null;

                                e.currentTarget.src =
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    employee.name ||
                                      "Teacher"
                                  )}&background=random`;
                              }}
                            />

                            <span className="employee-name-txt">
                              {
                                employee.name
                              }
                            </span>

                          </div>

                        </td>

                        {/* ================= DAYS ================= */}

                        {daysArray.map(
                          (day) => {

                            const record =
                              employee
                                .attendance[
                                day
                              ];

                            const holiday =
                              holidayMap[
                                day
                              ];

                            const sunday =
                              isSunday(day);

                            let status =
                              record?.status ||
                              "";

                            let iconConfig =
                              STATUS_ICONS[
                                status
                              ] || {
                                char: "",
                                className:
                                  "",
                              };

                            /* ===================================
                               HOLIDAY DISPLAY
                            =================================== */

                            if (
                              holiday &&
                              !record
                            ) {
                              status =
                                "holiday";

                              iconConfig =
                                STATUS_ICONS.holiday;
                            }

                            /* ===================================
                               SUNDAY DISPLAY
                               Holiday has priority over Sunday.
                               Attendance record has priority too.
                            =================================== */

                            else if (
                              sunday &&
                              !record &&
                              !holiday
                            ) {
                              status =
                                "weekend";

                              iconConfig =
                                STATUS_ICONS.weekend;
                            }

                            /* ===================================
                               CELL
                            =================================== */

                            return (
                              <td
                                key={day}
                                className="status-data-cell"
                                onClick={() =>
                                  handleAttendanceClick(
                                    employee,
                                    day
                                  )
                                }
                                title={
                                  holiday &&
                                  !record
                                    ? `Holiday: ${
                                        holiday.name ||
                                        "Holiday"
                                      } - Click to modify`
                                    : sunday &&
                                      !record
                                    ? "Sunday - Click to modify"
                                    : status
                                    ? `Click to modify ${status}`
                                    : "Click to add attendance"
                                }
                                style={{
                                  cursor:
                                    "pointer",
                                }}
                              >

                                <span
                                  className={`status-indicator-icon ${iconConfig.className}`}
                                >
                                  {
                                    iconConfig.char
                                  }
                                </span>

                              </td>
                            );
                          }
                        )}

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* =========================================================
          MANUAL ADJUSTMENT POPUP
      ========================================================= */}

      {isAdjustmentOpen &&
        selectedAttendance && (

          <div
            className="manual-adjustment-overlay"
            onMouseDown={
              closeAdjustmentModal
            }
          >

            <div
              className="manual-adjustment-modal"
              onMouseDown={(e) =>
                e.stopPropagation()
              }
            >

              {/* ================= HEADER ================= */}

              <div className="manual-adjustment-header">

                <h2>
                  Manual Adjustment
                </h2>

                <button
                  type="button"
                  className="manual-close-btn"
                  onClick={
                    closeAdjustmentModal
                  }
                >
                  ×
                </button>

              </div>

              {/* ================= EMPLOYEE INFO ================= */}

              <div className="manual-employee-info">

                <div>

                  <strong>
                    Employee:
                  </strong>{" "}

                  {
                    selectedAttendance.employeeName
                  }

                </div>

                <div>

                  <strong>
                    Date:
                  </strong>{" "}

                  {
                    selectedAttendance.date
                  }

                </div>

              </div>

              {/* ================= STATUS ================= */}

              <div className="manual-status-grid">

                {/* PRESENT */}

                <button
                  type="button"
                  className={`manual-status-option status-present-option ${
                    adjustmentForm.status ===
                    "Present"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect(
                      "Present"
                    )
                  }
                >

                  <span>
                    P
                  </span>

                  Present

                </button>

                {/* ABSENT */}

                <button
                  type="button"
                  className={`manual-status-option status-absent-option ${
                    adjustmentForm.status ===
                    "Absent"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect(
                      "Absent"
                    )
                  }
                >

                  <span>
                    A
                  </span>

                  Absent

                </button>

                {/* HALF DAY */}

                <button
                  type="button"
                  className={`manual-status-option status-half-option ${
                    adjustmentForm.status ===
                    "Half Day"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect(
                      "Half Day"
                    )
                  }
                >

                  <span>
                    H
                  </span>

                  Half Day

                </button>

                {/* LATE */}

                <button
                  type="button"
                  className={`manual-status-option status-late-option ${
                    adjustmentForm.status ===
                    "Late"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect(
                      "Late"
                    )
                  }
                >

                  <span>
                    P
                  </span>

                  Late

                </button>

                {/* LEAVE */}

                <button
                  type="button"
                  className={`manual-status-option status-leave-option ${
                    adjustmentForm.status ===
                    "Leave"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect(
                      "Leave"
                    )
                  }
                >

                  <span>
                    L
                  </span>

                  Leave

                </button>

                {/* HOLIDAY */}

                <button
                  type="button"
                  className={`manual-status-option status-half-option ${
                    adjustmentForm.status ===
                    "Holiday"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleStatusSelect(
                      "Holiday"
                    )
                  }
                >

                  <span>
                    ★
                  </span>

                  Holiday

                </button>

              </div>

              {/* =================================================
                  HOLIDAY FIELDS
              ================================================= */}

              {adjustmentForm.status ===
                "Holiday" && (

                <>

                  <div className="manual-time-row">

                    <div className="manual-time-group">

                      <label>
                        Holiday Name
                      </label>

                      <input
                        type="text"
                        value={
                          adjustmentForm.holidayName
                        }
                        onChange={(e) =>
                          setAdjustmentForm(
                            (prev) => ({
                              ...prev,

                              holidayName:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter holiday name"
                      />

                    </div>

                    <div className="manual-time-group">

                      <label>
                        Holiday Type
                      </label>

                      <select
                        value={
                          adjustmentForm.holidayType
                        }
                        onChange={(e) =>
                          setAdjustmentForm(
                            (prev) => ({
                              ...prev,

                              holidayType:
                                e.target
                                  .value,
                            })
                          )
                        }
                      >

                        <option value="Public Holiday">
                          Public Holiday
                        </option>

                        <option value="School Holiday">
                          School Holiday
                        </option>

                        <option value="Festival">
                          Festival
                        </option>

                        <option value="Other">
                          Other
                        </option>

                      </select>

                    </div>

                  </div>

                  <div className="manual-time-row">

                    <div className="manual-time-group">

                      <label>
                        Description
                      </label>

                      <input
                        type="text"
                        value={
                          adjustmentForm.holidayDescription
                        }
                        onChange={(e) =>
                          setAdjustmentForm(
                            (prev) => ({
                              ...prev,

                              holidayDescription:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Holiday description"
                      />

                    </div>

                    <div className="manual-time-group">

                      <label>
                        Paid Holiday
                      </label>

                      <input
                        type="checkbox"
                        checked={
                          adjustmentForm.holidayIsPaid
                        }
                        onChange={(e) =>
                          setAdjustmentForm(
                            (prev) => ({
                              ...prev,

                              holidayIsPaid:
                                e.target
                                  .checked,
                            })
                          )
                        }
                      />

                    </div>

                  </div>

                </>
              )}

              {/* =================================================
                  PUNCH TIMES
              ================================================= */}

              {adjustmentForm.status !==
                "Holiday" && (

                <div className="manual-time-row">

                  {/* PUNCH IN */}

                  <div className="manual-time-group">

                    <label>
                      Punch In
                    </label>

                    <input
                      type="time"
                      value={
                        adjustmentForm.punchIn
                      }
                      onChange={(e) =>
                        setAdjustmentForm(
                          (prev) => ({
                            ...prev,

                            punchIn:
                              e.target
                                .value,
                          })
                        )
                      }
                    />

                  </div>

                  {/* PUNCH OUT */}

                  <div className="manual-time-group">

                    <label>
                      Punch Out
                    </label>

                    <input
                      type="time"
                      value={
                        adjustmentForm.punchOut
                      }
                      onChange={(e) =>
                        setAdjustmentForm(
                          (prev) => ({
                            ...prev,

                            punchOut:
                              e.target
                                .value,
                          })
                        )
                      }
                    />

                  </div>

                </div>

              )}

              {/* ================= SAVE ================= */}

              <div className="manual-save-wrapper">

                <button
                  type="button"
                  className="manual-save-btn"
                  disabled={
                    savingAdjustment
                  }
                  onClick={
                    handleSaveAdjustment
                  }
                >

                  {savingAdjustment
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default AttendanceSheet;