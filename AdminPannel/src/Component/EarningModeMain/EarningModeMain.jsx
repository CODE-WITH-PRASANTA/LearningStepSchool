import React from "react";
import "./EarningModeMain.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const asNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const chartColors = ["#60a5fa", "#3b82f6", "#86efac", "#a78bfa", "#fbbf24", "#f472b6"];

const EarningModeMain = ({ charts = {}, academicYear = "Current Academic Year" }) => {
  const feeByMode = charts.feeByMode?.length
    ? charts.feeByMode
    : ["Cash", "Cheque", "Online", "Card"].map((label) => ({ label, value: 0 }));
  const studentsByClass = charts.studentsByClass || [];

  const earningData = {
    labels: feeByMode.map((item) => item.label),
    datasets: [
      {
        data: feeByMode.map((item) => asNumber(item.value)),
        backgroundColor: feeByMode.map((_, index) => chartColors[index % chartColors.length]),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const classChartData = {
    labels: studentsByClass.map((item) => item.label),
    datasets: [
      {
        label: "Students",
        data: studentsByClass.map((item) => asNumber(item.value)),
        backgroundColor: studentsByClass.map(
          (_, index) => chartColors[index % chartColors.length]
        ),
        borderRadius: 8,
        maxBarThickness: 120,
      },
    ],
  };

  const classChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#334155", usePointStyle: true },
      },
      title: {
        display: true,
        text: ["Students enrolled by class", "Data updates with the dashboard"],
        color: "#334155",
        font: { size: 14 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#64748b", precision: 0 },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#334155", font: { weight: "600" } },
        grid: { display: false },
      },
    },
  };

  return (
    <section className="EarningModeMain">
      <div className="EarningModeMain_Card">
        <div className="EarningModeMain_Header">
          <h2>Earning Mode</h2>
          <p>Financial Year: {academicYear}</p>
        </div>

        <div className="EarningModeMain_DonutWrap">
          <Doughnut
            data={earningData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "48%",
              plugins: {
                legend: {
                  position: "top",
                  labels: { boxWidth: 40, color: "#475569" },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="EarningModeMain_Card EarningModeMain_BarCard">
        <div className="EarningModeMain_Header">
          <h2>Class Chart ({academicYear})</h2>
        </div>

        <div className="EarningModeMain_BarWrap">
          <Bar data={classChartData} options={classChartOptions} />
        </div>
      </div>
    </section>
  );
};

export default EarningModeMain;
