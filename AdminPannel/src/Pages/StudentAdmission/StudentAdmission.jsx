import React, { useState, useEffect } from "react";
import AccordionSection from "../../Component/AccordionSection/AccordionSection";
import { Download } from "lucide-react";
import "./StudentAdmission.css";

export default function StudentAdmission() {
  return (
<div className="Student-Admission-Page">
  <div className="Student-Admission-Container">

          {/* HEADER */}
          <div className="Student-Admission-Header">
            <h1 className="Student-Admission-Title">Student Admission</h1>
            <button className="Student-Admission-DownloadBtn">
              <Download size={18} />
              Download Form
            </button>
          </div>

          {/* ================= STUDENT DETAILS ================= */}
          <AccordionSection title="Student Details">
            <div className="Student-Admission-FormGrid">

              <div className="Student-Admission-Left">

                <div className="Student-Admission-Row">
                  <FormInput label="Admission No *" />
                  <FormSelect label="Class *" />
                  <FormSelect label="Section *" />
                </div>

                <div className="Student-Admission-Row">
                  <FormInput label="Roll Number" />
                  <FormInput label="Biometric Id" />
                  <FormInput label="Admission Date" type="date" />
                </div>

                <div className="Student-Admission-Row">
                  <FormInput label="First Name *" />
                  <FormInput label="Last Name" />
                  <FormSelect label="Gender *" options={["Male","Female"]}/>
                </div>

                <div className="Student-Admission-Row">
                  <FormInput label="Date of Birth *" type="date" />
                  <FormSelect label="Category" />
                  <FormInput label="Religion" />
                </div>

                <div className="Student-Admission-Row">
                  <FormInput label="Caste" />
                  <FormInput label="Mobile Number" />
                  <FormInput label="Email" type="email" />
                </div>

                <div className="Student-Admission-Row">
                  <FormSelect label="Blood Group" />
                  <FormSelect label="House" />
                  <FormSelect label="Sponsor" />
                </div>

                <div className="Student-Admission-Row">
                  <FormInput label="Height" />
                  <FormInput label="Weight" />
                  <FormInput label="Aadhar Number" />
                </div>

              </div>

              <div className="Student-Admission-Right">
                <PhotoUploadBox />
              </div>

            </div>
          </AccordionSection>

          {/* ================= CUSTOM FIELD ================= */}
          <AccordionSection title="Custom Field">
            <div className="Student-Admission-SingleColumn">

              <FormInput label="PEN" />
              <FormInput label="SR NO" />
              <FormInput label="APAAR ID" />

              <div className="Student-Admission-Group">
                <label className="Student-Admission-Label">
                  Students Behaviour
                </label>
                <div className="Student-Admission-CheckboxGroup">
                  <label><input type="checkbox" /> Good</label>
                  <label><input type="checkbox" /> Average</label>
                  <label><input type="checkbox" /> Bad</label>
                </div>
              </div>

            </div>
          </AccordionSection>

          {/* ================= PARENT / GUARDIAN ================= */}
          <AccordionSection title="Parent / Guardian Details">

            {/* FATHER */}
            <h3 className="Student-Admission-SectionTitle">Father Details</h3>
            <div className="Student-Admission-FormGrid">
              <div className="Student-Admission-Left">
                <div className="Student-Admission-Row">
                  <FormInput label="Father Name" />
                  <FormInput label="Father Phone" />
                  <FormInput label="Father DOB" type="date" />
                </div>

                <div className="Student-Admission-Row Student-Admission-TwoColumn">
                  <FormInput label="Father Occupation" />
                  <FormInput label="Marriage Anniversary Date" type="date" />
                </div>
              </div>

              <div className="Student-Admission-Right">
                <PhotoUploadBox />
              </div>
            </div>

            {/* MOTHER */}
            <h3 className="Student-Admission-SectionTitle">Mother Details</h3>
            <div className="Student-Admission-FormGrid">
              <div className="Student-Admission-Left">
                <div className="Student-Admission-Row Student-Admission-TwoColumn">
                  <FormInput label="Mother Name" />
                  <FormInput label="Mother Phone" />
                </div>

                <div className="Student-Admission-Row Student-Admission-TwoColumn">
                  <FormInput label="Mother DOB" type="date" />
                  <FormInput label="Mother Occupation" />
                </div>
              </div>

              <div className="Student-Admission-Right">
                <PhotoUploadBox />
              </div>
            </div>

            {/* GUARDIAN */}
            <h3 className="Student-Admission-SectionTitle">Guardian Details</h3>

            <div className="Student-Admission-Group">
              <label className="Student-Admission-Label">If Guardian Is *</label>
              <div className="Student-Admission-RadioGroup">
                <label><input type="radio" name="guardian" /> Father</label>
                <label><input type="radio" name="guardian" /> Mother</label>
                <label><input type="radio" name="guardian" /> Other</label>
              </div>
            </div>

            <div className="Student-Admission-FormGrid">
              <div className="Student-Admission-Left">

                <div className="Student-Admission-Row">
                  <FormInput label="Guardian Name *" />
                  <FormInput label="Guardian Relation" />
                  <FormInput label="Guardian Email" />
                </div>

                <div className="Student-Admission-Row Student-Admission-TwoColumn">
                  <FormInput label="Guardian Phone *" />
                  <FormInput label="Guardian Occupation" />
                </div>

                <FormTextarea label="Guardian Address" />

              </div>

              <div className="Student-Admission-Right">
                <PhotoUploadBox />
              </div>
            </div>

          </AccordionSection>

          {/* ================= OTHER DETAILS ================= */}
          <AccordionSection title="Other Details">

            <h3 className="Student-Admission-SectionTitle">
              Student Address Details
            </h3>

            <div className="Student-Admission-AddressGrid">
              <div>
                <label className="Student-Admission-CheckboxInline">
                  <input type="checkbox" />
                  If Guardian Address is Current Address
                </label>
                <FormTextarea label="Current Address" />
              </div>

              <div>
                <label className="Student-Admission-CheckboxInline">
                  <input type="checkbox" />
                  If Permanent Address is Current Address
                </label>
                <FormTextarea label="Permanent Address" />
              </div>
            </div>

            <h3 className="Student-Admission-SectionTitle">Student Fee Assign</h3>
            <FormSelect label="Fee Group" />

            <h3 className="Student-Admission-SectionTitle">Assign Discount</h3>
            <div className="Student-Admission-Row Student-Admission-TwoColumn">
              <FormSelect label="Discount List" />
              <FormSelect label="Month" />
            </div>

            <h3 className="Student-Admission-SectionTitle">Transport Details</h3>
            <div className="Student-Admission-Row Student-Admission-TwoColumn">
              <FormSelect label="Route List" />
              <FormSelect label="Bus Stop" />
            </div>

            <h3 className="Student-Admission-SectionTitle">Hostel Details</h3>
            <div className="Student-Admission-Row Student-Admission-TwoColumn">
              <FormSelect label="Hostel Type" />
              <FormSelect label="Hostel Name" />
              <FormSelect label="Room Type" />
              <FormSelect label="Room" />
            </div>

            <h3 className="Student-Admission-SectionTitle">
              Miscellaneous Details
            </h3>

            <div className="Student-Admission-Row Student-Admission-TwoColumn">
              <FormInput label="Bank Account Number" />
              <FormInput label="Bank Name" />
              <FormInput label="Branch Code" />
            </div>

            <FormTextarea label="Previous School Details" />
            <FormTextarea label="Note" />

          </AccordionSection>

        {/* ================= UPLOAD DOCUMENTS ================= */}
          <AccordionSection title="Upload Documents">
            <table className="Student-Admission-DocumentTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Upload File</th>
                </tr>
              </thead>

              <tbody>
                {[
                  "Report Card",
                  "TC",
                  "Samagra ID",
                  "NIDA Card Number",
                  "Previous Year Marksheet",
                  "Student Photo",
                  "Student DOB Certificate",
                  "Aadhaar Card",
                  "Aadhaar Card (Parent)",
                  "Income Certificate",
                  "PIP"
                ].map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    {/* DOCUMENT NAME (NOT INPUT) */}
                    <td className="Student-Admission-DocName">
                      {item}
                    </td>

                    {/* FILE INPUT */}
                    <td>
                      <input
                        type="file"
                        className="Student-Admission-FileInput"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionSection>

          {/* SUBMIT */}
          <div className="Student-Admission-SubmitWrapper">
            <button className="Student-Admission-SubmitBtn">
              Submit
            </button>
          </div>

  </div>
  </div>
);
}

const FormInput = ({ label, type="text" }) => (
    <div className="Student-Admission-Group">
      <label className="Student-Admission-Label">{label}</label>
      <input type={type} className="Student-Admission-Input"/>
    </div>
);

const FormSelect = ({ label }) => (
    <div className="Student-Admission-Group">
      <label className="Student-Admission-Label">{label}</label>
      <select className="Student-Admission-Input">
        <option>Select</option>
      </select>
    </div>
);
const FormTextarea = ({ label }) => (
    <div className="Student-Admission-Group">
      <label className="Student-Admission-Label">{label}</label>
      <textarea className="Student-Admission-Textarea"/>
    </div>
);

const PhotoUploadBox = () => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  // Cleanup memory (important professional practice)
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="Student-Admission-PhotoBox">
      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="Student-Admission-PhotoPreview"
          />

          <div className="Student-Admission-PhotoOverlay">
            Change Photo
          </div>
        </>
      ) : (
        <div className="Student-Admission-PhotoPlaceholder">
          <span>Upload Photo</span>
          <small>JPG / PNG (Max 2MB)</small>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        className="Student-Admission-PhotoInput"
        onChange={handleImageChange}
      />
    </div>
  );
};