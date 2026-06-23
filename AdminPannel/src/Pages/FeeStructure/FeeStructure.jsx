import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "./FeeStructure.css";

// Master Reference Dropdown Configurations
const STRUCTURE_TYPES = ["Monthly", "Quarterly", "Half-Yearly", "Annually"];
const CLASSES = ["LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];
const STREAMS = [
  "None",
  "Humanities",
  "Science",
  "Commerce",
  "Hostel + Tuitions",
];

// Mock Premium Static Fee Heads Structure Configuration
const MOCK_FEE_HEADS = [
  { _id: "fh_1", feeHeadName: "Admission Fee", installmentType: "One-Time" },
  { _id: "fh_2", feeHeadName: "Tuition Fee", installmentType: "Recurring" },
  { _id: "fh_3", feeHeadName: "Development Fee", installmentType: "Annually" },
  { _id: "fh_4", feeHeadName: "Exam Fee", installmentType: "Quarterly" },
  { _id: "fh_5", feeHeadName: "Transport Fee", installmentType: "Monthly" }
];

// Mock Initial Dashboard Configurations Data blueprints
const INITIAL_DASHBOARD_DATA = [
  {
    _id: "struct_1",
    className: "1st, 2nd, 3rd",
    stream: "None",
    structureType: "Quarterly",
    grandTotal: 12000,
    feeItems: [
      { feeHead: "fh_2", amounts: { APR: 1500, JUL: 1500, OCT: 1500, JAN: 1500 } },
      { feeHead: "fh_4", amounts: { APR: 1500, JUL: 1500, OCT: 1500, JAN: 1500 } }
    ]
  },
  {
    _id: "struct_2",
    className: "11th, 12th",
    stream: "Science",
    structureType: "Monthly",
    grandTotal: 24000,
    feeItems: [
      { feeHead: "fh_2", amounts: { APR: 2000, MAY: 2000, JUN: 2000, JUL: 2000, AUG: 2000, SEP: 2000, OCT: 2000, NOV: 2000, DEC: 2000, JAN: 2000, FEB: 2000, MAR: 2000 } }
    ]
  }
];

const FeeStructure = () => {
  // Pure Frontend State Core Engine
  const [dashboardData, setDashboardData] = useState(() => {
    const localData = localStorage.getItem("frontend_fee_structures");
    return localData ? JSON.parse(localData) : INITIAL_DASHBOARD_DATA;
  });
  
  const [feeHeads] = useState(MOCK_FEE_HEADS);
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
  
  // Custom Premium Dropdown Toggles
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isStreamDropdownOpen, setIsStreamDropdownOpen] = useState(false);

  // Dropdown Popover Reference Anchor Nodes
  const typeDropdownRef = useRef(null);
  const classDropdownRef = useRef(null);
  const streamDropdownRef = useRef(null);

  // Spreadsheet Dynamic Valuation Map
  const [gridValues, setGridValues] = useState({});

  // Sync state data engine to browser local memory safely
  useEffect(() => {
    localStorage.setItem("frontend_fee_structures", JSON.stringify(dashboardData));
  }, [dashboardData]);

  // Click Outside Popover Closer Hook
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
        setIsClassDropdownOpen(false);
      }
      if (streamDropdownRef.current && !streamDropdownRef.current.contains(event.target)) {
        setIsStreamDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
          "APR", "MAY", "JUN", "JUL", "AUG", "SEP", 
          "OCT", "NOV", "DEC", "JAN", "FEB", "MAR"
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
    const numValue = value === "" ? "" : parseFloat(value) || 0;
    setGridValues((prev) => ({
      ...prev,
      [`${feeHeadId}-${colHeader}`]: numValue,
    }));
  };

  const calculateRowTotal = (feeHeadId, columns) => {
    return columns.reduce(
      (sum, col) => sum + (parseFloat(gridValues[`${feeHeadId}-${col}`]) || 0),
      0
    );
  };

  const activeGridCols = getGridHeaders(selectedStructureType);

  const calculateGrandTotal = (columns) => {
    return feeHeads.reduce((grandSum, head) => {
      return grandSum + calculateRowTotal(head._id, columns);
    }, 0);
  };

  // Pure Client Side Create Handler Layout
  const saveStructure = () => {
    if (!selectedStructureType) {
      return Swal.fire({ icon: "warning", title: "Select Structure Type" });
    }
    if (selectedClasses.length === 0) {
      return Swal.fire({ icon: "warning", title: "Select Class" });
    }

    const feeItems = feeHeads.map((head) => {
      const amounts = {};
      activeGridCols.forEach((col) => {
        amounts[col] = parseFloat(gridValues[`${head._id}-${col}`]) || 0;
      });
      return {
        feeHead: head._id,
        amounts,
        total: calculateRowTotal(head._id, activeGridCols)
      };
    });

    const newStructure = {
      _id: `struct_${Date.now()}`,
      structureType: selectedStructureType,
      className: selectedClasses.join(", "),
      stream: selectedStream || "None",
      feeItems,
      grandTotal: calculateGrandTotal(activeGridCols)
    };

    setDashboardData([newStructure, ...dashboardData]);
    Swal.fire({ icon: "success", title: "Structure Created Successfully" });
    resetForm();
  };

  // Pure Client Side Modification Update Handler Layout
  const updateStructure = () => {
    if (!selectedStructureType) {
      return Swal.fire({ icon: "warning", title: "Select Structure Type" });
    }
    if (selectedClasses.length === 0) {
      return Swal.fire({ icon: "warning", title: "Select Class" });
    }

    const feeItems = feeHeads.map((head) => {
      const amounts = {};
      activeGridCols.forEach((col) => {
        amounts[col] = parseFloat(gridValues[`${head._id}-${col}`]) || 0;
      });
      return {
        feeHead: head._id,
        amounts,
        total: calculateRowTotal(head._id, activeGridCols)
      };
    });

    setDashboardData(dashboardData.map(row => {
      if (row._id === editingId) {
        return {
          ...row,
          structureType: selectedStructureType,
          className: selectedClasses.join(", "),
          stream: selectedStream || "None",
          feeItems,
          grandTotal: calculateGrandTotal(activeGridCols)
        };
      }
      return row;
    }));

    Swal.fire({ icon: "success", title: "Structure Updated Successfully" });
    resetForm();
  };

  // Pure Client Side Row Removal Deletion Action Handler Layout
  const handleDeleteRow = async (id) => {
    const result = await Swal.fire({
      title: "Delete Structure?",
      text: "Are you sure you want to remove this data blueprint?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    setDashboardData(dashboardData.filter(row => row._id !== id));
    Swal.fire({ icon: "success", title: "Deleted Successfully" });
  };

  const handleOpenModify = (row) => {
    setEditingId(row._id);
    setSelectedStructureType(row.structureType);
    
    if (row.className) {
      setSelectedClasses(row.className.split(", "));
    } else {
      setSelectedClasses([]);
    }

    setSelectedStream(row.stream || "None");

    const loadedValues = {};
    if (row.feeItems && Array.isArray(row.feeItems)) {
      row.feeItems.forEach((item) => {
        const targetHeadId = item.feeHead?._id || item.feeHead;
        if (targetHeadId && item.amounts) {
          Object.entries(item.amounts).forEach(([month, value]) => {
            loadedValues[`${targetHeadId}-${month}`] = parseFloat(value) || 0;
          });
        }
      });
    }

    setGridValues(loadedValues);
    setIsModifyModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedStructureType("");
    setSelectedClasses([]);
    setSelectedStream("");
    setGridValues({});
    setIsTypeDropdownOpen(false);
    setIsClassDropdownOpen(false);
    setIsStreamDropdownOpen(false);
    setIsAddModalOpen(false);
    setIsModifyModalOpen(false);
  };

  // Fast Frontend Reactive Search Filtering Logic Pipeline
  const filteredDashboard = dashboardData.filter(row => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (row.className && row.className.toLowerCase().includes(searchLower)) ||
      (row.stream && row.stream.toLowerCase().includes(searchLower)) ||
      (row.structureType && row.structureType.toLowerCase().includes(searchLower))
    );
  });

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
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          title="Add New Fee Structure"
        >
          <span className="fs-plus-symbol">+ Add Fee Structure</span>
        </button>
      </div>

      {/* DASHBOARD CORE MASTER SPREADSHEET TABLE */}
      <div className="fs-dashboard-card-wrap">
        <table className="fs-dashboard-core-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>S.No.</th>
              <th>Class</th>
              <th>Stream</th>
              <th>Structure Type</th>
              <th style={{ textAlign: "center", width: "240px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDashboard.length > 0 ? (
              filteredDashboard.map((row, index) => (
                <tr key={row._id || index} className="fs-dashboard-interactive-row">
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
          <div className="fs-modal-surface-container size-xl">
            <div className="fs-modal-primary-heading-bar">
              <h2>Create Fee Structure</h2>
              <button className="fs-modal-dismiss-cross" onClick={resetForm}>
                ✕
              </button>
            </div>

            <div className="fs-modal-scrollable-payload">
              <div className="fs-popform-dropdowns-row">
                
                {/* 1. Custom Premium Structure Type Dropdown Menu */}
                <div className="fs-form-group-block relative-anchor" ref={typeDropdownRef}>
                  <label className="fs-input-top-label">Structure Type <span className="fs-required-star">*</span></label>
                  <div
                    className={`fs-multiselect-custom-box ${selectedStructureType ? "fs-has-value" : ""} ${isTypeDropdownOpen ? "fs-box-active" : ""}`}
                    onClick={() => {
                      setIsTypeDropdownOpen(!isTypeDropdownOpen);
                      setIsClassDropdownOpen(false);
                      setIsStreamDropdownOpen(false);
                    }}
                  >
                    <span className="fs-truncated-text-value">
                      {selectedStructureType || "Select Type"}
                    </span>
                    <span className={`fs-chevron-symbol-indicator ${isTypeDropdownOpen ? "rotated" : ""}`}>▼</span>
                  </div>

                  {isTypeDropdownOpen && (
                    <div className="fs-custom-dropdown-popover-panel animate-fade-in">
                      <div 
                        className={`fs-dropdown-option-item placeholder-option ${selectedStructureType === "" ? "option-selected" : ""}`}
                        onClick={() => {
                          setSelectedStructureType("");
                          setGridValues({});
                          setIsTypeDropdownOpen(false);
                        }}
                      >
                        Select Type
                      </div>
                      {STRUCTURE_TYPES.map((type) => (
                        <div
                          key={type}
                          className={`fs-dropdown-option-item ${selectedStructureType === type ? "option-selected" : ""}`}
                          onClick={() => {
                            setSelectedStructureType(type);
                            setGridValues({});
                            setIsTypeDropdownOpen(false);
                          }}
                        >
                          <span className="fs-option-label-text">{type}</span>
                          {selectedStructureType === type && <span className="fs-option-checked-mark">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Class Checkbox Multiple Selection Dropdown block */}
                <div className="fs-form-group-block relative-anchor" ref={classDropdownRef}>
                  <label className="fs-input-top-label">Class <span className="fs-required-star">*</span></label>
                  <div
                    className={`fs-multiselect-custom-box ${selectedClasses.length > 0 ? "fs-has-value" : ""} ${isClassDropdownOpen ? "fs-box-active" : ""}`}
                    onClick={() => {
                      setIsClassDropdownOpen(!isClassDropdownOpen);
                      setIsTypeDropdownOpen(false);
                      setIsStreamDropdownOpen(false);
                    }}
                  >
                    <span className="fs-truncated-text-value">
                      {selectedClasses.length === 0
                        ? "Select Classes"
                        : selectedClasses.join(", ")}
                    </span>
                    <span className={`fs-chevron-symbol-indicator ${isClassDropdownOpen ? "rotated" : ""}`}>▼</span>
                  </div>

                  {isClassDropdownOpen && (
                    <div className="fs-custom-dropdown-popover-panel fs-multiselect-popover animate-fade-in">
                      <div className="fs-multiselect-scroll-area">
                        {CLASSES.map((cls) => (
                          <label
                            key={cls}
                            className={`fs-popover-checkbox-row-item ${selectedClasses.includes(cls) ? "row-checked" : ""}`}
                          >
                            <div className="fs-checkbox-modern-wrapper">
                              <input
                                type="checkbox"
                                className="fs-premium-styled-checkbox"
                                checked={selectedClasses.includes(cls)}
                                onChange={() => handleClassCheckboxChange(cls)}
                              />
                              <div className="fs-custom-checkbox-facade"></div>
                            </div>
                            <span className="fs-checkbox-label-text">{cls}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Stream Configuration Input menu element block */}
                <div className="fs-form-group-block relative-anchor" ref={streamDropdownRef}>
                  <div className="fs-label-header-action-row">
                    <label className="fs-input-top-label">Stream</label>
                  </div>
                  <div
                    className={`fs-multiselect-custom-box ${selectedStream ? "fs-has-value" : ""} ${isStreamDropdownOpen ? "fs-box-active" : ""}`}
                    onClick={() => {
                      setIsStreamDropdownOpen(!isStreamDropdownOpen);
                      setIsTypeDropdownOpen(false);
                      setIsClassDropdownOpen(false);
                    }}
                  >
                    <span className="fs-truncated-text-value">
                      {selectedStream || "Select Stream"}
                    </span>
                    <span className={`fs-chevron-symbol-indicator ${isStreamDropdownOpen ? "rotated" : ""}`}>▼</span>
                  </div>

                  {isStreamDropdownOpen && (
                    <div className="fs-custom-dropdown-popover-panel animate-fade-in">
                      <div 
                        className={`fs-dropdown-option-item placeholder-option ${selectedStream === "" ? "option-selected" : ""}`}
                        onClick={() => {
                          setSelectedStream("");
                          setIsStreamDropdownOpen(false);
                        }}
                      >
                        Select Stream
                      </div>
                      {STREAMS.map((str) => (
                        <div
                          key={str}
                          className={`fs-dropdown-option-item ${selectedStream === str ? "option-selected" : ""}`}
                          onClick={() => {
                            setSelectedStream(str);
                            setIsStreamDropdownOpen(false);
                          }}
                        >
                          <span className="fs-option-label-text">{str}</span>
                          {selectedStream === str && <span className="fs-option-checked-mark">✓</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Matrix Layout Entry Matrix View Section */}
              {selectedStructureType ? (
                <div className="fs-matrix-spreadsheet-wrapper">
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
                        {feeHeads.map((head) => (
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
                                  value={gridValues[`${head._id}-${col}`] ?? ""}
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
                              {feeHeads.reduce(
                                (sum, h) =>
                                  sum + (parseFloat(gridValues[`${h._id}-${col}`]) || 0),
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
                  💡 Please assign a <strong>Structure Type</strong> above to dynamically compile the calculation matrix.
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
          <div className="fs-modal-surface-container size-xl">
            <div className="fs-modal-primary-heading-bar status-modify-accent">
              <h2>Modify Fee Structure</h2>
              <button className="fs-modal-dismiss-cross" onClick={resetForm}>
                ✕
              </button>
            </div>

            <div className="fs-modal-scrollable-payload">
              <div className="fs-premium-alert-banner-info">
                ⚠️ You are adjusting configuration blueprints for Class: <strong>{selectedClasses.join(", ") || "N.C."}</strong> ({selectedStructureType})
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
                      {feeHeads.map((head) => (
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
                            {feeHeads.reduce(
                              (sum, h) =>
                                sum + (parseFloat(gridValues[`${h._id}-${col}`]) || 0),
                              0,
                            )}
                          </td>
                        ))}
                        <td className="fs-grand-final-highlight-badge-cell variant-modify-active-total">
                          {calculateGrandTotal(activeGridCols)}
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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;