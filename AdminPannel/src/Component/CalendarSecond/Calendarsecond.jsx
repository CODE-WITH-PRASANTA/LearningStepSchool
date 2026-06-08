import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import "./Core.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Core = () => {
  const calendarRef = useRef(null);

  const [selectedMonth, setSelectedMonth] =
    useState(new Date().getMonth());

  const [showModal, setShowModal] = useState(false);

  const [allDay, setAllDay] = useState(true);

  const [events, setEvents] = useState([]);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    startTime: "00:00",
    endTime: "00:00",
  });

  const changeMonth = (e) => {
    const monthIndex = Number(e.target.value);

    setSelectedMonth(monthIndex);

    const calendarApi =
      calendarRef.current.getApi();

    const currentDate = calendarApi.getDate();

    calendarApi.gotoDate(
      new Date(
        currentDate.getFullYear(),
        monthIndex,
        1
      )
    );
  };

  const handleDateClick = (info) => {
    setShowModal(true);

    setEventData({
      title: "",
      description: "",
      start: info.dateStr,
      end: info.dateStr,
      startTime: "00:00",
      endTime: "00:00",
    });

    setAllDay(true);
  };

  const saveEvent = () => {
    if (!eventData.title.trim()) return;

    let startDate = eventData.start;
    let endDate = eventData.end;

    if (!allDay) {
      startDate =
        eventData.start +
        "T" +
        eventData.startTime;

      endDate =
        eventData.end +
        "T" +
        eventData.endTime;
    }

    const newEvent = {
      id: Date.now(),
      title: eventData.title,
      start: startDate,
      end: endDate,
      allDay,
    };

    setEvents([...events, newEvent]);

    setShowModal(false);
  };

  return (
    <div className="coreCalendar">

      <div className="coreHeader">

        <select
          value={selectedMonth}
          onChange={changeMonth}
          className="coreMonthSelect"
        >
          {months.map((month, index) => (
            <option
              key={index}
              value={index}
            >
              {month}
            </option>
          ))}
        </select>

      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        editable
        selectable
        dateClick={handleDateClick}
        events={events}
        headerToolbar={{
          left: "title",
          center: "",
          right: "today prev,next",
        }}
      />

      {showModal && (
        <div className="coreModalOverlay">

          <div className="coreModal">

            <h2>Event</h2>

            <input
              type="text"
              placeholder="Title"
              value={eventData.title}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  title: e.target.value,
                })
              }
            />

            <div className="coreToggleRow">

              <label className="coreSwitch">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={() =>
                    setAllDay(!allDay)
                  }
                />
                <span className="coreSlider"></span>
              </label>

              <span>All day</span>

            </div>

            <input
              type="date"
              value={eventData.start}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  start: e.target.value,
                })
              }
            />

            {!allDay && (
              <input
                type="time"
                value={eventData.startTime}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    startTime: e.target.value,
                  })
                }
              />
            )}

            <input
              type="date"
              value={eventData.end}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  end: e.target.value,
                })
              }
            />

            {!allDay && (
              <input
                type="time"
                value={eventData.endTime}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    endTime: e.target.value,
                  })
                }
              />
            )}

            <textarea
              rows="5"
              placeholder="Description"
              value={eventData.description}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  description:
                    e.target.value,
                })
              }
            />

            <div className="coreBtnRow">

              <button
                className="coreCancelBtn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="coreSaveBtn"
                onClick={saveEvent}
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Core;