import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./SystemSetting.css";
import {
  FaCog,
  FaSave,
  FaEdit,
  FaTrash,
  FaGasPump,
  FaRoad,
  FaInfoCircle,
  FaList,
  FaDatabase,
  FaUndo,
} from "react-icons/fa";

const SystemSetting = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    vehicle: "",
    mileage: "",
    minDailyKm: "",
    maxDailyKm: "",
    dieselRate: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get("/vehicle");

      console.log("Vehicle API Response:", data);

      if (data.success) {
        setVehicles(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // fetchMileage();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/system-setting");

      if (data.success) {
        // Backend should return an array
        setSettings(data.data || []);
      } else {
        setSettings([]);
      }
    } catch (error) {
      console.error("Error fetching system settings:", error);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        vehicle: formData.vehicle,
        minMileage: Number(formData.minMileage),
        dieselRate: Number(formData.dieselRate),
        minDailyKm: Number(formData.minDailyKm),
        maxDailyKm: Number(formData.maxDailyKm),
      };

      let res;

      if (editId) {
        res = await API.put(`/system-setting/${editId}`, payload);
      } else {
        res = await API.post("/system-setting", payload);
      }

      alert(res.data.message);

      setEditId(null);

      await fetchSettings();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      vehicle: item.vehicle?._id || "",
      minMileage: item.minMileage || "",
      dieselRate: item.dieselRate || "",
      minDailyKm: item.minDailyKm || "",
      maxDailyKm: item.maxDailyKm || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this setting?")) return;

    try {
      const res = await API.delete(`/system-setting/${id}`);

      alert(res.data.message || "Deleted Successfully");

      setSettings([]);
      setEditId(null);

      setFormData({
        minMileage: "",
        dieselRate: "",
        minDailyKm: "",
        maxDailyKm: "",
      });

      await fetchSettings();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleReset = () => {
    setFormData({
      vehicle: "",
      minMileage: "",
      dieselRate: "",
      minDailyKm: "",
      maxDailyKm: "",
    });

    setEditId(null);
  };

  return (
    <div className="ss-page-wrapper">
      {/* ===== FORM SECTION ===== */}
      <div className="ss-form-section">
        <div className="ss-form-header">
          <div className="ss-form-header-icon-box">
            <FaCog className="ss-form-header-icon" />
          </div>
          <div className="ss-form-header-text-group">
            <h2 className="ss-form-header-title">System Master Settings</h2>
            <p className="ss-form-header-subtitle">
              Configure global thresholds and operational limits
            </p>
          </div>
        </div>

        <form className="ss-form" onSubmit={handleSubmit}>
          <div className="ss-form-grid">
            <div className="ss-form-field">
              <label>Vehicle Number</label>

              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="ss-form-input"
                required
              >
                <option value="">Select Vehicle</option>

                {vehicles.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicleNo}
                  </option>
                ))}
              </select>
            </div>
            {/* Field 1: Minimum Mileage */}
            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaRoad className="ss-form-field-icon" />
                Minimum Mileage Limit
              </label>
              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="minMileage"
                  value={formData.minMileage}
                  onChange={handleChange}
                  placeholder="Enter minimum mileage"
                  step="0.1"
                  required
                />
                <span className="ss-form-input-unit">KM/L</span>
              </div>
              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Alert will be triggered if mileage falls below this limit
              </small>
            </div>

            {/* Field 2: Diesel Rate */}
            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaGasPump className="ss-form-field-icon" />
                Diesel Rate (Per Liter)
              </label>
              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="dieselRate"
                  value={formData.dieselRate}
                  onChange={handleChange}
                  placeholder="Enter diesel rate"
                  step="0.1"
                  required
                />
                <span className="ss-form-input-unit">₹</span>
              </div>
              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Current diesel price per liter
              </small>
            </div>

            {/* Field 3: Minimum Daily KM */}
            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaRoad className="ss-form-field-icon" />
                Minimum Daily KM Limit
              </label>
              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="minDailyKm"
                  value={formData.minDailyKm}
                  onChange={handleChange}
                  placeholder="Enter minimum daily KM"
                  required
                />
                <span className="ss-form-input-unit">KM</span>
              </div>
              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Alert if daily KM is below this threshold
              </small>
            </div>

            {/* Field 4: Maximum Daily KM */}
            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaRoad className="ss-form-field-icon" />
                Maximum Daily KM Limit
              </label>
              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="maxDailyKm"
                  value={formData.maxDailyKm}
                  onChange={handleChange}
                  placeholder="Enter maximum daily KM"
                  required
                />
                <span className="ss-form-input-unit">KM</span>
              </div>
              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Alert if daily KM exceeds this threshold
              </small>
            </div>
          </div>

          <div className="ss-form-actions">
            <button
              type="submit"
              className="ss-form-save-btn"
              disabled={saving}
            >
              <FaSave className="ss-form-btn-icon" />
              {saving ? "SAVING..." : "SAVE SETTINGS"}
            </button>

            <button
              type="button"
              className="ss-form-reset-btn"
              onClick={handleReset}
              disabled={saving}
            >
              <FaUndo className="ss-form-btn-icon" />
              RESET FORM
            </button>
          </div>
        </form>
      </div>

      {/* ===== TABLE SECTION ===== */}
      <div className="ss-table-section">
        <div className="ss-table-header">
          <div className="ss-table-title-group">
            <FaList className="ss-table-title-icon" />
            <h3 className="ss-table-title">Saved System Settings</h3>
          </div>
          <span className="ss-table-count">
            <FaDatabase className="ss-table-count-icon" />
            {settings.length} {settings.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>

        <div className="ss-table-wrapper">
          <table className="ss-table">
            <thead>
              <tr>
                <th className="ss-table-head">Vehicle No</th>
                <th className="ss-table-head">Min Mileage</th>
                <th className="ss-table-head">Diesel Rate</th>
                <th className="ss-table-head">Min Daily KM</th>
                <th className="ss-table-head">Max Daily KM</th>
                <th className="ss-table-head ss-table-head-actions">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : settings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ss-table-empty">
                    <FaDatabase className="ss-table-empty-icon" />
                    <span className="ss-table-empty-text">
                      No settings configured yet. Add your first setting above.
                    </span>
                  </td>
                </tr>
              ) : (
                settings.map((item) => (
                  <tr key={item._id} className="ss-table-row">
                    {/* Vehicle Number */}
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {item.vehicle?.vehicleNo || "-"}
                      </span>
                    </td>

                    {/* Mileage */}
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {item.minMileage}
                      </span>
                      <span className="ss-table-cell-unit">KM/L</span>
                    </td>

                    {/* Diesel Rate */}
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        ₹ {item.dieselRate}
                      </span>
                      <span className="ss-table-cell-unit">/L</span>
                    </td>

                    {/* Min Daily KM */}
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {item.minDailyKm}
                      </span>
                      <span className="ss-table-cell-unit">KM</span>
                    </td>

                    {/* Max Daily KM */}
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {item.maxDailyKm}
                      </span>
                      <span className="ss-table-cell-unit">KM</span>
                    </td>

                    {/* Actions */}
                    <td className="ss-table-cell ss-table-cell-actions">
                      <div className="ss-table-action-group">
                        <button
                          className="ss-table-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit className="ss-table-action-icon" />
                          Edit
                        </button>

                        <button
                          className="ss-table-delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          <FaTrash className="ss-table-action-icon" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemSetting;
