import React, { useState } from 'react';
import './AttendanceSheet.css';

// Exact status config matching colors & visual styles in the UI screenshots
const STATUS_ICONS = {
  present: { char: '✓', className: 'status-present' },
  leave: { char: '✕', className: 'status-leave' },
  weekend: { char: '⊖', className: 'status-weekend' },
  holiday: { char: '★', className: 'status-holiday' }
};

const DUMMY_EMPLOYEES = [
  { id: 1, name: 'Jacob Ryan', avatar: 'https://i.pravatar.cc/150?img=33', attendance: ['present', 'present', 'weekend', 'holiday', 'present', 'present', 'weekend', 'present', 'leave', 'present', 'present', 'weekend', 'weekend', 'present', 'present', 'present', 'leave', 'weekend', 'weekend', 'present', 'present', 'present', 'holiday', 'present', 'weekend', 'weekend', 'present', 'present', 'leave', 'present', 'present'] },
  { id: 2, name: 'Angelica Ramos', avatar: 'https://i.pravatar.cc/150?img=47', attendance: ['present', 'present', 'weekend', 'present', 'leave', 'present', 'weekend', 'present', 'present', 'holiday', 'present', 'weekend', 'weekend', 'present', 'present', 'present', 'present', 'weekend', 'weekend', 'present', 'leave', 'present', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'present', 'present', 'present'] },
  { id: 3, name: 'Jens Brincker', avatar: 'https://i.pravatar.cc/150?img=12', attendance: ['present', 'leave', 'weekend', 'present', 'present', 'present', 'weekend', 'holiday', 'present', 'present', 'leave', 'weekend', 'weekend', 'present', 'present', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'present', 'present', 'leave', 'weekend', 'weekend', 'present', 'present', 'present', 'holiday', 'present'] },
  { id: 4, name: 'Mark Hay', avatar: 'https://i.pravatar.cc/150?img=68', attendance: ['holiday', 'present', 'weekend', 'present', 'present', 'leave', 'weekend', 'present', 'present', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'leave', 'present', 'weekend', 'weekend', 'present', 'present', 'present', 'present', 'holiday', 'weekend', 'weekend', 'present', 'leave', 'present', 'present', 'present'] },
  { id: 5, name: 'Cara Stevens', avatar: 'https://i.pravatar.cc/150?img=49', attendance: ['present', 'present', 'weekend', 'holiday', 'leave', 'present', 'weekend', 'present', 'present', 'present', 'holiday', 'weekend', 'weekend', 'present', 'present', 'present', 'leave', 'weekend', 'weekend', 'present', 'present', 'holiday', 'present', 'present', 'weekend', 'weekend', 'present', 'present', 'leave', 'present', 'present'] },
  { id: 6, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=53', attendance: ['present', 'holiday', 'weekend', 'present', 'present', 'present', 'weekend', 'leave', 'present', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'present', 'present', 'weekend', 'weekend', 'leave', 'present', 'present', 'holiday', 'present', 'weekend', 'weekend', 'present', 'present', 'present', 'leave', 'present'] },
  { id: 7, name: 'Ashton Cox', avatar: 'https://i.pravatar.cc/150?img=59', attendance: ['leave', 'present', 'weekend', 'present', 'holiday', 'present', 'weekend', 'present', 'present', 'leave', 'present', 'weekend', 'weekend', 'present', 'holiday', 'present', 'present', 'weekend', 'weekend', 'present', 'present', 'leave', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'present', 'present', 'leave'] },
  { id: 8, name: 'Sarah Parker', avatar: 'https://i.pravatar.cc/150?img=34', attendance: ['present', 'present', 'weekend', 'leave', 'present', 'holiday', 'weekend', 'present', 'present', 'present', 'leave', 'weekend', 'weekend', 'present', 'present', 'holiday', 'present', 'weekend', 'weekend', 'present', 'leave', 'present', 'present', 'holiday', 'weekend', 'weekend', 'present', 'present', 'leave', 'present', 'present'] },
  { id: 9, name: 'Airi Satou', avatar: 'https://i.pravatar.cc/150?img=45', attendance: ['holiday', 'present', 'weekend', 'present', 'present', 'leave', 'weekend', 'present', 'holiday', 'present', 'present', 'weekend', 'weekend', 'leave', 'present', 'present', 'holiday', 'weekend', 'weekend', 'present', 'present', 'leave', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'present', 'leave', 'present'] },
  { id: 10, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=11', attendance: ['present', 'leave', 'weekend', 'holiday', 'present', 'present', 'weekend', 'present', 'present', 'leave', 'holiday', 'weekend', 'weekend', 'present', 'leave', 'present', 'present', 'weekend', 'weekend', 'holiday', 'present', 'present', 'leave', 'present', 'weekend', 'weekend', 'present', 'holiday', 'present', 'present', 'leave'] },
];

const AttendanceSheet = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [searchFilter, setSearchFilter] = useState({ year: '2024', month: 'November' });

  // Generate 31 days headers matching screen columns
  const totalDays = 31;
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Trigger filter updating on search button click
  const handleSearch = () => {
    setSearchFilter({
      year: selectedYear,
      month: selectedMonth
    });
  };

  return (
    <div className="attendance-page-container">
      {/* Page Header Breadcrumbs */}
      <div className="page-header-row">
        <h1 className="main-title">Attendance Sheet</h1>
        <div className="breadcrumbs">
          <span className="home-icon">🏠</span> 
          <span className="separator">&gt;</span> Attendance 
          <span className="separator">&gt;</span> Sheet
        </div>
      </div>

      {/* Control Card Section */}
      <div className="attendance-card">
        <h2 className="card-inner-title">Attendance Sheet</h2>
        
        {/* Input Select Controls matching standard Fieldset design */}
        <div className="controls-row">
          <div className="fieldset-input-group">
            <label className="fieldset-label">Select Year*</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="custom-select"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <div className="fieldset-input-group">
            <label className="fieldset-label">Select Month*</label>
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="custom-select"
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <hr className="divider-line" />

        {/* Dynamic Metadata Filter String & Legends Top Indicator Section */}
        <div className="meta-legend-row">
          <div className="filter-badge-text">
            Filtered by: Year: {searchFilter.year} | Month: {searchFilter.month}
          </div>
          <div className="legends-wrapper">
            <div className="legend-item"><span className="legend-icon status-weekend">⊖</span> Weekend</div>
            <div className="legend-item"><span className="legend-icon status-present">✓</span> Present</div>
            <div className="legend-item"><span className="legend-icon status-leave">✕</span> Leave</div>
            <div className="legend-item"><span className="legend-icon status-holiday">★</span> Holiday</div>
          </div>
        </div>

        {/* Responsive Grid Containers Supporting Both Perfect Horizontal and Vertical Custom Scrollbars */}
        <div className="table-scroll-axis-container">
          <div className="table-vertical-wrapper">
            <table className="attendance-grid-table">
              <thead>
                <tr>
                  <th className="sticky-employee-col header-cell">Employee Name</th>
                  {daysArray.map((day) => (
                    <th key={day} className="day-header-cell">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DUMMY_EMPLOYEES.map((employee) => (
                  <tr key={employee.id}>
                    <td className="sticky-employee-col body-cell">
                      <div className="employee-info-box">
                        <img src={employee.avatar} alt={employee.name} className="employee-avatar" />
                        <span className="employee-name-txt">{employee.name}</span>
                      </div>
                    </td>
                    {employee.attendance.map((status, index) => {
                      const iconConfig = STATUS_ICONS[status] || { char: '', className: '' };
                      return (
                        <td key={index} className="status-data-cell">
                          <span className={`status-indicator-icon ${iconConfig.className}`}>
                            {iconConfig.char}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceSheet;