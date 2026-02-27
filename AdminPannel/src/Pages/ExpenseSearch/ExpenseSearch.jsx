import React, { useState } from "react";
import "./ExpenseSearch.css";

const ExpenseSearch = () => {
  const [form, setForm] = useState({
    head: "",
    payment: "",
    from: "",
    to: "",
    text: ""
  });

  const expenseHeads = ["ABC Limited", "Books", "XYZ"];
  const paymentModes = ["Cash", "Cheque", "UPI", "Card", "Bank Transfer"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="expenseSearch-wrapper">
      {/* ===== PAGE HEADER ===== */}
      <div className="expenseSearch-header">
        <h2>Expense Search</h2>
        <p className="breadcrumb">Expense / Expense Search</p>
      </div>

      {/* ===== CARD ===== */}
      <div className="expenseSearch-card">
        <div className="expenseSearch-cardHeader">
          <h3>Select Criteria</h3>
        </div>

        {/* ===== FORM ===== */}
        <div className="expenseSearch-form">

          {/* Expense Head */}
          <div className="form-group">
            <label>Expense Head</label>
            <select name="head" value={form.head} onChange={handleChange}>
              <option value="">Select</option>
              {expenseHeads.map((item, i) => (
                <option key={i}>{item}</option>
              ))}
            </select>
          </div>

          {/* Payment Mode */}
          <div className="form-group">
            <label>Payment Mode</label>
            <select name="payment" value={form.payment} onChange={handleChange}>
              <option value="">Select</option>
              {paymentModes.map((item, i) => (
                <option key={i}>{item}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className="form-group">
            <label>Date From</label>
            <input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
            />
          </div>

          {/* Date To */}
          <div className="form-group">
            <label>Date To</label>
            <input
              type="date"
              name="to"
              value={form.to}
              onChange={handleChange}
            />
          </div>

          {/* Search Text */}
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              name="text"
              placeholder="Search by Expense"
              value={form.text}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <div className="form-btn">
            <button className="search-btn">Search</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExpenseSearch;