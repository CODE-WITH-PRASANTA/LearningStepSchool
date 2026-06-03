import API, { IMAGE_URL } from "../../api/axios";
import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

import "./StudentPopForm.css";

const StudentPopForm = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");

  const [popupData, setPopupData] = useState([]);

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    fromDate: "",
    toDate: "",
    videoUrl: "",
  });
  const resetForm = () => {
    setFormData({
      image: "",
      title: "",
      description: "",
      fromDate: "",
      toDate: "",
      videoUrl: "",
    });

    setEditId(null);
  };
  const [editId, setEditId] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${IMAGE_URL}${imagePath}`;
  };

  const fetchPopups = async () => {
    try {
      const res = await API.get("/popup/all");

      setPopupData(res.data?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const filteredData = popupData.filter(
    (item) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()),
  );
  const handleAdd = async () => {
    try {
      if (
        !formData.image ||
        !formData.title ||
        !formData.fromDate ||
        !formData.toDate
      ) {
        return alert("Please fill all required fields");
      }

      if (!(formData.image instanceof File)) {
        return alert("Please select an image");
      }
      if (new Date(formData.fromDate) > new Date(formData.toDate)) {
        return alert("From Date cannot be greater than To Date");
      }

      const form = new FormData();

      form.append("image", formData.image);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("fromDate", formData.fromDate);
      form.append("toDate", formData.toDate);
      form.append("videoUrl", formData.videoUrl);

      await API.post("/popup/create", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Popup Added Successfully");

      resetForm();
      setShowAddModal(false);

      fetchPopups();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to create popup");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      fromDate: item.fromDate?.split("T")[0],
      toDate: item.toDate?.split("T")[0],
    });

    setEditId(item._id);

    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      if (!formData.title || !formData.fromDate || !formData.toDate) {
        return alert("Please fill all required fields");
      }
      if (new Date(formData.fromDate) > new Date(formData.toDate)) {
        return alert("From Date cannot be greater than To Date");
      }
      const form = new FormData();

      if (formData.image instanceof File) {
        form.append("image", formData.image);
      }

      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("fromDate", formData.fromDate);
      form.append("toDate", formData.toDate);
      form.append("videoUrl", formData.videoUrl);

      await API.put(`/popup/update/${editId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Popup Updated Successfully");

      resetForm();
      setShowEditModal(false);

      fetchPopups();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to update popup");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this popup?")) {
        return;
      }

      await API.delete(`/popup/delete/${id}`);

      fetchPopups();

      alert("Popup Deleted Successfully");
    } catch (error) {
      console.log(error);
    }
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="spf-add-btn"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
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
              <th>IMAGE</th>
              <th>TITLE</th>
              <th>FROM</th>
              <th>TO</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="spf-table-img"
                    />
                  </td>

                  <td>{item.title}</td>

                  <td>{new Date(item.fromDate).toLocaleDateString()}</td>

                  <td>{new Date(item.toDate).toLocaleDateString()}</td>

                  <td>
                    <span
                      className={
                        new Date(item.toDate) >= new Date()
                          ? "status-active"
                          : "status-expired"
                      }
                    >
                      {new Date(item.toDate) >= new Date()
                        ? "Active"
                        : "Expired"}
                    </span>
                  </td>

                  <td>
                    <div className="spf-action-btns">
                      <button
                        className="spf-edit-btn"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="spf-delete-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No Popup Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}

      {showAddModal && (
        <div className="spf-modal-overlay">
          <div className="spf-modal">
            <div className="spf-modal-header">
              <h2>Add Popup</h2>

              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="spf-modal-body">
              {/* IMAGE SECTION */}
              <div className="spf-left">
                <div className="spf-preview">
                  {formData.image ? (
                    <img
                      src={
                        typeof formData.image === "string"
                          ? getImageUrl(formData.image)
                          : URL.createObjectURL(formData.image)
                      }
                      alt="Preview"
                    />
                  ) : (
                    <div className="spf-placeholder">Image Preview</div>
                  )}
                </div>

                <label className="spf-browse">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImage}
                  />
                </label>
              </div>

              {/* FORM SECTION */}
              <div className="spf-right">
                <div className="spf-input">
                  <label>From Date *</label>

                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <label>To Date *</label>

                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <label>Title *</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Enter Popup Title"
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <label>Video URL</label>

                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    placeholder="https://youtube.com/..."
                    onChange={handleInput}
                  />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="spf-description">
              <label>Description</label>

              <textarea
                placeholder="Enter popup description..."
                name="description"
                value={formData.description}
                onChange={handleInput}
                rows={4}
              />
            </div>

            {/* FOOTER */}
            <div className="spf-footer">
              <button
                className="spf-cancel"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
              >
                Cancel
              </button>

              <button className="spf-save" onClick={handleAdd}>
                Save Popup
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
              <h2>Update Popup</h2>

              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="spf-modal-body">
              {/* IMAGE SECTION */}
              <div className="spf-left">
                <div className="spf-preview">
                  {formData.image ? (
                    <img
                      src={
                        typeof formData.image === "string"
                          ? getImageUrl(formData.image)
                          : URL.createObjectURL(formData.image)
                      }
                      alt="Popup"
                    />
                  ) : (
                    <div className="spf-placeholder">Image Preview</div>
                  )}
                </div>

                <label className="spf-browse">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImage}
                  />
                </label>
              </div>

              {/* FORM SECTION */}
              <div className="spf-right">
                <div className="spf-input">
                  <label>From Date *</label>

                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <label>To Date *</label>

                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <label>Title *</label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    placeholder="Enter Popup Title"
                    onChange={handleInput}
                  />
                </div>

                <div className="spf-input">
                  <label>Video URL</label>

                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    placeholder="https://youtube.com/..."
                    onChange={handleInput}
                  />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="spf-description">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                placeholder="Enter popup description..."
                onChange={handleInput}
                rows={4}
              />
            </div>

            {/* FOOTER */}
            <div className="spf-footer">
              <button
                className="spf-cancel"
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
              >
                Cancel
              </button>

              <button className="spf-save" onClick={handleUpdate}>
                Update Popup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPopForm;
