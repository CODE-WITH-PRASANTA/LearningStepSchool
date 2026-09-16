import React, { useEffect, useMemo, useState } from "react";
import "./Promotion.css";

import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSearch,
  FaTimes,
  FaUsers,
  FaExchangeAlt,
  FaGraduationCap,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import API from "../../api/axios";

const Promotion = () => {
  /* =========================================================
     MODAL
  ========================================================= */

  const [showModal, setShowModal] = useState(false);

  /* =========================================================
     DATA
  ========================================================= */

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =========================================================
     MAIN SEARCH
  ========================================================= */

  const [search, setSearch] = useState("");

  /* =========================================================
     MODAL SEARCH
  ========================================================= */

  const [studentSearch, setStudentSearch] = useState("");

  /* =========================================================
     PROMOTION STUDENTS
  ========================================================= */

  const [promotedStudents, setPromotedStudents] = useState([]);

  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  /* =========================================================
     SESSION
  ========================================================= */

  const [currentSession, setCurrentSession] = useState("2025-2026");

  const [promoteSession, setPromoteSession] = useState("2026-2027");

  /* =========================================================
     CLASS / SECTION
  ========================================================= */

  const [currentClass, setCurrentClass] = useState("");
  const [currentDivision, setCurrentDivision] = useState("");

  const [promoteClass, setPromoteClass] = useState("");
  const [promoteDivision, setPromoteDivision] = useState("");

  /* =========================================================
     PAGINATION
  ========================================================= */

  const [currentPage, setCurrentPage] = useState(1);

  const [leftPage, setLeftPage] = useState(1);

  const [rightPage, setRightPage] = useState(1);

  const itemsPerPage = 5;
  const modalItemsPerPage = 5;

  /* =========================================================
     SESSION OPTIONS
  ========================================================= */

  const sessionOptions = useMemo(() => {
    return [
      "2023-2024",
      "2024-2025",
      "2025-2026",
      "2026-2027",
      "2027-2028",
      "2028-2029",
      "2029-2030",
      "2030-2031",
    ];
  }, []);

  /* =========================================================
     FETCH STUDENTS
  ========================================================= */

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get("/students");

      setStudents(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     FETCH CLASSES
  ========================================================= */

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes");

      setClasses(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);

      setClasses([]);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  /* =========================================================
     CLASS NAMES
  ========================================================= */

  const classNames = useMemo(() => {
    const names = classes.map((item) => item.className).filter(Boolean);

    return [...new Set(names)];
  }, [classes]);

  /* =========================================================
     CURRENT SECTIONS
  ========================================================= */

  const currentSections = useMemo(() => {
    return [
      ...new Set(
        classes
          .filter((item) => item.className === currentClass)
          .map((item) => item.sectionName)
          .filter(Boolean),
      ),
    ];
  }, [classes, currentClass]);

  /* =========================================================
     PROMOTION SECTIONS
  ========================================================= */

  const promoteSections = useMemo(() => {
    return [
      ...new Set(
        classes
          .filter((item) => item.className === promoteClass)
          .map((item) => item.sectionName)
          .filter(Boolean),
      ),
    ];
  }, [classes, promoteClass]);

  /* =========================================================
     PROMOTED IDS
  ========================================================= */

  const promotedIds = useMemo(() => {
    return promotedStudents.map((student) => student._id);
  }, [promotedStudents]);

  /* =========================================================
   NORMALIZE VALUES
   Handles:
   10       <-> 10th
   "10 A"   <-> "10 a"
   spaces
   uppercase/lowercase
   2025-26  <-> 2025-2026
========================================================= */

  const normalizeValue = (value) => {
    if (value === null || value === undefined) return "";

    return String(value).trim().toLowerCase().replace(/\s+/g, " ");
  };

  const normalizeClass = (value) => {
    let result = normalizeValue(value);

    // Remove "class " prefix
    result = result.replace(/^class\s+/i, "");

    // 10th -> 10
    // 1st  -> 1
    // 2nd  -> 2
    // 3rd  -> 3
    result = result.replace(/^(\d+)(st|nd|rd|th)$/, "$1");

    return result;
  };

  const normalizeSession = (value) => {
    let result = normalizeValue(value);

    // 2025-26 -> 2025-2026
    const match = result.match(/^(\d{4})-(\d{2})$/);

    if (match) {
      result = `${match[1]}-${match[1].slice(0, 2)}${match[2]}`;
    }

    return result;
  };

  const normalizeSection = (value) => {
    return normalizeValue(value);
  };

  /* =========================================================
     AVAILABLE STUDENTS
     
     IMPORTANT:
     Students are filtered by:
     Current Session
     Current Class
     Current Section
  ========================================================= */

  /* =========================================================
   AVAILABLE STUDENTS

   IMPORTANT:
   Students are filtered using normalized values so that:

   10    = 10th
   Class 10 = 10
   A     = a
   2025-26 = 2025-2026
========================================================= */

  const availableStudents = useMemo(() => {
    if (!currentSession || !currentClass || !currentDivision) {
      return [];
    }

    const query = studentSearch.toLowerCase().trim();

    const selectedSession = normalizeSession(currentSession);

    const selectedClass = normalizeClass(currentClass);

    const selectedSection = normalizeSection(currentDivision);

    return students.filter((student) => {
      const fullName = `${student.firstName || ""} ${
        student.lastName || ""
      }`.trim();

      /* -----------------------------------------
       STUDENT VALUES
    ----------------------------------------- */

      const studentSession = normalizeSession(
        student.session || student.academicSession || student.sessionName,
      );

      const studentClass = normalizeClass(student.class || student.className);

      const studentSection = normalizeSection(
        student.section || student.division || student.sectionName,
      );

      /* -----------------------------------------
       MATCHES
    ----------------------------------------- */

      const matchesSession = studentSession === selectedSession;

      const matchesClass = studentClass === selectedClass;

      const matchesSection = studentSection === selectedSection;

      /* -----------------------------------------
       SEARCH
    ----------------------------------------- */

      const matchesSearch = [
        student.admissionNo,
        student.rollNumber,
        fullName,
        student.fatherName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);

      /* -----------------------------------------
       FINAL
    ----------------------------------------- */

      return (
        matchesSession &&
        matchesClass &&
        matchesSection &&
        matchesSearch &&
        !promotedIds.includes(student._id)
      );
    });
  }, [
    currentSession,
    currentClass,
    currentDivision,
    studentSearch,
    students,
    promotedIds,
  ]);

  /* =========================================================
     ALL STUDENTS OF SELECTED CLASS / SECTION / SESSION
     
     This intentionally DOES NOT use studentSearch.
     
     Therefore Select All means:
     ALL students in the selected class + section + session.
  ========================================================= */

  const allClassStudents = useMemo(() => {
    if (!currentSession || !currentClass || !currentDivision) {
      return [];
    }

    return students.filter((student) => {
      return (
        student.session === currentSession &&
        student.class === currentClass &&
        student.section === currentDivision &&
        !promotedIds.includes(student._id)
      );
    });
  }, [students, currentSession, currentClass, currentDivision, promotedIds]);

  /* =========================================================
     RESET LEFT PAGINATION
  ========================================================= */

  useEffect(() => {
    setLeftPage(1);
  }, [studentSearch, currentSession, currentClass, currentDivision]);

  /* =========================================================
     RESET RIGHT PAGINATION
  ========================================================= */

  useEffect(() => {
    setRightPage(1);
  }, [promotedStudents.length]);

  /* =========================================================
     MAIN CLASS SUMMARY
  ========================================================= */

  const classSummary = useMemo(() => {
    const grouped = students.reduce((acc, student) => {
      const key = `${student.class || "N/A"}-${student.section || "N/A"}`;

      if (!acc[key]) {
        acc[key] = {
          className: key,
          studentCount: 0,
        };
      }

      acc[key].studentCount += 1;

      return acc;
    }, {});

    return Object.values(grouped)
      .filter((item) =>
        item.className.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => a.className.localeCompare(b.className));
  }, [search, students]);

  /* =========================================================
     MAIN PAGINATION
  ========================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(classSummary.length / itemsPerPage) || 1;

  const paginatedSummary = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return classSummary.slice(start, start + itemsPerPage);
  }, [classSummary, currentPage]);

  /* =========================================================
     LEFT PAGINATION
  ========================================================= */

  const totalLeftPages =
    Math.ceil(availableStudents.length / modalItemsPerPage) || 1;

  const paginatedAvailableStudents = useMemo(() => {
    const start = (leftPage - 1) * modalItemsPerPage;

    return availableStudents.slice(start, start + modalItemsPerPage);
  }, [availableStudents, leftPage]);

  /* =========================================================
     RIGHT PAGINATION
  ========================================================= */

  const totalRightPages =
    Math.ceil(promotedStudents.length / modalItemsPerPage) || 1;

  const paginatedPromotedStudents = useMemo(() => {
    const start = (rightPage - 1) * modalItemsPerPage;

    return promotedStudents.slice(start, start + modalItemsPerPage);
  }, [promotedStudents, rightPage]);

  /* =========================================================
     MOVE SELECTED STUDENTS RIGHT
  ========================================================= */

  const moveRight = () => {
    if (selectedLeft.length === 0) {
      return;
    }

    const selected = availableStudents.filter((student) =>
      selectedLeft.includes(student._id),
    );

    setPromotedStudents((prev) => [...prev, ...selected]);

    setSelectedLeft([]);
  };

  /* =========================================================
     MOVE SELECTED STUDENTS LEFT
  ========================================================= */

  const moveLeft = () => {
    if (selectedRight.length === 0) {
      return;
    }

    setPromotedStudents((prev) =>
      prev.filter((student) => !selectedRight.includes(student._id)),
    );

    setSelectedRight([]);
  };

  /* =========================================================
     TOGGLE SINGLE LEFT STUDENT
  ========================================================= */

  const toggleLeftStudent = (id) => {
    setSelectedLeft((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  /* =========================================================
     TOGGLE SINGLE RIGHT STUDENT
  ========================================================= */

  const toggleRightStudent = (id) => {
    setSelectedRight((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  /* =========================================================
     SELECT ALL LEFT
     
     IMPORTANT:
     This selects ALL students of the selected
     current session + class + section.
     
     It does NOT select only the current page.
  ========================================================= */

  const toggleSelectAllLeft = () => {
    const allIds = allClassStudents.map((student) => student._id);

    if (allIds.length === 0) {
      return;
    }

    const allSelected = allIds.every((id) => selectedLeft.includes(id));

    if (allSelected) {
      setSelectedLeft((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedLeft((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  /* =========================================================
     SELECT ALL RIGHT
     
     Selects every promoted student, not just
     the current pagination page.
  ========================================================= */

  const toggleSelectAllRight = () => {
    const allIds = promotedStudents.map((student) => student._id);

    if (allIds.length === 0) {
      return;
    }

    const allSelected = allIds.every((id) => selectedRight.includes(id));

    if (allSelected) {
      setSelectedRight((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedRight((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  /* =========================================================
     SELECT ALL STATUS
  ========================================================= */

  const allLeftSelected =
    allClassStudents.length > 0 &&
    allClassStudents.every((student) => selectedLeft.includes(student._id));

  const allRightSelected =
    promotedStudents.length > 0 &&
    promotedStudents.every((student) => selectedRight.includes(student._id));

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetPromotionForm = () => {
    setPromotedStudents([]);

    setSelectedLeft([]);

    setSelectedRight([]);

    setStudentSearch("");

    setCurrentSession("2025-2026");

    setPromoteSession("2026-2027");

    setCurrentClass("");

    setCurrentDivision("");

    setPromoteClass("");

    setPromoteDivision("");

    setLeftPage(1);

    setRightPage(1);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);

    resetPromotionForm();
  };

  /* =========================================================
     ADD / PROMOTE STUDENTS
  ========================================================= */

  const handleAddPromotion = async () => {
    if (
      !currentSession ||
      !promoteSession ||
      !currentClass ||
      !currentDivision ||
      !promoteClass ||
      !promoteDivision
    ) {
      alert("Please fill all session, class and section fields.");
      return;
    }

    if (currentSession === promoteSession) {
      alert("Current session and promotion session must be different.");
      return;
    }

    if (currentClass === promoteClass) {
      if (currentDivision === promoteDivision) {
        alert(
          "Current and promotion class/section cannot be exactly the same.",
        );
        return;
      }
    }

    if (promotedStudents.length === 0) {
      alert("Please select students to promote.");
      return;
    }

    try {
      setSaving(true);

      const response = await API.post("/students/promote", {
        studentIds: promotedStudents.map((student) => student._id),
        currentSession,
        promoteSession,
        promoteClass,
        promoteDivision,
      });

      if (response.data?.success) {
        await fetchStudents();

        setShowModal(false);
        resetPromotionForm();

        alert(
          `${promotedStudents.length} student${
            promotedStudents.length > 1 ? "s" : ""
          } promoted successfully!`,
        );
      }
    } catch (error) {
      console.error("Promotion error:", error);

      alert(error.response?.data?.message || "Failed to promote students.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     STUDENT ROWS
  ========================================================= */

  const renderStudentRows = (
    list,
    selected,
    onToggle,
    pageIndex = 1,
    showStatus = false,
  ) => {
    if (list.length === 0) {
      return (
        <tr>
          <td className="promotion-empty-state" colSpan={showStatus ? 6 : 5}>
            <div className="promotion-empty-content">
              <FaUsers />

              <span>No students found</span>
            </div>
          </td>
        </tr>
      );
    }

    return list.map((student, index) => {
      const fullName = `${student.firstName || ""} ${
        student.lastName || ""
      }`.trim();

      const serialNumber = (pageIndex - 1) * modalItemsPerPage + index + 1;

      const isSelected = selected.includes(student._id);

      return (
        <tr
          key={student._id}
          className={`promotion-student-table-body-row ${
            isSelected ? "student-row-selected" : ""
          }`}
        >
          <td className="promotion-student-table-data center-align">
            <input
              type="checkbox"
              className="promotion-checkbox"
              checked={isSelected}
              onChange={() => onToggle(student._id)}
            />
          </td>

          <td className="promotion-student-table-data serial-cell">
            {serialNumber}
          </td>

          <td className="promotion-student-table-data">
            <span className="roll-badge">
              {student.rollNumber || student.admissionNo || "-"}
            </span>
          </td>

          <td className="promotion-student-table-data student-name-cell">
            {fullName || "-"}
          </td>

          <td className="promotion-student-table-data">
            {student.fatherName || "-"}
          </td>

          {showStatus && (
            <td className="promotion-student-table-data">
              <span className="promotion-status-success">
                <FaCheckCircle />
                Ready
              </span>
            </td>
          )}
        </tr>
      );
    });
  };

  /* =========================================================
     OPEN MODAL
  ========================================================= */

  const openPromotionModal = () => {
    resetPromotionForm();

    setShowModal(true);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="promotion-page-container">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="promotion-main-card">
        <div className="promotion-topbar-section">
          <div className="promotion-heading-area">
            <div className="promotion-title-icon">
              <FaGraduationCap />
            </div>

            <div>
              <h1 className="promotion-page-title">Student Promotion</h1>

              <p className="promotion-page-subtitle">
                Move students to their next class, section and academic session.
              </p>
            </div>
          </div>

          <div className="promotion-topbar-actions">
            <div className="promotion-search-box">
              <FaSearch className="promotion-search-icon" />

              <input
                type="text"
                placeholder="Search class..."
                className="promotion-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="promotion-add-button"
              onClick={openPromotionModal}
              title="Promote Students"
            >
              <FaPlus />

              <span>Promote</span>
            </button>
          </div>
        </div>

        {/* ===================================================
            SUMMARY
        ==================================================== */}

        <div className="promotion-summary-strip">
          <div className="promotion-summary-item">
            <div className="summary-icon purple">
              <FaGraduationCap />
            </div>

            <div>
              <span>Classes</span>

              <strong>{classSummary.length}</strong>
            </div>
          </div>

          <div className="promotion-summary-item">
            <div className="summary-icon blue">
              <FaUsers />
            </div>

            <div>
              <span>Students</span>

              <strong>{students.length}</strong>
            </div>
          </div>

          <div className="promotion-summary-item">
            <div className="summary-icon green">
              <FaCheckCircle />
            </div>

            <div>
              <span>Active Session</span>

              <strong>2025-2026</strong>
            </div>
          </div>
        </div>

        {/* ===================================================
            MAIN TABLE
        ==================================================== */}

        <div className="promotion-table-wrapper">
          <table className="promotion-table">
            <thead className="promotion-table-head">
              <tr className="promotion-table-head-row">
                <th className="promotion-table-heading">S.NO.</th>

                <th className="promotion-table-heading">CLASS / SECTION</th>

                <th className="promotion-table-heading">NO. OF STUDENTS</th>
              </tr>
            </thead>

            <tbody className="promotion-table-body">
              {loading ? (
                <tr>
                  <td className="promotion-empty-state" colSpan="3">
                    <div className="promotion-loading">
                      <span className="loading-spinner" />
                      Loading students...
                    </div>
                  </td>
                </tr>
              ) : paginatedSummary.length > 0 ? (
                paginatedSummary.map((item, index) => (
                  <tr className="promotion-table-body-row" key={item.className}>
                    <td className="promotion-table-data">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>

                    <td className="promotion-table-data">
                      <span className="class-name-badge">{item.className}</span>
                    </td>

                    <td className="promotion-table-data">
                      <span className="student-count-badge">
                        {item.studentCount}
                        <FaUsers />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="promotion-empty-state" colSpan="3">
                    <div className="promotion-empty-content">
                      <FaUsers />
                      <span>No class data found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            MAIN PAGINATION
        ==================================================== */}

        {classSummary.length > 0 && (
          <div className="promotion-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>

            <div className="pagination-pages">
              {Array.from(
                {
                  length: totalPages,
                },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          PROMOTION MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="promotion-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="promotion-modal-container">
            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="promotion-modal-header">
              <div className="promotion-modal-title-area">
                <div className="promotion-modal-icon">
                  <FaExchangeAlt />
                </div>

                <div>
                  <h2 className="promotion-modal-title">Promote Students</h2>

                  <p className="promotion-modal-subtitle">
                    Select the current session, source class and students, then
                    choose their new academic session and class.
                  </p>
                </div>
              </div>

              <button
                className="promotion-close-button"
                onClick={closeModal}
                disabled={saving}
              >
                <FaTimes />
              </button>
            </div>

            {/* =================================================
                SESSION FLOW
            ================================================== */}

            <div className="promotion-session-flow">
              <div className="session-flow-card current">
                <span className="session-flow-label">CURRENT</span>

                <strong>{currentSession}</strong>

                <small>Existing academic session</small>
              </div>

              <div className="session-flow-arrow">
                <FaArrowRight />
              </div>

              <div className="session-flow-card next">
                <span className="session-flow-label">PROMOTE TO</span>

                <strong>{promoteSession}</strong>

                <small>New academic session</small>
              </div>
            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <div className="promotion-form-section">
              <div className="promotion-form-grid">
                {/* CURRENT SESSION */}

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Current Session
                  </label>

                  <select
                    className="promotion-form-select"
                    value={currentSession}
                    onChange={(e) => {
                      setCurrentSession(e.target.value);

                      setPromotedStudents([]);

                      setSelectedLeft([]);

                      setSelectedRight([]);
                    }}
                  >
                    <option value="">Select Current Session</option>

                    {sessionOptions.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PROMOTE SESSION */}

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Session
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteSession}
                    onChange={(e) => setPromoteSession(e.target.value)}
                  >
                    <option value="">Select Promotion Session</option>

                    {sessionOptions.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CURRENT CLASS */}

                <div className="promotion-form-group">
                  <label className="promotion-form-label">Current Class</label>

                  <select
                    className="promotion-form-select"
                    value={currentClass}
                    onChange={(e) => {
                      setCurrentClass(e.target.value);

                      setCurrentDivision("");

                      setPromotedStudents([]);

                      setSelectedLeft([]);

                      setSelectedRight([]);
                    }}
                  >
                    <option value="">Select Current Class</option>

                    {classNames.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CURRENT SECTION */}

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Current Section
                  </label>

                  <select
                    className="promotion-form-select"
                    value={currentDivision}
                    onChange={(e) => {
                      setCurrentDivision(e.target.value);

                      setPromotedStudents([]);

                      setSelectedLeft([]);

                      setSelectedRight([]);
                    }}
                  >
                    <option value="">Select Current Section</option>

                    {currentSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PROMOTE CLASS */}

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Class
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteClass}
                    onChange={(e) => {
                      setPromoteClass(e.target.value);

                      setPromoteDivision("");
                    }}
                  >
                    <option value="">Select New Class</option>

                    {classNames.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PROMOTE SECTION */}

                <div className="promotion-form-group">
                  <label className="promotion-form-label">
                    Promote To Section
                  </label>

                  <select
                    className="promotion-form-select"
                    value={promoteDivision}
                    onChange={(e) => setPromoteDivision(e.target.value)}
                  >
                    <option value="">Select New Section</option>

                    {promoteSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* =================================================
                SELECTION INFORMATION
            ================================================== */}

            <div className="promotion-selection-info">
              <div className="selection-info-left">
                <FaUsers />

                <div>
                  <strong>{allClassStudents.length}</strong>

                  <span>students in selected class</span>
                </div>
              </div>

              <div className="selection-info-right">
                <span>{promotedStudents.length}</span>

                <small>selected for promotion</small>
              </div>
            </div>

            {/* =================================================
                STUDENT SEARCH
            ================================================== */}

            <div className="promotion-student-search-row">
              <div className="promotion-search-box promotion-student-search-box">
                <FaSearch className="promotion-search-icon" />

                <input
                  type="text"
                  placeholder="Search students by name, roll number, admission number..."
                  className="promotion-search-input"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />

                {studentSearch && (
                  <button
                    className="clear-search-button"
                    onClick={() => setStudentSearch("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            {/* =================================================
                TRANSFER AREA
            ================================================== */}

            <div className="promotion-transfer-main-section">
              {/* =================================================
                  LEFT
              ================================================== */}

              <div className="promotion-student-table-box">
                <div className="promotion-student-table-header">
                  <div>
                    <span className="table-header-icon">
                      <FaUsers />
                    </span>

                    <div>
                      <strong>Student List</strong>

                      <small>{availableStudents.length} available</small>
                    </div>
                  </div>

                  <span className="table-selection-count">
                    {selectedLeft.length}
                  </span>
                </div>

                <div className="promotion-select-all-bar">
                  <label>
                    <input
                      type="checkbox"
                      className="promotion-checkbox"
                      checked={allLeftSelected}
                      onChange={toggleSelectAllLeft}
                      disabled={allClassStudents.length === 0}
                    />

                    <span>Select all students</span>
                  </label>

                  <small>{allClassStudents.length} total</small>
                </div>

                <div className="promotion-student-table-wrapper">
                  <table className="promotion-student-table">
                    <thead className="promotion-student-table-head">
                      <tr className="promotion-student-table-head-row">
                        <th className="promotion-student-table-heading center-align">
                          ✓
                        </th>

                        <th className="promotion-student-table-heading">SR</th>

                        <th className="promotion-student-table-heading">
                          ROLL NO
                        </th>

                        <th className="promotion-student-table-heading">
                          STUDENT
                        </th>

                        <th className="promotion-student-table-heading">
                          FATHER NAME
                        </th>
                      </tr>
                    </thead>

                    <tbody className="promotion-student-table-body">
                      {renderStudentRows(
                        paginatedAvailableStudents,
                        selectedLeft,
                        toggleLeftStudent,
                        leftPage,
                        false,
                      )}
                    </tbody>
                  </table>
                </div>

                {/* LEFT PAGINATION */}

                {availableStudents.length > 0 && (
                  <div className="promotion-pagination mini-pagination">
                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setLeftPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={leftPage === 1}
                    >
                      <FaChevronLeft />
                    </button>

                    <span className="pagination-info">
                      {leftPage} / {totalLeftPages}
                    </span>

                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setLeftPage((prev) =>
                          Math.min(prev + 1, totalLeftPages),
                        )
                      }
                      disabled={leftPage === totalLeftPages}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>

              {/* =================================================
                  TRANSFER BUTTONS
              ================================================== */}

              <div className="promotion-transfer-button-section">
                <button
                  className="promotion-transfer-button"
                  onClick={moveRight}
                  disabled={selectedLeft.length === 0}
                  title="Add selected students"
                >
                  <FaAngleDoubleRight />
                </button>

                <span className="transfer-line" />

                <button
                  className="promotion-transfer-button reverse"
                  onClick={moveLeft}
                  disabled={selectedRight.length === 0}
                  title="Remove selected students"
                >
                  <FaAngleDoubleLeft />
                </button>
              </div>

              {/* =================================================
                  RIGHT
              ================================================== */}

              <div className="promotion-student-table-box promoted-box">
                <div className="promotion-student-table-header">
                  <div>
                    <span className="table-header-icon success">
                      <FaCheckCircle />
                    </span>

                    <div>
                      <strong>Selected Students</strong>

                      <small>Ready for promotion</small>
                    </div>
                  </div>

                  <span className="table-selection-count selected">
                    {promotedStudents.length}
                  </span>
                </div>

                <div className="promotion-select-all-bar">
                  <label>
                    <input
                      type="checkbox"
                      className="promotion-checkbox"
                      checked={allRightSelected}
                      onChange={toggleSelectAllRight}
                      disabled={promotedStudents.length === 0}
                    />

                    <span>Select all selected</span>
                  </label>

                  <small>{promotedStudents.length} total</small>
                </div>

                <div className="promotion-student-table-wrapper">
                  <table className="promotion-student-table">
                    <thead className="promotion-student-table-head">
                      <tr className="promotion-student-table-head-row">
                        <th className="promotion-student-table-heading center-align">
                          ✓
                        </th>

                        <th className="promotion-student-table-heading">SR</th>

                        <th className="promotion-student-table-heading">
                          ROLL NO
                        </th>

                        <th className="promotion-student-table-heading">
                          STUDENT
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
                        paginatedPromotedStudents,
                        selectedRight,
                        toggleRightStudent,
                        rightPage,
                        true,
                      )}
                    </tbody>
                  </table>
                </div>

                {/* RIGHT PAGINATION */}

                {promotedStudents.length > 0 && (
                  <div className="promotion-pagination mini-pagination">
                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setRightPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={rightPage === 1}
                    >
                      <FaChevronLeft />
                    </button>

                    <span className="pagination-info">
                      {rightPage} / {totalRightPages}
                    </span>

                    <button
                      className="pagination-btn"
                      onClick={() =>
                        setRightPage((prev) =>
                          Math.min(prev + 1, totalRightPages),
                        )
                      }
                      disabled={rightPage === totalRightPages}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                PROMOTION PREVIEW
            ================================================== */}

            <div className="promotion-preview">
              <div className="preview-location">
                <span className="preview-label">FROM</span>

                <strong>
                  {currentClass || "Select class"}
                  {" - "}
                  {currentDivision || "Select section"}
                </strong>

                <small>{currentSession}</small>
              </div>

              <FaArrowRight className="preview-arrow" />

              <div className="preview-location destination">
                <span className="preview-label">TO</span>

                <strong>
                  {promoteClass || "Select class"}
                  {" - "}
                  {promoteDivision || "Select section"}
                </strong>

                <small>{promoteSession}</small>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="promotion-modal-footer">
              <button
                className="promotion-cancel-button"
                onClick={closeModal}
                disabled={saving}
              >
                <FaTimes />
                Cancel
              </button>

              <button
                className="promotion-save-button"
                onClick={handleAddPromotion}
                disabled={saving || promotedStudents.length === 0}
              >
                {saving ? (
                  <>
                    <span className="button-spinner" />
                    Promoting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Promote{" "}
                    {promotedStudents.length > 0
                      ? `(${promotedStudents.length})`
                      : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotion;
