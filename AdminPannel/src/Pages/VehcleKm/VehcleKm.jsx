import React, { useState } from "react";
import "./VehcleKm.css";
import {
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaSave,
  FaTruck,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";

const VehcleKm = () => {
  const [vehicleLogs, setVehicleLogs] = useState([
    { id: 1, date: "2026-07-09", vehicle: "GJ-01-YZ-9876", openingKm: 12475, closingKm: 12500, runningKm: 25 },
  ]);

  const [kmData, setKmData] = useState({ date: "", vehicle: "", closingKm: "" });

  // Get the latest closing KM for the SPECIFIC vehicle selected
  const getLastClosingKm = () => {
    if (!kmData.vehicle) return 0;
    const vehicleEntries = vehicleLogs
      .filter((log) => log.vehicle === kmData.vehicle)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return vehicleEntries.length > 0 ? vehicleEntries[0].closingKm : 0;
  };

  const lastClosingKm = getLastClosingKm();

  const handleChange = (e) => {
    setKmData({ ...kmData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kmData.date || !kmData.vehicle || !kmData.closingKm) {
      alert("Please fill all fields");
      return;
    }

    const openingKm = lastClosingKm;
    const closingKmNum = Number(kmData.closingKm);
    const runningKm = closingKmNum - openingKm;

    if (runningKm < 0) {
      alert(`Closing KM cannot be less than the last record for this vehicle (${openingKm} KM)`);
      return;
    }

    const newLog = {
      id: Date.now(),
      date: kmData.date,
      vehicle: kmData.vehicle,
      openingKm: openingKm,
      closingKm: closingKmNum,
      runningKm: runningKm,
    };

    setVehicleLogs([newLog, ...vehicleLogs].sort((a, b) => new Date(b.date) - new Date(a.date)));
    setKmData({ date: "", vehicle: "", closingKm: "" });
  };

  const handleDelete = (id) => {
    setVehicleLogs(vehicleLogs.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setKmData({ date: item.date, vehicle: item.vehicle, closingKm: item.closingKm });
    setVehicleLogs(vehicleLogs.filter((log) => log.id !== item.id));
  };

  return (
    <div className="vk-page-wrapper">
      <div className="vk-header">
        <h2 className="vk-header__title">Daily KM Log Entry</h2>
      </div>

      <div className="vk-grid">
        <div className="vk-card-form">
          <form onSubmit={handleSubmit}>
            <div className="vk-form-group">
              <label>Date</label>
              <input type="date" name="date" value={kmData.date} onChange={handleChange} className="vk-input-field" required />
            </div>

            <div className="vk-form-group">
              <label>Vehicle Number</label>
              <select name="vehicle" value={kmData.vehicle} onChange={handleChange} className="vk-select-field" required>
                <option value="">Select Vehicle</option>
                <option value="GJ-01-YZ-9876">GJ-01-YZ-9876</option>
                <option value="OD-02-AB-4587">OD-02-AB-4587</option>
                <option value="MH-11-XY-2587">MH-11-XY-2587</option>
              </select>
            </div>

            <div className="vk-form-group">
              <label>Closing KM Reading</label>
              <input type="number" name="closingKm" placeholder="Enter closing KM" value={kmData.closingKm} onChange={handleChange} className="vk-input-field" required />
            </div>

            {kmData.vehicle && (
              <div className="vk-summary-box">
                <p><strong>Last Reading ({kmData.vehicle}):</strong> {lastClosingKm} KM</p>
                <p><strong>Calculated Running:</strong> {Math.max(0, kmData.closingKm - lastClosingKm)} KM</p>
              </div>
            )}

            <button type="submit" className="vk-btn-submit"><FaSave /> SAVE LOG</button>
          </form>
        </div>

        <div className="vk-info-card">
          <FaTruck size={40} />
          <h3 className="vk-info-card__title">Log Management</h3>
          <p>Select a vehicle to see its specific history and calculate running KM based on the last entry for that vehicle.</p>
        </div>
      </div>

      <div className="vk-table-card">
        <table className="vk-data-table">
          <thead>
            <tr>
              <th>Date</th><th>Vehicle</th><th>Opening</th><th>Closing</th><th>Running</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicleLogs.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.vehicle}</td>
                <td>{item.openingKm}</td>
                <td>{item.closingKm}</td>
                <td>{item.runningKm} KM</td>
                <td>
                  <button onClick={() => handleEdit(item)}><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehcleKm;