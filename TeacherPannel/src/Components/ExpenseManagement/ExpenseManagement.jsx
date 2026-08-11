import React, { useEffect, useState, useRef } from "react";

import "./ExpenseManagement.css";

import API, { BASE_URL } from "../../api/axios";

const ExpenseManagement = () => {
  /* =====================================================
     INITIAL FORM STATE
  ===================================================== */

  const initialFormState = {
    employeeName: "",
    expenseDate: new Date().toISOString().split("T")[0],
    expenseFor: "",
    amount: "",
    description: "",
    paymentApproval: "",
    paymentStatus: "Pending",
    upiNumber: "",
    fileName: "",
    file: null,
  };

  /* =====================================================
     STATES
  ===================================================== */

  const [formData, setFormData] = useState(initialFormState);

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [expenses, setExpenses] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [teacherLoading, setTeacherLoading] = useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const dateInputRef = useRef(null);

  const fileInputRef = useRef(null);

  /* =====================================================
     OPEN BILL / PDF
  ===================================================== */

  const openBill = (billPath) => {
    if (!billPath) {
      alert("Bill file not found");
      return;
    }

    let filePath = String(billPath).trim();

    filePath = filePath.replace(/\\/g, "/");

    console.log("DATABASE BILL:", filePath);

    let url;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      url = filePath;
    } else if (filePath.startsWith("/uploads/")) {
      url = `${BASE_URL}${filePath}`;
    } else {
      url = `${BASE_URL}/uploads/expense-management/${filePath}`;
    }

    console.log("FINAL PDF URL:", url);

    window.open(url, "_blank");
  };

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  // Backend Date -> DD/MM/YYYY
  const formatDateForTable = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const day = String(date.getUTCDate()).padStart(2, "0");

    const month = String(date.getUTCMonth() + 1).padStart(2, "0");

    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  };

  /* =====================================================
     DATE INPUT FORMAT
  ===================================================== */

  // DD/MM/YYYY -> YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const parts = dateString.split("/");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateString;
  };

  /* =====================================================
     FETCH TEACHERS
  ===================================================== */

  const fetchTeachers = async () => {
    try {
      setTeacherLoading(true);

      /*
        Backend:

        app.use(
          "/api/teacher",
          teacherAuthRoutes
        );

        Router:

        router.get(
          "/all",
          auth,
          getTeachers
        );

        Therefore:

        GET /api/teacher/all
      */

      const response = await API.get("/teacher/all");

      console.log("TEACHER RESPONSE:", response.data);

      let teacherData = [];

      if (Array.isArray(response.data)) {
        teacherData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        teacherData = response.data.data;
      } else if (Array.isArray(response.data?.teachers)) {
        teacherData = response.data.teachers;
      } else if (Array.isArray(response.data?.users)) {
        teacherData = response.data.users;
      }

      setTeachers(teacherData);
    } catch (error) {
      console.error("FETCH TEACHERS ERROR:", error);

      console.error("STATUS:", error.response?.status);

      console.error("DATA:", error.response?.data);

      alert(error.response?.data?.message || "Unable to fetch teachers");
    } finally {
      setTeacherLoading(false);
    }
  };

  /* =====================================================
     GET TEACHER NAME
  ===================================================== */

  const getTeacherName = (teacher) => {
    if (!teacher) {
      return "";
    }

    return (
      teacher.name ||
      teacher.fullName ||
      teacher.teacherName ||
      teacher.employeeName ||
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      teacher.username ||
      ""
    );
  };

  /* =====================================================
     FETCH EXPENSES
  ===================================================== */

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const response = await API.get("/expense-management");

      console.log("EXPENSE RESPONSE:", response.data);

      const data = response.data?.data || [];

      const formattedExpenses = data.map((item) => ({
        ...item,

        /*
            MongoDB ID
          */

        id: item._id,

        /*
            Date
          */

        date: formatDateForTable(item.expenseDate),

        /*
            Amount
          */

        amount: Number(item.amount || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),

        /*
            IMPORTANT:

            bill = actual backend
            file path

            NOT billOriginalName
          */

        bill: item.bill || "",

        /*
            Original filename only
            for display
          */

        billOriginalName: item.billOriginalName || "",
      }));

      setExpenses(formattedExpenses);
    } catch (error) {
      console.error("FETCH EXPENSES ERROR:", error);

      console.error("STATUS:", error.response?.status);

      console.error("DATA:", error.response?.data);

      alert(error.response?.data?.message || "Unable to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FETCH DATA WHEN PAGE LOADS
  ===================================================== */

  useEffect(() => {
    fetchTeachers();
    fetchExpenses();
  }, []);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    /*
      5MB validation
    */

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than or equal to 5MB");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    /*
      Allowed file types
    */

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and PDF files are allowed");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      file: file,
      fileName: file.name,
    }));
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setFormData({
      ...initialFormState,

      expenseDate: new Date().toISOString().split("T")[0],
    });

    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     CREATE / UPDATE EXPENSE
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ---------------- VALIDATION ---------------- */

    if (
      !formData.employeeName ||
      !formData.expenseFor ||
      !formData.amount ||
      !formData.expenseDate ||
      !formData.paymentApproval
    ) {
      alert("Please fill in all required fields marked with *");

      return;
    }

    /* ---------------- UPI ---------------- */

    if (formData.paymentStatus === "UPI" && !formData.upiNumber) {
      alert("Please enter UPI Number");

      return;
    }

    /* ---------------- BILL ---------------- */

    if (!editingId && !formData.file) {
      alert("Please upload the bill");

      return;
    }

    try {
      setLoading(true);

      /* =================================================
         FORMDATA
      ================================================= */

      const data = new FormData();

      data.append("employeeName", formData.employeeName);

      data.append("expenseDate", formData.expenseDate);

      data.append("expenseFor", formData.expenseFor);

      data.append("amount", formData.amount);

      data.append("description", formData.description || "");

      data.append("paymentApproval", formData.paymentApproval);

      data.append("paymentStatus", formData.paymentStatus);

      data.append(
        "upiNumber",
        formData.paymentStatus === "UPI" ? formData.upiNumber : "",
      );

      /* =================================================
         BILL FILE
      ================================================= */

      if (formData.file) {
        data.append("bill", formData.file);
      }

      /* =================================================
         CREATE / UPDATE
      ================================================= */

      let response;

      if (!editingId) {
        response = await API.post("/expense-management", data);
      } else {
        response = await API.put(`/expense-management/${editingId}`, data);
      }

      console.log("SAVE EXPENSE RESPONSE:", response.data);

      if (response.data?.success) {
        alert(
          response.data.message ||
            (editingId
              ? "Expense updated successfully"
              : "Expense created successfully"),
        );

        await fetchExpenses();

        handleReset();
      }
    } catch (error) {
      console.error("SAVE EXPENSE ERROR:", error);

      console.error("STATUS:", error.response?.status);

      console.error("DATA:", error.response?.data);

      alert(error.response?.data?.message || "Unable to save expense");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EDIT EXPENSE
  ===================================================== */

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      employeeName: item.employeeName || "",

      expenseDate: formatDateForInput(item.date),

      expenseFor: item.expenseFor || "",

      amount: String(item.amount || "").replace(/,/g, ""),

      description: item.description || "",

      paymentApproval: item.paymentApproval || "",

      paymentStatus: item.paymentStatus || "Pending",

      upiNumber: item.upiNumber || "",

      /*
        Show original filename
      */

      fileName: item.billOriginalName || item.bill || "",

      /*
        Don't re-upload old file
        unless user chooses new one
      */

      file: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE EXPENSE
  ===================================================== */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense entry?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      const response = await API.delete(`/expense-management/${id}`);

      console.log("DELETE RESPONSE:", response.data);

      if (response.data?.success) {
        alert(response.data.message || "Expense deleted successfully");

        await fetchExpenses();

        if (editingId === id) {
          handleReset();
        }
      }
    } catch (error) {
      console.error("DELETE EXPENSE ERROR:", error);

      alert(error.response?.data?.message || "Unable to delete expense");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     OPEN CALENDAR
  ===================================================== */

  const openCalendar = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === "function") {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredExpenses = expenses.filter(
    (item) =>
      (item.employeeName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.expenseFor || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.paymentStatus || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  /* =====================================================
     STATUS BADGE
  ===================================================== */

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "expense-management-badge status-pending";

      case "UPI":
        return "expense-management-badge status-upi";

      case "Cash":
        return "expense-management-badge status-cash";

      case "Card":
        return "expense-management-badge status-card";

      case "Bank Transfer":
        return "expense-management-badge status-bank";

      default:
        return "expense-management-badge";
    }
  };

  /* =====================================================
   TOGGLE APPROVAL STATUS
===================================================== */

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="expense-management-container">
      {/* Header & Breadcrumbs */}

      <div className="expense-management-header">
        <h1 className="expense-management-title">Manage Expenses</h1>

        <div className="expense-management-breadcrumb">
          <span>Accounts & Expenses</span>

          <span className="separator">&gt;</span>

          <span>Expenses</span>

          <span className="separator">&gt;</span>

          <span className="active">Manage Expenses</span>
        </div>
      </div>

      {/* Add New Expense Form */}

      <div className="expense-management-card">
        <h2 className="expense-management-card-title">
          {editingId ? "Edit Expense" : "Add New Expense"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="expense-management-form-grid">
            {/* Employee Name */}

            <div className="expense-management-form-group">
              <label>
                Employee Name <span className="required">*</span>
              </label>

              <select
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  {teacherLoading ? "Loading Employee..." : "Select Employee"}
                </option>

                {teachers.map((teacher, index) => {
                  const teacherName = getTeacherName(teacher);

                  if (!teacherName) {
                    return null;
                  }

                  return (
                    <option
                      key={teacher._id || teacher.id || index}
                      value={teacherName}
                    >
                      {teacherName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Expense Date */}

            <div className="expense-management-form-group">
              <label>
                Expense Date <span className="required">*</span>
              </label>

              <div className="input-with-icon">
                <input
                  ref={dateInputRef}
                  type="date"
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={handleInputChange}
                  required
                />

                <svg
                  className="icon clickable"
                  onClick={openCalendar}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />

                  <line x1="16" y1="2" x2="16" y2="6" />

                  <line x1="8" y1="2" x2="8" y2="6" />

                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            {/* Expense For */}

            <div className="expense-management-form-group">
              <label>
                Expense For <span className="required">*</span>
              </label>

              <input
                type="text"
                name="expenseFor"
                placeholder="e.g. Office Supplies, Travel"
                value={formData.expenseFor}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Bill Upload */}

            <div className="expense-management-form-group upload-section">
              <label>
                Bill Upload <span className="required">*</span>
              </label>

              <div className="expense-management-dropzone">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />

                  <polyline points="17 8 12 3 7 8" />

                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>

                <p className="dropzone-text-main">
                  {formData.fileName
                    ? formData.fileName
                    : "Drag & drop file here"}
                </p>

                <p className="dropzone-text-sub">or</p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{
                    display: "none",
                  }}
                  accept=".jpg,.jpeg,.png,.pdf"
                />

                <button
                  type="button"
                  className="btn-choose-file"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  Choose File
                </button>

                <span className="dropzone-hint">
                  Supports: JPG, PNG, PDF (Max. 5MB)
                </span>
              </div>
            </div>

            {/* Amount & Description Stack */}

            <div className="expense-management-right-fields">
              <div className="expense-management-form-group">
                <label>
                  Amount (₹) <span className="required">*</span>
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="expense-management-form-group description-group">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Enter expense description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Payment Approval */}

            <div className="expense-management-form-group">
              <label>
                Payment Approval <span className="required">*</span>
              </label>

              <select
                name="paymentApproval"
                value={formData.paymentApproval}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Approver</option>

                <option value="Manager">Manager</option>

                <option value="Finance Head">Finance Head</option>
              </select>
            </div>

            {/* Payment Status Radios & Details */}

            <div className="expense-management-form-group payment-status-group">
              <label>
                Payment Status <span className="required">*</span>
              </label>

              <div className="radio-group">
                {["Pending", "Cash", "UPI", "Card", "Bank Transfer"].map(
                  (status) => (
                    <label key={status} className="radio-label">
                      <input
                        type="radio"
                        name="paymentStatus"
                        value={status}
                        checked={formData.paymentStatus === status}
                        onChange={handleInputChange}
                      />

                      <span>{status}</span>
                    </label>
                  ),
                )}
              </div>

              {formData.paymentStatus === "UPI" && (
                <div className="upi-input-container">
                  <label>UPI Number</label>

                  <input
                    type="text"
                    name="upiNumber"
                    placeholder="Enter UPI Number"
                    value={formData.upiNumber}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}

          <div className="expense-management-actions">
            <button type="button" className="btn-reset" onClick={handleReset}>
              Reset
            </button>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading
                ? "Please wait..."
                : editingId
                  ? "Update Expense"
                  : "Save Expense"}
            </button>
          </div>
        </form>
      </div>

      {/* Expense List Card */}

      <div className="expense-management-card">
        <div className="expense-management-list-header">
          <h2>Expense List</h2>

          <div className="list-controls">
            <div className="search-box">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#a0aec0"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />

                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                placeholder="Search expense..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="btn-filter" type="button">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Dynamic Table */}

        <div className="expense-management-table-wrapper">
          <table className="expense-management-table">
            <thead>
              <tr>
                <th>#</th>

                <th>Employee Name</th>

                <th>Expense For</th>

                <th>Date</th>

                <th>Amount (₹)</th>

                <th>Bill</th>

                <th>Payment Status</th>

                <th>Approval</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                filteredExpenses.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>{item.employeeName}</td>

                    <td>{item.expenseFor}</td>

                    <td>{item.date}</td>

                    <td>{item.amount}</td>

                    {/* ================= BILL ================= */}

                    <td>
                      {item.bill ? (
                        <div
                          className="pdf-icon"
                          title={item.billOriginalName || item.bill}
                          onClick={() => openBill(item.bill)}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="#EF4444"
                          >
                            <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z" />
                          </svg>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* ================= PAYMENT STATUS ================= */}

                    <td>
                      <span className={getStatusBadgeClass(item.paymentStatus)}>
                        {item.paymentStatus}
                      </span>
                    </td>

                    {/* ================= APPROVAL ================= */}

                    <td>
                      <span
                        className={`expense-management-badge ${
                          item.approval === "Approved"
                            ? "approval-approved"
                            : "approval-pending"
                        }`}
                      >
                        {item.approval || "Pending"}
                      </span>
                    </td>

                    {/* ================= ACTION ================= */}

                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action edit"
                          title="Edit"
                          onClick={() => handleEdit(item)}
                          type="button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6C5CE7"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />

                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          className="btn-action delete"
                          title="Delete"
                          onClick={() => handleDelete(item.id)}
                          type="button"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />

                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}

        <div className="expense-management-pagination-container">
          <span className="pagination-info">
            Showing {filteredExpenses.length > 0 ? 1 : 0} to{" "}
            {filteredExpenses.length} of {expenses.length} entries
          </span>

          <div className="pagination">
            <button className="page-btn nav-btn" type="button">
              &lt;
            </button>

            <button className="page-btn active" type="button">
              1
            </button>

            <button className="page-btn nav-btn" type="button">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;
