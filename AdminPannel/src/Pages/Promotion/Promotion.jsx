import React, { useState } from "react";
import "./Promotion.css";

import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
} from "react-icons/fa";

const Promotion = () => {
  const [showModal, setShowModal] = useState(false);

  const [students, setStudents] = useState([
    {
      id: 1,
      roll: "101",
      name: "Rahul Kumar",
      father: "Suresh Kumar",
    },
    {
      id: 2,
      roll: "102",
      name: "Priya Sharma",
      father: "Rakesh Sharma",
    },
    {
      id: 3,
      roll: "103",
      name: "Ankit Das",
      father: "Mohan Das",
    },
    {
      id: 4,
      roll: "104",
      name: "Riya Singh",
      father: "Ajay Singh",
    },
  ]);

  const [promotedStudents, setPromotedStudents] = useState([]);

  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  const [promotionHistory, setPromotionHistory] = useState([]);

  const [session, setSession] = useState("2025-2026");
  const [currentClass, setCurrentClass] = useState("");
  const [currentDivision, setCurrentDivision] = useState("");
  const [promoteClass, setPromoteClass] = useState("");
  const [promoteDivision, setPromoteDivision] = useState("");

  const moveRight = () => {
    const selected = students.filter((s) =>
      selectedLeft.includes(s.id)
    );

    setPromotedStudents([...promotedStudents, ...selected]);

    setStudents(
      students.filter((s) => !selectedLeft.includes(s.id))
    );

    setSelectedLeft([]);
  };

  const moveLeft = () => {
    const selected = promotedStudents.filter((s) =>
      selectedRight.includes(s.id)
    );

    setStudents([...students, ...selected]);

    setPromotedStudents(
      promotedStudents.filter(
        (s) => !selectedRight.includes(s.id)
      )
    );

    setSelectedRight([]);
  };

  const handleAddPromotion = () => {
    if (
      !currentClass ||
      !currentDivision ||
      !promoteClass ||
      !promoteDivision
    ) {
      alert("Please fill all fields");
      return;
    }

    if (promotedStudents.length === 0) {
      alert("Please select students to promote");
      return;
    }

    const newPromotion = {
      id: Date.now(),
      className: `${promoteClass}-${promoteDivision}`,
      studentCount: promotedStudents.length,
    };

    setPromotionHistory([
      ...promotionHistory,
      newPromotion,
    ]);

    setPromotedStudents([]);
    setSelectedLeft([]);
    setSelectedRight([]);

    setShowModal(false);

    alert("Students promoted successfully");
  };

  const classes = [
    "N.C.",
    "L.K.G.",
    "U.K.G.",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
  ];

  const divisions = ["A", "B", "C", "D"];

  return (
    <div className="promotion-page-container">

      <div className="promotion-main-card">

        {/* TOPBAR */}

        <div className="promotion-topbar-section">

          <div className="promotion-search-box">
            <FaSearch className="promotion-search-icon" />

            <input
              type="text"
              placeholder="Search..."
              className="promotion-search-input"
            />
          </div>

          <button
            className="promotion-add-button"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
          </button>

        </div>

        {/* TABLE */}

        <div className="promotion-table-wrapper">

          <table className="promotion-table">

            <thead className="promotion-table-head">
              <tr className="promotion-table-head-row">
                <th className="promotion-table-heading">
                  S.NO.
                </th>

                <th className="promotion-table-heading">
                  CLASS
                </th>

                <th className="promotion-table-heading">
                  NO. OF STUDENTS
                </th>
              </tr>
            </thead>

            <tbody className="promotion-table-body">

              <tr className="promotion-table-body-row">
                <td className="promotion-table-data">
                  1
                </td>

                <td className="promotion-table-data">
                  1st-A
                </td>

                <td className="promotion-table-data">
                  65
                </td>
              </tr>

              <tr className="promotion-table-body-row">
                <td className="promotion-table-data">
                  2
                </td>

                <td className="promotion-table-data">
                  2nd-A
                </td>

                <td className="promotion-table-data">
                  13
                </td>
              </tr>

              <tr className="promotion-table-body-row">
                <td className="promotion-table-data">
                  3
                </td>

                <td className="promotion-table-data">
                  3rd-A
                </td>

                <td className="promotion-table-data">
                  10
                </td>
              </tr>

              {promotionHistory.map((item, index) => (
                <tr
                  className="promotion-table-body-row"
                  key={item.id}
                >
                  <td className="promotion-table-data">
                    {index + 4}
                  </td>

                  <td className="promotion-table-data">
                    {item.className}
                  </td>

                  <td className="promotion-table-data">
                    {item.studentCount}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (
        <div className="promotion-modal-overlay">

          <div className="promotion-modal-container">

            {/* CLOSE */}

            <button
              className="promotion-close-button"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            {/* TITLE */}

            <div className="promotion-modal-header">
              <h2 className="promotion-modal-title">
                PROMOTE STUDENTS
              </h2>
            </div>

            {/* FORM */}

            <div className="promotion-form-section">

              <div className="promotion-form-row">

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Session
                  </label>

                  <select
                    className="promotion-form-select"
                    value={session}
                    onChange={(e) =>
                      setSession(e.target.value)
                    }
                  >
                    <option>2025-2026</option>
                    <option>2026-2027</option>
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Current Class
                  </label>

                  <select
                    className="promotion-form-select"
                    value={currentClass}
                    onChange={(e) =>
                      setCurrentClass(e.target.value)
                    }
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((cls) => (
                      <option key={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Current Division
                  </label>

                  <select
                    className="promotion-form-select"
                    value={currentDivision}
                    onChange={(e) =>
                      setCurrentDivision(e.target.value)
                    }
                  >
                    <option value="">
                      Select Division
                    </option>

                    {divisions.map((div) => (
                      <option key={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Class
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteClass}
                    onChange={(e) =>
                      setPromoteClass(e.target.value)
                    }
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((cls) => (
                      <option key={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Division
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteDivision}
                    onChange={(e) =>
                      setPromoteDivision(e.target.value)
                    }
                  >
                    <option value="">
                      Select Division
                    </option>

                    {divisions.map((div) => (
                      <option key={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

            </div>

            {/* TRANSFER SECTION */}

            <div className="promotion-transfer-main-section">

              {/* LEFT TABLE */}

              <div className="promotion-student-table-box">

                <div className="promotion-student-table-header">
                  Student List
                </div>

                <div className="promotion-student-table-wrapper">

                  <table className="promotion-student-table">

                    <thead className="promotion-student-table-head">
                      <tr className="promotion-student-table-head-row">

                        <th className="promotion-student-table-heading">
                        </th>

                        <th className="promotion-student-table-heading">
                          SR NO
                        </th>

                        <th className="promotion-student-table-heading">
                          ROLL NO
                        </th>

                        <th className="promotion-student-table-heading">
                          STUDENT NAME
                        </th>

                        <th className="promotion-student-table-heading">
                          FATHER NAME
                        </th>

                      </tr>
                    </thead>

                    <tbody className="promotion-student-table-body">

                      {students.map((student, index) => (
                        <tr
                          key={student.id}
                          className="promotion-student-table-body-row"
                        >

                          <td className="promotion-student-table-data">

                            <input
                              type="checkbox"
                              className="promotion-checkbox"
                              checked={selectedLeft.includes(
                                student.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeft([
                                    ...selectedLeft,
                                    student.id,
                                  ]);
                                } else {
                                  setSelectedLeft(
                                    selectedLeft.filter(
                                      (id) =>
                                        id !== student.id
                                    )
                                  );
                                }
                              }}
                            />

                          </td>

                          <td className="promotion-student-table-data">
                            {index + 1}
                          </td>

                          <td className="promotion-student-table-data">
                            {student.roll}
                          </td>

                          <td className="promotion-student-table-data">
                            {student.name}
                          </td>

                          <td className="promotion-student-table-data">
                            {student.father}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="promotion-transfer-button-section">

                <button
                  className="promotion-transfer-button"
                  onClick={moveRight}
                >
                  <FaAngleDoubleRight />
                </button>

                <button
                  className="promotion-transfer-button"
                  onClick={moveLeft}
                >
                  <FaAngleDoubleLeft />
                </button>

              </div>

              {/* RIGHT TABLE */}

              <div className="promotion-student-table-box">

                <div className="promotion-student-table-header">
                  Promoted Students
                </div>

                <div className="promotion-student-table-wrapper">

                  <table className="promotion-student-table">

                    <thead className="promotion-student-table-head">

                      <tr className="promotion-student-table-head-row">

                        <th className="promotion-student-table-heading">
                        </th>

                        <th className="promotion-student-table-heading">
                          SR NO
                        </th>

                        <th className="promotion-student-table-heading">
                          ROLL NO
                        </th>

                        <th className="promotion-student-table-heading">
                          STUDENT NAME
                        </th>

                        <th className="promotion-student-table-heading">
                          FATHER NAME
                        </th>

                        <th className="promotion-student-table-heading">
                          STATUS
                        </th>

                      </tr>

                    </thead>

                    <tbody className="promotion-student-table-body">

                      {promotedStudents.map(
                        (student, index) => (
                          <tr
                            key={student.id}
                            className="promotion-student-table-body-row"
                          >

                            <td className="promotion-student-table-data">

                              <input
                                type="checkbox"
                                className="promotion-checkbox"
                                checked={selectedRight.includes(
                                  student.id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedRight([
                                      ...selectedRight,
                                      student.id,
                                    ]);
                                  } else {
                                    setSelectedRight(
                                      selectedRight.filter(
                                        (id) =>
                                          id !== student.id
                                      )
                                    );
                                  }
                                }}
                              />

                            </td>

                            <td className="promotion-student-table-data">
                              {index + 1}
                            </td>

                            <td className="promotion-student-table-data">
                              {student.roll}
                            </td>

                            <td className="promotion-student-table-data">
                              {student.name}
                            </td>

                            <td className="promotion-student-table-data">
                              {student.father}
                            </td>

                            <td className="promotion-student-table-data">
                              <span className="promotion-status-success">
                                Promoted
                              </span>
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="promotion-modal-footer">

              <button
                className="promotion-cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="promotion-save-button"
                onClick={handleAddPromotion}
              >
                Add
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Promotion;