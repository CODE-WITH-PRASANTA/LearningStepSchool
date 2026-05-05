import React, { useEffect, useState } from "react";
import "./AttendanceDashboard.css";
import { FaPlus, FaEllipsisH } from "react-icons/fa";
import AddEmployeeModal from "./AddEmployeeModal";
import API from "../../api/axios";

const AttendanceDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [summary, setSummary] = useState({
    present: 0,
    absent: 0,
    leave: 0,
    totalDays: 0,
  });

  const [totalEmployees, setTotalEmployees] = useState(0);

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
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const res = await API.get(
        `/teacher-attendance?month=${month}&year=${year}`,
      );

      const data = res.data.data || [];

      // Calculate summary
      const teacherMap = new Map();
      data.forEach(att => {
        const teacherId = att.teacherId._id || att.teacherId;
        if (!teacherMap.has(teacherId)) {
          teacherMap.set(teacherId, { present: 0, leave: 0, absent: 0 });
        }
        const status = att.status;
        if (status === 'Present') teacherMap.get(teacherId).present++;
        else if (status === 'Leave') teacherMap.get(teacherId).leave++;
        else if (status === 'Absent') teacherMap.get(teacherId).absent++;
      });

      let totalPresent = 0, totalLeave = 0, totalAbsent = 0;
      teacherMap.forEach(stats => {
        totalPresent += stats.present;
        totalLeave += stats.leave;
        totalAbsent += stats.absent;
      });

      const totalTeachers = teacherMap.size;
      const totalDays = new Date(year, month, 0).getDate();

      setSummary({
        present: totalPresent,
        absent: totalAbsent,
        leave: totalLeave,
        totalDays: totalDays * totalTeachers, // approximate
      });
      setTotalEmployees(totalTeachers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const total = summary.present + summary.absent + summary.leave;
  const onTimePercent = total > 0 ? Math.round((summary.present / total) * 100) : 0;
  const latePercent = total > 0 ? Math.round((summary.leave / total) * 100) : 0;
  const absentPercent = total > 0 ? Math.round((summary.absent / total) * 100) : 0;

  const chartData = [
    {
      month: "Current",
      onTime: onTimePercent,
      late: latePercent,
      absent: absentPercent,
    },
  ];

  const pieData = [
    { name: "Present", value: summary.present, percent: `${onTimePercent}%` },
    { name: "Leave", value: summary.leave, percent: `${latePercent}%` },
    { name: "Absent", value: summary.absent, percent: `${absentPercent}%` },
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
          <h1>Today, {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</h1>

          <div className="breadcrumb">
            <span className="active">Dashboard</span>
            <span>/</span>
            <span>Attendance</span>
          </div>
        </div>

        {/* <button className="add-btn" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Employee
        </button> */}
      </div>

      {/* Main Grid */}
      <div className="attendance-grid">
        {/* Left Card */}
        <div className="attendance-card">
          <div className="card-top">
            <h2>Attendance Rate</h2>

            <button className="download-btn">Download Report</button>
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
                      onMouseLeave={() => setBarTip({ ...barTip, show: false })}
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
                      onMouseLeave={() => setBarTip({ ...barTip, show: false })}
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
                      onMouseLeave={() => setBarTip({ ...barTip, show: false })}
                    ></div>
                  </div>

                  <p>{item.month}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="legend-row">
            <span>
              <i className="blue"></i> One Time
            </span>
            <span>
              <i className="orange"></i> Late
            </span>
            <span>
              <i className="gray"></i> Absent
            </span>
          </div>
        </div>

        {/* Right Card */}
        <div className="employee-card">
          <div className="card-top">
            <h2>Attendance Summary</h2>

            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
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
                    text: `Present - ${presentPercent}%`,
                  })
                }
                onMouseLeave={() => setPieTip({ ...pieTip, show: false })}
              ></div>

              <div
                className="pie-zone pie2"
                onMouseMove={(e) =>
                  setPieTip({
                    show: true,
                    x: e.clientX,
                    y: e.clientY - 20,
                    text: `Leave - ${leavePercent}%`,
                  })
                }
                onMouseLeave={() => setPieTip({ ...pieTip, show: false })}
              ></div>

              <div
                className="pie-zone pie3"
                onMouseMove={(e) =>
                  setPieTip({
                    show: true,
                    x: e.clientX,
                    y: e.clientY - 20,
                    text: `Absent - ${absentPercent}%`,
                  })
                }
                onMouseLeave={() => setPieTip({ ...pieTip, show: false })}
              ></div>

              <div className="donut-center">
                <h3>{totalEmployees}</h3>
                <p>Employee{totalEmployees !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <div className="employee-stats">
            {pieData.map((item, i) => (
              <div className="stat-row" key={i}>
                <i
                  className={`dot ${i === 0 ? "blue" : i === 1 ? "orange" : "gray"}`}
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
      {showModal && <AddEmployeeModal closeModal={() => setShowModal(false)} />}
    </div>
  );
};

export default AttendanceDashboard;
