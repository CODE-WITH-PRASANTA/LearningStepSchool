import React, { useState, useEffect } from "react";
import API, { IMAGE_URL } from "../../api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";

import "./StudentGatepass.css";



const StudentGatepass = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [showStudentInfo, setShowStudentInfo] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [visitorPhoto, setVisitorPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  );

  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState("add");

  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const [gatePassData, setGatePassData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [tableSearch, setTableSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    visitorName: "",
    relation: "",
    phone: "",
    timeIn: "",
    timeOut: "",
    reason: "",
    remark: "",
    photo: "",
  });

  const fetchGatePasses = async () => {
    try {
      setLoading(true);

      const res = await API.get("/student-gatepass/all");
      console.log("Gate Pass Data:", res.data.data);

      setGatePassData(res.data.data || []);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Failed to load gate passes",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatePasses();
  }, []);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setVisitorPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSaveGatePass = async () => {
    try {
      if (!selectedStudent || !formData.visitorName || !formData.phone) {
        Swal.fire({
          icon: "warning",
          title: "Please fill all required fields",
        });

        return;
      }

      const payload = new FormData();

      payload.append("studentId", selectedStudent._id);

      payload.append("visitorName", formData.visitorName);

      payload.append("relation", formData.relation);

      payload.append("phone", formData.phone);

      payload.append("timeIn", formData.timeIn);

      payload.append("timeOut", formData.timeOut);

      payload.append("reason", formData.reason);

      payload.append("remark", formData.remark);

      if (photoFile) {
        payload.append("photo", photoFile);
      }

      if (modalMode === "add") {
        await API.post("/student-gatepass/create", payload);

        Swal.fire({
          icon: "success",
          title: "Gate Pass Added",
        });
      } else {
        await API.put(
          `/student-gatepass/update/${selectedVisitor._id}`,
          payload,
        );

        Swal.fire({
          icon: "success",
          title: "Gate Pass Updated",
        });
      }

      fetchGatePasses();
      handleCloseModal();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

 const handleEditVisitor = (visitor) => {
  console.log("EDIT VISITOR =", visitor);

  setSelectedVisitor(visitor);

  setFormData({
    visitorName: visitor.visitorName || "",
    relation: visitor.relation || "",
    phone: visitor.phone || "",
    timeIn: visitor.timeIn || "",
    timeOut: visitor.timeOut || "",
    reason: visitor.reason || "",
    remark: visitor.remark || "",
    photo: visitor.photo || "",
  });

  console.log("SETTING VISITOR NAME =", visitor.visitorName);

  setSelectedStudent(visitor.studentId || null);

  setStudentSearch(
    visitor.studentId
      ? `${visitor.studentId.admissionNo || ""} - ${
          visitor.studentId.firstName || ""
        } ${visitor.studentId.lastName || ""}`
      : ""
  );

  setVisitorPhoto(
    visitor.photo
      ? `${IMAGE_URL}${visitor.photo}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
  );

  setModalMode("edit");
  setOpenModal(true);
};
  const handleCloseModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setOpenModal(false);
      setIsClosing(false);
    }, 300);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete Gate Pass?",
      text: "This record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await API.delete(`/student-gatepass/delete/${id}`);

        fetchGatePasses();

        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
        });
      }
    });
  };

  const searchStudentData = async (value) => {
    try {
      setStudentSearch(value);

      if (!value.trim()) {
        setStudentResults([]);
        return;
      }

      const res = await API.get(`/students/search/list?q=${value}`);

      setStudentResults(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = gatePassData.filter((item) => {
    const query = tableSearch.trim().toLowerCase();

    if (!query) return true;

    const visitor = item.visitorName?.toLowerCase() || "";
    const phone = item.phone?.toLowerCase() || "";
    const relation = item.relation?.toLowerCase() || "";
    const studentName = `${item.studentId?.admissionNo || ""} ${
      item.studentId?.firstName || ""
    } ${item.studentId?.lastName || ""}`.toLowerCase();

    return (
      visitor.includes(query) ||
      phone.includes(query) ||
      relation.includes(query) ||
      studentName.includes(query)
    );
  });

  const totalItems = filteredData.length;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);
  return (
    <div className="studentGatepass">
      <div className="studentGatepass__card">
        {/* Header */}

        <div className="studentGatepass__header">
          <div className="studentGatepass__searchBox">
            <FaSearch />
            <input
              type="text"
              placeholder="Search gate passes..."
              value={tableSearch}
              onChange={(e) => {
                setTableSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="studentGatepass__searchInput"
            />
          </div>

          <button
            className="studentGatepass__addBtn"
            onClick={() => {
              setModalMode("add");

              setSelectedVisitor(null);
              setSelectedStudent(null);

              setTableSearch("");
              setStudentSearch("");
              setStudentResults([]);

              setPhotoFile(null);

              setVisitorPhoto(
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              );

              setFormData({
                visitorName: "",
                relation: "",
                phone: "",
                timeIn: "",
                timeOut: "",
                reason: "",
                remark: "",
                photo: "",
              });

              setOpenModal(true);
            }}
          >
            <FaPlus />
          </button>
        </div>

        {/* Desktop Table */}

        <div className="studentGatepass__tableWrapper">
          <table className="studentGatepass__table">
            <thead>
              <tr>
                <th>S.NO.</th>
                <th>PHOTO</th>
                <th>VISITOR NAME</th>
                <th>CONTACT NO.</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>STUDENT NAME</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item._id}
                  className="studentGatepass__tableRow"
                  onClick={() => handleEditVisitor(item)}
                >
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={
                        item.photo
                          ? `${IMAGE_URL}${item.photo}`
                          : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="Visitor"
                      className="studentGatepass__avatar"
                    />
                  </td>

                  <td>{item.visitorName}</td>

                  <td>{item.phone}</td>

                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>

                  <td>
                    {item.timeIn} - {item.timeOut || "--"}
                  </td>

                  <td>
                    {item.studentId?.firstName} {item.studentId?.lastName}
                  </td>

                  <td>
                    <div className="studentGatepass__actions">
                      <button
                        className="studentGatepass__deleteBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        <FaTrashAlt />
                      </button>

                      <button
                        className="studentGatepass__printBtn"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(`/student-gatepass/print/${item._id}`, {
                            state: item,
                          });
                        }}
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

        {/* Mobile Cards */}

        <div className="studentGatepass__mobileCards">
          {currentData.map((item) => (
            <div
              key={item._id}
              className="studentGatepass__mobileCard"
              onClick={() => handleEditVisitor(item)}
            >
              <div className="studentGatepass__mobileTop">
                <img
                  src={
                    item.photo
                      ? `${IMAGE_URL}${item.photo}`
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="Visitor"
                  className="studentGatepass__avatar"
                />

                <div>
                  <h4>{item.visitorName}</h4>

                  <p>{item.phone}</p>
                </div>
              </div>

              <div className="studentGatepass__mobileBody">
                <div>
                  <span>Date</span>

                  <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <span>Time</span>

                  <p>
                    {item.timeIn} - {item.timeOut || "--"}
                  </p>
                </div>

                <div>
                  <span>Student</span>

                  <p>
                    {item.studentId?.firstName} {item.studentId?.lastName}
                  </p>
                </div>
              </div>

              <div className="studentGatepass__mobileActions">
                <button
                  className="studentGatepass__deleteBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                >
                  <FaTrashAlt />
                </button>

                <button
                  className="studentGatepass__printBtn"
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/student-gatepass/print/${item._id}`, {
                      state: item,
                    });
                  }}
                >
                  <FaPrint />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}

        <div className="studentGatepass__pagination">
          <div className="studentGatepass__pageSize">
            <span>Items per page:</span>

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

          <div className="studentGatepass__pageInfo">
            {totalItems === 0
              ? "0 - 0 of 0"
              : `${startIndex + 1} - ${Math.min(
                  endIndex,
                  totalItems,
                )} of ${totalItems}`}
          </div>

          <div className="studentGatepass__pageBtns">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <FaChevronLeft />
            </button>

            <span
              style={{
                padding: "0 10px",
                fontWeight: 600,
              }}
            >
              {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {openModal && (
          <div
            className={`studentGatepass__modal ${
              isClosing
                ? "studentGatepass__modalClosing"
                : "studentGatepass__modalOpening"
            }`}
          >
            <div
              className="studentGatepass__modalOverlay"
              onClick={handleCloseModal}
            />

            <div className="studentGatepass__modalContainer">
              {/* Header */}

              <div className="studentGatepass__modalHeader">
                <h2>
                  {modalMode === "add" ? "ADD GATE PASS" : "MODIFY GATE PASS"}
                </h2>
                <button
                  className="studentGatepass__modalClose"
                  onClick={handleCloseModal}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Body */}

              <div className="studentGatepass__modalBody">
                <div className="studentGatepass__modalTop">
                  <div className="studentGatepass__modalLeft">
                    <div className="studentGatepass__modalSearch">
                      <FaSearch />
                      <input
                        type="text"
                        placeholder="Search Student"
                        value={studentSearch}
                        onChange={(e) => searchStudentData(e.target.value)}
                      />
                    </div>

                    {studentResults.length > 0 && (
                      <div className="studentSearchList">
                        {studentResults.map((student) => (
                          <div
                            key={student._id}
                            className="studentSearchItem"
                            onClick={() => {
                              setSelectedStudent(student);

                              setStudentSearch(
                                `${student.admissionNo} - ${student.firstName} ${student.lastName || ""}`,
                              );

                              setStudentResults([]);
                            }}
                          >
                            {student.admissionNo} - {student.firstName}{" "}
                            {student.lastName}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="studentGatepass__formGrid">
                      <div className="studentGatepass__field">
                        <label>Visitor Name *</label>
                        <input
                          value={formData.visitorName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              visitorName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Relation *</label>
                        <input
                          value={formData.relation}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              relation: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Visitor Phone *</label>
                        <input
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Time In *</label>
                        <input
                          type="time"
                          value={formData.timeIn}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              timeIn: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Time Out</label>
                        <input
                          type="time"
                          value={formData.timeOut}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              timeOut: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Reason *</label>
                        <input
                          value={formData.reason}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              reason: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Remark</label>
                        <input
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

                  <div className="studentGatepass__photoSection">
                    {/* Student Photo */}

                    <div className="studentGatepass__studentPhotoBox">
                      <h4>Student</h4>

                      <img
                        src={
                          selectedStudent?.studentPhoto
                            ? `${IMAGE_URL}${selectedStudent.studentPhoto}`
                            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Student"
                        className="studentGatepass__avatar"
                      />
                    </div>

                    {/* Visitor Photo Upload */}

                    <div className="studentGatepass__photoUploadWrapper">
                      <img
                        src={visitorPhoto}
                        alt="Visitor"
                        className="studentGatepass__uploadedPhoto"
                      />

                      <label
                        htmlFor="studentGatepassPhotoUpload"
                        className="studentGatepass__uploadBtn"
                      >
                        Upload Photo
                      </label>

                      <input
                        id="studentGatepassPhotoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="studentGatepass__hiddenFileInput"
                      />
                    </div>
                  </div>
                </div>

                {/* Student Information */}

                <div className="studentGatepass__studentCard">
                  <div
                    className="studentGatepass__studentHeader"
                    onClick={() => setShowStudentInfo(!showStudentInfo)}
                  >
                    <span>STUDENT INFORMATION</span>
                    {showStudentInfo ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  {showStudentInfo && (
                    <div className="studentGatepass__studentContent">
                      {/* Tabs */}

                      <div className="studentGatepass__tabs">
                        <button
                          className={activeTab === "overview" ? "active" : ""}
                          onClick={() => setActiveTab("overview")}
                        >
                          Overview
                        </button>

                        <button
                          className={activeTab === "guardian" ? "active" : ""}
                          onClick={() => setActiveTab("guardian")}
                        >
                          Guardian's Info
                        </button>
                      </div>

                      {/* OVERVIEW TAB */}

                      {activeTab === "overview" && (
                        <>
                          <div className="studentGatepass__familyGrid">
                            {/* Student */}

                            <div className="studentGatepass__familyBox">
                              <h4>
                                {selectedStudent?.firstName}{" "}
                                {selectedStudent?.lastName}
                              </h4>

                              <div className="studentGatepass__familyCard">
                                <img
                                  src={
                                    selectedStudent?.studentPhoto
                                      ? `${IMAGE_URL}${selectedStudent.studentPhoto}`
                                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  }
                                  alt=""
                                />
                              </div>
                            </div>

                            {/* Father */}

                            <div className="studentGatepass__familyBox">
                              <h4>Father</h4>

                              <div className="studentGatepass__familyCard">
                                <img
                                  src={
                                    selectedStudent?.fatherPhoto
                                      ? `${IMAGE_URL}${selectedStudent.fatherPhoto}`
                                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  }
                                  alt=""
                                />

                                <p>Mob : {selectedStudent?.fatherPhone}</p>
                              </div>
                            </div>

                            {/* Mother */}

                            <div className="studentGatepass__familyBox">
                              <h4>Mother</h4>

                              <div className="studentGatepass__familyCard">
                                <img
                                  src={
                                    selectedStudent?.motherPhoto
                                      ? `${IMAGE_URL}${selectedStudent.motherPhoto}`
                                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  }
                                  alt=""
                                />

                                <p>Mob : {selectedStudent?.motherPhone}</p>
                              </div>
                            </div>
                          </div>

                          <div className="studentGatepass__address">
                            <strong>Address :</strong>{" "}
                            {selectedStudent?.currentAddress}
                          </div>
                        </>
                      )}

                      {/* GUARDIAN TAB */}

                      {activeTab === "guardian" && (
                        <div className="studentGatepass__guardianWrapper">
                          <div className="studentGatepass__guardianCard">
                            <div className="studentGatepass__guardianDetails">
                              <h3>{selectedStudent?.fatherName}</h3>

                              <p>
                                <strong>Relation :</strong> Father
                              </p>

                              <p>
                                <strong>Mob. No. :</strong>{" "}
                                {selectedStudent?.fatherPhone}
                              </p>
                            </div>

                            <div className="studentGatepass__guardianImage">
                              <img
                                src={
                                  selectedStudent?.fatherPhoto
                                    ? `${IMAGE_URL}${selectedStudent.fatherPhoto}`
                                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt=""
                              />
                            </div>
                          </div>

                          <div className="studentGatepass__guardianCard">
                            <div className="studentGatepass__guardianDetails">
                              <h3>{selectedStudent?.motherName}</h3>

                              <p>
                                <strong>Relation :</strong> Mother
                              </p>

                              <p>
                                <strong>Mob. No. :</strong>{" "}
                                {selectedStudent?.motherPhone}
                              </p>
                            </div>

                            <div className="studentGatepass__guardianImage">
                              <img
                                src={
                                  selectedStudent?.motherPhoto
                                    ? `${IMAGE_URL}${selectedStudent.motherPhoto}`
                                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}

              <div className="studentGatepass__modalFooter">
                <select>
                  <option>Print</option>
                </select>

                <button
                  className="studentGatepass__cancelBtn"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="studentGatepass__saveBtn"
                  onClick={handleSaveGatePass}
                >
                  {modalMode === "add" ? "Add Visitor" : "Update Visitor"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentGatepass;
