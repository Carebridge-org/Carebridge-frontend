// src/services/events.js
const KEY = 'continuous-calendar-events';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function listEvents() {
  return read();
}

export function addEvent(evt) {
  const list = read();
  // upsert by id (avoid duplicates if same id is emitted twice)
  const i = list.findIndex(e => e.id === evt.id);
  if (i === -1) list.push(evt);
  else list[i] = { ...list[i], ...evt };
  write(list);
  return list;
}

export function clearEvents() {
  write([]);
}
