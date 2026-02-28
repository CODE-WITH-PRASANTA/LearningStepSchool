// Calender.jsx
import React, { useMemo, useState } from "react";
import "./Calender.css";

const Calender = () => {
  const base = "calender";

  const [view, setView] = useState("week"); // "month" | "week" | "day"
  const [refDate, setRefDate] = useState(new Date(2026, 1, 22)); // Feb 22, 2026

  const dowShort = useMemo(
    () => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    []
  );

  const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };

  const startOfWeekSun = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - x.getDay());
    return x;
  };

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const monthName = (d) => d.toLocaleString("en-US", { month: "long" });

  const times = useMemo(() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      const hr12 = h % 12 === 0 ? 12 : h % 12;
      const suffix = h < 12 ? "am" : "pm";
      arr.push(`${hr12}${suffix}`);
    }
    return arr;
  }, []);

  // Demo events
  const events = useMemo(
    () => [
      { id: 1, title: "Visit School", date: new Date(2026, 1, 9), color: "black" },
      { id: 2, title: "Dcwed", date: new Date(2026, 2, 9), color: "magenta" },

      { id: 3, title: "Visit School", date: new Date(2026, 1, 24), startH: 10, endH: 12, color: "black" },
      { id: 4, title: "Meeting", date: new Date(2026, 1, 26), startH: 14, endH: 15, color: "blue" },
    ],
    []
  );

  const headerTitle = useMemo(() => {
    if (view === "month") return `${monthName(refDate)} ${refDate.getFullYear()}`;

    if (view === "day")
      return `${monthName(refDate)} ${refDate.getDate()}, ${refDate.getFullYear()}`;

    const s = startOfWeekSun(refDate);
    const e = addDays(s, 6);
    return `${monthName(s)} ${s.getDate()} – ${e.getDate()} ${e.getFullYear()}`;
  }, [refDate, view]);

  const goToday = () => setRefDate(new Date());
  const goPrev = () => {
    if (view === "month")
      return setRefDate(new Date(refDate.getFullYear(), refDate.getMonth() - 1, 1));
    if (view === "day") return setRefDate(addDays(refDate, -1));
    return setRefDate(addDays(refDate, -7));
  };
  const goNext = () => {
    if (view === "month")
      return setRefDate(new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1));
    if (view === "day") return setRefDate(addDays(refDate, 1));
    return setRefDate(addDays(refDate, 7));
  };

  const monthGrid = useMemo(() => {
    const y = refDate.getFullYear();
    const m = refDate.getMonth();
    const first = new Date(y, m, 1);
    const start = addDays(first, -first.getDay());

    const cells = [];
    for (let i = 0; i < 42; i++) cells.push(addDays(start, i));
    return { m, cells };
  }, [refDate]);

  const weekDays = useMemo(() => {
    const s = startOfWeekSun(refDate);
    return Array.from({ length: 7 }, (_, i) => addDays(s, i));
  }, [refDate]);

  const dayCol = useMemo(() => [new Date(refDate)], [refDate]);

  const monthEventsForCell = (d) =>
    events.filter((e) => e.startH === undefined && sameDay(e.date, d));

  const blocksForDate = (d) =>
    events
      .filter((e) => e.startH !== undefined && sameDay(e.date, d))
      .map((e) => ({
        ...e,
        top: 40 + e.startH * 40,
        height: Math.max(30, (e.endH - e.startH) * 40 - 8),
      }));

  return (
    <section className={base}>
      <div className={`${base}__card`}>

        {/* ===== TOOLBAR ===== */}
        <div className={`${base}__toolbar`}>
          <div className={`${base}__nav`}>
            <button className={`${base}__btn ${base}__btn--split`} onClick={goPrev} type="button">
              ‹
            </button>
            <button className={`${base}__btn ${base}__btn--split`} onClick={goNext} type="button">
              ›
            </button>
            <button className={`${base}__btn ${base}__btn--today`} onClick={goToday} type="button">
              Today
            </button>
          </div>

          <div className={`${base}__title`}>{headerTitle}</div>

          <div className={`${base}__views`}>
            <button
              className={`${base}__tab ${view === "month" ? `${base}__tab--on` : ""}`}
              onClick={() => setView("month")}
              type="button"
            >
              Month
            </button>
            <button
              className={`${base}__tab ${view === "week" ? `${base}__tab--on` : ""}`}
              onClick={() => setView("week")}
              type="button"
            >
              Week
            </button>
            <button
              className={`${base}__tab ${view === "day" ? `${base}__tab--on` : ""}`}
              onClick={() => setView("day")}
              type="button"
            >
              Day
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className={`${base}__body`}>

          {/* MONTH VIEW */}
          {view === "month" && (
            <div className={`${base}__month`}>
              <div className={`${base}__monthHead`}>
                {dowShort.map((d) => (
                  <div key={d} className={`${base}__monthHCell`}>
                    {d}
                  </div>
                ))}
              </div>

              <div className={`${base}__monthGrid`}>
                {monthGrid.cells.map((d, idx) => {
                  const inMonth = d.getMonth() === monthGrid.m;
                  const isSat = d.getDay() === 6;
                  const ev = monthEventsForCell(d);

                  return (
                    <div
                      key={`${d.toDateString()}-${idx}`}
                      className={`${base}__mCell ${!inMonth ? `${base}__mCell--dim` : ""} ${
                        isSat ? `${base}__mCell--sat` : ""
                      }`}
                    >
                      <div className={`${base}__mDate`}>{d.getDate()}</div>

                      <div className={`${base}__mEvents`}>
                        {ev.map((e) => (
                          <div key={e.id} className={`${base}__mEvent ${base}__mEvent--${e.color}`}>
                            {e.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK / DAY VIEW */}
          {(view === "week" || view === "day") && (
            <div className={`${base}__weekWrapper`}>
              {/* Header Row */}
              <div className={`${base}__weekHeader`}>
                <div className={`${base}__timeColumnHeader`} />
                {(view === "week" ? weekDays : dayCol).map((d) => (
                  <div key={d.toDateString()} className={`${base}__weekDayHeader`}>
                    <div className={`${base}__dayName`}>{dowShort[d.getDay()]}</div>
                    <div className={`${base}__dayDate`}>
                      {d.getMonth() + 1}/{d.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className={`${base}__weekGrid`} style={{ gridTemplateColumns: `80px repeat(${view === "week" ? 7 : 1}, 1fr)` }}>
                {/* Times */}
                <div className={`${base}__timeColumn`}>
                  <div className={`${base}__allDayLabel`}>all-day</div>
                  {times.map((t) => (
                    <div key={t} className={`${base}__timeLabel`}>
                      {t}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {(view === "week" ? weekDays : dayCol).map((d) => {
                  const isSat = d.getDay() === 6;
                  const blocks = blocksForDate(d);

                  return (
                    <div
                      key={d.toDateString()}
                      className={`${base}__dayColumn ${isSat ? `${base}__dayColumn--sat` : ""}`}
                    >
                      <div className={`${base}__allDayRow`} />
                      {times.map((t) => (
                        <div key={t} className={`${base}__slot`} />
                      ))}

                      {blocks.map((b) => (
                        <div
                          key={b.id}
                          className={`${base}__block ${base}__block--${b.color}`}
                          style={{ top: b.top, height: b.height }}
                        >
                          {b.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Calender;