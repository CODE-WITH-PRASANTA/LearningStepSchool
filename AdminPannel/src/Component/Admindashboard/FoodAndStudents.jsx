import React from "react";
import { FaChartBar } from "react-icons/fa";

import food1 from "../../assets/pic11.webp";
import food2 from "../../assets/pic12.webp";
import food3 from "../../assets/pic11.webp";

import s1 from "../../assets/pic1.webp";
import s2 from "../../assets/pic2.webp";
import s3 from "../../assets/pic3.webp";
import s4 from "../../assets/pic4.webp";
import s5 from "../../assets/pic5.webp";

const foods = [
  {
    img: food1,
    title: "Chicken Teriyaki Khas Haji Muhidin Malang"
  },
  {
    img: food2,
    title: "Fried Chicken Roll Extra Spicy with Mozarella"
  },
  {
    img: food3,
    title: "Fried Chicken Roll Extra Spicy with Mozarella"
  }
];

const students = [
  { img: s1, name: "Melinda Moss", class: "VII-AB" },
  { img: s2, name: "Melinda Moss", class: "VII-AB" },
  { img: s3, name: "Melinda Moss", class: "VII-AB" },
  { img: s4, name: "Melinda Moss", class: "VII-AB" },
  { img: s5, name: "Melinda Moss", class: "VII-AB" }
];

const FoodAndStudents = () => {
  return (
    <div className="food-student-grid">

      {/* LEFT FOOD MENU */}

      <div className="dashboard-card food-card">

        <h3>Current Food Menu</h3>
        <p>Lorem ipsum dolor</p>

        <div className="food-scroll">

          {foods.map((f, i) => (
            <div key={i} className="food-item">

              <img src={f.img} alt="" />

              <h4>{f.title}</h4>

              <div className="food-footer">
                <span className="food-type">FOR BREAKFAST</span>

                <div className="food-stats">
                  <FaChartBar />
                  <span>6,723</span>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* RIGHT RECENT STUDENTS */}

      <div className="dashboard-card recent-students-card">

        <h3>Recent Students</h3>
        <p>You have 245 clients</p>

        <div className="students-list">

          {students.map((s, i) => (
            <div key={i} className="student-row">

              <img src={s.img} alt="" />

              <div>
                <h4>{s.name}</h4>
                <span>{s.class}</span>
              </div>

            </div>
          ))}

        </div>

        <button className="view-more-btn">
          View 240 More
        </button>

      </div>

    </div>
  );
};

export default FoodAndStudents;
