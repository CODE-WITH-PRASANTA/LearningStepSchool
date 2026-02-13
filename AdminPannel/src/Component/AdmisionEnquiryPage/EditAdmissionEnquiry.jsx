import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditAdmissionEnquiry = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // row data comes here

  const [formData, setFormData] = useState({
    name: state?.name || "",
    phone: state?.phone || "",
    email: state?.email || "",
    reference: state?.reference || "",
    source: state?.source || "",
    className: state?.className || "",
    date: state?.date || "07-02-2026",
    assigned: state?.assigned || "",
    noOfChild: state?.noOfChild || "",
    address: state?.address || "",
    description: state?.description || "",
    note: state?.note || "",
    fatherName: state?.fatherName || "",
    studentName: state?.studentName || "",
    lastClassPercentage: state?.lastClassPercentage || "",
    dob: state?.dob || "",
    aadhar: state?.aadhar || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("UPDATED DATA:", formData);
    navigate(-1); // go back to enquiry list
  };

  return (
    <div className="import-overlay">
      <form className="add-card" onSubmit={handleSubmit}>
        {/* HEADER */}
        <div className="import-header">
          <span>Edit Admission Enquiry</span>
          <button
            type="button"
            className="import-close"
            onClick={() => navigate(-1)}
          >
            ✕
          </button>
        </div>

        {/* BODY — SAME PLACEHOLDERS */}
        <div className="add-body">
          <div className="add-grid">

            <div className="form-group">
              <label>Name *</label>
              <input
                value={formData.name}
                onChange={(e)=>setFormData({...formData,name:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                value={formData.phone}
                onChange={(e)=>setFormData({...formData,phone:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Reference</label>
              <select
                value={formData.reference}
                onChange={(e)=>setFormData({...formData,reference:e.target.value})}
              >
                <option>Select</option>
                <option>website</option>
                <option>Parent</option>
                <option>Teacher</option>
                <option>Friend</option>
              </select>
            </div>

            <div className="form-group">
              <label>Source *</label>
              <select
                value={formData.source}
                onChange={(e)=>setFormData({...formData,source:e.target.value})}
              >
                <option>Select</option>
                <option>Social Media</option>
                <option>Website</option>
                <option>Phone</option>
              </select>
            </div>

            <div className="form-group">
              <label>Class</label>
              <select
                value={formData.className}
                onChange={(e)=>setFormData({...formData,className:e.target.value})}
              >
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
              <label>No of Child</label>
              <input
                value={formData.noOfChild}
                onChange={(e)=>setFormData({...formData,noOfChild:e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <textarea
                value={formData.address}
                onChange={(e)=>setFormData({...formData,address:e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label>Fathers Name</label>
              <input
                value={formData.fatherName}
                onChange={(e)=>setFormData({...formData,fatherName:e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label>Student Name *</label>
              <input
                value={formData.studentName}
                onChange={(e)=>setFormData({...formData,studentName:e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label>LAST CLASS PERCENTAGE *</label>
              <input
                value={formData.lastClassPercentage}
                onChange={(e)=>setFormData({...formData,lastClassPercentage:e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label>DOB *</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e)=>setFormData({...formData,dob:e.target.value})}
              />
            </div>

            <div className="form-group full">
              <label>Aadhar Number *</label>
              <input
                value={formData.aadhar}
                onChange={(e)=>setFormData({...formData,aadhar:e.target.value})}
              />
            </div>

          </div>
        </div>

        <div className="import-footer">
          <button className="btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditAdmissionEnquiry;
