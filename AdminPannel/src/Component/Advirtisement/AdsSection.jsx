import React, { useState } from "react";

export default function AdsSection() {
  const [adTitle, setAdTitle] = useState("");
  const [adList, setAdList] = useState([]);
  const [editId, setEditId] = useState(null);

  const submitAd = () => {
    if (!adTitle) return;

    if (editId) {
      setAdList(
        adList.map((item) =>
          item.id === editId ? { ...item, title: adTitle } : item
        )
      );
      setEditId(null);
    } else {
      setAdList([
        ...adList,
        { id: Date.now(), title: adTitle },
      ]);
    }

    setAdTitle("");
  };

  const editAd = (item) => {
    setEditId(item.id);
    setAdTitle(item.title);
  };

  const deleteAd = (id) => {
    setAdList(adList.filter((a) => a.id !== id));
  };

  return (
    <section className="ads-admin-section">

      <h2 className="admin-section-heading">Advertisement Management</h2>

      <div className="admin-split-layout">

        {/* FORM */}
        <div className="admin-form-panel">

          <h3 className="admin-panel-title">
            {editId ? "Update Advertisement" : "Post Advertisement"}
          </h3>

          <input
            className="admin-input-field"
            placeholder="Enter Advertisement Title"
            value={adTitle}
            onChange={(e) => setAdTitle(e.target.value)}
          />

          <button className="admin-submit-btn" onClick={submitAd}>
            {editId ? "Update Advertisement" : "Publish Advertisement"}
          </button>

        </div>

        {/* LIST */}
        <div className="admin-list-panel">

          <h3 className="admin-panel-title">Advertisement List</h3>

          {adList.length === 0 && (
            <p className="admin-empty-text">No advertisements yet</p>
          )}

          {adList.map((item) => (
            <div key={item.id} className="admin-list-card">

              <h4>{item.title}</h4>

              <div className="admin-action-row">
                <button
                  className="admin-update-btn"
                  onClick={() => editAd(item)}
                >
                  Edit
                </button>

                <button
                  className="admin-delete-btn"
                  onClick={() => deleteAd(item.id)}
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
