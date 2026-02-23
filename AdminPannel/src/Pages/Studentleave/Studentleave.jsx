import React, { useState, useEffect } from "react";
import "./Studentleave.css";

const Studentleave = () => {

  const [search,setSearch] = useState("");
  const [openMenu,setOpenMenu] = useState(null);
  const [currentPage,setCurrentPage] = useState(1);

  const rowsPerPage = 4;

  const [rows,setRows] = useState([
    { name:"Karan Aswani", class:"6th-A", apply:"18-01-2026", days:"1 Day", leave:"19-01-2026 - 19-01-2026", status:"Approved", reply:"leave approved", description:"bimar"},
    { name:"Test Student NCT", class:"9th-A", apply:"17-01-2026", days:"1 Day", leave:"17-01-2026 - 17-01-2026", status:"Approved", reply:"", description:"wdw"},
    { name:"New Student", class:"1st-A", apply:"20-12-2025", days:"1 Day", leave:"26-12-2025 - 26-12-2025", status:"Approved", reply:"Ndw", description:"test"},
    { name:"Karan Sharma", class:"6th-A", apply:"09-12-2025", days:"3 Days", leave:"22-12-2025 - 24-12-2025", status:"Approved", reply:"Ok Approved", description:"Due to family function"},
    { name:"testg", class:"3rd-A", apply:"09-12-2025", days:"1 Day", leave:"09-12-2025 - 09-12-2025", status:"Approved", reply:"", description:"test"},
    { name:"Karan Aswani", class:"6th-A", apply:"08-12-2025", days:"4 Days", leave:"08-12-2025 - 11-12-2025", status:"Approved", reply:"", description:"sick"}
  ]);

  /* CLOSE DROPDOWN CLICK OUTSIDE */
  useEffect(()=>{
    const closeMenu=()=>setOpenMenu(null);
    document.addEventListener("click",closeMenu);
    return ()=>document.removeEventListener("click",closeMenu);
  },[]);

  /* SEARCH */
  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const start = (currentPage-1)*rowsPerPage;
  const currentRows = filtered.slice(start,start+rowsPerPage);

  /* ACTIONS */
  const handleDelete = (index)=>{
    setRows(rows.filter((_,i)=>i!==index));
  };

  const handleEdit = (row)=>{
    alert("Edit : "+row.name);
  };

  return (
    <div className="Studentleave-container">

      {/* HEADER */}
      <div className="Studentleave-header">
        <h2>📋 Student Leave List</h2>
        <button className="Studentleave-addBtn">Add Leave</button>
      </div>

      {/* TOOLBAR */}
      <div className="Studentleave-toolbar">
        <div></div>
        <div className="Studentleave-search">
          <select><option>10</option></select>
          <label>
            Search :
            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* TABLE */}
      <div className="Studentleave-tableWrapper">
        <table className="Studentleave-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>CLASS</th>
              <th>APPLY DATE</th>
              <th>NO OF DAYS</th>
              <th>LEAVE DATE</th>
              <th>STATUS</th>
              <th>REPLY</th>
              <th>DESCRIPTION</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.map((row,i)=>(
              <tr key={i}>
                <td>{row.name}</td>
                <td>{row.class}</td>
                <td>{row.apply}</td>
                <td>{row.days}</td>
                <td>{row.leave}</td>
                <td className="Studentleave-statusGreen">{row.status}</td>
                <td>{row.reply}</td>
                <td>{row.description}</td>

                {/* ACTION BUTTON */}
                <td className="Studentleave-actionCell">
                  <div
                    className="Studentleave-actionWrap"
                    onClick={(e)=>e.stopPropagation()}
                  >
                    <button
                      className="Studentleave-actionBtn"
                      onClick={()=>setOpenMenu(openMenu===i?null:i)}
                    >
                      Action ▾
                    </button>

                    {openMenu===i && (
                      <div className="Studentleave-dropdown">
                        <button onClick={()=>handleEdit(row)}>✏ Edit</button>
                        <button className="delete"
                          onClick={()=>handleDelete(i)}>
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
      {/* ===== PAGINATION ===== */}
<div className="Studentleave-pagination">

  <button
    className="pagination-btn"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(p => p - 1)}
  >
    Previous
  </button>

  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      className={`pagination-number ${
        currentPage === i + 1 ? "active" : ""
      }`}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button
    className="pagination-btn"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(p => p + 1)}
  >
    Next
  </button>

</div>

    </div>
  );
};

export default Studentleave;
