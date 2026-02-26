import AccordionSection from "../../Component/AccordionSection/AccordionSection";
import { Download } from "lucide-react";

export default function StudentAdmission() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-6xl mx-auto space-y-6  bg-[#F3F4F6] p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">Student Admission</h1>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition text-sm">
            <Download size={18} />
            Download Form
          </button>
        </div>

        {/* STUDENT DETAILS */}
        <AccordionSection title="Student Details">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* LEFT SIDE FORM FIELDS */}
            <div className="lg:col-span-3 space-y-6">
              {/* ROW 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Admission No *</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Class *</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Section *</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              {/* ROW 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Roll Number</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Biometric Id</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Admission Date</label>
                  <input type="date" className="input" />
                </div>
              </div>

              {/* ROW 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Last Name</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Gender *</label>
                  <select className="input">
                    <option>Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              {/* ROW 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Date of Birth *</label>
                  <input type="date" className="input" />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Religion</label>
                  <input type="text" className="input" />
                </div>
              </div>

              {/* ROW 5 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Caste</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Mobile Number</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" />
                </div>
              </div>

              {/* ROW 6 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Blood Group</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">House</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Sponsor</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>
              </div>

              {/* ROW 7 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Height</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Weight</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Aadhar Number</label>
                  <input type="text" className="input" />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE PHOTO */}
            <div className="flex justify-center">
              <div className="relative w-40 h-48 border-2 border-blue-400 rounded-lg flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm text-center">
                  No Image Available
                </span>

                <button
                  type="button"
                  className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Custom Field">
          <div className="space-y-6">
            {/* PEN */}
            <div>
              <label className="label">PEN</label>
              <input type="text" className="input" />
            </div>

            {/* SR NO */}
            <div>
              <label className="label">SR NO</label>
              <input type="text" className="input" />
            </div>

            {/* APAAR ID */}
            <div className="max-w-md">
              <label className="label">APAAR ID</label>
              <input type="text" className="input" />
            </div>

            {/* Students Behaviour */}
            <div>
              <label className="label mb-2">Students Behaviour</label>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Good</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Average</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Bad</span>
                </label>
              </div>
            </div>
          </div>
        </AccordionSection>
        {/* UPLOAD */}
        <AccordionSection title="Parent / Guardian Details">
          <div className="space-y-10">
            {/* ================= FATHER SECTION ================= */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* LEFT SIDE */}
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Father Name</label>
                    <input type="text" className="input" />
                  </div>

                  <div>
                    <label className="label">Father Phone</label>
                    <input type="text" className="input" />
                  </div>

                  <div>
                    <label className="label">Father DOB</label>
                    <input type="date" className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Father Occupation</label>
                    <input type="text" className="input" />
                  </div>

                  <div>
                    <label className="label">Marriage Anniversary Date</label>
                    <input type="date" className="input" />
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
                <PhotoUploadBox />
              </div>
            </div>

            {/* ================= MOTHER SECTION ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Mother Name</label>
                    <input type="text" className="input" />
                  </div>

                  <div>
                    <label className="label">Mother Phone</label>
                    <input type="text" className="input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Mother DOB</label>
                    <input type="date" className="input" />
                  </div>

                  <div>
                    <label className="label">Mother Occupation</label>
                    <input type="text" className="input" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
                <PhotoUploadBox />
              </div>
            </div>

            {/* ================= GUARDIAN SECTION ================= */}
            <div className="space-y-6">
              {/* Guardian Type */}
              <div>
                <label className="label">If Guardian Is *</label>
                <div className="flex gap-6 mt-2">
                  {["Father", "Mother", "Other"].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="guardianType"
                        className="accent-blue-600"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* LEFT SIDE */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">Guardian Name *</label>
                      <input type="text" className="input" />
                    </div>

                    <div>
                      <label className="label">Guardian Relation</label>
                      <input type="text" className="input" />
                    </div>

                    <div>
                      <label className="label">Guardian Email</label>
                      <input type="email" className="input" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Guardian Phone *</label>
                      <input type="text" className="input" />
                    </div>

                    <div>
                      <label className="label">Guardian Occupation</label>
                      <input type="text" className="input" />
                    </div>
                  </div>

                  <div>
                    <label className="label">Guardian Address</label>
                    <textarea rows="3" className="input"></textarea>
                  </div>
                </div>

                <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
                  <PhotoUploadBox />
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Other Details">
          <div className="space-y-10">
            {/* ================= STUDENT ADDRESS ================= */}
            <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
              <h3 className="sub-heading">Student Address Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm">
                    <input type="checkbox" className="accent-blue-600" />
                    If Guardian Address is Current Address
                  </label>

                  <label className="label">Current Address</label>
                  <textarea rows="3" className="input"></textarea>
                </div>

                <div>
                  <label className="flex items-center gap-2 mb-2 text-sm">
                    <input type="checkbox" className="accent-blue-600" />
                    If Permanent Address is Current Address
                  </label>

                  <label className="label">Permanent Address</label>
                  <textarea rows="3" className="input"></textarea>
                </div>
              </div>
            </div>

            {/* ================= FEE ASSIGN ================= */}
            <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
              <h3 className="sub-heading">Student Fee Assign</h3>

              <div>
                <label className="label">Fee Group</label>
                <select className="input">
                  <option>Select</option>
                </select>
              </div>
            </div>

            {/* ================= ASSIGN DISCOUNT ================= */}
            <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
              <h3 className="sub-heading">Assign Discount</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Discount List</label>
                  <select className="input">
                    <option>Select Option</option>
                  </select>
                </div>

                <div>
                  <label className="label">Month</label>
                  <select className="input">
                    <option>Select Option</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= TRANSPORT DETAILS ================= */}
            <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
              <h3 className="sub-heading">Transport Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Route List</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Bus Stop</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= HOSTEL DETAILS ================= */}
            <div className="border rounded-lg p-6 bg-gray-50 space-y-4">
              <h3 className="sub-heading">Hostel Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Hostel Type</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Hostel Name</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Room Type</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>

                <div>
                  <label className="label">Room</label>
                  <select className="input">
                    <option>Select</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= MISCELLANEOUS DETAILS ================= */}
            <div className="border rounded-lg p-6 bg-gray-50 space-y-6">
              <h3 className="sub-heading">Miscellaneous Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Bank Account Number</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Bank Name</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">Branch Code</label>
                  <input type="text" className="input" />
                </div>

                <div>
                  <label className="label">RTE</label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rte"
                        className="accent-blue-600"
                      />
                      Yes
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rte"
                        className="accent-blue-600"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Previous School Details</label>
                  <textarea rows="3" className="input"></textarea>
                </div>

                <div>
                  <label className="label">Note</label>
                  <textarea rows="3" className="input"></textarea>
                </div>
              </div>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Upload Documents">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              {/* TABLE HEADER */}
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border border-gray-300 px-3 py-3 w-12 text-center">
                    #
                  </th>
                  <th className="border border-gray-300 px-3 py-3 text-left">
                    TITLE
                  </th>
                  <th className="border border-gray-300 px-3 py-3 text-left">
                    DOCUMENTS
                  </th>
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
                  "Student DOB",
                  "Aadhaar Card",
                  "Aadhaar Card (Parent)",
                  "Income Certificate",
                  "PIP",
                ].map((title, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* NUMBER */}
                    <td className="border border-gray-300 px-3 py-4 text-center">
                      {index + 1}.
                    </td>

                    {/* TITLE */}
                    <td className="border border-gray-300 px-3 py-4">
                      <input
                        type="text"
                        defaultValue={title}
                        className="w-full bg-gray-200 rounded-md px-3 py-2 text-gray-700"
                      />
                    </td>

                    {/* FILE UPLOAD */}
                    <td className="border border-gray-300 px-3 py-4">
                      <div className="flex items-center gap-4">
                        <label className="bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-800 transition text-sm">
                          Choose File
                          <input type="file" className="hidden" />
                        </label>

                        <span className="text-gray-500 text-sm">
                          No file chosen
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionSection>

        {/* SUBMIT */}
        <div className="text-right">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

const PhotoUploadBox = () => {
  return (
    <div className="relative w-36 h-44 sm:w-40 sm:h-48 border-2 border-blue-400 rounded-lg flex items-center justify-center bg-gray-100 shrink-0">
      <span className="text-gray-400 text-sm text-center px-2">
        No Image Available
      </span>

      <button
        type="button"
        className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      >
        +
      </button>

      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
};
