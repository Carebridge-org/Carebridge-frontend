// src/pages/CalendarPage.jsx
import { useEffect, useState, useCallback } from "react";
import { ContinuousCalendar } from "../components/ContinuousCalendar.jsx";
import { listEvents, createEvent, deleteEvent as deleteEventApi } from "../services/events.js";
import api from "../services/api"; // axios instance for /event-types

// Helpers
const toYMD = (d) => d.toISOString().slice(0, 10);
const toHM  = (d) => d.toISOString().slice(11, 16);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typesReady, setTypesReady] = useState(false);
  const [err, setErr] = useState("");

  // ---- Load event types (needed to map UI type -> backend id) ----
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/event-types/"); // ANYONE per routes
        setEventTypes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load event types", e);
        setErr("Kunne ikke hente event-typer. Kør /api/populate eller opret typer som ADMIN.");
      } finally {
        setTypesReady(true);
      }
    })();
  }, []);

  // ---- Load events ----
  useEffect(() => {
    (async () => {
      try {
        const data = await listEvents();       // GET /events/
        setEvents((data || []).map(toUi));
      } catch (ex) {
        console.error(ex);
        setErr((prev) => prev || "Kunne ikke hente events fra serveren.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Backend -> UI (ContinuousCalendar expects date/time/type/showOnBoard)
  const toUi = (e) => {
    const dt = new Date(e.startAt);
    // try to resolve type name from eventTypeId if provided
    const name = eventTypes.find((t) => t.id === e.eventTypeId)?.name;
    return {
      id: e.id,
      title: e.title,
      description: e.description || "",
      date: toYMD(dt),
      time: toHM(dt),
      type: name || "Meeting",           // fallback label; UI still works
      showOnBoard: e.showOnBoard ?? true,
      // keep originals if needed
      startAt: e.startAt,
      eventTypeId: e.eventTypeId,
      createdById: e.createdById,
    };
  };

  // Find a backend type id from a UI-provided type name
  const getTypeIdByName = (name) => {
    if (!name) return undefined;
    const hit = eventTypes.find(
      (t) => (t.name || "").toLowerCase() === String(name).toLowerCase()
    );
    return hit?.id;
  };

  // UI -> Backend (payload for create)
  const toApi = (ui) => {
    const now = new Date();
    // Build a future-safe ISO start time
    let dt;
    if (ui.datetime) {
      dt = new Date(ui.datetime);
    } else {
      const [y, m, d] = (ui.date || toYMD(now)).split("-").map(Number);
      let hh = 0,
        mi = 0;
      if (ui.time) [hh, mi] = ui.time.split(":").map(Number);
      dt = new Date(y || now.getFullYear(), (m || 1) - 1, d || now.getDate(), hh || 0, mi || 0, 0);
      // If user picked an earlier time today, bump to now + 5 min to satisfy @FutureOrPresent
      if (
        dt < now &&
        y === now.getFullYear() &&
        (m - 1) === now.getMonth() &&
        d === now.getDate()
      ) {
        dt = new Date(now.getTime() + 5 * 60 * 1000);
      }
    }

    // Resolve a real eventType id
    const resolvedId = ui.eventTypeId ?? getTypeIdByName(ui.type);
    if (!resolvedId) {
      throw new Error("No matching EventType in database. Kør /api/populate eller opret en event type.");
    }

    // Most robust for ctx.bodyAsClass(Event.class): nested eventType { id }
    return {
      title: ui.title,
      description: ui.description || "",
      startAt: dt.toISOString(),
      showOnBoard: !!ui.showOnBoard,
      eventType: { id: resolvedId },
    };
  };

  // Create from calendar callback
  const handleCreate = useCallback(
    async (payloadFromCalendar) => {
      try {
        if (!typesReady || eventTypes.length === 0) {
          alert("Ingen Event Types i databasen. Kør /api/populate eller opret event types som ADMIN.");
          return;
        }
        const created = await createEvent(toApi(payloadFromCalendar)); // POST /events/
        // We may not know the type name yet on the returned DTO; re-map once with current types
        setEvents((prev) => [...prev, toUi(created)]);
      } catch (ex) {
        console.error("Create error:", ex?.response || ex);
        const msg =
          ex?.response?.data?.msg ||
          ex?.response?.data?.message ||
          ex?.message ||
          "Kunne ikke oprette begivenheden.";
        alert(msg);
      }
    },
    [typesReady, eventTypes]
  );

  // Delete from calendar callback
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Er du sikker på, at du vil slette denne begivenhed?")) return;
    try {
      await deleteEventApi(id); // DELETE /events/{id}
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (ex) {
      console.error(ex);
      const msg =
        ex?.response?.data?.msg ||
        ex?.response?.data?.message ||
        ex?.message ||
        "Kunne ikke slette begivenheden.";
      alert(msg);
    }
  }, []);

  return (
    <div className="calendar-shell">
      <div className="container py-3">
        <h1 className="h4 mb-3">Continuous Calendar</h1>
        {err && <p style={{ color: "red" }}>{err}</p>}
        {loading && <p>Indlæser kalender…</p>}
        {typesReady && eventTypes.length === 0 && (
          <p style={{ color: "orange" }}>
            Ingen event-typer fundet. Kør <code>/api/populate</code> eller opret event-typer som ADMIN.
          </p>
        )}
      </div>

      {!loading && (
        <ContinuousCalendar
          events={events}
          onCreate={handleCreate}
          onEventClick={(e) => console.log("clicked event", e)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
