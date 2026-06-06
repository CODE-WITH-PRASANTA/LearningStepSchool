import React, { useState } from "react";
import "./TransportVehicleReport.css";

const TransportVehicleReport = () => {
  const [reportType, setReportType] = useState("All");
  const [showTable, setShowTable] = useState(false);

  const dummyData = [
    {
      id: 1,
      admNo: "5004",
      srNo: "5001",
      name: "Akhilesh Sharma",
      className: "N.C.-A",
      father: "Demo",
      contact: "1234567888",
      vehicle: "1231",
      route: "Mohd Nagar",
      destination: "Abusaidpur",
      fare: "400",
    },
    {
      id: 2,
      admNo: "20/5008",
      srNo: "5025",
      name: "Ananya Yadav",
      className: "N.C.-A",
      father: "Ajay",
      contact: "3454254554",
      vehicle: "2525",
      route: "Ravana",
      destination: "Chaukoni",
      fare: "1000",
    },
    {
      id: 3,
      admNo: "6/5008",
      srNo: "5011",
      name: "FF VDFDF",
      className: "N.C.-A",
      father: "Bjuv",
      contact: "2010301020",
      vehicle: "2525",
      route: "Chaukoni",
      destination: "Bisauli",
      fare: "400",
    },
    {
      id: 4,
      admNo: "18/5008",
      srNo: "5023",
      name: "Harshita",
      className: "N.C.-A",
      father: "Harsh",
      contact: "1231231231",
      vehicle: "2525",
      route: "Chaukoni",
      destination: "Bisauli",
      fare: "400",
    },
  ];

  const handleSearch = () => {
    setShowTable(true);
  };

  return (
    <div className="transport-vehicle-container">
      <div className="transport-vehicle-card">
        <div className="transport-vehicle-filter-row">
          {/* Report */}
          <div className="transport-vehicle-field">
            <label>Report</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Class Wise">Class Wise</option>
              <option value="Transport Wise">Transport Wise</option>
            </select>
          </div>

          {/* Class Wise */}
          {reportType === "Class Wise" && (
            <>
              <div className="transport-vehicle-field">
                <label>Class</label>
                <select>
                  <option>N.C.</option>
                  <option>I</option>
                  <option>II</option>
                  <option>III</option>
                  <option>IV</option>
                </select>
              </div>

              <div className="transport-vehicle-field">
                <label>Division</label>
                <select>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                </select>
              </div>
            </>
          )}

          {/* Transport Wise */}
          {reportType === "Transport Wise" && (
            <>
              <div className="transport-vehicle-field">
                <label>Vehicles</label>
                <select>
                  <option>Select Vehicle</option>
                  <option>1231</option>
                  <option>2525</option>
                  <option>3001</option>
                </select>
              </div>

              <div className="transport-vehicle-field">
                <label>Routes</label>
                <select>
                  <option>Select Route</option>
                  <option>Mohd Nagar</option>
                  <option>Ravana</option>
                  <option>Chaukoni</option>
                </select>
              </div>

              <div className="transport-vehicle-field">
                <label>Destination</label>
                <select>
                  <option>Select Destination</option>
                  <option>Abusaidpur</option>
                  <option>Chaukoni</option>
                  <option>Bisauli</option>
                </select>
              </div>
            </>
          )}

          <button
            className="transport-vehicle-search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="transport-vehicle-notification">
          Send SMS / Notification
        </div>

        {showTable && (
          <div className="transport-vehicle-table-wrapper">
            <table className="transport-vehicle-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>S.NO.</th>
                  <th>ADM.NO.</th>
                  <th>SR.NO.</th>
                  <th>NAME</th>
                  <th>CLASS</th>
                  <th>FATHER'S NAME</th>
                  <th>CONTACT NO.</th>
                  <th>VEHICLE</th>
                  <th>ROUTE</th>
                  <th>DEST./POINT</th>
                  <th>FARE</th>
                </tr>
              </thead>

              <tbody>
                {dummyData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.admNo}</td>
                    <td>{item.srNo}</td>
                    <td>{item.name}</td>
                    <td>{item.className}</td>
                    <td>{item.father}</td>
                    <td>{item.contact}</td>
                    <td>{item.vehicle}</td>
                    <td>{item.route}</td>
                    <td>{item.destination}</td>
                    <td>{item.fare}</td>
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

export default TransportVehicleReport;