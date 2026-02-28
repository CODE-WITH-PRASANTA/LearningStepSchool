import React, { useEffect, useState } from "react";
import "./FeesCollection.css";

const FeesCollection = () => {
  const base = "fees-collection";
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, []);

  const birthdayStudent = { name: "Test Student", date: "28th Feb" };

  return (
    <section className={`${base} ${animate ? `${base}--in` : ""}`}>
      <div className={`${base}__grid`}>
        {/* ================= LEFT CHART CARD ================= */}
        <div className={`${base}__card`}>
          <div className={`${base}__header`}>
            <h2>Fees Collection / Income / Expenses For February 2026</h2>

            <div className={`${base}__selectWrap`}>
              <select className={`${base}__select`}>
                <option>Select</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
              </select>
              <span className={`${base}__chev`} aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          <div className={`${base}__chartArea`}>
            <svg viewBox="0 0 800 300" className={`${base}__chart`}>
              {[0, 50, 100, 150, 200, 250].map((y, i) => (
                <line key={i} x1="60" y1={y} x2="760" y2={y} stroke="#e5e7eb" />
              ))}

              <polygon
                points="150,250 250,50 350,250"
                fill="#1f4f82"
                opacity="0.9"
                className={`${base}__spike`}
              />
            </svg>

            <div className={`${base}__legend`}>
              <span>
                <i className={`${base}__dot blue`} /> Collection
              </span>
              <span>
                <i className={`${base}__dot red`} /> Expense
              </span>
              <span>
                <i className={`${base}__dot orange`} /> Income
              </span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT BIRTHDAY CARD ================= */}
        <aside className={`${base}__birthdayCard`}>
          <div className={`${base}__bHeader`}>
            <span className={`${base}__badge`}>Todays</span>

            <div className={`${base}__bLeft`}>
              <div className={`${base}__bIcon`} aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <defs>
                    <linearGradient id="cakeTop" x1="0" x2="1">
                      <stop offset="0" stopColor="#ffb703" />
                      <stop offset="1" stopColor="#ffd166" />
                    </linearGradient>
                    <linearGradient id="cakeBody" x1="0" x2="1">
                      <stop offset="0" stopColor="#ff6b6b" />
                      <stop offset="1" stopColor="#ff9f43" />
                    </linearGradient>
                  </defs>

                  <rect x="18" y="10" width="4" height="12" rx="2" fill="#7c3aed" />
                  <rect x="30" y="10" width="4" height="12" rx="2" fill="#2563eb" />
                  <rect x="42" y="10" width="4" height="12" rx="2" fill="#f43f5e" />
                  <circle cx="20" cy="9" r="3" fill="#ff4d6d" />
                  <circle cx="32" cy="9" r="3" fill="#ff4d6d" />
                  <circle cx="44" cy="9" r="3" fill="#ff4d6d" />

                  <rect x="14" y="20" width="36" height="10" rx="5" fill="url(#cakeTop)" />
                  <rect x="12" y="28" width="40" height="22" rx="7" fill="url(#cakeBody)" />
                  <rect x="10" y="48" width="44" height="8" rx="4" fill="#fb7185" opacity="0.85" />

                  <circle cx="22" cy="34" r="1.5" fill="#fff" />
                  <circle cx="28" cy="38" r="1.5" fill="#fff" />
                  <circle cx="36" cy="34" r="1.5" fill="#fff" />
                  <circle cx="42" cy="40" r="1.5" fill="#fff" />
                </svg>
              </div>

              <h3 className={`${base}__bTitle`}>
                Student <br /> Birthday
              </h3>
            </div>

            <div className={`${base}__gifts`} aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <defs>
                  <linearGradient id="gGift1" x1="0" x2="1">
                    <stop offset="0" stopColor="#ffd1dc" />
                    <stop offset="1" stopColor="#ffe4ef" />
                  </linearGradient>
                  <linearGradient id="gGift2" x1="0" x2="1">
                    <stop offset="0" stopColor="#c7f9ff" />
                    <stop offset="1" stopColor="#d9fbff" />
                  </linearGradient>
                </defs>
                <rect x="10" y="26" width="18" height="22" rx="5" fill="url(#gGift1)" />
                <rect x="36" y="22" width="18" height="26" rx="5" fill="url(#gGift2)" />
                <rect x="18" y="26" width="4" height="22" fill="#ff5aa5" />
                <rect x="44" y="22" width="4" height="26" fill="#4aa3ff" />
                <path d="M16 24c2-6 8-6 10 0" fill="none" stroke="#ff5aa5" strokeWidth="3" strokeLinecap="round" />
                <path d="M42 20c2-6 8-6 10 0" fill="none" stroke="#4aa3ff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className={`${base}__bDivider`} />

          <div className={`${base}__bBody`}>
            <div className={`${base}__studentBox`}>
              <div className={`${base}__noImg`} aria-hidden="true">
                <div className={`${base}__noImgInner`}>
                  <svg viewBox="0 0 64 64" className={`${base}__userSvg`}>
                    <circle cx="32" cy="26" r="10" fill="#cfcfcf" />
                    <rect x="14" y="40" width="36" height="16" rx="8" fill="#cfcfcf" />
                  </svg>
                  <div className={`${base}__noImgText`}>
                    <div>NO IMAGE</div>
                    <div>AVAILABLE</div>
                  </div>
                </div>
              </div>

              <div className={`${base}__studentInfo`}>
                <div className={`${base}__studentName`}>{birthdayStudent.name}</div>
                <div className={`${base}__studentDate`}>{birthdayStudent.date}</div>
              </div>
            </div>

            <div className={`${base}__spacer`} />

            <button className={`${base}__wishBtn`} type="button">
              Birthday Wish
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default FeesCollection;