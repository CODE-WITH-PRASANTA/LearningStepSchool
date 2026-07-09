import React, { useState } from "react";
import "./CancelFeeReceipt.css";
import { FaSearch, FaUserGraduate } from "react-icons/fa";

const CancelFeeReceipt = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const students = [
    {
      id: 1,
      srNo: 690,
      admNo: "IQRA590",
      enrollNo: "",
      name: "ASHMIN PRAVEEN",
      dob: "05-07-2020",
      mobile: "7080063779",
      fatherName: "GAFUR ANSARI",
      type: "New",
      className: "NURSERY-A",
      feeType: "day_scholar",
      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
    },
    {
      id: 2,
      srNo: 658,
      admNo: "IQRA558",
      enrollNo: "",
      name: "Asmin Khatun",
      dob: "16-12-2020",
      mobile: "5465454585",
      fatherName: "Mohammad Nijam",
      type: "Old",
      className: "NURSERY-A",
      feeType: "day_scholar",
      image:
        "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    },
  ];

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cancelFeeReceipt">

      {/* Search Section */}
      <div className="cancelFeeReceipt__searchWrapper">
        <div className="cancelFeeReceipt__searchBox">
          <FaSearch className="cancelFeeReceipt__searchIcon" />
          <input
            type="text"
            placeholder="Search Student Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="cancelFeeReceipt__searchInput"
          />
        </div>
      </div>

      {/* Default Card */}
      {!searchTerm && (
        <div className="cancelFeeReceipt__defaultCard">

          <div className="cancelFeeReceipt__leftInfo">
            <div className="cancelFeeReceipt__field">
              <span>Enroll No :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Name :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Class :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Father's Name :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Mother's Name :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Mobile No. :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Address :</span>
            </div>
          </div>

          <div className="cancelFeeReceipt__rightInfo">
            <FaUserGraduate className="cancelFeeReceipt__studentIcon" />

            <div className="cancelFeeReceipt__field">
              <span>Stu Type :</span>
            </div>

            <div className="cancelFeeReceipt__field">
              <span>Fee Type :</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Result */}
      {searchTerm && (
        <div className="cancelFeeReceipt__resultWrapper">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                className="cancelFeeReceipt__studentCard"
                key={student.id}
              >
                <div className="cancelFeeReceipt__studentImageSection">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="cancelFeeReceipt__studentImage"
                  />
                </div>

                <div className="cancelFeeReceipt__studentContent">

                  <div className="cancelFeeReceipt__column">
                    <p>
                      <strong>Sr.No. :</strong> {student.srNo}
                    </p>

                    <p>
                      <strong>Enroll No. :</strong>{" "}
                      {student.enrollNo || "-"}
                    </p>

                    <p>
                      <strong>Name :</strong> {student.name}
                    </p>

                    <p>
                      <strong>DOB :</strong> {student.dob}
                    </p>

                    <p>
                      <strong>Mob.No. :</strong> {student.mobile}
                    </p>

                    <p>
                      <strong>Father's Name :</strong>{" "}
                      {student.fatherName}
                    </p>
                  </div>

                  <div className="cancelFeeReceipt__column">
                    <p>
                      <strong>Adm No. :</strong> {student.admNo}
                    </p>

                    <p>
                      <strong>Type :</strong> {student.type}
                    </p>

                    <p>
                      <strong>Class :</strong> {student.className}
                    </p>

                    <p>
                      <strong>Fee Type :</strong> {student.feeType}
                    </p>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="cancelFeeReceipt__noData">
              No Student Found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CancelFeeReceipt;