import React, { useState } from "react";
import "./AddStudent.css";

import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const AddStudent = () => {

  const [openModal, setOpenModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const data = [
    {
      sno: 1,
      student: "Madhav",
      class: "1st-A",
      returnDate: "12-02-2026",
      books: 1,
    },
    {
      sno: 2,
      student: "Madhav",
      class: "1st-A",
      returnDate: "19-02-2026",
      books: 1,
    },
    {
      sno: 3,
      student: "Ankush mjif mriiumt",
      class: "1st-A",
      returnDate: "27-05-2026",
      books: 1,
    },
    {
      sno: 4,
      student: "Rakesh",
      class: "2nd-A",
      returnDate: "10-06-2026",
      books: 2,
    },
  ];

  const totalPages = Math.ceil(
    data.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="addStudent">

        {/* TOPBAR */}

        <div className="addStudent__topbar">

          <div className="addStudent__search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search..."
            />

          </div>

          <button
            className="addStudent__addBtn"
            onClick={() =>
              setOpenModal(true)
            }
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

                {currentData.map((item) => (

                  <tr key={item.sno}>

                    <td>{item.sno}</td>

                    <td className="addStudent__student">
                      {item.student}
                    </td>

                    <td>
                      <span className="addStudent__class">
                        {item.class}
                      </span>
                    </td>

                    <td>{item.returnDate}</td>

                    <td>{item.books}</td>

                    <td>

                      <button className="addStudent__delete">

                        <FiTrash2 />

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}

          <div className="addStudent__pagination">

            <div className="addStudent__pageLeft">

              <span>
                Items per page
              </span>

              <select>
                <option>3</option>
                <option>5</option>
                <option>10</option>
              </select>

            </div>

            <div className="addStudent__pageRight">

              <span>
                {startIndex + 1} -
                {" "}
                {Math.min(
                  startIndex + itemsPerPage,
                  data.length
                )}
                {" "}of{" "}
                {data.length}
              </span>

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                <FiChevronLeft />
              </button>

              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
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

              <h2>
                RETURN BOOK
              </h2>

              <button
                className="addStudentModal__close"
                onClick={() =>
                  setOpenModal(false)
                }
              >
                <FiX />
              </button>

            </div>

            <div className="addStudentModal__search">

              <FiSearch />

              <input
                type="text"
                placeholder="Search"
              />

            </div>

            <div className="addStudentModal__inputs">

              <input
                type="text"
                placeholder="Total Fine"
              />

              <input
                type="text"
                placeholder="Paid"
              />

              <input
                type="text"
                placeholder="Discount"
              />

            </div>

            <div className="addStudentModal__tableWrap">

              <table className="addStudentModal__table">

                <thead>

                  <tr>

                    <th>S.NO.</th>
                    <th>BOOK NO</th>
                    <th>BOOK TITLE</th>
                    <th>QUANTITY</th>
                    <th>ISSUE DATE</th>
                    <th>RETURN DATE</th>
                    <th>ACTUAL RETURN DATE</th>
                    <th>FINE AMT.</th>

                  </tr>

                </thead>

              </table>

            </div>

            <div className="addStudentModal__footer">

              <button className="addStudentModal__cancel">
                Cancel
              </button>

              <button className="addStudentModal__add">
                Add
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};

export default AddStudent;