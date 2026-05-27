import React, { useState, useEffect, useRef } from "react";
import "./ReturnBook.css";
import API from "../../api/axios";

import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiX,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const ReturnBook = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const filterRef = useRef(null);

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedBook, setSelectedBook] = useState("");

  const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);
  const [showBookSuggestions, setShowBookSuggestions] = useState(false);

  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [issueBooks, setIssueBooks] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data || res.data.students || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await API.get("/books");
      setBooks(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchBooks();
    fetchIssueBooks();
  }, []);

  const fetchIssueBooks = async () => {
    try {
      const res = await API.get("/issue-books");
      setIssueBooks(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const addIssueBook = async () => {
    if (!selectedStudent || !selectedBook) {
      alert("Please select student and book");
      return;
    }

    await API.post("/issue-books", {
      student: selectedStudent,
      book: selectedBook,
      qty: 1,
    });

    setSelectedStudent("");
    setSelectedBook("");
    setStudentSearch("");
    setBookSearch("");
    setOpenModal(false);
    fetchIssueBooks();
  };

  const [columns, setColumns] = useState({
    sno: true,
    adm: true,
    sr: true,
    student: true,
    class: true,
    fine: true,
    qty: true,
    date: true,
    action: true,
  });

  useEffect(() => {
    const close = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = issueBooks.slice(startIndex, startIndex + itemsPerPage);

  const filteredStudents = students.filter((student) => {
    const name = `${student.firstName || ""} ${student.lastName || ""}`;
    const admissionNo = student.admissionNo || "";

    return (
      name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      admissionNo.toLowerCase().includes(studentSearch.toLowerCase())
    );
  });

  const filteredBooks = books.filter((book) => {
    const title = book.title || "";
    const bookNo = book.bookNo || "";

    return (
      title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      bookNo.toLowerCase().includes(bookSearch.toLowerCase())
    );
  });

  return (
    <>
      <div className="returnBook">
        <div className="returnBook__top">
          <div className="returnBook__search">
            <FiSearch />

            <input placeholder="Search student, admission no..." />
          </div>

          <div className="returnBook__actions">
            <div className="returnBook__filterWrap" ref={filterRef}>
              <button
                className="returnBook__filterBtn"
                onClick={() => setOpenFilter(!openFilter)}
              >
                <FiFilter />
              </button>

              {openFilter && (
                <div className="returnBook__filterDropdown">
                  <div className="returnBook__filterGrid">
                    <label>
                      <input
                        type="checkbox"
                        checked={columns.sno}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            sno: !columns.sno,
                          })
                        }
                      />
                      S.No.
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.adm}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            adm: !columns.adm,
                          })
                        }
                      />
                      Adm.No
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.sr}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            sr: !columns.sr,
                          })
                        }
                      />
                      Sr.No
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.student}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            student: !columns.student,
                          })
                        }
                      />
                      Student
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.class}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            class: !columns.class,
                          })
                        }
                      />
                      Class
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.fine}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            fine: !columns.fine,
                          })
                        }
                      />
                      Fine
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.qty}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            qty: !columns.qty,
                          })
                        }
                      />
                      Qty
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.date}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            date: !columns.date,
                          })
                        }
                      />
                      Return Date
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={columns.action}
                        onChange={() =>
                          setColumns({
                            ...columns,
                            action: !columns.action,
                          })
                        }
                      />
                      Action
                    </label>
                  </div>
                </div>
              )}
            </div>

            <button
              className="returnBook__addBtn"
              onClick={() => setOpenModal(true)}
            >
              <FiPlus />
            </button>
          </div>
        </div>

        <div className="returnBook__tableCard">
          <div className="returnBook__tableWrap">
            <table className="returnBook__table">
              <thead>
                <tr>
                  {columns.sno && <th>S.NO</th>}
                  {columns.adm && <th>ADM.NO</th>}
                  {columns.sr && <th>SR.NO</th>}
                  {columns.student && <th>STUDENT</th>}
                  {columns.class && <th>CLASS</th>}
                  {columns.fine && <th>FINE</th>}
                  {columns.qty && <th>QTY</th>}
                  {columns.date && <th>RETURN DATE</th>}
                  {columns.action && <th>ACTION</th>}
                </tr>
              </thead>

              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{ textAlign: "center", padding: "25px" }}
                    >
                      No issued books found
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item._id}>
                      {columns.sno && <td>{startIndex + index + 1}</td>}

                      {columns.adm && (
                        <td>
                          <span className="returnBook__adm">
                            {item.student?.admissionNo || "-"}
                          </span>
                        </td>
                      )}

                      {columns.sr && <td>{item.book?.bookNo || "-"}</td>}

                      {columns.student && (
                        <td className="returnBook__student">
                          {item.student?.firstName || ""}{" "}
                          {item.student?.lastName || ""}
                        </td>
                      )}

                      {columns.class && (
                        <td>
                          <span className="returnBook__class">
                            {item.student?.className ||
                              item.student?.class ||
                              "-"}
                          </span>
                        </td>
                      )}

                      {columns.fine && (
                        <td>
                          <span className="returnBook__fine">
                            ₹{item.fine || 0}
                          </span>
                        </td>
                      )}

                      {columns.qty && <td>{item.qty || 1}</td>}

                      {columns.date && (
                        <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                      )}

                      {columns.action && (
                        <td>
                          <button className="returnBook__delete">
                            <FiTrash2 />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="returnBook__pagination">
            <div className="returnBook__pageLeft">
              <span>Items per page</span>

              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option>3</option>
                <option>5</option>
              </select>
            </div>

            <div className="returnBook__pageRight">
              <button className="returnBook__pageBtn">
                <FiChevronLeft />
              </button>

              <button className="activePage">1</button>

              <button className="returnBook__pageBtn">
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="returnBookModal">
          <div className="returnBookModal__box">
            <div className="returnBookModal__header">
              <h2>
                Issue Book
              </h2>

              <button
                className="returnBookModal__close"
                onClick={() => setOpenModal(false)}
              >
                <FiX />
              </button>
            </div>

            {/* STUDENT SEARCH SUGGESTION */}
            <div className="returnBookModal__searchBox">
              <FiSearch />

              <input
                type="text"
                placeholder="Search student name or admission no"
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setShowStudentSuggestions(true);
                }}
                onFocus={() => setShowStudentSuggestions(true)}
              />

              {showStudentSuggestions && studentSearch && (
                <div className="returnBookModal__suggestions">
                  {filteredStudents.length === 0 ? (
                    <div className="returnBookModal__suggestionItem">
                      No student found
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student._id}
                        className="returnBookModal__suggestionItem"
                        onClick={() => {
                          setSelectedStudent(student._id);
                          setStudentSearch(
                            `${student.firstName || ""} ${student.lastName || ""} - ${
                              student.admissionNo || ""
                            }`,
                          );
                          setShowStudentSuggestions(false);
                        }}
                      >
                        {student.firstName} {student.lastName} -{" "}
                        {student.admissionNo}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* BOOK SEARCH SUGGESTION */}
            <div className="returnBookModal__searchBox">
              <FiSearch />

              <input
                type="text"
                placeholder="Search book title or book no"
                value={bookSearch}
                onChange={(e) => {
                  setBookSearch(e.target.value);
                  setShowBookSuggestions(true);
                }}
                onFocus={() => setShowBookSuggestions(true)}
              />

              {showBookSuggestions && bookSearch && (
                <div className="returnBookModal__suggestions">
                  {filteredBooks.length === 0 ? (
                    <div className="returnBookModal__suggestionItem">
                      No book found
                    </div>
                  ) : (
                    filteredBooks.map((book) => (
                      <div
                        key={book._id}
                        className="returnBookModal__suggestionItem"
                        onClick={() => {
                          setSelectedBook(book._id);
                          setBookSearch(`${book.title} - ${book.bookNo}`);
                          setShowBookSuggestions(false);
                        }}
                      >
                        {book.title} - {book.bookNo}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="returnBookModal__footer">
              <button
                className="returnBookModal__cancel"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>

              <button className="returnBookModal__add" onClick={addIssueBook}>
                Issue Book
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReturnBook;
