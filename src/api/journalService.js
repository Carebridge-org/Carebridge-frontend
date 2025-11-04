// --- Mock API: Henter beboere ---
export function getResidents() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, username: "hans", displayName: "Hans Hansen" },
        { id: 2, username: "anna", displayName: "Anna Andersen" },
        { id: 3, username: "peter", displayName: "Peter Petersen" },
      ]);
    }, 800);
  });
}

// --- Mock API: Opret journal entry ---
export function createJournalEntry(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Journal entry payload:", payload);

      // Simuler fejl 10% af tiden
      if (Math.random() < 0.1) {
        reject(new Error("Simuleret API-fejl"));
      } else {
        resolve({ success: true, id: Math.floor(Math.random() * 1000) });
      }
    }, 1000); // simulerer network delay
  });
}
