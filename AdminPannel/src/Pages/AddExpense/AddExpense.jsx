import React, { useState } from "react";
import "./AddExpense.css";
import { FaWallet, FaList, FaEdit } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";

const AddExpense = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const [formData, setFormData] = useState({
    head: "",
    name: "",
    accountNumber: "",
    invoice: "",
    amount: "",
    date: "",
    description: "",
  });

  const [expenses, setExpenses] = useState([
    {
      head: "Electricity",
      name: "Nikhil Sharma",
      accountNumber: "ACC001",
      invoice: "272",
      amount: "5500",
      date: "2026-02-23",
      description: "Electricity bill payment",
    },
    {
      head: "Transport",
      name: "Kapil",
      accountNumber: "ACC002",
      invoice: "270",
      amount: "10000",
      date: "2026-02-22",
      description: "Bus maintenance",
    },
    {
      head: "Salary",
      name: "Palak Garg",
      accountNumber: "ACC003",
      invoice: "269",
      amount: "12000",
      date: "2026-02-20",
      description: "Staff salary",
    },
  ]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SAVE EXPENSE
  const handleSave = () => {
    if (!formData.head || !formData.name || !formData.invoice || !formData.amount || !formData.date) {
      alert("Please fill all required fields!");
      return;
    }

    setExpenses([...expenses, formData]);

    // Clear form
    setFormData({
      head: "",
      name: "",
      accountNumber: "",
      invoice: "",
      amount: "",
      date: "",
      description: "",
    });
  };

  return (
    <div className="add-expense-page">

      {/* HEADER */}
      <div className="expense-header">
        <h2><FaWallet /> Add Expense</h2>
      </div>

      <div className="expense-layout">

        {/* LEFT FORM */}
        <div className="expense-form-card">
          <h3><FaEdit /> Add / Edit Expense</h3>

          <div className="form-scroll">

            <div className="form-group">
              <label>Expense Head *</label>
              <select name="head" value={formData.head} onChange={handleChange}>
                <option value="">Select</option>
                <option>Electricity</option>
                <option>Transport</option>
                <option>Salary</option>
              </select>
            </div>

            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                placeholder="Enter Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Invoice Number *</label>
              <input
                type="text"
                name="invoice"
                placeholder="Enter Invoice No"
                value={formData.invoice}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>Save Expense</button>
        </div>

        {/* RIGHT TABLE */}
        <div className="expense-table-card">
          <h3><FaList /> Expense List</h3>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Expense Head</th>
                  <th>Name</th>
                  <th>Account</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expenses.map((item, index) => (
                  <tr key={index}>
                    <td>{item.head}</td>
                    <td>{item.name}</td>
                    <td>{item.accountNumber}</td>
                    <td>₹ {item.amount}</td>
                    <td>{item.date}</td>

                    <td className="action-cell">
                      <BsThreeDotsVertical
                        className="action-icon"
                        onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                      />

                      {activeMenu === index && (
                        <div className="dropdown-menu">
                          <div className="dropdown-item">Edit</div>
                          <div className="dropdown-item delete">Delete</div>
                        </div>
                      )}
                    </td>

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

export default AddExpense;