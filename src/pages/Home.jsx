"use client";

import { useEffect, useState, useMemo } from "react";
import {
  listEvents,
  markEventSeen,
  unmarkEventSeen,
} from "../services/events.js";
import { Link } from "react-router-dom";
import Seen from "../assets/seen.png";
import Unseen from "../assets/unseen.png";

const getTz = () => {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Copenhagen"
    );
  } catch {
    return "Europe/Copenhagen";
  }
};

const parseInstant = (v) => {
  if (v === null || v === undefined) return null;

  if (typeof v === "number") {
    return new Date(v < 1e12 ? v * 1000 : v);
  }

  if (typeof v === "string") {
    if (/^\d+$/.test(v)) {
      const num = Number(v);
      return new Date(num < 1e12 ? num * 1000 : num);
    }
    return new Date(v);
  }

  return null;
};

const isoDateInTz = (date, tz) =>
  date.toLocaleDateString("en-CA", { timeZone: tz });

const getEventDateStr = (e, tz) => {
  const d = parseInstant(e.startAt);
  if (d && !isNaN(d.getTime())) {
    return isoDateInTz(d, tz);
  }

  if (typeof e.eventDate === "string") return e.eventDate;

  if (e.eventDate && typeof e.eventDate === "object") {
    const { year, month, day } = e.eventDate;
    if (year && month && day) {
      const mm = String(month).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      return `${year}-${mm}-${dd}`;
    }
  }

  return null;
};

const getEventTimeStr = (e, tz) => {
  const d = parseInstant(e.startAt);
  if (d && !isNaN(d.getTime())) {
    return d.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: tz,
    });
  }
  if (typeof e.eventTime === "string") return e.eventTime;
  return "";
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [events, setEvents] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupEvents, setPopupEvents] = useState([]);

  const tz = useMemo(getTz, []);

  const todayStr = isoDateInTz(new Date(), tz);
  const tomorrowStr = isoDateInTz(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    tz
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await listEvents();

        const sorted = (data || []).slice().sort((a, b) => {
          const da = parseInstant(a.startAt);
          const db = parseInstant(b.startAt);
          return (da?.getTime() || 0) - (db?.getTime() || 0);
        });

        setEvents(sorted);

        const popup = sorted.filter((e) => {
          if (!e.showOnBoard || e.seenByCurrentUser) return false;
          const dStr = getEventDateStr(e, tz);
          if (!dStr) return false;
          return dStr === todayStr || dStr === tomorrowStr;
        });

        if (popup.length > 0) {
          setPopupEvents(popup);
          setShowPopup(true);
        }
      } catch (ex) {
        console.error("Failed to load events", ex);
        setErr("Kunne ikke hente begivenheder.");
      } finally {
        setLoading(false);
      }
    })();
  }, [tz, todayStr, tomorrowStr]);

  const todayEvents = useMemo(
    () => events.filter((e) => getEventDateStr(e, tz) === todayStr),
    [events, todayStr, tz]
  );

  const tomorrowEvents = useMemo(
    () => events.filter((e) => getEventDateStr(e, tz) === tomorrowStr),
    [events, tomorrowStr, tz]
  );

  const toggleSeen = async (eventObj) => {
    const currentlySeen = !!eventObj.seenByCurrentUser;

    try {
      if (!currentlySeen) {
        await markEventSeen(eventObj.id);
      } else {
        await unmarkEventSeen(eventObj.id);
      }
    } catch (ex) {
      console.error("Failed to toggle seen", ex);
      return;
    }

    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventObj.id ? { ...e, seenByCurrentUser: !currentlySeen } : e
      )
    );

    setPopupEvents((prev) =>
      prev
        .map((e) =>
          e.id === eventObj.id ? { ...e, seenByCurrentUser: !currentlySeen } : e
        )
        .filter((e) => !e.seenByCurrentUser)
    );
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupEvents([]);
  };

  const renderSeenToggle = (e) => {
    const handleClick = () => {
      toggleSeen(e);
    };

    return (
      <button
        type="button"
        className="btn p-0 border-0 bg-transparent"
        onClick={handleClick}
        title={e.seenByCurrentUser ? "Markér som ikke set" : "Markér som set"}
      >
        <img
          src={e.seenByCurrentUser ? Seen : Unseen}
          alt={e.seenByCurrentUser ? "Seen" : "Unseen"}
          style={{ width: 20, height: 20 }}
        />
      </button>
    );
  };

  const renderEventRow = (e) => {
    const dateLabel = getEventDateStr(e, tz) || "";
    const timeLabel = getEventTimeStr(e, tz);

    return (
      <li
        key={e.id}
        className="py-2 d-flex align-items-start justify-content-between gap-2 border-bottom"
      >
        <div>
          <div className="fw-semibold">
            {dateLabel && `${dateLabel} `}
            {timeLabel && `kl. ${timeLabel} — `}
            {e.title}
          </div>
          {e.description && (
            <div className="small text-muted">{e.description}</div>
          )}
        </div>
        <div className="mt-1">{renderSeenToggle(e)}</div>
      </li>
    );
  };

  const renderEventList = (list) =>
    list.length ? (
      <ul className="list-unstyled mb-0">{list.map(renderEventRow)}</ul>
    ) : (
      <p className="text-muted mb-0">Ingen events.</p>
    );

  const allEventsList = (
    <ul className="list-unstyled mb-0">{events.map(renderEventRow)}</ul>
  );

  return (
    <>
      <h1 className="h4 mb-3">Forside</h1>

      {err && <p style={{ color: "red" }}>{err}</p>}
      {loading && <p>Indlæser begivenheder…</p>}

      {!loading && (
        <>
          {/* I dag */}
          <div className="mb-3 p-3 rounded-3 border bg-white shadow-sm">
            <h2 className="h6 mb-2">I dag</h2>
            {renderEventList(todayEvents)}
          </div>

          {/* I morgen */}
          <div className="mb-3 p-3 rounded-3 border bg-white shadow-sm">
            <h2 className="h6 mb-2">I morgen</h2>
            {renderEventList(tomorrowEvents)}
          </div>

          {/* Alle begivenheder */}
          <div className="mb-4 p-3 rounded-3 border bg-white shadow-sm">
            <h2 className="h6 mb-2">Alle begivenheder (kronologisk)</h2>
            {events.length ? (
              allEventsList
            ) : (
              <p className="text-muted mb-0">
                Ingen begivenheder oprettet endnu.
              </p>
            )}
          </div>

          {/* Link til kalender */}
          <div className="mb-2">
            <p className="text-muted mb-1">
              Se og administrér alle begivenheder i kalenderen.
            </p>
            <Link to="/calendar" className="btn btn-outline-primary btn-sm">
              Åbn kalender
            </Link>
          </div>
        </>
      )}

      {/* Popup for i dag/i morgen (kun usete + showOnBoard) */}
      {showPopup && popupEvents.length > 0 && (
        <div
          className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.35)", zIndex: 2000 }}
        >
          <div
            className="bg-white rounded-4 shadow p-3 p-sm-4"
            style={{ width: "min(520px, 92vw)" }}
          >
            <h2 className="h6 mb-2">Dagens & morgendagens begivenheder</h2>
            <p className="text-muted mb-3">
              Disse begivenheder bliver ved med at dukke op, indtil du markerer
              dem som set.
            </p>

            <ul className="list-unstyled mb-3">
              {popupEvents.map((e) => {
                const dateLabel = getEventDateStr(e, tz) || "";
                const timeLabel = getEventTimeStr(e, tz);
                return (
                  <li key={e.id} className="mb-2">
                    <div className="fw-semibold">
                      {dateLabel && `${dateLabel} `}
                      {timeLabel && `kl. ${timeLabel} — `}
                      {e.title}
                    </div>
                    {e.description && (
                      <div className="small text-muted">{e.description}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClosePopup}
              >
                Luk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
