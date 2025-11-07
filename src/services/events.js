// src/services/events.js
import api from './api.js';

// ---- Backend API version ----
export async function listEvents() {
  const { data } = await api.get('/events/');
  return data; // array of EventDTO
}

export async function getEvent(id) {
  const { data } = await api.get(`/events/${id}`);
  return data;
}

export async function createEvent(eventPayload) {
  const { data } = await api.post('/events/', eventPayload);
  return data;
}

export async function updateEvent(id, eventPayload) {
  const { data } = await api.put(`/events/${id}`, eventPayload);
  return data;
}

export async function deleteEvent(id) {
  await api.delete(`/events/${id}`);
}
