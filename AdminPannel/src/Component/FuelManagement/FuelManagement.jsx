import React, { useEffect, useMemo, useRef, useState } from "react";
import "./FuelManagement.css";
import API from "../../api/axios";
import * as XLSX from "xlsx";

/* =========================================================
   ICONS
========================================================= */

const Icons = {
  FuelPump: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9l-3-3" />
      <path d="M3 22h12" />
      <rect x="6" y="6" width="6" height="4" rx="1" />
      <circle cx="11" cy="16" r="1" />
    </svg>
  ),

  User: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  Calendar: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),

  FileText: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),

  Gauge: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 14l3-3" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  ),

  Droplet: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),

  Rupee: () => (
    <span
      style={{
        color: "#94A3B8",
        fontWeight: "bold",
        fontSize: "15px",
      }}
    >
      ₹
    </span>
  ),

  Info: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6C38FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),

  Save: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),

  Search: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),

  Filter: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),

  Plus: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),

  Edit: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6C38FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),

  Trash: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EF4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),

  ChevronDown: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),

  Upload: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),

  Download: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),

  Eye: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  X: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const initialForm = {
  employeeName: "",
  pumpName: "",
  date: getToday(),
  invoiceNo: "",
  km: "",
  rate: "",
  volume: "",
  amount: "",
  fuelBill: null,
  fuelBillName: "",
};

const initialFilters = {
  employeeName: "",
  pumpName: "",
  fromDate: "",
  toDate: "",
  minAmount: "",
  maxAmount: "",
};

/* =========================================================
   COMPONENT
========================================================= */

const FuelManagement = () => {
  const [records, setRecords] = useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalRecords, setTotalRecords] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [teachers, setTeachers] =
    useState([]);

  const [teachersLoading, setTeachersLoading] =
    useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const [filters, setFilters] =
    useState(initialFilters);

  const [showFilters, setShowFilters] =
    useState(false);

  const fileInputRef =
    useRef(null);

  /* =====================================================
     FETCH TEACHERS
  ===================================================== */

  const fetchTeachers = async () => {
    try {
      setTeachersLoading(true);

      const response =
        await API.get("/teacher/all");

      const teacherData =
        response.data?.data || [];

      setTeachers(teacherData);
    } catch (error) {
      console.error(
        "FETCH TEACHERS ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch teachers"
      );
    } finally {
      setTeachersLoading(false);
    }
  };

  /* =====================================================
     FETCH FUEL RECORDS
  ===================================================== */

  const fetchFuelRecords = async (
    page = 1,
    search = searchTerm
  ) => {
    try {
      setLoading(true);

      const response =
        await API.get("/fuel", {
          params: {
            page,
            limit: 10,
            search: search.trim(),

            employeeName:
              filters.employeeName,

            pumpName:
              filters.pumpName,

            fromDate:
              filters.fromDate,

            toDate:
              filters.toDate,

            minAmount:
              filters.minAmount,

            maxAmount:
              filters.maxAmount,
          },
        });

      const fuelData =
        response.data?.data || [];

      setRecords(fuelData);

      setTotalRecords(
        response.data?.pagination?.total ||
          fuelData.length
      );

      setTotalPages(
        response.data?.pagination?.totalPages ||
          1
      );
    } catch (error) {
      console.error(
        "FETCH FUEL ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to fetch fuel entries"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    fetchTeachers();
    fetchFuelRecords(1, "");
  }, []);

  /* =====================================================
     SEARCH / FILTER FETCH
  ===================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);

      fetchFuelRecords(
        1,
        searchTerm
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    filters.employeeName,
    filters.pumpName,
    filters.fromDate,
    filters.toDate,
    filters.minAmount,
    filters.maxAmount,
  ]);

  /* =====================================================
     AUTO AMOUNT
  ===================================================== */

  useEffect(() => {
    const rate =
      parseFloat(formData.rate) || 0;

    const volume =
      parseFloat(formData.volume) || 0;

    if (rate > 0 && volume > 0) {
      setFormData((prev) => ({
        ...prev,
        amount: (
          rate * volume
        ).toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amount: "",
      }));
    }
  }, [
    formData.rate,
    formData.volume,
  ]);

  /* =====================================================
     INPUT
  ===================================================== */

  const handleInputChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     FILE CHANGE
  ===================================================== */

  const handleFuelBillChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Only PDF, JPG and PNG files are allowed."
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Fuel bill must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fuelBill: file,
      fuelBillName: file.name,
    }));
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setFormData({
      ...initialForm,
      date: getToday(),
    });

    setEditingId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.employeeName ||
      !formData.pumpName ||
      !formData.date ||
      !formData.invoiceNo ||
      !formData.km ||
      !formData.rate ||
      !formData.volume
    ) {
      alert(
        "Please fill in all required fields marked with *"
      );

      return;
    }

    if (
      !editingId &&
      !formData.fuelBill
    ) {
      alert(
        "Please upload the fuel bill."
      );

      return;
    }

    try {
      setSaving(true);

      /*
       * FormData is used because fuelBill
       * is a file.
       */

      const payload =
        new FormData();

      payload.append(
        "employeeName",
        formData.employeeName
      );

      payload.append(
        "pumpName",
        formData.pumpName
      );

      payload.append(
        "date",
        formData.date
      );

      payload.append(
        "invoiceNo",
        formData.invoiceNo
      );

      payload.append(
        "km",
        Number(formData.km) || 0
      );

      payload.append(
        "rate",
        Number(formData.rate) || 0
      );

      payload.append(
        "volume",
        Number(formData.volume) || 0
      );

      payload.append(
        "amount",
        Number(formData.amount) || 0
      );

      if (formData.fuelBill) {
        payload.append(
          "fuelBill",
          formData.fuelBill
        );
      }

      if (editingId) {
        await API.put(
          `/fuel/${editingId}`,
          payload,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Fuel entry updated successfully"
        );
      } else {
        await API.post(
          "/fuel",
          payload,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Fuel entry saved successfully"
        );
      }

      await fetchFuelRecords(
        editingId
          ? currentPage
          : 1,
        searchTerm
      );

      handleReset();
    } catch (error) {
      console.error(
        "SAVE FUEL ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save fuel entry"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (record) => {
    setEditingId(record._id);

    let formattedDate = "";

    if (record.date) {
      const date =
        new Date(record.date);

      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {
        const year =
          date.getFullYear();

        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
          date.getDate()
        ).padStart(2, "0");

        formattedDate =
          `${year}-${month}-${day}`;
      }
    }

    setFormData({
      employeeName:
        record.employeeName || "",

      pumpName:
        record.pumpName || "",

      date: formattedDate,

      invoiceNo:
        record.invoiceNo || "",

      km:
        record.km ?? "",

      rate:
        record.rate ?? "",

      volume:
        record.volume ?? "",

      amount:
        record.amount ?? "",

      fuelBill: null,

      fuelBillName:
        record.fuelBillOriginalName ||
        record.fuelBillName ||
        "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this fuel record?"
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);

      await API.delete(
        `/fuel/${id}`
      );

      alert(
        "Fuel record deleted successfully"
      );

      const nextPage =
        records.length === 1 &&
        currentPage > 1
          ? currentPage - 1
          : currentPage;

      setCurrentPage(nextPage);

      await fetchFuelRecords(
        nextPage,
        searchTerm
      );
    } catch (error) {
      console.error(
        "DELETE FUEL ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete fuel record"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     FILTER
  ===================================================== */

  const handleFilterChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);

    setSearchTerm("");

    setCurrentPage(1);
  };

  /* =====================================================
     LOCAL FILTER
     This also protects the UI if the backend does
     not yet implement filter parameters.
  ===================================================== */

  const filteredRecords =
    useMemo(() => {
      return records.filter(
        (item) => {
          const search =
            searchTerm
              .trim()
              .toLowerCase();

          const matchesSearch =
            !search ||
            String(
              item.employeeName || ""
            )
              .toLowerCase()
              .includes(search) ||
            String(
              item.pumpName || ""
            )
              .toLowerCase()
              .includes(search) ||
            String(
              item.invoiceNo || ""
            )
              .toLowerCase()
              .includes(search);

          const matchesEmployee =
            !filters.employeeName ||
            item.employeeName ===
              filters.employeeName;

          const matchesPump =
            !filters.pumpName ||
            item.pumpName ===
              filters.pumpName;

          const amount =
            Number(
              item.amount || 0
            );

          const matchesMin =
            !filters.minAmount ||
            amount >=
              Number(
                filters.minAmount
              );

          const matchesMax =
            !filters.maxAmount ||
            amount <=
              Number(
                filters.maxAmount
              );

          let matchesDate =
            true;

          if (
            filters.fromDate ||
            filters.toDate
          ) {
            const itemDate =
              new Date(item.date);

            if (
              !Number.isNaN(
                itemDate.getTime()
              )
            ) {
              if (
                filters.fromDate &&
                itemDate <
                  new Date(
                    `${filters.fromDate}T00:00:00`
                  )
              ) {
                matchesDate = false;
              }

              if (
                filters.toDate &&
                itemDate >
                  new Date(
                    `${filters.toDate}T23:59:59`
                  )
              ) {
                matchesDate = false;
              }
            }
          }

          return (
            matchesSearch &&
            matchesEmployee &&
            matchesPump &&
            matchesMin &&
            matchesMax &&
            matchesDate
          );
        }
      );
    }, [
      records,
      searchTerm,
      filters,
    ]);

  /* =====================================================
     TOTAL AMOUNT
  ===================================================== */

  const totalAmount =
    useMemo(() => {
      return filteredRecords.reduce(
        (sum, item) => {
          return (
            sum +
            (Number(
              item.amount || 0
            ) || 0)
          );
        },
        0
      );
    }, [filteredRecords]);

  /* =====================================================
     TOTAL VOLUME
  ===================================================== */

  const totalVolume =
    useMemo(() => {
      return filteredRecords.reduce(
        (sum, item) => {
          return (
            sum +
            (Number(
              item.volume || 0
            ) || 0)
          );
        },
        0
      );
    }, [filteredRecords]);

  /* =====================================================
     AVERAGE RATE
  ===================================================== */

  const averageRate =
    useMemo(() => {
      if (!filteredRecords.length)
        return 0;

      const totalRate =
        filteredRecords.reduce(
          (sum, item) =>
            sum +
            (Number(
              item.rate || 0
            ) || 0),
          0
        );

      return (
        totalRate /
        filteredRecords.length
      );
    }, [filteredRecords]);

  /* =====================================================
     UNIQUE PUMPS
  ===================================================== */

  const pumpOptions =
    useMemo(() => {
      return [
        ...new Set(
          records
            .map(
              (item) =>
                item.pumpName
            )
            .filter(Boolean)
        ),
      ].sort();
    }, [records]);

  /* =====================================================
     EXCEL DOWNLOAD
  ===================================================== */

  const downloadExcel = () => {
    if (!filteredRecords.length) {
      alert(
        "No fuel records available to export."
      );

      return;
    }

    const excelRows =
      filteredRecords.map(
        (item, index) => ({
          "S.No": index + 1,

          "Employee Name":
            item.employeeName ||
            "",

          "Pump Name":
            item.pumpName || "",

          "Date":
            formatDateDisplay(
              item.date
            ),

          "Invoice No.":
            item.invoiceNo || "",

          "KM":
            Number(
              item.km || 0
            ),

          "Rate per Litre":
            Number(
              item.rate || 0
            ),

          "Volume (Litre)":
            Number(
              item.volume || 0
            ),

          "Amount (₹)":
            Number(
              item.amount || 0
            ),

          "Fuel Bill":
            item.fuelBillOriginalName ||
            item.fuelBillName ||
            (item.fuelBill
              ? "Uploaded"
              : "Not Uploaded"),
        })
      );

    excelRows.push({
      "S.No": "",
      "Employee Name": "",
      "Pump Name": "",
      Date: "",
      "Invoice No.": "",
      KM: "",
      "Rate per Litre":
        "",
      "Volume (Litre)":
        totalVolume,
      "Amount (₹)":
        totalAmount,
      "Fuel Bill": "",
    });

    const worksheet =
      XLSX.utils.json_to_sheet(
        excelRows
      );

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 24 },
      { wch: 30 },
      { wch: 15 },
      { wch: 18 },
      { wch: 14 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
    ];

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Fuel Report"
    );

    const date =
      new Date()
        .toISOString()
        .split("T")[0];

    XLSX.writeFile(
      workbook,
      `Fuel_Report_${date}.xlsx`
    );
  };

  /* =====================================================
     OPEN BILL
  ===================================================== */

  const openFuelBill = (record) => {
    const bill =
      record?.fuelBill ||
      record?.fuelBillUrl ||
      record?.bill;

    if (!bill) {
      alert(
        "Fuel bill is not available."
      );

      return;
    }

    let url = bill;

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      const base =
        API.defaults?.baseURL ||
        "";

      url =
        `${base.replace(
          /\/api$/,
          ""
        )}/${String(
          bill
        ).replace(
          /^\/+/,
          ""
        )}`;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     FORMAT NUMBER
  ===================================================== */

  const formatNum = (value) => {
    const number =
      parseFloat(value);

    if (Number.isNaN(number)) {
      return "0";
    }

    return number.toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    );
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDateDisplay = (
    value
  ) => {
    if (!value) return "";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const year =
      date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    fetchFuelRecords(
      page,
      searchTerm
    );
  };

  const getPaginationPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start =
        Math.max(
          2,
          currentPage - 1
        );

      const end =
        Math.min(
          totalPages - 1,
          currentPage + 1
        );

      for (
        let i = start;
        i <= end;
        i++
      ) {
        pages.push(i);
      }

      if (
        currentPage <
        totalPages - 2
      ) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
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
            <Icons.FuelPump />
          </div>

          <div>
            <h1 className="fuel-management-header-title">
              Fuel Entry
            </h1>

            <p className="fuel-management-header-subtitle">
              Manage fuel records for
              organization vehicles.
            </p>
          </div>

        </div>

        <div className="fuel-management-breadcrumbs">
          Accounts & Expenses &gt;
          Vehicle Controller &gt;
          <span>
            Fuel Entry
          </span>
        </div>

      </div>

      {/* FORM */}

      <div className="fuel-management-card">

        <div className="fuel-management-card-title">
          {editingId
            ? "Edit Fuel Entry"
            : "Add Fuel Entry"}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="fuel-management-form-grid">

            {/* EMPLOYEE */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Employee Name{" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.User />
                </div>

                <select
                  className="fuel-management-input fuel-management-select"
                  name="employeeName"
                  value={
                    formData.employeeName
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                  disabled={
                    teachersLoading
                  }
                >
                  <option value="">
                    {teachersLoading
                      ? "Loading Teachers..."
                      : teachers.length ===
                        0
                      ? "No Teachers Found"
                      : "Select Employee"}
                  </option>

                  {teachers.map(
                    (teacher) => (
                      <option
                        key={
                          teacher._id
                        }
                        value={
                          teacher.name
                        }
                      >
                        {teacher.name}

                        {teacher.department
                          ? ` - ${teacher.department}`
                          : ""}
                      </option>
                    )
                  )}
                </select>

                <div className="fuel-management-select-arrow">
                  <Icons.ChevronDown />
                </div>

              </div>

            </div>

            {/* PUMP */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Pump Name{" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.FuelPump />
                </div>

                <select
                  className="fuel-management-input fuel-management-select"
                  name="pumpName"
                  value={
                    formData.pumpName
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                >
                  <option value="">
                    Select Pump
                  </option>

                  <option value="Indian Oil - City Pump">
                    Indian Oil - City Pump
                  </option>

                  <option value="HP Petrol Pump - Main Road">
                    HP Petrol Pump - Main Road
                  </option>

                  <option value="Bharat Petroleum">
                    Bharat Petroleum
                  </option>

                  <option value="Reliance Petrol Pump">
                    Reliance Petrol Pump
                  </option>

                  <option value="Indian Oil - Highway">
                    Indian Oil - Highway
                  </option>
                </select>

                <div className="fuel-management-select-arrow">
                  <Icons.ChevronDown />
                </div>

              </div>

            </div>

            {/* DATE */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Date{" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.Calendar />
                </div>

                <input
                  type="date"
                  className="fuel-management-input"
                  name="date"
                  value={
                    formData.date
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

            </div>

            {/* INVOICE */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Invoice No.{" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.FileText />
                </div>

                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Enter Invoice No."
                  name="invoiceNo"
                  value={
                    formData.invoiceNo
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

            </div>

            {/* KM */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                KM (Odometer){" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.Gauge />
                </div>

                <input
                  type="number"
                  min="0"
                  className="fuel-management-input"
                  placeholder="Enter KM"
                  name="km"
                  value={
                    formData.km
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

                <span className="fuel-management-input-suffix">
                  km
                </span>

              </div>

            </div>

            {/* RATE */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Rate per Litre (₹){" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.Rupee />
                </div>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="fuel-management-input"
                  placeholder="Enter rate"
                  name="rate"
                  value={
                    formData.rate
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

                <span className="fuel-management-input-suffix">
                  /Ltr
                </span>

              </div>

            </div>

            {/* VOLUME */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Volume (Litre){" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.Droplet />
                </div>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="fuel-management-input"
                  placeholder="Enter volume"
                  name="volume"
                  value={
                    formData.volume
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

                <span className="fuel-management-input-suffix">
                  Ltr
                </span>

              </div>

            </div>

            {/* AMOUNT */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">
                Amount (₹){" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">
                  <Icons.Rupee />
                </div>

                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Auto calculated"
                  name="amount"
                  value={
                    formData.amount
                  }
                  readOnly
                  style={{
                    backgroundColor:
                      "#F8FAFC",
                  }}
                />

              </div>

            </div>

            {/* =================================================
                FUEL BILL
            ================================================= */}

            <div className="fuel-management-field fuel-bill-field">

              <label className="fuel-management-label">
                Fuel Bill{" "}
                <span className="fuel-management-required">
                  *
                </span>
              </label>

              <div
                className={`fuel-bill-upload ${
                  formData.fuelBillName
                    ? "has-file"
                    : ""
                }`}
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <div className="fuel-bill-upload-icon">
                  {formData.fuelBillName ? (
                    <Icons.FileText />
                  ) : (
                    <Icons.Upload />
                  )}
                </div>

                <div className="fuel-bill-upload-content">

                  <strong>
                    {formData.fuelBillName ||
                      "Upload Fuel Bill"}
                  </strong>

                  <span>
                    {formData.fuelBillName
                      ? "Click to replace file"
                      : "PDF, JPG or PNG · Max 5MB"}
                  </span>

                </div>

                {formData.fuelBillName && (
                  <button
                    type="button"
                    className="fuel-bill-remove"
                    onClick={(e) => {
                      e.stopPropagation();

                      setFormData(
                        (prev) => ({
                          ...prev,
                          fuelBill: null,
                          fuelBillName:
                            "",
                        })
                      );

                      if (
                        fileInputRef.current
                      ) {
                        fileInputRef.current.value =
                          "";
                      }
                    }}
                  >
                    <Icons.X />
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={
                    handleFuelBillChange
                  }
                  style={{
                    display: "none",
                  }}
                />

              </div>

              {editingId &&
                !formData.fuelBill &&
                formData.fuelBillName && (
                  <small className="fuel-bill-existing">
                    Existing bill:
                    {" "}
                    {formData.fuelBillName}
                  </small>
                )}

            </div>

            {/* INFO */}

            <div className="fuel-management-info-banner">

              <Icons.Info />

              <span>
                Amount will be calculated
                automatically
                {" "}
                <strong>
                  (Rate × Volume)
                </strong>
              </span>

            </div>

          </div>

          {/* ACTION */}

          <div className="fuel-management-form-actions">

            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-reset"
              onClick={
                handleReset
              }
              disabled={saving}
            >
              Reset
            </button>

            <button
              type="submit"
              className="fuel-management-btn fuel-management-btn-save"
              disabled={
                saving ||
                teachersLoading
              }
            >
              <Icons.Save />

              {saving
                ? "Saving..."
                : editingId
                ? "Update Entry"
                : "Save Entry"}
            </button>

          </div>

        </form>

      </div>

      {/* =====================================================
          LIST CARD
      ===================================================== */}

      <div className="fuel-management-card">

        <div className="fuel-management-list-top">

          <div
            className="fuel-management-card-title"
            style={{
              margin: 0,
              paddingBottom: 0,
            }}
          >
            Fuel Entry List
          </div>

          <div className="fuel-management-list-actions">

            <div className="fuel-management-search-wrapper">

              <div
                className="fuel-management-input-icon"
                style={{
                  top: "11px",
                }}
              >
                <Icons.Search />
              </div>

              <input
                type="text"
                className="fuel-management-search-input"
                placeholder="Search fuel entries..."
                value={
                  searchTerm
                }
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            {/* FILTER */}

            <button
              type="button"
              className={`fuel-management-btn fuel-management-btn-filter ${
                showFilters
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setShowFilters(
                  !showFilters
                )
              }
            >
              <Icons.Filter />

              Filter

              {(filters.employeeName ||
                filters.pumpName ||
                filters.fromDate ||
                filters.toDate ||
                filters.minAmount ||
                filters.maxAmount) && (
                <span className="fuel-filter-count">
                  !
                </span>
              )}
            </button>

            {/* EXCEL */}

            <button
              type="button"
              className="fuel-management-btn fuel-excel-btn"
              onClick={
                downloadExcel
              }
            >
              <Icons.Download />
              Excel
            </button>

            {/* ADD */}

            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-save"
              onClick={() => {
                handleReset();

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <Icons.Plus />
              Add Fuel Entry
            </button>

          </div>

        </div>

        {/* =================================================
            FILTER PANEL
        ================================================= */}

        {showFilters && (
          <div className="fuel-filter-panel">

            <div className="fuel-filter-panel-header">

              <div>
                <h3>
                  Filter Fuel Records
                </h3>

                <p>
                  Narrow down records by
                  employee, pump, date or
                  amount.
                </p>
              </div>

              <button
                type="button"
                className="fuel-clear-filter-btn"
                onClick={
                  clearFilters
                }
              >
                Clear All
              </button>

            </div>

            <div className="fuel-filter-grid">

              {/* EMPLOYEE */}

              <div className="fuel-filter-group">

                <label>
                  Employee
                </label>

                <select
                  name="employeeName"
                  value={
                    filters.employeeName
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All Employees
                  </option>

                  {teachers.map(
                    (teacher) => (
                      <option
                        key={
                          teacher._id
                        }
                        value={
                          teacher.name
                        }
                      >
                        {teacher.name}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* PUMP */}

              <div className="fuel-filter-group">

                <label>
                  Pump
                </label>

                <select
                  name="pumpName"
                  value={
                    filters.pumpName
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  <option value="">
                    All Pumps
                  </option>

                  {pumpOptions.map(
                    (pump) => (
                      <option
                        key={pump}
                        value={pump}
                      >
                        {pump}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* FROM */}

              <div className="fuel-filter-group">

                <label>
                  From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={
                    filters.fromDate
                  }
                  max={
                    filters.toDate ||
                    undefined
                  }
                  onChange={
                    handleFilterChange
                  }
                />

              </div>

              {/* TO */}

              <div className="fuel-filter-group">

                <label>
                  To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={
                    filters.toDate
                  }
                  min={
                    filters.fromDate ||
                    undefined
                  }
                  onChange={
                    handleFilterChange
                  }
                />

              </div>

              {/* MIN */}

              <div className="fuel-filter-group">

                <label>
                  Minimum Amount
                </label>

                <div className="fuel-filter-input-wrap">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    name="minAmount"
                    placeholder="0"
                    value={
                      filters.minAmount
                    }
                    onChange={
                      handleFilterChange
                    }
                  />

                </div>

              </div>

              {/* MAX */}

              <div className="fuel-filter-group">

                <label>
                  Maximum Amount
                </label>

                <div className="fuel-filter-input-wrap">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    name="maxAmount"
                    placeholder="Unlimited"
                    value={
                      filters.maxAmount
                    }
                    onChange={
                      handleFilterChange
                    }
                  />

                </div>

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="fuel-summary-grid">

          <div className="fuel-summary-card">

            <div className="fuel-summary-icon purple">
              <Icons.FuelPump />
            </div>

            <div>
              <span>
                Total Records
              </span>

              <strong>
                {totalRecords}
              </strong>
            </div>

          </div>

          <div className="fuel-summary-card">

            <div className="fuel-summary-icon green">
              <Icons.Rupee />
            </div>

            <div>
              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits:
                      2,
                    maximumFractionDigits:
                      2,
                  }
                )}
              </strong>
            </div>

          </div>

          <div className="fuel-summary-card">

            <div className="fuel-summary-icon blue">
              <Icons.Droplet />
            </div>

            <div>
              <span>
                Total Fuel
              </span>

              <strong>
                {totalVolume.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits:
                      2,
                  }
                )}
                {" "}
                L
              </strong>
            </div>

          </div>

          <div className="fuel-summary-card">

            <div className="fuel-summary-icon orange">
              <Icons.Rupee />
            </div>

            <div>
              <span>
                Average Rate
              </span>

              <strong>
                ₹
                {averageRate.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits:
                      2,
                    maximumFractionDigits:
                      2,
                  }
                )}
              </strong>
            </div>

          </div>

        </div>

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="fuel-management-table-container">

          <table className="fuel-management-table">

            <thead>

              <tr>

                <th
                  style={{
                    width: "40px",
                  }}
                >
                  #
                </th>

                <th>
                  Employee Name
                </th>

                <th>
                  Pump Name
                </th>

                <th>
                  Date
                </th>

                <th>
                  Invoice No.
                </th>

                <th>
                  KM
                </th>

                <th>
                  Rate per Litre (₹)
                </th>

                <th>
                  Volume (Litre)
                </th>

                <th>
                  Amount (₹)
                </th>

                <th>
                  Fuel Bill
                </th>

                <th
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="11"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "40px",
                      color:
                        "#94A3B8",
                    }}
                  >
                    <div className="fuel-table-loading">
                      <div className="fuel-spinner" />
                      Loading fuel entries...
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length >
                0 ? (
                filteredRecords.map(
                  (item, index) => (
                    <tr
                      key={
                        item._id
                      }
                    >

                      <td>
                        {(
                          (
                            currentPage -
                            1
                          ) *
                            10
                        ) +
                          index +
                          1}
                      </td>

                      <td
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {item.employeeName ||
                          "N/A"}
                      </td>

                      <td>
                        <span className="fuel-pump-chip">
                          {item.pumpName}
                        </span>
                      </td>

                      <td>
                        {formatDateDisplay(
                          item.date
                        )}
                      </td>

                      <td>
                        {item.invoiceNo}
                      </td>

                      <td>
                        {formatNum(
                          item.km
                        )}
                      </td>

                      <td>
                        {parseFloat(
                          item.rate ||
                            0
                        ).toFixed(2)}
                      </td>

                      <td>
                        {parseFloat(
                          item.volume ||
                            0
                        ).toFixed(2)}
                      </td>

                      <td
                        className="fuel-amount-cell"
                      >
                        ₹
                        {formatNum(
                          item.amount
                        )}
                      </td>

                      {/* BILL */}

                      <td>

                        {item.fuelBill ||
                        item.fuelBillUrl ||
                        item.bill ? (
                          <button
                            type="button"
                            className="fuel-bill-view-btn"
                            onClick={() =>
                              openFuelBill(
                                item
                              )
                            }
                          >
                            <Icons.Eye />
                            View
                          </button>
                        ) : (
                          <span className="fuel-no-bill">
                            No Bill
                          </span>
                        )}

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="fuel-management-table-actions">

                          <button
                            type="button"
                            className="fuel-management-action-btn edit"
                            title="Edit"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                            disabled={
                              saving ||
                              deletingId ===
                                item._id
                            }
                          >
                            <Icons.Edit />
                          </button>

                          <button
                            type="button"
                            className="fuel-management-action-btn delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                            disabled={
                              deletingId ===
                              item._id
                            }
                          >
                            <Icons.Trash />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "24px",
                      color:
                        "#94A3B8",
                    }}
                  >
                    No fuel entries found.
                  </td>
                </tr>
              )}

            </tbody>

            {/* TOTAL */}

            {filteredRecords.length >
              0 && (
              <tfoot>

                <tr className="fuel-total-row">

                  <td
                    colSpan="7"
                  >
                    Total
                  </td>

                  <td>
                    {totalVolume.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits:
                          2,
                      }
                    )}{" "}
                    L
                  </td>

                  <td>
                    ₹
                    {totalAmount.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits:
                          2,
                        maximumFractionDigits:
                          2,
                      }
                    )}
                  </td>

                  <td
                    colSpan="2"
                  />

                </tr>

              </tfoot>
            )}

          </table>

        </div>

        {/* FOOTER */}

        <div className="fuel-management-footer">

          <div>
            Showing{" "}

            {filteredRecords.length >
            0
              ? (
                  (
                    currentPage -
                    1
                  ) *
                    10
                ) + 1
              : 0}

            {" "}to{" "}

            {filteredRecords.length >
            0
              ? (
                  (
                    currentPage -
                    1
                  ) *
                    10
                ) +
                filteredRecords.length
              : 0}

            {" "}of{" "}

            {totalRecords}

            {" "}entries
          </div>

          <div className="fuel-management-pagination">

            <button
              type="button"
              className="fuel-management-page-btn"
              disabled={
                currentPage ===
                1
              }
              onClick={() =>
                handlePageChange(
                  currentPage - 1
                )
              }
            >
              &lt;
            </button>

            {getPaginationPages().map(
              (page, index) =>
                page === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="fuel-pagination-dots"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={page}
                    className={`fuel-management-page-btn ${
                      currentPage ===
                      page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                  >
                    {page}
                  </button>
                )
            )}

            <button
              type="button"
              className="fuel-management-page-btn"
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              onClick={() =>
                handlePageChange(
                  currentPage + 1
                )
              }
            >
              &gt;
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FuelManagement;