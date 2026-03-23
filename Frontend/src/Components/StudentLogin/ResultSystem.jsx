import React, { useState, useEffect, useRef } from "react";
import "./ResultSystem.css";
import API from "../../Api/Api";
import logo from "../../assets/LearningStepLogo.png";
import ReportModal from "../ReportModal/ReportModal";

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
        <ReportModal viewData={result} setViewData={setResult} logo={logo} />
      )}
    </div>
  );
};

export default ResultSystem;
