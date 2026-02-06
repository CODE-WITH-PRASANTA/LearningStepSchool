import React, { useState } from "react";

const GatePassList = ({ data, onDelete, onPrint }) => {
  const [openId, setOpenId] = useState(null);
  const [page, setPage] = useState(1);

  const perPage = 5;
  const pages = Math.ceil(data.length / perPage);

  const visible = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="gatepass-list-card">
      <h3>Gate Pass List</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Person</th>
            <th>Image</th>
            <th>In</th>
            <th>Out</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {visible.map((item, i) => (
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td>{item.student}</td>
              <td>{item.person}</td>
              <td>
                {item.image && (
                  <img className="table-img" src={item.image} alt="" />
                )}
              </td>
              <td>{item.inTime}</td>
              <td>{item.outTime}</td>
              <td>{item.note}</td>

              <td className="action-cell">
                <button
                  className="btn-action"
                  onClick={() =>
                    setOpenId(openId === item.id ? null : item.id)
                  }
                >
                  Action ▾
                </button>

                {openId === item.id && (
                  <div className="action-menu">
                    <button onClick={() => alert("Edit Coming Soon")}>
                      ✏ Edit
                    </button>
                    <button onClick={() => onPrint(item)}>🖨 Print</button>
                    <button onClick={() => onDelete(item.id)}>🗑 Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        {[...Array(pages)].map((_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button disabled={page === pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default GatePassList;
