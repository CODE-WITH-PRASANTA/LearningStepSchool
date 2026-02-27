import React, { useState } from "react";
import "./QustionBank.css";

const QustionBank = () => {
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [page, setPage] = useState(1);

  /* ================= DROPDOWN DATA ================= */

  const classes = ["Class 6", "Class 7", "Class 8", "Class 9"];
  const sections = ["A", "B", "C", "D"];
  const subjects = ["Biology", "Chemistry", "Physics"];
  const lessons = ["Lesson 1", "Lesson 2", "Lesson 3"];

  /* ================= TABLE DATA ================= */

  const tableData = [
    { id: 1, class: 9, section: "D", subject: "Biology", question: "no of bones in adult body", type: "mcq", created: "Super", answer: "opt_d" },
    { id: 2, class: 9, section: "D", subject: "Chemistry", question: "mass of carbon", type: "mcq", created: "Super", answer: "opt_c" },
    { id: 3, class: 9, section: "D", subject: "Chemistry", question: "examples of vertebrate", type: "mcq", created: "Super", answer: "opt_e" },
    { id: 4, class: 9, section: "D", subject: "Chemistry", question: "no of bones in adult body", type: "mcq", created: "Super", answer: "opt_d" },
    { id: 5, class: 9, section: "D", subject: "Chemistry", question: "examples of vertebrate", type: "mcq", created: "Super", answer: "opt_e" },
    { id: 6, class: 9, section: "D", subject: "Physics", question: "gravity value", type: "mcq", created: "Super", answer: "opt_a" },
    { id: 7, class: 9, section: "D", subject: "Physics", question: "speed formula", type: "mcq", created: "Super", answer: "opt_b" },
    { id: 8, class: 9, section: "D", subject: "Biology", question: "cell unit", type: "mcq", created: "Super", answer: "opt_a" }
  ];

  /* ================= PAGINATION ================= */

  const perPage = 7;
  const totalPages = Math.ceil(tableData.length / perPage);
  const paginatedData = tableData.slice((page - 1) * perPage, page * perPage);
 
  const classOptions = ["Class 6","Class 7","Class 8","Class 9","Class 10"];
const sectionOptions = ["A","B","C","D"];
const subjectOptions = ["Biology","Chemistry","Physics","Math"];
const lessonOptions = ["Lesson 1","Lesson 2","Lesson 3","Lesson 4"];

  return (
    <div className="questionBankAdmin-wrapper">

      {/* ================= SELECT CRITERIA ================= */}
      
<div className="questionBankAdmin-card">
  <div className="questionBankAdmin-cardHeader">
    <h3>Select Criteria</h3>

    <div className="questionBankAdmin-headerActions">
      <button
        onClick={() => setShowImportPopup(true)}
        className="questionBankAdmin-btnPrimary"
      >
        Import Questions
      </button>
      <button className="questionBankAdmin-btnPrimary">Add Question</button>
    </div>
  </div>

  {/* FILTER GRID WITH LABELS */}
  <div className="questionBankAdmin-filterGrid">

    <div className="questionBankAdmin-field">
      <label>Search by Keyword</label>
      <input placeholder="Enter Keyword" className="questionBankAdmin-input" />
    </div>

    <div className="questionBankAdmin-field">
      <label>Question</label>
      <select className="questionBankAdmin-input">
        <option>Select Question</option>
        <option>MCQ</option>
        <option>Descriptive</option>
      </select>
    </div>

    <div className="questionBankAdmin-field">
      <label>Class</label>
      <select className="questionBankAdmin-input">
        <option>Select Class</option>
        {classes.map(c => <option key={c}>{c}</option>)}
      </select>
    </div>

    <div className="questionBankAdmin-field">
      <label>Section</label>
      <select className="questionBankAdmin-input">
        <option>Select Section</option>
        {sections.map(s => <option key={s}>{s}</option>)}
      </select>
    </div>

    <div className="questionBankAdmin-field">
      <label>Subject</label>
      <select className="questionBankAdmin-input">
        <option>Select Subject</option>
        {subjects.map(s => <option key={s}>{s}</option>)}
      </select>
    </div>

    <div className="questionBankAdmin-field">
      <label>Lesson</label>
      <select className="questionBankAdmin-input">
        <option>Select Lesson</option>
        {lessons.map(l => <option key={l}>{l}</option>)}
      </select>
    </div>
  </div>

  <div className="questionBankAdmin-searchRow">
    <button className="questionBankAdmin-btnPrimary">Search</button>
  </div>
</div>
      {/* ================= TABLE ================= */}
      <div className="questionBankAdmin-card">
        <div className="questionBankAdmin-cardHeader">
          <h3>Question Bank List</h3>
          <button className="questionBankAdmin-btnDanger">Bulk Delete</button>
        </div>

        <div className="questionBankAdmin-tableWrapper">
          <table className="questionBankAdmin-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Section</th>
                <th>Subject</th>
                <th>Questions</th>
                <th>Type</th>
                <th>Created</th>
                <th>Answer</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map(row => (
                <tr key={row.id}>
                  <td>{row.class}</td>
                  <td>{row.section}</td>
                  <td>{row.subject}</td>
                  <td>{row.question}</td>
                  <td>{row.type}</td>
                  <td>{row.created}</td>
                  <td>{row.answer}</td>
                  <td>
                    <button className="questionBankAdmin-btnAction">Action</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="questionBankAdmin-pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`questionBankAdmin-pageBtn ${page === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ================= IMPORT POPUP ================= */}
     {/* ================= IMPORT POPUP ================= */}
{showImportPopup && (
  <div className="qbPopup-overlay">

    <div className="qbPopup-wrapper">

      {/* ================= HEADER ================= */}
      <div className="qbPopup-topHeader">
        <h3>Question Info</h3>

        <div className="qbPopup-headerActions">
          <button className="qb-btnPrimary">Download Sample Import File (CSV)</button>
          <button className="qb-btnPrimary">Download Sample Import File (DOC)</button>
          <button className="qbPopup-close" onClick={() => setShowImportPopup(false)}>✕</button>
        </div>
      </div>

      {/* ================= CONTAINER 1 → INFO ================= */}
      <div className="qbPopup-infoCard">
        <ol>
          <li>Your CSV data should be in the format below. The first line should be headers.</li>
          <li>In question type column should be define mcq/descriptive.</li>
          <li>Please put opt_a/opt_b/opt_c/opt_d/opt_e in correct column.</li>
          <li>Note: Please use only text or images.</li>
        </ol>
      </div>

      {/* ================= CONTAINER 2 → FORM ================= */}
      <div className="qbPopup-formCard">

  <div className="qbPopup-grid">

    {/* CLASS */}
    <div className="qb-field">
      <label>Class *</label>
      <select className="qb-input">
        <option value="">Select</option>
        {classOptions.map((item,i)=>(
          <option key={i} value={item}>{item}</option>
        ))}
      </select>
    </div>

    {/* SECTION */}
    <div className="qb-field">
      <label>Section *</label>
      <select className="qb-input">
        <option value="">Select</option>
        {sectionOptions.map((item,i)=>(
          <option key={i} value={item}>{item}</option>
        ))}
      </select>
    </div>

    {/* SUBJECT */}
    <div className="qb-field">
      <label>Subject *</label>
      <select className="qb-input">
        <option value="">Select</option>
        {subjectOptions.map((item,i)=>(
          <option key={i} value={item}>{item}</option>
        ))}
      </select>
    </div>

    {/* LESSON */}
    <div className="qb-field">
      <label>Lesson</label>
      <select className="qb-input">
        <option value="">Select Lesson</option>
        {lessonOptions.map((item,i)=>(
          <option key={i} value={item}>{item}</option>
        ))}
      </select>
    </div>

    {/* FILE */}
    <div className="qb-field qb-full">
      <label>Select Excel File *</label>
      <input type="file" className="qb-input"/>
    </div>

  </div>

  <div className="qbPopup-actions">
    <button className="qb-btnPrimary">Import Questions</button>
  </div>

</div>

    </div>
  </div>
)}
    </div>
  );
};

export default QustionBank;