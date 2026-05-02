import React, { useState, useEffect } from "react";
import { Plus, ChevronDown, Download } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import "./PayrollDashboard.css";
import AddPayrollModal from "./AddPayrollModal";
import API from "../../api/axios";

const pieData = [
  { name: "Salary", value: 15, color: "#ff4b22" },
  { name: "Bonus", value: 8, color: "#25b26b" },
  { name: "Commission", value: 20, color: "#11a8f4" },
  { name: "Overtime", value: 11, color: "#ff8a00" },
  { name: "Reimbursement", value: 28, color: "#3767ea" },
  { name: "Benefits", value: 18, color: "#f4b316" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const gross = payload.find((p) => p.dataKey === "gross")?.value || 0;
    const net = payload.find((p) => p.dataKey === "net")?.value || 0;
    const tax = payload.find((p) => p.dataKey === "tax")?.value || 0;

    return (
      <div className="payroll-tooltip">
        <h4>{label}</h4>
        <p>Gross Salary: ₹{gross}</p>
        <p>Net Salary: ₹{net}</p>
        <p>Tax Deduction: ₹{tax}</p>
      </div>
    );
  }

  return null;
};

const PayrollDashboard = ({
  onAddClick,
  showModal,
  setShowModal,
  editData,
  onSuccess,
}) => {
  const [range, setRange] = useState("Yearly");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchPayrollData = async () => {
    try {
      const res = await API.get("/payroll");
      const data = res.data.data || [];
      setPayrollData(data);
      generateChartData(data, year);
    } catch (err) {
      console.error("Failed to fetch payroll data:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data, selectedYear) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyStats = months.map((month, index) => {
      const monthPayrolls = data.filter(p =>
        p.year === parseInt(selectedYear) && p.month === index + 1
      );

      const totalSalary = monthPayrolls.reduce((sum, p) => sum + (p.totalSalary || 0), 0);
      const totalBase = monthPayrolls.reduce((sum, p) => sum + (p.baseSalary || 0), 0);
      const totalOvertime = monthPayrolls.reduce((sum, p) => sum + (p.overtimeAmount || 0), 0);

      return {
        month,
        gross: totalBase,
        net: totalSalary,
        tax: totalOvertime, // Using overtime as tax for visualization
      };
    });

    setChartData(monthlyStats);
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  useEffect(() => {
    if (onSuccess) {
      fetchPayrollData();
    }
  }, [onSuccess]);

  useEffect(() => {
    generateChartData(payrollData, year);
  }, [year, payrollData]);

  const currentChartData = range === "Yearly" ? chartData : chartData.slice(0, 6);

  // const handleAddClick = () => {
  //   setEditData(null); // create mode
  //   setShowModal(true);
  // };

  // const handleEditClick = (data) => {
  //   setEditData(data); // edit mode
  //   setShowModal(true);
  // };

  const handleDownload = () => {
    setDownloading(true);

    setTimeout(() => {
      setDownloading(false);
      alert("Payroll Report Downloaded Successfully");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="payroll-loading-wrap">
        <div className="loader-ring"></div>
        <h3>Loading Payroll Dashboard...</h3>
      </div>
    );
  }

  return (
    <>
      <div className="payroll-page">
        {/* Header */}
        <div className="payroll-top">
          <div>
            <h1>Payroll</h1>
            <p>
              <span>Dashboard</span> / Payroll
            </p>
          </div>

          <button className="add-payroll-btn" onClick={onAddClick}>
            <Plus size={18} />
            Add Payroll
          </button>
        </div>

        {/* Main Cards */}
        <div className="payroll-grid">
          {/* Left Card */}
          <div className="payroll-card animate-up">
            <div className="card-head">
              <h2>Payroll Summary</h2>

              <div className="dropdown-wrap">
                <select
                  className="select-box"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option>Yearly</option>
                  <option>Monthly</option>
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={390}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 45 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    stroke="#e8edf7"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c95b6", fontSize: 14 }}
                  />

                  <YAxis
                    ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c95b6", fontSize: 14 }}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="gross"
                    stackId="a"
                    barSize={20}
                    animationDuration={1200}
                  >
                    {chartData.map((item, i) => (
                      <Cell key={i} fill="#ff8300" />
                    ))}
                  </Bar>

                  <Bar
                    dataKey="net"
                    stackId="a"
                    barSize={20}
                    animationDuration={1500}
                  >
                    {chartData.map((item, i) => (
                      <Cell key={i} fill="#3767ea" />
                    ))}
                  </Bar>

                  <Line
                    type="monotone"
                    dataKey="tax"
                    stroke="#08aef3"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#08aef3",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#08aef3",
                    }}
                    animationDuration={1800}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="legend-row">
              <span>
                <i className="orange"></i>Gross Salary
              </span>

              <span>
                <i className="blue"></i>Net Salary
              </span>

              <span>
                <i className="cyan"></i>Tax Deduction
              </span>
            </div>
          </div>

          {/* Right Card */}
          <div className="payroll-card animate-up delay">
            <div className="card-head">
              <h2>Company Pay</h2>

              <div className="dropdown-wrap">
                <select
                  className="select-box"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option>{new Date().getFullYear()}</option>
                  <option>{new Date().getFullYear() - 1}</option>
                  <option>{new Date().getFullYear() - 2}</option>
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <div className="company-body">
              {/* Donut */}
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={4}
                      animationDuration={1800}
                    >
                      {pieData.map((item, i) => (
                        <Cell key={i} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="donut-center">
                  <h3>{payrollData.reduce((sum, p) => sum + (p.totalSalary || 0), 0).toLocaleString()}</h3>
                  <p>Total Payroll</p>
                </div>
              </div>

              {/* List */}
              <div className="pay-list">
                {pieData.map((item, index) => (
                  <div className="pay-item" key={index}>
                    <span
                      className="dot"
                      style={{ background: item.color }}
                    ></span>

                    <b>{String(item.value).padStart(2, "0")}%</b>

                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bottom-strip">
              <p>
                {year} Payroll Report
                <br />
                Trends and Insights
              </p>

              <button
                className={`download-btn ${downloading ? "downloading" : ""}`}
                onClick={handleDownload}
              >
                <Download size={16} />
                {downloading ? "Downloading..." : "Download Report"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payroll Modal */}
      <AddPayrollModal
        show={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        onAdd={onSuccess}
      />
    </>
  );
};

export default PayrollDashboard;
