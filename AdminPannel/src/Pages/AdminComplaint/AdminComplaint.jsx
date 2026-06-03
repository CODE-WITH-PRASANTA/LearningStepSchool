import React, { useState } from "react";
import Swal from "sweetalert2";

import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./AdminComplaint.css";

/* =========================================
   SAMPLE DATA
========================================= */

const complaintData = [
  {
    id: 1,
    complaintAgainst: "Tinku Singh",
    complaintBy: "Admin",
    complaintType: "Test 1",
    complaintMsg: "Test",
    date: "2026-05-18",
  },

  {
    id: 2,
    complaintAgainst: "Kavita",
    complaintBy: "Admin",
    complaintType: "Demo",
    complaintMsg: "Demo",
    date: "2026-05-19",
  },

  {
    id: 3,
    complaintAgainst: "Uday Sir",
    complaintBy: "Admin",
    complaintType: "123",
    complaintMsg: "Deemmo",
    date: "2026-05-19",
  },
];

/* =========================================
   COMPLAINT TYPE DATA
========================================= */

const complaintTypeData = [
  {
    id: 1,
    complaintName: "Late Coming",
    remark: "Staff",
    type: "Staff",
  },

  {
    id: 2,
    complaintName: "Misbehaviour",
    remark: "Student",
    type: "Student",
  },
];

const AdminComplaint = () => {
  /* =========================================
     MAIN DATA
  ========================================= */

  const [complaints, setComplaints] =
    useState(complaintData);

  const [complaintTypes, setComplaintTypes] =
    useState(complaintTypeData);

  /* =========================================
     SEARCH
  ========================================= */

  const [searchTerm, setSearchTerm] =
    useState("");

  /* =========================================
     MODALS
  ========================================= */

  const [openModal, setOpenModal] =
    useState(false);

  const [
    openComplaintTypeModal,
    setOpenComplaintTypeModal,
  ] = useState(false);

  const [
    openComplaintTypeAddModal,
    setOpenComplaintTypeAddModal,
  ] = useState(false);

  /* =========================================
     MODES
  ========================================= */

  const [modalMode, setModalMode] =
    useState("add");

  const [
    complaintTypeMode,
    setComplaintTypeMode,
  ] = useState("add");

  /* =========================================
     SELECTED DATA
  ========================================= */

  const [
    selectedComplaint,
    setSelectedComplaint,
  ] = useState(null);

  const [
    selectedComplaintType,
    setSelectedComplaintType,
  ] = useState(null);

  /* =========================================
     PAGINATION
  ========================================= */

  const [page, setPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  /* =========================================
     COMPLAINT FORM
  ========================================= */

  const [formData, setFormData] =
    useState({
      complaintAgainst: "",
      complaintBy: "Admin",
      complaintType: "",
      complaintMsg: "",
      date: "",
    });

  /* =========================================
     COMPLAINT TYPE FORM
  ========================================= */

  const [
    complaintTypeForm,
    setComplaintTypeForm,
  ] = useState({
    complaintName: "",
    remark: "",
    type: "Staff",
  });

  /* =========================================
     OPEN ADD COMPLAINT
  ========================================= */

  const handleAddComplaint = () => {
    setModalMode("add");

    setSelectedComplaint(null);

    setFormData({
      complaintAgainst: "",
      complaintBy: "Admin",
      complaintType: "",
      complaintMsg: "",
      date: "",
    });

    setOpenModal(true);
  };

  /* =========================================
     OPEN EDIT COMPLAINT
  ========================================= */

  const handleEditComplaint = (
    complaint
  ) => {
    setSelectedComplaint(
      complaint
    );

    setModalMode("edit");

    setFormData({
      complaintAgainst:
        complaint.complaintAgainst,

      complaintBy:
        complaint.complaintBy,

      complaintType:
        complaint.complaintType,

      complaintMsg:
        complaint.complaintMsg,

      date: complaint.date,
    });

    setOpenModal(true);
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  /* =========================================
     SAVE COMPLAINT
  ========================================= */

  const handleSaveComplaint = () => {
    if (
      !formData.complaintAgainst ||
      !formData.complaintType ||
      !formData.complaintMsg
    ) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields Missing",
      });

      return;
    }

    if (modalMode === "add") {
      const newComplaint = {
        id: Date.now(),
        ...formData,
      };

      setComplaints((prev) => [
        newComplaint,
        ...prev,
      ]);

      Swal.fire({
        icon: "success",
        title: "Complaint Added",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setComplaints((prev) =>
        prev.map((item) =>
          item.id ===
          selectedComplaint.id
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      );

      Swal.fire({
        icon: "success",
        title:
          "Complaint Updated",
        timer: 1500,
        showConfirmButton: false,
      });
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
      text: "This complaint will be removed.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonColor:
        "#ef4444",

      confirmButtonText:
        "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setComplaints((prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
        );

        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

    /* =========================================
     SEARCH FILTER
  ========================================= */

  const filteredData =
    complaints.filter((item) =>
      (
        item.complaintAgainst +
        " " +
        item.complaintType +
        " " +
        item.complaintMsg
      )
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    filteredData.length /
      itemsPerPage
  );

  const startIndex =
    (page - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentData =
    filteredData.slice(
      startIndex,
      endIndex
    );

  /* =========================================
     RETURN
  ========================================= */

  return (
    <div className="AdminComplaint">

      <div className="AdminComplaint__card">

        {/* =========================
            HEADER
        ========================= */}

        <div className="AdminComplaint__header">

          <div className="AdminComplaint__searchBox">

            <FaSearch />

            <input
              type="text"
              placeholder="Search..."
              className="AdminComplaint__searchInput"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <button
            className="AdminComplaint__addBtn"
            onClick={
              handleAddComplaint
            }
          >
            <FaPlus />
          </button>

        </div>

        {/* =========================
            TABLE
        ========================= */}

        <div className="AdminComplaint__tableWrapper">

          <table className="AdminComplaint__table">

            <thead>

              <tr>

                <th>S.NO.</th>

                <th>
                  COMPLAINT AGAINST
                </th>

                <th>
                  COMPLAINT BY
                </th>

                <th>
                  COMPLAINT TYPE
                </th>

                <th>
                  COMPLAINT MSG
                </th>

                <th>DATE</th>

                <th>ACTION</th>

              </tr>

            </thead>

            <tbody>

              {currentData.map(
                (
                  item,
                  index
                ) => (
                  <tr
                    key={item.id}
                    className="AdminComplaint__tableRow"
                    onClick={() =>
                      handleEditComplaint(
                        item
                      )
                    }
                  >

                    <td>
                      {startIndex +
                        index +
                        1}
                    </td>

                    <td>
                      {
                        item.complaintAgainst
                      }
                    </td>

                    <td>
                      {
                        item.complaintBy
                      }
                    </td>

                    <td>
                      {
                        item.complaintType
                      }
                    </td>

                    <td>
                      {
                        item.complaintMsg
                      }
                    </td>

                    <td>
                      {item.date}
                    </td>

                    <td>

                      <button
                        className="AdminComplaint__deleteBtn"
                        onClick={(
                          e
                        ) => {
                          e.stopPropagation();

                          handleDeleteComplaint(
                            item.id
                          );
                        }}
                      >
                        <FaTrashAlt />
                      </button>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* =========================
            MOBILE CARDS
        ========================= */}

        <div className="AdminComplaint__mobileCards">

          {currentData.map(
            (item, index) => (
              <div
                key={item.id}
                className="AdminComplaint__mobileCard"
                onClick={() =>
                  handleEditComplaint(
                    item
                  )
                }
              >

                <div className="AdminComplaint__mobileRow">
                  <span>
                    S.No
                  </span>

                  <p>
                    {startIndex +
                      index +
                      1}
                  </p>
                </div>

                <div className="AdminComplaint__mobileRow">
                  <span>
                    Complaint Against
                  </span>

                  <p>
                    {
                      item.complaintAgainst
                    }
                  </p>
                </div>

                <div className="AdminComplaint__mobileRow">
                  <span>
                    Complaint Type
                  </span>

                  <p>
                    {
                      item.complaintType
                    }
                  </p>
                </div>

                <div className="AdminComplaint__mobileRow">
                  <span>
                    Message
                  </span>

                  <p>
                    {
                      item.complaintMsg
                    }
                  </p>
                </div>

                <div className="AdminComplaint__mobileRow">
                  <span>
                    Date
                  </span>

                  <p>
                    {item.date}
                  </p>
                </div>

                <button
                  className="AdminComplaint__deleteBtn"
                  onClick={(
                    e
                  ) => {
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

        {/* =========================
            PAGINATION
        ========================= */}

        <div className="AdminComplaint__pagination">

          <div className="AdminComplaint__pageSize">

            <span>
              Items per page
            </span>

            <select
              value={
                itemsPerPage
              }
              onChange={(e) => {
                setItemsPerPage(
                  Number(
                    e.target.value
                  )
                );

                setPage(1);
              }}
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>
            </select>

          </div>

          <div className="AdminComplaint__pageInfo">

            {filteredData.length ===
            0
              ? "0 - 0"
              : `${startIndex + 1} - ${Math.min(
                  endIndex,
                  filteredData.length
                )} of ${
                  filteredData.length
                }`}

          </div>

          <div className="AdminComplaint__pageBtns">

            <button
              disabled={
                page === 1
              }
              onClick={() =>
                setPage(
                  (prev) =>
                    prev - 1
                )
              }
            >
              <FaChevronLeft />
            </button>

            <button
              disabled={
                page ===
                totalPages
              }
              onClick={() =>
                setPage(
                  (prev) =>
                    prev + 1
                )
              }
            >
              <FaChevronRight />
            </button>

          </div>

        </div>

                {/* =========================================
            ADD / MODIFY MODAL
        ========================================= */}

        {openModal && (
          <div className="AdminComplaint__modal">

            <div
              className="AdminComplaint__overlay"
              onClick={handleCloseModal}
            />

            <div className="AdminComplaint__modalContainer">

              {/* HEADER */}

              <div className="AdminComplaint__modalHeader">

                <h2>
                  {modalMode === "add"
                    ? "ADD COMPLAINT"
                    : "MODIFY COMPLAINT"}
                </h2>

                <button
                  className="AdminComplaint__closeBtn"
                  onClick={
                    handleCloseModal
                  }
                >
                  ×
                </button>

              </div>

              {/* BODY */}

              <div className="AdminComplaint__modalBody">

                {/* RADIO */}

                <div className="AdminComplaint__radioGroup">

                  <label>

                    <input
                      type="radio"
                      name="againstType"
                      checked={
                        formData.againstType ===
                        "Staff"
                      }
                      onChange={() =>
                        setFormData({
                          ...formData,
                          againstType:
                            "Staff",
                        })
                      }
                    />

                    Against Staff

                  </label>

                  <label>

                    <input
                      type="radio"
                      name="againstType"
                      checked={
                        formData.againstType ===
                        "Student"
                      }
                      onChange={() =>
                        setFormData({
                          ...formData,
                          againstType:
                            "Student",
                        })
                      }
                    />

                    Against Student

                  </label>

                </div>

                {/* FORM GRID */}

                <div className="AdminComplaint__formGrid">

                  {/* COMPLAINT AGAINST */}

                  <div className="AdminComplaint__field">

                    <label>
                      Complaint Against *
                    </label>

                    <input
                      type="text"
                      value={
                        formData.complaintAgainst
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complaintAgainst:
                            e.target.value,
                        })
                      }
                      placeholder={
                        formData.againstType ===
                        "Staff"
                          ? "Staff Name"
                          : "Student Name"
                      }
                    />

                  </div>

                  {/* COMPLAINT TYPE */}

                  <div className="AdminComplaint__field">

                    <label>
                      Complaint Type *
                    </label>

                    <div className="AdminComplaint__typeWrapper">

                      <select
                        value={
                          formData.complaintType
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            complaintType:
                              e.target
                                .value,
                          })
                        }
                      >

                        <option value="">
                          Select Complaint Type
                        </option>

                        {complaintTypes.map(
                          (
                            type
                          ) => (
                            <option
                              key={
                                type.id
                              }
                              value={
                                type.name
                              }
                            >
                              {
                                type.name
                              }
                            </option>
                          )
                        )}

                      </select>

                      <button
                        type="button"
                        className="AdminComplaint__typeAddBtn"
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

                  {/* MESSAGE */}

                  <div
                    className="
                    AdminComplaint__field
                    AdminComplaint__fieldFull
                  "
                  >

                    <label>
                      Complaint Message *
                    </label>

                    <textarea
                      rows="6"
                      value={
                        formData.complaintMsg
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          complaintMsg:
                            e.target
                              .value,
                        })
                      }
                      placeholder="Enter complaint details..."
                    />

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="AdminComplaint__modalFooter">

                <button
                  className="AdminComplaint__cancelBtn"
                  onClick={
                    handleCloseModal
                  }
                >
                  Cancel
                </button>

                <button
                  className="AdminComplaint__saveBtn"
                  onClick={
                    handleSaveComplaint
                  }
                >
                  {modalMode === "add"
                    ? "Add"
                    : "Modify"}
                </button>

              </div>

            </div>

          </div>
        )}

                {/* =========================================
            COMPLAINT TYPE MASTER MODAL
        ========================================= */}

        {openComplaintTypeModal && (
          <div className="AdminComplaint__modal">

            <div
              className="AdminComplaint__overlay"
              onClick={() =>
                setOpenComplaintTypeModal(false)
              }
            />

            <div className="AdminComplaint__typeModalContainer">

              <div className="AdminComplaint__modalHeader">

                <h2>COMPLAINT TYPE</h2>

                <button
                  className="AdminComplaint__closeBtn"
                  onClick={() =>
                    setOpenComplaintTypeModal(false)
                  }
                >
                  ×
                </button>

              </div>

              <div className="AdminComplaint__typeHeader">

                <button
                  className="AdminComplaint__saveBtn"
                  onClick={() => {
                    setComplaintTypeMode("add");

                    setComplaintTypeForm({
                      complaintName: "",
                      remark: "",
                      type: "Staff",
                    });

                    setOpenComplaintTypeAddModal(
                      true
                    );
                  }}
                >
                  <FaPlus />
                  Add Complaint Type
                </button>

              </div>

              <div className="AdminComplaint__tableWrapper">

                <table className="AdminComplaint__table">

                  <thead>

                    <tr>
                      <th>S.NO.</th>
                      <th>NAME</th>
                      <th>TYPE</th>
                      <th>REMARK</th>
                      <th>ACTION</th>
                    </tr>

                  </thead>

                  <tbody>

                    {complaintTypes.map(
                      (item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setComplaintTypeMode(
                              "edit"
                            );

                            setSelectedComplaintType(
                              item
                            );

                            setComplaintTypeForm({
                              complaintName:
                                item.complaintName,

                              remark:
                                item.remark,

                              type:
                                item.type,
                            });

                            setOpenComplaintTypeAddModal(
                              true
                            );
                          }}
                        >
                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {
                              item.complaintName
                            }
                          </td>

                          <td>
                            {item.type}
                          </td>

                          <td>
                            {
                              item.remark
                            }
                          </td>

                          <td>

                            <button
                              className="AdminComplaint__deleteBtn"
                              onClick={(
                                e
                              ) => {
                                e.stopPropagation();

                                Swal.fire({
                                  title:
                                    "Delete Complaint Type?",
                                  icon:
                                    "warning",
                                  showCancelButton:
                                    true,
                                  confirmButtonColor:
                                    "#ef4444",
                                }).then(
                                  (
                                    result
                                  ) => {
                                    if (
                                      result.isConfirmed
                                    ) {
                                      setComplaintTypes(
                                        (
                                          prev
                                        ) =>
                                          prev.filter(
                                            (
                                              x
                                            ) =>
                                              x.id !==
                                              item.id
                                          )
                                      );
                                    }
                                  }
                                );
                              }}
                            >
                              <FaTrashAlt />
                            </button>

                          </td>
                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        )}

        {/* =========================================
            ADD / MODIFY COMPLAINT TYPE
        ========================================= */}

        {openComplaintTypeAddModal && (
          <div className="AdminComplaint__modal">

            <div
              className="AdminComplaint__overlay"
              onClick={() =>
                setOpenComplaintTypeAddModal(false)
              }
            />

            <div className="AdminComplaint__smallModal">

              <div className="AdminComplaint__modalHeader">

                <h2>
                  {complaintTypeMode === "add"
                    ? "ADD COMPLAINT TYPE"
                    : "MODIFY COMPLAINT TYPE"}
                </h2>

                <button
                  className="AdminComplaint__closeBtn"
                  onClick={() =>
                    setOpenComplaintTypeAddModal(false)
                  }
                >
                  ×
                </button>

              </div>

              <div className="AdminComplaint__modalBody">

                <div className="AdminComplaint__formGrid">

                  <div className="AdminComplaint__field">

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

                  <div className="AdminComplaint__field">

                    <label>Type</label>

                    <select
                      value={
                        complaintTypeForm.type
                      }
                      onChange={(e) =>
                        setComplaintTypeForm({
                          ...complaintTypeForm,
                          type:
                            e.target.value,
                        })
                      }
                    >
                      <option>
                        Staff
                      </option>

                      <option>
                        Student
                      </option>
                    </select>

                  </div>

                  <div
                    className="
                    AdminComplaint__field
                    AdminComplaint__fieldFull
                  "
                  >

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

              </div>

              <div className="AdminComplaint__modalFooter">

                <button
                  className="AdminComplaint__cancelBtn"
                  onClick={() =>
                    setOpenComplaintTypeAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="AdminComplaint__saveBtn"
                  onClick={() => {

                    if (
                      complaintTypeMode ===
                      "add"
                    ) {
                      setComplaintTypes(
                        (prev) => [
                          ...prev,
                          {
                            id:
                              Date.now(),

                            ...complaintTypeForm,
                          },
                        ]
                      );
                    } else {
                      setComplaintTypes(
                        (prev) =>
                          prev.map(
                            (
                              item
                            ) =>
                              item.id ===
                              selectedComplaintType.id
                                ? {
                                    ...item,
                                    ...complaintTypeForm,
                                  }
                                : item
                          )
                      );
                    }

                    setOpenComplaintTypeAddModal(
                      false
                    );
                  }}
                >
                  {complaintTypeMode ===
                  "add"
                    ? "Save"
                    : "Update"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminComplaint;
