import React, { useState } from "react";


const GatePassForm = ({ onAdd }) => {

  const [issuedTo, setIssuedTo] = useState("Student");
  const [imageType, setImageType] = useState("upload");
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    person: "",
    startDate: "",
    endDate: "",
    inTime: "",
    outTime: "",
    note: "",
    image: null,
  });

  /* ================= INPUT ================= */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ================= IMAGE ================= */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFormData({ ...formData, image: url });
    }
  };

  /* ================= SUBMIT ================= */
  const submitForm = (e) => {
    e.preventDefault();

    onAdd({
      ...formData,
      issuedTo,
    });

    setFormData({
      name: "",
      person: "",
      startDate: "",
      endDate: "",
      inTime: "",
      outTime: "",
      note: "",
      image: null,
    });

    setPreview(null);
    setImageType("upload");
    setIssuedTo("Student");
  };

  return (
    <div className="gatepass-form-card">

      {/* HEADER */}
      <div className="card-header">
        Add Gate Pass
      </div>

      {/* FORM */}
      <form className="form-body" onSubmit={submitForm}>

        {/* ISSUED TO */}
        <div className="form-group">
          <label>Issued To *</label>
          <select value={issuedTo} onChange={(e) => setIssuedTo(e.target.value)}>
            <option>Student</option>
            <option>Staff</option>
          </select>
        </div>

        {/* NAME */}
        <div className="form-group">
          <label>{issuedTo} Name *</label>
          <input
            name="name"
            placeholder={`${issuedTo} Name`}
            value={formData.name}
            onChange={handleInput}
            required
          />
        </div>

        {/* ⭐ DATE ROW */}
        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInput}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInput}
              required
            />
          </div>
        </div>

        {/* ⭐ TIME ROW */}
        <div className="form-row">
          <div className="form-group">
            <label>In Time</label>
            <input
              type="time"
              name="inTime"
              value={formData.inTime}
              onChange={handleInput}
            />
          </div>

          <div className="form-group">
            <label>Out Time</label>
            <input
              type="time"
              name="outTime"
              value={formData.outTime}
              onChange={handleInput}
            />
          </div>
        </div>

        {/* IMAGE */}
        <div className="form-group">
          <label>Image</label>

          <div className="image-options">
            <label>
              <input
                type="radio"
                checked={imageType === "upload"}
                onChange={() => setImageType("upload")}
              />
              Upload
            </label>

            <label>
              <input
                type="radio"
                checked={imageType === "capture"}
                onChange={() => setImageType("capture")}
              />
              Capture
            </label>
          </div>

          {imageType === "upload" && (
            <div className="image-box">
              {preview ? (
                <img src={preview} className="preview-img" alt="preview" />
              ) : (
                <span>⬆</span>
              )}
              <input type="file" onChange={handleImage} />
            </div>
          )}

          {imageType === "capture" && (
            <div className="capture-section">
              <div className="capture-placeholder"></div>
              <button
                type="button"
                className="btn-primary capture-btn"
                onClick={() => alert("Camera integration coming soon")}
              >
                Capture image
              </button>
            </div>
          )}
        </div>

        {/* PERSON */}
        <div className="form-group">
          <label>Name of Person Carrying Student</label>
          <input
            name="person"
            placeholder="Name of Person Carrying Student"
            value={formData.person}
            onChange={handleInput}
          />
        </div>

        {/* NOTE */}
        <div className="form-group">
          <label>Note</label>
          <textarea
            name="note"
            placeholder="Note"
            value={formData.note}
            onChange={handleInput}
          />
        </div>

        {/* SAVE */}
        <button className="btn-primary" type="submit">
          Save
        </button>

      </form>
    </div>
  );
};

export default GatePassForm;