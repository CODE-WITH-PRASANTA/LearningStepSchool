import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function ExamResultAdmin() {
  const [students, setStudents] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [results, setResults] = useState([]);
  const [examTypes, setExamTypes] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [examType, setExamType] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  /* ================= FETCH ================= */

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data.data || []);
  };

  const fetchSubjects = async () => {
    const res = await API.get("/classwise-subjects");
    setClassSubjects(res.data.data || []);
  };

  const fetchResults = async () => {
    const res = await API.get("/exam-results");
    setResults(res.data.data || []);
  };

  const fetchExamTypes = async () => {
    const res = await API.get("/exam-types");
    const published = (res.data.data || []).filter(e => e.isPublished);
    setExamTypes(published);
  };

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchResults();
    fetchExamTypes();
  }, []);

  /* ================= FILTER STUDENTS ================= */

  const filteredStudents = students.filter((s) =>
    (s.firstName + " " + s.lastName)
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    String(s.rollNumber || "").includes(search)
  );

  /* ================= SELECT STUDENT ================= */

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setSearch(`${student.firstName} ${student.lastName}`);
    setShowDropdown(false);

    const found = classSubjects.find((c) => {
      const className = c.classId?.className || "";
      return String(className).trim() === String(student.class).trim();
    });

    if (found && found.subjects?.length > 0) {
      setSubjects(
        found.subjects.map((sub) => ({
          subject: sub,
          marks: 0,
          fullMarks: 100,
        }))
      );
    } else {
      setSubjects([]);
    }
  };

  /* ================= MARK ================= */

  const handleMarksChange = (index, value) => {
    const updated = [...subjects];
    let marks = Number(value);

    if (marks < 0) marks = 0;
    if (marks > updated[index].fullMarks)
      marks = updated[index].fullMarks;

    updated[index].marks = marks;
    setSubjects(updated);
  };

  const handleFullMarksChange = (index, value) => {
    const updated = [...subjects];
    let full = Number(value);

    if (full < 1) full = 1;

    updated[index].fullMarks = full;

    if (updated[index].marks > full) {
      updated[index].marks = full;
    }

    setSubjects(updated);
  };

  /* ================= CALC ================= */

  const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
  const totalFullMarks = subjects.reduce((sum, s) => sum + s.fullMarks, 0);

  const percentage = totalFullMarks
    ? (totalMarks / totalFullMarks) * 100
    : 0;

  const getGrade = () => {
    if (percentage >= 90) return "A+";
    if (percentage >= 75) return "A";
    if (percentage >= 60) return "B";
    if (percentage >= 40) return "C";
    return "F";
  };

  const getResult = () =>
    subjects.some(s => s.marks < s.fullMarks * 0.35)
      ? "Fail"
      : "Pass";

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStudent || !examType) {
      alert("Select student and exam type");
      return;
    }

    const payload = {
      admissionNo: selectedStudent.admissionNo,
      name: selectedStudent.firstName + " " + selectedStudent.lastName,
      rollNumber: selectedStudent.rollNumber,
      classId: selectedStudent.classId || null,
      class: selectedStudent.class,
      examType,
      subjects,
      total: totalMarks,
      fullMarks: totalFullMarks,
      percentage,
      grade: getGrade(),
      result: getResult(),
    };

    try {
      if (editId) {
        await API.put(`/exam-results/${editId}`, payload);
      } else {
        await API.post("/exam-results", payload);
      }

      fetchResults();

      setSelectedStudent(null);
      setSubjects([]);
      setExamType("");
      setEditId(null);
      setSearch("");

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */

  const editResult = (res) => {
    setSelectedStudent({
      _id: res._id,
      admissionNo: res.admissionNo,
      firstName: res.name,
      lastName: "",
      rollNumber: res.rollNumber,
      classId: res.classId,
      class: res.class,
    });

    setSearch(res.name);
    setSubjects(res.subjects || []);
    setExamType(res.examType || "");
    setEditId(res._id);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Exam Result Management
      </h1>

      <form className="bg-white p-6 rounded shadow space-y-4 mb-8" onSubmit={handleSubmit}>

        <h2 className="text-lg font-semibold">
          {editId ? "Edit Result" : "Add Result"}
        </h2>

        {/* 🔍 SEARCH STUDENT */}
        <input
          type="text"
          placeholder="Search Student (Name / Roll)"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full border p-2 rounded"
        />

        {/* DROPDOWN */}
        {showDropdown && search && (
          <div className="border rounded max-h-40 overflow-y-auto bg-white">
            {filteredStudents.length === 0 ? (
              <div className="p-2">No Student Found</div>
            ) : (
              filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleStudentSelect(s)}
                >
                  {s.firstName} {s.lastName} (Roll: {s.rollNumber})
                </div>
              ))
            )}
          </div>
        )}

        {/* EXAM TYPE */}
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((e) => (
            <option key={e._id} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>

        {/* SUBJECTS */}
        {subjects.length > 0 && (
          <div className="border rounded p-4 space-y-3">

            {subjects.map((sub, index) => (
              <div key={index} className="flex gap-2 border p-2 rounded">
                <div className="w-1/3">{sub.subject}</div>

                <input
                  type="number"
                  value={sub.marks}
                  onChange={(e) =>
                    handleMarksChange(index, e.target.value)
                  }
                  className="w-1/3 border p-2 rounded"
                />

                <input
                  type="number"
                  value={sub.fullMarks}
                  onChange={(e) =>
                    handleFullMarksChange(index, e.target.value)
                  }
                  className="w-1/3 border p-2 rounded"
                />
              </div>
            ))}

            <div className="bg-gray-50 p-3 rounded">
              <p><b>Total:</b> {totalMarks} / {totalFullMarks}</p>
              <p><b>Percentage:</b> {percentage.toFixed(2)}%</p>
              <p><b>Grade:</b> {getGrade()}</p>
              <p><b>Result:</b> {getResult()}</p>
            </div>

          </div>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Result" : "Save Result"}
        </button>

      </form>

      {/* RESULT LIST SAME */}
      {/* <div className="space-y-4">
        {results.map((res) => (
          <div key={res._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-bold">
              {res.name} (Roll: {res.rollNumber})
            </h3>

            <p>Exam: {res.examType}</p>

            {res.subjects?.map((sub, i) => (
              <div key={i} className="flex justify-between">
                <span>{sub.subject}</span>
                <span>{sub.marks} / {sub.fullMarks}</span>
              </div>
            ))}

            <p className="mt-2">
              <b>Total:</b> {res.total} / {res.fullMarks}
            </p>

            <p><b>Grade:</b> {res.grade}</p>
            <p><b>Result:</b> {res.result}</p>

            <div className="flex gap-3 mt-2">
              <button onClick={() => editResult(res)} className="text-yellow-600">Edit</button>
              <button onClick={() => deleteResult(res._id)} className="text-red-600">Delete</button>
            </div>

          </div>
        ))}
      </div> */}

    </div>
  );
}