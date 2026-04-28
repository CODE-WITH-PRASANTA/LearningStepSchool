import React, { useState, useMemo } from "react";
import "./EmployeeAttendance.css";
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

const EmployeeAttendance = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2024");
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 9;

  const employees = [
    {
      id: 1,
      name: "Anthony Thomas",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
      leave: "3 Day",
    },
    {
      id: 2,
      name: "Benjamin Martinez",
      img: "https://randomuser.me/api/portraits/men/44.jpg",
      leave: "12 Day",
    },
    {
      id: 3,
      name: "Christopher Moore",
      img: "https://randomuser.me/api/portraits/men/52.jpg",
      leave: "1 Day",
    },
    {
      id: 4,
      name: "Emily Davis",
      img: "https://randomuser.me/api/portraits/women/40.jpg",
      leave: "5 Day",
    },
    {
      id: 5,
      name: "Robert Wilson",
      img: "https://randomuser.me/api/portraits/men/35.jpg",
      leave: "2 Day",
    },
    {
      id: 6,
      name: "Sophia Johnson",
      img: "https://randomuser.me/api/portraits/women/12.jpg",
      leave: "4 Day",
    },
    {
      id: 7,
      name: "David Lee",
      img: "https://randomuser.me/api/portraits/men/19.jpg",
      leave: "0 Day",
    },
    {
      id: 8,
      name: "Olivia Brown",
      img: "https://randomuser.me/api/portraits/women/25.jpg",
      leave: "6 Day",
    },
    {
      id: 9,
      name: "James Carter",
      img: "https://randomuser.me/api/portraits/men/28.jpg",
      leave: "7 Day",
    },
    {
      id: 10,
      name: "Nancy Harris",
      img: "https://randomuser.me/api/portraits/women/50.jpg",
      leave: "1 Day",
    },
    {
      id: 11,
      name: "Michael Brown",
      img: "https://randomuser.me/api/portraits/men/11.jpg",
      leave: "3 Day",
    },
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getStatus = (day, id) => {
    if ((day + id) % 7 === 0) return "late";
    if ((day + id) % 10 === 0) return "absent";
    if ((day + id) % 13 === 0) return "leave";
    return "present";
  };

  const filtered = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filtered.length / perPage);

  const currentData = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const goPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderIcon = (status) => {
    if (status === "present")
      return (
        <span className="status present">
          <FaCheck />
        </span>
      );

    if (status === "late")
      return (
        <span className="status late">
          <FaTimes />
        </span>
      );

    if (status === "absent")
      return (
        <span className="status absent">
          <FaMinus />
        </span>
      );

    return (
      <span className="status leave">
        <FaMinus />
      </span>
    );
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

          <div className="year-select">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
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
              <tr key={emp.id}>
                <td className="sticky-col employee-cell">
                  <img src={emp.img} alt={emp.name} />
                  <span>{emp.name}</span>
                </td>

                {days.map((day) => (
                  <td key={day}>{renderIcon(getStatus(day, emp.id))}</td>
                ))}

                <td className="leave-text">{emp.leave}</td>
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