import React, { useEffect, useRef, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaList,
  FaChevronDown,
  FaLayerGroup,
  FaTimes,
} from "react-icons/fa";
import Swal from "sweetalert2";
import API from "../../api/axios";
import "./ExpenseHead.css";

const ExpenseHead = () => {
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const menuRef = useRef(null);

  /* =====================================================
     CLOSE ACTION MENU
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(null);
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

  /* =====================================================
     FETCH EXPENSE HEADS
  ===================================================== */

  useEffect(() => {
    fetchExpenseHeads();
  }, []);

  const fetchExpenseHeads = async () => {
    try {
      setLoading(true);

      const response = await API.get("/expense-heads");

      setExpenseHeads(response.data || []);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Unable to load",
        text:
          error.response?.data?.message ||
          "Failed to load expense heads.",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     SAVE / UPDATE
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();

    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "Expense head required",
        text: "Please enter an expense head.",
        confirmButtonColor: "#6366f1",
      });

      return;
    }

    try {
      setSaving(true);

      const payload = {
        name,
        description: formData.description.trim(),
      };

      if (editingId) {
        await API.put(
          `/expense-heads/${editingId}`,
          payload
        );

        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: "Expense head has been updated.",
          confirmButtonColor: "#6366f1",
          timer: 1600,
          showConfirmButton: false,
        });
      } else {
        await API.post(
          "/expense-heads",
          payload
        );

        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: "New expense head has been added.",
          confirmButtonColor: "#6366f1",
          timer: 1600,
          showConfirmButton: false,
        });
      }

      resetForm();

      await fetchExpenseHeads();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Operation failed",
        text:
          error.response?.data?.message ||
          "Something went wrong.",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (item) => {
    setFormData({
      name: item.name || "",
      description: item.description || "",
    });

    setEditingId(item._id);

    setMenuOpen(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete expense head?",
      html: `
        <p style="margin:0;color:#667085;">
          You are about to delete
          <strong style="color:#101828;">
            "${name}"
          </strong>
        </p>
      `,
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(
        `/expense-heads/${id}`
      );

      await fetchExpenseHeads();

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Expense head deleted successfully.",
        confirmButtonColor: "#6366f1",
        timer: 1600,
        showConfirmButton: false,
      });

      if (
        currentPage > 1 &&
        (expenseHeads.length - 1) <=
          (currentPage - 1) * itemsPerPage
      ) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          error.response?.data?.message ||
          "Unable to delete expense head.",
        confirmButtonColor: "#6366f1",
      });
    }

    setMenuOpen(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });

    setEditingId(null);
    setMenuOpen(null);
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const totalPages = Math.ceil(
    expenseHeads.length / itemsPerPage
  );

  const firstIndex =
    (currentPage - 1) * itemsPerPage;

  const lastIndex =
    firstIndex + itemsPerPage;

  const visibleHeads =
    expenseHeads.slice(
      firstIndex,
      lastIndex
    );

  const changePage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
    setMenuOpen(null);
  };

  /* =====================================================
     PAGE NUMBERS
  ===================================================== */

  const pageNumbers = [];

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pageNumbers.push(page);
  }

  return (
    <div className="expense-manager">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="expense-manager__header">

        <div className="expense-manager__heading">

          <div className="expense-manager__heading-icon">
            <FaLayerGroup />
          </div>

          <div>
            <span className="expense-manager__eyebrow">
              EXPENSE MANAGEMENT
            </span>

            <h1 className="expense-manager__title">
              Expense Heads
            </h1>

            <div className="expense-manager__breadcrumb">
              <span>Dashboard</span>
              <b>/</b>
              <span>Expense</span>
              <b>/</b>
              <strong>Expense Heads</strong>
            </div>
          </div>

        </div>

        <div className="expense-manager__summary">

          <div className="expense-manager__summary-icon">
            <FaList />
          </div>

          <div>
            <span>Total Heads</span>
            <strong>
              {expenseHeads.length}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="expense-manager__content">

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div className="expense-manager__form-card">

          <div className="expense-manager__card-header">

            <div className="expense-manager__card-title-wrap">

              <div className="expense-manager__card-icon">
                {editingId ? (
                  <FaEdit />
                ) : (
                  <FaPlus />
                )}
              </div>

              <div>
                <h2>
                  {editingId
                    ? "Edit Expense Head"
                    : "Add Expense Head"}
                </h2>

                <p>
                  {editingId
                    ? "Update the selected expense category"
                    : "Create a new expense category"}
                </p>
              </div>

            </div>

            {editingId && (
              <span className="expense-manager__editing">
                Editing
              </span>
            )}

          </div>

          <form
            className="expense-manager__form"
            onSubmit={handleSubmit}
          >

            <div className="expense-manager__field">

              <label>
                Expense Head
                <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter expense head"
                maxLength={100}
              />

              <small>
                Example: Transport, Electricity,
                Maintenance
              </small>

            </div>

            <div className="expense-manager__field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a short description"
                rows="6"
                maxLength={500}
              />

              <small>
                Add additional information about
                this expense category.
              </small>

            </div>

            <div className="expense-manager__form-actions">

              <button
                type="submit"
                className="expense-manager__save"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="expense-manager__spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <FaEdit />
                    ) : (
                      <FaPlus />
                    )}

                    {editingId
                      ? "Update Expense Head"
                      : "Save Expense Head"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="expense-manager__cancel"
                  onClick={resetForm}
                  disabled={saving}
                >
                  <FaTimes />
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        {/* =================================================
            LIST CARD
        ================================================= */}

        <div className="expense-manager__list-card">

          <div className="expense-manager__card-header">

            <div className="expense-manager__card-title-wrap">

              <div className="expense-manager__card-icon">
                <FaList />
              </div>

              <div>
                <h2>
                  Expense Head List
                </h2>

                <p>
                  Manage your expense categories
                </p>
              </div>

            </div>

            <div className="expense-manager__count">
              {expenseHeads.length}
              {expenseHeads.length === 1
                ? " Head"
                : " Heads"}
            </div>

          </div>

          {/* TABLE */}

          <div className="expense-manager__table-container">

            <table className="expense-manager__table">

              <thead>
                <tr>
                  <th>
                    EXPENSE HEAD
                  </th>

                  <th>
                    DESCRIPTION
                  </th>

                  <th className="expense-manager__action-header">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="expense-manager__state"
                    >
                      <span className="expense-manager__loading-spinner" />
                      <strong>
                        Loading expense heads...
                      </strong>
                    </td>
                  </tr>
                ) : visibleHeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="expense-manager__empty"
                    >
                      <div className="expense-manager__empty-icon">
                        <FaList />
                      </div>

                      <strong>
                        No Expense Heads Found
                      </strong>

                      <span>
                        Create your first expense
                        head using the form.
                      </span>
                    </td>
                  </tr>
                ) : (
                  visibleHeads.map(
                    (item, index) => (
                      <tr key={item._id}>

                        <td>
                          <div className="expense-manager__name">

                            <div className="expense-manager__number">
                              {firstIndex + index + 1}
                            </div>

                            <div>
                              <strong>
                                {item.name}
                              </strong>

                              <span>
                                Expense Category
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <div className="expense-manager__description">
                            {item.description ||
                              "No description provided"}
                          </div>
                        </td>

                        <td className="expense-manager__action">

                          <button
                            type="button"
                            className="expense-manager__action-btn"
                            onClick={() =>
                              setMenuOpen(
                                menuOpen ===
                                  item._id
                                  ? null
                                  : item._id
                              )
                            }
                          >
                            Action
                            <FaChevronDown />
                          </button>

                          {menuOpen ===
                            item._id && (
                            <div
                              className="expense-manager__menu"
                              ref={menuRef}
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(item)
                                }
                              >
                                <FaEdit />
                                Edit
                              </button>

                              <button
                                type="button"
                                className="expense-manager__delete"
                                onClick={() =>
                                  handleDelete(
                                    item._id,
                                    item.name
                                  )
                                }
                              >
                                <FaTrash />
                                Delete
                              </button>

                            </div>
                          )}

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          {expenseHeads.length > 0 && (
            <div className="expense-manager__pagination">

              <div className="expense-manager__pagination-info">
                Showing{" "}
                <strong>
                  {firstIndex + 1}
                </strong>{" "}
                to{" "}
                <strong>
                  {Math.min(
                    lastIndex,
                    expenseHeads.length
                  )}
                </strong>{" "}
                of{" "}
                <strong>
                  {expenseHeads.length}
                </strong>
              </div>

              <div className="expense-manager__pagination-buttons">

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    changePage(
                      currentPage - 1
                    )
                  }
                >
                  Previous
                </button>

                {pageNumbers.map(
                  (page) => (
                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changePage(page)
                      }
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    changePage(
                      currentPage + 1
                    )
                  }
                >
                  Next
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default ExpenseHead;