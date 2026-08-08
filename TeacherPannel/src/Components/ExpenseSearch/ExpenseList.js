import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api/axios";

const ExpenseList = () => {
  const location = useLocation();
  const filters = location.state || {};

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH DATA
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const res = await API.get("/expenses/search", {
        params: filters,
      });
      console.log("DATA:", res.data);
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Expense Results</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>NAME</th>
              <th>INVOICE NUMBER</th>
              <th>PAYMENT MODE</th>
              <th>EXPENSE HEAD</th>
              <th>DATE</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6">No Data Found ❌</td>
              </tr>
            ) : (
              data.map((e) => (
                <tr key={e._id}>
                  <td>{e.name}</td> {/* ✅ FIXED */}
                  <td>{e.invoice}</td> {/* ✅ ADDED */}
                  <td>{e.paymentMode}</td> {/* ✅ FIXED */}
                  <td>{e.head}</td> {/* ✅ FIXED */}
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.description || "-"}</td> {/* ✅ SAFE */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
