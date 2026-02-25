import React, { useState } from "react";
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi";
import "./VisitorBook.css";

const initialData = [
  { id: 1, purpose: "Pickup", name: "Rakesh", email: "", phone: "", persons: 2, date: "2026-01-28", inTime: "02:03", outTime: "", createdBy: "Admin" },
  { id: 2, purpose: "Meet principal", name: "Omprakash", email: "test@mail.com", phone: "8005843348", persons: 1, date: "2026-01-18", inTime: "01:00", outTime: "12:00", createdBy: "Admin" },
  { id: 3, purpose: "Interview", name: "Rahul", email: "", phone: "9000000000", persons: 1, date: "2026-01-12", inTime: "11:00", outTime: "", createdBy: "Admin" },
  { id: 4, purpose: "Pickup", name: "Amit", email: "", phone: "", persons: 3, date: "2026-01-10", inTime: "10:20", outTime: "", createdBy: "Admin" },
  { id: 5, purpose: "Meeting", name: "Suresh", email: "", phone: "", persons: 1, date: "2026-01-09", inTime: "09:20", outTime: "", createdBy: "Admin" },
  { id: 6, purpose: "Delivery", name: "Courier", email: "", phone: "", persons: 1, date: "2026-01-08", inTime: "08:30", outTime: "", createdBy: "Admin" },
  { id: 7, purpose: "Interview", name: "Priya", email: "", phone: "", persons: 1, date: "2026-01-07", inTime: "12:00", outTime: "", createdBy: "Admin" },
  { id: 8, purpose: "Pickup", name: "Kiran", email: "", phone: "", persons: 2, date: "2026-01-06", inTime: "02:20", outTime: "", createdBy: "Admin" },
  { id: 9, purpose: "Meeting", name: "Deepak", email: "", phone: "", persons: 1, date: "2026-01-05", inTime: "03:20", outTime: "", createdBy: "Admin" },
];

export default function VisitorBook() {
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState({});
  const [openAction, setOpenAction] = useState(null);
  const [page, setPage] = useState(1);

  const perPage = 7;

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.purpose) return alert("Required fields");

    const newItem = {
      id: Date.now(),
      createdBy: "Admin",
      persons: form.persons || 1,
      ...form,
    };

    setData([newItem, ...data]);
    setForm({});
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setData(data.filter((d) => d.id !== id));
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(data.length / perPage);
  const paginated = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="vlist-wrapper">
      <h3 className="page-title">Visitor Book</h3>

      <div className="vlist-layout">
        {/* ================= FORM ================= */}
        <div className="visitor-form-card">
          <div className="visitor-form-header">Add Visitors</div>

          <div className="visitor-form-body">
            <label>Purpose *</label>
            <input name="purpose" value={form.purpose || ""} onChange={handleChange} />

            <label>Name *</label>
            <input name="name" value={form.name || ""} onChange={handleChange} />

            <label>Email</label>
            <input name="email" value={form.email || ""} onChange={handleChange} />

            <label>Phone</label>
            <input name="phone" value={form.phone || ""} onChange={handleChange} />

            <label>Persons</label>
            <input name="persons" type="number" value={form.persons || ""} onChange={handleChange} />

            <label>Date</label>
            <input name="date" type="date" value={form.date || ""} onChange={handleChange} />

            <label>In Time</label>
            <input name="inTime" type="time" value={form.inTime || ""} onChange={handleChange} />

            <label>Out Time</label>
            <input name="outTime" type="time" value={form.outTime || ""} onChange={handleChange} />

            <button className="save-btn" onClick={handleSave}>
              Save Visitor
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="visitor-table-card">
          <div className="visitor-table-header">Visitor List</div>

          <div className="table-wrap">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Purpose</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Person</th>
                  <th>Date</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((v) => (
                  <tr key={v.id}>
                    <td>{v.purpose}</td>
                    <td>{v.name}</td>
                    <td>{v.email || "-"}</td>
                    <td>{v.phone || "-"}</td>
                    <td>{v.persons}</td>
                    <td>{v.date}</td>
                    <td>{v.inTime}</td>
                    <td>{v.outTime || "-"}</td>
                    <td>{v.createdBy}</td>

                    <td className="action-cell">
                      <button
                        className="dot-btn"
                        onClick={() => setOpenAction(openAction === v.id ? null : v.id)}
                      >
                        <FiMoreVertical />
                      </button>

                      {openAction === v.id && (
                        <div className="action-menu">
                          <button>
                            <FiEdit /> Edit
                          </button>

                          <button onClick={() => handleDelete(v.id)}>
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={page === i + 1 ? "active" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}