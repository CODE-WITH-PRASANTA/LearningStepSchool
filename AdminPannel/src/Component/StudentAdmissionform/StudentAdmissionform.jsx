import React, { useState } from "react";
import "./StudentAdmissionform.css";
import {
  FiUpload,
  FiDownload,
  FiPlus,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const StudentAdmissionForm = () => {
  const [showSibling, setShowSibling] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="admStudentForm__container">
      {/* Header */}
      <div className="admStudentForm__header">
        <h2 className="admStudentForm__title">Student Admission</h2>

        <div className="admStudentForm__headerActions">
          <button className="admStudentForm__btn admStudentForm__btnSecondary">
            <FiDownload /> Download Form
          </button>

          <button className="admStudentForm__btn admStudentForm__btnPrimary">
            <FiUpload /> Import Student
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="admStudentForm__card">
        <div
          className="admStudentForm__cardHeader"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3>Student Details</h3>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>

        {isOpen && (
          <div className="admStudentForm__body">
            <div className="admStudentForm__grid">
              <Input label="Admission No *" />
              <Select label="Class *" />
              <Select label="Section *" />

              <Input label="Roll Number" />
              <Input label="Biometric Id" />
              <Input label="Admission Date" type="date" />

              <Input label="First Name *" />
              <Input label="Last Name" />
              <Select label="Gender *" />

              <Input label="Date of Birth *" type="date" />
              <Select label="Category" />
              <Input label="Religion" />

              <Input label="Caste" />
              <Input label="Mobile Number" />
              <Input label="Email" />

              <Select label="Blood Group" />
              <Select label="House" />
              <Select label="Sponsor" />

              <Input label="Height" />
              <Input label="Weight" />
              <Input label="Aadhar Number" />

              {/* Final Row */}
              <Input label="Admitted Class" />
              <Input label="As on Date" type="date" />

              <div className="admStudentForm__group">
                <label>Referral By</label>
                <div className="admStudentForm__referralWrapper">
                  <button className="admStudentForm__referralSelect">
                    Select ▾
                  </button>
                  <input
                    type="text"
                    className="admStudentForm__referralInput"
                  />
                </div>
              </div>

              {/* Photo */}
              <div className="admStudentForm__photoWrapper">
                <label>Student Photo</label>
                <div
                  className="admStudentForm__photoBox"
                  onClick={() => setShowPhotoModal(true)}
                >
                  No Image
                </div>
              </div>
            </div>

            {/* Add Sibling */}
            <div className="admStudentForm__bottomRow">
              <button
                className="admStudentForm__btn admStudentForm__btnPrimary"
                onClick={() => setShowSibling(true)}
              >
                <FiPlus /> Add Sibling
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sibling Modal */}
      {showSibling && (
        <div className="admStudentForm__modalOverlay">
          <div className="admStudentForm__modal">
            <div className="admStudentForm__modalHeader">
              <h3>Sibling</h3>
              <FiX onClick={() => setShowSibling(false)} />
            </div>
            <div className="admStudentForm__modalBody">
              <Select label="Class" />
              <Select label="Section" />
              <Select label="Student" />
            </div>
            <div className="admStudentForm__modalFooter">
              <button className="admStudentForm__btn admStudentForm__btnPrimary">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="admStudentForm__modalOverlay">
          <div className="admStudentForm__modal">
            <div className="admStudentForm__modalHeader">
              <h3>Student Photo Upload</h3>
              <FiX onClick={() => setShowPhotoModal(false)} />
            </div>
            <div className="admStudentForm__modalBody admStudentForm__modalCenter">
              <div className="admStudentForm__photoPreview">
                No Image Available
              </div>
              <p>Upload or take photo and crop properly.</p>
            </div>
            <div className="admStudentForm__modalFooter">
              <button className="admStudentForm__btn admStudentForm__btnSecondary">
                Use Camera
              </button>
              <button className="admStudentForm__btn admStudentForm__btnPrimary">
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, type = "text" }) => (
  <div className="admStudentForm__group">
    <label>{label}</label>
    <input type={type} className="admStudentForm__input" />
  </div>
);

const Select = ({ label }) => (
  <div className="admStudentForm__group">
    <label>{label}</label>
    <select className="admStudentForm__select">
      <option>Select</option>
    </select>
  </div>
);

export default StudentAdmissionForm;