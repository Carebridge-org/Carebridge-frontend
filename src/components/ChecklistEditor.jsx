import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function ChecklistEditor({ checklistData, onChange }) {
  const [editing, setEditing] = useState(false);

  function handleLabelChange(index, newLabel) {
    const updated = [...checklistData];
    updated[index].label = newLabel;
    onChange(updated);
  }

  function handleValueChange(index, newValue) {
    const updated = [...checklistData];
    updated[index].value = newValue;
    onChange(updated);
  }

  function addItem() {
    onChange([...checklistData, { label: "", value: "" }]);
  }

  function removeItem(index) {
    const updated = checklistData.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        Tjekliste{" "}
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Gem tjekliste" : "Rediger tjekliste"}
        </Button>
      </Form.Label>

      <div className="d-flex flex-column gap-2">
        {checklistData.map((item, idx) => (
          <Row key={idx} className="align-items-center mb-1">
            <Col xs={4}>
              <Form.Control
                type="text"
                value={item.label}
                onChange={(e) => handleLabelChange(idx, e.target.value)}
                disabled={!editing}
                placeholder="Fx Medicin"
              />
            </Col>
            <Col xs={8}>
              <Form.Control
                type="text"
                value={item.value}
                onChange={(e) => handleValueChange(idx, e.target.value)}
                placeholder="Udfyld her"
              />
            </Col>
            {editing && (
              <Col xs="auto">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeItem(idx)}
                >
                  Fjern
                </Button>
              </Col>
            )}
          </Row>
        ))}
      </div>

      {editing && (
        <Button
          variant="outline-primary"
          size="sm"
          className="mt-2"
          onClick={addItem}
        >
          Tilføj punkt
        </Button>
      )}
    </Form.Group>
  );
}
