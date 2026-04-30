import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ExpenseList.css";
import API from "../../api/axios";

const ExpenseList = () => {
  const base = "expense-list";

  const location = useLocation();
  const filters = location.state || {};

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await API.get("/expenses/search", {
        params: filters,
      });

      setData(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ MAP BACKEND DATA → UI FORMAT
  const rows = useMemo(
    () =>
      data.map((e, i) => ({
        id: e._id || i,
        name: e.name || "-",
        invoice: e.invoice || "-",
        payment: e.paymentMode || "-",
        head: e.head || "-",
        session: "2025-26",
        date: e.date
          ? new Date(e.date).toLocaleDateString()
          : "-",
        description: e.description || "-",
        amount: e.amount || 0,
      })),
    [data]
  );

  // ✅ SEARCH FILTER
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(q)
    );
  }, [rows, search]);

  // ✅ LIMIT (PAGE SIZE)
  const limitedRows = useMemo(
    () => filtered.slice(0, Number(pageSize)),
    [filtered, pageSize]
  );

  return (
    <div className={base}>
      {/* ✅ TOPBAR (ONLY ADD BUTTON, NO CLASS CHANGE) */}
      <div className={`${base}__topbar`}>
        <h1 className={`${base}__title`}>Expense List</h1>

        {/* ✅ BACK BUTTON */}
        <button
          onClick={() =>
            window.history.length > 1
              ? navigate(-1)
              : navigate("/expense-search")
          }
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          ⬅ Back
        </button>
      </div>

      <div className={`${base}__toolbar`}>
        <div className={`${base}__pagesize`}>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className={`${base}__search`}>
          <span className={`${base}__searchLabel`}>Search:</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={`${base}__tableCard`}>
        <div className={`${base}__tableWrap`}>
          <table className={`${base}__table`}>
            <thead>
              <tr>
                <th>NAME</th>
                <th>INVOICE NUMBER</th>
                <th>PAYMENT MODE</th>
                <th>EXPENSE HEAD</th>
                <th>SESSION</th>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th className={`${base}__amountTh`}>AMOUNT (RS)</th>
                <th className={`${base}__balanceTh`}>BALANCE (RS)</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className={`${base}__empty`}>
                    Loading...
                  </td>
                </tr>
              ) : limitedRows.length ? (
                limitedRows.map((r) => (
                  <tr key={r.id}>
                    <td className={`${base}__nameCell`}>{r.name}</td>
                    <td>{r.invoice}</td>
                    <td>{r.payment}</td>
                    <td className={`${base}__headCell`}>{r.head}</td>
                    <td>{r.session}</td>
                    <td>{r.date}</td>
                    <td>{r.description}</td>
                    <td className={`${base}__amtCell`}>{r.amount}</td>

                    <td className={`${base}__balanceCell`}>
                      {r.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className={`${base}__empty`} colSpan={9}>
                    No records found ❌
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;