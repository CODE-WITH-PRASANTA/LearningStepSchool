import React, { useState, useEffect } from "react";

import API from "../../api/axios";
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
   COMPONENT
========================================= */

const StaffVisitMeeting = () => {
  const [visitData, setVisitData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [selectedVisit, setSelectedVisit] = useState(null);

  const [showColumnMenu, setShowColumnMenu] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* =========================================
     COLUMN VISIBILITY
  ========================================= */

  const [visibleColumns, setVisibleColumns] = useState({
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

  const [formData, setFormData] = useState({
    employeeName: "",
    startDate: "",
    endDate: "",
    schoolName: "",
    remark: "",
  });

  useEffect(() => {
    fetchVisits();
  }, [currentPage, itemsPerPage]);

  const fetchVisits = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/staff-visit-meeting/all?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
      );

      setVisitData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.total || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
      employeeName: visit.employeeName || "",

      startDate: visit.startDate ? visit.startDate.split("T")[0] : "",

      endDate: visit.endDate ? visit.endDate.split("T")[0] : "",

      schoolName: visit.schoolName || "",

      remark: visit.remark || "",
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

  const handleSaveVisit = async () => {
    try {
      if (!formData.employeeName || !formData.schoolName) {
        Swal.fire({
          icon: "warning",
          title: "Required Fields Missing",
          text: "Employee Name and School Name are required.",
        });

        return;
      }

      if (modalMode === "add") {
        await API.post("/staff-visit-meeting/create", formData);

        Swal.fire({
          icon: "success",
          title: "Visit Added Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await API.put(
          `/staff-visit-meeting/update/${selectedVisit._id}`,
          formData,
        );

        Swal.fire({
          icon: "success",
          title: "Visit Updated Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      await fetchVisits();

      handleCloseModal();
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Visit?",
      text: "This visit record will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/staff-visit-meeting/delete/${id}`);

          await fetchVisits();

          Swal.fire({
            icon: "success",
            title: "Deleted Successfully",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Delete Failed",
          });
        }
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

  const filteredData = visitData;

  useEffect(() => {
    setCurrentPage(1);

    const timer = setTimeout(() => {
      fetchVisits();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* =========================================
     PAGINATION
  ========================================= */

  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredData;

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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* COLUMN FILTER */}

            <div className="StaffVisitMeeting__filterWrapper">
              <button
                className="StaffVisitMeeting__filterBtn"
                onClick={() => setShowColumnMenu(!showColumnMenu)}
              >
                <FaListUl />
              </button>

              {showColumnMenu && (
                <div className="StaffVisitMeeting__columnMenu">
                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.sno}
                      onChange={() => toggleColumn("sno")}
                    />
                    S.No.
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.date}
                      onChange={() => toggleColumn("date")}
                    />
                    Date
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.employee}
                      onChange={() => toggleColumn("employee")}
                    />
                    Employee Name
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.school}
                      onChange={() => toggleColumn("school")}
                    />
                    School Name
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.remark}
                      onChange={() => toggleColumn("remark")}
                    />
                    Remark
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      checked={visibleColumns.action}
                      onChange={() => toggleColumn("action")}
                    />
                    Action
                  </label>
                </div>
              )}
            </div>

            {/* ADD BUTTON */}

            <button
              className="StaffVisitMeeting__addBtn"
              onClick={handleAddVisit}
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
                  {visibleColumns.sno && <th>S.NO.</th>}

                  {visibleColumns.date && <th>DATE</th>}

                  {visibleColumns.employee && <th>EMPLOYEE NAME</th>}

                  {visibleColumns.school && <th>SCHOOL NAME</th>}

                  {visibleColumns.remark && <th>REMARK</th>}

                  {visibleColumns.action && <th>ACTION</th>}
                </tr>
              </thead>

              <tbody>
                {currentItems.map((item, index) => (
                  <tr
                    key={item._id}
                    className="StaffVisitMeeting__tableRow"
                    onClick={() => handleEditVisit(item)}
                  >
                    {visibleColumns.sno && (
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    )}

                    {visibleColumns.date && (
                      <td>
                        {item.startDate} - {item.endDate}
                      </td>
                    )}

                    {visibleColumns.employee && <td>{item.employeeName}</td>}

                    {visibleColumns.school && <td>{item.schoolName}</td>}

                    {visibleColumns.remark && <td>{item.remark}</td>}

                    {visibleColumns.action && (
                      <td>
                        <button
                          className="StaffVisitMeeting__deleteBtn"
                          onClick={(e) => {
                            e.stopPropagation();

                            handleDelete(item._id);
                          }}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========================================
              MOBILE CARDS
          ========================================= */}

          <div className="StaffVisitMeeting__mobileCards">
            {currentItems.map((item) => (
              <div
                key={item._id}
                className="StaffVisitMeeting__mobileCard"
                onClick={() => handleEditVisit(item)}
              >
                <div className="StaffVisitMeeting__mobileRow">
                  <span>Employee</span>

                  <p>{item.employeeName}</p>
                </div>

                <div className="StaffVisitMeeting__mobileRow">
                  <span>Date</span>

                  <p>
                    {item.startDate} - {item.endDate}
                  </p>
                </div>

                <div className="StaffVisitMeeting__mobileRow">
                  <span>School</span>

                  <p>{item.schoolName}</p>
                </div>

                <div className="StaffVisitMeeting__mobileRow">
                  <span>Remark</span>

                  <p>{item.remark}</p>
                </div>
              </div>
            ))}
          </div>

          {/* =========================================
              PAGINATION
          ========================================= */}

          <div className="StaffVisitMeeting__pagination">
            <div className="StaffVisitMeeting__pageSize">
              <span>Items per page</span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));

                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>

                <option value={20}>20</option>

                <option value={50}>50</option>
              </select>
            </div>

            <div className="StaffVisitMeeting__pageInfo">
              {visitData.length === 0
                ? "0 - 0"
                : `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                    currentPage * itemsPerPage,
                    totalRecords,
                  )} of ${totalRecords}`}
            </div>

            <div className="StaffVisitMeeting__pageBtns">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
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
              <h2>{modalMode === "add" ? "VISIT" : "MODIFY VISIT"}</h2>

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
                  <label>Employee Name *</label>

                  <input
                    type="text"
                    placeholder="Enter Employee Name"
                    value={formData.employeeName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* START DATE */}

                <div className="StaffVisitMeeting__field">
                  <label>Start Date *</label>

                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>

                {/* END DATE */}

                <div className="StaffVisitMeeting__field">
                  <label>End Date *</label>

                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endDate: e.target.value,
                      })
                    }
                  />
                </div>

                {/* SCHOOL NAME */}

                <div className="StaffVisitMeeting__field">
                  <label>School Name *</label>

                  <input
                    type="text"
                    value={formData.schoolName}
                    placeholder="Enter School Name"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        schoolName: e.target.value,
                      })
                    }
                  />
                </div>

                {/* REMARK */}

                <div className="StaffVisitMeeting__field StaffVisitMeeting__fieldFull">
                  <label>Remark *</label>

                  <textarea
                    rows="4"
                    placeholder="Enter Remark"
                    value={formData.remark}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        remark: e.target.value,
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
                {modalMode === "add" ? "Add" : "Modify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffVisitMeeting;
