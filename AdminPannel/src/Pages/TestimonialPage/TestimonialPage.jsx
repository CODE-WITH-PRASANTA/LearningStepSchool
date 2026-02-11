import React, { useState } from "react";
import TestimonialForm from "../../Component/Testimonialpages/TestimonialForm";
import TestimonialList from "../../Component/Testimonialpages/TestimonialList";
import "./Testimonialpage.css";

const TestimonialPage = () => {

  const [testimonials, setTestimonials] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const addTestimonial = (data) => {
    setTestimonials([...testimonials, { ...data, id: Date.now() }]);
  };

  const updateTestimonial = (updated) => {
    setTestimonials(
      testimonials.map(item =>
        item.id === updated.id ? updated : item
      )
    );
    setEditItem(null);
  };

  const deleteTestimonial = (id) => {
    setTestimonials(testimonials.filter(item => item.id !== id));
  };

  return (
    <div className="adm-testimonial-wrapper">

      <div className="adm-testimonial-form-section">
        <TestimonialForm
          addTestimonial={addTestimonial}
          editItem={editItem}
          updateTestimonial={updateTestimonial}
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
