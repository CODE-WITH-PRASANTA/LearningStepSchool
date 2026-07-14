import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, PlusCircle, RefreshCw, Download, 
  ChevronLeft, ChevronRight, SquarePen, Trash2, X, Clock, User, ChevronDown 
} from 'lucide-react';
import './TodayAttendance.css';

const INITIAL_EMPLOYEES = [
  { id: "1", name: "John Doe", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", firstIn: "09:00 AM", break: "01:00 PM", lastOut: "06:00 PM", totalHours: "8h 00m", status: "Present", shift: "General" },
  { id: "2", name: "Sarah Smith", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", firstIn: "09:15 AM", break: "01:00 PM", lastOut: "06:15 PM", totalHours: "8h 00m", status: "Late", shift: "General" },
  { id: "3", name: "Robert Johnson", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150", firstIn: "08:30 AM", break: "12:30 PM", lastOut: "05:30 PM", totalHours: "8h 00m", status: "Present", shift: "Early" },
  { id: "4", name: "Maria Garcia", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", firstIn: "10:00 AM", break: "02:00 PM", lastOut: "07:00 PM", totalHours: "8h 00m", status: "Present", shift: "Late" },
  { id: "5", name: "David Miller", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", firstIn: "09:00 AM", break: "01:00 PM", lastOut: "02:00 PM", totalHours: "4h 00m", status: "Half Day", shift: "General" },
  { id: "6", name: "Linda Wilson", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", firstIn: "-", break: "-", lastOut: "-", totalHours: "0h 00m", status: "Absent", shift: "General" },
  { id: "7", name: "James Taylor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", firstIn: "09:05 AM", break: "01:00 PM", lastOut: "06:05 PM", totalHours: "8h 00m", status: "Present", shift: "General" },
  { id: "8", name: "Patricia Brown", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150", firstIn: "09:30 AM", break: "01:30 PM", lastOut: "06:30 PM", totalHours: "8h 00m", status: "Late", shift: "General" },
  { id: "9", name: "Michael Davis", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150", firstIn: "08:00 AM", break: "12:00 PM", lastOut: "04:00 PM", totalHours: "8h 00m", status: "Present", shift: "Early" },
  { id: "10", name: "Jennifer Lopez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", firstIn: "10:15 AM", break: "02:15 PM", lastOut: "07:15 PM", totalHours: "8h 00m", status: "Late", shift: "Late" },
  { id: "11", name: "William Clark", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150", firstIn: "09:00 AM", break: "01:00 PM", lastOut: "06:00 PM", totalHours: "8h 00m", status: "Present", shift: "General" },
  { id: "12", name: "Elizabeth Wright", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150", firstIn: "09:00 AM", break: "01:00 PM", lastOut: "01:30 PM", totalHours: "3h 30m", status: "Half Day", shift: "General" },
  { id: "13", name: "Charles Green", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", firstIn: "08:45 AM", break: "12:45 PM", lastOut: "05:45 PM", totalHours: "8h 00m", status: "Present", shift: "General" },
  { id: "14", name: "Susan Adams", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", firstIn: "-", break: "-", lastOut: "-", totalHours: "0h 00m", status: "Absent", shift: "General" },
  { id: "15", name: "Matthew Baker", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150", firstIn: "09:10 AM", break: "01:10 PM", lastOut: "06:10 PM", totalHours: "8h 00m", status: "Present", shift: "General" }
];

const GENERATED_TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const padHour = displayHour < 10 ? `0${displayHour}` : displayHour;
  return `${padHour}:${min} ${ampm}`;
});

const TodayAttendance = () => {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Custom Dropdowns & Modals Navigation States
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dynamic Form / Dialog Target Context States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteTargetEmployee, setDeleteTargetEmployee] = useState(null);

  // Form Field State Controls
  const [formName, setFormName] = useState("");
  const [formFirstIn, setFormFirstIn] = useState("");
  const [formBreak, setFormBreak] = useState("");
  const [formLastOut, setFormLastOut] = useState("");
  const [formStatus, setFormStatus] = useState("Present");
  const [formShift, setFormShift] = useState("General");
  const [activeTimeField, setActiveTimeField] = useState(null);

  // Table Column Show/Hide Trackers
  const [columns, setColumns] = useState({
    checkbox: true, id: false, employeeName: true, firstIn: true,
    break: true, lastOut: true, totalHours: true, status: true, shift: true, actions: true
  });

  const toggleColumnVisibility = (key) => {
    setColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Selection Box Mechanics
  const handleSelectSingleRow = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAllToggle = () => {
    if (selectedIds.length === filteredEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map(e => e.id));
    }
  };

  // Live filter computation logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => emp.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [employees, searchText]);

  // Handle dynamic sizing shifts safe pagination normalization
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const computedCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedEmployees = useMemo(() => {
    const startIndex = (computedCurrentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, computedCurrentPage, itemsPerPage]);

  // Form Opening Operations
  const openAddEntryModal = () => {
    setFormMode("add");
    setFormName("");
    setFormFirstIn("");
    setFormBreak("");
    setFormLastOut("");
    setFormStatus("Present");
    setFormShift("General");
    setIsEntryModalOpen(true);
  };

  const openEditRowModal = (employee) => {
    setFormMode("edit");
    setSelectedEmployee(employee);
    setFormName(employee.name);
    setFormFirstIn(employee.firstIn === "-" ? "" : employee.firstIn);
    setFormBreak(employee.break === "-" ? "" : employee.break);
    setFormLastOut(employee.lastOut === "-" ? "" : employee.lastOut);
    setFormStatus(employee.status);
    setFormShift(employee.shift);
    setIsEntryModalOpen(true);
  };

  // Process dynamic shift timeline analytics 
  const calculateTotalHoursString = (first, out) => {
    if (!first || !out || first === "-" || out === "-") return "0h 00m";
    try {
      const parseTime = (tStr) => {
        const [time, modifier] = tStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      const totalMinutes = parseTime(out) - parseTime(first);
      if (totalMinutes <= 0) return "0h 00m";
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}h ${m < 10 ? '0' + m : m}m`;
    } catch {
      return "8h 00m";
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalFirstIn = formFirstIn || "-";
    const finalBreak = formBreak || "-";
    const finalLastOut = formLastOut || "-";
    const computedTotal = calculateTotalHoursString(finalFirstIn, finalLastOut);

    if (formMode === "add") {
      const newRecord = {
        id: Date.now().toString(),
        name: formName,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        firstIn: finalFirstIn,
        break: finalBreak,
        lastOut: finalLastOut,
        totalHours: computedTotal,
        status: formStatus,
        shift: formShift
      };
      setEmployees([newRecord, ...employees]);
    } else {
      setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? {
        ...emp,
        name: formName,
        firstIn: finalFirstIn,
        break: finalBreak,
        lastOut: finalLastOut,
        totalHours: computedTotal,
        status: formStatus,
        shift: formShift
      } : emp));
    }
    setIsEntryModalOpen(false);
  };

  const executeDeleteRow = () => {
    setEmployees(employees.filter(emp => emp.id !== deleteTargetEmployee.id));
    setSelectedIds(prev => prev.filter(id => id !== deleteTargetEmployee.id));
    setDeleteTargetEmployee(null);
  };

  return (
    <div className="attendance-container">
      {/* Upper Navigation Meta Context Section */}
      <div className="attendance-header-section">
        <div className="attendance-title">Today Attendance</div>
        <div className="attendance-breadcrumbs">
          <HomeIcon size={16} /> <span>&gt;</span> Attendance <span>&gt;</span> <strong>Today</strong>
        </div>
      </div>

      <div className="attendance-card">
        {/* Actions Bar Panel Grid */}
        <div className="attendance-toolbar">
          <div className="attendance-search-box">
            <Search className="attendance-search-icon" size={18} />
            <input 
              type="text" 
              className="attendance-search-input" 
              placeholder="Search" 
              value={searchText}
              onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="attendance-action-buttons">
            <button 
              className={`attendance-icon-btn attendance-tooltip ${showColumnToggle ? 'active-btn' : ''}`}
              data-tooltip="show/hide column"
              onClick={() => setShowColumnToggle(!showColumnToggle)}
            >
              <SlidersHorizontal size={20} />
            </button>
            <button className="attendance-icon-btn attendance-tooltip" data-tooltip="add" onClick={openAddEntryModal}>
              <PlusCircle size={20} color="#22c55e" />
            </button>
            <button className="attendance-icon-btn attendance-tooltip" data-tooltip="refresh" onClick={() => setEmployees(INITIAL_EMPLOYEES)}>
              <RefreshCw size={20} />
            </button>
            <button className="attendance-icon-btn attendance-tooltip" data-tooltip="Xlsx Download">
              <Download size={20} color="#3b82f6" />
            </button>
          </div>

          {/* Dynamic Column Selector Subpanel Context Layout */}
          {showColumnToggle && (
            <div className="column-toggle-dropdown">
              <div className="column-toggle-title">Show/Hide Column</div>
              {Object.keys(columns).map((colKey) => (
                <label key={colKey} className="column-toggle-item">
                  <input 
                    type="checkbox" 
                    checked={columns[colKey]} 
                    onChange={() => toggleColumnVisibility(colKey)}
                  />
                  <span>{colKey.charAt(0).toUpperCase() + colKey.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Responsive Tabular Element Area Frame */}
        <div className="attendance-table-container">
          <table className="attendance-main-table">
            <thead>
              <tr>
                {columns.checkbox && (
                  <th>
                    <input 
                      type="checkbox" 
                      className="attendance-checkbox-input"
                      checked={paginatedEmployees.length > 0 && paginatedEmployees.every(e => selectedIds.includes(e.id))}
                      onChange={handleSelectAllToggle}
                    />
                  </th>
                )}
                {columns.id && <th>ID</th>}
                {columns.employeeName && <th>Employee Name</th>}
                {columns.firstIn && <th>First In</th>}
                {columns.break && <th>Break</th>}
                {columns.lastOut && <th>Last Out</th>}
                {columns.totalHours && <th>Total Hours</th>}
                {columns.status && <th>Status</th>}
                {columns.shift && <th>Shift</th>}
                {columns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id}>
                  {columns.checkbox && (
                    <td>
                      <input 
                        type="checkbox" 
                        className="attendance-checkbox-input"
                        checked={selectedIds.includes(emp.id)}
                        onChange={() => handleSelectSingleRow(emp.id)}
                      />
                    </td>
                  )}
                  {columns.id && <td>{emp.id}</td>}
                  {columns.employeeName && (
                    <td>
                      <div className="attendance-profile-cell">
                        <img src={emp.avatar} alt={emp.name} className="attendance-avatar" />
                        <span>{emp.name}</span>
                      </div>
                    </td>
                  )}
                  {columns.firstIn && <td>{emp.firstIn}</td>}
                  {columns.break && <td>{emp.break}</td>}
                  {columns.lastOut && <td>{emp.lastOut}</td>}
                  {columns.totalHours && <td>{emp.totalHours}</td>}
                  {columns.status && (
                    <td>
                      <span className={`status-badge ${emp.status.toLowerCase().replace(' ', '-')}`}>
                        {emp.status}
                      </span>
                    </td>
                  )}
                  {columns.shift && <td>{emp.shift}</td>}
                  {columns.actions && (
                    <td>
                      <div className="row-action-buttons">
                        <button className="row-edit-btn" onClick={() => openEditRowModal(emp)}>
                          <SquarePen size={18} />
                        </button>
                        <button className="row-delete-btn" onClick={() => setDeleteTargetEmployee(emp)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '24px' }}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modular Custom Dynamic Pagination Control Layout Container */}
        <div className="attendance-pagination-bar">
          <div className="items-per-page-selector">
            <span>Items per page:</span>
            <div className="items-dropdown-trigger" onClick={() => setShowItemsDropdown(!showItemsDropdown)}>
              {itemsPerPage} <ChevronDown size={14} />
            </div>
            {showItemsDropdown && (
              <div className="items-custom-menu">
                {[5, 10, 25, 100].map(num => (
                  <div 
                    key={num} 
                    className={`items-custom-option ${itemsPerPage === num ? 'selected-opt' : ''}`}
                    onClick={() => { setItemsPerPage(num); setCurrentPage(1); setShowItemsDropdown(false); }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {filteredEmployees.length > 0 ? (
              `${(computedCurrentPage - 1) * itemsPerPage + 1} – ${Math.min(computedCurrentPage * itemsPerPage, filteredEmployees.length)} of ${filteredEmployees.length}`
            ) : "0 – 0 of 0"}
          </div>

          <div className="pagination-navigation">
            <button 
              className="pagination-arrow-btn attendance-tooltip" 
              data-tooltip="previous page"
              disabled={computedCurrentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="pagination-arrow-btn attendance-tooltip" 
              data-tooltip="next page"
              disabled={computedCurrentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Creation and Modification Form Component Overlays */}
      {isEntryModalOpen && (
        <div className="modal-overlay" onClick={() => setActiveTimeField(null)}>
          <div className="entry-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="entry-modal-header">
              <div className="entry-modal-title-wrapper">
                {formMode === "add" ? (
                  <>
                    <User size={18} />
                    <span>New Entry</span>
                  </>
                ) : (
                  <>
                    <img src={selectedEmployee?.avatar} alt="" className="attendance-avatar" style={{width: 24, height: 24}} />
                    <span>{selectedEmployee?.name}</span>
                  </>
                )}
              </div>
              <button className="entry-modal-close" onClick={() => setIsEntryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="entry-modal-body-form" onSubmit={handleFormSubmit}>
              <div className="form-grid-layout">
                {/* Name Attribute Input Group Field */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">Name*</span>
                  <input 
                    type="text" 
                    required 
                    className="form-interactive-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    disabled={formMode === "edit"}
                  />
                  <User className="form-input-right-icon" size={16} />
                </div>

                {/* First In Selection Overlay Box Trigger */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">First In*</span>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="HH:MM"
                    className="form-interactive-input"
                    value={formFirstIn}
                    onClick={(e) => { e.stopPropagation(); setActiveTimeField(activeTimeField === 'firstIn' ? null : 'firstIn'); }}
                  />
                  <Clock className="form-input-right-icon" size={16} />
                  {activeTimeField === 'firstIn' && (
                    <div className="form-time-dropdown-menu">
                      {GENERATED_TIME_OPTIONS.map(t => (
                        <div key={t} className="form-time-dropdown-option" onClick={() => { setFormFirstIn(t); setActiveTimeField(null); }}>
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Break Selection Area Field Trigger */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">Break*</span>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="HH:MM"
                    className="form-interactive-input"
                    value={formBreak}
                    onClick={(e) => { e.stopPropagation(); setActiveTimeField(activeTimeField === 'break' ? null : 'break'); }}
                  />
                  <Clock className="form-input-right-icon" size={16} />
                  {activeTimeField === 'break' && (
                    <div className="form-time-dropdown-menu">
                      {GENERATED_TIME_OPTIONS.map(t => (
                        <div key={t} className="form-time-dropdown-option" onClick={() => { setFormBreak(t); setActiveTimeField(null); }}>
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Last Out Selection Overlay Box Trigger */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">Last Out*</span>
                  <input 
                    type="text" 
                    readOnly
                    placeholder="HH:MM"
                    className="form-interactive-input"
                    value={formLastOut}
                    onClick={(e) => { e.stopPropagation(); setActiveTimeField(activeTimeField === 'lastOut' ? null : 'lastOut'); }}
                  />
                  <Clock className="form-input-right-icon" size={16} />
                  {activeTimeField === 'lastOut' && (
                    <div className="form-time-dropdown-menu">
                      {GENERATED_TIME_OPTIONS.map(t => (
                        <div key={t} className="form-time-dropdown-option" onClick={() => { setFormLastOut(t); setActiveTimeField(null); }}>
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total Static Presentation Preview Block */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">Total</span>
                  <input 
                    type="text" 
                    readOnly 
                    className="form-interactive-input" 
                    value={calculateTotalHoursString(formFirstIn, formLastOut)}
                  />
                  <Clock className="form-input-right-icon" size={16} />
                </div>

                {/* Status Selection Group Wrapper */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">Status*</span>
                  <select 
                    className="form-interactive-input"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                {/* Shift Configuration Choice Block */}
                <div className="form-input-field-group">
                  <span className="form-input-label-tag">Shift*</span>
                  <select 
                    className="form-interactive-input"
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Early">Early</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              </div>

              <div className="form-action-footer-buttons">
                <button type="submit" className="form-save-submit-btn">Save</button>
                <button type="button" className="form-cancel-dismiss-btn" onClick={() => setIsEntryModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Execution Confirmation Alert Fragment Dialog */}
      {deleteTargetEmployee && (
        <div className="modal-overlay">
          <div className="delete-dialog-box">
            <div className="delete-dialog-title">Are you sure?</div>
            <div className="delete-dialog-details-list">
              <div><strong>Employee Name:</strong> {deleteTargetEmployee.name}</div>
              <div><strong>First In:</strong> {deleteTargetEmployee.firstIn}</div>
              <div><strong>Last Out:</strong> {deleteTargetEmployee.lastOut}</div>
            </div>
            <div className="delete-dialog-actions">
              <button className="delete-confirm-execution-btn" onClick={executeDeleteRow}>Delete</button>
              <button className="delete-cancel-dismiss-btn" onClick={() => setDeleteTargetEmployee(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Helper Node for Home Icon Representation
const HomeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

export default TodayAttendance;