import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EarningMode.css";

const EarningMode = () => {
  const base = "earning-mode";

  const earningData = useMemo(
    () => [
      { label: "Cash", value: 78, amount: 25028300, color: "#0B4A78" },
      { label: "Online", value: 4, amount: 125000, color: "#2FE046" },
      { label: "Cheque", value: 18, amount: 6400000, color: "#FF5A52" },
    ],
    []
  );

  const classData = useMemo(
    () => [
      { label: "1st", value: 20, color: "#86B8FF" },
      { label: "KSV 6th", value: 8, color: "#3B3B3B" },
      { label: "3rd", value: 26, color: "#78FF87" },
      { label: "4th", value: 25, color: "#FFB07D" },
      { label: "5th", value: 6, color: "#7B6CFF" },
      { label: "6th", value: 16, color: "#FF6B8A" },
      { label: "7th", value: 9, color: "#FFD66B" },
      { label: "8th", value: 4, color: "#49D6C2" },
      { label: "9th", value: 1, color: "#9AA4B2" },
      { label: "DCAP", value: 1, color: "#9AA4B2" },
      { label: "Ele.-7", value: 1, color: "#9AA4B2" },
      { label: "All", value: 1, color: "#9AA4B2" },
      { label: "BCA 25-28", value: 1, color: "#9AA4B2" },
      { label: "1st Year", value: 1, color: "#9AA4B2" },
      { label: "KG 1st", value: 1, color: "#9AA4B2" },
      { label: "Chinese Class", value: 1, color: "#9AA4B2" },
      { label: "keys", value: 1, color: "#9AA4B2" },
      { label: "PYP1-A", value: 1, color: "#9AA4B2" },
      { label: "PreKG", value: 1, color: "#9AA4B2" },
      { label: "Primary", value: 2, color: "#86B8FF" },
      { label: "pg", value: 1, color: "#9AA4B2" },
    ],
    []
  );

  // ✅ Donut math (kept correct)
  const total = earningData.reduce((s, i) => s + i.value, 0);
  const donut = useMemo(() => {
    const r = 82; // ✅ match reference donut ring size
    const c = 2 * Math.PI * r;
    let acc = 0;

    return earningData.map((seg) => {
      const pct = seg.value / total;
      const len = pct * c;
      const dasharray = `${len} ${c - len}`;
      const dashoffset = -acc;
      acc += len;
      return { ...seg, r, dasharray, dashoffset };
    });
  }, [earningData, total]);

  const [tip, setTip] = useState(null);

  // dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const onDownload = (type) => {
    setMenuOpen(false);
    console.log("Download:", type);
  };

  const yMax = 32;

  return (
    <div className={base}>
      <div className={`${base}__grid`}>
        {/* LEFT CARD */}
        <section className={`${base}__card ${base}__card--left`}>
          <div className={`${base}__cardHead`}>
            <div>
              <h3 className={`${base}__title`}>Earning Mode</h3>
              <p className={`${base}__subTitle`}>Financial Year : 2025-26</p>
            </div>
          </div>

          <div className={`${base}__body`}>
            <div className={`${base}__legend`}>
              <div className={`${base}__legendRow`}>
                <LegendItem base={base} color="#0B4A78" text="Cash" />
                <LegendItem base={base} color="#2FE046" text="Online" />
              </div>
              <div className={`${base}__legendRow ${base}__legendRow--center`}>
                <LegendItem base={base} color="#FF5A52" text="Cheque" />
              </div>
            </div>

            <div className={`${base}__donutWrap`}>
              <div className={`${base}__donutBox`}>
                <svg className={`${base}__donut`} width="260" height="260" viewBox="0 0 260 260">
                  <circle cx="130" cy="130" r="82" fill="none" stroke="rgba(12, 40, 66, .08)" strokeWidth="30" />

                  <g className={`${base}__donutAnim`}>
                    {donut.map((seg) => (
                      <circle
                        key={seg.label}
                        cx="130"
                        cy="130"
                        r={seg.r}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="30"
                        strokeDasharray={seg.dasharray}
                        strokeDashoffset={seg.dashoffset}
                        transform="rotate(-90 130 130)"
                        className={`${base}__donutSeg`}
                        onMouseEnter={() => setTip(seg)}
                        onMouseLeave={() => setTip(null)}
                      />
                    ))}
                  </g>

                  <circle cx="130" cy="130" r="56" fill="#fff" />
                </svg>

                {tip && (
                  <div className={`${base}__tip`}>
                    <span className={`${base}__tipSwatch`} style={{ background: tip.color }} />
                    <span className={`${base}__tipText`}>
                      {tip.label}: {tip.amount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT CARD */}
        <section className={`${base}__card ${base}__card--right`}>
          <div className={`${base}__cardHead`}>
            <div>
              <h3 className={`${base}__title`}>Class Chart (2025-26)</h3>
            </div>
          </div>

          <div className={`${base}__body ${base}__body--chart`}>
            <div className={`${base}__chartTop`}>
              <div className={`${base}__chartSubTitle`}>
                <div className={`${base}__chartLine1`}>NLET - Institute Management Software</div>
                <div className={`${base}__chartLine2`}>Click the columns to view Section Wise</div>
              </div>

              <div className={`${base}__menu`} ref={menuRef}>
                <button type="button" className={`${base}__menuBtn`} onClick={() => setMenuOpen((p) => !p)}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7H20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M4 12H20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M4 17H20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className={`${base}__dropdown`}>
                    <button className={`${base}__dropItem`} onClick={() => onDownload("png")} type="button">
                      <span className={`${base}__dropIcon`}>{iconImage()}</span>
                      Download PNG image
                    </button>
                    <button className={`${base}__dropItem`} onClick={() => onDownload("jpeg")} type="button">
                      <span className={`${base}__dropIcon`}>{iconImage()}</span>
                      Download JPEG image
                    </button>
                    <button className={`${base}__dropItem`} onClick={() => onDownload("pdf")} type="button">
                      <span className={`${base}__dropIcon`}>{iconPdf()}</span>
                      Download PDF document
                    </button>
                    <button className={`${base}__dropItem`} onClick={() => onDownload("svg")} type="button">
                      <span className={`${base}__dropIcon`}>{iconSvg()}</span>
                      Download SVG vector image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`${base}__chart`}>
              <div className={`${base}__yLabel`}>
                Total<br />Number of<br />Students
              </div>

              <div className={`${base}__plotWrap`}>
                <div className={`${base}__plot`}>
                  <div className={`${base}__yTicks`}>
                    <div className={`${base}__yTickTop`}>{yMax}</div>
                    <div className={`${base}__yTickBottom`}>0</div>
                  </div>

                  <div className={`${base}__hLine`} />

                  <div className={`${base}__bars`}>
                    {classData.map((it, idx) => {
                      const h = Math.max(6, (it.value / yMax) * 95); // ✅ reference-like bar height
                      return (
                        <button
                          key={`${it.label}-${idx}`}
                          type="button"
                          className={`${base}__barBtn`}
                          title={`${it.label}: ${it.value}`}
                          style={{ ["--d"]: `${idx * 40}ms` }}
                        >
                          <div className={`${base}__barVal`}>{it.value}</div>
                          <div className={`${base}__bar`} style={{ height: `${h}px`, background: it.color }} />
                          <div className={`${base}__barLbl`}>{it.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className={`${base}__legendBottom`}>
                    <span className={`${base}__legendDot`} />
                    <span>Class</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default EarningMode;

function LegendItem({ base, color, text }) {
  return (
    <div className={`${base}__legendItem`}>
      <span className={`${base}__swatch`} style={{ background: color }} />
      <span className={`${base}__legendText`}>{text}</span>
    </div>
  );
}

function iconImage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 7.5C4 6.119 5.119 5 6.5 5h11C18.881 5 20 6.119 20 7.5v9C20 17.881 18.881 19 17.5 19h-11C5.119 19 4 17.881 4 16.5v-9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11.2 10.2 13.4 13.2 10.4 18 15.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9.2h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function iconPdf() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7.6 16.6h8.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function iconSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 16c.6 0 1-.4 1-1s-.4-1-1-1-1-.4-1-1 .4-1 1-1h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 14h-2c-.6 0-1 .4-1 1s.4 1 1 1 1 .4 1 1-.4 1-1 1h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}