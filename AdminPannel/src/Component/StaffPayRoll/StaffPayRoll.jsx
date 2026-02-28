// StaffPayRoll.jsx (rfce)
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./StaffPayRoll.css";

const StaffPayRoll = () => {
  const base = "staff-payroll";

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const months = useMemo(
    () => ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    []
  );

  const series = useMemo(
    () => [
      {
        name: "Fees Collection",
        colorClass: `${base}__s--fees`,
        pts: [0, 0, 0, 0, 0, 17000, 4598233, 2699476, 623, 4116338, 13108805, 0],
      },
      {
        name: "Expense",
        colorClass: `${base}__s--exp`,
        pts: [0, 0, 0, 0, 0, 0, 275500, 0, 0, 57700, 5500, 0],
      },
      {
        name: "Income",
        colorClass: `${base}__s--inc`,
        pts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Staff Payroll",
        colorClass: `${base}__s--pay`,
        pts: [0, 0, 0, 0, 0, 63316334, 0, 0, 0, 0, 0, 0],
      },
    ],
    []
  );

  // --- Chart sizing (viewBox-based, responsive through CSS)
  const W = 900;
  const H = 360;
  const padL = 64;
  const padR = 20;
  const padT = 24;
  const padB = 56;

  const maxY = 80000000; // 80M
  const yTicks = [0, 20000000, 40000000, 60000000, 80000000];

  const xStep = (W - padL - padR) / (months.length - 1);

  const yMap = (v) => {
    const usable = H - padT - padB;
    return padT + (usable - (v / maxY) * usable);
  };

  const pointsToPath = (arr) =>
    arr
      .map((v, i) => {
        const x = padL + i * xStep;
        const y = yMap(v);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <section className={base}>
      <div className={`${base}__grid`}>
        {/* ================= LEFT (CHART) CARD ================= */}
        <div className={`${base}__card`}>
          <div className={`${base}__topline`} />

          <header className={`${base}__head`}>
            <h2 className={`${base}__title`}>
              Fee Collection / Staff Payroll / Expense / Income (2025–26)
            </h2>

            {/* dropdown */}
            <div className={`${base}__menuWrap`} ref={menuRef}>
              <button
                className={`${base}__menuBtn`}
                type="button"
                aria-label="menu"
                onClick={() => setOpenMenu((p) => !p)}
              >
                <span />
                <span />
                <span />
              </button>

              {openMenu && (
                <div className={`${base}__dropdown`} role="menu">
                  <button type="button" className={`${base}__ddItem`}>
                    Download PNG image
                  </button>
                  <button type="button" className={`${base}__ddItem`}>
                    Download JPEG image
                  </button>
                  <button type="button" className={`${base}__ddItem`}>
                    Download PDF document
                  </button>
                  <button type="button" className={`${base}__ddItem`}>
                    Download SVG vector image
                  </button>

                  <div className={`${base}__ddNote`}>
                    <div>• Click any month to view details</div>
                    <div>• Hover on points to see values</div>
                    <div>• Data updates in real-time</div>
                    <div>• Export available in multiple formats</div>
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className={`${base}__divider`} />

          {/* chart */}
          <div className={`${base}__chartWrap`}>
            <div className={`${base}__chartBox`}>
              {/* IMPORTANT: svg is responsive; wrapper allows horizontal scroll on small screens */}
              <div className={`${base}__svgScroll`}>
                <svg
                  className={`${base}__svg`}
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="xMidYMid meet"
                  aria-label="chart"
                >
                  {/* grid + y labels */}
                  {yTicks.map((t) => {
                    const y = yMap(t);
                    return (
                      <g key={t}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={W - padR}
                          y2={y}
                          className={`${base}__gridLine`}
                        />
                        <text x={14} y={y + 5} className={`${base}__yText`}>
                          {t === 0 ? "0" : `${Math.round(t / 1000000)}M`}
                        </text>
                      </g>
                    );
                  })}

                  {/* y axis label */}
                  <text
                    x={18}
                    y={H / 2}
                    className={`${base}__axisLabel`}
                    transform={`rotate(-90 18 ${H / 2})`}
                  >
                    Amount
                  </text>

                  {/* series paths + points */}
                  {series.map((s) => (
                    <g key={s.name}>
                      <path
                        d={pointsToPath(s.pts)}
                        className={`${base}__path ${s.colorClass}`}
                        vectorEffect="non-scaling-stroke"
                      />

                      {s.pts.map((v, i) => {
                        const x = padL + i * xStep;
                        const y = yMap(v);
                        return (
                          <g key={`${s.name}-${i}`}>
                            <circle cx={x} cy={y} r={5.5} className={`${base}__pt ${s.colorClass}`} />
                            {v > 0 && (
                              <text
                                x={x}
                                y={y - 10}
                                textAnchor="middle"
                                className={`${base}__valText`}
                              >
                                {v.toLocaleString("en-IN")}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  ))}

                  {/* x labels */}
                  {months.map((m, i) => {
                    const x = padL + i * xStep;
                    return (
                      <text key={m} x={x} y={H - 22} textAnchor="middle" className={`${base}__xText`}>
                        {m}
                      </text>
                    );
                  })}
                </svg>
              </div>

              {/* legend */}
              <div className={`${base}__legend`}>
                {series.map((s) => (
                  <div className={`${base}__legItem`} key={s.name}>
                    <span className={`${base}__legDot ${s.colorClass}`} />
                    <span className={`${base}__legText`}>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT (SMALL CARDS) ================= */}
        <div className={`${base}__side`}>
          <div className={`${base}__miniCard`}>
            <div className={`${base}__avatar`}>
              <svg viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="28" r="16" fill="#ffd6c9" />
                <path
                  d="M24 30c2-16 30-20 36-2-4-2-10-2-18 2-8-4-14-4-18 2z"
                  fill="#2c3e50"
                />
                <rect x="20" y="48" width="40" height="26" rx="13" fill="#dbeafe" />
                <path d="M40 48l10 10-10 8-10-8z" fill="#f59e0b" />
              </svg>
            </div>
            <div className={`${base}__pill`}>Total Male</div>
            <div className={`${base}__bigNum`}>0</div>
          </div>

          <div className={`${base}__miniCard`}>
            <div className={`${base}__avatar`}>
              <svg viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="30" r="16" fill="#ffd6c9" />
                <path
                  d="M22 34c1-18 14-26 18-26s17 8 18 26c-6-5-12-7-18-7s-12 2-18 7z"
                  fill="#2c3e50"
                />
                <rect x="20" y="50" width="40" height="24" rx="12" fill="#dbeafe" />
                <path d="M40 50l10 10-10 8-10-8z" fill="#f59e0b" />
              </svg>
            </div>
            <div className={`${base}__pill`}>Total Female</div>
            <div className={`${base}__bigNum`}>26</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffPayRoll;