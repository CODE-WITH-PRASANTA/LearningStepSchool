import React, { useState } from "react";
import "./AddStudentlist.css";
import { FaBars, FaSearch, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

const AddStudentlist = () => {
  const [openRow, setOpenRow] = useState(null);

  const students = [
    { id:1, student:"202", lib:"45454", admission:"45454", name:"Lakh Asda", studentClass:"KSV 6th(A)", father:"Test Father", dob:"2024-05-06", gender:"Male", max:5 },
    { id:2, student:"209", lib:"20620", admission:"20620", name:"Hetashvi Choudhary", studentClass:"KSV 6th(A)", father:"ddd", dob:"2017-01-01", gender:"Female", max:5 },
    { id:3, student:"328", lib:"2025", admission:"2025", name:"Devesh", studentClass:"KSV 6th(A)", father:"Mr Haridas", dob:"2022-01-01", gender:"Male", max:5 },
    { id:4, student:"329", lib:"5575", admission:"5575", name:"Naman", studentClass:"KSV 6th(A)", father:"Gyan", dob:"2017-03-12", gender:"Male", max:5 }
  ];

  return (
    <div className="studentListPage">

      <div className="listCard">

        {/* HEADER */}
        <div className="listHeader">
          <h3><FaBars className="headIcon"/> Add Student List</h3>
        </div>

        {/* SEARCH */}
        <div className="searchRow">
          <div className="searchBox">
            <FaSearch />
            <input type="text" placeholder="Search student..." />
          </div>
        </div>

        {/* TABLE */}
        <div className="tableWrapper">
          <table className="studentTable">

            <thead>
              <tr>
                <th>Student</th>
                <th>Library Card</th>
                <th>Admission</th>
                <th>Name</th>
                <th>Class</th>
                <th>Father</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Max Book</th>
                <th className="actionHead">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s)=>(
                <tr key={s.id}>
                  <td>{s.student}</td>
                  <td>{s.lib}</td>
                  <td>{s.admission}</td>
                  <td className="nameCell">{s.name}</td>
                  <td>{s.studentClass}</td>
                  <td>{s.father}</td>
                  <td>{s.dob}</td>
                  <td>{s.gender}</td>
                  <td>{s.max}</td>

                  <td className="actionCell">
                    <button
                      className="actionBtn"
                      onClick={()=>setOpenRow(openRow===s.id?null:s.id)}
                    >
                      <FaEllipsisV/>
                    </button>

                    {openRow===s.id && (
                      <div className="actionMenu">
                        <button className="editBtn"><FaEdit/> Edit</button>
                        <button className="deleteBtn"><FaTrash/> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default AddStudentlist;
