import React, { useState, useRef, useEffect, useMemo } from 'react';
import './ShiftPlanning.css';

/* ---------------------------------- Icons ---------------------------------- */

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M4 5h16M7 12h10M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
const IconRefresh = ({ spinning }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`icon ${spinning ? 'icon--spin' : ''}`}>
    <path
      d="M4 12a8 8 0 0 1 14.2-5M20 12a8 8 0 0 1-14.2 5M4 4v5h5M20 20v-5h-5"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <rect x="3.5" y="5" width="17" height="16" rx="2.2" stroke="currentColor" strokeWidth="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <rect x="4" y="3" width="10" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M14 8h6v13h-6M7 7h.01M11 7h.01M7 11h.01M11 11h.01M7 15h.01M11 15h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" className="icon">
    <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------- Constants -------------------------------- */

const SHIFT_TYPES = ['Morning', 'Afternoon', 'Evening', 'Night'];
const DEPARTMENTS = ['Engineering', 'Support', 'Security', 'HR', 'Marketing', 'Sales', 'IT', 'Admin', 'Finance', 'Operations'];
const STATUSES = ['Active', 'Scheduled', 'Completed', 'Cancelled'];

const COLUMN_CONFIG = [
  { key: 'checkbox', label: 'Checkbox' },
  { key: 'employeeName', label: 'Employee Name' },
  { key: 'shiftType', label: 'Shift Type' },
  { key: 'startTime', label: 'Start Time' },
  { key: 'endTime', label: 'End Time' },
  { key: 'date', label: 'Date' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const SEED_DATA = [
  { id: 1, employeeName: 'John Doe', shiftType: 'Morning', startTime: '08:00', endTime: '16:00', date: '2025-01-10', department: 'Engineering', status: 'Active' },
  { id: 2, employeeName: 'Sarah Smith', shiftType: 'Evening', startTime: '16:00', endTime: '00:00', date: '2025-01-10', department: 'Support', status: 'Scheduled' },
  { id: 3, employeeName: 'Robert Johnson', shiftType: 'Night', startTime: '00:00', endTime: '08:00', date: '2025-01-11', department: 'Security', status: 'Scheduled' },
  { id: 4, employeeName: 'Maria Garcia', shiftType: 'Morning', startTime: '08:00', endTime: '16:00', date: '2025-01-11', department: 'Engineering', status: 'Active' },
  { id: 5, employeeName: 'David Miller', shiftType: 'Morning', startTime: '08:00', endTime: '16:00', date: '2025-01-10', department: 'HR', status: 'Completed' },
  { id: 6, employeeName: 'Linda Wilson', shiftType: 'Evening', startTime: '16:00', endTime: '00:00', date: '2025-01-11', department: 'Marketing', status: 'Scheduled' },
  { id: 7, employeeName: 'James Taylor', shiftType: 'Morning', startTime: '08:00', endTime: '16:00', date: '2025-01-12', department: 'Sales', status: 'Scheduled' },
  { id: 8, employeeName: 'Patricia Brown', shiftType: 'Evening', startTime: '16:00', endTime: '00:00', date: '2025-01-12', department: 'IT', status: 'Scheduled' },
  { id: 9, employeeName: 'Michael Davis', shiftType: 'Night', startTime: '00:00', endTime: '08:00', date: '2025-01-12', department: 'Security', status: 'Scheduled' },
  { id: 10, employeeName: 'Jennifer Lopez', shiftType: 'Morning', startTime: '08:00', endTime: '16:00', date: '2025-01-13', department: 'Admin', status: 'Scheduled' },
  { id: 11, employeeName: 'Kevin Anderson', shiftType: 'Afternoon', startTime: '12:00', endTime: '20:00', date: '2025-01-13', department: 'Finance', status: 'Active' },
  { id: 12, employeeName: 'Anna Martinez', shiftType: 'Night', startTime: '00:00', endTime: '08:00', date: '2025-01-14', department: 'Operations', status: 'Cancelled' },
];

const EMPTY_FORM = { employeeName: '', shiftType: '', startTime: '', endTime: '', date: '', department: '', status: 'Scheduled' };

/* ------------------------------ Small pieces ------------------------------ */

const StatusBadge = ({ status }) => (
  <span className={`sp-badge sp-badge--${status.toLowerCase()}`}>{status}</span>
);

const TimeField = ({ label, icon: Icon, value, onChange, required }) => {
  const ref = useRef(null);
  return (
    <div className="sp-field">
      <label className="sp-field__label">{label}{required && <span className="sp-field__req">*</span>}</label>
      <div className="sp-field__control">
        <input
          ref={ref}
          type="time"
          className="sp-field__input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="button" className="sp-field__icon-btn" tabIndex={-1}
          onClick={() => { try { ref.current.showPicker(); } catch { ref.current.focus(); } }}>
          <Icon />
        </button>
      </div>
    </div>
  );
};

/* ------------------------------ Shift Modal -------------------------------- */

const ShiftModal = ({ title, initialData, onSave, onClose, accent }) => {
  const [form, setForm] = useState(initialData);
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current && nameRef.current.focus(); }, []);

  const isValid = useMemo(
    () => Object.entries(form).every(([k, v]) => (k === 'status' ? true : String(v).trim() !== '')) && form.status,
    [form]
  );

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!isValid) return;
    onSave(form);
  };

  return (
    <div className="sp-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal" role="dialog" aria-modal="true">
        <div className={`sp-modal__header ${accent ? 'sp-modal__header--accent' : ''}`}>
          <h2 className="sp-modal__title">{title}</h2>
          <button className="sp-modal__close" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>

        <div className="sp-modal__body">
          <div className="sp-grid">
            <div className="sp-field">
              <label className="sp-field__label">Employee Name<span className="sp-field__req">*</span></label>
              <div className="sp-field__control">
                <input
                  ref={nameRef}
                  type="text"
                  className="sp-field__input"
                  placeholder="Employee Name"
                  value={form.employeeName}
                  onChange={(e) => set('employeeName')(e.target.value)}
                />
                <span className="sp-field__icon"><IconUser /></span>
              </div>
            </div>

            <div className="sp-field">
              <label className="sp-field__label">Shift Type<span className="sp-field__req">*</span></label>
              <div className="sp-field__control">
                <select
                  className="sp-field__input sp-field__select"
                  value={form.shiftType}
                  onChange={(e) => set('shiftType')(e.target.value)}
                >
                  <option value="" disabled>Select shift type</option>
                  {SHIFT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="sp-field__icon sp-field__icon--static"><IconChevron /></span>
              </div>
            </div>

            <TimeField label="Start Time" icon={IconClock} value={form.startTime} onChange={set('startTime')} required />
            <TimeField label="End Time" icon={IconClock} value={form.endTime} onChange={set('endTime')} required />

            <div className="sp-field">
              <label className="sp-field__label">Date<span className="sp-field__req">*</span></label>
              <div className="sp-field__control">
                <input
                  type="date"
                  className="sp-field__input"
                  value={form.date}
                  onChange={(e) => set('date')(e.target.value)}
                />
                <span className="sp-field__icon sp-field__icon--static"><IconCalendar /></span>
              </div>
            </div>

            <div className="sp-field">
              <label className="sp-field__label">Department<span className="sp-field__req">*</span></label>
              <div className="sp-field__control">
                <select
                  className="sp-field__input sp-field__select"
                  value={form.department}
                  onChange={(e) => set('department')(e.target.value)}
                >
                  <option value="" disabled>Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <span className="sp-field__icon sp-field__icon--static"><IconBuilding /></span>
              </div>
            </div>

            <div className="sp-field sp-field--full">
              <label className="sp-field__label">Status<span className="sp-field__req">*</span></label>
              <div className="sp-field__control">
                <select
                  className="sp-field__input sp-field__select"
                  value={form.status}
                  onChange={(e) => set('status')(e.target.value)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="sp-field__icon sp-field__icon--static"><IconChevron /></span>
              </div>
            </div>
          </div>
        </div>

        <div className="sp-modal__footer">
          <button className="sp-btn sp-btn--primary" disabled={!isValid} onClick={handleSave}>Save</button>
          <button className="sp-btn sp-btn--danger" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Main ------------------------------------ */

const ShiftPlanning = () => {
  const [shifts, setShifts] = useState(SEED_DATA);
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMN_CONFIG.reduce((acc, c) => ({ ...acc, [c.key]: true }), {})
  );
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [toast, setToast] = useState(null);

  const filterRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return shifts;
    return shifts.filter((s) =>
      s.employeeName.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      s.shiftType.toLowerCase().includes(q) ||
      s.status.toLowerCase().includes(q)
    );
  }, [shifts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * itemsPerPage;
  const pageRows = filtered.slice(pageStart, pageStart + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [search, itemsPerPage]);

  const toggleColumn = (key) => setVisibleColumns((v) => ({ ...v, [key]: !v[key] }));

  const toggleSelectAll = () => {
    const pageIds = pageRows.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedRows.includes(id));
    setSelectedRows((prev) =>
      allSelected ? prev.filter((id) => !pageIds.includes(id)) : [...new Set([...prev, ...pageIds])]
    );
  };

  const toggleSelectRow = (id) =>
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const handleAddShift = (form) => {
    const nextId = shifts.length ? Math.max(...shifts.map((s) => s.id)) + 1 : 1;
    setShifts((prev) => [{ id: nextId, ...form }, ...prev]);
    setShowAddModal(false);
    setToast('Shift created successfully');
  };

  const handleUpdateShift = (form) => {
    setShifts((prev) => prev.map((s) => (s.id === editingShift.id ? { ...s, ...form } : s)));
    setEditingShift(null);
    setToast('Shift updated successfully');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this shift? This action cannot be undone.')) return;
    setShifts((prev) => prev.filter((s) => s.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== id));
    setToast('Shift deleted');
  };

  const handleRefresh = () => {
    setSpinning(true);
    setSearch('');
    setSelectedRows([]);
    setTimeout(() => setSpinning(false), 650);
  };

  const handleDownload = () => {
    const cols = COLUMN_CONFIG.filter((c) => visibleColumns[c.key] && c.key !== 'checkbox' && c.key !== 'actions');
    const header = cols.map((c) => c.label).join(',');
    const rows = filtered.map((s) => cols.map((c) => `"${String(s[c.key]).replace(/"/g, '""')}"`).join(','));
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shift-planning.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pageIds = pageRows.map((r) => r.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedRows.includes(id));

  return (
    <div className="sp">
      {/* Header */}
      <div className="sp-header">
        <div className="sp-header__title">
          <span className="sp-header__icon"><IconCalendar /></span>
          <h1>Shift Planning</h1>
        </div>

        <div className="sp-header__search">
          <IconSearch />
          <input
            type="text"
            placeholder="Search by name, department, status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sp-header__actions">
          <div className="sp-filter" ref={filterRef}>
            <button
              className={`sp-icon-btn ${showFilter ? 'sp-icon-btn--active' : ''}`}
              onClick={() => setShowFilter((v) => !v)}
              aria-label="Filter columns"
            >
              <IconFilter />
            </button>
            {showFilter && (
              <div className="sp-filter__panel">
                <div className="sp-filter__title">Show/Hide Column</div>
                <div className="sp-filter__divider" />
                <div className="sp-filter__list">
                  {COLUMN_CONFIG.map((c) => (
                    <label key={c.key} className="sp-filter__item">
                      <span
                        className={`sp-checkbox ${visibleColumns[c.key] ? 'sp-checkbox--checked' : ''}`}
                        onClick={() => toggleColumn(c.key)}
                      >
                        {visibleColumns[c.key] && <IconCheck />}
                      </span>
                      <span onClick={() => toggleColumn(c.key)}>{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="sp-icon-btn sp-icon-btn--primary" onClick={() => setShowAddModal(true)} aria-label="Add shift">
            <IconPlus />
          </button>
          <button className="sp-icon-btn" onClick={handleRefresh} aria-label="Refresh">
            <IconRefresh spinning={spinning} />
          </button>
          <button className="sp-icon-btn" onClick={handleDownload} aria-label="Download CSV">
            <IconDownload />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="sp-table-wrapper">
        <table className="sp-table">
          <thead>
            <tr>
              {visibleColumns.checkbox && (
                <th className="sp-table__checkbox-col">
                  <span
                    className={`sp-checkbox ${allPageSelected ? 'sp-checkbox--checked' : ''}`}
                    onClick={toggleSelectAll}
                  >
                    {allPageSelected && <IconCheck />}
                  </span>
                </th>
              )}
              {visibleColumns.employeeName && <th>Employee Name</th>}
              {visibleColumns.shiftType && <th>Shift Type</th>}
              {visibleColumns.startTime && <th>Start Time</th>}
              {visibleColumns.endTime && <th>End Time</th>}
              {visibleColumns.date && <th>Date</th>}
              {visibleColumns.department && <th>Department</th>}
              {visibleColumns.status && <th>Status</th>}
              {visibleColumns.actions && <th className="sp-table__actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} className="sp-table__empty">No shifts match your search.</td>
              </tr>
            )}
            {pageRows.map((s) => (
              <tr key={s.id} className="sp-row">
                {visibleColumns.checkbox && (
                  <td data-label="" className="sp-table__checkbox-col">
                    <span
                      className={`sp-checkbox ${selectedRows.includes(s.id) ? 'sp-checkbox--checked' : ''}`}
                      onClick={() => toggleSelectRow(s.id)}
                    >
                      {selectedRows.includes(s.id) && <IconCheck />}
                    </span>
                  </td>
                )}
                {visibleColumns.employeeName && (
                  <td data-label="Employee Name">
                    <button className="sp-row__name" onClick={() => setEditingShift(s)}>
                      {s.employeeName}
                    </button>
                  </td>
                )}
                {visibleColumns.shiftType && <td data-label="Shift Type">{s.shiftType}</td>}
                {visibleColumns.startTime && <td data-label="Start Time">{s.startTime}</td>}
                {visibleColumns.endTime && <td data-label="End Time">{s.endTime}</td>}
                {visibleColumns.date && <td data-label="Date">{s.date}</td>}
                {visibleColumns.department && <td data-label="Department">{s.department}</td>}
                {visibleColumns.status && (
                  <td data-label="Status"><StatusBadge status={s.status} /></td>
                )}
                {visibleColumns.actions && (
                  <td data-label="Actions" className="sp-table__actions-col">
                    <div className="sp-row-actions">
                      <button className="sp-row-actions__btn sp-row-actions__btn--edit" onClick={() => setEditingShift(s)} aria-label="Edit">
                        <IconEdit />
                      </button>
                      <button className="sp-row-actions__btn sp-row-actions__btn--delete" onClick={() => handleDelete(s.id)} aria-label="Delete">
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="sp-footer">
        <div className="sp-footer__perpage">
          <span>Items per page:</span>
          <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="sp-footer__range">
          {filtered.length === 0 ? '0 of 0' : `${pageStart + 1} – ${Math.min(pageStart + itemsPerPage, filtered.length)} of ${filtered.length}`}
        </div>
        <div className="sp-footer__nav">
          <button disabled={safePage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} aria-label="Previous page">
            <svg viewBox="0 0 24 24" fill="none" className="icon"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button disabled={safePage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} aria-label="Next page">
            <svg viewBox="0 0 24 24" fill="none" className="icon"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {showAddModal && (
        <ShiftModal
          title="New Shift"
          initialData={EMPTY_FORM}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddShift}
        />
      )}

      {editingShift && (
        <ShiftModal
          title={editingShift.employeeName}
          initialData={{
            employeeName: editingShift.employeeName,
            shiftType: editingShift.shiftType,
            startTime: editingShift.startTime,
            endTime: editingShift.endTime,
            date: editingShift.date,
            department: editingShift.department,
            status: editingShift.status,
          }}
          accent
          onClose={() => setEditingShift(null)}
          onSave={handleUpdateShift}
        />
      )}

      {toast && <div className="sp-toast">{toast}</div>}
    </div>
  );
};

export default ShiftPlanning;