import React, { useState } from 'react';
import { 
  FiEdit2, FiTrash2, FiSearch, FiRefreshCcw, FiPlus, 
  FiGrid, FiArrowLeft, FiArrowRight, FiX, FiMoreVertical, 
  FiSettings, FiDownload 
} from 'react-icons/fi';
import './LeaveBalance.css';

const initialData = [
  { id: 1, checkbox: true, employee_name: 'John Deo', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 2, checkbox: false, employee_name: 'Sarah Smith', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 3, checkbox: true, employee_name: 'Edna Gilbert', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 4, checkbox: true, employee_name: 'Shelia Ost...', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 5, checkbox: true, employee_name: 'Barbara G...', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 6, checkbox: false, employee_name: 'Anjali Sharma', previous_balance: 12, current_balance: 18, total_balance: 30, used_leave: 10, accepted_leave: 8, rejected_leave: 1, expired_leave: 4, carry_over_balance: 8 },
  { id: 7, checkbox: false, employee_name: 'Marie Bro...', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 8, checkbox: true, employee_name: 'Kara Thom...', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 9, checkbox: true, employee_name: 'Joseph Nye', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 10, checkbox: true, employee_name: 'Ricardo W...', previous_balance: 10, current_balance: 15, total_balance: 25, used_leave: 15, accepted_leave: 10, rejected_leave: 2, expired_leave: 5, carry_over_balance: 5 },
  { id: 11, checkbox: false, employee_name: 'Vijay Kumar', previous_balance: 8, current_balance: 12, total_balance: 20, used_leave: 5, accepted_leave: 5, rejected_leave: 0, expired_leave: 2, carry_over_balance: 3 },
];

const columnsConfig = [
  { label: 'Employee Name', key: 'employee_name' },
  { label: 'Previous Balance', key: 'previous_balance' },
  { label: 'Current Balance', key: 'current_balance' },
  { label: 'Total Balance', key: 'total_balance' },
  { label: 'Used Leave', key: 'used_leave' },
  { label: 'Accepted Leave', key: 'accepted_leave' },
  { label: 'Rejected Leave', key: 'rejected_leave' },
  { label: 'Expired Leave', key: 'expired_leave' },
  { label: 'Carry Over Balance', key: 'carry_over_balance' },
];

const LeaveBalance = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnsVisible, setColumnsVisible] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columnsConfig.map(c => c.key));
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  
  // पैजिनेशन स्टेट्स
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formData, setFormData] = useState({
    employee_name: '', previous_balance: '', current_balance: '', total_balance: '',
    used_leave: '', accepted_leave: '', rejected_leave: '', expired_leave: '', carry_over_balance: ''
  });

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setFormData({ ...rowData });
    setIsFormPopupOpen(true);
  };

  const handleDeleteClick = (rowData) => {
    setSelectedRow(rowData);
    setIsDeletePopupOpen(true);
  };

  const handleAddClick = () => {
    setSelectedRow(null);
    setFormData({
      employee_name: '', previous_balance: '', current_balance: '', total_balance: '',
      used_leave: '', accepted_leave: '', rejected_leave: '', expired_leave: '', carry_over_balance: ''
    });
    setIsFormPopupOpen(true);
  };

  const toggleColumn = (key) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter(c => c !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  // खोज फ़िल्टर लॉजिक
  const filteredData = initialData.filter(row => 
    row.employee_name.toLowerCase().includes(globalFilter.toLowerCase())
  );

  // पैजिनेशन गणना (Calculation)
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  
  // वर्तमान पेज इंडेक्स को सीमा में रखना
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  
  const indexOfLastRecord = activePage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // पेज साइज बदलने पर वापस पहले पेज पर जाएँ
  };

  const handleDownload = () => {
    alert("Downloading CSV Data Registry...");
  };

  return (
    <div className="lb-main-container">
      {/* शीर्ष हेडर और ब्रेडक्रंब */}
      <div className="lb-header-row">
        <h1 className="lb-page-title">Leave Balance</h1>
        <div className="lb-breadcrumb">
          <span>🏠</span> <FiArrowRight className="lb-bc-chevron" /> <span>Leaves</span> <FiArrowRight className="lb-bc-chevron" /> <span className="lb-active-bc">Leave Balance</span>
        </div>
      </div>

      {/* खोज और नियंत्रण कार्ड */}
      <div className="lb-filter-card">
        <div className="lb-search-block">
          <span className="lb-block-title">Leave Balance</span>
          <div className="lb-search-input-box">
            <input type="text" placeholder="Search..." value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setCurrentPage(1); }} />
            <FiSearch className="lb-search-icon" />
          </div>
        </div>

        <div className="lb-toolbar-right">
          <FiMoreVertical className="lb-vertical-dots" />
          <div className="lb-dropdown-anchor">
            <button onClick={() => setColumnsVisible(!columnsVisible)} className="lb-btn-tool lb-icon-only-btn" title="Show/Hide Column">
              <FiGrid />
            </button>
            {columnsVisible && (
              <div className="lb-column-menu-popup">
                <div className="lb-dropdown-title-row">
                  <h4>Show/Hide Column</h4>
                  <FiRefreshCcw className="lb-dropdown-reset" onClick={() => setVisibleColumns(columnsConfig.map(c => c.key))} />
                </div>
                <div className="lb-dropdown-checkbox-list">
                  {columnsConfig.map(col => (
                    <label key={col.key} className="lb-menu-checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={visibleColumns.includes(col.key)} 
                        onChange={() => toggleColumn(col.key)} 
                      /> 
                      {col.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button className="lb-btn-tool lb-icon-only-btn" onClick={() => { setGlobalFilter(''); setCurrentPage(1); }} title="Reset"><FiRefreshCcw /></button>
          <button className="lb-btn-tool lb-icon-only-btn" onClick={handleDownload} title="Download Report"><FiDownload /></button>
          <button onClick={handleAddClick} className="lb-add-symbol-btn" title="Add Leave Balance">
            <FiPlus />
          </button>
        </div>
      </div>

      {/* डेटा तालिका */}
      <div className="lb-responsive-table-holder">
        <table className="lb-data-grid-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}><input type="checkbox" className="lb-checkbox" /></th>
              {columnsConfig.map(col => visibleColumns.includes(col.key) && (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map(row => (
                <tr key={row.id}>
                  <td><input type="checkbox" defaultChecked={row.checkbox} className="lb-checkbox" /></td>
                  {columnsConfig.map(col => visibleColumns.includes(col.key) && (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                  <td>
                    <div className="lb-action-container">
                      <button onClick={() => handleEdit(row)} className="lb-edit-icon-btn"><FiEdit2 /></button>
                      <button onClick={() => handleDeleteClick(row)} className="lb-delete-icon-btn"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumns.length + 2} style={{ textAlign: 'center', padding: '24px' }}>No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* निचला पैजिनेशन बार */}
      <div className="lb-pagination-footer">
        <div className="lb-items-selector-block">
          <span>Items per page:</span>
          <select value={pageSize} onChange={handlePageSizeChange}>
            {[5, 10, 20, 30].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
          <span className="lb-record-range">
            {totalRecords > 0 ? indexOfFirstRecord + 1 : 0} - {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords}
          </span>
        </div>
        <div className="lb-pagination-nav-arrows">
          <button 
            className="lb-nav-btn" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={activePage === 1}
          >
            <FiArrowLeft />
          </button>
          <span className="lb-page-num-display">Page {activePage} of {totalPages}</span>
          <button 
            className="lb-nav-btn" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={activePage === totalPages}
          >
            <FiArrowRight />
          </button>
        </div>
      </div>

      {/* 1. फॉर्म पॉपअप (जोड़ें/संपादित करें) */}
      <div className={`lb-modal-overlay ${isFormPopupOpen ? 'lb-show' : ''}`}>
        <div className="lb-modal-card">
          <div className="lb-modal-header lb-bg-blue">
            <h3 className="lb-modal-title">
              <span className="lb-modal-avatar">👤</span>
              {selectedRow ? "Edit Leave Balance" : "New Leave Balance"}
            </h3>
            <button type="button" onClick={() => setIsFormPopupOpen(false)} className="lb-modal-close-icon"><FiX /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsFormPopupOpen(false); }}>
            <div className="lb-modal-scrollable-body">
              <div className="lb-form-grid">
                <div className="lb-field-group">
                  <label>Name*</label>
                  <input type="text" value={formData.employee_name} onChange={e => setFormData({...formData, employee_name: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Previous Balance*</label>
                  <input type="number" value={formData.previous_balance} onChange={e => setFormData({...formData, previous_balance: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Current Balance*</label>
                  <input type="number" value={formData.current_balance} onChange={e => setFormData({...formData, current_balance: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Total Balance*</label>
                  <input type="number" value={formData.total_balance} onChange={e => setFormData({...formData, total_balance: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Used Balance*</label>
                  <input type="number" value={formData.used_leave} onChange={e => setFormData({...formData, used_leave: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Accepted*</label>
                  <input type="number" value={formData.accepted_leave} onChange={e => setFormData({...formData, accepted_leave: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Rejected*</label>
                  <input type="number" value={formData.rejected_leave} onChange={e => setFormData({...formData, rejected_leave: e.target.value})} required />
                </div>
                <div className="lb-field-group">
                  <label>Expired*</label>
                  <input type="number" value={formData.expired_leave} onChange={e => setFormData({...formData, expired_leave: e.target.value})} required />
                </div>
                <div className="lb-field-group lb-full-row-mobile">
                  <label>Carry Over*</label>
                  <input type="number" value={formData.carry_over_balance} onChange={e => setFormData({...formData, carry_over_balance: e.target.value})} required />
                </div>
              </div>
            </div>
            <div className="lb-modal-footer-actions">
              <button type="submit" className="lb-btn-save-submit">Save</button>
              <button type="button" onClick={() => setIsFormPopupOpen(false)} className="lb-btn-cancel-submit">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. डिलीट कन्फर्मेशन पॉपअप */}
      <div className={`lb-modal-overlay ${isDeletePopupOpen ? 'lb-show' : ''}`}>
        <div className="lb-modal-card lb-delete-box-size">
          <div className="lb-modal-header lb-bg-grey">
            <h3 className="lb-modal-title lb-text-dark"><FiSettings /> Are you sure?</h3>
            <button type="button" onClick={() => setIsDeletePopupOpen(false)} className="lb-modal-close-icon lb-text-dark"><FiX /></button>
          </div>
          {selectedRow && (
            <div className="lb-delete-prompt-body">
              <p>Name: <strong>{selectedRow.employee_name}</strong></p>
              <p>Previous Leave: <strong>{selectedRow.previous_balance}</strong></p>
              <p>Current Leave: <strong>{selectedRow.current_balance}</strong></p>
              <div className="lb-delete-action-row">
                <button type="button" onClick={() => setIsDeletePopupOpen(false)} className="lb-btn-delete-confirm">Delete</button>
                <button type="button" onClick={() => setIsDeletePopupOpen(false)} className="lb-btn-delete-cancel">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default LeaveBalance;