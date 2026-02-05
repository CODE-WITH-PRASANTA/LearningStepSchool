import React from "react";
import { FaCalendarAlt, FaUserPlus } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

import StatsCards from "../../Component/StatsCards";
import ProgressCards from "../../Component/ProgressCards";
import FinanceChart from "../../Component/FinanceChart";
import PerformanceCalendar from "../../Component/PerformanceCalendar";
import SchoolPerformanceWave from "../../Component/SchoolPerformanceWave";
import UnpaidStudents from "../../Component/UnpaidStudents";
import FoodAndStudents from "../../Component/FoodAndStudents";

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
