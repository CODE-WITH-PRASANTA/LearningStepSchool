import React, { useState, useEffect } from "react";
import "./FeeType.css";
import {
  FiMoreVertical,
  FiSearch,
  FiDownload,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiX
} from "react-icons/fi";

const FeeType = () => {

const [showModal,setShowModal] = useState(false);
const [editItem,setEditItem] = useState(null);
const [menuOpen,setMenuOpen] = useState(null);
const [page,setPage] = useState(1);

const rowsPerPage = 5;

const [data,setData] = useState([
{id:1,name:"May month fees",status:"Active"},
{id:2,name:"Admission fees",status:"Inactive"},
{id:3,name:"Exam fees",status:"Active"},
{id:4,name:"April month fees",status:"Inactive"},
{id:5,name:"March month fees",status:"Active"},
{id:6,name:"February month fees",status:"Inactive"},
{id:7,name:"January month fees",status:"Active"},
{id:8,name:"Library fees",status:"Inactive"},
{id:9,name:"Transport fees",status:"Active"}
]);

const totalPages = Math.ceil(data.length/rowsPerPage);
const indexLast = page*rowsPerPage;
const indexFirst = indexLast-rowsPerPage;
const currentRows = data.slice(indexFirst,indexLast);

const [form,setForm] = useState({
name:"",
status:"Active"
});


// ---------- ADD ----------

const openAdd = ()=>{
setEditItem(null);
setForm({
name:"",
status:"Active"
});
setShowModal(true);
};


// ---------- EDIT ----------

const openEdit = (item)=>{

setEditItem(item);

setForm({
name:item.name,
status:item.status
});

setShowModal(true);
setMenuOpen(null);

};


// ---------- DELETE ----------

const deleteRow = (id)=>{
setData(data.filter(d=>d.id!==id));
setMenuOpen(null);
};


// ---------- SAVE ----------

const saveData = ()=>{

if(editItem){

setData(
data.map(d=>
d.id===editItem.id
? {...d,name:form.name,status:form.status}
: d
)
);

}else{

setData([
...data,
{
id:Date.now(),
name:form.name,
status:form.status
}
]);

}

setShowModal(false);

};


return(

<div className="FeeType">

{/* HEADER */}

<div className="FeeType-header">

<div>
<h1>Fees Type</h1>

</div>

<button
className="FeeType-addBtn"
onClick={openAdd}
>
+ Add Fees Type
</button>

</div>





{/* TABLE */}

<div className="FeeType-tableWrapper">

<table className="FeeType-table">

<thead>
<tr>
<th>S.L</th>
<th>Name</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{currentRows.map((item,index)=>(

<tr key={item.id}>

<td>{indexFirst + index + 1}</td>

<td>{item.name}</td>

<td>
<span className={`FeeType-status ${item.status}`}>
{item.status}
</span>
</td>

<td>

<div className="FeeType-action">

<button
className="FeeType-actionBtn"
onClick={()=>setMenuOpen(menuOpen===item.id ? null : item.id)}
>
<FiMoreVertical/>
</button>

{menuOpen===item.id && (

<div className="FeeType-actionMenu">

<button
onClick={()=>openEdit(item)}
>
<FiEdit2/> Edit
</button>

<button
className="delete"
onClick={()=>deleteRow(item.id)}
>
<FiTrash2/> Delete
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

<div className="FeeType-pagination">

<button
className="FeeType-pageBtn"
disabled={page===1}
onClick={()=>setPage(page-1)}
>
‹
</button>

{[...Array(totalPages)].map((_,i)=>(
<button
key={i}
className={`FeeType-pageBtn ${page===i+1 ? "active":""}`}
onClick={()=>setPage(i+1)}
>
{i+1}
</button>
))}

<button
className="FeeType-pageBtn"
disabled={page===totalPages}
onClick={()=>setPage(page+1)}
>
›
</button>

</div>


{/* MODAL */}

{showModal && (

<div className="FeeType-modal">

<div className="FeeType-modalContent">

<FiX
className="close"
onClick={()=>setShowModal(false)}
/>

<h3>
{editItem ? "Edit Fees Type" : "Add New Fees Type"}
</h3>

<label>Fees Name</label>

<input
placeholder="Enter Fees Type name"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
/>

<label>Status</label>

<select
value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
>
<option>Active</option>
<option>Inactive</option>
</select>

<div className="FeeType-modalBtns">

<button
className="cancel"
onClick={()=>setShowModal(false)}
>
Cancel
</button>

<button
className="save"
onClick={saveData}
>
Save
</button>

</div>

</div>

</div>

)}

</div>

);

};

export default FeeType;