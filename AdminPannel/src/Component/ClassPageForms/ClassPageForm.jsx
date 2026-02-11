import React, { useEffect, useState } from "react";

const sectionOptions = [
  "A",
  "Comm",
  "B",
  "Gujrat Board",
  "D",
  "E",
  "C",
];

const ClassPageForm = ({ editRow, onSave }) => {
  const [form, setForm] = useState({
    srNo: "",
    group: "",
    className: "",
    section: "",
    cctv: {
      A: "",
      Comm: "",
      B: "",
      "Gujrat Board": "",
      D: "",
      E: "",
      C: "",
    },
  });

  /* EDIT MODE */
  useEffect(() => {
    if (editRow) {
      setForm({
        srNo: editRow.srNo || "",
        group: editRow.group || "",
        className: editRow.className || "",
        section: editRow.section || "",
        cctv: {
          A: editRow.cctv?.A || "",
          Comm: editRow.cctv?.Comm || "",
          B: editRow.cctv?.B || "",
          "Gujrat Board": editRow.cctv?.["Gujrat Board"] || "",
          D: editRow.cctv?.D || "",
          E: editRow.cctv?.E || "",
          C: editRow.cctv?.C || "",
        },
      });
    }
  }, [editRow]);

  /* SUBMIT */
  const submit = () => {
    if (!form.srNo || !form.className || !form.section) return;
    onSave(form);
  };

  return (
    <div className="class-card class-form">
      <div className="class-card-header">✏️ Add / Edit Class</div>

      <div className="class-body">
        {/* SR NO */}
        <label>Sr. No *</label>
        <input
          placeholder="Enter Sr. No"
          value={form.srNo}
          onChange={(e) =>
            setForm({ ...form, srNo: e.target.value })
          }
        />

        {/* GROUP NAME */}
        <label>Group Name</label>
        <input
          placeholder="Group Name"
          value={form.group}
          onChange={(e) =>
            setForm({ ...form, group: e.target.value })
          }
        />

        {/* CLASS */}
        <label>Class *</label>
        <input
          placeholder="Enter Class"
          value={form.className}
          onChange={(e) =>
            setForm({ ...form, className: e.target.value })
          }
        />

        {/* SECTION */}
        <label>Section *</label>
        <select
          value={form.section}
          onChange={(e) =>
            setForm({ ...form, section: e.target.value })
          }
        >
          <option value="">Select Section</option>
          {sectionOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* CCTV LINK TITLE */}
        <label style={{ marginTop: "10px" }}></label>

        <label>Section : A</label>
        <input
          placeholder="Enter CCTV Link for Section A"
          value={form.cctv.A}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: { ...form.cctv, A: e.target.value },
            })
          }
        />

        <label>Section : Comm</label>
        <input
          placeholder="Enter CCTV Link for Section Comm"
          value={form.cctv.Comm}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: { ...form.cctv, Comm: e.target.value },
            })
          }
        />

        <label>Section : B</label>
        <input
          placeholder="Enter CCTV Link for Section B"
          value={form.cctv.B}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: { ...form.cctv, B: e.target.value },
            })
          }
        />

        <label>Section : Gujrat Board</label>
        <input
          placeholder="Enter CCTV Link for Section Gujrat Board"
          value={form.cctv["Gujrat Board"]}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: {
                ...form.cctv,
                "Gujrat Board": e.target.value,
              },
            })
          }
        />

        <label>Section : D</label>
        <input
          placeholder="Enter CCTV Link for Section D"
          value={form.cctv.D}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: { ...form.cctv, D: e.target.value },
            })
          }
        />

        <label>Section : E</label>
        <input
          placeholder="Enter CCTV Link for Section E"
          value={form.cctv.E}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: { ...form.cctv, E: e.target.value },
            })
          }
        />

        <label>Section : C</label>
        <input
          placeholder="Enter CCTV Link for Section C"
          value={form.cctv.C}
          onChange={(e) =>
            setForm({
              ...form,
              cctv: { ...form.cctv, C: e.target.value },
            })
          }
        />

        {/* SAVE / UPDATE */}
        <button className="btn-primary">
          {editRow ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
};

export default ClassPageForm;
