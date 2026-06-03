import React, { useState } from "react";
import Swal from "sweetalert2";

import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./StaffComplaint.css";

/* =========================================
   DUMMY DATA
========================================= */

const complaintData = [
  {
    id: 1,
    date: "15-05-2026",
    staffName: "Ashmita Minj",
    department: "Administration",
    complaintType: "Behaviour",
    complaintText: "Staff behaviour issue",
    status: "Pending",
  },

  {
    id: 2,
    date: "18-05-2026",
    staffName: "Rahul Das",
    department: "Accounts",
    complaintType: "Salary",
    complaintText: "Salary not credited",
    status: "Resolved",
  },
];

const complaintTypeData = [
  {
    id: 1,
    complaintName: "Behaviour",
    remark: "Behaviour Related",
  },

  {
    id: 2,
    complaintName: "Salary",
    remark: "Salary Related",
  },

  {
    id: 3,
    complaintName: "Leave",
    remark: "Leave Related",
  },
];

const StaffComplaint = () => {

  /* =========================================
     MAIN STATES
  ========================================= */

  const [complaints, setComplaints] =
    useState(complaintData);

  const [complaintTypes, setComplaintTypes] =
    useState(complaintTypeData);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  /* =========================================
     MODALS
  ========================================= */

  const [openModal, setOpenModal] =
    useState(false);

  const [openTypeModal, setOpenTypeModal] =
    useState(false);

  const [openTypeAddModal,
    setOpenTypeAddModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [complaintTypeMode,
    setComplaintTypeMode] =
    useState("add");

  /* =========================================
     SELECTED ITEMS
  ========================================= */

  const [selectedComplaint,
    setSelectedComplaint] =
    useState(null);

  const [selectedComplaintType,
    setSelectedComplaintType] =
    useState(null);

  /* =========================================
     COMPLAINT FORM
  ========================================= */

  const [formData,
    setFormData] =
    useState({
      complaintType: "",
      complaintText: "",
      feedbackEnabled: false,
      feedbackStatus: "",
    });

  /* =========================================
     COMPLAINT TYPE FORM
  ========================================= */

  const [complaintTypeForm,
    setComplaintTypeForm] =
    useState({
      complaintName: "",
      remark: "",
    });

  /* =========================================
     ADD COMPLAINT
  ========================================= */

  const handleAddComplaint = () => {

    setModalMode("add");

    setSelectedComplaint(null);

    setFormData({
      complaintType: "",
      complaintText: "",
      feedbackEnabled: false,
      feedbackStatus: "",
    });

    setOpenModal(true);
  };

  /* =========================================
     EDIT COMPLAINT
  ========================================= */

  const handleEditComplaint = (
    complaint
  ) => {

    setModalMode("edit");

    setSelectedComplaint(
      complaint
    );

    setFormData({
      complaintType:
        complaint.complaintType,

      complaintText:
        complaint.complaintText,

      feedbackEnabled:
        complaint.feedbackEnabled || false,

      feedbackStatus:
        complaint.feedbackStatus || "",
    });

    setOpenModal(true);
  };

  /* =========================================
     SAVE COMPLAINT
  ========================================= */

  const handleSaveComplaint = () => {

    if (modalMode === "add") {

      const newComplaint = {
        id: Date.now(),

        date:
          new Date().toLocaleDateString(),

        staffName:
          "New Staff",

        department:
          "Administration",

        complaintType:
          formData.complaintType,

        complaintText:
          formData.complaintText,

        status:
          formData.feedbackStatus ||
          "Pending",
      };

      setComplaints(prev => [
        newComplaint,
        ...prev,
      ]);
    }

    else {

      setComplaints(prev =>
        prev.map(item =>
          item.id ===
          selectedComplaint.id
            ? {
                ...item,
                complaintType:
                  formData.complaintType,

                complaintText:
                  formData.complaintText,

                status:
                  formData.feedbackStatus ||
                  item.status,
              }
            : item
        )
      );
    }

    setOpenModal(false);
  };

  /* =========================================
     DELETE COMPLAINT
  ========================================= */

  const handleDeleteComplaint = (
    id
  ) => {

    Swal.fire({
      title: "Delete Complaint?",
      text:
        "This complaint will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor:
        "#ef4444",
      confirmButtonText: "Delete",
    }).then((result) => {

      if (result.isConfirmed) {

        setComplaints(prev =>
          prev.filter(
            item => item.id !== id
          )
        );

        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

    /* =========================================
     ADD COMPLAINT TYPE
  ========================================= */

  const handleAddComplaintType =
    () => {

      setComplaintTypeMode(
        "add"
      );

      setSelectedComplaintType(
        null
      );

      setComplaintTypeForm({
        complaintName: "",
        remark: "",
      });

      setOpenTypeAddModal(
        true
      );
    };

  /* =========================================
     EDIT COMPLAINT TYPE
  ========================================= */

  const handleEditComplaintType =
    (type) => {

      setComplaintTypeMode(
        "edit"
      );

      setSelectedComplaintType(
        type
      );

      setComplaintTypeForm({
        complaintName:
          type.complaintName,

        remark:
          type.remark,
      });

      setOpenTypeAddModal(
        true
      );
    };

  /* =========================================
     SAVE COMPLAINT TYPE
  ========================================= */

  const handleSaveComplaintType =
    () => {

      if (
        complaintTypeMode ===
        "add"
      ) {

        setComplaintTypes(
          prev => [
            ...prev,
            {
              id:
                Date.now(),

              complaintName:
                complaintTypeForm.complaintName,

              remark:
                complaintTypeForm.remark,
            },
          ]
        );
      }

      else {

        setComplaintTypes(
          prev =>
            prev.map(item =>
              item.id ===
              selectedComplaintType.id
                ? {
                    ...item,
                    complaintName:
                      complaintTypeForm.complaintName,

                    remark:
                      complaintTypeForm.remark,
                  }
                : item
            )
        );
      }

      setOpenTypeAddModal(
        false
      );
    };

  /* =========================================
     DELETE COMPLAINT TYPE
  ========================================= */

  const handleDeleteComplaintType =
    (id) => {

      Swal.fire({
        title:
          "Delete Complaint Type?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:
          "#ef4444",
      }).then((result) => {

        if (
          result.isConfirmed
        ) {

          setComplaintTypes(
            prev =>
              prev.filter(
                item =>
                  item.id !== id
              )
          );

          Swal.fire({
            icon: "success",
            title:
              "Deleted Successfully",
            timer: 1200,
            showConfirmButton:
              false,
          });
        }
      });
    };

  /* =========================================
     SEARCH FILTER
  ========================================= */

  const filteredComplaints =
    complaints.filter(item => {

      const search =
        searchTerm.toLowerCase();

      return (

        item.staffName
          .toLowerCase()
          .includes(search)

        ||

        item.complaintType
          .toLowerCase()
          .includes(search)

        ||

        item.complaintText
          .toLowerCase()
          .includes(search)

      );
    });

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages =
    Math.ceil(
      filteredComplaints.length /
      rowsPerPage
    );

  const startIndex =
    (page - 1) *
    rowsPerPage;

  const paginatedData =
    filteredComplaints.slice(
      startIndex,
      startIndex +
      rowsPerPage
    );

  /* =========================================
     JSX START
  ========================================= */

  return (

    <div className="StaffComplaint">

      <div className="StaffComplaint__card">

        {/* HEADER */}

        <div className="StaffComplaint__header">

          <div className="StaffComplaint__searchBox">

            <FaSearch />

            <input
              type="text"
              placeholder="Search Complaint..."
              className="StaffComplaint__searchInput"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <div className="StaffComplaint__headerBtns">

            <button
              className="StaffComplaint__typeBtn"
              onClick={() =>
                setOpenTypeModal(
                  true
                )
              }
            >
              Complaint Type
            </button>

            <button
              className="StaffComplaint__addBtn"
              onClick={
                handleAddComplaint
              }
            >
              <FaPlus />
            </button>

          </div>

        </div>

        {/* COMPLAINT LIST */}

        <div className="StaffComplaint__list">

          {paginatedData.map(
            (item) => (

              <div
                key={item.id}
                className="StaffComplaint__complaintCard"
                onClick={() =>
                  handleEditComplaint(
                    item
                  )
                }
              >

                                {/* STATUS */}

                <div
                  className={`StaffComplaint__status
                  ${
                    item.status === "Resolved"
                      ? "StaffComplaint__statusResolved"
                      : item.status === "Rejected"
                      ? "StaffComplaint__statusRejected"
                      : "StaffComplaint__statusPending"
                  }`}
                >
                  {item.status}
                </div>

                {/* DETAILS */}

                <div className="StaffComplaint__details">

                  <div className="StaffComplaint__detailRow">
                    <span>Date :</span>
                    <p>{item.date}</p>
                  </div>

                  <div className="StaffComplaint__detailRow">
                    <span>Staff Name :</span>
                    <p>{item.staffName}</p>
                  </div>

                  <div className="StaffComplaint__detailRow">
                    <span>Department :</span>
                    <p>{item.department}</p>
                  </div>

                  <div className="StaffComplaint__detailRow">
                    <span>Complaint Type :</span>
                    <p>{item.complaintType}</p>
                  </div>

                  <div className="StaffComplaint__detailRow">
                    <span>Complaint :</span>
                    <p>{item.complaintText}</p>
                  </div>

                </div>

                {/* DELETE */}

                <button
                  className="StaffComplaint__deleteBtn"
                  onClick={(e) => {

                    e.stopPropagation();

                    handleDeleteComplaint(
                      item.id
                    );
                  }}
                >
                  <FaTrashAlt />
                </button>

              </div>
            )
          )}

        </div>

        {/* =====================================
            PAGINATION
        ===================================== */}

        <div className="StaffComplaint__pagination">

          <div className="StaffComplaint__pageSize">

            <span>
              Items per page:
            </span>

            <select
              value={rowsPerPage}
              onChange={(e) => {

                setRowsPerPage(
                  Number(
                    e.target.value
                  )
                );

                setPage(1);
              }}
            >
              <option value="5">
                5
              </option>

              <option value="10">
                10
              </option>

              <option value="25">
                25
              </option>

              <option value="50">
                50
              </option>

            </select>

          </div>

          <div className="StaffComplaint__pageInfo">

            {filteredComplaints.length === 0
              ? "0 - 0 of 0"
              : `${startIndex + 1}
                 - ${Math.min(
                   startIndex + rowsPerPage,
                   filteredComplaints.length
                 )}
                 of ${filteredComplaints.length}`}

          </div>

          <div className="StaffComplaint__pageBtns">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(prev => prev - 1)
              }
            >
              <FaChevronLeft />
            </button>

            <button
              disabled={
                page === totalPages
              }
              onClick={() =>
                setPage(prev => prev + 1)
              }
            >
              <FaChevronRight />
            </button>

          </div>

        </div>

      </div>

      {/* =====================================
          ADD / MODIFY COMPLAINT MODAL
      ===================================== */}

      {openModal && (

        <div className="StaffComplaint__modal">

          <div
            className="StaffComplaint__overlay"
            onClick={() =>
              setOpenModal(false)
            }
          />

          <div className="StaffComplaint__modalContainer">

            {/* HEADER */}

            <div className="StaffComplaint__modalHeader">

              <h2>

                {modalMode === "add"
                  ? "ADD STAFF COMPLAINT"
                  : "MODIFY STAFF COMPLAINT"}

              </h2>

              <button
                className="StaffComplaint__closeBtn"
                onClick={() =>
                  setOpenModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}

            <div className="StaffComplaint__modalBody">

              <div className="StaffComplaint__field">

                <label>
                  Complaint Type
                </label>

                <div className="StaffComplaint__selectWrapper">

                  <select
                    value={
                      formData.complaintType
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complaintType:
                          e.target.value,
                      })
                    }
                  >

                    <option value="">
                      Select Complaint Type
                    </option>

                    {complaintTypes.map(
                      (type) => (
                        <option
                          key={type.id}
                          value={
                            type.complaintName
                          }
                        >
                          {
                            type.complaintName
                          }
                        </option>
                      )
                    )}

                  </select>

                  <button
                    className="StaffComplaint__typeAddBtn"
                    onClick={() =>
                      setOpenTypeModal(
                        true
                      )
                    }
                  >
                    <FaPlus />
                  </button>

                </div>

              </div>

              <div className="StaffComplaint__field">

                <label>
                  Complaint Text
                </label>

                <textarea
                  rows="6"
                  value={
                    formData.complaintText
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      complaintText:
                        e.target.value,
                    })
                  }
                />

              </div>

                            {/* FEEDBACK */}

              <div className="StaffComplaint__checkbox">

                <input
                  type="checkbox"
                  checked={
                    formData.feedback
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feedback:
                        e.target.checked,
                    })
                  }
                />

                <label>
                  Feedback
                </label>

              </div>

              {/* STATUS */}

              <div className="StaffComplaint__statusBox">

                <label>

                  <input
                    type="radio"
                    name="status"
                    value="Resolved"
                    checked={
                      formData.status ===
                      "Resolved"
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status:
                          e.target.value,
                      })
                    }
                  />

                  Resolved

                </label>

                <label>

                  <input
                    type="radio"
                    name="status"
                    value="Rejected"
                    checked={
                      formData.status ===
                      "Rejected"
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status:
                          e.target.value,
                      })
                    }
                  />

                  Rejected

                </label>

              </div>

            </div>

            {/* FOOTER */}

            <div className="StaffComplaint__modalFooter">

              <button
                className="StaffComplaint__cancelBtn"
                onClick={() =>
                  setOpenModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="StaffComplaint__saveBtn"
                onClick={
                  handleSaveComplaint
                }
              >

                {modalMode === "add"
                  ? "Add Complaint"
                  : "Update Complaint"}

              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================
          COMPLAINT TYPE LIST MODAL
      ===================================== */}

      {openTypeModal && (

        <div className="StaffComplaint__modal">

          <div
            className="StaffComplaint__overlay"
            onClick={() =>
              setOpenTypeModal(false)
            }
          />

          <div className="StaffComplaint__typeModal">

            <div className="StaffComplaint__modalHeader">

              <h2>
                Complaint Types
              </h2>

              <button
                className="StaffComplaint__closeBtn"
                onClick={() =>
                  setOpenTypeModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="StaffComplaint__typeBody">

              <button
                className="StaffComplaint__newTypeBtn"
                onClick={
                  handleAddComplaintType
                }
              >
                <FaPlus />
                Add Complaint Type
              </button>

              {complaintTypes.map(
                (item) => (

                  <div
                    key={item.id}
                    className="StaffComplaint__typeRow"
                  >

                    <div>

                      <h4>
                        {
                          item.complaintName
                        }
                      </h4>

                      <p>
                        {item.remark}
                      </p>

                    </div>

                    <div className="StaffComplaint__typeActions">

                      <button
                        onClick={() =>
                          handleEditComplaintType(
                            item
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteComplaintType(
                            item.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================
          ADD / EDIT COMPLAINT TYPE
      ===================================== */}

      {openTypeAddModal && (

        <div className="StaffComplaint__modal">

          <div
            className="StaffComplaint__overlay"
            onClick={() =>
              setOpenTypeAddModal(
                false
              )
            }
          />

          <div className="StaffComplaint__smallModal">

            <div className="StaffComplaint__modalHeader">

              <h2>

                {complaintTypeMode ===
                "add"
                  ? "ADD COMPLAINT TYPE"
                  : "MODIFY COMPLAINT TYPE"}

              </h2>

              <button
                className="StaffComplaint__closeBtn"
                onClick={() =>
                  setOpenTypeAddModal(
                    false
                  )
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="StaffComplaint__modalBody">

              <div className="StaffComplaint__field">

                <label>
                  Complaint Name
                </label>

                <input
                  value={
                    complaintTypeForm.complaintName
                  }
                  onChange={(e) =>
                    setComplaintTypeForm({
                      ...complaintTypeForm,
                      complaintName:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="StaffComplaint__field">

                <label>
                  Remark
                </label>

                <textarea
                  rows="4"
                  value={
                    complaintTypeForm.remark
                  }
                  onChange={(e) =>
                    setComplaintTypeForm({
                      ...complaintTypeForm,
                      remark:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="StaffComplaint__modalFooter">

              <button
                className="StaffComplaint__cancelBtn"
                onClick={() =>
                  setOpenTypeAddModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="StaffComplaint__saveBtn"
                onClick={
                  handleSaveComplaintType
                }
              >

                {complaintTypeMode ===
                "add"
                  ? "Add"
                  : "Update"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default StaffComplaint;