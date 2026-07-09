import React, { useState, useEffect } from "react";
import "./FeeEntry.css";
import API from "../../api/axios";
import { useRef } from "react";

const FeeEntry = () => {
  // --- MOCK DATABASE RECORDS ---
const searchRef = useRef(null);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [receiptsList, setReceiptsList] = useState([]);

  // --- UI STATE MANAGEMENT ---
  // const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showReceiptsModal, setShowReceiptsModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isHeadWiseOpen, setIsHeadWiseOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- DYNAMIC SELECTION CONFIGURATIONS ---

  const [selectedPayMode, setSelectedPayMode] = useState("Cash");
  const [receiptNo, setReceiptNo] = useState("205");
  const [selectedDate, setSelectedDate] = useState("2026-06-23");
  const [receiptRemark, setReceiptRemark] = useState("");

  const [searchText, setSearchText] = useState("");

  // --- SELECTED MONTHS SYSTEM ---
  const monthsList = [
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
  ];
  const [selectedMonths, setSelectedMonths] = useState([]);
  // --- FEE HEADS SYSTEM ---
  const [feeHeads, setFeeHeads] = useState([]);

  // --- CALCULATION SUMMARY TRACKERS ---
  const [advanceBalance, setAdvanceBalance] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [academicYear, setAcademicYear] = useState("2026-27");

  const [paidMonths, setPaidMonths] = useState([]);
  const [feeHeadPayments, setFeeHeadPayments] = useState({});
  const [feeHeadMonths, setFeeHeadMonths] = useState({});

  // --- RECEIPT STATEMENT RECORDS MATRIX ---

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
  // const [grandTotal, setGrandTotal] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(async () => {
     if (!searchText || searchText.length < 2) {
  setStudentSuggestions([]);
  setShowSearchResults(false);
  return;
}
try {
  const response = await API.get(
    `/students/search/list?q=${encodeURIComponent(searchText)}`
  );

  console.log("SEARCH RESPONSE =>", response.data);
console.log("SETTING =>", response.data.data || response.data);
  setStudentSuggestions(response.data|| []);
  setShowSearchResults(true);
} catch (error) {
  console.log("SEARCH ERROR =>", error);
}
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // --- CORE SYSTEM MATH ENGINE ---

  //  useEffect(() => {
  //   let totalFee = 0;
  //   let currentSelection = 0;

  //  feeHeads
  //   .filter((head) => head.checked)
  //   .forEach((head) => {
  //     if (
  //       ["Monthly", "Quarterly", "Half-Yearly"].includes(
  //         head.structureType
  //       )
  //     ) {
  //       let amount = 0;

  //       if (selectedMonths.length > 0) {
  //         amount = selectedMonths.reduce(
  //           (sum, month) =>
  //             sum +
  //             Number(
  //               head.amounts?.[month.toUpperCase()] || 0
  //             ),
  //           0
  //         );
  //       } else {
  //         amount = Number(head.amt || 0);
  //       }

  //       totalFee += amount;
  //       currentSelection += amount;
  //     } else {
  //       totalFee += Number(head.amt || 0);
  //       currentSelection += Number(head.amt || 0);
  //     }
  //   });

  //   setGrandTotal(totalFee);
  //   setSelectedAmount(currentSelection);
  // }, [feeHeads, selectedMonths]);

 useEffect(() => {
  let total = 0;

  feeHeads
    .filter((head) => head.checked)
    .forEach((head) => {
      if (
        ["Monthly", "Quarterly", "Half-Yearly"].includes(
          head.structureType
        ) &&
        selectedMonths.length > 0
      ) {
        total += selectedMonths.reduce(
          (sum, month) =>
            sum +
            Number(
              head.amounts?.[month.toUpperCase()] || 0
            ),
          0
        );
      } else {
        total += Number(head.amt || 0);
      }
    });

  setGrandTotal(total);
  setSelectedAmount(total);
}, [feeHeads, selectedMonths]);
  // --- ACTIONS ---
  const handleSave = async () => {
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    setIsSaving(true);

    try {
      const formattedFeeHeads = feeHeads
        .filter((head) => head.checked)
        .map((head) => ({
          feeHeadId: head.id,
          feeHeadName: head.name,
          amount: Number(head.amt || 0),
          structureType: head.structureType,
        }));

      const payload = {
        studentId: selectedStudent._id,
        academicYear,
        paymentMode: selectedPayMode,
        installmentMonth: selectedMonths,

        feeHeads: formattedFeeHeads,

        discountAmount: totalDiscount,
        advanceAdjustment: advanceBalance,
        paidAmount: totalPaid,

        remark: receiptRemark,
      };

      console.log("PAYLOAD =>", payload);

      const response = await API.post("/fee-entry/create", payload);

      if (response.data.success) {
        await loadPaymentHistory(selectedStudent._id);

        alert("Saved Successfully");
      }
    } catch (error) {
      console.log("ERROR =>", error);

      if (error.response) {
        console.log("STATUS =>", error.response.status);
        console.log("DATA =>", error.response.data);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCellChange = (id, field, value) => {
    setFeeHeads((prevHeads) =>
      prevHeads.map((head) => {
        if (head.id === id) {
          return { ...head, [field]: Number(value) };
        }
        return head;
      }),
    );
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);

    setSearchText(`${student.firstName} ${student.lastName}`);

    setStudentSuggestions([]);
    setShowSearchResults(false);

    loadPaymentHistory(student._id);
  };

  useEffect(() => {
    if (!selectedStudent?.class) return;

    const loadFeeStructure = async () => {
      try {
        const searchClass = selectedStudent?.class?.replace(/\./g, "")?.trim();

        console.log("Selected Class =>", selectedStudent?.class);
        console.log("Search Class =>", searchClass);

        const response = await API.get(
          `/fee-structure/all?search=${encodeURIComponent(searchClass)}`,
        );

        console.log("Fee Structure Response =>", response.data);

        if (response.data.success) {
          const allItems = response.data.data.flatMap(
            (structure) => structure.feeItems || [],
          );

          console.log("Fee Items =>", allItems);

          const formattedHeads = response.data.data.flatMap((structure) =>
            (structure.feeItems || []).map((item, index) => ({
              id: item.feeHead?._id || index,

              name: item.feeHead?.feeHeadName || "Fee Head",

              structureType: structure.structureType,

              amounts: item.amounts || {},

              amt: Number(item.total || 0),

              conc: 0,

              checked: true,
            })),
          );

          console.log("Formatted Heads =>", formattedHeads);

          setFeeHeads(formattedHeads);
          console.log("Fee Heads State =>", formattedHeads);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadFeeStructure();
  }, [selectedStudent]);

  const loadPaymentHistory = async (studentId) => {
    try {
      const res = await API.get(`/fee-entry/student/${studentId}`);
      if (res.data.success) {
        const receipts = res.data.data;

        setReceiptsList(receipts);

        // All paid months
        const months = receipts.flatMap((item) => item.installmentMonth || []);

        setPaidMonths([...new Set(months)]);

        const feeHeadPaidMap = {};
        const feeHeadMonthMap = {};
        receipts.forEach((receipt) => {
          console.log("RECEIPT =>", receipt);
          receipt.feeHeads?.forEach((fee) => {
            console.log("FULL FEE OBJECT =>", fee);
            const feeHeadId =
              fee.feeHeadId?._id || fee.feeHeadId || fee.feeHead;

            console.log("FEE HEAD ID =>", feeHeadId);

            if (!feeHeadPaidMap[feeHeadId]) {
              feeHeadPaidMap[feeHeadId] = 0;
            }

            if (!feeHeadMonthMap[feeHeadId]) {
              feeHeadMonthMap[feeHeadId] = [];
            }

            feeHeadMonthMap[feeHeadId].push(
              ...(receipt.installmentMonth || []),
            );

            console.log(
              "RECEIPT FEE HEADS =>",
              JSON.stringify(receipts, null, 2),
            );
            feeHeadPaidMap[feeHeadId] += Number(fee.amount || 0);
          });
        });

        Object.keys(feeHeadMonthMap).forEach((key) => {
          feeHeadMonthMap[key] = [...new Set(feeHeadMonthMap[key])];
        });

        setFeeHeadPayments(feeHeadPaidMap);
        setFeeHeadMonths(feeHeadMonthMap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   const unpaidMonths = monthsList.filter(
  //     (month) => !paidMonths.includes(month),
  //   );

  //   setSelectedMonths(unpaidMonths.slice(0, 1)); // auto select next unpaid month
  // }, [paidMonths]);

  const toggleMonth = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month],
    );
  };

  const toggleAllMonths = () => {
    const availableMonths = monthsList.filter(
      (month) => !paidMonths.includes(month),
    );

    if (selectedMonths.length === availableMonths.length) {
      setSelectedMonths([]);
    } else {
      setSelectedMonths(availableMonths);
    }
  };

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns((prev) => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  const toggleFeeHead = (id) => {
    setFeeHeads((prev) =>
      prev.map((head) =>
        head.id === id ? { ...head, checked: !head.checked } : head,
      ),
    );
  };

  const toggleAllHeads = (checkedStatus) => {
    setFeeHeads((prev) =>
      prev.map((head) => ({ ...head, checked: checkedStatus })),
    );
  };

  // const selectStudentProfile = (student) => {
  //   setSelectedStudent(student);
  //   setSearchQuery(`${student.firstName} ${student.lastName}`);
  //   setShowSearchResults(false);
  // };

  const AvatarIcon = () => (
    <svg
      className="avatar-svg-logo"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 21C20 19.6044 20 18.9067 19.7778 18.3448C19.4352 17.4786 18.7512 16.7946 17.885 16.4522C17.3231 16.23 16.6254 16.23 15.2292 16.23H8.77083C7.37464 16.23 6.67655 16.23 6.11463 16.4522C5.24842 16.7946 4.5644 17.4786 4.22175 18.3448C4 18.9067 4 19.6044 4 21"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 8.5C16.5 10.9853 14.4853 13 12 13C9.51472 13 7.5 10.9853 7.5 8.5C7.5 6.01472 9.51472 4 12 4C14.4853 4 16.5 6.01472 16.5 8.5Z"
        stroke="#94a3b8"
        strokeWidth="2"
      />
    </svg>
  );

  const columnLabels = {
    recNo: "Receipt Code",
    recDate: "Date Added",
    createdDate: "Created Timestamp",
    period: "Cycle Periods",
    payMode: "Mode Variant",
    grossAmt: "Gross Aggregates",
    discAmt: "Total Discounts",
    remark: "Narration Remarks",
    tPayableAmt: "Net Due Balances",
    paidAmt: "Amount Collected",
    dueAmt: "Deficit Due",
    advAmt: "Advance Offset",
  };

 useEffect(() => {
  const payable =
    grandTotal -
    Number(totalDiscount || 0) -
    Number(advanceBalance || 0);

  setPayableAmount(payable);

  const due =
    payable -
    Number(totalPaid || 0);

  setDueAmount(Math.max(0, due));
}, [
  grandTotal,
  totalDiscount,
  advanceBalance,
  totalPaid,
]);

  const totalHeadDue = feeHeads.reduce((sum, head) => {
    let paid = 0;

    if (
      head.structureType === "Monthly" ||
      head.structureType === "Quarterly" ||
      head.structureType === "Half-Yearly"
    ) {
      paid = selectedMonths.reduce(
        (s, month) => s + Number(head.amounts?.[month.toUpperCase()] || 0),
        0,
      );
    }

    return sum + (Number(head.amt || 0) - paid);
  }, 0);

  const totalPreviouslyPaid = receiptsList.reduce(
    (sum, receipt) => sum + Number(receipt.paidAmount || 0),
    0,
  );

  const remainingMonths = monthsList.filter(
    (month) => !paidMonths.includes(month),
  );

  const totalPaidAmount = feeHeads
    .filter((head) => head.checked)
    .reduce((sum, head) => {
      const paidMonthsForHead = feeHeadMonths[head.id] || [];

      let paid = 0;

      if (
        ["Monthly", "Quarterly", "Half-Yearly"].includes(head.structureType)
      ) {
        paid = paidMonthsForHead.reduce(
          (s, month) => s + Number(head.amounts?.[month.toUpperCase()] || 0),
          0,
        );
      } else {
        paid = Number(feeHeadPayments[head.id] || 0);
      }

      return sum + paid;
    }, 0);

  const totalDueAmount = feeHeads
    .filter((head) => head.checked)
    .reduce((sum, head) => {
      const paidMonthsForHead = feeHeadMonths[head.id] || [];

      let paid = 0;

      if (
        ["Monthly", "Quarterly", "Half-Yearly"].includes(head.structureType)
      ) {
        paid = paidMonthsForHead.reduce(
          (s, month) => s + Number(head.amounts?.[month.toUpperCase()] || 0),
          0,
        );
      } else {
        paid = Number(feeHeadPayments[head.id] || 0);
      }

      return sum + Math.max(0, Number(head.amt || 0) - paid);
    }, 0);

  const remainingBalance = Math.max(0, totalDueAmount);

 useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setShowSearchResults(false);
    }
  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {
    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );
  };
}, []);

  // 👇 Other useEffects
  useEffect(() => {
    // load fee structure
  }, [selectedStudent]);

  useEffect(() => {
    // calculations
  }, [feeHeads]);
const availableMonths = monthsList.filter(
  (month) => !paidMonths.includes(month)
);
  return (
    <div className="fee-dashboard-container">
      {/* HEADER SECTION WITH RESPONSIVE SEARCH */}
      <header className="fee-header-section">
        <div className="search-wrapper" ref={searchRef}>
          <span className="search-icon-wrapper">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search Student Name / Admission No"
            value={searchText}
           onChange={(e) => {
  setSearchText(e.target.value);
  setShowSearchResults(true);
}}
            className="search-input"
          />

          {showSearchResults && searchText.length >= 2 && (
            <div className="search-results-dropdown">
              {studentSuggestions.length > 0 ? (
                studentSuggestions.map((student) => (
                  <div
                    key={student._id}
                    className="search-result-item"
                    onClick={() => handleSelectStudent(student)}
                  >
                    <div>
                      <strong>
                        {student.firstName} {student.lastName}
                      </strong>
                    </div>

                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      Adm No: {student.admissionNo}
                      {" | "}
                      Class: {student.class}
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
                <p>
                  <strong>Sr. No. :</strong> {selectedStudent?.srNo}
                </p>
                <p>
                  <strong>Adm. No. :</strong> {selectedStudent?.admissionNo}
                </p>
                <p>
                  <strong>Name :</strong>{" "}
                  {selectedStudent
                    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                    : "-"}
                </p>
                <p>
                  <strong>Class :</strong> {selectedStudent?.class}
                </p>
                <p>
                  <strong>F. Name :</strong> {selectedStudent?.fatherName}
                </p>
                <p>
                  <strong>M. Name :</strong> {selectedStudent?.motherName}
                </p>
                <p>
                  <strong>Mob. No. :</strong> {selectedStudent?.mobile}
                </p>
              </div>
              <div className="info-group highlighted-specs">
                <p>
                  <strong>Fee Type :</strong> {selectedStudent?.feeType}
                </p>
                <p>
                  <strong>Stu. Type :</strong> {selectedStudent?.studentType}
                </p>
                <p>
                  <strong>Transport :</strong>{" "}
                  <span
                    className={
                      selectedStudent?.transport === "Inactive"
                        ? "status-inactive"
                        : "status-active"
                    }
                  >
                    {selectedStudent?.transport}
                  </span>
                </p>
                <p>
                  <strong>Veh. No :</strong> {selectedStudent?.vehNo}
                </p>
                <p>
                  <strong>Route :</strong> {selectedStudent?.route}
                </p>
                <p>
                  <strong>Stop :</strong> {selectedStudent?.stop}
                </p>
                <p>
                  <strong>Add. :</strong> {selectedStudent?.address}
                </p>
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

            <div className="status-row">
              <span>Total Paid Amount</span>
              <strong style={{ color: "#16a34a" }}>
                ₹{totalPaidAmount.toFixed(2)}
              </strong>
            </div>

            <div className="status-row">
              <span>Remaining Balance</span>
              <strong
                style={{
                  color: remainingBalance > 0 ? "#ef4444" : "#16a34a",
                }}
              >
                ₹{remainingBalance.toFixed(2)}
              </strong>
            </div>

            <div className="status-row-column">
              <span>Paid Months</span>

              <strong className="months-token-string">
                {paidMonths.length > 0 ? paidMonths.join(", ") : "No Payment"}
              </strong>
            </div>

            <div className="status-row-column">
              <span>Remaining Months</span>

              <strong
                className="months-token-string"
                style={{ color: "#ef4444" }}
              >
                {remainingMonths.length > 0
                  ? remainingMonths.join(", ")
                  : "All Months Paid"}
              </strong>
            </div>

            <div className="status-row">
              <span>Status</span>

              <strong
                className={
                  remainingBalance > 0 ? "status-inactive" : "status-active"
                }
              >
                {remainingBalance > 0 ? "Fee Pending" : "Fully Paid"}
              </strong>
            </div>
          </div>
        </div>

        {/* PAYMENT HISTORY */}
        <div className="payment-history-card">
          <div className="history-header">
            <h3>Recent Local Action Ledger</h3>
          </div>

          <div className="history-list">
            {receiptsList.map((rec) => (
              <div key={rec._id} className="history-item">
                <div className="history-item-meta">
                  <strong>Receipt #{rec.receiptNo}</strong>

                  <p>
                    {rec.paymentMode} • {rec.installmentMonth?.join(", ")}
                  </p>
                </div>

                <div className="history-item-amt">₹{rec.paidAmount}</div>
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
               checked={
  selectedMonths.length === availableMonths.length &&
  availableMonths.length > 0
}
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
                <label
                  key={month}
                  className={`month-item-box ${isChecked ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={paidMonths.includes(month)}
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
            <div
              className="left-toggle"
              onClick={() => setIsHeadWiseOpen(!isHeadWiseOpen)}
            >
              <span
                className={`arrow-indicator ${isHeadWiseOpen ? "open" : ""}`}
              >
                ▼
              </span>
              <h3>
                Head Wise Split Allocation ({selectedMonths.length || 1} Month
                Rate)
              </h3>
            </div>
            <button
              className="btn-show-receipts"
              onClick={() => setShowReceiptsModal(true)}
            >
              Show Historic Statements
            </button>
          </div>

          {isHeadWiseOpen && (
            <div className="head-wise-table-wrapper">
              <table className="premium-fee-table">
                <thead>
                  <tr>
                    <th className="col-check" style={{ textAlign: "center" }}>
                      <label className="table-checkbox-container">
                        <input
                          type="checkbox"
                          checked={feeHeads.every((h) => h.checked)}
                          onChange={(e) => toggleAllHeads(e.target.checked)}
                        />
                        <span className="table-checkmark-box"></span>
                      </label>
                    </th>

                    <th>FEE HEAD</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DUE</th>
                  </tr>
                </thead>

                <tbody>
                  {feeHeads.length > 0 ? (
                    <>
                      {feeHeads
                        .filter((head) => head.checked)
                        .map((head) => {
                          const paidMonthsForHead =
                            feeHeadMonths[head.id] || [];

                          // Remaining Months
                          const remainingMonths =
                            head.structureType === "Monthly"
                              ? monthsList.filter(
                                  (month) => !paidMonthsForHead.includes(month),
                                )
                              : [];

                          // Paid Amount
                          let paidAmount = 0;

                          if (head.structureType === "Monthly") {
                            paidAmount = paidMonthsForHead.reduce(
                              (sum, month) =>
                                sum +
                                Number(
                                  head.amounts?.[month.toUpperCase()] ||
                                    head.amounts?.[month] ||
                                    0,
                                ),
                              0,
                            );
                          } else {
                            paidAmount = Number(
                              feeHeadPayments[String(head.id)] || 0,
                            );
                          }

                          // Due Amount
                          const headDueAmount = Math.max(
                            0,
                            Number(head.amt || 0) - paidAmount,
                          );

                          return (
                            <tr key={head.id}>
                              <td
                                className="col-check"
                                style={{ textAlign: "center" }}
                              >
                                <label className="table-checkbox-container">
                                  <input
                                    type="checkbox"
                                    checked={head.checked}
                                    onChange={() => toggleFeeHead(head.id)}
                                  />
                                  <span className="table-checkmark-box"></span>
                                </label>
                              </td>

                              <td className="fee-head-detail-cell">
                                <div className="fee-head-name">{head.name}</div>

                                <div className="fee-head-type">
                                  Type : {head.structureType}
                                </div>

                                {/* Monthly */}
                                {head.structureType === "Monthly" && (
                                  <>
                                    <div
                                      style={{
                                        color: "#16a34a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Paid Months :
                                      {paidMonthsForHead.length > 0
                                        ? paidMonthsForHead.join(", ")
                                        : " None"}
                                    </div>

                                    <div
                                      style={{
                                        color: "#ef4444",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Remaining :
                                      {remainingMonths.length > 0
                                        ? remainingMonths.join(", ")
                                        : " Fully Paid"}
                                    </div>
                                  </>
                                )}

                                {/* Quarterly */}
                                {head.structureType === "Quarterly" && (
                                  <>
                                    <div
                                      style={{
                                        color: "#16a34a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Paid Months :
                                      {paidMonthsForHead.length > 0
                                        ? paidMonthsForHead.join(", ")
                                        : " None"}
                                    </div>

                                    <div
                                      style={{
                                        color: "#ef4444",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Remaining :
                                      {remainingMonths.length > 0
                                        ? remainingMonths.join(", ")
                                        : " None"}
                                    </div>
                                  </>
                                )}

                                {/* Half-Yearly */}
                                {head.structureType === "Half-Yearly" && (
                                  <>
                                    <div
                                      style={{
                                        color: "#16a34a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Paid Months :
                                      {paidMonthsForHead.length > 0
                                        ? paidMonthsForHead.join(", ")
                                        : " None"}
                                    </div>

                                    <div
                                      style={{
                                        color: "#ef4444",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Remaining :
                                      {remainingMonths.length > 0
                                        ? remainingMonths.join(", ")
                                        : " None"}
                                    </div>
                                  </>
                                )}

                                {/* Annual */}
                                {head.structureType === "Annually" && (
                                  <>
                                    <div
                                      style={{
                                        color: "#f59e0b",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Annual Fee :
                                      {headDueAmount === 0
                                        ? " Paid"
                                        : " Pending"}
                                    </div>

                                    <div
                                      style={{
                                        color: "#16a34a",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Paid Amount : ₹{paidAmount}
                                    </div>

                                    <div
                                      style={{
                                        color: "#ef4444",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Due Amount : ₹{headDueAmount}
                                    </div>
                                  </>
                                )}
                              </td>

                              <td className="amount-col">
                                ₹{Number(head.amt || 0).toFixed(2)}
                              </td>

                              <td
                                className="paid-col"
                                style={{
                                  color: "#16a34a",
                                  fontWeight: 600,
                                }}
                              >
                                ₹{paidAmount.toFixed(2)}
                              </td>

                              <td
                                className="due-col"
                                style={{
                                  color:
                                    headDueAmount > 0 ? "#ef4444" : "#16a34a",
                                  fontWeight: 600,
                                }}
                              >
                                ₹{headDueAmount.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}

                      <tr className="total-row-highlight">
                        <td></td>

                        <td>
                          <strong>Total</strong>
                        </td>

                        <td>
                          <strong>₹{grandTotal.toFixed(2)}</strong>
                        </td>

                        <td
                          style={{
                            color: "#16a34a",
                            fontWeight: 700,
                          }}
                        >
                          ₹{totalPaidAmount.toFixed(2)}
                        </td>

                        <td
                          style={{
                            color: totalDueAmount > 0 ? "#ef4444" : "#16a34a",
                            fontWeight: 700,
                          }}
                        >
                          ₹{totalDueAmount.toFixed(2)}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No Fee Heads Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* FLUID RESPONSIBLE CALCULATION SUM FIELDS GRID */}
          <div className="calculation-summary-row">
            <div className="summary-field-box">
              <label>Academic Year</label>

              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
              </select>
            </div>
            <div className="summary-field-box">
              <label>Grand Total</label>
              <input type="text" value={grandTotal.toFixed(2)} readOnly />
            </div>

            <div className="summary-field-box">
              <label>Advance Paid</label>
              <input
                type="number"
                value={advanceBalance}
                onChange={(e) => setAdvanceBalance(Number(e.target.value))}
              />
            </div>

            <div className="summary-field-box">
              <label>Discount Amount</label>
              <input
                type="number"
                value={totalDiscount}
                onChange={(e) => setTotalDiscount(Number(e.target.value))}
              />
            </div>

            <div className="summary-field-box">
              <label>Payable Amount</label>
              <input type="text" value={payableAmount.toFixed(2)} readOnly />
            </div>

            <div className="summary-field-box mandatory-box">
              <label>Total Paid*</label>
              <input
                type="number"
                value={totalPaid}
                onChange={(e) => setTotalPaid(Number(e.target.value))}
              />
            </div>

            <div className="summary-field-box">
              <label>Due Amount</label>
              <input
                type="text"
                value={dueAmount.toFixed(2)}
                readOnly
                className={dueAmount > 0 ? "has-due" : "zero-due"}
              />
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
        <div
          className="modal-overlay"
          onClick={() => setShowReceiptsModal(false)}
        >
          <div
            className="modal-box premium-card asset-statement-modal animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title-desc-wrapper">
                <h2>STUDENT FEE STATEMENT HISTORIC RECORDS</h2>
                <p className="modal-subtitle">
                  Active Student Focus:{" "}
                  <strong>
                    {selectedStudent?.studentName || ""} (
                    {selectedStudent?.admissionNo})
                  </strong>
                </p>
              </div>
              <div className="header-action-utilities">
                <div className="filter-dropdown-trigger-wrapper">
                  <button
                    className="filter-toggle-icon-btn"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
                          <span className="filter-label-text">
                            {columnLabels[colKey]}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowReceiptsModal(false)}
                >
                  ×
                </button>
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
                        {visibleColumns.recNo && (
                          <td data-label="Receipt No.">
                            <span className="badge-rec-number">
                              #{receipt.receiptNo}
                            </span>
                          </td>
                        )}
                        {visibleColumns.recDate && (
                          <td data-label="Receipt Date">{receipt.recDate}</td>
                        )}
                        {visibleColumns.createdDate && (
                          <td data-label="Created Date">
                            {receipt.createdDate}
                          </td>
                        )}
                        {visibleColumns.period && (
                          <td
                            className="table-cell-period-list"
                            data-label="Allocated Period"
                          >
                            {receipt.installmentMonth?.join(", ")}
                          </td>
                        )}
                        {visibleColumns.payMode && (
                          <td data-label="Pay Mode">
                            <span
                              className={`badge-paymode ${receipt.paymentMode.replace(/[^a-zA-Z]/g, "").toLowerCase()}`}
                            >
                              {receipt.paymentMode}
                            </span>
                          </td>
                        )}
                        {visibleColumns.grossAmt && (
                          <td data-label="Gross Amt">₹{receipt.grossAmount}</td>
                        )}
                        {visibleColumns.discAmt && (
                          <td
                            className="text-discount-green"
                            data-label="Discount"
                          >
                            ₹{receipt.discountAmount}
                          </td>
                        )}
                        {visibleColumns.remark && (
                          <td
                            className="table-cell-remarks"
                            data-label="Transaction Remark"
                          >
                            {receipt.remark}
                          </td>
                        )}
                        {visibleColumns.tPayableAmt && (
                          <td data-label="Net Payable">
                            <strong>₹{receipt.totalPayable}</strong>
                          </td>
                        )}
                        {visibleColumns.paidAmt && (
                          <td className="text-paid-blue" data-label="Paid Amt">
                            <strong>₹{receipt.paidAmount}</strong>
                          </td>
                        )}
                        {visibleColumns.dueAmt && (
                          <td
                            className={
                              receipt.dueAmount > 0 ? "text-due-red" : ""
                            }
                            data-label="Due Balance"
                          >
                            ₹{receipt.dueAmount}
                          </td>
                        )}
                        {visibleColumns.advAmt && (
                          <td data-label="Adv Offset">₹{receipt.advAmt}</td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr className="empty-row-placeholder">
                      <td
                        colSpan="13"
                        style={{
                          textAlign: "center",
                          padding: "36px 24px",
                          color: "#94a3b8",
                        }}
                      >
                        No dynamic transactional data logged for current student
                        file execution path.
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
