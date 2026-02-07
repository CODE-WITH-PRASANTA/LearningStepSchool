import React, { useState } from "react";
import { FiMoreVertical, FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import "./VisitorBook.css";

const VisitorBook = () => {
  const [openAction, setOpenAction] = useState(null);
  const [viewData, setViewData] = useState(null);

  const data = [
    {
      id: 1,
      purpose: "To pick up the child",
      name: "Rakesh",
      email: "",
      phone: "",
      persons: 2,
      date: "2026-01-28",
      inTime: "02:03",
      outTime: "",
      createdBy: "Demo",
    },
    {
      id: 2,
      purpose: "To meet the principal",
      name: "Omprakash",
      email: "test@mail.com",
      phone: "8005843348",
      persons: 1,
      date: "2026-01-18",
      inTime: "01:00",
      outTime: "12:00",
      createdBy: "Demo",
    },
  ];

  return (
    <div className="vlist-wrapper">
      <h3 className="page-title">Visitor Book</h3>

      <div className="vlist-layout">
        {/* ================= FORM ================= */}
        <div className="visitor-form-card">
          <div className="visitor-form-header">✏️ Add Visitors</div>

          <div className="visitor-form-body">
            <label>Purpose <span>*</span></label>
            <select>
              <option value="">Select</option>
              <option>To pick up the child</option>
              <option>To meet the principal</option>
              <option>Interview</option>
            </select>

            <label>Name <span>*</span></label>
            <input type="text" />

            <label>Email</label>
            <input type="email" />

            <label>Phone</label>
            <input type="text" />

            <label>Number Of Person</label>
            <input type="number" />

            <label>Date</label>
            <input type="date" />

            <label>In Time</label>
            <input type="time" />

            <label>Out Time</label>
            <input type="time" />

            <button className="save-btn">Save</button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="visitor-table-card">
          <div className="visitor-table-header">Visitor List</div>

          <div className="table-wrap">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>PURPOSE</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>PERSON</th>
                  <th>DATE</th>
                  <th>IN</th>
                  <th>OUT</th>
                  <th>BY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {data.map((v) => (
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
                        onClick={() =>
                          setOpenAction(openAction === v.id ? null : v.id)
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {openAction === v.id && (
                        <div className="action-menu">
                          <button onClick={() => setViewData(v)}>
                            <FiEye /> View
                          </button>

                          <Link to="/front-office/visitors/edit" className="lnk">
                            <FiEdit /> Edit
                          </Link>

                          <button>
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
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {viewData && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              Visitor Details
              <span onClick={() => setViewData(null)}>✕</span>
            </div>

            <div className="modal-body">
              <p><b>Purpose:</b> {viewData.purpose}</p>
              <p><b>Name:</b> {viewData.name}</p>
              <p><b>Email:</b> {viewData.email || "-"}</p>
              <p><b>Phone:</b> {viewData.phone || "-"}</p>
              <p><b>Date:</b> {viewData.date}</p>
              <p><b>In Time:</b> {viewData.inTime}</p>
              <p><b>Out Time:</b> {viewData.outTime || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorBook;
