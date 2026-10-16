import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./FuelManagement.css";
import API from "../../api/axios";
import * as XLSX from "xlsx";

/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const initialForm = () => ({
  employeeName: "",
  pumpName: "",
  vehicle: "",
  description: "",
  date: getToday(),
  invoiceNo: "",
  km: "",
  rate: "",
  volume: "",
  amount: "",
  fuelBill: null,
  fuelBillName: "",
  existingFuelBill: "",
});

const initialFilters = {
  employeeName: "",
  pumpName: "",
  fromDate: "",
  toDate: "",
  minAmount: "",
  maxAmount: "",
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB");
};

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getId = (record) =>
  record?._id || record?.id || "";

const getVehicle = (record) =>
  record?.vehicle ??
  record?.vehicleName ??
  "";

const getDescription = (record) =>
  record?.description ?? "";

const getFuelBill = (record) =>
  record?.fuelBill ??
  record?.fuelBillUrl ??
  "";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

/* =========================================================
   DESCRIPTION EDITOR
========================================================= */

const DescriptionEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command) => {
    editorRef.current?.focus();
    document.execCommand(command, false, null);

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="fuel-description-editor">
      <div className="fuel-description-toolbar">
        {[
          ["B", "bold"],
          ["I", "italic"],
          ["U", "underline"],
          ["• List", "insertUnorderedList"],
          ["1. List", "insertOrderedList"],
        ].map(([label, command]) => (
          <button
            key={command}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand(command)}
            title={command}
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => runCommand("removeFormat")}
        >
          Clear format
        </button>
      </div>

      <div
        ref={editorRef}
        className="fuel-description-editable"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Fuel description"
        aria-multiline="true"
        data-placeholder="Enter vehicle usage or travel description..."
        onInput={(event) =>
          onChange(event.currentTarget.innerHTML)
        }
      />
    </div>
  );
};

/* =========================================================
   ICONS
========================================================= */

const Icon = ({ children }) => (
  <span
    aria-hidden="true"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
    }}
  >
    {children}
  </span>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

const FuelManagement = () => {
  const [records, setRecords] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState(initialForm);
  const [filters, setFilters] = useState(initialFilters);

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [billPreview, setBillPreview] = useState(null);

  const fileInputRef = useRef(null);

  /* =====================================================
     FETCH TEACHERS
  ===================================================== */

  const fetchTeachers = useCallback(async () => {
    try {
      setTeachersLoading(true);

      const response = await API.get("/teacher/all");

      const data = response.data?.data;

      setTeachers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch teachers error:", error);

      alert(
        getErrorMessage(error, "Failed to load employees.")
      );
    } finally {
      setTeachersLoading(false);
    }
  }, []);

  /* =====================================================
     FETCH FUEL RECORDS
  ===================================================== */

  const fetchFuelRecords = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const response = await API.get("/fuel", {
          params: {
            page,
            limit: 10,
            search: searchTerm.trim(),
            employeeName: filters.employeeName,
            pumpName: filters.pumpName,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            minAmount: filters.minAmount,
            maxAmount: filters.maxAmount,
          },
        });

        const data = response.data?.data;
        const pagination = response.data?.pagination;

        setRecords(Array.isArray(data) ? data : []);
        setTotalRecords(
          Number(pagination?.total ?? data?.length ?? 0)
        );
        setTotalPages(
          Math.max(Number(pagination?.totalPages || 1), 1)
        );
        setCurrentPage(Number(pagination?.page || page));
      } catch (error) {
        console.error("Fetch fuel records error:", error);

        alert(
          getErrorMessage(error, "Failed to load fuel entries.")
        );
      } finally {
        setLoading(false);
      }
    },
    [
      searchTerm,
      filters.employeeName,
      filters.pumpName,
      filters.fromDate,
      filters.toDate,
      filters.minAmount,
      filters.maxAmount,
    ]
  );

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFuelRecords(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchFuelRecords]);

  /* =====================================================
     TOTALS
  ===================================================== */

  const totals = useMemo(() => {
    return records.reduce(
      (result, item) => {
        result.amount += Number(item.amount || 0);
        result.volume += Number(item.volume || 0);
        result.km += Number(item.km || 0);

        return result;
      },
      {
        amount: 0,
        volume: 0,
        km: 0,
      }
    );
  }, [records]);

  /* =====================================================
     FORM INPUTS
  ===================================================== */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "rate" || name === "volume") {
        const rate = Number(updated.rate) || 0;
        const volume = Number(updated.volume) || 0;

        updated.amount =
          rate > 0 && volume > 0
            ? (rate * volume).toFixed(2)
            : "";
      }

      return updated;
    });
  };

  /* =====================================================
     FILE UPLOAD
  ===================================================== */

  const handleFuelBillChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG and PNG files are allowed.");

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Fuel bill must be smaller than 5 MB.");

      event.target.value = "";
      return;
    }

    setFormData((previous) => ({
      ...previous,
      fuelBill: file,
      fuelBillName: file.name,
    }));
  };

  const removeFuelBill = () => {
    setFormData((previous) => ({
      ...previous,
      fuelBill: null,
      fuelBillName: "",
      existingFuelBill: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     RESET FORM
  ===================================================== */

  const resetForm = () => {
    setFormData(initialForm());
    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     SAVE / UPDATE FUEL ENTRY
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.employeeName.trim()) {
      alert("Please select an employee.");
      return;
    }

    if (!formData.pumpName.trim()) {
      alert("Please enter the pump name.");
      return;
    }

    if (!formData.invoiceNo.trim()) {
      alert("Please enter the invoice number.");
      return;
    }

    if (!editingId && !formData.fuelBill) {
      alert("Please upload the fuel bill.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append(
        "employeeName",
        formData.employeeName.trim()
      );

      payload.append(
        "pumpName",
        formData.pumpName.trim()
      );

      // IMPORTANT: Send both missing fields.
      payload.append(
        "vehicle",
        formData.vehicle?.trim() || ""
      );

      payload.append(
        "description",
        formData.description || ""
      );

      payload.append("date", formData.date);
      payload.append(
        "invoiceNo",
        formData.invoiceNo.trim()
      );

      payload.append("km", formData.km || "0");
      payload.append("rate", formData.rate || "0");
      payload.append("volume", formData.volume || "0");

      if (formData.fuelBill instanceof File) {
        payload.append("fuelBill", formData.fuelBill);
      }

      let response;

      if (editingId) {
        response = await API.put(
          `/fuel/${editingId}`,
          payload
        );
      } else {
        response = await API.post("/fuel", payload);
      }

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to save fuel entry."
        );
      }

      alert(
        response.data?.message ||
          (editingId
            ? "Fuel entry updated successfully."
            : "Fuel entry created successfully.")
      );

      resetForm();
      await fetchFuelRecords(currentPage);
    } catch (error) {
      console.error("Save fuel error:", error);

      alert(
        getErrorMessage(error, "Failed to save fuel entry.")
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     EDIT FUEL ENTRY
  ===================================================== */

  const handleEdit = async (record) => {
    const id = getId(record);

    if (!id) {
      alert("This record has no valid ID.");
      return;
    }

    try {
      setEditingId(id);

      setFormData({
        employeeName: record.employeeName || "",
        pumpName: record.pumpName || "",
        vehicle: getVehicle(record),
        description: getDescription(record),
        date: record.date
          ? new Date(record.date).toISOString().slice(0, 10)
          : getToday(),
        invoiceNo: record.invoiceNo || "",
        km: String(record.km ?? ""),
        rate: String(record.rate ?? ""),
        volume: String(record.volume ?? ""),
        amount: String(record.amount ?? ""),
        fuelBill: null,
        fuelBillName: record.fuelBillOriginalName || "",
        existingFuelBill: getFuelBill(record),
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Edit fuel error:", error);

      alert("Unable to load this fuel entry.");
    }
  };

  /* =====================================================
     DELETE FUEL ENTRY
  ===================================================== */

  const handleDelete = async (record) => {
    const id = getId(record);

    if (!id) return;

    const confirmed = window.confirm(
      `Delete fuel entry ${record.invoiceNo || ""}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await API.delete(`/fuel/${id}`);

      alert(
        response.data?.message ||
          "Fuel entry deleted successfully."
      );

      await fetchFuelRecords(currentPage);
    } catch (error) {
      console.error("Delete fuel error:", error);

      alert(
        getErrorMessage(error, "Failed to delete fuel entry.")
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     FILTERS
  ===================================================== */

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setCurrentPage(1);
  };

  /* =====================================================
     EXCEL EXPORT
  ===================================================== */

  const handleExport = () => {
    if (!records.length) {
      alert("There are no fuel entries to export.");
      return;
    }

    const exportData = records.map((item, index) => ({
      "S.No.": index + 1,
      "Employee Name": item.employeeName || "",
      "Pump Name": item.pumpName || "",
      Vehicle: getVehicle(item),
      Description: stripHtml(getDescription(item)),
      Date: formatDate(item.date),
      "Invoice No.": item.invoiceNo || "",
      KM: Number(item.km || 0),
      "Rate per Litre": Number(item.rate || 0),
      "Volume (Litre)": Number(item.volume || 0),
      Amount: Number(item.amount || 0),
      "Fuel Bill": getFuelBill(item),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Fuel Entries"
    );

    XLSX.writeFile(workbook, "Fuel_Entries.xlsx");
  };

  /* =====================================================
     BILL PREVIEW
  ===================================================== */

  const getBillUrl = (record) => {
    const bill = getFuelBill(record);

    if (!bill) return "";

    if (/^https?:\/\//i.test(bill) || bill.startsWith("blob:")) {
      return bill;
    }

    // Change this path if your backend uses a different upload URL.
    const baseURL = API.defaults?.baseURL || "";

    const origin = baseURL.replace(/\/api\/?$/, "");

    return `${origin.replace(/\/$/, "")}/${
      bill.replace(/^\//, "")
    }`;
  };

  const openBillPreview = (record) => {
    const url = getBillUrl(record);

    if (!url) {
      alert("No fuel bill is attached to this record.");
      return;
    }

    const mime = record.fuelBillMimeType || "";
    const isPdf =
      mime === "application/pdf" ||
      /\.pdf(?:$|[?#])/i.test(url);

    setBillPreview({
      url,
      isPdf,
      name: record.fuelBillOriginalName || "Fuel Bill",
    });
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);
    fetchFuelRecords(page);
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="fuel-management">
      {/* HEADER */}

      <div className="fuel-management-header">
        <div className="fuel-management-title-group">
          <div className="fuel-management-header-icon">
            <Icon>⛽</Icon>
          </div>

          <div>
            <h1 className="fuel-management-header-title">
              Fuel Entry
            </h1>

            <p className="fuel-management-header-subtitle">
              Manage fuel records for organization vehicles.
            </p>
          </div>
        </div>

        <div className="fuel-management-breadcrumbs">
          Accounts &amp; Expenses &gt; Vehicle Controller &gt;{" "}
          <span>Fuel Entry</span>
        </div>
      </div>

      {/* FORM */}

      <div className="fuel-management-card">
        <div className="fuel-management-card-title">
          {editingId ? "Edit Fuel Entry" : "Add Fuel Entry"}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="fuel-management-form-grid">
            {/* EMPLOYEE */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Employee Name <span className="fuel-management-required">*</span>
              </label>

              <select
                className="fuel-management-input fuel-management-select"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                required
                disabled={teachersLoading}
              >
                <option value="">
                  {teachersLoading
                    ? "Loading employees..."
                    : "Select employee"}
                </option>

                {teachers.map((teacher) => (
                  <option
                    key={teacher._id}
                    value={teacher.name}
                  >
                    {teacher.name}
                    {teacher.department
                      ? ` - ${teacher.department}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* PUMP */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Pump Name <span className="fuel-management-required">*</span>
              </label>

              <input
                className="fuel-management-input"
                name="pumpName"
                value={formData.pumpName}
                onChange={handleInputChange}
                placeholder="Enter petrol pump name"
                required
              />
            </div>

            {/* VEHICLE */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Vehicle Number / Name
              </label>

              <input
                className="fuel-management-input"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
                placeholder="e.g. OD-02-AB-1234"
              />
            </div>

            {/* DATE */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Fuel Date <span className="fuel-management-required">*</span>
              </label>

              <input
                type="date"
                className="fuel-management-input"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* INVOICE */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Invoice Number <span className="fuel-management-required">*</span>
              </label>

              <input
                className="fuel-management-input"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleInputChange}
                placeholder="Enter invoice number"
                required
              />
            </div>

            {/* KM */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                KM
              </label>

              <input
                type="number"
                min="0"
                className="fuel-management-input"
                name="km"
                value={formData.km}
                onChange={handleInputChange}
                placeholder="Enter kilometre reading"
              />
            </div>

            {/* RATE */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Rate per Litre (₹)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="fuel-management-input"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>

            {/* VOLUME */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Volume (Litre)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                className="fuel-management-input"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                placeholder="0.00"
              />
            </div>

            {/* AMOUNT */}

            <div className="fuel-management-field">
              <label className="fuel-management-label">
                Total Amount (₹)
              </label>

              <input
                type="text"
                className="fuel-management-input"
                value={formData.amount ? formatCurrency(formData.amount) : ""}
                readOnly
                placeholder="Calculated automatically"
              />
            </div>

            {/* DESCRIPTION */}

            <div
              className="fuel-management-field fuel-description-field"
              style={{ gridColumn: "1 / -1" }}
            >
              <label className="fuel-management-label">
                Description
              </label>

              <DescriptionEditor
                value={formData.description}
                onChange={(description) =>
                  setFormData((previous) => ({
                    ...previous,
                    description,
                  }))
                }
              />
            </div>

            {/* FUEL BILL */}

            <div
              className="fuel-management-field fuel-bill-field"
            >
              <label className="fuel-management-label">
                Fuel Bill {!editingId && (
                  <span className="fuel-management-required">*</span>
                )}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFuelBillChange}
                className="fuel-management-input"
                required={!editingId && !formData.fuelBill}
              />

              {(formData.fuelBillName ||
                formData.existingFuelBill) && (
                <div className="fuel-bill-existing">
                  {formData.fuelBillName ||
                    "Existing fuel bill attached"}
                </div>
              )}

              {formData.existingFuelBill && (
                <button
                  type="button"
                  className="fuel-bill-view-btn"
                  onClick={() =>
                    openBillPreview({
                      fuelBill: formData.existingFuelBill,
                      fuelBillMimeType: "",
                      fuelBillOriginalName:
                        formData.fuelBillName,
                    })
                  }
                >
                  View Existing Bill
                </button>
              )}

              {(formData.fuelBill || formData.existingFuelBill) && (
                <button
                  type="button"
                  className="fuel-management-btn fuel-management-btn-reset"
                  onClick={removeFuelBill}
                  style={{ marginTop: 8 }}
                >
                  Remove Bill
                </button>
              )}
            </div>

            <div className="fuel-management-info-banner">
              <span>ⓘ</span>
              Amount is calculated automatically from rate per litre
              multiplied by volume.
            </div>
          </div>

          <div className="fuel-management-form-actions">
            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-reset"
              onClick={resetForm}
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="submit"
              className="fuel-management-btn fuel-management-btn-save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Fuel Entry"
                : "Save Fuel Entry"}
            </button>
          </div>
        </form>
      </div>

      {/* FUEL ENTRY LIST */}

      <div className="fuel-management-card">
        <div className="fuel-management-list-top">
          <div className="fuel-management-card-title">
            Fuel Entry List
          </div>

          <div className="fuel-management-list-actions">
            <div className="fuel-management-search-wrapper">
              <input
                type="search"
                className="fuel-management-search-input"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search fuel entries..."
              />
            </div>

            <button
              type="button"
              className={`fuel-management-btn fuel-management-btn-filter ${
                showFilters ? "active" : ""
              }`}
              onClick={() => setShowFilters((previous) => !previous)}
            >
              Filter
            </button>

            <button
              type="button"
              className="fuel-management-btn fuel-excel-btn"
              onClick={handleExport}
            >
              Export Excel
            </button>

            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-save"
              onClick={() => {
                resetForm();

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              + Add Fuel Entry
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}

        {showFilters && (
          <div className="fuel-filter-panel">
            <div className="fuel-filter-panel-header">
              <div>
                <h3>Filter Fuel Entries</h3>
                <p>Filter by employee, pump, date and amount.</p>
              </div>

              <button
                type="button"
                className="fuel-clear-filter-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>

            <div className="fuel-filter-grid">
              <div className="fuel-filter-group">
                <label>Employee Name</label>
                <input
                  name="employeeName"
                  value={filters.employeeName}
                  onChange={handleFilterChange}
                  placeholder="Employee name"
                />
              </div>

              <div className="fuel-filter-group">
                <label>Pump Name</label>
                <input
                  name="pumpName"
                  value={filters.pumpName}
                  onChange={handleFilterChange}
                  placeholder="Pump name"
                />
              </div>

              <div className="fuel-filter-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="fuel-filter-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="fuel-filter-group">
                <label>Minimum Amount</label>
                <input
                  type="number"
                  min="0"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="₹ Minimum"
                />
              </div>

              <div className="fuel-filter-group">
                <label>Maximum Amount</label>
                <input
                  type="number"
                  min="0"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="₹ Maximum"
                />
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}

        <div className="fuel-summary-grid">
          <div className="fuel-summary-card">
            <div className="fuel-summary-icon purple">
              <span>▣</span>
            </div>
            <div>
              <span>Total Records</span>
              <strong>{totalRecords}</strong>
            </div>
          </div>

          <div className="fuel-summary-card">
            <div className="fuel-summary-icon green">
              <span>₹</span>
            </div>
            <div>
              <span>Page Amount</span>
              <strong>{formatCurrency(totals.amount)}</strong>
            </div>
          </div>

          <div className="fuel-summary-card">
            <div className="fuel-summary-icon blue">
              <span>◉</span>
            </div>
            <div>
              <span>Page Fuel</span>
              <strong>{formatNumber(totals.volume)} L</strong>
            </div>
          </div>

          <div className="fuel-summary-card">
            <div className="fuel-summary-icon orange">
              <span>₹</span>
            </div>
            <div>
              <span>Average Rate</span>
              <strong>
                {formatCurrency(
                  totals.volume
                    ? totals.amount / totals.volume
                    : 0
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* TABLE */}

        <div className="fuel-management-table-container">
          <table className="fuel-management-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee Name</th>
                <th>Pump Name</th>
                <th>Vehicle</th>
                <th>Description</th>
                <th>Date</th>
                <th>Invoice No.</th>
                <th>KM</th>
                <th>Rate per Litre (₹)</th>
                <th>Volume (Litre)</th>
                <th>Amount (₹)</th>
                <th>Fuel Bill</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} style={{ textAlign: "center", padding: 35 }}>
                    Loading fuel entries...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ textAlign: "center", padding: 35 }}>
                    No fuel entries found.
                  </td>
                </tr>
              ) : (
                records.map((item, index) => (
                  <tr key={getId(item) || index}>
                    <td>
                      {(currentPage - 1) * 10 + index + 1}
                    </td>

                    <td>{item.employeeName || "—"}</td>

                    <td>
                      <span className="fuel-pump-chip">
                        {item.pumpName || "—"}
                      </span>
                    </td>

                    {/* VEHICLE: READ THE SAVED FIELD */}

                    <td className="fuel-vehicle-cell">
                      {getVehicle(item)?.trim() || "—"}
                    </td>

                    {/* DESCRIPTION: DISPLAY TEXT WITHOUT CLIPPING */}

                    <td className="fuel-description-cell">
                      {stripHtml(getDescription(item)) || "—"}
                    </td>

                    <td>{formatDate(item.date)}</td>

                    <td>{item.invoiceNo || "—"}</td>

                    <td>{formatNumber(item.km)}</td>

                    <td>{formatNumber(item.rate)}</td>

                    <td>{formatNumber(item.volume)}</td>

                    <td className="fuel-amount-cell">
                      {formatCurrency(item.amount)}
                    </td>

                    <td>
                      {getFuelBill(item) ? (
                        <button
                          type="button"
                          className="fuel-bill-view-btn"
                          onClick={() => openBillPreview(item)}
                        >
                          View
                        </button>
                      ) : (
                        <span className="fuel-no-bill">
                          No bill
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="fuel-management-table-actions">
                        <button
                          type="button"
                          className="fuel-management-action-btn edit"
                          title="Edit fuel entry"
                          onClick={() => handleEdit(item)}
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="fuel-management-action-btn delete"
                          title="Delete fuel entry"
                          disabled={deletingId === getId(item)}
                          onClick={() => handleDelete(item)}
                        >
                          {deletingId === getId(item) ? "…" : "×"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {!loading && records.length > 0 && (
              <tfoot>
                <tr className="fuel-total-row">
                  <td colSpan={9}>Total</td>
                  <td>{formatNumber(totals.volume)} L</td>
                  <td>{formatCurrency(totals.amount)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* PAGINATION */}

        <div className="fuel-management-footer">
          <span>
            Showing{" "}
            {totalRecords === 0
              ? 0
              : (currentPage - 1) * 10 + 1}{" "}
            to{" "}
            {Math.min(currentPage * 10, totalRecords)} of{" "}
            {totalRecords} entries
          </span>

          <div className="fuel-management-pagination">
            <button
              type="button"
              className="fuel-management-page-btn"
              disabled={currentPage <= 1 || loading}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ‹
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            )
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
              )
              .map((page, index, pages) => (
                <React.Fragment key={page}>
                  {index > 0 && page - pages[index - 1] > 1 && (
                    <span className="fuel-pagination-dots">…</span>
                  )}

                  <button
                    type="button"
                    className={`fuel-management-page-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                    disabled={loading}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              type="button"
              className="fuel-management-page-btn"
              disabled={currentPage >= totalPages || loading}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* FUEL BILL PREVIEW MODAL */}

      {billPreview && (
        <div
          className="fuel-bill-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setBillPreview(null);
            }
          }}
        >
          <div
            className="fuel-bill-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Fuel bill preview"
          >
            <div className="fuel-bill-modal-header">
              <strong>{billPreview.name}</strong>

              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={billPreview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="fuel-management-btn fuel-management-btn-reset"
                >
                  Open in New Tab
                </a>

                <button
                  type="button"
                  className="fuel-management-btn fuel-management-btn-reset"
                  onClick={() => setBillPreview(null)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="fuel-bill-modal-content">
              {billPreview.isPdf ? (
                <iframe
                  title="Fuel bill PDF"
                  src={billPreview.url}
                />
              ) : (
                <img
                  src={billPreview.url}
                  alt={billPreview.name}
                  onError={() =>
                    alert(
                      "Unable to load the fuel bill. Check the file URL and backend permissions."
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelManagement;