import React, { useEffect, useRef, useState } from "react";
import "./StudentDetails.css";
import { FaIdCard, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({
  id,
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  openSelect,
  setOpenSelect,
}) => {
  const isOpen = openSelect === id;
  const wrapRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        if (isOpen) setOpenSelect(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [isOpen, setOpenSelect]);

  const toggle = () => {
    setOpenSelect(isOpen ? null : id);
  };

  const handlePick = (opt) => {
    onChange(opt);
    setOpenSelect(null);
  };

  return (
    <div className="sd-input-field">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>

      <div
        className={`sd-select-wrap ${isOpen ? "is-open" : ""}`}
        ref={wrapRef}
      >
        <button
          type="button"
          className={`sd-select-btn ${isOpen ? "open" : ""}`}
          onClick={toggle}
        >
          <span className={`sd-select-text ${!value ? "placeholder" : ""}`}>
            {value || placeholder}
          </span>
          <ChevronDown size={18} className={`sd-select-icon ${isOpen ? "rot" : ""}`} />
        </button>

        {isOpen && (
          <div className="sd-select-menu">
            <button
              type="button"
              className={`sd-select-item placeholder-item ${value === "" ? "active" : ""}`}
              onClick={() => handlePick("")}
            >
              {placeholder}
            </button>

            {options.map((opt) => (
              <button
                type="button"
                key={opt}
                className={`sd-select-item ${value === opt ? "active" : ""}`}
                onClick={() => handlePick(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StudentDetails = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [keyword, setKeyword] = useState("");

  // ✅ Only ONE dropdown can be open
  const [openSelect, setOpenSelect] = useState(null);

  return (
    <div className="sd-container">
      <div className="sd-header">
        <div className="sd-title">
          <FaIdCard className="sd-icon-main" />
          <h2>Student Details</h2>
        </div>

        <div className="sd-breadcrumbs">
          <span>Student Information</span> /{" "}
          <span className="active">Student Details</span>
        </div>
      </div>

      <div className="sd-card">
        <div className="sd-card-header">
          <FaSearch />
          <h3>Select Criteria</h3>
        </div>

        <div className="sd-card-body">
          <div className="sd-form-grid">
            <CustomSelect
              id="class"
              label="Class"
              required
              value={selectedClass}
              onChange={setSelectedClass}
              placeholder="Select Class"
              options={["Class 1", "Class 2", "Class 3"]}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
            />

            <CustomSelect
              id="section"
              label="Section"
              value={selectedSection}
              onChange={setSelectedSection}
              placeholder="Select Section"
              options={["A", "B", "C"]}
              openSelect={openSelect}
              setOpenSelect={setOpenSelect}
            />

            <div className="sd-input-field">
              <label>Search by Keyword</label>
              <input
                type="text"
                placeholder="Admission No / Student Name"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="sd-btn-wrapper">
              <Link to="/student/Link" className="sd-btn-search">
                <FaSearch /> Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;