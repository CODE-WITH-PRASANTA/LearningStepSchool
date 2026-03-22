import React, { useState } from "react";
import "./PaymentRecipt.css";
import { FaSearch, FaEye, FaDownload } from "react-icons/fa";

const PaymentRecipt = () => {
  const data = [
    { id: 1, receipt: 341, name: "lakh asda", admission: "NLET/45454", duration: "April", collected: "", status: "Paid", date: "21-03-2026", amount: 400 },
    { id: 2, receipt: 340, name: "lakh asda", admission: "NLET/45454", duration: "December", collected: "", status: "Paid", date: "21-03-2026", amount: 100 },
    { id: 3, receipt: 339, name: "Karan Aswani", admission: "NLET/111", duration: "", collected: "Super", status: "Paid", date: "21-03-2026", amount: 11202 },
    { id: 4, receipt: 338, name: "Nihal", admission: "NLET/1203564", duration: "Aug-Sep", collected: "Super", status: "Paid", date: "21-03-2026", amount: 59998 },
    { id: 5, receipt: 337, name: "Reyansh Mimani", admission: "NLET/7878", duration: "Apr-Mar", collected: "Super", status: "Paid", date: "21-03-2026", amount: 70000 },
    { id: 6, receipt: 336, name: "amit", admission: "NLET/12312", duration: "January", collected: "Super", status: "Paid", date: "21-03-2026", amount: 6310 },
    { id: 7, receipt: 335, name: "Arpit", admission: "NLET/78963", duration: "March", collected: "Super", status: "Paid", date: "19-03-2026", amount: 3000 },
    { id: 8, receipt: 334, name: "Kapil", admission: "NLET/222", duration: "Feb", collected: "Demo", status: "Paid", date: "18-03-2026", amount: 5400 },
    { id: 9, receipt: 333, name: "Ravi", admission: "NLET/333", duration: "Jan", collected: "Super", status: "Paid", date: "17-03-2026", amount: 2200 },
    { id: 10, receipt: 332, name: "Amit", admission: "NLET/444", duration: "March", collected: "Super", status: "Paid", date: "16-03-2026", amount: 1000 }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = data.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="paymentRecipt">

      {/* SELECT CRITERIA */}
      <div className="paymentRecipt-card">
        <div className="paymentRecipt-header">
          <h3>Select Criteria</h3>
        </div>

        <div className="paymentRecipt-form">
          <div className="paymentRecipt-field">
            <label>Receipt No</label>
            <input type="text" />
          </div>

          <div className="paymentRecipt-field">
            <label>Start Date</label>
            <input type="date" />
          </div>

          <div className="paymentRecipt-field">
            <label>End Date</label>
            <input type="date" />
          </div>

          <div className="paymentRecipt-search">
            <button><FaSearch /> Search</button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="paymentRecipt-card">
        <div className="paymentRecipt-header">
          <h3>Payment Receipt List</h3>
        </div>

        <div className="paymentRecipt-tableWrapper">
          <table className="paymentRecipt-table">
            <thead>
              <tr>
                <th>#</th>
                <th>RECEIPT NO</th>
                <th>NAME</th>
                <th>ADMISSION NO.</th>
                <th>DURATION</th>
                <th>COLLECTED BY</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>DISCOUNT</th>
                <th>ADDITION DISCOUNT</th>
                <th>MISC. CHARGES</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.receipt}</td>
                  <td>{item.name}</td>
                  <td>{item.admission}</td>
                  <td>{item.duration}</td>
                  <td>{item.collected}</td>
                  <td className="paid">{item.status}</td>
                  <td>{item.date}</td>
                  <td>{item.amount}</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>
                    <div className="paymentRecipt-actions">
                      <button className="view"><FaEye /></button>
                      <button className="download"><FaDownload /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="paymentRecipt-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentRecipt;