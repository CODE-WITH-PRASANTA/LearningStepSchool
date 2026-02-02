import React from "react";
import { FaCalendarAlt, FaUserPlus } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import StatsCards from "./StatsCards";
import ProgressCards from "./ProgressCards";
import FinanceChart from "./FinanceChart";
import PerformanceCalendar from "./PerformanceCalendar";
import SchoolPerformanceWave from "./SchoolPerformanceWave";
import UnpaidStudents from "./UnpaidStudents";
import FoodAndStudents from "./FoodAndStudents";

import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>
          <p>Lorem ipsum dolor sit amet</p>
        </div>

        <div className="dashboard-header-actions">

          <button className="period-btn">
            <FaCalendarAlt className="period-icon" />

            <div className="period-text">
              <span>Change period</span>
              <small>Aug 28 - Oct 28, 2021</small>
            </div>

            <IoChevronDown />
          </button>

          <button className="dashboard-primary-btn">
            <FaUserPlus />
            New Admission
          </button>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <StatsCards />

      {/* ================= PROGRESS ================= */}

      <ProgressCards />

      {/* ================= FINANCE + CALENDAR ================= */}

      <div className="dashboard-middle-grid">
        <FinanceChart />
        <PerformanceCalendar />
      </div>

      {/* ================= PERFORMANCE WAVE ================= */}

      <div className="dashboard-wave-row">
        <SchoolPerformanceWave />
      </div>

      {/* ================= UNPAID STUDENTS ================= */}

      <div className="dashboard-wave-row">
        <UnpaidStudents />
      </div>

      {/* ================= FOOD + RECENT STUDENTS ================= */}

      <div className="dashboard-wave-row">
        <FoodAndStudents />
      </div>

    </div>
  );
};

export default Dashboard;
