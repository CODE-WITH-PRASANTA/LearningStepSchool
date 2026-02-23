import React from "react";
import "./UpdateQuestion.css";

const UpdateQuestion = () => {
  return (
    <div className="container">
      <div className="card">

        {/* Header */}
        <div className="header">
          <span>📝</span>
          <h2>Add / Update Question</h2>
        </div>

        {/* Form Body */}
        <div className="formBody">
          <div className="grid">

            {/* Row 1 */}
            <div className="formGroup">
              <label className="label">
                Class <span className="required">*</span>
              </label>
              <select className="select">
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

            <div className="formGroup">
              <label className="label">
                Section <span className="required">*</span>
              </label>
              <select className="select">
                <option>Select Section</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="label">
                Subject <span className="required">*</span>
              </label>
              <select className="select">
                <option>Select Subject</option>
                <option>English</option>
                <option>Math</option>
                <option>Science</option>
                <option>Social Science</option>
                <option>Computer</option>
                <option>Hindi</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="label">
                Lesson <span className="required">*</span>
              </label>
              <select className="select">
                <option>Select Lesson</option>
                <option>Lesson 1</option>
                <option>Lesson 2</option>
                <option>Lesson 3</option>
                <option>Lesson 4</option>
              </select>
            </div>

            {/* Row 2 */}
            <div className="formGroup">
              <label className="label">Session</label>
              <select className="select">
                <option>2024-25</option>
                <option>2025-26</option>
                <option>2026-27</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="label">Type</label>
              <select className="select">
                <option>Long Descriptive</option>
                <option>Short Answer</option>
                <option>MCQ</option>
                <option>Fill in the Blanks</option>
                <option>True / False</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="label">Level</label>
              <select className="select">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="formGroup">
              <label className="label">
                Marks <span className="required">*</span>
              </label>
              <input type="text" className="input" placeholder="Marks" />
            </div>
          </div>

          {/* Question Editor */}
          <div className="questionSection">
            <label className="label">Question</label>

            <div className="editorWrapper">

              {/* Toolbar */}
              <div className="toolbar">
                <div className="toolGroup">
                  <button className="toolBtn">Source</button>
                  <button className="toolBtn">💾</button>
                  <button className="toolBtn">📄</button>
                </div>

                <div className="toolGroup">
                  <button className="toolBtn"><b>B</b></button>
                  <button className="toolBtn"><i>I</i></button>
                  <button className="toolBtn"><u>U</u></button>
                </div>

                <div className="toolGroup">
                  <button className="toolBtn">Styles</button>
                  <button className="toolBtn">Format</button>
                  <button className="toolBtn">Font</button>
                  <button className="toolBtn">Size</button>
                </div>
              </div>

              {/* Editable Text Box */}
              <div className="editorArea" contentEditable="true"></div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdateQuestion;