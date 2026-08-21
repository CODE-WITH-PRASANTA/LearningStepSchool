import React, {
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./ExpenseList.css";

import API from "../../api/axios";

import Swal from "sweetalert2";

import {
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaReceipt,
  FaMoneyBillWave,
  FaFileInvoice,
  FaWallet,
  FaCalendarAlt,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaCreditCard,
  FaTimes,
} from "react-icons/fa";

const ExpenseList = () => {
  const base = "expense-list";

  const location = useLocation();

  const navigate = useNavigate();

  const filters = location.state || {};

  const [search, setSearch] =
    useState("");

  const [pageSize, setPageSize] =
    useState(25);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  /* =====================================================
     FETCH FROM BACKEND
  ===================================================== */

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const params = {};

      Object.keys(filters).forEach(
        (key) => {
          if (filters[key]) {
            params[key] = filters[key];
          }
        }
      );

      const res = await API.get(
        "/expenses/search",
        {
          params,
        }
      );

      console.log(
        "EXPENSE LIST DATA:",
        res.data
      );

      const result = Array.isArray(
        res.data
      )
        ? res.data
        : res.data?.data || [];

      setData(result);

      setCurrentPage(1);
    } catch (err) {
      console.log(
        "EXPENSE FETCH ERROR:",
        err
      );

      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Failed to load expenses",
        "error"
      );
    } finally {
      setLoading(false);
    }
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
     MAP BACKEND DATA → UI FORMAT
  ===================================================== */

  const rows = useMemo(
    () =>
      data.map((e, i) => ({
        id: e._id || i,

        name:
          e.name || "-",

        invoice:
          e.invoice || "-",

        payment:
          e.paymentMode || "-",

        head:
          e.head || "-",

        accountName:
          e.accountName || "-",

        accountType:
          e.accountType || "-",

        session:
          e.session || "2025-26",

        date: e.date
          ? formatDate(e.date)
          : "-",

        description:
          e.description || "-",

        amount:
          Number(e.amount || 0),

        bill:
          e.bill || "",

        walletLinked:
          e.walletLinked || false,
      })),
    [data]
  );

  /* =====================================================
     SEARCH FILTER
  ===================================================== */

  const filtered = useMemo(() => {
    const q =
      search.trim().toLowerCase();

    if (!q) {
      return rows;
    }

    return rows.filter((r) =>
      [
        r.name,
        r.invoice,
        r.payment,
        r.head,
        r.accountName,
        r.accountType,
        r.session,
        r.date,
        r.description,
        r.amount,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  /* =====================================================
     TOTAL AMOUNT
  ===================================================== */

  const totalAmount = useMemo(() => {
    return filtered.reduce(
      (total, item) =>
        total +
        Number(item.amount || 0),
      0
    );
  }, [filtered]);

  /* =====================================================
     BILL COUNT
  ===================================================== */

  const billCount = useMemo(() => {
    return filtered.filter(
      (item) => item.bill
    ).length;
  }, [filtered]);

  /* =====================================================
     AVERAGE AMOUNT
  ===================================================== */

  const averageAmount =
    filtered.length > 0
      ? totalAmount /
        filtered.length
      : 0;

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length /
        Number(pageSize)
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const indexOfLastItem =
    safeCurrentPage *
    Number(pageSize);

  const indexOfFirstItem =
    indexOfLastItem -
    Number(pageSize);

  const limitedRows =
    filtered.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     PAGE SIZE
  ===================================================== */

  const handlePageSizeChange = (
    e
  ) => {
    setPageSize(
      Number(e.target.value)
    );

    setCurrentPage(1);
  };

  /* =====================================================
     SEARCH CHANGE
  ===================================================== */

  const handleSearchChange = (e) => {
    setSearch(e.target.value);

    setCurrentPage(1);
  };

  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  const handleClearSearch = () => {
    setSearch("");

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
     PAYMENT CLASS
  ===================================================== */

  const getPaymentClass = (
    payment
  ) => {
    return (
      payment || "unknown"
    )
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* =====================================================
     BILL URL
  ===================================================== */

  const getBillUrl = (bill) => {
    if (!bill) return "";

    if (
      bill.startsWith(
        "http://"
      ) ||
      bill.startsWith(
        "https://"
      )
    ) {
      return bill;
    }

    let baseURL =
      API.defaults?.baseURL ||
      "http://localhost:5000/api";

    baseURL = baseURL.replace(
      /\/api\/?$/,
      ""
    );

    return `${baseURL}${
      bill.startsWith("/")
        ? ""
        : "/"
    }${bill}`;
  };

  /* =====================================================
     VIEW BILL
  ===================================================== */

  const handleViewBill = (bill) => {
    if (!bill) {
      Swal.fire(
        "No Bill",
        "No bill has been uploaded for this expense.",
        "info"
      );

      return;
    }

    const url =
      getBillUrl(bill);

    console.log(
      "VIEW BILL:",
      url
    );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     FILTER COUNT
  ===================================================== */

  const filterCount =
    Object.values(filters).filter(
      (value) => Boolean(value)
    ).length;

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    if (
      window.history.length > 1
    ) {
      navigate(-1);
    } else {
      navigate(
        "/expense-search"
      );
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className={base}>

      {/* =================================================
          TOPBAR
      ================================================= */}

      <div
        className={`${base}__topbar`}
      >

        <div
          className={`${base}__topbarLeft`}
        >

          <div
            className={`${base}__topbarIcon`}
          >
            <FaReceipt />
          </div>

          <div>

            <div
              className={`${base}__eyebrow`}
            >
              EXPENSE MANAGEMENT
            </div>

            <h1
              className={`${base}__title`}
            >
              Expense List
            </h1>

            <div
              className={`${base}__breadcrumb`}
            >
              Dashboard
              <span>/</span>
              Expense
              <span>/</span>
              Results
            </div>

          </div>

        </div>

        <button
          onClick={handleBack}
          className={`${base}__backBtn`}
        >
          <FaArrowLeft />
          Back
        </button>

      </div>

      {/* =================================================
          FILTER SUMMARY
      ================================================= */}

      <div
        className={`${base}__filterCard`}
      >

        <div
          className={`${base}__filterHeader`}
        >

          <div
            className={`${base}__filterTitle`}
          >

            <div
              className={`${base}__filterIcon`}
            >
              <FaFilter />
            </div>

            <div>

              <h3>
                Applied Filters
              </h3>

              <p>
                Expense records matching
                your search criteria
              </p>

            </div>

          </div>

          <span
            className={`${base}__filterBadge`}
          >
            <FaFilter />
            {filterCount} Active
          </span>

        </div>

        <div
          className={`${base}__filterValues`}
        >

          {filters.head && (
            <div
              className={`${base}__filterItem`}
            >
              <span>
                Expense Head
              </span>

              <strong>
                {filters.head}
              </strong>
            </div>
          )}

          {filters.payment && (
            <div
              className={`${base}__filterItem`}
            >
              <span>
                Payment
              </span>

              <strong>
                {filters.payment}
              </strong>
            </div>
          )}

          {filters.from && (
            <div
              className={`${base}__filterItem`}
            >
              <span>
                From
              </span>

              <strong>
                {formatDate(
                  filters.from
                )}
              </strong>
            </div>
          )}

          {filters.to && (
            <div
              className={`${base}__filterItem`}
            >
              <span>
                To
              </span>

              <strong>
                {formatDate(
                  filters.to
                )}
              </strong>
            </div>
          )}

          {filters.text && (
            <div
              className={`${base}__filterItem`}
            >
              <span>
                Search
              </span>

              <strong>
                "{filters.text}"
              </strong>
            </div>
          )}

          {!filterCount && (
            <div
              className={`${base}__allFilter`}
            >
              <FaSearch />
              Showing all expenses
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div
        className={`${base}__stats`}
      >

        {/* TOTAL RECORDS */}

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
              Total Expenses
            </span>

            <strong>
              {filtered.length}
            </strong>

            <small>
              Matching records
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
              Total filtered amount
            </small>

          </div>

        </div>

        {/* BILL COUNT */}

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
              Uploaded bills
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
            <FaWallet />
          </div>

          <div
            className={`${base}__statContent`}
          >

            <span>
              Average Expense
            </span>

            <strong>
              {formatAmount(
                averageAmount
              )}
            </strong>

            <small>
              Average per record
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div
        className={`${base}__toolbar`}
      >

        <div
          className={`${base}__toolbarLeft`}
        >

          <div
            className={`${base}__pagesize`}
          >

            <span>
              Show
            </span>

            <select
              value={pageSize}
              onChange={
                handlePageSizeChange
              }
            >

              <option value={10}>
                10
              </option>

              <option value={25}>
                25
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

        <div
          className={`${base}__search`}
        >

          <span
            className={`${base}__searchLabel`}
          >
            Search:
          </span>

          <div
            className={`${base}__searchInputWrap`}
          >

            <FaSearch />

            <input
              value={search}
              onChange={
                handleSearchChange
              }
              placeholder="Search expenses..."
            />

            {search && (
              <button
                type="button"
                onClick={
                  handleClearSearch
                }
                className={`${base}__clearSearch`}
              >
                <FaTimes />
              </button>
            )}

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE CARD
      ================================================= */}

      <div
        className={`${base}__tableCard`}
      >

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
                  NAME
                </th>

                <th>
                  INVOICE NUMBER
                </th>

                <th>
                  PAYMENT MODE
                </th>

                <th>
                  EXPENSE HEAD
                </th>

                <th>
                  ACCOUNT
                </th>

                <th>
                  SESSION
                </th>

                <th>
                  DATE
                </th>

                <th>
                  DESCRIPTION
                </th>

                <th
                  className={`${base}__amountTh`}
                >
                  AMOUNT (RS)
                </th>

                <th
                  className={`${base}__balanceTh`}
                >
                  BALANCE (RS)
                </th>

                <th>
                  BILL
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={12}
                    className={`${base}__empty`}
                  >

                    <div
                      className={`${base}__loadingBox`}
                    >

                      <span
                        className={`${base}__spinner`}
                      />

                      <strong>
                        Loading expenses...
                      </strong>

                    </div>

                  </td>

                </tr>

              ) : limitedRows.length ? (

                limitedRows.map(
                  (r, index) => (

                    <tr
                      key={r.id}
                    >

                      {/* NUMBER */}

                      <td>

                        <span
                          className={`${base}__serial`}
                        >
                          {indexOfFirstItem +
                            index +
                            1}
                        </span>

                      </td>

                      {/* NAME */}

                      <td
                        className={`${base}__nameCell`}
                      >

                        <div
                          className={`${base}__nameWrap`}
                        >

                          <div
                            className={`${base}__avatar`}
                          >
                            {(
                              r.name ||
                              "E"
                            )
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {r.name}
                            </strong>

                            <span>
                              {r.head}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* INVOICE */}

                      <td>

                        <span
                          className={`${base}__invoice`}
                        >
                          {r.invoice}
                        </span>

                      </td>

                      {/* PAYMENT */}

                      <td>

                        <span
                          className={`${base}__payment ${base}__payment--${getPaymentClass(
                            r.payment
                          )}`}
                        >
                          {r.payment}
                        </span>

                      </td>

                      {/* HEAD */}

                      <td
                        className={`${base}__headCell`}
                      >
                        {r.head}
                      </td>

                      {/* ACCOUNT */}

                      <td>

                        <div
                          className={`${base}__accountCell`}
                        >

                          <strong>
                            {r.accountName}
                          </strong>

                          <span>
                            {r.accountType}
                          </span>

                        </div>

                      </td>

                      {/* SESSION */}

                      <td>
                        {r.session}
                      </td>

                      {/* DATE */}

                      <td>

                        <div
                          className={`${base}__dateCell`}
                        >

                          <FaCalendarAlt />

                          {r.date}

                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <div
                          className={`${base}__descriptionCell`}
                        >
                          {r.description}
                        </div>

                      </td>

                      {/* AMOUNT */}

                      <td
                        className={`${base}__amtCell`}
                      >

                        {formatAmount(
                          r.amount
                        )}

                      </td>

                      {/* BALANCE */}

                      <td
                        className={`${base}__balanceCell`}
                      >

                        {formatAmount(
                          r.amount
                        )}

                      </td>

                      {/* BILL */}

                      <td>

                        {r.bill ? (

                          <button
                            type="button"
                            className={`${base}__billBtn`}
                            onClick={() =>
                              handleViewBill(
                                r.bill
                              )
                            }
                          >

                            <FaEye />

                            View

                          </button>

                        ) : (

                          <span
                            className={`${base}__noBill`}
                          >
                            <FaTimes />
                            No Bill
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    className={`${base}__empty`}
                    colSpan={12}
                  >

                    <div
                      className={`${base}__emptyBox`}
                    >

                      <div
                        className={`${base}__emptyIcon`}
                      >
                        <FaSearch />
                      </div>

                      <strong>
                        No records found
                      </strong>

                      <span>
                        Try changing your
                        search or filters.
                      </span>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          filtered.length > 0 && (

            <div
              className={`${base}__pagination`}
            >

              <div
                className={`${base}__paginationInfo`}
              >

                Showing{" "}

                <strong>
                  {indexOfFirstItem + 1}
                </strong>

                {" "}to{" "}

                <strong>
                  {Math.min(
                    indexOfLastItem,
                    filtered.length
                  )}
                </strong>

                {" "}of{" "}

                <strong>
                  {filtered.length}
                </strong>

                {" "}records

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
                        {page}
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
  );
};

export default ExpenseList;