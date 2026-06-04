import React, { useState, useEffect } from "react";

import API from "../../api/axios";
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



const StaffComplaint = () => {
  /* =========================================
     MAIN STATES
  ========================================= */

  const [complaints, setComplaints] = useState([]);

  const [complaintTypes, setComplaintTypes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* =========================================
     MODALS
  ========================================= */

  const [openModal, setOpenModal] = useState(false);

  const [openTypeModal, setOpenTypeModal] = useState(false);

  const [openTypeAddModal, setOpenTypeAddModal] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [complaintTypeMode, setComplaintTypeMode] = useState("add");

  /* =========================================
     SELECTED ITEMS
  ========================================= */

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [selectedComplaintType, setSelectedComplaintType] = useState(null);

  /* =========================================
     COMPLAINT FORM
  ========================================= */

  const [formData, setFormData] = useState({
    staffName: "",
    department: "",
    complaintType: "",
    complaintText: "",
    feedback: false,
    status: "Pending",
  });
  /* =========================================
     COMPLAINT TYPE FORM
  ========================================= */

  const [complaintTypeForm, setComplaintTypeForm] = useState({
    complaintName: "",
    remark: "",
  });

  useEffect(() => {
    fetchComplaints();
  }, [page, rowsPerPage]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/staff-complaint/all?page=${page}&limit=${rowsPerPage}&search=${searchTerm}`,
      );

      setComplaints(res.data.data || []);

      setTotalPages(res.data.totalPages || 1);

      setTotalRecords(res.data.total || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComplaintType = () => {
    setComplaintTypeMode("add");

    setSelectedComplaintType(null);

    setComplaintTypeForm({
      complaintName: "",
      remark: "",
    });

    setOpenTypeAddModal(true);
  };
  /* =========================================
     ADD COMPLAINT
  ========================================= */

  const handleAddComplaint = () => {
    setModalMode("add");

    setSelectedComplaint(null);

    setFormData({
      staffName: "",
      department: "",
      complaintType: "",
      complaintText: "",
      feedback: false,
      status: "Pending",
    });

    setOpenModal(true);
  };

  /* =========================================
     EDIT COMPLAINT
  ========================================= */

  const handleEditComplaint = (complaint) => {
    setModalMode("edit");

    setSelectedComplaint(complaint);

    setFormData({
      staffName: complaint.staffName || "",
      department: complaint.department || "",
      complaintType: complaint.complaintType || "",
      complaintText: complaint.complaintText || "",
      feedback: complaint.feedback || false,
      status: complaint.status || "Pending",
    });

    setOpenModal(true);
  };

  /* =========================================
     SAVE COMPLAINT
  ========================================= */

  const handleSaveComplaint = async () => {
    try {
      if (
        !formData.staffName ||
        !formData.department ||
        !formData.complaintType ||
        !formData.complaintText
      ) {
        Swal.fire({
          icon: "warning",
          title: "Please fill all required fields",
        });
        return;
      }

      const payload = {
        staffName: formData.staffName,
        department: formData.department,
        complaintType: formData.complaintType,
        complaintText: formData.complaintText,
        feedback: formData.feedback,
        status: formData.status || "Pending",
      };

      if (modalMode === "add") {
        await API.post("/staff-complaint/create", payload);
      } else {
        await API.put(
          `/staff-complaint/update/${selectedComplaint._id}`,
          payload,
        );
      }

      await fetchComplaints();

      setOpenModal(false);

      setFormData({
        staffName: "",
        department: "",
        complaintType: "",
        complaintText: "",
        feedback: false,
        status: "Pending",
      });

      Swal.fire({
        icon: "success",
        title:
          modalMode === "add"
            ? "Complaint Added Successfully"
            : "Complaint Updated Successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  /* =========================================
     DELETE COMPLAINT
  ========================================= */

  const handleDeleteComplaint = (id) => {
    Swal.fire({
      title: "Delete Complaint?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/staff-complaint/delete/${id}`);

          await fetchComplaints();

          Swal.fire({
            icon: "success",
            title: "Deleted",
            timer: 1200,
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
     ADD COMPLAINT TYPE
  ========================================= */

  const handleSaveComplaintType = async () => {
    try {
      if (!complaintTypeForm.complaintName) {
        Swal.fire({
          icon: "warning",
          title: "Complaint Name is required",
        });
        return;
      }

      if (complaintTypeMode === "add") {
        await API.post("/staff-complaint/type/create", {
          complaintType: complaintTypeForm.complaintName,
        });
      } else {
        await API.put("/staff-complaint/type/update", {
          oldType: selectedComplaintType.complaintName,
          newType: complaintTypeForm.complaintName,
        });
      }

      await fetchComplaintTypes();

      setComplaintTypeForm({
        complaintName: "",
        remark: "",
      });

      setOpenTypeAddModal(false);

      Swal.fire({
        icon: "success",
        title:
          complaintTypeMode === "add"
            ? "Complaint Type Added"
            : "Complaint Type Updated",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  /* =========================================
     EDIT COMPLAINT TYPE
  ========================================= */

  const handleEditComplaintType = (type) => {
    setComplaintTypeMode("edit");

    setSelectedComplaintType(type);

    setComplaintTypeForm({
      complaintName: type.complaintName,

      remark: type.remark,
    });

    setOpenTypeAddModal(true);
  };

  /* =========================================
     SAVE COMPLAINT TYPE
  ========================================= */

  /* =========================================
     DELETE COMPLAINT TYPE
  ========================================= */

  const handleDeleteComplaintType = (type) => {
    Swal.fire({
      title: "Delete Complaint Type?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete(`/staff-complaint/type/delete/${type}`);

          await fetchComplaintTypes();

          Swal.fire({
            icon: "success",
            title: "Deleted Successfully",
            timer: 1200,
            showConfirmButton: false,
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  /* =========================================
     SEARCH FILTER
  ========================================= */

  const filteredComplaints = complaints;

  useEffect(() => {
    setPage(1);

    const timer = setTimeout(() => {
      fetchComplaints();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchComplaintTypes();
  }, []);

  const fetchComplaintTypes = async () => {
    try {
      const res = await API.get("/staff-complaint/type/all");

      setComplaintTypes(
        (res.data.data || []).map((item) => ({
          _id: item,
          complaintName: item,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================================
     PAGINATION
  ========================================= */

  const totalPagesState = totalPages;

  const startIndex = (page - 1) * rowsPerPage;

  const paginatedData = filteredComplaints;

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="StaffComplaint__headerBtns">
            <button
              className="StaffComplaint__typeBtn"
              onClick={() => setOpenTypeModal(true)}
            >
              Complaint Type
            </button>

            <button
              className="StaffComplaint__addBtn"
              onClick={handleAddComplaint}
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* COMPLAINT LIST */}

        <div className="StaffComplaint__list">
          {paginatedData.map((item) => (
            <div
              key={item._id}
              className="StaffComplaint__complaintCard"
              onClick={() => handleEditComplaint(item)}
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

                  handleDeleteComplaint(item._id);
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>

        {/* =====================================
            PAGINATION
        ===================================== */}

        <div className="StaffComplaint__pagination">
          <div className="StaffComplaint__pageSize">
            <span>Items per page:</span>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));

                setPage(1);
              }}
            >
              <option value="5">5</option>

              <option value="10">10</option>

              <option value="25">25</option>

              <option value="50">50</option>
            </select>
          </div>

          <div className="StaffComplaint__pageInfo">
            {complaints.length === 0
              ? "0 - 0"
              : `${(page - 1) * rowsPerPage + 1}
     - ${Math.min(page * rowsPerPage, totalRecords)}
     of ${totalRecords}`}
          </div>

          <div className="StaffComplaint__pageBtns">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              <FaChevronLeft />
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
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
            onClick={() => setOpenModal(false)}
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
                onClick={() => setOpenModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="StaffComplaint__modalBody">
              <div className="StaffComplaint__field">
                <label>Complaint Type</label>

                <div className="StaffComplaint__selectWrapper">
                  <select
                    value={formData.complaintType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        complaintType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Complaint Type</option>

                    {complaintTypes.map((type) => (
                      <option key={type._id} value={type.complaintName}>
                        {type.complaintName}
                      </option>
                    ))}
                  </select>

                  <button
                    className="StaffComplaint__typeAddBtn"
                    onClick={() => setOpenTypeModal(true)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="StaffComplaint__field">
                <label>Staff Name</label>

                <input
                  type="text"
                  value={formData.staffName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      staffName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="StaffComplaint__field">
                <label>Department</label>

                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                />
              </div>
              <div className="StaffComplaint__field">
                <label>Complaint Text</label>

                <textarea
                  rows="6"
                  value={formData.complaintText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      complaintText: e.target.value,
                    })
                  }
                />
              </div>

              {/* FEEDBACK */}

              <div className="StaffComplaint__checkbox">
                <input
                  type="checkbox"
                  checked={formData.feedback}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feedback: e.target.checked,
                    })
                  }
                />

                <label>Feedback</label>
              </div>

              {/* STATUS */}

              <div className="StaffComplaint__statusBox">
                <label>
                  <input
                    type="radio"
                    name="status"
                    value="Resolved"
                    checked={formData.status === "Resolved"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
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
                    checked={formData.status === "Rejected"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
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
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>

              <button
                className="StaffComplaint__saveBtn"
                onClick={handleSaveComplaint}
              >
                {modalMode === "add" ? "Add Complaint" : "Update Complaint"}
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
            onClick={() => setOpenTypeModal(false)}
          />

          <div className="StaffComplaint__typeModal">
            <div className="StaffComplaint__modalHeader">
              <h2>Complaint Types</h2>

              <button
                className="StaffComplaint__closeBtn"
                onClick={() => setOpenTypeModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="StaffComplaint__typeBody">
              <button
                className="StaffComplaint__newTypeBtn"
                onClick={handleAddComplaintType}
              >
                <FaPlus />
                Add Complaint Type
              </button>

              {complaintTypes.map((item) => (
                <div key={item._id} className="StaffComplaint__typeRow">
                  <div>
                    <h4>{item.complaintName}</h4>

                    <p>{item.remark}</p>
                  </div>

                  <div className="StaffComplaint__typeActions">
                    <button onClick={() => handleEditComplaintType(item)}>
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteComplaintType(item.complaintName)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
            onClick={() => setOpenTypeAddModal(false)}
          />

          <div className="StaffComplaint__smallModal">
            <div className="StaffComplaint__modalHeader">
              <h2>
                {complaintTypeMode === "add"
                  ? "ADD COMPLAINT TYPE"
                  : "MODIFY COMPLAINT TYPE"}
              </h2>

              <button
                className="StaffComplaint__closeBtn"
                onClick={() => setOpenTypeAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="StaffComplaint__modalBody">
              <div className="StaffComplaint__field">
                <label>Complaint Name</label>

                <input
                  value={complaintTypeForm.complaintName}
                  onChange={(e) =>
                    setComplaintTypeForm({
                      ...complaintTypeForm,
                      complaintName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="StaffComplaint__field">
                <label>Remark</label>

                <textarea
                  rows="4"
                  value={complaintTypeForm.remark}
                  onChange={(e) =>
                    setComplaintTypeForm({
                      ...complaintTypeForm,
                      remark: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="StaffComplaint__modalFooter">
              <button
                className="StaffComplaint__cancelBtn"
                onClick={() => setOpenTypeAddModal(false)}
              >
                Cancel
              </button>

              <button
                className="StaffComplaint__saveBtn"
                onClick={handleSaveComplaintType}
              >
                {complaintTypeMode === "add" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffComplaint;
