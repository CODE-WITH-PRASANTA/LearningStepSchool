import React, { useState } from "react";

const GatePassList = ({ onDelete, onPrint, onEdit }) => {

  /* ✅ DUMMY DATA */
  const [data, setData] = useState([
    { id:1, name:"Rahul", person:"Father", startDate:"2024-01-01", endDate:"2024-01-01", inTime:"09:00", outTime:"12:00", note:"Doctor visit", image:null },
    { id:2, name:"Amit", person:"Mother", startDate:"2024-01-02", endDate:"2024-01-02", inTime:"10:00", outTime:"01:00", note:"Home work", image:null },
    { id:3, name:"Riya", person:"Brother", startDate:"2024-01-03", endDate:"2024-01-03", inTime:"11:00", outTime:"02:00", note:"Family function", image:null },
    { id:4, name:"Karan", person:"Uncle", startDate:"2024-01-04", endDate:"2024-01-04", inTime:"09:30", outTime:"12:30", note:"Medical", image:null },
    { id:5, name:"Pooja", person:"Mother", startDate:"2024-01-05", endDate:"2024-01-05", inTime:"10:30", outTime:"01:30", note:"Personal", image:null },
    { id:6, name:"Sneha", person:"Father", startDate:"2024-01-06", endDate:"2024-01-06", inTime:"09:15", outTime:"12:15", note:"Exam", image:null },
    { id:7, name:"Vikram", person:"Brother", startDate:"2024-01-07", endDate:"2024-01-07", inTime:"10:45", outTime:"01:45", note:"Work", image:null },
    { id:8, name:"Anjali", person:"Mother", startDate:"2024-01-08", endDate:"2024-01-08", inTime:"11:15", outTime:"02:15", note:"Emergency", image:null }
  ]);

  const [openAction, setOpenAction] = useState(null);
  const [page, setPage] = useState(1);

  /* ✅ PAGINATION 5 ROWS */
  const rowsPerPage = 5;
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

            {visibleRows.map((item, index) => (
              <tr key={item.id}>
                <td>{startIndex + index + 1}</td>
                <td>{item.name}</td>
                <td>{item.person || "-"}</td>

                <td>
                  {item.image ? (
                    <img src={item.image} className="table-img" alt="pass" />
                  ) : "-"}
                </td>

                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.inTime}</td>
                <td>{item.outTime}</td>
                <td>{item.note}</td>

                <td className="action-cell">

                  <button
                    className="btn-action"
                    onClick={() => toggleAction(item.id)}
                  >
                    Action 
                  </button>

                  {openAction === item.id && (
                    <div className="action-menu">

                      <button className="action-item">✏ Edit</button>
                      <button className="action-item">🖨 Print</button>

                      <button
                        className="action-item delete-btn"
                        onClick={() => {
                          setData(data.filter(d => d.id !== item.id));
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination">

            <button disabled={page===1} onClick={()=>setPage(page-1)}>
              Prev
            </button>

            {[...Array(totalPages)].map((_,i)=>(
              <button
                key={i}
                className={page===i+1 ? "active":""}
                onClick={()=>setPage(i+1)}
              >
                {i+1}
              </button>
            ))}

            <button disabled={page===totalPages} onClick={()=>setPage(page+1)}>
              Next
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default GatePassList;