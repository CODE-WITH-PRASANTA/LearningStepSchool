import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  RotateCw, 
  Download, 
  Edit2, 
  Trash2, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Home
} from 'lucide-react';
import './LeaveTypes.css';

const LeaveTypes = () => {
  // प्रारंभिक डेटा स्टेट (कुल 13 आइटम्स ताकि पेजिनेशन टेस्ट हो सके)
  const [data, setData] = useState([
    { id: 1, name: 'Work From Home Leave', type: 'Paid', unit: 'Days', status: 'Inactive', duration: 5, createdBy: 'HR Department', notification: '48 hours prior.' },
    { id: 2, name: 'Casual Leave', type: 'Unpaid', unit: 'Hours', status: 'Active', duration: 8, createdBy: 'HR Department', notification: '24 hours prior.' },
    { id: 3, name: 'Emergency Leave', type: 'Unpaid', unit: 'Days', status: 'Active', duration: 3, createdBy: 'HR Department', notification: 'Immediate.' },
    { id: 4, name: 'Family Leave', type: 'Unpaid', unit: 'Hours', status: 'Inactive', duration: 12, createdBy: 'HR Department', notification: '48 hours prior.' },
    { id: 5, name: 'Sick Leave', type: 'Unpaid', unit: 'Days', status: 'Active', duration: 10, createdBy: 'HR Department', notification: '48 hours prior.' },
    { id: 6, name: 'Casual Leave', type: 'Unpaid', unit: 'Days', status: 'Active', duration: 8, createdBy: 'HR Department', notification: '24 hours prior.' },
    { id: 7, name: 'Maternity Leave', type: 'Paid', unit: 'Days', status: 'Inactive', duration: 90, createdBy: 'HR Department', notification: '1 month prior.' },
    { id: 8, name: 'Sick Leave', type: 'Unpaid', unit: 'Days', status: 'Active', duration: 10, createdBy: 'HR Department', notification: '48 hours prior.' },
    { id: 9, name: 'Sick Leave', type: 'Unpaid', unit: 'Days', status: 'Active', duration: 10, createdBy: 'HR Department', notification: '48 hours prior.' },
    { id: 10, name: 'Casual Leave', type: 'Unpaid', unit: 'Days', status: 'Active', duration: 8, createdBy: 'HR Department', notification: '24 hours prior.' },
    { id: 11, name: 'Privilege Leave', type: 'Paid', unit: 'Days', status: 'Active', duration: 15, createdBy: 'HR Department', notification: '1 week prior.' },
    { id: 12, name: 'Compensatory Off', type: 'Paid', unit: 'Days', status: 'Active', duration: 2, createdBy: 'HR Department', notification: '24 hours prior.' },
    { id: 13, name: 'Bereavement Leave', type: 'Paid', unit: 'Days', status: 'Active', duration: 5, createdBy: 'HR Department', notification: 'Immediate.' },
  ]);

  // UI और सर्च स्टेट्स
  const [searchQuery, setSearchQuery] = useState('');
  const [showHideDropdown, setShowHideDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true, id: false, leaveName: true, leaveType: true, leaveUnit: true,
    status: true, duration: true, createdBy: true, notification: true, actions: true
  });

  // --- पेजिनेशन स्टेट्स (Pagination States) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // डिफ़ॉल्ट रूप से 10 प्रोफाइल्स

  // पॉपअप मॉडेल्स स्टेट्स
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add');

  // फॉर्म डेटा
  const [formData, setFormData] = useState({
    name: '', type: '', unit: '', status: 'Active', note: '', duration: 0,
    createdBy: 'HR Department', carryOver: 'Not allowed', notification: '24 hours prior', maxLeaves: 0, annualLimit: 0
  });
  const [formError, setFormError] = useState(false);

  // सर्च फ़िल्टर लगाना
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- पेजिनेशन का मुख्य लॉजिक ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // वर्तमान पेज के लिए डेटा इंडेक्स निकालना
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // पेज बदलने के हैंडलर्स
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // जब भी लिमिट बदलें, वापस पहले पेज पर जाएँ
  };

  const toggleColumn = (col) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const openAddEditModal = (type, record = null) => {
    setModalType(type);
    setFormError(false);
    if (type === 'edit' && record) {
      setCurrentRecord(record);
      setFormData({
        name: record.name, type: record.type, unit: record.unit, status: record.status,
        note: '', duration: record.duration, createdBy: record.createdBy,
        carryOver: 'Not allowed', notification: record.notification, maxLeaves: 0, annualLimit: 0
      });
    } else {
      setFormData({
        name: '', type: '', unit: '', status: 'Active', note: '', duration: 0,
        createdBy: 'HR Department', carryOver: 'Not allowed', notification: '24 hours prior', maxLeaves: 0, annualLimit: 0
      });
    }
    setIsAddEditOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.unit) {
      setFormError(true);
      return;
    }
    if (modalType === 'add') {
      setData([{ id: data.length + 1, ...formData }, ...data]);
    } else {
      setData(data.map(item => item.id === currentRecord.id ? { ...item, ...formData } : item));
    }
    setIsAddEditOpen(false);
  };

  const openDeleteModal = (record) => {
    setCurrentRecord(record);
    setIsDeleteOpen(true);
  };

  const handleDelete = () => {
    setData(data.filter(item => item.id !== currentRecord.id));
    setIsDeleteOpen(false);
  };

  const handleDownload = () => {
    const headers = ['Leave Name,Leave Type,Leave Unit,Status,Duration (Days)\n'];
    const rows = data.map(item => `"${item.name}","${item.type}","${item.unit}","${item.status}",${item.duration}`);
    const blob = new Blob([headers + rows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Leave_Types.csv');
    a.click();
  };

  return (
    <div className="page-container">
      
      {/* हेडर ब्रेडक्रंब */}
      <div className="header-section">
        <h1 className="main-title">Leave Types</h1>
        <div className="breadcrumb">
          <Home className="icon-sm" />
          <span>&gt;</span><span>Leaves</span><span>&gt;</span>
          <span className="breadcrumb-active">Leave Types</span>
        </div>
      </div>

      {/* मुख्य कंटेनर कार्ड */}
      <div className="table-card">
        
        {/* टूलबार */}
        <div className="toolbar-section">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="search-input"
            />
          </div>

          <div className="action-buttons-group">
            <div className="dropdown-relative">
              <button onClick={() => setShowHideDropdown(!showHideDropdown)} className="btn-icon-outline" title="Columns">
                <SlidersHorizontal className="icon-md" />
              </button>

              {showHideDropdown && (
                <div className="column-dropdown-menu">
                  <div className="dropdown-title">Show/Hide Column</div>
                  {Object.keys(visibleColumns).map((col) => (
                    <label key={col} className="dropdown-item">
                      <input 
                        type="checkbox" 
                        checked={visibleColumns[col]} 
                        onChange={() => toggleColumn(col)}
                        className="checkbox-custom"
                      />
                      {col.replace(/([A-Z])/g, ' $1')}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => openAddEditModal('add')} className="btn-icon-success" title="Add">
              <Plus className="icon-md" />
            </button>
            <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="btn-icon-outline" title="Reset">
              <RotateCw className="icon-md" />
            </button>
            <button onClick={handleDownload} className="btn-icon-primary" title="Download">
              <Download className="icon-md" />
            </button>
          </div>
        </div>

        {/* ड्यूल-फंक्शन ग्रिड */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                {visibleColumns.checkbox &&<th><input type="checkbox" className="checkbox-custom" /></th>}
                {visibleColumns.id && <th>ID</th>}
                {visibleColumns.leaveName && <th>Leave Name</th>}
                {visibleColumns.leaveType && <th>Leave Type</th>}
                {visibleColumns.leaveUnit && <th>Leave Unit</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.duration && <th>Duration (Days)</th>}
                {visibleColumns.createdBy && <th>Created By</th>}
                {visibleColumns.notification && <th>Notification Period</th>}
                {visibleColumns.actions && <th className="text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((row) => (
                  <tr key={row.id}>
                    {visibleColumns.checkbox && <td><input type="checkbox" className="checkbox-custom" /></td>}
                    {visibleColumns.id && <td className="text-light">{row.id}</td>}
                    {visibleColumns.leaveName && <td className="text-dark-bold">{row.name}</td>}
                    {visibleColumns.leaveType && <td>{row.type}</td>}
                    {visibleColumns.leaveUnit && <td>{row.unit}</td>}
                    {visibleColumns.status && (
                      <td>
                        <span className={`status-badge ${row.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                          {row.status}
                        </span>
                      </td>
                    )}
                    {visibleColumns.duration && <td>{row.duration}</td>}
                    {visibleColumns.createdBy && <td className="text-muted">{row.createdBy}</td>}
                    {visibleColumns.notification && <td className="text-muted">{row.notification}</td>}
                    {visibleColumns.actions && (
                      <td className="text-right whitespace-nowrap">
                        <div className="row-actions">
                          <button onClick={() => openAddEditModal('edit', row)} className="action-btn-edit"><Edit2 className="icon-sm" /></button>
                          <button onClick={() => openDeleteModal(row)} className="action-btn-delete"><Trash2 className="icon-sm" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan="10" className="no-data">No matching records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* वर्किंग पेजिनेशन फ़ुटर (Pagination Footer) */}
        <div className="pagination-footer">
          <div className="per-page-selector">
            <span>Items per page:</span>
            <div className="select-wrapper">
              <select 
                className="custom-select" 
                value={itemsPerPage} 
                onChange={handleItemsPerPageChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="select-arrow" />
            </div>
          </div>
          <div className="pagination-info">
            <span>
              {totalItems === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
            </span>
            <div className="pagination-nav">
              <button 
                className="nav-btn" 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                title="Previous Page"
              >
                <ChevronLeft className="icon-sm" />
              </button>
              <button 
                className="nav-btn" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages || totalPages === 0}
                title="Next Page"
              >
                <ChevronRight className="icon-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: ADD / EDIT POPUP --- */}
      {isAddEditOpen && (
        <div className="modal-overlay">
          <div className="modal-container size-lg">
            <div className="modal-header bg-purple">
              <h2>{modalType === 'add' ? 'New Leave Type' : 'Edit Leave Type'}</h2>
              <button onClick={() => setIsAddEditOpen(false)} className="modal-close-btn"><X className="icon-md" /></button>
            </div>

            <div className="modal-body grid-2-col">
              <div className="form-group">
                <label>Leave Name*</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`form-control ${formError && !formData.name ? 'error-border' : ''}`} placeholder="e.g. Casual Leave" />
              </div>
              <div className="form-group">
                <label>Leave Type*</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className={`form-control ${formError && !formData.type ? 'error-border' : ''}`}>
                  <option value="">Select Leave Type</option><option value="Paid">Paid</option><option value="Unpaid">Unpaid</option>
                </select>
                {formError && !formData.type && <p className="error-text">Please enter a valid type</p>}
              </div>
              <div className="form-group">
                <label>Leave Unit*</label>
                <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="form-control">
                  <option value="">Select Unit</option><option value="Days">Days</option><option value="Hours">Hours</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="form-control">
                  <option value="Active">Active</option><option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Note</label>
                <textarea value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="form-control textarea-custom"></textarea>
              </div>
              <div className="form-group"><label>Duration*</label><input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})} className="form-control" /></div>
              <div className="form-group"><label>Created By*</label><input type="text" value={formData.createdBy} disabled className="form-control disabled-field" /></div>
              <div className="form-group"><label>Carry Over</label><input type="text" value={formData.carryOver} disabled className="form-control disabled-field" /></div>
              <div className="form-group"><label>Notification Period</label><input type="text" value={formData.notification} onChange={(e) => setFormData({...formData, notification: e.target.value})} className="form-control" /></div>
              <div className="form-group"><label>Max Leaves*</label><input type="number" value={formData.maxLeaves} disabled className="form-control disabled-field" /></div>
              <div className="form-group"><label>Annual Limit*</label><input type="number" value={formData.annualLimit} disabled className="form-control disabled-field" /></div>
            </div>

            <div className="modal-footer">
              <button onClick={handleSave} className="btn-submit bg-green">Save</button>
              <button onClick={() => setIsAddEditOpen(false)} className="btn-submit bg-red">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: REMOVE POPUP --- */}
      {isDeleteOpen && currentRecord && (
        <div className="modal-overlay">
          <div className="modal-container size-sm text-center-modal">
            <h2 className="delete-title">Are you sure?</h2>
            <div className="delete-details">
              <p><span>Leave Name:</span> {currentRecord.name}</p>
              <p><span>Leave Type:</span> {currentRecord.type}</p>
              <p><span>Leave Unit:</span> {currentRecord.unit}</p>
            </div>
            <div className="delete-actions">
              <button onClick={handleDelete} className="btn-action bg-danger">Delete</button>
              <button onClick={() => setIsDeleteOpen(false)} className="btn-action bg-sky">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveTypes;