import React, { useEffect, useState } from "react";
import TestimonialForm from "../../Component/Testimonialpages/TestimonialForm";
import TestimonialList from "../../Component/Testimonialpages/TestimonialList";
import API from "../../api/axios";
import "./TestimonialPage.css";

const TestimonialPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editItem, setEditItem] = useState(null);

  /* ================= FETCH ================= */
  const fetchTestimonials = async () => {
    try {
      const res = await API.get("/testimonials");

      // ✅ FIX: use res.data.data (array)
      setTestimonials(Array.isArray(res.data.data) ? res.data.data : []);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      setTestimonials([]); // safety fallback
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* ================= DELETE ================= */
  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      await API.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  return (
    <div className="adm-testimonial-wrapper">
      <div className="adm-testimonial-form-section">
        <TestimonialForm
          editItem={editItem}
          setEditItem={setEditItem}
          refreshTestimonials={fetchTestimonials}
        />
      </div>

      <div className="adm-testimonial-list-section">
        <TestimonialList
          testimonials={testimonials}
          onEdit={setEditItem}
          onDelete={deleteTestimonial}
        />
      </div>
    </div>
  );
};

export default TestimonialPage;