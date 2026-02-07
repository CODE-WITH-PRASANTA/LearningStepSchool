import React, { useState } from "react";
import "./PostalReceive.css";

export default function PostalReceive() {
  const [form, setForm] = useState({
    fromTitle: "",
    toTitle: "",
    referenceNo: "",
    date: "",
    note: "",
    address: "",
    attachment: null,
  });

  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(records[index]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.fromTitle || !form.toTitle || !form.referenceNo || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    if (editIndex !== null) {
      const updated = [...records];
      updated[editIndex] = form;
      setRecords(updated);
      setEditIndex(null);
    } else {
      setRecords([...records, form]);
    }

    setForm({
      fromTitle: "",
      toTitle: "",
      referenceNo: "",
      date: "",
      note: "",
      address: "",
      attachment: null,
    });
  };

  const filteredRecords = records.filter(
    (rec) =>
      rec.fromTitle.toLowerCase().includes(search.toLowerCase()) ||
      rec.toTitle.toLowerCase().includes(search.toLowerCase()) ||
      rec.referenceNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pr-wrapper">
      <h1 className="pr-heading">Postal Receive</h1>

      <div className="pr-grid">

        {/* LEFT FORM */}
        <form className="pr-card" onSubmit={handleSubmit}>
          <h2 className="pr-card-title">
            {editIndex !== null ? "Update Details" : "Add & Edit"}
          </h2>

          <label>From Title *</label>
          <input
            type="text"
            className="pr-input"
            value={form.fromTitle}
            onChange={(e) => setForm({ ...form, fromTitle: e.target.value })}
          />

          <label>To Title *</label>
          <input
            type="text"
            className="pr-input"
            value={form.toTitle}
            onChange={(e) => setForm({ ...form, toTitle: e.target.value })}
          />

          <label>Reference No *</label>
          <input
            type="text"
            className="pr-input"
            value={form.referenceNo}
            onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
          />

          <label>Date *</label>
          <input
            type="date"
            className="pr-input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <label>Note</label>
          <textarea
            className="pr-textarea"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          ></textarea>

          <label>Address</label>
          <textarea
            className="pr-textarea"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          ></textarea>

          <label>Attachment</label>
          <input
            type="file"
            className="pr-input file-input"
            onChange={(e) =>
              setForm({ ...form, attachment: e.target.files[0] })
            }
          />

          <button type="submit" className="pr-btn">
            {editIndex !== null ? "Update Entry" : "Submit Entry"}
          </button>
        </form>

        {/* RIGHT TABLE */}
        <div className="pr-card pr-table-card">
          <h2 className="pr-card-title">Postal Receive List</h2>

          <div className="pr-search-box">
            <input
              type="text"
              className="pr-search-input"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="pr-table-scroll">
            <table className="pr-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>From Title</th>
                  <th>Reference No</th>
                  <th>To Title</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((rec, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{rec.fromTitle}</td>
                    <td>{rec.referenceNo}</td>
                    <td>{rec.toTitle}</td>
                    <td>{rec.date}</td>

                    <td>
                      <button className="pr-edit" onClick={() => handleEdit(i)}>
                        Edit
                      </button>

                      <button
                        className="pr-delete"
                        onClick={() =>
                          setRecords(records.filter((_, idx) => idx !== i))
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="6" className="pr-no-data">
                      No entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="pr-footer">
            Showing {filteredRecords.length} of {records.length} entries
          </p>
        </div>
      </div>
    </div>
  );
}
