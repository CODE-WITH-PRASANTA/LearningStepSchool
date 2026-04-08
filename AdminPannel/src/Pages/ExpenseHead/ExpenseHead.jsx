import React, { useState, useRef, useEffect } from "react";
import "./ExpenseHead.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ExpenseHead = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const data = [
    { id: 1, name: "ABC Limited" },
    { id: 2, name: "Annual Wifi Charges" },
    { id: 3, name: "Books" },
    { id: 4, name: "books" },
    { id: 5, name: "BOOKS ( Foundation EXAM )" },
    { id: 6, name: "Chair" }
  ];

  // ✅ CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  // ✅ DELETE
  const handleDelete = (name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Expense head deleted.", "success");
      }
    });
  };

  // PAGINATION
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setOpenMenu(null);
  };

  return (
    <div className="expenseHead-wrapper">
      <div className="expenseHead-pageTitle">Expense Head</div>

      <div className="expenseHead-grid">
        {/* LEFT */}
        <div className="expenseHead-card">
          <div className="expenseHead-cardHeader">
            Add / Edit Expense Head
          </div>

          <div className="expenseHead-form">
            <label>Expense Head *</label>
            <input placeholder="Enter Expense Head" />

            <label>Description</label>
            <textarea placeholder="Enter description" />

            <button className="expenseHead-saveBtn">Save</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="expenseHead-card">
          <div className="expenseHead-cardHeader">
            Expense Head List
          </div>

          <div className="expenseHead-tableWrap">
            <table className="expenseHead-table">
              <thead>
                <tr>
                  <th>EXPENSE HEAD</th>
                  <th className="actionHeader">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>

                    <td className="expenseHead-actionCell">
                      <button
                        className="expenseHead-actionBtn"
                        onClick={() => toggleMenu(item.id)}
                      >
                        Action ▾
                      </button>

                      {openMenu === item.id && (
                        <div className="expenseHead-menu" ref={menuRef}>
                          <button>
                            <FaEdit /> Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() => handleDelete(item.name)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="expenseHead-pagination">
              <div className="expenseHead-paginationInfo">
                Showing {indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, data.length)} of {data.length}
              </div>

              <div className="expenseHead-paginationControls">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "disabled" : ""}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "disabled" : ""}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHead;