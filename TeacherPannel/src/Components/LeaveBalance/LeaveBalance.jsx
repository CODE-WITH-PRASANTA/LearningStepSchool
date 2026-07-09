import React from "react";
import "./LeaveBalance.css";
import {
  FiHome,
  FiChevronRight,
  FiCalendar,
} from "react-icons/fi";
import {
  FaBriefcaseMedical,
  FaLeaf,
  FaRegSadTear,
} from "react-icons/fa";

const leaveData = [
  {
    title: "Annual Leave",
    total: 15,
    used: 5,
    available: 10,
    color: "#11d9e8",
    icon: <FiCalendar />,
  },
  {
    title: "Medical Leave",
    total: 10,
    used: 2,
    available: 8,
    color: "#FFA000",
    icon: <FaBriefcaseMedical />,
  },
  {
    title: "Casual Leave",
    total: 12,
    used: 3,
    available: 9,
    color: "#0A8F08",
    icon: <FaLeaf />,
  },
  {
    title: "Sick Leave",
    total: 7,
    used: 1,
    available: 6,
    color: "#ff1717",
    icon: <FaRegSadTear />,
  },
];

const LeaveBalance = () => {
  return (
    <div className="leave-page">

      {/* Header */}

      <div className="leave-header">

        <h2>Leave Balance</h2>

        <div className="leave-breadcrumb">
          <FiHome />
          <FiChevronRight />
          <span>Leaves</span>
          <FiChevronRight />
          <span>Balance</span>
        </div>

      </div>

      {/* Cards */}

      <div className="leave-grid">

        {leaveData.map((item, index) => (

          <div className="leave-card" key={index}>

            <div className="leave-top">

              <h3>{item.title}</h3>

              <div
                className="leave-icon"
                style={{ background: item.color }}
              >
                {item.icon}
              </div>

            </div>

            <div className="leave-stats">

              <div>
                <small>Total</small>
                <h4>{item.total}</h4>
              </div>

              <div>
                <small>Used</small>
                <h4>{item.used}</h4>
              </div>

              <div>
                <small>Available</small>
                <h4
                  style={{
                    color: "#5d74f3",
                  }}
                >
                  {item.available}
                </h4>
              </div>

            </div>

            <div className="leave-progress">

              <div
                className="leave-progress-fill"
                style={{
                  width: `${(item.used / item.total) * 100}%`,
                }}
              ></div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default LeaveBalance;