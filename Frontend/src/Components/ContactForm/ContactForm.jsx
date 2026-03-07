import React, { useState } from "react";
import "./ContactForm.css";
import API from "../../Api/Api";

// Assets
import ContactImg from "../../assets/Contact-video (1).webp";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.phone || !form.message) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/enquiries", form);

      alert("Enquiry submitted successfully!");

      setForm({
        name: "",
        address: "",
        phone: "",
        message: "",
      });

    } catch (err) {
      console.error("ENQUIRY ERROR:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-sec">
      <div className="contact__container">

        {/* LEFT PANEL */}
        <div className="contact__left">
          <div className="contact__info">
            {/* PHONE */}
            <div className="contact__info-item">
              <div className="contact__icon">📞</div>
              <div>
                <span>Call Us for Admissions</span>
                <h4>
                  <a href="tel:+917014627894" style={{ color: "inherit", textDecoration: "none" }}>
                    +91 70146 27894
                  </a>
                </h4>
                <h4>
                  <a href="tel:+919887868746" style={{ color: "inherit", textDecoration: "none" }}>
                    +91 98878 68746
                  </a>
                </h4>
              </div>
            </div>

            {/* EMAIL */}
            <div className="contact__info-item">
              <div className="contact__icon">✉️</div>
              <div>
                <span>Email Address</span>
                <h4>
                  <a
                    href="mailto:learningstep19@gmail.com"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    learningstep19@gmail.com
                  </a>
                </h4>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="contact__info-item">
              <div className="contact__icon">📍</div>
              <div>
                <span>School Campus Address</span>
                <h4>Tehla Bypass, Alwar Road</h4>
                <h4>Rajgarh – 301408, Rajasthan</h4>
              </div>
            </div>
          </div>

          {/* VIDEO IMAGE */}
          <div className="contact__video">
            <img
              src={ContactImg}
              alt="LearningStep International School Campus"
            />
            <button className="contact__play-btn">▶</button>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact__right">
          <h2 className="contact__title">
            Connect with LearningStep International School
          </h2>

          <p className="contact__desc">
            Contact us today for admissions, fee details, curriculum
            information, and campus visits.
          </p>

          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-row">
              <div className="contact__field">
                <label>Parent / Guardian Name*</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Parent or Guardian Name"
                />
              </div>

              <div className="contact__field">
                <label>Address*</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter Address"
                />
              </div>
            </div>

            <div className="contact__field">
              <label>Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="contact__field">
              <label>Your Message*</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your enquiry..."
              ></textarea>
            </div>

            <button className="contact__btn" disabled={loading}>
              {loading ? "Sending..." : "Send Enquiry →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;