import { useState } from "react";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [internalEmail, setInternalEmail] = useState("");
  const [internalPhone, setInternalPhone] = useState("");
  const [role, setRole] = useState("CAREWORKER"); // default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("token"); // hent token fra localStorage
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      // Match backend DTO: name, email, password, display/internal fields, role
      const body = {
        name: displayName || username,          // displayName eller fallback til username
        email: displayEmail || internalEmail || username,
        password,
        displayName: displayName || username,
        displayEmail: displayEmail || internalEmail || username,
        displayPhone: displayPhone || "",
        internalEmail: internalEmail || "",
        internalPhone: internalPhone || "",
        role: role
      };


      console.log("JWT token:", token);

      const res = await fetch("http://localhost:7070/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // Tjek for valideringsfejl eller duplicates
        setError(data.msg || "Failed to create user");
        return;
      }

      setSuccess(true);

      // Reset form
      setUsername("");
      setPassword("");
      setDisplayName("");
      setDisplayEmail("");
      setDisplayPhone("");
      setInternalEmail("");
      setInternalPhone("");
      setRole("CAREWORKER");

    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };


  return (
    <Container className="mt-4">
      <Card className="mx-auto" style={{ maxWidth: "600px" }}>
        <Card.Body>
          <h3 className="text-center mb-4">Opret Bruger</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Brugeren er blevet oprettet</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>brugernavn</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adgangskode</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fuldenavn</Form.Label>
              <Form.Control
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={displayEmail}
                onChange={(e) => setDisplayEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefonnummer</Form.Label>
              <Form.Control
                type="text"
                value={displayPhone}
                onChange={(e) => setDisplayPhone(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Intern Email</Form.Label>
              <Form.Control
                type="email"
                value={internalEmail}
                onChange={(e) => setInternalEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Intern Telefon</Form.Label>
              <Form.Control
                type="text"
                value={internalPhone}
                onChange={(e) => setInternalPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rolle</Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ADMIN">Admin</option>
                <option value="CAREWORKER">Care Worker</option>
                <option value="GUARDIAN">Guardian</option>
                <option value="RESIDENT">Resident</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Opret Bruger
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
