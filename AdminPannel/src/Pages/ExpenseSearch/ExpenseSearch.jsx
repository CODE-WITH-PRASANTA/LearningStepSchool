import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ExpenseSearch.css";
import API from "../../api/axios";
import Swal from "sweetalert2";

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

  const [loading, setLoading] = useState(false);

  const [expenseHeads, setExpenseHeads] = useState([]);
  const paymentModes = ["Cash", "Cheque", "UPI", "Card", "Bank Transfer"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isEmpty = Object.values(form).every((v) => !v);

  useEffect(() => {
    fetchExpenseHeads();
  }, []);

  const fetchExpenseHeads = async () => {
    try {
      const res = await API.get("/expense-heads");
      setExpenseHeads(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = async () => {
    if (loading) return;

    try {
      if (form.from && form.to && form.from > form.to) {
        return Swal.fire("Error", "Invalid date range ❌", "error");
      }

      setLoading(true);

      const params = {};
      Object.keys(form).forEach((key) => {
        if (form[key]) params[key] = form[key];
      });

      const res = await API.get("/expenses/search", { params });

      if (!res.data.length) {
        return Swal.fire("No Data", "No expenses found ❌", "info");
      }

      navigate("/expense-list", { state: form });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Search failed ❌",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      head: "",
      payment: "",
      from: "",
      to: "",
      text: "",
    });

    // optional focus
    document.querySelector('input[name="text"]')?.focus();
  };

  return (
    <div className={base}>
      {/* HEADER */}
      <div className={`${base}__header`}>
        <div>
          <h2>Expense Search</h2>
          <p className={`${base}__breadcrumb`}>Dashboard / Expense / Search</p>
        </div>
      </div>

      {/* CARD */}
      <div className={`${base}__card`}>
        <div className={`${base}__cardHeader`}>
          <h3>Filter Expenses</h3>
        </div>

        <div className={`${base}__form`}>
          {/* Expense Head */}
          <div className={`${base}__group`}>
            <label>Expense Head</label>
            <select
              name="head"
              value={form.head}
              onChange={handleChange}
              disabled={expenseHeads.length === 0}
            >
              {" "}
              <option value="">Select</option>
              {expenseHeads.length === 0 && (
                <option disabled>No Expense Head Found</option>
              )}
              {expenseHeads.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name}
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
            <input
              type="date"
              name="from"
              value={form.from}
              onChange={handleChange}
              max={form.to || ""}
            />
          </div>

          {/* Date To */}
          <div className={`${base}__group`}>
            <label>Date To</label>
            <input
              type="date"
              name="to"
              value={form.to}
              onChange={handleChange}
              min={form.from || ""}
            />
          </div>

          {/* Search */}
          <div className={`${base}__group`}>
            <label>Search</label>
            <input
              type="text"
              name="text"
              placeholder="Search expenses..."
              value={form.text}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Button */}
          <div className={`${base}__btnWrap`}>
            <button
              onClick={handleSearch}
              disabled={loading || isEmpty}
              className={`${base}__btn`}
            >
              {loading ? "Searching..." : "🔍 Search"}
            </button>

            <button onClick={handleReset} className={`${base}__reset`}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSearch;
