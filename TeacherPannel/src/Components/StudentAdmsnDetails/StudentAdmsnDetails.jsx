import React, { useState, useEffect } from "react";
import "./StudentAdmsnDetails.css";
import API, { IMAGE_URL } from "../../api/axios";
import StudentPrintForm from "./StudentPrintForm";

export default function StudentAdmsnDetails() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [student, setStudent] = useState(null);

  const [nameSearch, setNameSearch] = useState("");
  const [rollSearch, setRollSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/students");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.students || res.data.data || [];

        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (!Array.isArray(students)) return;

    let filtered = [...students];

    if (nameSearch) {
      filtered = filtered.filter((s) =>
        `${s.firstName || ""} ${s.lastName || ""}`
          .toLowerCase()
          .includes(nameSearch.toLowerCase()),
      );
    }

    if (rollSearch) {
      filtered = filtered.filter((s) =>
        String(s.rollNumber || "").includes(rollSearch),
      );
    }

    setFilteredStudents(filtered);
  }, [nameSearch, rollSearch, students]);

  const handleEdit = () => {
    if (!student?._id) return;

    localStorage.setItem("editStudentId", student._id);

    window.location.href = "/student/admission";
  };



  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this student?")) return;

  try {
    await API.delete(`/students/${id}`);

    // remove from UI instantly
    setStudents((prev) => prev.filter((s) => s._id !== id));
    setFilteredStudents((prev) => prev.filter((s) => s._id !== id));

    if (student?._id === id) {
      setStudent(null);
    }

    alert("Student deleted successfully ✅");
  } catch (err) {
    console.error(err);
    alert("Delete failed ❌");
  }
};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="Student-Details-Wrapper">
      {/* LEFT PANEL */}
      <div className="Student-Search-Panel">
        <h2>Search Student</h2>

        <input
          type="text"
          placeholder="Search by Name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="Student-Search-Input"
        />

        <input
          type="text"
          placeholder="Search by Roll Number"
          value={rollSearch}
          onChange={(e) => setRollSearch(e.target.value)}
          className="Student-Search-Input"
        />

        <div className="Student-Table-Wrapper">
          <table className="Student-Table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll</th>
                <th>Class</th>
                <th>Action</th> 
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((s, index) => (
                <tr
                  key={s._id}
                  onClick={() => setStudent(s)}
                  className={`Student-Table-Row ${
                    student?._id === s._id ? "active" : ""
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>
                    {s.firstName} {s.lastName}
                  </td>
                  <td>{s.rollNumber}</td>
                  <td>{s.class}</td>

                  {/* ✅ ACTION BUTTON */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="Student-Delete-Btn"
                      onClick={() => handleDelete(s._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="Student-Details-Page">
        {!student ? (
          <p>Select a student to view details</p>
        ) : (
          <div className="Student-Details-Scroll">
            {/* HEADER */}
            <div className="Student-Header">
              <div className="Student-Photo">
                {student.studentPhoto ? (
                  <img
                    src={
                      student.studentPhoto.startsWith("http")
                        ? student.studentPhoto
                        : `${IMAGE_URL}${student.studentPhoto}`
                    }
                    alt="student"
                    className="Student-Photo-Image"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="Student-Photo-Placeholder">No Photo</div>
                )}
              </div>

              <div>
                <h1 className="Student-Details-Title">
                  {student.firstName} {student.lastName}
                </h1>
                <p>
                  Class {student.class} • Roll {student.rollNumber}
                </p>
              </div>

              <button className="Student-Edit-Btn" onClick={handleEdit}>
                Edit
              </button>
              <button className="Student-Edit-Btn" onClick={handlePrint}>
                Print
              </button>
            </div>

            {/* STUDENT DETAILS */}

            <Section title="Student Information">
              <Detail label="Admission No" value={student.admissionNo} />
              <Detail label="Class" value={student.class} />
              <Detail label="Section" value={student.section} />
              <Detail label="Roll Number" value={student.rollNumber} />
              <Detail label="Biometric ID" value={student.biometricId} />
              <Detail label="Admission Date" value={student.admissionDate} />
              <Detail label="Gender" value={student.gender} />
              <Detail label="DOB" value={student.dob} />
              <Detail label="Category" value={student.category} />
              <Detail label="Religion" value={student.religion} />
              <Detail label="Caste" value={student.caste} />
              <Detail label="Mobile" value={student.mobile} />
              <Detail label="Email" value={student.email} />
              <Detail label="Blood Group" value={student.bloodGroup} />
              <Detail label="House" value={student.house} />
              <Detail label="Sponsor" value={student.sponsor} />
              <Detail label="Height" value={student.height} />
              <Detail label="Weight" value={student.weight} />
              <Detail label="Aadhar Number" value={student.aadharNumber} />
            </Section>

            <Section title="Custom Fields">
              <Detail label="PEN" value={student.pen} />
              <Detail label="SR No" value={student.srNo} />
              <Detail label="APAAR ID" value={student.apaarId} />
              <Detail
                label="Student Behaviour"
                value={student.studentBehaviour?.join(", ")}
              />
            </Section>

            <Section title="Father Details">
              <Detail label="Father Name" value={student.fatherName} />
              <Detail label="Father Phone" value={student.fatherPhone} />
              <Detail label="Father DOB" value={student.fatherDob} />
              <Detail label="Occupation" value={student.fatherOccupation} />
              <Detail
                label="Marriage Anniversary"
                value={student.marriageAnniversary}
              />
            </Section>

            <Section title="Mother Details">
              <Detail label="Mother Name" value={student.motherName} />
              <Detail label="Mother Phone" value={student.motherPhone} />
              <Detail label="Mother DOB" value={student.motherDob} />
              <Detail label="Occupation" value={student.motherOccupation} />
            </Section>

            <Section title="Guardian Details">
              <Detail label="Guardian Type" value={student.guardianType} />
              <Detail label="Guardian Name" value={student.guardianName} />
              <Detail
                label="Guardian Relation"
                value={student.guardianRelation}
              />
              <Detail label="Guardian Email" value={student.guardianEmail} />
              <Detail label="Guardian Phone" value={student.guardianPhone} />
              <Detail
                label="Guardian Occupation"
                value={student.guardianOccupation}
              />
              <Detail
                label="Guardian Address"
                value={student.guardianAddress}
              />
            </Section>

            <Section title="Address">
              <Detail label="Current Address" value={student.currentAddress} />
              <Detail
                label="Permanent Address"
                value={student.permanentAddress}
              />
            </Section>

            <Section title="Fee Details">
              <Detail label="Fee Group" value={student.feeGroup} />
              <Detail label="Discount List" value={student.discountList} />
              <Detail label="Discount Month" value={student.discountMonth} />
            </Section>

            <Section title="Bank Details">
              <Detail label="Bank Name" value={student.bankName} />
              <Detail
                label="Account Number"
                value={student.bankAccountNumber}
              />
              <Detail label="Branch Code" value={student.branchCode} />
            </Section>

            <Section title="Transport Details">
              <Detail label="Route List" value={student.routeList} />
              <Detail label="Bus Stop" value={student.busStop} />
            </Section>

            <Section title="Hostel Details">
              <Detail label="Hostel Type" value={student.hostelType} />
              <Detail label="Hostel Name" value={student.hostelName} />
              <Detail label="Room Type" value={student.roomType} />
              <Detail label="Room" value={student.room} />
            </Section>

            <Section title="Previous School">
              <Detail
                label="School Details"
                value={student.previousSchoolDetails}
              />
            </Section>

            {/* ================= PARENT PHOTOS ================= */}

            <Section title="Parent Photos">
              <Detail
                label="Father Photo"
                value={
                  student.fatherPhoto ? (
                    <a
                      href={`${IMAGE_URL}${student.fatherPhoto}`}
                      target="_blank"
                    >
                      View Photo
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Mother Photo"
                value={
                  student.motherPhoto ? (
                    <a
                      href={`${IMAGE_URL}${student.motherPhoto}`}
                      target="_blank"
                    >
                      View Photo
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Guardian Photo"
                value={
                  student.guardianPhoto ? (
                    <a
                      href={`${IMAGE_URL}${student.guardianPhoto}`}
                      target="_blank"
                    >
                      View Photo
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
            </Section>

            {/* ================= DOCUMENTS ================= */}

            <Section title="Student Documents">
              <Detail
                label="Report Card"
                value={
                  student.documents?.reportCard ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.reportCard}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="TC"
                value={
                  student.documents?.tc ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.tc}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Samagra ID"
                value={
                  student.documents?.samagraId ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.samagraId}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="NIDA Card"
                value={
                  student.documents?.nidaCard ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.nidaCard}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Previous Marksheet"
                value={
                  student.documents?.previousMarksheet ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.previousMarksheet}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="DOB Certificate"
                value={
                  student.documents?.dobCertificate ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.dobCertificate}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Aadhaar Student"
                value={
                  student.documents?.aadhaarStudent ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.aadhaarStudent}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Aadhaar Parent"
                value={
                  student.documents?.aadhaarParent ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.aadhaarParent}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="Income Certificate"
                value={
                  student.documents?.incomeCertificate ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.incomeCertificate}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />

              <Detail
                label="PIP"
                value={
                  student.documents?.pip ? (
                    <a
                      href={`${IMAGE_URL}${student.documents.pip}`}
                      target="_blank"
                    >
                      View File
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
            </Section>
          </div>
        )}

        <StudentPrintForm student={student} />
      </div>
    </div>
  );
}

/* COMPONENTS */

const Section = ({ title, children }) => (
  <div className="Student-Details-Section">
    <h2>{title}</h2>
    <div className="Student-Details-Grid">{children}</div>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="Student-Details-Item">
    <span className="Student-Details-Label">{label}</span>
    <span className="Student-Details-Value">{value || "-"}</span>
  </div>
);
