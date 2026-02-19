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

  const handleEdit = (item) => {
    alert(`Edit Staff: ${item.name}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      setStaffData(staffData.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="staff-library-page">

      {/* HEADER */}
      <div className="staff-library-header">
        <h2 className="staff-library-header__title">Add Staff</h2>
        <span className="staff-library-header__breadcrumb">
          Library / Add Staff
        </span>
      </div>

      {/* MAIN CARD */}
      <div className="staff-library-card">

        {/* CARD HEADER */}
        <div className="staff-library-card__header">
          <h3 className="staff-library-card__heading">
            Add Staff List
          </h3>

          <button
            type="button"
            className="staff-library-btn staff-library-btn--primary"
          >
            Bulk Member Id Update
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="staff-library-toolbar">

          <div className="staff-library-toolbar__left"></div>

          <div className="staff-library-toolbar__right">

            <select className="staff-library-select" defaultValue="10">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              className="staff-library-input"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="staff-library-table-wrapper">
          <table className="staff-library-table">
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
                    <div className="staff-library-barcode-box">
                      <div className="staff-library-barcode"></div>
                      <span className="staff-library-card-number">
                        {item.card}
                      </span>
                    </div>
                  </td>

                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.dob}</td>
                  <td>{item.phone}</td>

                  <td className="staff-library-actions">
                    <button
                      className="staff-library-btn staff-library-btn--edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="staff-library-btn staff-library-btn--delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {staffData.length === 0 && (
                <tr>
                  <td colSpan="7" className="staff-library-no-data">
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
