import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./ExamProgressReport.css";
import ProgessReports from "../../Component/ProgessReports/ProgessReports";

const ExamProgressReport = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log("REPORT DATA:", viewData);
  // 🔥 FETCH STUDENTS
  useEffect(() => {
    fetchAllResults();
  }, []);

  const fetchAllResults = async () => {
    try {
      setLoading(true);
      const res = await API.get("/exam-results");

      const map = new Map();
      res.data?.data?.forEach((s) => {
        if (!map.has(s.admissionNo)) {
          map.set(s.admissionNo, s);
        }
      });

      setStudents(Array.from(map.values()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 LIVE SEARCH (AUTO)
  useEffect(() => {
    if (!search) {
      setFiltered([]);
      return;
    }

    const data = students.filter(
      (s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNumber?.toString().includes(search),
    );

    setFiltered(data);
  }, [search, students]);

  // 🎯 SELECT STUDENT → OPEN MODAL
  const handleSelect = async (student) => {
    try {
      setSearch(student.name);
      setFiltered([]);

      const res = await API.get(`/exam-results/student/${student.admissionNo}`);

      // ✅ DO NOT FILTER — keep all subjects
      const allSubjects = res.data.subjects || [];

      setViewData({
        // ✅ student info
        ...res.data.student,

        // ✅ ALL subjects (regular + optional)
        subjects: allSubjects,

        exams: res.data.exams,
        totals: res.data.totals,

        // ✅ totals already calculated correctly in backend
        total: res.data.grandTotal,
        fullMarks: res.data.fullMarks,
        percentage: res.data.percentage,
        grade: res.data.grade,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="report-container">
      <h2>📊 Exam Progress Report</h2>

      {/* 🔍 SEARCH BOX */}
      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search student name / roll"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* 🔥 DROPDOWN */}
        {filtered.length > 0 && (
          <div className="search-dropdown">
            {filtered.map((s, i) => (
              <div
                key={i}
                className="search-item"
                onClick={() => handleSelect(s)}
              >
                {s.name} (Roll: {s.rollNumber})
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {/* 🔥 MODAL REPORT */}
      {viewData && (
        <ProgessReports
          viewData={viewData}
          setViewData={setViewData}
          logo="/logo.png" // change if needed
        />
      )}
    </div>
  );
};

export default ExamProgressReport;
