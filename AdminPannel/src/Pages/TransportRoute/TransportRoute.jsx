// TransportRoute.jsx

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

import "./TransportRoute.css";

const TransportRoute = () => {

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
      routeName: true,
      action: true,
    });

  const emptyForm = {
    routeName: "",
  };

  const [formData, setFormData] =
    useState(emptyForm);

  const [routes, setRoutes] =
    useState([
      {
        id: 1,
        routeName:
          "Mohd Nagar",
      },

      {
        id: 2,
        routeName:
          "Ravana",
      },

      {
        id: 3,
        routeName:
          "Abusaidpur",
      },

      {
        id: 4,
        routeName:
          "Chaukoni",
      },

      {
        id: 5,
        routeName:
          "Patti Fazilabad",
      },

      {
        id: 6,
        routeName:
          "Sarai Imam",
      },

      {
        id: 7,
        routeName:
          "Alafqani",
      },
    ]);

  /* SEARCH */

  const filteredRoutes =
    useMemo(() => {

      return routes.filter(
        (item) =>
          item.routeName
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [routes, search]);

  /* PAGINATION */

  const totalPages =
    Math.ceil(
      filteredRoutes.length /
        rowsPerPage
    );

  const paginatedRoutes =
    filteredRoutes.slice(
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

  const handleAddRoute = () => {

    if (
      !formData.routeName
    ) {
      alert(
        "Please enter route name"
      );
      return;
    }

    const newRoute = {
      id: Date.now(),
      routeName:
        formData.routeName,
    };

    setRoutes([
      newRoute,
      ...routes,
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

  const handleUpdateRoute =
    () => {

      const updated =
        routes.map((item) =>
          item.id === editId
            ? {
                ...item,
                ...formData,
              }
            : item
        );

      setRoutes(updated);

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
      routes.filter(
        (item) =>
          item.id !== id
      );

    setRoutes(updated);
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

    <div className="transport-route-page">

      <div className="transport-route-container">

        <div className="transport-route-card">

          {/* TOPBAR */}

          <div className="transport-route-topbar">

            {/* SEARCH */}

            <div className="transport-route-search-box">

              <FaSearch className="transport-route-search-icon" />

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

            <div className="transport-route-top-actions">

              {/* FILTER */}

              <div className="transport-route-filter-wrapper">

                <button
                  className="transport-route-filter-btn"
                  onClick={() =>
                    setShowFilter(
                      !showFilter
                    )
                  }
                >
                  <FaFilter />
                </button>

                {showFilter && (

                  <div className="transport-route-filter-dropdown">

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          visibleColumns.sno
                        }
                        onChange={() =>
                          toggleColumn(
                            "sno"
                          )
                        }
                      />

                      S.No.

                    </label>

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          visibleColumns.routeName
                        }
                        onChange={() =>
                          toggleColumn(
                            "routeName"
                          )
                        }
                      />

                      Route Name

                    </label>

                    <label>

                      <input
                        type="checkbox"
                        checked={
                          visibleColumns.action
                        }
                        onChange={() =>
                          toggleColumn(
                            "action"
                          )
                        }
                      />

                      Action

                    </label>

                  </div>
                )}

              </div>

              {/* ADD */}

              <button
                className="transport-route-add-btn"
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

          <div className="transport-route-table-wrapper">

            <table className="transport-route-table">

              <thead>

                <tr>

                  {visibleColumns.sno && (
                    <th>S.NO.</th>
                  )}

                  {visibleColumns.routeName && (
                    <th>
                      ROUTE NAME
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

                {paginatedRoutes.map(
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

                      {visibleColumns.routeName && (
                        <td>

                          <button
                            className="transport-route-name-btn"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          >
                            {
                              item.routeName
                            }
                          </button>

                        </td>
                      )}

                      {visibleColumns.action && (
                        <td>

                          <div className="transport-route-action-group">

                            <button
                              className="transport-route-edit-btn"
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
                              className="transport-route-delete-btn"
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

          <div className="transport-route-pagination">

            <div className="transport-route-pagination-left">

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

            <div className="transport-route-pagination-right">

              <span>
                {currentPage} -
                {totalPages} of{" "}
                {
                  filteredRoutes.length
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

        <div className="transport-route-modal-overlay">

          <div className="transport-route-modal">

            {/* HEADER */}

            <div className="transport-route-modal-header">

              <h2>
                TRANSPORT ROUTE
              </h2>

              <button
                className="transport-route-close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}

            <div className="transport-route-modal-body">

              <div className="transport-route-input-group">

                <label>
                  Transport Route*
                </label>

                <input
                  type="text"
                  name="routeName"
                  placeholder="Enter route name"
                  value={
                    formData.routeName
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              {/* FOOTER */}

              <div className="transport-route-modal-footer">

                <button
                  className="transport-route-cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="transport-route-submit-btn"
                  onClick={
                    isEdit
                      ? handleUpdateRoute
                      : handleAddRoute
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

export default TransportRoute;