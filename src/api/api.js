const BASE_URL = "http://localhost:7070";


async function apiRequest(endpoint, options = {}) {
  const config = {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  const res = await fetch(BASE_URL + endpoint, config);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API fejl");
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

// --- Brugere ---
export function getUsers() {
  return apiRequest("/users", { method: "GET" });
}

// --- Opret bruger ---
export function createUser(user) {
  return apiRequest("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

// --- Journal entries ---
export function createJournalEntry(journalId, entry) {
  return apiRequest(`/journals/${journalId}/journal-entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
}

export function createResident(resident) {
  return apiRequest("/residents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resident),
  });
}

// --- Server status ---
export function getServerStatus() {
  return apiRequest("/", { method: "GET" });
}


