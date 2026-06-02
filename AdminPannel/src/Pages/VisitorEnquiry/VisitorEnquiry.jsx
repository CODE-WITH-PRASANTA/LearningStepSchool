import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

import "./VisitorEnquiry.css";

const enquiryData = [
  {
    id: 1,
    date: "30-05-2026",
    name: "Rahul Sharma",
    contact: "9876543210",
    purpose: "Admission Enquiry",
    address: "Bhubaneswar",
    description: "Interested in Class 8 admission",
    type: "student",
    studentName: "Aman Sharma",
    className: "8-A",
    gender: "Male",
    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },

  {
    id: 2,
    date: "29-05-2026",
    name: "Priya Das",
    contact: "9876543211",
    purpose: "Fee Enquiry",
    address: "Cuttack",
    description: "Fee structure details",
    type: "self",
    photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
];

const VisitorEnquiry = () => {
  const navigate = useNavigate();

  const [visitorData, setVisitorData] = useState(enquiryData);

  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const [showStudentInfo, setShowStudentInfo] = useState(true);

  const [visitorType, setVisitorType] = useState("self");

  const defaultPhoto =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const [visitorPhoto, setVisitorPhoto] = useState(defaultPhoto);

  const [formData, setFormData] = useState({
    enquiryDate: "",
    visitorName: "",
    contact: "",
    purpose: "",
    description: "",
    address: "",

    studentName: "",
    className: "",
    gender: "",

    staffName: "",
    department: "",
    designation: "",
  });

  /* =========================
     PHOTO UPLOAD
  ========================= */

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setVisitorPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     OPEN ADD MODAL
  ========================= */

  const handleAddVisitor = () => {
    setModalMode("add");

    setSelectedVisitor(null);

    setVisitorPhoto(defaultPhoto);

    setVisitorType("self");

    setFormData({
      enquiryDate: "",
      visitorName: "",
      contact: "",
      purpose: "",
      description: "",
      address: "",

      studentName: "",
      className: "",
      gender: "",

      staffName: "",
      department: "",
      designation: "",
    });

    setOpenModal(true);
  };

  /* =========================
     EDIT VISITOR
  ========================= */

  const handleEditVisitor = (visitor) => {
    setSelectedVisitor(visitor);

    setModalMode("edit");

    setVisitorType(visitor.type);

    setVisitorPhoto(visitor.photo || defaultPhoto);

    setFormData({
      enquiryDate: visitor.date || "",
      visitorName: visitor.name || "",
      contact: visitor.contact || "",
      purpose: visitor.purpose || "",
      description: visitor.description || "",
      address: visitor.address || "",

      studentName: visitor.studentName || "",

      className: visitor.className || "",

      gender: visitor.gender || "",

      staffName: visitor.staffName || "",

      department: visitor.department || "",

      designation: visitor.designation || "",
    });

    setOpenModal(true);
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const handleCloseModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setOpenModal(false);
      setIsClosing(false);
    }, 300);
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Visitor?",
      text: "This enquiry will be removed.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Delete",

      confirmButtonColor: "#ef4444",

      cancelButtonColor: "#64748b",
    }).then((result) => {
      if (result.isConfirmed) {
        setVisitorData((prev) => prev.filter((item) => item.id !== id));

        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  /* =========================
     FILTER DATA
  ========================= */

  const filteredData = visitorData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="visitorEnquiry">
        <div className="visitorEnquiry__card">
          {/* HEADER */}

          <div className="visitorEnquiry__header">
            <div className="visitorEnquiry__searchBox">
              <FaSearch />

              <input
                type="text"
                placeholder="Search Visitor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="visitorEnquiry__searchInput"
              />
            </div>

            <button
              className="visitorEnquiry__addBtn"
              onClick={handleAddVisitor}
            >
              <FaPlus />
            </button>
          </div>

          {/* TABLE */}

          <div className="visitorEnquiry__tableWrapper">
            <table className="visitorEnquiry__table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>PHOTO</th>
                  <th>DATE</th>
                  <th>VISITOR NAME</th>
                  <th>CONTACT</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="visitorEnquiry__tableRow"
                    onClick={() => handleEditVisitor(item)}
                  >
                    <td>{item.id}</td>

                    <td>
                      <img
                        src={item.photo}
                        alt=""
                        className="visitorEnquiry__avatar"
                      />
                    </td>

                    <td>{item.date}</td>

                    <td>{item.name}</td>

                    <td>{item.contact}</td>

                    <td>
                      <div className="visitorEnquiry__actions">
                        <button
                          className="visitorEnquiry__deleteBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <FaTrashAlt />
                        </button>

                        <button
                          className="visitorEnquiry__printBtn"
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(`/visitor-enquiry/print/${item.id}`, {
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

          {/* MOBILE CARDS */}

          <div className="visitorEnquiry__mobileCards">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="visitorEnquiry__mobileCard"
                onClick={() => handleEditVisitor(item)}
              >
                <div className="visitorEnquiry__mobileTop">
                  <img
                    src={item.photo}
                    alt=""
                    className="visitorEnquiry__mobileAvatar"
                  />

                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.contact}</p>
                  </div>
                </div>

                <div className="visitorEnquiry__mobileBody">
                  <div>
                    <span>Date</span>
                    <p>{item.date}</p>
                  </div>

                  <div>
                    <span>Purpose</span>
                    <p>{item.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}

          <div className="visitorEnquiry__pagination">
            <div className="visitorEnquiry__pageSize">
              <span>Items per page</span>

              <select>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>

            <div className="visitorEnquiry__pageInfo">
              1 - {filteredData.length}
            </div>

            <div className="visitorEnquiry__pageBtns">
              <button>
                <FaChevronLeft />
              </button>

              <button>
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* MODAL COMES IN PART 2 */}
        </div>
      </div>

      {openModal && (
        <div
          className={`visitorEnquiry__modal ${
            isClosing
              ? "visitorEnquiry__modalClosing"
              : "visitorEnquiry__modalOpening"
          }`}
        >
          <div
            className="visitorEnquiry__modalOverlay"
            onClick={handleCloseModal}
          />

          <div className="visitorEnquiry__modalContainer">
            {/* HEADER */}

            <div className="visitorEnquiry__modalHeader">
              <h2>
                {modalMode === "add"
                  ? "ADD VISITOR ENQUIRY"
                  : "MODIFY VISITOR ENQUIRY"}
              </h2>

              <button
                className="visitorEnquiry__modalClose"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="visitorEnquiry__modalBody">
              <div className="visitorEnquiry__modalTop">
                {/* LEFT */}

                <div className="visitorEnquiry__modalLeft">
                  <div className="visitorEnquiry__formGrid">
                    <div className="visitorEnquiry__field">
                      <label>Date *</label>

                      <input
                        type="date"
                        value={formData.enquiryDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enquiryDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="visitorEnquiry__field">
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

                    <div className="visitorEnquiry__field">
                      <label>Contact No *</label>

                      <input
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="visitorEnquiry__field">
                      <label>Purpose *</label>

                      <input
                        value={formData.purpose}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            purpose: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="visitorEnquiry__field visitorEnquiry__fieldFull">
                      <label>Description</label>

                      <textarea
                        rows="3"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="visitorEnquiry__field visitorEnquiry__fieldFull">
                      <label>Address</label>

                      <textarea
                        rows="3"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* PHOTO */}

                <div className="visitorEnquiry__photoSection">
                  <div className="visitorEnquiry__photoUploadWrapper">
                    <img
                      src={visitorPhoto}
                      alt=""
                      className="visitorEnquiry__uploadedPhoto"
                    />

                    <label
                      htmlFor="visitorEnquiryPhoto"
                      className="visitorEnquiry__uploadBtn"
                    >
                      Upload Photo
                    </label>

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      id="visitorEnquiryPhoto"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>
              </div>

              {/* STUDENT INFORMATION */}

              <div className="visitorEnquiry__studentCard">
                <div
                  className="visitorEnquiry__studentHeader"
                  onClick={() => setShowStudentInfo(!showStudentInfo)}
                >
                  <span>STUDENT INFORMATION</span>

                  {showStudentInfo ? <FaChevronUp /> : <FaChevronDown />}
                </div>

                {showStudentInfo && (
                  <div className="visitorEnquiry__studentContent">
                    {/* RADIO */}

                    <div className="visitorEnquiry__radioGroup">
                      <label>
                        <input
                          type="radio"
                          checked={visitorType === "self"}
                          onChange={() => setVisitorType("self")}
                        />
                        Self
                      </label>

                      <label>
                        <input
                          type="radio"
                          checked={visitorType === "student"}
                          onChange={() => setVisitorType("student")}
                        />
                        Student
                      </label>

                      <label>
                        <input
                          type="radio"
                          checked={visitorType === "staff"}
                          onChange={() => setVisitorType("staff")}
                        />
                        Staff
                      </label>
                    </div>

                    {/* STUDENT */}

                    {visitorType === "student" && (
                      <div className="visitorEnquiry__infoGrid">
                        <div className="visitorEnquiry__field">
                          <label>Student Name</label>

                          <input
                            value={formData.studentName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                studentName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="visitorEnquiry__field">
                          <label>Gender</label>

                          <select>
                            <option>Male</option>

                            <option>Female</option>
                          </select>
                        </div>

                        <div className="visitorEnquiry__field">
                          <label>Class</label>

                          <input
                            value={formData.className}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                className: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* STAFF */}

                    {visitorType === "staff" && (
                      <div className="visitorEnquiry__infoGrid">
                        <div className="visitorEnquiry__field">
                          <label>Staff Name</label>

                          <input
                            value={formData.staffName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                staffName: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="visitorEnquiry__field">
                          <label>Department</label>

                          <input
                            value={formData.department}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                department: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="visitorEnquiry__field">
                          <label>Designation</label>

                          <input
                            value={formData.designation}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                designation: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}

            <div className="visitorEnquiry__modalFooter">
              <button
                className="visitorEnquiry__cancelBtn"
                onClick={handleCloseModal}
              >
                Cancel
              </button>

              <button className="visitorEnquiry__saveBtn">
                {modalMode === "add" ? "Add Visitor" : "Update Visitor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisitorEnquiry;
