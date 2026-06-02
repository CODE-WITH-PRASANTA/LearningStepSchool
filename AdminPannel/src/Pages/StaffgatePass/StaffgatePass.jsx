import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaPrint,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

import "./StaffgatePass.css";

const StaffgatePass = () => {
    const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const staffData = [
    {
      id: 1,
      photo:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      name: "Anchal Yadav",
      designation: "Principal",
      department: "Management",
      date: "26-05-2026",
      time: "11:00 AM",
      reason: "Meeting",
      remark: "Official Work",
    },
    {
      id: 2,
      photo:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      name: "Raj Kumar",
      designation: "Teacher",
      department: "Teaching",
      date: "09-05-2026",
      time: "02:00 PM",
      reason: "Personal Work",
      remark: "Half Day",
    },
  ];

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  return (
    <div className="staffgatepass">

      {/* Header */}
      <div className="staffgatepass__topbar">
        <div className="staffgatepass__search">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Staff..."
          />
        </div>

        <button
          className="staffgatepass__addbtn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
        </button>
      </div>

      {/* Table */}
      <div className="staffgatepass__tablewrapper">
        <table className="staffgatepass__table">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>PHOTO</th>
              <th>NAME</th>
              <th>DESIGNATION</th>
              <th>DEPARTMENT</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {staffData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>
                  <img
                    src={item.photo}
                    alt=""
                    className="staffgatepass__photo"
                  />
                </td>

                <td>{item.name}</td>
                <td>{item.designation}</td>
                <td>{item.department}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>

                <td>
                  <div className="staffgatepass__actions">

                    <button
                      className="staffgatepass__edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button className="staffgatepass__delete">
                      <FaTrash />
                    </button>

<button
  className="staffgatepass__print"
  onClick={() =>
    navigate(
      "/staff-gate-pass/pdf",
      {
        state: item,
      }
    )
  }
>
  <FaPrint />
</button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="staffgatepass__pagination">

        <div className="staffgatepass__pageleft">
          Items Per Page
          <select>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>

        <div className="staffgatepass__pageright">
          <button>{"<"}</button>
          <span>1 - 3 of 3</span>
          <button>{">"}</button>
        </div>

      </div>

      {/* ADD MODAL */}

      {showAddModal && (
        <div className="staffgatepass__overlay">

          <div className="staffgatepass__modal">

            <div className="staffgatepass__modal-header">

              <h2 className="staffgatepass__modal-title">
                STAFF GATE PASS
              </h2>

              <button
                className="staffgatepass__modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>

            </div>

            <div className="staffgatepass__modal-body">

              <div className="staffgatepass__staff-search-section">

                <FaSearch />

                <input
                  type="text"
                  placeholder="Staff Search.."
                  className="staffgatepass__staff-search-input"
                />

              </div>

              <div className="staffgatepass__form-grid">

                <div className="staffgatepass__field-group">

                  <label className="staffgatepass__field-label">
                    Time In :
                  </label>

                  <input
                    type="time"
                    className="staffgatepass__field-input"
                  />

                </div>

                <div className="staffgatepass__field-group">

                  <label className="staffgatepass__field-label">
                    Reason For Leaving :
                  </label>

                  <input
                    type="text"
                    className="staffgatepass__field-input"
                  />

                </div>

              </div>

              <div className="staffgatepass__remark-section">

                <label className="staffgatepass__field-label">
                  Remark :
                </label>

                <textarea
                  rows="3"
                  className="staffgatepass__remark-input"
                />

              </div>

              <div className="staffgatepass__footer-actions">

        <div className="staffgatepass__print-dropdown">

  <select className="staffgatepass__print-select">

    <option value="">
      Print Options
    </option>

    <option value="print">
      Print Gate Pass
    </option>

    <option value="pdf">
      Download PDF
    </option>

    <option value="excel">
      Export Excel
    </option>

    <option value="share">
      Share PDF
    </option>

    <option value="email">
      Send Email
    </option>

  </select>

</div>

                <button
                  className="staffgatepass__cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>

                <button className="staffgatepass__save-button">
                  Add
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}

      {showEditModal && selectedStaff && (
        <div className="staffgatepass__overlay">

          <div className="staffgatepass__modal">

            <div className="staffgatepass__modal-header">

              <h2 className="staffgatepass__modal-title">
                STAFF GATE PASS
              </h2>

              <button
                className="staffgatepass__modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>

            </div>

            <div className="staffgatepass__modal-body">

              <div className="staffgatepass__staff-profile-card">

                <img
                  src={selectedStaff.photo}
                  alt=""
                  className="staffgatepass__staff-avatar"
                />

                <div className="staffgatepass__staff-information">

                  <p>
                    <strong>Name :</strong>{" "}
                    {selectedStaff.name}
                  </p>

                  <p>
                    <strong>Department :</strong>{" "}
                    {selectedStaff.department}
                  </p>

                  <p>
                    <strong>Designation :</strong>{" "}
                    {selectedStaff.designation}
                  </p>

                  <p>
                    <strong>Contact :</strong>
                  </p>

                </div>

              </div>

              <div className="staffgatepass__form-grid">

                <div className="staffgatepass__field-group">

                  <label className="staffgatepass__field-label">
                    Time In :
                  </label>

                  <input
                    value={selectedStaff.time}
                    readOnly
                    className="staffgatepass__field-input"
                  />

                </div>

                <div className="staffgatepass__field-group">

                  <label className="staffgatepass__field-label">
                    Reason For Leaving :
                  </label>

                  <input
                    value={selectedStaff.reason}
                    readOnly
                    className="staffgatepass__field-input"
                  />

                </div>

              </div>

              <div className="staffgatepass__remark-section">

                <label className="staffgatepass__field-label">
                  Remark :
                </label>

                <textarea
                  value={selectedStaff.remark}
                  readOnly
                  className="staffgatepass__remark-input"
                />

              </div>

              <div className="staffgatepass__footer-actions">

               <div className="staffgatepass__print-dropdown">
  <span>Print</span>
  <FaChevronDown />
</div>

                <button
                  className="staffgatepass__cancel-button"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>

                <button className="staffgatepass__save-button">
                  Modify
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default StaffgatePass;