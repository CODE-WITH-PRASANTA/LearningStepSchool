import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import "./CatagoryMaster.css";

const CategoryMaster = () => {
  // Modal & Dropdown UI visibility states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Master local state data
  const [categoryData, setCategoryData] = useState([
    { id: 1, shopName: "Demo", categoryName: "Books", percentage: "2%" },
    { id: 2, shopName: "Demo", categoryName: "Uniform", percentage: "2%" },
    { id: 3, shopName: "Shop Demo", categoryName: "Stationary", percentage: "12%" },
    { id: 4, shopName: "Demo", categoryName: "Copies", percentage: "2%" },
  ]);

  // Form states for creating/editing records
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ shopName: "", categoryName: "", percentage: "" });

  // Column visibility settings
  const [columns, setColumns] = useState({
    sno: true,
    shopName: true,
    categoryName: true,
    percentage: true,
    action: true,
  });

  // Toggle visible table columns
  const toggleColumn = (column) => {
    setColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Input change handler for both forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open & setup the Add modal
  const openAddModal = () => {
    setFormData({ shopName: "", categoryName: "", percentage: "" });
    setShowAddModal(true);
  };

  // Action: Add record
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.shopName || !formData.categoryName || !formData.percentage) {
      alert("Please fill in all fields marked with *");
      return;
    }

    const newItem = {
      id: Date.now(), // Fallback dynamic standard timestamp ID
      shopName: formData.shopName,
      categoryName: formData.categoryName,
      percentage: formData.percentage.endsWith("%") ? formData.percentage : `${formData.percentage}%`,
    };

    setCategoryData((prev) => [...prev, newItem]);
    setShowAddModal(false);
  };

  // Open & setup the Edit modal with pre-filled row data
  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      shopName: item.shopName,
      categoryName: item.categoryName,
      percentage: item.percentage.replace("%", ""),
    });
    setShowEditModal(true);
  };

  // Action: Modify record
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCategoryData((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              shopName: formData.shopName,
              categoryName: formData.categoryName,
              percentage: formData.percentage.endsWith("%") ? formData.percentage : `${formData.percentage}%`,
            }
          : item
      )
    );
    setShowEditModal(false);
    setSelectedItem(null);
  };

  // Action: Delete record
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategoryData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Derived State: Filters local data dynamically based on the search query
  const filteredData = categoryData.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="cm_container">
      {/* HEADER / TOPBAR */}
      <div className="cm_topbar">
        <div className="cm_search_wrapper">
          <FiSearch className="cm_search_icon" />
          <input
            type="text"
            placeholder="Search..."
            className="cm_search_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="cm_topbar_actions">
          <button
            className={`cm_filter_btn ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FiFilter />
          </button>

          <button className="cm_add_btn" onClick={openAddModal}>
            <FiPlus />
          </button>
        </div>

        {/* Dynamic Column Selector Dropdown */}
        {showFilter && (
          <div className="cm_filter_popup">
            {Object.keys(columns).map((colKey) => (
              <label key={colKey} style={{ textTransform: "capitalize" }}>
                <input
                  type="checkbox"
                  checked={columns[colKey]}
                  onChange={() => toggleColumn(colKey)}
                />
                {colKey === "sno" ? "S.No." : colKey.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <div className="cm_table_wrapper">
        <table className="cm_table">
          <thead>
            <tr>
              {columns.sno && <th>S.NO.</th>}
              {columns.shopName && <th>SHOP NAME</th>}
              {columns.categoryName && <th>CATEGORY NAME</th>}
              {columns.percentage && <th>PERCENTAGE (GST)</th>}
              {columns.action && <th>ACTION</th>}
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id}>
                  {columns.sno && <td>{index + 1}</td>}
                  {columns.shopName && <td>{item.shopName}</td>}
                  {columns.categoryName && <td>{item.categoryName}</td>}
                  {columns.percentage && <td>{item.percentage}</td>}
                  {columns.action && (
                    <td>
                      <div className="cm_action_group">
                        <button
                          className="cm_edit_btn"
                          onClick={() => openEditModal(item)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="cm_delete_btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.values(columns).filter(Boolean).length} style={{ textAlign: "center", padding: "20px" }}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION LAYOUT */}
        <div className="cm_pagination">
          <div className="cm_page_size">
            Items per page:
            <select defaultValue="10">
              <option>50</option>
              <option>25</option>
              <option>10</option>
            </select>
          </div>

          <span>1 - {filteredData.length} of {filteredData.length}</span>

          <div className="cm_page_buttons">
            <button disabled><FiChevronLeft /></button>
            <button disabled><FiChevronRight /></button>
          </div>
        </div>
      </div>

      {/* ADD NEW RECORD MODAL */}
      {showAddModal && (
        <div className="cm_modal_overlay">
          <div className="cm_modal">
            <div className="cm_modal_header">
              <h2>ADD CATEGORY MASTER</h2>
              <button onClick={() => setShowAddModal(false)} className="cm_close_btn">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="cm_form_grid">
                <select
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Shop *</option>
                  <option value="Demo">Demo</option>
                  <option value="Shop Demo">Shop Demo</option>
                </select>

                <input
                  type="text"
                  name="categoryName"
                  placeholder="Category Name *"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="percentage"
                  placeholder="GST (%) *"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="cm_modal_footer">
                <button type="button" className="cm_cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="cm_submit">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RECORD MODAL */}
      {showEditModal && (
        <div className="cm_modal_overlay">
          <div className="cm_modal">
            <div className="cm_modal_header">
              <h2>EDIT CATEGORY MASTER</h2>
              <button onClick={() => setShowEditModal(false)} className="cm_close_btn">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="cm_form_grid">
                <input
                  type="text"
                  name="shopName"
                  placeholder="Shop Name"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="categoryName"
                  placeholder="Category Name"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="text"
                  name="percentage"
                  placeholder="GST (%)"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="cm_modal_footer">
                <button type="button" className="cm_cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="cm_submit">
                  Modify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMaster;