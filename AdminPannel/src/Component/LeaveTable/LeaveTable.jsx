import React, { useMemo, useState } from "react";
import "./LeaveTable.css";
import {
  FaSearch,
  FaChevronDown,
  FaEllipsisH,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const LeaveTable = () => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2024");
  const [currentPage, setCurrentPage] = useState(1);

  const [statusMenu, setStatusMenu] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);

  const rowsPerPage = 10;

  const leaveData = [
    {
      id: 1,
      name: "Anthony Thomas",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      leaveType: "Casual Leave",
      typeColor: "#13b96f",
      department: "Back-End Developer",
      days: "2 Days",
      start: "12 July 2024",
      end: "15 July 2024",
      status: "New",
      statusColor: "#13b96f",
      bg: "#eaf9f1",
    },
    {
      id: 2,
      name: "Anthony Thomas",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      leaveType: "Casual Leave",
      typeColor: "#13b96f",
      department: "Back-End Developer",
      days: "2 Days",
      start: "12 July 2024",
      end: "15 July 2024",
      status: "New",
      statusColor: "#13b96f",
      bg: "#eaf9f1",
    },
    {
      id: 3,
      name: "Benjamin Martinez",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      leaveType: "Casual Leave",
      typeColor: "#13b96f",
      department: "Mobile App Developer",
      days: "4 Days",
      start: "27 July 2024",
      end: "31 July 2024",
      status: "New",
      statusColor: "#13b96f",
      bg: "#eaf9f1",
    },
    {
      id: 4,
      name: "Christopher Moore",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      leaveType: "Maternity Leave",
      typeColor: "#8d97cb",
      department: "Full-Stack Developer",
      days: "1st Half Day",
      start: "03 July 2024",
      end: "04 July 2024",
      status: "Approved",
      statusColor: "#3366ff",
      bg: "#edf2ff",
    },
    {
      id: 5,
      name: "David Wilson",
      image: "https://randomuser.me/api/portraits/men/14.jpg",
      leaveType: "Paternity Leave",
      typeColor: "#f59e0b",
      department: "DevOps Engineer",
      days: "22 Days",
      start: "04 Aug 2024",
      end: "04 Aug 2024",
      status: "Rejected",
      statusColor: "#ff7a00",
      bg: "#fff3e8",
    },
    {
      id: 6,
      name: "Emma Smith",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      leaveType: "Casual Leave",
      typeColor: "#13b96f",
      department: "Mobile App Developer",
      days: "4 Days",
      start: "27 July 2024",
      end: "31 July 2024",
      status: "Rejected",
      statusColor: "#ff7a00",
      bg: "#fff3e8",
    },
    {
      id: 7,
      name: "Olivia Brown",
      image: "https://randomuser.me/api/portraits/women/24.jpg",
      leaveType: "Casual Leave",
      typeColor: "#13b96f",
      department: "UI UX Designer",
      days: "3 Days",
      start: "11 July 2024",
      end: "14 July 2024",
      status: "Approved",
      statusColor: "#3366ff",
      bg: "#edf2ff",
    },
    {
      id: 8,
      name: "James Carter",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      leaveType: "Emergency Leave",
      typeColor: "#ef4444",
      department: "QA Engineer",
      days: "1 Day",
      start: "09 July 2024",
      end: "09 July 2024",
      status: "Pending",
      statusColor: "#f59e0b",
      bg: "#fff7e8",
    },
    {
      id: 9,
      name: "Sophia Lee",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
      leaveType: "Sick Leave",
      typeColor: "#06b6d4",
      department: "HR Manager",
      days: "5 Days",
      start: "17 July 2024",
      end: "22 July 2024",
      status: "Approved",
      statusColor: "#3366ff",
      bg: "#edf2ff",
    },
    {
      id: 10,
      name: "Noah Taylor",
      image: "https://randomuser.me/api/portraits/men/53.jpg",
      leaveType: "Casual Leave",
      typeColor: "#13b96f",
      department: "Backend Engineer",
      days: "2 Days",
      start: "20 Aug 2024",
      end: "22 Aug 2024",
      status: "New",
      statusColor: "#13b96f",
      bg: "#eaf9f1",
    },
  ];

  const filteredData = useMemo(() => {
    return leaveData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentRows = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="leave-table-page">
      <div className="leave-table-card">
        {/* Top */}
        <div className="leave-table-top">
          <h2>Employee’s Leave</h2>

          <div className="leave-table-actions">
            <div className="leave-search-box">
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

            <button className="report-btn">
              Download Report
            </button>

            <select
              className="year-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="leave-table-wrap">
          <table className="leave-table">
            <thead>
              <tr>
                <th>Name ↑↓</th>
                <th>Leave Type ↑↓</th>
                <th>Department ↑↓</th>
                <th>Days ↑↓</th>
                <th>Start ↑↓</th>
                <th>End ↑↓</th>
                <th>Status ↑↓</th>
                <th>Action ↑↓</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="user-box">
                      <img src={item.image} alt="" />
                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td
                    style={{
                      color: item.typeColor,
                      fontWeight: "600",
                    }}
                  >
                    {item.leaveType}
                  </td>

                  <td>{item.department}</td>
                  <td>{item.days}</td>
                  <td>{item.start}</td>
                  <td>{item.end}</td>

                  {/* Status Dropdown */}
                  <td className="menu-relative">
                    <button
                      className="status-btn"
                      style={{
                        color: item.statusColor,
                        background: item.bg,
                      }}
                      onClick={() => {
                        setStatusMenu(
                          statusMenu === item.id
                            ? null
                            : item.id
                        );
                        setActionMenu(null);
                      }}
                    >
                      {item.status}
                      <FaChevronDown />
                    </button>

                    {statusMenu === item.id && (
                      <div className="table-dropdown">
                        <p>Pending</p>
                        <p>Approved</p>
                        <p>Rejected</p>
                        <p>New</p>
                      </div>
                    )}
                  </td>

                  {/* Action Dropdown */}
                  <td className="menu-relative">
                    <button
                      className="dots-btn"
                      onClick={() => {
                        setActionMenu(
                          actionMenu === item.id
                            ? null
                            : item.id
                        );
                        setStatusMenu(null);
                      }}
                    >
                      <FaEllipsisH />
                    </button>

                    {actionMenu === item.id && (
                      <div className="table-dropdown action-drop">
                        <p>Edit</p>
                        <p>Delete</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom */}
        <div className="leave-bottom">
          <p>
            Showing {startIndex + 1} to{" "}
            {Math.min(
              startIndex + rowsPerPage,
              filteredData.length
            )}{" "}
            of {filteredData.length} entries
          </p>

          <div className="pagination">
            <button onClick={() => changePage(1)}>
              <FaAngleDoubleLeft />
            </button>

            <button
              onClick={() =>
                changePage(currentPage - 1)
              }
            >
              <FaAngleLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={
                  currentPage === i + 1
                    ? "active-page"
                    : ""
                }
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                changePage(currentPage + 1)
              }
            >
              <FaAngleRight />
            </button>

            <button
              onClick={() =>
                changePage(totalPages)
              }
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTable;