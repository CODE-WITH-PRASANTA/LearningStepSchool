import React, { useState } from "react";
import "./PostalDispatch.css";

export default function PostalDispatch() {

  const rowsPerPage = 7;

  const [form, setForm] = useState({
    toTitle: "",
    fromTitle: "",
    referenceNo: "",
    date: "",
    note: "",
    address: "",
    attachment: null,
  });

  /* ✅ DUMMY DATA ADDED */
  const [records, setRecords] = useState([
    { toTitle:"Principal", fromTitle:"Office", referenceNo:"REF001", date:"2024-01-10"},
    { toTitle:"Admin", fromTitle:"HR", referenceNo:"REF002", date:"2024-01-11"},
    { toTitle:"Accounts", fromTitle:"Office", referenceNo:"REF003", date:"2024-01-12"},
    { toTitle:"Library", fromTitle:"Admin", referenceNo:"REF004", date:"2024-01-13"},
    { toTitle:"Transport", fromTitle:"Office", referenceNo:"REF005", date:"2024-01-14"},
    { toTitle:"Hostel", fromTitle:"Admin", referenceNo:"REF006", date:"2024-01-15"},
    { toTitle:"Exam Cell", fromTitle:"Office", referenceNo:"REF007", date:"2024-01-16"},
    { toTitle:"Sports", fromTitle:"Admin", referenceNo:"REF008", date:"2024-01-17"},
    { toTitle:"Lab", fromTitle:"Office", referenceNo:"REF009", date:"2024-01-18"},
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(records[index]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.toTitle || !form.fromTitle || !form.referenceNo || !form.date) {
      alert("Please fill all required fields");
      return;
    }

    if (editIndex !== null) {
      const update = [...records];
      update[editIndex] = form;
      setRecords(update);
      setEditIndex(null);
    } else {
      setRecords([...records, form]);
    }

    setForm({
      toTitle: "",
      fromTitle: "",
      referenceNo: "",
      date: "",
      note: "",
      address: "",
      attachment: null,
    });
  };

  const filteredRecords = records.filter(
    (rec) =>
      rec.toTitle?.toLowerCase().includes(search.toLowerCase()) ||
      rec.fromTitle?.toLowerCase().includes(search.toLowerCase()) ||
      rec.referenceNo?.toLowerCase().includes(search.toLowerCase())
  );

  /* ✅ PAGINATION */
  const start = (page - 1) * rowsPerPage;
  const paginated = filteredRecords.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

  return (
    <div className="pd-main-wrapper">
      <h1 className="pd-main-heading">Postal Dispatch</h1>

      <div className="pd-container">

        {/* FORM */}
        <form className="pd-form" onSubmit={handleSubmit}>
          <h2 className="pd-title">{editIndex !== null ? "Edit Data" : "Add Dispatch"}</h2>

          <div className="pd-form-body">

            <label>To Title *</label>
            <input className="pd-input" value={form.toTitle} onChange={(e)=>setForm({...form,toTitle:e.target.value})}/>

            <label>From Title *</label>
            <input className="pd-input" value={form.fromTitle} onChange={(e)=>setForm({...form,fromTitle:e.target.value})}/>

            <label>Reference No *</label>
            <input className="pd-input" value={form.referenceNo} onChange={(e)=>setForm({...form,referenceNo:e.target.value})}/>

            <label>Date *</label>
            <input type="date" className="pd-input" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})}/>

            <label>Note</label>
            <textarea className="pd-textarea" value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})}/>

            <label>Address</label>
            <textarea className="pd-textarea" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})}/>

            <label>Attachment</label>
            <input type="file" className="pd-input" onChange={(e)=>setForm({...form,attachment:e.target.files[0]})}/>

            <button type="submit" className="pd-submit-btn">
              {editIndex !== null ? "Update" : "Submit"}
            </button>

          </div>
        </form>

        {/* TABLE */}
        <div className="pd-table-box">
          <h2 className="pd-title">Postal Dispatch List</h2>

          <div className="pd-table-inner">

            <div className="pd-table-scroll">
              <table className="pd-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>To Title</th>
                    <th>Reference No</th>
                    <th>From Title</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((rec)=>{
                    const realIndex = records.indexOf(rec);
                    return (
                      <tr key={realIndex}>
                        <td>{realIndex+1}</td>
                        <td>{rec.toTitle}</td>
                        <td>{rec.referenceNo}</td>
                        <td>{rec.fromTitle}</td>
                        <td>{rec.date}</td>
                        <td>
                          <button className="pd-edit" onClick={()=>handleEdit(realIndex)}>Edit</button>
                          <button className="pd-delete" onClick={()=>setRecords(records.filter((_,idx)=>idx!==realIndex))}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ✅ PAGINATION UI */}
            <div className="pd-pagination">
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
              {Array.from({length: totalPages},(_,i)=>(
                <button key={i} className={page===i+1?"active":""} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
              <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>

            <p className="pd-footer">
              Showing {filteredRecords.length} of {records.length} entries
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}