import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Activity.css";

const initialActivities = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  activity: "Dance",
  type: "Scholastic",
  checked: false,
}));

export default function ActivityAdmin() {
  const [form, setForm] = useState({
    className: "",
    section: "",
    subject: "",
    type: "Scholastic",
  });

  const [activities, setActivities] = useState(initialActivities);
  const [selectAll, setSelectAll] = useState(false);

  /* ================= PAGINATION ================= */

  const rowsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(activities.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = activities.slice(indexOfFirstRow, indexOfLastRow);

  const changePage = (page) => {
    setCurrentPage(page);
    setSelectAll(false);
  };

  /* ================= HANDLERS ================= */

  const handleSave = () => {
    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "Activity saved successfully",
      confirmButtonColor: "#050a7d",
    });
  };

  const handleEdit = (row) => {
    setForm({
      className: "1st",
      section: "A",
      subject: row.activity,
      type: row.type,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This activity will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff355d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setActivities((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Deleted!", "Activity deleted.", "success");
      }
    });
  };

  const handleBulkDelete = () => {
    const selected = activities.filter((a) => a.checked);

    if (selected.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Selection",
        text: "Please select at least one activity",
      });
      return;
    }

    Swal.fire({
      title: `Delete ${selected.length} activities?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff355d",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setActivities((prev) => prev.filter((a) => !a.checked));
        setSelectAll(false);
        Swal.fire("Deleted!", "Selected activities removed.", "success");
      }
    });
  };

  const toggleSelectAll = (checked) => {
    setSelectAll(checked);
    setActivities(
      activities.map((a, index) =>
        index >= indexOfFirstRow && index < indexOfLastRow
          ? { ...a, checked }
          : a
      )
    );
  };

  return (
    <div className="adm-page">
      <div className="adm-header">
        <h2>Activity Management</h2>
      </div>

      <div className="adm-layout">

        {/* ================= HORIZONTAL FORM ================= */}

        <div className="adm-card adm-form">
          <h3>Add Activity</h3>

          <div className="adm-form-row">
            <div>
              <label>Class *</label>
              <select
                value={form.className}
                onChange={(e) =>
                  setForm({ ...form, className: e.target.value })
                }
              >
                <option value="">Select Class</option>
                <option>1st</option>
                <option>2nd</option>
              </select>
            </div>

            <div>
              <label>Section *</label>
              <select
                value={form.section}
                onChange={(e) =>
                  setForm({ ...form, section: e.target.value })
                }
              >
                <option value="">Select Section</option>
                <option>A</option>
                <option>B</option>
              </select>
            </div>

            <div>
              <label>Subject *</label>
              <select
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              >
                <option value="">Select Subject</option>
                <option>English</option>
                <option>Math</option>
              </select>
            </div>

            <div>
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option>Scholastic</option>
                <option>Co-Scholastic</option>
              </select>
            </div>

            <div className="adm-btn-wrap">
              <button className="adm-save-btn" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}

        <div className="adm-card adm-table-card">
          <div className="adm-table-top">
            <h3>Activity List</h3>
            <button className="adm-bulk-btn" onClick={handleBulkDelete}>
              Bulk Delete
            </button>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) =>
                        toggleSelectAll(e.target.checked)
                      }
                    />
                  </th>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.checked}
                        onChange={(e) =>
                          setActivities(
                            activities.map((a) =>
                              a.id === row.id
                                ? { ...a, checked: e.target.checked }
                                : a
                            )
                          )
                        }
                      />
                    </td>
                    <td>{row.activity}</td>
                    <td>{row.type}</td>
                    <td className="adm-td-action">
                      <button
                        className="adm-edit-btn"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </button>
                      <button
                        className="adm-delete-btn"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}

          <div className="adm-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}