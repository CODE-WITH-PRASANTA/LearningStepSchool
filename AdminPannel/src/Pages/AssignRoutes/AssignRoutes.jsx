import React, { useState, useMemo } from "react";

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
  const routeOptions = [
    "Mohd Nagar",
    "Ravana",
    "Abusaidpur",
    "Chaukoni",
    "Patti Fazilabad",
    "Sarai Imam",
    "Alafqani",
    "Mirzapur",
    "Noorpur",
    "Bahadurganj",
    "Ashok Nagar",
    "City Center",
  ];

  /* STATES */

  const [showPopup, setShowPopup] =
    useState(false);

  const [showFilter, setShowFilter] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [isEdit, setIsEdit] =
    useState(false);

  const [editIndex, setEditIndex] =
    useState(null);

  const [selectedRoute, setSelectedRoute] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(5);

  const [visibleColumns, setVisibleColumns] =
    useState({
      sno: true,
      route: true,
      action: true,
    });

  const [routes, setRoutes] = useState([
    "Mohd Nagar",
    "Ravana",
    "Abusaidpur",
    "Chaukoni",
    "Patti Fazilabad",
    "Sarai Imam",
    "Alafqani",
    "Mirzapur",
    "Noorpur",
  ]);

  /* SEARCH FILTER */

  const filteredRoutes = useMemo(() => {
    return routes.filter((item) =>
      item
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [routes, search]);

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

  /* ADD */

  const handleAddRoute = () => {
    if (!selectedRoute) {
      alert("Please select route");
      return;
    }

    setRoutes([
      selectedRoute,
      ...routes,
    ]);

    setSelectedRoute("");

    setShowPopup(false);
  };

  /* DELETE */

  const handleDelete = (
    routeName
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this route?"
      );

    if (!confirmDelete) return;

    const updated =
      routes.filter(
        (item) =>
          item !== routeName
      );

    setRoutes(updated);
  };

  /* EDIT */

  const handleEdit = (
    route,
    index
  ) => {
    setSelectedRoute(route);

    setEditIndex(index);

    setIsEdit(true);

    setShowPopup(true);
  };

  /* UPDATE */

  const handleUpdateRoute =
    () => {
      const updated = [...routes];

      updated[editIndex] =
        selectedRoute;

      setRoutes(updated);

      setSelectedRoute("");

      setEditIndex(null);

      setIsEdit(false);

      setShowPopup(false);
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

    setIsEdit(false);

    setEditIndex(null);
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
                  <tr key={index}>
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
                          {item}
                        </div>
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
                                item,
                                routes.indexOf(
                                  item
                                )
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
                                item
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
                  colSpan="3"
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
                      setSelectedRoute(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Choose Route
                    </option>

                    {routeOptions.map(
                      (
                        route,
                        index
                      ) => (
                        <option
                          key={index}
                          value={route}
                        >
                          {route}
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
                <div className="assignRoutes__selectedRoute">
                  Selected Route :
                  <span>
                    {
                      selectedRoute
                    }
                  </span>
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