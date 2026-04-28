import React, { useMemo, useState } from "react";
import "./LeaveTable.css";

import API,{IMAGE_URL} from "../../api/axios";
import { useEffect } from "react";
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

  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await API.get("/admin/leaves");

        setLeaveData(res.data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const filteredData = useMemo(() => {
    return leaveData.filter((item) =>
      item.teacher?.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, leaveData]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/admin/leaves/${id}`, { status });
  
      alert(res.data.message); // ✅ shows success
  
      setLeaveData((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading leaves...</h2>;
  }

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

            <button className="report-btn">Download Report</button>

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
              {currentRows.map((item) => {
                const getDays = (from, to) => {
                  const diff = new Date(to) - new Date(from);
                  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
                };

                const getStatusStyle = (status) => {
                  switch (status) {
                    case "approved":
                      return { color: "#15803d", bg: "#dcfce7" };
                    case "rejected":
                      return { color: "#b91c1c", bg: "#fee2e2" };
                    default:
                      return { color: "#b45309", bg: "#fef3c7" };
                  }
                };

                const style = getStatusStyle(item.status);

                return (
                  <tr key={item._id}>
                    {/* 👤 Teacher */}
                    <td>
                      <div className="user-box">
                        <img
                          src={
                            item.teacher?.image
                              ? `${IMAGE_URL}${item.teacher.image}`
                              : "/default-avatar.png"
                          }
                          alt="user"
                        />
                        <span>{item.teacher?.name || "No Name"}</span>
                      </div>
                    </td>

                    {/* 📌 Leave Type */}
                    <td style={{ fontWeight: "600" }}>{item.leaveType}</td>

                    {/* 🏢 Department */}
                    <td>{item.teacher?.department || "-"}</td>

                    {/* 📅 Days */}
                    <td>{getDays(item.fromDate, item.toDate)}</td>

                    {/* 📆 Start */}
                    <td>{new Date(item.fromDate).toLocaleDateString()}</td>

                    {/* 📆 End */}
                    <td>{new Date(item.toDate).toLocaleDateString()}</td>

                    {/* ✅ Status Dropdown */}
                    <td className="menu-relative">
                      <button
                        className="status-btn"
                        style={{
                          color: style.color,
                          background: style.bg,
                        }}
                        onClick={() => {
                          setStatusMenu(
                            statusMenu === item._id ? null : item._id,
                          );
                          setActionMenu(null);
                        }}
                      >
                        {item.status}
                        <FaChevronDown />
                      </button>

                      {statusMenu === item._id && (
                        <div className="table-dropdown">
                          <p
                            onClick={() => {
                              updateStatus(item._id, "pending");
                              setStatusMenu(null);
                            }}
                          >
                            Pending
                          </p>

                          <p
                            onClick={() => {
                              updateStatus(item._id, "approved");
                              setStatusMenu(null);
                            }}
                          >
                            Approved
                          </p>

                          <p
                            onClick={() => {
                              updateStatus(item._id, "rejected");
                              setStatusMenu(null);
                            }}
                          >
                            Rejected
                          </p>
                        </div>
                      )}
                    </td>

                    {/* ⚙️ Action Dropdown */}
                    <td className="menu-relative">
                      <button
                        className="dots-btn"
                        onClick={() => {
                          setActionMenu(
                            actionMenu === item._id ? null : item._id,
                          );
                          setStatusMenu(null);
                        }}
                      >
                        <FaEllipsisH />
                      </button>

                      {actionMenu === item._id && (
                        <div className="table-dropdown action-drop">
                          <p>Edit</p>
                          <p>Delete</p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom */}
        <div className="leave-bottom">
          <p>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>

          <div className="pagination">
            <button onClick={() => changePage(1)}>
              <FaAngleDoubleLeft />
            </button>

            <button onClick={() => changePage(currentPage - 1)}>
              <FaAngleLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active-page" : ""}
                onClick={() => changePage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button onClick={() => changePage(currentPage + 1)}>
              <FaAngleRight />
            </button>

            <button onClick={() => changePage(totalPages)}>
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTable;
