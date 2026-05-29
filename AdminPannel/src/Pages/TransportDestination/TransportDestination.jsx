// TransportDestination.jsx

import React, {
  useMemo,
  useState,
} from "react";

import {
  FaSearch,
  FaPlus,
  FaTimes,
  FaTrash,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
} from "react-icons/fa";

import "./TransportDestination.css";

const TransportDestination = () => {

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [showFilter, setShowFilter] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  const [isEdit, setIsEdit] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [visibleColumns, setVisibleColumns] =
    useState({
      sno: true,
      destination: true,
      distance: true,
      fare: true,
      action: true,
    });

  const emptyForm = {
    destination: "",
    distance: "",
    fare: "",
  };

  const [formData, setFormData] =
    useState(emptyForm);

  const [destinations, setDestinations] =
    useState([
      {
        id: 1,
        destination: "123",
        distance: "0",
        fare: "1534",
      },

      {
        id: 2,
        destination: "Abusaidpur",
        distance: "400",
        fare: "400",
      },

      {
        id: 3,
        destination: "Agra",
        distance: "0",
        fare: "300",
      },

      {
        id: 4,
        destination: "Ajarg",
        distance: "0",
        fare: "500",
      },

      {
        id: 5,
        destination: "Ajmer",
        distance: "0",
        fare: "1000",
      },

      {
        id: 6,
        destination: "Alafganj",
        distance: "400",
        fare: "400",
      },
    ]);

  /* SEARCH */

  const filteredDestinations =
    useMemo(() => {

      return destinations.filter(
        (item) =>
          item.destination
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [destinations, search]);

  /* PAGINATION */

  const totalPages =
    Math.ceil(
      filteredDestinations.length /
        rowsPerPage
    );

  const paginatedDestinations =
    filteredDestinations.slice(
      (currentPage - 1) *
        rowsPerPage,
      currentPage *
        rowsPerPage
    );

  /* INPUT */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  /* ADD */

  const handleAddDestination =
    () => {

      if (
        !formData.destination ||
        !formData.distance ||
        !formData.fare
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      const newDestination = {
        id: Date.now(),
        ...formData,
      };

      setDestinations([
        newDestination,
        ...destinations,
      ]);

      setFormData(emptyForm);

      setShowModal(false);
    };

  /* EDIT */

  const handleEdit = (
    item
  ) => {

    setFormData(item);

    setEditId(item.id);

    setIsEdit(true);

    setShowModal(true);
  };

  /* UPDATE */

  const handleUpdate =
    () => {

      const updated =
        destinations.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...formData,
              }
            : item
        );

      setDestinations(updated);

      setShowModal(false);

      setIsEdit(false);

      setEditId(null);

      setFormData(emptyForm);
    };

  /* DELETE */

  const handleDelete = (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Are you sure want to delete?"
      );

    if (!confirmDelete)
      return;

    const updated =
      destinations.filter(
        (item) =>
          item.id !== id
      );

    setDestinations(updated);
  };

  /* FILTER */

  const toggleColumn = (
    column
  ) => {

    setVisibleColumns({
      ...visibleColumns,
      [column]:
        !visibleColumns[column],
    });

  };

  return (

    <div className="transport-destination-page">

      <div className="transport-destination-container">

        <div className="transport-destination-card">

          {/* TOPBAR */}

          <div className="transport-destination-topbar">

            {/* SEARCH */}

            <div className="transport-destination-search-box">

              <FaSearch className="transport-destination-search-icon" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* ACTIONS */}

            <div className="transport-destination-top-actions">

              {/* FILTER */}

              <div className="transport-destination-filter-wrapper">

                <button
                  className="transport-destination-filter-btn"
                  onClick={() =>
                    setShowFilter(
                      !showFilter
                    )
                  }
                >
                  <FaFilter />
                </button>

                {showFilter && (

                  <div className="transport-destination-filter-dropdown">

                    {Object.keys(
                      visibleColumns
                    ).map((key) => (

                      <label key={key}>

                        <input
                          type="checkbox"
                          checked={
                            visibleColumns[
                              key
                            ]
                          }
                          onChange={() =>
                            toggleColumn(
                              key
                            )
                          }
                        />

                        {key}

                      </label>
                    ))}

                  </div>
                )}

              </div>

              {/* ADD */}

              <button
                className="transport-destination-add-btn"
                onClick={() => {

                  setShowModal(true);

                  setIsEdit(false);

                  setFormData(
                    emptyForm
                  );

                }}
              >
                <FaPlus />
              </button>

            </div>

          </div>

          {/* TABLE */}

          <div className="transport-destination-table-wrapper">

            <table className="transport-destination-table">

              <thead>

                <tr>

                  {visibleColumns.sno && (
                    <th>S.NO.</th>
                  )}

                  {visibleColumns.destination && (
                    <th>
                      DESTINATION
                    </th>
                  )}

                  {visibleColumns.distance && (
                    <th>
                      DISTANCE
                    </th>
                  )}

                  {visibleColumns.fare && (
                    <th>
                      FARE
                    </th>
                  )}

                  {visibleColumns.action && (
                    <th>
                      ACTION
                    </th>
                  )}

                </tr>

              </thead>

              <tbody>

                {paginatedDestinations.map(
                  (
                    item,
                    index
                  ) => (

                    <tr key={item.id}>

                      {visibleColumns.sno && (
                        <td>
                          {index + 1}
                        </td>
                      )}

                      {visibleColumns.destination && (
                        <td>

                          <button
                            className="transport-destination-name-btn"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          >
                            {
                              item.destination
                            }
                          </button>

                        </td>
                      )}

                      {visibleColumns.distance && (
                        <td>
                          {
                            item.distance
                          }
                        </td>
                      )}

                      {visibleColumns.fare && (
                        <td>
                          {
                            item.fare
                          }
                        </td>
                      )}

                      {visibleColumns.action && (
                        <td>

                          <div className="transport-destination-action-group">

                            <button
                              className="transport-destination-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                            >
                              <FaEdit />
                              <span>
                                Edit
                              </span>
                            </button>

                            <button
                              className="transport-destination-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                            >
                              <FaTrash />
                              <span>
                                Delete
                              </span>
                            </button>

                          </div>

                        </td>
                      )}

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div className="transport-destination-pagination">

            <div className="transport-destination-pagination-left">

              <span>
                Items per page:
              </span>

              <select
                value={rowsPerPage}
                onChange={(e) => {

                  setRowsPerPage(
                    Number(
                      e.target.value
                    )
                  );

                  setCurrentPage(1);

                }}
              >
                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={50}>
                  50
                </option>

              </select>

            </div>

            <div className="transport-destination-pagination-right">

              <span>
                {currentPage} -
                {totalPages} of{" "}
                {
                  filteredDestinations.length
                }
              </span>

              <button
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                <FaChevronRight />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="transport-destination-modal-overlay">

          <div className="transport-destination-modal">

            {/* HEADER */}

            <div className="transport-destination-modal-header">

              <h2>
                TRANSPORT DESTINATION
              </h2>

              <button
                className="transport-destination-close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}

            <div className="transport-destination-modal-body">

              <div className="transport-destination-form-grid">

                {/* DESTINATION */}

                <div className="transport-destination-input-group transport-destination-input-full">

                  <label>
                    Destination*
                  </label>

                  <input
                    type="text"
                    name="destination"
                    placeholder="Enter destination"
                    value={
                      formData.destination
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* DISTANCE */}

                <div className="transport-destination-input-group">

                  <label>
                    Distance (Km)*
                  </label>

                  <input
                    type="number"
                    name="distance"
                    placeholder="Enter distance"
                    value={
                      formData.distance
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* FARE */}

                <div className="transport-destination-input-group">

                  <label>
                    Fare*
                  </label>

                  <input
                    type="number"
                    name="fare"
                    placeholder="Enter fare"
                    value={
                      formData.fare
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              {/* FOOTER */}

              <div className="transport-destination-modal-footer">

                <button
                  className="transport-destination-cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="transport-destination-submit-btn"
                  onClick={
                    isEdit
                      ? handleUpdate
                      : handleAddDestination
                  }
                >
                  {isEdit
                    ? "Update"
                    : "Add"}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default TransportDestination;