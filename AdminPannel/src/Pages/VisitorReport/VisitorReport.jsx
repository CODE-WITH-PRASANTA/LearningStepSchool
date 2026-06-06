import React, { useState } from "react";
import {
  FiGrid,
  FiPrinter,
  FiCalendar,
  FiChevronDown,
} from "react-icons/fi";

import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./VisitorReport.css";

const VisitorReport = () => {
  const [reportType, setReportType] = useState("All");
  const [enquiryType, setEnquiryType] = useState("Self");

  const [showTypeDrop, setShowTypeDrop] = useState(false);
  const [showEnquiryDrop, setShowEnquiryDrop] = useState(false);

  const [showData, setShowData] = useState(false);

  const dummyData = [
    {
      id: 1,
      date: "03/06/2026",
      visitor: "Rahul",
      contact: "9876543210",
      purpose: "Admission",
      type: "Self",
      student: "Aman",
      class: "10th",
      gender: "Male",
      address: "Pune",
    },
    {
      id: 2,
      date: "03/06/2026",
      visitor: "Priya",
      contact: "9876543211",
      purpose: "Fees",
      type: "Student",
      student: "Neha",
      class: "9th",
      gender: "Female",
      address: "Mumbai",
    },
  ];

  const handleSearch = () => {
    setShowData(true);
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("Visitor Enquiry Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "S.No",
          "Date",
          "Visitor",
          "Contact",
          "Purpose",
          "Type",
          "Student",
          "Class",
        ],
      ],
      body: dummyData.map((item) => [
        item.id,
        item.date,
        item.visitor,
        item.contact,
        item.purpose,
        item.type,
        item.student,
        item.class,
      ]),
    });

    doc.save("Visitor-Report.pdf");
  };

  return (
    <div className="report">
      <div className="report__top">
        <div>
          <h2>Visitor Enquiry Report</h2>
        </div>

        <div className="report__icons">
          <FiGrid />

          <button onClick={() => window.print()}>
            <FiPrinter />
          </button>

          <button onClick={exportPDF}>
            <FaFilePdf />
          </button>
        </div>
      </div>

      <div className="report__card">
        <div className="report__filters">

          {/* TYPE */}

          <div className="report__field">
            <label>Type</label>

            <div
              className="report__select"
              onClick={() => setShowTypeDrop(!showTypeDrop)}
            >
              {reportType}
              <FiChevronDown />
            </div>

            {showTypeDrop && (
              <div className="report__dropdown">
                {["All", "Date Wise", "Type Wise"].map((item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setReportType(item);
                      setShowTypeDrop(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE WISE */}

          {reportType === "Date Wise" && (
            <>
              <div className="report__field">
                <label>From</label>
                <div className="report__date">
                  <input type="date" />
                  <FiCalendar />
                </div>
              </div>

              <div className="report__field">
                <label>To</label>
                <div className="report__date">
                  <input type="date" />
                  <FiCalendar />
                </div>
              </div>
            </>
          )}

          {/* TYPE WISE */}

          {reportType === "Type Wise" && (
            <div className="report__field">
              <label>Enquiry Type</label>

              <div
                className="report__select"
                onClick={() =>
                  setShowEnquiryDrop(!showEnquiryDrop)
                }
              >
                {enquiryType}
                <FiChevronDown />
              </div>

              {showEnquiryDrop && (
                <div className="report__dropdown">
                  {["Self", "Student", "Staff"].map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setEnquiryType(item);
                        setShowEnquiryDrop(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            className="report__search"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="report__table-wrapper">
          <table className="report__table">
            <thead>
              <tr>
                <th>S.NO.</th>
                <th>DATE</th>
                <th>VISITOR</th>
                <th>CONTACT NO.</th>
                <th>PURPOSE</th>
                <th>TYPE</th>
                <th>STUDENT NAME</th>
                <th>CLASS</th>
                <th>GENDER</th>
                <th>ADDRESS</th>
              </tr>
            </thead>

            <tbody>
              {showData &&
                dummyData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.date}</td>
                    <td>{item.visitor}</td>
                    <td>{item.contact}</td>
                    <td>{item.purpose}</td>
                    <td>{item.type}</td>
                    <td>{item.student}</td>
                    <td>{item.class}</td>
                    <td>{item.gender}</td>
                    <td>{item.address}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorReport;