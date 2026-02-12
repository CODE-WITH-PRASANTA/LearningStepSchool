import React, { useState } from "react";

const PER_PAGE = 5;

const TeacherList = ({ data = [], onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);

  const totalPages = Math.ceil(data.length / PER_PAGE);

  const visibleData = data.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <div className="ct-card ct-table-card">
      {/* HEADER */}
      <div className="ct-card-header">
        📋 Assign Class Teacher List
      </div>

      {/* TABLE */}
      <div className="ct-table-scroll">
        <table className="ct-table">
          <thead>
            <tr>
              <th>CLASS</th>
              <th>SECTION</th>
              <th>CLASS TEACHER</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {visibleData.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No records found
                </td>
              </tr>
            )}

            {visibleData.map((row) => (
              <tr key={row.id}>
                <td>{row.className}</td>
                <td>{row.section}</td>
                <td>{row.teacher}</td>
                <td>
                  <div className="ct-action">
                    <button
                      className="ct-action-btn"
                      onClick={() =>
                        setOpenId(openId === row.id ? null : row.id)
                      }
                    >
                      Action <span className="caret">▼</span>
                    </button>

                    {openId === row.id && (
                      <div className="ct-action-menu">
                        <button
                          className="ct-menu-item"
                          onClick={() => {
                            onEdit(row);     // ✅ EDIT WORKS
                            setOpenId(null);
                          }}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="ct-menu-item delete"
                          onClick={() => {
                            onDelete(row.id); // ✅ DELETE WORKS
                            setOpenId(null);
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="ct-pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
