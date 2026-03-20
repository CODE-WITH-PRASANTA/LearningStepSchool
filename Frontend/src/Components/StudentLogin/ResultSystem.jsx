import React, { useState, useEffect, useRef } from "react";
import "./ResultSystem.css";
import API from "../../Api/Api";
import html2pdf from "html2pdf.js";

const ResultSystem = () => {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    exam: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examTypes, setExamTypes] = useState([]);
  const [error, setError] = useState("");

  const resultRef = useRef();
  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const res = await API.get("/exam-types/published");
        setExamTypes(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExamTypes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.roll || !form.exam) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await API.get("/exam-results/search", {
        params: form,
      });

      setResult(res.data.data);
    } catch (err) {
      setError("Result not found");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = resultRef.current.innerHTML;
    const newWindow = window.open("", "_blank");

    newWindow.document.write(`
      <html>
        <head>
          <title>Marksheet</title>
        </head>
        <body>${printContent}</body>
      </html>
    `);

    newWindow.document.close();
    newWindow.print();
  };

  const handleDownloadPDF = () => {
    html2pdf().from(resultRef.current).save(`${result.name}_Marksheet.pdf`);
  };

  return (
    <div className="result-container">
      <div className="result-box">
        <h1 className="result-title">🎓 Exam Result Portal</h1>

        <div className="result-form">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="roll"
            placeholder="Enter Roll Number"
            value={form.roll}
            onChange={handleChange}
          />

          <select name="exam" value={form.exam} onChange={handleChange}>
            <option value="">Select Exam</option>
            {examTypes.map((exam) => (
              <option key={exam._id} value={exam.name}>
                {exam.name}
              </option>
            ))}
          </select>

          <button onClick={handleSubmit}>
            {loading ? "Loading..." : "Check Result"}
          </button>

          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* ✅ MODAL */}
      {result && (
        <div className="modal-overlay">
          <div className="modal-content premium-modal">
            <div className="modal-top">
              <h3>📄 Result Preview</h3>
              <span className="close-btn" onClick={() => setResult(null)}>
                ✖
              </span>
            </div>

            <div className="action-buttons premium-actions">
              <button onClick={handlePrint}>🖨️ Print</button>
              <button onClick={handleDownloadPDF}>📄 Download</button>
            </div>

            {/* ✅ SCROLLABLE AREA */}
            <div className="marksheet-container">
              <div className="marksheet a4-page" ref={resultRef}>
                <div className="marksheet-header premium-header">
                  <div className="marksheet-title">
                    <h2>Academic Report Card</h2>
                  </div>
                  <h1 className="school-name">
                    Learning Step International School
                  </h1>
                  <p className="school-address">
                    Tehla Bypass, Alwar Road, Rajgarh – 301408
                  </p>
                </div>

                <div className="marksheet-info premium-info">
                  <div>
                    <strong>Name:</strong> {result.name}
                  </div>
                  <div>
                    <strong>Roll:</strong> {result.rollNumber}
                  </div>
                  <div>
                    <strong>Class:</strong> {result.class}
                  </div>
                  <div>
                    <strong>Exam:</strong> {result.examType}
                  </div>
                </div>

                <table className="marksheet-table premium-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Full Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.subjects.map((sub, i) => (
                      <tr key={i}>
                        <td>{sub.subject}</td>
                        <td>{sub.marks}</td>
                        <td>{sub.fullMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="marksheet-summary premium-summary">
                  <div>Total: {result.total}</div>
                  <div>Percentage: {result.percentage.toFixed(2)}%</div>
                  <div>Grade: {result.grade}</div>
                  <div className={result.result === "Pass" ? "pass" : "fail"}>
                    {result.result}
                  </div>
                </div>

                <div className="marksheet-footer premium-footer">
                  <div>
                    <p>__________________</p>
                    <p>Class Teacher</p>
                  </div>
                  <div>
                    <p>__________________</p>
                    <p>Principal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultSystem;
