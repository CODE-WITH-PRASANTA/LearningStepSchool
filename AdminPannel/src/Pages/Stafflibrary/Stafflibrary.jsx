import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiX,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import "./Stafflibrary.css";

const Stafflibrary = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const [books, setBooks] = useState([
    {
      id: 1,
      bookNo: "BK101",
      title: "Mathematics",
      author: "R.K Sharma",
      publication: "NCERT",
      damagedQty: 2,
      quantity: 20,
    },
    {
      id: 2,
      bookNo: "BK102",
      title: "Physics",
      author: "H.C Verma",
      publication: "Modern Pub",
      damagedQty: 1,
      quantity: 15,
    },
    {
      id: 3,
      bookNo: "BK103",
      title: "Chemistry",
      author: "OP Tandon",
      publication: "S Chand",
      damagedQty: 3,
      quantity: 18,
    },
    {
      id: 4,
      bookNo: "BK104",
      title: "Biology",
      author: "NCERT",
      publication: "School Pub",
      damagedQty: 1,
      quantity: 22,
    },
    {
      id: 5,
      bookNo: "BK105",
      title: "English",
      author: "Wren Martin",
      publication: "Oxford",
      damagedQty: 2,
      quantity: 16,
    },
    {
      id: 6,
      bookNo: "BK106",
      title: "History",
      author: "Agarwal",
      publication: "S Chand",
      damagedQty: 1,
      quantity: 25,
    },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    searchBook: "",
    date: "",
    qty: "",
  });

  const filteredBooks = useMemo(() => {
    return books.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setIsEdit(false);

    setFormData({
      id: null,
      searchBook: "",
      date: "",
      qty: "",
    });

    setOpenModal(true);
  };

  const handleEdit = (book) => {
    setIsEdit(true);

    setFormData({
      id: book.id,
      searchBook: book.title,
      date: "",
      qty: book.damagedQty,
    });

    setOpenModal(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure want to delete?"
    );

    if (!confirmDelete) return;

    const updated = books.filter((item) => item.id !== id);

    setBooks(updated);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      !formData.searchBook ||
      !formData.date ||
      !formData.qty
    ) {
      alert("Please fill all fields");
      return;
    }

    if (isEdit) {
      const updated = books.map((item) =>
        item.id === formData.id
          ? {
              ...item,
              title: formData.searchBook,
              damagedQty: formData.qty,
            }
          : item
      );

      setBooks(updated);
    } else {
      const newBook = {
        id: Date.now(),
        bookNo: `BK${books.length + 101}`,
        title: formData.searchBook,
        author: "New Author",
        publication: "Publication",
        damagedQty: formData.qty,
        quantity: 10,
      };

      setBooks([newBook, ...books]);
    }

    setOpenModal(false);
  };

  return (
    <div className="staff-library-page">
      <div className="staff-library-card">
        {/* HEADER */}

        <div className="staff-library-header">
          <div className="staff-library-search">
            <FiSearch className="staff-library-search-icon" />

            <input
              type="text"
              placeholder="Search book..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="staff-library-add-btn"
            onClick={handleOpenAdd}
          >
            <FiPlus />
          </button>
        </div>

        {/* TABLE */}

        <div className="staff-library-table-wrapper">
          <table className="staff-library-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>BOOK NO</th>
                <th>BOOK TITLE</th>
                <th>AUTHOR</th>
                <th>PUBLICATION</th>
                <th>DAMAGE</th>
                <th>QTY</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBooks.length > 0 ? (
                paginatedBooks.map((book, index) => (
                  <tr key={book.id}>
                    <td>{index + 1}</td>

                    <td>{book.bookNo}</td>

                    <td
                      className="staff-library-book-title"
                      onClick={() => handleEdit(book)}
                    >
                      {book.title}
                    </td>

                    <td>{book.author}</td>

                    <td>{book.publication}</td>

                    <td>{book.damagedQty}</td>

                    <td>{book.quantity}</td>

                    <td>
                      <div className="staff-library-action-buttons">
                        <button
                          className="staff-library-edit-btn"
                          onClick={() => handleEdit(book)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="staff-library-delete-btn"
                          onClick={() => handleDelete(book.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="staff-library-empty">
                    No Books Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="staff-library-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            <FiChevronLeft />
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* MODAL */}

      {openModal && (
        <div className="staff-library-modal-overlay">
          <div className="staff-library-modal">
            <div className="staff-library-modal-header">
              <h2>
                {isEdit
                  ? "UPDATE DAMAGED BOOK"
                  : "DAMAGED BOOK"}
              </h2>

              <button
                className="staff-library-close-btn"
                onClick={() => setOpenModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="staff-library-modal-body">
              <div className="staff-library-input-box">
                <FiSearch className="staff-library-input-icon" />

                <input
                  type="text"
                  name="searchBook"
                  placeholder="Search Book"
                  value={formData.searchBook}
                  onChange={handleChange}
                />
              </div>

              <div className="staff-library-input-box">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />

                <FiCalendar className="staff-library-input-icon-right" />
              </div>

              <div className="staff-library-mini-table">
                <table>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>BOOK NO</th>
                      <th>BOOK NAME</th>
                      <th>QTY</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>1</td>

                      <td>BK100</td>

                      <td>
                        {formData.searchBook || "Book Name"}
                      </td>

                      <td>
                        <input
                          type="number"
                          name="qty"
                          placeholder="0"
                          value={formData.qty}
                          onChange={handleChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="staff-library-modal-footer">
                <button
                  className="staff-library-cancel-btn"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="staff-library-save-btn"
                  onClick={handleSubmit}
                >
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stafflibrary;