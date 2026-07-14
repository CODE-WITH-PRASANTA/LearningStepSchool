import React, { useState } from "react";
import {
  FaTruck,
  FaRoad,
  FaGasPump,
  FaExclamationCircle,
  FaTachometerAlt,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClipboard,
  FaCalendarAlt,
  FaEye,
  FaWrench,
  FaChartLine,
  FaTimes
} from "react-icons/fa";

import "./VechicleDash.css";

const VechicleDash = () => {
  const [filterDate, setFilterDate] = useState("2026-07-09");
  const [appliedDate, setAppliedDate] = useState("2026-07-09");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const vehicleData = [
    {
      id: 1,
      date: "09/07/2026",
      vehicle: "MH-12-AB-1234",
      km: "150 KM",
      mileage: "12.1 KM/L",
      status: "Normal",
      remark: "--",
      driver: "Rajesh Kumar",
      fuelType: "Diesel",
      totalKM: "45,230 KM",
      lastService: "15/06/2026"
    },
    {
      id: 2,
      date: "09/07/2026",
      vehicle: "GJ-01-XY-9875",
      km: "25 KM",
      mileage: "10.5 KM/L",
      status: "Low Mileage",
      remark: "Will try to increase usage tomorrow.",
      driver: "Amit Patel",
      fuelType: "Petrol",
      totalKM: "23,450 KM",
      lastService: "20/05/2026"
    },
    {
      id: 3,
      date: "09/07/2026",
      vehicle: "DL-01-AA-5555",
      km: "420 KM",
      mileage: "11.2 KM/L",
      status: "Over Running",
      remark: "Had to take extra delivery.",
      driver: "Suresh Singh",
      fuelType: "Diesel",
      totalKM: "67,890 KM",
      lastService: "01/07/2026"
    },
    {
      id: 4,
      date: "09/07/2026",
      vehicle: "RJ-14-CC-7890",
      km: "--",
      mileage: "--",
      status: "No Entry",
      remark: "No log submitted",
      driver: "Vikram Reddy",
      fuelType: "CNG",
      totalKM: "12,340 KM",
      lastService: "10/06/2026"
    }
  ];

  const toISODate = (str) => {
    const [d, m, y] = str.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const filteredData = vehicleData.filter(
    (item) => toISODate(item.date) === appliedDate
  );

  const handleFilter = () => {
    setAppliedDate(filterDate);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Normal": return "vechicledash_status_normal";
      case "Low Mileage": return "vechicledash_status_low";
      case "Over Running": return "vechicledash_status_over";
      default: return "vechicledash_status_empty";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Normal": return <FaCheckCircle />;
      case "Low Mileage": return <FaExclamationTriangle />;
      case "Over Running": return <FaTimesCircle />;
      default: return <FaClipboard />;
    }
  };

  return (
    <div className="vechicledash_container">

      {/* ===== FILTER SECTION ===== */}
      <div className="vechicledash_filter_wrapper">
        <div className="vechicledash_filter_left">
          <FaCalendarAlt className="vechicledash_filter_icon" />
          <span className="vechicledash_filter_label">Filter by Date</span>
        </div>
        <div className="vechicledash_filter_right">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="vechicledash_date_input"
          />
          <button className="vechicledash_filter_btn" onClick={handleFilter}>
            <FaFilter className="vechicledash_filter_btn_icon" />
            Apply Filter
          </button>
        </div>
      </div>

      {/* ===== STATISTICS ===== */}
      <div className="vechicledash_stats_grid">
        <div className="vechicledash_stat_card vechicledash_stat_blue">
          <div className="vechicledash_stat_icon_wrapper">
            <FaTruck className="vechicledash_card_icon" />
          </div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">32</h3>
            <p className="vechicledash_stat_label">Total Vehicles</p>
            <span className="vechicledash_stat_sub">All Registered Vehicles</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_indigo">
          <div className="vechicledash_stat_icon_wrapper">
            <FaRoad className="vechicledash_card_icon" />
          </div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">18,420 KM</h3>
            <p className="vechicledash_stat_label">Total Distance</p>
            <span className="vechicledash_stat_sub">Total Running Today</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_green">
          <div className="vechicledash_stat_icon_wrapper">
            <FaGasPump className="vechicledash_card_icon" />
          </div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">₹1,45,200</h3>
            <p className="vechicledash_stat_label">Total Fuel Cost</p>
            <span className="vechicledash_stat_sub">Estimated Today</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_red">
          <div className="vechicledash_stat_icon_wrapper">
            <FaExclamationCircle className="vechicledash_card_icon" />
          </div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">2</h3>
            <p className="vechicledash_stat_label">Vehicle in Alert</p>
            <span className="vechicledash_stat_sub">Need Attention</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_success">
          <div className="vechicledash_stat_icon_wrapper">
            <FaTachometerAlt className="vechicledash_card_icon" />
          </div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">12.1 KM/L</h3>
            <p className="vechicledash_stat_label">Average Mileage</p>
            <span className="vechicledash_stat_sub">Overall Average</span>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="vechicledash_table_wrapper">
        <div className="vechicledash_table_header">
          <div className="vechicledash_table_header_left">
            <h2 className="vechicledash_table_title">Vehicle Daily Summary</h2>
            <span className="vechicledash_table_count">
              {filteredData.length} vehicles found
            </span>
          </div>
          <div className="vechicledash_table_header_right">
            <button className="vechicledash_table_action">
              <FaChartLine /> Analytics
            </button>
          </div>
        </div>

        <div className="vechicledash_table_scroll">
          <table className="vechicledash_table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle Number</th>
                <th>Today's KM</th>
                <th>Mileage</th>
                <th>Status</th>
                <th>Driver Remark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="vechicledash_table_row">
                    <td>
                      <span className="vechicledash_cell_date">{item.date}</span>
                    </td>
                    <td>
                      <div className="vechicledash_cell_vehicle">
                        <span className="vechicledash_vehicle_number">{item.vehicle}</span>
                        <span className="vechicledash_vehicle_driver">{item.driver}</span>
                      </div>
                    </td>
                    <td>
                      <span className="vechicledash_cell_km">{item.km}</span>
                    </td>
                    <td>
                      <span className="vechicledash_cell_mileage">{item.mileage}</span>
                    </td>
                    <td>
                      <span className={`vechicledash_status_badge ${getStatusClass(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="vechicledash_cell_remark">{item.remark}</span>
                    </td>
                    <td>
                      <button 
                        className="vechicledash_view_btn"
                        onClick={() => {
                          setSelectedVehicle(item);
                          setShowModal(true);
                        }}
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="vechicledash_empty_row">
                    <FaClipboard className="vechicledash_empty_icon" />
                    No records found for the selected date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== LEGEND ===== */}
        <div className="vechicledash_legend">
          <span className="vechicledash_legend_title">Legend:</span>
          <div className="vechicledash_legend_items">
            <span className="vechicledash_legend_item vechicledash_legend_normal">
              <FaCheckCircle /> Normal
            </span>
            <span className="vechicledash_legend_item vechicledash_legend_low">
              <FaExclamationTriangle /> Low Mileage
            </span>
            <span className="vechicledash_legend_item vechicledash_legend_over">
              <FaTimesCircle /> Over Running
            </span>
            <span className="vechicledash_legend_item vechicledash_legend_empty">
              <FaClipboard /> No Entry
            </span>
          </div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && selectedVehicle && (
        <div className="vechicledash_modal_overlay" onClick={() => setShowModal(false)}>
          <div className="vechicledash_modal" onClick={(e) => e.stopPropagation()}>
            <button className="vechicledash_modal_close" onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
            
            <div className="vechicledash_modal_header">
              <h2>Vehicle Details</h2>
              <span className="vechicledash_modal_vehicle">{selectedVehicle.vehicle}</span>
            </div>

            <div className="vechicledash_modal_body">
              <div className="vechicledash_modal_grid">
                <div className="vechicledash_modal_item">
                  <label>Driver Name</label>
                  <p>{selectedVehicle.driver}</p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Date</label>
                  <p>{selectedVehicle.date}</p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Today's KM</label>
                  <p>{selectedVehicle.km}</p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Mileage</label>
                  <p>{selectedVehicle.mileage}</p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Status</label>
                  <p>
                    <span className={`vechicledash_status_badge ${getStatusClass(selectedVehicle.status)}`}>
                      {getStatusIcon(selectedVehicle.status)}
                      {selectedVehicle.status}
                    </span>
                  </p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Fuel Type</label>
                  <p>{selectedVehicle.fuelType}</p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Total KM</label>
                  <p>{selectedVehicle.totalKM}</p>
                </div>
                <div className="vechicledash_modal_item">
                  <label>Last Service</label>
                  <p>{selectedVehicle.lastService}</p>
                </div>
                <div className="vechicledash_modal_item vechicledash_modal_full">
                  <label>Driver Remark</label>
                  <p>{selectedVehicle.remark}</p>
                </div>
              </div>
            </div>

            <div className="vechicledash_modal_footer">
              <button className="vechicledash_modal_btn vechicledash_modal_btn_primary">
                <FaWrench /> Schedule Service
              </button>
              <button 
                className="vechicledash_modal_btn vechicledash_modal_btn_secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VechicleDash;