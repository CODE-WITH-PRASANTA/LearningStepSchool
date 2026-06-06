import React, { useEffect, useMemo, useState } from "react";
import "./TransportStudentsReport.css";
import { FaCalendarAlt } from "react-icons/fa";
import { HiOutlineViewColumns } from "react-icons/hi2";

import API from "../../api/axios";

const allValue = "All";

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

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getRouteName = (route) =>
  route?.routeName || route?.name || route?.title || "";

const getDestinationName = (destination) =>
  destination?.destination || destination?.name || "";

const formatStudentName = (student) =>
  [student.firstName, student.lastName].filter(Boolean).join(" ") || "-";

const reportColumns = [
  { key: "rollNo", label: "Roll No." },
  // { key: "admissionNo", label: "Adm.No." },
  { key: "srNo", label: "Sr.No." },
  { key: "enrollNo", label: "Enroll.No." },
  { key: "name", label: "Name" },
  { key: "className", label: "Class" },
  { key: "fatherName", label: "Father's Name" },
  { key: "contactNo", label: "Contact No." },
  // { key: "feeType", label: "Fee Type" },
  // { key: "motherName", label: "Mother Name" },
  { key: "address", label: "Address" },
  { key: "vehicle", label: "Vehicle" },
  { key: "route", label: "Route" },
  { key: "destination", label: "Dest./Point" },
  { key: "fare", label: "Fare" },
];

const TransportStudentsReport = () => {
  const [report, setReport] = useState(allValue);
  const [documentType, setDocumentType] = useState("Route");
  const [date, setDate] = useState("");
  const [showData, setShowData] = useState(true);
  const [showColumns, setShowColumns] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [vehicleRoutes, setVehicleRoutes] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    reportColumns.reduce((acc, column) => {
      acc[column.key] = true;
      return acc;
    }, {})
  );

  useEffect(() => {
    const fetchTransportStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const [studentsRes, destinationsRes, vehicleRoutesRes] =
          await Promise.all([
            API.get("/students"),
            API.get("/transport-destination"),
            API.get("/vehicle-route"),
          ]);

        setStudents(unwrapData(studentsRes));
        setDestinations(unwrapData(destinationsRes));
        setVehicleRoutes(unwrapData(vehicleRoutesRes));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to fetch transport student data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransportStudents();
  }, []);

  const routeVehicleMap = useMemo(() => {
    const map = new Map();

    vehicleRoutes.forEach((vehicleRoute) => {
      const vehicle = vehicleRoute.vehicleId || {};
      const routes = vehicleRoute.routes || [];

      routes.forEach((routeItem) => {
        const route = routeItem.routeId || {};
        const routeName = normalize(getRouteName(route));
        if (!routeName) return;

        map.set(routeName, {
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
        destination.routeId?.routeName ||
        getRouteName(destination.routeId) ||
        "";
      const key = `${normalize(routeName)}|${normalize(
        getDestinationName(destination)
      )}`;

      if (key !== "|") {
        map.set(key, destination.fare ?? "-");
      }
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
            rollNo: student.rollNumber || "-",
            admissionNo: student.admissionNo || "-",
            srNo: student.srNo || "-",
            enrollNo: student.biometricId || student.apaarId || "-",
            name: formatStudentName(student),
            className: [student.class, student.section]
              .filter(Boolean)
              .join(" - ") || "-",
            fatherName: student.fatherName || "-",
            contactNo:
              student.mobile ||
              student.fatherPhone ||
              student.guardianPhone ||
              "-",
            feeType: student.feeGroup || "-",
            motherName: student.motherName || "-",
            address:
              student.currentAddress ||
              student.permanentAddress ||
              student.guardianAddress ||
              "-",
            vehicle: vehicleInfo.vehicle || "-",
            vehicleType: vehicleInfo.vehicleType || "-",
            driver: vehicleInfo.driver || "-",
            route,
            destination,
            fare,
          };
        }),
    [destinationFareMap, routeVehicleMap, students]
  );

  const filteredRows = useMemo(
    () =>
      transportRows.filter((row) => {
        if (report === allValue) return true;
        return row.vehicleType === report || row.vehicle === report;
      }),
    [report, transportRows]
  );

  const reportOptions = useMemo(() => {
    const vehicleTypes = transportRows
      .map((row) => row.vehicleType)
      .filter((type) => type && type !== "-");
    const vehicles = transportRows
      .map((row) => row.vehicle)
      .filter((vehicle) => vehicle && vehicle !== "-");

    return [allValue, ...new Set([...vehicleTypes, ...vehicles])];
  }, [transportRows]);

  const activeColumns = reportColumns.filter(
    (column) => visibleColumns[column.key]
  );

  const handleSearch = () => {
    setShowData(true);
  };

  const handleColumnToggle = (key) => {
    setVisibleColumns((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className="transport-students">
      <div className="transport-card">
        <div className="filter-section">
          <div className="left-filters">
            <div className="input-group">
              <label>Report</label>
              <select
                value={report}
                onChange={(e) => setReport(e.target.value)}
              >
                {reportOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Select Document</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option>Route</option>
                <option>Destination</option>
                <option>Vehicle</option>
                <option>Fare</option>
              </select>
            </div>

            <div className="input-group">
              <label>Choose a date</label>

              <div className="date-wrapper">
                <input
                  className="date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <FaCalendarAlt className="calendar-icon" />
              </div>
            </div>
          </div>

          <div className="right-actions">
            <button
              className="search-btn"
              onClick={handleSearch}
              type="button"
              disabled={loading}
            >
              Search
            </button>

            <button
              className="column-btn"
              onClick={() => setShowColumns(!showColumns)}
              type="button"
            >
              <HiOutlineViewColumns />
            </button>

            {showColumns && (
              <div className="column-popup">
                {reportColumns.map((item) => (
                  <label key={item.key} className="column-item">
                    <input
                      type="checkbox"
                      checked={visibleColumns[item.key]}
                      onChange={() => handleColumnToggle(item.key)}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && <div className="transport-error">{error}</div>}

        {showData && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>S.NO.</th>
                  {activeColumns.map((column) => (
                    <th key={column.key}>{column.label.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={activeColumns.length + 1} className="empty-row">
                      Loading transport student data...
                    </td>
                  </tr>
                )}

                {!loading &&
                  filteredRows.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      {activeColumns.map((column) => (
                        <td key={column.key}>{item[column.key]}</td>
                      ))}
                    </tr>
                  ))}

                {!loading && filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={activeColumns.length + 1} className="empty-row">
                      No transport students found
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

export default TransportStudentsReport;
