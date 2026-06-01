import React, { useState } from "react";
import "./CollectMoney.css";
import { Eye } from "lucide-react";

const CollectMoney = () => {

  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Dummy Data
  const data = [
    {
      incomeMode: "School Fees",
      date: "06 May 2026",
      amount: 5000,
      paymentMode: "CASH",
      paidBy: "Rahul Sharma",
      timing: "10:30 AM",
      note: "Monthly school fees",
    },
    {
      incomeMode: "Bus Fees",
      date: "06 May 2026",
      amount: 2500,
      paymentMode: "UPI",
      paidBy: "Priya Das",
      timing: "11:15 AM",
      note: "Transport payment",
    },
    {
      incomeMode: "Exam Fees",
      date: "07 May 2026",
      amount: 1200,
      paymentMode: "CARD",
      paidBy: "Amit Kumar",
      timing: "01:20 PM",
      note: "Semester exam fees",
    },
    {
      incomeMode: "School Fees",
      date: "06 May 2026",
      amount: 5000,
      paymentMode: "CASH",
      paidBy: "Rahul Sharma",
      timing: "10:30 AM",
      note: "Monthly school fees",
    },
    {
      incomeMode: "Bus Fees",
      date: "06 May 2026",
      amount: 2500,
      paymentMode: "UPI",
      paidBy: "Priya Das",
      timing: "11:15 AM",
      note: "Transport payment",
    },
    {
      incomeMode: "School Fees",
      date: "06 May 2026",
      amount: 5000,
      paymentMode: "CASH",
      paidBy: "Rahul Sharma",
      timing: "10:30 AM",
      note: "Monthly school fees",
    },
    {
      incomeMode: "Bus Fees",
      date: "06 May 2026",
      amount: 2500,
      paymentMode: "UPI",
      paidBy: "Priya Das",
      timing: "11:15 AM",
      note: "Transport payment",
    },
    {
      incomeMode: "School Fees",
      date: "06 May 2026",
      amount: 5000,
      paymentMode: "CASH",
      paidBy: "Rahul Sharma",
      timing: "10:30 AM",
      note: "Monthly school fees",
    },
    {
      incomeMode: "Bus Fees",
      date: "06 May 2026",
      amount: 2500,
      paymentMode: "UPI",
      paidBy: "Priya Das",
      timing: "11:15 AM",
      note: "Transport payment",
    },
    {
      incomeMode: "School Fees",
      date: "06 May 2026",
      amount: 5000,
      paymentMode: "CASH",
      paidBy: "Rahul Sharma",
      timing: "10:30 AM",
      note: "Monthly school fees",
    },
    {
      incomeMode: "Bus Fees",
      date: "06 May 2026",
      amount: 2500,
      paymentMode: "UPI",
      paidBy: "Priya Das",
      timing: "11:15 AM",
      note: "Transport payment",
    },

    {
      incomeMode: "Hostel Fees",
      date: "08 May 2026",
      amount: 8000,
      paymentMode: "BANK",
      paidBy: "Sanjay Patel",
      timing: "03:45 PM",
      note: "Hostel payment",
    },
  ];

  const indexOfLast = currentPage * rowsPerPage;
  const currentData = data.slice(indexOfLast - rowsPerPage, indexOfLast);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="collectMoney">

      {/* TOP */}
      <div className="collectMoney__top">
        <button
          className="collectMoney__collectBtn"
          onClick={() => setOpenForm(true)}
        >
          Collect Fees
        </button>
      </div>

      {/* FILTER */}
      <div className="collectMoney__filters">

        <input placeholder="Search..." />

        <select>
          <option>All Income Modes</option>
        </select>

        <input type="date" />
        <input type="date" />

        <input placeholder="Min amount" />
        <input placeholder="Max amount" />

        <button className="apply">Apply</button>
        <button className="reset">Reset</button>

      </div>

      {/* GRID */}
      <div className="collectMoney__grid">

        {/* LEFT TABLE */}
        <div className="collectMoney__card">

          <h3>Collect Fees History</h3>
          <p className="subText">{data.length} records found</p>

          <div className="tableWrapper">

            <table>

              <thead>
                <tr>
                  <th>Income Mode</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Paid By</th>
                  <th>Timing</th>
                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {currentData.map((item, i) => (
                  <tr key={i}>

                    <td>{item.incomeMode}</td>

                    <td>{item.date}</td>

                    <td>₹{item.amount}</td>

                    <td>
                      <span className="badge debit">
                        {item.paymentMode}
                      </span>
                    </td>

                    <td>{item.paidBy}</td>

                    <td>{item.timing}</td>

                    <td>{item.note}</td>

                    <td>
                      <button
                        className="viewBtn"
                        onClick={() => setSelected(item)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          <div className="pagination">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
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
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="collectMoney__right">

          {/* MONTHLY REPORT */}
          <div className="collectMoney__card">

            <h3>Monthly Credit</h3>
            <p className="subText">Credit vs debit</p>

            <div className="reportBox">

              <div className="reportHeader">
                <span>May 2026</span>
                <span className="amountBlue">-₹1,24,437</span>
              </div>

              <div className="progressBar">
                <div className="bar"></div>
              </div>

              <div className="reportFooter">
                <span>Credit ₹0</span>
                <span>Debit ₹1,24,437</span>
              </div>

            </div>

          </div>

          {/* YEARLY REPORT */}
          <div className="collectMoney__card">

            <h3>Yearly Credit</h3>
            <p className="subText">Year summary</p>

            <div className="reportBox">

              <div className="reportHeader">
                <span>2026</span>
                <span className="amountBlue">-₹5,84,120</span>
              </div>

              <div className="progressBar">
                <div className="bar"></div>
              </div>

              <div className="reportFooter">
                <span>Credit ₹0</span>
                <span>Debit ₹5,84,120</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* VIEW MODAL */}
      {selected && (
        <div className="collectMoney__modal">

          <div className="collectMoney__popup">

            <div className="modalHeader">
              <h3>Fee Details</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="detailGrid">

              <div>
                <span>INCOME MODE</span>
                <p>{selected.incomeMode}</p>
              </div>

              <div>
                <span>DATE</span>
                <p>{selected.date}</p>
              </div>

              <div>
                <span>AMOUNT</span>
                <p>₹{selected.amount}</p>
              </div>

              <div>
                <span>PAYMENT MODE</span>
                <p>{selected.paymentMode}</p>
              </div>

              <div>
                <span>PAID BY</span>
                <p>{selected.paidBy}</p>
              </div>

              <div>
                <span>TIMING</span>
                <p>{selected.timing}</p>
              </div>

              <div className="full">
                <span>NOTE</span>
                <p>{selected.note}</p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* COLLECT FEES FORM */}
      {openForm && (
        <div className="collectMoney__modal">

          <div className="collectForm">

            <div className="modalHeader">
              <h3>Collect Fees</h3>
              <button onClick={() => setOpenForm(false)}>✕</button>
            </div>

            <div className="formGrid">

              <div className="formGroup">
                <label>Income Mode</label>

                <select>
                  <option>Select Income Mode</option>
                  <option>School Fees</option>
                  <option>Bus Fees</option>
                  <option>Exam Fees</option>
                  <option>Hostel Fees</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Date</label>
                <input type="date" />
              </div>

              <div className="formGroup">
                <label>Amount</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                />
              </div>

              <div className="formGroup">
                <label>Payment Mode</label>

                <select>
                  <option>Select Payment Mode</option>
                  <option>CASH</option>
                  <option>CARD</option>
                  <option>BANK</option>
                  <option>UPI</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Paid By Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                />
              </div>

              <div className="formGroup">
                <label>Timing</label>
                <input type="time" />
              </div>

              <div className="formGroup fullWidth">
                <label>Note</label>

                <textarea
                  placeholder="Enter note"
                ></textarea>
              </div>

            </div>

            <div className="formActions">

              <button
                className="cancelBtn"
                onClick={() => setOpenForm(false)}
              >
                Cancel
              </button>

              <button className="saveBtn">
                Collect
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default CollectMoney;