import React, { useState } from "react";
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
  const [settings, setSettings] = useState([
    { id: 1, minMileage: 10, dieselRate: 105, minDailyKm: 40, maxDailyKm: 300 },
  ]);

  const [formData, setFormData] = useState({
    minMileage: "",
    dieselRate: "",
    minDailyKm: "",
    maxDailyKm: "",
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.minMileage || !formData.dieselRate || !formData.minDailyKm || !formData.maxDailyKm) {
      alert("Please fill all fields");
      return;
    }

    const newData = {
      id: editId || Date.now(),
      minMileage: parseFloat(formData.minMileage),
      dieselRate: parseFloat(formData.dieselRate),
      minDailyKm: parseFloat(formData.minDailyKm),
      maxDailyKm: parseFloat(formData.maxDailyKm),
    };

    if (editId) {
      setSettings(settings.map((item) => (item.id === editId ? newData : item)));
      setEditId(null);
    } else {
      setSettings([newData, ...settings]);
    }

    setFormData({ minMileage: "", dieselRate: "", minDailyKm: "", maxDailyKm: "" });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      minMileage: item.minMileage,
      dieselRate: item.dieselRate,
      minDailyKm: item.minDailyKm,
      maxDailyKm: item.maxDailyKm,
    });
  };

  const handleDelete = (id) => {
    setSettings(settings.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    setFormData({
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
            <p className="ss-form-header-subtitle">Configure global thresholds and operational limits</p>
          </div>
        </div>

        <form className="ss-form" onSubmit={handleSubmit}>
          <div className="ss-form-grid">
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
            <button type="submit" className="ss-form-save-btn">
              <FaSave className="ss-form-btn-icon" />
              {editId ? "UPDATE SETTINGS" : "SAVE MASTER SETTINGS"}
            </button>
            <button type="button" className="ss-form-reset-btn" onClick={handleReset}>
              <FaUndo className="ss-form-btn-icon" />
              Reset Form
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
                <th className="ss-table-head">Min Mileage</th>
                <th className="ss-table-head">Diesel Rate</th>
                <th className="ss-table-head">Min Daily KM</th>
                <th className="ss-table-head">Max Daily KM</th>
                <th className="ss-table-head ss-table-head-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="ss-table-empty">
                    <FaDatabase className="ss-table-empty-icon" />
                    <span className="ss-table-empty-text">No settings configured yet. Add your first setting above.</span>
                  </td>
                </tr>
              ) : (
                settings.map((item) => (
                  <tr key={item.id} className="ss-table-row">
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">{item.minMileage}</span>
                      <span className="ss-table-cell-unit">KM/L</span>
                    </td>
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">₹ {item.dieselRate}</span>
                      <span className="ss-table-cell-unit">/L</span>
                    </td>
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">{item.minDailyKm}</span>
                      <span className="ss-table-cell-unit">KM</span>
                    </td>
                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">{item.maxDailyKm}</span>
                      <span className="ss-table-cell-unit">KM</span>
                    </td>
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
                          onClick={() => handleDelete(item.id)}
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