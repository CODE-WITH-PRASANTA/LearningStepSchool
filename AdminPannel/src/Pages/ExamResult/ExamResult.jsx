import React, { useEffect, useState } from "react";
import "./ExamResult.css";
import API from "../../api/axios";
import { FiMoreVertical, FiSearch, FiEye } from "react-icons/fi";
import logo from "../../Assets/Learning-Step-Logo-1.png";
import html2pdf from "html2pdf.js";

const th = {
  border: "1px solid #000",
  padding: "4px",              // ✅ compact
  textAlign: "center",
  background: "#f3f4f6",
  fontSize: "12px",
  lineHeight: "1.2",
  fontWeight: "600",
};

const td = {
  border: "1px solid #000",
  padding: "5px",              // ✅ compact
  textAlign: "center",
  fontSize: "12px",
  lineHeight: "1.2",
};

const btn = {
  padding: "10px 15px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const ExamResult = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [viewData, setViewData] = useState(null);

  const rowsPerPage = 5;

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

  /* ================= SEARCH ================= */
  const filteredData = results.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.admissionNo || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.examType || "").toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexLast = page * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;
  const currentRows = filteredData.slice(indexFirst, indexLast);

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

        <div className="ExamResult-rows">
          Rows per page:
          <select>
            <option>10</option>
            <option>20</option>
            <option>50</option>
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
                  No Data Found
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
                    <td className="ExamResult-admission">{item.admissionNo}</td>
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
                          className="ExamResult-actionBtn"
                          onClick={() =>
                            setMenuOpen(menuOpen === item._id ? null : item._id)
                          }
                        >
                          <FiMoreVertical />
                        </button>

                        {menuOpen === item._id && (
                          <div className="ExamResult-dropdown">
                            <button onClick={() => setViewData(item)}>
                              <FiEye /> View
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
          {Math.min(indexLast, filteredData.length)} of {filteredData.length}{" "}
          entries
        </p>

        <div>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            {"<"}
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
     {viewData && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      zIndex: 1000,
      overflowY: "auto",
      padding: "30px 10px",
    }}
  >
    {/* A4 CARD */}
    <div
      id="printArea"
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm",
        borderRadius: "10px",
        fontFamily: "'Segoe UI', sans-serif",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          textAlign: "center",
          marginBottom: "15px",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{ width: "60px", height: "60px", objectFit: "contain" }}
        />

        <div>
          <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: "20px" }}>
            Learning Step International School
          </h1>
          <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
            Academic Progress Report
          </p>
        </div>
      </div>

      <hr />

      {/* STUDENT INFO */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "15px",
          background: "#f9fafb",
          padding: "10px",
          borderRadius: "6px",
          marginBottom: "15px",
          fontSize: "14px",
        }}
      >
        <div>
          <p><b>Name:</b> {viewData.name}</p>
          <p><b>Admission:</b> {viewData.admissionNo}</p>
          <p><b>Roll:</b> {viewData.rollNumber}</p>
        </div>

        <div>
          <p><b>Class:</b> {viewData.class || viewData.classId?.className}</p>
          <p><b>Exam:</b> {viewData.examType}</p>
          <p><b>Date:</b> {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* ✅ PERFECT TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr style={{ background: "#e5e7eb" }}>
            <th style={{ ...th, width: "1%" }}>Subject</th>
            <th style={{ ...th, width: "1%" }}>Marks</th>
            <th style={{ ...th, width: "1%" }}>Full Marks</th>
            <th style={{ ...th, width: "1%" }}>Result</th>
          </tr>
        </thead>

        <tbody>
          {viewData.subjects?.map((sub, i) => {
            const fail = sub.marks < sub.fullMarks * 0.35;

            return (
              <tr key={i}>
                <td
                  style={{
                    ...td,
                    wordWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {sub.subject}
                </td>

                <td style={td}>{sub.marks}</td>
                <td style={td}>{sub.fullMarks}</td>

                <td
                  style={{
                    ...td,
                    color: fail ? "#dc2626" : "#16a34a",
                    fontWeight: "600",
                  }}
                >
                  {fail ? "Fail" : "Pass"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* SUMMARY */}
      <div
        style={{
          marginTop: "15px",
          padding: "10px",
          background: "#f3f4f6",
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px",
          fontSize: "13px",
        }}
      >
        <p><b>Total:</b> {viewData.total} / {viewData.fullMarks}</p>
        <p><b>Percentage:</b> {viewData.percentage?.toFixed(2)}%</p>
        <p><b>Grade:</b> {viewData.grade}</p>
        <p>
          <b>Result:</b>{" "}
          <span style={{ color: viewData.result === "Fail" ? "red" : "green" }}>
            {viewData.result}
          </span>
        </p>
      </div>

      {/* REMARK */}
      <div style={{ marginTop: "10px", fontSize: "13px" }}>
        <p><b>Teacher Remark:</b> Keep improving and stay consistent.</p>
      </div>

      {/* SIGNATURE */}
      <div
        style={{
          marginTop: "60px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          fontSize: "13px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "120px" }} />
          <p>Class Teacher</p>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "120px" }} />
          <p>Principal</p>
        </div>
      </div>
    </div>

    {/* BUTTONS */}
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        gap: "10px",
      }}
    >
      {/* PDF */}
      <button
        style={{ ...btn, background: "green" }}
        onClick={() => {
          html2pdf()
            .set({
              margin: 10,
              filename: `${viewData.name}_Report.pdf`,
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a4" },
            })
            .from(document.getElementById("printArea"))
            .save();
        }}
      >
        PDF
      </button>

      {/* PRINT */}
      <button style={btn} onClick={() => window.print()}>
        Print
      </button>

      {/* CLOSE */}
      <button
        style={{ ...btn, background: "black" }}
        onClick={() => setViewData(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default ExamResult;
