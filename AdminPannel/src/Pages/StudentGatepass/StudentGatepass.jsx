import React, { useState } from "react";
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

const data = [
  {
    id: 1,
    name: "demo",
    relation: "Father",
    contact: "3331321211",
    date: "26-05-2026",
    time: "10:00 PM - 12:00 AM",

    timeIn: "10:00 PM",
    timeOut: "12:00 AM",

    reason: "Meeting",
    remark: "Demo Remark",

    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

    student: "[1234] Ashmita minj, 2nd - A",
  },
  {
    id: 2,
    name: "demo",
    relation: "Father",
    contact: "3331321211",
    date: "26-05-2026",
    time: "10:00 PM - 12:00 AM",

    timeIn: "10:00 PM",
    timeOut: "12:00 AM",

    reason: "Meeting",
    remark: "Demo Remark",

    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

    student: "[1234] Ashmita minj, 2nd - A",
  },
  {
    id: 3,
    name: "jl",
    relation: "Father",
    contact: "3331321211",
    date: "26-05-2026",
    time: "10:00 PM - 12:00 AM",

    timeIn: "10:00 PM",
    timeOut: "12:00 AM",

    reason: "Meeting",
    remark: "Demo Remark",

    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

    student: "[1234] Ashmita minj, 2nd - A",
  },
  {
    id: 4,
    name: "hkhg",
    relation: "Father",
    contact: "3331321211",
    date: "26-05-2026",
    time: "10:00 PM - 12:00 AM",

    timeIn: "10:00 PM",
    timeOut: "12:00 AM",

    reason: "Meeting",
    remark: "Demo Remark",

    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

    student: "[1234] Ashmita minj, 2nd - A",
  },
  {
    id: 5,
    name: "inayard",
    relation: "Father",
    contact: "3331321211",
    date: "26-05-2026",
    time: "10:00 PM - 12:00 AM",

    timeIn: "10:00 PM",
    timeOut: "12:00 AM",

    reason: "Meeting",
    remark: "Demo Remark",

    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

    student: "[1234] Ashmita minj, 2nd - A",
  },
];

const StudentGatepass = () => {
  const [showStudentInfo, setShowStudentInfo] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [visitorPhoto, setVisitorPhoto] = useState(
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  );

  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState("add");

  const [selectedVisitor, setSelectedVisitor] = useState(null);

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

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setVisitorPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleEditVisitor = (visitor) => {
    setSelectedVisitor(visitor);

    setModalMode("edit");

    setFormData({
      visitorName: visitor.name || "",
      relation: visitor.relation || "",
      phone: visitor.contact || "",
      timeIn: visitor.timeIn || "",
      timeOut: visitor.timeOut || "",
      reason: visitor.reason || "",
      remark: visitor.remark || "",
      photo: visitor.photo || "",
    });

    setOpenModal(true);
  };

  const [gatePassData, setGatePassData] = useState(data);
  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Gate Pass?",
      text: "This record will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",

      customClass: {
        popup: "studentGatepass__swalPopup",
        confirmButton: "studentGatepass__swalConfirm",
        cancelButton: "studentGatepass__swalCancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setGatePassData((prev) => prev.filter((item) => item.id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Gate Pass deleted successfully.",
          icon: "success",
          confirmButtonColor: "#5b5cf6",
        });
      }
    });
  };

  return (
    <div className="studentGatepass">
      <div className="studentGatepass__card">
        {/* Header */}

        <div className="studentGatepass__header">
          <div className="studentGatepass__searchBox">
            <FaSearch />
            <input
              type="text"
              placeholder="Search..."
              className="studentGatepass__searchInput"
            />
          </div>

          <button
            className="studentGatepass__addBtn"
            onClick={() => {
              setModalMode("add");

              setSelectedVisitor(null);

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
              {gatePassData.map((item) => (
                <tr
                  key={item.id}
                  className="studentGatepass__tableRow"
                  onClick={() => handleEditVisitor(item)}
                >
                  <td>{item.id}</td>

                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      alt=""
                      className="studentGatepass__avatar"
                    />
                  </td>

                  <td>{item.name}</td>

                  <td>{item.contact}</td>

                  <td>{item.date}</td>

                  <td>{item.time}</td>

                  <td>{item.student}</td>

                  <td>
                    <div className="studentGatepass__actions">
                      <button
                        className="studentGatepass__deleteBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <FaTrashAlt />
                      </button>

                      <button
                        className="studentGatepass__printBtn"
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(`/student-gatepass/print/${item.id}`, {
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
          {gatePassData.map((item) => (
            <div key={item.id} className="studentGatepass__mobileCard">
              <div className="studentGatepass__mobileTop">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt=""
                  className="studentGatepass__mobileAvatar"
                />

                <div>
                  <h4>{item.name}</h4>
                  <p>{item.contact}</p>
                </div>
              </div>

              <div className="studentGatepass__mobileBody">
                <div>
                  <span>Date</span>
                  <p>{item.date}</p>
                </div>

                <div>
                  <span>Time</span>
                  <p>{item.time}</p>
                </div>

                <div>
                  <span>Student</span>
                  <p>{item.student}</p>
                </div>
              </div>

              <div className="studentGatepass__mobileActions">
                <button
                  className="studentGatepass__deleteBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <FaTrashAlt />
                </button>

                <button
                  className="studentGatepass__printBtn"
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(`/student-gatepass/print/${item.id}`);
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

            <select>
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>

          <div className="studentGatepass__pageInfo">1 – 5 of 5</div>

          <div className="studentGatepass__pageBtns">
            <button>
              <FaChevronLeft />
            </button>

            <button>
              <FaChevronRight />
            </button>
          </div>
        </div>

        {openModal && (
          <div className="studentGatepass__modal">
            <div
              className="studentGatepass__modalOverlay"
              onClick={() => setOpenModal(false)}
            />

            <div className="studentGatepass__modalContainer">
              {/* Header */}

              <div className="studentGatepass__modalHeader">
                <h2>
                  {modalMode === "add" ? "ADD GATE PASS" : "MODIFY GATE PASS"}
                </h2>
                <button
                  className="studentGatepass__modalClose"
                  onClick={() => setOpenModal(false)}
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
                      <input type="text" placeholder="Search" />
                    </div>

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
                        <input defaultValue="22:00" />
                      </div>

                      <div className="studentGatepass__field">
                        <label>Time Out</label>
                        <input defaultValue="--:--" />
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
                    {/* <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt=""
            /> */}

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
                            <div className="studentGatepass__familyBox">
                              <h4>Student</h4>

                              <div className="studentGatepass__familyCard">
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  alt=""
                                />
                              </div>
                            </div>

                            <div className="studentGatepass__familyBox">
                              <h4>Father</h4>

                              <div className="studentGatepass__familyCard">
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  alt=""
                                />

                                <p>Mob : 9876543210</p>
                              </div>
                            </div>

                            <div className="studentGatepass__familyBox">
                              <h4>Mother</h4>

                              <div className="studentGatepass__familyCard">
                                <img
                                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                  alt=""
                                />

                                <p>Mob : 9876543211</p>
                              </div>
                            </div>
                          </div>

                          <div className="studentGatepass__address">
                            <strong>Address :</strong> Bhubaneswar, Odisha
                          </div>
                        </>
                      )}

                      {/* GUARDIAN TAB */}

                      {activeTab === "guardian" && (
                        <div className="studentGatepass__guardianWrapper">
                          <div className="studentGatepass__guardianCard">
                            <div className="studentGatepass__guardianDetails">
                              <h3>Guardian Name [01] :</h3>

                              <p>
                                <strong>Relation :</strong> Father
                              </p>

                              <p>
                                <strong>Mob. No. :</strong> 9876543210
                              </p>

                              <p>
                                <strong>Remark :</strong> Primary Guardian
                              </p>
                            </div>

                            <div className="studentGatepass__guardianImage">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                alt=""
                              />
                            </div>
                          </div>

                          <div className="studentGatepass__guardianCard">
                            <div className="studentGatepass__guardianDetails">
                              <h3>Guardian Name [02] :</h3>

                              <p>
                                <strong>Relation :</strong> Mother
                              </p>

                              <p>
                                <strong>Mob. No. :</strong> 9876543211
                              </p>

                              <p>
                                <strong>Remark :</strong> Secondary Guardian
                              </p>
                            </div>

                            <div className="studentGatepass__guardianImage">
                              <img
                                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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

                <button className="studentGatepass__saveBtn">
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
