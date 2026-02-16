import React, { useState } from "react";

const PER_PAGE = 5;

const SectionList = ({ data, onEdit }) => {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);

  const totalPages = Math.ceil(data.length / PER_PAGE);
  const visible = data.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <div className="section-card section-table-card">
      <div className="section-card-header">
        📋 Section List
      </div>

      <div className="section-table-scroll">
        <table className="section-table">
          <thead>
            <tr>
              <th className="left">SECTION</th>
              <th className="center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                <td className="left">{row.name}</td>
                <td className="center">
                  <div className="action-box">
                    <button
                      className="action-btn"
                      onClick={() =>
                        setOpenId(
                          openId === row.id ? null : row.id
                        )
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
    </div>
  );
};

export default SectionList;
