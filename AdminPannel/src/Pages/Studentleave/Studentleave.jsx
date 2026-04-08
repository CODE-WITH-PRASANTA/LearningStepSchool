import React, { useState, useEffect } from "react";
import "./Studentleave.css";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios"; // 🔥 add this

const Studentleave = () => {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  const rowsPerPage = 4;

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/student-leave");

      setRows(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* CLOSE DROPDOWN CLICK OUTSIDE */
  useEffect(() => {
    const closeMenu = () => setOpenMenu(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  /* SEARCH */
  const filtered = rows.filter((r) =>
    `${r.student?.firstName || ""} ${r.student?.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentRows = filtered.slice(start, start + rowsPerPage);

  const handleStatusToggle = async (id, currentStatus) => {
    let status = currentStatus || "Pending";

    let newStatus = "Pending";

    if (status === "Pending") newStatus = "Approved";
    else if (status === "Approved") newStatus = "Rejected";
    else if (status === "Rejected") newStatus = "Pending";

    try {
      await API.put(`/student-leave/${id}/status`, {
        status: newStatus,
      });

      // ✅ instant UI update (NO API reload)
      setRows((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ACTIONS */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    try {
      await API.delete(`/student-leave/${id}`);
      fetchLeaves(); // refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (row) => {
    navigate(`/attendance/student-leave/add?id=${row._id}`);
  };

  return (
    <div className="Studentleave-container">
      {/* HEADER */}
      <div className="Studentleave-header">
        <h2>📋 Student Leave List</h2>
        <button
          className="Studentleave-addBtn"
          onClick={() => navigate("/attendance/student-leave/add")}
        >
          Add Leave
        </button>{" "}
      </div>

      {/* TOOLBAR */}
      <div className="Studentleave-toolbar">
        <div></div>
        <div className="Studentleave-search">
          <select>
            <option>10</option>
          </select>
          <label>
            Search :
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
      </div>

      {/* TABLE */}
      <div className="Studentleave-tableWrapper">
        <table className="Studentleave-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CLASS</th>
              <th>APPLY DATE</th>
              <th>NO OF DAYS</th>
              <th>LEAVE DATE</th>
              <th>STATUS</th>
              <th>REPLY</th>
              <th>DESCRIPTION</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row, i) => (
              <tr key={row._id}>
                {/* ✅ Student Name */}
                <td>
                  {row.student
                    ? `${row.student.firstName} ${row.student.lastName}`
                    : "-"}
                </td>

                {/* ✅ Class */}
                <td>{row.className}</td>

                {/* ✅ Apply Date */}
                <td>
                  {row.applyDate
                    ? new Date(row.applyDate).toLocaleDateString()
                    : "-"}
                </td>

                {/* ✅ No of Days */}
                <td>
                  {Math.ceil(
                    (new Date(row.leaveTo) - new Date(row.leaveFrom)) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  Days
                </td>

                {/* ✅ Leave Date */}
                <td>
                  {new Date(row.leaveFrom).toLocaleDateString()} –{" "}
                  {new Date(row.leaveTo).toLocaleDateString()}
                </td>

                {/* 🔥 STATUS TOGGLE */}
                <td>
                  <span
                    className={`status-badge ${
                      row.status === "Approved"
                        ? "green"
                        : row.status === "Rejected"
                          ? "red"
                          : "yellow"
                    }`}
                    title="Click to change status" // 🔥 tooltip
                    onClick={() => handleStatusToggle(row._id, row.status)}
                  >
                    {row.status || "Pending"}
                  </span>
                </td>

                {/* ✅ Reply */}
                <td>{row.reply || "-"}</td>

                {/* ✅ Description */}
                <td>{row.description}</td>

                {/* 🔥 ACTION BUTTON */}
                <td className="Studentleave-actionCell">
                  <div
                    className="Studentleave-actionWrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="Studentleave-actionBtn"
                      onClick={() => setOpenMenu(openMenu === i ? null : i)}
                    >
                      Action ▾
                    </button>

                    {openMenu === i && (
                      <div className="Studentleave-dropdown">
                        {/* ✏ EDIT */}
                        {/* <button onClick={() => handleEdit(row)}>✏ Edit</button> */}

                        {/* 🗑 DELETE */}
                        <button
                          className="delete"
                          onClick={() => handleDelete(row._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {/* ===== PAGINATION ===== */}
      <div className="Studentleave-pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`pagination-number ${
              currentPage === i + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Studentleave;
