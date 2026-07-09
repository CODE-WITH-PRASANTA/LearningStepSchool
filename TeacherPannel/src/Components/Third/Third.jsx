import React, { useState, useEffect, useRef } from 'react';
import './Third.css';

const Third = () => {
  // Class Dropdown Select State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Class 1');
  const dropdownRef = useRef(null);

  // Active Interactive Bar State for Attendance Tooltip Chart
  const [activeBar, setActiveBar] = useState(null);

  // Data Arrays
  const performanceMetrics = [
    { id: 1, label: 'Tasks Completed', ratio: '47 / 50 tasks', percentage: 94 },
    { id: 2, label: 'Project Delivery', ratio: '95 / 100 %', percentage: 95 },
    { id: 3, label: 'Client Satisfaction', ratio: '92 / 100 %', percentage: 92 },
    { id: 4, label: 'Code Quality', ratio: '88 / 100 %', percentage: 88 },
    { id: 5, label: 'Bug Resolution Time', ratio: '20 / 24 hours', percentage: 83 },
  ];

  const certifications = [
    { id: 1, title: 'Angular Advanced Concepts', provider: 'Google', status: 'Completed', date: 'May 15, 2023', expiry: 'May 15, 2025', progress: 100 },
    { id: 2, title: 'Project Management Professional', provider: 'PMI', status: 'In-progress', date: '—', expiry: '—', progress: 65 },
    { id: 3, title: 'AWS Cloud Practitioner', provider: 'Amazon', status: 'In-progress', date: '—', expiry: '—', progress: 40 },
  ];

  const attendanceData = [
    { day: 'Mon', present: 80, absent: 20 },
    { day: 'Tue', present: 70, absent: 30 },
    { day: 'Wed', present: 90, absent: 10 },
    { day: 'Thu', present: 60, absent: 40 },
    { day: 'Fri', present: 85, absent: 15 },
  ];

  // Close dropdown on outside click frame detection
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="metrics-dashboard">
      
      {/* ROW 1: Skills, Performance, and Certifications */}
      <div className="metrics-dashboard__row metrics-dashboard__row--top">
        
        {/* Card A: Skills & Proficiency */}
        <section className="dashboard-card-v3 panel-skills">
          <div className="dashboard-card-v3__header">
            <h3 className="dashboard-card-v3__title">Skills & Proficiency</h3>
            <button className="dashboard-card-v3__menu-trigger">⋮</button>
          </div>
          <div className="panel-skills__list">
            <div className="skill-item">
              <div className="skill-item__meta"><span>Technical Skills</span><span className="skill-item__badge">Advanced (85%)</span></div>
              <div className="skill-item__track"><div className="skill-item__fill" style={{ width: '85%' }}></div></div>
            </div>
            <div className="skill-item">
              <div className="skill-item__meta"><span>Communication</span><span className="skill-item__badge">Advanced (75%)</span></div>
              <div className="skill-item__track"><div className="skill-item__fill" style={{ width: '75%' }}></div></div>
            </div>
            <div className="skill-item">
              <div className="skill-item__meta"><span>Problem Solving</span><span className="skill-item__badge skill-item__badge--expert">Expert (90%)</span></div>
              <div className="skill-item__track"><div className="skill-item__fill" style={{ width: '90%' }}></div></div>
            </div>
            <div className="skill-item">
              <div className="skill-item__meta"><span>Teamwork</span><span className="skill-item__badge">Advanced (80%)</span></div>
              <div className="skill-item__track"><div className="skill-item__fill" style={{ width: '80%' }}></div></div>
            </div>
            <div className="skill-item">
              <div className="skill-item__meta"><span>Leadership</span><span className="skill-item__badge skill-item__badge--inter">Intermediate (65%)</span></div>
              <div className="skill-item__track"><div className="skill-item__fill" style={{ width: '65%' }}></div></div>
            </div>
            <div className="skill-item">
              <div className="skill-item__meta"><span>Time Management</span><span className="skill-item__badge skill-item__badge--inter">Intermediate (70%)</span></div>
              <div className="skill-item__track"><div className="skill-item__fill" style={{ width: '70%' }}></div></div>
            </div>
          </div>
        </section>

        {/* Card B: Performance Metrics (With Scrollbar) */}
        <section className="dashboard-card-v3 panel-performance">
          <div className="dashboard-card-v3__header">
            <h3 className="dashboard-card-v3__title">Performance Metrics</h3>
            <button className="dashboard-card-v3__menu-trigger">⋮</button>
          </div>
          <div className="panel-performance__scroll-area">
            {performanceMetrics.map(metric => (
              <div key={metric.id} className="metric-row-item">
                <div className="metric-row-item__icon-wrapper">
                  {metric.id === 1 && '☑️'}
                  {metric.id === 2 && '🚀'}
                  {metric.id === 3 && '😊'}
                  {metric.id === 4 && '🧑‍💻'}
                  {metric.id === 5 && '⚙️'}
                </div>
                <div className="metric-row-item__body">
                  <div className="metric-row-item__header">
                    <span className="metric-row-item__name">{metric.label}</span>
                    <span className="metric-row-item__ratio">{metric.ratio}</span>
                  </div>
                  <div className="metric-row-item__track-container">
                    <div className="metric-row-item__bar" style={{ width: `${metric.percentage}%` }}></div>
                    <span className="metric-row-item__val-label">{metric.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Card C: Training & Certifications (With Scrollbar) */}
        <section className="dashboard-card-v3 panel-certifications">
          <div className="dashboard-card-v3__header">
            <h3 className="dashboard-card-v3__title">Training & Certifications</h3>
            <button className="dashboard-card-v3__menu-trigger">⋮</button>
          </div>
          <div className="panel-certifications__scroll-area">
            {certifications.map(cert => (
              <div key={cert.id} className="cert-card-block">
                <div className="cert-card-block__top">
                  <div className="cert-card-block__headline">
                    <h4>{cert.title}</h4>
                    <span>{cert.provider}</span>
                  </div>
                  <span className={`cert-badge cert-badge--${cert.status.toLowerCase()}`}>
                    {cert.status}
                  </span>
                </div>
                
                <div className="cert-card-block__timeline">
                  <div className="skill-item__track">
                    <div className="skill-item__fill" style={{ width: `${cert.progress}%` }}></div>
                  </div>
                  <span className="cert-card-block__pct">{cert.progress}% Complete</span>
                </div>

                {cert.status === 'Completed' && (
                  <div className="cert-card-block__meta-dates">
                    <p>📅 Completed: {cert.date}</p>
                    <p>❎ Expires: {cert.expiry} <span className="view-cert-link">📄 View Certificate</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ROW 2: Attendance Tracking Column Chart with Tooltips */}
      <div className="metrics-dashboard__row metrics-dashboard__row--bottom">
        <section className="dashboard-card-v3 panel-attendance">
          <div className="dashboard-card-v3__header">
            <h3 className="dashboard-card-v3__title">Attendance</h3>
            
            {/* Context Dropdown Component */}
            <div className="custom-dropdown-v3" ref={dropdownRef}>
              <button 
                className="custom-dropdown-v3__button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedClass} <span className="custom-dropdown-v3__arrow">▼</span>
              </button>
              {isDropdownOpen && (
                <div className="custom-dropdown-v3__menu">
                  {['Class 1', 'Class 2', 'Class 3'].map((option) => (
                    <div 
                      key={option} 
                      className={`custom-dropdown-v3__item ${selectedClass === option ? 'custom-dropdown-v3__item--active' : ''}`}
                      onClick={() => {
                        setSelectedClass(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Attendance Stacked Columns Chart */}
          <div className="attendance-chart">
            <div className="attendance-chart__axis-y">
              <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
            </div>
            
            <div className="attendance-chart__grid-area">
              {attendanceData.map((data, index) => (
                <div 
                  key={data.day} 
                  className="attendance-chart__col"
                  onClick={() => setActiveBar(activeBar === index ? null : index)}
                  onMouseEnter={() => setActiveBar(index)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  <div className="attendance-chart__stacked-pillar">
                    <div className="pillar-slice pillar-slice--absent" style={{ height: `${data.absent}%` }}>
                      {data.absent > 15 && data.absent}
                    </div>
                    <div className="pillar-slice pillar-slice--present" style={{ height: `${data.present}%` }}>
                      {data.present > 15 && data.present}
                    </div>
                  </div>
                  <span className="attendance-chart__day-label">{data.day}</span>

                  {/* Day Wise Interactive Hover Tooltip Box */}
                  {activeBar === index && (
                    <div className="attendance-tooltip">
                      <div className="attendance-tooltip__title">{data.day}</div>
                      <div className="attendance-tooltip__row">
                        <span className="tooltip-dot tooltip-dot--present"></span>
                        Present: <strong>{data.present}%</strong>
                      </div>
                      <div className="attendance-tooltip__row">
                        <span className="tooltip-dot tooltip-dot--absent"></span>
                        Absent: <strong>{data.absent}%</strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend Items Indicator */}
          <div className="attendance-chart__legend">
            <div className="legend-marker-v3">
              <span className="legend-marker-v3__box legend-marker-v3__box--present"></span>
              <span>Present</span>
            </div>
            <div className="legend-marker-v3">
              <span className="legend-marker-v3__box legend-marker-v3__box--absent"></span>
              <span>Absent</span>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Third;