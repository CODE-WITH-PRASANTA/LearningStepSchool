import React, { useState } from "react";
import "./TransportStudentsReport.css";
import { FaCalendarAlt } from "react-icons/fa";
import { HiOutlineViewColumns } from "react-icons/hi2";

const TransportStudentsReport = () => {
  const [report, setReport] = useState("Van");
  const [documentType, setDocumentType] = useState("Fitness Date");
  const [date, setDate] = useState("2026-08-04");
  const [showData, setShowData] = useState(false);
  const [showColumns, setShowColumns] = useState(false);

  const transportData = [
    {
      id: 1,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 2,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 3,
      driver: "Vikash",
      capacity: 40,
      type: "Bus",
      pucDate: "2026-06-06",
      fitnessDate: "2026-07-11",
      vehicle: "1405",
    },
    {
      id: 4,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 5,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 6,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 7,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 8,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 9,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 10,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 11,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
    {
      id: 12,
      driver: "Vikash",
      capacity: 50,
      type: "Bus",
      pucDate: "",
      fitnessDate: "",
      vehicle: "9150",
    },
  ];

  const columns = [
    "Roll No.",
    "Adm.No.",
    "Sr.No.",
    "Enroll.No.",
    "Name",
    "Class",
    "Father's Name",
    "Contact No.",
    "Fee Type",
    "Mother Name",
    "Address",
    "Vehicle",
    "Route",
    "Dest./Point",
    "Fare",
  ];

  const handleSearch = () => {
    setShowData(true);
  };

  return (
    <div className="transport-students">
      <div className="transport-card">
        <div className="filter-section">
          <div className="left-filters">
            <div className="input-group">
              <label>Report</label>
              <select
                value={report}
                onChange={(e) => setReport(e.target.value)}
              >
                <option>All</option>
                <option>Bus</option>
                <option>Van</option>
                <option>Auto Rickshaw</option>
                <option>Rickshaw</option>
                <option>E-Rickshaw</option>
              </select>
            </div>

            <div className="input-group">
              <label>Select Document</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option>Puc Date</option>
                <option>Fitness Date</option>
                <option>Insurance Date</option>
                <option>Permit Date</option>
              </select>
            </div>

            <div className="input-group">
              <label>Choose a date</label>

              <div className="date-wrapper">
                <input
                  className="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <FaCalendarAlt className="calendar-icon" />
              </div>
            </div>
          </div>

          <div className="right-actions">
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>

            <button
              className="column-btn"
              onClick={() => setShowColumns(!showColumns)}
            >
              <HiOutlineViewColumns />
            </button>

            {showColumns && (
              <div className="column-popup">
                {columns.map((item, index) => (
                  <label key={index} className="column-item">
                    <input type="checkbox" defaultChecked />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {showData && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>DRIVER NAME</th>
                  <th>VEH. CAP.</th>
                  <th>VEH. TYPE</th>
                  <th>PUC DATE</th>
                  <th>FITNESS DATE</th>
                  <th>VEHICLE</th>
                </tr>
              </thead>

              <tbody>
                {transportData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.driver}</td>
                    <td>{item.capacity}</td>
                    <td>{item.type}</td>
                    <td>{item.pucDate || "-"}</td>
                    <td>{item.fitnessDate || "-"}</td>
                    <td>{item.vehicle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportStudentsReport;