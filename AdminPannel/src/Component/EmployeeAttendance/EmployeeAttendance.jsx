import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  Home,
  ChevronRight,
  LayoutDashboard,
  Pencil,
  Trash2,
  Sparkles,
  Search,
  X,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import API, {
  BASE_URL,
} from "../../api/axios";

import "./EmployeeAttendance.css";

const EmployeeAttendance = () => {
  const [activeTab, setActiveTab] =
    useState("log");

  /* =========================================================
     TEACHER SEARCH
  ========================================================= */

  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] =
    useState(null);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  /* =========================================================
     ATTENDANCE
  ========================================================= */

  const [attendanceData, setAttendanceData] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const now = new Date();

  const [month, setMonth] = useState(
    now.getMonth() + 1
  );

  const [year, setYear] = useState(
    now.getFullYear()
  );

  /* =========================================================
     EDIT MODAL
  ========================================================= */

  const [editAttendance, setEditAttendance] =
    useState(null);

  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    status: "Present",
    punchIn: "",
    punchOut: "",
  });

  /* =========================================================
     SEARCH TEACHER
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        search.trim().length > 0 &&
        !selectedTeacher
      ) {
        searchTeachers();
      } else {
        setTeachers([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, selectedTeacher]);

  const searchTeachers = async () => {
    try {
      setSearchLoading(true);

      const response = await API.get(
        "/teacher/search",
        {
          params: {
            search: search.trim(),
          },
        }
      );

      setTeachers(
        response.data?.data || []
      );

      setShowSuggestions(true);
    } catch (error) {
      console.error(
        "SEARCH TEACHER ERROR:",
        error.response?.data || error
      );

      setTeachers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /* =========================================================
     SELECT TEACHER
  ========================================================= */

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);

    setSearch(teacher.name || "");

    setTeachers([]);

    setShowSuggestions(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearch(value);

    if (selectedTeacher) {
      setSelectedTeacher(null);
      setAttendanceData([]);
    }
  };

  /* =========================================================
     FETCH ATTENDANCE
  ========================================================= */

  const fetchTeacherAttendance = async () => {
    if (!selectedTeacher?._id) return;

    try {
      setLoading(true);

      const response = await API.get(
        `/teacher-attendance/admin/teacher/${selectedTeacher._id}`,
        {
          params: {
            month,
            year,
          },
        }
      );

      setAttendanceData(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "FETCH ATTENDANCE ERROR:",
        error.response?.data || error
      );

      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTeacher?._id) {
      fetchTeacherAttendance();
    }
  }, [selectedTeacher, month, year]);

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDeleteAttendance = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/teacher-attendance/${id}`
      );

      await fetchTeacherAttendance();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete attendance"
      );
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const toDateTimeLocal = (date) => {
    if (!date) return "";

    const value = new Date(date);

    const parts = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }
    ).formatToParts(value);

    const get = (type) =>
      parts.find(
        (item) => item.type === type
      )?.value;

    return `${get("year")}-${get(
      "month"
    )}-${get("day")}T${get("hour")}:${get(
      "minute"
    )}`;
  };

  const handleEditAttendance = (row) => {
    setEditAttendance(row);

    setEditForm({
      status: row.status || "Present",

      punchIn: toDateTimeLocal(
        row.punchIn
      ),

      punchOut: toDateTimeLocal(
        row.punchOut
      ),
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     LOCAL INDIA TIME -> ISO
  ========================================================= */

  const indiaLocalToISO = (value) => {
    if (!value) return null;

    return new Date(
      `${value}:00+05:30`
    ).toISOString();
  };

  /* =========================================================
     UPDATE ATTENDANCE
  ========================================================= */

  const handleUpdateAttendance = async (
    e
  ) => {
    e.preventDefault();

    if (!editAttendance?._id) return;

    try {
      setSaving(true);

      const payload = {
        status: editForm.status,

        punchIn: editForm.punchIn
          ? indiaLocalToISO(
              editForm.punchIn
            )
          : null,

        punchOut: editForm.punchOut
          ? indiaLocalToISO(
              editForm.punchOut
            )
          : null,
      };

      await API.put(
        `/teacher-attendance/admin/${editAttendance._id}`,
        payload
      );

      setEditAttendance(null);

      await fetchTeacherAttendance();
    } catch (error) {
      console.error(
        "UPDATE ATTENDANCE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     FORMATTERS
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const formatSeconds = (seconds = 0) => {
    const total =
      Number(seconds) || 0;

    if (!total) return "00:00";

    const hours = Math.floor(
      total / 3600
    );

    const minutes = Math.floor(
      (total % 3600) / 60
    );

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  /* =========================================================
     IMAGE
  ========================================================= */

  const getImageUrl = (image) => {
    if (!image) return null;

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const cleanPath = image.replace(
      /\\/g,
      "/"
    );

    return `${BASE_URL}/${cleanPath.replace(
      /^\/+/,
      ""
    )}`;
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusType = (status) => {
    switch (status) {
      case "Present":
        return "present";

      case "Late":
        return "warning";

      case "Half Day":
        return "warning";

      case "Leave":
        return "leave";

      case "Absent":
        return "warning";

      default:
        return "present";
    }
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    let totalWorkSeconds = 0;
    let totalBreakSeconds = 0;

    let workingCount = 0;

    let inMinutes = 0;
    let inCount = 0;

    let outMinutes = 0;
    let outCount = 0;

    attendanceData.forEach((row) => {
      if (row.workSeconds) {
        totalWorkSeconds +=
          Number(row.workSeconds);

        workingCount++;
      }

      totalBreakSeconds +=
        Number(row.breakSeconds || 0);

      if (row.punchIn) {
        const time = new Date(
          row.punchIn
        ).toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });

        const [h, m] = time
          .split(":")
          .map(Number);

        inMinutes += h * 60 + m;

        inCount++;
      }

      if (row.punchOut) {
        const time = new Date(
          row.punchOut
        ).toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });

        const [h, m] = time
          .split(":")
          .map(Number);

        outMinutes += h * 60 + m;

        outCount++;
      }
    });

    const averageClockTime = (
      minutes,
      count
    ) => {
      if (!count) return "--";

      const avg = Math.floor(
        minutes / count
      );

      let hour = Math.floor(avg / 60);

      const minute = avg % 60;

      const period =
        hour >= 12 ? "PM" : "AM";

      hour = hour % 12 || 12;

      return `${String(hour).padStart(
        2,
        "0"
      )}:${String(minute).padStart(
        2,
        "0"
      )} ${period}`;
    };

    return {
      avgWorkingHours: formatSeconds(
        workingCount
          ? totalWorkSeconds /
              workingCount
          : 0
      ),

      avgBreakTime: formatSeconds(
        attendanceData.length
          ? totalBreakSeconds /
              attendanceData.length
          : 0
      ),

      avgInTime: averageClockTime(
        inMinutes,
        inCount
      ),

      avgOutTime: averageClockTime(
        outMinutes,
        outCount
      ),
    };
  }, [attendanceData]);

  /* =========================================================
     CHART
  ========================================================= */

  const statusCounts = useMemo(() => {
    const counts = {
      Present: 0,
      Late: 0,
      Leave: 0,
      Absent: 0,
      "Half Day": 0,
    };

    attendanceData.forEach((row) => {
      if (
        counts[row.status] !== undefined
      ) {
        counts[row.status]++;
      }
    });

    return counts;
  }, [attendanceData]);

  const chartData = [
    {
      name: "Present",
      value: statusCounts.Present,
      color: "#7C4DFF",
    },
    {
      name: "Late",
      value: statusCounts.Late,
      color: "#29B6F6",
    },
    {
      name: "Leave",
      value: statusCounts.Leave,
      color: "#66BB6A",
    },
    {
      name: "Absent",
      value: statusCounts.Absent,
      color: "#FFA726",
    },
    {
      name: "Half Day",
      value: statusCounts["Half Day"],
      color: "#EF5350",
    },
  ];

  const totalStatus =
    chartData.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="ea-container">

      {/* Header & Breadcrumbs */}

      <div className="ea-header-section">

        <h1 className="ea-title">
          Employee Attendance
        </h1>

        <div className="ea-breadcrumbs">

          <Home className="icon-xs" />

          <ChevronRight className="icon-xxs" />

          <span>Attendance</span>

          <ChevronRight className="icon-xxs" />

          <span className="active-crumb">
            Employee Attendance
          </span>

        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div
        style={{
          position: "relative",
          marginBottom: "20px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e5e7eb",
            background: "#fff",
            borderRadius: "10px",
            padding: "0 14px",
            maxWidth: "600px",
          }}
        >

          <Search size={18} />

          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search teacher by name, email, contact..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              padding: "13px",
            }}
          />

          {searchLoading && (
            <small>Searching...</small>
          )}

        </div>

        {showSuggestions &&
          teachers.length > 0 && (

            <div
              style={{
                position: "absolute",
                zIndex: 100,
                top: "52px",
                left: 0,
                maxWidth: "600px",
                width: "100%",
                background: "#fff",
                border:
                  "1px solid #e5e7eb",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.12)",
              }}
            >

              {teachers.map(
                (teacher) => (
                  <div
                    key={teacher._id}
                    onClick={() =>
                      handleSelectTeacher(
                        teacher
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >

                    {getImageUrl(
                      teacher.image
                    ) ? (
                      <img
                        src={getImageUrl(
                          teacher.image
                        )}
                        alt=""
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius:
                            "50%",
                          objectFit:
                            "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius:
                            "50%",
                          background:
                            "#ede9fe",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        {teacher.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>
                    )}

                    <div>

                      <strong>
                        {teacher.name}
                      </strong>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "#777",
                        }}
                      >
                        {teacher.email}
                      </div>

                      <div
                        style={{
                          fontSize: "11px",
                          color: "#999",
                        }}
                      >
                        {teacher.department ||
                          ""}
                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </div>

      {/* Top Profile Box */}

      <div className="ea-profile-card">

        <div className="ea-avatar-wrapper">

          {selectedTeacher &&
          getImageUrl(
            selectedTeacher.image
          ) ? (
            <img
              src={getImageUrl(
                selectedTeacher.image
              )}
              alt={
                selectedTeacher.name
              }
              className="ea-avatar-img"
            />
          ) : (
            <div
              className="ea-avatar-img"
              style={{
                display: "flex",
                justifyContent:
                  "center",
                alignItems: "center",
                background: "#ede9fe",
              }}
            >
              {selectedTeacher
                ? selectedTeacher.name
                    ?.charAt(0)
                    ?.toUpperCase()
                : "T"}
            </div>
          )}

        </div>

        <div className="ea-profile-details">

          <h2 className="ea-employee-name">
            {selectedTeacher?.name ||
              "Select Teacher"}
          </h2>

          <p className="ea-employee-role">
            {selectedTeacher
              ? "Teacher"
              : "Search teacher above"}
          </p>

          <div className="ea-meta-tags">

            <span className="meta-tag">
              <span className="lbl-id">
                Email:
              </span>{" "}
              {selectedTeacher?.email ||
                "-"}
            </span>

            <span className="meta-tag">
              <span className="lbl-dept">
                Dept:
              </span>{" "}
              {selectedTeacher
                ?.department || "-"}
            </span>

            <span className="meta-tag">
              <span className="lbl-join">
                Contact:
              </span>{" "}
              {selectedTeacher?.contact ||
                "-"}
            </span>

          </div>

        </div>

        {selectedTeacher && (
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "8px",
            }}
          >

            <select
              value={month}
              onChange={(e) =>
                setMonth(
                  Number(e.target.value)
                )
              }
            >
              <option value="1">
                January
              </option>
              <option value="2">
                February
              </option>
              <option value="3">
                March
              </option>
              <option value="4">
                April
              </option>
              <option value="5">
                May
              </option>
              <option value="6">
                June
              </option>
              <option value="7">
                July
              </option>
              <option value="8">
                August
              </option>
              <option value="9">
                September
              </option>
              <option value="10">
                October
              </option>
              <option value="11">
                November
              </option>
              <option value="12">
                December
              </option>
            </select>

            <select
              value={year}
              onChange={(e) =>
                setYear(
                  Number(e.target.value)
                )
              }
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

              <option value="2027">
                2027
              </option>
            </select>

          </div>
        )}

      </div>

      {/* Stats Cards Grid */}

      <div className="ea-stats-grid">

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">
              Avg Working Hours
            </p>

            <h3 className="stat-value">
              {stats.avgWorkingHours}
            </h3>
          </div>

          <div className="stat-icon-box bg-sky">
            <Clock className="icon-md" />
          </div>
        </div>

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">
              Avg In Time
            </p>

            <h3 className="stat-value">
              {stats.avgInTime}
            </h3>
          </div>

          <div className="stat-icon-box bg-emerald">
            <LogIn className="icon-md" />
          </div>
        </div>

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">
              Avg Out Time
            </p>

            <h3 className="stat-value">
              {stats.avgOutTime}
            </h3>
          </div>

          <div className="stat-icon-box bg-amber">
            <LogOut className="icon-md" />
          </div>
        </div>

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">
              Avg Break Time
            </p>

            <h3 className="stat-value">
              {stats.avgBreakTime}
            </h3>
          </div>

          <div className="stat-icon-box bg-purple">
            <Coffee className="icon-md" />
          </div>
        </div>

      </div>

      {/* Tabs and Lower Dynamic Content Section */}

      <div className="ea-content-card">

        <div className="ea-tabs-nav">

          <button
            onClick={() =>
              setActiveTab("log")
            }
            className={`tab-btn ${
              activeTab === "log"
                ? "active-tab"
                : ""
            }`}
          >
            <LayoutDashboard className="icon-sm" />
            Attendance Log
          </button>

          <button
            onClick={() =>
              setActiveTab("analytics")
            }
            className={`tab-btn ${
              activeTab === "analytics"
                ? "active-tab"
                : ""
            }`}
          >
            <svg
              className="icon-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>

            Analytics
          </button>

        </div>

        <div className="ea-tab-content">

          {activeTab === "log" ? (

            <div className="table-responsive">

              <table className="ea-table">

                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>
                      Working Hours
                    </th>
                    <th>Shift</th>
                    <th>Status</th>
                    <th className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="text-center"
                      >
                        Loading...
                      </td>
                    </tr>

                  ) : !selectedTeacher ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="text-center"
                      >
                        Search and select a
                        teacher
                      </td>
                    </tr>

                  ) : attendanceData.length ===
                    0 ? (

                    <tr>
                      <td
                        colSpan="7"
                        className="text-center"
                      >
                        No attendance found
                      </td>
                    </tr>

                  ) : (

                    attendanceData.map(
                      (row) => (

                        <tr key={row._id}>

                          <td className="text-muted">
                            {formatDate(
                              row.date
                            )}
                          </td>

                          <td>
                            {formatTime(
                              row.punchIn
                            )}
                          </td>

                          <td>
                            {formatTime(
                              row.punchOut
                            )}
                          </td>

                          <td
                            className={`font-semibold ${
                              row.status ===
                              "Half Day"
                                ? "text-red"
                                : ""
                            }`}
                          >
                            {formatSeconds(
                              row.workSeconds
                            )}
                          </td>

                          <td className="text-muted">
                            Shift 1
                          </td>

                          <td>

                            <span
                              className={`status-badge badge-${getStatusType(
                                row.status
                              )}`}
                            >
                              {row.status}
                            </span>

                          </td>

                          <td>

                            <div className="action-buttons">

                              <button
                                className="btn-action"
                                onClick={() =>
                                  handleEditAttendance(
                                    row
                                  )
                                }
                              >
                                <Pencil className="icon-xs" />
                              </button>

                              <button
                                className="btn-action btn-delete"
                                onClick={() =>
                                  handleDeleteAttendance(
                                    row._id
                                  )
                                }
                              >
                                <Trash2 className="icon-xs" />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="analytics-grid">

              <div className="chart-box-card">

                <div className="card-sub-header">
                  <div className="indicator-line"></div>
                  <h4>
                    Attendance Distribution
                  </h4>
                </div>

                <div className="chart-flex-container">

                  <div className="chart-wrapper">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <PieChart>

                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={85}
                          dataKey="value"
                        >

                          {chartData.map(
                            (
                              entry,
                              index
                            ) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.color
                                }
                              />
                            )
                          )}

                        </Pie>

                        <Tooltip />

                      </PieChart>

                    </ResponsiveContainer>

                    <div className="chart-tooltip-mock">

                      <span className="tooltip-title">
                        Present
                      </span>

                      <span className="tooltip-val">
                        {
                          statusCounts.Present
                        }
                      </span>

                    </div>

                  </div>

                  <div className="chart-legends">

                    {chartData.map(
                      (item, idx) => (

                        <div
                          key={idx}
                          className="legend-item"
                        >

                          <span
                            className="legend-dot"
                            style={{
                              backgroundColor:
                                item.color,
                            }}
                          />

                          <span>
                            {item.name}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

              <div className="chart-box-card">

                <div className="card-sub-header">

                  <div className="indicator-line"></div>

                  <h4>
                    Status Overview
                  </h4>

                </div>

                <div className="circles-grid">

                  {chartData.map(
                    (item, index) => {

                      const percentage =
                        totalStatus > 0
                          ? (
                              (item.value /
                                totalStatus) *
                              100
                            ).toFixed(1)
                          : 0;

                      const classes = [
                        "c-purple",
                        "c-sky",
                        "c-emerald",
                        "c-amber",
                        "c-red",
                      ];

                      return (

                        <div
                          key={item.name}
                          className="circle-item-wrapper"
                        >

                          <div
                            className={`progress-circle ${classes[index]}`}
                          >

                            <span className="circle-percent">
                              {percentage}%
                            </span>

                            <span className="circle-label">
                              {item.name}
                            </span>

                          </div>

                          <p className="circle-total">
                            Total:{" "}
                            {item.value}
                          </p>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

      {/* Floating Action Button */}

      <div className="floating-action-zone">
        <button className="btn-floating">
          <Sparkles className="icon-sm" />
        </button>
      </div>

      {/* =====================================================
          ADMIN EDIT ATTENDANCE MODAL
          Existing UI classes above are unchanged.
      ===================================================== */}

      {editAttendance && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15,23,42,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >

          <form
            onSubmit={
              handleUpdateAttendance
            }
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "480px",
              borderRadius: "16px",
              padding: "24px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,.2)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >

              <div>
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  Modify Attendance
                </h3>

                <small>
                  {selectedTeacher?.name} •{" "}
                  {formatDate(
                    editAttendance.date
                  )}
                </small>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditAttendance(null)
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

            </div>

            <div
              style={{
                marginBottom: "15px",
              }}
            >

              <label>
                Status
              </label>

              <select
                name="status"
                value={editForm.status}
                onChange={
                  handleEditChange
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  marginTop: "6px",
                  border:
                    "1px solid #ddd",
                  borderRadius: "8px",
                }}
              >

                <option value="Present">
                  Present
                </option>

                <option value="Late">
                  Late
                </option>

                <option value="Half Day">
                  Half Day
                </option>

                <option value="Leave">
                  Leave
                </option>

                <option value="Absent">
                  Absent
                </option>

              </select>

            </div>

            <div
              style={{
                marginBottom: "15px",
              }}
            >

              <label>
                Punch In
              </label>

              <input
                type="datetime-local"
                name="punchIn"
                value={editForm.punchIn}
                onChange={
                  handleEditChange
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  marginTop: "6px",
                  border:
                    "1px solid #ddd",
                  borderRadius: "8px",
                  boxSizing:
                    "border-box",
                }}
              />

            </div>

            <div
              style={{
                marginBottom: "20px",
              }}
            >

              <label>
                Punch Out
              </label>

              <input
                type="datetime-local"
                name="punchOut"
                value={
                  editForm.punchOut
                }
                onChange={
                  handleEditChange
                }
                style={{
                  width: "100%",
                  padding: "11px",
                  marginTop: "6px",
                  border:
                    "1px solid #ddd",
                  borderRadius: "8px",
                  boxSizing:
                    "border-box",
                }}
              />

            </div>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "flex-end",
                gap: "10px",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  setEditAttendance(null)
                }
                disabled={saving}
                style={{
                  padding:
                    "10px 18px",
                  border:
                    "1px solid #ddd",
                  background: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  padding:
                    "10px 18px",
                  border: "none",
                  background:
                    "#7C4DFF",
                  color: "#fff",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                {saving
                  ? "Saving..."
                  : "Update Attendance"}
              </button>

            </div>

          </form>

        </div>

      )}

    </div>
  );
};

export default EmployeeAttendance;