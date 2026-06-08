import React, { useEffect, useMemo, useState } from "react";
import "./TransportVehicleReport.css";

import API from "../../api/axios";

const allValue = "All";

const unwrapData = (response) =>
  Array.isArray(response?.data?.data)
    ? response.data.data
    : Array.isArray(response?.data)
    ? response.data
    : [];

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getRouteName = (route) =>
  route?.routeName || route?.name || route?.title || "";

const getDestinationName = (destination) =>
  destination?.destination || destination?.name || "";

const getStudentName = (student) =>
  [student.firstName, student.lastName].filter(Boolean).join(" ") || "-";

const TransportVehicleReport = () => {
  const [reportType, setReportType] = useState(allValue);
  const [selectedClass, setSelectedClass] = useState(allValue);
  const [selectedDivision, setSelectedDivision] = useState(allValue);
  const [selectedVehicle, setSelectedVehicle] = useState(allValue);
  const [selectedRoute, setSelectedRoute] = useState(allValue);
  const [selectedDestination, setSelectedDestination] = useState(allValue);
  const [showTable, setShowTable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [vehicleRoutes, setVehicleRoutes] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError("");

      try {
        const [studentsRes, vehicleRoutesRes, destinationsRes] =
          await Promise.all([
            API.get("/students"),
            API.get("/vehicle-route"),
            API.get("/transport-destination"),
          ]);

        setStudents(unwrapData(studentsRes));
        setVehicleRoutes(unwrapData(vehicleRoutesRes));
        setDestinations(unwrapData(destinationsRes));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to fetch transport vehicle report data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const routeVehicleMap = useMemo(() => {
    const map = new Map();

    vehicleRoutes.forEach((vehicleRoute) => {
      const vehicle = vehicleRoute.vehicleId || {};
      const routes = vehicleRoute.routes || [];

      routes.forEach((routeItem) => {
        const routeName = getRouteName(routeItem.routeId);
        if (!routeName) return;

        map.set(normalize(routeName), {
          vehicle: vehicle.vehicleNo || "-",
          vehicleType: vehicle.vehicleType || "-",
          driver: vehicle.driver || "-",
        });
      });
    });

    return map;
  }, [vehicleRoutes]);

  const destinationFareMap = useMemo(() => {
    const map = new Map();

    destinations.forEach((destination) => {
      const routeName =
        destination.routeId?.routeName || getRouteName(destination.routeId);
      const destinationName = getDestinationName(destination);

      if (!routeName || !destinationName) return;

      map.set(
        `${normalize(routeName)}|${normalize(destinationName)}`,
        destination.fare ?? "-"
      );
    });

    return map;
  }, [destinations]);

  const transportRows = useMemo(
    () =>
      students
        .filter((student) => student.routeList || student.busStop)
        .map((student, index) => {
          const route = student.routeList || "-";
          const destination = student.busStop || "-";
          const vehicleInfo = routeVehicleMap.get(normalize(route)) || {};
          const fare =
            destinationFareMap.get(
              `${normalize(route)}|${normalize(destination)}`
            ) || "-";

          return {
            id: student._id || index,
            admNo: student.admissionNo || "-",
            srNo: student.srNo || "-",
            name: getStudentName(student),
            className: [student.class, student.section]
              .filter(Boolean)
              .join("-") || "-",
            classOnly: student.class || "-",
            division: student.section || "-",
            father: student.fatherName || "-",
            contact:
              student.mobile ||
              student.fatherPhone ||
              student.guardianPhone ||
              "-",
            vehicle: vehicleInfo.vehicle || "-",
            route,
            destination,
            fare,
          };
        }),
    [destinationFareMap, routeVehicleMap, students]
  );

  const classOptions = useMemo(
    () => [
      allValue,
      ...new Set(
        transportRows
          .map((row) => row.classOnly)
          .filter((className) => className && className !== "-")
      ),
    ],
    [transportRows]
  );

  const divisionOptions = useMemo(
    () => [
      allValue,
      ...new Set(
        transportRows
          .filter(
            (row) =>
              selectedClass === allValue || row.classOnly === selectedClass
          )
          .map((row) => row.division)
          .filter((division) => division && division !== "-")
      ),
    ],
    [selectedClass, transportRows]
  );

  const vehicleOptions = useMemo(
    () => [
      allValue,
      ...new Set(
        transportRows
          .map((row) => row.vehicle)
          .filter((vehicle) => vehicle && vehicle !== "-")
      ),
    ],
    [transportRows]
  );

  const routeOptions = useMemo(
    () => [
      allValue,
      ...new Set(
        transportRows
          .filter(
            (row) =>
              selectedVehicle === allValue || row.vehicle === selectedVehicle
          )
          .map((row) => row.route)
          .filter((route) => route && route !== "-")
      ),
    ],
    [selectedVehicle, transportRows]
  );

  const destinationOptions = useMemo(
    () => [
      allValue,
      ...new Set(
        transportRows
          .filter(
            (row) =>
              selectedRoute === allValue || row.route === selectedRoute
          )
          .map((row) => row.destination)
          .filter((destination) => destination && destination !== "-")
      ),
    ],
    [selectedRoute, transportRows]
  );

  const filteredRows = useMemo(
    () =>
      transportRows.filter((row) => {
        if (reportType === "Class Wise") {
          const classMatch =
            selectedClass === allValue || row.classOnly === selectedClass;
          const divisionMatch =
            selectedDivision === allValue || row.division === selectedDivision;

          return classMatch && divisionMatch;
        }

        if (reportType === "Transport Wise") {
          const vehicleMatch =
            selectedVehicle === allValue || row.vehicle === selectedVehicle;
          const routeMatch =
            selectedRoute === allValue || row.route === selectedRoute;
          const destinationMatch =
            selectedDestination === allValue ||
            row.destination === selectedDestination;

          return vehicleMatch && routeMatch && destinationMatch;
        }

        return true;
      }),
    [
      reportType,
      selectedClass,
      selectedDestination,
      selectedDivision,
      selectedRoute,
      selectedVehicle,
      transportRows,
    ]
  );

  const handleSearch = () => {
    setShowTable(true);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setSelectedClass(allValue);
    setSelectedDivision(allValue);
    setSelectedVehicle(allValue);
    setSelectedRoute(allValue);
    setSelectedDestination(allValue);
  };

  return (
    <div className="transport-vehicle-container">
      <div className="transport-vehicle-card">
        <div className="transport-vehicle-filter-row">
          <div className="transport-vehicle-field">
            <label>Report</label>
            <select value={reportType} onChange={handleReportTypeChange}>
              <option value={allValue}>All</option>
              <option value="Class Wise">Class Wise</option>
              <option value="Transport Wise">Transport Wise</option>
            </select>
          </div>

          {reportType === "Class Wise" && (
            <>
              <div className="transport-vehicle-field">
                <label>Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedDivision(allValue);
                  }}
                >
                  {classOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="transport-vehicle-field">
                <label>Division</label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                >
                  {divisionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {reportType === "Transport Wise" && (
            <>
              <div className="transport-vehicle-field">
                <label>Vehicles</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => {
                    setSelectedVehicle(e.target.value);
                    setSelectedRoute(allValue);
                    setSelectedDestination(allValue);
                  }}
                >
                  {vehicleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="transport-vehicle-field">
                <label>Routes</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => {
                    setSelectedRoute(e.target.value);
                    setSelectedDestination(allValue);
                  }}
                >
                  {routeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="transport-vehicle-field">
                <label>Destination</label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  {destinationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            className="transport-vehicle-search-btn"
            onClick={handleSearch}
            type="button"
            disabled={loading}
          >
            Search
          </button>
        </div>

        <div className="transport-vehicle-notification">
         Vehicles  Transports Report
        </div>

        {error && <div className="transport-vehicle-error">{error}</div>}

        {showTable && (
          <div className="transport-vehicle-table-wrapper">
            <table className="transport-vehicle-table">
              <thead>
                <tr>
                  {/* <th>
                    <input type="checkbox" />
                  </th> */}
                  <th>S.NO.</th>
                  <th>ADM.NO.</th>
                  <th>SR.NO.</th>
                  <th>NAME</th>
                  <th>CLASS</th>
                  <th>FATHER'S NAME</th>
                  <th>CONTACT NO.</th>
                  <th>VEHICLE</th>
                  <th>ROUTE</th>
                  <th>DEST./POINT</th>
                  <th>FARE</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="12" className="transport-vehicle-empty">
                      Loading transport vehicle report...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredRows.map((item, index) => (
                    <tr key={item.id}>
                      {/* <td>
                        <input type="checkbox" />
                      </td> */}
                      <td>{index + 1}</td>
                      <td>{item.admNo}</td>
                      <td>{item.srNo}</td>
                      <td>{item.name}</td>
                      <td>{item.className}</td>
                      <td>{item.father}</td>
                      <td>{item.contact}</td>
                      <td>{item.vehicle}</td>
                      <td>{item.route}</td>
                      <td>{item.destination}</td>
                      <td>{item.fare}</td>
                    </tr>
                  ))}

                {!loading && filteredRows.length === 0 && (
                  <tr>
                    <td colSpan="12" className="transport-vehicle-empty">
                      No transport vehicle records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportVehicleReport;
