import React, { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
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

const DamageBook = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [books, setBooks] = useState([]);
  const [damageBooks, setDamageBooks] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    book: "",
    date: "",
    qty: "",
  });

  useEffect(() => {
    fetchBooks();
    fetchDamageBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await API.get("/books");
    setBooks(res.data.data || []);
  };

  const fetchDamageBooks = async () => {
    const res = await API.get("/damage-books");
    setDamageBooks(res.data.data || []);
  };

  const filteredDamageBooks = useMemo(() => {
    return damageBooks.filter((item) => {
      const text = search.toLowerCase();

      return (
        item.book?.title?.toLowerCase().includes(text) ||
        item.book?.bookNo?.toLowerCase().includes(text) ||
        item.book?.author?.toLowerCase().includes(text) ||
        item.book?.publication?.toLowerCase().includes(text)
      );
    });
  }, [damageBooks, search]);

  const filteredBookSuggestions = books.filter((book) => {
    const text = bookSearch.toLowerCase();

    return (
      book.title?.toLowerCase().includes(text) ||
      book.bookNo?.toLowerCase().includes(text)
    );
  });

  const totalPages = Math.ceil(filteredDamageBooks.length / itemsPerPage) || 1;

  const paginatedBooks = filteredDamageBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setIsEdit(false);
    setBookSearch("");
    setFormData({
      id: null,
      book: "",
      date: "",
      qty: "",
    });
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    setIsEdit(true);

    setFormData({
      id: item._id,
      book: item.book?._id || "",
      date: item.damageDate ? item.damageDate.slice(0, 10) : "",
      qty: item.damagedQty || "",
    });

    setBookSearch(`${item.book?.title || ""} - ${item.book?.bookNo || ""}`);

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete?")) return;

    await API.delete(`/damage-books/${id}`);
    fetchDamageBooks();
  };

  const handleSubmit = async () => {
    if (!formData.book || !formData.date || !formData.qty) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      book: formData.book,
      damageDate: formData.date,
      damagedQty: Number(formData.qty),
    };

    if (isEdit) {
      await API.put(`/damage-books/${formData.id}`, payload);
    } else {
      await API.post("/damage-books", payload);
    }

    setOpenModal(false);
    fetchDamageBooks();
  };

  return (
    <div className="staff-library-page">
      <div className="staff-library-card">
        <div className="staff-library-header">
          <div className="staff-library-search">
            <FiSearch className="staff-library-search-icon" />

            <input
              type="text"
              placeholder="Search book..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <button className="staff-library-add-btn" onClick={handleOpenAdd}>
            <FiPlus />
          </button>
        </div>

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
                paginatedBooks.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.book?.bookNo}</td>

                    <td
                      className="staff-library-book-title"
                      onClick={() => handleEdit(item)}
                    >
                      {item.book?.title}
                    </td>

                    <td>{item.book?.author}</td>
                    <td>{item.book?.publication}</td>
                    <td>{item.damagedQty}</td>
                    <td>{item.book?.openQuantity || 0}</td>

                    <td>
                      <div className="staff-library-action-buttons">
                        <button
                          className="staff-library-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          className="staff-library-delete-btn"
                          onClick={() => handleDelete(item._id)}
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

        <div className="staff-library-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <FiChevronLeft />
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {openModal && (
        <div className="staff-library-modal-overlay">
          <div className="staff-library-modal">
            <div className="staff-library-modal-header">
              <h2>{isEdit ? "UPDATE DAMAGED BOOK" : "DAMAGED BOOK"}</h2>

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
                  placeholder="Search Book"
                  value={bookSearch}
                  onChange={(e) => {
                    setBookSearch(e.target.value);
                    setFormData({ ...formData, book: "" });
                  }}
                />
              </div>

              {bookSearch && !isEdit && (
                <div className="staff-library-mini-table">
                  <table>
                    <tbody>
                      {filteredBookSuggestions.map((book) => (
                        <tr
                          key={book._id}
                          onClick={() => {
                            setFormData({ ...formData, book: book._id });
                            setBookSearch(`${book.title} - ${book.bookNo}`);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{book.bookNo}</td>
                          <td>{book.title}</td>
                          <td>{book.openQuantity || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="staff-library-input-box">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />

                <FiCalendar className="staff-library-input-icon-right" />
              </div>

              <div className="staff-library-mini-table">
                <table>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>BOOK</th>
                      <th>QTY</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>{bookSearch || "Select Book"}</td>

                      <td>
                        <input
                          type="number"
                          name="qty"
                          placeholder="0"
                          value={formData.qty}
                          onChange={(e) =>
                            setFormData({ ...formData, qty: e.target.value })
                          }
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

export default DamageBook;