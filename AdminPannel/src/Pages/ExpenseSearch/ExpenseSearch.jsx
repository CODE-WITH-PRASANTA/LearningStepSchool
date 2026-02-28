// ExpenseSearch.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExpenseSearch.css";

const ExpenseSearch = () => {
  const base = "expense-search";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    head: "",
    payment: "",
    from: "",
    to: "",
    text: "",
  });

  const expenseHeads = ["ABC Limited", "Books", "XYZ"];
  const paymentModes = ["Cash", "Cheque", "UPI", "Card", "Bank Transfer"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // pass filter data to expense list page
    navigate("/expense-list", { state: form });
  };

  return (
    <div className={base}>
      {/* ===== HEADER ===== */}
      <div className={`${base}__header`}>
        <h2>Expense Search</h2>
        <p className={`${base}__breadcrumb`}>Expense / Expense Search</p>
      </div>

      {/* ===== CARD ===== */}
      <div className={`${base}__card`}>
        <div className={`${base}__cardHeader`}>
          <h3>Select Criteria</h3>
        </div>

        <div className={`${base}__form`}>
          {/* Expense Head */}
          <div className={`${base}__group`}>
            <label>Expense Head</label>
            <select name="head" value={form.head} onChange={handleChange}>
              <option value="">Select</option>
              {expenseHeads.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode */}
          <div className={`${base}__group`}>
            <label>Payment Mode</label>
            <select name="payment" value={form.payment} onChange={handleChange}>
              <option value="">Select</option>
              {paymentModes.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div className={`${base}__group`}>
            <label>Date From</label>
            <input type="date" name="from" value={form.from} onChange={handleChange} />
          </div>

          {/* Date To */}
          <div className={`${base}__group`}>
            <label>Date To</label>
            <input type="date" name="to" value={form.to} onChange={handleChange} />
          </div>

          {/* Search Text */}
          <div className={`${base}__group`}>
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
          <div className={`${base}__btnWrap`}>
            <button type="button" onClick={handleSearch} className={`${base}__btn`}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSearch;