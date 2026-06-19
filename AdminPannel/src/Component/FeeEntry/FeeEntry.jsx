import React, { useEffect, useState } from "react";
import API from "../../Api/axios";
import "./FeeEntry.css";

const FeeEntry = () => {
  // UI Toggle States
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isAcClosingModalOpen, setIsAcClosingModalOpen] = useState(false);

  // Student Search State
  const [studentQuery, setStudentQuery] = useState("");
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchError, setSearchError] = useState("");

  // Form Value States
  const [entryDate, setEntryDate] = useState("2026-06-08");
  const [closingDate, setClosingDate] = useState("2026-06-08");
  const [narrationText, setNarrationText] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [feeType, setFeeType] = useState("All");
  const [feeHeads, setFeeHeads] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [feeStructureLoading, setFeeStructureLoading] = useState(false);
  const [selectedFees, setSelectedFees] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // Column visibility checklist state for the Fee Statement modal
  const [visibleColumns, setVisibleColumns] = useState({
    recNo: true,
    recDate: true,
    createdDate: true,
    period: true,
    payMode: true,
    grossAmt: true,
    discAmt: true,
    remark: true,
    tPayableAmt: true,
    paidAmt: true,
    dueAmt: true,
    advAmt: true,
  });

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const grossAmount = feeHeads
    .filter((row) => selectedFees.includes(row.feeHeadId))
    .reduce((sum, row) => {
      // Annual Fee
      if (row.structureType === "Annually") {
        return sum + Number(row.amount || 0);
      }

      // Monthly / Quarterly / Half-Yearly
      const installmentAmount = selectedMonths.reduce(
        (total, month) => total + Number(row.amounts?.[month] || 0),
        0,
      );

      return sum + installmentAmount;
    }, 0);

  const totalPayable =
    grossAmount - Number(discountAmount || 0) + Number(advanceAmount || 0);
  const dueAmount = totalPayable - Number(paidAmount || 0);

  useEffect(() => {
    if (!selectedStudent?.class) {
      setFeeHeads([]);
      return;
    }

    const loadFeeStructure = async () => {
      setFeeStructureLoading(true);

      try {
        const response = await API.get(
          `/fee-structure/all?search=${encodeURIComponent(
            selectedStudent.class,
          )}`,
        );

        if (response.data?.success && response.data?.data?.length > 0) {
          const allItems = response.data.data.flatMap((structure) =>
            (structure.feeItems || []).map((item) => ({
              feeHeadId: item.feeHead?._id || item.feeHead,

              feeHeadName:
                typeof item.feeHead === "object"
                  ? item.feeHead?.feeHeadName || "Unknown"
                  : "Unknown",

              // store month-wise data
              amounts: item.amounts || {},

              // total amount
              amount:
                item.total && item.total > 0
                  ? item.total
                  : item.amounts
                    ? Object.values(item.amounts).reduce(
                        (sum, value) => sum + Number(value || 0),
                        0,
                      )
                    : 0,

              total: item.total || 0,

              structureType: structure.structureType,
            })),
          );

          // console.log("All Fee Structures:", response.data.data);
          // console.log("All Fee Heads:", allItems);

          setFeeHeads(allItems);

          // Select all fee heads by default
          setSelectedFees(allItems.map((item) => item.feeHeadId));
        } else {
          setFeeHeads([]);
          setSelectedFees([]);
        }
      } catch (error) {
        console.error("Error loading fee structure:", error);
        setFeeHeads([]);
        setSelectedFees([]);
      } finally {
        setFeeStructureLoading(false);
      }
    };
    loadFeeStructure();
  }, [selectedStudent]);

  const getPremiumBadge = (student) => {
    const premiumMatch =
      student?.category?.toLowerCase() === "premium" ||
      student?.feeGroup?.toLowerCase?.()?.includes("premium");
    return premiumMatch;
  };

  const handleSearchChange = async (value) => {
    setStudentQuery(value);
    setSaveMessage("");
    setSaveError("");

    if (!value || value.length < 2) {
      setStudentSuggestions([]);
      return;
    }

    try {
      const response = await API.get(
        `/students/search/list?q=${encodeURIComponent(value)}`,
      );
      setStudentSuggestions(response.data);
      setSearchError("");
    } catch (error) {
      setSearchError("Unable to fetch students.");
      setStudentSuggestions([]);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setStudentQuery(
      `${student.studentName || ""} (${student.admissionNo || ""})`,
    );
    setStudentSuggestions([]);
  };

  const handleFeeHeadChange = (index, field, value) => {
    const list = [...feeHeads];
    list[index][field] = field === "amount" ? Number(value || 0) : value;
    setFeeHeads(list);
  };

  const handleRemoveFeeHead = (index) => {
    const list = feeHeads.filter((_, idx) => idx !== index);
    setFeeHeads(list);
  };

  const handleSaveFeeEntry = async (e) => {
    e.preventDefault();
    setSaveMessage("");
    setSaveError("");

    if (!selectedStudent?._id) {
      setSaveError("Select a student before saving.");
      return;
    }

    if (!paymentMode) {
      setSaveError("Choose a payment mode.");
      return;
    }

    const selectedFeeHeads = feeHeads.filter((row) =>
      selectedFees.includes(row.feeHeadId),
    );

    if (selectedFeeHeads.length === 0) {
      setSaveError("Please select at least one fee.");
      return;
    }

    try {
      const payload = {
        studentId: selectedStudent._id,
        academicYear,

        entryDate,
        receiptNo,
        paymentMode,
        feeHeads: selectedFeeHeads,

        discountAmount: Number(discountAmount || 0),
        advanceAdjustment: Number(advanceAmount || 0),
        paidAmount: Number(paidAmount || 0),

        remark,
        installmentMonth: selectedMonths,

        grossAmount,
        totalPayable,
        dueAmount,
      };

      // console.log("Saving Payload:", payload);

      const response = await API.post("/fee-entry/create", payload);

      setSaveMessage(response.data.message || "Fee entry saved successfully.");

      setSaveError("");
      setReceiptNo("");
      setSelectedFees([]);
      setDiscountAmount(0);
      setAdvanceAmount(0);
      setPaidAmount(0);
      setRemark("");
    } catch (error) {
      setSaveError(
        error.response?.data?.message || "Failed to save fee entry.",
      );
    }
  };

  const handleClearSelection = () => {
    setSelectedStudent(null);
    setStudentQuery("");
    setStudentSuggestions([]);
  };

  const handleFeeCheck = (feeHeadId) => {
    setSelectedFees((prev) =>
      prev.includes(feeHeadId)
        ? prev.filter((id) => id !== feeHeadId)
        : [...prev, feeHeadId],
    );
  };

  const handleMonthCheck = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  const selectedFeeRows = feeHeads.filter((row) =>
    selectedFees.includes(row.feeHeadId),
  );

  const showInstallmentMonths = selectedFeeRows.some(
    (row) => row.structureType !== "Annually",
  );

  const allMonths = [
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

  const handleAllMonths = (checked) => {
    if (checked) {
      setSelectedMonths(allMonths);
    } else {
      setSelectedMonths([]);
    }
  };

  const academicYears = [
    "2024-2025",
    "2025-2026",
    "2026-2027",
    "2027-2028",
    "2028-2029",
  ];

  useEffect(() => {
    if (saveMessage || saveError) {
      const timer = setTimeout(() => {
        setSaveMessage("");
        setSaveError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [saveMessage, saveError]);

  return (
    <div className="fee-entry-container">
      {/* Top Search Bar Row */}
      <div className="fee-entry-header-row">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search student by name or admission no."
            className="search-input"
            value={studentQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {studentSuggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {studentSuggestions.map((student) => (
                <button
                  type="button"
                  key={student._id}
                  className={`suggestion-item ${getPremiumBadge(student) ? "suggestion-premium" : "suggestion-standard"}`}
                  onClick={() => handleSelectStudent(student)}
                  title={`${student.studentName} - Adm: ${student.admissionNo} - Class: ${student.class}`}
                >
                  <div className="suggestion-label">
                    <div className="suggestion-name">
                      {student.studentName || "Unnamed"}
                    </div>
                    <div className="suggestion-meta">
                      Adm: {student.admissionNo || "-"} | Class:{" "}
                      {student.class || "-"}
                    </div>
                  </div>
                  {getPremiumBadge(student) && (
                    <span className="suggestion-badge">★ PREMIUM</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="search-actions-group">
          {selectedStudent && (
            <button
              className="btn-clear-selection"
              type="button"
              onClick={handleClearSelection}
            >
              Clear Student
            </button>
          )}
        </div>
      </div>
      {searchError && <div className="search-error">{searchError}</div>}
      {/* Main Form Split Layout */}{" "}
      <div className="fee-entry-main-grid">
        {/* Left Side: Student Info Profile Card */}
        <div className="student-profile-card">
          <div className="student-info-list">
            <div className="info-item">
              <strong>Enroll No. :</strong>{" "}
              <span>{selectedStudent?.admissionNo || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Sr. No. :</strong>{" "}
              <span>{selectedStudent?.srNo || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Adm. No. :</strong>{" "}
              <span>{selectedStudent?.admissionNo || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Name :</strong>{" "}
              <span>{selectedStudent?.studentName || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Class :</strong>{" "}
              <span>{selectedStudent?.class || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Father's Name :</strong>{" "}
              <span>{selectedStudent?.fatherName || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Mother's Name :</strong>{" "}
              <span>{selectedStudent?.motherName || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Mobile No. :</strong>{" "}
              <span>{selectedStudent?.mobile || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Address :</strong>{" "}
              <span>{selectedStudent?.currentAddress || "-"}</span>
            </div>
            <div className="info-item">
              <strong>Document Remark :</strong>{" "}
              <span>{selectedStudent ? "Verified" : "-"}</span>
            </div>
            <div className="info-item">
              <strong>General Remark :</strong>{" "}
              <span>{selectedStudent ? "Ready to collect fee" : "-"}</span>
            </div>
          </div>

          <div className="student-avatar-column">
            <div className="avatar-placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM4.68 11.16L12 15.16l7.32-4V15c0 .4-.14.79-.4 1.09l-5.45 6.05c-.38.42-1.03.42-1.41 0L6.6 16.09c-.26-.3-.4-.69-.4-1.09v-3.84z" />
              </svg>
            </div>
            <div className="avatar-meta-item">
              <strong>Stu Type :</strong>{" "}
              <span>{selectedStudent?.category || "N/A"}</span>
            </div>
            <div className="avatar-meta-item">
              <strong>Fee Type :</strong> <span>{feeType}</span>
            </div>
            <div className="avatar-meta-item">
              <strong>Transport Status :</strong>{" "}
              <span>
                {selectedStudent?.routeList ? "Has Transport" : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Inputs Form Fields */}
        <div className="fee-inputs-form">
          <div className="form-row">
            <div className="form-group floating-label-group">
              <label>Fee Type</label>
              <select
                value={feeType}
                className="form-select"
                onChange={(e) => setFeeType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Academic">Academic Fee</option>
                <option value="Transport">Transport Fee</option>
                <option value="Hostel">Hostel Fee</option>
                <option value="Examination">Examination Fee</option>
              </select>
            </div>
            <div className="form-group floating-label-group">
              <label>Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="form-select"
              >
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group floating-label-group">
              <label>Choose a date*</label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="form-input custom-date-picker"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Receipt No."
                className="form-input"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <select
                value={paymentMode}
                className="form-select required-select"
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online Pay</option>
                <option value="Cheque">Cheque</option>
                <option value="DD">Demand Draft</option>
                <option value="UPI">UPI / QR Scan</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Advanced Amount & Installment Checkboxes Layout Row */}
      {/* Installment + Head Wise Fees Layout */}
      <div className="fee-panels-row">
        {/* Left Installment Card */}

        {showInstallmentMonths && (
          <div className="installment-card">
            <div className="installment-card-title">Installment Months</div>

            <div className="installment-top-check">
              <input
                type="checkbox"
                checked={selectedMonths.length === allMonths.length}
                onChange={(e) => handleAllMonths(e.target.checked)}
              />
              <span>Select All</span>
            </div>

            <div className="installment-grid">
              {allMonths.map((month) => (
                <label key={month} className="month-item">
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(month)}
                    onChange={() => handleMonthCheck(month)}
                  />
                  <span>{month}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Right Fees Card */}
        <div className="fees-card">
          <div className="accordion-header-bar">
            <span className="accordion-title-text">Fee Details</span>
            <div className="accordion-action-buttons-group">
              <button
                className="btn-show-receipts"
                type="button"
                onClick={() => setIsStatementModalOpen(true)}
              >
                Show Receipts
              </button>
            </div>
          </div>

          <div className="accordion-collapsible-panel">
            <div className="table-responsive-container">
              <table className="head-wise-fees-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          feeHeads.length > 0 &&
                          selectedFees.length === feeHeads.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFees(feeHeads.map((f) => f.feeHeadId));
                          } else {
                            setSelectedFees([]);
                          }
                        }}
                      />
                    </th>
                    <th>FEE HEAD</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructureLoading && (
                    <tr>
                      <td
                        colSpan="2"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Loading fee structure...
                      </td>
                    </tr>
                  )}
                  {!feeStructureLoading && feeHeads.length > 0 ? (
                    <>
                      {feeHeads.map((row, index) => (
                        <tr key={`${row.feeHeadId}-${index}`}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedFees.includes(row.feeHeadId)}
                              onChange={() => handleFeeCheck(row.feeHeadId)}
                            />
                          </td>

                          <td>{row.feeHeadName}</td>

                          <td style={{ textAlign: "center" }}>
                            ₹{Number(row.amount || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="table-summary-row">
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <strong>₹{grossAmount.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#999",
                        }}
                      >
                        Select a student to view fee structure
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Calculation Form Summary Fields Row */}
      <div className="calculation-summary-dashboard-grid">
        <div className="calc-group-field">
          <label>Grand Total</label>
          <input
            type="text"
            value={grossAmount.toFixed(2)}
            readOnly
            className="calc-input-box"
          />
        </div>
        <div className="calc-group-field">
          <label>Advance Paid</label>
          <input
            type="number"
            value={advanceAmount}
            onChange={(e) => setAdvanceAmount(Number(e.target.value || 0))}
            className="calc-input-box"
          />
        </div>
        <div className="calc-group-field simple-placeholder-field">
          <label>Discount Amount</label>

          <input
            type="number"
            placeholder="Discount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(Number(e.target.value || 0))}
            className="calc-input-box"
          />
        </div>
        <div className="calc-group-field">
          <label>Payable Amount</label>
          <input
            type="text"
            value={totalPayable.toFixed(2)}
            readOnly
            className="calc-input-box"
          />
        </div>
        <div className="calc-group-field">
          <label>Total Paid*</label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value || 0))}
            className="calc-input-box required-border"
          />
        </div>
        <div className="calc-group-field">
          <label>Due Amount</label>
          <input
            type="text"
            value={dueAmount.toFixed(2)}
            readOnly
            className="calc-input-box"
          />
        </div>
      </div>
      {/* Action Footer Buttons Submit Bar */}
      <div className="form-action-footer-bar">
        <input
          type="text"
          placeholder="Receipt Remark"
          className="receipt-remark-input"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <button
          className="btn-save-form"
          type="button"
          onClick={handleSaveFeeEntry}
        >
          Save
        </button>
      </div>
      {(saveMessage || saveError) && (
        <div
          className={`save-alert ${
            saveError ? "save-alert-error" : "save-alert-success"
          }`}
        >
          <span className="save-alert-icon">{saveError ? "❌" : "✅"}</span>

          <div className="save-alert-content">
            <h4>{saveError ? "Error" : "Success"}</h4>
            <p>{saveError || saveMessage}</p>
          </div>

          <button
            className="save-alert-close"
            onClick={() => {
              setSaveMessage("");
              setSaveError("");
            }}
          >
            ✕
          </button>
        </div>
      )}
      {/* POPUP 1: Fee Statement Modal Overlay */}
      {isStatementModalOpen && (
        <div
          className="modal-overlay-backdrop"
          onClick={() => setIsStatementModalOpen(false)}
        >
          <div
            className="fee-statement-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-panel">
              <h2 className="modal-header-title">FEE STATEMENT</h2>
              <div className="modal-header-controls-group">
                <button
                  className="btn-column-visibility-filter"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                >
                  <svg viewBox="0 0 24 24" className="filter-icon-svg">
                    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
                  </svg>
                </button>
                <button
                  className="btn-modal-close-window"
                  onClick={() => setIsStatementModalOpen(false)}
                >
                  ×
                </button>

                {isFilterDropdownOpen && (
                  <div className="column-filter-checklist-dropdown">
                    {Object.keys(visibleColumns).map((key) => (
                      <label className="checklist-item-row" key={key}>
                        <input
                          type="checkbox"
                          checked={visibleColumns[key]}
                          onChange={() => toggleColumn(key)}
                        />
                        <span>
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-table-responsive-wrapper">
              <table className="fee-statement-data-table">
                <thead>
                  <tr>
                    <th>S.no.</th>
                    {visibleColumns.recNo && <th>Rec. No.</th>}
                    {visibleColumns.recDate && <th>Rec. Date</th>}
                    {visibleColumns.createdDate && <th>Created Date</th>}
                    {visibleColumns.period && <th>Period</th>}
                    {visibleColumns.payMode && <th>Pay Mode</th>}
                    {visibleColumns.grossAmt && <th>Gross Amt.</th>}
                    {visibleColumns.discAmt && <th>Disc Amt.</th>}
                    {visibleColumns.remark && <th>Remark</th>}
                    {visibleColumns.tPayableAmt && <th>T Payable Amt.</th>}
                    {visibleColumns.paidAmt && <th>Paid Amt.</th>}
                    {visibleColumns.dueAmt && <th>Due Amt.</th>}
                    {visibleColumns.advAmt && <th>Adv. Amt.</th>}
                  </tr>
                </thead>
                <tbody>
                  {feeHeads.length > 0 ? (
                    feeHeads.map((row, index) => (
                      <tr key={`${row.feeHeadName}-${index}`}>
                        <td>{index + 1}</td>
                        {visibleColumns.recNo && <td>{receiptNo || "N/A"}</td>}
                        {visibleColumns.recDate && (
                          <td>{entryDate || "N/A"}</td>
                        )}
                        {visibleColumns.createdDate && (
                          <td>{new Date().toLocaleDateString()}</td>
                        )}
                        {visibleColumns.period && <td>{feeType}</td>}
                        {visibleColumns.payMode && <td>{paymentMode}</td>}
                        {visibleColumns.grossAmt && <td>{row.amount}</td>}
                        {visibleColumns.discAmt && <td>{discountAmount}</td>}
                        {visibleColumns.remark && <td>{remark || "-"}</td>}
                        {visibleColumns.tPayableAmt && <td>{totalPayable}</td>}
                        {visibleColumns.paidAmt && <td>{paidAmount}</td>}
                        {visibleColumns.dueAmt && <td>{dueAmount}</td>}
                        {visibleColumns.advAmt && <td>{advanceAmount}</td>}
                      </tr>
                    ))
                  ) : (
                    <tr className="empty-table-placeholder-row">
                      <td
                        colSpan="14"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#999",
                        }}
                      >
                        No data records available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* POPUP 2: Fee Collection A/C Closing Modal Window */}
      {isAcClosingModalOpen && (
        <div
          className="modal-overlay-backdrop"
          onClick={() => setIsAcClosingModalOpen(false)}
        >
          <div
            className="ac-closing-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ac-closing-header">
              <h2 className="ac-closing-title">FEE COLLECTION A/C CLOSING</h2>
              <button
                className="btn-ac-modal-close"
                onClick={() => setIsAcClosingModalOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleAcClosingSubmit}
              className="ac-closing-form-body"
            >
              <div className="ac-form-group-fieldset">
                <label className="ac-fieldset-label">Date*</label>
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="ac-custom-input"
                  required
                />
              </div>

              <div className="ac-form-group-fieldset">
                <textarea
                  placeholder="Narration"
                  value={narrationText}
                  onChange={(e) => setNarrationText(e.target.value)}
                  className="ac-custom-textarea"
                />
              </div>

              <div className="ac-modal-actions-footer">
                <button type="submit" className="btn-ac-modal-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeEntry;
