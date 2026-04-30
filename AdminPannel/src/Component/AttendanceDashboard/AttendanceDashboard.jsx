import React, { useEffect, useState } from "react";
import "./AttendanceDashboard.css";
import { FaPlus, FaEllipsisH } from "react-icons/fa";
import AddEmployeeModal from "./AddEmployeeModal";

const AttendanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* Tooltip States */
  const [barTip, setBarTip] = useState({
    show: false,
    x: 0,
    y: 0,
    text: "",
  });

  const [pieTip, setPieTip] = useState({
    show: false,
    x: 0,
    y: 0,
    text: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const chartData = [
    { month: "Jan", onTime: 60, late: 22, absent: 18 },
    { month: "Feb", onTime: 58, late: 24, absent: 18 },
    { month: "Mar", onTime: 54, late: 26, absent: 20 },
    { month: "Apr", onTime: 74, late: 9, absent: 17 },
    { month: "May", onTime: 39, late: 23, absent: 38 },
    { month: "Jun", onTime: 51, late: 32, absent: 17 },
    { month: "Jul", onTime: 31, late: 47, absent: 22 },
    { month: "Aug", onTime: 66, late: 16, absent: 18 },
    { month: "Sep", onTime: 66, late: 16, absent: 18 },
    { month: "Oct", onTime: 66, late: 16, absent: 18 },
    { month: "Nov", onTime: 66, late: 16, absent: 18 },
    { month: "Dec", onTime: 66, late: 16, absent: 18 },
  ];

  const pieData = [
    { name: "Onsite", value: 800, percent: "54%" },
    { name: "Remote", value: 105, percent: "20%" },
    { name: "Hybrid", value: 301, percent: "26%" },
  ];

  if (loading) {
    return (
      <div className="attendance-loader">
        <div className="spinner"></div>
        <h3>Loading Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="attendance-dashboard">

      {/* Header */}
      <div className="attendance-topbar">
        <div className="attendance-heading">
          <h1>Today, 01 July 2024</h1>

          <div className="breadcrumb">
            <span className="active">Dashboard</span>
            <span>/</span>
            <span>Attendance</span>
          </div>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* Main Grid */}
      <div className="attendance-grid">

        {/* Left Card */}
        <div className="attendance-card">

          <div className="card-top">
            <h2>Attendance Rate</h2>

            <button className="download-btn">
              Download Report
            </button>
          </div>

          <div className="chart-area">

            <div className="chart-labels">
              <span>100%</span>
              <span>80%</span>
              <span>60%</span>
              <span>40%</span>
              <span>20%</span>
              <span>0%</span>
            </div>

            <div className="chart-bars">
              {chartData.map((item, index) => (
                <div className="single-bar-col" key={index}>

                  <div className="bar-stack">

                    {/* Gray */}
                    <div
                      className="bar gray"
                      style={{
                        height: `${item.absent}%`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                      onMouseMove={(e) =>
                        setBarTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY - 20,
                          text: `${item.month} - Absent ${item.absent}%`,
                        })
                      }
                      onMouseLeave={() =>
                        setBarTip({ ...barTip, show: false })
                      }
                    ></div>

                    {/* Orange */}
                    <div
                      className="bar orange"
                      style={{
                        height: `${item.late}%`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                      onMouseMove={(e) =>
                        setBarTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY - 20,
                          text: `${item.month} - Late ${item.late}%`,
                        })
                      }
                      onMouseLeave={() =>
                        setBarTip({ ...barTip, show: false })
                      }
                    ></div>

                    {/* Blue */}
                    <div
                      className="bar blue"
                      style={{
                        height: `${item.onTime}%`,
                        animationDelay: `${index * 0.08}s`,
                      }}
                      onMouseMove={(e) =>
                        setBarTip({
                          show: true,
                          x: e.clientX,
                          y: e.clientY - 20,
                          text: `${item.month} - On Time ${item.onTime}%`,
                        })
                      }
                      onMouseLeave={() =>
                        setBarTip({ ...barTip, show: false })
                      }
                    ></div>

                  </div>

                  <p>{item.month}</p>
                </div>
              ))}
            </div>

          </div>

          <div className="legend-row">
            <span><i className="blue"></i> One Time</span>
            <span><i className="orange"></i> Late</span>
            <span><i className="gray"></i> Absent</span>
          </div>

        </div>

        {/* Right Card */}
        <div className="employee-card">

          <div className="card-top">
            <h2>Employee Type</h2>

            <button
              className="menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaEllipsisH />
            </button>

            {menuOpen && (
              <div className="employee-dropdown">
                <p>Onsite</p>
                <p>Remote</p>
                <p>Hybrid</p>
              </div>
            )}
          </div>

          {/* Donut Chart */}
          <div className="donut-wrap">
            <div className="donut-chart">

              <div
                className="pie-zone pie1"
                onMouseMove={(e) =>
                  setPieTip({
                    show: true,
                    x: e.clientX,
                    y: e.clientY - 20,
                    text: "Onsite - 54%",
                  })
                }
                onMouseLeave={() =>
                  setPieTip({ ...pieTip, show: false })
                }
              ></div>

              <div
                className="pie-zone pie2"
                onMouseMove={(e) =>
                  setPieTip({
                    show: true,
                    x: e.clientX,
                    y: e.clientY - 20,
                    text: "Remote - 20%",
                  })
                }
                onMouseLeave={() =>
                  setPieTip({ ...pieTip, show: false })
                }
              ></div>

              <div
                className="pie-zone pie3"
                onMouseMove={(e) =>
                  setPieTip({
                    show: true,
                    x: e.clientX,
                    y: e.clientY - 20,
                    text: "Hybrid - 26%",
                  })
                }
                onMouseLeave={() =>
                  setPieTip({ ...pieTip, show: false })
                }
              ></div>

              <div className="donut-center">
                <h3>1000</h3>
                <p>Employee</p>
              </div>

            </div>
          </div>

          <div className="employee-stats">
            {pieData.map((item, i) => (
              <div className="stat-row" key={i}>
                <i
                  className={`dot ${
                    i === 0
                      ? "blue"
                      : i === 1
                      ? "orange"
                      : "cyan"
                  }`}
                ></i>

                <span>
                  {item.value} {item.name}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Bar Tooltip */}
      {barTip.show && (
        <div
          className="chart-tooltip"
          style={{
            left: barTip.x + 10,
            top: barTip.y,
          }}
        >
          {barTip.text}
        </div>
      )}

      {/* Pie Tooltip */}
      {pieTip.show && (
        <div
          className="chart-tooltip"
          style={{
            left: pieTip.x + 10,
            top: pieTip.y,
          }}
        >
          {pieTip.text}
        </div>
      )}

      {/* Popup Modal */}
      {showModal && (
        <AddEmployeeModal
          closeModal={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default AttendanceDashboard;