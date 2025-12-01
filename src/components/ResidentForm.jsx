import { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { createResident, getUsers } from "../api/api.js";

export default function ResidentForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cprNr: "",
    userId: "",
  });
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  // Hent users til dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Kunne ikke hente users:", err);
      }
    }
    fetchUsers();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function validate(data) {
    const errors = {};
    if (!data.firstName.trim()) errors.firstName = "Fornavn er påkrævet.";
    if (!data.lastName.trim()) errors.lastName = "Efternavn er påkrævet.";

    if (!data.cprNr.trim()) {
    errors.cprNr = "CPR-nummer er påkrævet.";
  } else if (!/^\d{6}-\d{4}$/.test(data.cprNr)) {
    errors.cprNr = "CPR skal være i formatet 123456-1234.";
  }
        
    if (!data.userId) errors.userId = "Du skal vælge en bruger.";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");
    try {
      const payload = { ...formData, userId: Number(formData.userId) };
      await createResident(payload);
      setStatus("success");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Oprettelse af resident fejlede:", err);
      setStatus("error");
    }
  }

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
      <Card.Body>
        <Card.Title>Opret Resident</Card.Title>

        {status === "success" && <Alert variant="success">Resident oprettet!</Alert>}
        {status === "error" && <Alert variant="danger">Der opstod en fejl.</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fornavn</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <Form.Text className="text-danger">{errors.firstName}</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Efternavn</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <Form.Text className="text-danger">{errors.lastName}</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CPR-nummer</Form.Label>
            <Form.Control
              type="text"
              name="cprNr"
              value={formData.cprNr}
              onChange={handleChange}
            />
            {errors.cprNr && <Form.Text className="text-danger">{errors.cprNr}</Form.Text>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Guardian</Form.Label>
            <Form.Select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
            >
              <option value="">Vælg bruger</option>
              {users
                .filter((u) => u.role === "CAREWORKER" || u.role === "GUARDIAN")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
              ))}
            </Form.Select>
            {errors.userId && <Form.Text className="text-danger">{errors.userId}</Form.Text>}
          </Form.Group>

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Opretter..." : "Opret Resident"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
