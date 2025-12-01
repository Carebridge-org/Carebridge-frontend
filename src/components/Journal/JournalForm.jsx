import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createJournalEntry, getUsers } from "../../api/api";
import { validateJournal } from "../../utils/validation";

export default function JournalForm({ initialData, addJournal }) {
  const navigate = useNavigate();

  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState(
    initialData || {
      author: "",
      title: "",
      type: "",
      content: "",
      riskAssessment: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  // Hent authors fra backend
  useEffect(() => {
    async function fetchAuthors() {
      try {
        const data = await getUsers();
        setAuthors(data);
      } catch (err) {
        console.error("Fejl ved hentning af authors:", err);
      }
    }
    fetchAuthors();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

    async function handleSubmit(e) {
    e.preventDefault();
    console.log("▶ handleSubmit called with", formData);
    setStatus("loading");

    const validationErrors = validateJournal(formData);
    console.log("▶ validationErrors", validationErrors);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.log("▶ validation failed, aborting submit");
      setStatus("error");
      return;
    }

    try {
      const payload = {
        journalId: formData.journalId || 2,
        title: formData.title,
        content: formData.content,
        entryType: formData.type,
        riskAssessment: formData.riskAssessment,
        authorUserId: Number(formData.author),
      };

      console.log("▶ Sending payload to createJournalEntry", payload);

      const newEntry = await createJournalEntry(formData.journalId || 2, payload);
      console.log("▶ createJournalEntry response", newEntry);

      if (addJournal) {
        addJournal((prev) => [...prev, newEntry]);
      }

      setStatus("success");
      navigate("/journal-overview");
    } catch (err) {
      console.error("Journal oprettelse fejlede:", err.response?.data || err);
      setStatus("error");
    }
  }

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <Card.Title>{initialData ? "Rediger journalindgang" : "Opret journalindgang"}</Card.Title>

        {status === "success" && <Alert variant="success">Journal gemt!</Alert>}
        {status === "error" && <Alert variant="danger">Der opstod en fejl.</Alert>}

        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
  <Form.Label>Titel</Form.Label>
  <Form.Control
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
  />
  {errors.title && <Form.Text className="text-danger">{errors.title}</Form.Text>}
</Form.Group>

          {/* Authors */}
          <Form.Group className="mb-3">
            <Form.Label>Forfatter</Form.Label>
            <Form.Select name="author" value={formData.author} onChange={handleChange}>
              <option value="">Vælg author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Form.Select>
            {errors.author && <Form.Text className="text-danger">{errors.author}</Form.Text>}
          </Form.Group>

          {/* Type */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="">Vælg type</option>
                  <option value="DAILY">Daily</option>
                  <option value="NOTE">Note</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="INCIDENT">Incident</option>
                </Form.Select>
                {errors.type && <Form.Text className="text-danger">{errors.type}</Form.Text>}
              </Form.Group>
            </Col>
          </Row>

          {/* Indhold */}
          <Form.Group className="mb-3">
            <Form.Label>Indhold</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
            {errors.content && <Form.Text className="text-danger">{errors.content}</Form.Text>}
          </Form.Group>

          {/* Risikoniveau */}
          <Form.Group className="mb-3">
            <Form.Label>Risikoniveau</Form.Label>
            <Form.Select
              name="riskAssessment"
              value={formData.riskAssessment}
              onChange={handleChange}
            >
              <option value="">Vælg niveau</option>
              <option value="LOW">Lav</option>
              <option value="MEDIUM">Middel</option>
              <option value="HIGH">Høj</option>
            </Form.Select>
            {errors.riskAssessment && <Form.Text className="text-danger">{errors.riskAssessment}</Form.Text>}
          </Form.Group>

          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Gemmer..." : "Gem"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
