import React, { useState, useEffect } from "react";
import "./ResultSystem.css";
import API from "../../Api/Api";
import logo from "../../assets/LearningStepLogo.png";
import ReportModal from "../ReportModal/ReportModal";

const ResultSystem = () => {
  const [searchType, setSearchType] = useState("roll");

  const [form, setForm] = useState({
    name: "",
    roll: "",
    exam: "",
    className: "",
    dob: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examTypes, setExamTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examRes, classRes] = await Promise.all([
          API.get("/exam-types/published"),
          API.get("/classes"),
        ]);

        setExamTypes(examRes.data.data || []);
        setClasses(classRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ✅ Switch Modes
  const switchToRoll = () => {
    setSearchType("roll");
    setForm({ ...form, className: "", dob: "" });
    setError("");
  };

  const switchToDetails = () => {
    setSearchType("details");
    setForm({ ...form, roll: "" });
    setError("");
  };

  // ✅ Submit
  const handleSubmit = async () => {
    // ✅ VALIDATION
    if (searchType === "roll") {
      if (!form.name || !form.roll || !form.exam) {
        setError("Please fill all fields");
        return;
      }
    } else {
      if (!form.name || !form.className || !form.dob || !form.exam) {
        setError("Please fill all fields");
        return;
      }
    }

    if (form.name.trim().length < 3) {
      setError("Enter at least 3 characters of name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      let params = {};

      if (searchType === "roll") {
        params = {
          name: form.name.trim(),
          roll: form.roll.trim(),
          exam: form.exam,
        };
      } else {
        params = {
          name: form.name.trim(),
          className: form.className,
          dob: form.dob,
          exam: form.exam,
        };
      }

      const res = await API.get("/exam-results/search", { params });

      if (!res.data?.data) {
        setError("Result not found");
        return;
      }

      setResult(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Result not found");
      } else {
        setError("Server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="result-container">
      <div className="result-box">
        <h1 className="result-title">🎓 Exam Result Portal</h1>

        {/* Toggle */}
        <div className="search-toggle">
          <button
            className={searchType === "roll" ? "active" : ""}
            onClick={switchToRoll}
          >
            Roll Search
          </button>
          <button
            className={searchType === "details" ? "active" : ""}
            onClick={switchToDetails}
          >
            Without Roll
          </button>
        </div>

        <div className="result-form">

          {/* NAME */}
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Enter name (min 3 characters)"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* ROLL INPUT */}
          {searchType === "roll" && (
            <div className="input-group">
              <input
                type="text"
                name="roll"
                placeholder="Enter Roll Number"
                value={form.roll}
                onChange={handleChange}
              />
            </div>
          )}

          {/* WITHOUT ROLL */}
          {searchType === "details" && (
            <>
              <div className="input-group">
                <select
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls.className}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* EXAM */}
          <div className="input-group">
            <select
              name="exam"
              value={form.exam}
              onChange={handleChange}
            >
              <option value="">Select Exam</option>
              {examTypes.map((exam) => (
                <option key={exam._id} value={exam.name}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Checking..." : "Check Result"}
          </button>

          {/* ERROR */}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* RESULT MODAL */}
      {result && (
        <ReportModal viewData={result} setViewData={setResult} logo={logo} />
      )}
    </div>
  );
};

export default ResultSystem;