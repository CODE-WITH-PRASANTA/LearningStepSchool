import React, { useState, useRef } from 'react';
import './ExpenseManagement.css';

const ExpenseManagement = () => {
  const initialFormState = {
    employeeName: '',
    expenseDate: new Date().toISOString().split('T')[0],
    expenseFor: '',
    amount: '',
    description: '',
    paymentApproval: '',
    paymentStatus: 'Pending',
    upiNumber: '',
    fileName: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      employeeName: 'Rakesh Kumar',
      expenseFor: 'Office Supplies',
      date: '05/08/2025',
      amount: '1,250.00',
      bill: 'sample_bill.pdf',
      paymentStatus: 'Pending',
      approval: 'Pending',
    },
    {
      id: 2,
      employeeName: 'Sneha Patel',
      expenseFor: 'Travel',
      date: '04/08/2025',
      amount: '2,850.00',
      bill: 'sample_bill.pdf',
      paymentStatus: 'UPI',
      approval: 'Approved',
    },
    {
      id: 3,
      employeeName: 'Amit Sharma',
      expenseFor: 'Event Expense',
      date: '03/08/2025',
      amount: '950.00',
      bill: 'sample_bill.pdf',
      paymentStatus: 'Cash',
      approval: 'Approved',
    },
    {
      id: 4,
      employeeName: 'Pooja Verma',
      expenseFor: 'Office Maintenance',
      date: '02/08/2025',
      amount: '1,600.00',
      bill: 'sample_bill.pdf',
      paymentStatus: 'Card',
      approval: 'Approved',
    },
    {
      id: 5,
      employeeName: 'Vikram Singh',
      expenseFor: 'Miscellaneous',
      date: '01/08/2025',
      amount: '3,200.00',
      bill: 'sample_bill.pdf',
      paymentStatus: 'Bank Transfer',
      approval: 'Approved',
    },
  ]);

  const dateInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to convert YYYY-MM-DD to DD/MM/YYYY for displaying in table
  const formatDateForTable = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  // Helper to convert DD/MM/YYYY to YYYY-MM-DD for editing in date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setEditingId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.employeeName || !formData.expenseFor || !formData.amount) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    const formattedAmount = parseFloat(formData.amount || 0).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

    if (editingId !== null) {
      // Update existing record
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                employeeName: formData.employeeName,
                expenseFor: formData.expenseFor,
                date: formatDateForTable(formData.expenseDate),
                amount: formattedAmount,
                paymentStatus: formData.paymentStatus,
                approval: formData.paymentApproval ? 'Approved' : 'Pending',
                bill: formData.fileName || item.bill,
              }
            : item
        )
      );
    } else {
      // Create new record
      const newExpense = {
        id: Date.now(),
        employeeName: formData.employeeName,
        expenseFor: formData.expenseFor,
        date: formatDateForTable(formData.expenseDate),
        amount: formattedAmount,
        bill: formData.fileName || 'document.pdf',
        paymentStatus: formData.paymentStatus,
        approval: formData.paymentApproval ? 'Approved' : 'Pending',
      };
      setExpenses([newExpense, ...expenses]);
    }

    handleReset();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      employeeName: item.employeeName,
      expenseDate: formatDateForInput(item.date),
      expenseFor: item.expenseFor,
      amount: item.amount.replace(/,/g, ''),
      description: '',
      paymentApproval: item.approval === 'Approved' ? 'Manager' : '',
      paymentStatus: item.paymentStatus,
      upiNumber: '',
      fileName: item.bill,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry?')) {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const openCalendar = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const filteredExpenses = expenses.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.expenseFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'expense-management-badge status-pending';
      case 'UPI':
        return 'expense-management-badge status-upi';
      case 'Cash':
        return 'expense-management-badge status-cash';
      case 'Card':
        return 'expense-management-badge status-card';
      case 'Bank Transfer':
        return 'expense-management-badge status-bank';
      default:
        return 'expense-management-badge';
    }
  };

  return (
    <div className="expense-management-container">
      {/* Header & Breadcrumbs */}
      <div className="expense-management-header">
        <h1 className="expense-management-title">Manage Expenses</h1>
        <div className="expense-management-breadcrumb">
          <span>Accounts & Expenses</span>
          <span className="separator">&gt;</span>
          <span>Expenses</span>
          <span className="separator">&gt;</span>
          <span className="active">Manage Expenses</span>
        </div>
      </div>

      {/* Add New Expense Form */}
      <div className="expense-management-card">
        <h2 className="expense-management-card-title">
          {editingId ? 'Edit Expense' : 'Add New Expense'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="expense-management-form-grid">
            {/* Employee Name */}
            <div className="expense-management-form-group">
              <label>
                Employee Name <span className="required">*</span>
              </label>
              <select
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Employee</option>
                <option value="Rakesh Kumar">Rakesh Kumar</option>
                <option value="Sneha Patel">Sneha Patel</option>
                <option value="Amit Sharma">Amit Sharma</option>
                <option value="Pooja Verma">Pooja Verma</option>
                <option value="Vikram Singh">Vikram Singh</option>
              </select>
            </div>

            {/* Expense Date */}
            <div className="expense-management-form-group">
              <label>
                Expense Date <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <input
                  ref={dateInputRef}
                  type="date"
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={handleInputChange}
                  required
                />
                <svg
                  className="icon clickable"
                  onClick={openCalendar}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>

            {/* Expense For */}
            <div className="expense-management-form-group">
              <label>
                Expense For <span className="required">*</span>
              </label>
              <input
                type="text"
                name="expenseFor"
                placeholder="e.g. Office Supplies, Travel"
                value={formData.expenseFor}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Bill Upload */}
            <div className="expense-management-form-group upload-section">
              <label>
                Bill Upload <span className="required">*</span>
              </label>
              <div className="expense-management-dropzone">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="dropzone-text-main">
                  {formData.fileName ? formData.fileName : 'Drag & drop file here'}
                </p>
                <p className="dropzone-text-sub">or</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <button
                  type="button"
                  className="btn-choose-file"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Choose File
                </button>
                <span className="dropzone-hint">
                  Supports: JPG, PNG, PDF (Max. 5MB)
                </span>
              </div>
            </div>

            {/* Amount & Description Stack */}
            <div className="expense-management-right-fields">
              <div className="expense-management-form-group">
                <label>
                  Amount (₹) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="expense-management-form-group description-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter expense description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Payment Approval */}
            <div className="expense-management-form-group">
              <label>
                Payment Approval <span className="required">*</span>
              </label>
              <select
                name="paymentApproval"
                value={formData.paymentApproval}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Approver</option>
                <option value="Manager">Manager</option>
                <option value="Finance Head">Finance Head</option>
              </select>
            </div>

            {/* Payment Status Radios & Details */}
            <div className="expense-management-form-group payment-status-group">
              <label>
                Payment Status <span className="required">*</span>
              </label>
              <div className="radio-group">
                {['Pending', 'Cash', 'UPI', 'Card', 'Bank Transfer'].map(
                  (status) => (
                    <label key={status} className="radio-label">
                      <input
                        type="radio"
                        name="paymentStatus"
                        value={status}
                        checked={formData.paymentStatus === status}
                        onChange={handleInputChange}
                      />
                      <span>{status}</span>
                    </label>
                  )
                )}
              </div>

              {formData.paymentStatus === 'UPI' && (
                <div className="upi-input-container">
                  <label>UPI Number</label>
                  <input
                    type="text"
                    name="upiNumber"
                    placeholder="Enter UPI Number"
                    value={formData.upiNumber}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="expense-management-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button type="submit" className="btn-save">
              {editingId ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>

      {/* Expense List Card */}
      <div className="expense-management-card">
        <div className="expense-management-list-header">
          <h2>Expense List</h2>
          <div className="list-controls">
            <div className="search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a0aec0"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search expense..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn-filter" type="button">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="expense-management-table-wrapper">
          <table className="expense-management-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Expense For</th>
                <th>Date</th>
                <th>Amount (₹)</th>
                <th>Bill</th>
                <th>Payment Status</th>
                <th>Approval</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.expenseFor}</td>
                    <td>{item.date}</td>
                    <td>{item.amount}</td>
                    <td>
                      <div className="pdf-icon" title={item.bill}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="#EF4444"
                        >
                          <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
                        </svg>
                      </div>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(item.paymentStatus)}>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`expense-management-badge ${
                          item.approval === 'Approved'
                            ? 'approval-approved'
                            : 'approval-pending'
                        }`}
                      >
                        {item.approval}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action edit"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                          type="button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6C5CE7"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn-action delete"
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                          type="button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="expense-management-pagination-container">
          <span className="pagination-info">
            Showing {filteredExpenses.length > 0 ? 1 : 0} to {filteredExpenses.length} of {expenses.length} entries
          </span>
          <div className="pagination">
            <button className="page-btn nav-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn nav-btn">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;