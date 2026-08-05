import React, { useEffect, useMemo, useState } from "react";
import {
  FaTruck,
  FaRoad,
  FaGasPump,
  FaExclamationCircle,
  FaTachometerAlt,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaClipboard,
  FaCalendarAlt,
  FaEye,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import API from "../../api/axios";
import "./VechicleDash.css";

const getToday = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split("-");

  return year && month && day ? `${day}/${month}/${year}` : "—";
};

const formatNumber = (value) => Number(value || 0).toLocaleString("en-IN");

const VechicleDash = () => {
  const [filterDate, setFilterDate] = useState(getToday);
  const [appliedDate, setAppliedDate] = useState(getToday);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [systemSetting, setSystemSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (date) => {
    setLoading(true);
    setError("");

    try {
      const [vehiclesResponse, logsResponse, settingResponse] = await Promise.all([
        API.get("/vehicle"),
        API.get("/vehicle-km", { params: { date } }),
        API.get("/system-setting"),
      ]);

      if (!vehiclesResponse.data?.success || !logsResponse.data?.success) {
        throw new Error("Unable to load vehicle dashboard data.");
      }

      setVehicles(vehiclesResponse.data.data || []);
      setDailyLogs(logsResponse.data.data || []);
      setSystemSetting(settingResponse.data?.data || null);
    } catch (requestError) {
      setVehicles([]);
      setDailyLogs([]);
      setSystemSetting(null);
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(appliedDate);
  }, [appliedDate]);

  const dashboardRows = useMemo(() => {
    const logsByVehicle = new Map(
      dailyLogs.map((log) => [String(log.vehicle?._id || log.vehicle), log])
    );
    const minDailyKm = Number(systemSetting?.minDailyKm);
    const maxDailyKm = Number(systemSetting?.maxDailyKm);

    return vehicles.map((vehicle) => {
      const log = logsByVehicle.get(String(vehicle._id));
      const runningKm = Number(log?.runningKm || 0);
      let status = "No Entry";

      if (log) {
        if (Number.isFinite(minDailyKm) && runningKm < minDailyKm) {
          status = "Below Minimum";
        } else if (Number.isFinite(maxDailyKm) && runningKm > maxDailyKm) {
          status = "Over Running";
        } else {
          status = "Normal";
        }
      }

      return {
        id: vehicle._id,
        date: formatDate(log?.date || appliedDate),
        vehicle: vehicle.vehicleNo || "—",
        driver: vehicle.driver || "—",
        vehicleType: vehicle.vehicleType || "—",
        capacity: vehicle.capacity ?? "—",
        openingKm: log?.openingKm ?? "—",
        closingKm: log?.closingKm ?? "—",
        runningKm: log ? runningKm : "—",
        status,
      };
    });
  }, [vehicles, dailyLogs, systemSetting, appliedDate]);

  const recordedRows = dashboardRows.filter((row) => row.runningKm !== "—");
  const totalDistance = recordedRows.reduce(
    (sum, row) => sum + Number(row.runningKm || 0),
    0
  );
  const totalAlerts = dashboardRows.filter((row) => row.status !== "Normal").length;
  const averageRunning = recordedRows.length
    ? totalDistance / recordedRows.length
    : 0;
  const estimatedFuelCost =
    Number(systemSetting?.minMileage) > 0 && Number(systemSetting?.dieselRate) > 0
      ? (totalDistance / Number(systemSetting.minMileage)) *
        Number(systemSetting.dieselRate)
      : null;

  const handleFilter = () => {
    if (filterDate) setAppliedDate(filterDate);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Normal":
        return "vechicledash_status_normal";
      case "Below Minimum":
        return "vechicledash_status_low";
      case "Over Running":
        return "vechicledash_status_over";
      default:
        return "vechicledash_status_empty";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Normal":
        return <FaCheckCircle />;
      case "Below Minimum":
        return <FaExclamationTriangle />;
      case "Over Running":
        return <FaTimesCircle />;
      default:
        return <FaClipboard />;
    }
  };

  const renderKm = (value) => (value === "—" ? "—" : `${formatNumber(value)} KM`);

  return (
    <div className="vechicledash_container">
      <div className="vechicledash_header">
        <div>
          <h1 className="vechicledash_title">Vehicle Monitoring Dashboard</h1>
          <p className="vechicledash_subtitle">
            Daily fleet running and operational alerts
          </p>
        </div>
      </div>

      <div className="vechicledash_filter_wrapper">
        <div className="vechicledash_filter_left">
          <FaCalendarAlt className="vechicledash_filter_icon" />
          <span className="vechicledash_filter_label">Filter by Date</span>
        </div>
        <div className="vechicledash_filter_right">
          <input
            type="date"
            value={filterDate}
            max={getToday()}
            onChange={(event) => setFilterDate(event.target.value)}
            className="vechicledash_date_input"
          />
          <button
            type="button"
            className="vechicledash_filter_btn"
            onClick={handleFilter}
            disabled={loading || !filterDate}
          >
            {loading ? (
              <FaSpinner className="vechicledash_spin" />
            ) : (
              <FaFilter className="vechicledash_filter_btn_icon" />
            )}
            Apply Filter
          </button>
        </div>
      </div>

      <div className="vechicledash_stats_grid">
        <div className="vechicledash_stat_card vechicledash_stat_blue">
          <div className="vechicledash_stat_icon_wrapper"><FaTruck className="vechicledash_card_icon" /></div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">{vehicles.length}</h3>
            <p className="vechicledash_stat_label">Total Vehicles</p>
            <span className="vechicledash_stat_sub">Registered Fleet</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_indigo">
          <div className="vechicledash_stat_icon_wrapper"><FaRoad className="vechicledash_card_icon" /></div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">{formatNumber(totalDistance)} KM</h3>
            <p className="vechicledash_stat_label">Total Distance</p>
            <span className="vechicledash_stat_sub">For {formatDate(appliedDate)}</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_green">
          <div className="vechicledash_stat_icon_wrapper"><FaGasPump className="vechicledash_card_icon" /></div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">
              {estimatedFuelCost === null ? "—" : `₹${formatNumber(Math.round(estimatedFuelCost))}`}
            </h3>
            <p className="vechicledash_stat_label">Estimated Fuel Cost</p>
            <span className="vechicledash_stat_sub">
              {estimatedFuelCost === null ? "Configure mileage and diesel rate" : "Based on system settings"}
            </span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_red">
          <div className="vechicledash_stat_icon_wrapper"><FaExclamationCircle className="vechicledash_card_icon" /></div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">{totalAlerts}</h3>
            <p className="vechicledash_stat_label">Vehicles in Alert</p>
            <span className="vechicledash_stat_sub">No entry or outside KM limit</span>
          </div>
        </div>

        <div className="vechicledash_stat_card vechicledash_stat_success">
          <div className="vechicledash_stat_icon_wrapper"><FaTachometerAlt className="vechicledash_card_icon" /></div>
          <div className="vechicledash_stat_content">
            <h3 className="vechicledash_stat_number">{formatNumber(Math.round(averageRunning))} KM</h3>
            <p className="vechicledash_stat_label">Average Running</p>
            <span className="vechicledash_stat_sub">Across {recordedRows.length} logged vehicle{recordedRows.length === 1 ? "" : "s"}</span>
          </div>
        </div>
      </div>

      <div className="vechicledash_table_wrapper">
        <div className="vechicledash_table_header">
          <div className="vechicledash_table_header_left">
            <h2 className="vechicledash_table_title">Vehicle Daily Summary</h2>
            <span className="vechicledash_table_count">
              {dashboardRows.length} {dashboardRows.length === 1 ? "vehicle" : "vehicles"} found
            </span>
          </div>
        </div>

        {error && <div className="vechicledash_error_banner">{error}</div>}

        <div className="vechicledash_table_scroll">
          <table className="vechicledash_table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle & Driver</th>
                <th>Opening KM</th>
                <th>Closing KM</th>
                <th>Today's KM</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="vechicledash_empty_row"><FaSpinner className="vechicledash_spin vechicledash_empty_icon" />Loading fleet records...</td></tr>
              ) : dashboardRows.length ? (
                dashboardRows.map((item) => (
                  <tr key={item.id} className="vechicledash_table_row">
                    <td><span className="vechicledash_cell_date">{item.date}</span></td>
                    <td><div className="vechicledash_cell_vehicle"><span className="vechicledash_vehicle_number">{item.vehicle}</span><span className="vechicledash_vehicle_driver">{item.driver}</span></div></td>
                    <td><span className="vechicledash_cell_km">{renderKm(item.openingKm)}</span></td>
                    <td><span className="vechicledash_cell_km">{renderKm(item.closingKm)}</span></td>
                    <td><span className="vechicledash_cell_km">{renderKm(item.runningKm)}</span></td>
                    <td><span className={`vechicledash_status_badge ${getStatusClass(item.status)}`}>{getStatusIcon(item.status)}{item.status}</span></td>
                    <td><button type="button" className="vechicledash_view_btn" onClick={() => { setSelectedVehicle(item); setShowModal(true); }}><FaEye /> View</button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="vechicledash_empty_row"><FaClipboard className="vechicledash_empty_icon" />No vehicles are registered.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="vechicledash_legend">
          <span className="vechicledash_legend_title">Legend:</span>
          <div className="vechicledash_legend_items">
            <span className="vechicledash_legend_item vechicledash_legend_normal"><FaCheckCircle /> Normal</span>
            <span className="vechicledash_legend_item vechicledash_legend_low"><FaExclamationTriangle /> Below minimum</span>
            <span className="vechicledash_legend_item vechicledash_legend_over"><FaTimesCircle /> Over running</span>
            <span className="vechicledash_legend_item vechicledash_legend_empty"><FaClipboard /> No entry</span>
          </div>
        </div>
      </div>

      {showModal && selectedVehicle && (
        <div className="vechicledash_modal_overlay" onClick={() => setShowModal(false)}>
          <div className="vechicledash_modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="vechicledash_modal_close" onClick={() => setShowModal(false)} aria-label="Close modal"><FaTimes /></button>
            <div className="vechicledash_modal_header"><h2>Vehicle Details</h2><span className="vechicledash_modal_vehicle">{selectedVehicle.vehicle}</span></div>
            <div className="vechicledash_modal_body">
              <div className="vechicledash_modal_grid">
                <div className="vechicledash_modal_item"><label>Driver Name</label><p>{selectedVehicle.driver}</p></div>
                <div className="vechicledash_modal_item"><label>Date</label><p>{selectedVehicle.date}</p></div>
                <div className="vechicledash_modal_item"><label>Vehicle Type</label><p>{selectedVehicle.vehicleType}</p></div>
                <div className="vechicledash_modal_item"><label>Capacity</label><p>{selectedVehicle.capacity}</p></div>
                <div className="vechicledash_modal_item"><label>Opening KM</label><p>{renderKm(selectedVehicle.openingKm)}</p></div>
                <div className="vechicledash_modal_item"><label>Closing KM</label><p>{renderKm(selectedVehicle.closingKm)}</p></div>
                <div className="vechicledash_modal_item"><label>Today's Running</label><p>{renderKm(selectedVehicle.runningKm)}</p></div>
                <div className="vechicledash_modal_item"><label>Status</label><div><span className={`vechicledash_status_badge ${getStatusClass(selectedVehicle.status)}`}>{getStatusIcon(selectedVehicle.status)}{selectedVehicle.status}</span></div></div>
              </div>
            </div>
            <div className="vechicledash_modal_footer"><button type="button" className="vechicledash_modal_btn vechicledash_modal_btn_secondary" onClick={() => setShowModal(false)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VechicleDash;
