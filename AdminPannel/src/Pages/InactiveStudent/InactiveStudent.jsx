import React, { useState } from "react";
import {
  FaWheelchair,
  FaListUl,
  FaSearch,
  FaEllipsisV,
} from "react-icons/fa";
import "./InactiveStudent.css";

const InactiveStudent = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const students = [
    {
      id: 1,
      admission: "KSV 417",
      biometric: "1256398",
      roll: "3",
      name: "OM Jain",
      class: "7th C",
      dob: "12-11-1999",
      mobile: "9772119901",
      gender: "Male",
      father: "Al Jain",
      guardian: "51646546554",
      status: "5",
      note: "-",
      leaving: "-",
      tc: "Not Generated",
      inactivation: "22-01-2026 12:16 PM",
    },
    {
      id: 2,
      admission: "560",
      biometric: "",
      roll: "",
      name: "Hend Moftah",
      class: "1st A",
      dob: "22-07-2021",
      mobile: "1010101010",
      gender: "Female",
      father: "Mo",
      guardian: "1010101",
      status: "",
      note: "-",
      leaving: "-",
      tc: "Not Generated",
      inactivation: "22-01-2026 12:16 PM",
    },
  ];

  return (
    <div className="InactiveStudentsWrapper">
      {/* Header */}
      <div className="InactiveStudentsHeader">
        <div className="InactiveStudentsTitle">
          <FaWheelchair />
          <span>Inactive Students</span>
        </div>
        <div className="InactiveStudentsBreadcrumb">
          Student info / <span>Inactive Students</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="InactiveStudentsFilterCard">
        <div className="InactiveStudentsFilterTitle">
          <FaSearch />
          <span>Select Criteria</span>
        </div>

        <div className="InactiveStudentsFilterGrid">
          <div className="InactiveStudentsFormGroup">
            <label>Class</label>
            <select>
              <option>Select Option</option>
            </select>
          </div>

          <div className="InactiveStudentsFormGroup">
            <label>Section</label>
            <select>
              <option>Select Option</option>
            </select>
          </div>

          <div className="InactiveStudentsFormGroup">
            <label>Student Disabled Status</label>
            <select>
              <option>Select</option>
            </select>
          </div>

          <div className="InactiveStudentsFormGroup">
            <label>Search by Keyword</label>
            <input placeholder="Search by Admission no , Student" />
          </div>

          <div className="InactiveStudentsSearchBtnWrap">
            <button className="InactiveStudentsSearchBtn">
              <FaSearch /> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="InactiveStudentsTableCard">
        <div className="InactiveStudentsTableHeader">
          <FaListUl />
          <span>Inactive Students List</span>
        </div>

        <div className="InactiveStudentsTableControls">
          <select>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>

          <div className="InactiveStudentsSearchBox">
            <label>Search:</label>
            <input />
          </div>
        </div>

        <div className="InactiveStudentsTableWrapper">
          <table className="InactiveStudentsTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Admission No.</th>
                <th>Biometric ID</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Class</th>
                <th>Date of Birth</th>
                <th>Mobile Number</th>
                <th>Gender</th>
                <th>Father Name</th>
                <th>Guardian Phone</th>
                <th>Status</th>
                <th>Note</th>
                <th>Date of Leaving</th>
                <th>TC Status</th>
                <th>Inactivation Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.admission}</td>
                  <td>{item.biometric}</td>
                  <td>{item.roll}</td>
                  <td>{item.name}</td>
                  <td>{item.class}</td>
                  <td>{item.dob}</td>
                  <td>{item.mobile}</td>
                  <td>{item.gender}</td>
                  <td>{item.father}</td>
                  <td>{item.guardian}</td>
                  <td>{item.status}</td>
                  <td>{item.note}</td>
                  <td>{item.leaving}</td>
                  <td>{item.tc}</td>
                  <td>{item.inactivation}</td>
                  <td>
                    <div className="InactiveStudentsActionWrap">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="InactiveStudentsActionBtn"
                      >
                        Action <FaEllipsisV />
                      </button>

                      {openDropdown === index && (
                        <div className="InactiveStudentsDropdown">
                          <button>View</button>
                          <button className="InactiveStudentsDelete">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="InactiveStudentsPagination">
          <button disabled>Previous</button>
          <span className="InactiveStudentsActivePage">1</span>
          <button disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default InactiveStudent;