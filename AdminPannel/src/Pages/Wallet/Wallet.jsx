import { useEffect, useMemo, useState } from "react";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiCreditCard,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import API from "../../api/axios";
import "./Wallet.css";

const initialFilters = {
  type: "",
  source: "",
  from: "",
  to: "",
  year: "",
  month: "",
  minAmount: "",
  maxAmount: "",
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMoney = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Wallet = () => {
  const [summary, setSummary] = useState({ credit: 0, debit: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchWallet = async (nextFilters = filters) => {
    try {
      setLoading(true);

      const serverFilters = {
        type: nextFilters.type,
        source: nextFilters.source,
        from: nextFilters.from,
        to: nextFilters.to,
      };

      const params = Object.fromEntries(
        Object.entries(serverFilters).filter(([, value]) => value),
      );

      const [summaryRes, historyRes, monthlyRes] = await Promise.all([
        API.get("/wallet/summary"),
        API.get("/wallet/history", { params }),
        API.get("/wallet/monthly"),
      ]);

      setSummary(summaryRes.data || { credit: 0, debit: 0, balance: 0 });
      setTransactions(historyRes.data?.data || []);
      setMonthly(monthlyRes.data?.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet(initialFilters);
  }, []);

  const availableYears = useMemo(() => {
    const years = transactions
      .map((tx) => tx.createdAt && new Date(tx.createdAt).getFullYear())
      .filter(Boolean);

    return [...new Set(years)].sort((a, b) => b - a);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((tx) => {
      const createdAt = tx.createdAt ? new Date(tx.createdAt) : null;
      const amount = Number(tx.amount) || 0;

      const matchesSearch =
        !query ||
        [tx.type, tx.source, tx.description, tx.createdBy, tx.referenceId]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesType = !filters.type || tx.type === filters.type;
      const matchesSource = !filters.source || tx.source === filters.source;
      const matchesYear =
        !filters.year ||
        (createdAt && createdAt.getFullYear().toString() === filters.year);
      const matchesMonth =
        !filters.month ||
        (createdAt && createdAt.getMonth() + 1 === Number(filters.month));
      const matchesFrom =
        !filters.from || (createdAt && createdAt >= new Date(filters.from));
      const matchesTo =
        !filters.to ||
        (createdAt &&
          createdAt <= new Date(`${filters.to}T23:59:59.999`));
      const matchesMin =
        filters.minAmount === "" || amount >= Number(filters.minAmount);
      const matchesMax =
        filters.maxAmount === "" || amount <= Number(filters.maxAmount);

      return (
        matchesSearch &&
        matchesType &&
        matchesSource &&
        matchesYear &&
        matchesMonth &&
        matchesFrom &&
        matchesTo &&
        matchesMin &&
        matchesMax
      );
    });
  }, [search, filters, transactions]);

  const filteredTotals = useMemo(
    () =>
      filteredTransactions.reduce(
        (acc, tx) => {
          const amount = Number(tx.amount) || 0;
          if (tx.type === "credit") acc.credit += amount;
          if (tx.type === "debit") acc.debit += amount;
          return acc;
        },
        { credit: 0, debit: 0 },
      ),
    [filteredTransactions],
  );

  const hasActiveFilters = useMemo(
    () =>
      Boolean(search.trim()) ||
      Object.values(filters).some((value) => value !== ""),
    [filters, search],
  );

  const monthlyRows = useMemo(() => {
    const map = new Map();

    monthly.forEach((item) => {
      const key = `${item._id.year}-${item._id.month}`;
      const existing = map.get(key) || {
        key,
        label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        credit: 0,
        debit: 0,
      };

      existing[item._id.type] = item.total;
      map.set(key, existing);
    });

    return [...map.values()].map((item) => ({
      ...item,
      balance: item.credit - item.debit,
      max: Math.max(item.credit, item.debit, 1),
    }));
  }, [monthly]);

  const filteredMonthlyRows = useMemo(() => {
    const map = new Map();

    filteredTransactions.forEach((tx) => {
      if (!tx.createdAt) return;
      const date = new Date(tx.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const existing = map.get(key) || {
        key,
        label: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
        credit: 0,
        debit: 0,
      };

      existing[tx.type] += Number(tx.amount) || 0;
      map.set(key, existing);
    });

    return [...map.values()]
      .map((item) => ({
        ...item,
        balance: item.credit - item.debit,
        max: Math.max(item.credit, item.debit, 1),
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [filteredTransactions]);

  const visibleMonthlyRows = hasActiveFilters ? filteredMonthlyRows : monthlyRows;
  const filteredBalance = filteredTotals.credit - filteredTotals.debit;

  const netFlow =
    Number(summary.credit || 0) > 0
      ? Math.round(
          (Number(summary.balance || 0) / Number(summary.credit || 1)) * 100,
        )
      : 0;

  const openTransaction = async (id) => {
    try {
      setDetailLoading(true);
      const res = await API.get(`/wallet/${id}`);
      setSelectedTx(res.data?.data || null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load transaction");
    } finally {
      setDetailLoading(false);
    }
  };

  const updateFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch("");
    fetchWallet(initialFilters);
  };

  return (
    <div className="WalletPage">
      <div className="WalletHero">
        <div>
          <span className="WalletHero__eyebrow">Finance wallet</span>
          <h1>Wallet Overview</h1>
          <p>Track every fee credit and expense debit from one place.</p>
        </div>

        <button className="WalletHero__refresh" onClick={() => fetchWallet()}>
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      <div className="WalletStats">
        <div className="WalletStat WalletStat--balance">
          <div className="WalletStat__icon">
            <FiCreditCard />
          </div>
          <span>{hasActiveFilters ? "Filtered Balance" : "Current Balance"}</span>
          <strong>
            {formatMoney(hasActiveFilters ? filteredBalance : summary.balance)}
          </strong>
          <small>
            {hasActiveFilters
              ? `${filteredTransactions.length} matching records`
              : `${netFlow}% net of total credits`}
          </small>
        </div>

        <div className="WalletStat">
          <div className="WalletStat__icon WalletStat__icon--credit">
            <FiArrowDownLeft />
          </div>
          <span>{hasActiveFilters ? "Filtered Credit" : "Total Credit"}</span>
          <strong>
            {formatMoney(
              hasActiveFilters ? filteredTotals.credit : summary.credit,
            )}
          </strong>
          <small>Fee and income inflow</small>
        </div>

        <div className="WalletStat">
          <div className="WalletStat__icon WalletStat__icon--debit">
            <FiArrowUpRight />
          </div>
          <span>{hasActiveFilters ? "Filtered Debit" : "Total Debit"}</span>
          <strong>
            {formatMoney(hasActiveFilters ? filteredTotals.debit : summary.debit)}
          </strong>
          <small>Expense outflow</small>
        </div>

        <div className="WalletStat">
          <div className="WalletStat__icon WalletStat__icon--neutral">
            <FiTrendingUp />
          </div>
          <span>Transactions</span>
          <strong>
            {hasActiveFilters ? filteredTransactions.length : transactions.length}
          </strong>
          <small>{hasActiveFilters ? "Matching records" : "Loaded records"}</small>
        </div>
      </div>

      <div className="WalletFilters">
        <div className="WalletSearch">
          <FiSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description, source, reference..."
          />
        </div>

        <select name="type" value={filters.type} onChange={updateFilter}>
          <option value="">All Types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <select name="source" value={filters.source} onChange={updateFilter}>
          <option value="">All Sources</option>
          <option value="fee">Fee</option>
          <option value="expense">Expense</option>
        </select>

        <select name="year" value={filters.year} onChange={updateFilter}>
          <option value="">All Years</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select name="month" value={filters.month} onChange={updateFilter}>
          <option value="">All Months</option>
          {monthNames.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>

        <label className="WalletDate">
          <FiCalendar />
          <input
            type="date"
            name="from"
            value={filters.from}
            max={filters.to || undefined}
            onChange={updateFilter}
          />
        </label>

        <label className="WalletDate">
          <FiCalendar />
          <input
            type="date"
            name="to"
            value={filters.to}
            min={filters.from || undefined}
            onChange={updateFilter}
          />
        </label>

        <input
          className="WalletAmountInput"
          type="number"
          name="minAmount"
          min="0"
          value={filters.minAmount}
          onChange={updateFilter}
          placeholder="Min amount"
        />

        <input
          className="WalletAmountInput"
          type="number"
          name="maxAmount"
          min="0"
          value={filters.maxAmount}
          onChange={updateFilter}
          placeholder="Max amount"
        />

        <button className="WalletFilterBtn" onClick={() => fetchWallet()}>
          <FiFilter />
          Apply
        </button>

        <button className="WalletResetBtn" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {hasActiveFilters && (
        <div className="WalletActiveFilters">
          <span>Active filters</span>
          {search.trim() && <strong>Search: {search.trim()}</strong>}
          {Object.entries(filters)
            .filter(([, value]) => value !== "")
            .map(([key, value]) => (
              <strong key={key}>
                {key}: {key === "month" ? monthNames[Number(value) - 1] : value}
              </strong>
            ))}
        </div>
      )}

      <div className="WalletContent">
        <section className="WalletPanel WalletPanel--wide">
          <div className="WalletPanel__head">
            <div>
              <h2>Transaction History</h2>
              <p>{filteredTransactions.length} records found</p>
            </div>
          </div>

          <div className="WalletTableWrap">
            <table className="WalletTable">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Created By</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="WalletEmpty">
                      Loading wallet transactions...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="WalletEmpty">
                      No wallet transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>
                        <span className={`WalletPill ${tx.type}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="WalletSource">{tx.source}</td>
                      <td className="WalletDescription">
                        {tx.description || "-"}
                      </td>
                      <td
                        className={
                          tx.type === "credit"
                            ? "WalletAmount WalletAmount--credit"
                            : "WalletAmount WalletAmount--debit"
                        }
                      >
                        {formatMoney(tx.amount)}
                      </td>
                      <td>{tx.createdBy || "Admin"}</td>
                      <td>{formatDate(tx.createdAt)}</td>
                      <td>
                        <button
                          className="WalletViewBtn"
                          onClick={() => openTransaction(tx._id)}
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="WalletPanel">
          <div className="WalletPanel__head">
            <div>
              <h2>Monthly Report</h2>
              <p>{hasActiveFilters ? "Filtered credit vs debit" : "Credit vs debit"}</p>
            </div>
          </div>

          <div className="WalletMonths">
            {visibleMonthlyRows.length === 0 ? (
              <div className="WalletEmpty WalletEmpty--card">
                No monthly data
              </div>
            ) : (
              visibleMonthlyRows.slice(0, 8).map((item) => (
                <div className="WalletMonth" key={item.key}>
                  <div className="WalletMonth__top">
                    <strong>{item.label}</strong>
                    <span>{formatMoney(item.balance)}</span>
                  </div>

                  <div className="WalletBars">
                    <span
                      className="WalletBars__credit"
                      style={{ width: `${(item.credit / item.max) * 100}%` }}
                    />
                    <span
                      className="WalletBars__debit"
                      style={{ width: `${(item.debit / item.max) * 100}%` }}
                    />
                  </div>

                  <div className="WalletMonth__meta">
                    <span>Credit {formatMoney(item.credit)}</span>
                    <span>Debit {formatMoney(item.debit)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {(selectedTx || detailLoading) && (
        <div className="WalletModalOverlay" onClick={() => setSelectedTx(null)}>
          <div className="WalletModal" onClick={(e) => e.stopPropagation()}>
            <div className="WalletModal__head">
              <h2>Transaction Detail</h2>
              <button onClick={() => setSelectedTx(null)}>
                <FiX />
              </button>
            </div>

            {detailLoading ? (
              <div className="WalletEmpty WalletEmpty--card">Loading...</div>
            ) : (
              <div className="WalletDetail">
                <div>
                  <span>Type</span>
                  <strong>{selectedTx.type}</strong>
                </div>
                <div>
                  <span>Source</span>
                  <strong>{selectedTx.source}</strong>
                </div>
                <div>
                  <span>Amount</span>
                  <strong>{formatMoney(selectedTx.amount)}</strong>
                </div>
                <div>
                  <span>Created By</span>
                  <strong>{selectedTx.createdBy || "Admin"}</strong>
                </div>
                <div className="WalletDetail__full">
                  <span>Reference ID</span>
                  <strong>{selectedTx.referenceId}</strong>
                </div>
                <div className="WalletDetail__full">
                  <span>Description</span>
                  <strong>{selectedTx.description || "-"}</strong>
                </div>
                <div className="WalletDetail__full">
                  <span>Created At</span>
                  <strong>{formatDate(selectedTx.createdAt)}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
