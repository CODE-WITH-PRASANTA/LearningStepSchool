import React, { useEffect, useState } from "react";
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

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const gross = payload.find((p) => p.dataKey === "gross")?.value || 0;
    const net = payload.find((p) => p.dataKey === "net")?.value || 0;
    const deductions = payload.find((p) => p.dataKey === "deductions")?.value || 0;

    return (
      <div className="payroll-tooltip">
        <h4>{label}</h4>
        <p>Gross Salary: Rs. {gross.toLocaleString("en-IN")}</p>
        <p>Net Salary: Rs. {net.toLocaleString("en-IN")}</p>
        <p>Deductions: Rs. {deductions.toLocaleString("en-IN")}</p>
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
  refresh,
}) => {
  const [range, setRange] = useState("Yearly");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [payTypeData, setPayTypeData] = useState([]);

  const generateChartData = (data, selectedYear) => {
    const monthlyStats = monthLabels.map((month, index) => {
      const monthPayrolls = data.filter(
        (payroll) => payroll.year === Number(selectedYear) && payroll.month === index + 1,
      );

      return {
        month,
        gross: monthPayrolls.reduce((sum, payroll) => sum + (payroll.grossSalary || 0), 0),
        net: monthPayrolls.reduce((sum, payroll) => sum + (payroll.totalSalary || 0), 0),
        deductions: monthPayrolls.reduce((sum, payroll) => sum + (payroll.totalDeductions || 0), 0),
      };
    });

    setChartData(monthlyStats);
  };

  const generatePayTypeData = (data) => {
    const totals = [
      { name: "Basic", value: 0, color: "#ff4b22" },
      { name: "HRA", value: 0, color: "#25b26b" },
      { name: "Conveyance", value: 0, color: "#11a8f4" },
      { name: "LTA", value: 0, color: "#ff8a00" },
      { name: "Medical", value: 0, color: "#3767ea" },
      { name: "Overtime", value: 0, color: "#f4b316" },
    ];

    data.forEach((payroll) => {
      const earnings = payroll.salaryBreakdown?.earnings || {};
      totals[0].value += earnings.basic || 0;
      totals[1].value += earnings.hra || 0;
      totals[2].value += earnings.conveyance || 0;
      totals[3].value += earnings.lta || 0;
      totals[4].value += earnings.medical || 0;
      totals[5].value += earnings.overtime || payroll.overtimeAmount || 0;
    });

    setPayTypeData(totals.filter((item) => item.value > 0));
  };

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/payroll");
      const data = res.data?.data || [];
      setPayrollData(data);
      generateChartData(data, year);
      generatePayTypeData(data);
    } catch (err) {
      console.error("Failed to fetch payroll data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, [refresh]);

  useEffect(() => {
    generateChartData(payrollData, year);
    generatePayTypeData(payrollData);
  }, [year, payrollData]);

  const currentChartData = range === "Yearly" ? chartData : chartData.slice(0, 6);
  const visiblePayTypeData = payTypeData.length
    ? payTypeData
    : [{ name: "No Payroll", value: 1, color: "#94a3b8" }];

  const handleDownload = () => {
    setDownloading(true);

    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 300);
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
        <div className="payroll-top">
          <div>
            <h1>Payroll</h1>
            <p>
              <span>Dashboard</span> / Payroll
            </p>
          </div>

          <button className="add-payroll-btn" onClick={onAddClick} type="button">
            <Plus size={18} />
            Add Payroll
          </button>
        </div>

        <div className="payroll-grid">
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
                  data={currentChartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 45 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e8edf7" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c95b6", fontSize: 14 }}
                  />
                  <YAxis
                    ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                    tickFormatter={(value) => `Rs.${(value / 1000).toFixed(0)}K`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8c95b6", fontSize: 14 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="gross" stackId="a" barSize={20} animationDuration={1200}>
                    {currentChartData.map((item, index) => (
                      <Cell key={index} fill="#ff8300" />
                    ))}
                  </Bar>
                  <Bar dataKey="net" stackId="a" barSize={20} animationDuration={1500}>
                    {currentChartData.map((item, index) => (
                      <Cell key={index} fill="#3767ea" />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="deductions"
                    stroke="#08aef3"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#08aef3", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#08aef3" }}
                    animationDuration={1800}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="legend-row">
              <span><i className="orange"></i>Gross Salary</span>
              <span><i className="blue"></i>Net Salary</span>
              <span><i className="cyan"></i>Deductions</span>
            </div>
          </div>

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
              <div className="donut-wrap">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={visiblePayTypeData}
                      dataKey="value"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={4}
                      animationDuration={1800}
                    >
                      {visiblePayTypeData.map((item, index) => (
                        <Cell key={index} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="donut-center">
                  <h3>{payrollData.reduce((sum, payroll) => sum + (payroll.totalSalary || 0), 0).toLocaleString("en-IN")}</h3>
                  <p>Total Payroll</p>
                </div>
              </div>

              <div className="pay-list">
                {visiblePayTypeData.map((item, index) => (
                  <div className="pay-item" key={index}>
                    <span className="dot" style={{ background: item.color }}></span>
                    <b>{Math.round(item.value).toLocaleString("en-IN")}</b>
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
                type="button"
              >
                <Download size={16} />
                {downloading ? "Downloading..." : "Download Report"}
              </button>
            </div>
          </div>
        </div>
      </div>

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
