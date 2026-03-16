import React, { useState } from "react";
import "./ExamResult.css";
import {
FiMoreVertical,
FiSearch,
FiDownload,
FiChevronDown,
FiEye
} from "react-icons/fi";

const ExamResult = () => {

const [menuOpen,setMenuOpen] = useState(null);
const [page,setPage] = useState(1);

const rowsPerPage = 5;

const data = [
{
id:1,
admission:"AD52365",
name:"Kathryn Murphy",
roll:12,
class:"Class 1 (A)",
exam:"Monthly Test",
total:644,
percent:92,
grade:"A+",
result:"Pass"
},
{
id:2,
admission:"AD52366",
name:"Jerome Bell",
roll:14,
class:"Class 2 (B)",
exam:"Final Exam",
total:578,
percent:82,
grade:"A",
result:"Pass"
},
{
id:3,
admission:"AD52367",
name:"Theresa Webb",
roll:16,
class:"Class 3 (C)",
exam:"Mid Term",
total:430,
percent:70,
grade:"B+",
result:"Pass"
},
{
id:4,
admission:"AD52368",
name:"Cody Fisher",
roll:19,
class:"Class 4 (A)",
exam:"Quarterly Test",
total:380,
percent:64,
grade:"B",
result:"Fail"
},
{
id:5,
admission:"AD52369",
name:"Annette Black",
roll:10,
class:"Class 5 (B)",
exam:"Final Exam",
total:698,
percent:96,
grade:"A+",
result:"Pass"
},
{
id:6,
admission:"AD52370",
name:"Jenny Wilson",
roll:7,
class:"Class 6 (A)",
exam:"Half Yearly",
total:612,
percent:89,
grade:"A",
result:"Pass"
},
{
id:7,
admission:"AD52371",
name:"Darlene Robertson",
roll:18,
class:"Class 7 (C)",
exam:"Monthly Test",
total:325,
percent:58,
grade:"C",
result:"Fail"
},
{
id:8,
admission:"AD52372",
name:"Wade Warren",
roll:22,
class:"Class 8 (A)",
exam:"Final Exam",
total:510,
percent:75,
grade:"B+",
result:"Pass"
},
{
id:9,
admission:"AD52373",
name:"Esther Howard",
roll:9,
class:"Class 9 (B)",
exam:"Mid Term",
total:285,
percent:46,
grade:"D",
result:"Fail"
}
];

const totalPages = Math.ceil(data.length / rowsPerPage);
const indexLast = page * rowsPerPage;
const indexFirst = indexLast - rowsPerPage;
const currentRows = data.slice(indexFirst,indexLast);

return (

<div className="ExamResult">

{/* HEADER */}

<div className="ExamResult-header">

<div>
<h2>Exam Result</h2>
<p>Dashboard / Exam Result</p>
</div>

</div>


{/* TOOLBAR */}

<div className="ExamResult-toolbar">


<div className="ExamResult-search">
<FiSearch/>
<input placeholder="Search..." />
</div>

<div className="ExamResult-rows">
Rows per page:
<select>
<option>10</option>
<option>20</option>
<option>50</option>
</select>
</div>

</div>


{/* TABLE */}

<div className="ExamResult-tableWrapper">

<table className="ExamResult-table">

<thead>

<tr>
<th>S.L</th>
<th>Admission No</th>
<th>Name</th>
<th>Roll No</th>
<th>Class</th>
<th>Exam</th>
<th>Grand Total</th>
<th>Percent (%)</th>
<th>Grade</th>
<th>Result</th>
<th>Action</th>
</tr>

</thead>

<tbody>

{currentRows.map((item,index)=>(

<tr key={item.id}>

<td>{indexFirst + index + 1}</td>

<td className="ExamResult-admission">
{item.admission}
</td>

<td>{item.name}</td>

<td>{item.roll}</td>

<td>{item.class}</td>

<td>{item.exam}</td>

<td>{item.total}</td>

<td>{item.percent}</td>

<td>{item.grade}</td>

<td>
<span className={`ExamResult-result ${item.result}`}>
{item.result}
</span>
</td>

<td>

<div className="ExamResult-action">

<button
className="ExamResult-actionBtn"
onClick={()=>setMenuOpen(menuOpen===item.id ? null : item.id)}
>
<FiMoreVertical/>
</button>

{menuOpen===item.id &&(

<div className="ExamResult-dropdown">

<button>
<FiEye/> View
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

<div className="ExamResult-pagination">

<p>
Showing {indexFirst+1} to {Math.min(indexLast,data.length)} of {data.length} entries
</p>

<div>

<button
disabled={page===1}
onClick={()=>setPage(page-1)}
>
{"<"}
</button>

{[...Array(totalPages)].map((_,i)=>(
<button
key={i}
className={page===i+1?"active":""}
onClick={()=>setPage(i+1)}
>
{i+1}
</button>
))}

<button
disabled={page===totalPages}
onClick={()=>setPage(page+1)}
>
{">"}
</button>

</div>

</div>

</div>

);

};

export default ExamResult;