import React, { useState, useEffect } from 'react';
import './FeeEntry.css';

const FeeEntry = () => {
  // --- MOCK DATABASE RECORDS ---
  const studentsDB = [
    {
      srNo: '584', admNo: 'IQRA469', name: 'Asiyana Parveen', class: 'NURSERY-A',
      fatherName: 'Sarwar Ansari', motherName: 'Afsana Khatun', mobile: '8922012389',
      feeType: 'Day-Scholar', studentType: 'Old', transport: 'Inactive', vehNo: '0',
      route: '0', stop: '0', address: 'Mahuatand Dhanwar Giridih Jharkhand', dob: '18-03-2019'
    },
    {
      srNo: '668', admNo: 'IQRA568', name: 'Najrana Praveen', class: 'NURSERY-A',
      fatherName: 'Tabarak Ansari', motherName: 'Sajda Begum', mobile: '7003808560',
      feeType: 'Day-Scholar', studentType: 'Old', transport: 'Inactive', vehNo: '0',
      route: '0', stop: '0', address: 'Dhanwar, Giridih, Jharkhand', dob: '10-05-2021'
    }
  ];

  const initialReceiptsData = [
    { id: 1, recNo: '204', recDate: '2026-05-10', createdDate: '2026-05-10', period: 'Apr, May', payMode: 'UPI', grossAmt: 4500, discAmt: 100, remark: 'Quarterly Part 1', tPayableAmt: 4400, paidAmt: 4400, dueAmt: 0, advAmt: 0 },
    { id: 2, recNo: '203', recDate: '2026-04-12', createdDate: '2026-04-12', period: 'Apr', payMode: 'Cash', grossAmt: 2300, discAmt: 50, remark: 'Admission allocations', tPayableAmt: 2250, paidAmt: 2250, dueAmt: 0, advAmt: 0 }
  ];

  // --- UI STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isHeadWiseOpen, setIsHeadWiseOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- DYNAMIC SELECTION CONFIGURATIONS ---
  const [selectedStudent, setSelectedStudent] = useState(studentsDB[0]);
  const [selectedPayMode, setSelectedPayMode] = useState('Cash');
  const [receiptNo, setReceiptNo] = useState('205');
  const [selectedDate, setSelectedDate] = useState('2026-06-23');
  const [receiptRemark, setReceiptRemark] = useState('');

  // --- SELECTED MONTHS SYSTEM ---
  const monthsList = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const [selectedMonths, setSelectedMonths] = useState(['Apr', 'May', 'Jun']);

  // --- FEE HEADS SYSTEM ---
  const baseFeeHeads = [
    { id: 1, name: 'Tuition Fee', amt: 1500, conc: 100, checked: true },
    { id: 2, name: 'Admission Fee', amt: 3000, conc: 0, checked: true },
    { id: 3, name: 'Transport Fee', amt: 800, conc: 0, checked: true },
    { id: 4, name: 'Examination Fee', amt: 500, conc: 50, checked: true },
  ];
  const [feeHeads, setFeeHeads] = useState(baseFeeHeads);

  // --- CALCULATION SUMMARY TRACKERS ---
  const [advanceBalance, setAdvanceBalance] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);

  // --- RECEIPT STATEMENT RECORDS MATRIX ---
  const [receiptsList, setReceiptsList] = useState(initialReceiptsData);
  const [visibleColumns, setVisibleColumns] = useState({
    recNo: true, recDate: true, createdDate: true, period: true,
    payMode: true, grossAmt: true, discAmt: true, remark: true,
    tPayableAmt: true, paidAmt: true, dueAmt: true, advAmt: true
  });

  // --- FILTERED SEARCH COMPUTATION ---
  const filteredStudents = studentsDB.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.admNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.srNo.includes(searchQuery)
  );

  // --- CORE SYSTEM MATH ENGINE ---
  useEffect(() => {
    const activeMonthsCount = selectedMonths.length || 1;
    const activeHeads = feeHeads.filter(h => h.checked);

    const calculatedGrandTotal = activeHeads.reduce((acc, curr) => acc + (Number(curr.amt) * activeMonthsCount), 0);
    const calculatedDiscount = activeHeads.reduce((acc, curr) => acc + (Number(curr.conc) * activeMonthsCount), 0);
    const calculatedPayable = calculatedGrandTotal - calculatedDiscount;

    setGrandTotal(calculatedGrandTotal);
    setTotalDiscount(calculatedDiscount);
    setPayableAmount(calculatedPayable);
    setTotalPaid(calculatedPayable);
  }, [feeHeads, selectedMonths]);

  useEffect(() => {
    const computedDue = payableAmount - Number(totalPaid || 0) - Number(advanceBalance || 0);
    setDueAmount(computedDue < 0 ? 0 : computedDue);
  }, [payableAmount, totalPaid, advanceBalance]);

  // --- ACTIONS ---
  const handleSave = () => {
    if (Number(totalPaid) <= 0 && payableAmount > 0) {
      alert("Please specify a valid collection payment amount.");
      return;
    }
    setIsSaving(true);

    const newReceipt = {
      id: Date.now(),
      recNo: receiptNo,
      recDate: selectedDate,
      createdDate: selectedDate,
      period: selectedMonths.join(', ') || 'N/A',
      payMode: selectedPayMode,
      grossAmt: grandTotal,
      discAmt: totalDiscount,
      remark: receiptRemark || 'Regular Fee Collection',
      tPayableAmt: payableAmount,
      paidAmt: totalPaid,
      dueAmt: dueAmount,
      advAmt: Number(advanceBalance)
    };

    setTimeout(() => {
      setReceiptsList([newReceipt, ...receiptsList]);
      alert(`Fee Receipt #${receiptNo} Saved Successfully!`);
      setReceiptNo(prev => String(Number(prev) + 1));
      setReceiptRemark('');
      setIsSaving(false);
    }, 1000);
  };

  const handleCellChange = (id, field, value) => {
    setFeeHeads(prevHeads => prevHeads.map(head => {
      if (head.id === id) {
        return { ...head, [field]: Number(value) };
      }
      return head;
    }));
  };

  const toggleMonth = (month) => {
    setSelectedMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const toggleAllMonths = () => {
    if (selectedMonths.length === monthsList.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths([...monthsList]);
    }
  };

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  const toggleFeeHead = (id) => {
    setFeeHeads(prev => prev.map(head => head.id === id ? { ...head, checked: !head.checked } : head));
  };

  const toggleAllHeads = (checkedStatus) => {
    setFeeHeads(prev => prev.map(head => ({ ...head, checked: checkedStatus })));
  };

  const selectStudentProfile = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setShowSearchResults(false);
  };

  const AvatarIcon = () => (
    <svg className="avatar-svg-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21C20 19.6044 20 18.9067 19.7778 18.3448C19.4352 17.4786 18.7512 16.7946 17.885 16.4522C17.3231 16.23 16.6254 16.23 15.2292 16.23H8.77083C7.37464 16.23 6.67655 16.23 6.11463 16.4522C5.24842 16.7946 4.5644 17.4786 4.22175 18.3448C4 18.9067 4 19.6044 4 21" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16.5 8.5C16.5 10.9853 14.4853 13 12 13C9.51472 13 7.5 10.9853 7.5 8.5C7.5 6.01472 9.51472 4 12 4C14.4853 4 16.5 6.01472 16.5 8.5Z" stroke="#94a3b8" strokeWidth="2"/>
    </svg>
  );

  const columnLabels = {
    recNo: 'Receipt Code',
    recDate: 'Date Added',
    createdDate: 'Created Timestamp',
    period: 'Cycle Periods',
    payMode: 'Mode Variant',
    grossAmt: 'Gross Aggregates',
    discAmt: 'Total Discounts',
    remark: 'Narration Remarks',
    tPayableAmt: 'Net Due Balances',
    paidAmt: 'Amount Collected',
    dueAmt: 'Deficit Due',
    advAmt: 'Advance Offset'
  };

  return (
    <div className="fee-dashboard-container">

      {/* HEADER SECTION WITH RESPONSIVE SEARCH */}
      <header className="fee-header-section">
        <div className="search-wrapper">
          <span className="search-icon-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search student by name, admission code, serial number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => { if (searchQuery.length > 0) setShowSearchResults(true); }}
            className="search-input"
          />

          {showSearchResults && (
            <div className="search-results-dropdown">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.admNo} className="search-result-item" onClick={() => selectStudentProfile(student)}>
                    <div className="avatar-placeholder"><AvatarIcon /></div>
                    <div className="result-details">
                      <div className="result-col">
                        <p><strong>Sr.No:</strong> {student.srNo}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Father:</strong> {student.fatherName}</p>
                      </div>
                      <div className="result-col">
                        <p><strong>Adm No:</strong> {student.admNo}</p>
                        <p><strong>Class:</strong> {student.class}</p>
                        <p><strong>Type:</strong> {student.feeType}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-no-results">No records found.</div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* STUDENT PROFILE */}
      <main className="fee-content-grid fee-content-grid--single">

        {/* STUDENT PROFILE CARD */}
        <section className="student-profile-card">
          <div className="profile-inner">
            <div className="profile-avatar-box">
              <AvatarIcon />
            </div>
            <div className="profile-info-grid">
              <div className="info-group">
                <p><strong>Sr. No. :</strong> {selectedStudent.srNo}</p>
                <p><strong>Adm. No. :</strong> {selectedStudent.admNo}</p>
                <p><strong>Name :</strong> {selectedStudent.name}</p>
                <p><strong>Class :</strong> {selectedStudent.class}</p>
                <p><strong>F. Name :</strong> {selectedStudent.fatherName}</p>
                <p><strong>M. Name :</strong> {selectedStudent.motherName}</p>
                <p><strong>Mob. No. :</strong> {selectedStudent.mobile}</p>
              </div>
              <div className="info-group highlighted-specs">
                <p><strong>Fee Type :</strong> {selectedStudent.feeType}</p>
                <p><strong>Stu. Type :</strong> {selectedStudent.studentType}</p>
                <p><strong>Transport :</strong> <span className={selectedStudent.transport === 'Inactive' ? "status-inactive" : "status-active"}>{selectedStudent.transport}</span></p>
                <p><strong>Veh. No :</strong> {selectedStudent.vehNo}</p>
                <p><strong>Route :</strong> {selectedStudent.route}</p>
                <p><strong>Stop :</strong> {selectedStudent.stop}</p>
                <p><strong>Add. :</strong> {selectedStudent.address}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SUMMARY AND ACTIONS TRACKER GRID */}
      <section className="fee-status-history-section">
        <div className="fee-status-card">
          <div className="status-header">
            <h3>Fee Collection Summary</h3>
          </div>
          <div className="status-content">
            <div className="status-row">
              <span>Total Processed Payments</span>
              <strong>{receiptsList.length}</strong>
            </div>
            <div className="status-row-column">
              <span>Selected Cycle Months ({selectedMonths.length})</span>
              <strong className="months-token-string">
                {selectedMonths.length > 0 ? selectedMonths.join(', ') : 'None'}
              </strong>
            </div>
            <div className="status-row">
              <span>Remaining Unpaid Cycles</span>
              <strong>{selectedMonths.length === monthsList.length ? "All Cycle Paid" : `${monthsList.length - selectedMonths.length} Months Unselected`}</strong>
            </div>
            <div className="status-row">
              <span>Status Flags</span>
              <strong className="paid-status">System Operational Ready</strong>
            </div>
            <div className="ready-status">
              Live Context Scale Factor: {selectedMonths.length || 1}x Multiplier Active
            </div>
          </div>
        </div>

        {/* LOCAL HISTORICAL LEDGER CARD */}
        <div className="payment-history-card">
          <div className="history-header">
            <h3>Recent Local Action Ledger</h3>
          </div>
          <div className="history-list">
            {receiptsList.map((rec) => (
              <div key={rec.id} className="history-item">
                <div className="history-item-meta">
                  <strong>Receipt #{rec.recNo}</strong>
                  <p>{rec.payMode} • <span className="period-subtext">{rec.period}</span></p>
                </div>
                <div className="history-item-amt">₹{rec.paidAmt}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOWER INTERACTIVE SPLIT: MONTHS AND HEAD-WISE CALCULATION MATRIX */}
      <section className="bottom-interactive-split">

        {/* RUNTIME INSTALLMENT MONTHS CHECKBOX PICKER */}
        <div className="months-picker-card">
          <div className="months-card-header">
            <h3>Installment Allocation Months</h3>
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedMonths.length === monthsList.length && monthsList.length > 0}
                onChange={toggleAllMonths}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label-main">Select All</span>
            </label>
          </div>
          <div className="months-grid">
            {monthsList.map((month) => {
              const isChecked = selectedMonths.includes(month);
              return (
                <label key={month} className={`month-item-box ${isChecked ? 'active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleMonth(month)}
                  />
                  <span className="custom-box"></span>
                  <span className="month-name">{month}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* HEAD-WISE COLLAPSIBLE SPREADSHEET CARD */}
        <div className="head-wise-summary-card">
          <div className="head-wise-collapsible-bar">
            <div className="left-toggle" onClick={() => setIsHeadWiseOpen(!isHeadWiseOpen)}>
              <span className={`arrow-indicator ${isHeadWiseOpen ? 'open' : ''}`}>▼</span>
              <h3>Head Wise Split Allocation ({selectedMonths.length || 1} Month Rate)</h3>
            </div>
            <button className="btn-show-receipts" onClick={() => setShowReceiptsModal(true)}>
              Show Historic Statements
            </button>
          </div>

          {isHeadWiseOpen && (
            <div className="head-wise-table-wrapper">
              <table className="premium-fee-table">
                <thead>
                  <tr>
                    <th className="col-check" style={{ textAlign: 'center' }}>
                      <label className="table-checkbox-container">
                        <input
                          type="checkbox"
                          checked={feeHeads.every(h => h.checked)}
                          onChange={(e) => toggleAllHeads(e.target.checked)}
                        />
                        <span className="table-checkmark-box"></span>
                      </label>
                    </th>
                    <th>FEE REVENUE HEAD</th>
                    <th>BASE RATE AMT</th>
                    <th>CONCESSION / DISC</th>
                    <th>SCALED SUB PAYABLE</th>
                  </tr>
                </thead>
                <tbody>
                  {feeHeads.map((head) => {
                    const monthsFactor = selectedMonths.length || 1;
                    const rowPayable = (head.amt - head.conc) * monthsFactor;

                    return (
                      <tr key={head.id} className={head.checked ? "" : "disabled-head-row"}>
                        <td className="col-check" style={{ textAlign: 'center' }}>
                          <label className="table-checkbox-container">
                            <input type="checkbox" checked={head.checked} onChange={() => toggleFeeHead(head.id)} />
                            <span className="table-checkmark-box"></span>
                          </label>
                        </td>
                        <td className="head-title-cell" data-label="FEE REVENUE HEAD">
                          {head.name}
                          {head.checked && <span className="row-multiplier-tag">({monthsFactor}x)</span>}
                        </td>
                        <td data-label="BASE RATE AMT">
                          <div className="table-input-currency-wrapper">
                            <span className="currency-symbol">₹</span>
                            <input
                              type="number"
                              className="table-inline-input"
                              value={head.amt}
                              onChange={(e) => handleCellChange(head.id, 'amt', e.target.value)}
                            />
                          </div>
                        </td>
                        <td data-label="CONCESSION / DISC">
                          <div className="table-input-currency-wrapper">
                            <span className="currency-symbol">₹</span>
                            <input
                              type="number"
                              className="table-inline-input"
                              value={head.conc}
                              onChange={(e) => handleCellChange(head.id, 'conc', e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="payable-value-cell" data-label="SCALED SUB PAYABLE">
                          ₹{head.checked ? rowPayable : 0}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="total-row-highlight">
                    <td className="col-check hide-mobile"></td>
                    <td data-label="TOTAL"><strong>Aggregated Metrics Total</strong></td>
                    <td data-label="TOTAL BASE"><strong>₹{grandTotal}</strong></td>
                    <td data-label="TOTAL DISC"><strong>₹{totalDiscount}</strong></td>
                    <td data-label="TOTAL PAYABLE"><strong>₹{payableAmount}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* FLUID RESPONSIBLE CALCULATION SUM FIELDS GRID */}
          <div className="calculation-summary-row">
            <div className="summary-field-box">
              <label>Grand Total</label>
              <input type="text" value={`₹${grandTotal}`} readOnly />
            </div>
            <div className="summary-field-box">
              <label>Advance Offset</label>
              <input
                type="number"
                placeholder="₹0"
                value={advanceBalance === 0 ? '' : advanceBalance}
                onChange={(e) => setAdvanceBalance(Number(e.target.value))}
              />
            </div>
            <div className="summary-field-box">
              <label>Total Discounts</label>
              <input type="text" value={`₹${totalDiscount}`} readOnly />
            </div>
            <div className="summary-field-box">
              <label>Net Payable Amount</label>
              <input type="text" value={`₹${payableAmount}`} readOnly />
            </div>
            <div className="summary-field-box mandatory-box">
              <label>Total Collected Paid *</label>
              <input
                type="number"
                value={totalPaid}
                onChange={(e) => setTotalPaid(Number(e.target.value))}
              />
            </div>
            <div className="summary-field-box">
              <label>Remaining Balance Due</label>
              <input type="text" value={`₹${dueAmount}`} className={dueAmount > 0 ? "has-due" : "zero-due"} readOnly />
            </div>
          </div>

          {/* BOTTOM FORM NARRATIONS AND ACTION TERMINALS */}
          <div className="summary-footer-actions">
            <input
              type="text"
              placeholder="Enter comprehensive transaction ledger remarks or narration..."
              className="receipt-remark-input"
              value={receiptRemark}
              onChange={(e) => setReceiptRemark(e.target.value)}
            />
            <button
              className="btn-save-main"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving Entry..." : "Commit Save Receipt"}
            </button>
          </div>
        </div>
      </section>

      {/* MODAL SYSTEMS OVERLAYS */}

      {/* COMPREHENSIVE HISTORIC LEDGER STATEMENT SCREEN MODAL */}
      {showReceiptsModal && (
        <div className="modal-overlay" onClick={() => setShowReceiptsModal(false)}>
          <div className="modal-box premium-card asset-statement-modal animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-desc-wrapper">
                <h2>STUDENT FEE STATEMENT HISTORIC RECORDS</h2>
                <p className="modal-subtitle">Active Student Focus: <strong>{selectedStudent.name} ({selectedStudent.admNo})</strong></p>
              </div>
              <div className="header-action-utilities">
                <div className="filter-dropdown-trigger-wrapper">
                  <button className="filter-toggle-icon-btn" onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="filter-btn-label">Toggle Columns</span>
                  </button>

                  {showFilterDropdown && (
                    <div className="column-filter-popper">
                      {Object.keys(visibleColumns).map((colKey) => (
                        <label key={colKey} className="filter-checkbox-item">
                          <input
                            type="checkbox"
                            checked={visibleColumns[colKey]}
                            onChange={() => handleColumnToggle(colKey)}
                          />
                          <span className="filter-custom-tick"></span>
                          <span className="filter-label-text">{columnLabels[colKey]}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button className="close-modal-btn" onClick={() => setShowReceiptsModal(false)}>×</button>
              </div>
            </div>

            <div className="modal-body dynamic-scroll-table">
              <table className="statement-data-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    {visibleColumns.recNo && <th>Receipt No.</th>}
                    {visibleColumns.recDate && <th>Receipt Date</th>}
                    {visibleColumns.createdDate && <th>Created Date</th>}
                    {visibleColumns.period && <th>Allocated Period</th>}
                    {visibleColumns.payMode && <th>Pay Mode</th>}
                    {visibleColumns.grossAmt && <th>Gross Amt</th>}
                    {visibleColumns.discAmt && <th>Discount</th>}
                    {visibleColumns.remark && <th>Transaction Remark</th>}
                    {visibleColumns.tPayableAmt && <th>Net Payable</th>}
                    {visibleColumns.paidAmt && <th>Paid Amt</th>}
                    {visibleColumns.dueAmt && <th>Due Balance</th>}
                    {visibleColumns.advAmt && <th>Adv Offset</th>}
                  </tr>
                </thead>
                <tbody>
                  {receiptsList.length > 0 ? (
                    receiptsList.map((receipt, index) => (
                      <tr key={receipt.id}>
                        <td data-label="S.No.">{index + 1}</td>
                        {visibleColumns.recNo && <td data-label="Receipt No."><span className="badge-rec-number">#{receipt.recNo}</span></td>}
                        {visibleColumns.recDate && <td data-label="Receipt Date">{receipt.recDate}</td>}
                        {visibleColumns.createdDate && <td data-label="Created Date">{receipt.createdDate}</td>}
                        {visibleColumns.period && <td className="table-cell-period-list" data-label="Allocated Period">{receipt.period}</td>}
                        {visibleColumns.payMode && <td data-label="Pay Mode"><span className={`badge-paymode ${receipt.payMode.replace(/[^a-zA-Z]/g, "").toLowerCase()}`}>{receipt.payMode}</span></td>}
                        {visibleColumns.grossAmt && <td data-label="Gross Amt">₹{receipt.grossAmt}</td>}
                        {visibleColumns.discAmt && <td className="text-discount-green" data-label="Discount">₹{receipt.discAmt}</td>}
                        {visibleColumns.remark && <td className="table-cell-remarks" data-label="Transaction Remark">{receipt.remark}</td>}
                        {visibleColumns.tPayableAmt && <td data-label="Net Payable"><strong>₹{receipt.tPayableAmt}</strong></td>}
                        {visibleColumns.paidAmt && <td className="text-paid-blue" data-label="Paid Amt"><strong>₹{receipt.paidAmt}</strong></td>}
                        {visibleColumns.dueAmt && <td className={receipt.dueAmt > 0 ? "text-due-red" : ""} data-label="Due Balance">₹{receipt.dueAmt}</td>}
                        {visibleColumns.advAmt && <td data-label="Adv Offset">₹{receipt.advAmt}</td>}
                      </tr>
                    ))
                  ) : (
                    <tr className="empty-row-placeholder">
                      <td colSpan="13" style={{ textAlign: 'center', padding: '36px 24px', color: '#94a3b8' }}>
                        No dynamic transactional data logged for current student file execution path.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeeEntry;