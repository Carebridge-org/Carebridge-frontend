import { useState } from "react";
import { Form, Button, Row, Col, Alert, Card, ListGroup } from "react-bootstrap";
//import { createJournalEntry } from "../../api/journalService";
import { validateJournal } from "../../utils/validation";
import { useNavigate } from "react-router-dom";


export default function JournalForm({ residents, currentUser, initialData, addJournal }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    initialData || {
      resident: "",
      title: "",
      type: "",
      content: "",
      riskAssessment: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFiles(files) {
    setFormData((prev) => ({ ...prev, attachments: files }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    const validationErrors = validateJournal(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("error");
      return;
    }

    const newJournal = {
      id: Date.now(),
      resident: formData.resident,
      title: formData.title,
      type: formData.type,
      content: formData.content,
      riskAssessment: formData.riskAssessment,
      createdAt: new Date().toISOString,
      author: currentUser.displayName,
    };

    addJournal(prev => [...prev, newJournal]);
    setStatus("success");

    navigate("/journal-overview");

      if (!initialData) {
        setFormData({
          resident: "",
          title: "",
          type: "",
          content: "",
          riskAssessment: "",
          tags: "",
          checklistData: [
            { label: "Medicin", value: "" },
            { label: "Humør", value: "" },
            { label: "Smerte", value: "" },
          ],
          attachments: [],
        });
        setErrors({});
      }
    }  

  return (
    <Card className="p-4 shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <Card.Body>
        <Card.Title>{initialData ? "Rediger journalindgang" : "Opret journalindgang"}</Card.Title>

        {status === "success" && <Alert variant="success">Journal gemt!</Alert>}
        {status === "error" && <Alert variant="danger">Der opstod en fejl.</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Beboer */}
          <Form.Group className="mb-3">
            <Form.Label>Beboer</Form.Label>
            <Form.Select name="resident" value={formData.resident} onChange={handleChange}>
              <option value="">Vælg beboer</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.displayName || r.username}
                </option>
              ))}
            </Form.Select>
            {errors.resident && <Form.Text className="text-danger">{errors.resident}</Form.Text>}
          </Form.Group>

          {/* Titel + Type */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Titel</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titel på journal indgang"
                />
                {errors.title && <Form.Text className="text-danger">{errors.title}</Form.Text>}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Fx Observation, Notat..."
                />
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
              placeholder="Skriv journalindhold her..."
            />
            {errors.content && <Form.Text className="text-danger">{errors.content}</Form.Text>}
          </Form.Group>

          {/* Risikoniveau + Tags */}
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Risikoniveau</Form.Label>
                <Form.Select
                  name="riskAssessment"
                  value={formData.riskAssessment}
                  onChange={handleChange}
                >
                  <option value="">Vælg niveau</option>
                  <option value="LAV">Lav</option>
                  <option value="MIDDEL">Middel</option>
                  <option value="HØJ">Høj</option>
                </Form.Select>
                {errors.riskAssessment && (
                  <Form.Text className="text-danger">{errors.riskAssessment}</Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Submit */}
          <Button variant="primary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Gemmer..." : "Gem"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
