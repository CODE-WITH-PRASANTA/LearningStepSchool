import React, { useState } from "react";
import "./TransportSummary.css";

import {
  FaPrint,
  FaFilePdf,
  FaHome,
  FaTh,
} from "react-icons/fa";

import { MdKeyboardArrowDown } from "react-icons/md";

import schoolLogo from "../../Assets/Learning-Step-Logo-1.png";

const TransportSummary = () => {
  const [showData, setShowData] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const transportData = [
    {
      sno: 1,
      vehicleNo: "1231",
      capacity: 20,
      type: "Van",
      driver: "[Bintu] Bintu yadav",
      route: "Mohd Nagar",
      destinations: [
        { name: "Mohd Nagar", fare: 400 },
        { name: "Alafganj", fare: 400 },
        { name: "Patti Fazilabad", fare: 400 },
        { name: "Piplichak", fare: 500 },
        { name: "Abusaidpur", fare: 400 },
        { name: "Ravana", fare: 400 },
        { name: "Bichpuri Lalji", fare: 400 },
        { name: "MADYAN JHAU", fare: 400 },
        { name: "Sarai Imam", fare: 400 },
        { name: "Chaukoni", fare: 1000 },
      ],
    },

    {
      sno: 2,
      vehicleNo: "1280",
      capacity: 25,
      type: "Bus",
      driver: "[Bintu] Bintu yadav",
      route: "Ravana",
      destinations: [
        { name: "Ravana", fare: 400 },
        { name: "Chaukoni", fare: 1000 },
        { name: "Patti Fazilabad", fare: 400 },
        { name: "Sarai Imam", fare: 400 },
        { name: "Tarapur", fare: 400 },
      ],
    },

    {
      sno: 3,
      vehicleNo: "2050",
      capacity: 20,
      type: "Van",
      driver: "[Bintu] Bintu yadav",
      route: "Ravana",
      destinations: [
        { name: "Ravana", fare: 400 },
        { name: "Chaukoni", fare: 1000 },
        { name: "Patti Fazilabad", fare: 400 },
        { name: "Sarai Imam", fare: 400 },
        { name: "Tarapur", fare: 400 },
      ],
    },
  ];

  return (
    <div className="Uab">

      {/* Header */}

      <div className="UabHeader">
        <div className="UabHeaderLeft">
          <h2>Transport Summary</h2>

          <div className="UabBreadcrumb">
            <FaHome />
            <span>Transport</span>
            <span>•</span>
            <span>Reports</span>
            <span>•</span>
            <span>Transport Summary</span>
          </div>
        </div>

        <div className="UabHeaderIcons">
          <FaTh className="UabGridIcon" />
          <FaPrint
            className="UabPrintIcon"
            onClick={() => setShowPrintModal(true)}
          />
          <FaFilePdf className="UabPdfIcon" />
        </div>
      </div>

      {/* Filters */}

      <div className="UabFilterCard">

        <div className="UabFilterGrid">

          <div className="UabSelectBox">
            <label>Vehicles</label>
            <select>
              <option>101,1212,1231,1234</option>
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Routes</label>
            <select>
              <option>Mohd Nagar</option>
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Destination</label>
            <select>
              <option>Abusaidpur</option>
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Vehicle Type</label>
            <select>
              <option>Van</option>
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Driver</label>
            <select>
              <option>Bintu Yadav</option>
            </select>
          </div>

          <button
            className="UabSearchBtn"
            onClick={() => setShowData(true)}
          >
            Search
          </button>

        </div>

        {/* Table */}

        <div className="UabTableWrapper">

          <table className="UabTable">

            <thead>
              <tr>
                <th>S.NO.</th>
                <th>VEHICLE NO.</th>
                <th>VEHICLE CAPACITY</th>
                <th>VEHICLE TYPE</th>
                <th>DRIVER</th>
                <th>ROUTE</th>
                <th>DESTINATION</th>
                <th>FARE</th>
              </tr>
            </thead>

            <tbody>

              {showData &&
                transportData.map((vehicle) =>
                  vehicle.destinations.map((dest, index) => (
                    <tr key={`${vehicle.sno}-${index}`}>

                      <td>{index === 0 ? vehicle.sno : ""}</td>

                      <td>{index === 0 ? vehicle.vehicleNo : ""}</td>

                      <td>{index === 0 ? vehicle.capacity : ""}</td>

                      <td>{index === 0 ? vehicle.type : ""}</td>

                      <td>{index === 0 ? vehicle.driver : ""}</td>

                      <td>{index === 0 ? vehicle.route : ""}</td>

                      <td>{dest.name}</td>

                      <td>{dest.fare}</td>

                    </tr>
                  ))
                )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Print Modal */}

      {showPrintModal && (
        <div className="UabModalOverlay">

          <div className="UabModal">

            <div className="UabPreview">

              <img
                src={schoolLogo}
                alt="School"
                className="UabSchoolLogo"
              />

              <h1>ST. MARY'S SCHOOL</h1>

              <h4>Transport Summary Report</h4>

              <table className="UabPreviewTable">
                <thead>
                  <tr>
                    <th>S.NO.</th>
                    <th>VEHICLE</th>
                    <th>CAPACITY</th>
                    <th>TYPE</th>
                    <th>ROUTE</th>
                  </tr>
                </thead>

                <tbody>
                  {transportData.map((item) => (
                    <tr key={item.sno}>
                      <td>{item.sno}</td>
                      <td>{item.vehicleNo}</td>
                      <td>{item.capacity}</td>
                      <td>{item.type}</td>
                      <td>{item.route}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            <div className="UabPrintPanel">

              <h2>Print</h2>

              <div className="UabPrintOption">
                <label>Destination</label>
                <select>
                  <option>Save as PDF</option>
                </select>
              </div>

              <div className="UabPrintOption">
                <label>Pages</label>
                <select>
                  <option>All</option>
                </select>
              </div>

              <div className="UabPrintOption">
                <label>Layout</label>
                <select>
                  <option>Portrait</option>
                </select>
              </div>

              <div className="UabPrintButtons">
                <button className="UabSaveBtn">Save</button>

                <button
                  className="UabCancelBtn"
                  onClick={() => setShowPrintModal(false)}
                >
                  Cancel
                </button>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default TransportSummary;