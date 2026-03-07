// Question.jsx
import React, { useState } from "react";
import "./Question.css";
import { FaSearch, FaPlus, FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";

const Question = () => {
  const base = "question-list";

  const [selected, setSelected] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const questions = [
    {
      id: 1,
      question: "What is the capital of India?",
      class: "1st - A",
      subject: "Geography",
      lesson: "Chapter 1",
      session: "2024-25",
      type: "Short Answer",
      level: "Easy",
      marks: 2,
    },
    {
      id: 2,
      question: "Define photosynthesis.",
      class: "5th - B",
      subject: "Science",
      lesson: "Chapter 3",
      session: "2024-25",
      type: "Long Answer",
      level: "Medium",
      marks: 5,
    },
    {
      id: 3,
      question: "Solve: 12 × 8",
      class: "4th - A",
      subject: "Math",
      lesson: "Multiplication",
      session: "2024-25",
      type: "Numerical",
      level: "Easy",
      marks: 1,
    },
    {
      id: 4,
      question: "Who wrote the National Anthem of India?",
      class: "6th - C",
      subject: "English",
      lesson: "Poetry",
      session: "2024-25",
      type: "Short Answer",
      level: "Medium",
      marks: 3,
    },
  ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleActionMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  return (
    <div className={base}>
      {/* PAGE HEADER */}
      <div className={`${base}__top`}>
        <h2 className={`${base}__pageTitle`}>Question</h2>
        <div className={`${base}__breadcrumb`}>
          Question / <span>Question List</span>
        </div>
      </div>

      {/* FILTER CARD */}
      <div className={`${base}__card`}>
        <div className={`${base}__cardHeader`}>
          <h3>Select Criteria</h3>

          <div className={`${base}__headerBtns`}>
            <button className={`${base}__importBtn`}>Import Questions</button>

            <Link to="/update-question" className={`${base}__linkBtn`}>
              <button className={`${base}__addBtn`}>
                <FaPlus /> Add
              </button>
            </Link>
          </div>
        </div>

        <div className={`${base}__cardBody ${base}__formGrid`}>
          <div className={`${base}__formGroup`}>
            <label>Class</label>
            <select>
              <option>Select Class</option>
              <option>1st</option>
              <option>10th</option>
            </select>
          </div>

          <div className={`${base}__formGroup`}>
            <label>Section</label>
            <select>
              <option>Select Section</option>
              <option>A</option>
              <option>B</option>
            </select>
          </div>

          <div className={`${base}__formGroup`}>
            <label>Subject</label>
            <select>
              <option>Select Subject</option>
              <option>Math</option>
              <option>English</option>
              <option>Science</option>
            </select>
          </div>

          <div className={`${base}__searchWrap`}>
            <button className={`${base}__searchBtn`} type="button">
              <FaSearch /> <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUESTION LIST */}
      <div className={`${base}__card`}>
        <div className={`${base}__cardHeader`}>
          <h3>Question List</h3>
        </div>

        <div className={`${base}__tableWrap`}>
          <table className={`${base}__table`}>
            <thead>
              <tr>
                <th className={`${base}__thCheck`}>
                  <input type="checkbox" />
                </th>
                <th className={`${base}__thSmall`}>#</th>
                <th>Question</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Lesson</th>
                <th>Session</th>
                <th>Type</th>
                <th>Level</th>
                <th className={`${base}__thSmall`}>Marks</th>
                <th className={`${base}__thAction`}>Action</th>
              </tr>
            </thead>

            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(q.id)}
                      onChange={() => toggleSelect(q.id)}
                    />
                  </td>
                  <td>{q.id}</td>
                  <td>{q.question}</td>
                  <td>{q.class}</td>
                  <td>{q.subject}</td>
                  <td>{q.lesson}</td>
                  <td>{q.session}</td>
                  <td>{q.type}</td>
                  <td>{q.level}</td>
                  <td>{q.marks}</td>

                  <td className={`${base}__actionCell`}>
                    <FaEllipsisV
                      className={`${base}__dots`}
                      onClick={() => toggleActionMenu(q.id)}
                    />

                    {openMenu === q.id && (
                      <div className={`${base}__menu`}>
                        <button type="button">Edit</button>
                        <button type="button" className={`${base}__deleteBtn`}>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Question;