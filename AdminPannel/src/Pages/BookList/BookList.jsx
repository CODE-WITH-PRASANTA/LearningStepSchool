import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { FaPlus, FaTrash, FaSearch, FaTimes } from "react-icons/fa";

import "./BookList.css";

const BookList = () => {
  const [activeTab, setActiveTab] = useState("author");

  const [authors, setAuthors] = useState([]);
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fines, setFines] = useState([]);

  const [authorModal, setAuthorModal] = useState(false);
  const [authorName, setAuthorName] = useState("");

  const [publicationModal, setPublicationModal] = useState(false);
  const [publicationName, setPublicationName] = useState("");

  const [categoryModal, setCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [fineModal, setFineModal] = useState(false);
  const [fineData, setFineData] = useState({
    amount: "",
    duration: "",
    gst: "",
  });

  useEffect(() => {
    fetchAuthors();
    fetchPublications();
    fetchCategories();
    fetchFines();
  }, []);

  const fetchAuthors = async () => {
    try {
      const res = await API.get("/book-master/authors");
      setAuthors(res.data.data || []);
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

  const fetchCategories = async () => {
    try {
      const res = await API.get("/book-master/book-categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFines = async () => {
    try {
      const res = await API.get("/book-master/fines");
      setFines(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD FUNCTIONS ================= */

  const addAuthor = async () => {
    if (!authorName.trim()) return;

    await API.post("/book-master/authors", {
      name: authorName,
    });

    setAuthorName("");
    setAuthorModal(false);
    fetchAuthors();
  };

  const addPublication = async () => {
    if (!publicationName.trim()) return;

    await API.post("/book-master/publications", {
      name: publicationName,
    });

    setPublicationName("");
    setPublicationModal(false);
    fetchPublications();
  };

  const addCategory = async () => {
    if (!categoryName.trim()) return;

    await API.post("/book-master/book-categories", {
      name: categoryName,
    });

    setCategoryName("");
    setCategoryModal(false);
    fetchCategories();
  };

  const addFine = async () => {
    if (!fineData.amount || !fineData.duration || fineData.gst === "") return;

    await API.post("/book-master/fines", {
      amount: Number(fineData.amount),
      duration: Number(fineData.duration),
      gst: Number(fineData.gst),
    });

    setFineData({
      amount: "",
      duration: "",
      gst: "",
    });

    setFineModal(false);
    fetchFines();
  };

  /* ================= DELETE ================= */

  const deleteAuthor = async (id) => {
    await API.delete(`/book-master/authors/${id}`);
    fetchAuthors();
  };
  
  const deletePublication = async (id) => {
    await API.delete(`/book-master/publications/${id}`);
    fetchPublications();
  };
  
  const deleteCategory = async (id) => {
    await API.delete(`/book-master/book-categories/${id}`);
    fetchCategories();
  };
  
  const deleteFine = async (id) => {
    await API.delete(`/book-master/fines/${id}`);
    fetchFines();
  };

  return (
    <div className="booklist-page">
      {/* ================= TABS ================= */}

      <div className="booklist-tabs">
        <button
          className={`booklist-tab-btn ${
            activeTab === "author" ? "active" : ""
          }`}
          onClick={() => setActiveTab("author")}
        >
          Author
        </button>

        <button
          className={`booklist-tab-btn ${
            activeTab === "publication" ? "active" : ""
          }`}
          onClick={() => setActiveTab("publication")}
        >
          Publication
        </button>

        <button
          className={`booklist-tab-btn ${
            activeTab === "category" ? "active" : ""
          }`}
          onClick={() => setActiveTab("category")}
        >
          Category
        </button>

        <button
          className={`booklist-tab-btn ${activeTab === "fine" ? "active" : ""}`}
          onClick={() => setActiveTab("fine")}
        >
          Set Fine
        </button>
      </div>

      {/* ================= AUTHOR ================= */}

      {activeTab === "author" && (
        <div className="booklist-section">
          <div className="booklist-topbar">
            <div className="booklist-search">
              <FaSearch />
              <input type="text" placeholder="Search..." />
            </div>

            <button
              className="booklist-add-btn"
              onClick={() => setAuthorModal(true)}
            >
              <FaPlus />
            </button>
          </div>

          <div className="booklist-table-wrapper">
            <table className="booklist-table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>AUTHOR</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {authors.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() => deleteAuthor(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="booklist-pagination">
              <div className="booklist-pagination-left">
                <span>Items per page:</span>

                <select>
                  <option>50</option>
                  <option>25</option>
                  <option>10</option>
                </select>
              </div>

              <div className="booklist-pagination-right">
                <span>
                  1 – {authors.length} of {authors.length}
                </span>

                <button>{"<"}</button>

                <button>{">"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PUBLICATION ================= */}

      {activeTab === "publication" && (
        <div className="booklist-section">
          <div className="booklist-topbar">
            <div className="booklist-search">
              <FaSearch />
              <input type="text" placeholder="Search..." />
            </div>

            <button
              className="booklist-add-btn"
              onClick={() => setPublicationModal(true)}
            >
              <FaPlus />
            </button>
          </div>

          <div className="booklist-table-wrapper">
            <table className="booklist-table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>PUBLICATION NAME</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {publications.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() => deletePublication(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="booklist-pagination">
              <div className="booklist-pagination-left">
                <span>Items per page:</span>

                <select>
                  <option>50</option>
                  <option>25</option>
                  <option>10</option>
                </select>
              </div>

              <div className="booklist-pagination-right">
                <span>
                  1 – {publications.length} of {publications.length}
                </span>

                <button>{"<"}</button>

                <button>{">"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CATEGORY ================= */}

      {activeTab === "category" && (
        <div className="booklist-section">
          <div className="booklist-topbar">
            <div className="booklist-search">
              <FaSearch />
              <input type="text" placeholder="Search..." />
            </div>

            <button
              className="booklist-add-btn"
              onClick={() => setCategoryModal(true)}
            >
              <FaPlus />
            </button>
          </div>

          <div className="booklist-table-wrapper">
            <table className="booklist-table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>CATEGORY NAME</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() => deleteCategory(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="booklist-pagination">
              <div className="booklist-pagination-left">
                <span>Items per page:</span>

                <select>
                  <option>50</option>
                  <option>25</option>
                  <option>10</option>
                </select>
              </div>

              <div className="booklist-pagination-right">
                <span>
                  1 – {categories.length} of {categories.length}
                </span>

                <button>{"<"}</button>

                <button>{">"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= FINE ================= */}

      {activeTab === "fine" && (
        <div className="booklist-section">
          <div className="booklist-topbar">
            <div className="booklist-search">
              <FaSearch />
              <input type="text" placeholder="Search..." />
            </div>

            <button
              className="booklist-add-btn"
              onClick={() => setFineModal(true)}
            >
              <FaPlus />
            </button>
          </div>

          <div className="booklist-table-wrapper">
            <table className="booklist-table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>FINE AMOUNT</th>
                  <th>FINE DURATION</th>
                  <th>GST %</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {fines.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>

                    <td>{item.amount}</td>

                    <td>{item.duration}</td>

                    <td>{item.gst}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() => deleteFine(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="booklist-pagination">
              <div className="booklist-pagination-left">
                <span>Items per page:</span>

                <select>
                  <option>50</option>
                  <option>25</option>
                  <option>10</option>
                </select>
              </div>

              <div className="booklist-pagination-right">
                <span>
                  1 – {fines.length} of {fines.length}
                </span>

                <button>{"<"}</button>

                <button>{">"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= AUTHOR MODAL ================= */}

      {authorModal && (
        <div className="booklist-modal-overlay">
          <div className="booklist-modal">
            <div className="booklist-modal-header">
              <h2>AUTHOR MASTER</h2>

              <button
                className="booklist-close-btn"
                onClick={() => setAuthorModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="booklist-modal-body">
              <input
                type="text"
                placeholder="Author Name*"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>

            <div className="booklist-modal-footer">
              <button
                className="booklist-cancel-btn"
                onClick={() => setAuthorModal(false)}
              >
                Cancel
              </button>

              <button className="booklist-submit-btn" onClick={addAuthor}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PUBLICATION MODAL ================= */}

      {publicationModal && (
        <div className="booklist-modal-overlay">
          <div className="booklist-modal">
            <div className="booklist-modal-header">
              <h2>PUBLICATION MASTER</h2>

              <button
                className="booklist-close-btn"
                onClick={() => setPublicationModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="booklist-modal-body">
              <input
                type="text"
                placeholder="Publication Name*"
                value={publicationName}
                onChange={(e) => setPublicationName(e.target.value)}
              />
            </div>

            <div className="booklist-modal-footer">
              <button
                className="booklist-cancel-btn"
                onClick={() => setPublicationModal(false)}
              >
                Cancel
              </button>

              <button className="booklist-submit-btn" onClick={addPublication}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CATEGORY MODAL ================= */}

      {categoryModal && (
        <div className="booklist-modal-overlay">
          <div className="booklist-modal">
            <div className="booklist-modal-header">
              <h2>CATEGORY MASTER</h2>

              <button
                className="booklist-close-btn"
                onClick={() => setCategoryModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="booklist-modal-body">
              <input
                type="text"
                placeholder="Category Name*"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            <div className="booklist-modal-footer">
              <button
                className="booklist-cancel-btn"
                onClick={() => setCategoryModal(false)}
              >
                Cancel
              </button>

              <button className="booklist-submit-btn" onClick={addCategory}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FINE MODAL ================= */}

      {fineModal && (
        <div className="booklist-modal-overlay">
          <div className="booklist-modal">
            <div className="booklist-modal-header">
              <h2>SET FINE</h2>

              <button
                className="booklist-close-btn"
                onClick={() => setFineModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="booklist-modal-body">
              <input
                type="number"
                placeholder="Fine Amount"
                value={fineData.amount}
                onChange={(e) =>
                  setFineData({
                    ...fineData,
                    amount: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Fine Duration"
                value={fineData.duration}
                onChange={(e) =>
                  setFineData({
                    ...fineData,
                    duration: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="GST %"
                value={fineData.gst}
                onChange={(e) =>
                  setFineData({
                    ...fineData,
                    gst: e.target.value,
                  })
                }
              />
            </div>

            <div className="booklist-modal-footer">
              <button
                className="booklist-cancel-btn"
                onClick={() => setFineModal(false)}
              >
                Cancel
              </button>

              <button className="booklist-submit-btn" onClick={addFine}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
