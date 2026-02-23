import { useState } from "react";
import "./OnlineExam.css";

/* ================= DUMMY ================= */

const dummy = [
  { id:1,title:"fff",questions:"(Descriptive:1) (MCQ:3)",staff:"Demo User",attempt:1,from:"06-05-2025",to:"06-05-2025",duration:"00:04:00",publish:true,result:false },
  { id:2,title:"KV Test",questions:"(Descriptive:0) (MCQ:0)",staff:"Aatam Jain, Demo User",attempt:1,from:"02-12-2025",to:"02-12-2025",duration:"01:00:00",publish:true,result:false },
  { id:3,title:"Test KV",questions:"(Descriptive:1) (MCQ:0)",staff:"Demo User",attempt:1,from:"11-12-2025",to:"11-12-2025",duration:"01:00:00",publish:false,result:false },
  { id:4,title:"evs",questions:"(Descriptive:0) (MCQ:0)",staff:"Admin",attempt:1,from:"23-01-2026",to:"23-01-2026",duration:"03:00:00",publish:true,result:false },
  { id:5,title:"Math",questions:"(Descriptive:2) (MCQ:5)",staff:"Demo User",attempt:2,from:"10-02-2026",to:"10-02-2026",duration:"02:00:00",publish:true,result:false },
  { id:6,title:"Science",questions:"(Descriptive:1) (MCQ:2)",staff:"Admin",attempt:1,from:"15-02-2026",to:"15-02-2026",duration:"01:30:00",publish:false,result:false },
  { id:7,title:"English",questions:"(Descriptive:2) (MCQ:1)",staff:"Demo User",attempt:1,from:"20-02-2026",to:"20-02-2026",duration:"01:00:00",publish:true,result:false },
  { id:8,title:"History",questions:"(Descriptive:1) (MCQ:4)",staff:"Admin",attempt:1,from:"25-02-2026",to:"25-02-2026",duration:"02:30:00",publish:false,result:false },
];

const OnlineExam = () => {
  const [openModal, setOpenModal] = useState(false);
  const [data, setData] = useState(dummy);
  const [page, setPage] = useState(1);
  const [openAction, setOpenAction] = useState(null);
  const [editItem, setEditItem] = useState(null);

  /* ===== FORM STATE ===== */
  const [form,setForm]=useState({
    title:"",
    staff:"Demo User",
    examFrom:"",
    examTo:"",
    publishDate:"",
    duration:"",
    attempt:1,
    pass:"",
    publishExam:false,
    publishResult:false,
    description:""
  });

  const handleChange=(e)=>{
    const {name,value,type,checked}=e.target;
    setForm(prev=>({...prev,[name]:type==="checkbox"?checked:value}));
  };

  const handleSaveExam=()=>{
    if(!form.title) return;

    const newExam={
      id:Date.now(),
      title:form.title,
      questions:"(Descriptive:0) (MCQ:0)",
      staff:form.staff,
      attempt:form.attempt,
      from:form.examFrom,
      to:form.examTo,
      duration:form.duration,
      publish:form.publishExam,
      result:form.publishResult
    };

    setData(prev=>[newExam,...prev]);
    setOpenModal(false);
  };

  const perPage = 7;
  const paginated = data.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(data.length / perPage);

  /* DELETE */
  const handleDelete = (id) => {
    if (window.confirm("Delete exam?")) {
      setData(d => d.filter(x => x.id !== id));
    }
  };

  /* EDIT */
  const handleEdit = (item) => {
    setEditItem(item);
    setOpenModal(true);
  };

  return (
    <div className="onlineExamPage">

      {/* SELECT CRITERIA */}
      <div className="onlineExamPage-card">
        <div className="onlineExamPage-cardHeader">
          <div className="title">🔎 Select Criteria</div>
          <button className="onlineExamPage-addBtn" onClick={()=>setOpenModal(true)}>+ Add Exam</button>
        </div>

        <div className="onlineExamPage-criteriaGrid">
          <div className="onlineExamPage-field">
            <label>Start Date</label>
            <input type="date"/>
          </div>

          <div className="onlineExamPage-field">
            <label>End Date</label>
            <input type="date"/>
          </div>
        </div>

        <div className="onlineExamPage-searchRow">
          <button className="onlineExamPage-searchBtn">Search</button>
        </div>
      </div>

      {/* LIST */}
      <div className="onlineExamPage-card">
        <div className="onlineExamPage-cardHeader">
          <div className="title">📋 Online Exam List</div>
        </div>

        <div className="onlineExamPage-tableWrapper">
          <table className="onlineExamPage-table">
            <thead>
              <tr>
                <th>EXAM</th>
                <th>QUESTIONS</th>
                <th>ASSIGNED STAFF</th>
                <th>ATTEMPT</th>
                <th>EXAM FROM</th>
                <th>EXAM TO</th>
                <th>DURATION</th>
                <th>EXAM PUBLISH</th>
                <th>EXAM RESULT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map(row=>(
                <tr key={row.id}>
                  <td>{row.title}</td>
                  <td>{row.questions}</td>
                  <td>{row.staff}</td>
                  <td>{row.attempt}</td>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.duration}</td>
                  <td><input type="checkbox" checked={row.publish} readOnly/></td>
                  <td><input type="checkbox" checked={row.result} readOnly/></td>

                  <td style={{position:"relative"}}>
                    <button className="actionBtn" onClick={()=>setOpenAction(openAction===row.id?null:row.id)}>
                      Action
                    </button>

                    {openAction===row.id && (
                      <div className="actionMenu">
                        <button onClick={()=>handleEdit(row)}>Edit</button>
                        <button onClick={()=>handleDelete(row.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination">
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
          {Array.from({length:totalPages}).map((_,i)=>(
            <button key={i} className={page===i+1?"active":""} onClick={()=>setPage(i+1)}>
              {i+1}
            </button>
          ))}
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      </div>

      {/* MODAL */}
      <div className={`onlineExamModalOverlay ${openModal?"show":""}`} onClick={()=>setOpenModal(false)}>
        <div className={`onlineExamModal ${openModal?"show":""}`} onClick={e=>e.stopPropagation()}>
          <div className="onlineExamModal-header">
            <h3>{editItem ? "Edit Exam" : "Exam"}</h3>
            <button onClick={()=>setOpenModal(false)}>✕</button>
          </div>

          <div className="onlineExamModal-body">

            <div className="examForm-grid">

              <div className="examForm-field">
                <label>Exam Title *</label>
                <input name="title" value={form.title} onChange={handleChange}/>
              </div>

              <div className="examForm-field">
                <label>Assigned Staff List *</label>
                <select name="staff" value={form.staff} onChange={handleChange}>
                  <option>Demo User</option>
                  <option>Admin</option>
                  <option>Aatam Jain</option>
                  <option>Akshay Chauhan</option>
                </select>
              </div>

              <div className="examForm-field">
                <label>Exam From *</label>
                <input type="datetime-local" name="examFrom" value={form.examFrom} onChange={handleChange}/>
              </div>

              <div className="examForm-field">
                <label>Exam To *</label>
                <input type="datetime-local" name="examTo" value={form.examTo} onChange={handleChange}/>
              </div>

              <div className="examForm-field">
                <label>Exam Publish Date *</label>
                <input type="datetime-local" name="publishDate" value={form.publishDate} onChange={handleChange}/>
              </div>

              <div className="examForm-field">
                <label>Duration *</label>
                <input name="duration" value={form.duration} onChange={handleChange}/>
              </div>

              <div className="examForm-field">
                <label>Attempt *</label>
                <input name="attempt" value={form.attempt} onChange={handleChange}/>
              </div>

              <div className="examForm-field">
                <label>Passing Percentage *</label>
                <input name="pass" value={form.pass} onChange={handleChange}/>
              </div>

            </div>

            <div className="examForm-checkRow">
              <label>
                <input type="checkbox" name="publishExam" checked={form.publishExam} onChange={handleChange}/>
                Publish Exam
              </label>

              <label>
                <input type="checkbox" name="publishResult" checked={form.publishResult} onChange={handleChange}/>
                Publish Result
              </label>
            </div>

            <div className="examForm-field full">
              <label>Description *</label>
              <textarea rows={4} name="description" value={form.description} onChange={handleChange}/>
            </div>

          </div>

          <div className="onlineExamModal-footer">
            <button className="saveBtn" onClick={handleSaveExam}>Save</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default OnlineExam;