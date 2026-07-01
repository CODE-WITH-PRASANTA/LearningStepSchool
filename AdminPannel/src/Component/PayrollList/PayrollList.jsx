import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  RotateCcw,
  X,
  Printer,
} from "lucide-react";
import API, { IMAGE_URL } from "../../api/axios";
import "./PayrollList.css";
import schoolLogo from "../../assets/Learning-Step-Logo-1.png";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getTeacherImage = (image) => {
  if (!image) return "https://i.pravatar.cc/100";
  if (image.startsWith("http")) return image;
  const normalizedImage = image.replace(/\\/g, "/");
  return normalizedImage.startsWith("/")
    ? `${IMAGE_URL}${normalizedImage}`
    : `${IMAGE_URL}/${normalizedImage}`;
};

const normalizePayroll = (item) => {
  const teacher = item.teacherId || {};

  return {
    ...item,
    teacherObjectId: teacher._id || item.teacherId,
    teacher: teacher.name || "N/A",
    department: teacher.department || "-",
    email: teacher.email || "",
    image: teacher.image || "",
    monthName: monthNames[(Number(item.month) || 1) - 1] || item.month,
    absentDays:
      item.absentDays ??
      Math.max((item.totalDays || 0) - (item.workingDays || 0), 0),
    leaveDays: item.leaveDays || 0,
    presentDays: item.presentDays || 0,
  };
};

const PayrollList = ({ refresh, onEdit }) => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));

  const [month, setMonth] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const payslipPrintRef = useRef(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentMode: "",
    paymentDate: "",
    note: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [showBulkPaymentModal, setShowBulkPaymentModal] = useState(false);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/payroll", {
        params: {
          year,
          month,
        },
      });
      setPayrollData((res.data?.data || []).map(normalizePayroll));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payroll.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [refresh, year, month]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    return payrollData.filter(
      (item) =>
        item.teacher.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query),
    );
  }, [search, payrollData]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const dataYears = payrollData
      .map((item) => Number(item.year))
      .filter(Boolean);
    return [
      ...new Set([currentYear, currentYear - 1, currentYear - 2, ...dataYears]),
    ].sort((a, b) => b - a);
  }, [payrollData]);

  const statusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "Pending") return "pending";
    return "reject";
  };

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }

      return [...prev, id];
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filtered.map((item) => item._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleBulkPay = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one teacher.");
      return;
    }

    setPaymentForm({
      paymentMode: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      note: "",
    });

    setShowBulkPaymentModal(true);
  };

  const handleSaveBulkPayment = async () => {
    // if (!paymentForm.paymentMode) {
    //   alert("Select payment mode");
    //   return;
    // }

    try {
      await API.put("/payroll/bulk-pay", {
        ids: selectedRows,

        paymentMode: paymentForm.paymentMode,

        paymentDate: paymentForm.paymentDate,

        note: paymentForm.note,
      });

      setShowBulkPaymentModal(false);

      setSelectedRows([]);

      fetchPayrolls();
    } catch (err) {
      alert(err.response?.data?.message || "Payment Failed");
    }
  };

  useEffect(() => {
    setSelectedRows((prev) =>
      prev.filter((id) => filtered.some((item) => item._id === id)),
    );
  }, [filtered]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payroll record?")) return;

    try {
      await API.delete(`/payroll/${id}`);
      setPayrollData((prev) => prev.filter((item) => item._id !== id));
      setMenuOpen(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete payroll.");
    }
  };

  const handleEdit = (item) => {
    onEdit(item);
    setMenuOpen(null);
  };

  const handleViewPayslip = (item) => {
    setSelectedPayroll(item);
    setShowPayslipModal(true);
  };

  const handleProceedToPay = (item) => {
    setSelectedPayroll(item);
    setPaymentForm({
      paymentMode: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      note: "",
    });
    setShowPaymentModal(true);
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();

    if (!paymentForm.paymentMode || !paymentForm.paymentDate) {
      setError("Please select payment mode and payment date.");
      return;
    }

    try {
      setSavingPayment(true);
      setError("");
      const res = await API.put(`/payroll/${selectedPayroll._id}`, {
        status: "Completed",
      });
      const updated = normalizePayroll({
        ...selectedPayroll,
        ...(res.data?.data || {}),
        teacherId: selectedPayroll.teacherObjectId
          ? {
              _id: selectedPayroll.teacherObjectId,
              name: selectedPayroll.teacher,
              department: selectedPayroll.department,
              email: selectedPayroll.email,
              image: selectedPayroll.image,
            }
          : res.data?.data?.teacherId,
      });
      setPayrollData((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
      );
      setShowPaymentModal(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process salary payment.",
      );
    } finally {
      setSavingPayment(false);
    }
  };

  const getCurrentFormattedDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handlePrintPayslip = () => {
    if (!payslipPrintRef.current || !selectedPayroll) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      setError("Please allow popups to print the payslip.");
      return;
    }

    const logoUrl = schoolLogo.startsWith("http")
      ? schoolLogo
      : `${window.location.origin}${schoolLogo.startsWith("/") ? schoolLogo : `/${schoolLogo}`}`;

    const payslipHtml = payslipPrintRef.current.outerHTML.replace(
      /src="[^"]*Learning-Step-Logo-1[^"]*"/,
      `src="${logoUrl}"`,
    );

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Payslip - ${selectedPayroll.teacher}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              color: #1e293b;
              background: #ffffff;
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            }
            .payslip-body-content {
              width: 100%;
              max-width: 780px;
              margin: 0 auto;
              padding: 0;
              min-width: 0;
              overflow-x: hidden;
            }
            .payslip-corporate-branding {
              text-align: center;
              margin-bottom: 20px;
            }
            .brand-logo-section {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 16px;
            }
            .brand-avatar-box {
              width: 90px;
              height: 90px;
              border-radius: 10px;
              background: #f5f7fb;
              border: 1px solid #e5e7eb;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              flex-shrink: 0;
            }
            .school-logo {
              width: 70px;
              height: 70px;
              object-fit: contain;
            }
            .brand-logo-section h3 {
              margin: 0;
              color: #1e40af;
              font-size: 22px;
            }
            .brand-logo-section p {
              margin: 2px 0 0;
              font-size: 13px;
              color: #64748b;
            }
            .payslip-period-banner {
              background: #e2e8f0;
              padding: 10px 16px;
              border-radius: 4px;
              display: flex;
              justify-content: space-between;
              gap: 12px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 16px;
            }
            .payslip-date-stamp {
              font-weight: 500;
              font-size: 13px;
              white-space: nowrap;
            }
            .payslip-details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              border: 1px solid #cbd5e1;
              padding: 16px;
              border-radius: 6px;
              margin-bottom: 16px;
            }
            .details-col p {
              margin: 6px 0;
              font-size: 14px;
            }
            .payslip-days-summary {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              border: 1px solid #cbd5e1;
              margin-bottom: 16px;
              border-radius: 4px;
              overflow: hidden;
            }
            .summary-box {
              padding: 10px;
              font-size: 13px;
              text-align: center;
              border-right: 1px solid #cbd5e1;
              background: #f8fafc;
            }
            .summary-box:last-child {
              border-right: none;
            }
            .payslip-financial-table {
              width: 100%;
              max-width: 100%;
              min-width: 0;
              table-layout: fixed;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .payslip-financial-table col {
              width: 25%;
            }
            .payslip-financial-table th {
              background: #e2e8f0;
              color: #1e293b;
              border: 1px solid #cbd5e1;
              padding: 9px 8px;
              white-space: normal;
              overflow-wrap: anywhere;
              text-align: center;
            }
            .payslip-financial-table td {
              border: 1px solid #cbd5e1;
              padding: 9px 8px;
              white-space: normal;
              overflow-wrap: anywhere;
              text-align: center;
            }
            .financial-totals-row {
              background: #f1f5f9;
            }
            .estimated-pay-row {
              background: #eef7ff;
              color: #0f4c81;
            }
            .payslip-net-footer {
              border: 1px solid #cbd5e1;
              padding: 16px;
              border-radius: 4px;
              background: #f8fafc;
            }
            .payslip-net-footer p {
              margin: 4px 0;
              font-size: 16px;
            }
            .currency-word-representation {
              font-size: 13px;
              color: #64748b;
              font-style: italic;
            }
            .computer-generated-tag {
              display: block;
              margin-top: 12px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
              border-top: 1px dashed #cbd5e1;
              padding-top: 8px;
            }
            @page {
              size: A4;
              margin: 14mm;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>${payslipHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  const payslipAmounts = useMemo(() => {
    if (!selectedPayroll) {
      return {
        basic: 0,
        allowance: 0,
        overtime: 0,
        monthlyDeduction: 0,
        otherDeduction: 0,
        totalEarnings: 0,
        totalDeductions: 0,
      };
    }

    const earnings = selectedPayroll.salaryBreakdown?.earnings || {};
    const deductions = selectedPayroll.salaryBreakdown?.deductions || {};
    const allowance = Number(
      selectedPayroll.allowance ?? earnings.allowance ?? 0,
    );
    const overtime = Number(
      selectedPayroll.overtimeAmount ?? earnings.overtime ?? 0,
    );
    const basic = Number(
      earnings.basic ??
        Math.max(Number(selectedPayroll.grossSalary || 0) - allowance, 0),
    );
    const monthlyDeduction = Number(
      selectedPayroll.deductionAmount ?? deductions.monthlyDeduction ?? 0,
    );
    const otherDeduction = Number(
      selectedPayroll.otherDeduction ?? deductions.otherDeduction ?? 0,
    );

    return {
      basic,
      allowance,
      overtime,
      monthlyDeduction,
      otherDeduction,
      totalEarnings: basic + allowance + overtime,
      totalDeductions: monthlyDeduction + otherDeduction,
    };
  }, [selectedPayroll]);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Payroll Report");

    // School Name

    sheet.mergeCells("A1:M1");

    const school = sheet.getCell("A1");

    school.value = "THE LEARNING STEP INTERNATIONAL SCHOOL";

    school.font = {
      size: 18,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    school.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    school.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1E3A8A" },
    };

    // Title

    sheet.mergeCells("A2:M2");

    const title = sheet.getCell("A2");

    title.value = "Payroll Report";

    title.font = {
      size: 14,
      bold: true,
    };

    title.alignment = {
      horizontal: "center",
    };

    sheet.addRow([]);

    sheet.addRow([
      "Month",
      month ? monthNames[month - 1] : "All Months",
      "",
      "Year",
      year,
    ]);

    sheet.addRow(["Generated", new Date().toLocaleDateString()]);

    sheet.addRow([]);

    // Header

    const header = sheet.addRow([
      "Teacher",
      "Department",
      "Month",
      "Year",
      "Present",
      "Leave",
      "Paid Days",
      "Absent",
      "Gross Salary",
      "Deduction",
      "Net Salary",
      "Overtime",
      "Status",
    ]);

    header.eachCell((cell) => {
      cell.font = {
        bold: true,

        color: {
          argb: "FFFFFFFF",
        },
      };

      cell.fill = {
        type: "pattern",

        pattern: "solid",

        fgColor: {
          argb: "2563EB",
        },
      };

      cell.alignment = {
        horizontal: "center",

        vertical: "middle",
      };

      cell.border = {
        top: { style: "thin" },

        left: { style: "thin" },

        right: { style: "thin" },

        bottom: { style: "thin" },
      };
    });

    // Data

    filtered.forEach((item) => {
      sheet.addRow([
        item.teacher,

        item.department,

        item.monthName,

        item.year,

        item.presentDays,

        item.leaveDays,

        `${item.workingDays}/${item.totalDays}`,

        item.absentDays,

        item.grossSalary,

        item.totalDeductions,

        item.totalSalary,

        item.overtimeAmount,

        item.status,
      ]);
    });

    // Borders

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber < 7) return;

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },

          left: { style: "thin" },

          right: { style: "thin" },

          bottom: { style: "thin" },
        };
      });
    });

    // Currency Format

    ["I", "J", "K", "L"].forEach((col) => {
      sheet.getColumn(col).numFmt = "₹#,##0.00";
    });

    // Totals

    sheet.addRow([]);

    const totalTeachers = filtered.length;

    const totalGross = filtered.reduce(
      (sum, item) => sum + Number(item.grossSalary || 0),
      0,
    );

    const totalDeduction = filtered.reduce(
      (sum, item) => sum + Number(item.totalDeductions || 0),
      0,
    );

    const totalNet = filtered.reduce(
      (sum, item) => sum + Number(item.totalSalary || 0),
      0,
    );

    const totals = [
      ["Total Teachers", totalTeachers],

      ["Total Gross Salary", totalGross],

      ["Total Deduction", totalDeduction],

      ["Total Net Salary", totalNet],
    ];

    totals.forEach((item) => {
      const row = sheet.addRow(item);

      row.font = {
        bold: true,
      };
    });

    // Auto Width

    sheet.columns.forEach((column) => {
      let max = 15;

      column.eachCell({ includeEmpty: true }, (cell) => {
        max = Math.max(max, cell.value ? cell.value.toString().length : 10);
      });

      column.width = max + 3;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), `Payroll_Report_${month || "All"}_${year}.xlsx`);
  };

  return (
    <div className="payroll-list-wrapper">
      <div className="payroll-list-top">
        <h2>Payroll List</h2>

        <div className="top-actions">
          <div className="search-box">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payroll"
            />
          </div>

          {selectedRows.length > 0 && (
            <button
              type="button"
              className="btn-submit-payment"
              onClick={handleBulkPay}
            >
              Pay Selected ({selectedRows.length})
            </button>
          )}

          <button className="download-report-btn" onClick={downloadExcel}>
            Download Excel
          </button>

          <div className="month-dropdown">
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">All Months</option>

              {monthNames.map((m, index) => (
                <option key={index} value={index + 1}>
                  {m}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>

          <div className="year-dropdown">
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map((optionYear) => (
                <option key={optionYear} value={optionYear}>
                  {optionYear}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {error && <div className="payroll-list-error">{error}</div>}
      {selectedRows.length > 0 && (
        <div className="selected-info">
          {selectedRows.length} Teacher(s) Selected
        </div>
      )}
      <div className="payroll-table-wrap">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    filtered.length > 0 &&
                    selectedRows.length === filtered.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Department</th>
              <th>Month</th>
              <th>Year</th>
              <th>Present</th>
              <th>Leave</th>
              <th>Paid Days</th>
              <th>Absent</th>
              <th>Gross Salary</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Overtime</th>
              <th>Status</th>
              <th>Action</th>
              <th>Process</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="16" className="loading-text">
                  Loading payroll...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="16" className="loading-text">
                  No payroll records found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id}>
                  <td data-label="Select">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id)}
                      onChange={() => handleCheckboxChange(item._id)}
                    />
                  </td>
                  <td data-label="Name">
                    <div className="user-info">
                      <img
                        src={getTeacherImage(item.image)}
                        alt={item.teacher}
                      />
                      <span>{item.teacher}</span>
                    </div>
                  </td>

                  <td data-label="Department">{item.department}</td>
                  <td data-label="Month">{item.monthName}</td>
                  <td data-label="Year">{item.year}</td>
                  <td data-label="Present">{item.presentDays}</td>
                  <td data-label="Leave">{item.leaveDays}</td>
                  <td data-label="Paid Days">
                    {item.workingDays}/{item.totalDays}
                  </td>
                  <td data-label="Absent">{item.absentDays}</td>
                  <td data-label="Gross Salary">
                    {formatMoney(item.grossSalary)}
                  </td>
                  <td data-label="Deductions">
                    {formatMoney(item.totalDeductions)}
                  </td>
                  <td data-label="Net Salary">
                    {formatMoney(item.totalSalary)}
                  </td>
                  <td data-label="Overtime">
                    {formatMoney(item.overtimeAmount)}
                  </td>

                  <td data-label="Status">
                    <span
                      className={`status-badge ${statusClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="action-cell" data-label="Action">
                    <button
                      className="action-btn"
                      onClick={() =>
                        setMenuOpen(menuOpen === item._id ? null : item._id)
                      }
                      type="button"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuOpen === item._id && (
                      <div className="action-menu">
                        <button onClick={() => handleEdit(item)} type="button">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>

                  <td data-label="Process">
                    <div className="process-action-cell">
                      <RotateCcw size={14} className="loopback-icon" />
                      {item.status === "Completed" ? (
                        <button
                          className="btn-view-payslip"
                          onClick={() => handleViewPayslip(item)}
                          type="button"
                        >
                          View Payslip
                        </button>
                      ) : (
                        <button
                          className="btn-proceed-pay"
                          onClick={() => handleProceedToPay(item)}
                          type="button"
                        >
                          Proceed To Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPayslipModal && selectedPayroll && (
        <div className="modal-overlay">
          <div className="payslip-modal-container">
            <div className="payslip-header-bar">
              <span>View Payslip</span>
              <div className="payslip-header-actions">
                <button
                  className="print-btn"
                  onClick={handlePrintPayslip}
                  type="button"
                >
                  <Printer size={16} /> Print
                </button>
                <X
                  size={20}
                  className="close-modal-icon"
                  onClick={() => setShowPayslipModal(false)}
                />
              </div>
            </div>

            <div className="payslip-body-content" ref={payslipPrintRef}>
              <div className="payslip-corporate-branding">
                <div className="brand-logo-section">
                  <div className="brand-avatar-box">
                    <img
                      src={schoolLogo}
                      alt="School Logo"
                      className="school-logo"
                    />
                  </div>
                  <div>
                    <h3>The Learning Step International School</h3>
                    <p>
                      Tehla bypass alwar, road, Rajgarh, Thana, Rajasthan 301408
                    </p>
                    <p>
                      Phone : +91 714627894 | Email : learningstep19@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="payslip-period-banner">
                <span>
                  Payslip for the period of {selectedPayroll.monthName}{" "}
                  {selectedPayroll.year}
                </span>
                <span className="payslip-date-stamp">
                  Date : {getCurrentFormattedDate()}
                </span>
              </div>

              <div className="payslip-details-grid">
                <div className="details-col">
                  <p>
                    <strong>Employee Name :</strong> {selectedPayroll.teacher}
                  </p>
                  <p>
                    <strong>Email :</strong> {selectedPayroll.email || "-"}
                  </p>
                  <p>
                    <strong>Department :</strong> {selectedPayroll.department}
                  </p>
                  <p>
                    <strong>Mode :</strong> Bank / Online Transfer
                  </p>
                </div>
                <div className="details-col">
                  <p>
                    <strong>Employee Id :</strong>{" "}
                    {String(selectedPayroll.teacherObjectId || "").slice(-6) ||
                      "-"}
                  </p>
                  <p>
                    <strong>PF A/c No. :</strong> -
                  </p>
                  <p>
                    <strong>Designation :</strong> Instructor / Teacher
                  </p>
                </div>
              </div>

              <div className="payslip-days-summary">
                <div className="summary-box">
                  <strong>Total Days :</strong> {selectedPayroll.totalDays || 0}
                </div>
                <div className="summary-box">
                  <strong>Present :</strong> {selectedPayroll.presentDays}
                </div>
                <div className="summary-box">
                  <strong>Approved Leave :</strong> {selectedPayroll.leaveDays}
                </div>
                <div className="summary-box">
                  <strong>Absent :</strong> {selectedPayroll.absentDays}
                </div>
              </div>

              <table className="payslip-financial-table">
                <colgroup>
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th>Earning</th>
                    <th>Amount</th>
                    <th>Deduction</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td>{formatMoney(payslipAmounts.basic)}</td>
                    <td>Monthly Deduction</td>
                    <td>{formatMoney(payslipAmounts.monthlyDeduction)}</td>
                  </tr>
                  <tr>
                    <td>Additional Allowance</td>
                    <td>{formatMoney(payslipAmounts.allowance)}</td>
                    <td>Other Deduction</td>
                    <td>{formatMoney(payslipAmounts.otherDeduction)}</td>
                  </tr>
                  <tr>
                    <td>Overtime Allowance</td>
                    <td>{formatMoney(payslipAmounts.overtime)}</td>
                    <td>-</td>
                    <td>{formatMoney(0)}</td>
                  </tr>
                  <tr className="financial-totals-row">
                    <td>
                      <strong>Total Earning</strong>
                    </td>
                    <td>
                      <strong>
                        {formatMoney(payslipAmounts.totalEarnings)}
                      </strong>
                    </td>
                    <td>
                      <strong>Total Deduction</strong>
                    </td>
                    <td>
                      <strong>
                        {formatMoney(payslipAmounts.totalDeductions)}
                      </strong>
                    </td>
                  </tr>
                  <tr className="estimated-pay-row">
                    <td colSpan="3">
                      <strong>Estimated Pay Amount</strong>
                    </td>
                    <td>
                      <strong>
                        {formatMoney(selectedPayroll.totalSalary)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="payslip-net-footer">
                <p>
                  <strong>Net Pay :</strong>{" "}
                  {formatMoney(selectedPayroll.totalSalary)}
                </p>
                <p className="currency-word-representation">
                  In Words : INR{" "}
                  {Number(selectedPayroll.totalSalary || 0).toFixed(2)} Only
                </p>
                <span className="computer-generated-tag">
                  Computer Generated Payslip
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedPayroll && (
        <div className="modal-overlay">
          <div className="payment-modal-container">
            <div className="payment-modal-header">
              <h3>Proceed To Pay</h3>
              <X
                size={20}
                className="close-modal-icon"
                onClick={() => setShowPaymentModal(false)}
              />
            </div>

            <form onSubmit={handleSavePayment} className="payment-modal-form">
              <div className="form-grid-layout">
                <div className="form-group-item">
                  <label>Staff Name</label>
                  <input
                    type="text"
                    value={selectedPayroll.teacher}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Paid Amount</label>
                  <input
                    type="text"
                    value={formatMoney(selectedPayroll.totalSalary)}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Present Days</label>
                  <input
                    type="number"
                    value={selectedPayroll.presentDays || 0}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Approved Leave</label>
                  <input
                    type="number"
                    value={selectedPayroll.leaveDays || 0}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Paid Days</label>
                  <input
                    type="number"
                    value={selectedPayroll.workingDays || 0}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Absent Days</label>
                  <input
                    type="number"
                    value={selectedPayroll.absentDays || 0}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Salary Month</label>
                  <input
                    type="text"
                    value={selectedPayroll.monthName}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Salary Year</label>
                  <input
                    type="text"
                    value={selectedPayroll.year}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Payment Mode</label>
                  <select
                    name="paymentMode"
                    value={paymentForm.paymentMode}
                    onChange={handlePaymentFormChange}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Payment Date</label>
                  <input
                    type="date"
                    name="paymentDate"
                    value={paymentForm.paymentDate}
                    onChange={handlePaymentFormChange}
                  />
                </div>

                <div className="form-group-item full-width-textarea">
                  <label>Note</label>
                  <textarea
                    rows="4"
                    name="note"
                    value={paymentForm.note}
                    onChange={handlePaymentFormChange}
                    placeholder="Write payment remarks..."
                  />
                </div>
              </div>

              <div className="payment-form-footer-actions">
                <button
                  type="button"
                  className="btn-cancel-payment"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-submit-payment"
                  disabled={savingPayment}
                >
                  {savingPayment ? "Paying..." : "Pay Salary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal-container">
            <div className="payment-modal-header">
              <h3>Bulk Salary Payment</h3>

              <X
                size={20}
                className="close-modal-icon"
                onClick={() => setShowBulkPaymentModal(false)}
              />
            </div>

            <form className="payment-modal-form">
              <div className="form-grid-layout">
                <div className="form-group-item">
                  <label>Selected Teachers</label>

                  <input
                    value={selectedRows.length}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group-item">
                  <label>Payment Mode</label>

                  <select
                    name="paymentMode"
                    value={paymentForm.paymentMode}
                    onChange={handlePaymentFormChange}
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label>Payment Date</label>

                  <input
                    type="date"
                    name="paymentDate"
                    value={paymentForm.paymentDate}
                    onChange={handlePaymentFormChange}
                  />
                </div>

                <div className="form-group-item full-width-textarea">
                  <label>Note</label>

                  <textarea
                    rows="4"
                    name="note"
                    value={paymentForm.note}
                    onChange={handlePaymentFormChange}
                  />
                </div>
              </div>

              <div className="payment-form-footer-actions">
                <button
                  type="button"
                  className="btn-cancel-payment"
                  onClick={() => setShowBulkPaymentModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn-submit-payment"
                  onClick={handleSaveBulkPayment}
                >
                  Pay Selected
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollList;
