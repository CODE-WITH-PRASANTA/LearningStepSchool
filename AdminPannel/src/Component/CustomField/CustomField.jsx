import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import "./CustomField.css";

const CustomField = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="admCustomField__container">
      {/* Header */}
      <div
        className="admCustomField__header"
        onClick={() => setOpen(!open)}
      >
        <h3>Custom Field</h3>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* Body */}
      {open && (
        <div className="admCustomField__body">
          <div className="admCustomField__grid">
            
            {/* PEN */}
            <div className="admCustomField__group admCustomField__full">
              <label>PEN</label>
              <input
                type="text"
                className="admCustomField__input"
              />
            </div>

            {/* SR NO */}
            <div className="admCustomField__group admCustomField__full">
              <label>SR NO</label>
              <input
                type="text"
                className="admCustomField__input"
              />
            </div>

            {/* APAAR ID */}
            <div className="admCustomField__group">
              <label>APAAR ID</label>
              <input
                type="text"
                className="admCustomField__input"
              />
            </div>

            {/* Students Behaviour */}
            <div className="admCustomField__group admCustomField__full">
              <label>Students Behaviour</label>
              <div className="admCustomField__checkboxRow">
                <label>
                  <input type="checkbox" /> good
                </label>
                <label>
                  <input type="checkbox" /> avg
                </label>
                <label>
                  <input type="checkbox" /> bad
                </label>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CustomField;