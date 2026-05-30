// TransportVehicle.jsx

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

import { MdOutlineDateRange } from "react-icons/md";

import "./TransportVehicle.css";

const TransportVehicle = () => {
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isEdit, setIsEdit] = useState(false);

  const [editId, setEditId] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    sno: true,
    type: true,
    vehicleNo: true,
    driver: true,
    capacity: true,
    action: true,
  });

  const emptyForm = {
    vehicleType: "",
    vehicleNo: "",
    driver: "",
    capacity: "",
    pucDate: "",
    regDate: "",
    fitnessDate: "",
    insuranceDate: "",
    permitDate: "",
    trackNo: "",
    trackApi: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  /* SEARCH */

  const fetchVehicles = async () => {
    setLoading(true);

    try {
      const res = await API.get(`/vehicle?search=${search}`);

      setVehicles(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(
      (item) =>
        item.vehicleType?.toLowerCase().includes(search.toLowerCase()) ||
        item.vehicleNo?.toLowerCase().includes(search.toLowerCase()) ||
        item.driver?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [vehicles, search]);

  /* PAGINATION */

  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);

  const paginatedVehicles = filteredVehicles.slice(
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

  const handleAddVehicle = async () => {
    try {
      if (
        !formData.vehicleType ||
        !formData.vehicleNo ||
        !formData.driver ||
        !formData.capacity
      ) {
        alert("Please fill all required fields");
        return;
      }

      await API.post("/vehicle/create", formData);

      await fetchVehicles();

      resetModal();
    } catch (error) {
      console.log(error);
    }
  };

  /* EDIT */

  const handleEdit = (item) => {
    setFormData(item);

    setEditId(item._id);

    setIsEdit(true);

    setShowModal(true);
  };

  /* UPDATE */

  const handleUpdateVehicle = async () => {
    try {
      await API.put(`/vehicle/${editId}`, formData);

      await fetchVehicles();

      resetModal();
    } catch (error) {
      console.log(error);
    }
  };

  /* DELETE */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vehicle?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/vehicle/${id}`);

      fetchVehicles();
    } catch (error) {
      console.log(error);
    }
  };

  /* RESET */

  const resetModal = () => {
    setShowModal(false);

    setIsEdit(false);

    setEditId(null);

    setFormData(emptyForm);
  };

  /* FILTER */

  const toggleColumn = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    });
  };

  const dateFields = [
    {
      label: "PUC Date",
      name: "pucDate",
    },

    {
      label: "Registration Date",
      name: "regDate",
    },

    {
      label: "Fitness Date",
      name: "fitnessDate",
    },

    {
      label: "Insurance Date",
      name: "insuranceDate",
    },

    {
      label: "Permit Date",
      name: "permitDate",
    },
  ];

  return (
    <div className="transport-vehicle-page">
      <div className="transport-vehicle-container">
        <div className="transport-vehicle-card">
          {/* TOPBAR */}

          <div className="transport-vehicle-topbar">
            {/* SEARCH */}

            <div className="transport-vehicle-search-box">
              <FaSearch className="transport-vehicle-search-icon" />

              <input
                type="text"
                placeholder="Search vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ACTIONS */}

            <div className="transport-vehicle-top-actions">
              {/* FILTER */}

              <div className="transport-vehicle-filter-wrapper">
                <button
                  className="transport-vehicle-filter-btn"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  <FaFilter />
                </button>

                {showFilter && (
                  <div className="transport-vehicle-filter-dropdown">
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
                className="transport-vehicle-add-btn"
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
          {loading && <h3>Loading Vehicles...</h3>}
          <div className="transport-vehicle-table-wrapper">
            <table className="transport-vehicle-table">
              <thead>
                <tr>
                  {visibleColumns.sno && <th>S.NO.</th>}

                  {visibleColumns.type && <th>VEHICLE TYPE</th>}

                  {visibleColumns.vehicleNo && <th>VEHICLE NO.</th>}

                  {visibleColumns.driver && <th>DRIVER</th>}

                  {visibleColumns.capacity && <th>CAPACITY</th>}

                  {visibleColumns.action && <th>ACTION</th>}
                </tr>
              </thead>

              <tbody>
                {paginatedVehicles.length > 0 ? (
                  paginatedVehicles.map((item, index) => (
                    <tr key={item._id}>
                      {visibleColumns.sno && (
                        <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      )}

                      {visibleColumns.type && (
                        <td>
                          <button
                            className="transport-vehicle-edit-link"
                            onClick={() => handleEdit(item)}
                          >
                            {item.vehicleType}
                          </button>
                        </td>
                      )}

                      {visibleColumns.vehicleNo && <td>{item.vehicleNo}</td>}

                      {visibleColumns.driver && <td>{item.driver}</td>}

                      {visibleColumns.capacity && <td>{item.capacity}</td>}

                      {visibleColumns.action && (
                        <td>
                          <div className="transport-vehicle-action-group">
                            <button
                              className="transport-vehicle-edit-btn"
                              onClick={() => handleEdit(item)}
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="transport-vehicle-delete-btn"
                              onClick={() => handleDelete(item._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="transport-no-data">
                      No Vehicle Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="transport-vehicle-pagination">
            <div className="transport-vehicle-pagination-left">
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

                <option value={15}>15</option>
              </select>
            </div>

            <div className="transport-vehicle-pagination-right">
              <span>
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <FaChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
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
        <div className="transport-vehicle-modal-overlay">
          <div className="transport-vehicle-modal small-modal">
            {/* HEADER */}

            <div className="transport-vehicle-modal-header">
              <div className="transport-vehicle-heading-box">
                <h2>{isEdit ? "Update Vehicle" : "Add Vehicle"}</h2>

                <p>Manage vehicle information</p>
              </div>

              <button
                className="transport-vehicle-close-btn"
                onClick={resetModal}
              >
                <FaTimes />
              </button>
            </div>

            {/* BODY */}

            <div className="transport-vehicle-modal-body">
              <div className="transport-vehicle-form-grid compact-grid">
                <div className="transport-input-group">
                  <label>Vehicle Type</label>

                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="">Select Vehicle</option>

                    <option value="Van">Van</option>

                    <option value="Bus">Bus</option>

                    <option value="Mini Bus">Mini Bus</option>
                  </select>
                </div>

                <div className="transport-input-group">
                  <label>Vehicle No.</label>

                  <input
                    type="text"
                    name="vehicleNo"
                    placeholder="Enter vehicle no."
                    value={formData.vehicleNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="transport-input-group">
                  <label>Driver Name</label>

                  <input
                    type="text"
                    name="driver"
                    placeholder="Enter driver name"
                    value={formData.driver}
                    onChange={handleChange}
                  />
                </div>

                <div className="transport-input-group">
                  <label>Capacity</label>

                  <input
                    type="number"
                    name="capacity"
                    placeholder="Enter capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </div>

                {dateFields.map((field) => (
                  <div key={field.name} className="transport-input-group">
                    <label>{field.label}</label>

                    <div className="transport-vehicle-date-field">
                      <input
                        type="date"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                      />

                      <MdOutlineDateRange />
                    </div>
                  </div>
                ))}

                <div className="transport-input-group">
                  <label>Track No.</label>

                  <input
                    type="text"
                    name="trackNo"
                    placeholder="Enter track no."
                    value={formData.trackNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="transport-input-group">
                  <label>Track API</label>

                  <input
                    type="text"
                    name="trackApi"
                    placeholder="Enter track api"
                    value={formData.trackApi}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* FOOTER */}

              <div className="transport-vehicle-modal-footer">
                <button
                  className="transport-vehicle-cancel-btn"
                  onClick={resetModal}
                >
                  Cancel
                </button>

                <button
                  className="transport-vehicle-submit-btn"
                  onClick={isEdit ? handleUpdateVehicle : handleAddVehicle}
                >
                  {isEdit ? "Update Vehicle" : "Add Vehicle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportVehicle;
