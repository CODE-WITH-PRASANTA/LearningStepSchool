import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./Promotion.css";

import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import API from "../../api/axios";

const Promotion = () => {
  const [showModal, setShowModal] =
    useState(false);

  const [students, setStudents] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [studentSearch, setStudentSearch] =
    useState("");

  const [promotedStudents, setPromotedStudents] =
    useState([]);

  const [selectedLeft, setSelectedLeft] =
    useState([]);

  const [selectedRight, setSelectedRight] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [session, setSession] =
    useState("2025-2026");

  const [currentClass, setCurrentClass] =
    useState("");

  const [currentDivision, setCurrentDivision] =
    useState("");

  const [promoteClass, setPromoteClass] =
    useState("");

  const [promoteDivision, setPromoteDivision] =
    useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get("/students");

      setStudents(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");

      setClasses(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const classNames = useMemo(() => {
    const names = classes
      .map((item) => item.className)
      .filter(Boolean);

    return [...new Set(names)];
  }, [classes]);

  const currentSections = useMemo(() => {
    return classes
      .filter(
        (item) =>
          item.className === currentClass
      )
      .map((item) => item.sectionName)
      .filter(Boolean);
  }, [classes, currentClass]);

  const promoteSections = useMemo(() => {
    return classes
      .filter(
        (item) =>
          item.className === promoteClass
      )
      .map((item) => item.sectionName)
      .filter(Boolean);
  }, [classes, promoteClass]);

  const promotedIds = useMemo(
    () =>
      promotedStudents.map(
        (student) => student._id
      ),
    [promotedStudents]
  );

  const availableStudents = useMemo(() => {
    if (!currentClass || !currentDivision) {
      return [];
    }

    const query =
      studentSearch.toLowerCase();

    return students.filter((student) => {
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`;

      const matchesClass =
        student.class === currentClass &&
        student.section ===
          currentDivision;

      const matchesSearch = [
        student.admissionNo,
        student.rollNumber,
        fullName,
        student.fatherName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      return (
        matchesClass &&
        matchesSearch &&
        !promotedIds.includes(student._id)
      );
    });
  }, [
    currentClass,
    currentDivision,
    promotedIds,
    studentSearch,
    students,
  ]);

  const classSummary = useMemo(() => {
    const grouped = students.reduce(
      (acc, student) => {
        const key = `${student.class || "N/A"}-${student.section || "N/A"}`;

        if (!acc[key]) {
          acc[key] = {
            className: key,
            studentCount: 0,
          };
        }

        acc[key].studentCount += 1;

        return acc;
      },
      {}
    );

    return Object.values(grouped)
      .filter((item) =>
        item.className
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) =>
        a.className.localeCompare(
          b.className
        )
      );
  }, [search, students]);

  const moveRight = () => {
    const selected =
      availableStudents.filter((student) =>
        selectedLeft.includes(
          student._id
        )
      );

    setPromotedStudents([
      ...promotedStudents,
      ...selected,
    ]);

    setSelectedLeft([]);
  };

  const moveLeft = () => {
    setPromotedStudents(
      promotedStudents.filter(
        (student) =>
          !selectedRight.includes(
            student._id
          )
      )
    );

    setSelectedRight([]);
  };

  const toggleLeftStudent = (id) => {
    setSelectedLeft((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  const toggleRightStudent = (id) => {
    setSelectedRight((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  };

  const resetPromotionForm = () => {
    setPromotedStudents([]);
    setSelectedLeft([]);
    setSelectedRight([]);
    setStudentSearch("");
    setCurrentClass("");
    setCurrentDivision("");
    setPromoteClass("");
    setPromoteDivision("");
  };

  const closeModal = () => {
    setShowModal(false);
    resetPromotionForm();
  };

  const handleAddPromotion = async () => {
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
      alert(
        "Please select students to promote"
      );
      return;
    }

    try {
      setSaving(true);

      await Promise.all(
        promotedStudents.map((student) =>
          API.put(`/students/${student._id}`, {
            class: promoteClass,
            section: promoteDivision,
          })
        )
      );

      await fetchStudents();

      closeModal();

      alert(
        "Students promoted successfully"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to promote students"
      );
    } finally {
      setSaving(false);
    }
  };

  const renderStudentRows = (
    list,
    selected,
    onToggle,
    showStatus = false
  ) => {
    if (list.length === 0) {
      return (
        <tr>
          <td
            className="promotion-empty-state"
            colSpan={showStatus ? 6 : 5}
          >
            No students found
          </td>
        </tr>
      );
    }

    return list.map((student, index) => {
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();

      return (
        <tr
          key={student._id}
          className="promotion-student-table-body-row"
        >
          <td className="promotion-student-table-data">
            <input
              type="checkbox"
              className="promotion-checkbox"
              checked={selected.includes(
                student._id
              )}
              onChange={() =>
                onToggle(student._id)
              }
            />
          </td>

          <td className="promotion-student-table-data">
            {index + 1}
          </td>

          <td className="promotion-student-table-data">
            {student.rollNumber ||
              student.admissionNo ||
              "-"}
          </td>

          <td className="promotion-student-table-data">
            {fullName || "-"}
          </td>

          <td className="promotion-student-table-data">
            {student.fatherName || "-"}
          </td>

          {showStatus && (
            <td className="promotion-student-table-data">
              <span className="promotion-status-success">
                Ready
              </span>
            </td>
          )}
        </tr>
      );
    });
  };

  return (
    <div className="promotion-page-container">
      <div className="promotion-main-card">
        <div className="promotion-topbar-section">
          <div>
            <h1 className="promotion-page-title">
              Student Promotion
            </h1>
            <p className="promotion-page-subtitle">
              Move students to their next class and section.
            </p>
          </div>

          <div className="promotion-topbar-actions">
            <div className="promotion-search-box">
              <FaSearch className="promotion-search-icon" />

              <input
                type="text"
                placeholder="Search class..."
                className="promotion-search-input"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <button
              className="promotion-add-button"
              onClick={() =>
                setShowModal(true)
              }
            >
              <FaPlus />
            </button>
          </div>
        </div>

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
              {loading ? (
                <tr>
                  <td
                    className="promotion-empty-state"
                    colSpan="3"
                  >
                    Loading students...
                  </td>
                </tr>
              ) : classSummary.length > 0 ? (
                classSummary.map(
                  (item, index) => (
                    <tr
                      className="promotion-table-body-row"
                      key={item.className}
                    >
                      <td className="promotion-table-data">
                        {index + 1}
                      </td>
                      <td className="promotion-table-data">
                        {item.className}
                      </td>
                      <td className="promotion-table-data">
                        {
                          item.studentCount
                        }
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    className="promotion-empty-state"
                    colSpan="3"
                  >
                    No class data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="promotion-modal-overlay">
          <div className="promotion-modal-container">
            <div className="promotion-modal-header">
              <div>
                <h2 className="promotion-modal-title">
                  Promote Students
                </h2>
                <p className="promotion-modal-subtitle">
                  Select a source class, choose students, then save their new class details.
                </p>
              </div>

              <button
                className="promotion-close-button"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

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
                    onChange={(e) => {
                      setCurrentClass(
                        e.target.value
                      );
                      setCurrentDivision("");
                      setPromotedStudents([]);
                      setSelectedLeft([]);
                    }}
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classNames.map((cls) => (
                      <option
                        key={cls}
                        value={cls}
                      >
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Current Section
                  </label>

                  <select
                    className="promotion-form-select"
                    value={currentDivision}
                    onChange={(e) => {
                      setCurrentDivision(
                        e.target.value
                      );
                      setPromotedStudents([]);
                      setSelectedLeft([]);
                    }}
                  >
                    <option value="">
                      Select Section
                    </option>

                    {currentSections.map(
                      (section) => (
                        <option
                          key={section}
                          value={section}
                        >
                          {section}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Class
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteClass}
                    onChange={(e) => {
                      setPromoteClass(
                        e.target.value
                      );
                      setPromoteDivision("");
                    }}
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classNames.map((cls) => (
                      <option
                        key={cls}
                        value={cls}
                      >
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Section
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteDivision}
                    onChange={(e) =>
                      setPromoteDivision(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Section
                    </option>

                    {promoteSections.map(
                      (section) => (
                        <option
                          key={section}
                          value={section}
                        >
                          {section}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="promotion-student-search-row">
              <div className="promotion-search-box promotion-student-search-box">
                <FaSearch className="promotion-search-icon" />

                <input
                  type="text"
                  placeholder="Search students..."
                  className="promotion-search-input"
                  value={studentSearch}
                  onChange={(e) =>
                    setStudentSearch(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="promotion-selected-count">
                {promotedStudents.length} selected
              </div>
            </div>

            <div className="promotion-transfer-main-section">
              <div className="promotion-student-table-box">
                <div className="promotion-student-table-header">
                  Student List
                </div>

                <div className="promotion-student-table-wrapper">
                  <table className="promotion-student-table">
                    <thead className="promotion-student-table-head">
                      <tr className="promotion-student-table-head-row">
                        <th className="promotion-student-table-heading"></th>
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
                      {renderStudentRows(
                        availableStudents,
                        selectedLeft,
                        toggleLeftStudent
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="promotion-transfer-button-section">
                <button
                  className="promotion-transfer-button"
                  onClick={moveRight}
                  disabled={
                    selectedLeft.length === 0
                  }
                >
                  <FaAngleDoubleRight />
                </button>

                <button
                  className="promotion-transfer-button"
                  onClick={moveLeft}
                  disabled={
                    selectedRight.length === 0
                  }
                >
                  <FaAngleDoubleLeft />
                </button>
              </div>

              <div className="promotion-student-table-box">
                <div className="promotion-student-table-header">
                  Promoted Students
                </div>

                <div className="promotion-student-table-wrapper">
                  <table className="promotion-student-table">
                    <thead className="promotion-student-table-head">
                      <tr className="promotion-student-table-head-row">
                        <th className="promotion-student-table-heading"></th>
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
                      {renderStudentRows(
                        promotedStudents,
                        selectedRight,
                        toggleRightStudent,
                        true
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="promotion-modal-footer">
              <button
                className="promotion-cancel-button"
                onClick={closeModal}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="promotion-save-button"
                onClick={handleAddPromotion}
                disabled={saving}
              >
                {saving ? "Saving..." : "Promote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotion;
