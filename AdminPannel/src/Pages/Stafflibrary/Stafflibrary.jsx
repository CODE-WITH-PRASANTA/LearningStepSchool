import React, { useState } from "react";
import "./Stafflibrary.css";

const initialStaffData = [
  {
    id: 1,
    card: "EMP-1",
    name: "Nlet Initiatives LLP",
    email: "ims@nletsolutions.in",
    dob: "1970-01-01",
    phone: "9982716888",
  },
  {
    id: 2,
    card: "EMP-101",
    name: "Driver",
    email: "driver@gmail.com",
    dob: "2023-10-17",
    phone: "809436469",
  },
  {
    id: 3,
    card: "EMP-201",
    name: "Demo",
    email: "demo@nlet.in",
    dob: "2023-05-31",
    phone: "1234567890",
  },
];

const Stafflibrary = () => {
  const [staffData, setStaffData] = useState(initialStaffData);

  // --- EDIT HANDLER ---
  const handleEdit = (item) => {
    alert(`Edit Staff: ${item.name}`);
  };

  // --- DELETE HANDLER ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      setStaffData(staffData.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="staff-page">
      {/* PAGE HEADER */}
      <div className="staff-page-header">
        <h2>Add Staff</h2>
        <span className="breadcrumb">Library / Add Staff</span>
      </div>

      {/* MAIN CARD */}
      <div className="staff-card">
        {/* CARD HEADER */}
        <div className="staff-card-header">
          <h3>Add Staff List</h3>
          <button type="button" className="bulk-btn">
            Bulk Member Id Update
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="staff-toolbar">
          <div className="left-tools"></div>

          <div className="right-tools">
            <select defaultValue="10">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>

            <input type="text" placeholder="Search..." />
          </div>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Library Card No</th>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Phone</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {staffData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>
                    <div className="barcode-box">
                      <div className="barcode"></div>
                      <span>{item.card}</span>
                    </div>
                  </td>

                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.dob}</td>
                  <td>{item.phone}</td>

                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {staffData.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 30 }}>
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stafflibrary;
