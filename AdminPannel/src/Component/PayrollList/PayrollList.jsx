import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  RotateCcw,
  X,
  Printer,
} from "lucide-react";
import "./PayrollList.css";
import schoolLogo from "../../assets/Learning-Step-Logo-1.png" // Change the path according to your project

const PayrollList = ({ refresh, onEdit }) => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [payrollData, setPayrollData] = useState([
  {
    _id: "1",
    teacher: "Sanatan Nayak",
    department: "Science",
    month: "June",
    year: "2026",
    workingDays: 30,
    grossSalary: 50000,
    totalDeductions: 1000,
    overtimeAmount: 1200,
    totalSalary: 50200,
    status: "Completed",
  },
  {
    _id: "2",
    teacher: "Santosh Ku Nayak",
    department: "Mathematics",
    month: "June",
    year: "2026",
    workingDays: 30,
    grossSalary: 45000,
    totalDeductions: 500,
    overtimeAmount: 800,
    totalSalary: 45300,
    status: "Pending",
  },
  {
    _id: "3",
    teacher: "Natabar Nayak",
    department: "English",
    month: "June",
    year: "2026",
    workingDays: 30,
    grossSalary: 40000,
    totalDeductions: 0,
    overtimeAmount: 1000,
    totalSalary: 41000,
    status: "Completed",
  },
]);

  // Modal Control States
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

 const [paymentForm, setPaymentForm] = useState({
  workingDays: 30,
  absentDays: 0,
  month: "",
  year: "2026",
  paymentMode: "",
  paymentDate: "",
  note: "",
});

  const filtered = useMemo(() => {
  return payrollData.filter(
    (item) =>
      item.teacher.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase())
  );
}, [search, payrollData]);

  const statusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Pending") return "pending";
    return "reject";
  };

const handleDelete = (id) => {
  setPayrollData((prev) =>
    prev.filter((item) => item._id !== id)
  );
};

  const handleEdit = (item) => {
    onEdit(item);
    setMenuOpen(null);
  };

  // Open Payslip View Modal
  const handleViewPayslip = (item) => {
    setSelectedPayroll(item);
    setShowPayslipModal(true);
  };

  // Open Payment Gateway Form Modal
  const handleProceedToPay = (item) => {
    setSelectedPayroll(item);
    // Initialize defaults or keep fields empty for select inputs
    setPaymentForm({
      accountType: "",
      accountName: "",
      paymentMode: "",
      note: ""
    });
    setShowPaymentModal(true);
  };

  // Handle Input Changes inside Payment Form
  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({ ...prev, [name]: value }));
  };

  // Mock Handle Submit Payment Form
  const handleSavePayment = (e) => {
    e.preventDefault();
    console.log("Submitting Payment Data for processing:", {
      payrollId: selectedPayroll?._id,
      staffName: selectedPayroll?.item.teacher,
      paidAmount: selectedPayroll?.totalSalary,
      monthYear: `${selectedPayroll?.month}-${selectedPayroll?.year}`,
      ...paymentForm
    });
    // Add logic here to submit data to backend API if required
    setShowPaymentModal(false);
  };

  // Utility to grab current date formatted as DD-MM-YYYY
  const getCurrentFormattedDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };


  return (
    <div className="payroll-list-wrapper">
      <div className="payroll-list-top">
        <h2>Payroll List</h2>

        <div className="top-actions">


          <button className="download-report-btn">Download Report</button>

          <div className="year-dropdown">
            <select>
              <option>2024</option>
              <option>2023</option>
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="payroll-table-wrap">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Month</th>
              <th>Year</th>
              <th>Working Days</th>
              <th>Gross Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Overtime</th>
              <th>Status</th>
              <th>Action</th>
              <th>Process</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td data-label="Name">
                  <div className="user-info">
                    <img
                     src="https://i.pravatar.cc/100"
                    />
                    <span>{item.teacher || "N/A"}</span>
                  </div>
                </td>

                <td data-label="Department">{item.department || "-"}</td>

                <td data-label="Month">{item.month}</td>
                <td data-label="Year">{item.year}</td>

                <td data-label="Working Days">{item.workingDays}/{item.totalDays}</td>
                <td data-label="Gross Salary">₹{item.grossSalary?.toFixed(2) || '0.00'}</td>
                <td data-label="Deductions">₹{item.totalDeductions?.toFixed(2) || '0.00'}</td>
                <td data-label="Net Salary">₹{item.totalSalary?.toFixed(2) || '0.00'}</td>
                <td data-label="Overtime">₹{item.overtimeAmount?.toFixed(2) || '0.00'}</td>

                <td data-label="Status">
                  <span className={`status-badge ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td className="action-cell" data-label="Action">
                  <button
                    className="action-btn"
                    onClick={() =>
                      setMenuOpen(menuOpen === item._id ? null : item._id)
                    }
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuOpen === item._id && (
                    <div className="action-menu">
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </td>

                {/* Conditional Column rendering View Payslip or Proceed to Pay */}
                <td data-label="Process">
                  <div className="process-action-cell">
                    <RotateCcw size={14} className="loopback-icon" />
                    {item.status === "Completed" ? (
                      <button 
                        className="btn-view-payslip"
                        onClick={() => handleViewPayslip(item)}
                      >
                        View Payslip
                      </button>
                    ) : (
                      <button 
                        className="btn-proceed-pay"
                        onClick={() => handleProceedToPay(item)}
                      >
                        Proceed To Pay
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: VIEW PAYSLIP (Image 2 Reference Layout) */}
      {showPayslipModal && selectedPayroll && (
        <div className="modal-overlay">
          <div className="payslip-modal-container">
            <div className="payslip-header-bar">
              <span>View Payslip</span>
              <div className="payslip-header-actions">
                <button className="print-btn" onClick={() => window.print()}>
                  <Printer size={16} /> Print
                </button>
                <X size={20} className="close-modal-icon" onClick={() => setShowPayslipModal(false)} />
              </div>
            </div>

            <div className="payslip-body-content">
              <div className="payslip-corporate-branding">
                <div className="brand-logo-section">
                      <div className="brand-avatar-box">
                        <img
                          src={schoolLogo}
                          alt="School Logo"
                          className="school-logo"
                        />
                      </div>                  <div>
                    <h3>The Learning Step International School</h3>
                    <p>Tehla bypass alwar, road, Rajgarh, Thana, Rajasthan 301408</p>
                    <p>Phone : +91 714627894 | Email : learningstep19@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="payslip-period-banner">
                <span>Payslip for the period of {selectedPayroll.month} {selectedPayroll.year}</span>
                <span className="payslip-date-stamp">Date : {getCurrentFormattedDate()}</span>
              </div>

              <div className="payslip-details-grid">
                <div className="details-col">
                  <p><strong>Employee Name :</strong> {selectedPayroll.teacher || "N/A"}</p>
                  <p><strong>DOB :</strong> 19-06-2007</p>
                  <p><strong>Department :</strong> {selectedPayroll.department || "-"}</p>
                  <p><strong>Mode :</strong> Bank / Online Transfer</p>
                </div>
                <div className="details-col">
                  <p><strong>Employee Id :</strong> {selectedPayroll.teacherId?.substring(0, 6) || "007007"}</p>
                  <p><strong>PF A/c No. :</strong> —</p>
                  <p><strong>Designation :</strong> Instructor / Teacher</p>
                </div>
              </div>

              <div className="payslip-days-summary">
                <div className="summary-box"><strong>Total Working Days :</strong> {selectedPayroll.totalDays || 30}</div>
                <div className="summary-box"><strong>Total Holidays :</strong> 0</div>
                <div className="summary-box"><strong>Total Unpaid Leaves :</strong> {((selectedPayroll.totalDays || 30) - (selectedPayroll.workingDays || 0))}</div>
                <div className="summary-box"><strong>Net Paid Days :</strong> {selectedPayroll.workingDays}</div>
              </div>

              <table className="payslip-financial-table">
                <thead>
                  <tr>
                    <th>Earning</th>
                    <th>Amount</th>
                    <th>Deduction</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td>₹{selectedPayroll.grossSalary?.toFixed(2)}</td>
                    <td>Loss of Pay / Leaves</td>
                    <td>₹{selectedPayroll.totalDeductions?.toFixed(2)}</td>
                  </tr>
                  {selectedPayroll.overtimeAmount > 0 && (
                    <tr>
                      <td>Overtime Allowance</td>
                      <td>₹{selectedPayroll.overtimeAmount?.toFixed(2)}</td>
                      <td>-</td>
                      <td>₹0.00</td>
                    </tr>
                  )}
                  <tr className="financial-totals-row">
                    <td><strong>Total Earning</strong></td>
                    <td><strong>₹{(selectedPayroll.grossSalary + (selectedPayroll.overtimeAmount || 0)).toFixed(2)}</strong></td>
                    <td><strong>Total Deduction</strong></td>
                    <td><strong>₹{selectedPayroll.totalDeductions?.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>

              <div className="payslip-net-footer">
                <p><strong>Net Pay :</strong> ₹{selectedPayroll.totalSalary?.toFixed(2)}</p>
                <p className="currency-word-representation">In Words : INR {selectedPayroll.totalSalary?.toFixed(2)} Only</p>
                <span className="computer-generated-tag">Computer Generated Payslip</span>
              </div>
            </div>
          </div>
        </div>
      )}

   {/* ====================== PROCEED TO PAY MODAL ====================== */}

{showPaymentModal && selectedPayroll && (
  <div className="modal-overlay">
    <div className="payment-modal-container">

      <div className="payment-modal-header">
        <h3>Proceed To Pay</h3>

        <X
          size={20}
          className="close-modal-icon"
          onClick={() => setShowPaymentModal(false)}
        />
      </div>

      <form
        onSubmit={handleSavePayment}
        className="payment-modal-form"
      >

        <div className="form-grid-layout">

          {/* Staff Name */}

          <div className="form-group-item">
            <label>Staff Name</label>

            <input
              type="text"
              value={selectedPayroll.teacher}
              disabled
              className="disabled-input"
            />
          </div>

          {/* Paid Amount */}

          <div className="form-group-item">
            <label>Paid Amount (₹)</label>

            <input
              type="text"
              value={selectedPayroll.totalSalary}
              disabled
              className="disabled-input"
            />
          </div>

          {/* Working Days */}

          <div className="form-group-item">
            <label>Total Working Days</label>

            <input
              type="number"
              name="workingDays"
              value={paymentForm.workingDays || 30}
              onChange={handlePaymentFormChange}
            />
          </div>

          {/* Absent */}

          <div className="form-group-item">
            <label>Absent Days</label>

            <input
              type="number"
              name="absentDays"
              value={paymentForm.absentDays || 0}
              onChange={handlePaymentFormChange}
            />
          </div>

          {/* Month */}

          <div className="form-group-item">
            <label>Salary Month</label>

            <select
              name="month"
              value={paymentForm.month || selectedPayroll.month}
              onChange={handlePaymentFormChange}
            >
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>

          {/* Year */}

          <div className="form-group-item">
            <label>Salary Year</label>

            <select
              name="year"
              value={paymentForm.year || selectedPayroll.year}
              onChange={handlePaymentFormChange}
            >
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
            </select>
          </div>

          {/* Payment Mode */}

          <div className="form-group-item">
            <label>Payment Mode</label>

            <select
              name="paymentMode"
              value={paymentForm.paymentMode}
              onChange={handlePaymentFormChange}
            >
              <option value="">Select Payment Mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">
                Bank Transfer
              </option>
            </select>
          </div>

          {/* Payment Date */}

          <div className="form-group-item">
            <label>Payment Date</label>

            <input
              type="date"
              name="paymentDate"
              value={paymentForm.paymentDate}
              onChange={handlePaymentFormChange}
            />
          </div>

          {/* Note */}

          <div className="form-group-item full-width-textarea">
            <label>Note</label>

            <textarea
              rows="4"
              name="note"
              value={paymentForm.note}
              onChange={handlePaymentFormChange}
              placeholder="Write payment remarks..."
            />
          </div>

        </div>

        <div className="payment-form-footer-actions">

          <button
            type="button"
            className="btn-cancel-payment"
            onClick={() => setShowPaymentModal(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-submit-payment"
          >
            Pay Salary
          </button>

        </div>

      </form>

    </div>
  </div>
)}

    </div>
  );
};

export default PayrollList;