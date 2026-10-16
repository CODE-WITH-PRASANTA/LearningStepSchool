import React, { useState, useEffect, useRef } from "react";
import API from "../../api/axios";
import "./SystemSetting.css";

import {
  FaCog,
  FaSave,
  FaEdit,
  FaTrash,
  FaRoad,
  FaInfoCircle,
  FaList,
  FaDatabase,
  FaUndo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaStrikethrough,
  FaEraser,
} from "react-icons/fa";

/* =========================================================
   RICH TEXT DESCRIPTION EDITOR
========================================================= */

const DescriptionEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const executeCommand = (command, commandValue = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    document.execCommand(command, false, commandValue);

    onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toolbarButtons = [
    {
      icon: <FaBold />,
      command: "bold",
      title: "Bold",
    },
    {
      icon: <FaItalic />,
      command: "italic",
      title: "Italic",
    },
    {
      icon: <FaUnderline />,
      command: "underline",
      title: "Underline",
    },
    {
      icon: <FaStrikethrough />,
      command: "strikeThrough",
      title: "Strikethrough",
    },
    {
      icon: <FaListUl />,
      command: "insertUnorderedList",
      title: "Bullet List",
    },
    {
      icon: <FaListOl />,
      command: "insertOrderedList",
      title: "Numbered List",
    },
    {
      icon: <FaAlignLeft />,
      command: "justifyLeft",
      title: "Align Left",
    },
    {
      icon: <FaAlignCenter />,
      command: "justifyCenter",
      title: "Align Center",
    },
    {
      icon: <FaAlignRight />,
      command: "justifyRight",
      title: "Align Right",
    },
  ];

  return (
    <div
      className={`ss-description-editor ${
        focused ? "ss-editor-focused" : ""
      }`}
    >
      <div className="ss-editor-toolbar">
        {toolbarButtons.map((button) => (
          <button
            key={button.command}
            type="button"
            className="ss-editor-toolbar-btn"
            title={button.title}
            aria-label={button.title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => executeCommand(button.command)}
          >
            {button.icon}
          </button>
        ))}

        <button
          type="button"
          className="ss-editor-toolbar-btn"
          title="Clear Formatting"
          aria-label="Clear Formatting"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("removeFormat")}
        >
          <FaEraser />
        </button>
      </div>

      <div
        ref={editorRef}
        className="ss-editor-content"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Setting description"
        aria-multiline="true"
        data-placeholder="Enter a description for these vehicle settings..."
        onInput={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          handleInput();
        }}
      />
    </div>
  );
};

/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
  vehicle: "",
  minMileage: "",
  minDailyKm: "",
  maxDailyKm: "",
  description: "",
};

/* =========================================================
   SYSTEM SETTING COMPONENT
========================================================= */

const SystemSetting = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState(initialForm);

  const [editId, setEditId] = useState(null);

  /* =====================================================
     FETCH VEHICLES
  ===================================================== */

  const fetchVehicles = async () => {
    try {
      const { data } = await API.get("/vehicle");

      if (data.success) {
        setVehicles(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  /* =====================================================
     FETCH SETTINGS
  ===================================================== */

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/system-setting");

      if (data.success) {
        setSettings(data.data || []);
      } else {
        setSettings([]);
      }
    } catch (error) {
      console.error(
        "Error fetching system settings:",
        error
      );

      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchVehicles();
    fetchSettings();
  }, []);

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     HANDLE DESCRIPTION CHANGE
  ===================================================== */

  const handleDescriptionChange = (value) => {
    setFormData((previous) => ({
      ...previous,
      description: value,
    }));
  };

  /* =====================================================
     SUBMIT SETTINGS
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.vehicle) {
      alert("Please select a vehicle.");
      return;
    }

    if (
      formData.minMileage === "" ||
      formData.minDailyKm === "" ||
      formData.maxDailyKm === ""
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const minMileage = Number(formData.minMileage);
    const minDailyKm = Number(formData.minDailyKm);
    const maxDailyKm = Number(formData.maxDailyKm);

    if (
      !Number.isFinite(minMileage) ||
      !Number.isFinite(minDailyKm) ||
      !Number.isFinite(maxDailyKm) ||
      minMileage < 0 ||
      minDailyKm < 0 ||
      maxDailyKm < 0
    ) {
      alert("Please enter valid, non-negative values.");
      return;
    }

    if (maxDailyKm < minDailyKm) {
      alert(
        "Maximum daily KM must be greater than or equal to minimum daily KM."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        vehicle: formData.vehicle,
        minMileage,
        minDailyKm,
        maxDailyKm,
        description: formData.description,
      };

      let response;

      if (editId) {
        response = await API.put(
          `/system-setting/${editId}`,
          payload
        );
      } else {
        response = await API.post(
          "/system-setting",
          payload
        );
      }

      alert(
        response.data?.message ||
          (editId
            ? "Settings updated successfully."
            : "Settings saved successfully.")
      );

      handleReset();

      await fetchSettings();
    } catch (error) {
      console.error("Error saving system settings:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong while saving settings."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     EDIT SETTINGS
  ===================================================== */

  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      vehicle: item.vehicle?._id || item.vehicle || "",
      minMileage: item.minMileage ?? "",
      minDailyKm: item.minDailyKm ?? "",
      maxDailyKm: item.maxDailyKm ?? "",
      description: item.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE SETTINGS
  ===================================================== */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this setting?")) {
      return;
    }

    try {
      const response = await API.delete(
        `/system-setting/${id}`
      );

      alert(
        response.data?.message ||
          "Settings deleted successfully."
      );

      if (editId === id) {
        handleReset();
      }

      await fetchSettings();
    } catch (error) {
      console.error("Error deleting settings:", error);

      alert(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const handleReset = () => {
    setFormData(initialForm);
    setEditId(null);
  };

  /* =====================================================
     FORMAT NUMBER
  ===================================================== */

  const formatNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "—";
    }

    return Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="ss-page-wrapper">
      {/* ================================================
          FORM SECTION
      ================================================ */}

      <div className="ss-form-section">
        <div className="ss-form-header">
          <div className="ss-form-header-icon-box">
            <FaCog className="ss-form-header-icon" />
          </div>

          <div className="ss-form-header-text-group">
            <h2 className="ss-form-header-title">
              System Master Settings
            </h2>

            <p className="ss-form-header-subtitle">
              Configure vehicle mileage limits, daily KM ranges
              and operational descriptions.
            </p>
          </div>
        </div>

        <form className="ss-form" onSubmit={handleSubmit}>
          <div className="ss-form-grid">
            {/* VEHICLE NUMBER */}

            <div className="ss-form-field">
              <label className="ss-form-field-label">
                Vehicle Number
                <span className="ss-required-mark"> *</span>
              </label>

              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="ss-form-input"
                required
              >
                <option value="">Select Vehicle</option>

                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle._id}
                    value={vehicle._id}
                  >
                    {vehicle.vehicleNo}
                  </option>
                ))}
              </select>
            </div>

            {/* MINIMUM MILEAGE */}

            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaRoad className="ss-form-field-icon" />
                Minimum Mileage Limit
                <span className="ss-required-mark"> *</span>
              </label>

              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="minMileage"
                  value={formData.minMileage}
                  onChange={handleChange}
                  placeholder="Enter minimum mileage"
                  min="0"
                  step="0.1"
                  required
                />

                <span className="ss-form-input-unit">
                  KM/L
                </span>
              </div>

              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Alert if mileage falls below this limit.
              </small>
            </div>

            {/* MINIMUM DAILY KM */}

            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaRoad className="ss-form-field-icon" />
                Minimum Daily KM
                <span className="ss-required-mark"> *</span>
              </label>

              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="minDailyKm"
                  value={formData.minDailyKm}
                  onChange={handleChange}
                  placeholder="Enter minimum daily KM"
                  min="0"
                  step="1"
                  required
                />

                <span className="ss-form-input-unit">
                  KM
                </span>
              </div>

              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Minimum expected distance per day.
              </small>
            </div>

            {/* MAXIMUM DAILY KM */}

            <div className="ss-form-field">
              <label className="ss-form-field-label">
                <FaRoad className="ss-form-field-icon" />
                Maximum Daily KM
                <span className="ss-required-mark"> *</span>
              </label>

              <div className="ss-form-input-box">
                <input
                  className="ss-form-input"
                  type="number"
                  name="maxDailyKm"
                  value={formData.maxDailyKm}
                  onChange={handleChange}
                  placeholder="Enter maximum daily KM"
                  min="0"
                  step="1"
                  required
                />

                <span className="ss-form-input-unit">
                  KM
                </span>
              </div>

              <small className="ss-form-field-note">
                <FaInfoCircle className="ss-form-note-icon" />
                Maximum expected distance per day.
              </small>
            </div>

            {/* DESCRIPTION WITH TEXT EDITOR */}

            <div className="ss-form-field ss-description-field">
              <label className="ss-form-field-label">
                <FaInfoCircle className="ss-form-field-icon" />
                Description
              </label>

              <DescriptionEditor
                value={formData.description}
                onChange={handleDescriptionChange}
              />

              <small className="ss-form-field-note">
                Add vehicle-specific rules, usage instructions,
                mileage notes or operational guidelines.
              </small>
            </div>
          </div>

          {/* FORM ACTIONS */}

          <div className="ss-form-actions">
            <button
              type="submit"
              className="ss-form-save-btn"
              disabled={saving}
            >
              <FaSave className="ss-form-btn-icon" />

              {saving
                ? "SAVING..."
                : editId
                ? "UPDATE SETTINGS"
                : "SAVE SETTINGS"}
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

      {/* ================================================
          TABLE SECTION
      ================================================ */}

      <div className="ss-table-section">
        <div className="ss-table-header">
          <div className="ss-table-title-group">
            <FaList className="ss-table-title-icon" />

            <h3 className="ss-table-title">
              Saved System Settings
            </h3>
          </div>

          <span className="ss-table-count">
            <FaDatabase className="ss-table-count-icon" />

            {settings.length}{" "}
            {settings.length === 1 ? "Entry" : "Entries"}
          </span>
        </div>

        <div className="ss-table-wrapper">
          <table className="ss-table">
            <thead>
              <tr>
                <th className="ss-table-head">
                  Vehicle No
                </th>

                <th className="ss-table-head">
                  Min Mileage
                </th>

                <th className="ss-table-head">
                  Min Daily KM
                </th>

                <th className="ss-table-head">
                  Max Daily KM
                </th>

                <th className="ss-table-head">
                  Description
                </th>

                <th className="ss-table-head ss-table-head-actions">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center" }}
                  >
                    Loading settings...
                  </td>
                </tr>
              ) : settings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="ss-table-empty"
                  >
                    <FaDatabase className="ss-table-empty-icon" />

                    <span className="ss-table-empty-text">
                      No settings configured yet. Add your first
                      setting above.
                    </span>
                  </td>
                </tr>
              ) : (
                settings.map((item) => (
                  <tr
                    key={item._id}
                    className="ss-table-row"
                  >
                    {/* VEHICLE */}

                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {item.vehicle?.vehicleNo ||
                          item.vehicleNo ||
                          "—"}
                      </span>
                    </td>

                    {/* MINIMUM MILEAGE */}

                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {formatNumber(item.minMileage)}
                      </span>

                      <span className="ss-table-cell-unit">
                        KM/L
                      </span>
                    </td>

                    {/* MINIMUM DAILY KM */}

                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {formatNumber(item.minDailyKm)}
                      </span>

                      <span className="ss-table-cell-unit">
                        KM
                      </span>
                    </td>

                    {/* MAXIMUM DAILY KM */}

                    <td className="ss-table-cell">
                      <span className="ss-table-cell-value">
                        {formatNumber(item.maxDailyKm)}
                      </span>

                      <span className="ss-table-cell-unit">
                        KM
                      </span>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="ss-table-cell">
                      {item.description ? (
                        <div
                          className="ss-description-preview"
                          dangerouslySetInnerHTML={{
                            __html: item.description,
                          }}
                        />
                      ) : (
                        <span className="ss-table-cell-unit">
                          No description
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="ss-table-cell ss-table-cell-actions">
                      <div className="ss-table-action-group">
                        <button
                          type="button"
                          className="ss-table-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit className="ss-table-action-icon" />
                          Edit
                        </button>

                        <button
                          type="button"
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