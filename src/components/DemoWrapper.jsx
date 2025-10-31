'use client';
import React, { useState } from 'react';
import { useSnack } from '@/app/SnackProvider';
import { ContinuousCalendar } from '@/components/ContinuousCalendar';

const monthNames2 = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DemoWrapper() {
  const { createSnack } = useSnack();
  const [events, setEvents] = useState([]);

  const onClickHandler = (day, month, year) =>
    createSnack(`Clicked on ${monthNames2[month]} ${day}, ${year}`, 'success');

  const handleCreate = (evt) => {
    setEvents((prev) => [evt, ...prev]);

    const d = new Date(evt.datetime);
    const when = isNaN(d.getTime())
      ? `${evt.date}${evt.time ? ` ${evt.time}` : ''}`
      : d.toLocaleString();

    createSnack(`Event created: “${evt.title}” (${when})`, 'success');

    // TODO: Optional — make API POST call here
  };

  return (
    <div className="position-relative d-flex fullscreen w-100 flex-column gap-3 px-3 pt-3 align-items-center justify-content-center">
      <div className="position-relative h-100 overflow-auto mt-5 w-100" style={{ maxWidth: 1100 }}>
        {/* ✅ now passing events so they show on the calendar */}
        <ContinuousCalendar
          onClick={onClickHandler}
          onCreate={handleCreate}
          events={events}
        />
      </div>

      {/* Debug list (optional) */}
      {events.length > 0 && (
        <div className="bg-light border rounded-4 p-3 w-100" style={{ maxWidth: 1100 }}>
          <h3 className="h6">Recently Created</h3>
          <ul className="mb-0 small">
            {events.map((e) => (
              <li key={e.id}>
                <strong>{e.title}</strong> — {e.type} — {e.date}
                {e.time ? ` ${e.time}` : ''} {e.showOnBoard ? '• on board' : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
