import "./Studentattendance.css";
import API from "../../api/axios";
import React, { useState, useEffect } from "react";

const StudentAttendance = () => {
  const [criteria, setCriteria] = useState({
  className: "",
  section: "",
  attendance: "All",
  date: "",
});

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);

  /* ================= LOAD CLASSES ================= */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClasses();
  }, []);

  /* ================= LOAD ALL STUDENTS FIRST ================= */
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true);

        const res = await API.get("/students"); // 🔥 NO FILTER

        const students = res.data?.data || [];

        const formatted = students.map((stu) => ({
          id: stu._id,
          admission: stu.admissionNo,
          roll: stu.rollNumber,
          name: `${stu.firstName || ""} ${stu.lastName || ""}`.trim(),
          attendance: "Present",
          note: "",
          class: stu.class,
          section: stu.section,
        }));

        setData(formatted);
      } catch (err) {
        console.error("FETCH ALL ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  /* ================= ATTENDANCE CHANGE ================= */
  const handleAttendanceChange = (id, value) => {
    setData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attendance: value } : s)),
    );
  };


 const handleSearch = async () => {
  if (!criteria.date || !criteria.className || !criteria.section) {
    alert("Select Class, Section & Date");
    return;
  }

  try {
    setLoading(true);

    const res = await API.get("/attendance", {
      params: {
        className: criteria.className,
        section: criteria.section,
        date: criteria.date,
      },
    });

    const attendance = res.data?.data;

    setData((prev) =>
      prev.map((stu) => {
        const found = attendance?.students?.find(
          (s) => String(s.studentId) === String(stu.id)
        );

        return {
          ...stu,
          attendance: found?.status || "Present",
          note: found?.note || "",
        };
      })
    );
  } catch (err) {
    console.error(err);
    alert("Failed to load attendance");
  } finally {
    setLoading(false);
  }
};

  /* ================= SAVE ================= */
const saveAttendance = async () => {
  if (!criteria.date || !criteria.className || !criteria.section) {
    alert("Select Class, Section & Date");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      className: criteria.className,
      section: criteria.section,
      date: criteria.date,
      students: data
        .filter(
          (s) =>
            s.class === criteria.className &&
            s.section === criteria.section
        )
        .map((s) => ({
          studentId: s.id,
          name: s.name,
          rollNumber: s.roll,
          status: s.attendance,
          note: s.note,
        })),
    };

    await API.post("/attendance", payload);

    alert("✅ Attendance Saved Successfully");
  } catch (err) {
    console.error(err);
    alert("❌ Save failed");
  } finally {
    setLoading(false);
  }
};


const filtered = data.filter((s) => {
  return (
    (!criteria.className || s.class === criteria.className) &&
    (!criteria.section || s.section === criteria.section) &&
    (criteria.attendance === "All" ||
      s.attendance === criteria.attendance) &&
    (s.name || "").toLowerCase().includes(search.toLowerCase())
  );
});


  return (
    <div className="StudentAttendance-container">
      {loading && (
        <div style={{ textAlign: "center", padding: "10px" }}>
          🔄 Loading students...
        </div>
      )}

      <div className="StudentAttendance-card">
        <div className="StudentAttendance-cardHeader">
          🔎 Select Criteria
        </div>

        <div className="StudentAttendance-formGrid">
          <div>
            <label>Class *</label>
          <select
              value={criteria.className}
              onChange={(e) =>
                setCriteria({ ...criteria, className: e.target.value })
              }
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Section *</label>
            <select
              value={criteria.section}
              onChange={(e) =>
                setCriteria({ ...criteria, section: e.target.value })
              }
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div>
            <label>Attendance</label>
            <select
              value={criteria.attendance}
              onChange={(e) =>
                setCriteria({ ...criteria, attendance: e.target.value })
              }
            >
              <option>All</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
            </select>
          </div>

          <div>
            <label>Attendance Date</label>
            <input
              type="date"
              value={criteria.date}
              onChange={(e) =>
                setCriteria({ ...criteria, date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="StudentAttendance-searchRow">
          <button
            className="StudentAttendance-btnSearch"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "🔍 Load Attendance"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="StudentAttendance-card">
        <div className="StudentAttendance-cardHeader">
          📋 Student Attendance List
          <div className="StudentAttendance-headerBtns">
            <button onClick={saveAttendance} disabled={filtered.length === 0 || loading}>
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>

        <div className="StudentAttendance-toolbar">
          <div>
            Search :
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="StudentAttendance-tableWrapper">
          <table className="StudentAttendance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ADMISSION NO.</th>
                <th>ROLL NUMBER</th>
                <th>NAME</th>
                <th>CLASS</th>
                <th>SECTION</th> 
                <th>ATTENDANCE</th>
                <th>NOTE</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="StudentAttendance-empty">
                    🚫 No students found
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.admission}</td>
                    <td>{s.roll}</td>
                    <td>{s.name}</td>

                   
                    <td>{s.class}</td>

                    
                    <td>{s.section}</td>

                    <td>
                      <select
                        value={s.attendance}
                        onChange={(e) =>
                          handleAttendanceChange(s.id, e.target.value)
                        }
                      >
                        <option>Present</option>
                        <option>Absent</option>
                        <option>Leave</option>
                      </select>
                    </td>

                    <td>
                      <input
                        value={s.note}
                        onChange={(e) =>
                          setData((prev) =>
                            prev.map((st) =>
                              st.id === s.id
                                ? { ...st, note: e.target.value }
                                : st,
                            ),
                          )
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="StudentAttendance-footer">
          Showing {filtered.length} students
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
