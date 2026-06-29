import React, { useState, useEffect, useRef } from 'react';
import './First.css';

const First = () => {
  const [isChartMenuOpen, setIsChartMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the download dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsChartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dashboard-app">
      {/* Header & Breadcrumbs Section */}
      <header className="dashboard-app__header">
        <h1 className="dashboard-app__title">Dashboard</h1>
        <div className="dashboard-app__breadcrumb">
          <span className="dashboard-app__breadcrumb-home">🏠</span>
          <span className="dashboard-app__breadcrumb-item">Home</span>
          <span className="dashboard-app__breadcrumb-separator">&gt;</span>
          <span className="dashboard-app__breadcrumb-item dashboard-app__breadcrumb-item--active">Dashboard</span>
        </div>
      </header>

      {/* Top Metric Cards Row */}
      <section className="dashboard-app__metrics-grid">
        {/* Card 1: New Tickets */}
        <div className="metric-card metric-card--purple">
          <div className="metric-card__main">
            <div className="metric-card__content">
              <span className="metric-card__label">New Tickets</span>
              <h2 className="metric-card__value">23</h2>
            </div>
            <div className="metric-card__icon">🎟️</div>
          </div>
          <p className="metric-card__subtext">18% Higher Then Last Month</p>
        </div>

        {/* Card 2: Ticket Resolved */}
        <div className="metric-card metric-card--green">
          <div className="metric-card__main">
            <div className="metric-card__content">
              <span className="metric-card__label">Ticket Resolved</span>
              <h2 className="metric-card__value">20</h2>
            </div>
            <div className="metric-card__icon">✓</div>
          </div>
          <p className="metric-card__subtext">21% Higher Then Last Month</p>
        </div>

        {/* Card 3: Project Assigned */}
        <div className="metric-card metric-card--orange">
          <div className="metric-card__main">
            <div className="metric-card__content">
              <span className="metric-card__label">Project Assigned</span>
              <h2 className="metric-card__value">13</h2>
            </div>
            <div className="metric-card__icon">💼</div>
          </div>
          <p className="metric-card__subtext">37% Higher Then Last Month</p>
        </div>

        {/* Card 4: Available Leaves */}
        <div className="metric-card metric-card--blue">
          <div className="metric-card__main">
            <div className="metric-card__content">
              <span className="metric-card__label">Available Leaves</span>
              <h2 className="metric-card__value">34</h2>
            </div>
            <div className="metric-card__icon">🏖️</div>
          </div>
          <p className="metric-card__subtext">10% Higher Then Last Month</p>
        </div>
      </section>

      {/* Data Visualizations Layout Grid */}
      <div className="dashboard-app__charts-container">
        
        {/* Left Card: Weekly Working Hours */}
        <section className="dashboard-card dashboard-card--weekly">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Weekly Working Hours</h3>
            <div className="dashboard-card__actions" ref={menuRef}>
              <span className="dashboard-card__view-all">View All</span>
              <button 
                className="dashboard-card__menu-btn"
                onClick={() => setIsChartMenuOpen(!isChartMenuOpen)}
                aria-label="Chart Options Menu"
              >
                ☰
              </button>
              
              {/* Dropdown Menu matching the second reference image */}
              {isChartMenuOpen && (
                <div className="download-dropdown">
                  <button className="download-dropdown__item" onClick={() => setIsChartMenuOpen(false)}>Download SVG</button>
                  <button className="download-dropdown__item" onClick={() => setIsChartMenuOpen(false)}>Download PNG</button>
                  <button className="download-dropdown__item" onClick={() => setIsChartMenuOpen(false)}>Download CSV</button>
                </div>
              )}
            </div>
          </div>

          {/* Bar Chart Presentation View */}
          <div className="bar-chart">
            <div className="bar-chart__grid-lines">
              <div><span>100.0</span></div>
              <div><span>80.0</span></div>
              <div><span>60.0</span></div>
              <div><span>40.0</span></div>
              <div><span>20.0</span></div>
              <div><span>0.0</span></div>
            </div>

            <div className="bar-chart__bars-container">
              {/* Monday */}
              <div className="bar-chart__column">
                <div className="bar-chart__stacked-track">
                  <div className="bar-chart__segment bar-chart__segment--break" style={{ height: '17%' }}>17%</div>
                  <div className="bar-chart__segment bar-chart__segment--work" style={{ height: '83%' }}>83%</div>
                </div>
                <span className="bar-chart__day">Monday</span>
              </div>
              {/* Tuesday */}
              <div className="bar-chart__column">
                <div className="bar-chart__stacked-track">
                  <div className="bar-chart__segment bar-chart__segment--break" style={{ height: '29%' }}>29%</div>
                  <div className="bar-chart__segment bar-chart__segment--work" style={{ height: '71%' }}>71%</div>
                </div>
                <span className="bar-chart__day">Tuesday</span>
              </div>
              {/* Wednesday */}
              <div className="bar-chart__column">
                <div className="bar-chart__stacked-track">
                  <div className="bar-chart__segment bar-chart__segment--break" style={{ height: '33%' }}>33%</div>
                  <div className="bar-chart__segment bar-chart__segment--work" style={{ height: '67%' }}>67%</div>
                </div>
                <span className="bar-chart__day">Wednesday</span>
              </div>
              {/* Thursday */}
              <div className="bar-chart__column">
                <div className="bar-chart__stacked-track">
                  <div className="bar-chart__segment bar-chart__segment--break" style={{ height: '11%' }}>11%</div>
                  <div className="bar-chart__segment bar-chart__segment--work" style={{ height: '89%' }}>89%</div>
                </div>
                <span className="bar-chart__day">Thursday</span>
              </div>
              {/* Friday */}
              <div className="bar-chart__column">
                <div className="bar-chart__stacked-track">
                  <div className="bar-chart__segment bar-chart__segment--break" style={{ height: '37%' }}>37%</div>
                  <div className="bar-chart__segment bar-chart__segment--work" style={{ height: '63%' }}>63%</div>
                </div>
                <span className="bar-chart__day">Friday</span>
              </div>
              {/* Saturday */}
              <div className="bar-chart__column">
                <div className="bar-chart__stacked-track">
                  <div className="bar-chart__segment bar-chart__segment--break" style={{ height: '39%' }}>39%</div>
                  <div className="bar-chart__segment bar-chart__segment--work" style={{ height: '61%' }}>61%</div>
                </div>
                <span className="bar-chart__day">Saturday</span>
              </div>
            </div>
          </div>

          {/* Chart Labels Footer */}
          <div className="bar-chart__legend">
            <div className="legend-item">
              <span className="legend-color legend-color--purple"></span>
              <span className="legend-label">Work Hours</span>
            </div>
            <div className="legend-item">
              <span className="legend-color legend-color--gray"></span>
              <span className="legend-label">Break Hours</span>
            </div>
          </div>
        </section>

        {/* Right Card: Running Project Review */}
        <section className="dashboard-card dashboard-card--review">
          <div className="dashboard-card__header">
            <h3 className="dashboard-card__title">Running Project Review</h3>
          </div>

          {/* Radial Track Display Systems using native SVGs */}
          <div className="radial-chart">
            <div className="radial-chart__wrapper">
              <svg viewBox="0 0 100 100" className="radial-chart__svg">
                {/* Outer Ring (Project 2 - Blue) */}
                <circle cx="50" cy="50" r="40" className="radial-bg" />
                <circle cx="50" cy="50" r="40" className="radial-progress radial-progress--blue" style={{ strokeDasharray: '210 251' }} />
                
                {/* Middle Ring (Project 3 - Green) */}
                <circle cx="50" cy="50" r="32" className="radial-bg" />
                <circle cx="50" cy="50" r="32" className="radial-progress radial-progress--green" style={{ strokeDasharray: '130 201' }} />
                
                {/* Inner Ring (Project 1 - Orange) */}
                <circle cx="50" cy="50" r="24" className="radial-bg" />
                <circle cx="50" cy="50" r="24" className="radial-progress radial-progress--orange" style={{ strokeDasharray: '110 150' }} />
              </svg>
              <div className="radial-chart__center-text">
                <span className="radial-title">Total</span>
                <span className="radial-percentage">52%</span>
              </div>
            </div>
          </div>

          {/* Radial Legend Controls */}
          <div className="radial-chart__legend">
            <div className="legend-item">
              <span className="legend-circle legend-circle--orange"></span>
              <span className="legend-label">Project 1</span>
            </div>
            <div className="legend-item">
              <span className="legend-circle legend-circle--blue"></span>
              <span className="legend-label">Project 2</span>
            </div>
            <div className="legend-item">
              <span className="legend-circle legend-circle--green"></span>
              <span className="legend-label">Project 3</span>
            </div>
          </div>

          <button className="dashboard-card__details-btn">More Details</button>
        </section>

      </div>
    </div>
  );
};

export default First;