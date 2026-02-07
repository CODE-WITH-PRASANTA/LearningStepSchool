import React, { useState } from "react";
import "./AddIncome.css";

export default function AddIncome() {
  const accountOptions = [
    "Saving's A/C", "Salary", "Current", "Offical Account", "LIC Account",
    "Salary ACCOUNT TYPe", "Cash", "Building Construction", "Furniture & Fixtures",
    "Printing Stationary", "School", "Social Activity", "Library Fund",
    "Management", "Building", "Sports", "Donation", "Others",
  ];

  const [form, setForm] = useState({
    incomeHead: "",
    invoiceNo: "",
    accountType: "",
    accountName: "",
    incomeFrom: "",
    paymentType: "",
    amount: "",
    date: "",
    createdBy: "",
    approvedBy: "",
    document: null,
    description: "",
  });

  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, form]);
    setForm({
      incomeHead: "",
      invoiceNo: "",
      accountType: "",
      accountName: "",
      incomeFrom: "",
      paymentType: "",
      amount: "",
      date: "",
      createdBy: "",
      approvedBy: "",
      document: null,
      description: "",
    });
  };

  const handleDelete = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
  };

  return (
    <div className="income-container">

      {/* LEFT FORM (VERTICAL + HORIZONTAL FIX) */}
      <div className="form-scroll-x">
        <form className="income-form" onSubmit={handleSubmit}>
          <h2>Add Income</h2>

          <label>Income Head</label>
          <select name="incomeHead" value={form.incomeHead} onChange={handleChange}>
            <option value="">Select Income Head</option>
            {accountOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <label>Invoice Number</label>
          <input type="text" name="invoiceNo" value={form.invoiceNo} placeholder="Invoice Number" onChange={handleChange} />

          <label>Account Type</label>
          <select name="accountType" value={form.accountType} onChange={handleChange}>
            <option value="">Select Account Type</option>
            {accountOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <label>Account Name</label>
          <select name="accountName" value={form.accountName} onChange={handleChange}>
            <option value="">Select Account Name</option>
            {accountOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <label>Income From</label>
          <input type="text" name="incomeFrom" value={form.incomeFrom} placeholder="Income From..." onChange={handleChange} />

          <label>Payment Type</label>
          <select name="paymentType" value={form.paymentType} onChange={handleChange}>
            <option value="">Select Payment Type</option>
            <option>Cash</option>
            <option>Cheque</option>
            <option>Online</option>
          </select>

          <label>Amount</label>
          <input type="number" name="amount" value={form.amount} placeholder="Enter Amount" onChange={handleChange} />

          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />

          <label>Created By</label>
          <input type="text" name="createdBy" value={form.createdBy} placeholder="Created By" onChange={handleChange} />

          <label>Approved By</label>
          <input type="text" name="approvedBy" value={form.approvedBy} placeholder="Approved By" onChange={handleChange} />

          <label>Attach Document</label>
          <input type="file" name="document" onChange={handleChange} />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            placeholder="Write Description..."
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="btn-save">Save</button>
        </form>
      </div>

      {/* RIGHT TABLE */}
      <div className="income-list">
        <h2>Income List</h2>
        <input type="text" placeholder="Search Income..." className="search-box" />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Sl No.</th>
                <th>Income Head</th>
                <th>Invoice No</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Created By</th>
                <th>Approved By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No records found</td>
                </tr>
              ) : (
                records.map((rec, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{rec.incomeHead}</td>
                    <td>{rec.invoiceNo}</td>
                    <td>{rec.amount}</td>
                    <td>{rec.date}</td>
                    <td>{rec.createdBy}</td>
                    <td>{rec.approvedBy}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
