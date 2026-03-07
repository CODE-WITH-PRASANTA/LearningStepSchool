import React, { useRef, useState } from "react";
import "./StudentFeeChart.css";

const StudentFeeChart = () => {
  // ✅ component base class
  const base = "student-fee-chart";
  const plotRef = useRef(null);

  const data = [
    { label: "1st", val: "1424843", h: 32, c: "c1" },
    { label: "KSV 6th", val: "1177958", h: 26, c: "c2" },
    { label: "3rd", val: "814843", h: 20, c: "c3" },
    { label: "4th", val: "242848", h: 14, c: "c4" },
    { label: "5th", val: "0", h: 8, c: "c5" },
    { label: "6th", val: "0", h: 8, c: "c6" },
    { label: "7th", val: "0", h: 8, c: "c7" },
    { label: "8th", val: "242848", h: 14, c: "c8" },
    { label: "9th", val: "0", h: 8, c: "c9" },
    { label: "DCAP", val: "0", h: 8, c: "c10" },
    { label: "Ele-7", val: "2475206", h: 38, c: "c11" },
    { label: "All", val: "2481157", h: 39, c: "c12" },
    { label: "BCA 25-28", val: "52400", h: 10, c: "c13" },
    { label: "1st year", val: "0", h: 8, c: "c14" },
    { label: "KG 1st", val: "2481157", h: 39, c: "c15" },
    { label: "Chinese Class", val: "0", h: 8, c: "c16" },
    { label: "Keys", val: "157304", h: 12, c: "c17" },
    { label: "PYP1-A", val: "0", h: 8, c: "c18" },
    { label: "PreKG", val: "0", h: 8, c: "c19" },
    { label: "Primary", val: "4701408", h: 66, c: "c20" },
    { label: "pg", val: "0", h: 8, c: "c21" },
  ];

  const legend = [
    ["navy", "Total Fees Assigned"],
    ["green", "Total Collected Till Date"],
    ["red", "Total Fine Collected"],
    ["orange", "Total Discount"],
    ["sky", "Total Due"],
  ];

  // ✅ tooltip state (hover only)
  const [tip, setTip] = useState({
    show: false,
    x: 0,
    y: 0,
    label: "",
    val: "",
  });

  const showTip = (e, item) => {
    const plot = plotRef.current;
    if (!plot) return;

    const plotRect = plot.getBoundingClientRect();
    const colRect = e.currentTarget.getBoundingClientRect();

    // x center of bar column inside plot
    const x = colRect.left - plotRect.left + colRect.width / 2;

    // y fixed near top (like reference)
    const y = 12;

    setTip({
      show: true,
      x,
      y,
      label: item.label,
      val: item.val,
    });
  };

  const hideTip = () => setTip((p) => ({ ...p, show: false }));

  return (
    <div className={base}>
      <div className={`${base}__grid`}>
        {/* ================= LEFT CARD ================= */}
        <section className={`${base}__card`}>
          <div className={`${base}__top`} />

          <header className={`${base}__head`}>
            <h2 className={`${base}__title`}>Student Balance Fee Chart (2025–26)</h2>
          </header>

          <div className={`${base}__divider`} />

          <div className={`${base}__body`}>
            <div className={`${base}__meta`}>
              <div>
                <div className={`${base}__metaTitle`}>NLET – Institute Management Software</div>
                <div className={`${base}__metaSub`}>Click the columns to view Section Wise</div>
              </div>

              <button className={`${base}__menu`} type="button" aria-label="menu">
                <span />
                <span />
                <span />
              </button>
            </div>

            <div className={`${base}__chart`}>
              <div className={`${base}__y`}>
                <div>5M</div>
                <div>0</div>
              </div>

              <div className={`${base}__plot`} ref={plotRef}>
                {/* ✅ tooltip (hover only, moves near bar) */}
                {tip.show && (
                  <div
                    className={`${base}__tip`}
                    style={{ left: tip.x, top: tip.y }}
                  >
                    <div className={`${base}__tipTitle`}>Class</div>
                    <div className={`${base}__tipRow`}>
                      <span className={`${base}__tipLabel`}>{tip.label}:</span>
                      <span className={`${base}__tipVal`}>{tip.val}</span>
                    </div>
                  </div>
                )}

                <div className={`${base}__plotLine ${base}__plotLine--top`} />
                <div className={`${base}__plotLine ${base}__plotLine--mid`} />

                <div className={`${base}__bars`}>
                  {data.map((it, i) => (
                    <div
                      className={`${base}__col`}
                      key={i}
                      onMouseEnter={(e) => showTip(e, it)}
                      onMouseMove={(e) => showTip(e, it)}
                      onMouseLeave={hideTip}
                    >
                      <div className={`${base}__val`}>{it.val}</div>
                      <div className={`${base}__lane`}>
                        <div
                          className={`${base}__bar ${base}__${it.c}`}
                          style={{ height: `${it.h}%` }}
                        />
                      </div>
                      <div className={`${base}__lbl`}>{it.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${base}__legend`}>
              <span className={`${base}__dot`} />
              <span className={`${base}__legendText`}>Class</span>
            </div>
          </div>
        </section>

        {/* ================= RIGHT CARD ================= */}
        <section className={`${base}__card`}>
          <div className={`${base}__top`} />

          <header className={`${base}__head ${base}__head--right`}>
            <div>
              <h2 className={`${base}__title`}>Fee Collection Chart</h2>
              <div className={`${base}__sub`}>Academic Year : 2025–26</div>
            </div>

            <div className={`${base}__badge`}>Today's Collection : 0</div>
          </header>

          <div className={`${base}__divider`} />

          <div className={`${base}__body ${base}__body--right`}>
            <div className={`${base}__list`}>
              {legend.map(([k, t]) => (
                <div className={`${base}__item`} key={t}>
                  <span className={`${base}__sw ${base}__sw--${k}`} />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <div className={`${base}__donutWrap`}>
              <div className={`${base}__donut`} />
              <div className={`${base}__hole`} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentFeeChart;