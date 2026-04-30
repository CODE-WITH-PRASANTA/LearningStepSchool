import React, { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import "./PayrollList.css";

const payrollData = [
  {
    id: 1,
    name: "James Anderson",
    avatar: "https://i.pravatar.cc/40?img=12",
    department: "Back-End Developer",
    totalDays: 30,
    workingDay: 27,
    salary: "$22,250",
    overtime: "$1500",
    status: "Completed",
  },
  {
    id: 2,
    name: "William Johnson",
    avatar: "https://i.pravatar.cc/40?img=32",
    department: "Full-Stack Developer",
    totalDays: 29,
    workingDay: 18,
    salary: "$21,2500",
    overtime: "$1800",
    status: "Completed",
  },
  {
    id: 3,
    name: "Benjamin Martinez",
    avatar: "https://i.pravatar.cc/40?img=15",
    department: "Mobile App Developer",
    totalDays: 28,
    workingDay: 4,
    salary: "$22,250",
    overtime: "$2900",
    status: "Reject",
  },
  {
    id: 4,
    name: "Michael Davis",
    avatar: "https://i.pravatar.cc/40?img=19",
    department: "UI/UX Designer",
    totalDays: 27,
    workingDay: 27,
    salary: "$86,000",
    overtime: "$400",
    status: "Pending",
  },
  {
    id: 5,
    name: "Matthew Taylor",
    avatar: "https://i.pravatar.cc/40?img=26",
    department: "DevOps Engineer",
    totalDays: 26,
    workingDay: 30,
    salary: "$12,000",
    overtime: "$700",
    status: "Pending",
  },
];

const PayrollList = () => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);

  const filtered = useMemo(() => {
    return payrollData.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const statusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Pending") return "pending";
    return "reject";
  };

  const handleEdit = (name) => {
    alert(`Edit ${name}`);
    setMenuOpen(null);
  };

  const handleDelete = (name) => {
    alert(`Delete ${name}`);
    setMenuOpen(null);
  };

  return (
    <div className="payroll-list-wrapper">
      {/* Top */}
      <div className="payroll-list-top">
        <h2>Payroll List</h2>

        <div className="top-actions">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="download-report-btn">
            Download Report
          </button>

          <div className="year-dropdown">
            <select>
              <option>2024</option>
              <option>2023</option>
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="payroll-table-wrap">
        <table className="payroll-table">
          <thead>
            <tr>
              <th></th>
              <th>Name ⇅</th>
              <th>Department ⇅</th>
              <th>Total Days ⇅</th>
              <th>Working Day ⇅</th>
              <th>Total Salary ⇅</th>
              <th>Over Time ⇅</th>
              <th>Status ⇅</th>
              <th>Action ⇅</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <input type="checkbox" />
                </td>

                <td>
                  <div className="user-info">
                    <img src={item.avatar} alt="" />
                    <span>{item.name}</span>
                  </div>
                </td>

                <td>{item.department}</td>
                <td>{item.totalDays} Days</td>
                <td>{item.workingDay} Days</td>
                <td>{item.salary}</td>
                <td>{item.overtime}</td>

                <td>
                  <span className={`status-badge ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td className="action-cell">
                  <button
                    className="action-btn"
                    onClick={() =>
                      setMenuOpen(
                        menuOpen === item.id ? null : item.id
                      )
                    }
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuOpen === item.id && (
                    <div className="action-menu">
                      <button
                        onClick={() => handleEdit(item.name)}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.name)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;