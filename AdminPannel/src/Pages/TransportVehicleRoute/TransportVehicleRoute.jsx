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

  const vehicles = [
    {
      id: 1,
      value: "125 [Bus] [20]",
      type: "Bus",
      number: "125",
      capacity: "20",
      driver: "Rakesh",
      routes: ["Mohd Nagar", "Ravana"],
    },

    {
      id: 2,
      value: "128 [Bus] [20]",
      type: "Bus",
      number: "128",
      capacity: "20",
      driver: "Bintu yadav",
      routes: ["Chaukoni", "Alafganj"],
    },

    {
      id: 3,
      value: "1280 [Bus] [25]",
      type: "Bus",
      number: "1280",
      capacity: "25",
      driver: "Bintu yadav",
      routes: ["Mohd Nagar"],
    },

    {
      id: 4,
      value: "1353 [Van] [20]",
      type: "Van",
      number: "1353",
      capacity: "20",
      driver: "Vikash",
      routes: ["Sarai Imam"],
    },

    {
      id: 5,
      value: "2050 [Van] [20]",
      type: "Van",
      number: "2050",
      capacity: "20",
      driver: "Bintu yadav",
      routes: [
        "Ravana",
        "Patti fazilabad",
      ],
    },

    {
      id: 6,
      value: "2525 [Van] [20]",
      type: "Van",
      number: "2525",
      capacity: "20",
      driver: "Vikash",
      routes: [
        "Mohd Nagar",
        "Abusaidpur",
      ],
    },

    {
      id: 7,
      value: "5678 [Van] [30]",
      type: "Van",
      number: "5678",
      capacity: "30",
      driver: "Samridhi",
      routes: ["Alafganj"],
    },
  ];

  const routes = [
    "Mohd Nagar",
    "Ravana",
    "Abusaidpur",
    "Chaukoni",
    "Patti fazilabad",
    "Sarai Imam",
    "Alafganj",
  ];

  const [vehicleData, setVehicleData] =
    useState([
      {
        sno: 1,
        type: "Van",
        number: "2525",
        capacity: "20",
        driver: "Vikash",
        routes: [
          "Mohd Nagar",
          "Abusaidpur",
        ],
      },

      {
        sno: 2,
        type: "Van",
        number: "2050",
        capacity: "20",
        driver: "Bintu yadav",
        routes: [
          "Ravana",
          "Patti fazilabad",
        ],
      },

      {
        sno: 3,
        type: "Bus",
        number: "128",
        capacity: "20",
        driver: "Bintu yadav",
        routes: [
          "Chaukoni",
          "Alafganj",
        ],
      },
    ]);

  const [selectedVehicle, setSelectedVehicle] =
    useState("");

  const [selectedRoutes, setSelectedRoutes] =
    useState([]);

  const [editIndex, setEditIndex] =
    useState(null);

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

  const handleRouteChange = (route) => {
    if (selectedRoutes.includes(route)) {
      setSelectedRoutes(
        selectedRoutes.filter(
          (item) => item !== route
        )
      );
    } else {
      setSelectedRoutes([
        ...selectedRoutes,
        route,
      ]);
    }
  };

  const handleSaveVehicle = () => {
    if (!selectedVehicle) return;

    const vehicleObj = vehicles.find(
      (item) => item.value === selectedVehicle
    );

    const newData = {
      sno:
        editIndex !== null
          ? vehicleData[editIndex].sno
          : vehicleData.length + 1,

      type: vehicleObj.type,
      number: vehicleObj.number,
      capacity: vehicleObj.capacity,
      driver: vehicleObj.driver,
      routes: selectedRoutes,
    };

    if (editIndex !== null) {
      const updatedData = [...vehicleData];

      updatedData[editIndex] = newData;

      setVehicleData(updatedData);
    } else {
      setVehicleData([
        ...vehicleData,
        newData,
      ]);
    }

    closeModal();
  };

  const handleEdit = (item, index) => {
    const matchedVehicle = vehicles.find(
      (vehicle) =>
        vehicle.number === item.number
    );

    setSelectedVehicle(
      matchedVehicle?.value || ""
    );

    setSelectedRoutes(item.routes || []);

    setEditIndex(index);

    setShowAddModal(true);
  };

  const handleDelete = (index) => {
    const updated = vehicleData.filter(
      (_, i) => i !== index
    );

    setVehicleData(updated);
  };

  const closeModal = () => {
    setShowAddModal(false);

    setSelectedVehicle("");

    setSelectedRoutes([]);

    setShowDropdown(false);

    setEditIndex(null);
  };

  const filteredData = useMemo(() => {
    return vehicleData.filter((item) =>
      Object.values(item)
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
                <tr key={index}>
                  {selectedColumns.sno && (
                    <td>{item.sno}</td>
                  )}

                  {selectedColumns.type && (
                    <td>
                      <span
                        className={`transportVehicleRoute-typeBadge ${
                          item.type === "Bus"
                            ? "busBadge"
                            : "vanBadge"
                        }`}
                        onClick={() =>
                          handleEdit(item, index)
                        }
                      >
                        {item.type}
                      </span>
                    </td>
                  )}

                  {selectedColumns.number && (
                    <td>{item.number}</td>
                  )}

                  {selectedColumns.capacity && (
                    <td>{item.capacity}</td>
                  )}

                  {selectedColumns.driver && (
                    <td>{item.driver}</td>
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
                              {route}
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
                            handleDelete(index)
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
                    {selectedVehicle ||
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
                      (vehicle, index) => (
                        <div
                          key={index}
                          className={`transportVehicleRoute-dropdownItem ${
                            selectedVehicle ===
                            vehicle.value
                              ? "transportVehicleRoute-dropdownSelectedItem"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedVehicle(
                              vehicle.value
                            );

                            setSelectedRoutes(
                              vehicle.routes
                            );

                            setShowDropdown(
                              false
                            );
                          }}
                        >
                          <div className="transportVehicleRoute-dropdownTop">
                            <h4>
                              {vehicle.number}
                            </h4>

                            <span
                              className={`transportVehicleRoute-dropdownBadge ${
                                vehicle.type ===
                                "Bus"
                                  ? "busBadge"
                                  : "vanBadge"
                              }`}
                            >
                              {vehicle.type}
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
                        vehicles.find(
                          (v) =>
                            v.value ===
                            selectedVehicle
                        )?.number
                      }
                    </h3>

                    <span
                      className={`transportVehicleRoute-selectedBadge ${
                        vehicles.find(
                          (v) =>
                            v.value ===
                            selectedVehicle
                        )?.type === "Bus"
                          ? "busBadge"
                          : "vanBadge"
                      }`}
                    >
                      {
                        vehicles.find(
                          (v) =>
                            v.value ===
                            selectedVehicle
                        )?.type
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
                          vehicles.find(
                            (v) =>
                              v.value ===
                              selectedVehicle
                          )?.capacity
                        }
                      </p>
                    </div>

                    <div>
                      <strong>
                        Driver
                      </strong>

                      <p>
                        {
                          vehicles.find(
                            (v) =>
                              v.value ===
                              selectedVehicle
                          )?.driver
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
                    {routes.map(
                      (route, index) => (
                        <label
                          key={index}
                          className={`transportVehicleRoute-routeItem ${
                            selectedRoutes.includes(
                              route
                            )
                              ? "transportVehicleRoute-routeActive"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRoutes.includes(
                              route
                            )}
                            onChange={() =>
                              handleRouteChange(
                                route
                              )
                            }
                          />

                          <span>{route}</span>
                        </label>
                      )
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