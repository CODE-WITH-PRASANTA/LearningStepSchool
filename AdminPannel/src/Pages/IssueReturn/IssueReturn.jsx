import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "./IssueReturn.css";

import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const IssueReturn = () => {
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [columns, setColumns] = useState({
    sno: true,
    bookNo: true,
    title: true,
    author: true,
    publication: true,
    category: true,
    edition: true,
    action: true,
  });

  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publications, setPublications] = useState([]);

  const [formData, setFormData] = useState({
    bookNo: "",
    barcode: "",
    title: "",
    author: "",
    category: "",
    publication: "",
    edition: "",
    volume: "",
    className: "",
    subject: "",
    openQuantity: "",
    reorder: "",
    rate: "",
    remark: "",
    pdf: false,
    audio: false,
    video: false,
  });

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchCategories();
    fetchPublications();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await API.get("/book-master/authors");
      setAuthors(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/book-master/book-categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPublications = async () => {
    try {
      const res = await API.get("/book-master/publications");
      setPublications(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const toggleColumn = (key) => {
    setColumns({
      ...columns,
      [key]: !columns[key],
    });
  };

  const addBook = async () => {
    if (
      !formData.bookNo ||
      !formData.title ||
      !formData.author ||
      !formData.category ||
      !formData.publication ||
      !formData.subject ||
      !formData.rate
    ) {
      alert("Please fill required fields");
      return;
    }

    try {
      await API.post("/books", {
        ...formData,
        openQuantity: Number(formData.openQuantity || 0),
        reorder: Number(formData.reorder || 0),
        rate: Number(formData.rate),
      });

      setFormData({
        bookNo: "",
        barcode: "",
        title: "",
        author: "",
        category: "",
        publication: "",
        edition: "",
        volume: "",
        className: "",
        subject: "",
        openQuantity: "",
        reorder: "",
        rate: "",
        remark: "",
        pdf: false,
        audio: false,
        video: false,
      });

      setShowForm(false);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <div className="issueReturn">
      {/* ================= HEADER ================= */}

      <div className="issueReturnHeader">
        <div className="issueReturnSearch">
          <FiSearch />

          <input type="text" placeholder="Search books..." />
        </div>

        <div className="issueReturnActionArea">
          <button
            className="issueReturnFilterBtn"
            onClick={() => setShowFilter(true)}
          >
            <FiFilter />
          </button>

          <button
            className="issueReturnAddBtn"
            onClick={() => setShowForm(true)}
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="issueReturnTableWrap">
        <div className="issueReturnMobileHint">
          ← Scroll Horizontally To View Full Table →
        </div>

        <div className="issueReturnTableScroll">
          <table className="issueReturnTable">
            <thead>
              <tr>
                {columns.sno && <th>S.NO.</th>}
                {columns.bookNo && <th>BOOK NO</th>}
                {columns.title && <th>BOOK TITLE</th>}
                {columns.author && <th>AUTHOR</th>}
                {columns.publication && <th>PUBLICATION</th>}
                {columns.category && <th>CATEGORY</th>}
                {columns.edition && <th>EDITION</th>}
                {columns.action && <th>ACTION</th>}
              </tr>
            </thead>

            <tbody>
              {books.map((item, index) => (
                <tr key={item._id}>
                  {columns.sno && <td>{index + 1}</td>}

                  {columns.bookNo && <td>{item.bookNo}</td>}

                  {columns.title && <td>{item.title}</td>}

                  {columns.author && <td>{item.author}</td>}

                  {columns.publication && <td>{item.publication}</td>}

                  {columns.category && <td>{item.category}</td>}

                  {columns.edition && <td>{item.edition}</td>}

                  {columns.action && (
                    <td>
                      <button
                        className="issueReturnDelete"
                        onClick={() => deleteBook(item._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}

        <div className="issueReturnPagination">
          <div className="issueReturnPageLeft">
            <span>Items per page</span>

            <select>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>

          <div className="issueReturnPageRight">
            <span>
              1 - {books.length} of {books.length}
            </span>

            <button>
              <FiChevronLeft />
            </button>

            <button>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}

      {showForm && (
        <div className="issueReturnModal">
          <div className="issueReturnModalBox">
            <div className="issueReturnModalHead">
              <h2>BOOK MASTER</h2>

              <button onClick={() => setShowForm(false)}>
                <FiX />
              </button>
            </div>

            <div className="issueReturnFormGrid">
              <input
                name="bookNo"
                value={formData.bookNo}
                onChange={handleChange}
                placeholder="Book No*"
              />

              <input
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Barcode"
              />

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Book Name*"
              />

              <select
                name="author"
                value={formData.author}
                onChange={handleChange}
              >
                <option value="">Select Author</option>
                {authors.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                name="publication"
                value={formData.publication}
                onChange={handleChange}
              >
                <option value="">Select Publication</option>
                {publications.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                placeholder="Edition"
              />

              <input
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                placeholder="Volume"
              />

              <input
                name="className"
                value={formData.className}
                onChange={handleChange}
                placeholder="Class"
              />

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject*"
              />

              <input
                type="number"
                name="openQuantity"
                value={formData.openQuantity}
                onChange={handleChange}
                placeholder="Open Quantity"
              />

              <input
                type="number"
                name="reorder"
                value={formData.reorder}
                onChange={handleChange}
                placeholder="Re-order"
              />

              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                placeholder="Rate*"
              />

              <input
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="Remark"
              />
            </div>

            <div className="issueReturnChecks">
              <label>
                <input
                  type="checkbox"
                  name="pdf"
                  checked={formData.pdf}
                  onChange={handleChange}
                />
                PDF
              </label>

              <label>
                <input
                  type="checkbox"
                  name="audio"
                  checked={formData.audio}
                  onChange={handleChange}
                />
                Audio
              </label>

              <label>
                <input
                  type="checkbox"
                  name="video"
                  checked={formData.video}
                  onChange={handleChange}
                />
                Video
              </label>
            </div>

            <div className="issueReturnButtons">
              <button className="cancelBtn" onClick={() => setShowForm(false)}>
                Cancel
              </button>

              <button className="saveBtn" onClick={addBook}>
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FILTER MODAL ================= */}

      {showFilter && (
        <div className="issueReturnModal">
          <div className="issueReturnFilterBox">
            <div className="issueReturnModalHead">
              <h3>Show / Hide Columns</h3>

              <button onClick={() => setShowFilter(false)}>
                <FiX />
              </button>
            </div>

            <div className="issueReturnFilterGrid">
              {Object.keys(columns).map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={columns[item]}
                    onChange={() => toggleColumn(item)}
                  />

                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueReturn;
