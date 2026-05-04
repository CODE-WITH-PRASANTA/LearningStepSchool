import React, { useState, useEffect } from "react";
// import API from "../api/axios";
import "./FeeManagement.css";

const FeeManagement = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);
  const [fees, setFees] = useState([]);

  const fetchFees = async () => {
    const res = await API.get("/fees");
    setFees(res.data);
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const addFeature = () => {
    if (!feature.trim()) return;
    setFeatures([...features, feature]);
    setFeature("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/fees", { title, price, features });
    setTitle("");
    setPrice("");
    setFeatures([]);
    fetchFees();
  };

  return (
    <div className="feeUI">

      {/* TOP SECTION */}
      <div className="feeUI__top">

        {/* FORM */}
        <form className="feeUI__form" onSubmit={handleSubmit}>
          <h2>Create Fee Plan</h2>

          <div className="feeUI__row">
            <div>
              <label>Class Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label>Per Year Price (₹)</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <label>Add Feature</label>
          <div className="feeUI__featureRow">
            <input
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
            />
            <button type="button" onClick={addFeature}>
              Add
            </button>
          </div>

          <button className="feeUI__submit">
            Save Fee Plan
          </button>
        </form>

        {/* PREVIEW */}
        <div className="feeUI__preview">
          <h3>Live Preview</h3>

          <div className="feeUI__card">
            <h4>{title || "Class Title"}</h4>

            <p className="feeUI__price">
              ₹{price || 0} <span>/ year</span>
            </p>

            {features.length === 0 ? (
              <p className="feeUI__empty">No features added yet</p>
            ) : (
              <ul>
                {features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="feeUI__tableWrap">
        <table className="feeUI__table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Yearly Fee</th>
              <th>Features</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((fee, i) => (
              <tr key={i}>
                <td>{fee.title}</td>
                <td>₹{fee.price}</td>
                <td>{fee.features.length}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default FeeManagement;