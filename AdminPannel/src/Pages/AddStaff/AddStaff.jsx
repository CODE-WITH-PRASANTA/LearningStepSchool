import React, { useState, useEffect } from "react";
import "./AddStaff.css";

/* Dummy Data */
const staffData = [
  { id: 1, memberId: "1", cardNo: "EMP-1", name: "Nlet Initiatives LLP", email: "ims@nletsolutions.in", dob: "1970-01-01", phone: "9982716888" },
  { id: 2, memberId: "6", cardNo: "EMP-101", name: "Driver", email: "driver@gmail.com", dob: "2023-10-17", phone: "809436469" },
  { id: 3, memberId: "9", cardNo: "EMP-201", name: "Demo", email: "demo@nlet.in", dob: "2023-05-31", phone: "1234567890" },
  { id: 4, memberId: "10", cardNo: "EMP-202", name: "Robert", email: "teacher@nlet.in", dob: "2023-06-16", phone: "1234567890" },
  { id: 5, memberId: "11", cardNo: "2345", name: "Test Test", email: "testtest@gmail.com", dob: "2022-07-31", phone: "1234567890" },
  { id: 6, memberId: "12", cardNo: "EMP-20", name: "Aatam", email: "drd@gmail.com", dob: "2010-08-25", phone: "8952972792" },
  { id: 7, memberId: "13", cardNo: "EMP-11001", name: "Channel", email: "cp@nlet.in", dob: "2023-08-08", phone: "1234567890" }
];

export default function AddStaff() {
  const [search, setSearch] = useState("");
  const [openAction, setOpenAction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const close = () => setOpenAction(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  /* Filter */
  const filtered = staffData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  /* Pagination Logic */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="staff-page">

      {/* HEADER */}
      <div className="staff-header">
        <h2>👤 Add Staff</h2>
        <span>Library / Add Staff</span>
      </div>

      {/* CARD */}
      <div className="staff-card">

        <div className="staff-card-header">
          📋 Add Staff List
          <button className="bulk-btn">Bulk Member Id Update</button>
        </div>

        <div className="staff-toolbar">
          Search:
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="staff-table-wrap">
          <table className="staff-table">
            <thead>
              <tr>
                <th>MEMBER ID</th>
                <th>LIBRARY CARD NO</th>
                <th>STAFF NAME</th>
                <th>EMAIL</th>
                <th>DATE OF BIRTH</th>
                <th>PHONE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((s) => (
                <tr key={s.id}>
                  <td>{s.memberId}</td>
                  <td>{s.cardNo}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.dob}</td>
                  <td>{s.phone}</td>

                  <td className="staff-action-cell">
                    <button
                      className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenAction(openAction === s.id ? null : s.id);
                      }}
                    >
                      Action ▾
                    </button>

                    {openAction === s.id && (
                      <div className="staff-action-menu">
                        <div onClick={() => setShowModal(true)}>Add Member</div>
                        <div>Edit</div>
                        <div>Delete</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {currentRows.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">

            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {[...Array(totalPages)]
              .map((_, i) => i + 1)
              .slice(
                Math.max(currentPage - 3, 0),
                Math.min(currentPage + 2, totalPages)
              )
              .map((page) => (
                <button
                  key={page}
                  className={currentPage === page ? "active-page" : ""}
                  onClick={() => changePage(page)}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>

          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Add Member</h3>
              <span onClick={() => setShowModal(false)}>✕</span>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                <div>
                  <label>Library Card No *</label>
                  <input type="text" />
                </div>

                <div>
                  <label>Maximum Book Allowed *</label>
                  <input type="number" />
                </div>
              </div>

              <div className="modal-btn-wrap">
                <button
                  className="btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
