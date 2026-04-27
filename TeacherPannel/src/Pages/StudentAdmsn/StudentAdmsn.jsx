import React, { useState, useEffect } from "react";
import AccordionSection from "../../Components/AccordionSection/AccordionSection";
import API, { IMAGE_URL } from "../../api/axios";
import { Download } from "lucide-react";
import "./StudentAdmsn.css";
import { useNavigate } from "react-router-dom";
import DownloadFrom from '../../assets/ApplicationForm.pdf.pdf'

const initialFormState = {
  admissionNo: "",
  class: "",
  section: "",
  rollNumber: "",
  biometricId: "",
  admissionDate: "",
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  category: "",
  religion: "",
  caste: "",
  mobile: "",
  email: "",
  bloodGroup: "",
  house: "",
  sponsor: "",
  height: "",
  weight: "",
  aadharNumber: "",

  pen: "",
  srNo: "",
  apaarId: "",

  fatherName: "",
  fatherPhone: "",
  fatherDob: "",
  fatherOccupation: "",
  marriageAnniversary: "",

  motherName: "",
  motherPhone: "",
  motherDob: "",
  motherOccupation: "",

  guardianType: "",
  guardianName: "",
  guardianRelation: "",
  guardianEmail: "",
  guardianPhone: "",
  guardianOccupation: "",
  guardianAddress: "",

  guardianAddressSame: false,
  permanentAddressSame: false,
  currentAddress: "",
  permanentAddress: "",

  feeGroup: "",
  discountList: "",
  discountMonth: "",

  routeList: "",
  busStop: "",

  hostelType: "",
  hostelName: "",
  roomType: "",
  room: "",

  bankAccountNumber: "",
  bankName: "",
  branchCode: "",

  previousSchoolDetails: "",
  note: "",

  studentBehaviour: [],
};

export default function StudentAdmission() {
  const [formData, setFormData] = useState(initialFormState);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("editStudentId");

    if (!id) return;

    const loadStudent = async () => {
      try {
        const res = await API.get(`/students/${id}`);

        const studentData = res.data?.data || res.data;

        setFormData({
          ...initialFormState,
          ...studentData,

          // 🔥 ADD THIS LINE
          documents: studentData.documents || {},

          studentBehaviour: Array.isArray(studentData.studentBehaviour)
            ? studentData.studentBehaviour
            : studentData.studentBehaviour
              ? JSON.parse(studentData.studentBehaviour)
              : [],
        });

        setEditId(id);
      } catch (error) {
        console.error("Edit load error:", error);
      }
    };

    loadStudent();
  }, []);

  useEffect(() => {
    if (formData.guardianAddressSame && formData.guardianAddress) {
      setFormData((prev) => ({
        ...prev,
        currentAddress: formData.guardianAddress,
      }));
    }
  }, [formData.guardianAddressSame, formData.guardianAddress]);

  useEffect(() => {
    if (formData.permanentAddressSame && formData.currentAddress) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: formData.currentAddress,
      }));
    }
  }, [formData.permanentAddressSame, formData.currentAddress]);

  useEffect(() => {
    if (formData.guardianType === "Father") {
      setFormData((prev) => ({
        ...prev,
        guardianName: prev.fatherName,
        guardianPhone: prev.fatherPhone,
        guardianRelation: "Father",
      }));
    }

    if (formData.guardianType === "Mother") {
      setFormData((prev) => ({
        ...prev,
        guardianName: prev.motherName,
        guardianPhone: prev.motherPhone,
        guardianRelation: "Mother",
      }));
    }

    if (formData.guardianType === "Other") {
      setFormData((prev) => ({
        ...prev,
        guardianName: "",
        guardianPhone: "",
        guardianRelation: "",
      }));
    }
  }, [
    formData.guardianType,
    formData.fatherName,
    formData.fatherPhone,
    formData.motherName,
    formData.motherPhone,
  ]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get("/classes");
        setClasses(res.data.data || []);
      } catch (err) {
        console.error("Class fetch error:", err);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileChange = (name, file) => {
    setFiles((prev) => ({
      ...prev,
      [name]: file,
    }));

    // 🔥 ALSO update formData (IMPORTANT)
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: null,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        !formData.admissionNo ||
        !formData.class ||
        !formData.section ||
        !formData.firstName ||
        !formData.gender ||
        !formData.dob
      ) {
        alert("Please fill all required fields");
        return;
      }

      for (const file of Object.values(files)) {
        if (file && file.size > 2 * 1024 * 1024) {
          alert("Each file must be under 2MB");
          return;
        }
      }

      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value !== undefined) {
          if (Array.isArray(value)) {
            data.append(key, JSON.stringify(value));
          } else if (value === null) {
            data.append(key, ""); // 🔥 FIX
          } else {
            data.append(key, value);
          }
        }
      });

      Object.keys(files).forEach((key) => {
        if (files[key]) {
          data.append(key, files[key]);
        }
      });

      /* ================= CREATE OR UPDATE ================= */

      if (editId) {
        await API.put(`/students/${editId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Student Updated Successfully");

        localStorage.removeItem("editStudentId");
        navigate("/student/admission/details");
      } else {
        await API.post("/students", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Student Created Successfully");
      }

      setFormData(initialFormState);
      setFiles({});
      setEditId(null);
    } catch (error) {
      console.error(error);
      alert("Error saving student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Student-Admission-Page">
      <div className="Student-Admission-Container">
        {/* HEADER */}
        <div className="Student-Admission-Header">
          <h1 className="Student-Admission-Title">
            {editId ? "Edit Student" : "Student Admission"}
          </h1>
         <button
          className="Student-Admission-DownloadBtn"
          onClick={() => {
            const link = document.createElement("a");
            link.href = DownloadFrom;
            link.download = "ApplicationForm.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <Download size={18} />
          Download Form
        </button>
        </div>

        {/* ================= STUDENT DETAILS ================= */}
        <AccordionSection title="Student Details">
          <div className="Student-Admission-FormGrid">
            <div className="Student-Admission-Left">
              <div className="Student-Admission-Row">
                <FormInput
                  label="Admission No *"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Class *"
                  name="class"
                  value={formData.class}
                  options={classes.map((cls) => cls.className)}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Section *"
                  options={["A", "B", "C"]}
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row">
                <FormInput
                  label="Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                />

                <FormInput
                  label="Biometric Id"
                  name="biometricId"
                  value={formData.biometricId}
                  onChange={handleChange}
                />

                <FormInput
                  label="Admission Date"
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row">
                <FormInput
                  label="First Name *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />

                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Gender *"
                  name="gender"
                  value={formData.gender}
                  options={["Male", "Female"]}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row">
                <FormInput
                  label="Date of Birth *"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Category"
                  name="category"
                  value={formData.category}
                  options={["General", "OBC", "SC", "ST"]}
                  onChange={handleChange}
                />

                <FormInput
                  label="Religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row">
                <FormInput
                  label="Caste"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                />

                <FormInput
                  label="Mobile Number"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row">
                <FormSelect
                  label="Blood Group"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                  onChange={handleChange}
                />

                <FormSelect
                  label="House"
                  name="house"
                  options={["Red", "Blue", "Green", "Yellow"]}
                  value={formData.house}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Sponsor"
                  name="sponsor"
                  value={formData.sponsor}
                  options={["Government", "Private", "Self"]}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row">
                <FormInput
                  label="Height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                />

                <FormInput
                  label="Weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />

                <FormInput
                  label="Aadhar Number"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="Student-Admission-Right">
              <PhotoUploadBox
                name="studentPhoto"
                onFileChange={handleFileChange}
                existingImage={formData.studentPhoto}
              />
            </div>
          </div>
        </AccordionSection>

        {/* ================= CUSTOM FIELD ================= */}
        <AccordionSection title="Custom Field">
          <div className="Student-Admission-SingleColumn">
            <FormInput
              label="PEN"
              name="pen"
              value={formData.pen}
              onChange={handleChange}
            />

            <FormInput
              label="SR NO"
              name="srNo"
              value={formData.srNo}
              onChange={handleChange}
            />

            <FormInput
              label="APAAR ID"
              name="apaarId"
              value={formData.apaarId}
              onChange={handleChange}
            />

            <div className="Student-Admission-Group">
              <label className="Student-Admission-Label">
                Students Behaviour
              </label>

              <div className="Student-Admission-CheckboxGroup">
                {["Good", "Average", "Bad"].map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      value={item}
                      checked={formData.studentBehaviour.includes(item)}
                      onChange={(e) => {
                        const checked = e.target.checked;

                        setFormData((prev) => ({
                          ...prev,
                          studentBehaviour: checked
                            ? [...prev.studentBehaviour, item]
                            : prev.studentBehaviour.filter((v) => v !== item),
                        }));
                      }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </AccordionSection>
        {/* ================= PARENT / GUARDIAN ================= */}
        <AccordionSection title="Parent / Guardian Details">
          {/* ================= FATHER ================= */}

          <h3 className="Student-Admission-SectionTitle">Father Details</h3>

          <div className="Student-Admission-FormGrid">
            <div className="Student-Admission-Left">
              <div className="Student-Admission-Row">
                <FormInput
                  label="Father Name"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                />

                <FormInput
                  label="Father Phone"
                  name="fatherPhone"
                  value={formData.fatherPhone}
                  onChange={handleChange}
                />

                <FormInput
                  label="Father DOB"
                  type="date"
                  name="fatherDob"
                  value={formData.fatherDob}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row Student-Admission-TwoColumn">
                <FormInput
                  label="Father Occupation"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                />

                <FormInput
                  label="Marriage Anniversary Date"
                  type="date"
                  name="marriageAnniversary"
                  value={formData.marriageAnniversary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="Student-Admission-Right">
              <PhotoUploadBox
                name="fatherPhoto"
                onFileChange={handleFileChange}
                existingImage={formData.fatherPhoto}
              />
            </div>
          </div>

          {/* ================= MOTHER ================= */}

          <h3 className="Student-Admission-SectionTitle">Mother Details</h3>

          <div className="Student-Admission-FormGrid">
            <div className="Student-Admission-Left">
              <div className="Student-Admission-Row Student-Admission-TwoColumn">
                <FormInput
                  label="Mother Name"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                />

                <FormInput
                  label="Mother Phone"
                  name="motherPhone"
                  value={formData.motherPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row Student-Admission-TwoColumn">
                <FormInput
                  label="Mother DOB"
                  type="date"
                  name="motherDob"
                  value={formData.motherDob}
                  onChange={handleChange}
                />

                <FormInput
                  label="Mother Occupation"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="Student-Admission-Right">
              <PhotoUploadBox
                name="motherPhoto"
                onFileChange={handleFileChange}
                existingImage={formData.motherPhoto}
              />
            </div>
          </div>

          {/* ================= GUARDIAN ================= */}

          <h3 className="Student-Admission-SectionTitle">Guardian Details</h3>

          <div className="Student-Admission-Group">
            <label className="Student-Admission-Label">If Guardian Is </label>

            <div className="Student-Admission-RadioGroup">
              <label>
                <input
                  type="radio"
                  name="guardianType"
                  value="Father"
                  checked={formData.guardianType === "Father"}
                  onChange={(e) => handleChange("guardianType", e.target.value)}
                />
                Father
              </label>

              <label>
                <input
                  type="radio"
                  name="guardianType"
                  value="Mother"
                  checked={formData.guardianType === "Mother"}
                  onChange={(e) => handleChange("guardianType", e.target.value)}
                />
                Mother
              </label>

              <label>
                <input
                  type="radio"
                  name="guardianType"
                  value="Other"
                  checked={formData.guardianType === "Other"}
                  onChange={(e) => handleChange("guardianType", e.target.value)}
                />
                Other
              </label>
            </div>
          </div>

          <div className="Student-Admission-FormGrid">
            <div className="Student-Admission-Left">
              <div className="Student-Admission-Row">
                <FormInput
                  label="Guardian Name"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  disabled={formData.guardianType !== "Other"}
                />

                <FormInput
                  label="Guardian Relation"
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleChange}
                  disabled={formData.guardianType !== "Other"}
                />

                <FormInput
                  label="Guardian Email"
                  name="guardianEmail"
                  value={formData.guardianEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="Student-Admission-Row Student-Admission-TwoColumn">
                <FormInput
                  label="Guardian Phone"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  disabled={formData.guardianType !== "Other"}
                />

                <FormInput
                  label="Guardian Occupation"
                  name="guardianOccupation"
                  value={formData.guardianOccupation}
                  onChange={handleChange}
                />
              </div>

              <FormTextarea
                label="Guardian Address"
                name="guardianAddress"
                value={formData.guardianAddress}
                onChange={handleChange}
              />
            </div>

            <div className="Student-Admission-Right">
              <PhotoUploadBox
                name="guardianPhoto"
                onFileChange={handleFileChange}
                existingImage={formData.guardianPhoto}
              />
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
                <input
                  type="checkbox"
                  checked={formData.guardianAddressSame}
                  onChange={(e) =>
                    handleChange("guardianAddressSame", e.target.checked)
                  }
                />
                If Guardian Address is Current Address
              </label>

              <FormTextarea
                label="Current Address"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                disabled={formData.guardianAddressSame}
              />
            </div>

            <div>
              <label className="Student-Admission-CheckboxInline">
                <input
                  type="checkbox"
                  checked={formData.permanentAddressSame}
                  onChange={(e) =>
                    handleChange("permanentAddressSame", e.target.checked)
                  }
                />
                If Permanent Address is Current Address
              </label>

              <FormTextarea
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <h3 className="Student-Admission-SectionTitle">Student Fee Assign</h3>

          <FormSelect
            label="Fee Group"
            name="feeGroup"
            value={formData.feeGroup}
            options={[
              "General Fee",
              "Hostel Fee",
              "Transport Fee",
              "Sports Fee",
              "Library Fee",
            ]}
            onChange={handleChange}
          />

          <h3 className="Student-Admission-SectionTitle">Assign Discount</h3>

          <div className="Student-Admission-Row Student-Admission-TwoColumn">
            <FormSelect
              label="Discount List"
              name="discountList"
              value={formData.discountList}
              options={[
                "No Discount",
                "Sibling Discount",
                "Staff Child Discount",
                "Merit Scholarship",
                "Financial Aid",
              ]}
              onChange={handleChange}
            />

            <FormSelect
              label="Month"
              name="discountMonth"
              value={formData.discountMonth}
              options={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
              onChange={handleChange}
            />
          </div>

          <h3 className="Student-Admission-SectionTitle">Transport Details</h3>

          <div className="Student-Admission-Row Student-Admission-TwoColumn">
            <FormSelect
              label="Route List"
              name="routeList"
              value={formData.routeList}
              options={[
                "Route A - City Center",
                "Route B - North Area",
                "Route C - South Area",
                "Route D - East Area",
                "Route E - West Area",
              ]}
              onChange={handleChange}
            />

            <FormSelect
              label="Bus Stop"
              name="busStop"
              value={formData.busStop}
              options={[
                "Main Market",
                "Bus Stand",
                "Railway Station",
                "City Mall",
                "Hospital Chowk",
                "Sector 1",
                "Sector 2",
                "Sector 3",
              ]}
              onChange={handleChange}
            />
          </div>

          <h3 className="Student-Admission-SectionTitle">Hostel Details</h3>

          <div className="Student-Admission-Row Student-Admission-TwoColumn">
            <FormSelect
              label="Hostel Type"
              name="hostelType"
              value={formData.hostelType}
              options={["Boys Hostel", "Girls Hostel", "Day Boarding"]}
              onChange={handleChange}
            />

            <FormSelect
              label="Hostel Name"
              name="hostelName"
              value={formData.hostelName}
              options={[
                "Tagore Hostel",
                "Vivekananda Hostel",
                "APJ Abdul Kalam Hostel",
                "Sarojini Naidu Hostel",
              ]}
              onChange={handleChange}
            />

            <FormSelect
              label="Room Type"
              name="roomType"
              value={formData.roomType}
              options={[
                "Single Room",
                "Double Sharing",
                "Triple Sharing",
                "Dormitory",
              ]}
              onChange={handleChange}
            />

            <FormSelect
              label="Room"
              name="room"
              value={formData.room}
              options={["101", "102", "103", "201", "202", "203", "301", "302"]}
              onChange={handleChange}
            />
          </div>

          <h3 className="Student-Admission-SectionTitle">
            Miscellaneous Details
          </h3>

          <div className="Student-Admission-Row Student-Admission-TwoColumn">
            <FormInput
              label="Bank Account Number"
              name="bankAccountNumber"
              value={formData.bankAccountNumber}
              onChange={handleChange}
            />

            <FormInput
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
            />

            <FormInput
              label="Branch Code"
              name="branchCode"
              value={formData.branchCode}
              onChange={handleChange}
            />
          </div>

          <FormTextarea
            label="Previous School Details"
            name="previousSchoolDetails"
            value={formData.previousSchoolDetails}
            onChange={handleChange}
          />

          <FormTextarea
            label="Note"
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </AccordionSection>

        {/* ================= UPLOAD DOCUMENTS ================= */}
        <AccordionSection title="Upload Documents">
          <table className="Student-Admission-DocumentTable">
            <thead>
              <tr>
                <th>#</th>
                <th>Document Name</th>
                <th>Upload / View File</th>
              </tr>
            </thead>

            <tbody>
              {[
                { label: "Report Card", field: "reportCard" },
                { label: "TC", field: "tc" },
                { label: "Samagra ID", field: "samagraId" },
                { label: "NIDA Card Number", field: "nidaCard" },
                {
                  label: "Previous Year Marksheet",
                  field: "previousMarksheet",
                },
                { label: "Student DOB Certificate", field: "dobCertificate" },
                { label: "Aadhaar Card", field: "aadhaarStudent" },
                { label: "Aadhaar Card (Parent)", field: "aadhaarParent" },
                { label: "Income Certificate", field: "incomeCertificate" },
                { label: "PIP", field: "pip" },
              ].map((item, index) => (
                <tr key={item.field}>
                  <td>{index + 1}</td>

                  <td className="Student-Admission-DocName">{item.label}</td>

                  <td className="Student-Admission-DocumentCell">
                    <DocumentUpload
                      name={item.field}
                      existingFile={(formData.documents || {})[item.field]}
                      onFileChange={handleFileChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AccordionSection>

        {/* SUBMIT */}
        <div className="Student-Admission-SubmitWrapper">
          <button
            type="button"
            className="Student-Admission-SubmitBtn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : editId ? "Update Student" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

const FormInput = ({
  label,
  type = "text",
  name,
  onChange,
  value,
  disabled,
}) => {
  const handleInputChange = (e) => {
    let val = e.target.value;

    // Only numbers for phone / aadhar
    if (
      name === "mobile" ||
      name === "fatherPhone" ||
      name === "motherPhone" ||
      name === "guardianPhone" ||
      name === "aadharNumber"
    ) {
      val = val.replace(/[^0-9]/g, "");

      // limit length
      if (
        name === "mobile" ||
        name === "fatherPhone" ||
        name === "motherPhone" ||
        name === "guardianPhone"
      ) {
        val = val.slice(0, 10);
      }

      if (name === "aadharNumber") {
        val = val.slice(0, 12);
      }
    }

    onChange(name, val);
  };

  return (
    <div className="Student-Admission-Group">
      <label className="Student-Admission-Label">{label}</label>

      <input
        type={type}
        name={name}
        value={value || ""}
        disabled={disabled}
        className="Student-Admission-Input"
        onChange={handleInputChange}
      />
    </div>
  );
};

const FormSelect = ({ label, name, onChange, options = [], value }) => (
  <div className="Student-Admission-Group">
    <label className="Student-Admission-Label">{label}</label>

    <select
      name={name}
      value={value || ""}
      className="Student-Admission-Input"
      onChange={(e) => onChange(name, e.target.value)}
    >
      <option value="">Select</option>

      {options.map((opt) =>
        typeof opt === "object" ? (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ),
      )}
    </select>
  </div>
);

const FormTextarea = ({ label, name, onChange, value, disabled }) => (
  <div className="Student-Admission-Group">
    <label className="Student-Admission-Label">{label}</label>

    <textarea
      name={name}
      value={value || ""}
      disabled={disabled}
      className="Student-Admission-Textarea"
      onChange={(e) => onChange(name, e.target.value)}
    />
  </div>
);
const PhotoUploadBox = ({ name, onFileChange, existingImage }) => {
  const [preview, setPreview] = useState(null);

  // ✅ LOAD EXISTING IMAGE (SAFE)
  useEffect(() => {
    if (!existingImage) {
      setPreview(null);
      return;
    }

    let imagePath =
      existingImage && typeof existingImage === "object"
        ? existingImage?.path
        : existingImage || null;

    let imageUrl = imagePath;

    if (
      imagePath &&
      typeof imagePath === "string" &&
      !imagePath.startsWith("http")
    ) {
      imageUrl = `${IMAGE_URL}${imagePath}`;
    }

    setPreview(imageUrl);
  }, [existingImage]);

  // ✅ CLEANUP (MEMORY LEAK FIX)
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ HANDLE FILE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ SIZE CHECK
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    // ✅ TYPE CHECK
    const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG, WEBP allowed");
      return;
    }

    // ✅ CLEAN OLD PREVIEW
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    onFileChange(name, file);
  };

  // ✅ REMOVE IMAGE
  const handleRemove = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onFileChange(name, null);
  };

  return (
    <div className="Student-Admission-PhotoBox">
      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="Student-Admission-PhotoPreview"
          />

          <div className="Student-Admission-PhotoOverlay">Change Photo</div>

          {/* 🔥 REMOVE BUTTON */}
          <button
            type="button"
            className="Student-Admission-RemoveBtn"
            onClick={handleRemove}
          >
            Remove
          </button>
        </>
      ) : (
        <div className="Student-Admission-PhotoPlaceholder">
          <span>Upload Photo</span>
          <small>JPG / PNG / WEBP (Max 2MB)</small>
        </div>
      )}

      <input
        type="file"
        name={name}
        accept="image/*"
        className="Student-Admission-PhotoInput"
        onChange={handleImageChange}
      />
    </div>
  );
};
const DocumentUpload = ({ name, existingFile, onFileChange }) => {
  // ✅ SAFE FILE PATH (no crash)
  const filePath =
    existingFile && typeof existingFile === "object"
      ? existingFile?.path
      : existingFile || null;

  // ✅ SAFE URL
  const fileUrl =
    filePath && typeof filePath === "string" && !filePath.startsWith("http")
      ? `${IMAGE_URL}${filePath}`
      : filePath || "";

  return (
    <div className="Student-Admission-DocumentBox">
      {/* ✅ FILE PREVIEW */}
      {filePath && (
        <div className="Student-Admission-DocumentPreview">
          <a href={fileUrl} target="_blank" rel="noreferrer">
            View File
          </a>

          {/* 🔥 Show file name */}
          <p style={{ fontSize: "12px", color: "#666" }}>
            {filePath.split("/").pop()}
          </p>

          {/* 🔥 REMOVE BUTTON */}
          {/* <button
            type="button"
            className="Student-Admission-RemoveBtn"
            onClick={() => onFileChange(name, null)}
          >
            Remove
          </button> */}
        </div>
      )}

      {/* ✅ FILE INPUT */}
      <input
        type="file"
        name={name}
        accept=".pdf,.jpg,.jpeg,.png"
        className="Student-Admission-FileInput"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // ✅ SIZE CHECK
          if (file.size > 2 * 1024 * 1024) {
            alert("File must be under 2MB");
            return;
          }

          // ✅ TYPE CHECK
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
          ];

          if (!allowedTypes.includes(file.type)) {
            alert("Only PDF, JPG, PNG allowed");
            return;
          }

          onFileChange(name, file);
        }}
      />
    </div>
  );
};
