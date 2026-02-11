import React, { useState } from "react";
import { FaEllipsisV, FaCheckCircle } from "react-icons/fa";

import p1 from "../Assets/pic1.webp"
import p2 from "../Assets/pic2.webp"
import p3 from "../Assets/pic3.webp"
import p4 from "../Assets/pic4.webp"
import p5 from "../Assets/pic5.webp"
import p6 from "../Assets/pic6.webp"

const students = [
  { img: p1, name: "Dawud Khan", id: "12314125", amount: "$15,21" },
  { img: p2, name: "Helena Khan", id: "12314125", amount: "$56,34" },
  { img: p3, name: "Peter Jim", id: "12314125", amount: "$54" },
  { img: p4, name: "Melinda Truth", id: "12314125", amount: "$24,78" },
  { img: p5, name: "Hawkins Jr.", id: "12314125", amount: "$56,3" },
  { img: p6, name: "Louis", id: "12314125", amount: "$56,3" }
];

const UnpaidStudents = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dashboard-card unpaid-card">

      {/* HEADER */}
      <div className="dashboard-card-header">

        <div>
          <h3>Unpaid Student Intuition</h3>
          <p>You have 456 contacts</p>
        </div>

        <div className="three-dot-menu">
          <FaEllipsisV onClick={() => setMenuOpen(!menuOpen)} />

          {menuOpen && (
            <div className="three-dot-dropdown fancy-dropdown">
              <div>View Detail</div>
              <div>Edit</div>
              <div>Delete</div>
            </div>
          )}
        </div>

      </div>

      {/* LIST */}

      <div className="unpaid-list">

        {students.map((s, i) => (
          <div key={i} className="unpaid-row">

            <div className="student-info">
              <img src={s.img} alt="" />

              <div>
                <h4>{s.name}</h4>
                <span>ID {s.id}</span>
              </div>
            </div>

            <div className="student-class">
              <FaCheckCircle className="tick-icon" />
              <div>
                <strong>VII-A</strong>
                <span>Class</span>
              </div>
            </div>

            <div className="student-amount">
              {s.amount}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default UnpaidStudents;
