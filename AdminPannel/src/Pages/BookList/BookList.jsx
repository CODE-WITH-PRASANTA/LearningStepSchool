import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import "./BookList.css";

const BookList = () => {
  const [activeTab, setActiveTab] = useState("author");

  /* ================= AUTHOR ================= */

  const [authors, setAuthors] = useState([
    { id: 1, name: "Test" },
    { id: 2, name: "Demo" },
    { id: 3, name: "Test02" },
  ]);

  const [authorModal, setAuthorModal] = useState(false);
  const [authorName, setAuthorName] = useState("");

  /* ================= PUBLICATION ================= */

  const [publications, setPublications] = useState([
    { id: 1, name: "publisher 1" },
  ]);

  const [publicationModal, setPublicationModal] =
    useState(false);

  const [publicationName, setPublicationName] =
    useState("");

  /* ================= CATEGORY ================= */

  const [categories, setCategories] = useState([
    { id: 1, name: "category 1" },
  ]);

  const [categoryModal, setCategoryModal] =
    useState(false);

  const [categoryName, setCategoryName] =
    useState("");

  /* ================= FINE ================= */

  const [fines, setFines] = useState([
    {
      id: 1,
      amount: 50,
      duration: 7,
      gst: 0,
    },
  ]);

  const [fineModal, setFineModal] = useState(false);

  const [fineData, setFineData] = useState({
    amount: "",
    duration: "",
    gst: "",
  });

  /* ================= ADD FUNCTIONS ================= */

  const addAuthor = () => {
    if (!authorName.trim()) return;

    setAuthors([
      ...authors,
      {
        id: Date.now(),
        name: authorName,
      },
    ]);

    setAuthorName("");
    setAuthorModal(false);
  };

  const addPublication = () => {
    if (!publicationName.trim()) return;

    setPublications([
      ...publications,
      {
        id: Date.now(),
        name: publicationName,
      },
    ]);

    setPublicationName("");
    setPublicationModal(false);
  };

  const addCategory = () => {
    if (!categoryName.trim()) return;

    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: categoryName,
      },
    ]);

    setCategoryName("");
    setCategoryModal(false);
  };

  const addFine = () => {
    if (
      !fineData.amount ||
      !fineData.duration ||
      fineData.gst === ""
    )
      return;

    setFines([
      ...fines,
      {
        id: Date.now(),
        amount: fineData.amount,
        duration: fineData.duration,
        gst: fineData.gst,
      },
    ]);

    setFineData({
      amount: "",
      duration: "",
      gst: "",
    });

    setFineModal(false);
  };

  /* ================= DELETE ================= */

  const deleteAuthor = (id) => {
    setAuthors(authors.filter((item) => item.id !== id));
  };

  const deletePublication = (id) => {
    setPublications(
      publications.filter((item) => item.id !== id)
    );
  };

  const deleteCategory = (id) => {
    setCategories(
      categories.filter((item) => item.id !== id)
    );
  };

  const deleteFine = (id) => {
    setFines(fines.filter((item) => item.id !== id));
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
            activeTab === "publication"
              ? "active"
              : ""
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
          className={`booklist-tab-btn ${
            activeTab === "fine" ? "active" : ""
          }`}
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
              <input
                type="text"
                placeholder="Search..."
              />
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
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() =>
                          deleteAuthor(item.id)
                        }
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
                  1 – {authors.length} of{" "}
                  {authors.length}
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
              <input
                type="text"
                placeholder="Search..."
              />
            </div>

            <button
              className="booklist-add-btn"
              onClick={() =>
                setPublicationModal(true)
              }
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
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() =>
                          deletePublication(item.id)
                        }
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
                  1 – {publications.length} of{" "}
                  {publications.length}
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
              <input
                type="text"
                placeholder="Search..."
              />
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
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>{item.name}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() =>
                          deleteCategory(item.id)
                        }
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
                  1 – {categories.length} of{" "}
                  {categories.length}
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
              <input
                type="text"
                placeholder="Search..."
              />
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
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>{item.amount}</td>

                    <td>{item.duration}</td>

                    <td>{item.gst}</td>

                    <td>
                      <button
                        className="booklist-delete-btn"
                        onClick={() =>
                          deleteFine(item.id)
                        }
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
                  1 – {fines.length} of{" "}
                  {fines.length}
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
                onClick={() =>
                  setAuthorModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="booklist-modal-body">

              <input
                type="text"
                placeholder="Author Name*"
                value={authorName}
                onChange={(e) =>
                  setAuthorName(e.target.value)
                }
              />

            </div>

            <div className="booklist-modal-footer">

              <button
                className="booklist-cancel-btn"
                onClick={() =>
                  setAuthorModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="booklist-submit-btn"
                onClick={addAuthor}
              >
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
                onClick={() =>
                  setPublicationModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="booklist-modal-body">

              <input
                type="text"
                placeholder="Publication Name*"
                value={publicationName}
                onChange={(e) =>
                  setPublicationName(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="booklist-modal-footer">

              <button
                className="booklist-cancel-btn"
                onClick={() =>
                  setPublicationModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="booklist-submit-btn"
                onClick={addPublication}
              >
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
                onClick={() =>
                  setCategoryModal(false)
                }
              >
                <FaTimes />
              </button>

            </div>

            <div className="booklist-modal-body">

              <input
                type="text"
                placeholder="Category Name*"
                value={categoryName}
                onChange={(e) =>
                  setCategoryName(
                    e.target.value
                  )
                }
              />

            </div>

            <div className="booklist-modal-footer">

              <button
                className="booklist-cancel-btn"
                onClick={() =>
                  setCategoryModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="booklist-submit-btn"
                onClick={addCategory}
              >
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
                onClick={() =>
                  setFineModal(false)
                }
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
                onClick={() =>
                  setFineModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="booklist-submit-btn"
                onClick={addFine}
              >
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