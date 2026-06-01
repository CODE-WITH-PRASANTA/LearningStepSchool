import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiTrash2,
  FiX,
  FiChevronDown,
  FiEdit2,
} from "react-icons/fi";

import API from "../../api/axios";

import "./TransportVehicleRoute.css";

const TransportVehicleRoute = () => {
  const dropdownRef = useRef(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showFilter, setShowFilter] =
    useState(false);

  const [showDropdown, setShowDropdown] =
    useState(false);

  const [search, setSearch] = useState("");

  const [selectedColumns, setSelectedColumns] =
    useState({
      sno: true,
      type: true,
      number: true,
      capacity: true,
      driver: true,
      routes: true,
      action: true,
    });

  const [vehicleData, setVehicleData] =
    useState([]);

  const [vehicles, setVehicles] =
    useState([]);

  const [routes, setRoutes] =
    useState([]);

  const [selectedVehicle, setSelectedVehicle] =
    useState("");

  const [selectedRoutes, setSelectedRoutes] =
    useState([]);

  const [editIndex, setEditIndex] =
    useState(null);

  const [editId, setEditId] =
    useState(null);

  const fetchVehicleRouteData = async () => {
    try {
      const res = await API.get(
        `/vehicle-route?search=${search}`
      );

      setVehicleData(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [
          vehiclesRes,
          routesRes,
          vehicleRoutesRes,
        ] = await Promise.all([
          API.get("/vehicle"),
          API.get("/transport-route"),
          API.get("/vehicle-route"),
        ]);

        setVehicles(
          vehiclesRes.data.data || []
        );

        setRoutes(
          routesRes.data.data || []
        );

        setVehicleData(
          vehicleRoutesRes.data.data ||
            []
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchVehicleRouteData();
  }, [search]);

  const selectedVehicleData =
    vehicles.find(
      (vehicle) =>
        vehicle._id === selectedVehicle
    );

  const selectedVehicleLabel =
    selectedVehicleData
      ? `${selectedVehicleData.vehicleNo} [${selectedVehicleData.vehicleType}] [${selectedVehicleData.capacity}]`
      : "";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target
        )
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleColumnToggle = (column) => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const handleRouteChange = (routeId) => {
    if (selectedRoutes.includes(routeId)) {
      setSelectedRoutes(
        selectedRoutes.filter(
          (item) => item !== routeId
        )
      );
    } else {
      setSelectedRoutes([
        ...selectedRoutes,
        routeId,
      ]);
    }
  };

  const handleSaveVehicle = async () => {
    if (!selectedVehicle) {
      alert("Please select vehicle");
      return;
    }

    if (selectedRoutes.length === 0) {
      alert("Please select route");
      return;
    }

    try {
      const payload = {
        vehicleId: selectedVehicle,
        routeIds: selectedRoutes,
      };

      if (editId) {
        await API.put(
          `/vehicle-route/${editId}`,
          payload
        );
      } else {
        await API.post(
          "/vehicle-route/create",
          payload
        );
      }

      await fetchVehicleRouteData();

      closeModal();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save vehicle route"
      );
    }
  };

  const handleEdit = (item, index) => {
    setSelectedVehicle(
      item.vehicleId?._id ||
        item.vehicleId ||
        ""
    );

    setSelectedRoutes(
      item.routes
        ?.map(
          (route) =>
            route.routeId?._id ||
            route.routeId
        )
        .filter(Boolean) || []
    );

    setEditIndex(index);

    setEditId(item._id);

    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this vehicle route assignment?"
      );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/vehicle-route/${id}`
      );

      await fetchVehicleRouteData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete vehicle route"
      );
    }
  };

  const closeModal = () => {
    setShowAddModal(false);

    setSelectedVehicle("");

    setSelectedRoutes([]);

    setShowDropdown(false);

    setEditIndex(null);

    setEditId(null);
  };

  const filteredData = useMemo(() => {
    return vehicleData.filter((item) =>
      [
        item.vehicleId?.vehicleType,
        item.vehicleId?.vehicleNo,
        item.vehicleId?.capacity,
        item.vehicleId?.driver,
        ...(item.routes?.map(
          (route) =>
            route.routeId?.routeName
        ) || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, vehicleData]);

  return (
    <div className="transportVehicleRoute">
      {/* HEADER */}

      <div className="transportVehicleRoute-header">
        <div className="transportVehicleRoute-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="transportVehicleRoute-headerRight">
          <button
            className="transportVehicleRoute-filterBtn"
            onClick={() =>
              setShowFilter(!showFilter)
            }
          >
            <FiFilter />
          </button>

          <button
            className="transportVehicleRoute-addBtn"
            onClick={() => {
              closeModal();
              setShowAddModal(true);
            }}
          >
            <FiPlus />
          </button>

          {showFilter && (
            <div className="transportVehicleRoute-filterDropdown">
              {Object.keys(selectedColumns).map(
                (key) => (
                  <label key={key}>
                    <input
                      type="checkbox"
                      checked={
                        selectedColumns[key]
                      }
                      onChange={() =>
                        handleColumnToggle(key)
                      }
                    />

                    {key === "sno"
                      ? "S.No."
                      : key
                          .charAt(0)
                          .toUpperCase() +
                        key.slice(1)}
                  </label>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}

      <div className="transportVehicleRoute-tableWrapper">
        <table className="transportVehicleRoute-table">
          <thead>
            <tr>
              {selectedColumns.sno && (
                <th>S.NO.</th>
              )}

              {selectedColumns.type && (
                <th>TYPE</th>
              )}

              {selectedColumns.number && (
                <th>NUMBER</th>
              )}

              {selectedColumns.capacity && (
                <th>CAPACITY</th>
              )}

              {selectedColumns.driver && (
                <th>DRIVER</th>
              )}

              {selectedColumns.routes && (
                <th>ROUTES</th>
              )}

              {selectedColumns.action && (
                <th className="actionCenter">
                  ACTION
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredData.map(
              (item, index) => (
                <tr key={item._id}>
                  {selectedColumns.sno && (
                    <td>{index + 1}</td>
                  )}

                  {selectedColumns.type && (
                    <td>
                      <span
                        className={`transportVehicleRoute-typeBadge ${
                          item.vehicleId
                            ?.vehicleType ===
                          "Bus"
                            ? "busBadge"
                            : "vanBadge"
                        }`}
                        onClick={() =>
                          handleEdit(item, index)
                        }
                      >
                        {
                          item.vehicleId
                            ?.vehicleType
                        }
                      </span>
                    </td>
                  )}

                  {selectedColumns.number && (
                    <td>
                      {
                        item.vehicleId
                          ?.vehicleNo
                      }
                    </td>
                  )}

                  {selectedColumns.capacity && (
                    <td>
                      {
                        item.vehicleId
                          ?.capacity
                      }
                    </td>
                  )}

                  {selectedColumns.driver && (
                    <td>
                      {
                        item.vehicleId
                          ?.driver
                      }
                    </td>
                  )}

                  {selectedColumns.routes && (
                    <td>
                      <div className="transportVehicleRoute-routeTags">
                        {item.routes?.map(
                          (route, idx) => (
                            <span
                              key={idx}
                              className="transportVehicleRoute-routeTag"
                            >
                              {
                                route.routeId
                                  ?.routeName
                              }
                            </span>
                          )
                        )}
                      </div>
                    </td>
                  )}

                  {selectedColumns.action && (
                    <td>
                      <div className="transportVehicleRoute-actionBtns">
                        <button
                          className="transportVehicleRoute-editBtn"
                          onClick={() =>
                            handleEdit(
                              item,
                              index
                            )
                          }
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="transportVehicleRoute-deleteBtn"
                          onClick={() =>
                            handleDelete(
                              item._id
                            )
                          }
                        >
                          <FiTrash2 />
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

      {/* MODAL */}

      {showAddModal && (
        <div className="transportVehicleRoute-modalOverlay">
          <div className="transportVehicleRoute-modal">
            {/* HEADER */}

            <div className="transportVehicleRoute-modalHeader">
              <h2>
                {editIndex !== null
                  ? "MODIFY VEHICLE"
                  : "ASSIGN VEHICLE"}
              </h2>

              <button onClick={closeModal}>
                <FiX />
              </button>
            </div>

            {/* BODY */}

            <div className="transportVehicleRoute-modalBody">
              <div
                className="transportVehicleRoute-dropdownBox"
                ref={dropdownRef}
              >
                <label>Vehicle *</label>

                <div
                  className={`transportVehicleRoute-dropdownSelected ${
                    showDropdown
                      ? "transportVehicleRoute-dropdownActive"
                      : ""
                  }`}
                  onClick={() =>
                    setShowDropdown(
                      !showDropdown
                    )
                  }
                >
                  <span>
                    {selectedVehicleLabel ||
                      "Select Vehicle"}
                  </span>

                  <FiChevronDown
                    className={`transportVehicleRoute-arrow ${
                      showDropdown
                        ? "transportVehicleRoute-arrowRotate"
                        : ""
                    }`}
                  />
                </div>

                {/* DROPDOWN */}

                {showDropdown && (
                  <div className="transportVehicleRoute-dropdownMenu">
                    {vehicles.map(
                      (vehicle) => (
                        <div
                          key={vehicle._id}
                          className={`transportVehicleRoute-dropdownItem ${
                            selectedVehicle ===
                            vehicle._id
                              ? "transportVehicleRoute-dropdownSelectedItem"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedVehicle(
                              vehicle._id
                            );

                            setSelectedRoutes([]);

                            setShowDropdown(
                              false
                            );
                          }}
                        >
                          <div className="transportVehicleRoute-dropdownTop">
                            <h4>
                              {
                                vehicle.vehicleNo
                              }
                            </h4>

                            <span
                              className={`transportVehicleRoute-dropdownBadge ${
                                vehicle.vehicleType ===
                                "Bus"
                                  ? "busBadge"
                                  : "vanBadge"
                              }`}
                            >
                              {
                                vehicle.vehicleType
                              }
                            </span>
                          </div>

                          <div className="transportVehicleRoute-dropdownBottom">
                            <p>
                              Capacity :
                              {
                                vehicle.capacity
                              }
                            </p>

                            <p>
                              Driver :
                              {vehicle.driver}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* SELECTED CARD */}

              {selectedVehicle && (
                <div className="transportVehicleRoute-selectedCard">
                  <div className="transportVehicleRoute-selectedTop">
                    <h3>
                      {
                        selectedVehicleData?.vehicleNo
                      }
                    </h3>

                    <span
                      className={`transportVehicleRoute-selectedBadge ${
                        selectedVehicleData?.vehicleType ===
                        "Bus"
                          ? "busBadge"
                          : "vanBadge"
                      }`}
                    >
                      {
                        selectedVehicleData?.vehicleType
                      }
                    </span>
                  </div>

                  <div className="transportVehicleRoute-selectedInfo">
                    <div>
                      <strong>
                        Capacity
                      </strong>

                      <p>
                        {
                          selectedVehicleData?.capacity
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        Driver
                      </strong>

                      <p>
                        {
                          selectedVehicleData?.driver
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ROUTES */}

              {selectedVehicle && (
                <div className="transportVehicleRoute-routes">
                  <h3>
                    Assign Routes
                  </h3>

                  <div className="transportVehicleRoute-routesGrid">
                    {routes.length > 0 ? (
                      routes.map(
                      (route) => (
                        <label
                          key={route._id}
                          className={`transportVehicleRoute-routeItem ${
                            selectedRoutes.includes(
                              route._id
                            )
                              ? "transportVehicleRoute-routeActive"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRoutes.includes(
                              route._id
                            )}
                            onChange={() =>
                              handleRouteChange(
                                route._id
                              )
                            }
                          />

                          <span>
                            {
                              route.routeName
                            }
                          </span>
                        </label>
                      )
                      )
                    ) : (
                      <div className="transportVehicleRoute-noData">
                        No routes found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="transportVehicleRoute-modalFooter">
              <button
                className="transportVehicleRoute-cancelBtn"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="transportVehicleRoute-saveBtn"
                onClick={handleSaveVehicle}
              >
                {editIndex !== null
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportVehicleRoute;
