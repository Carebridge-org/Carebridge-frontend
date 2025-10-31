// src/pages/CalendarPage.jsx
import { useEffect, useState, useCallback } from "react";
import { ContinuousCalendar } from "../components/ContinuousCalendar.jsx"; // <-- named import
import { listEvents, addEvent /*, clearEvents*/ } from "../services/events.js";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  // Load stored events on first render
  useEffect(() => {
    setEvents(listEvents());
  }, []);

  // When the calendar creates a new event
  const handleCreate = useCallback((payload) => {
    const updated = addEvent(payload);  // persist to localStorage
    setEvents(updated);                 // refresh UI immediately
  }, []);

  return (
  <div className="calendar-shell"> {/* 👈 add this wrapper */}
    <div className="container py-3">
      <h1 className="h4 mb-3">Continuous Calendar</h1>
    </div>

    <ContinuousCalendar
      events={events}
      onCreate={handleCreate}
      // onEventClick={(e) => console.log('clicked event', e)}
      // onClick={(day, month, year) => console.log('clicked day', {day, month, year})}
    />
  </div>
);

}
