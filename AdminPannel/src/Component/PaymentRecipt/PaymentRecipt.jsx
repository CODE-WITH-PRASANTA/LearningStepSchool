import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./PaymentRecipt.css";
import { FaSearch, FaEye, FaDownload } from "react-icons/fa";

const PaymentRecipt = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  // ✅ SAFETY FIX
  const currentData = Array.isArray(data)
    ? data.slice(indexOfFirst, indexOfLast)
    : [];

  const totalPages = Math.ceil((data || []).length / rowsPerPage);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await API.get("/admission/fees");
      setData(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  // ================= VIEW RECEIPT =================
  const handleView = (item) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h2 { text-align: center; }
            .box { border: 1px solid #000; padding: 20px; }
          </style>
        </head>
        <body>
          <h2>Payment Receipt</h2>
          <div class="box">
            <p><b>Receipt No:</b> ${item.receiptNo || "-"}</p>
            <p><b>Name:</b> ${item.name || "-"}</p>
            <p><b>Admission No:</b> ${item.admissionNo || "-"}</p>
            <p><b>Amount:</b> ₹${item.amount || 0}</p>
            <p><b>Paid:</b> ₹${item.paid || 0}</p>
            <p><b>Due:</b> ₹${item.due || 0}</p>
            <p><b>Status:</b> ${item.status || "-"}</p>
            <p><b>Date:</b> ${formatDate(item.date)}</p>
          </div>
        </body>
      </html>
    `);

    win.document.close();
  };

  // ================= DOWNLOAD RECEIPT =================
  const handleDownload = (item) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Receipt</title>
        </head>
        <body onload="window.print()">
          <h2 style="text-align:center;">Payment Receipt</h2>
          <p>Receipt No: ${item.receiptNo || "-"}</p>
          <p>Name: ${item.name || "-"}</p>
          <p>Admission No: ${item.admissionNo || "-"}</p>
          <p>Amount: ₹${item.amount || 0}</p>
          <p>Paid: ₹${item.paid || 0}</p>
          <p>Due: ₹${item.due || 0}</p>
          <p>Status: ${item.status || "-"}</p>
          <p>Date: ${formatDate(item.date)}</p>
        </body>
      </html>
    `);

    win.document.close();
  };

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
            <button>
              <FaSearch /> Search
            </button>
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
                <th>Receipt No</th>
                <th>Student Name</th>
                <th>Admission No</th>
                
                <th>Status</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{item.receiptNo || "-"}</td>
                  <td>{item.name || "-"}</td>
                  <td>{item.admissionNo || "-"}</td>
                 
                  <td className="paid">{item.status || "Paid"}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.amount || 0}</td>
                  <td>{item.discount || 0}%</td>
                  <td>{item.paid || 0}</td>
                  <td>
                    <div className="paymentRecipt-actions">
                      <button
                        className="view"
                        onClick={() => handleView(item)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="download"
                        onClick={() => handleDownload(item)}
                      >
                        <FaDownload />
                      </button>
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