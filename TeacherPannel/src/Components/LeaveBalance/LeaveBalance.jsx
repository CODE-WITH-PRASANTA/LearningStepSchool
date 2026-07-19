import React, { useEffect, useMemo, useState } from "react";
import "./LeaveBalance.css";
import API from "../../api/axios";

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

const LEAVE_CONFIG = [
  {
    title: "Earned Leave",
    type: "earned",
    total: 15,
    color: "#11d9e8",
    icon: <FiCalendar />,
  },
  {
    title: "Maternity Leave",
    type: "maternity",
    total: 10,
    color: "#FFA000",
    icon: <FaBriefcaseMedical />,
  },
  {
    title: "Casual Leave",
    type: "casual",
    total: 12,
    color: "#0A8F08",
    icon: <FaLeaf />,
  },
  {
    title: "Sick Leave",
    type: "sick",
    total: 7,
    color: "#ff1717",
    icon: <FaRegSadTear />,
  },
];

const LeaveBalance = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teacher/leaves");

      console.log("Leave Balance Data:", res.data);

      setLeaves(res.data);
    } catch (err) {
      console.error(
        "Leave Balance Error:",
        err.response?.data || err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const calculateLeaveDays = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);

    const difference = end - start;

    return Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1;
  };

  const leaveData = useMemo(() => {
    return LEAVE_CONFIG.map((config) => {
      const approvedLeaves = leaves.filter(
        (leave) =>
          leave.leaveType === config.type &&
          leave.status === "approved"
      );

      const used = approvedLeaves.reduce(
        (total, leave) => {
          return (
            total +
            calculateLeaveDays(
              leave.fromDate,
              leave.toDate
            )
          );
        },
        0
      );

      return {
        ...config,
        used,
        available: Math.max(config.total - used, 0),
      };
    });
  }, [leaves]);

  if (loading) {
    return (
      <div className="leave-page">
        <h3>Loading leave balance...</h3>
      </div>
    );
  }

  return (
    <div className="leave-page">
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

      <div className="leave-grid">
        {leaveData.map((item) => (
          <div className="leave-card" key={item.type}>
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

                <h4 style={{ color: "#5d74f3" }}>
                  {item.available}
                </h4>
              </div>
            </div>

            <div className="leave-progress">
              <div
                className="leave-progress-fill"
                style={{
                  width: `${Math.min(
                    (item.used / item.total) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveBalance;