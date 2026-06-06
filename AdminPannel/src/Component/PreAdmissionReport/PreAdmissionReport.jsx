import React, { useState } from "react";
import "./PreAdmissionReport.css";

import {
  FaPlus,
  FaTrash,
  FaPrint,
  FaClipboardList,
  FaTimes,
  FaSearch,
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
      feedback: 0,
    },
    {
      id: 2,
      name: "jkmh",
      contact: "4666544234",
      email: "",
      father: "",
      feedback: 0,
    },
  ]);

  return (
    <div className="preAdmissionReportContainer">
      <div className="preAdmissionReportPageHeader">
        <h2>Pre Admission</h2>
      </div>

      <div className="preAdmissionReportTableCard">
        <div className="preAdmissionReportTableTop">
          <div className="preAdmissionReportSearchBox">
            <FaSearch />
            <input type="text" placeholder="Search..." />
          </div>

          <button
            className="preAdmissionReportAddBtn"
            onClick={() => setOpenForm(true)}
          >
            <FaPlus />
          </button>
        </div>

        <div className="preAdmissionReportTableWrapper">
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
                      className="preAdmissionReportStudentImg"
                    />
                  </td>

                  <td>{item.name}</td>
                  <td>{item.contact}</td>
                  <td>{item.email || "null"}</td>
                  <td>{item.father || "null"}</td>

                  <td>
                    <span>{item.feedback}</span>

                    <button
                      className="preAdmissionReportFeedbackBtn"
                      onClick={() => setOpenFeedback(true)}
                    >
                      <FaClipboardList />
                    </button>
                  </td>

                  <td>
                    <button
                      className="preAdmissionReportIcon preAdmissionReportDelete"
                    >
                      <FaTrash />
                    </button>

                    <button
                      className="preAdmissionReportIcon preAdmissionReportPrint"
                    >
                      <FaPrint />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="preAdmissionReportPagination">
          <span>Items per page :</span>

          <select defaultValue="30">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* ADD FORM */}

      <div
        className={`preAdmissionReportModal ${
          openForm ? "preAdmissionReportShow" : ""
        }`}
      >
        <div
          className="preAdmissionReportModalContent preAdmissionReportLarge"
        >
          <button
            className="preAdmissionReportCloseBtn"
            onClick={() => setOpenForm(false)}
          >
            <FaTimes />
          </button>

          <h2>PRE ADMISSION</h2>

          <div className="preAdmissionReportFormWrapper">
            <div className="preAdmissionReportUploadSection">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                alt=""
              />

              <button className="preAdmissionReportUploadBtn">
                Upload
              </button>
            </div>

            <div className="preAdmissionReportFormGrid">
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

          <div className="preAdmissionReportSubmitArea">
            <button className="preAdmissionReportSaveBtn">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK */}

      <div
        className={`preAdmissionReportModal ${
          openFeedback ? "preAdmissionReportShow" : ""
        }`}
      >
        <div
          className="preAdmissionReportModalContent preAdmissionReportFeedbackModal"
        >
          <button
            className="preAdmissionReportCloseBtn"
            onClick={() => setOpenFeedback(false)}
          >
            <FaTimes />
          </button>

          <h2>ADD FEEDBACK</h2>

          <div className="preAdmissionReportFeedbackRow">
            <input type="date" />

            <input placeholder="Description *" />

            <button className="preAdmissionReportSaveBtn">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreAdmissionReport;