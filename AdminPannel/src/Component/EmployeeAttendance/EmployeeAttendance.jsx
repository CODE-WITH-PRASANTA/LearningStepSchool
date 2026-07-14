import React, { useState } from 'react';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Coffee, 
  Home, 
  ChevronRight, 
  LayoutDashboard, 
  Pencil, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './EmployeeAttendance.css'; // CSS फ़ाइल इम्पोर्ट करना न भूलें

const EmployeeAttendance = () => {
  const [activeTab, setActiveTab] = useState('log');

  const attendanceData = [
    { date: '10-02-2018', checkIn: '10:28', checkOut: '19:32', hours: '08:04', shift: 'Shift 1', status: 'Present', statusType: 'present' },
    { date: '11-02-2018', checkIn: '10:32', checkOut: '19:32', hours: '08:00', shift: 'Shift 1', status: 'Present', statusType: 'present' },
    { date: '12-02-2018', checkIn: '-', checkOut: '-', hours: '-', shift: 'Shift 1', status: 'Leave', statusType: 'leave' },
    { date: '13-02-2018', checkIn: '10:35', checkOut: '19:31', hours: '07:56', shift: 'Shift 1', status: 'Present', statusType: 'warning' },
  ];

  const chartData = [
    { name: 'Present', value: 42, color: '#7C4DFF' },
    { name: 'On Duty', value: 2, color: '#29B6F6' },
    { name: 'Paid Leave', value: 5, color: '#66BB6A' },
    { name: 'Absent', value: 1, color: '#FFA726' },
    { name: 'Holiday Leave', value: 3, color: '#EF5350' },
    { name: 'Weekend', value: 0, color: '#26C6DA' },
  ];

  return (
    <div className="ea-container">
      
      {/* Header & Breadcrumbs */}
      <div className="ea-header-section">
        <h1 className="ea-title">Employee Attendance</h1>
        <div className="ea-breadcrumbs">
          <Home className="icon-xs" />
          <ChevronRight className="icon-xxs" />
          <span>Attendance</span>
          <ChevronRight className="icon-xxs" />
          <span className="active-crumb">Employee Attendance</span>
        </div>
      </div>

      {/* Top Profile Box */}
      <div className="ea-profile-card">
        <div className="ea-avatar-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
            alt="Maria Smith" 
            className="ea-avatar-img"
          />
        </div>
        <div className="ea-profile-details">
          <h2 className="ea-employee-name">Maria Smith</h2>
          <p className="ea-employee-role">Software Developer</p>
          <div className="ea-meta-tags">
            <span className="meta-tag"><span className="lbl-id">ID:</span> IM062587UT</span>
            <span className="meta-tag"><span className="lbl-dept">Dept:</span> Account</span>
            <span className="meta-tag"><span className="lbl-join">Joined:</span> 12 January 2015</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="ea-stats-grid">
        <div className="ea-stat-card">
          <div>
            <p className="stat-label">Avg Working Hours</p>
            <h3 className="stat-value">08:00</h3>
          </div>
          <div className="stat-icon-box bg-sky">
            <Clock className="icon-md" />
          </div>
        </div>

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">Avg In Time</p>
            <h3 className="stat-value">10:30 AM</h3>
          </div>
          <div className="stat-icon-box bg-emerald">
            <LogIn className="icon-md" />
          </div>
        </div>

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">Avg Out Time</p>
            <h3 className="stat-value">07:30 PM</h3>
          </div>
          <div className="stat-icon-box bg-amber">
            <LogOut className="icon-md" />
          </div>
        </div>

        <div className="ea-stat-card">
          <div>
            <p className="stat-label">Avg Break Time</p>
            <h3 className="stat-value">01:00</h3>
          </div>
          <div className="stat-icon-box bg-purple">
            <Coffee className="icon-md" />
          </div>
        </div>
      </div>

      {/* Tabs and Lower Dynamic Content Section */}
      <div className="ea-content-card">
        <div className="ea-tabs-nav">
          <button 
            onClick={() => setActiveTab('log')}
            className={`tab-btn ${activeTab === 'log' ? 'active-tab' : ''}`}
          >
            <LayoutDashboard className="icon-sm" />
            Attendance Log
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`tab-btn ${activeTab === 'analytics' ? 'active-tab' : ''}`}
          >
            <svg className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Analytics
          </button>
        </div>

        <div className="ea-tab-content">
          {activeTab === 'log' ? (
            /* --- TAB 1: ATTENDANCE LOG TABLE --- */
            <div className="table-responsive">
              <table className="ea-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Working Hours</th>
                    <th>Shift</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr key={index}>
                      <td className="text-muted">{row.date}</td>
                      <td>{row.checkIn}</td>
                      <td>{row.checkOut}</td>
                      <td className={`font-semibold ${row.statusType === 'warning' ? 'text-red' : ''}`}>{row.hours}</td>
                      <td className="text-muted">{row.shift}</td>
                      <td>
                        <span className={`status-badge badge-${row.statusType}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action"><Pencil className="icon-xs" /></button>
                          <button className="btn-action btn-delete"><Trash2 className="icon-xs" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* --- TAB 2: ANALYTICS VIEW --- */
            <div className="analytics-grid">
              {/* Left Side Chart Card */}
              <div className="chart-box-card">
                <div className="card-sub-header">
                  <div className="indicator-line"></div>
                  <h4>Attendance Distribution</h4>
                </div>
                
                <div className="chart-flex-container">
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={0} outerRadius={85} dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-tooltip-mock">
                      <span className="tooltip-title">Present</span>
                      <span className="tooltip-val">42</span>
                    </div>
                  </div>

                  <div className="chart-legends">
                    {chartData.map((item, idx) => (
                      <div key={idx} className="legend-item">
                        <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side Status Circles Overview */}
              <div className="chart-box-card">
                <div className="card-sub-header">
                  <div className="indicator-line"></div>
                  <h4>Status Overview</h4>
                </div>

                <div className="circles-grid">
                  {[
                    { label: 'Present', val: '79%', count: '42', cls: 'c-purple' },
                    { label: 'On Duty', val: '3.8%', count: '2', cls: 'c-sky' },
                    { label: 'Paid Leave', val: '9.4%', count: '5', cls: 'c-emerald' },
                    { label: 'Absent', val: '1.9%', count: '1', cls: 'c-amber' },
                    { label: 'Holiday Leave', val: '5.7%', count: '3', cls: 'c-red' },
                    { label: 'Weekend', val: '0%', count: '0', cls: 'c-cyan' },
                  ].map((circle, index) => (
                    <div key={index} className="circle-item-wrapper">
                      <div className={`progress-circle ${circle.cls}`}>
                        <span className="circle-percent">{circle.val}</span>
                        <span className="circle-label">{circle.label}</span>
                      </div>
                      <p className="circle-total">Total: {circle.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="floating-action-zone">
        <button className="btn-floating">
          <Sparkles className="icon-sm" />
        </button>
      </div>
    </div>
  );
};

export default EmployeeAttendance;