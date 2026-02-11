import React, { useState } from "react";
import "./ClsWiseDataManagements.css";

const PAGE_SIZE = 6;

const ClsWiseDataManagements = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    age: "",
    weekly: "",
    timeManagement: "",
    image: null,
    preview: null,
  });

  const [data, setData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file, preview: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setData([form, ...data]);
    setVisibleCount(PAGE_SIZE);
    setForm({
      title: "",
      description: "",
      age: "",
      weekly: "",
      timeManagement: "",
      image: null,
      preview: null,
    });
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) =>
        Math.min(prev + PAGE_SIZE, data.length)
      );
    }
  };

  const visibleData = data.slice(0, visibleCount);

  return (
    <div className="clswisedata-wrapper">
      <h1 className="clswisedata-title">Class Wise Data Management</h1>

      <div className="clswisedata-layout">
        {/* LEFT FORM */}
        <form
          className="clswisedata-form"
          onSubmit={handleSubmit}
        >
          <h2 className="clswisedata-section-title">Add Class Data</h2>

          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <label>Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            required
          />

          <label>Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            required
          />

          <label>Weekly</label>
          <input
            placeholder="e.g. 5 Days"
            value={form.weekly}
            onChange={(e) => setForm({ ...form, weekly: e.target.value })}
          />

          <label>Time Management</label>
          <input
            placeholder="e.g. 2 Hours / Day"
            value={form.timeManagement}
            onChange={(e) =>
              setForm({ ...form, timeManagement: e.target.value })
            }
          />

          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImage} />

          {form.preview && (
            <img
              src={form.preview}
              alt="Preview"
              className="clswisedata-preview"
            />
          )}

          <button className="clswisedata-btn">Submit</button>
        </form>

        {/* RIGHT TABLE */}
        <div className="clswisedata-table-wrapper">
          <h2 className="clswisedata-section-title">Class Records</h2>

          {data.length === 0 ? (
            <p className="clswisedata-empty">No records added</p>
          ) : (
            <div
              className="clswisedata-table-scroll"
              onScroll={handleScroll}
            >
              <table className="clswisedata-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Age</th>
                    <th>Weekly</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={item.preview}
                          alt=""
                          className="clswisedata-table-img"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.age}</td>
                      <td>{item.weekly}</td>
                      <td>{item.timeManagement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleCount < data.length && (
                <p className="clswisedata-loading">Loading more...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClsWiseDataManagements;
