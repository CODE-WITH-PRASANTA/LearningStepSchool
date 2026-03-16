import React, { useState, useEffect } from "react";
import "./FeeCollection.css";
import API from "../../api/axios";
import {
  FiMoreVertical,
  FiSearch,
  FiChevronDown,
  FiDownload,
  FiX,
} from "react-icons/fi";

const FeeCollection = () => {
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
    if (showCollect || showReceipt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showCollect, showReceipt]);

  useEffect(() => {
    setPage(1);
  }, [tableSearch]);

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

    return (
      name.includes(tableSearch.toLowerCase()) ||
      (f.admissionNo || "").toLowerCase().includes(tableSearch.toLowerCase()) ||
      (f.rollNumber || "").toString().includes(tableSearch)
    );
  });

  const currentRows = filteredFees.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredFees.length / rowsPerPage);

  /* ================= SAVE FEE ================= */

  const saveFee = async () => {
    if (!selectedStudent) {
      alert("Select student first");
      return;
    }

    try {
      const totalAmount = Number(amount);
      const discountAmount = (totalAmount * discount) / 100;
      const finalAmount = totalAmount - discountAmount;

      await API.post("/admission/fees", {
        studentId: selectedStudent._id,
        admissionNo: selectedStudent.admissionNo,
        name: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        rollNumber: selectedStudent.rollNumber,
        className: selectedStudent.class,
        section: selectedStudent.section,
        amount: totalAmount,
        paid: finalAmount,
        discount: discount,
        date: date,
      });

      alert("Fee collected successfully");

      fetchFees();

      setShowCollect(false);
      setSelectedStudent(null);
      setStudentSearch("");
      setAmount("");
      setDate("");
      setDiscount(0);
    } catch (err) {
      console.log(err);
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
        <div className="FeeCollection-search">
          <FiSearch />
          <input
            placeholder="Search name / admission / roll"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
          />
        </div>

        <button className="FeeCollection-filterBtn">
          Filter <FiChevronDown />
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
              console.log("Fee Row:", s);
              const amountValue = Number(s.amount || 0);
              const discountPercent =
                s.discount !== undefined && s.discount !== null
                  ? Number(s.discount)
                  : 0;

              const discountAmount = (amountValue * discountPercent) / 100;

              return (
                <tr key={s._id}>
                  <td>{indexFirst + i + 1}</td>

                  <td className="FeeCollection-admission">{s.admissionNo}</td>

                  <td>{s.name}</td>

                  <td>{s.rollNumber}</td>

                  <td>
                    {s.class} ({s.section})
                  </td>

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
                      {s.status}
                    </span>
                  </td>

                  <td>
                    <div className="FeeCollection-actionWrapper">
                      <button
                        className="FeeCollection-actionBtn"
                        onClick={() =>
                          setActiveMenu(activeMenu === s._id ? null : s._id)
                        }
                      >
                        <FiMoreVertical />
                      </button>

                      {activeMenu === s._id && (
                        <div className="FeeCollection-actionDropdown">
                          <button
                            onClick={() => {
                              setSelectedFee(s);
                              setShowReceipt(true);
                              setActiveMenu(null);
                            }}
                          >
                            View Details
                          </button>

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

              <select>
                <option>Cash</option>
                <option>Card</option>
                <option>Bank</option>
              </select>

              <textarea placeholder="Note"></textarea>
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

      {showReceipt && (
        <div className="FeeCollection-receiptModal">
          <div className="FeeCollection-receipt">
            <FiX className="close" onClick={() => setShowReceipt(false)} />

            <h2>School Name</h2>

            <p>Smithbroad, Unit 4, Holler Tower, San Diego</p>

            <div className="FeeCollection-receiptInfo">
              <div>
                <p>
                  <b>Student Name :</b> {selectedFee?.name}
                </p>

                <p>
                  <b>Class :</b> {selectedFee?.class} ({selectedFee?.section})
                </p>

                <p>
                  <b>Roll No :</b> {selectedFee?.rollNumber}
                </p>
              </div>

              <div>
                <p>
                  <b>Date :</b>{" "}
                  {selectedFee?.date
                    ? new Date(selectedFee.date).toLocaleDateString()
                    : ""}
                </p>

                <p>
                  <b>Collected By :</b> Admin
                </p>

                <p>
                  <b>Payment By :</b> Cash
                </p>
              </div>
            </div>

            <h3>Thanks</h3>

            <small>
              This receipt is computer generated hence no signature required
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCollection;
