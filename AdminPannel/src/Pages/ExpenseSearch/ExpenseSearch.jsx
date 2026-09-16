import React, { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./ExpenseSearch.css";

import API from "../../api/axios";

import Swal from "sweetalert2";

import {
  FaSearch,
  FaFilter,
  FaUndo,
  FaCalendarAlt,
  FaCreditCard,
  FaReceipt,
  FaWallet,
  FaMoneyBillWave,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoice,
  FaEye,
  FaArrowRight,
  FaChartLine,
  FaEdit,
  FaDownload,
} from "react-icons/fa";

const ExpenseSearch = () => {
  const base = "expense-search";

  const navigate = useNavigate();

  /* =====================================================
     FORM
  ===================================================== */

  const [form, setForm] = useState({
    head: "",
    payment: "",
    from: "",
    to: "",
    text: "",
  });

  /* =====================================================
     STATE
  ===================================================== */

  const [loading, setLoading] = useState(false);

  const [expenseHeads, setExpenseHeads] = useState([]);

  const [expenses, setExpenses] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  const paymentModes = [
    "Cash",
    "Cheque",
    "UPI",
    "Card",
    "Bank Transfer",
  ];

  /* =====================================================
     FETCH EXPENSE HEADS
  ===================================================== */

  useEffect(() => {
    fetchExpenseHeads();
  }, []);

  const fetchExpenseHeads = async () => {
    try {
      const res = await API.get("/expense-heads");

      setExpenseHeads(
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || []
      );
    } catch (err) {
      console.log(
        "Expense heads error:",
        err
      );
    }
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  /* =====================================================
     EMPTY CHECK
  ===================================================== */

  const isEmpty =
    Object.values(form).every(
      (v) => !v
    );

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = async () => {
    if (loading) return;

    /* DATE VALIDATION */

    if (
      form.from &&
      form.to &&
      form.from > form.to
    ) {
      Swal.fire(
        "Invalid Date Range",
        "Date From cannot be greater than Date To.",
        "error"
      );

      return;
    }

    try {
      setLoading(true);

      const params = {};

      Object.keys(form).forEach(
        (key) => {
          if (form[key]) {
            params[key] = form[key];
          }
        }
      );

      const res =
        await API.get(
          "/expenses/search",
          {
            params,
          }
        );

      const result =
        Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

      setExpenses(result);

      setHasSearched(true);

      setCurrentPage(1);

      if (!result.length) {
        Swal.fire({
          icon: "info",
          title: "No Expenses Found",
          text: "No expenses match your selected filters.",
          confirmButtonText: "Okay",
        });
      }
    } catch (err) {
      console.log(
        "Expense search error:",
        err
      );

      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Search failed ❌",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setForm({
      head: "",
      payment: "",
      from: "",
      to: "",
      text: "",
    });

    setExpenses([]);

    setHasSearched(false);

    setCurrentPage(1);

    setItemsPerPage(10);

    setTimeout(() => {
      document
        .querySelector(
          'input[name="text"]'
        )
        ?.focus();
    }, 50);
  };

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
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

  /* =====================================================
     FORMAT AMOUNT
  ===================================================== */

  const formatAmount = (amount) => {
    return Number(
      amount || 0
    ).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  /* =====================================================
     TOTAL AMOUNT
  ===================================================== */

  const totalAmount = useMemo(() => {
    return expenses.reduce(
      (total, item) => {
        return (
          total +
          Number(
            item.amount || 0
          )
        );
      },
      0
    );
  }, [expenses]);

  /* =====================================================
     BILL COUNT
  ===================================================== */

  const billCount = useMemo(() => {
    return expenses.filter(
      (item) => Boolean(item.bill)
    ).length;
  }, [expenses]);

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      expenses.length /
        itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const indexOfLastItem =
    safeCurrentPage *
    itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem -
    itemsPerPage;

  const currentExpenses =
    expenses.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

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

    window.scrollTo({
      top: 430,
      behavior: "smooth",
    });
  };

  const handleItemsPerPage = (
    e
  ) => {
    setItemsPerPage(
      Number(e.target.value)
    );

    setCurrentPage(1);
  };

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (safeCurrentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      safeCurrentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      safeCurrentPage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      safeCurrentPage <
      totalPages - 3
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  /* =====================================================
     ACTIVE FILTERS
  ===================================================== */

  const activeFilters =
    Object.entries(
      form
    ).filter(
      ([, value]) => Boolean(value)
    );

  /* =====================================================
     BILL URL
  ===================================================== */

  const getBillUrl = (bill) => {
    if (!bill) return "";

    if (
      bill.startsWith("http://") ||
      bill.startsWith("https://")
    ) {
      return bill;
    }

    const baseURL =
      API.defaults?.baseURL?.replace(
        /\/api\/?$/,
        ""
      ) ||
      "http://localhost:5000";

    return `${baseURL}${
      bill.startsWith("/")
        ? ""
        : "/"
    }${bill}`;
  };

  /* =====================================================
     VIEW EXPENSE
  ===================================================== */

  const handleViewExpense = (item) => {
    if (!item?._id) {
      Swal.fire(
        "Error",
        "Expense ID is missing.",
        "error"
      );

      return;
    }

    Swal.fire({
      title:
        item.name ||
        "Expense Details",

      html: `
        <div
          style="
            text-align:left;
            display:grid;
            gap:10px;
            font-size:14px;
          "
        >
          <div>
            <strong>Expense:</strong>
            ${item.name || "-"}
          </div>

          <div>
            <strong>Head:</strong>
            ${item.head || "-"}
          </div>

          <div>
            <strong>Account:</strong>
            ${item.accountName || "-"}
          </div>

          <div>
            <strong>Account Type:</strong>
            ${item.accountType || "-"}
          </div>

          <div>
            <strong>Invoice:</strong>
            ${item.invoice || "-"}
          </div>

          <div>
            <strong>Amount:</strong>
            ${formatAmount(item.amount)}
          </div>

          <div>
            <strong>Date:</strong>
            ${formatDate(item.date)}
          </div>

          <div>
            <strong>Payment:</strong>
            ${item.paymentMode || "-"}
          </div>

          <div>
            <strong>Description:</strong>
            ${item.description || "-"}
          </div>

          ${
            item.bill
              ? `
                <div>
                  <strong>Bill:</strong>
                  <a
                    href="${getBillUrl(item.bill)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    style="
                      color:#2563eb;
                      font-weight:600;
                      text-decoration:none;
                      margin-left:5px;
                    "
                  >
                    View Bill
                  </a>
                </div>
              `
              : `
                <div>
                  <strong>Bill:</strong>
                  No Bill
                </div>
              `
          }
        </div>
      `,

      confirmButtonText:
        "Close",

      width: 520,

      confirmButtonColor:
        "#2563eb",
    });
  };

  /* =====================================================
     EDIT EXPENSE
  ===================================================== */

  const handleEditExpense = (
    item
  ) => {
    if (!item?._id) {
      Swal.fire(
        "Error",
        "Expense ID is missing.",
        "error"
      );

      return;
    }

    /*
      Keep the selected expense available
      for AddExpense.
    */

    localStorage.setItem(
      "editExpenseId",
      item._id
    );

    localStorage.setItem(
      "editExpenseData",
      JSON.stringify(item)
    );

    navigate(
      "/expense/details",
      {
        state: {
          mode: "edit",
          expenseId: item._id,
          expense: item,
        },
      }
    );
  };

  /* =====================================================
     DOWNLOAD EXPENSE REPORT
     Client-side CSV
  ===================================================== */

  const handleDownloadReport = (
    item
  ) => {
    if (!item) {
      Swal.fire(
        "Error",
        "Expense data is missing.",
        "error"
      );

      return;
    }

    const escapeCsv = (
      value
    ) => {
      const safeValue =
        value === null ||
        value === undefined
          ? ""
          : String(value);

      return `"${safeValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = [
      [
        "Expense Report",
      ],

      [],

      [
        "Field",
        "Details",
      ],

      [
        "Expense Name",
        item.name || "",
      ],

      [
        "Expense Head",
        item.head || "",
      ],

      [
        "Account Name",
        item.accountName || "",
      ],

      [
        "Account Type",
        item.accountType || "",
      ],

      [
        "Invoice",
        item.invoice || "",
      ],

      [
        "Amount",
        Number(
          item.amount || 0
        ).toFixed(2),
      ],

      [
        "Date",
        item.date
          ? formatDate(
              item.date
            )
          : "",
      ],

      [
        "Payment Mode",
        item.paymentMode || "",
      ],

      [
        "Description",
        item.description || "",
      ],

      [
        "Bill",
        item.bill
          ? getBillUrl(
              item.bill
            )
          : "No Bill",
      ],

      [
        "Expense ID",
        item._id || "",
      ],
    ];

    const csv = rows
      .map(
        (row) =>
          row
            .map(
              escapeCsv
            )
            .join(",")
      )
      .join("\r\n");

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    const safeName = (
      item.name ||
      "Expense_Report"
    )
      .replace(
        /[^a-z0-9-_]+/gi,
        "_"
      )
      .replace(
        /^_+|_+$/g,
        ""
      );

    link.href = url;

    link.download =
      `${
        safeName ||
        "Expense_Report"
      }_${
        item.invoice ||
        item._id
      }.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url
    );

    Swal.fire({
      icon: "success",

      title:
        "Report Downloaded",

      text:
        "Expense report downloaded successfully.",

      timer: 1600,

      showConfirmButton:
        false,
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className={base}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className={`${base}__header`}
      >
        <div
          className={`${base}__headerLeft`}
        >
          <div
            className={`${base}__headerIcon`}
          >
            <FaSearch />
          </div>

          <div>
            <div
              className={`${base}__eyebrow`}
            >
              EXPENSE MANAGEMENT
            </div>

            <h2>
              Expense Search
            </h2>

            <p
              className={`${base}__breadcrumb`}
            >
              Dashboard

              <span>
                /
              </span>

              Expense

              <span>
                /
              </span>

              Search
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`${base}__backBtn`}
          onClick={() =>
            navigate(
              "/expense-list"
            )
          }
        >
          View All Expenses

          <FaArrowRight />
        </button>
      </div>

      {/* =================================================
          SEARCH CARD
      ================================================= */}

      <div
        className={`${base}__card`}
      >
        <div
          className={`${base}__cardHeader`}
        >
          <div
            className={`${base}__cardTitle`}
          >
            <div
              className={`${base}__titleIcon`}
            >
              <FaFilter />
            </div>

            <div>
              <h3>
                Filter Expenses
              </h3>

              <p>
                Find expenses using
                multiple filters
              </p>
            </div>
          </div>

          {activeFilters.length >
            0 && (
            <div
              className={`${base}__filterCount`}
            >
              <FaFilter />

              {
                activeFilters.length
              }{" "}
              Active Filter
              {activeFilters.length >
              1
                ? "s"
                : ""}
            </div>
          )}
        </div>

        <div
          className={`${base}__form`}
        >

          {/* EXPENSE HEAD */}

          <div
            className={`${base}__group`}
          >
            <label>
              Expense Head
            </label>

            <div
              className={`${base}__inputWrap`}
            >
              <FaReceipt />

              <select
                name="head"
                value={form.head}
                onChange={
                  handleChange
                }
                disabled={
                  expenseHeads.length ===
                  0
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
          </div>

          {/* PAYMENT */}

          <div
            className={`${base}__group`}
          >
            <label>
              Payment Mode
            </label>

            <div
              className={`${base}__inputWrap`}
            >
              <FaCreditCard />

              <select
                name="payment"
                value={
                  form.payment
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  All Payment Modes
                </option>

                {paymentModes.map(
                  (
                    item,
                    i
                  ) => (
                    <option
                      key={i}
                      value={
                        item
                      }
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* FROM */}

          <div
            className={`${base}__group`}
          >
            <label>
              Date From
            </label>

            <div
              className={`${base}__inputWrap`}
            >
              <FaCalendarAlt />

              <input
                type="date"
                name="from"
                value={form.from}
                onChange={
                  handleChange
                }
                max={
                  form.to || ""
                }
              />
            </div>
          </div>

          {/* TO */}

          <div
            className={`${base}__group`}
          >
            <label>
              Date To
            </label>

            <div
              className={`${base}__inputWrap`}
            >
              <FaCalendarAlt />

              <input
                type="date"
                name="to"
                value={form.to}
                onChange={
                  handleChange
                }
                min={
                  form.from || ""
                }
              />
            </div>
          </div>

          {/* SEARCH */}

          <div
            className={`${base}__group ${base}__searchGroup`}
          >
            <label>
              Search
            </label>

            <div
              className={`${base}__inputWrap`}
            >
              <FaSearch />

              <input
                type="text"
                name="text"
                placeholder="Search name, invoice, account..."
                value={
                  form.text
                }
                onChange={
                  handleChange
                }
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    handleSearch();
                  }
                }}
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div
            className={`${base}__btnWrap`}
          >
            <button
              type="button"
              onClick={
                handleSearch
              }
              disabled={
                loading ||
                isEmpty
              }
              className={`${base}__btn`}
            >
              {loading ? (
                <>
                  <span
                    className={`${base}__spinner`}
                  />

                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />

                  Search Expenses
                </>
              )}
            </button>

            <button
              type="button"
              onClick={
                handleReset
              }
              className={`${base}__reset`}
            >
              <FaUndo />

              Reset
            </button>
          </div>
        </div>

        {/* ACTIVE FILTERS */}

        {activeFilters.length >
          0 && (
          <div
            className={`${base}__activeFilters`}
          >
            <span>
              Active:
            </span>

            {form.head && (
              <span
                className={`${base}__chip`}
              >
                Head:{" "}
                {form.head}
              </span>
            )}

            {form.payment && (
              <span
                className={`${base}__chip`}
              >
                Payment:{" "}
                {
                  form.payment
                }
              </span>
            )}

            {form.from && (
              <span
                className={`${base}__chip`}
              >
                From:{" "}
                {formatDate(
                  form.from
                )}
              </span>
            )}

            {form.to && (
              <span
                className={`${base}__chip`}
              >
                To:{" "}
                {formatDate(
                  form.to
                )}
              </span>
            )}

            {form.text && (
              <span
                className={`${base}__chip`}
              >
                Search: "
                {
                  form.text
                }
                "
              </span>
            )}
          </div>
        )}
      </div>

      {/* =================================================
          RESULT SECTION
      ================================================= */}

      {hasSearched && (
        <div
          className={`${base}__results`}
        >

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div
            className={`${base}__stats`}
          >

            {/* TOTAL EXPENSES */}

            <div
              className={`${base}__statCard`}
            >
              <div
                className={`${base}__statIcon blue`}
              >
                <FaReceipt />
              </div>

              <div
                className={`${base}__statContent`}
              >
                <span>
                  Matching Expenses
                </span>

                <strong>
                  {
                    expenses.length
                  }
                </strong>

                <small>
                  Records found
                </small>
              </div>
            </div>

            {/* TOTAL AMOUNT */}

            <div
              className={`${base}__statCard primary`}
            >
              <div
                className={`${base}__statIcon green`}
              >
                <FaMoneyBillWave />
              </div>

              <div
                className={`${base}__statContent`}
              >
                <span>
                  Total Amount
                </span>

                <strong>
                  {formatAmount(
                    totalAmount
                  )}
                </strong>

                <small>
                  Total filtered expense
                </small>
              </div>
            </div>

            {/* BILLS */}

            <div
              className={`${base}__statCard`}
            >
              <div
                className={`${base}__statIcon purple`}
              >
                <FaFileInvoice />
              </div>

              <div
                className={`${base}__statContent`}
              >
                <span>
                  Bills Attached
                </span>

                <strong>
                  {billCount}
                </strong>

                <small>
                  Uploaded documents
                </small>
              </div>
            </div>

            {/* AVERAGE */}

            <div
              className={`${base}__statCard`}
            >
              <div
                className={`${base}__statIcon orange`}
              >
                <FaChartLine />
              </div>

              <div
                className={`${base}__statContent`}
              >
                <span>
                  Average Expense
                </span>

                <strong>
                  {formatAmount(
                    expenses.length
                      ? totalAmount /
                          expenses.length
                      : 0
                  )}
                </strong>

                <small>
                  Per expense
                </small>
              </div>
            </div>
          </div>

          {/* =================================================
              RESULTS CARD
          ================================================= */}

          <div
            className={`${base}__resultsCard`}
          >

            {/* RESULT HEADER */}

            <div
              className={`${base}__resultsHeader`}
            >
              <div>
                <h3>
                  Search Results
                </h3>

                <p>
                  {expenses.length
                    ? `Showing ${
                        indexOfFirstItem +
                        1
                      }–${Math.min(
                        indexOfLastItem,
                        expenses.length
                      )} of ${
                        expenses.length
                      } expenses`
                    : "No matching expenses"}
                </p>
              </div>

              <div
                className={`${base}__resultControls`}
              >
                <span>
                  Show
                </span>

                <select
                  value={
                    itemsPerPage
                  }
                  onChange={
                    handleItemsPerPage
                  }
                >
                  <option value={5}>
                    5
                  </option>

                  <option value={10}>
                    10
                  </option>

                  <option value={20}>
                    20
                  </option>

                  <option value={50}>
                    50
                  </option>

                  <option value={100}>
                    100
                  </option>
                </select>

                <span>
                  entries
                </span>
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            {loading ? (
              <div
                className={`${base}__loading`}
              >
                <div
                  className={`${base}__loadingSpinner`}
                />

                <strong>
                  Searching expenses...
                </strong>

                <span>
                  Please wait while we
                  fetch your results.
                </span>
              </div>
            ) : expenses.length ===
              0 ? (
              <div
                className={`${base}__empty`}
              >
                <div
                  className={`${base}__emptyIcon`}
                >
                  <FaSearch />
                </div>

                <h3>
                  No Expenses Found
                </h3>

                <p>
                  No expenses match
                  your selected
                  filters.
                </p>

                <button
                  type="button"
                  onClick={
                    handleReset
                  }
                >
                  <FaUndo />

                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={`${base}__tableWrap`}
              >
                <table
                  className={`${base}__table`}
                >
                  <thead>
                    <tr>
                      <th>
                        #
                      </th>

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
                        PAYMENT
                      </th>

                      <th>
                        BILL
                      </th>

                      <th
                        style={{
                          textAlign:
                            "center",
                          minWidth:
                            "220px",
                        }}
                      >
                        ACTIONS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentExpenses.map(
                      (
                        item,
                        index
                      ) => (
                        <tr
                          key={
                            item._id ||
                            index
                          }
                        >
                          <td>
                            <span
                              className={`${base}__serial`}
                            >
                              {
                                indexOfFirstItem +
                                index +
                                1
                              }
                            </span>
                          </td>

                          <td>
                            <div
                              className={`${base}__expenseCell`}
                            >
                              <div
                                className={`${base}__expenseAvatar`}
                              >
                                {(
                                  item.name ||
                                  "E"
                                )
                                  .charAt(
                                    0
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {
                                    item.name ||
                                    "Unnamed Expense"
                                  }
                                </strong>

                                <span>
                                  {
                                    item.head ||
                                    "No Head"
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div
                              className={`${base}__accountCell`}
                            >
                              <strong>
                                {
                                  item.accountName ||
                                  "-"
                                }
                              </strong>

                              <span>
                                {
                                  item.accountType ||
                                  "—"
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`${base}__invoice`}
                            >
                              {
                                item.invoice ||
                                "No Invoice"
                              }
                            </span>
                          </td>

                          <td>
                            <strong
                              className={`${base}__amount`}
                            >
                              {formatAmount(
                                item.amount
                              )}
                            </strong>
                          </td>

                          <td>
                            <div
                              className={`${base}__date`}
                            >
                              <FaCalendarAlt />

                              {formatDate(
                                item.date
                              )}
                            </div>
                          </td>

                          <td>
                            <span
                              className={`${base}__payment ${base}__payment--${(
                                item.paymentMode ||
                                "unknown"
                              )
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                            >
                              {
                                item.paymentMode ||
                                "—"
                              }
                            </span>
                          </td>

                          <td>
                            {item.bill ? (
                              <a
                                href={getBillUrl(
                                  item.bill
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${base}__bill`}
                              >
                                <FaEye />

                                View
                              </a>
                            ) : (
                              <span
                                className={`${base}__noBill`}
                              >
                                No Bill
                              </span>
                            )}
                          </td>

                          {/* =================================================
                              ACTIONS
                          ================================================= */}

                          <td
                            style={{
                              padding:
                                "10px 12px",
                              minWidth:
                                "220px",
                            }}
                          >
                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                justifyContent:
                                  "center",

                                gap: "7px",

                                flexWrap:
                                  "wrap",
                              }}
                            >

                              {/* VIEW */}

                              <button
                                type="button"
                                title="View Expense"
                                aria-label="View Expense"
                                onClick={() =>
                                  handleViewExpense(
                                    item
                                  )
                                }
                                style={{
                                  display:
                                    "inline-flex",

                                  alignItems:
                                    "center",

                                  justifyContent:
                                    "center",

                                  gap: "5px",

                                  minWidth:
                                    "62px",

                                  height:
                                    "34px",

                                  padding:
                                    "0 9px",

                                  border:
                                    "1px solid #dbeafe",

                                  borderRadius:
                                    "8px",

                                  background:
                                    "#eff6ff",

                                  color:
                                    "#2563eb",

                                  fontSize:
                                    "11px",

                                  fontWeight:
                                    700,

                                  cursor:
                                    "pointer",

                                  transition:
                                    "all 0.2s ease",
                                }}
                              >
                                <FaEye />

                                View
                              </button>

                              {/* EDIT */}

                              <button
                                type="button"
                                title="Edit Expense"
                                aria-label="Edit Expense"
                                onClick={() =>
                                  handleEditExpense(
                                    item
                                  )
                                }
                                style={{
                                  display:
                                    "inline-flex",

                                  alignItems:
                                    "center",

                                  justifyContent:
                                    "center",

                                  gap: "5px",

                                  minWidth:
                                    "62px",

                                  height:
                                    "34px",

                                  padding:
                                    "0 9px",

                                  border:
                                    "1px solid #fde68a",

                                  borderRadius:
                                    "8px",

                                  background:
                                    "#fffbeb",

                                  color:
                                    "#b45309",

                                  fontSize:
                                    "11px",

                                  fontWeight:
                                    700,

                                  cursor:
                                    "pointer",

                                  transition:
                                    "all 0.2s ease",
                                }}
                              >
                                <FaEdit />

                                Edit
                              </button>

                              {/* DOWNLOAD REPORT */}

                              <button
                                type="button"
                                title="Download Expense Report"
                                aria-label="Download Expense Report"
                                onClick={() =>
                                  handleDownloadReport(
                                    item
                                  )
                                }
                                style={{
                                  display:
                                    "inline-flex",

                                  alignItems:
                                    "center",

                                  justifyContent:
                                    "center",

                                  gap: "5px",

                                  minWidth:
                                    "74px",

                                  height:
                                    "34px",

                                  padding:
                                    "0 9px",

                                  border:
                                    "1px solid #a7f3d0",

                                  borderRadius:
                                    "8px",

                                  background:
                                    "#ecfdf5",

                                  color:
                                    "#047857",

                                  fontSize:
                                    "11px",

                                  fontWeight:
                                    700,

                                  cursor:
                                    "pointer",

                                  transition:
                                    "all 0.2s ease",
                                }}
                              >
                                <FaDownload />

                                Report
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* =================================================
                PAGINATION
            ================================================= */}

            {expenses.length >
              0 && (
              <div
                className={`${base}__pagination`}
              >
                <div
                  className={`${base}__paginationInfo`}
                >
                  Showing{" "}

                  <strong>
                    {
                      indexOfFirstItem +
                      1
                    }
                  </strong>{" "}

                  to{" "}

                  <strong>
                    {Math.min(
                      indexOfLastItem,
                      expenses.length
                    )}
                  </strong>{" "}

                  of{" "}

                  <strong>
                    {
                      expenses.length
                    }
                  </strong>{" "}

                  entries
                </div>

                <div
                  className={`${base}__paginationControls`}
                >
                  <button
                    type="button"
                    disabled={
                      safeCurrentPage ===
                      1
                    }
                    onClick={() =>
                      handlePageChange(
                        safeCurrentPage -
                          1
                      )
                    }
                  >
                    <FaChevronLeft />
                  </button>

                  {getPageNumbers().map(
                    (
                      page,
                      index
                    ) =>
                      page ===
                      "..." ? (
                        <span
                          key={`dots-${index}`}
                          className={`${base}__dots`}
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          className={
                            safeCurrentPage ===
                            page
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            handlePageChange(
                              page
                            )
                          }
                        >
                          {
                            page
                          }
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
                      handlePageChange(
                        safeCurrentPage +
                          1
                      )
                    }
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================
          INITIAL STATE
      ================================================= */}

      {!hasSearched && (
        <div
          className={`${base}__welcome`}
        >
          <div
            className={`${base}__welcomeIcon`}
          >
            <FaWallet />
          </div>

          <h3>
            Search Your Expenses
          </h3>

          <p>
            Use the filters above to
            find expenses by head,
            payment mode, date or
            keyword.
          </p>

          <div
            className={`${base}__welcomeFeatures`}
          >
            <span>
              <FaFilter />

              Multiple Filters
            </span>

            <span>
              <FaMoneyBillWave />

              Total Amount
            </span>

            <span>
              <FaChartLine />

              Expense Insights
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSearch;