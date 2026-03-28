import React, { useState, useEffect } from "react";
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

  // ✅ Fetch Exam Types
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

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // 🔥 add this
  };

  // ✅ Handle Submit
  const handleSubmit = async () => {
    // Basic validation
    if (!form.name || !form.roll || !form.exam) {
      setError("Please fill all fields");
      return;
    }

    // 🔥 Name validation (min 3 letters)
    if (form.name.trim().length < 3) {
      setError("Please enter at least 3 characters of the name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await API.get("/exam-results/search", {
        params: {
          name: form.name.trim(),
          roll: form.roll.trim(), // 🔥 match backend
          exam: form.exam.trim(), // 🔥 match backend
        },
      });

      const data = res.data.data;

      if (!data) {
        setError("Result not found");
        return;
      }

      setResult(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Result not found");
      } else {
        setError("Server error, try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="result-container">
      <div className="result-box">
        <h1 className="result-title">🎓 Exam Result Portal</h1>

        <div className="result-form">
          {/* ✅ NAME INPUT */}
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Enter name (min 3 characters)"
              value={form.name}
              onChange={handleChange}
              minLength={3}
              required
            />
            <small className="input-hint">
              Enter at least first 3 letters or full name
            </small>
          </div>

          {/* ✅ ROLL INPUT */}
          <div className="input-group">
            <input
              type="text"
              name="roll"
              placeholder="Enter Roll Number"
              value={form.roll}
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ EXAM SELECT */}
          <div className="input-group">
            <select
              name="exam"
              value={form.exam}
              onChange={handleChange}
              required
            >
              <option value="">Select Exam</option>
              {examTypes.map((exam) => (
                <option key={exam._id} value={exam.name}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ BUTTON */}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Checking..." : "Check Result"}
          </button>

          {/* ✅ ERROR MESSAGE */}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* ✅ RESULT MODAL */}
      {result && (
        <ReportModal viewData={result} setViewData={setResult} logo={logo} />
      )}
    </div>
  );
};

export default ResultSystem;