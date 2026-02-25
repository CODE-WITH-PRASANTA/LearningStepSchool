import React, { useState } from "react";
import "./SearchIncome.css";
import { FaSearch } from "react-icons/fa";

const SearchIncome = () => {

  const incomeHeadOptions = [
    "Admission Fee",
    "Scholarship",
    "Donation",
    "Medical Camp",
    "Registration Fee",
    "Annual Function",
    "Science Exhibition",
    "Exam Fee"
  ];

  const [records] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      invoice: "INV-1001",
      mode: "Cash",
      head: "Admission Fee",
      date: "12-02-2026",
      desc: "New Admission",
      amount: "5000"
    },
    {
      id: 2,
      name: "Priya Singh",
      invoice: "INV-1002",
      mode: "Online",
      head: "Exam Fee",
      date: "15-02-2026",
      desc: "Final Exam",
      amount: "2000"
    },
    {
      id: 3,
      name: "Amit Verma",
      invoice: "INV-1003",
      mode: "Cheque",
      head: "Donation",
      date: "18-02-2026",
      desc: "School Donation",
      amount: "10000"
    }
  ]);

  return (
    <div className="income-page">

      {/* HEADER */}
      <div className="page-header">
        <FaSearch className="header-icon" />
        <h2>Income Search</h2>
        <span className="breadcrumb">Income / Income Search</span>
      </div>

      {/* FILTER SECTION */}
      <div className="filter-box">

        <h3 className="section-title">Select Criteria</h3>

        <div className="filter-grid">

          <div className="form-group">
            <label>Income Head</label>
            <select>
              <option>Select Income Head</option>
              {incomeHeadOptions.map((item, i) => (
                <option key={i}>{item}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date From</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Date To</label>
            <input type="date" />
          </div>

          <div className="form-group">
            <label>Search</label>
            <input type="text" placeholder="Search by Name or Invoice" />
          </div>

        </div>

        <div className="search-btn-wrapper">
          <button className="primary-btn">
            <FaSearch /> Search
          </button>
        </div>

      </div>

      {/* LIST SECTION */}
      <div className="list-box">

        <h3 className="section-title">Search Income List</h3>

        <div className="list-toolbar">

          <div className="table-tools">
            <select>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>

            <input type="text" placeholder="Search..." />
          </div>

        </div>

        <div className="table-wrapper">
          <table className="income-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Invoice Number</th>
                <th>Payment Mode</th>
                <th>Income Head</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount (Rs)</th>
              </tr>
            </thead>

            <tbody>
              {records.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.invoice}</td>
                  <td>{item.mode}</td>
                  <td>{item.head}</td>
                  <td>{item.date}</td>
                  <td>{item.desc}</td>
                  <td className="amount">₹ {item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default SearchIncome;