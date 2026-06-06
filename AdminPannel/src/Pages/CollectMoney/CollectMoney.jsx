import API from "./../../api/axios";
import React, { useEffect, useState } from "react";
import "./CollectMoney.css";
import { Eye } from "lucide-react";

const CollectMoney = () => {
  const [selected, setSelected] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    incomeHead: "",
    amount: "",
    paymentMode: "CASH",
    receivedFrom: "",
    date: "",
    note: "",
  });

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [search, paymentFilter, fromDate, toDate, minAmount, maxAmount]);

  const fetchIncome = async () => {
    try {
      const res = await API.get("/other-income/all");

      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveIncome = async () => {
    try {
      if (
        !formData.incomeHead ||
        !formData.amount ||
        !formData.receivedFrom ||
        !formData.date
      ) {
        return alert("Please fill all required fields");
      }

      await API.post("/other-income/create", formData);

      alert("Income Added Successfully");

      setFormData({
        incomeHead: "",
        amount: "",
        paymentMode: "CASH",
        receivedFrom: "",
        date: "",
        note: "",
      });

      setOpenForm(false);

      fetchIncome();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      if (!window.confirm("Delete this income?")) {
        return;
      }

      await API.delete(`/other-income/delete/${id}`);

      fetchIncome();

      alert("Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateIncome = async (id) => {
    try {
      await API.put(`/other-income/update/${id}`, formData);

      alert("Updated Successfully");

      setFormData({
        incomeHead: "",
        amount: "",
        paymentMode: "CASH",
        receivedFrom: "",
        date: "",
        note: "",
      });

      fetchIncome();
      setOpenForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.incomeHead?.toLowerCase().includes(search.toLowerCase()) ||
      item.receivedFrom?.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = !paymentFilter || item.paymentMode === paymentFilter;

    const itemDate = new Date(item.date);

    const matchesFromDate = !fromDate || itemDate >= new Date(fromDate);

    const matchesToDate = !toDate || itemDate <= new Date(toDate);

    const matchesMin = !minAmount || item.amount >= Number(minAmount);

    const matchesMax = !maxAmount || item.amount <= Number(maxAmount);

    return (
      matchesSearch &&
      matchesPayment &&
      matchesFromDate &&
      matchesToDate &&
      matchesMin &&
      matchesMax
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;

  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  //

  const currentDate = new Date();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Monthly Income
  const monthlyIncome = data
    .filter((item) => {
      const d = new Date(item.date);

      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // Yearly Income
  const yearlyIncome = data
    .filter((item) => {
      const d = new Date(item.date);

      return d.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="collectMoney">
      {/* TOP */}
      <div className="collectMoney__top">
        <button
          className="collectMoney__collectBtn"
          onClick={() => setOpenForm(true)}
        >
          Add Income
        </button>
      </div>

      {/* FILTER */}
      <div className="collectMoney__filters">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">All Payment Modes</option>
          <option value="CASH">CASH</option>
          <option value="UPI">UPI</option>
          <option value="BANK">BANK</option>
          <option value="CARD">CARD</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min Amount"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />

        <button disabled className="apply">
          Applied Automatically
        </button>
        <button
          className="reset"
          onClick={() => {
            setSearch("");
            setPaymentFilter("");
            setFromDate("");
            setToDate("");
            setMinAmount("");
            setMaxAmount("");
          }}
        >
          Reset
        </button>
      </div>

      {/* GRID */}
      <div className="collectMoney__grid">
        {/* LEFT TABLE */}
        <div className="collectMoney__card">
          <h3>Other Income History</h3>
          <p className="subText">{filteredData.length} records found</p>

          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Income Head</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Received From</th>

                  <th>Note</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item) => (
                  <tr key={item._id}>
                    <td>{item.incomeHead}</td>

                    <td>{new Date(item.date).toLocaleDateString()}</td>

                    <td>₹{item.amount}</td>

                    <td>{item.paymentMode}</td>

                    <td>{item.receivedFrom}</td>

                    <td>{item.note}</td>

                    <td>
                      <button
                        className="viewBtn"
                        onClick={() => setSelected(item)}
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        className="editBtn"
                        onClick={() => {
                          setFormData({
                            ...item,
                            date: item.date?.split("T")[0],
                          });

                          setOpenForm(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteIncome(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="collectMoney__right">
          {/* MONTHLY REPORT */}
          <div className="collectMoney__card">
            <h3>Monthly Income</h3>
            <p className="subText">Current Month Summary</p>

            <div className="reportBox">
              <div className="reportHeader">
                <span>
                  {monthName} {currentYear}
                </span>

                <span className="amountBlue">
                  ₹{monthlyIncome.toLocaleString()}
                </span>
              </div>

              <div className="progressBar">
                <div className="bar" style={{ width: "100%" }}></div>
              </div>

              <div className="reportFooter">
                <span>Total Income ₹{monthlyIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* YEARLY REPORT */}
          <div className="collectMoney__card">
            <h3>Yearly Income</h3>
            <p className="subText">Current Year Summary</p>

            <div className="reportBox">
              <div className="reportHeader">
                <span>{currentYear}</span>

                <span className="amountBlue">
                  ₹{yearlyIncome.toLocaleString()}
                </span>
              </div>

              <div className="progressBar">
                <div className="bar" style={{ width: "100%" }}></div>
              </div>

              <div className="reportFooter">
                <span>Total Income ₹{yearlyIncome.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {selected && (
        <div className="collectMoney__modal">
          <div className="collectMoney__popup">
            <div className="modalHeader">
              <h3>Fee Details</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="detailGrid">
              <div>
                <span>INCOME HEAD</span>
                <p>{selected.incomeHead}</p>
              </div>

              <div>
                <span>DATE</span>
                <p>{new Date(selected.date).toLocaleDateString()}</p>
              </div>

              <div>
                <span>AMOUNT</span>
                <p>₹{selected.amount}</p>
              </div>

              <div>
                <span>PAYMENT MODE</span>
                <p>{selected.paymentMode}</p>
              </div>

              <div>
                <span>RECEIVED FROM</span>
                <p>{selected.receivedFrom}</p>
              </div>

              <div className="full">
                <span>NOTE</span>
                <p>{selected.note}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Income FORM */}
      {openForm && (
        <div className="collectMoney__modal">
          <div className="collectForm">
            <div className="modalHeader">
              <h3>{formData._id ? "Update Income" : "Add Income"}</h3>
              <button
                onClick={() => {
                  setOpenForm(false);

                  setFormData({
                    incomeHead: "",
                    amount: "",
                    paymentMode: "CASH",
                    receivedFrom: "",
                    date: "",
                    note: "",
                  });
                }}
              >
                ✕
              </button>
            </div>

            <div className="formGrid">
              <div className="formGroup">
                <label>Income Mode</label>
                <input
                  type="text"
                  name="incomeHead"
                  value={formData.incomeHead}
                  onChange={handleChange}
                  placeholder="Enter Income Mode"
                />
              </div>

              <div className="formGroup">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="formGroup">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter Amount"
                />
              </div>

              <div className="formGroup">
                <label>Payment Mode</label>

                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                >
                  <option value="CASH">CASH</option>
                  <option value="CARD">CARD</option>
                  <option value="BANK">BANK</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Received From</label>
                <input
                  type="text"
                  name="receivedFrom"
                  value={formData.receivedFrom}
                  onChange={handleChange}
                  placeholder="Enter Name"
                />
              </div>

              {/* <div className="formGroup">
                <label>Timing</label>
                <input
                  type="text"
                  name="receivedFrom"
                  value={formData.receivedFrom}
                  onChange={handleChange}
                  placeholder="Received From"
                />
              </div> */}

              <div className="formGroup fullWidth">
                <label>Note</label>

                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="formActions">
              <button
                className="cancelBtn"
                onClick={() => {
                  setOpenForm(false);

                  setFormData({
                    incomeHead: "",
                    amount: "",
                    paymentMode: "CASH",
                    receivedFrom: "",
                    date: "",
                    note: "",
                  });
                }}
              >
                Cancel
              </button>

              <button
                className="saveBtn"
                onClick={() =>
                  formData._id
                    ? handleUpdateIncome(formData._id)
                    : handleSaveIncome()
                }
              >
                {formData._id ? "Update Income" : "Save Income"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectMoney;
