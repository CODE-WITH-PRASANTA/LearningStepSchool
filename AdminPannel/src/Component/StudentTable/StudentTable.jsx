import React from "react";
import "./StudentTable.css";
import { FaIdCard } from "react-icons/fa";
import { IMAGE_URL } from "../../api/axios";

const StudentTable = ({
  students,
  selectedStudents,
  setSelectedStudents,
  onGenerate,
}) => {
  const isSelected = (_id) =>
    selectedStudents.some((student) => student._id === _id);

  const getStudentPhoto = (studentPhoto) => {
    if (!studentPhoto) return "";
    if (/^https?:\/\//i.test(studentPhoto)) return studentPhoto;
    return `${IMAGE_URL}/${studentPhoto.replace(/^\/+/, "")}`;
  };

  /* ============================================= */

  const handleSelect = (student) => {
    if (isSelected(student._id)) {
      setSelectedStudents(
        selectedStudents.filter((item) => item._id !== student._id),
      );

      return;
    }

    if (selectedStudents.length >= 9) {
      alert("You can generate only 9 ID Cards at one time.");

      return;
    }

    setSelectedStudents([...selectedStudents, student]);
  };

  /* ============================================= */

 const handleSelectAll = () => {
  if (selectedStudents.length === students.length) {
    setSelectedStudents([]);
    return;
  }

  if (students.length > 9) {
    alert("Only first 9 students will be selected.");
  }

  setSelectedStudents(students.slice(0, 9));
};

  return (
    <div className="StudentTable">
      <div className="StudentTable-header">
        <div>
          <h3>Student ID Card List</h3>

          <p>Total Students : {students.length}</p>
        </div>

        <button
          className="StudentTable-generateBtn"
          onClick={onGenerate}
          disabled={selectedStudents.length === 0}
        >
          <FaIdCard />
          Generate ID Card
        </button>
      </div>

      <div className="StudentTable-tableWrapper">
        <table className="StudentTable-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedStudents.length === students.length &&
                    students.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>

              <th>Admission No</th>

              <th>Roll No</th>

              <th>Student Name</th>

              <th>Class</th>

              <th>Section</th>

              <th>Father Name</th>

              <th>Mother Name</th>

              <th>Phone</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected(student._id)}
                      onChange={() => handleSelect(student)}
                    />
                  </td>

                  <td>{student.admissionNo}</td>

                  <td>{student.rollNo}</td>

                  <td>
                    <div className="StudentTable-studentInfo">
                      <img
                        src={getStudentPhoto(student.studentPhoto)}
                        alt={student.studentName}
                      />

                      <span>{student.studentName}</span>
                    </div>
                  </td>

                  <td>{student.className}</td>

                  <td>{student.section}</td>

                  <td>{student.fatherName}</td>

                  <td>{student.motherName}</td>

                  <td>{student.phone}</td>

                  <td>
                   <span className={`StudentTable-status ${student.status}`}>
    {student.status}
</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="StudentTable-empty">
                  No Students Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="StudentTable-footer">
        <div>
          Selected Students :<strong> {selectedStudents.length}</strong> / 9
        </div>
      </div>
    </div>
  );
};

export default StudentTable;
