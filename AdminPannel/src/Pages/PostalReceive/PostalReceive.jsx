import React, { useState } from "react";
import "./PostalReceive.css";

export default function PostalReceive() {

  const rowsPerPage = 5;

  const [form, setForm] = useState({
    fromTitle: "",
    toTitle: "",
    referenceNo: "",
    date: "",
    note: "",
    address: "",
    attachment: null,
  });

  /* ✅ dummy data */
  const [records, setRecords] = useState([
    {fromTitle:"Office",toTitle:"Principal",referenceNo:"PR001",date:"2024-01-10"},
    {fromTitle:"Courier",toTitle:"Admin",referenceNo:"PR002",date:"2024-01-11"},
    {fromTitle:"Bank",toTitle:"Accounts",referenceNo:"PR003",date:"2024-01-12"},
    {fromTitle:"Board",toTitle:"Exam Cell",referenceNo:"PR004",date:"2024-01-13"},
    {fromTitle:"Vendor",toTitle:"Store",referenceNo:"PR005",date:"2024-01-14"},
    {fromTitle:"Parent",toTitle:"Office",referenceNo:"PR006",date:"2024-01-15"},
    {fromTitle:"Govt",toTitle:"Principal",referenceNo:"PR007",date:"2024-01-16"},
    {fromTitle:"Transport",toTitle:"Office",referenceNo:"PR008",date:"2024-01-17"},
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

    if (!form.fromTitle || !form.toTitle || !form.referenceNo || !form.date) {
      alert("Please fill required fields");
      return;
    }

    if (editIndex !== null) {
      const updated = [...records];
      updated[editIndex] = form;
      setRecords(updated);
      setEditIndex(null);
    } else {
      setRecords([...records, form]);
    }

    setForm({
      fromTitle:"",
      toTitle:"",
      referenceNo:"",
      date:"",
      note:"",
      address:"",
      attachment:null
    });
  };

  const filteredRecords = records.filter(
    rec =>
      rec.fromTitle?.toLowerCase().includes(search.toLowerCase()) ||
      rec.toTitle?.toLowerCase().includes(search.toLowerCase()) ||
      rec.referenceNo?.toLowerCase().includes(search.toLowerCase())
  );

  /* pagination */
  const start = (page-1)*rowsPerPage;
  const paginated = filteredRecords.slice(start,start+rowsPerPage);
  const totalPages = Math.ceil(filteredRecords.length/rowsPerPage);

  return (
    <div className="pr-wrapper">

      <h1 className="pr-heading">Postal Receive</h1>

      <div className="pr-grid">

        {/* FORM */}
        <form className="pr-card pr-form" onSubmit={handleSubmit}>
          <h2 className="pr-card-title">{editIndex!==null?"Update Details":"Add Receive"}</h2>

          <div className="pr-form-body">

            <label>From Title *</label>
            <input className="pr-input" value={form.fromTitle} onChange={e=>setForm({...form,fromTitle:e.target.value})}/>

            <label>To Title *</label>
            <input className="pr-input" value={form.toTitle} onChange={e=>setForm({...form,toTitle:e.target.value})}/>

            <label>Reference No *</label>
            <input className="pr-input" value={form.referenceNo} onChange={e=>setForm({...form,referenceNo:e.target.value})}/>

            <label>Date *</label>
            <input type="date" className="pr-input" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>

            <label>Note</label>
            <textarea className="pr-textarea" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>

            <label>Address</label>
            <textarea className="pr-textarea" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>

            <label>Attachment</label>
            <input type="file" className="pr-input" onChange={e=>setForm({...form,attachment:e.target.files[0]})}/>

            <button className="pr-btn">{editIndex!==null?"Update":"Submit"}</button>

          </div>
        </form>

        {/* TABLE */}
        <div className="pr-card pr-table-card">
          <h2 className="pr-card-title">Postal Receive List</h2>

          <div className="pr-table-inner">

            <input
              className="pr-search-input"
              placeholder="Search entries..."
              value={search}
              onChange={e=>{setSearch(e.target.value);setPage(1);}}
            />

            <div className="pr-table-scroll">
              <table className="pr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>From</th>
                    <th>Reference</th>
                    <th>To</th>
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
                        <td>{rec.fromTitle}</td>
                        <td>{rec.referenceNo}</td>
                        <td>{rec.toTitle}</td>
                        <td>{rec.date}</td>
                        <td>
                          <button className="pr-edit" onClick={()=>handleEdit(realIndex)}>Edit</button>
                          <button className="pr-delete" onClick={()=>setRecords(records.filter((_,idx)=>idx!==realIndex))}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pr-pagination">
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
              {Array.from({length:totalPages},(_,i)=>(
                <button key={i} className={page===i+1?"active":""} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
              <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}