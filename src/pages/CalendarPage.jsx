// src/pages/CalendarPage.jsx
import { useEffect, useState, useCallback } from "react";
import { ContinuousCalendar } from "../components/ContinuousCalendar.jsx"; // <-- named import
import { listEvents, addEvent, deleteEvent /*, clearEvents*/ } from "../services/events.js";

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

  // ** NY FUNKTION: Håndterer sletning **
  const handleDelete = useCallback((id) => {
    if (!window.confirm("Er du sikker på, at du vil slette denne begivenhed?")) {
      return; // Afbryd, hvis brugeren annullerer
    }
    
    const updated = deleteEvent(id);  // persist to localStorage
    setEvents(updated);                // refresh UI immediately
  }, []);

  return (
  <div className="calendar-shell"> {/* 👈 add this wrapper */}
    <div className="container py-3">
      <h1 className="h4 mb-3">Continuous Calendar</h1>
    </div>

    <ContinuousCalendar
      events={events}
      onCreate={handleCreate}
      onEventClick={(e) => console.log('clicked event', e)}
      // onClick={(day, month, year) => console.log('clicked day', {day, month, year})}
      onDelete={handleDelete}  // <-- pass the delete handler as a prop
    />
  </div>
);

}
