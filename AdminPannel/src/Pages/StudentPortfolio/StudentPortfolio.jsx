import React, { useEffect, useMemo, useState } from "react";
import "./StudentPortfolio.css";
import ReportModal from "../../Component/ReportModal/ReportModal";
import API, { IMAGE_URL } from "../../api/axios";
import logo from "../../Assets/Learning-Step-Logo-1.png";

const avatar =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const display = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "N/A";
  return value;
};

const getImage = (path) => {
  if (!path) return avatar;
  if (String(path).startsWith("http")) return path;
  return `${IMAGE_URL}${path}`;
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN");
};

const getStudentName = (student) =>
  student?.name ||
  `${student?.firstName || ""} ${student?.lastName || ""}`.trim();

const InfoItem = ({ label, value, className = "" }) => (
  <div className={`student-portfolio-info-item ${className}`}>
    <span>{label}</span>
    <strong>{display(value)}</strong>
  </div>
);

const EmptyRow = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="student-portfolio-empty-cell">
      {message}
    </td>
  </tr>
);

const StudentPortfolio = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [fees, setFees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const studentName = getStudentName(selectedStudent);
  const hasTransport = Boolean(selectedStudent?.routeList || selectedStudent?.busStop);
  const hasHostel = Boolean(
    selectedStudent?.hostelType ||
      selectedStudent?.hostelName ||
      selectedStudent?.roomType ||
      selectedStudent?.room,
  );

  const studentInfoFields = [
    ["Admission No", selectedStudent?.admissionNo],
    ["Roll No", selectedStudent?.rollNumber],
    ["Class", selectedStudent?.class],
    ["Section", selectedStudent?.section],
    ["Gender", selectedStudent?.gender],
    ["DOB", formatDate(selectedStudent?.dob)],
    ["Mobile", selectedStudent?.mobile],
    ["Email", selectedStudent?.email],
    ["Blood Group", selectedStudent?.bloodGroup],
    ["House", selectedStudent?.house],
    ["Aadhaar", selectedStudent?.aadharNumber],
    ["PEN", selectedStudent?.pen],
    ["SR No", selectedStudent?.srNo],
    ["APAAR ID", selectedStudent?.apaarId],
    ["Admission Date", formatDate(selectedStudent?.admissionDate)],
    ["Category", selectedStudent?.category],
    ["Religion", selectedStudent?.religion],
    ["Caste", selectedStudent?.caste],
  ];

  const bankFields = [
    ["Bank Name", selectedStudent?.bankName],
    ["Account No", selectedStudent?.bankAccountNumber],
    ["Branch Code", selectedStudent?.branchCode],
  ];

  const documentFields = Object.entries(selectedStudent?.documents || {}).map(
    ([key, value]) => [
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (letter) => letter.toUpperCase()),
      value,
    ],
  );

  const feeSummary = useMemo(() => {
    const totals = fees.reduce(
      (acc, fee) => {
        acc.total += Number(fee.finalAmount || fee.totalAmount || 0);
        acc.paid += Number(fee.paid || 0);
        acc.due += Number(fee.due || 0);
        return acc;
      },
      { total: 0, paid: 0, due: 0 },
    );

    const paidPercent = totals.total
      ? Math.round((totals.paid / totals.total) * 100)
      : 0;

    return {
      ...totals,
      paidPercent,
      duePercent: totals.total ? Math.max(100 - paidPercent, 0) : 0,
    };
  }, [fees]);

  const attendanceSummary = useMemo(() => {
    const rows = attendanceRecords.flatMap((record) =>
      (record.students || [])
        .filter((student) => {
          const byId =
            selectedStudent?._id &&
            String(student.studentId) === String(selectedStudent._id);
          const byRoll =
            selectedStudent?.rollNumber &&
            student.rollNumber === selectedStudent.rollNumber;
          const byName = studentName && student.name === studentName;
          return byId || byRoll || byName;
        })
        .map((student) => ({ ...student, date: record.date })),
    );

    const present = rows.filter((row) => row.status === "Present").length;
    const total = rows.length;

    return {
      rows,
      present,
      total,
      percent: total ? Math.round((present / total) * 100) : 0,
    };
  }, [attendanceRecords, selectedStudent, studentName]);

  const handleSearch = async (value) => {
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await API.get(`/students/search/list?q=${value}`);
      setSuggestions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowResult = async () => {
    try {
      const res = await API.get(
        `/exam-results/student/${selectedStudent.admissionNo}`,
      );

      const apiData = res.data;
      const student = selectedStudent || apiData.student || {};

      const mergedData = {
        ...apiData,
        name: getStudentName(student),
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        aadhaarNumber: student.aadharNumber || student.aadhar || "",
        bloodGroup: student.bloodGroup || "",
        height: student.height || "",
        weight: student.weight || "",
        penNo: student.pen || student.penNo || "",
        houseName: student.house || student.houseName || "",
        dob: student.dob || "",
        rollNumber: student.rollNumber || "",
        class: student.class || "",
        admissionNo: student.admissionNo || selectedStudent?.admissionNo || "",
        studentPhoto: student.studentPhoto || "",
        result: apiData.result || apiData.grade || "",
      };

      mergedData.subjects = (apiData.subjects || []).map((subject) => {
        const examKey = Object.keys(subject.exams || {})[0];

        return {
          subject: subject.name,
          marks: Number(subject.exams?.[examKey] || 0),
          fullMarks: Number(subject.fullMarks?.[examKey] || 100),
          type: subject.type || "regular",
        };
      });

      setResultData(mergedData);
      setShowResultModal(true);
    } catch (error) {
      console.log(error);
      alert("No Result Found");
    }
  };

  const selectStudent = async (student) => {
    try {
      const res = await API.get(`/students/${student._id}`);
      const fullStudent = res.data.data;

      setShowResultModal(false);
      setResultData(null);
      setSelectedStudent(fullStudent);
      setSearch(getStudentName(fullStudent));
      setSuggestions([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedStudent) {
      setFees([]);
      setAttendanceRecords([]);
      return;
    }

    const fetchDetails = async () => {
      setLoadingDetails(true);

      try {
        const [feeRes, attendanceRes] = await Promise.allSettled([
          API.get("/admission/fees"),
          API.get("/attendance", {
            params: {
              className: selectedStudent.class,
              section: selectedStudent.section,
            },
          }),
        ]);

        if (feeRes.status === "fulfilled") {
          const allFees = feeRes.value.data?.data || [];
          setFees(
            allFees.filter(
              (fee) =>
                fee.admissionNo === selectedStudent.admissionNo ||
                String(fee.studentId) === String(selectedStudent._id),
            ),
          );
        } else {
          setFees([]);
        }

        if (attendanceRes.status === "fulfilled") {
          const data = attendanceRes.value.data?.data;
          setAttendanceRecords(Array.isArray(data) ? data : data ? [data] : []);
        } else {
          setAttendanceRecords([]);
        }
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [selectedStudent]);

  return (
    <div className="student-portfolio-container">
      <div className="student-portfolio-header-section">
        <div className="student-portfolio-title-wrapper">
          <h2 className="student-portfolio-main-title">Student Portfolio</h2>
        </div>

        <div className="student-portfolio-search-wrapper">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="student-portfolio-search-input"
            placeholder="Search Student..."
          />

          {suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((student) => (
                <div
                  key={student._id}
                  className="search-item"
                  onClick={() => selectStudent(student)}
                >
                  {student.firstName} {student.lastName} -{" "}
                  {student.admissionNo}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="student-portfolio-top-grid-section">
        <div className="student-portfolio-card student-portfolio-student-card">
          <div className="student-portfolio-card-header student-portfolio-card-header-blue">
            Student Information
          </div>

          <div className="student-portfolio-student-info-section">
            <div className="student-portfolio-student-image-wrapper">
              <img
                src={getImage(selectedStudent?.studentPhoto)}
                alt="Student"
                className="student-portfolio-student-image"
              />
            </div>

            <div className="student-portfolio-student-details">
              <h3 className="student-portfolio-student-name">
                {studentName || "N/A"}
              </h3>

              <p className="student-portfolio-student-class">
                {display(
                  [selectedStudent?.class, selectedStudent?.section]
                    .filter(Boolean)
                    .join(" - "),
                )}
              </p>

              <div className="student-portfolio-student-badge-wrapper">
                <span className="student-portfolio-student-badge">
                  Transport: {hasTransport ? "Yes" : "No"}
                </span>

                <span className="student-portfolio-student-badge">
                  Hostel: {hasHostel ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="student-portfolio-card student-portfolio-result-card">
          <div className="student-portfolio-card-header student-portfolio-card-header-orange">
            Student Result
          </div>

          <div className="student-portfolio-result-section">
            <button
              className="student-portfolio-result-button"
              disabled={!selectedStudent}
              onClick={handleShowResult}
            >
              Show Result
            </button>
          </div>
        </div>

        <div className="student-portfolio-transport-hostel-wrapper">
          <div className="student-portfolio-card student-portfolio-transport-card">
            <div className="student-portfolio-card-header student-portfolio-card-header-yellow">
              Transport Information
            </div>

            <div className="student-portfolio-transport-info-section">
              <InfoItem
                label="Route"
                value={selectedStudent?.routeList}
                className="student-portfolio-transport-item"
              />
              <InfoItem
                label="Bus Stop"
                value={selectedStudent?.busStop}
                className="student-portfolio-transport-item"
              />
            </div>
          </div>

          <div className="student-portfolio-card student-portfolio-hostel-card-main">
            <div className="student-portfolio-card-header student-portfolio-card-header-pink">
              Hostel Information
            </div>

            <div className="student-portfolio-hostel-info-section">
              <InfoItem
                label="Type"
                value={selectedStudent?.hostelType}
                className="student-portfolio-hostel-info-item"
              />
              <InfoItem
                label="Hostel"
                value={selectedStudent?.hostelName}
                className="student-portfolio-hostel-info-item"
              />
              <InfoItem
                label="Room Type"
                value={selectedStudent?.roomType}
                className="student-portfolio-hostel-info-item"
              />
              <InfoItem
                label="Room"
                value={selectedStudent?.room}
                className="student-portfolio-hostel-info-item"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="student-portfolio-section-container">
        <div className="student-portfolio-section-header">
          <h2 className="student-portfolio-section-title">
            Parents & Guardian Details
          </h2>
        </div>

        <div className="student-portfolio-horizontal-scroll-wrapper">
          {[
            {
              title: selectedStudent?.fatherName,
              role: "Father",
              phone: selectedStudent?.fatherPhone,
              photo: selectedStudent?.fatherPhoto,
              occupation: selectedStudent?.fatherOccupation,
            },
            {
              title: selectedStudent?.motherName,
              role: "Mother",
              phone: selectedStudent?.motherPhone,
              photo: selectedStudent?.motherPhoto,
              occupation: selectedStudent?.motherOccupation,
            },
            {
              title: selectedStudent?.guardianName,
              role: selectedStudent?.guardianRelation || "Guardian",
              phone: selectedStudent?.guardianPhone,
              photo: selectedStudent?.guardianPhoto,
              occupation: selectedStudent?.guardianOccupation,
            },
          ].map((person) => (
            <div className="student-portfolio-profile-card" key={person.role}>
              <div className="student-portfolio-profile-image-wrapper">
                <img
                  src={getImage(person.photo)}
                  alt={person.role}
                  className="student-portfolio-profile-image"
                />
              </div>

              <div className="student-portfolio-profile-details">
                <h4>{display(person.title)}</h4>
                <p>{person.role}</p>
                <span>{display(person.phone)}</span>
                <small>{display(person.occupation)}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="student-portfolio-section-container">
        <div className="student-portfolio-section-header">
          <h2 className="student-portfolio-section-title">All Student Details</h2>
        </div>
        <div className="student-portfolio-detail-grid">
          {studentInfoFields.map(([label, value]) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      <div className="student-portfolio-progress-grid-section">
        <div className="student-portfolio-progress-card">
          <div className="student-portfolio-progress-top-section">
            <span className="student-portfolio-progress-title">Attendance</span>
            <strong className="student-portfolio-progress-value">
              {attendanceSummary.percent}%
            </strong>
          </div>

          <div className="student-portfolio-progress-bar-wrapper">
            <div
              className="student-portfolio-progress-bar-fill"
              style={{ width: `${attendanceSummary.percent}%` }}
            />
          </div>
          <p className="student-portfolio-progress-note">
            {attendanceSummary.present} present / {attendanceSummary.total} marked
          </p>
        </div>

        <div className="student-portfolio-progress-card">
          <div className="student-portfolio-progress-top-section">
            <span className="student-portfolio-progress-title">Fees</span>
            <strong className="student-portfolio-progress-value">
              {feeSummary.paidPercent}%
            </strong>
          </div>

          <div className="student-portfolio-progress-bar-wrapper">
            <div
              className="student-portfolio-progress-bar-fill"
              style={{ width: `${feeSummary.paidPercent}%` }}
            />
          </div>
          <p className="student-portfolio-progress-note">
            Paid Rs. {feeSummary.paid} / Rs. {feeSummary.total}
          </p>
        </div>
      </div>

      <div className="student-portfolio-fees-layout-section">
        <div className="student-portfolio-fees-card">
          <div className="student-portfolio-fees-card-header">
            <h3 className="student-portfolio-fees-title">Fees</h3>

            <div className="student-portfolio-fees-status">
              Paid
              <span className="student-portfolio-fees-paid">
                {feeSummary.paidPercent}%
              </span>
              Due
              <span className="student-portfolio-fees-due">
                {feeSummary.duePercent}%
              </span>
            </div>
          </div>

          <div className="student-portfolio-fees-chart-area">
            <div className="student-portfolio-fee-meter">
              <span style={{ flex: feeSummary.paid }} />
              <b style={{ flex: feeSummary.due }} />
            </div>
            <div className="student-portfolio-fee-summary-grid">
              <InfoItem label="Total" value={`Rs. ${feeSummary.total}`} />
              <InfoItem label="Paid" value={`Rs. ${feeSummary.paid}`} />
              <InfoItem label="Due" value={`Rs. ${feeSummary.due}`} />
            </div>
          </div>
        </div>

        <div className="student-portfolio-fees-reminder-card">
          <h3 className="student-portfolio-fees-reminder-title">
            Fee Reminder
          </h3>
          <p className="student-portfolio-reminder-text">
            {feeSummary.due > 0
              ? `Due amount pending: Rs. ${feeSummary.due}`
              : selectedStudent
                ? "No due amount found."
                : "Select a student to view fee status."}
          </p>
        </div>
      </div>

      <div className="student-portfolio-table-section">
        <div className="student-portfolio-table-main-header">
          <h3 className="student-portfolio-table-title">Fee History</h3>
        </div>

        <div className="student-portfolio-table-responsive">
          <table className="student-portfolio-main-table">
            <thead className="student-portfolio-main-table-head">
              <tr className="student-portfolio-main-table-row">
                <th className="student-portfolio-main-table-heading">Receipt</th>
                <th className="student-portfolio-main-table-heading">Date</th>
                <th className="student-portfolio-main-table-heading">Fee Types</th>
                <th className="student-portfolio-main-table-heading">Total</th>
                <th className="student-portfolio-main-table-heading">Paid</th>
                <th className="student-portfolio-main-table-heading">Due</th>
                <th className="student-portfolio-main-table-heading">Status</th>
                <th className="student-portfolio-main-table-heading">Method</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <EmptyRow
                  colSpan={8}
                  message={loadingDetails ? "Loading fees..." : "No fee records found"}
                />
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id}>
                    <td>{display(fee.receiptNo)}</td>
                    <td>{formatDate(fee.date)}</td>
                    <td>
                      {display((fee.fees || []).map((item) => item.feeType))}
                    </td>
                    <td>Rs. {display(fee.finalAmount || fee.totalAmount)}</td>
                    <td>Rs. {display(fee.paid)}</td>
                    <td>Rs. {display(fee.due)}</td>
                    <td>{display(fee.status)}</td>
                    <td>{display(fee.paymentMethod)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="student-portfolio-table-section">
        <div className="student-portfolio-table-main-header">
          <h3 className="student-portfolio-table-title">Attendance History</h3>
        </div>

        <div className="student-portfolio-table-responsive">
          <table className="student-portfolio-main-table">
            <thead className="student-portfolio-main-table-head">
              <tr className="student-portfolio-main-table-row">
                <th className="student-portfolio-main-table-heading">Date</th>
                <th className="student-portfolio-main-table-heading">Roll No</th>
                <th className="student-portfolio-main-table-heading">Status</th>
                <th className="student-portfolio-main-table-heading">Note</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.rows.length === 0 ? (
                <EmptyRow
                  colSpan={4}
                  message={
                    loadingDetails
                      ? "Loading attendance..."
                      : "No attendance records found"
                  }
                />
              ) : (
                attendanceSummary.rows.map((row, index) => (
                  <tr key={`${row.date}-${index}`}>
                    <td>{formatDate(row.date)}</td>
                    <td>{display(row.rollNumber)}</td>
                    <td>{display(row.status)}</td>
                    <td>{display(row.note)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="student-portfolio-section-container">
        <div className="student-portfolio-section-header">
          <h2 className="student-portfolio-section-title">Address & Other Details</h2>
        </div>
        <div className="student-portfolio-detail-grid">
          <InfoItem label="Current Address" value={selectedStudent?.currentAddress} />
          <InfoItem
            label="Permanent Address"
            value={selectedStudent?.permanentAddress}
          />
          <InfoItem
            label="Guardian Address"
            value={selectedStudent?.guardianAddress}
          />
          <InfoItem label="Fee Group" value={selectedStudent?.feeGroup} />
          <InfoItem label="Discount List" value={selectedStudent?.discountList} />
          <InfoItem label="Discount Month" value={selectedStudent?.discountMonth} />
          <InfoItem
            label="Previous School"
            value={selectedStudent?.previousSchoolDetails}
          />
          <InfoItem label="Behaviour" value={selectedStudent?.studentBehaviour} />
          <InfoItem label="Note" value={selectedStudent?.note} />
          {bankFields.map(([label, value]) => (
            <InfoItem key={label} label={label} value={value} />
          ))}
        </div>
      </div>

      <div className="student-portfolio-section-container">
        <div className="student-portfolio-section-header">
          <h2 className="student-portfolio-section-title">Documents</h2>
        </div>
        <div className="student-portfolio-detail-grid">
          {documentFields.length === 0 ? (
            <p className="student-portfolio-reminder-text">No documents found.</p>
          ) : (
            documentFields.map(([label, value]) => (
              <InfoItem key={label} label={label} value={value ? "Uploaded" : "N/A"} />
            ))
          )}
        </div>
      </div>

      {showResultModal && resultData && (
        <ReportModal
          viewData={resultData}
          setViewData={() => {
            setShowResultModal(false);
            setResultData(null);
          }}
          logo={logo}
        />
      )}

      <div className="student-portfolio-table-section">
        <div className="student-portfolio-table-main-header">
          <h3 className="student-portfolio-table-title">Gate Pass</h3>
        </div>

        <div className="student-portfolio-table-responsive">
          <table className="student-portfolio-main-table">
            <thead className="student-portfolio-main-table-head">
              <tr className="student-portfolio-main-table-row">
                <th className="student-portfolio-main-table-heading">Photo</th>
                <th className="student-portfolio-main-table-heading">
                  Visitor Name
                </th>
                <th className="student-portfolio-main-table-heading">Relation</th>
                <th className="student-portfolio-main-table-heading">Contact</th>
                <th className="student-portfolio-main-table-heading">Date</th>
                <th className="student-portfolio-main-table-heading">Time</th>
                <th className="student-portfolio-main-table-heading">Purpose</th>
                <th className="student-portfolio-main-table-heading">Issuer</th>
              </tr>
            </thead>
            <tbody>
              <EmptyRow colSpan={8} message="No saved gate pass records found" />
            </tbody>
          </table>
        </div>
      </div>

      <div className="student-portfolio-table-section">
        <div className="student-portfolio-table-main-header">
          <h3 className="student-portfolio-table-title">Student Complaint</h3>
        </div>

        <div className="student-portfolio-table-responsive">
          <table className="student-portfolio-main-table">
            <thead className="student-portfolio-main-table-head">
              <tr className="student-portfolio-main-table-row">
                <th className="student-portfolio-main-table-heading">
                  Person Name
                </th>
                <th className="student-portfolio-main-table-heading">By</th>
                <th className="student-portfolio-main-table-heading">Complaint</th>
                <th className="student-portfolio-main-table-heading">Feedback</th>
                <th className="student-portfolio-main-table-heading">Date</th>
                <th className="student-portfolio-main-table-heading">Status</th>
              </tr>
            </thead>
            <tbody>
              <EmptyRow colSpan={6} message="No complaint records found" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPortfolio;
