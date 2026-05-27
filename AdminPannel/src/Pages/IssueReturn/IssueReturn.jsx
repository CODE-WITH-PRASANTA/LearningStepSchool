import React, { useState } from "react";
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

  const tableData = [
    {
      id: 1,
      bookNo: "1111",
      title: "My Book",
      author: "Test",
      publication: "Publisher 1",
      category: "Category 1",
      edition: "14",
    },
    {
      id: 2,
      bookNo: "1122",
      title: "UAB Infosol",
      author: "Demo",
      publication: "Publisher 1",
      category: "Category 1",
      edition: "xyz",
    },
    {
      id: 3,
      bookNo: "123",
      title: "Book Demo",
      author: "Test02",
      publication: "Publisher 1",
      category: "Category 1",
      edition: "sdasdd",
    },
  ];

  const toggleColumn = (key) => {
    setColumns({
      ...columns,
      [key]: !columns[key],
    });
  };

  return (
    <div className="issueReturn">

      {/* ================= HEADER ================= */}

      <div className="issueReturnHeader">

        <div className="issueReturnSearch">

          <FiSearch />

          <input
            type="text"
            placeholder="Search books..."
          />

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
                {columns.publication && (
                  <th>PUBLICATION</th>
                )}
                {columns.category && <th>CATEGORY</th>}
                {columns.edition && <th>EDITION</th>}
                {columns.action && <th>ACTION</th>}

              </tr>

            </thead>

            <tbody>

              {tableData.map((item, index) => (

                <tr key={item.id}>

                  {columns.sno && (
                    <td>{index + 1}</td>
                  )}

                  {columns.bookNo && (
                    <td>{item.bookNo}</td>
                  )}

                  {columns.title && (
                    <td>{item.title}</td>
                  )}

                  {columns.author && (
                    <td>{item.author}</td>
                  )}

                  {columns.publication && (
                    <td>{item.publication}</td>
                  )}

                  {columns.category && (
                    <td>{item.category}</td>
                  )}

                  {columns.edition && (
                    <td>{item.edition}</td>
                  )}

                  {columns.action && (

                    <td>

                      <button className="issueReturnDelete">

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

            <span>1 - 3 of 3</span>

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

              <button
                onClick={() => setShowForm(false)}
              >
                <FiX />
              </button>

            </div>

            <div className="issueReturnFormGrid">

              <input placeholder="Book No*" />
              <input placeholder="Barcode" />

              <input placeholder="Book Name*" />

              <select>
                <option>Select Author</option>
                <option>Test</option>
                <option>Demo</option>
                <option>Test02</option>
              </select>

              <select>
                <option>Select Category</option>
                <option>Category 1</option>
                <option>Category 2</option>
              </select>

              <select>
                <option>Select Publication</option>
                <option>Publisher 1</option>
                <option>Publisher 2</option>
              </select>

              <input placeholder="Edition" />
              <input placeholder="Volume" />

              <input placeholder="Class" />
              <input placeholder="Subject*" />

              <input placeholder="Open Quantity" />
              <input placeholder="Re-order" />

              <input placeholder="Rate*" />
              <input placeholder="Remark" />

            </div>

            <div className="issueReturnChecks">

              <label>
                <input type="checkbox" />
                PDF
              </label>

              <label>
                <input type="checkbox" />
                Audio
              </label>

              <label>
                <input type="checkbox" />
                Video
              </label>

            </div>

            <div className="issueReturnButtons">

              <button
                className="cancelBtn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button className="saveBtn">
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

              <button
                onClick={() => setShowFilter(false)}
              >
                <FiX />
              </button>

            </div>

            <div className="issueReturnFilterGrid">

              {Object.keys(columns).map((item) => (

                <label key={item}>

                  <input
                    type="checkbox"
                    checked={columns[item]}
                    onChange={() =>
                      toggleColumn(item)
                    }
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