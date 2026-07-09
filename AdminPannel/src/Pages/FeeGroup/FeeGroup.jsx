import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaTrash,
  FaTimes,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaEdit,
} from "react-icons/fa";
import API from "../../api/axios";

import "./FeeGroup.css";

const FeeGroup = () => {
  // Pure local state for mock dataset management
 const [feeGroups, setFeeGroups] = useState([]);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [newFeeGroup, setNewFeeGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");

  const rowsPerPage = 7;


  const fetchFeeGroups = async () => {
  try {
    const res = await API.get("/fee-group/all");

    console.log(res.data);

    setFeeGroups(res.data.data);
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchFeeGroups();
}, []);
  // Search filter
  const filteredData = feeGroups.filter((item) =>
    item?.headGroup
      ?.toLowerCase()
      .trim()
      .includes(search.toLowerCase().trim())
  );

  // Pagination processing
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Add function - Client Side Only
 const addFeeGroup = async () => {
  if (!newFeeGroup.trim()) return;

  try {
    await API.post("/fee-group/create", {
      headGroup: newFeeGroup,
      priority: feeGroups.length + 1,
    });

    fetchFeeGroups();

    Swal.fire({
      icon: "success",
      title: "Fee Group Added",
      timer: 1500,
      showConfirmButton: false,
    });

    setNewFeeGroup("");
    setShowAddModal(false);
  } catch (error) {
    console.log(error);
  }
};

  // Delete function - Client Side Only
 const deleteFeeGroup = async (id) => {
  const result = await Swal.fire({
    title: "Delete Fee Group?",
    text: "This operation is structural and cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f43f5e",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it",
    background: "#ffffff",
  });

  if (!result.isConfirmed) return;

  try {
    await API.delete(`/fee-group/delete/${id}`);

    // Reload latest data
    fetchFeeGroups();

    Swal.fire({
      icon: "success",
      title: "Deleted Successfully",
      background: "#ffffff",
      confirmButtonColor: "#4f46e5",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log(error);

    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: error.response?.data?.message || "Something went wrong",
    });
  }
};

  // Open Edit Modal
  const openEditModal = (item) => {
    setSelectedFee({ ...item });
    setShowEditModal(true);
  };

  // Update function - Client Side Only
  const updateFeeGroup = async () => {
  try {
    await API.put(
      `/fee-group/update/${selectedFee._id}`,
      {
        headGroup: selectedFee.headGroup,
        priority: selectedFee.priority,
      }
    );

    fetchFeeGroups();

    Swal.fire({
      icon: "success",
      title: "Updated Successfully",
      timer: 1500,
      showConfirmButton: false,
    });

    setShowEditModal(false);
  } catch (error) {
    console.log(error);
  }
};

  // Premium Toggle Sorting (Alphabetical A-Z <-> Z-A handler)
  const sortByHeadGroup = () => {
    const nextOrder = sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...feeGroups].sort((a, b) => {
      if (nextOrder === "asc") {
        return a.headGroup.localeCompare(b.headGroup);
      } else {
        return b.headGroup.localeCompare(a.headGroup);
      }
    });
    setFeeGroups(sorted);
    setSortOrder(nextOrder);
  };

  return (
    <div className="fg-container">
      <div className="fg-card">
        {/* Premium Top Bar */}
        <div className="fg-top-bar">
          <div className="fg-search-box-wrapper">
            <FaSearch className="fg-search-inline-icon" />
            <input
              type="text"
              className="fg-search-input"
              placeholder="Search master fee groups..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button className="fg-btn-add" onClick={() => setShowAddModal(true)}>
            <FaPlus className="fg-add-icon" /> <span>Add Group</span>
          </button>
        </div>

        {/* Premium Table Content */}
        <div className="fg-table-wrapper">
          <table className="fg-table">
            <thead>
              <tr>
                <th style={{ width: "110px" }}>S.No.</th>
                <th
                  onClick={sortByHeadGroup}
                  className="fg-sortable-th"
                  title="Click to sort alphabetically"
                >
                  <div className="fg-th-content">
                    <span>HEAD GROUP</span>
                    <span className="fg-sort-wrapper">
                      {sortOrder === "asc" ? (
                        <FaSortUp className="fg-sort-icon active" />
                      ) : (
                        <FaSortDown className="fg-sort-icon active shift-down" />
                      )}
                    </span>
                  </div>
                </th>
                <th style={{ width: "200px" }}>PRIORITY STATE</th>
                <th style={{ width: "150px", textAlign: "center" }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((item, index) => (
                  <tr
                    key={item._id}
                    className="fg-row-interactive"
                    onClick={() => openEditModal(item)}
                  >
                    <td>
                      <span className="fg-serial-badge">
                        {indexOfFirst + index + 1}
                      </span>
                    </td>
                    <td className="fg-text-bold">
                      <div className="fg-name-cell-wrapper">
                        <span className="fg-indicator-dot"></span>
                        {item.headGroup}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`fg-badge-priority ${
                          item.priority <= 4
                            ? "prio-high"
                            : item.priority <= 8
                            ? "prio-med"
                            : "prio-low"
                        }`}
                      >
                        Priority {item.priority}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="fg-action-btn-group">
                        <button
                          className="fg-action-icon-btn edit-btn"
                          onClick={() => openEditModal(item)}
                          title="Modify Record"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="fg-action-icon-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFeeGroup(item._id);
                          }}
                          title="Remove Record"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="fg-table-empty">
                    <div className="fg-empty-state-view">
                      <div className="fg-empty-illustration">∅</div>
                      <p>No matching master record datasets discovered</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination Footer */}
        <div className="fg-pagination">
          <span className="fg-pagination-info">
            Showing{" "}
            <span className="fg-highlight-text">
              {filteredData.length > 0 ? indexOfFirst + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="fg-highlight-text">
              {Math.min(indexOfLast, filteredData.length)}
            </span>{" "}
            of <span className="fg-highlight-text">{filteredData.length}</span>{" "}
            Entries
          </span>

          <div className="fg-pagination-btns">
            <button
              className="fg-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ❮ Previous
            </button>
            <button
              className="fg-page-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next ❯
            </button>
          </div>
        </div>
      </div>

      {/* ADD MODAL CONTAINER */}
      {showAddModal && (
        <div
          className="fg-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div className="fg-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="fg-modal-header">
              <h2>Add Fee Group</h2>
              <button
                className="fg-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="fg-modal-body">
              <div className="fg-form-group">
                <label>
                  Fee Group Name <span className="fg-required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tuition Fee"
                  value={newFeeGroup}
                  onChange={(e) => setNewFeeGroup(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="fg-modal-footer">
              <button
                className="fg-btn-cancel"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button className="fg-btn-save" onClick={addFeeGroup}>
                Add Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / MODIFY MODAL CONTAINER */}
      {showEditModal && selectedFee && (
        <div
          className="fg-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div className="fg-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="fg-modal-header">
              <h2>Add Fee Group</h2>
              <button
                className="fg-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="fg-modal-body">
              <div className="fg-form-group">
                <label>Fee Group Name *</label>
                <input
                  type="text"
                  value={selectedFee.headGroup}
                  onChange={(e) =>
                    setSelectedFee({
                      ...selectedFee,
                      headGroup: e.target.value,
                    })
                  }
                />
              </div>

              <div className="fg-form-group">
                <label>Priority No.*</label>
                <input
                  type="number"
                  value={selectedFee.priority}
                  onChange={(e) =>
                    setSelectedFee({
                      ...selectedFee,
                      priority: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="fg-modal-footer">
              <button
                className="fg-btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="fg-btn-save action-modify"
                onClick={updateFeeGroup}
              >
                Modify Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeGroup;