import React, { useState, useMemo } from "react";
import "./EmployeeAttendance.css";
import API, { IMAGE_URL } from "../../api/axios";
import {
  FaSearch,
  FaChevronDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCheck,
  FaTimes,
  FaMinus,
} from "react-icons/fa";
import { useEffect } from "react";

const EmployeeAttendance = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 9;

  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [editing, setEditing] = useState(null); // {teacherId, day}

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [year, month]);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/admin/teachers");

      const data = res.data.data || res.data || [];

      setEmployees(data.filter((u) => u.role === "teacher"));
      setCurrentPage(1);

      console.log("EMPLOYEES:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get(
        `/teacher-attendance?month=${month}&year=${year}`,
      );
      setAttendance(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAttendance = async (teacherId, day, status) => {
    try {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      await API.post("/teacher-attendance/admin", {
        teacherId,
        date,
        status,
      });
      fetchAttendance(); // refresh
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const days = Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);

  const attendanceMap = useMemo(() => {
    const map = {};

    attendance.forEach((item) => {
      const teacherId = item.teacherId?._id;
      const day = new Date(item.date).getUTCDate();

      if (!map[teacherId]) {
        map[teacherId] = {};
      }

      map[teacherId][day] = item.status;
    });

    return map;
  }, [attendance]);

  const getStatus = (day, teacherId) => {
    return attendanceMap[teacherId]?.[day] || "Absent";
  };

  const filtered = useMemo(() => {
    return employees.filter((emp) =>
      emp.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, employees]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const currentData = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const goPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderIcon = (status) => {
    if (status === "Present")
      return (
        <span className="status present">
          <FaCheck />
        </span>
      );

    if (status === "Absent")
      return (
        <span className="status absent">
          <FaTimes />
        </span>
      );

    if (status === "Leave")
      return (
        <span className="status leave">
          <FaMinus />
        </span>
      );

    return null;
  };

  return (
    <div className="attendance-wrapper">
      {/* Header */}
      <div className="attendance-topbar">
        <h2>Employee Attendance</h2>

        <div className="attendance-actions">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button className="download-btn">Download Report</button>

          <div className="month-select">
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <FaChevronDown />
          </div>

          <div className="year-select">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>{new Date().getFullYear()}</option>
              <option>{new Date().getFullYear() - 1}</option>
              <option>{new Date().getFullYear() - 2}</option>
            </select>
            <FaChevronDown />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="attendance-table-wrap">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="sticky-col">Employee Name</th>

              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}

              <th>Leave</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((emp) => (
              <tr key={emp._id}>
                <td className="sticky-col employee-cell">
                  <img
                    src={
                      emp.image
                        ? `${IMAGE_URL}${emp.image}`
                        : "https://i.pravatar.cc/40"
                    }
                    alt={emp.name}
                  />
                  <span>{emp.name}</span>
                </td>

                {days.map((day) => (
                  <td
                    key={day}
                    className={`cell ${getStatus(day, emp._id).toLowerCase()}`}
                    onClick={() => setEditing({ teacherId: emp._id, day })}
                  >
                    {editing?.teacherId === emp._id && editing?.day === day ? (
                      <select
                        value={getStatus(day, emp._id)}
                        onChange={(e) => updateAttendance(emp._id, day, e.target.value)}
                        onBlur={() => setEditing(null)}
                        autoFocus
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                      </select>
                    ) : (
                      renderIcon(getStatus(day, emp._id))
                    )}
                  </td>
                ))}

                <td className="leave-text">
                  {
                    Object.values(attendanceMap[emp._id] || {}).filter(
                      (s) => s === "Leave",
                    ).length
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pagination-wrap">
        <p>
          Showing {(currentPage - 1) * perPage + 1} to{" "}
          {Math.min(currentPage * perPage, filtered.length)} of{" "}
          {filtered.length} entries
        </p>

        <div className="pagination">
          <button onClick={() => goPage(1)}>
            <FaAngleDoubleLeft />
          </button>

          <button onClick={() => goPage(currentPage - 1)}>
            <FaAngleLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => goPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => goPage(currentPage + 1)}>
            <FaAngleRight />
          </button>

          <button onClick={() => goPage(totalPages)}>
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
