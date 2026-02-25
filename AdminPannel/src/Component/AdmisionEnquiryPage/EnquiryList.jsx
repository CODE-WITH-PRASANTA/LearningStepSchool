import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const EnquiryListForm = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [openActionId, setOpenActionId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [rows, setRows] = useState([]);
  const [showFollowUp, setShowFollowUp] = useState(false);
const [activeFollowUpRow, setActiveFollowUpRow] = useState(null);

const [showEdit, setShowEdit] = useState(false);
const [activeEditRow, setActiveEditRow] = useState(null); 

const [showView, setShowView] = useState(false);
const [activeViewRow, setActiveViewRow] = useState(null);



const [followUpData, setFollowUpData] = useState({
  followUpDate: "07-02-2026",
  nextFollowUpDate: "07-02-2026",
  response: "",
  note: "",
  status: "",
});



  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    reference: "",
    source: "",
    className: "",
    date: "07-02-2026",
    assigned: "",
    attachment: null,
    noOfChild: "",
    address: "",
    description: "",
    note: "",
    fatherName: "",
    studentName: "",
    lastClassPercentage: "",
    dob: "",
    aadhar: "",
    status: "Active",
    createdBy: "Demo User",
  });

  /* ================= ADD ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    setRows([...rows, { ...formData, id: Date.now() }]);
    setShowAdd(false);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    setRows(rows.filter((r) => r.id !== id));
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };


const handleBulkDelete = () => {
  if (!selectedIds.length) {
    Swal.fire({
      icon: "warning",
      title: "No Selection",
      text: "Please select at least one record to delete!",
      confirmButtonColor: "#3085d6",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      setRows(rows.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);

      Swal.fire({
        title: "Deleted!",
        text: "Selected records have been deleted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    }
  });
};

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= RENDER ================= */

  return (
    <>
      {/* ================= ENQUIRY LIST ================= */}
      <form className="card">
        <div className="card-header enquiry-header">
          <span>📋 Enquiry List</span>

          <div className="header-actions">
            <button
              type="button"
              className="btn-danger"
              onClick={handleBulkDelete}
            >
              🗑 Bulk Delete
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowImport(true)}
            >
              ⬆ Import
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowAdd(true)}
            >
              + Add
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>DELETE</th>
                <th>#</th>
                <th>TITLE</th>
                <th>PHONE</th>
                <th>CLASS</th>
                <th>ADDRESS</th>
                <th>SOURCE</th>
                <th>ENQUIRY DATE</th>
                <th>STATUS</th>
                <th>CREATED BY</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                    />
                  </td>
                  <td>{index + 1}</td>
                  <td>{row.name}</td>
                  <td>{row.phone}</td>
                  <td>{row.className}</td>
                  <td>{row.address}</td>
                  <td>{row.source}</td>
                  <td>{row.date}</td>
                  <td>{row.status}</td>
                  <td>{row.createdBy}</td>

                  <td style={{ position: "relative" }}>
                    <button
                      type="button"
                      className="btn-dark"
                      onClick={() =>
                        setOpenActionId(
                          openActionId === row.id ? null : row.id
                        )
                      }
                    >
                      Action ▾
                    </button>

                    {openActionId === row.id && (
                      <div className="action-dropdown">
                        <button
                  type="button"
                   onClick={() => {
                   setActiveFollowUpRow(row);
                   setShowFollowUp(true);
                    setOpenActionId(null);
                    }}
                    >
                  📞 Follow Up
                  </button>

             <button
                type="button"
                  onClick={() => {
                   setActiveEditRow(row);      // store row
                     setFormData(row);           // preload form (IMPORTANT)
                     setShowEdit(true);          // open edit popup
                     setOpenActionId(null);
                      }}
                      >
                       ✏️ Edit
                        </button>

                       <button
                         type="button"
                           onClick={() => {
                            setActiveViewRow(row);
                           setShowView(true);
                            setOpenActionId(null);
                               }}
                              >
                             👁 View
                           </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDelete(row.id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!rows.length && (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>


      
    {/* ================= IMPORT POPUP ================= */}
{/* ================= IMPORT POPUP ================= */}
{showImport && (
  <div className="import-overlay">
    <div className="import-card">
      {/* HEADER */}
      <div className="import-header">
        <span>Admission Enquiry Import</span>
        <button
          type="button"
          className="import-close"
          onClick={() => setShowImport(false)}
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="import-body">
        <div className="import-top-action">
          <button type="button" className="btn-primary">
            ⬇ Import Sample File
          </button>
        </div>

        <div className="form-group">
          <label>
            Select Excel File <span style={{ color: "red" }}>*</span>
          </label>
          <input type="file" accept=".xls,.xlsx" />
        </div>
      </div>

      {/* FOOTER */}
      <div className="import-footer">
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowImport(false)}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

      {/* ================= ADD POPUP (FULL FORM SAME AS REFERENCE) ================= */}
      {showAdd && (
        <div className="import-overlay">
          <form className="add-card" onSubmit={handleSubmit}>
            <div className="import-header">
              <span>Admission Enquiry</span>
              <button
                type="button"
                className="import-close"
                onClick={() => setShowAdd(false)}
              >
                ✕
              </button>
            </div>

            <div className="add-body">
              <div className="add-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input onChange={(e)=>setFormData({...formData,phone:e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Reference</label>
                  <select onChange={(e)=>setFormData({...formData,reference:e.target.value})}>
                    <option>Select</option>
                    <option>Parent</option>
                    <option>Teacher</option>
                    <option>Friend</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Source *</label>
                  <select onChange={(e)=>setFormData({...formData,source:e.target.value})}>
                    <option>Select</option>
                    <option>Website</option>
                    <option>Social Media</option>
                    <option>Phone</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Class</label>
                  <select onChange={(e)=>setFormData({...formData,className:e.target.value})}>
                    <option>Select</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input value={formData.date} disabled />
                </div>

                <div className="form-group">
                  <label>Assigned</label>
                  <select onChange={(e)=>setFormData({...formData,assigned:e.target.value})}>
                    <option>Select</option>
                    <option>Admin</option>
                    <option>Staff</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>No of Child</label>
                  <input onChange={(e)=>setFormData({...formData,noOfChild:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Address</label>
                  <textarea onChange={(e)=>setFormData({...formData,address:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea />
                </div>

                <div className="form-group full">
                  <label>Note</label>
                  <textarea />
                </div>

                <div className="form-group full">
                  <label>Fathers Name</label>
                  <input onChange={(e)=>setFormData({...formData,fatherName:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Student Name *</label>
                  <input onChange={(e)=>setFormData({...formData,studentName:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>LAST CLASS PERCENTAGE *</label>
                  <input onChange={(e)=>setFormData({...formData,lastClassPercentage:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>DOB *</label>
                  <input type="date" onChange={(e)=>setFormData({...formData,dob:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Aadhar Number *</label>
                  <input onChange={(e)=>setFormData({...formData,aadhar:e.target.value})}/>
                </div>
              </div>
            </div>

            <div className="import-footer">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* ================= FOLLOW UP POPUP ================= */}
{showFollowUp && activeFollowUpRow && (
  <div className="import-overlay">
    <div className="followup-card">

      {/* HEADER */}
      <div className="import-header">
        <span>Follow Up Enquiry Model</span>
        <button
          className="import-close"
          onClick={() => setShowFollowUp(false)}
        >
          ✕
        </button>
      </div>

      <div className="followup-body">
        {/* LEFT FORM */}
        <div className="followup-left">
          <div className="followup-grid">
            <div className="form-group">
              <label>Follow Up Date</label>
               <textarea
                required
                onChange={(e) =>
                  setFollowUpData({
                    ...followUpData,
                    response: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Next Follow Up Date</label>
              <textarea
                required
                onChange={(e) =>
                  setFollowUpData({
                    ...followUpData,
                    response: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>Response *</label>
              <textarea
                required
                onChange={(e) =>
                  setFollowUpData({
                    ...followUpData,
                    response: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>Note</label>
              <textarea
                onChange={(e) =>
                  setFollowUpData({
                    ...followUpData,
                    note: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div style={{ textAlign: "right", marginTop: 10 }}>
            <button className="btn-primary">Save</button>
          </div>

          {/* FOLLOW UP HISTORY */}
          <div className="followup-history">
            <h4>
              Follow Up ({activeFollowUpRow.name || "Student"})
            </h4>

            <div className="followup-item">
              <div className="followup-date">
                21-01-26
                <span>🗑</span>
              </div>
              <div className="followup-content">
                <strong>Demo User</strong>
                <p>interested will come to visit</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="followup-right">
          <h4>Summary</h4>

          <div className="form-group">
            <label>Status</label>
            <select
              onChange={(e) =>
                setFollowUpData({
                  ...followUpData,
                  status: e.target.value,
                })
              }
            >
              <option>Select Status</option>
              <option>Active</option>
              <option>Student enrolled</option>
              <option>Email Inquiry</option>
            </select>
          </div>

          <p><strong>Created By:</strong> {activeFollowUpRow.createdBy}</p>

          <hr />

          <p>📅 Enquiry Date : {activeFollowUpRow.date}</p>
          <p>📅 Last Follow Up Date : {activeFollowUpRow.lastFollowUp || "-"}</p>
          <p>📅 Next Follow Up Date : {activeFollowUpRow.nextFollowUp || "-"}</p>
          <p><strong>Phone :</strong> {activeFollowUpRow.phone}</p>
          <p><strong>Address :</strong> {activeFollowUpRow.address}</p>
          <p><strong>Reference :</strong> {activeFollowUpRow.reference}</p>
          <p><strong>Description :</strong></p>
          <p><strong>Note :</strong></p>
          <p><strong>Source :</strong> {activeFollowUpRow.source}</p>
          <p><strong>Assigned :</strong> 57</p>
          <p><strong>Email :</strong> demo@nlet.in</p>
          <p><strong>Class :</strong> {activeFollowUpRow.className}</p>
          <p><strong>No of Child :</strong></p>
        </div>
      </div>
    </div>
  </div>
)}
     {/* ........EDIT POPUP ........ */}
{showAdd && (
        <div className="import-overlay">
          <form className="add-card" onSubmit={handleSubmit}>
            <div className="import-header">
              <span>Admission Enquiry</span>
              <button
                type="button"
                className="import-close"
                onClick={() => setShowAdd(false)}
              >
                ✕
              </button>
            </div>

            <div className="add-body">
              <div className="add-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input onChange={(e)=>setFormData({...formData,phone:e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
                </div>

                <div className="form-group">
                  <label>Reference</label>
                  <select onChange={(e)=>setFormData({...formData,reference:e.target.value})}>
                    <option>Select</option>
                    <option>Parent</option>
                    <option>Teacher</option>
                    <option>Friend</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Source *</label>
                  <select onChange={(e)=>setFormData({...formData,source:e.target.value})}>
                    <option>Select</option>
                    <option>Website</option>
                    <option>Social Media</option>
                    <option>Phone</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Class</label>
                  <select onChange={(e)=>setFormData({...formData,className:e.target.value})}>
                    <option>Select</option>
                    <option>1st</option>
                    <option>2nd</option>
                    <option>3rd</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input value={formData.date} disabled />
                </div>

                <div className="form-group">
                  <label>Assigned</label>
                  <select onChange={(e)=>setFormData({...formData,assigned:e.target.value})}>
                    <option>Select</option>
                    <option>Admin</option>
                    <option>Staff</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>No of Child</label>
                  <input onChange={(e)=>setFormData({...formData,noOfChild:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Address</label>
                  <textarea onChange={(e)=>setFormData({...formData,address:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea />
                </div>

                <div className="form-group full">
                  <label>Note</label>
                  <textarea />
                </div>

                <div className="form-group full">
                  <label>Fathers Name</label>
                  <input onChange={(e)=>setFormData({...formData,fatherName:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Student Name *</label>
                  <input onChange={(e)=>setFormData({...formData,studentName:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>LAST CLASS PERCENTAGE *</label>
                  <input onChange={(e)=>setFormData({...formData,lastClassPercentage:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>DOB *</label>
                  <input type="date" onChange={(e)=>setFormData({...formData,dob:e.target.value})}/>
                </div>

                <div className="form-group full">
                  <label>Aadhar Number *</label>
                  <input onChange={(e)=>setFormData({...formData,aadhar:e.target.value})}/>
                </div>
              </div>
            </div>

            <div className="import-footer">
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}


{/* ================= VIEW POPUP (ENQUIRY CARD) ================= */}
{showView && activeViewRow && (
  <div className="import-overlay">
    <div className="view-card">

      {/* HEADER */}
      <div className="import-header">
        <span>Enquiry Card</span>

        <div>
          <button
            type="button"
            className="icon-btn"
            onClick={() => window.print()}
          >
            🖨
          </button>

          <button
            type="button"
            className="import-close"
            onClick={() => setShowView(false)}
          >
            ✕
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="view-body">

        <div className="view-header">
          <div>
            <strong>NLET – Institute Management Software</strong>
            <p>19-K-4, Jyoti Nagar Jaipur Rajasthan – 302005</p>
            <p>8058848888</p>
          </div>

          <h2 className="view-title">Enquiry Receipt</h2>

          <div className="view-date">
            Date : {activeViewRow.date}
          </div>
        </div>

        {/* DETAILS TABLE */}
        <table className="view-table">
          <tbody>
            <tr>
              <td>Name : {activeViewRow.name}</td>
              <td>Phone : {activeViewRow.phone}</td>
            </tr>
            <tr>
              <td>Email : {activeViewRow.email}</td>
              <td>Reference : {activeViewRow.reference}</td>
            </tr>
            <tr>
              <td>Source : {activeViewRow.source}</td>
              <td>Class : {activeViewRow.className}</td>
            </tr>
            <tr>
              <td>Assigned : {activeViewRow.assigned}</td>
              <td>No of Child : {activeViewRow.noOfChild}</td>
            </tr>
            <tr>
              <td>Status : {activeViewRow.status}</td>
              <td>Enquiry Date : {activeViewRow.date}</td>
            </tr>
            <tr>
              <td>Last Follow Up Date : {activeViewRow.lastFollowUp || "-"}</td>
              <td>Next Follow Up Date : {activeViewRow.nextFollowUp || "-"}</td>
            </tr>
            <tr>
              <td colSpan="2">
                Address : {activeViewRow.address}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                Description : {activeViewRow.description}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                Note : {activeViewRow.note}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                LAST CLASS PERCENTAGE : {activeViewRow.lastClassPercentage}
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                Aadhar Number : {activeViewRow.aadhar}
              </td>
            </tr>
          </tbody>
        </table>

        {/* FOLLOW UP HISTORY */}
        <table className="view-followup-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Next Follow Up Date</th>
              <th>Response</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Demo User</td>
              <td>{activeViewRow.nextFollowUp || "-"}</td>
              <td>call again</td>
              <td></td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
)}


    </>
  );
};

export default EnquiryListForm;
