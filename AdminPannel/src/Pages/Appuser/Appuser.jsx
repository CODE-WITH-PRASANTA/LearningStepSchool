import React, { useState, useRef, useEffect } from "react";
import "./Appuser.css";

import {
  FaSearch,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

const Appuser = () => {

  /* =========================
     FILTER POPUP STATE
  ========================= */

  const [showFilterPopup, setShowFilterPopup] =
    useState(false);

  const popupRef = useRef(null);

  /* =========================
     FILTER FORM STATE
  ========================= */

  const [filterData, setFilterData] =
    useState({
      type: "Class Wise",
      className: "Class I",
      notification: "On",
    });

  /* =========================
     TABLE COLUMN STATE
  ========================= */

  const [tableColumns, setTableColumns] =
    useState({
      serialNumber: true,
      admissionNumber: true,
      studentName: true,
      className: true,
      fatherName: true,
      userId: true,
      password: true,
      notification: true,
      appStatus: true,
      loginStatus: true,
      displayFees: true,
      displayResult: true,
    });

  /* =========================
     TABLE DATA
  ========================= */

  const [studentTableData] = useState([
    {
      id: 1,
      admissionNumber: "1001",
      studentName: "John Doe",
      className: "X",
      fatherName: "Robert Doe",
      userId: "john1001",
      password: "******",
      notification: "ON",
    },

    {
      id: 2,
      admissionNumber: "1002",
      studentName: "Emma Watson",
      className: "IX",
      fatherName: "David Watson",
      userId: "emma1002",
      password: "******",
      notification: "OFF",
    },

    {
      id: 3,
      admissionNumber: "1003",
      studentName: "Michael Lee",
      className: "VIII",
      fatherName: "Daniel Lee",
      userId: "mike1003",
      password: "******",
      notification: "ON",
    },
  ]);

  /* =========================
     CLOSE POPUP OUTSIDE CLICK
  ========================= */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setShowFilterPopup(false);
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

  /* =========================
     COLUMN TOGGLE FUNCTION
  ========================= */

  const handleTableColumnToggle = (
    columnKey
  ) => {

    setTableColumns((previousColumns) => ({
      ...previousColumns,
      [columnKey]:
        !previousColumns[columnKey],
    }));

  };

  /* =========================
     FILTER CHANGE FUNCTION
  ========================= */

  const handleFilterChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFilterData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

  };

  /* =========================
     SEARCH BUTTON FUNCTION
  ========================= */

  const handleSearchButton = () => {

    alert(
      "Search Button Working Successfully"
    );

  };

  /* =========================
     SAVE BUTTON FUNCTION
  ========================= */

  const handleSaveButton = () => {

    alert(
      "Data Saved Successfully"
    );

  };

  return (

    <div className="appuser-main-container">

      {/* =========================
         TOOLBAR SECTION
      ========================= */}

      <div className="appuser-toolbar-section">

        {/* TYPE FIELD */}

        <div className="appuser-toolbar-field-group">

          <label className="appuser-toolbar-label">
            Type
          </label>

          <div className="appuser-select-wrapper">

            <select
              className="appuser-toolbar-select-field"
              name="type"
              value={filterData.type}
              onChange={handleFilterChange}
            >

              <option>
                Class Wise
              </option>

              <option>
                Student Wise
              </option>

            </select>

          </div>

        </div>

        {/* CLASS FIELD */}

        <div className="appuser-toolbar-field-group">

          <label className="appuser-toolbar-label">
            Class
          </label>

          <div className="appuser-select-wrapper">

            <select
              className="appuser-toolbar-select-field"
              name="className"
              value={filterData.className}
              onChange={handleFilterChange}
            >

              <option>
                Class I
              </option>

              <option>
                Class II
              </option>

              <option>
                Class III
              </option>

              <option>
                Class IV
              </option>

              <option>
                Class V
              </option>

            </select>

          </div>

        </div>

        {/* NOTIFICATION FIELD */}

        <div className="appuser-toolbar-field-group">

          <label className="appuser-toolbar-label">
            Notification
          </label>

          <div className="appuser-select-wrapper">

            <select
              className="appuser-toolbar-select-field"
              name="notification"
              value={filterData.notification}
              onChange={handleFilterChange}
            >

              <option>
                On
              </option>

              <option>
                Off
              </option>

            </select>

          </div>

        </div>

        {/* FILTER BUTTON */}

        <div
          className="appuser-filter-popup-wrapper"
          ref={popupRef}
        >

          <button
            className="appuser-filter-button"
            onClick={() =>
              setShowFilterPopup(
                !showFilterPopup
              )
            }
          >

            <span className="appuser-filter-button-icon">
              <FaSlidersH />
            </span>

          </button>

          {/* FILTER POPUP */}

          {showFilterPopup && (

            <div className="appuser-column-popup-container">

              <div className="appuser-column-popup-header">

                <h3 className="appuser-column-popup-title">
                  Manage Columns
                </h3>

                <button
                  className="appuser-popup-close-button"
                  onClick={() =>
                    setShowFilterPopup(false)
                  }
                >
                  <FaTimes />
                </button>

              </div>

              <div className="appuser-column-popup-body">

                {Object.entries({

                  serialNumber: "Sr.No.",
                  admissionNumber: "Adm.No.",
                  studentName: "Name",
                  className: "Class",
                  fatherName:
                    "Father's Name",
                  userId: "User ID",
                  password: "Password",
                  notification:
                    "Notification",
                  appStatus:
                    "App Status",
                  loginStatus:
                    "Login Status",
                  displayFees:
                    "Display Fees",
                  displayResult:
                    "Display Result",

                }).map(
                  ([columnKey, columnLabel]) => (

                    <label
                      key={columnKey}
                      className="appuser-column-checkbox-wrapper"
                    >

                      <input
                        type="checkbox"
                        className="appuser-column-checkbox-input"
                        checked={
                          tableColumns[
                            columnKey
                          ]
                        }
                        onChange={() =>
                          handleTableColumnToggle(
                            columnKey
                          )
                        }
                      />

                      <span className="appuser-column-checkbox-label">
                        {columnLabel}
                      </span>

                    </label>

                  )
                )}

              </div>

            </div>

          )}

        </div>

        {/* SEARCH BUTTON */}

        <button
          className="appuser-search-button"
          onClick={handleSearchButton}
        >

          <span className="appuser-search-button-icon">
            <FaSearch />
          </span>

          <span className="appuser-search-button-text">
            Search
          </span>

        </button>

      </div>

      {/* =========================
         TABLE SECTION
      ========================= */}

      <div className="appuser-table-main-wrapper">

        <div className="appuser-table-responsive-wrapper">

          <table className="appuser-main-table">

            {/* TABLE HEADER */}

            <thead className="appuser-main-table-head">

              <tr className="appuser-main-table-header-row">

                <th className="appuser-main-table-heading appuser-checkbox-column">

                  <input type="checkbox" />

                </th>

                {tableColumns.serialNumber && (
                  <th className="appuser-main-table-heading">
                    S.NO.
                  </th>
                )}

                {tableColumns.admissionNumber && (
                  <th className="appuser-main-table-heading">
                    ADM.NO.
                  </th>
                )}

                {tableColumns.studentName && (
                  <th className="appuser-main-table-heading">
                    NAME
                  </th>
                )}

                {tableColumns.className && (
                  <th className="appuser-main-table-heading">
                    CLASS
                  </th>
                )}

                {tableColumns.fatherName && (
                  <th className="appuser-main-table-heading">
                    FATHER'S NAME
                  </th>
                )}

                {tableColumns.userId && (
                  <th className="appuser-main-table-heading">
                    USER ID
                  </th>
                )}

                {tableColumns.password && (
                  <th className="appuser-main-table-heading">
                    PASSWORD
                  </th>
                )}

                {tableColumns.notification && (
                  <th className="appuser-main-table-heading">
                    NOTIFICATION
                  </th>
                )}

                {tableColumns.appStatus && (
                  <th className="appuser-main-table-heading">
                    APP STATUS
                  </th>
                )}

                {tableColumns.loginStatus && (
                  <th className="appuser-main-table-heading">
                    LOGIN STATUS
                  </th>
                )}

                {tableColumns.displayResult && (
                  <th className="appuser-main-table-heading">
                    DISPLAY RESULT
                  </th>
                )}

                {tableColumns.displayFees && (
                  <th className="appuser-main-table-heading">
                    DISPLAY FEES
                  </th>
                )}

              </tr>

            </thead>

            {/* TABLE BODY */}

            <tbody className="appuser-main-table-body">

              {studentTableData.map(
                (studentItem, index) => (

                  <tr
                    key={studentItem.id}
                    className="appuser-main-table-body-row"
                  >

                    <td className="appuser-main-table-data appuser-checkbox-column">

                      <input type="checkbox" />

                    </td>

                    {tableColumns.serialNumber && (
                      <td className="appuser-main-table-data">
                        {index + 1}
                      </td>
                    )}

                    {tableColumns.admissionNumber && (
                      <td className="appuser-main-table-data">
                        {
                          studentItem.admissionNumber
                        }
                      </td>
                    )}

                    {tableColumns.studentName && (
                      <td className="appuser-main-table-data appuser-student-name-cell">
                        {
                          studentItem.studentName
                        }
                      </td>
                    )}

                    {tableColumns.className && (
                      <td className="appuser-main-table-data">
                        {
                          studentItem.className
                        }
                      </td>
                    )}

                    {tableColumns.fatherName && (
                      <td className="appuser-main-table-data">
                        {
                          studentItem.fatherName
                        }
                      </td>
                    )}

                    {tableColumns.userId && (
                      <td className="appuser-main-table-data">
                        {
                          studentItem.userId
                        }
                      </td>
                    )}

                    {tableColumns.password && (
                      <td className="appuser-main-table-data">
                        {
                          studentItem.password
                        }
                      </td>
                    )}

                    {tableColumns.notification && (
                      <td className="appuser-main-table-data">
                        {
                          studentItem.notification
                        }
                      </td>
                    )}

                    {tableColumns.appStatus && (
                      <td className="appuser-main-table-data">

                        <label className="appuser-toggle-switch-wrapper">

                          <input
                            type="checkbox"
                            defaultChecked
                            className="appuser-toggle-switch-input"
                          />

                          <span className="appuser-toggle-switch-slider"></span>

                        </label>

                      </td>
                    )}

                    {tableColumns.loginStatus && (
                      <td className="appuser-main-table-data">

                        <label className="appuser-toggle-switch-wrapper">

                          <input
                            type="checkbox"
                            defaultChecked
                            className="appuser-toggle-switch-input"
                          />

                          <span className="appuser-toggle-switch-slider"></span>

                        </label>

                      </td>
                    )}

                    {tableColumns.displayResult && (
                      <td className="appuser-main-table-data">

                        <label className="appuser-toggle-switch-wrapper">

                          <input
                            type="checkbox"
                            defaultChecked
                            className="appuser-toggle-switch-input"
                          />

                          <span className="appuser-toggle-switch-slider"></span>

                        </label>

                      </td>
                    )}

                    {tableColumns.displayFees && (
                      <td className="appuser-main-table-data">

                        <label className="appuser-toggle-switch-wrapper">

                          <input
                            type="checkbox"
                            defaultChecked
                            className="appuser-toggle-switch-input"
                          />

                          <span className="appuser-toggle-switch-slider"></span>

                        </label>

                      </td>
                    )}

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* FOOTER */}

      <div className="appuser-footer-section">

        <button
          className="appuser-save-button"
          onClick={handleSaveButton}
        >

          Save

        </button>

      </div>

    </div>

  );
};

export default Appuser;