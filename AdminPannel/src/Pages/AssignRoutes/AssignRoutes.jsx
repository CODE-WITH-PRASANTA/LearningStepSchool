import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../../api/axios";

import {
  Search,
  Plus,
  Trash2,
  Pencil,
  X,
  ChevronDown,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./AssignRoutes.css";

const AssignRoutes = () => {
  /* STATES */

  const [showPopup, setShowPopup] =
    useState(false);

  const [showFilter, setShowFilter] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [isEdit, setIsEdit] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  const [selectedRoute, setSelectedRoute] =
    useState("");

  const [selectedDestinations, setSelectedDestinations] =
    useState([]);

  const [transportRoutes, setTransportRoutes] =
    useState([]);

  const [
    transportDestinations,
    setTransportDestinations,
  ] = useState([]);

  const [
    assignedRoutes,
    setAssignedRoutes,
  ] = useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [visibleColumns, setVisibleColumns] =
    useState({
      sno: true,
      route: true,
      destinations: true,
      fare: true,
      action: true,
    });

  const fetchAssignedRoutes =
    async () => {
      try {
        const res = await API.get(
          `/assign-route?search=${search}`
        );

        setAssignedRoutes(
          res.data.data || []
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    const fetchTransportData =
      async () => {
        try {
          const [
            routesRes,
            destinationsRes,
            assignedRoutesRes,
          ] = await Promise.all([
            API.get("/transport-route"),
            API.get(
              "/transport-destination"
            ),
            API.get("/assign-route"),
          ]);

          setTransportRoutes(
            routesRes.data.data || []
          );

          setTransportDestinations(
            destinationsRes.data.data ||
              []
          );

          setAssignedRoutes(
            assignedRoutesRes.data.data ||
              []
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchTransportData();
  }, []);

  useEffect(() => {
    fetchAssignedRoutes();
  }, [search]);

  /* SEARCH FILTER */

  const filteredRoutes = useMemo(() => {
    return assignedRoutes.filter((item) =>
      (item.routeId?.routeName || "")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [assignedRoutes, search]);

  /* PAGINATION */

  const totalPages = Math.ceil(
    filteredRoutes.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentRoutes =
    filteredRoutes.slice(
      startIndex,
      endIndex
    );

  const routeOptions = useMemo(() => {
    return transportRoutes.map(
      (route) => ({
        value: route._id,
        label: route.routeName,
      })
    );
  }, [transportRoutes]);

  const selectedRouteOption =
    routeOptions.find(
      (route) =>
        route.value === selectedRoute
    );

  const selectedRouteName =
    selectedRouteOption?.label ||
    selectedRoute;

  const destinations = useMemo(() => {
    if (!selectedRoute) return [];

    const apiDestinations =
      transportDestinations.filter(
        (destination) => {
          const routeId =
            destination.routeId?._id ||
            destination.routeId;

          return (
            routeId === selectedRoute ||
            destination.routeId
              ?.routeName ===
              selectedRouteName
          );
        }
      );

    if (apiDestinations.length) {
      return apiDestinations.map(
        (destination) => ({
          id: destination._id,
          name:
            destination.destination,
          price: destination.fare,
        })
      );
    }

    return [];
  }, [
    selectedRoute,
    selectedRouteName,
    transportDestinations,
  ]);

  const handleRouteChange = (route) => {
    setSelectedRoute(route);

    setSelectedDestinations([]);
  };

  const toggleDestination = (destinationId) => {
    setSelectedDestinations((prev) =>
      prev.includes(destinationId)
        ? prev.filter(
            (item) =>
              item !== destinationId
          )
        : [
            ...prev,
            destinationId,
          ]
    );
  };

  /* ADD */

  const handleAddRoute = async () => {
    if (!selectedRoute) {
      alert("Please select route");
      return;
    }

    if (
      selectedDestinations.length === 0
    ) {
      alert(
        "Please select destination"
      );
      return;
    }

    try {
      await API.post(
        "/assign-route/create",
        {
          routeId: selectedRoute,
          destinationIds:
            selectedDestinations,
        }
      );

      await fetchAssignedRoutes();

      setSelectedRoute("");

      setSelectedDestinations([]);

      setShowPopup(false);
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Failed to assign route"
      );
    }
  };

  /* DELETE */

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this assigned route?"
      );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/assign-route/${id}`
      );

      await fetchAssignedRoutes();
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Failed to delete assigned route"
      );
    }
  };

  /* EDIT */

  const handleEdit = (
    item
  ) => {
    const routeValue =
      item.routeId?._id ||
      item.routeId ||
      "";

    setSelectedRoute(routeValue);

    setSelectedDestinations(
      item.destinations
        ?.map(
          (destination) =>
            destination
              .destinationId?._id ||
            destination.destinationId
        )
        .filter(Boolean) || []
    );

    setEditId(item._id);

    setIsEdit(true);

    setShowPopup(true);
  };

  /* UPDATE */

  const handleUpdateRoute =
    async () => {
      if (!selectedRoute) {
        alert(
          "Please select route"
        );
        return;
      }

      if (
        selectedDestinations.length ===
        0
      ) {
        alert(
          "Please select destination"
        );
        return;
      }

      try {
        await API.put(
          `/assign-route/${editId}`,
          {
            routeId: selectedRoute,
            destinationIds:
              selectedDestinations,
          }
        );

        await fetchAssignedRoutes();

        setSelectedRoute("");

        setSelectedDestinations([]);

        setEditId(null);

        setIsEdit(false);

        setShowPopup(false);
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Failed to update assigned route"
        );
      }
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

  /* CLOSE POPUP */

  const closePopup = () => {
    setShowPopup(false);

    setSelectedRoute("");

    setSelectedDestinations([]);

    setIsEdit(false);

    setEditId(null);
  };

  return (
    <div className="assignRoutes">
      {/* TOPBAR */}

      <div className="assignRoutes__topbar">
        {/* SEARCH */}

        <div className="assignRoutes__searchBox">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search Routes..."
            value={search}
            onChange={(e) => {
              setSearch(
                e.target.value
              );

              setCurrentPage(1);
            }}
          />
        </div>

        {/* ACTIONS */}

        <div className="assignRoutes__topActions">
          {/* FILTER */}

          <div className="assignRoutes__filterWrapper">
            <button
              className="assignRoutes__filterBtn"
              onClick={() =>
                setShowFilter(
                  !showFilter
                )
              }
            >
              <SlidersHorizontal
                size={18}
              />
            </button>

            {showFilter && (
              <div className="assignRoutes__filterDropdown">
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
                      visibleColumns.route
                    }
                    onChange={() =>
                      toggleColumn(
                        "route"
                      )
                    }
                  />

                  Assigned Routes
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.destinations
                    }
                    onChange={() =>
                      toggleColumn(
                        "destinations"
                      )
                    }
                  />

                  Destinations
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={
                      visibleColumns.fare
                    }
                    onChange={() =>
                      toggleColumn(
                        "fare"
                      )
                    }
                  />

                  Total Fare
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
            className="assignRoutes__addBtn"
            onClick={() =>
              setShowPopup(true)
            }
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div className="assignRoutes__tableWrapper">
        <table className="assignRoutes__table">
          <thead>
            <tr>
              {visibleColumns.sno && (
                <th>S.NO.</th>
              )}

              {visibleColumns.route && (
                <th>
                  ASSIGNED ROUTES
                </th>
              )}

              {visibleColumns.destinations && (
                <th>
                  DESTINATIONS
                </th>
              )}

              {visibleColumns.fare && (
                <th>TOTAL FARE</th>
              )}

              {visibleColumns.action && (
                <th>ACTION</th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentRoutes.length >
            0 ? (
              currentRoutes.map(
                (
                  item,
                  index
                ) => (
                  <tr key={item._id}>
                    {visibleColumns.sno && (
                      <td>
                        {startIndex +
                          index +
                          1}
                      </td>
                    )}

                    {visibleColumns.route && (
                      <td>
                        <div className="assignRoutes__routeName">
                          {
                            item.routeId
                              ?.routeName
                          }
                        </div>
                      </td>
                    )}

                    {visibleColumns.destinations && (
                      <td>
                        <div className="assignRoutes__destinationNames">
                          {item.destinations
                            ?.map(
                              (
                                destination
                              ) =>
                                destination
                                  .destinationId
                                  ?.destination
                            )
                            .filter(
                              Boolean
                            )
                            .join(", ") ||
                            "-"}
                        </div>
                      </td>
                    )}

                    {visibleColumns.fare && (
                      <td>
                        {item.destinations
                          ?.reduce(
                            (
                              total,
                              destination
                            ) =>
                              total +
                              Number(
                                destination
                                  .destinationId
                                  ?.fare ||
                                  0
                              ),
                            0
                          ) || 0}
                        /-
                      </td>
                    )}

                    {visibleColumns.action && (
                      <td>
                        <div className="assignRoutes__actionGroup">
                          {/* EDIT */}

                          <button
                            className="assignRoutes__editBtn"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          >
                            <Pencil
                              size={
                                16
                              }
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            className="assignRoutes__deleteBtn"
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                          >
                            <Trash2
                              size={
                                16
                              }
                            />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="assignRoutes__noData"
                >
                  No Routes Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}

        <div className="assignRoutes__pagination">
          {/* LEFT */}

          <div className="assignRoutes__paginationLeft">
            <span>
              Items per page
            </span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(
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

              <option value={15}>
                15
              </option>
            </select>
          </div>

          {/* RIGHT */}

          <div className="assignRoutes__paginationRight">
            <p>
              {startIndex + 1}-
              {Math.min(
                endIndex,
                filteredRoutes.length
              )}{" "}
              of{" "}
              {
                filteredRoutes.length
              }
            </p>

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
              <ChevronLeft
                size={18}
              />
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
              <ChevronRight
                size={18}
              />
            </button>
          </div>
        </div>
      </div>

      {/* POPUP */}

      {showPopup && (
        <div className="assignRoutes__popupOverlay">
          <div className="assignRoutes__popup">
            {/* HEADER */}

            <div className="assignRoutes__popupHeader">
              <div>
                <h2>
                  {isEdit
                    ? "Update Route"
                    : "Assign Route"}
                </h2>

                <p>
                  Manage transport
                  routes easily
                </p>
              </div>

              <button
                className="assignRoutes__closeBtn"
                onClick={
                  closePopup
                }
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}

            <div className="assignRoutes__popupBody">
              <div className="assignRoutes__formGroup">
                <label>
                  Select Route
                </label>

                <div className="assignRoutes__selectWrapper">
                  <select
                    value={
                      selectedRoute
                    }
                    onChange={(e) =>
                      handleRouteChange(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Choose Route
                    </option>

                    {routeOptions.map(
                      (route) => (
                        <option
                          key={
                            route.value
                          }
                          value={
                            route.value
                          }
                        >
                          {
                            route.label
                          }
                        </option>
                      )
                    )}
                  </select>

                  <ChevronDown
                    size={18}
                  />
                </div>
              </div>

              {selectedRoute && (
                <div className="assignRoutes__destinations">
                  <h3>
                    Destinations
                  </h3>

                  <div className="assignRoutes__destinationList">
                    {destinations.length > 0 ? (
                      destinations.map(
                      (
                        destination
                      ) => (
                        <label
                          className="assignRoutes__destinationItem"
                          key={
                            destination.id
                          }
                        >
                          <span className="assignRoutes__destinationLeft">
                            <input
                              type="checkbox"
                              checked={selectedDestinations.includes(
                                destination.id
                              )}
                              onChange={() =>
                                toggleDestination(
                                  destination.id
                                )
                              }
                            />

                            <span>
                              {
                                destination.name
                              }
                            </span>
                          </span>

                          <span className="assignRoutes__destinationPrice">
                            {
                              destination.price
                            }
                            /-
                          </span>
                        </label>
                      )
                      )
                    ) : (
                      <div className="assignRoutes__noDestinations">
                        No destinations found for this route
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="assignRoutes__popupFooter">
              <button
                className="assignRoutes__cancelBtn"
                onClick={
                  closePopup
                }
              >
                Cancel
              </button>

              <button
                className="assignRoutes__submitBtn"
                onClick={
                  isEdit
                    ? handleUpdateRoute
                    : handleAddRoute
                }
              >
                {isEdit
                  ? "Update"
                  : "Add Route"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRoutes;
