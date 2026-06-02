import React, { useState, useMemo } from "react";
import Swal from "sweetalert2";

import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaListUl,
} from "react-icons/fa";

import "./StaffVisitMeeting.css";

/* =========================================
   DUMMY DATA
========================================= */

const visitDataList = [
  {
    id: 1,
    employeeName: "Anchal Yadav",
    startDate: "2026-05-09",
    endDate: "2026-05-15",
    schoolName: "HYCH School",
    remark: "Meeting Regarding Admission",
  },

  {
    id: 2,
    employeeName: "Anchal Yadav",
    startDate: "2026-05-18",
    endDate: "2026-05-18",
    schoolName: "1354 Public School",
    remark: "Discussion",
  },

  {
    id: 3,
    employeeName: "Anchal Yadav",
    startDate: "2026-05-19",
    endDate: "2026-05-26",
    schoolName: "Demo School",
    remark: "Demo Visit",
  },
];

/* =========================================
   COMPONENT
========================================= */

const StaffVisitMeeting = () => {
  const [visitData, setVisitData] =
    useState(visitDataList);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [openModal, setOpenModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [selectedVisit, setSelectedVisit] =
    useState(null);

  const [showColumnMenu, setShowColumnMenu] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  /* =========================================
     COLUMN VISIBILITY
  ========================================= */

  const [visibleColumns, setVisibleColumns] =
    useState({
      sno: true,
      date: true,
      employee: true,
      school: true,
      remark: true,
      action: true,
    });

  /* =========================================
     FORM DATA
  ========================================= */

  const [formData, setFormData] =
    useState({
      employeeName: "",
      startDate: "",
      endDate: "",
      schoolName: "",
      remark: "",
    });

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  const handleAddVisit = () => {
    setModalMode("add");

    setSelectedVisit(null);

    setFormData({
      employeeName: "",
      startDate: "",
      endDate: "",
      schoolName: "",
      remark: "",
    });

    setOpenModal(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);

    setModalMode("edit");

    setFormData({
      employeeName:
        visit.employeeName || "",

      startDate:
        visit.startDate || "",

      endDate:
        visit.endDate || "",

      schoolName:
        visit.schoolName || "",

      remark:
        visit.remark || "",
    });

    setOpenModal(true);
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleCloseModal = () => {
    setOpenModal(false);

    setSelectedVisit(null);
  };

  /* =========================================
     SAVE
  ========================================= */

  const handleSaveVisit = () => {
    if (
      !formData.employeeName ||
      !formData.schoolName
    ) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields Missing",
        text:
          "Employee Name and School Name are required.",
      });

      return;
    }

    if (modalMode === "add") {
      const newVisit = {
        id: Date.now(),

        employeeName:
          formData.employeeName,

        startDate:
          formData.startDate,

        endDate:
          formData.endDate,

        schoolName:
          formData.schoolName,

        remark:
          formData.remark,
      };

      setVisitData((prev) => [
        ...prev,
        newVisit,
      ]);

      Swal.fire({
        icon: "success",
        title: "Visit Added Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      setVisitData((prev) =>
        prev.map((item) =>
          item.id === selectedVisit.id
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "Visit Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    handleCloseModal();
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Visit?",
      text:
        "This visit record will be removed.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor:
        "#ef4444",

      confirmButtonText:
        "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setVisitData((prev) =>
          prev.filter(
            (item) => item.id !== id
          )
        );

        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  /* =========================================
     COLUMN TOGGLE
  ========================================= */

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* =========================================
     SEARCH
  ========================================= */

  const filteredData = useMemo(() => {
    return visitData.filter(
      (item) =>
        item.employeeName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.schoolName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.remark
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );
  }, [searchTerm, visitData]);

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    filteredData.length /
      itemsPerPage
  );

  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    itemsPerPage;

  const currentItems =
    filteredData.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

      return (
    <>
      <div className="StaffVisitMeeting">

        <div className="StaffVisitMeeting__card">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="StaffVisitMeeting__header">

            <div className="StaffVisitMeeting__searchBox">

              <FaSearch />

              <input
                type="text"
                placeholder="Search..."
                className="StaffVisitMeeting__searchInput"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            {/* COLUMN FILTER */}

            <div className="StaffVisitMeeting__filterWrapper">

              <button
                className="StaffVisitMeeting__filterBtn"
                onClick={() =>
                  setShowColumnMenu(
                    !showColumnMenu
                  )
                }
              >
                <FaListUl />
              </button>

              {showColumnMenu && (

                <div className="StaffVisitMeeting__columnMenu">

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.sno
                      }
                      onChange={() =>
                        toggleColumn("sno")
                      }
                    />
                    S.No.
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.date
                      }
                      onChange={() =>
                        toggleColumn("date")
                      }
                    />
                    Date
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.employee
                      }
                      onChange={() =>
                        toggleColumn(
                          "employee"
                        )
                      }
                    />
                    Employee Name
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={
                        visibleColumns.school
                      }
                      onChange={() =>
                        toggleColumn(
                          "school"
                        )
                      }
                    />
                    School Name
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

            </div>

            {/* ADD BUTTON */}

            <button
              className="StaffVisitMeeting__addBtn"
              onClick={
                handleAddVisit
              }
            >
              <FaPlus />
            </button>

          </div>

          {/* =========================================
              TABLE
          ========================================= */}

          <div className="StaffVisitMeeting__tableWrapper">

            <table className="StaffVisitMeeting__table">

              <thead>

                <tr>

                  {visibleColumns.sno && (
                    <th>S.NO.</th>
                  )}

                  {visibleColumns.date && (
                    <th>DATE</th>
                  )}

                  {visibleColumns.employee && (
                    <th>
                      EMPLOYEE NAME
                    </th>
                  )}

                  {visibleColumns.school && (
                    <th>
                      SCHOOL NAME
                    </th>
                  )}

                  {visibleColumns.remark && (
                    <th>REMARK</th>
                  )}

                  {visibleColumns.action && (
                    <th>ACTION</th>
                  )}

                </tr>

              </thead>

              <tbody>

                {currentItems.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={item.id}
                      className="StaffVisitMeeting__tableRow"
                      onClick={() =>
                        handleEditVisit(
                          item
                        )
                      }
                    >

                      {visibleColumns.sno && (
                        <td>
                          {indexOfFirstItem +
                            index +
                            1}
                        </td>
                      )}

                      {visibleColumns.date && (
                        <td>
                          {
                            item.startDate
                          }{" "}
                          -{" "}
                          {
                            item.endDate
                          }
                        </td>
                      )}

                      {visibleColumns.employee && (
                        <td>
                          {
                            item.employeeName
                          }
                        </td>
                      )}

                      {visibleColumns.school && (
                        <td>
                          {
                            item.schoolName
                          }
                        </td>
                      )}

                      {visibleColumns.remark && (
                        <td>
                          {
                            item.remark
                          }
                        </td>
                      )}

                      {visibleColumns.action && (

                        <td>

                          <button
                            className="StaffVisitMeeting__deleteBtn"
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              handleDelete(
                                item.id
                              );
                            }}
                          >
                            <FaTrashAlt />
                          </button>

                        </td>

                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =========================================
              MOBILE CARDS
          ========================================= */}

          <div className="StaffVisitMeeting__mobileCards">

            {currentItems.map(
              (item) => (
                <div
                  key={item.id}
                  className="StaffVisitMeeting__mobileCard"
                  onClick={() =>
                    handleEditVisit(
                      item
                    )
                  }
                >

                  <div className="StaffVisitMeeting__mobileRow">

                    <span>
                      Employee
                    </span>

                    <p>
                      {
                        item.employeeName
                      }
                    </p>

                  </div>

                  <div className="StaffVisitMeeting__mobileRow">

                    <span>
                      Date
                    </span>

                    <p>
                      {
                        item.startDate
                      }{" "}
                      -{" "}
                      {
                        item.endDate
                      }
                    </p>

                  </div>

                  <div className="StaffVisitMeeting__mobileRow">

                    <span>
                      School
                    </span>

                    <p>
                      {
                        item.schoolName
                      }
                    </p>

                  </div>

                  <div className="StaffVisitMeeting__mobileRow">

                    <span>
                      Remark
                    </span>

                    <p>
                      {
                        item.remark
                      }
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

          {/* =========================================
              PAGINATION
          ========================================= */}

          <div className="StaffVisitMeeting__pagination">

            <div className="StaffVisitMeeting__pageSize">

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

                  setCurrentPage(
                    1
                  );
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

            <div className="StaffVisitMeeting__pageInfo">

              {filteredData.length === 0
                ? 0
                : indexOfFirstItem +
                  1}
              {" - "}
              {Math.min(
                indexOfLastItem,
                filteredData.length
              )}

              {" of "}

              {filteredData.length}

            </div>

            <div className="StaffVisitMeeting__pageBtns">

              <button
                disabled={
                  currentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      prev -
                      1
                  )
                }
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      prev +
                      1
                  )
                }
              >
                <FaChevronRight />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* PART 3 = ADD / MODIFY MODAL */}

            {/* =========================================
          ADD / MODIFY MODAL
      ========================================= */}

      {openModal && (

        <div className="StaffVisitMeeting__modal">

          <div
            className="StaffVisitMeeting__overlay"
            onClick={handleCloseModal}
          />

          <div className="StaffVisitMeeting__modalContainer">

            {/* HEADER */}

            <div className="StaffVisitMeeting__modalHeader">

              <h2>
                {modalMode === "add"
                  ? "VISIT"
                  : "MODIFY VISIT"}
              </h2>

              <button
                className="StaffVisitMeeting__closeBtn"
                onClick={handleCloseModal}
              >
                ×
              </button>

            </div>

            {/* BODY */}

            <div className="StaffVisitMeeting__modalBody">

              <div className="StaffVisitMeeting__formGrid">

                {/* EMPLOYEE */}

                <div className="StaffVisitMeeting__field">

                  <label>
                    Employee Name *
                  </label>

                  <select
                    value={
                      formData.employeeName
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeName:
                          e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select Employee
                    </option>

                    <option>
                      Anchal Yadav
                    </option>

                    <option>
                      Rahul Sharma
                    </option>

                    <option>
                      Priya Das
                    </option>

                    <option>
                      Suresh Kumar
                    </option>

                  </select>

                </div>

                {/* START DATE */}

                <div className="StaffVisitMeeting__field">

                  <label>
                    Start Date *
                  </label>

                  <input
                    type="date"
                    value={
                      formData.startDate
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* END DATE */}

                <div className="StaffVisitMeeting__field">

                  <label>
                    End Date *
                  </label>

                  <input
                    type="date"
                    value={
                      formData.endDate
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* SCHOOL NAME */}

                <div className="StaffVisitMeeting__field">

                  <label>
                    School Name *
                  </label>

                  <input
                    type="text"
                    value={
                      formData.schoolName
                    }
                    placeholder="Enter School Name"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schoolName:
                          e.target.value,
                      })
                    }
                  />

                </div>

                {/* REMARK */}

                <div className="StaffVisitMeeting__field StaffVisitMeeting__fieldFull">

                  <label>
                    Remark *
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Enter Remark"
                    value={
                      formData.remark
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        remark:
                          e.target.value,
                      })
                    }
                  />

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="StaffVisitMeeting__modalFooter">

              <button
                className="StaffVisitMeeting__cancelBtn"
                onClick={handleCloseModal}
              >
                Cancel
              </button>

              <button
                className="StaffVisitMeeting__saveBtn"
                onClick={handleSaveVisit}
              >
                {modalMode === "add"
                  ? "Add"
                  : "Modify"}
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default StaffVisitMeeting;