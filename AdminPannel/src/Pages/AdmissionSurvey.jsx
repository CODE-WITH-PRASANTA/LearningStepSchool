import { useState } from "react";

export default function AdmissionSurvey() {
  const initialForm = {
    parentName: "",
    mobile: "",
    whatsapp: "Yes",
    village: "",
    children: 1,
    age: "",
    className: "",
    medium: "English",
    currentSchool: "",
    feeRange: "",
    transport: "No",
    distance: "",
    interest: "",
    concern: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.parentName || !form.mobile) {
      alert("Parent Name and Mobile Number are required");
      return;
    }

    // Simulate submit (API ready)
    console.log("Survey Submitted:", form);

    alert("Survey submitted successfully ✅");

    // Reset form
    setForm(initialForm);
  };

  return (
    <div className="space-y-10 p-4">
      {/* HEADER */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-indigo-700">
          LEARNING STEP INTERNATIONAL SCHOOL
        </h1>
        <p className="text-sm text-slate-500">School Admission Survey</p>
      </div>

      {/* FORM + PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-sky-50 via-white to-indigo-50
          rounded-2xl shadow-md border border-indigo-100
          p-6 lg:p-8
          max-h-[calc(100vh-200px)]
          overflow-y-auto"
        >
          <h2 className="text-lg font-semibold text-indigo-700 mb-6">
            Parent Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Parent Name">
              <input
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Mobile No">
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength={10}
                className="input"
              />
            </Field>

            <Field label="WhatsApp">
              <select
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                className="input"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>

            <Field label="Village">
              <input
                name="village"
                value={form.village}
                onChange={handleChange}
                className="input"
              />
            </Field>
          </div>

          <h2 className="text-lg font-semibold text-indigo-700 mt-8 mb-4">
            Child Details
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="No of Children">
              <input
                type="number"
                min="1"
                name="children"
                value={form.children}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Age">
              <select
                name="age"
                value={form.age}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                {[...Array(15)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
            </Field>

            <Field label="Class">
              <select
                name="className"
                value={form.className}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>P.G</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i}>{i + 1}</option>
                ))}
              </select>
            </Field>

            <Field label="Medium">
              <select
                name="medium"
                value={form.medium}
                onChange={handleChange}
                className="input"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>
            </Field>
          </div>

          <h2 className="text-lg font-semibold text-indigo-700 mt-8 mb-4">
            School Preferences
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Current School">
              <input
                name="currentSchool"
                value={form.currentSchool}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Current Annual Fee">
              <select
                name="feeRange"
                value={form.feeRange}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>8k - 10k</option>
                <option>10k - 12k</option>
                <option>13k - 16k</option>
                <option>16k - 20k</option>
                <option>21k - 25k</option>
              </select>
            </Field>

            <Field label="Transport Required">
              <select
                name="transport"
                value={form.transport}
                onChange={handleChange}
                className="input"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>

            <Field label="Distance (KM)">
              <select
                name="distance"
                value={form.distance}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>0 - 3</option>
                <option>4 - 6</option>
                <option>7 - 9</option>
                <option>10 - 13</option>
                <option>Above 13</option>
              </select>
            </Field>

            <Field label="Admission Interest">
              <select
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>Confirm</option>
                <option>Maybe</option>
                <option>Not Interested</option>
              </select>
            </Field>

            <Field label="Main Concern">
              <select
                name="concern"
                value={form.concern}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select</option>
                <option>Fee</option>
                <option>Distance</option>
                <option>Transport</option>
                <option>Quality</option>
                <option>Safety</option>
              </select>
            </Field>
          </div>

          <button
          type="submit"
          className="mt-8 w-full rounded-xl py-3 text-white font-semibold
          bg-gradient-to-r from-indigo-600 to-violet-600
          hover:scale-[1.01] transition cursor-pointer"
        >
          Submit Survey
        </button>

        </form>

        {/* ================= LIVE PREVIEW ================= */}
        <div
          className="bg-gradient-to-br from-emerald-50 to-sky-50
          rounded-2xl shadow-md border border-emerald-200 p-6 lg:p-8"
        >
          <h2 className="text-lg font-semibold text-emerald-700 mb-4">
            Live Preview
          </h2>

          <div className="bg-white rounded-xl p-6 space-y-2 text-sm">
            <Preview label="Parent" value={form.parentName} />
            <Preview label="Mobile" value={form.mobile} />
            <Preview label="Village" value={form.village} />
            <Preview label="Children" value={form.children} />
            <Preview
              label="Age / Class"
              value={`${form.age} / ${form.className}`}
            />
            <Preview label="Medium" value={form.medium} />
            <Preview label="School" value={form.currentSchool} />
            <Preview label="Fee Range" value={form.feeRange} />
            <Preview label="Transport" value={form.transport} />
            <Preview label="Distance" value={form.distance} />
            <Preview label="Interest" value={form.interest} />
            <Preview label="Concern" value={form.concern} />
          </div>
        </div>
      </div>

      {/* INPUT STYLE */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.6rem 0.9rem;
          font-size: 14px;
        }
        .input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 1px #6366f1;
        }
      `}</style>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-indigo-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Preview({ label, value }) {
  if (!value) return null;
  return (
    <p>
      <span className="font-semibold text-slate-600">{label}:</span>{" "}
      <span className="text-slate-700">{value}</span>
    </p>
  );
}
