import React, { useState, useEffect } from "react";
import "./FeeCollection.css";
import {
  FiMoreVertical,
  FiSearch,
  FiChevronDown,
  FiDownload,
  FiX
} from "react-icons/fi";

const FeeCollection = () => {

const students = [
{ id:1, admission:"AD52365", name:"Kathryn Murphy", roll:"12", class:"Class 1 (A)", amount:700.5, paid:700.5, due:0, date:"12 May 2025", status:"Paid"},
{ id:2, admission:"AD52366", name:"Jerome Bell", roll:"08", class:"Class 2 (B)", amount:850, paid:450, due:400, date:"10 May 2025", status:"Partial"},
{ id:3, admission:"AD52367", name:"Theresa Webb", roll:"19", class:"Class 3 (A)", amount:920.75, paid:0, due:920.75, date:"08 May 2025", status:"Unpaid"},
{ id:4, admission:"AD52368", name:"Cody Fisher", roll:"10", class:"Class 4 (C)", amount:750, paid:750, due:0, date:"05 May 2025", status:"Paid"},
{ id:5, admission:"AD52369", name:"Annette Black", roll:"16", class:"Class 5 (B)", amount:630.2, paid:500, due:130.2, date:"03 May 2025", status:"Partial"},
{ id:6, admission:"AD52365", name:"Kathryn Murphy", roll:"12", class:"Class 1 (A)", amount:700.5, paid:700.5, due:0, date:"12 May 2025", status:"Paid"},
{ id:7, admission:"AD52366", name:"Jerome Bell", roll:"08", class:"Class 2 (B)", amount:850, paid:450, due:400, date:"10 May 2025", status:"Partial"},
{ id:8, admission:"AD52367", name:"Theresa Webb", roll:"19", class:"Class 3 (A)", amount:920.75, paid:0, due:920.75, date:"08 May 2025", status:"Unpaid"},
{ id:9, admission:"AD52368", name:"Cody Fisher", roll:"10", class:"Class 4 (C)", amount:750, paid:750, due:0, date:"05 May 2025", status:"Paid"},
{ id:10, admission:"AD52369", name:"Annette Black", roll:"16", class:"Class 5 (B)", amount:630.2, paid:500, due:130.2, date:"03 May 2025", status:"Partial"},
{ id:1, admission:"AD52365", name:"Kathryn Murphy", roll:"12", class:"Class 1 (A)", amount:700.5, paid:700.5, due:0, date:"12 May 2025", status:"Paid"},
{ id:2, admission:"AD52366", name:"Jerome Bell", roll:"08", class:"Class 2 (B)", amount:850, paid:450, due:400, date:"10 May 2025", status:"Partial"},
{ id:3, admission:"AD52367", name:"Theresa Webb", roll:"19", class:"Class 3 (A)", amount:920.75, paid:0, due:920.75, date:"08 May 2025", status:"Unpaid"},
{ id:4, admission:"AD52368", name:"Cody Fisher", roll:"10", class:"Class 4 (C)", amount:750, paid:750, due:0, date:"05 May 2025", status:"Paid"},
{ id:5, admission:"AD52369", name:"Annette Black", roll:"16", class:"Class 5 (B)", amount:630.2, paid:500, due:130.2, date:"03 May 2025", status:"Partial"},
];

const [page,setPage] = useState(1);
const [showCollect,setShowCollect] = useState(false);
const [showReceipt,setShowReceipt] = useState(false);
const [activeMenu,setActiveMenu] = useState(null);
const [exportMenu,setExportMenu] = useState(false);

const rowsPerPage = 5;
const indexLast = page * rowsPerPage;
const indexFirst = indexLast - rowsPerPage;
const currentRows = students.slice(indexFirst,indexLast);
const totalPages = Math.ceil(students.length / rowsPerPage);

useEffect(()=>{
if(showCollect || showReceipt){
document.body.style.overflow="hidden";
}else{
document.body.style.overflow="auto";
}
},[showCollect,showReceipt]);

return (

<div className="FeeCollection">

{/* HEADER */}

<div className="FeeCollection-header">

<div>
<h2>Fees Collect</h2>
<p>Dashboard / Fees Collect</p>
</div>

<button
className="FeeCollection-collectBtn"
onClick={()=>setShowCollect(true)}
>
Collect Fees
</button>

</div>


{/* TOOLBAR */}

<div className="FeeCollection-toolbar">

<div className="FeeCollection-exportWrapper">



</div>

<div className="FeeCollection-search">
<FiSearch/>
<input placeholder="Search..." />
</div>

<button className="FeeCollection-filterBtn">
Filter <FiChevronDown/>
</button>

</div>


{/* TABLE */}

<div className="FeeCollection-tableWrapper">

<table className="FeeCollection-table">

<thead>
<tr>
<th>S.L</th>
<th>Admission No</th>
<th>Name</th>
<th>Roll</th>
<th>Class</th>
<th>Amount</th>
<th>Paid</th>
<th>Due</th>
<th>Date</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{currentRows.map((s,i)=>(
<tr key={s.id}>

<td>{i+1}</td>
<td className="FeeCollection-admission">{s.admission}</td>
<td>{s.name}</td>
<td>{s.roll}</td>
<td>{s.class}</td>
<td>${s.amount}</td>
<td>${s.paid}</td>
<td>${s.due}</td>
<td>{s.date}</td>

<td>
<span className={`FeeCollection-status ${s.status}`}>
{s.status}
</span>
</td>

<td>

<div className="FeeCollection-actionWrapper">

<button
className="FeeCollection-actionBtn"
onClick={()=>setActiveMenu(activeMenu===s.id ? null : s.id)}
>
<FiMoreVertical/>
</button>

{activeMenu===s.id && (

<div className="FeeCollection-actionDropdown">

<button
onClick={()=>{
setShowReceipt(true);
setActiveMenu(null);
}}
>
View Details
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

<div className="FeeCollection-pagination">

<button disabled={page===1} onClick={()=>setPage(page-1)}>
{"<"}
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
{">"}
</button>

</div>


{/* COLLECT FEES MODAL */}

{showCollect && (

<div className="FeeCollection-modal">

<div className="FeeCollection-modalContent">

<FiX
className="close"
onClick={()=>setShowCollect(false)}
/>

<h3>Collect Fees</h3>

<div className="FeeCollection-formGrid">

<select>
<option>Select Class</option>
<option>Class 1</option>
<option>Class 2</option>
</select>

<select>
<option>Select Section</option>
<option>A</option>
<option>B</option>
</select>

<input placeholder="Roll No"/>
<input type="date"/>
<input placeholder="$1500"/>

<select>
<option>Select Discount</option>
<option>10%</option>
</select>

<select>
<option>Cash</option>
<option>Card</option>
<option>Bank</option>
</select>

<textarea placeholder="Note"></textarea>

</div>

<div className="FeeCollection-formBtns">

<button className="cancel"
onClick={()=>setShowCollect(false)}>
Cancel
</button>

<button className="save">
Save
</button>

</div>

</div>

</div>

)}


{/* RECEIPT POPUP */}

{showReceipt && (

<div className="FeeCollection-receiptModal">

<div className="FeeCollection-receipt">

<FiX
className="close"
onClick={()=>setShowReceipt(false)}
/>

<h2>School Name</h2>

<p>Smithbroad, Unit 4, Holler Tower, San Diego</p>

<div className="FeeCollection-receiptInfo">

<div>
<p><b>Student Name :</b> Jon Deve</p>
<p><b>Class :</b> 5(A)</p>
<p><b>Roll No :</b> 10</p>
</div>

<div>
<p><b>Date :</b> 15 Jan 2025</p>
<p><b>Collected By :</b> Admin</p>
<p><b>Payment By :</b> Bank</p>
</div>

</div>

<table>
{/* 
<thead>
<tr>
<th>Amount</th>
<th>Paid</th>
<th>Balance</th>
</tr>
</thead> */}

{/* <tbody>
<tr>
<td>2500</td>
<td>$1500</td>
<td>$500</td>
</tr>
</tbody> */}

</table>

<h3>Thanks</h3>

<small>
This receipt is computer generated hence no signature required
</small>

</div>

</div>

)}

</div>
);
};

export default FeeCollection;