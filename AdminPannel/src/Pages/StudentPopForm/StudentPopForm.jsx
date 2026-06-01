import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

import "./StudentPopForm.css";

const StudentPopForm = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [popupData, setPopupData] = useState([
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      title: "Fee Related",
      description: "Submit fee as soon",
      fromDate: "10-12-2025",
      toDate: "11-12-2025",
      videoUrl: "",
    },
  ]);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    fromDate: "",
    toDate: "",
    videoUrl: "",
  });

  const [editId, setEditId] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleAdd = () => {
    const newData = {
      ...formData,
      id: Date.now(),
    };

    setPopupData([...popupData, newData]);

    setShowAddModal(false);

    setFormData({
      image: "",
      title: "",
      description: "",
      fromDate: "",
      toDate: "",
      videoUrl: "",
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setFormData(item);

    setShowEditModal(true);
  };

  const handleUpdate = () => {
    const updated = popupData.map((item) =>
      item.id === editId ? formData : item
    );

    setPopupData(updated);

    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    setPopupData(
      popupData.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="student-popup-container">

      {/* Header */}
      <div className="spf-header">

        <div className="spf-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button
          className="spf-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus />
        </button>

      </div>

      {/* Table */}

      <div className="spf-table-card">

        <table className="spf-table">
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>POPUP</th>
              <th>FROM</th>
              <th>TO</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {popupData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>
                  <img
                    src={item.image}
                    alt=""
                    className="spf-table-img"
                  />
                </td>

                <td>{item.fromDate}</td>

                <td>{item.toDate}</td>

                <td>
                  <div className="spf-action-btns">

                    <button
                      className="spf-edit-btn"
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="spf-delete-btn"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* ADD MODAL */}

      {showAddModal && (
        <div className="spf-modal-overlay">

          <div className="spf-modal">

            <div className="spf-modal-header">
              <h2>POPUP</h2>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="spf-modal-body">

              <div className="spf-left">

                <div className="spf-preview">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt=""
                    />
                  ) : (
                    <div className="spf-placeholder">
                      Image Preview
                    </div>
                  )}
                </div>

                <label className="spf-browse">
                  Browse
                  <input
                    type="file"
                    hidden
                    onChange={handleImage}
                  />
                </label>

              </div>

              <div className="spf-right">

                <div className="spf-input">
                  <input
                    type="date"
                    name="fromDate"
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <input
                    type="date"
                    name="toDate"
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <input
                    type="text"
                    name="videoUrl"
                    placeholder="Video URL"
                    onChange={handleInput}
                  />
                </div>

              </div>

            </div>

            <div className="spf-description">
              <textarea
                placeholder="Description"
                name="description"
                onChange={handleInput}
              />
            </div>

            <div className="spf-footer">
              <button
                className="spf-cancel"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="spf-save"
                onClick={handleAdd}
              >
                Add
              </button>
            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}

      {showEditModal && (
        <div className="spf-modal-overlay">

          <div className="spf-modal">

            <div className="spf-modal-header">
              <h2>POPUP</h2>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                <FaTimes />
              </button>
            </div>

            <div className="spf-modal-body">

              <div className="spf-left">

                <div className="spf-preview">
                  <img
                    src={formData.image}
                    alt=""
                  />
                </div>

                <label className="spf-browse">
                  Browse
                  <input
                    type="file"
                    hidden
                    onChange={handleImage}
                  />
                </label>

              </div>

              <div className="spf-right">

                <div className="spf-input">
                  <input
                    type="text"
                    value={`${formData.fromDate} - ${formData.toDate}`}
                    readOnly
                  />
                </div>

                <div className="spf-input">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInput}
                  />
                </div>

              </div>

            </div>

            <div className="spf-description">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInput}
              />
            </div>

            <div className="spf-footer">
              <button
                className="spf-cancel"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="spf-save"
                onClick={handleUpdate}
              >
                Modify
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default StudentPopForm;