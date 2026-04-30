import React, { useMemo, useState, useEffect } from "react";
import { Search, ChevronDown, MoreHorizontal } from "lucide-react";
import "./PayrollList.css";
import API, { IMAGE_URL } from "../../api/axios";

const PayrollList = ({ refresh, onEdit }) => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayrolls = async () => {
    try {
      const res = await API.get("/payroll");
      setPayrollData(res.data.data || res.data || []); // handle both shapes
      // console.log("Payrolls fetched:", res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [refresh]);

  const filtered = useMemo(() => {
    return payrollData.filter(
      (item) =>
        item.teacherId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.teacherId?.department
          ?.toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [search, payrollData]);

  const statusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Pending") return "pending";
    return "reject";
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/payroll/${id}`);
      setPayrollData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    onEdit(item);
    setMenuOpen(null);
  };

  if (loading) return <h3>Loading payroll...</h3>;

  return (
    <div className="payroll-list-wrapper">
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

          <button className="download-report-btn">Download Report</button>

          <div className="year-dropdown">
            <select>
              <option>2024</option>
              <option>2023</option>
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="payroll-table-wrap">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Month</th>
              <th>Year</th>
              <th>Total Days</th>
              <th>Working Days</th>
              <th>Total Salary</th>
              <th>Overtime</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="user-info">
                    <img
                      src={
                        item.teacherId?.image
                          ? `${IMAGE_URL}${item.teacherId.image}`
                          : "https://i.pravatar.cc/40"
                      }
                      alt={item.teacherId?.name}
                    />
                    <span>{item.teacherId?.name || "N/A"}</span>
                  </div>
                </td>

                <td>{item.teacherId?.department || "-"}</td>

                <td>{item.month}</td>
                <td>{item.year}</td>

                <td>{item.totalDays}</td>
                <td>{item.workingDays}</td>
                <td>₹{item.totalSalary}</td>
                <td>₹{item.overtimeAmount}</td>

                <td>
                  <span className={`status-badge ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>

                <td className="action-cell">
                  <button
                    className="action-btn"
                    onClick={() =>
                      setMenuOpen(menuOpen === item._id ? null : item._id)
                    }
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuOpen === item._id && (
                    <div className="action-menu">
                      <button onClick={() => handleEdit(item)}>Edit</button>
                      <button onClick={() => handleDelete(item._id)}>
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
