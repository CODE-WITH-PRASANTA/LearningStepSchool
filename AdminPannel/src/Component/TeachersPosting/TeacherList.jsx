import React from "react";

const TeacherList = ({ teachers, onEdit, onDelete }) => {
  return (
    <div className="teacher-list-container">
      <h2 className="teacher-list-title">Teacher Posting List</h2>

      {teachers.length === 0 && (
        <p className="teacher-empty-text">No teachers added yet</p>
      )}

      {teachers.map((teacher) => (
        <div className="teacher-list-card" key={teacher.id}>
          
          <img
            src={teacher.photo}
            alt={teacher.name}
            className="teacher-list-image"
          />

          <div className="teacher-list-info">
            <h3>{teacher.name}</h3>
            <p>{teacher.review}</p>

            {/* STAR DISPLAY */}

           <div className="teacher-list-stars">
  {Array.from({ length: teacher.rating }).map((_, index) => (
    <span key={index} className="teacher-star-filled">
      ★
    </span>
  ))}
</div>


            {/* SOCIAL LINKS */}

            <div className="teacher-social-links">
              <p>Facebook: {teacher.facebook}</p>
              <p>Instagram: {teacher.instagram}</p>
              <p>LinkedIn: {teacher.linkedin}</p>
            </div>
          </div>

          <div className="teacher-list-actions">
            <button
              className="teacher-edit-btn"
              onClick={() => onEdit(teacher)}
            >
              Edit
            </button>

            <button
              className="teacher-delete-btn"
              onClick={() => onDelete(teacher.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherList;
