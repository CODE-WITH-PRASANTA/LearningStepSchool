// ExpenseList.jsx
import React, { useMemo, useState } from "react";
import "./ExpenseList.css";

const ExpenseList = () => {
  const base = "expense-list";

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(25);

  const rows = useMemo(
    () => [
      {
        id: 1,
        name: "ELECTRICITY BILL",
        invoice: "272",
        payment: "Cash",
        head: "ELECTRIC ITEM",
        session: "2025-26",
        date: "06-02-2026",
        description: "",
        amount: 5500,
      },
      {
        id: 2,
        name: "nikhil sharma",
        invoice: "271",
        payment: "Cash",
        head: "Electricitysfafdas",
        session: "2025-26",
        date: "28-01-2026",
        description: "",
        amount: 1000,
      },
      {
        id: 3,
        name: "Kapil",
        invoice: "270",
        payment: "Cash",
        head: "TRANSPORTAION",
        session: "2025-26",
        date: "15-01-2026",
        description: "",
        amount: 10000,
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const limitedRows = useMemo(
    () => filtered.slice(0, Number(pageSize)),
    [filtered, pageSize]
  );

  return (
    <div className={base}>
      <div className={`${base}__topbar`}>
        <h1 className={`${base}__title`}>Expense List</h1>
      </div>

      <div className={`${base}__toolbar`}>
        <div className={`${base}__pagesize`}>
          <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className={`${base}__search`}>
          <span className={`${base}__searchLabel`}>Search:</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} />
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

                {/* ✅ NEW COLUMN */}
                <th className={`${base}__balanceTh`}>BALANCE (RS)</th>
              </tr>
            </thead>

            <tbody>
              {limitedRows.map((r) => (
                <tr key={r.id}>
                  <td className={`${base}__nameCell`}>{r.name}</td>
                  <td>{r.invoice}</td>
                  <td>{r.payment}</td>
                  <td className={`${base}__headCell`}>{r.head}</td>
                  <td>{r.session}</td>
                  <td>{r.date}</td>
                  <td>{r.description}</td>
                  <td className={`${base}__amtCell`}>{r.amount}</td>

                  {/* ✅ NEW COLUMN DATA */}
                  <td className={`${base}__balanceCell`}>
                    {r.amount} {/* change logic if needed */}
                  </td>
                </tr>
              ))}

              {!limitedRows.length && (
                <tr>
                  <td className={`${base}__empty`} colSpan={9}>
                    No records found
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