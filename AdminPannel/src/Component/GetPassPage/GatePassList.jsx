import React, { useState } from "react";

const GatePassList = ({ data, onDelete, onPrint, onEdit }) => {

  const [openAction, setOpenAction] = useState(null);
  const [page, setPage] = useState(1);

  const rowsPerPage = 8;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (page - 1) * rowsPerPage;
  const visibleRows = data.slice(startIndex, startIndex + rowsPerPage);

  const toggleAction = (id) => {
    setOpenAction(openAction === id ? null : id);
  };

  return (
    <div className="gatepass-list-card">

      <div className="card-header">Gate Pass List</div>

      <div className="list-body">

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Person Carrying</th>
              <th>Image</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>In Time</th>
              <th>Out Time</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {visibleRows.length === 0 && (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No Gate Pass Found
                </td>
              </tr>
            )}

            {visibleRows.map((item, index) => (
              <tr key={item.id}>

                <td>{startIndex + index + 1}</td>
                <td>{item.name}</td>
                <td>{item.person || "-"}</td>

                <td>
                  {item.image ? (
                    <img
                      src={item.image}
                      className="table-img"
                      alt="pass"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>{item.startDate || "-"}</td>
                <td>{item.endDate || "-"}</td>
                <td>{item.inTime || "-"}</td>
                <td>{item.outTime || "-"}</td>
                <td>{item.note || "-"}</td>

                {/* ===== ACTION ===== */}
                <td className="action-cell">

                  <button
                    className="btn-action"
                    onClick={() => toggleAction(item.id)}
                  >
                    Action ▾
                  </button>

                  {openAction === item.id && (
                    <div className="action-menu">

                      <button
                        className="action-item"
                        onClick={() => {
                          onEdit(item);
                          setOpenAction(null);
                        }}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="action-item"
                        onClick={() => {
                          onPrint(item);
                          setOpenAction(null);
                        }}
                      >
                        🖨 Print
                      </button>

                      <button
                        className="action-item delete-btn"
                        onClick={() => {
                          onDelete(item.id);
                          setOpenAction(null);
                        }}
                      >
                        🗑 Delete
                      </button>

                    </div>
                  )}

                </td>

              </tr>
            ))}

          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}

        {totalPages > 1 && (
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
        )}

      </div>
    </div>
  );
};

export default GatePassList;
