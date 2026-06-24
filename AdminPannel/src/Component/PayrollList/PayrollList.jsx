import React, { useMemo, useState, useEffect } from "react";
import { Search, ChevronDown, MoreHorizontal, RotateCcw, X, Printer, DollarSign } from "lucide-react";
import "./PayrollList.css";
import API, { IMAGE_URL } from "../../api/axios";

const PayrollList = ({ refresh, onEdit }) => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control States
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Form Fields State for Payment Modal
  const [paymentForm, setPaymentForm] = useState({
    accountType: "",
    accountName: "",
    paymentMode: "",
    note: ""
  });

  const fetchPayrolls = async () => {
    try {
      const res = await API.get("/payroll");
      setPayrollData(res.data.data || res.data || []); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [refresh]);

  const filtered = useMemo(() => {
    return payrollData.filter(
      (item) =>
        item.teacherId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.teacherId?.department
          ?.toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [search, payrollData]);

  const statusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Pending") return "pending";
    return "reject";
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/payroll/${id}`);
      setPayrollData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
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
      staffName: selectedPayroll?.teacherId?.name,
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

  if (loading) return <h3 className="loading-text">Loading payroll...</h3>;

  return (
    <div className="payroll-list-wrapper">
      <div className="payroll-list-top">
        <h2>Payroll List</h2>

        <div className="top-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
                      src={
                        item.teacherId?.image
                          ? `${IMAGE_URL}${item.teacherId.image}`
                          : "https://i.pravatar.cc/40"
                      }
                      alt={item.teacherId?.name}
                    />
                    <span>{item.teacherId?.name || "N/A"}</span>
                  </div>
                </td>

                <td data-label="Department">{item.teacherId?.department || "-"}</td>

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
                  <div className="brand-avatar-box">NLET</div>
                  <div>
                    <h3>NLET - Institute Management Software</h3>
                    <p>301, AS Tower, Surya Nagar, Gopalpura bypass, Jaipur</p>
                    <p>Phone : 8058848888 | Email : Info@Nlet.In</p>
                  </div>
                </div>
              </div>

              <div className="payslip-period-banner">
                <span>Payslip for the period of {selectedPayroll.month} {selectedPayroll.year}</span>
                <span className="payslip-date-stamp">Date : {getCurrentFormattedDate()}</span>
              </div>

              <div className="payslip-details-grid">
                <div className="details-col">
                  <p><strong>Employee Name :</strong> {selectedPayroll.teacherId?.name || "N/A"}</p>
                  <p><strong>DOB :</strong> 19-06-2007</p>
                  <p><strong>Department :</strong> {selectedPayroll.teacherId?.department || "-"}</p>
                  <p><strong>Mode :</strong> Bank / Online Transfer</p>
                </div>
                <div className="details-col">
                  <p><strong>Employee Id :</strong> {selectedPayroll.teacherId?._id?.substring(0, 6) || "007007"}</p>
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

      {/* MODAL 2: PROCEED TO PAY (Image 3 Reference Form Layout) */}
      {showPaymentModal && selectedPayroll && (
        <div className="modal-overlay">
          <div className="payment-modal-container">
            <div className="payment-modal-header">
              <h3>Proceed To Pay</h3>
              <X size={20} className="close-modal-icon" onClick={() => setShowPaymentModal(false)} />
            </div>

            <form onSubmit={handleSavePayment} className="payment-modal-form">
              <div className="form-grid-layout">
                
                <div className="form-group-item">
                  <label>Staff Name</label>
                  <input 
                    type="text" 
                    value={`${selectedPayroll.teacherId?.name || "Staff"} (${selectedPayroll.teacherId?._id?.substring(0,6) || "ID"})`} 
                    disabled 
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Paid Amount</label>
                  <input 
                    type="text" 
                    value={selectedPayroll.totalSalary?.toFixed(2) || "0.00"} 
                    disabled 
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Account Type</label>
                  <select 
                    name="accountType" 
                    value={paymentForm.accountType} 
                    onChange={handlePaymentFormChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Current">Current Account</option>
                    <option value="Salary">Salary Account</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Account Name</label>
                  <select 
                    name="accountName" 
                    value={paymentForm.accountName} 
                    onChange={handlePaymentFormChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Primary Business Account">Primary Corporate Bank</option>
                    <option value="Secondary Operations Account">Secondary Operations Bank</option>
                    <option value="Cash Drawer">Petty Cash Reservoir</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Month Year</label>
                  <input 
                    type="text" 
                    value={`${selectedPayroll.month}-${selectedPayroll.year}`} 
                    disabled 
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Payment Mode</label>
                  <select 
                    name="paymentMode" 
                    value={paymentForm.paymentMode} 
                    onChange={handlePaymentFormChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Bank Transfer">Bank Wire Transfer / NEFT</option>
                    <option value="Cash">Cash Handout</option>
                    <option value="Cheque">Corporate Check</option>
                    <option value="UPI">UPI Digital Wallet</option>
                  </select>
                </div>

                <div className="form-group-item full-width-date">
                  <label>Payment Date</label>
                  <input 
                    type="text" 
                    value={getCurrentFormattedDate()} 
                    disabled 
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item full-width-textarea">
                  <label>Note</label>
                  <textarea 
                    name="note" 
                    placeholder="Enter transaction reference numbers or internal notes..."
                    value={paymentForm.note}
                    onChange={handlePaymentFormChange}
                    rows={3}
                  />
                </div>

              </div>

              <div className="payment-form-footer-actions">
                <button type="button" className="btn-cancel-payment" onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-payment">
                  Save Payment
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