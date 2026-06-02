import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaTimes,
  FaEdit,
  FaFilter,
} from "react-icons/fa";

import "./ItemsMaster.css";

const ItemsMaster = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    shopName: "",
    categoryName: "",
    itemBarcode: "",
    hsnCode: "",
    itemName: "",
    rate: "",
    openQty: "",
    reorderQty: "",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      shopName: "Demo",
      categoryName: "Books",
      itemBarcode: "null",
      hsnCode: "null",
      itemName: "Books English",
      rate: 200,
      openQty: 20,
      reorderQty: 20,
      created: "18/12/2025",
      updated: "18/12/2025",
    },
  ]);

  const [columns, setColumns] = useState({
    sno: true,
    shopName: true,
    categoryName: true,
    itemBarcode: true,
    hsnCode: true,
    itemName: true,
    rate: true,
    openQty: true,
    reorderQty: true,
    created: true,
    updated: true,
    action: true,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setIsEdit(false);
    setFormData({
      shopName: "",
      categoryName: "",
      itemBarcode: "",
      hsnCode: "",
      itemName: "",
      rate: "",
      openQty: "",
      reorderQty: "",
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    const currentDate = new Date().toLocaleDateString("en-GB");
    if (isEdit) {
      setItems(
        items.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...formData,
                updated: currentDate,
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          id: Date.now(),
          ...formData,
          created: currentDate,
          updated: currentDate,
        },
      ]);
    }
    setShowModal(false);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="itemsMasterPage">
      {/* Header Container */}
      <div className="itemsMasterHeader">
        <div className="itemsMasterSearchBox">
          <FaSearch className="searchIcon" />
          <input
            type="text"
            placeholder="Search item designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="actionButtonGroup" ref={dropdownRef}>
          <button
            className={`itemsMasterFilterBtn ${showFilter ? "active" : ""}`}
            onClick={() => setShowFilter(!showFilter)}
            title="Configure View Columns"
          >
            <FaFilter />
            <span className="btnText">Columns</span>
          </button>

          {/* Floating Dropdown */}
          {showFilter && (
            <div className="itemsMasterFilterDropdown">
              <div className="dropdownHeader">Toggle View Columns</div>
              <div className="dropdownGrid">
                {Object.keys(columns).map((key) => (
                  <label key={key} className="dropdownItem">
                    <input
                      type="checkbox"
                      checked={columns[key]}
                      onChange={() =>
                        setColumns({
                          ...columns,
                          [key]: !columns[key],
                        })
                      }
                    />
                    <span>{key.replace(/([A-Z])/g, " $1")}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            className="itemsMasterAddBtn"
            onClick={openAddModal}
            title="Add Master Record"
          >
            <FaPlus />
            <span className="btnText">New Item</span>
          </button>
        </div>
      </div>

      {/* Table Workspace Frame */}
      <div className="itemsMasterTableWrapper">
        <table className="itemsMasterTable">
          <thead>
            <tr>
              {columns.sno && <th style={{ width: "60px" }}>S.No</th>}
              {columns.shopName && <th>Shop Name</th>}
              {columns.categoryName && <th>Category Name</th>}
              {columns.itemBarcode && <th>Item Barcode</th>}
              {columns.hsnCode && <th>H.S.N Code</th>}
              {columns.itemName && <th>Item Name</th>}
              {columns.rate && <th>Rate</th>}
              {columns.openQty && <th>Open Qty</th>}
              {columns.reorderQty && <th>ReOrder Qty</th>}
              {columns.created && <th>Created</th>}
              {columns.updated && <th>Updated</th>}
              {columns.action && <th className="textCenter">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <tr key={item.id}>
                  {columns.sno && <td className="snoCell">{index + 1}</td>}
                  {columns.shopName && <td>{item.shopName}</td>}
                  {columns.categoryName && (
                    <td>
                      <span className="badgeCategory">{item.categoryName}</span>
                    </td>
                  )}
                  {columns.itemBarcode && (
                    <td className="codeMono">{item.itemBarcode || "—"}</td>
                  )}
                  {columns.hsnCode && (
                    <td className="codeMono">{item.hsnCode || "—"}</td>
                  )}
                  {columns.itemName && (
                    <td className="fw-semibold textDark">{item.itemName}</td>
                  )}
                  {columns.rate && <td className="fw-medium">${item.rate}</td>}
                  {columns.openQty && <td>{item.openQty}</td>}
                  {columns.reorderQty && (
                    <td>
                      <span className="qtyHighlight">{item.reorderQty}</span>
                    </td>
                  )}
                  {columns.created && <td className="textMuted">{item.created}</td>}
                  {columns.updated && <td className="textMuted">{item.updated}</td>}
                  {columns.action && (
                    <td className="itemsMasterActionCell">
                      <button
                        className="itemsMasterEditBtn"
                        onClick={() => handleEdit(item)}
                        title="Edit Record"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="itemsMasterDeleteBtn"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Record"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.values(columns).filter(Boolean).length}
                  className="noDataRow"
                >
                  <div className="emptyStateContainer">
                    <p className="emptyStateTitle">No items matched your search</p>
                    <p className="emptyStateSub">Try adjusting your filters or search phrases.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Premium Form Modal */}
      {showModal && (
        <div className="itemsMasterModalOverlay">
          <div className="itemsMasterModal">
            <div className="itemsMasterModalHeader">
              <div>
                <h3>{isEdit ? "Modify Master Record" : "Create Master Record"}</h3>
                <p className="modalSubtitle">Fill out inventory indicators and pricing values.</p>
              </div>
              <button
                className="itemsMasterCloseBtn"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="itemsMasterFormGrid">
              <div className="inputGroup">
                <label>Shop Name</label>
                <input
                  name="shopName"
                  placeholder="e.g. Retail Central"
                  value={formData.shopName}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup">
                <label>Category Name</label>
                <input
                  name="categoryName"
                  placeholder="e.g. Electronics"
                  value={formData.categoryName}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup">
                <label>Item Barcode</label>
                <input
                  name="itemBarcode"
                  placeholder="Universal Product Code"
                  value={formData.itemBarcode}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup">
                <label>H.S.N Code</label>
                <input
                  name="hsnCode"
                  placeholder="Harmonized System Code"
                  value={formData.hsnCode}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup spanFull">
                <label>Item Name</label>
                <input
                  name="itemName"
                  placeholder="Complete descriptive item designation title"
                  value={formData.itemName}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup">
                <label>Rate ($)</label>
                <input
                  name="rate"
                  type="number"
                  placeholder="0.00"
                  value={formData.rate}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup">
                <label>Opening Quantity</label>
                <input
                  name="openQty"
                  type="number"
                  placeholder="0"
                  value={formData.openQty}
                  onChange={handleChange}
                />
              </div>
              <div className="inputGroup spanFull">
                <label>Reorder Alert Threshold Qty</label>
                <input
                  name="reorderQty"
                  type="number"
                  placeholder="Minimum safe stock quantity"
                  value={formData.reorderQty}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="itemsMasterModalFooter">
              <button
                className="itemsMasterCancelBtn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="itemsMasterSaveBtn" onClick={handleSubmit}>
                {isEdit ? "Save Parameters" : "Publish Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemsMaster;