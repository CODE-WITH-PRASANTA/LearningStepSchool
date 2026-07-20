import React, { useState, useEffect } from "react";
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
import API from "../../api/axios";

const VehcleKm = () => {
  const [vehicleLogs, setVehicleLogs] = useState([]);
  const [editId, setEditId] = useState(null);

  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [kmData, setKmData] = useState({
    date: "",
    vehicle: "",
    closingKm: "",
  });

  const fetchVehicles = async () => {
    try {
      setLoadingVehicles(true);

      const { data } = await API.get("/vehicle");

      if (data.success) {
        setVehicles(data.data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchVehicleLogs = async () => {
    try {
      const { data } = await API.get("/vehicle-km");

      if (data.success) {
        setVehicleLogs(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchVehicleLogs();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        vehicle: kmData.vehicle,
        date: kmData.date,
        closingKm: Number(kmData.closingKm),
      };

      if (editId) {
        await API.put(`/vehicle-km/${editId}`, payload);
      } else {
        await API.post("/vehicle-km", payload);
      }

      fetchVehicleLogs();

      setEditId(null);

      setKmData({
        date: "",
        vehicle: "",
        closingKm: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this log?")) return;

    try {
      await API.delete(`/vehicle-km/${id}`);

      fetchVehicleLogs();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setKmData({
      date: item.date.split("T")[0],
      vehicle: item.vehicle._id,
      closingKm: item.closingKm,
    });
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
              <input
                type="date"
                name="date"
                value={kmData.date}
                onChange={handleChange}
                className="vk-input-field"
                required
              />
            </div>

            <div className="vk-form-group">
              <label>Vehicle Number</label>
              <select
                name="vehicle"
                value={kmData.vehicle}
                onChange={handleChange}
                className="vk-select-field"
                required
              >
                <option value="">
                  {loadingVehicles ? "Loading Vehicles..." : "Select Vehicle"}
                </option>

                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleNo}
                  </option>
                ))}
              </select>
            </div>

            <div className="vk-form-group">
              <label>Closing KM Reading</label>
              <input
                type="number"
                name="closingKm"
                placeholder="Enter closing KM"
                value={kmData.closingKm}
                onChange={handleChange}
                className="vk-input-field"
                required
              />
            </div>

            {kmData.vehicle && (
              <div className="vk-summary-box">
                <p>
                  <strong>Last Reading ({kmData.vehicle}):</strong>{" "}
                  {lastClosingKm} KM
                </p>
                <p>
                  <strong>Calculated Running:</strong>{" "}
                  {Math.max(0, kmData.closingKm - lastClosingKm)} KM
                </p>
              </div>
            )}

            <button type="submit" className="vk-btn-submit">
              <FaSave /> SAVE LOG
            </button>
          </form>
        </div>

        <div className="vk-info-card">
          <FaTruck size={40} />
          <h3 className="vk-info-card__title">Log Management</h3>
          <p>
            Select a vehicle to see its specific history and calculate running
            KM based on the last entry for that vehicle.
          </p>
        </div>
      </div>

      <div className="vk-table-card">
        <table className="vk-data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Opening</th>
              <th>Closing</th>
              <th>Running</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicleLogs.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.vehicle?.vehicleNo}</td>
                <td>{item.openingKm}</td>
                <td>{item.closingKm}</td>
                <td>{item.runningKm} KM</td>
                <td>
                  <button onClick={() => handleEdit(item)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    <FaTrash />
                  </button>
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
