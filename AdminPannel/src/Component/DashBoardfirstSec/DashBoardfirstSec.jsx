import React, { useEffect, useMemo, useState } from "react";
import "./DashBoardfirstSec.css";

const DashBoardfirstSec = () => {
  const base = "dashboard-first";
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cards = useMemo(
    () => [
      { id: 1, title: "Student", value: 128, badge: null, icon: "students" },
      { id: 2, title: "Student Presence", value: 0, badge: "Today", icon: "calendar" },
      { id: 3, title: "Monthly Fees", value: 13108805, badge: null, icon: "fees" },
      { id: 4, title: "Income / Expense", value: "51000 / 5500", badge: "Monthly", icon: "income" },
      { id: 5, title: "Staff", value: 71, badge: null, icon: "staff" },
      { id: 6, title: "Staff Presence", value: 1, badge: "Today", icon: "staffPresence" },
    ],
    []
  );

  const studentUpcoming = useMemo(
    () => [
      { id: 1, name: "Test Student", date: "28th Feb" },
      { id: 2, name: "inv knik", date: "1st Mar" },
    ],
    []
  );

  const staffUpcoming = useMemo(
    () => [
      { id: 1, name: "Super Admin", date: "3rd Mar (Birthday)" },
      { id: 2, name: "Sonali Jain", date: "1st Mar (Work Anniversary)" },
    ],
    []
  );

  const Icon = ({ name }) => {
    switch (name) {
      case "students":
        return (
          <svg viewBox="0 0 96 96" className={`${base}__svg`} aria-hidden="true">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#ff8a65" />
                <stop offset="1" stopColor="#ffb74d" />
              </linearGradient>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0" stopColor="#7e57c2" />
                <stop offset="1" stopColor="#5c6bc0" />
              </linearGradient>
            </defs>
            <circle cx="34" cy="30" r="12" fill="url(#g1)" />
            <circle cx="60" cy="30" r="12" fill="#8d6e63" />
            <rect x="18" y="46" width="60" height="26" rx="12" fill="#eef4ff" />
            <rect x="22" y="50" width="52" height="18" rx="9" fill="url(#g2)" opacity="0.22" />
            <path
              d="M24 68c6-12 18-16 24-16s18 4 24 16"
              fill="none"
              stroke="#90a4ae"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg viewBox="0 0 96 96" className={`${base}__svg`} aria-hidden="true">
            <rect x="18" y="20" width="60" height="56" rx="14" fill="#eef4ff" />
            <rect x="18" y="20" width="60" height="16" rx="14" fill="#ff6b6b" opacity="0.9" />
            <rect x="30" y="14" width="8" height="16" rx="4" fill="#cfd8dc" />
            <rect x="58" y="14" width="8" height="16" rx="4" fill="#cfd8dc" />
            <circle cx="62" cy="58" r="14" fill="#2f7cf6" opacity="0.12" />
            <circle cx="62" cy="58" r="10" fill="#2f7cf6" opacity="0.25" />
            <path d="M62 52v7l5 3" fill="none" stroke="#2f7cf6" strokeWidth="4" strokeLinecap="round" />
            <g fill="#90a4ae" opacity="0.8">
              <rect x="26" y="42" width="10" height="6" rx="3" />
              <rect x="40" y="42" width="10" height="6" rx="3" />
              <rect x="26" y="52" width="10" height="6" rx="3" />
              <rect x="40" y="52" width="10" height="6" rx="3" />
            </g>
          </svg>
        );
      case "fees":
        return (
          <svg viewBox="0 0 96 96" className={`${base}__svg`} aria-hidden="true">
            <rect x="18" y="34" width="60" height="36" rx="12" fill="#e8f5e9" />
            <rect x="22" y="38" width="52" height="28" rx="10" fill="#66bb6a" opacity="0.18" />
            <path d="M32 30h42" stroke="#37474f" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M58 30v-8" stroke="#37474f" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <circle cx="48" cy="52" r="12" fill="#66bb6a" opacity="0.25" />
            <path
              d="M50 44c-6 0-8 3-8 5 0 6 16 2 16 8 0 2-2 5-8 5"
              fill="none"
              stroke="#2e7d32"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M50 42v20" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case "income":
        return (
          <svg viewBox="0 0 96 96" className={`${base}__svg`} aria-hidden="true">
            <rect x="22" y="20" width="52" height="56" rx="14" fill="#eef4ff" />
            <rect x="30" y="14" width="36" height="12" rx="6" fill="#2f7cf6" opacity="0.22" />
            <circle cx="42" cy="44" r="6" fill="#2f7cf6" opacity="0.35" />
            <circle cx="42" cy="60" r="6" fill="#ffb300" opacity="0.35" />
            <rect x="52" y="40" width="16" height="8" rx="4" fill="#90a4ae" opacity="0.75" />
            <rect x="52" y="56" width="16" height="8" rx="4" fill="#90a4ae" opacity="0.75" />
            <path d="M72 28l10 6-10 6z" fill="#ff6b6b" opacity="0.8" />
          </svg>
        );
      case "staff":
        return (
          <svg viewBox="0 0 96 96" className={`${base}__svg`} aria-hidden="true">
            <circle cx="32" cy="38" r="12" fill="#ffd54f" opacity="0.9" />
            <circle cx="60" cy="34" r="10" fill="#4dd0e1" opacity="0.9" />
            <circle cx="58" cy="60" r="12" fill="#81c784" opacity="0.9" />
            <circle cx="32" cy="60" r="12" fill="#fff" stroke="#263238" strokeWidth="4" />
            <path d="M27 60l4 4 10-10" fill="none" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case "staffPresence":
      default:
        return (
          <svg viewBox="0 0 96 96" className={`${base}__svg`} aria-hidden="true">
            <circle cx="32" cy="32" r="10" fill="#90caf9" opacity="0.85" />
            <rect x="20" y="44" width="28" height="28" rx="12" fill="#eef4ff" />
            <path d="M56 18h20" stroke="#263238" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
            <rect x="54" y="28" width="22" height="36" rx="10" fill="#e8f5e9" />
            <path d="M60 46l6 6 10-14" fill="none" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <section className={`${base} ${animate ? `${base}--in` : ""}`}>
      <div className={`${base}__topbar`}>
        <button className={`${base}__refresh`} type="button">
          <span className={`${base}__refreshIcon`} aria-hidden="true">
            ⟳
          </span>
          Refresh Dashboard
        </button>
      </div>

      <div className={`${base}__grid`}>
        {cards.map((c, idx) => (
          <article
            key={c.id}
            className={`${base}__card`}
            style={{ animationDelay: `${idx * 85}ms` }}
          >
            {/* ✅ badge stays OUTSIDE inner clip so it won't cut */}
            {c.badge && (
              <span
                className={`${base}__badge ${
                  c.badge === "Monthly" ? `${base}__badge--monthly` : `${base}__badge--today`
                }`}
              >
                {c.badge}
              </span>
            )}

            {/* ✅ NEW: inner wrapper that clips blobs/background only */}
            <div className={`${base}__cardInner`}>
              <div className={`${base}__iconWrap`}>
                <div className={`${base}__blob ${base}__blob--a`} />
                <div className={`${base}__blob ${base}__blob--b`} />
                <Icon name={c.icon} />
              </div>

              <div className={`${base}__pill`}>{c.title}</div>

              <div className={`${base}__value`}>
                {typeof c.value === "number" ? c.value.toLocaleString("en-IN") : c.value}
              </div>
            </div>
          </article>
        ))}

        <article className={`${base}__upcoming`} style={{ animationDelay: `600ms` }}>
          <span className={`${base}__badge ${base}__badge--upcoming`}>Upcoming</span>

          {/* ✅ inner wrapper for upcoming also */}
          <div className={`${base}__upcomingInner`}>
            <div className={`${base}__upHead`}>
              <div className={`${base}__upTitle`}>
                <span className={`${base}__cake`} aria-hidden="true">
                  🎂
                </span>
                <div>
                  <div className={`${base}__upSmall`}>Upcoming</div>
                  <div className={`${base}__upBig`}>Birthday</div>
                </div>
              </div>

              <button className={`${base}__download`} type="button">
                Download Graphic <span className={`${base}__gift`} aria-hidden="true">🎁</span>
              </button>
            </div>

            <div className={`${base}__upCols`}>
              <div className={`${base}__col`}>
                <div className={`${base}__colTag`}>Student</div>

                {studentUpcoming.map((p) => (
                  <div key={p.id} className={`${base}__person`}>
                    <div className={`${base}__avatar`} aria-hidden="true">
                      <svg viewBox="0 0 64 64" className={`${base}__avatarSvg`}>
                        <circle cx="32" cy="26" r="10" fill="#cfd8dc" />
                        <rect x="14" y="40" width="36" height="16" rx="8" fill="#cfd8dc" />
                        <rect x="10" y="10" width="44" height="44" rx="22" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                      </svg>
                    </div>
                    <div className={`${base}__personText`}>
                      <div className={`${base}__personName`}>{p.name}</div>
                      <div className={`${base}__personDate`}>{p.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`${base}__col`}>
                <div className={`${base}__colTag`}>Staff</div>

                {staffUpcoming.map((p) => (
                  <div key={p.id} className={`${base}__person`}>
                    <div className={`${base}__avatar`} aria-hidden="true">
                      <svg viewBox="0 0 64 64" className={`${base}__avatarSvg`}>
                        <circle cx="32" cy="26" r="10" fill="#cfd8dc" />
                        <rect x="14" y="40" width="36" height="16" rx="8" fill="#cfd8dc" />
                        <rect x="10" y="10" width="44" height="44" rx="22" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                      </svg>
                    </div>
                    <div className={`${base}__personText`}>
                      <div className={`${base}__personName`}>{p.name}</div>
                      <div className={`${base}__personDate`}>{p.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default DashBoardfirstSec;