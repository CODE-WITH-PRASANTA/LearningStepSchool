import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

import "./CalenderPlanning.css";

const CalenderPlanning = () => {
  // --- States ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // Form states
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    type: "Event", // Matches image default choice
    dateFrom: "2026-05-26",
    dateTo: "2026-05-26",
    title: "demo",
    description: "demo",
    isHoliday: false,
  });

  // Main list data state
  const [planningData, setPlanningData] = useState([
    { id: 1, date: "26-05-2026 - 26-05-2026", title: "demo", type: "Planning" },
    { id: 2, date: "22-05-2026 - 22-05-2026", title: "demo", type: "Planning" },
    { id: 3, date: "21-05-2026 - 21-05-2026", title: "demo", type: "Planning" },
    { id: 4, date: "20-05-2026 - 20-05-2026", title: "demo1", type: "Planning" },
    { id: 5, date: "19-05-2026 - 19-05-2026", title: "demo", type: "Planning" },
    { id: 6, date: "14-05-2026 - 14-05-2026", title: "holiday", type: "Planning" },
  ]);

  // --- Helper: Convert DD-MM-YYYY to YYYY-MM-DD for native input ---
  const parseDateRange = (dateStr) => {
    try {
      const parts = dateStr.split(" - ");
      const convert = (d) => {
        const [day, month, year] = d.split("-");
        return `${year}-${month}-${day}`;
      };
      return { from: convert(parts[0]), to: convert(parts[1] || parts[0]) };
    } catch (e) {
      return { from: "2026-05-26", to: "2026-05-26" };
    }
  };

  // --- Helper: Convert YYYY-MM-DD to DD-MM-YYYY ---
  const formatDateStr = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // --- Handlers ---
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      type: "Event",
      dateFrom: "2026-05-26",
      dateTo: "2026-05-26",
      title: "demo",
      description: "demo",
      isHoliday: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    const parsedDates = parseDateRange(item.date);
    setFormData({
      type: item.type,
      dateFrom: parsedDates.from,
      dateTo: parsedDates.to,
      title: item.title,
      description: item.title === "holiday" ? "holiday description" : "demo",
      isHoliday: item.title === "holiday",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setPlanningData(planningData.filter((item) => item.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedRange = `${formatDateStr(formData.dateFrom)} - ${formatDateStr(formData.dateTo)}`;

    if (isEditing) {
      setPlanningData((prev) =>
        prev.map((item) =>
          item.id === currentId
            ? { ...item, type: formData.type, date: formattedRange, title: formData.title }
            : item
        )
      );
    } else {
      const newId = planningData.length > 0 ? Math.max(...planningData.map((o) => o.id)) + 1 : 1;
      const newItem = {
        id: newId,
        date: formattedRange,
        title: formData.title,
        type: formData.type,
      };
      setPlanningData((prev) => [newItem, ...prev]);
    }
    setShowModal(false);
  };

  // --- Filter and Pagination Logic ---
  const filteredData = planningData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.date.includes(searchQuery)
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const displayStart = totalItems === 0 ? 0 : startIndex + 1;
  const displayEnd = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="cp-container">
      {/* Header */}
      <div className="cp-header">
        <div className="cp-search-box">
          <FaSearch className="cp-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="cp-search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button className="cp-add-btn" onClick={handleOpenAdd}>
          <FaPlus />
        </button>
      </div>

      {/* Table */}
      <div className="cp-table-wrapper">
        <table className="cp-table">
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>DATE</th>
              <th>TITLE</th>
              <th>TYPE</th>
              <th style={{ textAlign: "center" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{item.date}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>
                    <div className="cp-action-container">
                      <button className="cp-edit-btn" onClick={() => handleOpenEdit(item)}>
                        <FaEdit />
                      </button>
                      <button className="cp-delete-btn" onClick={() => handleDelete(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "30px" }}>
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Section */}
        <div className="cp-pagination">
          <span>Items per page :</span>
          <select
            className="cp-page-select"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span>
            {displayStart} - {displayEnd} of {totalItems}
          </span>

          <div className="cp-nav-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              &lt;
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <div className="cp-modal-header">
              <h2>ADD CALENDAR</h2>
              <button className="cp-close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* Type Selection section styled with Radio buttons matching image */}
              <div className="cp-type-wrapper">
                <label className="cp-radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="Planning"
                    checked={formData.type === "Planning"}
                    onChange={handleInputChange}
                  />
                  <span className="cp-custom-radio"></span>
                  Planning
                </label>

                <label className="cp-radio-label">
                  <input
                    type="radio"
                    name="type"
                    value="Event"
                    checked={formData.type === "Event"}
                    onChange={handleInputChange}
                  />
                  <span className="cp-custom-radio"></span>
                  Event
                </label>
              </div>

              {/* Input Group Layout with Outline fieldsets matching screenshot */}
              <div className="cp-form-row">
                <div className="cp-fieldset">
                  <label className="cp-field-label">Select Date :</label>
                  <div className="cp-input-inner-wrap">
                    <input
                      type="date"
                      name="dateFrom"
                      className="cp-clean-input"
                      value={formData.dateFrom}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="cp-date-sep">—</span>
                    <input
                      type="date"
                      name="dateTo"
                      className="cp-clean-input"
                      value={formData.dateTo}
                      onChange={handleInputChange}
                      required
                    />
                    <FaCalendarAlt className="cp-date-icon" />
                  </div>
                  <span className="cp-sub-hint">MM/DD/YYYY – MM/DD/YYYY</span>
                </div>

                <div className="cp-fieldset">
                  <label className="cp-field-label">Title*</label>
                  <input
                    type="text"
                    name="title"
                    className="cp-clean-input text-field"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="cp-form-row-full">
                <div className="cp-fieldset">
                  <label className="cp-field-label">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="cp-clean-textarea"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="cp-holiday-section">
                <label>Holiday :</label>
                <label className="cp-switch">
                  <input
                    type="checkbox"
                    name="isHoliday"
                    checked={formData.isHoliday}
                    onChange={handleInputChange}
                  />
                  <span className="cp-slider"></span>
                </label>
              </div>

              <div className="cp-modal-footer">
                <button
                  type="button"
                  className="cp-cancel-text-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cp-modify-btn">
                  {isEditing ? "Modify" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalenderPlanning;