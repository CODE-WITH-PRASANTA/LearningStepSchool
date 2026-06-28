import React, { useState } from "react";
import API from "../../Api/axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import "./FeeStructure.css";


// Master Reference Dropdown Configurations
const STRUCTURE_TYPES = ["Monthly", "Quarterly", "Half-Yearly", "Annually"];
const CLASSES = [
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];
const STREAMS = [
  "None",
  "Humanities",
  "Science",
  "Commerce",
  "Hostel + Tuitions",
];

const FeeStructure = () => {
  // Navigation, Search and Pagination View States
  const [dashboardData, setDashboardData] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Overlays / Popform Open Flags
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  // Input Selection Fields State Core
  const [selectedStructureType, setSelectedStructureType] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

  // Spreadsheet Dynamic Valuation Map
  const [gridValues, setGridValues] = useState({});

  const fetchFeeHeads = async () => {
    try {
      const res = await API.get("/fee-head/all");

      if (res.data.success) {
        setFeeHeads(res.data.data);
      }
      console.log(feeHeads);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFeeStructures = async (searchText = "") => {
    try {
      const res = await API.get(`/fee-structure/all?search=${searchText}`);

      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFeeHeads();
    fetchFeeStructures();
  }, []);

  // Dynamic Head Layout Parser based on Structure Context selection
  const getGridHeaders = (type) => {
    switch (type) {
      case "Quarterly":
        return ["APR", "JUL", "OCT", "JAN"];
      case "Half-Yearly":
        return ["APR", "OCT"];
      case "Annually":
        return ["APR"];
      case "Monthly":
      default:
        return [
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
          "JAN",
          "FEB",
          "MAR",
        ];
    }
  };

  const handleClassCheckboxChange = (className) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== className));
    } else {
      setSelectedClasses([...selectedClasses, className]);
    }
  };

  const handleGridInputChange = (feeHeadId, colHeader, value) => {
    const numValue = parseFloat(value) || 0;
    setGridValues((prev) => ({
      ...prev,
      [`${feeHeadId}-${colHeader}`]: numValue,
    }));
  };

  const calculateRowTotal = (feeHeadId, columns) => {
    return columns.reduce(
      (sum, col) => sum + (gridValues[`${feeHeadId}-${col}`] || 0),
      0,
    );
  };

  const saveStructure = async () => {
    try {
      const feeItems = filteredFeeHeads.map((head) => {
        const amounts = {};

        activeGridCols.forEach((col) => {
          amounts[col] = gridValues[`${head._id}-${col}`] || 0;
        });

        return {
          feeHead: head._id,
          amounts,
          total: activeGridCols.reduce(
            (sum, col) => sum + (gridValues[`${head._id}-${col}`] || 0),
            0,
          ),
        };
      });

      if (!selectedStructureType) {
        return Swal.fire({
          icon: "warning",
          title: "Select Structure Type",
        });
      }

      if (selectedClasses.length === 0) {
        return Swal.fire({
          icon: "warning",
          title: "Select Class",
        });
      }

      const payload = {
        structureType: selectedStructureType,
        className: selectedClasses.join(", "),
        stream: selectedStream,
        feeItems,
        grandTotal: calculateGrandTotal(activeGridCols),
      };

      const res = await API.post("/fee-structure/create", payload);

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Structure Created",
        });
        setEditingId(null);
        fetchFeeStructures();
        resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStructure = async () => {
    try {
      const feeItems = filteredFeeHeads.map((head) => {
        const amounts = {};

        activeGridCols.forEach((col) => {
          amounts[col] = gridValues[`${head._id}-${col}`] || 0;
        });

        return {
          feeHead: head._id,
          amounts,
        };
      });

      const res = await API.put(`/fee-structure/update/${editingId}`, {
        structureType: selectedStructureType,
        className: selectedClasses.join(", "),
        stream: selectedStream,
        feeItems,
        grandTotal: calculateGrandTotal(activeGridCols),
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Structure Updated Successfully",
        });
        fetchFeeStructures();
        resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateGrandTotal = (columns) => {
    return filteredFeeHeads.reduce((grandSum, head) => {
      return grandSum + calculateRowTotal(head._id, columns);
    }, 0);
  };

  const handleDeleteRow = async (id) => {
    const result = await Swal.fire({
      title: "Delete Structure?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await API.delete(`/fee-structure/delete/${id}`);

      if (res.data.success) {
        fetchFeeStructures();

        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModify = (row) => {
    setEditingId(row._id);

    setSelectedStructureType(row.structureType);

    setSelectedClasses([row.className]);

    setSelectedStream(row.stream);

    const loadedValues = {};

    row.feeItems.forEach((item) => {
      Object.entries(item.amounts).forEach(([month, value]) => {
        loadedValues[`${item.feeHead._id || item.feeHead}-${month}`] = value;
      });
    });

    setGridValues(loadedValues);

    setIsModifyModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedStructureType("");
    setSelectedClasses([]);
    setSelectedStream("");
    setGridValues({});
    setIsClassDropdownOpen(false);
    setIsAddModalOpen(false);
    setIsModifyModalOpen(false);
  };

  const filteredDashboard = dashboardData;
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeeStructures(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const activeGridCols = getGridHeaders(selectedStructureType);

  const filteredFeeHeads = feeHeads.filter(
    (head) =>
      head.installmentType?.toLowerCase() ===
      selectedStructureType?.toLowerCase(),
  );

  return (
    <div className="fs-premium-layout">
      {/* PREMIUM HEADER CONTROLS BAR */}
      <div className="fs-top-control-panel">
        <div className="fs-search-box-container">
          <span className="fs-search-glass-icon">🔍</span>
          <input
            type="text"
            placeholder="Search classes, streams or fee structures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="fs-global-search-input"
          />
        </div>
        <button
          className="fs-btn-trigger-add"
          onClick={() => setIsAddModalOpen(true)}
          title="Add New Fee Structure"
        >
          <span className="fs-plus-symbol">+</span>
        </button>
      </div>

      {/* DASHBOARD CORE MASTER SPREADSHEET TABLE */}
      <div className="fs-dashboard-card-wrap">
        <table className="fs-dashboard-core-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Class</th>
              <th>Stream</th>
              <th>Structure Type</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDashboard.length > 0 ? (
              filteredDashboard.map((row, index) => (
                <tr key={row._id} className="fs-dashboard-interactive-row">
                  <td className="fs-text-bold-heavy">{index + 1}</td>
                  <td className="fs-text-brand-emphasis">{row.className}</td>
                  <td>
                    <span
                      className={`fs-pill-badge ${row.stream === "None" ? "pill-muted" : "pill-vibrant"}`}
                    >
                      {row.stream}
                    </span>
                  </td>
                  <td className="fs-text-dark-primary">{row.structureType}</td>
                  <td>
                    <div className="fs-row-action-cluster">
                      <button
                        className="fs-action-btn-modify"
                        onClick={() => handleOpenModify(row)}
                        title="Modify Form Layout"
                      >
                        ✏️ <span className="fs-inline-btn-text">Modify</span>
                      </button>
                      <button
                        className="fs-action-btn-remove"
                        onClick={() => handleDeleteRow(row._id)}
                        title="Delete Entry"
                      >
                        🗑️ <span className="fs-inline-btn-text">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="fs-table-empty-fallback">
                  No matching fee records discovered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PREMIUM ATTRACTIVE PAGINATION FOOTER */}
      <div className="fs-premium-pagination-footer">
        <div className="fs-pagination-size-selector">
          <label className="fs-pagination-label-large">Rows per page:</label>
          <div className="fs-custom-select-wrapper">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="fs-select-pagination-field"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="fs-pagination-navigator-block">
          <span className="fs-pagination-counter-display">
            1 – {filteredDashboard.length} of {filteredDashboard.length}
          </span>
          <div className="fs-pagination-control-arrows">
            <button
              className="fs-nav-arrow-button-disabled"
              disabled
              aria-label="Previous Page"
            >
              &#8249;
            </button>
            <button
              className="fs-nav-arrow-button-disabled"
              disabled
              aria-label="Next Page"
            >
              &#8250;
            </button>
          </div>
        </div>
      </div>

      {/* ==================== SCREEN POPFORM LAYER OVERLAY: ADD ENTRY ==================== */}
      {isAddModalOpen && (
        <div className="fs-glass-modal-backdrop">
          <div className="fs-modal-surface-container size-xl animate-scale-up">
            <div className="fs-modal-primary-heading-bar">
              <h2>FEE STRUCTURE</h2>
              <button className="fs-modal-dismiss-cross" onClick={resetForm}>
                ✕
              </button>
            </div>

            <div className="fs-modal-scrollable-payload">
              {/* Image Dynamic Input Dropdown Controls Header Grid Row */}
              <div className="fs-popform-dropdowns-row">
                {/* 1. Structure Type selection menu option dropdown */}
                <div className="fs-form-group-block">
                  <label className="fs-input-top-label">Structure Type *</label>
                  <select
                    value={selectedStructureType}
                    onChange={(e) => setSelectedStructureType(e.target.value)}
                    className="fs-interactive-form-select"
                  >
                    <option value="">Select Type</option>
                    {STRUCTURE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Class Checkbox Multiple Selection Dropdown block */}
                <div className="fs-form-group-block relative-anchor">
                  <label className="fs-input-top-label">Class :*</label>
                  <div
                    className="fs-multiselect-custom-box"
                    onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  >
                    <span className="fs-truncated-text-value">
                      {selectedClasses.length === 0
                        ? "Select Classes"
                        : selectedClasses.join(", ")}
                    </span>
                    <span className="fs-chevron-symbol-indicator">▼</span>
                  </div>

                  {isClassDropdownOpen && (
                    <div className="fs-multiselect-popover-panel">
                      {CLASSES.map((cls) => (
                        <label
                          key={cls}
                          className="fs-popover-checkbox-row-item"
                        >
                          <input
                            type="checkbox"
                            className="fs-premium-styled-checkbox"
                            checked={selectedClasses.includes(cls)}
                            onChange={() => handleClassCheckboxChange(cls)}
                          />
                          <span className="fs-checkbox-label-text">{cls}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Stream Configuration Input menu element block */}
                <div className="fs-form-group-block">
                  <div className="fs-label-header-action-row">
                    <label className="fs-input-top-label">Stream</label>
                    <button type="button" className="fs-inline-action-link-btn">
                      + Add Stream
                    </button>
                  </div>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="fs-interactive-form-select"
                  >
                    <option value="">Select Stream</option>
                    {STREAMS.map((str) => (
                      <option key={str} value={str}>
                        {str}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Matrix Layout Entry Matrix View Section */}
              {selectedStructureType ? (
                <div className="fs-matrix-spreadsheet-wrapper animate-fade-in-slide">
                  <div className="fs-spreadsheet-horizontal-scroll">
                    <table className="fs-spreadsheet-matrix-table">
                      <thead>
                        <tr>
                          <th>FEE HEAD</th>
                          <th>FEE TYPE</th>
                          {activeGridCols.map((col) => (
                            <th key={col} className="fs-center-header">
                              {col}
                            </th>
                          ))}
                          <th className="fs-center-header">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFeeHeads.map((head) => (
                          <tr
                            key={head._id}
                            className="fs-spreadsheet-body-row"
                          >
                            <td className="fs-matrix-cell-title-primary">
                              {head.feeHeadName}
                            </td>
                            <td className="fs-matrix-cell-type-badge">
                              <span className="fs-type-tag-label">
                                {head.installmentType}
                              </span>
                            </td>
                            {activeGridCols.map((col) => (
                              <td
                                key={col}
                                className="fs-matrix-input-cell-wrapper"
                              >
                                <input
                                  type="number"
                                  placeholder="0"
                                  value={gridValues[`${head._id}-${col}`] || ""}
                                  onChange={(e) =>
                                    handleGridInputChange(
                                      head._id,
                                      col,
                                      e.target.value,
                                    )
                                  }
                                  className="fs-matrix-numeric-field-input"
                                />
                              </td>
                            ))}
                            <td className="fs-matrix-cell-row-accumulated-total">
                              {calculateRowTotal(head._id, activeGridCols)}
                            </td>
                          </tr>
                        ))}
                        <tr className="fs-matrix-grand-summary-footer-row">
                          <td
                            colSpan={2}
                            className="fs-grand-total-title-label"
                          >
                            Grand Total
                          </td>
                          {activeGridCols.map((col) => (
                            <td
                              key={col}
                              className="fs-column-calculated-sum-cell"
                            >
                              {filteredFeeHeads.reduce(
                                (sum, h) =>
                                  sum + (gridValues[`${h._id}-${col}`] || 0),
                                0,
                              )}
                            </td>
                          ))}
                          <td className="fs-grand-final-highlight-badge-cell">
                            {calculateGrandTotal(activeGridCols)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="fs-matrix-placeholder-notice">
                  Please assign a <strong>Structure Type</strong> to generate
                  the specific monthly data entry matrix.
                </div>
              )}
            </div>

            <div className="fs-popform-action-footer-panel">
              <button
                className="fs-btn-premium-secondary-cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                className="fs-btn-premium-primary-submit"
                onClick={saveStructure}
              >
                Add Structure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCREEN POPFORM LAYER OVERLAY: MODIFY ENTRY ==================== */}
      {isModifyModalOpen && (
        <div className="fs-glass-modal-backdrop">
          <div className="fs-modal-surface-container size-xl animate-scale-up">
            <div className="fs-modal-primary-heading-bar status-modify-accent">
              <h2>FEE STRUCTURE (MODIFY MODE)</h2>
              <button className="fs-modal-dismiss-cross" onClick={resetForm}>
                ✕
              </button>
            </div>

            <div className="fs-modal-scrollable-payload">
              <div className="fs-premium-alert-banner-info">
                ⚠️ You are adjusting configuration blueprints and parameters for
                Class: <strong>{selectedClasses.join(", ") || "N.C."}</strong>
              </div>

              <div className="fs-matrix-spreadsheet-wrapper">
                <div className="fs-spreadsheet-horizontal-scroll">
                  <table className="fs-spreadsheet-matrix-table modification-grid-theme">
                    <thead>
                      <tr>
                        <th>FEE HEAD</th>
                        <th>FEE TYPE</th>
                        {activeGridCols.map((col) => (
                          <th key={col} className="fs-center-header">
                            {col}
                          </th>
                        ))}
                        <th className="fs-center-header">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFeeHeads.map((head) => (
                        <tr
                          key={head._id}
                          className="fs-spreadsheet-body-row modified-highlight-rows"
                        >
                          <td className="fs-matrix-cell-title-primary text-modify-dark">
                            {head.feeHeadName}
                          </td>
                          <td className="fs-matrix-cell-type-badge">
                            <span className="fs-type-tag-label border-accent-tag">
                              {head.installmentType}
                            </span>
                          </td>
                          {activeGridCols.map((col) => (
                            <td
                              key={col}
                              className="fs-matrix-input-cell-wrapper"
                            >
                              <input
                                type="number"
                                placeholder="0"
                                value={gridValues[`${head._id}-${col}`] ?? ""}
                                onChange={(e) =>
                                  handleGridInputChange(
                                    head._id,
                                    col,
                                    e.target.value,
                                  )
                                }
                                className="fs-matrix-numeric-field-input state-modify-highlight"
                              />
                            </td>
                          ))}
                          <td className="fs-matrix-cell-row-accumulated-total text-modify-heavy-bold">
                            {calculateRowTotal(head._id, activeGridCols)}
                          </td>
                        </tr>
                      ))}
                      <tr className="fs-matrix-grand-summary-footer-row modification-footer-theme">
                        <td colSpan={2} className="fs-grand-total-title-label">
                          Grand Total
                        </td>
                        {activeGridCols.map((col) => (
                          <td
                            key={col}
                            className="fs-column-calculated-sum-cell text-modify-sum"
                          >
                            {filteredFeeHeads.reduce(
                              (sum, h) =>
                                sum + (gridValues[`${h._id}-${col}`] || 0),
                              0,
                            )}
                          </td>
                        ))}
                        <td className="fs-grand-final-highlight-badge-cell variant-modify-active-total">
                          {calculateGrandTotal(activeGridCols) || 4500}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="fs-popform-action-footer-panel">
              <button
                className="fs-btn-premium-secondary-cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                className="fs-btn-premium-modify-save"
                onClick={updateStructure}
              >
                Modify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;
