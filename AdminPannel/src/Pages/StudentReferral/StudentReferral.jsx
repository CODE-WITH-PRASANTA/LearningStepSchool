import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentReferral.css";

const StudentReferral = () => {
  const dropdownRef = useRef(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);

  const rowsPerPage = 6;

  const data = [
    {
      id: 1,
      referralBy: "KSVI",
      name: "new student refer",
      email: "ghk@kkkl.bnm",
      mobile: "8976543210",
      note: "",
    },
    {
      id: 2,
      referralBy: "Lavanya",
      name: "kartik",
      email: "kartik@gmail.com",
      mobile: "48592145",
      note: "test",
    },
    {
      id: 3,
      referralBy: "Samkit",
      name: "yyyyyy",
      email: "yyyy@gmail.com",
      mobile: "6677889944",
      note: "",
    },
    {
      id: 4,
      referralBy: "sujal acharya",
      name: "sanjay kumar",
      email: "acharyasujal43@gmail.com",
      mobile: "8949198172",
      note: "",
    },
    {
      id: 5,
      referralBy: "Amit",
      name: "Rahul",
      email: "rahul@gmail.com",
      mobile: "9000000001",
      note: "",
    },
    {
      id: 6,
      referralBy: "Priya",
      name: "Anita",
      email: "anita@gmail.com",
      mobile: "9000000002",
      note: "",
    },
    {
      id: 7,
      referralBy: "Ravi",
      name: "John",
      email: "john@gmail.com",
      mobile: "9000000003",
      note: "",
    },
  ];

  /* ================= Search Filter ================= */
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  /* ================= Pagination ================= */
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  /* ================= Close dropdown on outside click ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= Actions ================= */
  const handleDelete = (id) => {
    alert("Delete ID: " + id);
  };

  const handleEdit = (id) => {
    alert("Edit ID: " + id);
  };

  return (
    <div className="sr-container">
      <div className="sr-card">
        {/* ================= Header ================= */}
        <div className="sr-header">
          <h2>Student Referral</h2>

          <Link to="/add/referral" style={{ textDecoration: "none" }}>
            <button className="sr-add-btn">+ Add</button>
          </Link>
        </div>

        {/* ================= Search ================= */}
        <div className="sr-topbar">
          <div></div>
          <div className="sr-search">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search here..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* ================= Table ================= */}
        <div className="sr-table-wrapper">
          <table className="sr-table">
            <thead>
              <tr>
                <th>#</th>
                <th>REFERRAL BY</th>
                <th>STUDENT NAME</th>
                <th>EMAIL</th>
                <th>MOBILE NUMBER</th>
                <th>NOTE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td>{row.referralBy}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.mobile}</td>
                  <td>{row.note}</td>
                  <td>
                    <div
                      className="sr-action-wrapper"
                      ref={dropdownRef}
                    >
                      <button
                        className="sr-action-btn"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === row.id ? null : row.id
                          )
                        }
                      >
                        Action ▾
                      </button>

                      {openDropdown === row.id && (
                        <div className="sr-dropdown">
                          <button
                            onClick={() => handleEdit(row.id)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="sr-no-data">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= Footer ================= */}
        <div className="sr-footer">
          <span>
            Showing{" "}
            {filteredData.length === 0
              ? 0
              : (currentPage - 1) * rowsPerPage + 1}{" "}
            to{" "}
            {Math.min(
              currentPage * rowsPerPage,
              filteredData.length
            )}{" "}
            of {filteredData.length} entries
          </span>

          <div className="sr-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(currentPage - 1)
              }
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={
                  currentPage === i + 1 ? "active" : ""
                }
                onClick={() =>
                  setCurrentPage(i + 1)
                }
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
              onClick={() =>
                setCurrentPage(currentPage + 1)
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReferral;