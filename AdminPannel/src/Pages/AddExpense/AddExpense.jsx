import React, { useState, useEffect, useRef } from "react";
import "./AddExpense.css";
import { FaWallet } from "react-icons/fa";
import Swal from "sweetalert2";

const AddExpense = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    head: "",
    accountType: "",
    accountName: "",
    name: "",
    amount: "",
    invoice: "",
    date: "",
    paymentMode: "",
    description: "",
  });

  const expenseHeads = ["Electricity", "Kitchen", "Transport", "Books"];
  const accountTypes = ["Savings", "Salary", "Current"];
  const paymentModes = ["Cash", "Cheque", "Online"];

  const [expenses, setExpenses] = useState([]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setExpenses([...expenses, formData]);
  };

  // DELETE FUNCTION
  const handleDelete = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This expense will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = [...expenses];
        updated.splice(index, 1);
        setExpenses(updated);

        Swal.fire({
          title: "Deleted!",
          text: "Expense has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // PAGINATION LOGIC
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = expenses.slice(indexOfFirst, indexOfLast);

  return (
    <div className="ae-page">

      {/* HEADER */}
      <div className="ae-header">
        <div className="ae-header-left">
          <FaWallet className="ae-icon" />
          <h2>Add Expense</h2>
        </div>
        <span className="ae-breadcrumb">Expense / Add Expense</span>
      </div>

      <div className="ae-layout">

        {/* ================= FORM ================= */}
        <div className="ae-card">
          <div className="ae-card-top">✏ Add / Edit Expense</div>

          <div className="ae-form ae-scroll">

            <div className="ae-field">
              <label>Expense Head *</label>
              <select name="head" onChange={handleChange}>
                <option>Select</option>
                {expenseHeads.map((e, i) => (
                  <option key={i}>{e}</option>
                ))}
              </select>
            </div>

            <div className="ae-field">
              <label>Account Type</label>
              <select name="accountType" onChange={handleChange}>
                <option>Select</option>
                {accountTypes.map((e, i) => (
                  <option key={i}>{e}</option>
                ))}
              </select>
            </div>

            <div className="ae-field">
              <label>Account Name</label>
              <select name="accountName" onChange={handleChange}>
                <option>Select</option>
                <option>Office Account</option>
              </select>
            </div>

            <div className="ae-field">
              <label>Name *</label>
              <input name="name" onChange={handleChange} />
            </div>

            <div className="ae-field">
              <label>Amount *</label>
              <input name="amount" />
            </div>

            <div className="ae-field">
              <label>Invoice No *</label>
              <input name="invoice" />
            </div>

            <div className="ae-field">
              <label>Date *</label>
              <input type="date" name="date" />
            </div>

            <div className="ae-field">
              <label>Payment Mode *</label>
              <select name="paymentMode">
                <option>Select</option>
                {paymentModes.map((e, i) => (
                  <option key={i}>{e}</option>
                ))}
              </select>
            </div>

            <div className="ae-field">
              <label>Description</label>
              <textarea />
            </div>

            <button className="ae-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="ae-card">
          <div className="ae-card-top">📋 Expense List</div>

          <div className="ae-table-top">
            <div>
              Show <select><option>5</option></select>
            </div>
            <div>
              Search: <input />
            </div>
          </div>

          <div className="ae-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>HEAD</th>
                  <th>NAME</th>
                  <th>ACCOUNT</th>
                  <th>INVOICE</th>
                  <th>AMOUNT</th>
                  <th>DATE</th>
                  <th>DESCRIPTION</th>
                  <th>CREATED BY</th>
                  <th>APPROVED BY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((e, i) => {
                  const realIndex = indexOfFirst + i;

                  return (
                    <tr key={i}>
                      <td>{e.head}</td>
                      <td>{e.name}</td>
                      <td>{e.accountName}</td>
                      <td>{e.invoice}</td>
                      <td>{e.amount}</td>
                      <td>{e.date}</td>
                      <td>{e.description}</td>
                      <td>Admin</td>
                      <td>-</td>

                      <td className="ae-action">
                        <button
                          onClick={() => setActiveMenu(realIndex)}
                          className="ae-action-btn"
                        >
                          Action
                        </button>

                        {activeMenu === realIndex && (
                          <div className="ae-dropdown" ref={menuRef}>
                            <div>View</div>
                            <div>Edit</div>
                            <div
                              className="del"
                              onClick={() => handleDelete(realIndex)}
                            >
                              🗑 Delete
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="ae-pagination">
              <span>
                Showing {indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, expenses.length)} of{" "}
                {expenses.length} entries
              </span>

              <div className="ae-pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AddExpense;