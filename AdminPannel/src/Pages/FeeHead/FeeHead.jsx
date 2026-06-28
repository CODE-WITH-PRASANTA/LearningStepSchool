import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import "./FeeHead.css";
import API from "../../Api/axios";
import Swal from "sweetalert2";

// Updated Dropdown Options extracted exactly from your reference images

const INSTALLMENT_TYPES = [
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Annually",
];

const FEE_TYPES = ["Day Scholar", "Hosteller"];
const ITEMS_PER_PAGE = 5; // Reduced page limit to show functionality clearly with mock data

// Custom Dropdown Component matching the reference UI design
const CustomSelect = ({ label, options, value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`fh-custom-select-wrapper ${value ? "has-value" : ""} ${isOpen ? "is-open" : ""}`}
      ref={dropdownRef}
    >
      <label className="fh-custom-select-label">
        {label} {required && <span className="fh-required-star">*</span>}
      </label>
      <div
        className="fh-custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value ? value : "Select Option..."}</span>
        <FaChevronDown className="fh-select-arrow-icon" />
      </div>
      {isOpen && (
        <div className="fh-custom-select-dropdown-menu">
          {options.map((option) => (
            <div
              key={option.value}
              className={`fh-custom-select-item ${
                value === option.value ? "is-selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FeeHead = () => {
  const [showModal, setShowModal] = useState(false);
  const [showColumnFilter, setShowColumnFilter] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentId, setCurrentId] = useState(null);
  const [feeGroups, setFeeGroups] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [columns, setColumns] = useState({
    sno: true,
    feeGroup: true,
    feeHead: true,
    shortName: true,
    priority: true,
    applyFor: true,
    gender: true,
    installment: true,
    feeType: true,
    action: true,
  });

  // Rich initial dummy data to demonstrate perfect functional pagination structures

  const [formData, setFormData] = useState({
    feeGroup: "",
    installmentType: "",
    feeHeadName: "",
    feeHeadShortName: "",
    feeType: "Day Scholar",
    applyFor: "Both",
    gender: "Both",
    refundable: "Yes",
    certificate: "Yes",
    priority: "",
  });

  const fetchFeeGroups = async () => {
    try {
      const res = await API.get("/fee-group/all");

      if (res.data.success) {
        setFeeGroups(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeeHeads = async () => {
    try {
      const res = await API.get("/fee-head/all");

      if (res.data.success) {
        setFeeHeads(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFeeGroups();
    fetchFeeHeads();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
  setEditMode(false);
  setCurrentId(null);

  setFormData({
    feeGroup: "",
    installmentType: "",
    feeHeadName: "",
    feeHeadShortName: "",
    feeType: "Day Scholar",
    applyFor: "Both",
    gender: "Both",
    refundable: "Yes",
    certificate: "Yes",
    priority: "",
  });

  setShowModal(true);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        feeGroup: formData.feeGroup,
        installmentType: formData.installmentType,
        feeHeadName: formData.feeHeadName,
        feeHeadShortName: formData.feeHeadShortName,
        feeType: formData.feeType,
        applyFor: formData.applyFor,
        gender: formData.gender,
        refundable: formData.refundable,
        certificate: formData.certificate,
        priority: Number(formData.priority),
      };

      let res;

      if (editMode) {
        res = await API.put(`/fee-head/update/${currentId}`, payload);
      } else {
        res = await API.post("/fee-head/create", payload);
      }

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: editMode ? "Updated Successfully" : "Created Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchFeeHeads();

        setFormData({
          feeGroup: "",
          installmentType: "",
          feeHeadName: "",
          feeHeadShortName: "",
          feeType: "Day Scholar",
          applyFor: "Both",
          gender: "Both",
          refundable: "Yes",
          certificate: "Yes",
          priority: "",
        });

        setCurrentId(null);
        setEditMode(false);
        setShowModal(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleEdit = (row) => {
    setCurrentId(row._id);

    setFormData({
      feeGroup: row.feeGroup?._id || "",
      installmentType: row.installmentType || "",
      feeHeadName: row.feeHeadName || "",
      feeHeadShortName: row.feeHeadShortName || "",
      feeType: row.feeType || "Day Scholar",
      applyFor: row.applyFor || "Both",
      gender: row.gender || "Both",
      refundable: row.refundable || "Yes",
      certificate: row.certificate || "Yes",
      priority: row.priority || "",
    });

    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Record?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await API.delete(`/fee-head/delete/${id}`);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchFeeHeads();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await API.get(`/fee-head/all?search=${search}`);

        setFeeHeads(res.data.data);
      } catch (error) {
        console.log(error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Logic filters
  const filteredRows = feeHeads || [];

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  }, [filteredRows]);

  // Sync core paginated view index ranges
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRows, currentPage]);

  const startRecord =
    filteredRows.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endRecord = Math.min(currentPage * ITEMS_PER_PAGE, filteredRows.length);
  const activeColumnsCount = Object.values(columns).filter(Boolean).length;
  const installmentOptions = INSTALLMENT_TYPES.map((item) => ({
    label: item,
    value: item,
  }));
  return (
    <div className="fh-main-container">
      {/* Top Application Toolbar */}
      <div className="fh-toolbar-panel">
        <div className="fh-search-control-wrapper">
          <FaSearch className="fh-search-icon" />
          <input
            className="fh-search-input"
            placeholder="Search fee head records..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="fh-action-controls-group">
          <button
            className={`fh-btn-filter-toggle ${showColumnFilter ? "fh-btn-active" : ""}`}
            onClick={() => setShowColumnFilter(!showColumnFilter)}
            title="Toggle Columns View"
          >
            <FaFilter />
          </button>

          <button
            className="fh-btn-primary-add"
            onClick={openAddModal}
            title="Create Fee Head Record"
          >
            <FaPlus /> <span>Create New</span>
          </button>
        </div>

        {showColumnFilter && (
          <div className="fh-column-popover-dropdown">
            <h4 className="fh-popover-title">Configure Headers</h4>
            <div className="fh-popover-checkbox-grid">
              {Object.keys(columns).map((key) => (
                <label className="fh-popover-checkbox-label" key={key}>
                  <input
                    type="checkbox"
                    className="fh-popover-native-checkbox"
                    checked={columns[key]}
                    onChange={() =>
                      setColumns({
                        ...columns,
                        [key]: !columns[key],
                      })
                    }
                  />
                  <span className="fh-popover-custom-text">
                    {key === "sno" ? "S.No." : key.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Table Segment */}
      <div className="fh-table-container-card">
        <table className="fh-data-table">
          <thead>
            <tr className="fh-table-row-head">
              {columns.sno && <th className="fh-table-head-cell">S.No.</th>}
              {columns.feeGroup && (
                <th className="fh-table-head-cell">Fee Group</th>
              )}
              {columns.feeHead && (
                <th className="fh-table-head-cell">Fee Head</th>
              )}
              {columns.shortName && (
                <th className="fh-table-head-cell">Short Name</th>
              )}
              {columns.priority && (
                <th className="fh-table-head-cell">Priority</th>
              )}
              {columns.applyFor && (
                <th className="fh-table-head-cell">Apply For</th>
              )}
              {columns.gender && <th className="fh-table-head-cell">Gender</th>}
              {columns.installment && (
                <th className="fh-table-head-cell">Installment</th>
              )}
              {columns.feeType && (
                <th className="fh-table-head-cell">Fee Type</th>
              )}
              {columns.action && (
                <th className="fh-table-head-cell fh-table-head-cell-actions">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, index) => (
                <tr className="fh-table-row-body" key={row._id}>
                  {columns.sno && (
                    <td className="fh-table-body-cell fh-cell-bold">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                  )}
                  {columns.feeGroup && (
                    <td className="fh-table-body-cell fh-cell-group-badge">
                      <span>{row.feeGroup?.headGroup || "—"}</span>
                    </td>
                  )}
                  {columns.feeHead && (
                    <td className="fh-table-body-cell fh-cell-primary-highlight">
                      {row.feeHeadName}
                    </td>
                  )}
                  {columns.shortName && (
                    <td className="fh-table-body-cell">
                      <span className="fh-badge-light">
                        {row.feeHeadShortName}
                      </span>
                    </td>
                  )}
                  {columns.priority && (
                    <td className="fh-table-body-cell">
                      {row.priority || "—"}
                    </td>
                  )}
                  {columns.applyFor && (
                    <td className="fh-table-body-cell">{row.applyFor}</td>
                  )}
                  {columns.gender && (
                    <td className="fh-table-body-cell">{row.gender}</td>
                  )}
                  {columns.installment && (
                    <td className="fh-table-body-cell">
                      {row.installmentType || "—"}
                    </td>
                  )}
                  {columns.feeType && (
                    <td className="fh-table-body-cell">{row.feeType}</td>
                  )}

                  {columns.action && (
                    <td className="fh-table-body-cell fh-cell-actions-container">
                      <button
                        className="fh-btn-action-edit"
                        onClick={() => handleEdit(row)}
                        title="Edit Row"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="fh-btn-action-delete"
                        onClick={() => handleDelete(row._id)}
                        title="Delete Row"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="fh-table-row-empty">
                <td
                  className="fh-table-empty-fallback-cell"
                  colSpan={activeColumnsCount}
                >
                  <div className="fh-empty-state-view">
                    <p className="fh-empty-state-text">
                      No matching records found.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Module Layout */}
      <div className="fh-pagination-bottom-bar">
        <span className="fh-pagination-summary-text">
          Showing <strong className="fh-text-dark">{startRecord}</strong> to{" "}
          <strong className="fh-text-dark">{endRecord}</strong> of{" "}
          <strong className="fh-text-dark">{filteredRows.length}</strong>{" "}
          records
        </span>

        <div className="fh-pagination-actions-nav">
          <button
            className="fh-btn-nav-arrow"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <FaChevronLeft />
          </button>

          <span className="fh-pagination-indicator">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="fh-btn-nav-arrow"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Centered Form Modal Dropdown Viewports */}
      {showModal && (
        <div className="fh-modal-overlay-backdrop">
          <form className="fh-modal-window-card" onSubmit={handleSubmit}>
            <div className="fh-modal-header-section">
              <div className="fh-modal-headline-wrapper">
                <span className="fh-modal-subtitle">
                  {editMode ? "Management Dashboard" : "Configuration Wizard"}
                </span>
                <h2 className="fh-modal-main-title">
                  {editMode ? "Modify Fee Head" : "Add Fee Head Structure"}
                </h2>
              </div>
              <button
                type="button"
                className="fh-btn-modal-close-trigger"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="fh-modal-scrollable-body">
              <div className="fh-modal-form-fields-grid">
                {/* Premium Custom Dropdown for Fee Group Structure */}
                <CustomSelect
                  label="Fee Group"
                  options={feeGroups.map((item) => ({
                    label: item.headGroup,
                    value: item._id,
                  }))}
                  value={
                    feeGroups.find((f) => f._id === formData.feeGroup)
                      ?.headGroup || ""
                  }
                  onChange={(val) => handleSelectChange("feeGroup", val)}
                  required
                />

                {/* Premium Custom Dropdown for Installment Term */}
                <CustomSelect
                  label="Installment Type"
                  options={installmentOptions}
                  value={formData.installmentType}
                  onChange={(val) => handleSelectChange("installmentType", val)}
                  required
                />

                <div className="fh-input-group-container fh-input-floating">
                  <input
                    className="fh-modal-form-input"
                    name="feeHeadName"
                    placeholder=" "
                    value={formData.feeHeadName}
                    onChange={handleChange}
                    required
                  />
                  <label className="fh-field-label-text">Fee Head Name *</label>
                </div>

                <div className="fh-input-group-container fh-input-floating">
                  <input
                    className="fh-modal-form-input"
                    name="feeHeadShortName"
                    placeholder=" "
                    value={formData.feeHeadShortName}
                    onChange={handleChange}
                    required
                  />
                  <label className="fh-field-label-text">Short Name *</label>
                </div>

                <div className="fh-input-group-container">
                  <label className="fh-field-static-label">Fee Type</label>
                  <select
                    className="fh-modal-form-select"
                    name="feeType"
                    value={formData.feeType}
                    onChange={handleChange}
                  >
                    {FEE_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fh-input-group-container fh-input-floating">
                  <input
                    className="fh-modal-form-input"
                    type="number"
                    name="priority"
                    placeholder=" "
                    value={formData.priority}
                    onChange={handleChange}
                    required
                  />
                  <label className="fh-field-label-text">Priority *</label>
                </div>
              </div>

              {/* Radio Action Row */}
              <div className="fh-modal-segment-radio-row">
                <div className="fh-radio-block-container">
                  <h4 className="fh-radio-group-header-label">Apply For</h4>
                  <div className="fh-radio-options-flex-row">
                    {["Both", "New", "Old"].map((item) => (
                      <label className="fh-radio-item-label" key={item}>
                        <input
                          type="radio"
                          className="fh-radio-native-input"
                          name="applyFor"
                          value={item}
                          checked={formData.applyFor === item}
                          onChange={handleChange}
                        />
                        <span className="fh-radio-custom-facade"></span>
                        <span className="fh-radio-label-string-text">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="fh-radio-block-container">
                  <h4 className="fh-radio-group-header-label">Gender</h4>
                  <div className="fh-radio-options-flex-row">
                    {["Both", "Male", "Female"].map((item) => (
                      <label className="fh-radio-item-label" key={item}>
                        <input
                          type="radio"
                          className="fh-radio-native-input"
                          name="gender"
                          value={item}
                          checked={formData.gender === item}
                          onChange={handleChange}
                        />
                        <span className="fh-radio-custom-facade"></span>
                        <span className="fh-radio-label-string-text">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="fh-modal-footer-action-bar">
              <button
                type="button"
                className="fh-btn-secondary-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button type="submit" className="fh-btn-primary-save">
                {editMode ? "Save Changes" : "Save Definition"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FeeHead;
