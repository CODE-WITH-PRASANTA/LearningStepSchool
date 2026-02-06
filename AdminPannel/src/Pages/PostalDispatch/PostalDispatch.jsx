import React, { useState } from "react";
import "./PostalDispatch.css";

export default function PostalDispatch() {
  const [form, setForm] = useState({
    toTitle: "",
    fromTitle: "",
    referenceNo: "",
    date: "",
    note: "",
    address: "",
    attachment: null,
  });

  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  // Load selected row into form
  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(records[index]);
  };

  // Submit or update data
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.toTitle || !form.fromTitle || !form.referenceNo || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    if (editIndex !== null) {
      const update = [...records];
      update[editIndex] = form;
      setRecords(update);
      setEditIndex(null);
    } else {
      setRecords([...records, form]);
    }

    setForm({
      toTitle: "",
      fromTitle: "",
      referenceNo: "",
      date: "",
      note: "",
      address: "",
      attachment: null,
    });
  };

  // Search filter
  const filteredRecords = records.filter(
    (rec) =>
      rec.toTitle.toLowerCase().includes(search.toLowerCase()) ||
      rec.fromTitle.toLowerCase().includes(search.toLowerCase()) ||
      rec.referenceNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pd-main-wrapper">

      <h1 className="pd-main-heading">Postal Dispatch</h1>

      <div className="pd-container">

        {/* LEFT FORM */}
        <form className="pd-form" onSubmit={handleSubmit}>
          <h2 className="pd-title">
            {editIndex !== null ? "Edit Data" : "Add & Edit"}
          </h2>

          <label>To Title *</label>
          <input
            type="text"
            className="pd-input"
            value={form.toTitle}
            onChange={(e) => setForm({ ...form, toTitle: e.target.value })}
          />

          <label>From Title *</label>
          <input
            type="text"
            className="pd-input"
            value={form.fromTitle}
            onChange={(e) => setForm({ ...form, fromTitle: e.target.value })}
          />

          <label>Reference No *</label>
          <input
            type="text"
            className="pd-input"
            value={form.referenceNo}
            onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
          />

          <label>Date *</label>
          <input
            type="date"
            className="pd-input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <label>Note</label>
          <textarea
            className="pd-textarea"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          ></textarea>

          <label>Address</label>
          <textarea
            className="pd-textarea"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          ></textarea>

          <label>Attachment</label>
          <input
            type="file"
            className="pd-input"
            onChange={(e) =>
              setForm({ ...form, attachment: e.target.files[0] })
            }
          />

          <button type="submit" className="pd-submit-btn">
            {editIndex !== null ? "Update" : "Submit"}
          </button>
        </form>

        {/* RIGHT TABLE */}
        <div className="pd-table-box">
          <h2 className="pd-title">Postal Dispatch List</h2>

          <div className="pd-search-box">
            <label>Search:</label>
            <input
              type="text"
              className="pd-search-input"
              placeholder="Search records..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Horizontal Scroll Wrapper */}
          <div className="pd-table-scroll">
            <table className="pd-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>To Title</th>
                  <th>Reference No</th>
                  <th>From Title</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((rec) => {
                  const realIndex = records.indexOf(rec);

                  return (
                    <tr key={realIndex}>
                      <td>{realIndex + 1}</td>
                      <td>{rec.toTitle}</td>
                      <td>{rec.referenceNo}</td>
                      <td>{rec.fromTitle}</td>
                      <td>{rec.date}</td>
                      <td>
                        <button
                          className="pd-edit"
                          onClick={() => handleEdit(realIndex)}
                        >
                          Edit
                        </button>
                        <button
                          className="pd-delete"
                          onClick={() =>
                            setRecords(
                              records.filter((_, idx) => idx !== realIndex)
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="6" className="pd-empty">
                      No entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="pd-footer">
            Showing {filteredRecords.length} of {records.length} entries
          </p>
        </div>
      </div>
    </div>
  );
}
