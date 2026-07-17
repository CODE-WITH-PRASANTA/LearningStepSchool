import React, { useState, useMemo, useRef, useEffect } from 'react'
import './Remote.css'

/* ---------------------------------------------------------
   Inline icon set (no external icon library required)
--------------------------------------------------------- */
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const IconFilter = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="4 4 20 4 14 12.5 14 19 10 21 10 12.5 4 4" />
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
)
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)
const IconChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5" /><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
  </svg>
)

/* ---------------------------------------------------------
   Static config
--------------------------------------------------------- */
const COLUMN_CONFIG = [
  { key: 'checkbox', label: 'Checkbox' },
  { key: 'employeeName', label: 'Employee Name' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'reason', label: 'Reason' },
  { key: 'applyDate', label: 'Apply Date' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected']

const SEED_DATA = [
  { id: 1, employeeName: 'John Doe', startDate: '2025-01-10', endDate: '2025-01-12', reason: 'Family emergency', applyDate: '2025-01-08', status: 'Approved' },
  { id: 2, employeeName: 'Sarah Smith', startDate: '2025-01-15', endDate: '2025-01-15', reason: 'Internet issues', applyDate: '2025-01-14', status: 'Pending' },
  { id: 3, employeeName: 'Robert Johnson', startDate: '2025-01-20', endDate: '2025-01-22', reason: 'Traveling', applyDate: '2025-01-15', status: 'Rejected' },
  { id: 4, employeeName: 'Maria Garcia', startDate: '2025-01-10', endDate: '2025-01-11', reason: 'Childcare', applyDate: '2025-01-09', status: 'Approved' },
  { id: 5, employeeName: 'David Miller', startDate: '2025-01-12', endDate: '2025-01-12', reason: 'Medical appointment', applyDate: '2025-01-11', status: 'Approved' },
  { id: 6, employeeName: 'Linda Wilson', startDate: '2025-01-18', endDate: '2025-01-20', reason: 'Relocation', applyDate: '2025-01-16', status: 'Pending' },
  { id: 7, employeeName: 'James Taylor', startDate: '2025-01-05', endDate: '2025-01-05', reason: 'Home renovation', applyDate: '2025-01-04', status: 'Approved' },
  { id: 8, employeeName: 'Patricia Brown', startDate: '2025-01-25', endDate: '2025-01-26', reason: 'Personal work', applyDate: '2025-01-20', status: 'Pending' },
  { id: 9, employeeName: 'Michael Davis', startDate: '2025-01-08', endDate: '2025-01-09', reason: 'Weather conditions', applyDate: '2025-01-07', status: 'Approved' },
  { id: 10, employeeName: 'Jennifer Lopez', startDate: '2025-01-14', endDate: '2025-01-14', reason: 'Car repair', applyDate: '2025-01-13', status: 'Rejected' },
  { id: 11, employeeName: 'Chris Evans', startDate: '2025-01-27', endDate: '2025-01-28', reason: 'Office relocation', applyDate: '2025-01-24', status: 'Pending' },
  { id: 12, employeeName: 'Emily Clark', startDate: '2025-01-02', endDate: '2025-01-02', reason: 'Public transport strike', applyDate: '2025-01-01', status: 'Approved' },
]

const EMPTY_FORM = { employeeName: '', startDate: '', endDate: '', reason: '', status: 'Pending', applyDate: new Date().toISOString().slice(0, 10) }

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')

const avatarPalette = ['#6D5DFC', '#22C1A4', '#F5A524', '#EF6FA0', '#3AA6FF', '#8B6BFF', '#FF7A5C']
const avatarColor = (name = '') => avatarPalette[name.charCodeAt(0) % avatarPalette.length]

/* ===========================================================
   MAIN COMPONENT
=========================================================== */
const Remote = () => {
  const [requests, setRequests] = useState(SEED_DATA)
  const [search, setSearch] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [visibleColumns, setVisibleColumns] = useState(
    COLUMN_CONFIG.reduce((acc, c) => ({ ...acc, [c.key]: true }), {})
  )
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [toast, setToast] = useState(null)

  const columnMenuRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
        setShowColumnMenu(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  /* ---------------- Derived data ---------------- */
  const filteredData = useMemo(() => {
    if (!search.trim()) return requests
    const q = search.toLowerCase()
    return requests.filter((r) =>
      [r.employeeName, r.reason, r.status].join(' ').toLowerCase().includes(q)
    )
  }, [requests, search])

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * itemsPerPage
  const pageData = filteredData.slice(startIdx, startIdx + itemsPerPage)

  const allOnPageSelected = pageData.length > 0 && pageData.every((r) => selectedRows.includes(r.id))

  /* ---------------- Handlers ---------------- */
  const toggleColumn = (key) => setVisibleColumns((p) => ({ ...p, [key]: !p[key] }))

  const toggleSelectAll = () => {
    if (allOnPageSelected) {
      setSelectedRows((p) => p.filter((id) => !pageData.some((r) => r.id === id)))
    } else {
      setSelectedRows((p) => [...new Set([...p, ...pageData.map((r) => r.id)])])
    }
  }

  const toggleSelectRow = (id) => {
    setSelectedRows((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }

  const handleRefresh = () => {
    setIsSpinning(true)
    setSearch('')
    setCurrentPage(1)
    setTimeout(() => {
      setIsSpinning(false)
      setToast({ type: 'success', message: 'List refreshed' })
    }, 650)
  }

  const handleExport = () => {
    const header = COLUMN_CONFIG.filter((c) => visibleColumns[c.key] && c.key !== 'checkbox' && c.key !== 'actions').map((c) => c.label)
    const rows = filteredData.map((r) =>
      COLUMN_CONFIG.filter((c) => visibleColumns[c.key] && c.key !== 'checkbox' && c.key !== 'actions').map((c) => r[c.key])
    )
    const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'remote_wfh_requests.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    setToast({ type: 'success', message: 'Export downloaded' })
  }

  const openAddModal = () => {
    setAddForm(EMPTY_FORM)
    setShowAddModal(true)
  }

  const saveAdd = (e) => {
    e.preventDefault()
    if (!addForm.employeeName || !addForm.startDate || !addForm.endDate || !addForm.reason) return
    const newId = requests.length ? Math.max(...requests.map((r) => r.id)) + 1 : 1
    setRequests((p) => [{ id: newId, ...addForm }, ...p])
    setShowAddModal(false)
    setCurrentPage(1)
    setToast({ type: 'success', message: 'Request created' })
  }

  const openEditModal = (record) => {
    setEditingId(record.id)
    setEditForm({ ...record })
    setShowEditModal(true)
  }

  const saveEdit = (e) => {
    e.preventDefault()
    setRequests((p) => p.map((r) => (r.id === editingId ? { ...editForm, id: editingId } : r)))
    setShowEditModal(false)
    setToast({ type: 'success', message: 'Request updated' })
  }

  const deleteRow = (id) => {
    setRequests((p) => p.filter((r) => r.id !== id))
    setSelectedRows((p) => p.filter((x) => x !== id))
    setToast({ type: 'danger', message: 'Request deleted' })
  }

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return
    setCurrentPage(p)
  }

  const statusMeta = {
    Approved: 'is-approved',
    Pending: 'is-pending',
    Rejected: 'is-rejected',
  }

  /* ---------------- Render ---------------- */
  return (
    <div className="remote-page">
      {/* Page header */}
      <div className="remote-header">
        <h1 className="remote-header__title">Remote / WFH Requests</h1>
        <div className="remote-breadcrumb">
          <span className="remote-breadcrumb__icon"><IconHome /></span>
          <span className="remote-breadcrumb__sep">›</span>
          <span>Attendance</span>
          <span className="remote-breadcrumb__sep">›</span>
          <span className="remote-breadcrumb__current">Remote / WFH Requests</span>
        </div>
      </div>

      {/* Card */}
      <div className="remote-card">
        {/* Toolbar */}
        <div className="remote-toolbar">
          <div className="remote-toolbar__title">Remote / WFH Requests</div>

          <div className="remote-search">
            <span className="remote-search__icon"><IconSearch /></span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              className="remote-search__input"
            />
          </div>

          <div className="remote-toolbar__actions">
            <div className="remote-column-menu-wrap" ref={columnMenuRef}>
              <button
                className="remote-icon-btn"
                title="Show / Hide columns"
                onClick={() => setShowColumnMenu((s) => !s)}
              >
                <IconFilter />
              </button>

              {showColumnMenu && (
                <div className="remote-column-menu">
                  <div className="remote-column-menu__title">Show/Hide Column</div>
                  <div className="remote-column-menu__divider" />
                  {COLUMN_CONFIG.map((col) => (
                    <label key={col.key} className="remote-column-menu__item">
                      <span
                        className={`remote-checkbox ${visibleColumns[col.key] ? 'is-checked' : ''}`}
                        onClick={() => toggleColumn(col.key)}
                      >
                        {visibleColumns[col.key] && <IconCheck />}
                      </span>
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button className="remote-icon-btn remote-icon-btn--primary" title="New request" onClick={openAddModal}>
              <IconPlus />
            </button>

            <button
              className={`remote-icon-btn ${isSpinning ? 'is-spinning' : ''}`}
              title="Refresh"
              onClick={handleRefresh}
            >
              <IconRefresh />
            </button>

            <button className="remote-icon-btn" title="Export CSV" onClick={handleExport}>
              <IconDownload />
            </button>
          </div>
        </div>

        {/* Table (desktop) / Cards (mobile) */}
        <div className="remote-table-wrapper">
          <table className="remote-table">
            <thead>
              <tr>
                {visibleColumns.checkbox && (
                  <th className="remote-table__checkbox-col">
                    <span
                      className={`remote-checkbox ${allOnPageSelected ? 'is-checked' : ''}`}
                      onClick={toggleSelectAll}
                    >
                      {allOnPageSelected && <IconCheck />}
                    </span>
                  </th>
                )}
                {visibleColumns.employeeName && <th>Employee Name</th>}
                {visibleColumns.startDate && <th>Start Date</th>}
                {visibleColumns.endDate && <th>End Date</th>}
                {visibleColumns.reason && <th>Reason</th>}
                {visibleColumns.applyDate && <th>Apply Date</th>}
                {visibleColumns.status && <th>Status</th>}
                {visibleColumns.actions && <th className="remote-table__actions-col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr className="remote-table__empty-row">
                  <td colSpan={COLUMN_CONFIG.length}>
                    <div className="remote-empty-state">
                      <IconDoc />
                      <p>No requests found</p>
                      <span>Try adjusting your search or add a new request</span>
                    </div>
                  </td>
                </tr>
              )}
              {pageData.map((row) => (
                <tr key={row.id} className="remote-table__row">
                  {visibleColumns.checkbox && (
                    <td data-label="">
                      <span
                        className={`remote-checkbox ${selectedRows.includes(row.id) ? 'is-checked' : ''}`}
                        onClick={() => toggleSelectRow(row.id)}
                      >
                        {selectedRows.includes(row.id) && <IconCheck />}
                      </span>
                    </td>
                  )}
                  {visibleColumns.employeeName && (
                    <td data-label="Employee Name">
                      <button className="remote-employee-link" onClick={() => openEditModal(row)}>
                        <span className="remote-avatar" style={{ background: avatarColor(row.employeeName) }}>
                          {initials(row.employeeName)}
                        </span>
                        <span>{row.employeeName}</span>
                      </button>
                    </td>
                  )}
                  {visibleColumns.startDate && <td data-label="Start Date">{row.startDate}</td>}
                  {visibleColumns.endDate && <td data-label="End Date">{row.endDate}</td>}
                  {visibleColumns.reason && <td data-label="Reason" className="remote-table__reason">{row.reason}</td>}
                  {visibleColumns.applyDate && <td data-label="Apply Date">{row.applyDate}</td>}
                  {visibleColumns.status && (
                    <td data-label="Status">
                      <span className={`remote-status-badge ${statusMeta[row.status] || ''}`}>
                        <i />{row.status}
                      </span>
                    </td>
                  )}
                  {visibleColumns.actions && (
                    <td data-label="Actions">
                      <div className="remote-actions-cell">
                        <button className="remote-action-btn remote-action-btn--edit" title="Edit" onClick={() => openEditModal(row)}>
                          <IconEdit />
                        </button>
                        <button className="remote-action-btn remote-action-btn--delete" title="Delete" onClick={() => deleteRow(row.id)}>
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

        {/* Pagination */}
        <div className="remote-pagination">
          <div className="remote-pagination__left">
            <span>Items per page:</span>
            <div className="remote-select">
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
              >
                {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <IconChevronDown />
            </div>
          </div>

          <div className="remote-pagination__right">
            <span className="remote-pagination__range">
              {totalItems === 0 ? '0 – 0' : `${startIdx + 1} – ${Math.min(startIdx + itemsPerPage, totalItems)}`} of {totalItems}
            </span>
            <button className="remote-pager-btn" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
              <IconChevronLeft />
            </button>
            <button className="remote-pager-btn" disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)}>
              <IconChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <RequestModal
          title="New Remote/WFH Request"
          form={addForm}
          setForm={setAddForm}
          onSave={saveAdd}
          onClose={() => setShowAddModal(false)}
          variant="add"
        />
      )}

      {/* Edit modal */}
      {showEditModal && (
        <RequestModal
          title={editForm.employeeName}
          form={editForm}
          setForm={setEditForm}
          onSave={saveEdit}
          onClose={() => setShowEditModal(false)}
          variant="edit"
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`remote-toast remote-toast--${toast.type}`}>
          <span className="remote-toast__icon"><IconCheck /></span>
          {toast.message}
        </div>
      )}
    </div>
  )
}

/* ===========================================================
   Reusable Add / Edit modal
=========================================================== */
const RequestModal = ({ title, form, setForm, onSave, onClose, variant }) => {
  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  return (
    <div className="remote-modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="remote-modal">
        <div className={`remote-modal__header ${variant === 'edit' ? 'remote-modal__header--edit' : ''}`}>
          <h3>{title}</h3>
          <button className="remote-modal__close" onClick={onClose}><IconClose /></button>
        </div>

        <form className="remote-modal__body" onSubmit={onSave}>
          <div className="remote-form-group">
            <label>Employee Name<span className="req">*</span></label>
            <div className="remote-input-wrap">
              <input
                type="text"
                value={form.employeeName}
                onChange={(e) => update('employeeName', e.target.value)}
                placeholder="Enter employee name"
                required
              />
              <IconUser />
            </div>
          </div>

          <div className="remote-form-row">
            <div className="remote-form-group">
              <label>Start Date<span className="req">*</span></label>
              <div className="remote-input-wrap">
                <input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} required />
                <IconCalendar />
              </div>
            </div>
            <div className="remote-form-group">
              <label>End Date<span className="req">*</span></label>
              <div className="remote-input-wrap">
                <input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} required />
                <IconCalendar />
              </div>
            </div>
          </div>

          <div className="remote-form-group">
            <label>Reason<span className="req">*</span></label>
            <div className="remote-input-wrap remote-input-wrap--textarea">
              <textarea
                rows={3}
                value={form.reason}
                onChange={(e) => update('reason', e.target.value)}
                placeholder="Describe the reason for this request"
                required
              />
              <IconDoc />
            </div>
          </div>

          <div className="remote-form-row">
            <div className="remote-form-group">
              <label>Status<span className="req">*</span></label>
              <div className="remote-select remote-select--full">
                <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <IconChevronDown />
              </div>
            </div>
            <div className="remote-form-group">
              <label>Apply Date<span className="req">*</span></label>
              <div className="remote-input-wrap">
                <input type="date" value={form.applyDate} onChange={(e) => update('applyDate', e.target.value)} required />
                <IconCalendar />
              </div>
            </div>
          </div>

          <div className="remote-modal__footer">
            <button type="submit" className="remote-btn remote-btn--save">Save</button>
            <button type="button" className="remote-btn remote-btn--cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Remote;