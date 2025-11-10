// src/services/auth.js
import api from "./api";

// --- Auth event system ---
const AUTH_CHANGED_EVENT = "auth-changed";
export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}
export function onAuthChanged(callback) {
  window.addEventListener(AUTH_CHANGED_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGED_EVENT, callback);
}

// --- Helpers ---
export function getToken() {
  return localStorage.getItem("token");
}
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

// --- Auth actions ---
export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  // Expect backend to return { token, email, role, name }
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: data.email,
      role: data.role,
      name: data.name || email.split("@")[0], // fallback if name missing
    })
  );
  notifyAuthChanged();
  return data;
}

export async function register({ name, email, password }) {
  const { data } = await api.post("/auth/register", { name, email, password });
  // Expect backend to return { token, email, role, name }
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: data.email,
      role: data.role,
      name: data.name || email.split("@")[0],
    })
  );
  notifyAuthChanged();
  return data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  notifyAuthChanged();
}
