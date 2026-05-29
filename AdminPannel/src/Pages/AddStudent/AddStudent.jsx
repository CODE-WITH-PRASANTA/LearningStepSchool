import React, { useState, useEffect } from "react";
import "./AddStudent.css";
import API from "../../api/axios";

import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const returnBook = () => {
  const [openModal, setOpenModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [editId, setEditId] = useState(null);

  const [issueBooks, setIssueBooks] = useState([]);
  const [returnBooks, setReturnBooks] = useState([]);
  const [selectedIssueBook, setSelectedIssueBook] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [fine, setFine] = useState("");
  const [paid, setPaid] = useState("");
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    fetchIssueBooks();
    fetchReturnBooks();
  }, []);

  const fetchIssueBooks = async () => {
    const res = await API.get("/issue-books");
    setIssueBooks(
      (res.data.data || []).filter((item) => item.status === "issued"),
    );
  };

  const fetchReturnBooks = async () => {
    const res = await API.get("/return-books");
    setReturnBooks(res.data.data || []);
  };

  const openEditReturn = (item) => {
    setEditId(item._id);

    setFine(item.fine ?? "");
    setPaid(item.paid ?? "");
    setDiscount(item.discount ?? "");

    setSelectedIssueBook(item.issueBook || null);

    const studentName = `${item.student?.firstName || ""} ${
      item.student?.lastName || ""
    }`;

    setSearchText(studentName.trim());

    setOpenModal(true);
  };

  const saveReturnBook = async () => {
    try {
      if (!editId && !selectedIssueBook) {
        alert("Please select issued book");
        return;
      }

      if (editId) {
        await API.put(`/return-books/${editId}`, {
          fine: Number(fine || 0),
          paid: Number(paid || 0),
          discount: Number(discount || 0),
        });
      } else {
        await API.post("/return-books", {
          issueBook: selectedIssueBook._id,
          fine: Number(fine || 0),
          paid: Number(paid || 0),
          discount: Number(discount || 0),
        });
      }

      setOpenModal(false);
      setEditId(null);
      setSelectedIssueBook(null);
      setSearchText("");
      setFine("");
      setPaid("");
      setDiscount("");

      fetchIssueBooks();
      fetchReturnBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save return book");
    }
  };

  const deleteReturnBook = async (id) => {
    if (!window.confirm("Delete this return record?")) return;

    try {
      await API.delete(`/return-books/${id}`);
      fetchReturnBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const totalPages = Math.ceil(returnBooks.length / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = returnBooks.slice(startIndex, startIndex + itemsPerPage);

  const filteredIssueBooks = issueBooks.filter((item) => {
    const search = searchText.toLowerCase();

    const studentName = `${item.student?.firstName || ""} ${
      item.student?.lastName || ""
    }`;

    return (
      studentName.toLowerCase().includes(search) ||
      item.student?.admissionNo?.toLowerCase().includes(search) ||
      item.book?.bookNo?.toLowerCase().includes(search) ||
      item.book?.title?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div className="addStudent">
        {/* TOPBAR */}

        <div className="addStudent__topbar">
          <div className="addStudent__search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search issued book"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <button
            className="addStudent__addBtn"
            onClick={() => {
              setEditId(null);
              setSelectedIssueBook(null);
              setSearchText("");
              setFine("");
              setPaid("");
              setDiscount("");
              setOpenModal(true);
            }}
          >
            <FiPlus />
          </button>
        </div>

        {/* TABLE */}

        <div className="addStudent__tableCard">
          <div className="addStudent__tableWrap">
            <table className="addStudent__table">
              <thead>
                <tr>
                  <th>S.NO.</th>
                  <th>STUDENT</th>
                  <th>CLASS</th>
                  <th>ACTUAL RETURN DATE</th>
                  <th>NO OF BOOK</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      No return books found
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item._id} onClick={() => openEditReturn(item)}>
                      <td>{startIndex + index + 1}</td>

                      <td className="addStudent__student">
                        {item.student?.firstName} {item.student?.lastName}
                      </td>

                      <td>
                        <span className="addStudent__class">
                          {item.student?.className ||
                            item.student?.class ||
                            "-"}
                        </span>
                      </td>

                      <td>{new Date(item.returnDate).toLocaleDateString()}</td>

                      <td>1</td>

                      <td>
                        <button
                          className="addStudent__delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReturnBook(item._id);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}

          <div className="addStudent__pagination">
            <div className="addStudent__pageLeft">
              <span>Items per page</span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>

            <div className="addStudent__pageRight">
              <span>
                {returnBooks.length === 0
                  ? "0 - 0"
                  : `${startIndex + 1} - ${Math.min(
                      startIndex + itemsPerPage,
                      returnBooks.length,
                    )}`}{" "}
                of {returnBooks.length}
              </span>

              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <FiChevronLeft />
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}

      {openModal && (
        <div className="addStudentModal">
          <div className="addStudentModal__box">
            <div className="addStudentModal__header">
              <h2>{editId ? "EDIT RETURN BOOK" : "RETURN BOOK"}</h2>

              <button
                className="addStudentModal__close"
                onClick={() => setOpenModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="addStudentModal__search">
              <FiSearch />

              <input
                type="text"
                placeholder="Search student name / admission no"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setSelectedIssueBook(null);
                }}
              />
            </div>

            <div className="addStudentModal__inputs">
              <input
                type="number"
                placeholder="Total Fine"
                value={fine}
                onChange={(e) => setFine(e.target.value)}
              />

              <input
                type="number"
                placeholder="Paid"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
              />

              <input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="addStudentModal__tableWrap">
              <table className="addStudentModal__table">
                <thead>
                  <tr>
                    <th>S.NO.</th>
                    <th>STUDENT</th>
                    <th>CLASS</th>
                    <th>BOOK NO</th>
                    <th>BOOK TITLE</th>
                    <th>QUANTITY</th>
                    <th>ISSUE DATE</th>
                    <th>RETURN DATE</th>
                    <th>ACTUAL RETURN DATE</th>
                    <th>FINE AMT.</th>
                  </tr>
                </thead>
                <tbody>
                  {!searchText ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Search student name to show issued books
                      </td>
                    </tr>
                  ) : filteredIssueBooks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No issued book found
                      </td>
                    </tr>
                  ) : (
                    filteredIssueBooks.map((item, index) => (
                      <tr
                        key={item._id}
                        onClick={() => {
                          setSelectedIssueBook(item);
                          setFine(item.fine || 0);
                        }}
                        style={{
                          cursor: "pointer",
                          background:
                            selectedIssueBook?._id === item._id
                              ? "#e8f0ff"
                              : "transparent",
                        }}
                      >
                        <td>{index + 1}</td>

                        <td>
                          {item.student?.firstName || ""}{" "}
                          {item.student?.lastName || ""}
                        </td>

                        <td>
                          {item.student?.className ||
                            item.student?.class ||
                            "-"}
                        </td>

                        <td>{item.book?.bookNo}</td>
                        <td>{item.book?.title}</td>
                        <td>{item.qty || 1}</td>
                        <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                        <td>-</td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td>₹{item.fine || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="addStudentModal__footer">
              <button
                className="addStudentModal__cancel"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>

              <button className="addStudentModal__add" onClick={saveReturnBook}>
                {editId ? "Update" : "Return Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default returnBook;
