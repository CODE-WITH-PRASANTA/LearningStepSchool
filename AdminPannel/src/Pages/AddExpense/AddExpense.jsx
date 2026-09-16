import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import "./AddExpense.css";

import {
  FaWallet,
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaFileInvoice,
  FaCloudUploadAlt,
  FaTimes,
  FaCalendarAlt,
  FaCreditCard,
  FaUser,
  FaMoneyBillWave,
  FaBuilding,
  FaFilePdf,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaReceipt,
  FaFilter,
  FaSortAmountDown,
  FaUndo,
  FaFileExcel,
} from "react-icons/fa";

import Swal from "sweetalert2";

import * as XLSX from "xlsx";

import API from "../../api/axios";

/* =========================================================
   FILE / BILL URL HELPER
========================================================= */

const FILE_BASE_URL =
  API.defaults?.baseURL?.replace(
    /\/api\/?$/,
    ""
  ) || "http://localhost:5000";

const getBillUrl = (bill) => {
  if (!bill) return "";

  if (
    bill.startsWith("http://") ||
    bill.startsWith("https://") ||
    bill.startsWith("blob:") ||
    bill.startsWith("data:")
  ) {
    return bill;
  }

  return `${FILE_BASE_URL}${
    bill.startsWith("/") ? "" : "/"
  }${bill}`;
};

/* =========================================================
   COMPONENT
========================================================= */

const AddExpense = () => {
  const [activeMenu, setActiveMenu] =
    useState(null);

  const menuRef = useRef(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [editId, setEditId] =
    useState(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [formData, setFormData] =
    useState({
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

  const [billFile, setBillFile] =
    useState(null);

  const [billPreview, setBillPreview] =
    useState("");

  /* =======================================================
     DATA
  ======================================================= */

  const [expenseHeads, setExpenseHeads] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  /* =======================================================
     VIEW MODAL
  ======================================================= */

  const [selectedExpense, setSelectedExpense] =
    useState(null);

  const [isViewModalOpen, setIsViewModalOpen] =
    useState(false);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [showFilters, setShowFilters] =
    useState(false);

  const [filters, setFilters] =
    useState({
      head: "",
      accountType: "",
      paymentMode: "",
      billStatus: "all",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "newest",
    });

  /* =======================================================
     OPTIONS
  ======================================================= */

  const accountTypes = [
    "Savings",
    "Salary",
    "Current",
  ];

  const paymentModes = [
    "Cash",
    "Card",
    "UPI",
    "Bank Transfer",
  ];

  /* =======================================================
     CLOSE DROPDOWN
  ======================================================= */

  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsViewModalOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =======================================================
     FETCH EXPENSE HEADS
  ======================================================= */

  useEffect(() => {
    fetchExpenseHeads();
  }, []);

  const fetchExpenseHeads = async () => {
    try {
      const res =
        await API.get("/expense-heads");

      setExpenseHeads(
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || []
      );
    } catch (err) {
      console.log(
        "EXPENSE HEAD ERROR:",
        err
      );
    }
  };

  /* =======================================================
     FETCH EXPENSES
  ======================================================= */

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res =
        await API.get("/expenses");

      setExpenses(
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || []
      );
    } catch (err) {
      console.log(
        "EXPENSE FETCH ERROR:",
        err
      );

      Swal.fire(
        "Error",
        "Unable to load expenses.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  /* =======================================================
     BILL CHANGE
  ======================================================= */

  const handleBillChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      Swal.fire(
        "Invalid File",
        "Only PDF, JPG, JPEG and PNG files are allowed.",
        "error"
      );

      e.target.value = "";

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      Swal.fire(
        "File Too Large",
        "Bill file size should not exceed 5 MB.",
        "error"
      );

      e.target.value = "";

      return;
    }

    setBillFile(file);

    if (
      file.type.startsWith(
        "image/"
      )
    ) {
      const reader =
        new FileReader();

      reader.onloadend = () => {
        setBillPreview(
          reader.result
        );
      };

      reader.readAsDataURL(file);
    } else {
      setBillPreview("");
    }
  };

  /* =======================================================
     REMOVE BILL
  ======================================================= */

  const removeBillFile = () => {
    setBillFile(null);
    setBillPreview("");

    const input =
      document.getElementById(
        "billUpload"
      );

    if (input) {
      input.value = "";
    }
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setEditId(null);

    setFormData({
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

    removeBillFile();
  };

  /* =======================================================
     SAVE EXPENSE
  ======================================================= */

  const handleSave = async () => {
    if (
      !formData.head ||
      !formData.name ||
      !formData.amount ||
      !formData.date
    ) {
      Swal.fire(
        "Required Fields",
        "Please fill all required fields.",
        "warning"
      );

      return;
    }

    try {
      setLoading(true);

      const data =
        new FormData();

      data.append(
        "head",
        formData.head
      );

      data.append(
        "accountType",
        formData.accountType
      );

      data.append(
        "accountName",
        formData.accountName
      );

      data.append(
        "name",
        formData.name
      );

      data.append(
        "amount",
        formData.amount
      );

      data.append(
        "invoice",
        formData.invoice
      );

      data.append(
        "date",
        formData.date
      );

      data.append(
        "paymentMode",
        formData.paymentMode
      );

      data.append(
        "description",
        formData.description
      );

      if (billFile) {
        data.append(
          "bill",
          billFile
        );
      }

      if (editId) {
        await API.put(
          `/expenses/${editId}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Expense Updated",
          text: "Expense has been updated successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        await API.post(
          "/expenses",
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Expense Added",
          text: "Expense has been saved successfully.",
          timer: 1800,
          showConfirmButton: false,
        });
      }

      await fetchExpenses();

      resetForm();
    } catch (err) {
      console.log(
        "EXPENSE SAVE ERROR:",
        err
      );

      Swal.fire(
        "Error",
        err?.response?.data?.message ||
          "Operation failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (item) => {
    setFormData({
      head: item.head || "",
      accountType:
        item.accountType || "",
      accountName:
        item.accountName || "",
      name: item.name || "",
      amount:
        item.amount || "",
      invoice:
        item.invoice || "",
      date: item.date
        ? item.date.slice(0, 10)
        : "",
      paymentMode:
        item.paymentMode || "",
      description:
        item.description || "",
    });

    setEditId(item._id);

    setBillPreview(
      item.bill || ""
    );

    setBillFile(null);

    setActiveMenu(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     VIEW
  ======================================================= */

  const handleView = (item) => {
    setSelectedExpense(item);
    setIsViewModalOpen(true);
    setActiveMenu(null);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);

    setTimeout(() => {
      setSelectedExpense(null);
    }, 200);
  };

  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (
    id
  ) => {
    setActiveMenu(null);

    const result =
      await Swal.fire({
        title: "Delete Expense?",
        text: "This expense will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
        reverseButtons: true,
        confirmButtonColor:
          "#ef4444",
      });

    if (!result.isConfirmed)
      return;

    try {
      setLoading(true);

      await API.delete(
        `/expenses/${id}`
      );

      await fetchExpenses();

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Expense has been removed.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);

      Swal.fire(
        "Error",
        "Delete failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     FILTER CHANGE
  ======================================================= */

  const handleFilterChange = (
    e
  ) => {
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

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setFilters({
      head: "",
      accountType: "",
      paymentMode: "",
      billStatus: "all",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "newest",
    });

    setCurrentPage(1);
  };

  /* =======================================================
     ACTIVE FILTER COUNT
  ======================================================= */

  const activeFilterCount = [
    filters.head,
    filters.accountType,
    filters.paymentMode,
    filters.billStatus !== "all"
      ? filters.billStatus
      : "",
    filters.dateFrom,
    filters.dateTo,
    filters.minAmount,
    filters.maxAmount,
    filters.sortBy !== "newest"
      ? filters.sortBy
      : "",
  ].filter(Boolean).length;

  /* =======================================================
     SEARCH + FILTER
  ======================================================= */

  const filteredExpenses =
    expenses
      .filter((item) => {
        const search =
          searchQuery
            .toLowerCase()
            .trim();

        if (!search) return true;

        return (
          item.head
            ?.toLowerCase()
            .includes(search) ||
          item.name
            ?.toLowerCase()
            .includes(search) ||
          item.invoice
            ?.toLowerCase()
            .includes(search) ||
          item.accountName
            ?.toLowerCase()
            .includes(search) ||
          item.paymentMode
            ?.toLowerCase()
            .includes(search) ||
          item.accountType
            ?.toLowerCase()
            .includes(search)
        );
      })

      .filter((item) => {
        if (!filters.head)
          return true;

        return (
          item.head ===
          filters.head
        );
      })

      .filter((item) => {
        if (!filters.accountType)
          return true;

        return (
          item.accountType ===
          filters.accountType
        );
      })

      .filter((item) => {
        if (!filters.paymentMode)
          return true;

        return (
          item.paymentMode ===
          filters.paymentMode
        );
      })

      .filter((item) => {
        if (
          filters.billStatus ===
          "all"
        ) {
          return true;
        }

        if (
          filters.billStatus ===
          "withBill"
        ) {
          return Boolean(
            item.bill
          );
        }

        if (
          filters.billStatus ===
          "withoutBill"
        ) {
          return !item.bill;
        }

        return true;
      })

      .filter((item) => {
        if (!filters.dateFrom)
          return true;

        if (!item.date)
          return false;

        const itemDate =
          new Date(item.date);

        const fromDate =
          new Date(
            `${filters.dateFrom}T00:00:00`
          );

        return (
          itemDate >=
          fromDate
        );
      })

      .filter((item) => {
        if (!filters.dateTo)
          return true;

        if (!item.date)
          return false;

        const itemDate =
          new Date(item.date);

        const toDate =
          new Date(
            `${filters.dateTo}T23:59:59.999`
          );

        return (
          itemDate <=
          toDate
        );
      })

      .filter((item) => {
        if (
          filters.minAmount ===
          ""
        ) {
          return true;
        }

        return (
          Number(item.amount || 0) >=
          Number(
            filters.minAmount
          )
        );
      })

      .filter((item) => {
        if (
          filters.maxAmount ===
          ""
        ) {
          return true;
        }

        return (
          Number(item.amount || 0) <=
          Number(
            filters.maxAmount
          )
        );
      })

      .sort((a, b) => {
        if (
          filters.sortBy ===
          "newest"
        ) {
          return (
            new Date(
              b.date || b.createdAt
            ) -
            new Date(
              a.date || a.createdAt
            )
          );
        }

        if (
          filters.sortBy ===
          "oldest"
        ) {
          return (
            new Date(
              a.date || a.createdAt
            ) -
            new Date(
              b.date || b.createdAt
            )
          );
        }

        if (
          filters.sortBy ===
          "amountHigh"
        ) {
          return (
            Number(b.amount || 0) -
            Number(a.amount || 0)
          );
        }

        if (
          filters.sortBy ===
          "amountLow"
        ) {
          return (
            Number(a.amount || 0) -
            Number(b.amount || 0)
          );
        }

        return 0;
      });

  /* =======================================================
     EXCEL REPORT
  ======================================================= */

  const downloadExcelReport = () => {
    if (
      filteredExpenses.length ===
      0
    ) {
      Swal.fire(
        "No Data",
        "There are no expenses available for the current search/filter.",
        "info"
      );

      return;
    }

    try {
      const totalAmount =
        filteredExpenses.reduce(
          (total, item) =>
            total +
            Number(
              item.amount || 0
            ),
          0
        );

      /* -----------------------------------------------
         EXPENSE REPORT DATA
      ------------------------------------------------ */

      const reportData =
        filteredExpenses.map(
          (item, index) => ({
            "S.No": index + 1,

            "Expense Head":
              item.head || "",

            "Name":
              item.name || "",

            "Account Type":
              item.accountType || "",

            "Account Name":
              item.accountName || "",

            "Invoice No":
              item.invoice || "",

            "Amount":
              Number(
                item.amount || 0
              ),

            "Date":
              item.date
                ? new Date(
                    item.date
                  ).toLocaleDateString(
                    "en-IN"
                  )
                : "",

            "Payment Mode":
              item.paymentMode || "",

            "Bill":
              item.bill
                ? "Available"
                : "Not Available",

            "Bill URL":
              item.bill
                ? getBillUrl(
                    item.bill
                  )
                : "",

            "Description":
              item.description || "",
          })
        );

      /* -----------------------------------------------
         CREATE WORKBOOK
      ------------------------------------------------ */

      const workbook =
        XLSX.utils.book_new();

      /* -----------------------------------------------
         REPORT SHEET
      ------------------------------------------------ */

      const reportSheet =
        XLSX.utils.json_to_sheet(
          reportData
        );

      reportSheet["!cols"] = [
        { wch: 8 },
        { wch: 22 },
        { wch: 22 },
        { wch: 18 },
        { wch: 22 },
        { wch: 18 },
        { wch: 16 },
        { wch: 16 },
        { wch: 18 },
        { wch: 16 },
        { wch: 55 },
        { wch: 45 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        reportSheet,
        "Expense Report"
      );

      /* -----------------------------------------------
         SUMMARY SHEET
      ------------------------------------------------ */

      const summaryData = [
        {
          "Report":
            "Expense Report",
          "Value":
            "",
        },
        {
          "Report":
            "Generated On",
          "Value":
            new Date().toLocaleString(
              "en-IN"
            ),
        },
        {
          "Report":
            "Total Expenses",
          "Value":
            filteredExpenses.length,
        },
        {
          "Report":
            "Total Amount",
          "Value":
            totalAmount,
        },
        {
          "Report":
            "Expenses With Bill",
          "Value":
            filteredExpenses.filter(
              (item) =>
                Boolean(item.bill)
            ).length,
        },
        {
          "Report":
            "Expenses Without Bill",
          "Value":
            filteredExpenses.filter(
              (item) =>
                !item.bill
            ).length,
        },
        {
          "Report":
            "Search",
          "Value":
            searchQuery ||
            "All",
        },
        {
          "Report":
            "Expense Head",
          "Value":
            filters.head ||
            "All",
        },
        {
          "Report":
            "Account Type",
          "Value":
            filters.accountType ||
            "All",
        },
        {
          "Report":
            "Payment Mode",
          "Value":
            filters.paymentMode ||
            "All",
        },
        {
          "Report":
            "Bill Filter",
          "Value":
            filters.billStatus ===
            "all"
              ? "All"
              : filters.billStatus ===
                "withBill"
              ? "With Bill"
              : "Without Bill",
        },
        {
          "Report":
            "Date From",
          "Value":
            filters.dateFrom ||
            "All",
        },
        {
          "Report":
            "Date To",
          "Value":
            filters.dateTo ||
            "All",
        },
        {
          "Report":
            "Minimum Amount",
          "Value":
            filters.minAmount ||
            "All",
        },
        {
          "Report":
            "Maximum Amount",
          "Value":
            filters.maxAmount ||
            "All",
        },
        {
          "Report":
            "Sort",
          "Value":
            filters.sortBy,
        },
      ];

      const summarySheet =
        XLSX.utils.json_to_sheet(
          summaryData
        );

      summarySheet["!cols"] = [
        { wch: 28 },
        { wch: 35 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "Summary"
      );

      /* -----------------------------------------------
         PAYMENT SUMMARY SHEET
      ------------------------------------------------ */

      const paymentSummary = {};

      filteredExpenses.forEach(
        (item) => {
          const mode =
            item.paymentMode ||
            "Not Specified";

          if (
            !paymentSummary[mode]
          ) {
            paymentSummary[mode] = {
              "Payment Mode":
                mode,
              "Number of Expenses":
                0,
              "Total Amount":
                0,
            };
          }

          paymentSummary[
            mode
          ]["Number of Expenses"] += 1;

          paymentSummary[
            mode
          ]["Total Amount"] +=
            Number(
              item.amount || 0
            );
        }
      );

      const paymentSheet =
        XLSX.utils.json_to_sheet(
          Object.values(
            paymentSummary
          )
        );

      paymentSheet["!cols"] = [
        { wch: 25 },
        { wch: 22 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        paymentSheet,
        "Payment Summary"
      );

      /* -----------------------------------------------
         HEAD SUMMARY SHEET
      ------------------------------------------------ */

      const headSummary = {};

      filteredExpenses.forEach(
        (item) => {
          const head =
            item.head ||
            "Not Specified";

          if (!headSummary[head]) {
            headSummary[head] = {
              "Expense Head":
                head,
              "Number of Expenses":
                0,
              "Total Amount":
                0,
            };
          }

          headSummary[
            head
          ]["Number of Expenses"] += 1;

          headSummary[
            head
          ]["Total Amount"] +=
            Number(
              item.amount || 0
            );
        }
      );

      const headSheet =
        XLSX.utils.json_to_sheet(
          Object.values(
            headSummary
          )
        );

      headSheet["!cols"] = [
        { wch: 30 },
        { wch: 22 },
        { wch: 20 },
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        headSheet,
        "Head Summary"
      );

      /* -----------------------------------------------
         FILE NAME
      ------------------------------------------------ */

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const fileName =
        `Expense_Report_${today}.xlsx`;

      /* -----------------------------------------------
         DOWNLOAD
      ------------------------------------------------ */

      XLSX.writeFile(
        workbook,
        fileName
      );

      Swal.fire({
        icon: "success",
        title: "Excel Report Downloaded",
        text: `${filteredExpenses.length} expense records exported successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(
        "EXCEL EXPORT ERROR:",
        error
      );

      Swal.fire(
        "Export Error",
        "Unable to generate Excel report.",
        "error"
      );
    }
  };

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredExpenses.length /
          itemsPerPage
      )
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const indexOfLast =
    safeCurrentPage *
    itemsPerPage;

  const indexOfFirst =
    indexOfLast -
    itemsPerPage;

  const currentData =
    filteredExpenses.slice(
      indexOfFirst,
      indexOfLast
    );

  const changeItemsPerPage = (
    e
  ) => {
    setItemsPerPage(
      Number(e.target.value)
    );

    setCurrentPage(1);
  };

  const changeSearch = (e) => {
    setSearchQuery(
      e.target.value
    );

    setCurrentPage(1);
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    date
  ) => {
    if (!date) return "-";

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     FORMAT AMOUNT
  ======================================================= */

  const formatAmount = (
    amount
  ) => {
    const value =
      Number(amount);

    if (
      Number.isNaN(value)
    ) {
      return "₹0";
    }

    return value.toLocaleString(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }
    );
  };

  /* =======================================================
     BILL TYPE
  ======================================================= */

  const isPdfBill = (
    url
  ) => {
    if (!url) return false;

    return (
      url
        .toLowerCase()
        .includes(".pdf") ||
      url
        .toLowerCase()
        .includes(
          "application/pdf"
        )
    );
  };

  const isImageBill = (
    url
  ) => {
    if (!url) return false;

    return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(
      url
    );
  };

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalExpenseAmount =
    filteredExpenses.reduce(
      (total, item) =>
        total +
        Number(
          item.amount || 0
        ),
      0
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="ae-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="ae-header">

        <div className="ae-header-left">

          <div className="ae-header-icon-wrap">
            <FaWallet className="ae-icon" />
          </div>

          <div>
            <h2>
              Add Expense
            </h2>

            <p>
              Manage and track your
              business expenses
            </p>
          </div>

        </div>

        <span className="ae-breadcrumb">
          Expense / Add Expense
        </span>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="ae-summary">

        <div className="ae-summary-card">

          <div className="ae-summary-icon blue">
            <FaReceipt />
          </div>

          <div>
            <span>
              Total Expenses
            </span>

            <strong>
              {
                filteredExpenses.length
              }
            </strong>
          </div>

        </div>

        <div className="ae-summary-card">

          <div className="ae-summary-icon green">
            <FaMoneyBillWave />
          </div>

          <div>
            <span>
              Total Amount
            </span>

            <strong>
              {formatAmount(
                totalExpenseAmount
              )}
            </strong>
          </div>

        </div>

        <div className="ae-summary-card">

          <div className="ae-summary-icon purple">
            <FaFileInvoice />
          </div>

          <div>
            <span>
              Uploaded Bills
            </span>

            <strong>
              {
                filteredExpenses.filter(
                  (item) =>
                    item.bill
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="ae-layout">

        {/* =================================================
            FORM
        ================================================= */}

        <div className="ae-card ae-form-card">

          <div className="ae-card-top">

            <div className="ae-card-title">

              <div className="ae-card-title-icon">
                <FaPlus />
              </div>

              <div>

                <h3>
                  {editId
                    ? "Edit Expense"
                    : "Add New Expense"}
                </h3>

                <span>
                  {editId
                    ? "Update expense information"
                    : "Enter expense information"}
                </span>

              </div>

            </div>

            {editId && (
              <button
                type="button"
                className="ae-cancel-edit"
                onClick={
                  resetForm
                }
              >
                <FaTimes />
                Cancel
              </button>
            )}

          </div>

          <div className="ae-form ae-scroll">

            <div className="ae-form-grid">

              <div className="ae-field">

                <label>
                  Expense Head
                  <span>*</span>
                </label>

                <div className="ae-input-wrap">

                  <FaFileInvoice />

                  <select
                    name="head"
                    value={
                      formData.head
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Expense Head
                    </option>

                    {expenseHeads.map(
                      (e) => (
                        <option
                          key={e._id}
                          value={e.name}
                        >
                          {e.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Account Type
                </label>

                <div className="ae-input-wrap">

                  <FaBuilding />

                  <select
                    name="accountType"
                    value={
                      formData.accountType
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Account Type
                    </option>

                    {accountTypes.map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={index}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Account Name
                </label>

                <div className="ae-input-wrap">

                  <FaBuilding />

                  <select
                    name="accountName"
                    value={
                      formData.accountName
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Account
                    </option>

                    <option value="Office Account">
                      Office Account
                    </option>

                  </select>

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Name
                  <span>*</span>
                </label>

                <div className="ae-input-wrap">

                  <FaUser />

                  <input
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter name"
                  />

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Amount
                  <span>*</span>
                </label>

                <div className="ae-input-wrap">

                  <FaMoneyBillWave />

                  <input
                    type="number"
                    name="amount"
                    value={
                      formData.amount
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter amount"
                    min="0"
                  />

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Invoice No
                </label>

                <div className="ae-input-wrap">

                  <FaReceipt />

                  <input
                    name="invoice"
                    value={
                      formData.invoice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter invoice number"
                  />

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Date
                  <span>*</span>
                </label>

                <div className="ae-input-wrap">

                  <FaCalendarAlt />

                  <input
                    type="date"
                    name="date"
                    value={
                      formData.date
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              <div className="ae-field">

                <label>
                  Payment Mode
                </label>

                <div className="ae-input-wrap">

                  <FaCreditCard />

                  <select
                    name="paymentMode"
                    value={
                      formData.paymentMode
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Payment Mode
                    </option>

                    {paymentModes.map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={index}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

            </div>

            {/* BILL */}

            <div className="ae-field ae-bill-upload-field">

              <label>
                Upload Bill
              </label>

              <div className="ae-bill-upload">

                <input
                  id="billUpload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={
                    handleBillChange
                  }
                  className="ae-bill-input"
                />

                <label
                  htmlFor="billUpload"
                  className="ae-bill-label"
                >

                  <div className="ae-upload-icon">
                    <FaCloudUploadAlt />
                  </div>

                  <div className="ae-upload-content">

                    <strong>
                      Click to upload bill
                    </strong>

                    <span>
                      PDF, JPG, JPEG or PNG
                    </span>

                  </div>

                  <div className="ae-upload-action">
                    Browse
                  </div>

                </label>

              </div>

              {billFile && (
                <div className="ae-bill-file">

                  <div className="ae-bill-file-info">

                    <div className="ae-bill-file-icon">

                      {billFile.type ===
                      "application/pdf" ? (
                        <FaFilePdf />
                      ) : (
                        <FaImage />
                      )}

                    </div>

                    <div className="ae-bill-file-details">

                      <strong>
                        {
                          billFile.name
                        }
                      </strong>

                      <span>
                        {(
                          billFile.size /
                          1024
                        ).toFixed(
                          1
                        )}{" "}
                        KB
                      </span>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="ae-bill-remove"
                    onClick={
                      removeBillFile
                    }
                  >
                    <FaTimes />
                  </button>

                </div>
              )}

              {!billFile &&
                billPreview && (
                  <div className="ae-existing-bill">

                    <div>
                      <FaFileInvoice />

                      <span>
                        Existing bill attached
                      </span>
                    </div>

                    <a
                      href={getBillUrl(
                        billPreview
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>

                  </div>
                )}

              <small className="ae-bill-help">
                Maximum file size 5 MB
              </small>

            </div>

            {/* DESCRIPTION */}

            <div className="ae-field ae-description-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Write a short description about this expense..."
                rows="4"
              />

            </div>

            <div className="ae-form-actions">

              <button
                type="button"
                className="ae-reset-btn"
                onClick={
                  resetForm
                }
              >
                Reset
              </button>

              <button
                type="button"
                className="ae-btn"
                onClick={
                  handleSave
                }
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="ae-spinner" />
                    Saving...
                  </>
                ) : (
                  editId
                    ? "Update Expense"
                    : "Save Expense"
                )}

              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            LIST
        ================================================= */}

        <div className="ae-card ae-list-card">

          <div className="ae-card-top">

            <div className="ae-card-title">

              <div className="ae-card-title-icon list">
                <FaReceipt />
              </div>

              <div>

                <h3>
                  Expense List
                </h3>

                <span>
                  View and manage expenses
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              TOOLBAR
          ================================================= */}

          <div className="ae-table-toolbar">

            <div className="ae-show-control">

              <span>
                Show
              </span>

              <select
                value={
                  itemsPerPage
                }
                onChange={
                  changeItemsPerPage
                }
              >

                <option value="5">
                  5
                </option>

                <option value="10">
                  10
                </option>

                <option value="25">
                  25
                </option>

                <option value="50">
                  50
                </option>

              </select>

              <span>
                entries
              </span>

            </div>

            <div className="ae-search">

              <FaSearch />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={
                  changeSearch
                }
                placeholder="Search expenses..."
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() =>
                    setSearchQuery(
                      ""
                    )
                  }
                >
                  <FaTimes />
                </button>
              )}

            </div>

            {/* EXCEL BUTTON */}

            <button
              type="button"
              className="ae-export-btn"
              onClick={
                downloadExcelReport
              }
              title="Download filtered expenses as Excel"
            >

              <FaFileExcel />

              <span>
                Excel Report
              </span>

            </button>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="ae-filter-wrapper">

            <div className="ae-filter-top">

              <button
                type="button"
                className="ae-filter-toggle"
                onClick={() =>
                  setShowFilters(
                    (prev) => !prev
                  )
                }
              >

                <FaFilter />

                <span>
                  Filters
                </span>

                {activeFilterCount >
                  0 && (
                  <b>
                    {
                      activeFilterCount
                    }
                  </b>
                )}

              </button>

              {activeFilterCount >
                0 && (
                <button
                  type="button"
                  className="ae-filter-reset-mini"
                  onClick={
                    resetFilters
                  }
                >
                  <FaUndo />
                  Clear Filters
                </button>
              )}

              <div className="ae-filter-result">

                Showing{" "}

                <strong>
                  {
                    filteredExpenses.length
                  }
                </strong>

                {" "}expense
                {filteredExpenses.length !==
                1
                  ? "s"
                  : ""}

              </div>

            </div>

            {showFilters && (
              <div className="ae-filter-panel">

                <div className="ae-filter-field">

                  <label>
                    Expense Head
                  </label>

                  <select
                    name="head"
                    value={
                      filters.head
                    }
                    onChange={
                      handleFilterChange
                    }
                  >

                    <option value="">
                      All Expense Heads
                    </option>

                    {expenseHeads.map(
                      (item) => (
                        <option
                          key={
                            item._id
                          }
                          value={
                            item.name
                          }
                        >
                          {
                            item.name
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Account Type
                  </label>

                  <select
                    name="accountType"
                    value={
                      filters.accountType
                    }
                    onChange={
                      handleFilterChange
                    }
                  >

                    <option value="">
                      All Account Types
                    </option>

                    {accountTypes.map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={index}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Payment Mode
                  </label>

                  <select
                    name="paymentMode"
                    value={
                      filters.paymentMode
                    }
                    onChange={
                      handleFilterChange
                    }
                  >

                    <option value="">
                      All Payment Modes
                    </option>

                    {paymentModes.map(
                      (
                        item,
                        index
                      ) => (
                        <option
                          key={index}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Bill
                  </label>

                  <select
                    name="billStatus"
                    value={
                      filters.billStatus
                    }
                    onChange={
                      handleFilterChange
                    }
                  >

                    <option value="all">
                      All Bills
                    </option>

                    <option value="withBill">
                      With Bill
                    </option>

                    <option value="withoutBill">
                      Without Bill
                    </option>

                  </select>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Date From
                  </label>

                  <div className="ae-filter-date">

                    <FaCalendarAlt />

                    <input
                      type="date"
                      name="dateFrom"
                      value={
                        filters.dateFrom
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                  </div>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Date To
                  </label>

                  <div className="ae-filter-date">

                    <FaCalendarAlt />

                    <input
                      type="date"
                      name="dateTo"
                      value={
                        filters.dateTo
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                  </div>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Min Amount
                  </label>

                  <div className="ae-filter-amount">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      name="minAmount"
                      min="0"
                      value={
                        filters.minAmount
                      }
                      onChange={
                        handleFilterChange
                      }
                      placeholder="0"
                    />

                  </div>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Max Amount
                  </label>

                  <div className="ae-filter-amount">

                    <span>
                      ₹
                    </span>

                    <input
                      type="number"
                      name="maxAmount"
                      min="0"
                      value={
                        filters.maxAmount
                      }
                      onChange={
                        handleFilterChange
                      }
                      placeholder="100000"
                    />

                  </div>

                </div>

                <div className="ae-filter-field">

                  <label>
                    Sort By
                  </label>

                  <div className="ae-filter-sort">

                    <FaSortAmountDown />

                    <select
                      name="sortBy"
                      value={
                        filters.sortBy
                      }
                      onChange={
                        handleFilterChange
                      }
                    >

                      <option value="newest">
                        Newest First
                      </option>

                      <option value="oldest">
                        Oldest First
                      </option>

                      <option value="amountHigh">
                        Amount High to Low
                      </option>

                      <option value="amountLow">
                        Amount Low to High
                      </option>

                    </select>

                  </div>

                </div>

                <div className="ae-filter-actions">

                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                  >

                    <FaUndo />

                    Reset Filters

                  </button>

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="ae-table-wrap">

            <table className="ae-table">

              <thead>

                <tr>

                  <th>
                    EXPENSE
                  </th>

                  <th>
                    ACCOUNT
                  </th>

                  <th>
                    INVOICE
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    DATE
                  </th>

                  <th>
                    BILL
                  </th>

                  <th>
                    PAYMENT
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading &&
                currentData.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="ae-loading-cell"
                    >

                      <span className="ae-big-spinner" />

                      Loading expenses...

                    </td>

                  </tr>

                ) : currentData.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="ae-empty-cell"
                    >

                      <div className="ae-empty-icon">
                        <FaReceipt />
                      </div>

                      <strong>
                        No expenses found
                      </strong>

                      <span>
                        Try changing your
                        search or filters.
                      </span>

                    </td>

                  </tr>

                ) : (

                  currentData.map(
                    (
                      item,
                      index
                    ) => {

                      const realIndex =
                        indexOfFirst +
                        index;

                      return (
                        <tr
                          key={
                            item._id ||
                            realIndex
                          }
                        >

                          <td>

                            <div className="ae-expense-cell">

                              <div className="ae-expense-avatar">

                                {item.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "E"}

                              </div>

                              <div>

                                <strong>
                                  {item.name ||
                                    "-"}
                                </strong>

                                <span>
                                  {item.head ||
                                    "-"}
                                </span>

                              </div>

                            </div>

                          </td>

                          <td>

                            <div className="ae-account-cell">

                              <strong>
                                {item.accountName ||
                                  "-"}
                              </strong>

                              <span>
                                {item.accountType ||
                                  "—"}
                              </span>

                            </div>

                          </td>

                          <td>

                            <span className="ae-invoice-badge">
                              {item.invoice ||
                                "No Invoice"}
                            </span>

                          </td>

                          <td>

                            <strong className="ae-amount">
                              {formatAmount(
                                item.amount
                              )}
                            </strong>

                          </td>

                          <td>

                            <div className="ae-date-cell">

                              <FaCalendarAlt />

                              {formatDate(
                                item.date
                              )}

                            </div>

                          </td>

                          <td>

                            {item.bill ? (

                              <a
                                href={getBillUrl(
                                  item.bill
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ae-table-bill"
                              >

                                <FaFileInvoice />

                                View Bill

                              </a>

                            ) : (

                              <span className="ae-no-bill">
                                No Bill
                              </span>

                            )}

                          </td>

                          <td>

                            <span
                              className={`ae-payment-badge ${
                                item.paymentMode
                                  ?.toLowerCase()
                                  .replace(
                                    /\s+/g,
                                    "-"
                                  )
                              }`}
                            >
                              {item.paymentMode ||
                                "—"}
                            </span>

                          </td>

                          <td className="ae-action">

                            <button
                              type="button"
                              className="ae-action-btn"
                              onClick={() =>
                                setActiveMenu(
                                  activeMenu ===
                                    realIndex
                                    ? null
                                    : realIndex
                                )
                              }
                            >
                              •••
                            </button>

                            {activeMenu ===
                              realIndex && (

                              <div
                                className="ae-dropdown"
                                ref={
                                  menuRef
                                }
                              >

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleView(
                                      item
                                    )
                                  }
                                >

                                  <FaEye />

                                  View

                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
                                >

                                  <FaEdit />

                                  Edit

                                </button>

                                <button
                                  type="button"
                                  className="del"
                                  onClick={() =>
                                    handleDelete(
                                      item._id
                                    )
                                  }
                                >

                                  <FaTrash />

                                  Delete

                                </button>

                              </div>

                            )}

                          </td>

                        </tr>
                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          <div className="ae-pagination">

            <span>

              Showing{" "}

              {filteredExpenses.length ===
              0
                ? 0
                : indexOfFirst + 1}

              {" "}to{" "}

              {Math.min(
                indexOfLast,
                filteredExpenses.length
              )}

              {" "}of{" "}

              {
                filteredExpenses.length
              }

              {" "}entries

            </span>

            <div className="ae-pagination-controls">

              <button
                type="button"
                disabled={
                  safeCurrentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                  )
                }
              >
                <FaChevronLeft />
              </button>

              {Array.from({
                length: totalPages,
              }).map(
                (_, index) => (

                  <button
                    type="button"
                    key={
                      index + 1
                    }
                    className={
                      safeCurrentPage ===
                      index + 1
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(
                        index + 1
                      )
                    }
                  >
                    {index + 1}
                  </button>

                )
              )}

              <button
                type="button"
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalPages
                      )
                  )
                }
              >
                <FaChevronRight />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {isViewModalOpen &&
        selectedExpense && (

        <div
          className="ae-modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              closeViewModal();
            }

          }}
        >

          <div className="ae-view-modal">

            <div className="ae-view-header">

              <div className="ae-view-title">

                <div className="ae-view-icon">
                  <FaReceipt />
                </div>

                <div>

                  <h3>
                    Expense Details
                  </h3>

                  <span>
                    Complete expense information
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="ae-modal-close"
                onClick={
                  closeViewModal
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="ae-view-body">

              <div className="ae-view-summary">

                <div>

                  <span>
                    Expense Amount
                  </span>

                  <strong>
                    {formatAmount(
                      selectedExpense.amount
                    )}
                  </strong>

                </div>

                <span
                  className={`ae-view-payment ${
                    selectedExpense.paymentMode
                      ?.toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )
                  }`}
                >
                  {selectedExpense.paymentMode ||
                    "Not specified"}
                </span>

              </div>

              <div className="ae-details-section">

                <div className="ae-section-heading">

                  <span>
                    Expense Information
                  </span>

                </div>

                <div className="ae-details-grid">

                  <div className="ae-detail-item">
                    <span>
                      Expense Head
                    </span>
                    <strong>
                      {selectedExpense.head ||
                        "-"}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Name
                    </span>
                    <strong>
                      {selectedExpense.name ||
                        "-"}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Account Type
                    </span>
                    <strong>
                      {selectedExpense.accountType ||
                        "-"}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Account Name
                    </span>
                    <strong>
                      {selectedExpense.accountName ||
                        "-"}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Invoice Number
                    </span>
                    <strong>
                      {selectedExpense.invoice ||
                        "No Invoice"}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Expense Date
                    </span>
                    <strong>
                      {formatDate(
                        selectedExpense.date
                      )}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Payment Mode
                    </span>
                    <strong>
                      {selectedExpense.paymentMode ||
                        "-"}
                    </strong>
                  </div>

                  <div className="ae-detail-item">
                    <span>
                      Created By
                    </span>
                    <strong>
                      {selectedExpense.createdBy ||
                        "Admin"}
                    </strong>
                  </div>

                </div>

              </div>

              {selectedExpense.description && (

                <div className="ae-details-section">

                  <div className="ae-section-heading">

                    <span>
                      Description
                    </span>

                  </div>

                  <div className="ae-description-box">

                    {
                      selectedExpense.description
                    }

                  </div>

                </div>

              )}

              <div className="ae-details-section">

                <div className="ae-section-heading">

                  <span>
                    Attached Bill
                  </span>

                  {selectedExpense.bill && (

                    <a
                      href={getBillUrl(
                        selectedExpense.bill
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ae-open-bill"
                    >
                      Open Full Bill
                    </a>

                  )}

                </div>

                {selectedExpense.bill ? (

                  <div className="ae-modal-bill">

                    {isImageBill(
                      selectedExpense.bill
                    ) ? (

                      <img
                        src={getBillUrl(
                          selectedExpense.bill
                        )}
                        alt="Expense Bill"
                      />

                    ) : isPdfBill(
                      selectedExpense.bill
                    ) ? (

                      <div className="ae-pdf-preview">

                        <div className="ae-pdf-icon">
                          <FaFilePdf />
                        </div>

                        <strong>
                          PDF Bill Attached
                        </strong>

                        <span>
                          Click below to view
                          the complete document.
                        </span>

                        <a
                          href={getBillUrl(
                            selectedExpense.bill
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >

                          <FaEye />

                          View PDF Bill

                        </a>

                      </div>

                    ) : (

                      <div className="ae-file-preview">

                        <FaFileInvoice />

                        <span>
                          Bill document attached
                        </span>

                        <a
                          href={getBillUrl(
                            selectedExpense.bill
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Bill
                        </a>

                      </div>

                    )}

                  </div>

                ) : (

                  <div className="ae-no-bill-large">

                    <FaFileInvoice />

                    <strong>
                      No bill uploaded
                    </strong>

                    <span>
                      This expense does not have
                      an attached bill.
                    </span>

                  </div>

                )}

              </div>

            </div>

            <div className="ae-view-footer">

              <button
                type="button"
                className="ae-modal-secondary"
                onClick={
                  closeViewModal
                }
              >
                Close
              </button>

              <button
                type="button"
                className="ae-modal-primary"
                onClick={() => {

                  closeViewModal();

                  handleEdit(
                    selectedExpense
                  );

                }}
              >

                <FaEdit />

                Edit Expense

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AddExpense;