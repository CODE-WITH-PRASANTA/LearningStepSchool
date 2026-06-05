import React, { useState } from "react";
import {
  FiPlus,
  FiX,
  FiSearch,
  FiChevronDown,
  FiFilter,
  FiTrash2,
} from "react-icons/fi";

import "./Staff.css";

const Staff = () => {
  const [activeTab, setActiveTab] = useState("student");

  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const [showTypeModal, setShowTypeModal] = useState(false);

  const [showAddTypeModal, setShowAddTypeModal] = useState(false);

  const [showColumnDropdown, setShowColumnDropdown] =
    useState(false);

  const [selectedType, setSelectedType] =
    useState("123");

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [visibleColumns, setVisibleColumns] = useState({
    sno: true,
    complaintType: true,
    remark: true,
    type: true,
    action: true,
  });

  const complaints = [
    {
      id: 1,
      date: "15-05-26",
      name: "[1234] Ashmita Minj",
      type: "Study",
      className: "2nd-A",
      complaint: "Sdad",
      by: "Parents",
      status: "Pending",
    },
    {
      id: 2,
      date: "05-05-26",
      name: "[14] Inayat Bi",
      type: "Convenience",
      className: "1st-A",
      complaint: "SGSDFG",
      by: "Parents",
      status: "Pending",
    },
    {
      id: 3,
      date: "01-05-26",
      name: "",
      type: "Convenience",
      className: "",
      complaint: "Done",
      by: "Self",
      status: "Pending",
    },
    {
      id: 4,
      date: "23-04-26",
      name: "[152] Aditya",
      type: "Study",
      className: "1st-A",
      complaint: "Swxdsw",
      by: "Parents",
      status: "Pending",
    },
    {
      id: 5,
      date: "23-04-26",
      name: "[152] Aditya Demo",
      type: "Study",
      className: "1st-A",
      complaint: "Ddddddsed",
      by: "Parents",
      status: "Solved",
    },
    {
      id: 6,
      date: "16-04-26",
      name: "[1234] Ashmita Minj",
      type: "Study",
      className: "2nd-A",
      complaint: "Demo",
      by: "Parents",
      status: "Pending",
    },
  ];

  const complaintTypes = [
    {
      id: 1,
      complaintType: "test 1",
      remark: "test 1",
      type: "staff",
    },
    {
      id: 2,
      complaintType: "demo",
      remark: "123",
      type: "staff",
    },
    {
      id: 3,
      complaintType: "123",
      remark: "123",
      type: "staff",
    },
    {
      id: 4,
      complaintType: "tttt",
      remark: "ttttgg",
      type: "staff",
    },
    {
      id: 5,
      complaintType: "DemoOMED",
      remark: "DemoOMED",
      type: "staff",
    },
    {
      id: 6,
      complaintType: "123",
      remark: "123",
      type: "student",
    },
  ];

  const perPage = 6;

  const indexOfLast = currentPage * perPage;

  const indexOfFirst = indexOfLast - perPage;

  const currentRows = complaintTypes.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    complaintTypes.length / perPage
  );

  const toggleColumn = (key) => {
    setVisibleColumns({
      ...visibleColumns,
      [key]: !visibleColumns[key],
    });
  };

  return (
    <div className="staff">

      {/* TOP HEADER */}

      <div className="staff__topbar">
        <h2>Complaint</h2>

        <button
          className="staff__floating-btn"
          onClick={() =>
            setShowComplaintModal(true)
          }
        >
          <FiPlus />
        </button>
      </div>

      {/* MAIN CARD */}

      <div className="staff__card">

        {/* TABS */}

        <div className="staff__tabs">

          <button
            className={`staff__tab ${
              activeTab === "student"
                ? "staff__tab--active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("student")
            }
          >
            Student Complaints
          </button>

          <button
            className={`staff__tab ${
              activeTab === "staff"
                ? "staff__tab--active"
                : ""
            }`}
            onClick={() =>
              setActiveTab("staff")
            }
          >
            Staff Complaints
          </button>
        </div>

        {/* STUDENT DATA */}

        {activeTab === "student" && (
          <div className="staff__complaints">

            {complaints.map((item) => (
              <div
                className="staff__complaint-card"
                key={item.id}
              >
                <span
                  className={`staff__status ${
                    item.status === "Solved"
                      ? "staff__status--green"
                      : ""
                  }`}
                >
                  {item.status}
                </span>

                <div className="staff__complaint-by">
                  By: {item.by}
                </div>

                <p>Date : {item.date}</p>

                <p>Name : {item.name}</p>

                <p>Type : {item.type}</p>

                <p>
                  Class : {item.className}
                </p>

                <p>
                  Complaint : {item.complaint}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* STAFF EMPTY */}

        {activeTab === "staff" && (
          <div className="staff__empty">
            No Staff Complaints Found
          </div>
        )}
      </div>

      {/* ADD COMPLAINT MODAL */}

      {showComplaintModal && (
        <div className="staff__overlay">

          <div className="staff__modal">

            <div className="staff__modal-header">
              <h3>ADD COMPLAINT</h3>

              <button
                onClick={() =>
                  setShowComplaintModal(false)
                }
              >
                <FiX />
              </button>
            </div>

            <div className="staff__modal-body">

              <div className="staff__search">
                <FiSearch />
                <input
                  placeholder="Search"
                />
              </div>

              <div className="staff__dropdown-row">

                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(
                      e.target.value
                    )
                  }
                >
                  <option>123</option>
                  <option>No Complaint</option>
                </select>

                <button
                  className="staff__mini-plus"
                  onClick={() =>
                    setShowTypeModal(true)
                  }
                >
                  <FiPlus />
                </button>
              </div>

              <textarea
                placeholder="Complaint Text"
              />

              <div className="staff__actions">
                <button>
                  Cancel
                </button>

                <button className="staff__primary">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLAINT TYPE MODAL */}

   
       {showTypeModal && (
  <div className="staff__overlay staff__overlay--second">

    <div className="staff__type-modal">

      <button
        className="staff__type-close-btn"
        onClick={() => {
          setShowTypeModal(false);
          setShowColumnDropdown(false);
        }}
      >
        <FiX />
      </button>

      <div className="staff__table-header">

              <div className="staff__table-search">
                <FiSearch />

                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search..."
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="staff__table-actions">

                <button
                  onClick={() =>
                    setShowColumnDropdown(
                      !showColumnDropdown
                    )
                  }
                >
                  <FiFilter />
                </button>

                <button
                  className="staff__plus-btn"
                  onClick={() =>
                    setShowAddTypeModal(true)
                  }
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* COLUMN DROPDOWN */}

            {showColumnDropdown && (
              <div className="staff__column-dropdown">

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.sno
                    }
                    onChange={() =>
                      toggleColumn(
                        "sno"
                      )
                    }
                  />
                  S.No.
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.complaintType
                    }
                    onChange={() =>
                      toggleColumn(
                        "complaintType"
                      )
                    }
                  />
                  Complaint Type
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.remark
                    }
                    onChange={() =>
                      toggleColumn(
                        "remark"
                      )
                    }
                  />
                  Remark
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.type
                    }
                    onChange={() =>
                      toggleColumn(
                        "type"
                      )
                    }
                  />
                  Type
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.action
                    }
                    onChange={() =>
                      toggleColumn(
                        "action"
                      )
                    }
                  />
                  Action
                </label>
              </div>
            )}

            <div className="staff__table-wrapper">
  <table className="staff__table">
              <thead>
                <tr>

                  {visibleColumns.sno && (
                    <th>S.NO.</th>
                  )}

                  {visibleColumns.complaintType && (
                    <th>
                      COMPLAINT TYPE
                    </th>
                  )}

                  {visibleColumns.remark && (
                    <th>REMARK</th>
                  )}

                  {visibleColumns.type && (
                    <th>TYPE</th>
                  )}

                  {visibleColumns.action && (
                    <th>ACTION</th>
                  )}
                </tr>
              </thead>

              <tbody>

                {currentRows.map(
                  (row, index) => (
                    <tr key={row.id}>

                      {visibleColumns.sno && (
                        <td>
                          {index + 1}
                        </td>
                      )}

                      {visibleColumns.complaintType && (
                        <td>
                          {
                            row.complaintType
                          }
                        </td>
                      )}

                      {visibleColumns.remark && (
                        <td>
                          {row.remark}
                        </td>
                      )}

                      {visibleColumns.type && (
                        <td>
                          {row.type}
                        </td>
                      )}

                      {visibleColumns.action && (
                        <td>
                          <FiTrash2 />
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
             </table>
</div>

            <div className="staff__pagination">

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Prev
              </button>

              <span>
                {currentPage} /{" "}
                {totalPages}
              </span>

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TYPE MODAL */}

      {showAddTypeModal && (
        <div className="staff__overlay staff__overlay--third">

          <div className="staff__add-type-modal">

            <div className="staff__modal-header">
              <h3>
                COMPLAINT TYPE
              </h3>

              <button
                onClick={() =>
                  setShowAddTypeModal(
                    false
                  )
                }
              >
                <FiX />
              </button>
            </div>

            <div className="staff__radio-row">

              <label>
                <input
                  type="radio"
                  name="role"
                />
                Students
              </label>

              <label>
                <input
                  type="radio"
                  name="role"
                />
                Staff
              </label>
            </div>

            <div className="staff__input-grid">

              <input
                placeholder="Complaint Name*"
              />

              <input
                placeholder="Remark*"
              />
            </div>

            <div className="staff__actions">

              <button>
                Cancel
              </button>

              <button className="staff__primary">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;