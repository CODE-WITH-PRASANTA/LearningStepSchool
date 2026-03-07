import React, { useState } from "react";
import "./ExpenseHead.css";
import { FaEllipsisV } from "react-icons/fa";

const ExpenseHead = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const data = [
    { id: 1, name: "ABC Limited" },
    { id: 2, name: "Annual Wifi Charges" },
    { id: 3, name: "Books" },
    { id: 4, name: "books" },
    { id: 5, name: "BOOKS ( Foundation EXAM )" },
    { id: 6, name: "Chair" }
  ];

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <div className="expenseHead-wrapper">

      <div className="expenseHead-pageTitle">Expense Head</div>

      <div className="expenseHead-grid">

        {/* LEFT FORM */}
        <div className="expenseHead-card">
          <div className="expenseHead-cardHeader">Add / Edit Expense Head</div>

          <div className="expenseHead-form">
            <label>Expense Head *</label>
            <input type="text" placeholder="Enter Expense Head" />

            <label>Description</label>
            <textarea placeholder="Enter description" />

            <button className="expenseHead-saveBtn">Save</button>
          </div>
        </div>

        {/* RIGHT TABLE */}
        <div className="expenseHead-card">
          <div className="expenseHead-cardHeader">Expense Head List</div>

          <div className="expenseHead-tableWrap">
            <table className="expenseHead-table">
              <thead>
                <tr>
                  <th>EXPENSE HEAD</th>
                  <th style={{ width: "70px" }}>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>

                    <td className="expenseHead-actionCell">
                      <button
                        className="expenseHead-actionIcon"
                        onClick={() => toggleMenu(item.id)}
                      >
                        <FaEllipsisV size={16} />
                      </button>

                      {openMenu === item.id && (
                        <div className="expenseHead-menu">
                          <button>Edit</button>
                          <button className="delete">Delete</button>
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

export default ExpenseHead;