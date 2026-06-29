import React, { useState, useMemo } from 'react';
import './LeavesRequstes.css';

const INITIAL_LEAVE_DATA = [
  { id: 1, applyDate: '02/22/2019', fromDate: '02/22/2019', toDate: '02/26/2019', halfDay: 'Yes', type: 'Casual Leave', status: 'Approved', reason: 'Lorem Ipsum is si...' },
  { id: 2, applyDate: '02/17/2019', fromDate: '02/22/2019', toDate: '02/26/2019', halfDay: 'Yes', type: 'Sick Leave', status: 'Rejected', reason: 'Lorem Ipsum is si...' },
  { id: 3, applyDate: '02/17/2019', fromDate: '02/12/2019', toDate: '02/26/2019', halfDay: 'No', type: 'Sick Leave', status: 'Rejected', reason: 'Lorem Ipsum is si...' },
  { id: 4, applyDate: '05/11/2019', fromDate: '03/17/2019', toDate: '03/26/2019', halfDay: 'No', type: 'Casual Leave', status: 'Pending', reason: 'Lorem Ipsum is sim..' },
  { id: 5, applyDate: '07/15/2019', fromDate: '02/22/2019', toDate: '02/26/2019', halfDay: 'No', type: 'Casual Leave', status: 'Approved', reason: 'Lorem Ipsum is si...' },
  { id: 6, applyDate: '02/17/2019', fromDate: '04/22/2019', toDate: '02/26/2019', halfDay: 'Yes', type: 'Privilege Leave', status: 'Pending', reason: 'Lorem Ipsum is si...' },
  { id: 7, applyDate: '02/20/2019', fromDate: '02/22/2019', toDate: '02/26/2019', halfDay: 'No', type: 'Casual Leave', status: 'Rejected', reason: 'Lorem Ipsum is si...' },
  { id: 8, applyDate: '03/24/2019', fromDate: '02/22/2019', toDate: '02/26/2019', halfDay: 'Yes', type: 'Marriage Leave', status: 'Approved', reason: 'Lorem Ipsum is si...' },
  { id: 9, applyDate: '02/13/2019', fromDate: '03/17/2019', toDate: '02/26/2019', halfDay: 'No', type: 'Maternity Leave', status: 'Approved', reason: 'Lorem Ipsum is si...' }
];

const LeavesRequstes = () => {
  // Master Core States
  const [leaves, setLeaves] = useState(INITIAL_LEAVE_DATA);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Dropdown & Modal UI Toggles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [activeFormDropdown, setActiveFormDropdown] = useState(null); 
  
  // Custom Delete Dialog States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Dynamic Column Visibility States
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    applyDate: true,
    fromDate: true,
    toDate: true,
    halfDay: true,
    type: true,
    status: true,
    reason: true,
    actions: true
  });

  // Modal Configuration Input State
  const [formData, setFormData] = useState({
    applyDate: '2026-06-29',
    fromDate: '2026-06-29',
    toDate: '2026-06-30',
    halfDay: 'No',
    type: 'Casual Leave',
    status: 'Pending',
    reason: ''
  });

  // Date Parsing Helpers
  const convertToInputDateFormat = (displayDate) => {
    if (!displayDate || !displayDate.includes('/')) return '2026-06-29';
    const [m, d, y] = displayDate.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const convertToDisplayDateFormat = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Global Refresh Action Handler
  const handleRefresh = () => {
    setLeaves(INITIAL_LEAVE_DATA);
    setSelectedIds([]);
    setSearchQuery('');
    setCurrentPage(1);
    setIsColumnDropdownOpen(false);
    setActiveFormDropdown(null);
    setEditingItemId(null);
  };

  // Simulated Excel Spreadsheet Exporter
  const handleDownload = () => {
    alert("Exporting current tabular view dataset down to 'Leaves_Report_2026.xlsx' spreadsheet layout file.");
  };

  // Row selection logic configurations
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentPagedItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} records globally?`)) {
      setLeaves(prev => prev.filter(item => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      setCurrentPage(1);
    }
  };

  // Trigger Custom Delete Dialog Box View
  const handleOpenDeleteDialog = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteSingle = () => {
    if (!itemToDelete) return;
    setLeaves(prev => prev.filter(item => item.id !== itemToDelete.id));
    setSelectedIds(prev => prev.filter(sid => sid !== itemToDelete.id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Trigger Edit Configuration Pipeline
  const handleOpenEditDialog = (item) => {
    setEditingItemId(item.id);
    setFormData({
      applyDate: convertToInputDateFormat(item.applyDate),
      fromDate: convertToInputDateFormat(item.fromDate),
      toDate: convertToInputDateFormat(item.toDate),
      halfDay: item.halfDay,
      type: item.type,
      status: item.status,
      reason: item.reason
    });
    setIsModalOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingItemId(null);
    setFormData({
      applyDate: '2026-06-29',
      fromDate: '2026-06-29',
      toDate: '2026-06-30',
      halfDay: 'No',
      type: 'Casual Leave',
      status: 'Pending',
      reason: ''
    });
    setIsModalOpen(true);
  };

  // Filtering and Pagination processing engine
  const filteredLeaves = useMemo(() => {
    return leaves.filter(item => 
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [leaves, searchQuery]);

  const currentPagedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeaves.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeaves, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage) || 1;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editingItemId !== null) {
      setLeaves(prev => prev.map(item => {
        if (item.id === editingItemId) {
          return {
            ...item,
            applyDate: convertToDisplayDateFormat(formData.applyDate),
            fromDate: convertToDisplayDateFormat(formData.fromDate),
            toDate: convertToDisplayDateFormat(formData.toDate),
            halfDay: formData.halfDay,
            type: formData.type,
            status: formData.status,
            reason: formData.reason
          };
        }
        return item;
      }));
    } else {
      const newRecord = {
        id: Date.now(),
        applyDate: convertToDisplayDateFormat(formData.applyDate),
        fromDate: convertToDisplayDateFormat(formData.fromDate),
        toDate: convertToDisplayDateFormat(formData.toDate),
        halfDay: formData.halfDay,
        type: formData.type,
        status: formData.status,
        reason: formData.reason || 'No details provided.'
      };
      setLeaves([newRecord, ...leaves]);
    }

    setIsModalOpen(false);
    setEditingItemId(null);
  };

  return (
    <div className="lv-dashboard-container" onClick={() => { setIsColumnDropdownOpen(false); setActiveFormDropdown(null); }}>
      <header className="lv-header">
        <h1 className="lv-main-title">My Leaves</h1>
      </header>

      <main className="lv-card-wrapper">
        <div className="lv-toolbar">
          <div className="lv-toolbar-left">
            <div className="lv-search-box">
              <span className="lv-search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            {selectedIds.length > 0 && (
              <button className="lv-btn-delete-multi" onClick={handleDeleteSelected}>
                🗑️ Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="lv-toolbar-right">
            <div className="lv-dropdown-anchor" onClick={(e) => e.stopPropagation()}>
              <button 
                className="lv-icon-btn" 
                title="Show/Hide Column"
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              >
                <span className="lv-filter-lines">≡</span>
              </button>
              
              {isColumnDropdownOpen && (
                <div className="lv-column-picker-dropdown">
                  <div className="lv-picker-header">Show/Hide Column</div>
                  <div className="lv-picker-divider"></div>
                  <div className="lv-picker-scroll-area">
                    {Object.keys(visibleColumns).map((colKey) => (
                      <label key={colKey} className="lv-picker-item">
                        <input 
                          type="checkbox"
                          checked={visibleColumns[colKey]}
                          onChange={(e) => setVisibleColumns({ ...visibleColumns, [colKey]: e.target.checked })}
                        />
                        <span className="lv-custom-check-box"></span>
                        <span className="lv-picker-text">{colKey.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="lv-icon-btn lv-add-btn" title="Add New Leave" onClick={(e) => { e.stopPropagation(); handleOpenCreateDialog(); }}>
              <span className="lv-plus-symbol">+</span>
            </button>
            
            <button className="lv-icon-btn" title="Refresh Board" onClick={handleRefresh}>
              <span className="lv-refresh-symbol">↻</span>
            </button>
            
            <button className="lv-icon-btn" title="Xlsx Download" onClick={handleDownload}>
              <span className="lv-download-symbol">⬇</span>
            </button>
          </div>
        </div>

        <div className="lv-table-scroller">
          <table className="lv-data-table">
            <thead>
              <tr>
                {visibleColumns.checkbox && (
                  <th className="lv-th-checkbox">
                    <input 
                      type="checkbox" 
                      className="lv-native-checkbox"
                      onChange={handleSelectAll}
                      checked={currentPagedItems.length > 0 && selectedIds.length === currentPagedItems.length}
                    />
                  </th>
                )}
                {visibleColumns.applyDate && <th>Application Date</th>}
                {visibleColumns.fromDate && <th>From Date</th>}
                {visibleColumns.toDate && <th>To Date</th>}
                {visibleColumns.halfDay && <th>Half Day</th>}
                {visibleColumns.type && <th>Leave Type</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.reason && <th>Reason</th>}
                {visibleColumns.actions && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentPagedItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="lv-no-data-cell">No active leave records matching system search queries.</td>
                </tr>
              ) : (
                currentPagedItems.map((item) => (
                  <tr key={item.id} className={selectedIds.includes(item.id) ? 'lv-row-selected' : ''}>
                    {visibleColumns.checkbox && (
                      <td className="lv-td-checkbox">
                        <input 
                          type="checkbox" 
                          className="lv-native-checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleSelectRow(item.id)}
                        />
                      </td>
                    )}
                    {visibleColumns.applyDate && (
                      <td>
                        <span className="lv-cell-calendar-icon">📅</span> {item.applyDate}
                      </td>
                    )}
                    {visibleColumns.fromDate && (
                      <td>
                        <span className="lv-cell-calendar-icon">📅</span> {item.fromDate}
                      </td>
                    )}
                    {visibleColumns.toDate && (
                      <td>
                        <span className="lv-cell-calendar-icon">📅</span> {item.toDate}
                      </td>
                    )}
                    {visibleColumns.halfDay && <td>{item.halfDay}</td>}
                    {visibleColumns.type && <td>{item.type}</td>}
                    {visibleColumns.status && (
                      <td>
                        <span className={`lv-status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
                      </td>
                    )}
                    {visibleColumns.reason && <td className="lv-cell-reason" title={item.reason}>{item.reason}</td>}
                    {visibleColumns.actions && (
                      <td className="lv-cell-actions">
                        <button className="lv-action-edit-btn" title="Edit request details" onClick={() => handleOpenEditDialog(item)}>📝</button>
                        <button className="lv-action-delete-btn" title="Delete request item" onClick={() => handleOpenDeleteDialog(item)}>🗑️</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="lv-pagination-bar">
          <div className="lv-pagination-right-group">
            <span className="lv-pag-label">Items per page:</span>
            <div className="lv-page-select-wrapper">
              <select 
                value={itemsPerPage} 
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
            
            <span className="lv-pagination-summary">
              {filteredLeaves.length === 0 ? '0 - 0' : `${(currentPage - 1) * itemsPerPage + 1} – ${Math.min(currentPage * itemsPerPage, filteredLeaves.length)}`} of {filteredLeaves.length}
            </span>

            <div className="lv-pagination-nav-arrows">
              <button 
                className="lv-nav-arrow" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                &lt;
              </button>
              <button 
                className="lv-nav-arrow" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        </footer>
      </main>

      {isModalOpen && (
        <div className="lv-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="lv-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="lv-modal-header">
              <h2>{editingItemId !== null ? 'Edit Leave Request' : 'New Leave Request'}</h2>
              <button className="lv-modal-close-cross" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

           <form onSubmit={handleFormSubmit} className="lv-modal-body">
  <div className="lv-form-grid">

    {/* Apply Date */}
    <div className="lv-form-group">
      <label>Apply Date *</label>
      <input
        type="date"
        value={formData.applyDate}
        onChange={(e) =>
          setFormData({ ...formData, applyDate: e.target.value })
        }
        required
      />
    </div>

    {/* From Date */}
    <div className="lv-form-group">
      <label>From Date *</label>
      <input
        type="date"
        value={formData.fromDate}
        onChange={(e) =>
          setFormData({ ...formData, fromDate: e.target.value })
        }
        required
      />
    </div>

    {/* To Date */}
    <div className="lv-form-group">
      <label>To Date *</label>
      <input
        type="date"
        value={formData.toDate}
        onChange={(e) =>
          setFormData({ ...formData, toDate: e.target.value })
        }
        required
      />
    </div>

    {/* Half Day */}
    <div className="lv-form-group">
      <label>Half Day *</label>
      <select
        value={formData.halfDay}
        onChange={(e) =>
          setFormData({ ...formData, halfDay: e.target.value })
        }
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    {/* Leave Type */}
    <div className="lv-form-group">
      <label>Leave Type *</label>
      <select
        value={formData.type}
        onChange={(e) =>
          setFormData({ ...formData, type: e.target.value })
        }
      >
        <option>Casual Leave</option>
        <option>Sick Leave</option>
        <option>Privilege Leave</option>
        <option>Marriage Leave</option>
        <option>Maternity Leave</option>
      </select>
    </div>

    {/* Status */}
    <div className="lv-form-group">
      <label>Status *</label>
      <select
        value={formData.status}
        onChange={(e) =>
          setFormData({ ...formData, status: e.target.value })
        }
      >
        <option>Pending</option>
        <option>Approved</option>
        <option>Rejected</option>
      </select>
    </div>

  </div>

  {/* Reason */}
  <div className="lv-form-group full-width">
    <label>Reason *</label>
    <textarea
      rows={4}
      placeholder="Write your reason..."
      value={formData.reason}
      onChange={(e) =>
        setFormData({ ...formData, reason: e.target.value })
      }
      required
    />
  </div>

  <div className="lv-modal-footer">
    <button type="submit" className="lv-save-btn">
      Save
    </button>

    <button
      type="button"
      className="lv-cancel-btn"
      onClick={() => setIsModalOpen(false)}
    >
      Cancel
    </button>
  </div>
</form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && itemToDelete && (
        <div className="lv-delete-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="lv-delete-modal-window" onClick={(e) => e.stopPropagation()}>
            <h2 className="lv-delete-modal-title">Are you sure?</h2>
            
            <div className="lv-delete-modal-content-area">
              <p><strong>Type:</strong> {itemToDelete.type}</p>
              <p><strong>Status:</strong> {itemToDelete.status}</p>
              <p className="lv-delete-meta-reason"><strong>Details:</strong> {itemToDelete.reason}</p>
            </div>

            <div className="lv-delete-modal-footer">
              <button type="button" className="lv-btn-confirm-delete" onClick={handleConfirmDeleteSingle}>
                Delete
              </button>
              <button type="button" className="lv-btn-cancel-delete" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavesRequstes;