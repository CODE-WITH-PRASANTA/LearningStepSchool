import React, { useState, useRef, useEffect } from "react";
import "./ExpenseHead.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import API from "../../api/axios";

const ExpenseHead = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ BACKEND DATA
  const [data, setData] = useState([]);

  // ✅ FORM STATE
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  // ✅ CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetchHeads();
  }, []);

  const fetchHeads = async () => {
    try {
      const res = await API.get("/expense-heads");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SAVE / UPDATE
  const handleSave = async () => {
    if (!form.name) {
      return Swal.fire("Error", "Expense head required ❌", "error");
    }

    try {
      if (editId) {
        await API.put(`/expense-heads/${editId}`, form);
        Swal.fire("Updated!", "", "success");
      } else {
        await API.post("/expense-heads", form);
        Swal.fire("Saved!", "", "success");
      }

      setForm({ name: "", description: "" });
      setEditId(null);
      fetchHeads();
    } catch (err) {
      Swal.fire("Error", "Operation failed ❌", "error");
    }
  };

  // ✅ DELETE
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete "${name}" ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await API.delete(`/expense-heads/${id}`);
        fetchHeads();
        Swal.fire("Deleted!", "Expense head deleted.", "success");
      }
    });
  };

  // ✅ EDIT
  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || "",
    });
    setEditId(item._id);
    setOpenMenu(null);
  };

  // PAGINATION (NO CHANGE)
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
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Expense Head"
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
            />

            <button className="expenseHead-saveBtn" onClick={handleSave}>
              {editId ? "Update" : "Save"}
            </button>
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
                  <tr key={item._id}>
                    <td>{item.name}</td>

                    <td className="expenseHead-actionCell">
                      <button
                        className="expenseHead-actionBtn"
                        onClick={() => toggleMenu(item._id)}
                      >
                        Action ▾
                      </button>

                      {openMenu === item._id && (
                        <div className="expenseHead-menu" ref={menuRef}>
                          <button onClick={() => handleEdit(item)}>
                            <FaEdit /> Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() =>
                              handleDelete(item._id, item.name)
                            }
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