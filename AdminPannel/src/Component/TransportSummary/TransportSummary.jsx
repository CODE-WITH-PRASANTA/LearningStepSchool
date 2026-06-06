import React, { useEffect, useMemo, useState } from "react";
import "./TransportSummary.css";

import {
  FaFilePdf,
  FaHome,
  FaPrint,
  FaTh,
} from "react-icons/fa";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import API from "../../api/axios";
import schoolLogo from "../../Assets/Learning-Step-Logo-1.png";

const allValue = "all";

const unwrapData = (response) =>
  Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data)
    ? response.data
    : [];

const getId = (item) =>
  typeof item === "object" && item !== null
    ? item._id || item.id || ""
    : item || "";

const getRouteName = (route) =>
  route?.routeName || route?.name || route?.title || "N/A";

const getDestinationName = (destination) =>
  destination?.destination || destination?.name || "N/A";

const uniqueBy = (items, keyGetter) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyGetter(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const getVehicleGroupKey = (row) => row.vehicleId || row.vehicleNo;

const TransportSummary = () => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [assignRoutes, setAssignRoutes] = useState([]);
  const [vehicleRoutes, setVehicleRoutes] = useState([]);
  const [filters, setFilters] = useState({
    vehicle: allValue,
    route: allValue,
    destination: allValue,
    vehicleType: allValue,
    driver: allValue,
  });

  useEffect(() => {
    const fetchTransportData = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          vehiclesRes,
          routesRes,
          destinationsRes,
          assignRoutesRes,
          vehicleRoutesRes,
        ] = await Promise.all([
          API.get("/vehicle"),
          API.get("/transport-route"),
          API.get("/transport-destination"),
          API.get("/assign-route"),
          API.get("/vehicle-route"),
        ]);

        setVehicles(unwrapData(vehiclesRes));
        setRoutes(unwrapData(routesRes));
        setDestinations(unwrapData(destinationsRes));
        setAssignRoutes(unwrapData(assignRoutesRes));
        setVehicleRoutes(unwrapData(vehicleRoutesRes));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to fetch transport summary data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransportData();
  }, []);

  const routeDestinationMap = useMemo(() => {
    const map = new Map();

    assignRoutes.forEach((assignment) => {
      const routeId = getId(assignment.routeId);
      if (!routeId) return;

      const assignedDestinations =
        assignment.destinations
          ?.map((item) => item.destinationId || item)
          .filter(Boolean) || [];

      map.set(routeId, assignedDestinations);
    });

    destinations.forEach((destination) => {
      const routeId = getId(destination.routeId);
      if (!routeId || map.has(routeId)) return;
      map.set(routeId, []);
    });

    destinations.forEach((destination) => {
      const routeId = getId(destination.routeId);
      if (!routeId || !map.has(routeId)) return;

      const current = map.get(routeId);
      if (!current.some((item) => getId(item) === getId(destination))) {
        current.push(destination);
      }
    });

    return map;
  }, [assignRoutes, destinations]);

  const summaryRows = useMemo(() => {
    const vehicleMap = new Map(
      vehicles.map((vehicle) => [getId(vehicle), vehicle])
    );

    return vehicleRoutes.flatMap((vehicleRoute) => {
      const vehicle =
        vehicleRoute.vehicleId ||
        vehicleMap.get(getId(vehicleRoute.vehicleId)) ||
        {};

      const routeItems =
        vehicleRoute.routes?.length > 0
          ? vehicleRoute.routes
          : vehicleRoute.routeIds?.map((routeId) => ({ routeId })) || [];

      return routeItems.flatMap((routeItem) => {
        const route =
          routeItem.routeId ||
          routes.find((item) => getId(item) === getId(routeItem.routeId)) ||
          {};

        const routeId = getId(route);
        const destinationItems = routeDestinationMap.get(routeId) || [];
        const safeDestinations =
          destinationItems.length > 0
            ? destinationItems
            : [{ _id: `${routeId}-empty`, destination: "N/A", fare: "" }];

        return safeDestinations.map((destination) => ({
          vehicleId: getId(vehicle),
          vehicleNo: vehicle.vehicleNo || "N/A",
          capacity: vehicle.capacity ?? "N/A",
          vehicleType: vehicle.vehicleType || "N/A",
          driver: vehicle.driver || "N/A",
          routeId,
          route: getRouteName(route),
          destinationId: getId(destination),
          destination: getDestinationName(destination),
          fare: destination.fare ?? "",
        }));
      });
    });
  }, [destinations, routeDestinationMap, routes, vehicleRoutes, vehicles]);

  const filteredRows = useMemo(
    () =>
      summaryRows.filter((row) => {
        const matchesVehicle =
          filters.vehicle === allValue || row.vehicleId === filters.vehicle;
        const matchesRoute =
          filters.route === allValue || row.routeId === filters.route;
        const matchesDestination =
          filters.destination === allValue ||
          row.destinationId === filters.destination;
        const matchesVehicleType =
          filters.vehicleType === allValue ||
          row.vehicleType === filters.vehicleType;
        const matchesDriver =
          filters.driver === allValue || row.driver === filters.driver;

        return (
          matchesVehicle &&
          matchesRoute &&
          matchesDestination &&
          matchesVehicleType &&
          matchesDriver
        );
      }),
    [filters, summaryRows]
  );

  const reportRows = useMemo(
    () =>
      filteredRows.map((row, index, rows) => {
        const currentVehicle = getVehicleGroupKey(row);
        const previousVehicle =
          index > 0 ? getVehicleGroupKey(rows[index - 1]) : "";

        return {
          ...row,
          showVehicleDetails: index === 0 || currentVehicle !== previousVehicle,
        };
      }),
    [filteredRows]
  );

  const routeOptions = uniqueBy(
    routes.filter((route) => getRouteName(route) !== "N/A"),
    (route) => getId(route)
  );

  const destinationOptions = uniqueBy(
    destinations.filter(
      (destination) => getDestinationName(destination) !== "N/A"
    ),
    (destination) => getId(destination)
  );

  const vehicleTypeOptions = [
    ...new Set(vehicles.map((vehicle) => vehicle.vehicleType).filter(Boolean)),
  ];

  const driverOptions = [
    ...new Set(vehicles.map((vehicle) => vehicle.driver).filter(Boolean)),
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      vehicle: allValue,
      route: allValue,
      destination: allValue,
      vehicleType: allValue,
      driver: allValue,
    });
  };

  const downloadPdf = () => {
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(20);
    doc.text("Learning Step International School", 14, 14);
    doc.setFontSize(11);
    doc.text("Transport Summary Report", 14, 22);
    doc.text(`Total Records: ${reportRows.length}`, 14, 30);

    autoTable(doc, {
      startY: 36,
      head: [
        [
          "S.NO.",
          "Vehicle No.",
          "Capacity",
          "Vehicle Type",
          "Driver",
          "Route",
          "Destination",
          "Fare",
        ],
      ],
      body: reportRows.map((row, index) => [
        row.showVehicleDetails ? index + 1 : "",
        row.showVehicleDetails ? row.vehicleNo : "",
        row.showVehicleDetails ? row.capacity : "",
        row.showVehicleDetails ? row.vehicleType : "",
        row.showVehicleDetails ? row.driver : "",
        row.route,
        row.destination,
        row.fare,
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save("Transport-Summary-Report.pdf");
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="Uab">
      <div className="UabHeader">
        <div className="UabHeaderLeft">
          <h2>Transport Summary</h2>

          <div className="UabBreadcrumb">
            <FaHome />
            <span>Transport</span>
            <span>/</span>
            <span>Reports</span>
            <span>/</span>
            <span>Transport Summary</span>
          </div>
        </div>

        <div className="UabHeaderIcons">
          <FaTh className="UabGridIcon" />
          {/* <button
            className="UabIconButton"
            onClick={handlePrint}
            type="button"
            title="Preview report"
            disabled={loading}
          >
            <FaPrint className="UabPrintIcon" />
          </button> */}
          <button
            className="UabIconButton"
            onClick={downloadPdf}
            type="button"
            title="Download PDF"
            disabled={loading || reportRows.length === 0}
          >
            <FaFilePdf className="UabPdfIcon" />
          </button>
        </div>
      </div>

      <div className="UabFilterCard">
        <div className="UabFilterGrid">
          <div className="UabSelectBox">
            <label>Vehicle Type</label>
            <select
              name="vehicleType"
              value={filters.vehicleType}
              onChange={handleFilterChange}
            >
              <option value={allValue}>All Types</option>
              {vehicleTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Routes</label>
            <select
              name="route"
              value={filters.route}
              onChange={handleFilterChange}
            >
              <option value={allValue}>All Routes</option>
              {routeOptions.map((route) => (
                <option key={getId(route)} value={getId(route)}>
                  {getRouteName(route)}
                </option>
              ))}
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Destination</label>
            <select
              name="destination"
              value={filters.destination}
              onChange={handleFilterChange}
            >
              <option value={allValue}>All Destinations</option>
              {destinationOptions.map((destination) => (
                <option key={getId(destination)} value={getId(destination)}>
                  {getDestinationName(destination)}
                </option>
              ))}
            </select>
          </div>

          <div className="UabSelectBox">
            <label>Driver</label>
            <select
              name="driver"
              value={filters.driver}
              onChange={handleFilterChange}
            >
              <option value={allValue}>All Drivers</option>
              {driverOptions.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          <button className="UabSearchBtn" onClick={resetFilters} type="button">
            Reset
          </button>
        </div>

        {error && <div className="UabError">{error}</div>}

        <div className="UabTableWrapper">
          <table className="UabTable">
            <thead>
              <tr>
                <th>S.NO.</th>
                <th>VEHICLE NO.</th>
                <th>VEHICLE CAPACITY</th>
                <th>VEHICLE TYPE</th>
                <th>DRIVER</th>
                <th>ROUTE</th>
                <th>DESTINATION</th>
                <th>FARE</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="8" className="UabEmptyCell">
                    Loading transport data...
                  </td>
                </tr>
              )}

              {!loading &&
                reportRows.map((row, index) => (
                  <tr
                    key={`${row.vehicleId}-${row.routeId}-${row.destinationId}-${index}`}
                  >
                    <td>{row.showVehicleDetails ? index + 1 : ""}</td>
                    <td>{row.showVehicleDetails ? row.vehicleNo : ""}</td>
                    <td>{row.showVehicleDetails ? row.capacity : ""}</td>
                    <td>{row.showVehicleDetails ? row.vehicleType : ""}</td>
                    <td>{row.showVehicleDetails ? row.driver : ""}</td>
                    <td>{row.route}</td>
                    <td>{row.destination}</td>
                    <td>{row.fare}</td>
                  </tr>
                ))}

              {!loading && reportRows.length === 0 && (
                <tr>
                  <td colSpan="8" className="UabEmptyCell">
                    No transport summary records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPrintModal && (
        <div className="UabModalOverlay">
          <div className="UabModal">
            <div className="UabPreview">
              <img src={schoolLogo} alt="School" className="UabSchoolLogo" />

              <h1>Learning Step International School</h1>

              <h4>Transport Summary Report</h4>
              <p>Total Records: {reportRows.length}</p>

              <table className="UabPreviewTable">
                <thead>
                  <tr>
                    <th>S.NO.</th>
                    <th>VEHICLE</th>
                    <th>CAPACITY</th>
                    <th>TYPE</th>
                    <th>DRIVER</th>
                    <th>ROUTE</th>
                    <th>DESTINATION</th>
                    <th>FARE</th>
                  </tr>
                </thead>

                <tbody>
                  {reportRows.map((row, index) => (
                    <tr
                      key={`preview-${row.vehicleId}-${row.routeId}-${row.destinationId}-${index}`}
                    >
                      <td>{row.showVehicleDetails ? index + 1 : ""}</td>
                      <td>{row.showVehicleDetails ? row.vehicleNo : ""}</td>
                      <td>{row.showVehicleDetails ? row.capacity : ""}</td>
                      <td>{row.showVehicleDetails ? row.vehicleType : ""}</td>
                      <td>{row.showVehicleDetails ? row.driver : ""}</td>
                      <td>{row.route}</td>
                      <td>{row.destination}</td>
                      <td>{row.fare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="UabPrintPanel">
              <h2>Print</h2>

              <div className="UabPrintOption">
                <label>Destination</label>
                <select defaultValue="pdf" disabled>
                  <option value="pdf">Save as PDF</option>
                </select>
              </div>

              <div className="UabPrintOption">
                <label>Pages</label>
                <select defaultValue="all" disabled>
                  <option value="all">All</option>
                </select>
              </div>

              <div className="UabPrintOption">
                <label>Layout</label>
                <select defaultValue="landscape" disabled>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div className="UabPrintButtons">
                <button
                  className="UabSaveBtn"
                  onClick={downloadPdf}
                  type="button"
                  disabled={reportRows.length === 0}
                >
                  Save
                </button>

                <button
                  className="UabCancelBtn"
                  onClick={() => setShowPrintModal(false)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportSummary;
