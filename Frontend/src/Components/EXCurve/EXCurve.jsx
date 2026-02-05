import React, { useEffect, useRef } from "react";
import "./EXCurve.css";
import bgImage from "../../assets/p-1.webp";

const grades = [
  { id: 1, color: "#4c8b1a", grade: "Grade 1", age: "Age 03 - 04" },
  { id: 2, color: "#7b1fa2", grade: "Grade 2", age: "Age 03 - 04" },
  { id: 3, color: "#d17b00", grade: "Grade 3", age: "Age 03 - 04" },
  { id: 4, color: "#4c8b1a", grade: "Grade 4", age: "Age 03 - 04" }
];

export default function GradePrograms() {
  const trackRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => moveRight(), 3500);
    return () => clearInterval(interval);
  }, []);

  const moveRight = () => {
    const track = trackRef.current;
    const width = track.firstElementChild.offsetWidth + 40;

    track.style.transition = "transform 0.6s ease";
    track.style.transform = `translateX(-${width}px)`;

    setTimeout(() => {
      track.style.transition = "none";
      track.appendChild(track.firstElementChild);
      track.style.transform = "translateX(0)";
    }, 600);
  };

  const moveLeft = () => {
    const track = trackRef.current;
    const width = track.firstElementChild.offsetWidth + 40;

    track.style.transition = "none";
    track.prepend(track.lastElementChild);
    track.style.transform = `translateX(-${width}px)`;

    requestAnimationFrame(() => {
      track.style.transition = "transform 0.6s ease";
      track.style.transform = "translateX(0)";
    });
  };

  return (
    <section
      className="grade-wrapper"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* LEFT */}
      <div className="grade-left">
        <span className="grade-small">GRADE LEVEL</span>
        <h2>Grade Programs</h2>
        <p>Work And Play Come Together ?</p>

        <div className="grade-arrows">
          <button onClick={moveLeft}>&larr;</button>
          <button onClick={moveRight}>&rarr;</button>
        </div>
      </div>

      {/* RIGHT SLIDER */}
      <div className="grade-slider">
        <div className="grade-track" ref={trackRef}>
          {grades.map((item) => (
            <div className="grade-circle" key={item.id}>
              {/* OUTER DASHED RING */}
              <div className="grade-dashed-ring">
                {/* INNER WHITE CIRCLE */}
                <div className="grade-card">
                  <div
                    className="grade-inner"
                    style={{ background: item.color }}
                  >
                    <span>GRADE</span>
                    <strong>1</strong>
                  </div>

                  <h4>{item.grade}</h4>
                  <p>{item.age}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
