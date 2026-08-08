import React, { useState, useEffect } from 'react';
import './FuelManagement.css';

// SVG Icons for self-contained visual elements
const Icons = {
  FuelPump: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9l-3-3" />
      <path d="M3 22h12" />
      <rect x="6" y="6" width="6" height="4" rx="1" />
      <circle cx="11" cy="16" r="1" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Gauge: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14l3-3" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  ),
  Droplet: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  Rupee: () => (
    <span style={{ color: '#94A3B8', fontWeight: 'bold', fontSize: '15px' }}>₹</span>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C38FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Filter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Edit: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6C38FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
};

const FuelManagement = () => {
  // Initial fuel records with Employee Name field included
  const initialRecords = [
    { id: 1, employeeName: 'Rajesh Kumar', pumpName: 'Indian Oil - City Pump', date: '2025-08-07', invoiceNo: 'INV-1001', km: '12450', rate: '102.45', volume: '45.50', amount: '4662.48' },
    { id: 2, employeeName: 'Amit Verma', pumpName: 'HP Petrol Pump - Main Road', date: '2025-08-06', invoiceNo: 'INV-1000', km: '12230', rate: '101.20', volume: '36.75', amount: '3720.60' },
    { id: 3, employeeName: 'Priya Sharma', pumpName: 'Bharat Petroleum', date: '2025-08-05', invoiceNo: 'INV-0999', km: '11890', rate: '99.65', volume: '50.00', amount: '4982.50' },
    { id: 4, employeeName: 'Suresh Das', pumpName: 'Reliance Petrol Pump', date: '2025-08-04', invoiceNo: 'INV-0998', km: '11450', rate: '100.00', volume: '40.00', amount: '4000.00' },
    { id: 5, employeeName: 'Ramesh Patel', pumpName: 'Indian Oil - Highway', date: '2025-08-03', invoiceNo: 'INV-0997', km: '11120', rate: '101.50', volume: '42.00', amount: '4263.00' }
  ];

  // Component States
  const [records, setRecords] = useState(initialRecords);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    employeeName: '',
    pumpName: '',
    date: '2025-08-07',
    invoiceNo: '',
    km: '',
    rate: '',
    volume: '',
    amount: ''
  });

  // Calculate Amount automatically whenever Rate or Volume changes
  useEffect(() => {
    const r = parseFloat(formData.rate) || 0;
    const v = parseFloat(formData.volume) || 0;
    if (r > 0 && v > 0) {
      setFormData(prev => ({ ...prev, amount: (r * v).toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, amount: '' }));
    }
  }, [formData.rate, formData.volume]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Reset Form
  const handleReset = () => {
    setFormData({
      employeeName: '',
      pumpName: '',
      date: '2025-08-07',
      invoiceNo: '',
      km: '',
      rate: '',
      volume: '',
      amount: ''
    });
    setEditingId(null);
  };

  // Save or Update Entry
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.pumpName || !formData.date || !formData.invoiceNo || !formData.employeeName) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    if (editingId) {
      // Update record
      setRecords(records.map(rec => rec.id === editingId ? { ...formData, id: editingId } : rec));
      setEditingId(null);
    } else {
      // Add record
      const newEntry = {
        ...formData,
        id: Date.now()
      };
      setRecords([newEntry, ...records]);
    }

    handleReset();
  };

  // Edit Record
  const handleEdit = (record) => {
    setEditingId(record.id);
    setFormData(record);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Record
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this fuel record?')) {
      setRecords(records.filter(rec => rec.id !== id));
    }
  };

  // Filter Records by Search Query
  const filteredRecords = records.filter(rec =>
    rec.pumpName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to format numbers with Indian locale
  const formatNum = (val) => {
    if (!val) return '0';
    const num = parseFloat(val);
    return isNaN(num) ? val : num.toLocaleString('en-IN');
  };

  // Helper function to format Date (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  };

  return (
    <div className="fuel-management">
      {/* Page Header */}
      <div className="fuel-management-header">
        <div className="fuel-management-title-group">
          <div className="fuel-management-header-icon">
            <Icons.FuelPump />
          </div>
          <div>
            <h1 className="fuel-management-header-title">Fuel Entry</h1>
            <p className="fuel-management-header-subtitle">Manage fuel records for organization vehicles.</p>
          </div>
        </div>
        <div className="fuel-management-breadcrumbs">
          Accounts & Expenses &gt; Vehicle Controller &gt; <span>Fuel Entry</span>
        </div>
      </div>

      {/* Card 1: Form Section */}
      <div className="fuel-management-card">
        <div className="fuel-management-card-title">
          {editingId ? 'Edit Fuel Entry' : 'Add Fuel Entry'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fuel-management-form-grid">
            
            {/* Top Field: Employee Name */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Employee Name <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.User />
                </div>
                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Enter Employee Name"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Pump Name Dropdown */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Pump Name <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.FuelPump />
                </div>
                <select
                  className="fuel-management-input fuel-management-select"
                  name="pumpName"
                  value={formData.pumpName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Pump</option>
                  <option value="Indian Oil - City Pump">Indian Oil - City Pump</option>
                  <option value="HP Petrol Pump - Main Road">HP Petrol Pump - Main Road</option>
                  <option value="Bharat Petroleum">Bharat Petroleum</option>
                  <option value="Reliance Petrol Pump">Reliance Petrol Pump</option>
                  <option value="Indian Oil - Highway">Indian Oil - Highway</option>
                </select>
                <div className="fuel-management-select-arrow">
                  <Icons.ChevronDown />
                </div>
              </div>
            </div>

            {/* Date Picker */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Date <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.Calendar />
                </div>
                <input
                  type="date"
                  className="fuel-management-input"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Invoice No. */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Invoice No. <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.FileText />
                </div>
                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Enter Invoice No."
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Odometer KM */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                KM (Odometer) <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.Gauge />
                </div>
                <input
                  type="number"
                  className="fuel-management-input"
                  placeholder="Enter KM"
                  name="km"
                  value={formData.km}
                  onChange={handleInputChange}
                />
                <span className="fuel-management-input-suffix">km</span>
              </div>
            </div>

            {/* Rate per Litre */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Rate per Litre (₹) <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.Rupee />
                </div>
                <input
                  type="number"
                  step="0.01"
                  className="fuel-management-input"
                  placeholder="Enter rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                />
                <span className="fuel-management-input-suffix">/Ltr</span>
              </div>
            </div>

            {/* Volume in Litres */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Volume (Litre) <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.Droplet />
                </div>
                <input
                  type="number"
                  step="0.01"
                  className="fuel-management-input"
                  placeholder="Enter volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                />
                <span className="fuel-management-input-suffix">Ltr</span>
              </div>
            </div>

            {/* Auto-calculated Total Amount */}
            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Amount (₹) <span className="fuel-management-required">*</span>
              </label>
              <div className="fuel-management-input-wrapper">
                <div className="fuel-management-input-icon">
                  <Icons.Rupee />
                </div>
                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Enter amount"
                  name="amount"
                  value={formData.amount}
                  readOnly
                  style={{ backgroundColor: '#F8FAFC' }}
                />
              </div>
            </div>

            {/* Information Notice */}
            <div className="fuel-management-info-banner">
              <Icons.Info />
              <span>Amount will be calculated automatically (Rate × Volume)</span>
            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="fuel-management-form-actions">
            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-reset"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="submit"
              className="fuel-management-btn fuel-management-btn-save"
            >
              <Icons.Save />
              {editingId ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Card 2: Fuel Entry List Table */}
      <div className="fuel-management-card">
        <div className="fuel-management-list-top">
          <div className="fuel-management-card-title" style={{ margin: 0, paddingBottom: 0 }}>
            Fuel Entry List
          </div>

          <div className="fuel-management-list-actions">
            <div className="fuel-management-search-wrapper">
              <div className="fuel-management-input-icon" style={{ top: '11px' }}>
                <Icons.Search />
              </div>
              <input
                type="text"
                className="fuel-management-search-input"
                placeholder="Search fuel entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="fuel-management-btn fuel-management-btn-filter">
              <Icons.Filter />
              Filter
            </button>

            <button 
              className="fuel-management-btn fuel-management-btn-save"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Icons.Plus />
              Add Fuel Entry
            </button>
          </div>
        </div>

        {/* Records Table */}
        <div className="fuel-management-table-container">
          <table className="fuel-management-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Employee Name</th>
                <th>Pump Name</th>
                <th>Date</th>
                <th>Invoice No.</th>
                <th>KM</th>
                <th>Rate per Litre (₹)</th>
                <th>Volume (Litre)</th>
                <th>Amount (₹)</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.employeeName || 'N/A'}</td>
                    <td>{item.pumpName}</td>
                    <td>{formatDateDisplay(item.date)}</td>
                    <td>{item.invoiceNo}</td>
                    <td>{formatNum(item.km)}</td>
                    <td>{parseFloat(item.rate || 0).toFixed(2)}</td>
                    <td>{parseFloat(item.volume || 0).toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>{formatNum(item.amount)}</td>
                    <td>
                      <div className="fuel-management-table-actions">
                        <button
                          className="fuel-management-action-btn edit"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                        >
                          <Icons.Edit />
                        </button>
                        <button
                          className="fuel-management-action-btn delete"
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                    No fuel entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination & Counter */}
        <div className="fuel-management-footer">
          <div>
            Showing {filteredRecords.length > 0 ? 1 : 0} to {filteredRecords.length} of {records.length} entries
          </div>

          <div className="fuel-management-pagination">
            <button className="fuel-management-page-btn">&lt;</button>
            <button 
              className={`fuel-management-page-btn ${currentPage === 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button 
              className={`fuel-management-page-btn ${currentPage === 2 ? 'active' : ''}`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button 
              className={`fuel-management-page-btn ${currentPage === 3 ? 'active' : ''}`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <button 
              className={`fuel-management-page-btn ${currentPage === 4 ? 'active' : ''}`}
              onClick={() => setCurrentPage(4)}
            >
              4
            </button>
            <button className="fuel-management-page-btn">&gt;</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FuelManagement;