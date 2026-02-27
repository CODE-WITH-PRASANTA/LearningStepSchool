import React from "react";
import "./StudentReport.css";

// ✅ Import Images
import studentImg from "../../assets/r-img1.webp";
import guardianImg from "../../assets/r-img2.webp";
import historyImg from "../../assets/r-img3.webp";
import ptmImg from "../../assets/r-img4.webp";
import achievementImg from "../../assets/r-img5.webp";
import loginImg from "../../assets/report_login.webp";
import customFieldImg from "../../assets/cus-fild.webp";

const StudentReport = () => {
  const reports = [
    { title: "STUDENT REPORT", sub: "Class Section Wise", img: studentImg },
    { title: "GUARDIAN REPORT", sub: "Guardian Report", img: guardianImg },
    { title: "STUDENT HISTORY", sub: "Student History", img: historyImg },
    { title: "PTM REPORTS", sub: "Student Ptm", img: ptmImg },
    { title: "ACHIEVEMENT REPORT", sub: "Student Achievements", img: ptmImg },
    { title: "SIBLINGS REPORT", sub: "Siblings Report", img: achievementImg },
    { title: "STUDENT LOGIN CREDENTIAL", sub: "Student Login Credential", img: loginImg },
    { title: "CUSTOM FIELD REPORT", sub: "Custom Field Report", img: customFieldImg },
    { title: "STUDENT STRENGTH REPORT", sub: "Student Strength Report", img: achievementImg },
    { title: "HOUSE WISE STRENGTH REPORT", sub: "House Wise Strength Report", img: achievementImg },
    { title: "ADMISSION – INACTIVE COUNTER", sub: "Admission – Inactive Counter", img: achievementImg },
    { title: "TC REPORT", sub: "TC Report", img: achievementImg },
  ];

  return (
    <div className="studentReportPage__wrapper">
      <div className="studentReportPage__container">

        {/* Header */}
        <div className="studentReportPage__header">
          <div className="studentReportPage__title">
            <span className="studentReportPage__icon">📄</span>
            <h2>Student Report</h2>
          </div>

          <div className="studentReportPage__breadcrumb">
            <span>Students Info</span>
            <span className="studentReportPage__slash">/</span>
            <span>Student Report</span>
          </div>
        </div>

        {/* Grid */}
        <div className="studentReportPage__grid">
          {reports.map((item, index) => (
            <div className="studentReportPage__card" key={index}>
              <div className="studentReportPage__cardIcon">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="studentReportPage__cardContent">
                <h4>{item.title}</h4>
                <div className="studentReportPage__underline"></div>
                <p>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StudentReport;