import React, { useState, useEffect } from "react";
import "./FeeCollection.css";
import API from "../../api/axios";
import logo from "../../Assets/Learning-Step-Logo-1.png";

import {
  FiMoreVertical,
  FiSearch,
  FiChevronDown,
  FiDownload,
  FiX,
} from "react-icons/fi";
import ReceiptModal from "../../Component/ReceiptModal/ReceiptModal";

const FeeCollection = () => {
  const [filterClass, setFilterClass] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [feeType, setFeeType] = useState("");
  const [status, setStatus] = useState("Paid");

  const [feeTypes, setFeeTypes] = useState([]);

  const [discount, setDiscount] = useState(0);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);

  const [page, setPage] = useState(1);

  const [showCollect, setShowCollect] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [activeMenu, setActiveMenu] = useState(null);

  const rowsPerPage = 5;
  const indexLast = page * rowsPerPage;
  const indexFirst = indexLast - rowsPerPage;

  useEffect(() => {
    const fetchFeeTypes = async () => {
      try {
        const res = await API.get("/feetypes");
        setFeeTypes(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFeeTypes();
  }, []);

  useEffect(() => {
    if (showCollect || showReceipt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCollect, showReceipt]);

  useEffect(() => {
    setPage(1);
  }, [tableSearch]);

  // ✅ AUTO DATE (runs once)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  // ✅ CLOSE ACTION MENU (global click)
  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH FEES ================= */

  const fetchFees = async () => {
    try {
      const res = await API.get("/admission/fees");
      setFees(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  /* ================= DELETE FEE ================= */

  const deleteFee = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admission/fees/${id}`);

      alert("Fee deleted successfully");

      fetchFees();
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= FILTER STUDENTS ================= */

  const filteredStudents = students.filter((s) => {
    const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();

    return (
      name.includes(studentSearch.toLowerCase()) ||
      (s.rollNumber || "").toString().includes(studentSearch)
    );
  });

  /* ================= FILTER FEES ================= */

  const filteredFees = fees.filter((f) => {
    const name = (f.name || "").toLowerCase();

    const matchesSearch =
      name.includes(tableSearch.toLowerCase()) ||
      (f.admissionNo || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
      (f.rollNumber || "").toString().includes(tableSearch);

    // ✅ CLASS FILTER
    const matchesClass = filterClass
      ? (f.class || "").toLowerCase() === filterClass.toLowerCase()
      : true;

    // ✅ MONTH FILTER
    const matchesMonth = filterMonth
      ? new Date(f.date).getMonth() + 1 === Number(filterMonth)
      : true;

    // ✅ DATE RANGE FILTER
    const feeDate = f.date ? new Date(f.date) : null;

    const matchesFromDate = filterFromDate
      ? feeDate && feeDate >= new Date(filterFromDate)
      : true;

    const matchesToDate = filterToDate
      ? feeDate && feeDate <= new Date(filterToDate)
      : true;

    return (
      matchesSearch &&
      matchesClass &&
      matchesMonth &&
      matchesFromDate &&
      matchesToDate
    );
  });

  const currentRows = filteredFees.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredFees.length / rowsPerPage);

  /* ================= SAVE FEE ================= */

  const saveFee = async () => {
  if (!selectedStudent) {
    alert("⚠️ Please select a student");
    return;
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert("⚠️ Enter valid amount");
    return;
  }

  if (!feeType) {
    alert("⚠️ Select fee type");
    return;
  }

  if (!date) {
    alert("⚠️ Select date");
    return;
  }

  try {
    const totalAmount = Number(amount);

    // ✅ Discount Calculation
    const discountAmount = (totalAmount * discount) / 100;
    const finalAmount = totalAmount - discountAmount;

    const paidAmount = finalAmount;
    const dueAmount = totalAmount - paidAmount;

    const payload = {
      studentId: selectedStudent._id,
      admissionNo: selectedStudent.admissionNo,
      name: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      rollNumber: selectedStudent.rollNumber,

      class: selectedStudent.class,
      section: selectedStudent.section,

      amount: totalAmount,
      paid: paidAmount,
      due: dueAmount,

      discount,
      paymentMethod,
      note,
      status,

      fees: [
        {
          feeType,
          amount: totalAmount,
        },
      ],

      date,
    };

    await API.post("/admission/fees", payload);

    alert("✅ Fee collected successfully");

    fetchFees();

    // ✅ RESET
    setShowCollect(false);
    setSelectedStudent(null);
    setStudentSearch("");
    setAmount("");
    setDiscount(0);
    setFeeType("");
    setPaymentMethod("Cash");
    setNote("");
    setStatus("Paid");

    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save fee");
  }
};
  return (
    <div className="FeeCollection">
      {/* HEADER */}

      <div className="FeeCollection-header">
        <div>
          <h2>Fees Collect</h2>
          <p>Dashboard / Fees Collect</p>
        </div>

        <button
          className="FeeCollection-collectBtn"
          onClick={() => setShowCollect(true)}
        >
          Collect Fees
        </button>
      </div>

      {/* TOOLBAR */}

      <div className="FeeCollection-toolbar">
        {/* SEARCH */}
        <div className="FeeCollection-search">
          <FiSearch />
          <input
            placeholder="Search..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
          />
        </div>

        {/* CLASS DROPDOWN */}
        <select
          className="FeeCollection-select"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Classes</option>
          {[...new Set(fees.map((f) => f.class))].map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        {/* MONTH DROPDOWN */}
        <select
          className="FeeCollection-select"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        {/* DATE FROM */}
        <input
          type="date"
          className="FeeCollection-date"
          value={filterFromDate}
          onChange={(e) => setFilterFromDate(e.target.value)}
        />

        {/* DATE TO */}
        <input
          type="date"
          className="FeeCollection-date"
          value={filterToDate}
          onChange={(e) => setFilterToDate(e.target.value)}
        />

        {/* RESET */}
        <button
          className="FeeCollection-resetBtn"
          onClick={() => {
            setFilterClass("");
            setFilterMonth("");
            setFilterFromDate("");
            setFilterToDate("");
          }}
        >
          Reset
        </button>
      </div>

      {/* TABLE */}

      <div className="FeeCollection-tableWrapper">
        <table className="FeeCollection-table">
          <thead>
            <tr>
              <th>S.L</th>
              <th>Admission No</th>
              <th>Name</th>
              <th>Roll</th>
              <th>Class</th>
              <th>Fee Type</th> 
              <th>Amount</th>
              <th>Discount %</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((s, i) => {

              // ✅ HANDLE OLD + NEW DATA
              const amountValue = s.totalAmount
                ? Number(s.totalAmount)
                : Number(s.amount || 0);

              const discountPercent =
                s.discount !== undefined && s.discount !== null
                  ? Number(s.discount)
                  : 0;

              // ✅ FEE TYPE HANDLING
              const feeTypeText =
                s.fees && s.fees.length > 0
                  ? s.fees.map((f) => f.feeType).join(", ")
                  : s.feeType || "-";

              return (
                <tr key={s._id}>
                  <td>{indexFirst + i + 1}</td>

                  <td className="FeeCollection-admission">
                    {s.admissionNo || "-"}
                  </td>

                  <td>{s.name || "-"}</td>

                  <td>{s.rollNumber || "-"}</td>

                  <td>
                    {s.class || "-"} ({s.section || "-"})
                  </td>

                  {/* ✅ NEW COLUMN */}
                  <td>{feeTypeText}</td>

                  <td>₹{amountValue.toLocaleString("en-IN")}</td>

                  <td>{discountPercent}%</td>

                  <td>₹{Number(s.paid || 0).toLocaleString("en-IN")}</td>

                  <td>₹{Number(s.due || 0).toLocaleString("en-IN")}</td>

                  <td>
                    {s.date
                      ? new Date(s.date).toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                  <td>
                    <span className={`FeeCollection-status ${s.status}`}>
                      {s.status || "-"}
                    </span>
                  </td>

                  <td>
                    <div className="FeeCollection-actionWrapper">
                      <button
                        className="FeeCollection-actionBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === s._id ? null : s._id);
                        }}
                      >
                        <FiMoreVertical />
                      </button>

                      {activeMenu === s._id && (
                        <div className="FeeCollection-actionDropdown">
                          <button
                            onClick={() => {
                              deleteFee(s._id);
                              setActiveMenu(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="FeeCollection-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          {"<"}
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          {">"}
        </button>
      </div>

      {showCollect && (
        <div className="FeeCollection-modal">
          <div className="FeeCollection-modalContent">
            <FiX className="close" onClick={() => setShowCollect(false)} />

            <h3>Collect Fees</h3>

            <div className="FeeCollection-formGrid">
              <input
                placeholder="Search Name / Roll No"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />

              {studentSearch && (
                <div className="FeeCollection-studentResults">
                  {filteredStudents.slice(0, 5).map((s) => (
                    <div
                      key={s._id}
                      className="FeeCollection-studentItem"
                      onClick={() => {
                        setSelectedStudent(s);
                        setStudentSearch(`${s.firstName} ${s.lastName}`);
                      }}
                    >
                      <strong>
                        {s.firstName} {s.lastName}
                      </strong>

                      <p>
                        Roll: {s.rollNumber} | {s.class} ({s.section})
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedStudent && (
                <div className="FeeCollection-selectedStudent">
                  <p>
                    <b>Admission:</b> {selectedStudent.admissionNo}
                  </p>

                  <p>
                    <b>Name:</b> {selectedStudent.firstName}{" "}
                    {selectedStudent.lastName}
                  </p>

                  <p>
                    <b>Class:</b> {selectedStudent.class} (
                    {selectedStudent.section})
                  </p>

                  <p>
                    <b>Roll:</b> {selectedStudent.rollNumber}
                  </p>
                </div>
              )}

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <select
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              >
                <option value={0}>No Discount</option>
                <option value={10}>10%</option>
                <option value={20}>20%</option>
                <option value={30}>30%</option>
              </select>

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Bank</option>
              </select>

              <select
                value={feeType}
                onChange={(e) => setFeeType(e.target.value)}
              >
                <option value="">Select Fee Type</option>

                {feeTypes.map((f) => (
                  <option key={f._id} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Unpaid</option>
                <option value="Partial">Partial</option>
              </select>

              <textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="FeeCollection-formBtns">
              <button
                className="cancel"
                onClick={() => {
                  setShowCollect(false);
                  setStudentSearch("");
                  setSelectedStudent(null);
                  setAmount("");
                  setDate("");
                }}
              >
                Cancel
              </button>

              <button className="save" onClick={saveFee}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <ReceiptModal
        showReceipt={showReceipt}
        setShowReceipt={setShowReceipt}
        selectedFee={selectedFee}
        logo={logo}
      /> */}
    </div>
  );
};

export default FeeCollection;