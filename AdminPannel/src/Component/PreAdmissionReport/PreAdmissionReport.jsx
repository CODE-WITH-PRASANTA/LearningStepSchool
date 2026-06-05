import React, { useState } from "react";
import "./PreAdmissionReport.css";

import {
  FaPlus,
  FaTrash,
  FaPrint,
  FaClipboardList,
  FaTimes,
  FaSearch
} from "react-icons/fa";

const PreAdmissionReport = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);

  const [students] = useState([
    {
      id: 1,
      name: "demo",
      contact: "9986836225",
      email: "",
      father: "",
      feedback: 0
    },
    {
      id: 2,
      name: "jkmh",
      contact: "4666544234",
      email: "",
      father: "",
      feedback: 0
    }
  ]);

  return (
    <div className="pre-container">
      <div className="page-header">
        <h2>Pre Admission</h2>
      </div>

      <div className="table-card">
        <div className="table-top">

          <div className="search-box">
            <FaSearch />
            <input type="text" placeholder="Search..." />
          </div>

          <button
            className="add-btn"
            onClick={() => setOpenForm(true)}
          >
            <FaPlus />
          </button>

        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>S.NO.</th>
                <th>PHOTO</th>
                <th>NAME</th>
                <th>CONTACT NO</th>
                <th>EMAIL</th>
                <th>FATHER NAME</th>
                <th>FEEDBACK</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {students.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                      alt=""
                      className="student-img"
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>{item.contact}</td>
                  <td>{item.email || "null"}</td>
                  <td>{item.father || "null"}</td>

                  <td>
                    <span>{item.feedback}</span>

                    <button
                      className="feedback-btn"
                      onClick={() => setOpenFeedback(true)}
                    >
                      <FaClipboardList />
                    </button>
                  </td>

                  <td>
                    <button className="icon delete">
                      <FaTrash />
                    </button>

                    <button className="icon print">
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Items per page :</span>

          <select>
            <option>5</option>
            <option>10</option>
            <option>20</option>
            <option selected>30</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>

      {/* ADD FORM */}

      <div className={`modal ${openForm ? "show" : ""}`}>
        <div className="modal-content large">

          <button
            className="close-btn"
            onClick={() => setOpenForm(false)}
          >
            <FaTimes />
          </button>

          <h2>PRE ADMISSION</h2>

          <div className="form-wrapper">

            <div className="upload-section">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                alt=""
              />

              <button className="upload-btn">
                Upload
              </button>
            </div>

            <div className="form-grid">

              <input placeholder="First Name *" />
              <input placeholder="Last Name" />

              <select>
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <input type="date" />

              <input placeholder="Contact No *" />
              <input placeholder="Email" />

              <select>
                <option>Class</option>
              </select>

              <input placeholder="Father Name" />

              <input placeholder="Father Occupation" />
              <input placeholder="Mother Name" />

              <input placeholder="Mother Occupation" />
              <input placeholder="Father Address" />

              <input placeholder="Previous School Name" />
              <input placeholder="Remark" />

            </div>

          </div>

          <div className="submit-area">
            <button className="save-btn">
              Add
            </button>
          </div>

        </div>
      </div>

      {/* FEEDBACK */}

      <div className={`modal ${openFeedback ? "show" : ""}`}>
        <div className="modal-content feedback-modal">

          <button
            className="close-btn"
            onClick={() => setOpenFeedback(false)}
          >
            <FaTimes />
          </button>

          <h2>ADD FEEDBACK</h2>

          <div className="feedback-row">
            <input type="date" />
            <input placeholder="Description *" />

            <button className="save-btn">
              Add
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default PreAdmissionReport;