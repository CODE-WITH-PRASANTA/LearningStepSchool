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

const yearlyData = [
  { month: "Jan", gross: 55, net: 25, tax: 25 },
  { month: "Feb", gross: 60, net: 27, tax: 50 },
  { month: "Mar", gross: 68, net: 16, tax: 40 },
  { month: "Apr", gross: 52, net: 16, tax: 20 },
  { month: "May", gross: 69, net: 16, tax: 52 },
  { month: "Jun", gross: 73, net: 17, tax: 45 },
  { month: "Jul", gross: 71, net: 16, tax: 55 },
  { month: "Aug", gross: 74, net: 17, tax: 47 },
  { month: "Sep", gross: 70, net: 16, tax: 26 },
  { month: "Oct", gross: 75, net: 17, tax: 58 },
  { month: "Nov", gross: 72, net: 16, tax: 36 },
  { month: "Dec", gross: 77, net: 18, tax: 60 },
];

const monthlyData = yearlyData.slice(0, 6);

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
        <p>Gross Salary: {gross}%</p>
        <p>Net Salary: {net}%</p>
        <p>Tax Deduction: {tax}%</p>
      </div>
    );
  }

  return null;
};

const PayrollDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [range, setRange] = useState("Yearly");
  const [year, setYear] = useState("2024");
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const chartData = range === "Yearly" ? yearlyData : monthlyData;

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

          <button
            className="add-payroll-btn"
            onClick={() => setShowModal(true)}
          >
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
                    ticks={[0, 20, 40, 60, 80, 100]}
                    tickFormatter={(v) => `${v}K`}
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
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
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
                  <h3>7433</h3>
                  <p>Total Data</p>
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
                2024 Download Report Company
                <br />
                Trends and Insights
              </p>

              <button
                className={`download-btn ${
                  downloading ? "downloading" : ""
                }`}
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
      />
    </>
  );
};

export default PayrollDashboard;