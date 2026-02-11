import React, { useState } from "react";

export default function NewsSection() {
  const [newsTitle, setNewsTitle] = useState("");
  const [newsList, setNewsList] = useState([]);
  const [editId, setEditId] = useState(null);

  const submitNews = () => {
    if (!newsTitle) return;

    if (editId) {
      setNewsList(
        newsList.map((item) =>
          item.id === editId ? { ...item, title: newsTitle } : item
        )
      );
      setEditId(null);
    } else {
      setNewsList([
        ...newsList,
        { id: Date.now(), title: newsTitle },
      ]);
    }

    setNewsTitle("");
  };

  const editNews = (item) => {
    setEditId(item.id);
    setNewsTitle(item.title);
  };

  const deleteNews = (id) => {
    setNewsList(newsList.filter((n) => n.id !== id));
  };

  return (
    <section className="news-admin-section">

      <h2 className="admin-section-heading">News Management</h2>

      <div className="admin-split-layout">

        {/* FORM */}
        <div className="admin-form-panel">

          <h3 className="admin-panel-title">
            {editId ? "Update News" : "Post News"}
          </h3>

          <input
            className="admin-input-field"
            placeholder="Enter News Title"
            value={newsTitle}
            onChange={(e) => setNewsTitle(e.target.value)}
          />

          <button className="admin-submit-btn" onClick={submitNews}>
            {editId ? "Update News" : "Publish News"}
          </button>

        </div>

        {/* LIST */}
        <div className="admin-list-panel">

          <h3 className="admin-panel-title">News List</h3>

          {newsList.length === 0 && (
            <p className="admin-empty-text">No news yet</p>
          )}

          {newsList.map((item) => (
            <div key={item.id} className="admin-list-card">

              <h4>{item.title}</h4>

              <div className="admin-action-row">
                <button
                  className="admin-update-btn"
                  onClick={() => editNews(item)}
                >
                  Edit
                </button>

                <button
                  className="admin-delete-btn"
                  onClick={() => deleteNews(item.id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
