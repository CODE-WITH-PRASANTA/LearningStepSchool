import React, { useMemo, useState, useRef, useEffect } from 'react';
import './Overtime.css';

/* ---------------------------------------------------------------------- */
/*  Icons (tiny inline SVGs — zero extra dependencies)                    */
/* ---------------------------------------------------------------------- */
const Icon = {
  Search: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Filter: (p) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </svg>
  ),
  Plus: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Refresh: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v6h-6" />
    </svg>
  ),
  Download: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v12m0 0-4-4m4 4 4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  ),
  Edit: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <path d="M18.4 2.6a2 2 0 1 1 2.8 2.8L11 15.8l-4 1 1-4 10.4-10.2Z" />
    </svg>
  ),
  Trash: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
    </svg>
  ),
  X: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  ChevronLeft: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ChevronRight: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  User: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
  Calendar: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  ),
  Clock: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
    </svg>
  ),
  Shield: (p) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
    </svg>
  ),
  Empty: (p) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 7h18M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

/* ---------------------------------------------------------------------- */
/*  Static config                                                         */
/* ---------------------------------------------------------------------- */
const COLUMN_DEFS = [
  { key: 'checkbox', label: 'Checkbox', alwaysOn: true },
  { key: 'name', label: 'Employee Name' },
  { key: 'date', label: 'Date' },
  { key: 'hours', label: 'OT Hours' },
  { key: 'reason', label: 'Reason' },
  { key: 'status', label: 'Status' },
  { key: 'approvedBy', label: 'Approved By' },
  { key: 'actions', label: 'Actions' },
];

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

const SEED_DATA = [
  { id: 1, name: 'Alice Williams', date: '2025-01-08', hours: 4, reason: 'Year-end reporting', status: 'Rejected', approvedBy: 'Finance Mgr' },
  { id: 2, name: 'Jane Smith', date: '2025-01-06', hours: 3, reason: 'Client demo prep', status: 'Pending', approvedBy: '' },
  { id: 3, name: 'Diana Prince', date: '2025-01-10', hours: 2.5, reason: 'Content update', status: 'Pending', approvedBy: '' },
  { id: 4, name: 'Fiona Gallagher', date: '2025-01-12', hours: 2, reason: 'Payroll processing', status: 'Pending', approvedBy: '' },
  { id: 5, name: 'Ian Wright', date: '2025-01-15', hours: 2, reason: 'Backend fix', status: 'Pending', approvedBy: '' },
  { id: 6, name: 'John Doe', date: '2025-01-05', hours: 2, reason: 'Urgent bug fix', status: 'Approved', approvedBy: 'Admin' },
  { id: 7, name: 'Bob Johnson', date: '2025-01-07', hours: 1.5, reason: 'API deployment', status: 'Approved', approvedBy: 'CTO' },
  { id: 8, name: 'Charlie Brown', date: '2025-01-09', hours: 2, reason: 'System maintenance', status: 'Approved', approvedBy: 'IT Lead' },
  { id: 9, name: 'Edward Norton', date: '2025-01-11', hours: 3, reason: 'Database migration', status: 'Approved', approvedBy: 'CTO' },
  { id: 10, name: 'George Miller', date: '2025-01-13', hours: 1, reason: 'Security patch', status: 'Approved', approvedBy: 'IT Lead' },
  { id: 11, name: 'Henry Adams', date: '2025-01-14', hours: 1.5, reason: 'Server upgrade', status: 'Pending', approvedBy: '' },
  { id: 12, name: 'Karen Lee', date: '2025-01-16', hours: 2, reason: 'Report review', status: 'Approved', approvedBy: 'IT Lead' },
];

const EMPTY_FORM = { name: '', date: '', hours: '', status: 'Pending', approvedBy: '', reason: '' };

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const statusClass = (status) => {
  if (status === 'Approved') return 'overtime-badge--approved';
  if (status === 'Rejected') return 'overtime-badge--rejected';
  return 'overtime-badge--pending';
};

/* ---------------------------------------------------------------------- */
/*  Component                                                              */
/* ---------------------------------------------------------------------- */
const Overtime = () => {
  const [rows, setRows] = useState(SEED_DATA);
  const [search, setSearch] = useState('');
  const [visibleCols, setVisibleCols] = useState(
    Object.fromEntries(COLUMN_DEFS.map((c) => [c.key, true]))
  );
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const filterRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  /* ---- derived data ---- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.reason, r.status, r.approvedBy].join(' ').toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage]);

  const rangeLabel = filtered.length === 0
    ? '0 of 0'
    : `${(page - 1) * perPage + 1} – ${Math.min(page * perPage, filtered.length)} of ${filtered.length}`;

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r.id));
  const someOnPageSelected = pageRows.some((r) => selected.includes(r.id)) && !allOnPageSelected;

  /* ---- handlers ---- */
  const toggleColumn = (key) => setVisibleCols((v) => ({ ...v, [key]: !v[key] }));

  const toggleSelectAllOnPage = () => {
    if (allOnPageSelected) {
      setSelected((s) => s.filter((id) => !pageRows.some((r) => r.id === id)));
    } else {
      setSelected((s) => Array.from(new Set([...s, ...pageRows.map((r) => r.id)])));
    }
  };

  const toggleSelectRow = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setEditingId(null);
    setModalMode('add');
  };

  const openEditModal = (row) => {
    setForm({ ...row });
    setFormErrors({});
    setEditingId(row.id);
    setModalMode('edit');
  };

  const closeModal = () => setModalMode(null);

  const validate = (f) => {
    const errs = {};
    if (!f.name.trim()) errs.name = 'Employee name is required';
    if (!f.date) errs.date = 'Date is required';
    if (f.hours === '' || Number(f.hours) <= 0) errs.hours = 'Enter valid hours';
    if (!f.reason.trim()) errs.reason = 'Reason is required';
    return errs;
  };

  const handleSave = () => {
    const errs = validate(form);
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (modalMode === 'add') {
      const nextId = rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
      setRows((r) => [{ ...form, id: nextId, hours: Number(form.hours) }, ...r]);
    } else if (modalMode === 'edit') {
      setRows((r) => r.map((row) => (row.id === editingId ? { ...form, id: editingId, hours: Number(form.hours) } : row)));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this overtime request? This cannot be undone.')) {
      setRows((r) => r.filter((row) => row.id !== id));
      setSelected((s) => s.filter((x) => x !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selected.length} selected request(s)?`)) {
      setRows((r) => r.filter((row) => !selected.includes(row.id)));
      setSelected([]);
    }
  };

  const handleRefresh = () => {
    setRows(SEED_DATA);
    setSearch('');
    setSelected([]);
    setPage(1);
  };

  const handleExport = () => {
    const header = ['Employee Name', 'Date', 'OT Hours', 'Reason', 'Status', 'Approved By'];
    const csvRows = filtered.map((r) => [r.name, r.date, r.hours, r.reason, r.status, r.approvedBy]);
    const csv = [header, ...csvRows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'overtime-requests.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  /* ---- render ---- */
  return (
    <div className="overtime-container">
      <div className="overtime-card">
        {/* Toolbar */}
        <div className="overtime-toolbar">
          <span className="overtime-toolbar__title">Overtime Requests</span>

          <div className="overtime-search">
            <span className="overtime-search__icon"><Icon.Search /></span>
            <input
              className="overtime-search__input"
              placeholder="Search by name, reason, status…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              aria-label="Search overtime requests"
            />
          </div>

          <div className="overtime-toolbar__spacer" />

          <div className="overtime-toolbar__actions">
            <div className="overtime-filter-wrap" ref={filterRef}>
              <button
                className={`overtime-icon-btn ${showColumnMenu ? 'overtime-icon-btn--active' : ''}`}
                onClick={() => setShowColumnMenu((v) => !v)}
                title="Show / hide columns"
                aria-label="Toggle column visibility menu"
              >
                <Icon.Filter />
              </button>
              {showColumnMenu && (
                <div className="overtime-filter-dropdown" role="menu">
                  <div className="overtime-filter-dropdown__title">Show/Hide Column</div>
                  {COLUMN_DEFS.map((col) => (
                    <label className="overtime-filter-dropdown__item" key={col.key}>
                      <input
                        type="checkbox"
                        className="overtime-checkbox"
                        checked={visibleCols[col.key]}
                        disabled={col.alwaysOn && col.key === 'checkbox' ? false : false}
                        onChange={() => toggleColumn(col.key)}
                      />
                      {col.label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button className="overtime-icon-btn" onClick={handleRefresh} title="Refresh" aria-label="Refresh data">
              <Icon.Refresh />
            </button>

            <button className="overtime-icon-btn" onClick={handleExport} title="Export CSV" aria-label="Download as CSV">
              <Icon.Download />
            </button>

            <button className="overtime-icon-btn overtime-icon-btn--primary" onClick={openAddModal} title="New OT Request" aria-label="Add new overtime request">
              <Icon.Plus />
            </button>
          </div>
        </div>

        {/* Bulk selection bar */}
        {selected.length > 0 && (
          <div className="overtime-selection-bar">
            <span>{selected.length} selected</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="overtime-selection-bar__delete" onClick={handleBulkDelete}>
                <Icon.Trash /> Delete
              </button>
              <button className="overtime-selection-bar__clear" onClick={() => setSelected([])}>
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Desktop table */}
        <div className="overtime-table-scroll">
          <table className="overtime-table">
            <thead>
              <tr>
                {visibleCols.checkbox && (
                  <th className="overtime-table__th overtime-table__th--checkbox">
                    <input
                      type="checkbox"
                      className="overtime-checkbox"
                      checked={allOnPageSelected}
                      ref={(el) => el && (el.indeterminate = someOnPageSelected)}
                      onChange={toggleSelectAllOnPage}
                      aria-label="Select all rows on this page"
                    />
                  </th>
                )}
                {visibleCols.name && <th className="overtime-table__th">Employee Name</th>}
                {visibleCols.date && <th className="overtime-table__th">Date</th>}
                {visibleCols.hours && <th className="overtime-table__th">OT Hours</th>}
                {visibleCols.reason && <th className="overtime-table__th">Reason</th>}
                {visibleCols.status && <th className="overtime-table__th">Status ↓</th>}
                {visibleCols.approvedBy && <th className="overtime-table__th">Approved By</th>}
                {visibleCols.actions && <th className="overtime-table__th">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className={`overtime-table__row ${selected.includes(row.id) ? 'overtime-table__row--selected' : ''}`}>
                  {visibleCols.checkbox && (
                    <td className="overtime-table__td overtime-table__td--checkbox">
                      <input
                        type="checkbox"
                        className="overtime-checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                        aria-label={`Select ${row.name}`}
                      />
                    </td>
                  )}
                  {visibleCols.name && (
                    <td className="overtime-table__td overtime-table__td--name">
                      <span className="overtime-avatar">
                        <span className="overtime-avatar__initial">{initials(row.name)}</span>
                        {row.name}
                      </span>
                    </td>
                  )}
                  {visibleCols.date && <td className="overtime-table__td overtime-table__td--muted">{row.date}</td>}
                  {visibleCols.hours && <td className="overtime-table__td">{row.hours}</td>}
                  {visibleCols.reason && <td className="overtime-table__td overtime-table__td--muted">{row.reason}</td>}
                  {visibleCols.status && (
                    <td className="overtime-table__td">
                      <span className={`overtime-badge ${statusClass(row.status)}`}>
                        <span className="overtime-badge__dot" />
                        {row.status}
                      </span>
                    </td>
                  )}
                  {visibleCols.approvedBy && <td className="overtime-table__td overtime-table__td--muted">{row.approvedBy || '—'}</td>}
                  {visibleCols.actions && (
                    <td className="overtime-table__td">
                      <div className="overtime-row-actions">
                        <button className="overtime-action-btn overtime-action-btn--edit" onClick={() => openEditModal(row)} aria-label={`Edit ${row.name}`}>
                          <Icon.Edit />
                        </button>
                        <button className="overtime-action-btn overtime-action-btn--delete" onClick={() => handleDelete(row.id)} aria-label={`Delete ${row.name}`}>
                          <Icon.Trash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {pageRows.length === 0 && (
            <div className="overtime-empty">
              <div className="overtime-empty__icon"><Icon.Empty /></div>
              <div className="overtime-empty__title">No overtime requests found</div>
              <div className="overtime-empty__subtitle">Try a different search or add a new request.</div>
            </div>
          )}
        </div>

        {/* Mobile cards */}
        <div className="overtime-cards">
          {pageRows.map((row) => (
            <div className="overtime-mobile-card" key={row.id}>
              <div className="overtime-mobile-card__top">
                <div className="overtime-mobile-card__id">
                  <input
                    type="checkbox"
                    className="overtime-checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleSelectRow(row.id)}
                  />
                  <span className="overtime-avatar__initial">{initials(row.name)}</span>
                  <div>
                    <div className="overtime-mobile-card__name">{row.name}</div>
                    <div className="overtime-mobile-card__date">{row.date}</div>
                  </div>
                </div>
              </div>

              <div className="overtime-mobile-card__grid">
                <div className="overtime-mobile-card__row">
                  <span className="overtime-mobile-card__label">OT Hours</span>
                  <span className="overtime-mobile-card__value">{row.hours}</span>
                </div>
                <div className="overtime-mobile-card__row">
                  <span className="overtime-mobile-card__label">Approved By</span>
                  <span className="overtime-mobile-card__value">{row.approvedBy || '—'}</span>
                </div>
                <div className="overtime-mobile-card__row">
                  <span className="overtime-mobile-card__label">Status</span>
                  <span className={`overtime-badge ${statusClass(row.status)}`}>
                    <span className="overtime-badge__dot" />
                    {row.status}
                  </span>
                </div>
              </div>

              <div className="overtime-mobile-card__reason">{row.reason}</div>

              <div className="overtime-mobile-card__actions">
                <button className="overtime-action-btn overtime-action-btn--edit" onClick={() => openEditModal(row)} aria-label={`Edit ${row.name}`}>
                  <Icon.Edit />
                </button>
                <button className="overtime-action-btn overtime-action-btn--delete" onClick={() => handleDelete(row.id)} aria-label={`Delete ${row.name}`}>
                  <Icon.Trash />
                </button>
              </div>
            </div>
          ))}
          {pageRows.length === 0 && (
            <div className="overtime-empty">
              <div className="overtime-empty__icon"><Icon.Empty /></div>
              <div className="overtime-empty__title">No overtime requests found</div>
              <div className="overtime-empty__subtitle">Try a different search or add a new request.</div>
            </div>
          )}
        </div>

        {/* Footer / pagination */}
        <div className="overtime-footer">
          <div className="overtime-footer__left">
            <span>Items per page:</span>
            <select
              className="overtime-footer__select"
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            >
              {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="overtime-footer__right">
            <span className="overtime-footer__range">{rangeLabel}</span>
            <div className="overtime-footer__nav">
              <button className="overtime-page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">
                <Icon.ChevronLeft />
              </button>
              <button className="overtime-page-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">
                <Icon.ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit modal */}
      {modalMode && (
        <div className="overtime-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="overtime-modal" role="dialog" aria-modal="true">
            <div className="overtime-modal__header">
              <span className="overtime-modal__title">
                {modalMode === 'add' ? 'New OT Request' : form.name}
              </span>
              <button className="overtime-modal__close" onClick={closeModal} aria-label="Close dialog">
                <Icon.X />
              </button>
            </div>

            <div className="overtime-modal__body">
              <div className="overtime-field">
                <span className="overtime-field__label">Employee Name<span className="overtime-field__required">*</span></span>
                <div className="overtime-field__control-wrap">
                  <input
                    className={`overtime-field__input ${formErrors.name ? 'overtime-field__input--error' : ''}`}
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="e.g. Jane Smith"
                  />
                  <span className="overtime-field__icon"><Icon.User /></span>
                </div>
                {formErrors.name && <span className="overtime-field__error">{formErrors.name}</span>}
              </div>

              <div className="overtime-form-row">
                <div className="overtime-field">
                  <span className="overtime-field__label">Date<span className="overtime-field__required">*</span></span>
                  <div className="overtime-field__control-wrap">
                    <input
                      type="date"
                      className={`overtime-field__input ${formErrors.date ? 'overtime-field__input--error' : ''}`}
                      value={form.date}
                      onChange={(e) => updateForm('date', e.target.value)}
                    />
                  </div>
                  {formErrors.date && <span className="overtime-field__error">{formErrors.date}</span>}
                </div>

                <div className="overtime-field">
                  <span className="overtime-field__label">Hours<span className="overtime-field__required">*</span></span>
                  <div className="overtime-field__control-wrap">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      className={`overtime-field__input ${formErrors.hours ? 'overtime-field__input--error' : ''}`}
                      value={form.hours}
                      onChange={(e) => updateForm('hours', e.target.value)}
                      placeholder="0"
                    />
                    <span className="overtime-field__icon"><Icon.Clock /></span>
                  </div>
                  {formErrors.hours && <span className="overtime-field__error">{formErrors.hours}</span>}
                </div>
              </div>

              <div className="overtime-field">
                <span className="overtime-field__label">Status<span className="overtime-field__required">*</span></span>
                <div className="overtime-field__control-wrap">
                  <select
                    className="overtime-field__select"
                    value={form.status}
                    onChange={(e) => updateForm('status', e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="overtime-field">
                <span className="overtime-field__label">Approved By</span>
                <div className="overtime-field__control-wrap">
                  <input
                    className="overtime-field__input"
                    value={form.approvedBy}
                    onChange={(e) => updateForm('approvedBy', e.target.value)}
                    placeholder="e.g. IT Lead"
                  />
                  <span className="overtime-field__icon"><Icon.Shield /></span>
                </div>
              </div>

              <div className="overtime-field">
                <span className="overtime-field__label">Reason<span className="overtime-field__required">*</span></span>
                <div className="overtime-field__control-wrap">
                  <textarea
                    className={`overtime-field__textarea ${formErrors.reason ? 'overtime-field__input--error' : ''}`}
                    value={form.reason}
                    onChange={(e) => updateForm('reason', e.target.value)}
                    placeholder="Describe the reason for overtime"
                  />
                </div>
                {formErrors.reason && <span className="overtime-field__error">{formErrors.reason}</span>}
              </div>
            </div>

            <div className="overtime-modal__footer">
              <button className="overtime-btn overtime-btn--cancel" onClick={closeModal}>Cancel</button>
              <button className="overtime-btn overtime-btn--save" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Overtime;