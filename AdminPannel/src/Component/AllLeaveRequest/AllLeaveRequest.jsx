import React, { useState } from 'react';
import { 
  FiEdit2, FiTrash2, FiSearch, FiRefreshCcw, FiPlus, 
  FiGrid, FiArrowLeft, FiArrowRight, FiX, FiMoreVertical, 
  FiSettings, FiDownload 
} from 'react-icons/fi';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import './AllLeaveRequest.css';

const initialData = [
  { id: 1, checkbox: true, employee_name: 'John Deo', employee_id: 'E123', department: 'Human Resource', leave_type: 'Medical Leave', leave_from: '2026-04-10', leave_to: '2026-02-25', number_of_days: 5, duration_type: 'Full-day', status: 'Approved', reason: 'God creature is...', requested_on: '2026-01-15', approved_by: 'Jane Smith', approval_date: '2026-01-20' },
  { id: 2, checkbox: false, employee_name: 'Sarah Smith', employee_id: 'E124', department: 'Finance', leave_type: 'Maternity Leave', leave_from: '2026-04-10', leave_to: '2026-04-14', number_of_days: 4, duration_type: 'Half-day', status: 'Pending', reason: 'Celeste Slater...', requested_on: '2026-01-16', approved_by: '', approval_date: '' },
  { id: 3, checkbox: true, employee_name: 'Edna Gilbert', employee_id: 'E125', department: 'Marketing', leave_type: 'Maternity Leave', leave_from: '2026-04-10', leave_to: '2026-11-08', number_of_days: 1, duration_type: 'Half-day', status: 'Rejected', reason: 'Hiroko Potter...', requested_on: '2026-01-17', approved_by: '', approval_date: '' },
  { id: 4, checkbox: true, employee_name: 'Shelia Ost...', employee_id: 'E126', department: 'IT', leave_type: 'Medical Leave', leave_from: '2026-04-10', leave_to: '2026-05-20', number_of_days: 5, duration_type: 'Full-day', status: 'Approved', reason: '881 Beechwo...', requested_on: '2026-01-18', approved_by: 'Tom Johnson', approval_date: '2026-01-22' },
  { id: 5, checkbox: true, employee_name: 'Barbara G...', employee_id: 'E127', department: 'HR', leave_type: 'Casual Leave', leave_from: '2026-04-10', leave_to: '2026-04-18', number_of_days: 3, duration_type: 'Full-day', status: 'Approved', reason: '107 Ashley A...', requested_on: '2026-01-19', approved_by: 'Lisa Grey', approval_date: '2026-01-23' },
];

const columnsConfig = [
  { label: 'Employee Name', key: 'employee_name' },
  { label: 'Employee ID', key: 'employee_id' },
  { label: 'Department', key: 'department' },
  { label: 'Leave Type', key: 'leave_type' },
  { label: 'Leave From', key: 'leave_from' },
  { label: 'Leave To', key: 'leave_to' },
  { label: 'Number of Days', key: 'number_of_days' },
  { label: 'Duration Type', key: 'duration_type' },
  { label: 'Status', key: 'status' },
  { label: 'Reason', key: 'reason' },
  { label: 'Requested On', key: 'requested_on' },
  { label: 'Approved By', key: 'approved_by' },
  { label: 'Approval Date', key: 'approval_date' }
];

const AllLeaveRequest = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnsVisible, setColumnsVisible] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columnsConfig.map(c => c.key));
  const [isFormPopupOpen, setIsFormPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    employee_name: '', leave_type: 'Sick Leave', leave_from: '2026-07-09', leave_to: '2026-07-09',
    number_of_days: '', status: 'Approved', employee_id: '', department: '',
    duration_type: 'Full-day', requested_on: '2026-07-09', reason: '', note: ''
  });

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setFormData({ ...rowData, note: rowData.note || '' });
    setIsFormPopupOpen(true);
  };

  const handleDeleteClick = (rowData) => {
    setSelectedRow(rowData);
    setIsDeletePopupOpen(true);
  };

  const handleAddClick = () => {
    setSelectedRow(null);
    setFormData({
      employee_name: '', leave_type: 'Sick Leave', leave_from: '2026-07-09', leave_to: '2026-07-09',
      number_of_days: '', status: 'Approved', employee_id: '', department: '',
      duration_type: 'Full-day', requested_on: '2026-07-09', reason: '', note: ''
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

  const filteredData = initialData.filter(row => 
    row.employee_name.toLowerCase().includes(globalFilter.toLowerCase()) ||
    row.employee_id.toLowerCase().includes(globalFilter.toLowerCase())
  );

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="alr-main-container">
      {/* शीर्ष ब्रेडक्रंब पंक्ति */}
      <div className="alr-header-row">
        <h1 className="alr-page-title">Leave Requests</h1>
        <div className="alr-breadcrumb">
          <span>🏠</span> <FiArrowRight className="alr-bc-chevron" /> <span>Leaves</span> <FiArrowRight className="alr-bc-chevron" /> <span className="alr-active-bc">Leave Requests</span>
        </div>
      </div>

      {/* फ़िल्टर और टूलबार नियंत्रण */}
      <div className="alr-filter-card">
        <div className="alr-search-block">
          <span className="alr-block-title">Leave Requests</span>
          <div className="alr-search-input-box">
            <input type="text" placeholder="Search..." value={globalFilter} onChange={e => { setGlobalFilter(e.target.value); setCurrentPage(1); }} />
            <FiSearch className="alr-search-icon" />
          </div>
        </div>

        <div className="alr-toolbar-right">
          <FiMoreVertical className="alr-vertical-dots" />
          <div className="alr-dropdown-anchor">
            <button onClick={() => setColumnsVisible(!columnsVisible)} className="alr-icon-only-btn" title="Show/Hide Column">
              <FiGrid />
            </button>
            {columnsVisible && (
              <div className="alr-column-menu-popup">
                <div className="alr-dropdown-title-row">
                  <h4>Show/Hide Column</h4>
                  <FiRefreshCcw className="alr-dropdown-reset" onClick={() => setVisibleColumns(columnsConfig.map(c => c.key))} />
                </div>
                <div className="alr-dropdown-checkbox-list">
                  {columnsConfig.map(col => (
                    <label key={col.key} className="alr-menu-checkbox-label">
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
          <button className="alr-icon-only-btn" onClick={() => setGlobalFilter('')} title="Reset"><FiRefreshCcw /></button>
          <button className="alr-icon-only-btn" title="Download Report"><FiDownload /></button>
          <button onClick={handleAddClick} className="alr-add-symbol-btn" title="Add Leave Request">
            <FiPlus />
          </button>
        </div>
      </div>

      {/* उत्तरदायी डेटा तालिका */}
      <div className="alr-responsive-table-holder">
        <table className="alr-data-grid-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}><input type="checkbox" className="alr-checkbox" /></th>
              {columnsConfig.map(col => visibleColumns.includes(col.key) && (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map(row => (
              <tr key={row.id}>
                <td><input type="checkbox" defaultChecked={row.checkbox} className="alr-checkbox" /></td>
                {columnsConfig.map(col => visibleColumns.includes(col.key) && (
                  <td key={col.key}>
                    {col.key === 'status' ? (
                      <span className={`alr-status-badge ${row.status.toLowerCase()}`}>{row.status}</span>
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                <td>
                  <div className="alr-action-container">
                    <button onClick={() => handleEdit(row)} className="alr-edit-icon-btn"><FiEdit2 /></button>
                    <button onClick={() => handleDeleteClick(row)} className="alr-delete-icon-btn"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* पैजिनेशन */}
      <div className="alr-pagination-footer">
        <div className="alr-items-selector-block">
          <span>Items per page:</span>
          <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            {[5, 10, 20].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
          <span className="alr-record-range">
            {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords}
          </span>
        </div>
        <div className="alr-pagination-nav-arrows">
          <button className="alr-nav-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}><FiArrowLeft /></button>
          <button className="alr-nav-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}><FiArrowRight /></button>
        </div>
      </div>

      {/* स्लाइड करने योग्य फॉर्म पॉपअप (Add/Edit) */}
      <div className={`alr-modal-overlay ${isFormPopupOpen ? 'alr-show' : ''}`}>
        <div className="alr-modal-card">
          <div className="alr-modal-header alr-bg-blue">
            <h3 className="alr-modal-title">
              <span className="alr-modal-avatar">👤</span>
              {selectedRow ? "Edit Leave Request" : "New Leave Request"}
            </h3>
            <button type="button" onClick={() => setIsFormPopupOpen(false)} className="alr-modal-close-icon"><FiX /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsFormPopupOpen(false); }}>
            <div className="alr-modal-scrollable-body">
              <div className="alr-form-grid">
                <div className="alr-field-group">
                  <label>Name*</label>
                  <input type="text" value={formData.employee_name} onChange={e => setFormData({...formData, employee_name: e.target.value})} required />
                </div>
                <div className="alr-field-group">
                  <label>Leave Type*</label>
                  <select value={formData.leave_type} onChange={e => setFormData({...formData, leave_type: e.target.value})} required>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Medical Leave">Medical Leave</option>
                  </select>
                </div>
                <div className="alr-field-group">
                  <label>Leave From*</label>
                  <Flatpickr value={formData.leave_from} onChange={([date]) => setFormData({...formData, leave_from: date.toISOString().split('T')[0]})} className="date-picker-input" />
                  <span className="input-icon-right">📅</span>
                </div>
                <div className="alr-field-group">
                  <label>Leave To*</label>
                  <Flatpickr value={formData.leave_to} onChange={([date]) => setFormData({...formData, leave_to: date.toISOString().split('T')[0]})} className="date-picker-input" />
                  <span className="input-icon-right">📅</span>
                </div>
                <div className="alr-field-group">
                  <label>No Of Days*</label>
                  <input type="number" value={formData.number_of_days} onChange={e => setFormData({...formData, number_of_days: e.target.value})} required />
                </div>
                <div className="alr-field-group">
                  <label>Status*</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} required>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="alr-field-group">
                  <label>Employee ID*</label>
                  <input type="text" value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} required />
                </div>
                <div className="alr-field-group">
                  <label>Department*</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required />
                </div>
                <div className="alr-field-group">
                  <label>Duration Type*</label>
                  <input type="text" value={formData.duration_type} onChange={e => setFormData({...formData, duration_type: e.target.value})} required />
                </div>
                <div className="alr-field-group">
                  <label>Requested On*</label>
                  <Flatpickr value={formData.requested_on} onChange={([date]) => setFormData({...formData, requested_on: date.toISOString().split('T')[0]})} className="date-picker-input" />
                  <span className="input-icon-right">📅</span>
                </div>
              </div>
              <div className="alr-full-width-textarea">
                <label>Reason</label>
                <textarea rows="3" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Reason"></textarea>
                <span className="textarea-resize-lines">///</span>
              </div>
              <div className="alr-full-width-textarea">
                <label>Note</label>
                <textarea rows="3" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="Note"></textarea>
                <span className="textarea-resize-lines">///</span>
              </div>
            </div>
            <div className="alr-modal-footer-actions">
              <button type="submit" className="alr-btn-save-submit">Save</button>
              <button type="button" onClick={() => setIsFormPopupOpen(false)} className="alr-btn-cancel-submit">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* डिलीट कन्फर्मेशन पॉपअप (6th Image) */}
      <div className={`alr-modal-overlay ${isDeletePopupOpen ? 'alr-show' : ''}`}>
        <div className="alr-modal-card alr-delete-box-size">
          <div className="alr-modal-header alr-bg-grey">
            <h3 className="alr-modal-title alr-text-dark"><FiSettings /> Are you sure?</h3>
            <button type="button" onClick={() => setIsDeletePopupOpen(false)} className="alr-modal-close-icon alr-text-dark"><FiX /></button>
          </div>
          {selectedRow && (
            <div className="alr-delete-prompt-body">
              <p>Name: <strong>{selectedRow.employee_name}</strong></p>
              <p>Leave Type: <strong>{selectedRow.leave_type}</strong></p>
              <p>From: <strong>{selectedRow.leave_from}</strong></p>
              <div className="alr-delete-action-row">
                <button type="button" onClick={() => setIsDeletePopupOpen(false)} className="alr-btn-delete-confirm">Delete</button>
                <button type="button" onClick={() => setIsDeletePopupOpen(false)} className="alr-btn-delete-cancel">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllLeaveRequest;