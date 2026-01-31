import React, { useState } from "react";
import "./AdmissionSurvey.css";

const AdmissionSurvey = () => {

  const [formData, setFormData] = useState({
    parentName: "",
    mobile: "",
    whatsapp: "Yes",
    village: "",
    children: "",
    age: "",
    className: "",
    medium: "English",
    currentSchool: "",
    annualFee: "",
    transport: "Yes",
    distance: "",
    interest: "",
    concern: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Survey Submitted Successfully!");
  };

  return (
    <div className="adm-survey-container">

      <h2 className="adm-survey-title">
        Learning Step International School – Admission Survey
      </h2>

      <form className="adm-survey-form" onSubmit={handleSubmit}>

        <div className="adm-survey-grid">

          <div className="adm-field">
            <label>Parent's Name</label>
            <input name="parentName" onChange={handleChange} />
          </div>

          <div className="adm-field">
            <label>Mobile No</label>
            <input name="mobile" onChange={handleChange} />
          </div>

          <div className="adm-field">
            <label>WhatsApp</label>
            <select name="whatsapp" onChange={handleChange}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="adm-field">
            <label>Village</label>
            <input name="village" onChange={handleChange} />
          </div>

          <div className="adm-field">
            <label>No of Children</label>
            <input type="number" name="children" onChange={handleChange} />
          </div>

          <div className="adm-field">
            <label>Age</label>
            <select name="age" onChange={handleChange}>
              {[...Array(15)].map((_,i)=>(
                <option key={i+1}>{i+1}</option>
              ))}
            </select>
          </div>

          <div className="adm-field">
            <label>Class</label>
            <select name="className" onChange={handleChange}>
              <option>PG</option>
              <option>KG</option>
              {[...Array(10)].map((_,i)=>(
                <option key={i+1}>{i+1}</option>
              ))}
            </select>
          </div>

          <div className="adm-field">
            <label>Medium</label>
            <select name="medium" onChange={handleChange}>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="adm-field">
            <label>Current School Name</label>
            <input name="currentSchool" onChange={handleChange} />
          </div>

          <div className="adm-field">
            <label>Current Annual Fee</label>
            <select name="annualFee" onChange={handleChange}>
              <option>8k-10k</option>
              <option>10k-12k</option>
              <option>13k-16k</option>
              <option>16k-20k</option>
              <option>21k-25k</option>
            </select>
          </div>

          <div className="adm-field">
            <label>Transport</label>
            <select name="transport" onChange={handleChange}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="adm-field">
            <label>Distance (KM)</label>
            <select name="distance" onChange={handleChange}>
              <option>0-3</option>
              <option>4-6</option>
              <option>7-9</option>
              <option>10-13</option>
              <option>Above 13</option>
            </select>
          </div>

          <div className="adm-field">
            <label>Admission Interest</label>
            <select name="interest" onChange={handleChange}>
              <option>Confirm</option>
              <option>Maybe</option>
              <option>Not Interested</option>
            </select>
          </div>

          <div className="adm-field adm-full">
            <label>Main Concern</label>
            <select name="concern" onChange={handleChange}>
              <option>Fee</option>
              <option>Distance</option>
              <option>Transport</option>
              <option>Quality</option>
              <option>Safety</option>
            </select>
          </div>

        </div>

        <button className="adm-survey-submit">
          Submit Survey
        </button>

      </form>

    </div>
  );
};

export default AdmissionSurvey;
