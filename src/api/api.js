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

// --- Server status ---
export function getServerStatus() {
  return apiRequest("/", { method: "GET" });
}

export async function editJournalEntry(journalId, entryId, data) {
  const response = await fetch(BASE_URL + `/journals/${journalId}/journal-entries/${entryId}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}

export async function getJournalEntry(journalId, entryId) {
  const response = await fetch(
    `${BASE_URL}/journals/${journalId}/journal-entries/${entryId}`
  );

  if (!response.ok) {
    throw new Error("Kunne ikke hente journal entry");
  }

  const data = await response.json();

  return {
    id: data.id,
    journalId: journalId,
    title: data.title,
    entryType: data.entryType,
    riskAssessment: data.riskAssessment,
    authorUserId: data.authorUserId, // eller data.author
    content: data.content,
  };
}
