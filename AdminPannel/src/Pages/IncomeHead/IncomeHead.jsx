import React, { useState } from "react";
import "./IncomeHead.css";
import { FaEdit, FaList, FaFilePdf, FaFileExcel, FaPrint } from "react-icons/fa";

const IncomeHead = () => {
  const [form, setForm] = useState({
    head: "",
    amount: "",
    action: "",
  });

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  const handleSave = () => {
    if (!form.head.trim() || !form.amount.trim()) {
      alert("Income Head and Amount are required!");
      return;
    }

    const newRecord = {
      head: form.head,
      amount: form.amount,
      action: form.action,
    };

    setRecords([...records, newRecord]);

    setForm({
      head: "",
      amount: "",
      action: "",
    });
  };

  return (
    <div className="income-head-page">
      <div className="page-header">
        <h2>Income Head</h2>
      </div>

      <div className="income-layout">
        {/* LEFT FORM */}
        <div className="form-box">
          <div className="form-title">
            <FaEdit className="form-title-icon" />
            <span>Add / Edit Income Head</span>
          </div>

          <div className="form-group">
            <label>
              Income Head <span className="req">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Income Head"
              value={form.head}
              onChange={(e) => setForm({ ...form, head: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>
              Amount <span className="req">*</span>
            </label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Action</label>
            <textarea
              placeholder="Enter Action"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
            ></textarea>
          </div>

          <button className="btn-save" onClick={handleSave}>Save</button>
        </div>

        {/* RIGHT TABLE */}
        <div className="list-box">
          <div className="list-title">
            <FaList className="list-title-icon" />
            <span>Income Head List</span>
          </div>

          <div className="list-toolbar">
            <div className="export-buttons">
              <button><FaFilePdf /></button>
              <button><FaFileExcel /></button>
              <button><FaPrint /></button>
            </div>

            <input
              type="text"
              className="table-search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table className="income-table">
              <thead>
                <tr>
                  <th>INCOME HEAD</th>
                  <th>AMOUNT</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="no-data">No Records Found</td>
                  </tr>
                ) : (
                  records
                    .filter((r) =>
                      r.head.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((rec, i) => (
                      <tr key={i}>
                        <td>{rec.head}</td>
                        <td>{rec.amount}</td>
                        <td>{rec.action}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncomeHead;
