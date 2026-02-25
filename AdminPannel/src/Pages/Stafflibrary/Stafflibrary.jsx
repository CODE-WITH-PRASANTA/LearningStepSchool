import React, { useState, useRef, useEffect } from "react";
import "./Stafflibrary.css";
import {
  FaUserPlus,
  FaSearch,
  FaBars,
  FaEllipsisV,
  FaEdit,
  FaTrash
} from "react-icons/fa";

const Stafflibrary = () => {

  const [openRow, setOpenRow] = useState(null);
  const menuRef = useRef(null);

  const [staffData, setStaffData] = useState([
    { id:1, member:"1", card:"EMP-1", name:"Nlet Initiatives LLP", email:"ims@nletsolutions.in", dob:"1970-01-01", phone:"9982716888"},
    { id:2, member:"6", card:"EMP-101", name:"Driver", email:"driver@gmail.com", dob:"2023-10-17", phone:"809436469"},
    { id:3, member:"7", card:"EMP-205", name:"Test User", email:"test@gmail.com", dob:"2023-05-22", phone:"9772119901"},
    { id:4, member:"8", card:"EMP-305", name:"Library Staff", email:"library@gmail.com", dob:"2024-01-11", phone:"9123456789"}
  ]);

  const [form, setForm] = useState({
    name:"", email:"", phone:"", dob:"", card:""
  });

  /* close dropdown outside click */
  useEffect(()=>{
    const handler = (e)=>{
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setOpenRow(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return ()=>document.removeEventListener("mousedown", handler);
  },[]);

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSave = ()=>{
    if(!form.name) return alert("Enter staff name");

    const newStaff={
      id: Date.now(),
      member: staffData.length+1,
      card: form.card || "EMP-"+(staffData.length+1),
      name: form.name,
      email: form.email,
      dob: form.dob,
      phone: form.phone
    };

    setStaffData([...staffData,newStaff]);
    setForm({name:"",email:"",phone:"",dob:"",card:""});
  };

  const deleteRow=(id)=>{
    setStaffData(staffData.filter(s=>s.id!==id));
  };

  return (
    <div className="staffPage">

      {/* HEADER */}
      <div className="staffTopHeader">
        <div className="staffTitle">
          <FaUserPlus/>
          <h2>Add Staff</h2>
        </div>

        <div className="staffBreadcrumb">
          <span>library</span>
          <span className="slash"> / </span>
          <span className="active">Add Staff</span>
        </div>
      </div>

      {/* FORM */}
      <div className="staffFormCard">
        <h3 className="cardHeading">Add Staff</h3>

        <div className="formGrid">
          <div className="field"><input name="name" value={form.name} onChange={handleChange} placeholder="Staff Name"/></div>
          <div className="field"><input name="email" value={form.email} onChange={handleChange} placeholder="Email"/></div>
          <div className="field"><input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone"/></div>
          <div className="field"><input name="dob" value={form.dob} onChange={handleChange} type="date"/></div>
          <div className="field"><input name="card" value={form.card} onChange={handleChange} placeholder="Library Card No"/></div>

          <div className="field btnField">
            <button className="saveBtn" onClick={handleSave}>Save Staff</button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="staffTableCard">
        <div className="tableHeader">
          <h3><FaBars/> Add Staff List</h3>

          <div className="tableSearch">
            <FaSearch/>
            <input placeholder="Search staff..."/>
          </div>
        </div>

        <div className="tableWrapper">
          <table className="staffTable">
            <thead>
              <tr>
                <th>MEMBER ID</th>
                <th>LIBRARY CARD NO</th>
                <th>STAFF NAME</th>
                <th>EMAIL</th>
                <th>DATE OF BIRTH</th>
                <th>PHONE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {staffData.map((s)=>(
                <tr key={s.id}>
                  <td>{s.member}</td>
                  <td>{s.card}</td>
                  <td className="name">{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.dob}</td>
                  <td>{s.phone}</td>

                  <td className="actionCell">
                    <button
                      className="actionBtn"
                      onClick={()=>setOpenRow(openRow===s.id?null:s.id)}
                    >
                      <FaEllipsisV/>
                    </button>

                    {openRow===s.id && (
                      <div className="actionDropdown" ref={menuRef}>
                        <button className="edit"><FaEdit/> Edit</button>
                        <button className="delete" onClick={()=>deleteRow(s.id)}>
                          <FaTrash/> Delete
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Stafflibrary;
