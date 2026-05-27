import React, { useState, useEffect, useRef } from "react";
import "./ReturnBook.css";

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

  const data = [
    {
      sno: 1,
      adm: "ADM101",
      sr: 136,
      student: "Ankush",
      class: "1st-A",
      fine: "₹0",
      qty: 1,
      date: "03-06-2026",
    },
    {
      sno: 2,
      adm: "ADM102",
      sr: 122,
      student: "Madhav",
      class: "1st-A",
      fine: "₹20",
      qty: 1,
      date: "19-02-2026",
    },
    {
      sno: 3,
      adm: "ADM103",
      sr: 155,
      student: "Mahi Yadav",
      class: "1st-A",
      fine: "₹0",
      qty: 1,
      date: "03-06-2026",
    },
  ];

  useEffect(() => {
    const close = (e) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(e.target)
      ) {
        setOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () =>
      document.removeEventListener(
        "mousedown",
        close
      );
  }, []);

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentData = data.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div className="returnBook">

        <div className="returnBook__top">

          <div className="returnBook__search">
            <FiSearch />

            <input
              placeholder="Search student, admission no..."
            />
          </div>

          <div className="returnBook__actions">

            <div
              className="returnBook__filterWrap"
              ref={filterRef}
            >

              <button
                className="returnBook__filterBtn"
                onClick={() =>
                  setOpenFilter(!openFilter)
                }
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
              onClick={() =>
                setOpenModal(true)
              }
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

                {currentData.map((item) => (
                  <tr key={item.sno}>

                    {columns.sno && (
                      <td>{item.sno}</td>
                    )}

                    {columns.adm && (
                      <td>
                        <span className="returnBook__adm">
                          {item.adm}
                        </span>
                      </td>
                    )}

                    {columns.sr && (
                      <td>{item.sr}</td>
                    )}

                    {columns.student && (
                      <td className="returnBook__student">
                        {item.student}
                      </td>
                    )}

                    {columns.class && (
                      <td>
                        <span className="returnBook__class">
                          {item.class}
                        </span>
                      </td>
                    )}

                    {columns.fine && (
                      <td>
                        <span className="returnBook__fine">
                          {item.fine}
                        </span>
                      </td>
                    )}

                    {columns.qty && (
                      <td>{item.qty}</td>
                    )}

                    {columns.date && (
                      <td>{item.date}</td>
                    )}

                    {columns.action && (
                      <td>
                        <button className="returnBook__delete">
                          <FiTrash2 />
                        </button>
                      </td>
                    )}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          <div className="returnBook__pagination">

            <div className="returnBook__pageLeft">

              <span>
                Items per page
              </span>

              <select
                value={itemsPerPage}
                onChange={(e) =>
                  setItemsPerPage(Number(e.target.value))
                }
              >
                <option>3</option>
                <option>5</option>
              </select>

            </div>

            <div className="returnBook__pageRight">

              <button>
                <FiChevronLeft />
              </button>

              <button className="activePage">
                1
              </button>

              <button>
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
                Add Return Book
              </h2>

              <button
                className="returnBookModal__close"
                onClick={() =>
                  setOpenModal(false)
                }
              >
                <FiX />
              </button>

            </div>

            <div className="returnBookModal__search">
              <FiSearch />
              <input placeholder="Search Student" />
            </div>

            <div className="returnBookModal__search">
              <FiSearch />
              <input placeholder="Search Book" />
            </div>

            <div className="returnBookModal__footer">

              <button className="returnBookModal__cancel">
                Cancel
              </button>

              <button className="returnBookModal__add">
                Add Return
              </button>

            </div>

          </div>

        </div>

      )}
    </>
  );
};

export default ReturnBook;