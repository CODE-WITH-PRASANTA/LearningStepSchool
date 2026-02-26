import React from "react";
import "./UpdateQuestion.css";

const UpdateQuestion = () => {
  return (
    <div className="uq-container">
      <div className="uq-card">

        {/* Header */}
        <div className="uq-header">
          <span>📝</span>
          <h2>Add / Update Question</h2>
        </div>

        {/* Form Body */}
        <div className="uq-formBody">
          <div className="uq-grid">

            {/* Row 1 */}
            <div className="uq-formGroup">
              <label className="uq-label">
                Class <span className="uq-required">*</span>
              </label>
              <select className="uq-select">
                <option>Select Class</option>
                <option>Nursery</option>
                <option>KG</option>
                <option>Class 1</option>
                <option>Class 2</option>
                <option>Class 3</option>
                <option>Class 4</option>
                <option>Class 5</option>
                <option>Class 6</option>
                <option>Class 7</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
              </select>
            </div>

            <div className="uq-formGroup">
              <label className="uq-label">
                Section <span className="uq-required">*</span>
              </label>
              <select className="uq-select">
                <option>Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>

            <div className="uq-formGroup">
              <label className="uq-label">
                Subject <span className="uq-required">*</span>
              </label>
              <select className="uq-select">
                <option>Select Subject</option>
                <option>English</option>
                <option>Math</option>
                <option>Science</option>
                <option>Social Science</option>
                <option>Computer</option>
                <option>Hindi</option>
              </select>
            </div>

            <div className="uq-formGroup">
              <label className="uq-label">
                Lesson <span className="uq-required">*</span>
              </label>
              <select className="uq-select">
                <option>Select Lesson</option>
                <option>Lesson 1</option>
                <option>Lesson 2</option>
                <option>Lesson 3</option>
                <option>Lesson 4</option>
              </select>
            </div>

            {/* Row 2 */}
            <div className="uq-formGroup">
              <label className="uq-label">Session</label>
              <select className="uq-select">
                <option>2024-25</option>
                <option>2025-26</option>
                <option>2026-27</option>
              </select>
            </div>

            <div className="uq-formGroup">
              <label className="uq-label">Type</label>
              <select className="uq-select">
                <option>Long Descriptive</option>
                <option>Short Answer</option>
                <option>MCQ</option>
                <option>Fill in the Blanks</option>
                <option>True / False</option>
              </select>
            </div>

            <div className="uq-formGroup">
              <label className="uq-label">Level</label>
              <select className="uq-select">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="uq-formGroup">
              <label className="uq-label">
                Marks <span className="uq-required">*</span>
              </label>
              <input type="text" className="uq-input" placeholder="Marks" />
            </div>
          </div>

          {/* Question Editor */}
          <div className="uq-questionSection">
            <label className="uq-label">Question</label>

            <div className="uq-editorWrapper">

              <div className="uq-toolbar">
                <div className="uq-toolGroup">
                  <button className="uq-toolBtn">Source</button>
                  <button className="uq-toolBtn">💾</button>
                  <button className="uq-toolBtn">📄</button>
                </div>

                <div className="uq-toolGroup">
                  <button className="uq-toolBtn"><b>B</b></button>
                  <button className="uq-toolBtn"><i>I</i></button>
                  <button className="uq-toolBtn"><u>U</u></button>
                </div>
              </div>

              <div className="uq-editorArea" contentEditable="true"></div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdateQuestion;