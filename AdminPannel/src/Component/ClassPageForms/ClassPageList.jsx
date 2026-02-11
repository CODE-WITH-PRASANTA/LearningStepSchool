import React, { useState } from "react";

const PER_PAGE = 5;

const ClassPageList = ({ data, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);

  const totalPages = Math.ceil(data.length / PER_PAGE);
  const visible = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="class-card class-table-card">
      <div className="class-card-header">📋 Class List</div>

      <div className="class-table-scroll">
        <table className="class-table">
          <thead>
            <tr>
              <th className="col-center">SR. NO</th>
              <th className="col-left">GROUP NAME</th>
              <th className="col-center">CLASS</th>
              <th className="col-left">SECTION</th>
              <th className="col-center">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                <td className="col-center">{row.srNo}</td>
                <td className="col-left">{row.group}</td>
                <td className="col-center">{row.className}</td>
                <td className="col-left">{row.section}</td>
                <td className="col-center">
                  <div className="action-box">
                    <button
                      className="action-btn"
                      onClick={() =>
                        setOpenId(openId === row.id ? null : row.id)
                      }
                    >
                      Action ▾
                    </button>

                    {openId === row.id && (
                      <div className="action-menu">
                        <button
                          onClick={() => {
                            onEdit(row);
                            setOpenId(null);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete"
                          onClick={() => onDelete(row.id)}
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
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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
    </div>
  );
};

export default ClassPageList;
