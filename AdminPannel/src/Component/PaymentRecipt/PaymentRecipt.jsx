import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import "./PaymentRecipt.css";
import { FaSearch, FaEye, FaDownload } from "react-icons/fa";
import logo from "../../Assets/Learning-Step-Logo-1.png";

const PaymentRecipt = () => {
  const [searchData, setSearchData] = useState({
    receiptNo: "",
    startDate: "",
    endDate: "",
  });
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const filteredData = data.filter((item) => {
    const receiptMatch = searchData.receiptNo
      ? String(item.receiptNo || "")
          .toLowerCase()
          .includes(searchData.receiptNo.toLowerCase())
      : true;

    const itemDate = new Date(item.date);

    const startMatch = searchData.startDate
      ? itemDate >= new Date(searchData.startDate)
      : true;

    const endMatch = searchData.endDate
      ? itemDate <= new Date(searchData.endDate)
      : true;

    return receiptMatch && startMatch && endMatch;
  });

  // ✅ SAFETY FIX
  const currentData = Array.isArray(filteredData)
    ? filteredData.slice(indexOfFirst, indexOfLast)
    : [];

  const totalPages = Math.ceil((filteredData || []).length / rowsPerPage);

  useEffect(() => {
    fetchFees();
  }, []);

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleView = (item) => {
    const win = window.open("", "_blank");

    const logoUrl = logo; // ✅ your imported logo

    const total = item.amount || 0;
    const discountAmount = (total * (item.discount || 0)) / 100;
    const finalAmount = total - discountAmount;

    win.document.write(`
  <html>
    <head>
      <title>Receipt</title>
      <style>
        body {
          font-family: Arial;
          padding: 20px;
          background: #f5f5f5;
        }

        .receipt {
          width: 800px;
          margin: auto;
          background: #fff;
          border: 2px solid #000;
          padding: 15px;
        }

        /* HEADER */
        .header-table {
          width: 100%;
          border-bottom: 2px solid #000;
        }

        .header-table td {
          border: none;
        }

        .logo {
          width: 80px;
        }

        .school-info {
          text-align: center;
        }

        /* TABLES */
        .info-table, .fee-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        td, th {
          border: 1px solid #000;
          padding: 8px;
          font-size: 14px;
        }

        th {
          background: #d1e7dd;
        }

        /* FOOTER */
        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          align-items: center;
        }

        .qr {
          width: 100px;
          height: 100px;
          border: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sign {
          text-align: right;
        }

      </style>
    </head>

    <body>
      <div class="receipt">

        <!-- HEADER WITH LOGO -->
        <table class="header-table">
          <tr>
            <td style="width:100px;">
              <img src="${logoUrl}" class="logo" onerror="this.style.display='none'" />
            </td>

            <td class="school-info">
              <h2>Learning Step International School</h2>
              <p>Tehla Bypass, Alwar Road, Rajgarh – 301408</p>
              <b>FEE RECEIPT</b>
            </td>

            <td style="width:100px;"></td>
          </tr>
        </table>

        <!-- STUDENT INFO -->
        <table class="info-table">
          <tr>
            <td><b>Receipt No:</b> ${item.receiptNo || "-"}</td>
            <td><b>Date:</b> ${formatDate(item.date)}</td>
          </tr>
          <tr>
            <td><b>Name:</b> ${item.name || "-"}</td>
            <td><b>Admission No:</b> ${item.admissionNo || "-"}</td>
          </tr>
          <tr>
            <td><b>Class:</b> ${item.class || "-"}</td>
            <td><b>Roll:</b> ${item.rollNumber || "-"}</td>
          </tr>
          <tr>
            <td><b>Mode:</b> ${item.paymentMethod || "-"}</td>
            <td><b>Status:</b> ${item.status || "-"}</td>
          </tr>
        </table>

        <!-- FEE TABLE -->
        <table class="fee-table">
          <tr>
            <th>Fee Type</th>
            <th>Amount</th>
          </tr>

          <tr>
            <td>${item.feeType || "Fee"}</td>
            <td>₹ ${item.amount || 0}</td>
          </tr>

          <tr>
            <td><b>Total</b></td>
            <td>₹ ${total}</td>
          </tr>

          <tr>
            <td>Discount (${item.discount || 0}%)</td>
            <td>- ₹ ${discountAmount}</td>
          </tr>

          <tr>
            <td><b>Final Amount</b></td>
            <td>₹ ${finalAmount}</td>
          </tr>

          <tr>
            <td>Paid</td>
            <td>₹ ${item.paid || 0}</td>
          </tr>

          <tr>
            <td>Due</td>
            <td>₹ ${item.due || 0}</td>
          </tr>
        </table>

        <!-- FOOTER -->
        <div class="footer">
          <div class="qr">QR</div>

          <div class="sign">
            ___________________<br/>
            Authorized Signature
          </div>
        </div>

      </div>
    </body>
  </html>
  `);

    win.document.close();
  };

  // ================= DOWNLOAD RECEIPT =================
  const handleDownload = (item) => {
    const win = window.open("", "_blank");

    const logoUrl = logo;

    // ✅ SAFE FEES (fallback if empty)
    const fees =
      Array.isArray(item.fees) && item.fees.length > 0
        ? item.fees
        : [{ type: "Fee", amount: item.amount || 0 }];

    // ✅ ROWS
    const feeRows = fees
      .map(
        (f) => `
      <tr>
        <td>${f.type || "-"}</td>
        <td>₹ ${f.amount || 0}</td>
      </tr>
    `,
      )
      .join("");

    // ✅ USE BACKEND VALUES (BEST)
    const total =
      item.totalAmount ||
      fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);

    const discount = Number(item.discount || 0);

    const discountAmount = item.discountAmount || (total * discount) / 100;

    const finalAmount = item.finalAmount || total - discountAmount;

    win.document.write(`
  <html>
    <head>
      <title>Fee Receipt</title>
      <style>
        body {
          font-family: Arial;
          padding: 20px;
          background: #f5f5f5;
        }

        .receipt {
          width: 800px;
          margin: auto;
          background: #fff;
          border: 2px solid #000;
          padding: 15px;
        }

        .header-table {
          width: 100%;
          border-bottom: 2px solid #000;
        }

        .header-table td {
          border: none;
        }

        .logo {
          width: 80px;
        }

        .school-info {
          text-align: center;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        td, th {
          border: 1px solid #000;
          padding: 8px;
          font-size: 14px;
        }

        th {
          background: #d1e7dd;
        }

        .summary {
          font-weight: bold;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          align-items: center;
        }

        .qr {
          width: 100px;
          height: 100px;
          border: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sign {
          text-align: right;
        }

      </style>
    </head>

    <body onload="window.print()">
      <div class="receipt">

        <!-- HEADER -->
        <table class="header-table">
          <tr>
            <td style="width:100px;">
              <img src="${logoUrl}" class="logo" onerror="this.style.display='none'" />
            </td>

            <td class="school-info">
              <h2>Learning Step International School</h2>
              <p>Tehla Bypass, Alwar Road, Rajgarh – 301408</p>
              <b>FEE RECEIPT</b>
            </td>

            <td style="width:100px;"></td>
          </tr>
        </table>

        <!-- INFO -->
        <table>
          <tr>
            <td><b>Receipt No:</b> ${item.receiptNo || "-"}</td>
            <td><b>Date:</b> ${formatDate(item.date)}</td>
          </tr>
          <tr>
            <td><b>Student Name:</b> ${item.name || "-"}</td>
            <td><b>Admission No:</b> ${item.admissionNo || "-"}</td>
          </tr>
          <tr>
            <td><b>Class:</b> ${item.class || "-"}</td>
            <td><b>Roll No:</b> ${item.rollNumber || "-"}</td>
          </tr>
          <tr>
            <td><b>Payment Mode:</b> ${item.paymentMethod || "-"}</td>
            <td><b>Status:</b> ${item.status || "-"}</td>
          </tr>
        </table>

        <!-- FEES -->
        <table>
          <tr>
            <th>Fee Type</th>
            <th>Amount</th>
          </tr>

          ${feeRows}

          <tr class="summary">
            <td>Total</td>
            <td>₹ ${total}</td>
          </tr>

          <tr>
            <td>Discount (${discount}%)</td>
            <td>- ₹ ${discountAmount}</td>
          </tr>

          <tr class="summary">
            <td>Final Amount</td>
            <td>₹ ${finalAmount}</td>
          </tr>

          <tr>
            <td>Paid</td>
            <td>₹ ${item.paid || 0}</td>
          </tr>

          <tr>
            <td>Due</td>
            <td>₹ ${item.due || 0}</td>
          </tr>
        </table>

        <!-- FOOTER -->
        <div class="footer">
          <div class="qr">QR</div>
          <div class="sign">
            ___________________<br/>
            Authorized Signature
          </div>
        </div>

      </div>
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
            <input
              type="text"
              name="receiptNo"
              value={searchData.receiptNo}
              onChange={handleChange}
            />
          </div>

          <div className="paymentRecipt-field">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={searchData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="paymentRecipt-field">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={searchData.endDate}
              onChange={handleChange}
            />
          </div>

          {/* <div className="paymentRecipt-search">
            <button>
              <FaSearch /> Search
            </button>
          </div> */}
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
                <th>Fee Types</th>

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
                  <td>{item.feeType || "-"}</td>

                  <td className="paid">{item.status || "Paid"}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.amount || 0}</td>
                  <td>{item.discount || 0}%</td>
                  <td>{item.paid || 0}</td>
                  <td>
                    <div className="paymentRecipt-actions">
                      <button className="view" onClick={() => handleView(item)}>
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
