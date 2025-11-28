import api from "../services/api";

// --- Brugere ---
export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

// --- Opret bruger ---
export async function createUser(user) {
  const res = await api.post("/users", user);
  return res.data;
}

// --- Journal entries ---
export async function createJournalEntry(journalId, entry) {
  const res = await api.post(`/journals/${journalId}/journal-entries`, entry);
  return res.data;
}

export async function createResident(resident) {
  const res = await api.post("/residents", resident);
  return res.data;
}

// --- Server status ---
export async function getServerStatus() {
  const res = await api.get("/");
  return res.data;
}