// TransportDestination.jsx

import React, { useMemo, useState, useEffect } from "react";

import API from "../../api/axios";

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
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isEdit, setIsEdit] = useState(false);

  const [editId, setEditId] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    sno: true,
    destination: true,
    distance: true,
    fare: true,
    action: true,
  });

  const emptyForm = {
    routeId: "",
    destination: "",
    distance: "",
    fare: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const [destinations, setDestinations] = useState([]);

  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    try {
      const res = await API.get("/transport-route");

      setRoutes(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await API.get(`/transport-destination?search=${search}`);

      setDestinations(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [search]);

  /* SEARCH */

  const filteredDestinations = useMemo(() => {
    return destinations.filter((item) =>
      item.destination.toLowerCase().includes(search.toLowerCase()),
    );
  }, [destinations, search]);

  /* PAGINATION */

  const totalPages = Math.ceil(filteredDestinations.length / rowsPerPage);

  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  /* INPUT */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ADD */

  const handleAddDestination = async () => {
    try {
      // if (
      //   !formData.routeId ||
      //   !formData.destination ||
      //   !formData.distance ||
      //   !formData.fare
      // ) {
      //   alert("Please fill all fields");
      //   return;
      // }

      await API.post("/transport-destination/create", formData);

      await fetchDestinations();

      setFormData(emptyForm);

      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  /* EDIT */

  const handleEdit = (item) => {
    setFormData({
      routeId: item.routeId?._id || "",
      destination: item.destination || "",
      distance: item.distance || "",
      fare: item.fare || "",
    });

    setEditId(item._id);

    setIsEdit(true);

    setShowModal(true);
  };

  /* UPDATE */

  const handleUpdate = async () => {
    try {
      await API.put(`/transport-destination/${editId}`, formData);

      await fetchDestinations();

      setShowModal(false);

      setIsEdit(false);

      setEditId(null);

      setFormData(emptyForm);
    } catch (error) {
      console.log(error);
    }
  };

  /* DELETE */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure want to delete?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/transport-destination/${id}`);

      fetchDestinations();
    } catch (error) {
      console.log(error);
    }
  };

  /* FILTER */

  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
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
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ACTIONS */}

            <div className="transport-destination-top-actions">
              {/* FILTER */}

              <div className="transport-destination-filter-wrapper">
                <button
                  className="transport-destination-filter-btn"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <FaFilter />
                </button>

                {showFilter && (
                  <div className="transport-destination-filter-dropdown">
                    {Object.keys(visibleColumns).map((key) => (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={visibleColumns[key]}
                          onChange={() => toggleColumn(key)}
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

                  setFormData(emptyForm);
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
                  {visibleColumns.sno && <th>S.NO.</th>}

                  {visibleColumns.destination && <th>DESTINATION</th>}

                  {visibleColumns.distance && <th>DISTANCE</th>}

                  {visibleColumns.fare && <th>FARE</th>}

                  {visibleColumns.action && <th>ACTION</th>}
                </tr>
              </thead>

              <tbody>
                {paginatedDestinations.map((item, index) => (
                  <tr key={item._id}>
                    {visibleColumns.sno && <td>{index + 1}</td>}

                    {visibleColumns.destination && (
                      <td>
                        <button
                          className="transport-destination-name-btn"
                          onClick={() => handleEdit(item)}
                        >
                          {item.destination}
                        </button>
                      </td>
                    )}

                    {visibleColumns.distance && <td>{item.distance}</td>}

                    {visibleColumns.fare && <td>{item.fare}</td>}

                    {visibleColumns.action && (
                      <td>
                        <div className="transport-destination-action-group">
                          <button
                            className="transport-destination-edit-btn"
                            onClick={() => handleEdit(item)}
                          >
                            <FaEdit />
                            <span>Edit</span>
                          </button>

                          <button
                            className="transport-destination-delete-btn"
                            onClick={() => handleDelete(item._id)}
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="transport-destination-pagination">
            <div className="transport-destination-pagination-left">
              <span>Items per page:</span>

              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));

                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>

                <option value={10}>10</option>

                <option value={50}>50</option>
              </select>
            </div>

            <div className="transport-destination-pagination-right">
              <span>
                {currentPage} -{totalPages} of {filteredDestinations.length}
              </span>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
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
              <h2>{isEdit ? "UPDATE DESTINATION" : "TRANSPORT DESTINATION"}</h2>

              <button
                className="transport-destination-close-btn"
                onClick={() => {
                  setShowModal(false);
                  setIsEdit(false);
                  setEditId(null);
                  setFormData(emptyForm);
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="transport-destination-modal-body">
              <div className="transport-destination-form-grid">
                {/* ROUTE */}

                {/* <div className="transport-destination-input-group transport-destination-input-full">
                  <label>Route *</label>

                  <select
                    name="routeId"
                    value={formData.routeId}
                    onChange={handleChange}
                  >
                    <option value="">Select Route</option>

                    {routes.map((route) => (
                      <option key={route._id} value={route._id}>
                        {route.routeName}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* DESTINATION */}

                <div className="transport-destination-input-group transport-destination-input-full">
                  <label>Destination *</label>

                  <select
                    name="routeId"
                    value={formData.routeId}
                    onChange={(e) => {
                      const selectedRoute = routes.find(
                        (r) => r._id === e.target.value,
                      );

                      setFormData({
                        ...formData,
                        routeId: e.target.value,
                        destination: selectedRoute?.routeName || "",
                      });
                    }}
                  >
                    <option value="">Select Destination</option>

                    {routes.map((route) => (
                      <option key={route._id} value={route._id}>
                        {route.routeName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DISTANCE */}

                <div className="transport-destination-input-group">
                  <label>Distance (Km) *</label>

                  <input
                    type="number"
                    name="distance"
                    placeholder="Enter distance"
                    value={formData.distance}
                    onChange={handleChange}
                  />
                </div>

                {/* FARE */}

                <div className="transport-destination-input-group">
                  <label>Fare *</label>

                  <input
                    type="number"
                    name="fare"
                    placeholder="Enter fare"
                    value={formData.fare}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* FOOTER */}

              <div className="transport-destination-modal-footer">
                <button
                  className="transport-destination-cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setIsEdit(false);
                    setEditId(null);
                    setFormData(emptyForm);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="transport-destination-submit-btn"
                  onClick={isEdit ? handleUpdate : handleAddDestination}
                >
                  {isEdit ? "Update" : "Add"}
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
