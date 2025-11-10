import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const { token, user } = await login(form);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("storage"));

      navigate("/", { replace: true });
    } catch (ex) {
      const msg =
        ex?.response?.data?.msg 
        ex?.response?.data?.message 
        ex?.message ||
        "Login failed";
      setErr(msg);
      console.error(ex);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360 }}>
      <h2>Login</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit" disabled={busy}>
        {busy ? "Logging in…" : "Log ind"}
      </button>
    </form>
  );
}