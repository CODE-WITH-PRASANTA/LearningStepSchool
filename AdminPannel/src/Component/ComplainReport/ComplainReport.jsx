
import React, { useState } from "react";
import "./ComplainReport.css";
import {
  FaHome,
  FaTable,
  FaPrint,
  FaFilePdf,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ComplainReport = () => {
  const reportOptions = [
    "All",
    "Student",
    "Staff",
    "Type",
    "Status",
    "Date",
  ];

  const allData = [
    {
      id: 1,
      name: "[1234] Ashmita minj",
      type: "Student",
      compType: "Study",
      desc: "sdad",
      status: "Pending",
      date: "15-05-2026",
    },
    {
      id: 2,
      name: "[14] Inayat Bi",
      type: "Student",
      compType: "Convenience",
      desc: "SGSDFG",
      status: "Pending",
      date: "05-05-2026",
    },
    {
      id: 3,
      name: "[76] Shiv",
      type: "Student",
      compType: "Convenience",
      desc: "Done",
      status: "Pending",
      date: "01-05-2026",
    },
    {
      id: 4,
      name: "[152] Aditya demo",
      type: "Student",
      compType: "Study",
      desc: "swxdsw",
      status: "Pending",
      date: "23-04-2026",
    },
    {
      id: 5,
      name: "[152] Aditya demo",
      type: "Student",
      compType: "Study",
      desc: "ddddddsed",
      status: "Solved",
      date: "23-04-2026",
    },
    {
      id: 6,
      name: "[1234] Ashmita minj",
      type: "Student",
      compType: "Study",
      desc: "demo",
      status: "Pending",
      date: "16-04-2026",
    },
    {
      id: 7,
      name: "[76] Shiv",
      type: "Student",
      compType: "Study",
      desc: "English homework",
      status: "Pending",
      date: "15-04-2026",
    },
    {
      id: 8,
      name: "[42] Amandeep gcbfh",
      type: "Student",
      compType: "Study",
      desc: "demo ??",
      status: "Pending",
      date: "01-04-2026",
    },

    {
      id: 9,
      name: "[100] Rahul",
      type: "Staff",
      compType: "Teaching",
      desc: "Issue",
      status: "Solved",
      date: "01-03-2026",
    },

    {
      id: 10,
      name: "[101] Mohan",
      type: "Student",
      compType: "Fees",
      desc: "Fees issue",
      status: "Pending",
      date: "10-03-2026",
    },
  ];

  const [selected, setSelected] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showData, setShowData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 8;

  const filteredData =
    selected === "All"
      ? allData
      : allData.filter(
          (item) =>
            item.type === selected ||
            item.status === selected ||
            item.compType === selected
        );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );

  const handleSearch = () => {
    setShowData(true);
    setCurrentPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="complain">

      <div className="complain-header">

        <div className="complain-title-section">
          <h2>Complaint Report</h2>

          <div className="complain-breadcrumb">
            <FaHome />
            <span>•</span>
            <span>Front Office</span>
            <span>•</span>
            <span>Complaint Report</span>
          </div>
        </div>

        <div className="complain-actions">
          <FaTable className="complain-excel" />
          <FaPrint
            className="complain-print"
            onClick={handlePrint}
          />
          <FaFilePdf className="complain-pdf" />
        </div>

      </div>

      <div className="complain-card">

        <div className="complain-filter-area">

          <div className="complain-dropdown-wrapper">

            <div
              className={`complain-dropdown ${
                showDropdown ? "active" : ""
              }`}
              onClick={() =>
                setShowDropdown(!showDropdown)
              }
            >
              <label>Report Type</label>

              <span>{selected}</span>

              <FaChevronDown />
            </div>

            {showDropdown && (
              <div className="complain-dropdown-menu">

                {reportOptions.map((item, index) => (
                  <div
                    key={index}
                    className="complain-option"
                    onClick={() => {
                      setSelected(item);
                      setShowDropdown(false);
                    }}
                  >
                    {item}
                  </div>
                ))}

              </div>
            )}
          </div>

          <button
            className="complain-search-btn"
            onClick={handleSearch}
          >
            Search
          </button>

        </div>

        {showData && (
          <>
            <div className="complain-table-wrapper">

              <div className="complain-table-scroll">

                <table className="complain-table">

                  <thead>
                    <tr>
                      <th>S.NO.</th>
                      <th>NAME</th>
                      <th>TYPE</th>
                      <th>COMP. TYPE</th>
                      <th>COMPLAINT DESC.</th>
                      <th>STATUS</th>
                      <th>DATE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentRecords.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td>{item.compType}</td>
                        <td>{item.desc}</td>
                        <td>{item.status}</td>
                        <td>{item.date}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

            </div>

            <div className="complain-pagination">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => prev - 1)
                }
              >
                <FaChevronLeft />
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => prev + 1)
                }
              >
                <FaChevronRight />
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ComplainReport;