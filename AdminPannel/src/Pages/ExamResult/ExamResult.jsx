import React, { useEffect, useState, useMemo } from "react";
import "./ExamResult.css";
import API, { IMAGE_URL } from "../../api/axios";
import { FiMoreVertical, FiSearch, FiEye } from "react-icons/fi";
import logo from "../../Assets/Learning-Step-Logo-1.png";
import ReportModal from "../../Component/ReportModal/ReportModal";

const ExamResult = () => {
  const [editData, setEditData] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [viewData, setViewData] = useState(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");

  const rowsPerPage = 10;

  /* ================= FETCH ================= */
  const fetchResults = async () => {
    try {
      const res = await API.get("/exam-results");
      setResults(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(null);
    window.addEventListener("click", closeMenu);

    return () => window.removeEventListener("click", closeMenu);
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this result?",
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/exam-results/${id}`);

      // ✅ remove from UI instantly (NO API re-fetch)
      setResults((prev) => prev.filter((item) => item._id !== id));

      setMenuOpen(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= FILTER ================= */
  const classOptions = useMemo(() => {
    return [
      ...new Set(
        results
          .map(
            (item) => item.classId?.className || item.class || item.className,
          )
          .filter(Boolean),
      ),
    ];
  }, [results]);

  const examOptions = useMemo(() => {
    return [
      ...new Set(
        results.map((item) => item.examType).filter(Boolean), // 🔥 IMPORTANT
      ),
    ];
  }, [results]);

  const filteredData = results
    .filter((item) => {
      const className =
        item.classId?.className || item.class || item.className || "";

      return (
        ((item.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (item.admissionNo || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (item.examType || "").toLowerCase().includes(search.toLowerCase())) &&
        (selectedClass ? className === selectedClass : true) &&
        (selectedExam ? item.examType === selectedExam : true)
      );
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); // 🔥 ADD THIS

  useEffect(() => {
    setPage(1);
  }, [search, selectedClass, selectedExam]);

  const handleUpdate = async () => {
    try {
      const res = await API.put(`/exam-results/${editData._id}`, editData);

      // ✅ update UI instantly
      setResults((prev) =>
        prev.map((item) => (item._id === editData._id ? res.data.data : item)),
      );

      setEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= PAGINATION ================= */
  // ✅ PAGINATION CORE
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;

  const indexLast = page * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;

  const currentRows = filteredData.slice(indexFirst, indexLast);

  const pageLimit = 5;

  const startPage = Math.floor((page - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filteredData, totalPages]);

  const calculateResult = () => {
    const subjects = editData?.subjects || [];

    const totalMarks = subjects.reduce(
      (sum, s) => sum + Number(s.marks || 0),
      0,
    );

    const totalFullMarks = subjects.reduce(
      (sum, s) => sum + Number(s.fullMarks || 0),
      0,
    );

    const percentage = totalFullMarks ? (totalMarks / totalFullMarks) * 100 : 0;

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 40) grade = "C";

    const isFail = subjects.some(
      (s) => Number(s.marks) < Number(s.fullMarks) * 0.35,
    );

    const result = isFail ? "Fail" : "Pass";

    return {
      totalMarks,
      totalFullMarks,
      percentage,
      grade,
      result,
    };
  };

  const liveResult = calculateResult();

  return (
    <div className="ExamResult">
      {/* HEADER */}
      <div className="ExamResult-header">
        <div>
          <h2>Exam Result</h2>
          <p>Dashboard / Exam Result</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="ExamResult-toolbar">
        <div className="ExamResult-search">
          <FiSearch />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="ExamResult-filters">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classOptions.map((cls, i) => (
              <option key={i} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="">All Exams</option>
            {examOptions.map((exam, i) => (
              <option key={i} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="ExamResult-tableWrapper">
        <table className="ExamResult-table">
          <thead>
            <tr>
              <th>S.L</th>
              <th>Admission No</th>
              <th>Name</th>
              <th>Roll No</th>
              <th>Class</th>
              <th>Exam</th>
              <th>Grand Total</th>
              <th>Percent (%)</th>
              <th>Grade</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            ) : (
              currentRows.map((item, index) => {
                const className =
                  item.classId?.className ||
                  item.class ||
                  item.className ||
                  "N/A";

                const fullMarks =
                  item.fullMarks ||
                  item.subjects?.reduce(
                    (sum, s) => sum + (s.fullMarks || 0),
                    0,
                  ) ||
                  0;

                return (
                  <tr key={item._id}>
                    <td>{indexFirst + index + 1}</td>
                    <td>{item.admissionNo}</td>
                    <td>{item.name}</td>
                    <td>{item.rollNumber}</td>
                    <td>{className}</td>
                    <td>{item.examType}</td>
                    <td>
                      {item.total || 0} / {fullMarks}
                    </td>
                    <td>
                      {item.percentage ? item.percentage.toFixed(2) : "0.00"}
                    </td>
                    <td>{item.grade}</td>
                    <td>
                      <span className={`ExamResult-result ${item.result}`}>
                        {item.result}
                      </span>
                    </td>

                    <td>
                      <div className="ExamResult-action">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 🔥 VERY IMPORTANT
                            setMenuOpen(
                              menuOpen === item._id ? null : item._id,
                            );
                          }}
                        >
                          <FiMoreVertical />
                        </button>

                        {menuOpen === item._id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="ExamResult-dropdown"
                          >
                            {/* ✅ UPDATED VIEW */}
                            <button
                              onClick={async () => {
                                try {
                                  const res = await API.get(
                                    `/students/${item.admissionNo}`,
                                  );

                                  // console.log("API RESPONSE:", res.data);

                                  const student = res.data.data || {};

                                  // console.log("STUDENT DATA:", student);

                                  const mergedData = {
                                    ...item,

                                    name:
                                      student.name ||
                                      `${student.firstName || ""} ${student.lastName || ""}`.trim(),

                                    fatherName: student.fatherName || "",
                                    motherName: student.motherName || "",
                                    aadhaarNumber: student.aadhaarNumber || "",
                                    bloodGroup: student.bloodGroup || "",
                                    height: student.height || "",
                                    weight: student.weight || "",
                                    penNo: student.penNo || "",
                                    houseName: student.houseName || "",
                                    dob: student.dob || "",

                                    rollNumber:
                                      student.rollNumber ||
                                      item.rollNumber ||
                                      "",
                                    class:
                                      student.className ||
                                      student.class ||
                                      item.class ||
                                      "",

                                    // 🔥 ADD THIS
                                    studentPhoto: student.studentPhoto
                                      ? `${IMAGE_URL}${
                                          student.studentPhoto.path ||
                                          student.studentPhoto
                                        }`
                                      : "",
                                  };

                                  setViewData(mergedData);
                                } catch (error) {
                                  console.error("Fetch error:", error);
                                  setViewData(item);
                                }

                                setMenuOpen(null);
                              }}
                            >
                              <FiEye /> View
                            </button>

                            <button
                              onClick={() => {
                                setEditData(item); // store data
                                setEditModal(true); // open modal
                                setMenuOpen(null);
                              }}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              style={{ color: "red" }}
                              onClick={() => handleDelete(item._id)}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="ExamResult-pagination">
        <p>
          Showing {filteredData.length === 0 ? 0 : indexFirst + 1} to{" "}
          {Math.min(indexLast, filteredData.length)} of {filteredData.length}
        </p>

        <div className="pagination-controls">
          {/* FIRST */}
          <button disabled={page === 1} onClick={() => setPage(1)}>
            {"<<"}
          </button>

          {/* PREVIOUS */}
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            {"<"}
          </button>

          {/* PAGE NUMBERS (ONLY 5) */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              className={page === num ? "active" : ""}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}

          {/* NEXT */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            {">"}
          </button>

          {/* LAST */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      <ReportModal viewData={viewData} setViewData={setViewData} logo={logo} />

      {editModal && (
        <div className="ExamResult-modalOverlay">
          <div className="ExamResult-modal" style={{ width: "600px" }}>
            <h3>Edit Result</h3>

            {/* BASIC FIELDS */}
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              value={editData.rollNumber}
              onChange={(e) =>
                setEditData({ ...editData, rollNumber: e.target.value })
              }
              placeholder="Roll No"
            />

            <input
              value={editData.examType}
              onChange={(e) =>
                setEditData({ ...editData, examType: e.target.value })
              }
              placeholder="Exam Type"
            />

            {/* 🔥 SUBJECT TABLE */}
            <table style={{ width: "100%", marginTop: "10px" }}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Full Marks</th>
                </tr>
              </thead>

              <tbody>
                {editData.subjects?.map((sub, i) => (
                  <tr key={i}>
                    <td>{sub.subject}</td>

                    <td>
                      <input
                        type="number"
                        value={sub.marks}
                        onChange={(e) => {
                          const updated = [...editData.subjects];
                          updated[i].marks = e.target.value;

                          setEditData({
                            ...editData,
                            subjects: updated,
                          });
                        }}
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        value={sub.fullMarks}
                        onChange={(e) => {
                          const updated = [...editData.subjects];
                          updated[i].fullMarks = e.target.value;

                          setEditData({
                            ...editData,
                            subjects: updated,
                          });
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* 🔥 LIVE RESULT */}
            <div className="ExamResult-liveResult">
              <p>
                <strong>Total:</strong> {liveResult.totalMarks} /{" "}
                {liveResult.totalFullMarks}
              </p>

              <p>
                <strong>Percentage:</strong> {liveResult.percentage.toFixed(2)}%
              </p>

              <p>
                <strong>Grade:</strong> {liveResult.grade}
              </p>

              <p>
                <strong>Result:</strong>{" "}
                <span
                  style={{
                    color: liveResult.result === "Pass" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {liveResult.result}
                </span>
              </p>
            </div>

            <div className="ExamResult-modalActions">
              <button onClick={() => setEditModal(false)}>Cancel</button>
              <button onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResult;
