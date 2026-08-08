import React, { useState, useEffect } from "react";
import "./FuelManagement.css";
import API from "../../api/axios";

/* =========================================================
   SVG ICONS
========================================================= */

const Icons = {
  FuelPump: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M15 10h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9l-3-3" />
      <path d="M3 22h12" />
      <rect x="6" y="6" width="6" height="4" rx="1" />
      <circle cx="11" cy="16" r="1" />
    </svg>
  ),

  User: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  Calendar: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),

  FileText: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),

  Gauge: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 14l3-3" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  ),

  Droplet: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),

  Rupee: () => (
    <span
      style={{
        color: "#94A3B8",
        fontWeight: "bold",
        fontSize: "15px",
      }}
    >
      ₹
    </span>
  ),

  Info: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6C38FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),

  Save: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),

  Search: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),

  Filter: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),

  Plus: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),

  Edit: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6C38FF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),

  Trash: () => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EF4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),

  ChevronDown: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94A3B8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
};


/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


/* =========================================================
   COMPONENT
========================================================= */

const FuelManagement = () => {

  /* =====================================================
     FUEL RECORDS
  ===================================================== */

  const [records, setRecords] = useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalRecords, setTotalRecords] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);


  /* =====================================================
     TEACHERS
  ===================================================== */

  const [teachers, setTeachers] =
    useState([]);

  const [teachersLoading, setTeachersLoading] =
    useState(false);


  /* =====================================================
     FORM
  ===================================================== */

  const [formData, setFormData] =
    useState({
      employeeName: "",
      pumpName: "",
      date: getToday(),
      invoiceNo: "",
      km: "",
      rate: "",
      volume: "",
      amount: "",
    });


  /* =====================================================
     FETCH TEACHERS
  ===================================================== */

  const fetchTeachers = async () => {

    try {

      setTeachersLoading(true);

      const response =
        await API.get("/teacher/all");

      console.log(
        "TEACHERS RESPONSE:",
        response.data
      );


      const teacherData =
        response.data?.data || [];


      setTeachers(teacherData);

    } catch (error) {

      console.error(
        "FETCH TEACHERS ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to fetch teachers"
      );

    } finally {

      setTeachersLoading(false);

    }

  };


  /* =====================================================
     FETCH FUEL
  ===================================================== */

  const fetchFuelRecords = async (
    page = currentPage,
    search = searchTerm
  ) => {

    try {

      setLoading(true);


      const response =
        await API.get("/fuel", {
          params: {
            page,
            limit: 10,
            search: search.trim(),
          },
        });


      console.log(
        "FUEL RESPONSE:",
        response.data
      );


      const fuelData =
        response.data?.data || [];


      setRecords(fuelData);


      setTotalRecords(
        response.data?.pagination?.total || 0
      );


      setTotalPages(
        response.data?.pagination?.totalPages || 1
      );


    } catch (error) {

      console.error(
        "FETCH FUEL ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to fetch fuel entries"
      );

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     INITIAL FETCH
  ===================================================== */

  useEffect(() => {

    fetchTeachers();

    fetchFuelRecords(
      1,
      ""
    );

  }, []);


  /* =====================================================
     SEARCH
  ===================================================== */

  useEffect(() => {

    const timer =
      setTimeout(() => {

        setCurrentPage(1);

        fetchFuelRecords(
          1,
          searchTerm
        );

      }, 400);


    return () =>
      clearTimeout(timer);

  }, [searchTerm]);


  /* =====================================================
     AMOUNT CALCULATION
  ===================================================== */

  useEffect(() => {

    const rate =
      parseFloat(
        formData.rate
      ) || 0;

    const volume =
      parseFloat(
        formData.volume
      ) || 0;


    if (
      rate > 0 &&
      volume > 0
    ) {

      setFormData(
        (prev) => ({
          ...prev,
          amount:
            (
              rate *
              volume
            ).toFixed(2),
        })
      );

    } else {

      setFormData(
        (prev) => ({
          ...prev,
          amount: "",
        })
      );

    }

  }, [
    formData.rate,
    formData.volume,
  ]);


  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleInputChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );

  };


  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {

    setFormData({
      employeeName: "",
      pumpName: "",
      date: getToday(),
      invoiceNo: "",
      km: "",
      rate: "",
      volume: "",
      amount: "",
    });


    setEditingId(null);

  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      !formData.employeeName ||
      !formData.pumpName ||
      !formData.date ||
      !formData.invoiceNo
    ) {

      alert(
        "Please fill in all required fields marked with *"
      );

      return;

    }


    try {

      setSaving(true);


      const payload = {

        employeeName:
          formData.employeeName,

        pumpName:
          formData.pumpName,

        date:
          formData.date,

        invoiceNo:
          formData.invoiceNo,

        km:
          Number(formData.km) || 0,

        rate:
          Number(formData.rate) || 0,

        volume:
          Number(formData.volume) || 0,

      };


      /* ===============================================
         UPDATE
      =============================================== */

      if (editingId) {

        await API.put(
          `/fuel/${editingId}`,
          payload
        );


        alert(
          "Fuel entry updated successfully"
        );

      }


      /* ===============================================
         CREATE
      =============================================== */

      else {

        await API.post(
          "/fuel",
          payload
        );


        alert(
          "Fuel entry saved successfully"
        );

      }


      await fetchFuelRecords(
        editingId
          ? currentPage
          : 1,
        searchTerm
      );


      handleReset();


    } catch (error) {

      console.error(
        "SAVE FUEL ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to save fuel entry"
      );

    } finally {

      setSaving(false);

    }

  };


  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (record) => {

    setEditingId(
      record._id
    );


    let formattedDate = "";


    if (record.date) {

      const date =
        new Date(record.date);


      if (
        !Number.isNaN(
          date.getTime()
        )
      ) {

        const year =
          date.getFullYear();

        const month =
          String(
            date.getMonth() + 1
          ).padStart(
            2,
            "0"
          );

        const day =
          String(
            date.getDate()
          ).padStart(
            2,
            "0"
          );


        formattedDate =
          `${year}-${month}-${day}`;

      }

    }


    setFormData({

      employeeName:
        record.employeeName || "",

      pumpName:
        record.pumpName || "",

      date:
        formattedDate,

      invoiceNo:
        record.invoiceNo || "",

      km:
        record.km ?? "",

      rate:
        record.rate ?? "",

      volume:
        record.volume ?? "",

      amount:
        record.amount ?? "",

    });


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this fuel record?"
      )
    ) {

      return;

    }


    try {

      setDeletingId(id);


      await API.delete(
        `/fuel/${id}`
      );


      alert(
        "Fuel record deleted successfully"
      );


      if (
        records.length === 1 &&
        currentPage > 1
      ) {

        const newPage =
          currentPage - 1;


        setCurrentPage(
          newPage
        );


        await fetchFuelRecords(
          newPage,
          searchTerm
        );

      } else {

        await fetchFuelRecords(
          currentPage,
          searchTerm
        );

      }


    } catch (error) {

      console.error(
        "DELETE FUEL ERROR:",
        error
      );


      alert(
        error.response?.data?.message ||
        "Failed to delete fuel record"
      );

    } finally {

      setDeletingId(null);

    }

  };


  /* =====================================================
     PAGE CHANGE
  ===================================================== */

  const handlePageChange = (
    page
  ) => {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }


    setCurrentPage(page);


    fetchFuelRecords(
      page,
      searchTerm
    );

  };


  /* =====================================================
     FORMAT NUMBER
  ===================================================== */

  const formatNum = (
    value
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {

      return "0";

    }


    const number =
      parseFloat(value);


    return Number.isNaN(number)
      ? value
      : number.toLocaleString(
          "en-IN"
        );

  };


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDateDisplay = (
    value
  ) => {

    if (!value) {

      return "";

    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );

    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );

    const year =
      date.getFullYear();


    return `${day}/${month}/${year}`;

  };


  /* =====================================================
     PAGINATION
  ===================================================== */

  const getPaginationPages =
    () => {

      const pages = [];


      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {

        pages.push(i);

      }


      return pages;

    };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="fuel-management">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="fuel-management-header">

        <div className="fuel-management-title-group">

          <div className="fuel-management-header-icon">

            <Icons.FuelPump />

          </div>


          <div>

            <h1 className="fuel-management-header-title">
              Fuel Entry
            </h1>


            <p className="fuel-management-header-subtitle">
              Manage fuel records for organization vehicles.
            </p>

          </div>

        </div>


        <div className="fuel-management-breadcrumbs">

          Accounts & Expenses &gt; Vehicle Controller &gt;{" "}

          <span>
            Fuel Entry
          </span>

        </div>

      </div>


      {/* =================================================
          FORM CARD
      ================================================= */}

      <div className="fuel-management-card">

        <div className="fuel-management-card-title">

          {editingId
            ? "Edit Fuel Entry"
            : "Add Fuel Entry"}

        </div>


        <form onSubmit={handleSubmit}>

          <div className="fuel-management-form-grid">


            {/* =================================================
                EMPLOYEE NAME - TEACHER DROPDOWN
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Employee Name{" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.User />

                </div>


                <select
                  className="fuel-management-input fuel-management-select"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  required
                  disabled={teachersLoading}
                >

                  <option value="">

                    {teachersLoading
                      ? "Loading Teachers..."
                      : teachers.length === 0
                        ? "No Teachers Found"
                        : "Select Employee"}

                  </option>


                  {teachers.map(
                    (teacher) => (

                      <option
                        key={teacher._id}
                        value={teacher.name}
                      >

                        {teacher.name}

                        {teacher.department
                          ? ` - ${teacher.department}`
                          : ""}

                      </option>

                    )
                  )}

                </select>


                <div className="fuel-management-select-arrow">

                  <Icons.ChevronDown />

                </div>

              </div>

            </div>


            {/* =================================================
                PUMP
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Pump Name{" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.FuelPump />

                </div>


                <select
                  className="fuel-management-input fuel-management-select"
                  name="pumpName"
                  value={formData.pumpName}
                  onChange={handleInputChange}
                  required
                >

                  <option value="">
                    Select Pump
                  </option>

                  <option value="Indian Oil - City Pump">
                    Indian Oil - City Pump
                  </option>

                  <option value="HP Petrol Pump - Main Road">
                    HP Petrol Pump - Main Road
                  </option>

                  <option value="Bharat Petroleum">
                    Bharat Petroleum
                  </option>

                  <option value="Reliance Petrol Pump">
                    Reliance Petrol Pump
                  </option>

                  <option value="Indian Oil - Highway">
                    Indian Oil - Highway
                  </option>

                </select>


                <div className="fuel-management-select-arrow">

                  <Icons.ChevronDown />

                </div>

              </div>

            </div>


            {/* =================================================
                DATE
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Date{" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.Calendar />

                </div>


                <input
                  type="date"
                  className="fuel-management-input"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />

              </div>

            </div>


            {/* =================================================
                INVOICE
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Invoice No.{" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.FileText />

                </div>


                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Enter Invoice No."
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleInputChange}
                  required
                />

              </div>

            </div>


            {/* =================================================
                KM
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                KM (Odometer){" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.Gauge />

                </div>


                <input
                  type="number"
                  min="0"
                  className="fuel-management-input"
                  placeholder="Enter KM"
                  name="km"
                  value={formData.km}
                  onChange={handleInputChange}
                />


                <span className="fuel-management-input-suffix">
                  km
                </span>

              </div>

            </div>


            {/* =================================================
                RATE
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Rate per Litre (₹){" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.Rupee />

                </div>


                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="fuel-management-input"
                  placeholder="Enter rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                />


                <span className="fuel-management-input-suffix">
                  /Ltr
                </span>

              </div>

            </div>


            {/* =================================================
                VOLUME
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Volume (Litre){" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.Droplet />

                </div>


                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="fuel-management-input"
                  placeholder="Enter volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                />


                <span className="fuel-management-input-suffix">
                  Ltr
                </span>

              </div>

            </div>


            {/* =================================================
                AMOUNT
            ================================================= */}

            <div className="fuel-management-field">

              <label className="fuel-management-label">

                Amount (₹){" "}

                <span className="fuel-management-required">
                  *
                </span>

              </label>


              <div className="fuel-management-input-wrapper">

                <div className="fuel-management-input-icon">

                  <Icons.Rupee />

                </div>


                <input
                  type="text"
                  className="fuel-management-input"
                  placeholder="Enter amount"
                  name="amount"
                  value={formData.amount}
                  readOnly
                  style={{
                    backgroundColor:
                      "#F8FAFC",
                  }}
                />

              </div>

            </div>


            {/* =================================================
                INFO
            ================================================= */}

            <div className="fuel-management-info-banner">

              <Icons.Info />

              <span>
                Amount will be calculated automatically
                (Rate × Volume)
              </span>

            </div>


          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="fuel-management-form-actions">

            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-reset"
              onClick={handleReset}
              disabled={saving}
            >
              Reset
            </button>


            <button
              type="submit"
              className="fuel-management-btn fuel-management-btn-save"
              disabled={
                saving ||
                teachersLoading ||
                teachers.length === 0
              }
            >

              <Icons.Save />

              {saving
                ? "Saving..."
                : editingId
                  ? "Update Entry"
                  : "Save Entry"}

            </button>

          </div>

        </form>

      </div>


      {/* =================================================
          FUEL LIST
      ================================================= */}

      <div className="fuel-management-card">

        <div className="fuel-management-list-top">

          <div
            className="fuel-management-card-title"
            style={{
              margin: 0,
              paddingBottom: 0,
            }}
          >
            Fuel Entry List
          </div>


          <div className="fuel-management-list-actions">

            {/* SEARCH */}

            <div className="fuel-management-search-wrapper">

              <div
                className="fuel-management-input-icon"
                style={{
                  top: "11px",
                }}
              >

                <Icons.Search />

              </div>


              <input
                type="text"
                className="fuel-management-search-input"
                placeholder="Search fuel entries..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>


            {/* FILTER */}

            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-filter"
              onClick={() => {

                setCurrentPage(1);

                fetchFuelRecords(
                  1,
                  searchTerm
                );

              }}
            >

              <Icons.Filter />

              Filter

            </button>


            {/* ADD */}

            <button
              type="button"
              className="fuel-management-btn fuel-management-btn-save"
              onClick={() => {

                handleReset();

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });

              }}
            >

              <Icons.Plus />

              Add Fuel Entry

            </button>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="fuel-management-table-container">

          <table className="fuel-management-table">

            <thead>

              <tr>

                <th style={{ width: "40px" }}>
                  #
                </th>

                <th>
                  Employee Name
                </th>

                <th>
                  Pump Name
                </th>

                <th>
                  Date
                </th>

                <th>
                  Invoice No.
                </th>

                <th>
                  KM
                </th>

                <th>
                  Rate per Litre (₹)
                </th>

                <th>
                  Volume (Litre)
                </th>

                <th>
                  Amount (₹)
                </th>

                <th
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="10"
                    style={{
                      textAlign:
                        "center",
                      padding: "40px",
                      color:
                        "#94A3B8",
                    }}
                  >
                    Loading fuel entries...
                  </td>

                </tr>

              ) : records.length > 0 ? (

                records.map(
                  (item, index) => (

                    <tr
                      key={
                        item._id
                      }
                    >

                      <td>

                        {(
                          (
                            currentPage -
                            1
                          ) *
                            10
                        ) +
                          index +
                          1}

                      </td>


                      <td
                        style={{
                          fontWeight: 600,
                        }}
                      >

                        {item.employeeName ||
                          "N/A"}

                      </td>


                      <td>
                        {item.pumpName}
                      </td>


                      <td>

                        {formatDateDisplay(
                          item.date
                        )}

                      </td>


                      <td>
                        {item.invoiceNo}
                      </td>


                      <td>

                        {formatNum(
                          item.km
                        )}

                      </td>


                      <td>

                        {parseFloat(
                          item.rate ||
                            0
                        ).toFixed(2)}

                      </td>


                      <td>

                        {parseFloat(
                          item.volume ||
                            0
                        ).toFixed(2)}

                      </td>


                      <td
                        style={{
                          fontWeight: 600,
                        }}
                      >

                        ₹{" "}

                        {formatNum(
                          item.amount
                        )}

                      </td>


                      <td>

                        <div className="fuel-management-table-actions">

                          {/* EDIT */}

                          <button
                            type="button"
                            className="fuel-management-action-btn edit"
                            title="Edit"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                            disabled={
                              saving ||
                              deletingId ===
                                item._id
                            }
                          >

                            <Icons.Edit />

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="fuel-management-action-btn delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                            disabled={
                              deletingId ===
                              item._id
                            }
                          >

                            <Icons.Trash />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="10"
                    style={{
                      textAlign:
                        "center",
                      padding: "24px",
                      color:
                        "#94A3B8",
                    }}
                  >
                    No fuel entries found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="fuel-management-footer">

          <div>

            Showing{" "}

            {records.length > 0
              ? (
                  (
                    currentPage -
                    1
                  ) *
                    10
                ) + 1
              : 0}

            {" "}to{" "}

            {records.length > 0
              ? (
                  (
                    currentPage -
                    1
                  ) *
                    10
                ) +
                  records.length
              : 0}

            {" "}of{" "}

            {totalRecords}

            {" "}entries

          </div>


          <div className="fuel-management-pagination">

            {/* PREVIOUS */}

            <button
              type="button"
              className="fuel-management-page-btn"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                handlePageChange(
                  currentPage -
                    1
                )
              }
            >
              &lt;
            </button>


            {/* PAGES */}

            {getPaginationPages().map(
              (page) => (

                <button
                  type="button"
                  key={page}
                  className={`fuel-management-page-btn ${
                    currentPage ===
                    page
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    handlePageChange(
                      page
                    )
                  }
                >

                  {page}

                </button>

              )
            )}


            {/* NEXT */}

            <button
              type="button"
              className="fuel-management-page-btn"
              disabled={
                currentPage ===
                  totalPages ||
                totalPages === 0
              }
              onClick={() =>
                handlePageChange(
                  currentPage +
                    1
                )
              }
            >
              &gt;
            </button>

          </div>

        </div>

      </div>

    </div>

  );
};

export default FuelManagement;