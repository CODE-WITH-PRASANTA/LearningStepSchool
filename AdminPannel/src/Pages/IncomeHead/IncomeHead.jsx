import React, { useState } from "react";
import "./IncomeHead.css";

const IncomeHead = () => {

  const [form, setForm] = useState({
    head: "",
    amount: "",
    action: "",
  });

  const [records, setRecords] = useState([
    { head: "Admission Fee", amount: "5000", action: "New student entry" },
    { head: "Exam Fee", amount: "2000", action: "Final term exam" },
    { head: "Donation", amount: "10000", action: "School development" }
  ]);

  const [search, setSearch] = useState("");

  const handleSave = () => {
    if (!form.head.trim() || !form.amount.trim()) {
      alert("Income Head and Amount are required!");
      return;
    }

    setRecords([...records, form]);

    setForm({
      head: "",
      amount: "",
      action: "",
    });
  };

  return (
    <div className="income-head-page">

      <div className="page-header">
        <h2>Income Head Management</h2>
      </div>

      <div className="income-layout">

        {/* LEFT FORM */}
        <div className="form-box">
          <h3 className="box-title">Add / Edit Income Head</h3>

          <div className="form-group">
            <label>Income Head <span>*</span></label>
            <input
              type="text"
              placeholder="Enter Income Head"
              value={form.head}
              onChange={(e) => setForm({ ...form, head: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Amount <span>*</span></label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter Description"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
            />
          </div>

          <button className="btn-save" onClick={handleSave}>
            Save Income Head
          </button>
        </div>

        {/* RIGHT TABLE */}
        <div className="list-box small-table">
          <h3 className="box-title">Income Head List</h3>

          <div className="table-toolbar">
            <input
              type="text"
              placeholder="Search Income Head..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="income-table">
              <thead>
                <tr>
                  <th>Income Head</th>
                  <th>Amount (₹)</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {records
                  .filter((r) =>
                    r.head.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((rec, i) => (
                    <tr key={i}>
                      <td>{rec.head}</td>
                      <td className="amount">₹ {rec.amount}</td>
                      <td>{rec.action}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default IncomeHead;