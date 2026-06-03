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
} from "react-icons/fa";

import "./PreAdmission.css";

const defaultPhoto =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const initialData = [
  {
    id: 1,
    firstName: "Demo",
    lastName: "Student",
    gender: "Male",
    dob: "2026-05-21",
    contactNo: "9986836225",
    email: "demo@gmail.com",
    fatherName: "Rajesh Kumar",
    motherName: "Sita Devi",
    className: "Class 5",
    fatherOccupation: "Business",
    motherOccupation: "Teacher",
    fatherAddress: "Bhubaneswar",
    previousSchool: "ABC School",
    remark: "Interested for admission",
    photo: defaultPhoto,
  },
];

const PreAdmission = () => {


const navigate = useNavigate();

  const [studentData, setStudentData] =
    useState(initialData);

  const [searchTerm, setSearchTerm] =
    useState("");

    const [currentPage, setCurrentPage] =
  useState(1);

const [itemsPerPage, setItemsPerPage] =
  useState(10);

  const [openModal, setOpenModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [studentPhoto, setStudentPhoto] =
    useState(defaultPhoto);

    const [isClosing, setIsClosing] =
  useState(false);

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      contactNo: "",
      email: "",
      fatherName: "",
      motherName: "",
      className: "",
      fatherOccupation: "",
      motherOccupation: "",
      fatherAddress: "",
      previousSchool: "",
      remark: "",
    });

  /* ==========================
      PHOTO UPLOAD
  ========================== */

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setStudentPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* ==========================
      ADD MODAL
  ========================== */

  const handleAddStudent = () => {
    setModalMode("add");

    setSelectedStudent(null);

    setStudentPhoto(defaultPhoto);

    setFormData({
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      contactNo: "",
      email: "",
      fatherName: "",
      motherName: "",
      className: "",
      fatherOccupation: "",
      motherOccupation: "",
      fatherAddress: "",
      previousSchool: "",
      remark: "",
    });

    setOpenModal(true);
  };

  /* ==========================
      EDIT MODAL
  ========================== */

  const handleEditStudent = (
    student
  ) => {
    setSelectedStudent(student);

    setModalMode("edit");

    setStudentPhoto(
      student.photo || defaultPhoto
    );

    setFormData({
      firstName:
        student.firstName || "",
      lastName:
        student.lastName || "",
      gender:
        student.gender || "",
      dob: student.dob || "",
      contactNo:
        student.contactNo || "",
      email:
        student.email || "",
      fatherName:
        student.fatherName || "",
      motherName:
        student.motherName || "",
      className:
        student.className || "",
      fatherOccupation:
        student.fatherOccupation || "",
      motherOccupation:
        student.motherOccupation || "",
      fatherAddress:
        student.fatherAddress || "",
      previousSchool:
        student.previousSchool || "",
      remark:
        student.remark || "",
    });

    setOpenModal(true);
  };

  /* ==========================
      DELETE
  ========================== */

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Student?",
      text: "This record will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        setStudentData((prev) =>
          prev.filter(
            (item) => item.id !== id
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

  /* ==========================
   SAVE / UPDATE
========================== */

const handleSaveStudent = () => {
  if (!formData.firstName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "First Name Required",
    });
    return;
  }

  if (!formData.contactNo.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Contact Number Required",
    });
    return;
  }

  if (modalMode === "add") {
    const newStudent = {
      id: Date.now(),

      ...formData,

      photo: studentPhoto,
    };

    setStudentData((prev) => [
      ...prev,
      newStudent,
    ]);

    Swal.fire({
      icon: "success",
      title: "Student Added Successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    setStudentData((prev) =>
      prev.map((item) =>
        item.id === selectedStudent.id
          ? {
              ...item,
              ...formData,
              photo: studentPhoto,
            }
          : item
      )
    );

    Swal.fire({
      icon: "success",
      title: "Student Updated Successfully",
      timer: 1500,
      showConfirmButton: false,
    });
  }


};


    const handleCloseModal = () => {
  setIsClosing(true);

  setTimeout(() => {
    setOpenModal(false);
    setIsClosing(false);
  }, 300);
};


  /* ==========================
      FILTER
  ========================== */

const filteredData =
  studentData.filter((item) =>
    `${item.firstName} ${item.lastName}`
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )
  );

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const currentItems =
  filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

const totalPages = Math.ceil(
  filteredData.length /
    itemsPerPage
);

 

  return (
    <div className="PreAdmission">

      <div className="PreAdmission__card">

        {/* HEADER */}

        <div className="PreAdmission__header">

          <div className="PreAdmission__searchBox">

            <FaSearch />

            <input
              type="text"
              placeholder="Search Student..."
              className="PreAdmission__searchInput"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <button
            className="PreAdmission__addBtn"
            onClick={
              handleAddStudent
            }
          >
            <FaPlus />
          </button>

        </div>

        {/* TABLE */}

        <div className="PreAdmission__tableWrapper">

          <table className="PreAdmission__table">

            <thead>

              <tr>
                <th>S.NO.</th>
                <th>PHOTO</th>
                <th>NAME</th>
                <th>CONTACT NO</th>
                <th>EMAIL</th>
                <th>FATHER NAME</th>
                <th>ACTION</th>
              </tr>

            </thead>

            <tbody>

              {
             currentItems.map(
                (item, index) => (
                  <tr
                    key={item.id}
                    className="PreAdmission__tableRow"
                    onClick={() =>
                      handleEditStudent(
                        item
                      )
                    }
                  >
                    <td>
                      {index + 1}
                    </td>

                    <td>
                      <img
                        src={
                          item.photo
                        }
                        alt=""
                        className="PreAdmission__avatar"
                      />
                    </td>

                    <td>
                      {
                        item.firstName
                      }{" "}
                      {
                        item.lastName
                      }
                    </td>

                    <td>
                      {
                        item.contactNo
                      }
                    </td>

                    <td>
                      {item.email}
                    </td>

                    <td>
                      {
                        item.fatherName
                      }
                    </td>

                    <td>

                      <div className="PreAdmission__actions">

                        <button
                          className="PreAdmission__deleteBtn"
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

<button
  className="PreAdmission__printBtn"
  onClick={(e) => {
    e.stopPropagation();

    navigate(
      `/preadmission-pdf/${item.id}`,
      {
        state: item,
      }
    );
  }}
>
  <FaPrint />
</button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* MOBILE CARDS */}

        <div className="PreAdmission__mobileCards">

          {
        currentItems.map(
            (item) => (
              <div
                key={item.id}
                className="PreAdmission__mobileCard"
                onClick={() =>
                  handleEditStudent(
                    item
                  )
                }
              >
                <div className="PreAdmission__mobileTop">

                  <img
                    src={item.photo}
                    alt=""
                    className="PreAdmission__mobileAvatar"
                  />

                  <div>
                    <h4>
                      {
                        item.firstName
                      }{" "}
                      {
                        item.lastName
                      }
                    </h4>

                    <p>
                      {
                        item.contactNo
                      }
                    </p>
                  </div>

                </div>
              </div>
            )
          )}

        </div>


        <div className="PreAdmission__pagination">

  <div className="PreAdmission__pageSize">

    <span>Items per page</span>

    <select
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(
          Number(e.target.value)
        );

        setCurrentPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>

  </div>

  <div className="PreAdmission__pageInfo">
    {filteredData.length === 0
      ? "0 - 0"
      : `${indexOfFirstItem + 1} - ${
          Math.min(
            indexOfLastItem,
            filteredData.length
          )
        } of ${
          filteredData.length
        }`}
  </div>

  <div className="PreAdmission__pageBtns">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage(
          currentPage - 1
        )
      }
    >
      <FaChevronLeft />
    </button>

    <button
      disabled={
        currentPage === totalPages ||
        totalPages === 0
      }
      onClick={() =>
        setCurrentPage(
          currentPage + 1
        )
      }
    >
      <FaChevronRight />
    </button>

  </div>

</div>

        {/* =====================================
    ADD / MODIFY MODAL
===================================== */}

{openModal && (
  <div
  className={`PreAdmission__modal ${
    isClosing
      ? "PreAdmission__modalClosing"
      : "PreAdmission__modalOpening"
  }`}
>

    <div
      className="PreAdmission__overlay"
     onClick={handleCloseModal}
    />

    <div className="PreAdmission__modalContainer">

      {/* HEADER */}

      <div className="PreAdmission__modalHeader">

        <h2>
          {modalMode === "add"
            ? "PRE ADMISSION"
            : "MODIFY PRE ADMISSION"}
        </h2>

        <button
          className="PreAdmission__closeBtn"
          onClick={handleCloseModal}
        >
          ×
        </button>

      </div>

      {/* BODY */}

      <div className="PreAdmission__modalBody">

        {/* PHOTO */}

        <div className="PreAdmission__photoSection">

          <img
            src={studentPhoto}
            alt=""
            className="PreAdmission__photo"
          />

          <label
            htmlFor="studentPhoto"
            className="PreAdmission__uploadBtn"
          >
            Upload
          </label>

          <input
            id="studentPhoto"
            type="file"
            hidden
            accept="image/*"
            onChange={
              handlePhotoUpload
            }
          />

        </div>

        {/* FORM */}

        <div className="PreAdmission__formGrid">

          {/* FIRST NAME */}

          <div className="PreAdmission__field">

            <label>
              First Name *
            </label>

            <input
              value={
                formData.firstName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName:
                    e.target.value,
                })
              }
            />

          </div>

          {/* LAST NAME */}

          <div className="PreAdmission__field">

            <label>
              Last Name
            </label>

            <input
              value={
                formData.lastName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName:
                    e.target.value,
                })
              }
            />

          </div>

          {/* GENDER */}

          <div className="PreAdmission__field">

            <label>
              Gender *
            </label>

            <select
              value={
                formData.gender
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

          </div>

          {/* DOB */}

          <div className="PreAdmission__field">

            <label>
              Date Of Birth *
            </label>

            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dob:
                    e.target.value,
                })
              }
            />

          </div>

          {/* CONTACT */}

          <div className="PreAdmission__field">

            <label>
              Contact No *
            </label>

            <input
              value={
                formData.contactNo
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contactNo:
                    e.target.value,
                })
              }
            />

          </div>

          {/* EMAIL */}

          <div className="PreAdmission__field">

            <label>
              Email
            </label>

            <input
              value={
                formData.email
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
            />

          </div>

          {/* CLASS */}

          <div className="PreAdmission__field">

            <label>
              Class
            </label>

            <select
              value={
                formData.className
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  className:
                    e.target.value,
                })
              }
            >
              <option value="">
                Select Class
              </option>

              <option>
                Nursery
              </option>

              <option>
                LKG
              </option>

              <option>
                UKG
              </option>

              <option>
                Class 1
              </option>

              <option>
                Class 2
              </option>

              <option>
                Class 3
              </option>

              <option>
                Class 4
              </option>

              <option>
                Class 5
              </option>

            </select>

          </div>

          {/* FATHER */}

          <div className="PreAdmission__field">

            <label>
              Father Name
            </label>

            <input
              value={
                formData.fatherName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fatherName:
                    e.target.value,
                })
              }
            />

          </div>

          {/* FATHER OCCUPATION */}

          <div className="PreAdmission__field">

            <label>
              Father's Occupation
            </label>

            <input
              value={
                formData.fatherOccupation
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fatherOccupation:
                    e.target.value,
                })
              }
            />

          </div>

          {/* MOTHER */}

          <div className="PreAdmission__field">

            <label>
              Mother Name
            </label>

            <input
              value={
                formData.motherName
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  motherName:
                    e.target.value,
                })
              }
            />

          </div>

          {/* MOTHER OCCUPATION */}

          <div className="PreAdmission__field">

            <label>
              Mother's Occupation
            </label>

            <input
              value={
                formData.motherOccupation
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  motherOccupation:
                    e.target.value,
                })
              }
            />

          </div>

          {/* ADDRESS */}

          <div className="PreAdmission__field">

            <label>
              Father's Address
            </label>

            <input
              value={
                formData.fatherAddress
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fatherAddress:
                    e.target.value,
                })
              }
            />

          </div>

          {/* PREVIOUS SCHOOL */}

          <div className="PreAdmission__field">

            <label>
              Previous School
            </label>

            <input
              value={
                formData.previousSchool
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  previousSchool:
                    e.target.value,
                })
              }
            />

          </div>

          {/* REMARK */}

          <div className="PreAdmission__field PreAdmission__fieldFull">

            <label>
              Remark
            </label>

            <textarea
              rows="4"
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

      <div className="PreAdmission__modalFooter">

        <button
          className="PreAdmission__cancelBtn"
onClick={handleCloseModal}
        >
          Cancel
        </button>

<button
  className="PreAdmission__saveBtn"
  onClick={handleSaveStudent}
>
  {modalMode === "add"
    ? "Add Student"
    : "Update Student"}
</button>

      </div>

    </div>

  </div>
)}

      </div>
    </div>
  );
};

export default PreAdmission;